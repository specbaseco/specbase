import { NextRequest } from 'next/server';
import { getProductWithRelations } from '@/lib/data';
import { formatApiResponse, formatApiError, corsHeaders } from '@/lib/api-helpers';

// Compare products side by side
// Example request: { "product_ids": ["prod-abb-m3bp-315", "prod-siemens-1le1"] }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_ids } = body;

    if (!product_ids || !Array.isArray(product_ids) || product_ids.length < 2) {
      return formatApiError('Provide at least 2 product_ids to compare', 400);
    }

    if (product_ids.length > 5) {
      return formatApiError('Maximum 5 products can be compared at once', 400);
    }

    const foundProducts = product_ids
      .map((id: string) => getProductWithRelations(id))
      .filter(Boolean);

    if (foundProducts.length < 2) {
      return formatApiError('At least 2 valid products required for comparison', 404);
    }

    // Collect all specification keys across products
    const allSpecKeys = new Set<string>();
    foundProducts.forEach(p => {
      if (p) Object.keys(p.specifications).forEach(k => allSpecKeys.add(k));
    });

    const comparisonFields = Array.from(allSpecKeys).sort();

    return formatApiResponse({
      products: foundProducts,
      comparison_fields: comparisonFields,
    });
  } catch {
    return formatApiError('Invalid request body', 400);
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
