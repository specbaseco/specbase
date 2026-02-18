import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import CategoryCard from '@/components/CategoryCard';
import { categories, products } from '@/lib/data';

export default function EngineersPage() {
  return (
    <div className="bg-cream-100 dark:bg-navy-900 min-h-screen">
      {/* Hero */}
      <section className="bg-navy-800 text-white">
        <div className="container-narrow py-16 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-navy-700/50 border border-navy-600 text-cream-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            For Engineers, OEMs & Distributors
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Find the Right Component,<br />
            <span className="text-accent-light">Faster</span>
          </h1>
          <p className="text-lg text-cream-400 mt-5 max-w-2xl mx-auto leading-relaxed">
            Search across manufacturers, compare specifications, and find the perfect power transmission
            and motion control components for your application.
          </p>
          <div className="mt-10 max-w-2xl mx-auto">
            <SearchBar variant="hero" placeholder="What are you looking for?" />
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="container-wide py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-cream-200">Built For How You Work</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'OEM Design',
              desc: 'Specify components for new machine designs. Search by exact specifications and compare options across manufacturers.',
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              ),
            },
            {
              title: 'Replacement Parts',
              desc: 'Find exact replacements by model number or cross-reference specifications from any manufacturer.',
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ),
            },
            {
              title: 'Alternative Products',
              desc: 'Supply chain constraints? Find equivalent products from different manufacturers with matching specifications.',
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              ),
            },
            {
              title: 'Distributor Lookup',
              desc: 'Distributors can quickly look up products for customers, check specifications, and provide accurate quotes.',
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              ),
            },
          ].map((item, i) => (
            <div key={i} className="card p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-base font-semibold text-navy-800 dark:text-cream-200">{item.title}</h3>
              <p className="text-sm text-navy-500 dark:text-cream-400 mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white dark:bg-navy-800 border-y border-cream-300 dark:border-navy-700">
        <div className="container-wide py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-cream-200">Browse Categories</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map(cat => (
              <CategoryCard
                key={cat.id}
                name={cat.name}
                slug={cat.slug}
                description={cat.description}
                icon={cat.icon}
                categoryId={cat.id}
                productCount={products.filter(p => p.category_id === cat.id).length}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="container-narrow py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-cream-200">How to Use SpecBase</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Search', desc: 'Enter a product name, model number, specification, or describe what you need in plain language.' },
            { step: '2', title: 'Filter & Compare', desc: 'Narrow results by category, manufacturer, and specifications. Compare products side by side.' },
            { step: '3', title: 'Connect', desc: 'Access datasheets, visit manufacturer websites, and request quotes directly.' },
          ].map(item => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 rounded-full bg-navy-800 text-white flex items-center justify-center text-lg font-bold mx-auto">
                {item.step}
              </div>
              <h3 className="text-base font-semibold text-navy-800 dark:text-cream-200 mt-4">{item.title}</h3>
              <p className="text-sm text-navy-500 dark:text-cream-400 mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream-200 dark:bg-navy-800 border-t border-cream-300 dark:border-navy-700">
        <div className="container-narrow py-12 text-center">
          <h2 className="text-xl font-bold text-navy-800 dark:text-cream-200">Start Searching Now</h2>
          <p className="text-sm text-navy-500 dark:text-cream-400 mt-2">No account required for basic search</p>
          <div className="mt-6">
            <Link href="/search" className="btn-primary">
              Browse All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
