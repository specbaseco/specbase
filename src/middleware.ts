import { NextRequest, NextResponse } from 'next/server';

// ── Rate Limiting ──
// Two tiers: general API (30 req/min) and product list/search (10 req/min)
// The tighter product limit prevents enumeration/scraping of the database.

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_GENERAL = 30; // 30 req/min for general API calls
const RATE_LIMIT_PRODUCTS = 10; // 10 req/min for product list/search — anti-scraping

function checkRateLimit(key: string, max: number): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: max - 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
  }

  entry.count++;
  const remaining = Math.max(0, max - entry.count);

  if (entry.count > max) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining, resetAt: entry.resetAt };
}

// Clean up expired entries every 60s
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((entry, key) => {
      if (now > entry.resetAt) rateLimitStore.delete(key);
    });
  }, 60_000);
}

// Paths that touch product data — subject to tighter rate limiting
const PRODUCT_PATHS = ['/api/v1/products', '/api/v1/search', '/api/v1/compare', '/api/v1/crossover'];

function isProductPath(pathname: string): boolean {
  return PRODUCT_PATHS.some(p => pathname.startsWith(p));
}

export function middleware(request: NextRequest) {
  // Only rate-limit API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';

  const pathname = request.nextUrl.pathname;
  const isProduct = isProductPath(pathname);

  // Apply tiered rate limits
  const generalKey = `general:${ip}`;
  const generalLimit = checkRateLimit(generalKey, RATE_LIMIT_GENERAL);

  if (!generalLimit.allowed) {
    return rateLimitResponse(RATE_LIMIT_GENERAL, generalLimit.resetAt);
  }

  if (isProduct) {
    const productKey = `products:${ip}`;
    const productLimit = checkRateLimit(productKey, RATE_LIMIT_PRODUCTS);

    if (!productLimit.allowed) {
      return rateLimitResponse(RATE_LIMIT_PRODUCTS, productLimit.resetAt);
    }

    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_PRODUCTS));
    response.headers.set('X-RateLimit-Remaining', String(productLimit.remaining));
    response.headers.set('X-RateLimit-Reset', String(Math.ceil(productLimit.resetAt / 1000)));
    // Anti-cache headers to prevent intermediary caching of product data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    return response;
  }

  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_GENERAL));
  response.headers.set('X-RateLimit-Remaining', String(generalLimit.remaining));
  response.headers.set('X-RateLimit-Reset', String(Math.ceil(generalLimit.resetAt / 1000)));

  return response;
}

function rateLimitResponse(limit: number, resetAt: number) {
  return NextResponse.json(
    {
      success: false,
      data: null,
      error: `Rate limit exceeded. Maximum ${limit} requests per minute for this endpoint.`,
      meta: { request_id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}` },
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)),
        'X-RateLimit-Limit': String(limit),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(Math.ceil(resetAt / 1000)),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
      },
    }
  );
}

export const config = {
  matcher: '/api/:path*',
};
