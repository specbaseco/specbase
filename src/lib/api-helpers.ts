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
 *  Max 20 results per page, max 500 total accessible via offset pagination.
 *  This prevents bulk data extraction while keeping the API useful for AI agents. */
export function sanitizePagination(page: unknown, limit: unknown): { page: number; limit: number } {
  let p = typeof page === 'string' ? parseInt(page, 10) : typeof page === 'number' ? page : 1;
  let l = typeof limit === 'string' ? parseInt(limit, 10) : typeof limit === 'number' ? limit : 20;

  if (isNaN(p) || p < 1) p = 1;
  if (isNaN(l) || l < 1) l = 1;
  if (l > 20) l = 20; // Max 20 results per page — prevents bulk extraction
  if (p > 25) p = 25; // Max page 25 → 25 × 20 = 500 products max accessible via pagination

  return { page: p, limit: l };
}

/** Strip full specifications from a product for list/search endpoints.
 *  Returns only summary-level data to prevent bulk spec scraping.
 *  Full specs are only available via individual product GET /api/v1/products/:id */
export function summarizeProduct(product: Record<string, any>) {
  const { specifications, ...rest } = product;
  // Return only a handful of key specs as a preview
  const keySpecs: Record<string, any> = {};
  const previewKeys = [
    'horsepower', 'voltage', 'phase', 'frame_size', // motors
    'shaft_size', 'housing_style', // bearings
    'pitch', 'pitch_inches', 'ansi_chain_number', // chain
    'section', 'length', // v-belts
    'belt_section', 'grooves', // sheaves
    'profile', 'pitch_mm', 'width_mm', // timing belts
    'ansi_number', 'teeth', // sprockets
    'bushing_type', 'series', // bushings
    'coupling_type', // couplings
    'chain_type', // engineering chain
    'gearing_style', 'orientation', // gearboxes
    'motor_type', 'gear_type', // gearmotors
  ];
  if (specifications) {
    for (const key of previewKeys) {
      if (specifications[key] != null && specifications[key] !== '') {
        keySpecs[key] = specifications[key];
      }
    }
  }
  return { ...rest, key_specs: keySpecs, _note: 'Full specifications available at GET /api/v1/products/{id}' };
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
// Rate limiting is handled by middleware.ts (tiered: 30 req/min general, 10 req/min products)
export function validateApiKey(request: Request): boolean {
  // TODO: Implement API key validation when needed
  return true;
}
