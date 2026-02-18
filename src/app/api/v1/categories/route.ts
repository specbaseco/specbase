import { NextRequest } from 'next/server';
import { categories, products } from '@/lib/data';
import { formatApiResponse, corsHeaders } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    product_count: products.filter(p => p.category_id === cat.id).length,
  }));

  return formatApiResponse(categoriesWithCounts);
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
