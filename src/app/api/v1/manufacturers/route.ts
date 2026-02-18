import { NextRequest } from 'next/server';
import { manufacturers, categoryManufacturers, products } from '@/lib/data';
import { formatApiResponse, corsHeaders } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  let results = manufacturers;

  if (category) {
    const catMfrs = categoryManufacturers[category] || [];
    results = results.filter(m => catMfrs.includes(m.id));
  }

  const withCounts = results.map(m => ({
    ...m,
    product_count: products.filter(p => p.manufacturer_id === m.id).length,
  }));

  return formatApiResponse(withCounts);
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
