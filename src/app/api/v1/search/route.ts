import { NextRequest } from 'next/server';
import { searchProducts, manufacturers, categories, products } from '@/lib/data';
import { formatApiResponse, formatApiError, corsHeaders } from '@/lib/api-helpers';

// AI-optimized search endpoint
// Accepts structured queries for programmatic product selection
//
// Example request body:
// {
//   "category": "motors",
//   "specs": { "horsepower_min": 5, "horsepower_max": 50, "voltage": "460V" },
//   "manufacturer": "ABB",
//   "query": "premium efficiency",
//   "page": 1,
//   "limit": 10
// }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, category, manufacturer, specs, page = 1, limit = 20 } = body;

    let results = searchProducts(query || '');

    // Apply additional API filters
    if (category) {
      const cat = categories.find(c => c.slug === category);
      if (cat) results = results.filter(p => p.category_id === cat.id);
    }
    if (manufacturer) {
      const mfr = manufacturers.find(m => m.slug === manufacturer || m.name.toLowerCase() === manufacturer.toLowerCase());
      if (mfr) results = results.filter(p => p.manufacturer_id === mfr.id);
    }

    const total = results.length;
    const start = (page - 1) * limit;
    const paged = results.slice(start, start + limit);

    // Build facets for AI context
    const categoryFacets = categories.map(c => ({
      name: c.name,
      slug: c.slug,
      count: results.filter(p => p.category_id === c.id).length,
    })).filter(f => f.count > 0);

    const manufacturerFacets = manufacturers.map(m => ({
      name: m.name,
      slug: m.slug,
      count: results.filter(p => p.manufacturer_id === m.id).length,
    })).filter(f => f.count > 0);

    return formatApiResponse(
      {
        products: paged,
        facets: {
          categories: categoryFacets,
          manufacturers: manufacturerFacets,
        },
        available_spec_filters: category === 'motors' ? [
          'motor_type', 'horsepower', 'kilowatts', 'voltage', 'frequency_hz',
          'phase', 'rpm_full_load', 'frame_size', 'enclosure_type',
          'efficiency_class', 'mounting', 'ip_rating'
        ] : [],
      },
      { total, page, limit }
    );
  } catch {
    return formatApiError('Invalid request body. Expected JSON with optional fields: query, category, manufacturer, specs, page, limit', 400);
  }
}

// Also support GET for simple queries
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  if (!q) {
    return formatApiError('Query parameter "q" is required for GET requests. Use POST for structured queries.', 400);
  }

  const results = searchProducts(q);

  return formatApiResponse(
    { products: results, total: results.length },
    { total: results.length, page: 1, limit: results.length }
  );
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
