import { NextRequest } from 'next/server';
import { getProductWithRelations } from '@/lib/data';
import { formatApiResponse, formatApiError, corsHeaders } from '@/lib/api-helpers';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = getProductWithRelations(params.id);

  if (!product) {
    return formatApiError('Product not found', 404);
  }

  return formatApiResponse(product);
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
