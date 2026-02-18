import Link from 'next/link';

const endpoints = [
  {
    method: 'GET',
    path: '/api/v1/products',
    desc: 'List and filter products',
    params: 'category, manufacturer, q, page, limit, sort',
    example: {
      request: 'GET /api/v1/products?category=motors&manufacturer=abb&limit=10',
      response: `{
  "success": true,
  "data": [
    {
      "id": "prod-abb-m3bp-315",
      "model_number": "M3BP 315 SMC 4",
      "name": "ABB M3BP 315 Process Performance Motor",
      "specifications": {
        "horsepower": 250,
        "voltage": "460V",
        "efficiency_class": "IE3"
      },
      "manufacturer": { "name": "ABB", "slug": "abb" }
    }
  ],
  "meta": { "total": 2, "page": 1, "limit": 10 }
}`,
    },
  },
  {
    method: 'GET',
    path: '/api/v1/products/:id',
    desc: 'Get a single product with full specifications',
    params: 'id (path parameter)',
    example: {
      request: 'GET /api/v1/products/prod-abb-m3bp-315',
      response: `{
  "success": true,
  "data": {
    "id": "prod-abb-m3bp-315",
    "model_number": "M3BP 315 SMC 4",
    "name": "ABB M3BP 315 Process Performance Motor",
    "specifications": { ... },
    "manufacturer": { ... },
    "category": { ... }
  }
}`,
    },
  },
  {
    method: 'POST',
    path: '/api/v1/search',
    desc: 'AI-optimized structured search',
    params: 'JSON body: query, category, manufacturer, specs, page, limit',
    example: {
      request: `POST /api/v1/search
Content-Type: application/json

{
  "category": "motors",
  "specs": {
    "horsepower_min": 20,
    "horsepower_max": 100,
    "voltage": "460V",
    "enclosure_type": "TEFC"
  },
  "manufacturer": "siemens"
}`,
      response: `{
  "success": true,
  "data": {
    "products": [ ... ],
    "facets": {
      "categories": [{"name": "Motors", "count": 2}],
      "manufacturers": [{"name": "Siemens", "count": 2}]
    },
    "available_spec_filters": [
      "motor_type", "horsepower", "voltage", ...
    ]
  },
  "meta": { "total": 2 }
}`,
    },
  },
  {
    method: 'GET',
    path: '/api/v1/categories',
    desc: 'List all product categories with product counts',
    params: 'None',
    example: {
      request: 'GET /api/v1/categories',
      response: `{
  "success": true,
  "data": [
    { "id": "cat-motors", "name": "Motors", "slug": "motors", "product_count": 8 },
    { "id": "cat-gearboxes", "name": "Gearboxes", "slug": "gearboxes", "product_count": 0 }
  ]
}`,
    },
  },
  {
    method: 'GET',
    path: '/api/v1/manufacturers',
    desc: 'List manufacturers, optionally filtered by category',
    params: 'category (optional)',
    example: {
      request: 'GET /api/v1/manufacturers?category=cat-motors',
      response: `{
  "success": true,
  "data": [
    { "id": "mfr-abb", "name": "ABB", "slug": "abb", "product_count": 2 },
    { "id": "mfr-siemens", "name": "Siemens", "slug": "siemens", "product_count": 2 }
  ]
}`,
    },
  },
  {
    method: 'POST',
    path: '/api/v1/compare',
    desc: 'Compare multiple products side by side',
    params: 'JSON body: product_ids (array of 2-5 product IDs)',
    example: {
      request: `POST /api/v1/compare
Content-Type: application/json

{
  "product_ids": [
    "prod-abb-m3bp-315",
    "prod-siemens-1le1"
  ]
}`,
      response: `{
  "success": true,
  "data": {
    "products": [ ... ],
    "comparison_fields": [
      "motor_type", "horsepower", "voltage", ...
    ]
  }
}`,
    },
  },
];

