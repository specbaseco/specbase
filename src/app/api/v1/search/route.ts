import { NextRequest } from 'next/server';
import { searchProducts, manufacturers, categories, products } from '@/lib/data';
import { formatApiResponse, formatApiError, sanitizePagination, corsHeaders, summarizeProduct } from '@/lib/api-helpers';

// Spec filter definitions per category — which spec keys support filtering
const CATEGORY_SPEC_FILTERS: Record<string, string[]> = {
  motors: ['motor_type', 'horsepower', 'kilowatts', 'voltage', 'frequency', 'phase', 'rpm_full_load', 'frame_size', 'enclosure_type', 'efficiency_class', 'mounting', 'ip_rating'],
  bearings: ['shaft_size', 'housing_style', 'internals', 'locking_type', 'lubrication', 'dynamic_load_lbf'],
  'roller-chain': ['pitch', 'pitch_inches', 'ansi_chain_number', 'number_of_strands', 'material', 'chain_type'],
  'v-belts': ['section', 'length', 'length_type', 'strands', 'top_width', 'construction'],
  sheaves: ['belt_section', 'grooves', 'bushing_type', 'pitch_diameter', 'material'],
  'timing-belts': ['profile', 'pitch_mm', 'width_mm', 'length_mm', 'teeth', 'construction', 'sided'],
  sprockets: ['ansi_number', 'teeth', 'hub_style', 'bore_type', 'material', 'hardened_teeth'],
  bushings: ['bushing_type', 'series', 'max_bore', 'bore_type', 'outer_diameter', 'length'],
  couplings: ['coupling_type', 'series_size', 'max_bore', 'material', 'nominal_torque', 'max_rpm'],
  'engineering-chain': ['pitch', 'series', 'chain_type', 'avg_tensile', 'pin_style', 'attachment'],
  gearboxes: ['gearing_style', 'orientation', 'max_input_hp', 'output_torque', 'ratio_range', 'efficiency_percentage'],
  gearmotors: ['motor_type', 'gear_type', 'output_speed', 'output_torque', 'ratio', 'voltage', 'phase'],
};

// AI-optimized search endpoint
// Accepts structured queries for programmatic product selection
//
// Example request body:
// {
//   "category": "motors",
//   "specs": { "horsepower": "5", "voltage": "460", "enclosure_type": "TEFC" },
//   "manufacturer": "ABB",
//   "query": "premium efficiency",
//   "page": 1,
//   "limit": 10
// }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, category, manufacturer, specs } = body;
    const { page, limit } = sanitizePagination(body.page, body.limit);

    let results = searchProducts(typeof query === 'string' ? query : '');

    // Apply category filter
    if (typeof category === 'string') {
      const cat = categories.find(c => c.slug === category);
      if (cat) results = results.filter(p => p.category_id === cat.id);
    }

    // Apply manufacturer filter
    if (typeof manufacturer === 'string') {
      const mfr = manufacturers.find(m => m.slug === manufacturer || m.name.toLowerCase() === manufacturer.toLowerCase());
      if (mfr) results = results.filter(p => p.manufacturer_id === mfr.id);
    }

    // Apply specs filters — fully wired for all categories
    if (specs && typeof specs === 'object') {
      for (const [specKey, specValue] of Object.entries(specs)) {
        if (specValue == null || specValue === '') continue;
        const sv = String(specValue).toLowerCase().trim();

        // Handle _min/_max range filters (e.g. horsepower_min, horsepower_max)
        const minMatch = specKey.match(/^(.+)_min$/);
        const maxMatch = specKey.match(/^(.+)_max$/);

        if (minMatch) {
          const baseKey = minMatch[1];
          const minVal = parseFloat(sv);
          if (!isNaN(minVal)) {
            results = results.filter(p => {
              const pVal = parseFloat(String(p.specifications[baseKey] || ''));
              return !isNaN(pVal) && pVal >= minVal;
            });
          }
        } else if (maxMatch) {
          const baseKey = maxMatch[1];
          const maxVal = parseFloat(sv);
          if (!isNaN(maxVal)) {
            results = results.filter(p => {
              const pVal = parseFloat(String(p.specifications[baseKey] || ''));
              return !isNaN(pVal) && pVal <= maxVal;
            });
          }
        } else {
          // Exact / partial match
          results = results.filter(p => {
            const pSpecVal = p.specifications[specKey];
            if (pSpecVal == null || pSpecVal === '') return false;
            const psv = String(pSpecVal).toLowerCase().trim();
            // Exact match or substring match (handles "460" matching "230/460")
            return psv === sv || psv.includes(sv) || sv.includes(psv);
          });
        }
      }
    }

    const total = results.length;
    const start = (page - 1) * limit;
    const paged = results.slice(start, start + limit).map(p => summarizeProduct(p));

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

    // Determine available spec filters for the selected category
    const availableSpecFilters = typeof category === 'string'
      ? (CATEGORY_SPEC_FILTERS[category] || [])
      : [];

    return formatApiResponse(
      {
        products: paged,
        facets: {
          categories: categoryFacets,
          manufacturers: manufacturerFacets,
        },
        available_spec_filters: availableSpecFilters,
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

  const { page, limit } = sanitizePagination(searchParams.get('page'), searchParams.get('limit'));
  const results = searchProducts(q);
  const total = results.length;
  const start = (page - 1) * limit;
  const paged = results.slice(start, start + limit).map(p => summarizeProduct(p));

  return formatApiResponse(
    { products: paged, total },
    { total, page, limit }
  );
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
