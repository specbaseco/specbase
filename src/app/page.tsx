import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import CategoryCard from '@/components/CategoryCard';
import CodeBlock from '@/components/CodeBlock';
import { categories, manufacturers, products } from '@/lib/data';

const API_DEMO_CODE = `curl -X POST https://specbase.co/api/v1/search \\
  -H "Content-Type: application/json" \\
  -d '{
    "category": "motors",
    "specs": {
      "horsepower": "5",
      "voltage": "460",
      "enclosure_type": "TEFC"
    }
  }'`;

export default function HomePage() {
  // Compute real stats from data
  const activeManufacturers = manufacturers.filter(m =>
    products.some(p => p.manufacturer_id === m.id)
  );
  const activeCategories = categories.filter(c =>
    products.some(p => p.category_id === c.id)
  );
  const totalSpecs = products.reduce((acc, p) => acc + Object.keys(p.specifications).length, 0);

  return (
    <div className="bg-cream-100 dark:bg-navy-900">
      {/* Hero — Split layout: headline left, code snippet right */}
      <section className="bg-navy-800 text-white">
        <div className="container-wide py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: headline + copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-navy-700/50 border border-navy-600 text-cream-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Now indexing industrial components for AI
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                The Intelligence Layer for<br />
                <span className="text-accent-light">Industrial Components</span>
              </h1>
              <p className="text-lg text-cream-400 mt-5 max-w-xl leading-relaxed">
                Structured product data for AI agents, engineers, and procurement tools.
                Search motors, gearboxes, bearings, and more from leading manufacturers.
              </p>

              {/* Search bar */}
              <div className="mt-8">
                <SearchBar variant="hero" />
              </div>
            </div>

            {/* Right: API code snippet */}
            <div className="hidden lg:block">
              <div className="text-xs text-cream-500 font-medium uppercase tracking-wider mb-3">
                API-First Design
              </div>
              <CodeBlock code={API_DEMO_CODE} language="bash" />
              <p className="text-xs text-cream-500 mt-3">
                Full REST API with structured search, crossover matching, and product comparison.{' '}
                <Link href="/api-docs" className="text-accent hover:text-accent-light transition-colors underline">
                  View API Docs
                </Link>
              </p>
            </div>
          </div>

          {/* Three-track CTA row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 pt-8 border-t border-navy-700">
            <Link href="/api-docs" className="flex items-center gap-2.5 text-sm text-cream-300 hover:text-white transition-colors group">
              <span className="w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center group-hover:bg-navy-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              <span>
                <span className="block font-medium">I&apos;m an AI Agent</span>
                <span className="block text-xs text-cream-500">API Docs &rarr;</span>
              </span>
            </Link>
            <span className="text-navy-600 hidden sm:inline">&middot;</span>
            <Link href="/search" className="flex items-center gap-2.5 text-sm text-cream-300 hover:text-white transition-colors group">
              <span className="w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center group-hover:bg-navy-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <span>
                <span className="block font-medium">I&apos;m an Engineer</span>
                <span className="block text-xs text-cream-500">Search Products &rarr;</span>
              </span>
            </Link>
            <span className="text-navy-600 hidden sm:inline">&middot;</span>
            <Link href="/manufacturers" className="flex items-center gap-2.5 text-sm text-cream-300 hover:text-white transition-colors group">
              <span className="w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center group-hover:bg-navy-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
              <span>
                <span className="block font-medium">I&apos;m a Manufacturer</span>
                <span className="block text-xs text-cream-500">List Your Products &rarr;</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* See It In Action - Demo Section */}
      <section className="container-wide py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-cream-200">See It In Action</h2>
          <p className="text-navy-500 dark:text-cream-400 mt-3">Type like an engineer. Get structured results instantly.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Simulated search input */}
          <div className="relative">
            <div className="bg-white dark:bg-navy-800 border border-cream-300 dark:border-navy-700 rounded-2xl px-6 py-5 shadow-lg shadow-navy-900/5">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-cream-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-lg text-navy-800 dark:text-cream-200 font-medium">50 HP TEFC 460V motor</span>
              </div>
            </div>
          </div>

          {/* Arrow down */}
          <div className="flex justify-center my-4">
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-cream-400 font-medium uppercase tracking-wider">Parsed into</span>
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>

          {/* Parsed spec tags */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            {[
              { label: '50 HP', detail: 'Horsepower' },
              { label: 'TEFC', detail: 'Enclosure' },
              { label: '460V', detail: 'Voltage' },
              { label: 'Motors', detail: 'Category' },
            ].map(tag => (
              <div key={tag.label} className="bg-accent/10 border border-accent/20 rounded-xl px-4 py-2.5 text-center">
                <p className="text-sm font-semibold text-accent">{tag.label}</p>
                <p className="text-xs text-navy-500 dark:text-cream-400">{tag.detail}</p>
              </div>
            ))}
          </div>

          {/* Arrow down */}
          <div className="flex justify-center my-4">
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-cream-400 font-medium uppercase tracking-wider">Matched</span>
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>

          {/* Sample result cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-accent">ABB</p>
                  <p className="text-base font-semibold text-navy-800 dark:text-cream-200 mt-1">M3BP 315 SMA 4</p>
                </div>
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">Match</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3 text-xs">
                <div className="flex justify-between"><span className="text-cream-400">HP</span><span className="text-navy-800 dark:text-cream-200 font-medium">50</span></div>
                <div className="flex justify-between"><span className="text-cream-400">Voltage</span><span className="text-navy-800 dark:text-cream-200 font-medium">460V</span></div>
                <div className="flex justify-between"><span className="text-cream-400">Enclosure</span><span className="text-navy-800 dark:text-cream-200 font-medium">TEFC</span></div>
                <div className="flex justify-between"><span className="text-cream-400">Frame</span><span className="text-navy-800 dark:text-cream-200 font-medium">326T</span></div>
              </div>
            </div>
            <div className="card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-accent">WEG</p>
                  <p className="text-base font-semibold text-navy-800 dark:text-cream-200 mt-1">W22 Severe Duty</p>
                </div>
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">Match</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3 text-xs">
                <div className="flex justify-between"><span className="text-cream-400">HP</span><span className="text-navy-800 dark:text-cream-200 font-medium">50</span></div>
                <div className="flex justify-between"><span className="text-cream-400">Voltage</span><span className="text-navy-800 dark:text-cream-200 font-medium">460V</span></div>
                <div className="flex justify-between"><span className="text-cream-400">Enclosure</span><span className="text-navy-800 dark:text-cream-200 font-medium">TEFC</span></div>
                <div className="flex justify-between"><span className="text-cream-400">Frame</span><span className="text-navy-800 dark:text-cream-200 font-medium">326TS</span></div>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link href="/search?q=50+HP+TEFC+460V+motor" className="text-sm text-accent hover:text-accent-hover font-medium transition-colors">
              Try this search live &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white dark:bg-navy-800 border-y border-cream-300 dark:border-navy-700">
        <div className="container-wide py-16 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-cream-200">Browse by Category</h2>
            <p className="text-navy-500 dark:text-cream-400 mt-3">Find the right component for your application</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

      {/* Stats */}
      <section className="bg-navy-800 text-white">
        <div className="container-wide py-12">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-accent-light">{products.length.toLocaleString()}+</p>
              <p className="text-sm text-cream-400 mt-1">Products Indexed</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-accent-light">{activeManufacturers.length}</p>
              <p className="text-sm text-cream-400 mt-1">Manufacturers</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-accent-light">{totalSpecs.toLocaleString()}+</p>
              <p className="text-sm text-cream-400 mt-1">Specifications Indexed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturers in Registry — now linked to profile pages */}
      <section className="container-wide py-16">
        <p className="text-center text-sm text-cream-400 uppercase tracking-wider font-medium mb-8">
          Manufacturers in the registry
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {activeManufacturers.map(m => (
            <Link
              key={m.id}
              href={`/manufacturers/${m.slug}`}
              className="text-lg md:text-xl font-bold text-cream-400/60 hover:text-accent transition-colors"
            >
              {m.name}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-cream-200 dark:bg-navy-800 border-t border-cream-300 dark:border-navy-700">
        <div className="container-narrow py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-cream-200">
            Are you a manufacturer?
          </h2>
          <p className="text-navy-500 dark:text-cream-400 mt-3 max-w-lg mx-auto">
            Get your products in front of AI agents and engineers worldwide.
            Join the platform powering intelligent component selection.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="/manufacturers" className="btn-primary">
              Partner With Us
            </Link>
            <Link href="/api-docs" className="btn-secondary">
              View API Docs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
