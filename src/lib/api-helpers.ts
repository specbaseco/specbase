import { NextResponse } from 'next/server';

export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
};

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

// Stub: Rate limiting
export function checkRateLimit(apiKeyId: string): boolean {
  // TODO: Implement rate limiting with sliding window
  return true;
}
