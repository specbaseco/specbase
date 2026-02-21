import { NextRequest } from 'next/server';
import { categories, manufacturers, products } from '@/lib/data';

const SPEC = {
  openapi: '3.1.0',
  info: {
    title: 'SpecBase API',
    version: '1.0.0',
    description: `SpecBase is a structured product registry for industrial power transmission components. It provides searchable, spec-level data for ${products.length.toLocaleString()}+ products across ${categories.length} categories from ${manufacturers.filter((m, i, a) => a.findIndex(x => x.name === m.name) === i).length} manufacturers. Designed for AI agents and procurement tools.`,
    contact: { email: 'partners@specbase.co' },
    'x-logo': { url: '/logo.png' },
  },
  servers: [
    { url: 'https://specbase.co', description: 'Production' },
  ],
  paths: {
    '/api/v1/categories': {
      get: {
        operationId: 'listCategories',
        summary: 'List all product categories with counts',
        tags: ['Discovery'],
        responses: {
          '200': {
            description: 'Category list',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoriesResponse' } } },
          },
        },
      },
    },
    '/api/v1/manufacturers': {
      get: {
        operationId: 'listManufacturers',
        summary: 'List all manufacturers with product counts',
        tags: ['Discovery'],
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Filter by category slug' },
        ],
        responses: {
          '200': {
            description: 'Manufacturer list',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ManufacturersResponse' } } },
          },
        },
      },
    },
    '/api/v1/products': {
      get: {
        operationId: 'listProducts',
        summary: 'List products with filters (at least one filter required)',
        tags: ['Products'],
        parameters: [
          { name: 'category', in: 'query', required: false, schema: { type: 'string' }, description: 'Category slug (e.g. "motors", "bearings")' },
          { name: 'manufacturer', in: 'query', required: false, schema: { type: 'string' }, description: 'Manufacturer slug or name' },
          { name: 'q', in: 'query', required: false, schema: { type: 'string' }, description: 'Text search query' },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1, maximum: 25 }, description: 'Page number (max 25)' },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20, maximum: 20 }, description: 'Results per page (max 20)' },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['relevance', 'name', 'manufacturer', 'newest'] } },
        ],
        responses: {
          '200': { description: 'Product list (key specs only — full specs via individual product endpoint)' },
          '400': { description: 'At least one filter is required' },
          '429': { description: 'Rate limit exceeded (10 req/min for product endpoints)' },
        },
      },
    },
    '/api/v1/products/{id}': {
      get: {
        operationId: 'getProduct',
        summary: 'Get full product details including all specifications',
        tags: ['Products'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Product ID' },
        ],
        responses: {
          '200': { description: 'Full product with all specifications' },
          '404': { description: 'Product not found' },
        },
      },
    },
    '/api/v1/search': {
      post: {
        operationId: 'searchProducts',
        summary: 'AI-optimized structured search with spec filtering and facets',
        tags: ['Search'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  query: { type: 'string', description: 'Natural language search query' },
                  category: { type: 'string', description: 'Category slug to filter by' },
                  manufacturer: { type: 'string', description: 'Manufacturer slug or name' },
                  specs: {
                    type: 'object',
                    description: 'Specification filters. Use exact values or _min/_max suffixes for ranges. Example: {"horsepower": "5", "voltage": "460", "horsepower_min": "1", "horsepower_max": "10"}',
                    additionalProperties: { type: 'string' },
                  },
                  page: { type: 'integer', default: 1, maximum: 25 },
                  limit: { type: 'integer', default: 20, maximum: 20 },
                },
              },
              examples: {
                motorSearch: {
                  summary: 'Search 5HP TEFC motors',
                  value: {
                    category: 'motors',
                    specs: { horsepower: '5', enclosure_type: 'TEFC', voltage: '460' },
                    page: 1,
                    limit: 10,
                  },
                },
                bearingSearch: {
                  summary: 'Search 1-inch shaft bearings',
                  value: {
                    category: 'bearings',
                    specs: { shaft_size: '1' },
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Search results with facets and available spec filters' },
          '429': { description: 'Rate limit exceeded' },
        },
      },
      get: {
        operationId: 'simpleSearch',
        summary: 'Simple text search',
        tags: ['Search'],
        parameters: [
          { name: 'q', in: 'query', required: true, schema: { type: 'string' }, description: 'Search query' },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20, maximum: 20 } },
        ],
        responses: { '200': { description: 'Search results' } },
      },
    },
    '/api/v1/crossover': {
      post: {
        operationId: 'findCrossover',
        summary: 'Find equivalent products from other manufacturers',
        tags: ['Crossover'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['model_number'],
                properties: {
                  model_number: { type: 'string', description: 'The model/part number to find alternatives for' },
                  limit: { type: 'integer', default: 20, maximum: 20, description: 'Max results to return' },
                },
              },
              examples: {
                motorCrossover: {
                  summary: 'Find alternatives for a Baldor motor',
                  value: { model_number: 'EM3615T' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Source product and matching crossover alternatives with match scores' },
          '404': { description: 'Source product not found' },
        },
      },
    },
    '/api/v1/compare': {
      post: {
        operationId: 'compareProducts',
        summary: 'Compare 2-5 products side by side',
        tags: ['Comparison'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['product_ids'],
                properties: {
                  product_ids: {
                    type: 'array',
                    items: { type: 'string' },
                    minItems: 2,
                    maxItems: 5,
                    description: 'Array of product IDs to compare',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Side-by-side comparison with all specification fields' },
          '400': { description: 'Invalid product IDs' },
        },
      },
    },
  },
  components: {
    schemas: {
      CategoriesResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                slug: { type: 'string' },
                description: { type: 'string' },
                product_count: { type: 'integer' },
              },
            },
          },
        },
      },
      ManufacturersResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                slug: { type: 'string' },
                website: { type: 'string' },
                description: { type: 'string' },
                product_count: { type: 'integer' },
              },
            },
          },
        },
      },
    },
  },
  'x-rate-limits': {
    general: '30 requests per minute',
    products: '10 requests per minute (products, search, compare, crossover)',
  },
};

export async function GET(request: NextRequest) {
  return new Response(JSON.stringify(SPEC, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  });
}
