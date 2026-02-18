import { NextRequest } from 'next/server';
import { products, manufacturers, categories } from '@/lib/data';
import { formatApiResponse, formatApiError, corsHeaders } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const manufacturer = searchParams.get('manufacturer');
  const q = searchParams.get('q');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const sort = searchParams.get('sort') || 'relevance';

  let results = products.map(p => ({
    ...p,
    manufacturer: manufacturers.find(m => m.id === p.manufacturer_id),
    category: categories.find(c => c.id === p.category_id),
  }));

  if (category) {
    results = results.filter(p => p.category?.slug === category || p.category_id === category);
  }

  if (manufacturer) {
    results = results.filter(p =>
      p.manufacturer?.slug === manufacturer ||
      p.manufacturer?.name.toLowerCase().includes(manufacturer.toLowerCase())
    );
  }

  if (q) {
    const query = q.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.model_number.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.manufacturer?.name.toLowerCase().includes(query)
    );
  }

  if (sort === 'name') results.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === 'manufacturer') results.sort((a, b) => (a.manufacturer?.name || '').localeCompare(b.manufacturer?.name || ''));
  else if (sort === 'newest') results.sort((a, b) => b.created_at.localeCompare(a.created_at));

  const total = results.length;
  const start = (page - 1) * limit;
  const paged = results.slice(start, start + limit);

  return formatApiResponse(paged, { total, page, limit });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