export default function ApiDocsPage() {
  const methodColors: Record<string, string> = {
    GET: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    POST: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    PUT: 'bg-yellow-100 text-yellow-700',
    DELETE: 'bg-red-100 text-red-700',
  };

  return (
    <div className="bg-cream-100 dark:bg-navy-900 min-h-screen">
      {/* Header */}
      <section className="bg-navy-800 text-white">
        <div className="container-narrow py-12 md:py-16">
          <div className="inline-flex items-center gap-2 bg-navy-700/50 border border-navy-600 text-cream-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            API Reference
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">API Documentation</h1>
          <p className="text-cream-400 mt-3 max-w-xl">
            RESTful API for programmatic access to the SpecBase product database.
            Built for AI agents, integrations, and automation.
          </p>
        </div>
      </section>

      <div className="container-wide py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar nav */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-6">
              <div>
                <h4 className="text-xs font-semibold text-navy-500 dark:text-cream-400 uppercase tracking-wider mb-3">Getting Started</h4>
                <ul className="space-y-1.5">
                  <li><a href="#authentication" className="text-sm text-navy-600 dark:text-cream-400 hover:text-accent transition-colors">Authentication</a></li>
                  <li><a href="#base-url" className="text-sm text-navy-600 dark:text-cream-400 hover:text-accent transition-colors">Base URL</a></li>
                  <li><a href="#rate-limits" className="text-sm text-navy-600 dark:text-cream-400 hover:text-accent transition-colors">Rate Limits</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-navy-500 dark:text-cream-400 uppercase tracking-wider mb-3">Endpoints</h4>
                <ul className="space-y-1.5">
                  {endpoints.map((ep, i) => (
                    <li key={i}>
                      <a href={`#endpoint-${i}`} className="text-sm text-navy-600 dark:text-cream-400 hover:text-accent transition-colors flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${methodColors[ep.method]}`}>
                          {ep.method}
                        </span>
                        <span className="truncate">{ep.path}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Authentication */}
            <section id="authentication" className="card p-6">
              <h2 className="text-lg font-semibold text-navy-800 dark:text-cream-200">Authentication</h2>
              <p className="text-sm text-navy-500 dark:text-cream-400 mt-2 leading-relaxed">
                Include your API key in the request headers. API keys are free for basic read access.
              </p>
              <div className="bg-navy-800 rounded-lg p-4 mt-4 overflow-x-auto">
                <code className="text-sm text-cream-300">
                  X-API-Key: your-api-key-here
                </code>
              </div>
              <p className="text-sm text-navy-500 dark:text-cream-400 mt-3">
                During the beta period, API requests work without authentication for read-only endpoints.
              </p>
            </section>

            {/* Base URL */}
            <section id="base-url" className="card p-6">
              <h2 className="text-lg font-semibold text-navy-800 dark:text-cream-200">Base URL</h2>
              <div className="bg-navy-800 rounded-lg p-4 mt-3 overflow-x-auto">
                <code className="text-sm text-cream-300">https://api.specbase.co/api/v1</code>
              </div>
              <p className="text-sm text-navy-500 dark:text-cream-400 mt-3">
                All responses are JSON. Successful responses include <code className="bg-cream-200 dark:bg-navy-700 px-1.5 py-0.5 rounded text-xs">success: true</code> with
                data in the <code className="bg-cream-200 dark:bg-navy-700 px-1.5 py-0.5 rounded text-xs">data</code> field.
              </p>
            </section>

            {/* Rate Limits */}
            <section id="rate-limits" className="card p-6">
              <h2 className="text-lg font-semibold text-navy-800 dark:text-cream-200">Rate Limits</h2>
              <div className="overflow-hidden rounded-lg border border-cream-300 dark:border-navy-700 mt-4">
                <table className="w-full text-sm">
                  <thead className="bg-cream-200 dark:bg-navy-800">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium text-navy-700 dark:text-cream-300">Tier</th>
                      <th className="text-left px-4 py-2 font-medium text-navy-700 dark:text-cream-300">Requests/min</th>
                      <th className="text-left px-4 py-2 font-medium text-navy-700 dark:text-cream-300">Daily Limit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-cream-300 dark:border-navy-700">
                      <td className="px-4 py-2 text-navy-800 dark:text-cream-200">Free</td>
                      <td className="px-4 py-2 text-navy-600 dark:text-cream-400">30</td>
                      <td className="px-4 py-2 text-navy-600 dark:text-cream-400">1,000</td>
                    </tr>
                    <tr className="border-t border-cream-300 dark:border-navy-700 bg-cream-100 dark:bg-navy-900">
                      <td className="px-4 py-2 text-navy-800 dark:text-cream-200">Pro</td>
                      <td className="px-4 py-2 text-navy-600 dark:text-cream-400">120</td>
                      <td className="px-4 py-2 text-navy-600 dark:text-cream-400">50,000</td>
                    </tr>
                    <tr className="border-t border-cream-300 dark:border-navy-700">
                      <td className="px-4 py-2 text-navy-800 dark:text-cream-200">Enterprise</td>
                      <td className="px-4 py-2 text-navy-600 dark:text-cream-400">Unlimited</td>
                      <td className="px-4 py-2 text-navy-600 dark:text-cream-400">Unlimited</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Endpoints */}
            <h2 className="text-xl font-bold text-navy-800 dark:text-cream-200 pt-4">Endpoints</h2>
            {endpoints.map((ep, i) => (
              <section key={i} id={`endpoint-${i}`} className="card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${methodColors[ep.method]}`}>
                    {ep.method}
                  </span>
                  <code className="text-sm font-mono text-navy-800 dark:text-cream-200">{ep.path}</code>
                </div>
                <p className="text-sm text-navy-600 dark:text-cream-400">{ep.desc}</p>
                <p className="text-xs text-navy-500 dark:text-cream-400 mt-2">
                  <span className="font-medium">Parameters:</span> {ep.params}
                </p>

                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-navy-500 dark:text-cream-400 mb-1">Request</p>
                    <div className="bg-navy-800 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-xs text-cream-300 whitespace-pre">{ep.example.request}</pre>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-navy-500 dark:text-cream-400 mb-1">Response</p>
                    <div className="bg-navy-800 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-xs text-cream-300 whitespace-pre">{ep.example.response}</pre>
                    </div>
                  </div>
                </div>
              </section>
            ))}

            {/* Get API Key CTA */}
            <div className="card p-8 text-center bg-cream-200 dark:bg-navy-800">
              <h3 className="text-lg font-semibold text-navy-800 dark:text-cream-200">Ready to integrate?</h3>
              <p className="text-sm text-navy-500 dark:text-cream-400 mt-2">
                Get your free API key and start querying the SpecBase database.
              </p>
              <a href="mailto:api@specbase.co" className="btn-primary mt-4 inline-block">
                Request API Key
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
