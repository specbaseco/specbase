import Link from 'next/link';
import { notFound } from 'next/navigation';
import SpecsTable from '@/components/SpecsTable';
import ManufacturerLogo from '@/components/ManufacturerLogo';
import { getProductWithRelations, products, manufacturers } from '@/lib/data';

interface Props {
  params: { id: string };
}

export default function ProductDetailPage({ params }: Props) {
  const product = getProductWithRelations(params.id);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter(p => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="bg-cream-100 dark:bg-navy-900 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-navy-800 border-b border-cream-300 dark:border-navy-700">
        <div className="container-wide py-3">
          <div className="flex items-center gap-2 text-sm text-navy-500 dark:text-cream-400">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/search?category=${product.category?.slug}`} className="hover:text-accent transition-colors">
              {product.category?.name}
            </Link>
            <span>/</span>
            <span className="text-navy-800 dark:text-cream-200 font-medium truncate">{product.model_number}</span>
          </div>
        </div>
      </div>

      <div className="container-wide py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product header */}
            <div className="card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-accent uppercase tracking-wider">
                    {product.manufacturer?.name}
                  </p>
                  <h1 className="text-2xl font-bold text-navy-800 dark:text-cream-200 mt-1">
                    {product.name}
                  </h1>
                  <p className="text-sm font-mono text-navy-500 dark:text-cream-400 mt-1">
                    Model: {product.model_number}
                  </p>
                </div>
                {product.is_featured && (
                  <span className="text-xs font-medium bg-accent/10 text-accent px-3 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>

              {/* Product visual — manufacturer logo or product image */}
              <div className="w-full h-48 bg-white dark:bg-navy-800 rounded-xl mt-6 flex items-center justify-center border border-cream-300 dark:border-navy-700">
                {product.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-contain rounded-xl p-4"
                  />
                ) : (
                  <div className="scale-[2.5]">
                    <ManufacturerLogo manufacturerId={product.manufacturer_id} />
                  </div>
                )}
              </div>

              <p className="text-navy-600 dark:text-cream-400 mt-6 leading-relaxed">
                {product.description}
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                <button className="btn-primary">
                  Request Quote
                </button>
                {product.datasheet_url ? (
                  <a
                    href={product.datasheet_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Datasheet
                  </a>
                ) : (
                  <span className="btn-secondary opacity-50 cursor-not-allowed inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Datasheet Unavailable
                  </span>
                )}
                <Link
                  href={`/search?category=${product.category?.slug}`}
                  className="btn-secondary"
                >
                  Compare Similar
                </Link>
              </div>
            </div>

            {/* Specifications */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-navy-800 dark:text-cream-200 mb-4">Technical Specifications</h2>
              <SpecsTable specifications={product.specifications} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Manufacturer card */}
            <div className="card p-6">
              <h3 className="text-xs font-semibold text-navy-500 dark:text-cream-400 uppercase tracking-wider mb-4">Manufacturer</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white dark:bg-navy-800 rounded-lg border border-cream-300 dark:border-navy-700 flex items-center justify-center flex-shrink-0">
                  <ManufacturerLogo manufacturerId={product.manufacturer_id} />
                </div>
                <div>
                  <p className="font-semibold text-navy-800 dark:text-cream-200">{product.manufacturer?.name}</p>
                  {product.manufacturer?.partnership_status === 'active' && (
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">Verified Partner</p>
                  )}
                </div>
              </div>
              <p className="text-sm text-navy-500 dark:text-cream-400 leading-relaxed">
                {product.manufacturer?.description}
              </p>
              {product.manufacturer?.website && (
                <a
                  href={product.manufacturer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover mt-3 transition-colors"
                >
                  Visit Website
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>

            {/* API Access */}
            <div className="card p-6">
              <h3 className="text-xs font-semibold text-navy-500 dark:text-cream-400 uppercase tracking-wider mb-4">API Access</h3>
              <p className="text-sm text-navy-500 dark:text-cream-400 mb-3">
                Access this product data programmatically
              </p>
              <code className="block text-xs bg-navy-800 text-cream-300 p-3 rounded-lg overflow-x-auto">
                GET /api/v1/products/{product.id}
              </code>
              <Link href="/api-docs" className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover mt-3 transition-colors">
                View API Docs &rarr;
              </Link>
            </div>

            {/* Related products */}
            {relatedProducts.length > 0 && (
              <div className="card p-6">
                <h3 className="text-xs font-semibold text-navy-500 dark:text-cream-400 uppercase tracking-wider mb-4">Related Products</h3>
                <div className="space-y-3">
                  {relatedProducts.map(rp => (
                    <Link
                      key={rp.id}
                      href={`/products/${rp.id}`}
                      className="block p-3 rounded-lg hover:bg-cream-200 dark:hover:bg-navy-700 transition-colors"
                    >
                      <p className="text-sm font-medium text-navy-800 dark:text-cream-200">{rp.name}</p>
                      <p className="text-xs text-navy-500 dark:text-cream-400 font-mono mt-0.5">{rp.model_number}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
