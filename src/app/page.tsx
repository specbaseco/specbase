import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import CategoryCard from '@/components/CategoryCard';
import { categories, manufacturers, products } from '@/lib/data';

export default function HomePage() {
  const stats = {
    products: products.length,
    manufacturers: manufacturers.length,
    categories: categories.length,
  };

  return (
    <div className="bg-cream-100 dark:bg-navy-900">
      {/* Hero */}
      <section className="bg-navy-800 text-white">
        <div className="container-narrow py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-navy-700/50 border border-navy-600 text-cream-300 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Now indexing industrial products for AI
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            The Intelligence Layer for<br />
            <span className="text-accent-light">Power Transmission</span>
          </h1>
          <p className="text-lg text-cream-400 mt-6 max-w-2xl mx-auto leading-relaxed">
            Connecting AI agents and engineers with the right industrial components.
            Search motors, gearboxes, bearings, and more from leading manufacturers.
          </p>

          <div className="mt-10">
            <SearchBar variant="hero" />
          </div>

          {/* Dual CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="/api-docs" className="flex items-center gap-2 text-sm text-cream-300 hover:text-white transition-colors group">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              For AI Agents
              <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
            </Link>
            <span className="text-navy-600 hidden sm:inline">&middot;</span>
            <Link href="/engineers" className="flex items-center gap-2 text-sm text-cream-300 hover:text-white transition-colors group">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              For Engineers
              <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-wide py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-cream-200">Browse by Category</h2>
          <p className="text-navy-500 dark:text-cream-400 mt-3">Find the right component for your application</p>
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
      </section>

      {/* Stats */}
      <section className="bg-navy-800 text-white">
        <div className="container-wide py-12">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-accent-light">{stats.products}+</p>
              <p className="text-sm text-cream-400 mt-1">Products Indexed</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-accent-light">{stats.manufacturers}</p>
              <p className="text-sm text-cream-400 mt-1">Manufacturers</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-accent-light">{stats.categories}</p>
              <p className="text-sm text-cream-400 mt-1">Product Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="container-wide py-16">
        <p className="text-center text-sm text-cream-400 uppercase tracking-wider font-medium mb-8">
          Indexing products from industry leaders
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {['ABB', 'Siemens', 'WEG', 'Nidec', 'SEW-Eurodrive', 'SKF', 'Gates', 'Timken'].map(name => (
            <div key={name} className="text-lg md:text-xl font-bold text-cream-400/60 hover:text-navy-600 dark:hover:text-cream-300 transition-colors cursor-default">
              {name}
            </div>
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
            Join the registry that powers intelligent product selection.
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
