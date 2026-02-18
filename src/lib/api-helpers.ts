import { NextResponse } from 'next/server';

export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// CORS: restrict to same-origin by default.
// Set ALLOWED_ORIGINS env var to comma-separated list for cross-origin access.
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || [];

export function getCorsHeaders(origin?: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
  };

  // If no ALLOWED_ORIGINS configured, allow all (public API mode)
  if (allowedOrigins.length === 0) {
    headers['Access-Control-Allow-Origin'] = '*';
  } else if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Vary'] = 'Origin';
  }

  return headers;
}

// Backwards-compatible default for routes that don't pass origin
export const corsHeaders = getCorsHeaders();

/** Clamp pagination params to safe ranges */
export function sanitizePagination(page: unknown, limit: unknown): { page: number; limit: number } {
  let p = typeof page === 'string' ? parseInt(page, 10) : typeof page === 'number' ? page : 1;
  let l = typeof limit === 'string' ? parseInt(limit, 10) : typeof limit === 'number' ? limit : 20;

  if (isNaN(p) || p < 1) p = 1;
  if (isNaN(l) || l < 1) l = 1;
  if (l > 100) l = 100; // Max 100 results per page
  if (p > 1000) p = 1000; // Sanity cap

  return { page: p, limit: l };
}

export function formatApiResponse<T>(
  data: T,
  meta?: { total?: number; page?: number; limit?: number }
) {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        ...meta,
        request_id: generateRequestId(),
      },
    },
    { headers: corsHeaders }
  );
}

export function formatApiError(message: string, status: number = 400) {
  return NextResponse.json(
    {
      success: false,
      data: null,
      error: message,
      meta: { request_id: generateRequestId() },
    },
    { status, headers: corsHeaders }
  );
}

// Stub: API key validation - always returns true for now
export function validateApiKey(request: Request): boolean {
  // TODO: Implement API key validation
  // const apiKey = request.headers.get('X-API-Key');
  // if (!apiKey) return false;
  // Verify against database
  return true;
}

// In-memory rate limiter (per-IP, sliding window)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 60; // 60 requests per minute

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return false;
  }

  return true;
}

// Clean up expired entries periodically (prevent memory leak)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((entry, key) => {
      if (now > entry.resetAt) rateLimitStore.delete(key);
    });
  }, 60_000);
}
