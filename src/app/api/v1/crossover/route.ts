import { NextRequest } from 'next/server';
import { findProductByModelNumber, findCrossoverProducts, manufacturers } from '@/lib/data';
import { formatApiResponse, formatApiError, corsHeaders } from '@/lib/api-helpers';

// POST /api/v1/crossover
// Find equivalent products from other manufacturers by model number.
//
// Example request body:
// {
//   "model_number": "EM3615T",
//   "limit": 10
// }
//
// Returns the source product and matching alternatives sorted by match score.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { model_number } = body;

    if (!model_number || typeof model_number !== 'string') {
      return formatApiError(
        'model_number is required. Provide the model/part number of the product to find crossovers for.',
        400
      );
    }

    // Find the source product
    const source = findProductByModelNumber(model_number.trim());
    if (!source) {
      return formatApiError(
        `No product found matching model number "${model_number}". Try a partial model number or use the search endpoint first.`,
        404
      );
    }

    // Find crossover matches
    const matches = findCrossoverProducts(source.id);
    const maxResults = Math.min(parseInt(String(body.limit)) || 20, 20); // Cap at 20

    // Strip internal fields from source manufacturer
    const safeSource = (() => {
      const { manufacturer, ...rest } = source;
      if (manufacturer) {
        const { partnership_status, featured, ...safeMfr } = manufacturer;
        return { ...rest, manufacturer: safeMfr };
      }
      return rest;
    })();

    // Return full product data with specs (strip only internal business fields)
    const crossoverResults = matches.slice(0, maxResults).map(m => {
      const { product, ...matchMeta } = m;
      const { manufacturer: mfr, ...productRest } = product;
      const safeMfr = mfr ? (() => {
        const { partnership_status, featured, ...rest } = mfr;
        return rest;
      })() : undefined;
      return {
        ...matchMeta,
        product: { ...productRest, manufacturer: safeMfr },
      };
    });

    return formatApiResponse({
      source: safeSource,
      crossovers: crossoverResults,
      total_matches: matches.length,
    });
  } catch {
    return formatApiError('Invalid request body. Expected JSON with field: model_number', 400);
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
