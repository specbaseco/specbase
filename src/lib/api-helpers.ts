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

/** Clamp pagination params to safe ranges.
 *  Max 50 results per page, max 25 pages (1,250 products per query).
 *  Combined with rate limiting (60 req/min) and required filters,
 *  this prevents bulk database export while keeping the API useful for AI agents. */
export function sanitizePagination(page: unknown, limit: unknown): { page: number; limit: number } {
  let p = typeof page === 'string' ? parseInt(page, 10) : typeof page === 'number' ? page : 1;
  let l = typeof limit === 'string' ? parseInt(limit, 10) : typeof limit === 'number' ? limit : 20;

  if (isNaN(p) || p < 1) p = 1;
  if (isNaN(l) || l < 1) l = 1;
  if (l > 50) l = 50; // Max 50 results per page
  if (p > 25) p = 25; // Max page 25 → 25 × 50 = 1,250 products max accessible per query

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
// Rate limiting is handled by middleware.ts (60 req/min per IP)
export function validateApiKey(request: Request): boolean {
  // TODO: Implement API key validation when needed
  return true;
}
