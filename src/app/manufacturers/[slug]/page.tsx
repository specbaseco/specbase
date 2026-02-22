import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import ManufacturerLogo from '@/components/ManufacturerLogo';
import TierBadge from '@/components/TierBadge';
import { manufacturers, products, categories, getManufacturerTier } from '@/lib/data';

interface Props {
  params: { slug: string };
}

// Generate static paths for all manufacturers
export function generateStaticParams() {
  return manufacturers
    .filter(m => products.some(p => p.manufacturer_id === m.id))
    .map(m => ({ slug: m.slug }));
}

// Dynamic metadata
export function generateMetadata({ params }: Props): Metadata {
  const mfr = manufacturers.find(m => m.slug === params.slug);
  if (!mfr) return { title: 'Manufacturer Not Found' };
  const productCount = products.filter(p => p.manufacturer_id === mfr.id).length;
  return {
    title: `${mfr.name} — ${productCount} Products | SpecBase`,
    description: `${mfr.description} Browse ${productCount} products from ${mfr.name} in the SpecBase industrial component registry.`,
  };
}

export default function ManufacturerProfilePage({ params }: Props) {
  const mfr = manufacturers.find(m => m.slug === params.slug);
  if (!mfr) notFound();

  const tier = getManufacturerTier(mfr);
  const isVerifiedPlus = tier === 'verified' || tier === 'sponsored' || tier === 'enterprise';

  // Products from this manufacturer
  const mfrProducts = products.filter(p => p.manufacturer_id === mfr.id);

  // Category breakdown
  const categoryBreakdown = categories
    .map(cat => ({
      ...cat,
      count: mfrProducts.filter(p => p.category_id === cat.id).length,
    }))
    .filter(c => c.count > 0)
    .sort((a, b) => b.count - a.count);

  // Featured products (first 6)
  const featuredProducts = mfrProducts.slice(0, 6);

  return (
    <div className="bg-cream-100 dark:bg-navy-900 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-navy-800 border-b border-cream-300 dark:border-navy-700">
        <div className="container-wide py-3">
          <nav className="text-sm text-navy-500 dark:text-cream-400">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/manufacturers" className="hover:text-accent transition-colors">Manufacturers</Link>
            <span className="mx-2">/</span>
            <span className="text-navy-800 dark:text-cream-200 font-medium">{mfr.name}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <section className="bg-white dark:bg-navy-800 border-b border-cream-300 dark:border-navy-700">
        <div className="container-wide py-10">
          <div className="flex items-start gap-6">
            {/* Logo */}
            <div className="w-20 h-20 rounded-2xl bg-cream-100 dark:bg-navy-700 border border-cream-300 dark:border-navy-600 flex items-center justify-center flex-shrink-0">
              <ManufacturerLogo manufacturerId={mfr.id} className="w-16 h-16" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-cream-200">
                  {mfr.name}
                </h1>
                <TierBadge tier={tier} size="md" />
              </div>
              <p className="text-navy-500 dark:text-cream-400 mt-2 max-w-2xl leading-relaxed">
                {mfr.description}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <a
                  href={mfr.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {mfr.website.replace('https://', '').replace('http://', '')}
                </a>
                <span className="text-cream-400">|</span>
                <span className="text-sm text-navy-500 dark:text-cream-400">
                  {mfrProducts.length.toLocaleString()} products
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-wide py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Contact + Categories */}
          <div className="space-y-6">
            {/* Contact Information */}
            {isVerifiedPlus ? (
              <div className="card p-6">
                <h2 className="text-sm font-semibold text-navy-800 dark:text-cream-200 uppercase tracking-wider mb-4">
                  Contact Information
                </h2>
                <div className="space-y-3">
                  {mfr.contact_email && (
                    <div className="flex items-center gap-3 text-sm">
                      <svg className="w-4 h-4 text-cream-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a href={`mailto:${mfr.contact_email}`} className="text-accent hover:text-accent-hover transition-colors">
                        {mfr.contact_email}
                      </a>
                    </div>
                  )}
                  {mfr.contact_phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <svg className="w-4 h-4 text-cream-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href={`tel:${mfr.contact_phone}`} className="text-navy-800 dark:text-cream-200">
                        {mfr.contact_phone}
                      </a>
                    </div>
                  )}
                  {mfr.find_rep_url && (
                    <a
                      href={mfr.find_rep_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-accent hover:text-accent-hover transition-colors"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Find Your Rep
                    </a>
                  )}
                  {mfr.sales_directory_url && (
                    <a
                      href={mfr.sales_directory_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-accent hover:text-accent-hover transition-colors"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Sales Directory
                    </a>
                  )}
                  {/* If verified but no contact data filled in yet */}
                  {!mfr.contact_email && !mfr.contact_phone && !mfr.find_rep_url && !mfr.sales_directory_url && (
                    <p className="text-sm text-navy-500 dark:text-cream-400 italic">
                      Contact information coming soon.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* Free tier — grayed-out upgrade prompt */
              <div className="card p-6 bg-cream-50 dark:bg-navy-800/50 border-dashed">
                <h2 className="text-sm font-semibold text-navy-400 dark:text-cream-500 uppercase tracking-wider mb-3">
                  Contact Information
                </h2>
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-cream-300 dark:bg-navy-600" />
                      <div className="h-3 rounded bg-cream-300 dark:bg-navy-600 flex-1 max-w-[180px]" />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-navy-400 dark:text-cream-500 mt-4">
                  Contact info available for Verified partners.{' '}
                  <Link href="/manufacturers#tiers" className="text-accent hover:text-accent-hover transition-colors underline">
                    Learn more
                  </Link>
                </p>
              </div>
            )}

            {/* Product Categories */}
            <div className="card p-6">
              <h2 className="text-sm font-semibold text-navy-800 dark:text-cream-200 uppercase tracking-wider mb-4">
                Product Categories
              </h2>
              <div className="space-y-2">
                {categoryBreakdown.map(cat => (
                  <Link
                    key={cat.id}
                    href={`/search?category=${cat.slug}&manufacturer=${mfr.slug}`}
                    className="flex items-center justify-between p-2.5 -mx-2.5 rounded-lg hover:bg-cream-100 dark:hover:bg-navy-700 transition-colors group"
                  >
                    <span className="text-sm text-navy-800 dark:text-cream-200 group-hover:text-accent transition-colors">
                      {cat.name}
                    </span>
                    <span className="text-xs text-navy-500 dark:text-cream-400 bg-cream-200 dark:bg-navy-700 px-2 py-0.5 rounded-full">
                      {cat.count.toLocaleString()}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Featured Products + API */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured Products */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-navy-800 dark:text-cream-200 uppercase tracking-wider">
                  Featured Products
                </h2>
                <Link
                  href={`/search?manufacturer=${mfr.slug}`}
                  className="text-xs text-accent hover:text-accent-hover transition-colors"
                >
                  View all {mfrProducts.length.toLocaleString()} products &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {featuredProducts.map(product => {
                  const cat = categories.find(c => c.id === product.category_id);
                  const specEntries = Object.entries(product.specifications).slice(0, 4);
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="border border-cream-300 dark:border-navy-600 rounded-xl p-4 hover:border-accent/30 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="min-w-0">
                          <p className="text-xs text-accent font-medium">{cat?.name}</p>
                          <p className="text-sm font-semibold text-navy-800 dark:text-cream-200 mt-0.5 truncate group-hover:text-accent transition-colors">
                            {product.model_number}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-navy-500 dark:text-cream-400 line-clamp-2 mb-3">
                        {product.name}
                      </p>
                      <div className="space-y-1">
                        {specEntries.map(([key, val]) => (
                          <div key={key} className="flex justify-between text-xs">
                            <span className="text-cream-400 capitalize">{key.replace(/_/g, ' ')}</span>
                            <span className="text-navy-800 dark:text-cream-200 font-medium truncate ml-2">
                              {String(val)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* API Access */}
            <div className="card p-6">
              <h2 className="text-sm font-semibold text-navy-800 dark:text-cream-200 uppercase tracking-wider mb-4">
                API Access
              </h2>
              <p className="text-sm text-navy-500 dark:text-cream-400 mb-4">
                Access {mfr.name} product data programmatically via the SpecBase API.
              </p>
              <div className="bg-navy-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs text-cream-300 font-mono leading-relaxed">
                  <span className="text-sky-400">GET</span>{' '}
                  <span className="text-green-400">/api/v1/products?manufacturer={mfr.slug}</span>
                </pre>
              </div>
              <div className="mt-4">
                <Link
                  href="/api-docs"
                  className="text-sm text-accent hover:text-accent-hover transition-colors"
                >
                  View full API documentation &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
