import Link from 'next/link';
import ManufacturerLogo from '@/components/ManufacturerLogo';
import TierBadge from '@/components/TierBadge';
import { categories, manufacturers, products, getManufacturerTier, sortManufacturersByTier } from '@/lib/data';

const templateMap: Record<string, string> = {
  motors: 'motors-template.csv',
  gearboxes: 'gearboxes-template.csv',
  'roller-chain': 'roller-chain-template.csv',
  'timing-belts': 'timing-belts-template.csv',
  bearings: 'bearings-template.csv',
  'v-belts': 'v-belts-template.csv',
  sheaves: 'sheaves-template.csv',
  sprockets: 'sprockets-template.csv',
  bushings: 'bushings-template.csv',
  couplings: 'couplings-template.csv',
  'engineering-chain': 'engineering-chain-template.csv',
  gearmotors: 'gearmotors-template.csv',
};

// 4-tier comparison data
const tiers = [
  {
    name: 'Registry',
    subtitle: 'Free',
    highlight: false,
    cta: { label: 'Submit Your Products', href: '#get-started' },
    features: {
      'Product listings': true,
      'AI agent discoverability': true,
      'Manufacturer profile page': true,
      'Crossover matching': true,
      'Contact info on profile': false,
      '"Find Your Rep" link': false,
      'Sales directory link': false,
      'Verified badge': false,
      'Preferred Data Partner badge': false,
      'Pinned results in category': false,
      'Catalog priority ranking': false,
      'Custom branding': false,
      'Analytics dashboard': false,
      'Dedicated support': false,
    },
  },
  {
    name: 'Verified',
    subtitle: 'Recommended',
    highlight: true,
    cta: { label: 'Contact Us', href: 'mailto:partners@specbase.co' },
    features: {
      'Product listings': true,
      'AI agent discoverability': true,
      'Manufacturer profile page': true,
      'Crossover matching': true,
      'Contact info on profile': true,
      '"Find Your Rep" link': true,
      'Sales directory link': true,
      'Verified badge': true,
      'Preferred Data Partner badge': false,
      'Pinned results in category': false,
      'Catalog priority ranking': false,
      'Custom branding': false,
      'Analytics dashboard': false,
      'Dedicated support': false,
    },
  },
  {
    name: 'Sponsored',
    subtitle: 'Category Partner',
    highlight: false,
    cta: { label: 'Contact Us', href: 'mailto:partners@specbase.co' },
    features: {
      'Product listings': true,
      'AI agent discoverability': true,
      'Manufacturer profile page': true,
      'Crossover matching': true,
      'Contact info on profile': true,
      '"Find Your Rep" link': true,
      'Sales directory link': true,
      'Verified badge': true,
      'Preferred Data Partner badge': true,
      'Pinned results in category': '1 per category',
      'Catalog priority ranking': false,
      'Custom branding': false,
      'Analytics dashboard': false,
      'Dedicated support': false,
    },
  },
  {
    name: 'Enterprise',
    subtitle: 'Partner',
    highlight: false,
    cta: { label: 'Contact Us', href: 'mailto:partners@specbase.co' },
    features: {
      'Product listings': true,
      'AI agent discoverability': true,
      'Manufacturer profile page': true,
      'Crossover matching': true,
      'Contact info on profile': true,
      '"Find Your Rep" link': true,
      'Sales directory link': true,
      'Verified badge': true,
      'Preferred Data Partner badge': true,
      'Pinned results in category': false,
      'Catalog priority ranking': true,
      'Custom branding': true,
      'Analytics dashboard': true,
      'Dedicated support': true,
    },
  },
];

const featureList = Object.keys(tiers[0].features);

export default function ManufacturersPage() {
  // Active manufacturers sorted by tier
  const activeManufacturers = sortManufacturersByTier(
    manufacturers.filter(m => products.some(p => p.manufacturer_id === m.id))
  );

  return (
    <div className="bg-cream-100 dark:bg-navy-900 min-h-screen">
      {/* Hero */}
      <section className="bg-navy-800 text-white">
        <div className="container-narrow py-16 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-navy-700/50 border border-navy-600 text-cream-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            For Manufacturers
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Get Your Products<br />
            <span className="text-accent-light">In Front of AI</span>
          </h1>
          <p className="text-lg text-cream-400 mt-5 max-w-2xl mx-auto leading-relaxed">
            AI agents are increasingly used for product selection and specification.
            If your products aren&apos;t in the registry, AI can&apos;t recommend them.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <a href="#get-started" className="btn-primary">
              Get Started
            </a>
            <a href="#tiers" className="text-cream-300 hover:text-white text-sm transition-colors">
              View partnership tiers &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Manufacturer Browse Grid */}
      <section className="container-wide py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-cream-200">Manufacturer Registry</h2>
          <p className="text-navy-500 dark:text-cream-400 mt-3">
            {activeManufacturers.length} manufacturers with {products.length.toLocaleString()}+ products indexed
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {activeManufacturers.map(m => {
            const tier = getManufacturerTier(m);
            const mfrProducts = products.filter(p => p.manufacturer_id === m.id);
            const topCategory = categories
              .map(c => ({ name: c.name, count: mfrProducts.filter(p => p.category_id === c.id).length }))
              .filter(c => c.count > 0)
              .sort((a, b) => b.count - a.count)[0];

            return (
              <Link
                key={m.id}
                href={`/manufacturers/${m.slug}`}
                className="card p-5 hover:border-accent/30 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-cream-100 dark:bg-navy-700 border border-cream-300 dark:border-navy-600 flex items-center justify-center flex-shrink-0">
                    <ManufacturerLogo manufacturerId={m.id} className="w-8 h-8" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-navy-800 dark:text-cream-200 group-hover:text-accent transition-colors truncate">
                      {m.name}
                    </p>
                    <TierBadge tier={tier} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-navy-500 dark:text-cream-400">
                  <span>{mfrProducts.length.toLocaleString()} products</span>
                  {topCategory && (
                    <span className="bg-cream-200 dark:bg-navy-700 px-2 py-0.5 rounded-full truncate ml-2">
                      {topCategory.name}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Partnership Tiers */}
      <section id="tiers" className="bg-white dark:bg-navy-800 border-y border-cream-300 dark:border-navy-700">
        <div className="container-wide py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-cream-200">Partnership Tiers</h2>
            <p className="text-navy-500 dark:text-cream-400 mt-3">
              Choose the level of visibility that fits your business
            </p>
          </div>

          {/* Tier cards — 4 columns on desktop, 2x2 on tablet, stacked on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {tiers.map(tier => (
              <div
                key={tier.name}
                className={`rounded-2xl border p-6 flex flex-col ${
                  tier.highlight
                    ? 'border-accent bg-accent/5 dark:bg-accent/10 ring-1 ring-accent/20 relative'
                    : 'border-cream-300 dark:border-navy-600 bg-white dark:bg-navy-800'
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Recommended
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-navy-800 dark:text-cream-200">{tier.name}</h3>
                  <p className="text-sm text-navy-500 dark:text-cream-400">{tier.subtitle}</p>
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {featureList.map(feature => {
                    const value = tier.features[feature as keyof typeof tier.features];
                    const isIncluded = value === true || (typeof value === 'string');
                    return (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        {isIncluded ? (
                          <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-cream-300 dark:text-navy-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className={isIncluded ? 'text-navy-800 dark:text-cream-200' : 'text-cream-400 dark:text-navy-500'}>
                          {feature}
                          {typeof value === 'string' && (
                            <span className="text-xs text-accent ml-1">({value})</span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <a
                  href={tier.cta.href}
                  className={`block text-center text-sm font-semibold py-2.5 rounded-lg transition-colors ${
                    tier.highlight
                      ? 'bg-accent text-white hover:bg-accent-hover'
                      : 'bg-cream-200 dark:bg-navy-700 text-navy-800 dark:text-cream-200 hover:bg-cream-300 dark:hover:bg-navy-600'
                  }`}
                >
                  {tier.cta.label}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ),
              title: 'AI Agents Can\'t Recommend What They Can\'t Find',
              desc: 'AI-powered product selection is growing rapidly. Engineers and procurement teams are using AI to find and specify components. Be where the decisions are made.',
            },
            {
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              ),
              title: 'Structured Data = Better Matching',
              desc: 'Our standardized templates ensure your product specifications are machine-readable, enabling precise matching to customer requirements.',
            },
            {
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
              title: 'Market Intelligence',
              desc: 'Gain insights into what engineers are searching for. Understand demand patterns, specification trends, and competitive positioning.',
            },
            {
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: 'Early Adopter Advantage',
              desc: 'Be among the first manufacturers in the registry. Early partners receive priority placement and help shape the platform\'s direction.',
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

      {/* Product Categories / Templates */}
      <section id="get-started" className="bg-white dark:bg-navy-800 border-y border-cream-300 dark:border-navy-700">
        <div className="container-wide py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-cream-200">Select Your Product Category</h2>
            <p className="text-navy-500 dark:text-cream-400 mt-3">Download the template for your product type, fill it in, and submit</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(cat => {
              const productCount = products.filter(p => p.category_id === cat.id).length;
              return (
                <div key={cat.id} className="card p-6 hover:border-accent/30 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-cream-200 dark:bg-navy-700 flex items-center justify-center">
                      <svg className="w-7 h-7 text-navy-600 dark:text-cream-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    {productCount > 0 && (
                      <span className="text-xs text-navy-500 dark:text-cream-400 bg-cream-200 dark:bg-navy-700 px-2 py-1 rounded-full">
                        {productCount} listed
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-navy-800 dark:text-cream-200 group-hover:text-accent transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-navy-500 dark:text-cream-400 mt-1.5 leading-relaxed">
                    {cat.description}
                  </p>

                  <div className="mt-5 space-y-2">
                    <a
                      href={`/templates/${templateMap[cat.slug] || 'motors-template.csv'}`}
                      download
                      className="w-full btn-primary text-sm !py-2.5 block text-center"
                    >
                      Download Template (.csv)
                    </a>
                    <Link href="/api-docs" className="w-full btn-secondary text-sm !py-2.5 block text-center">
                      View API Docs
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container-narrow py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-cream-200">How It Works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Download Template', desc: 'Select your product category and download the standardized CSV template. Each template is tailored to capture the specifications AI agents need for accurate product matching.' },
            { step: '2', title: 'Fill In Your Products', desc: 'Add your product data to the template. Required fields ensure minimum viable data, while optional fields improve match accuracy and search visibility.' },
            { step: '3', title: 'Submit & Go Live', desc: 'Upload your completed template or submit via our API. Your products become immediately searchable by AI agents and engineers worldwide.' },
          ].map(item => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center text-lg font-bold mx-auto">
                {item.step}
              </div>
              <h3 className="text-base font-semibold text-navy-800 dark:text-cream-200 mt-4">{item.title}</h3>
              <p className="text-sm text-navy-500 dark:text-cream-400 mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* API Integration */}
      <section className="bg-navy-800 text-white">
        <div className="container-narrow py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">API Integration</h2>
            <p className="text-cream-400 mt-3">Programmatically submit and manage your product catalog</p>
          </div>
          <div className="bg-navy-900 rounded-xl p-6 overflow-x-auto">
            <pre className="text-sm text-cream-300 leading-relaxed"><code>{`// Submit a product via API
POST /api/v1/products
Headers: {
  "Content-Type": "application/json",
  "X-API-Key": "your-api-key"
}

{
  "model_number": "M3BP 315 SMC 4",
  "name": "Process Performance Motor",
  "category": "motors",
  "specifications": {
    "horsepower": 250,
    "voltage": "460V",
    "rpm_full_load": 1785,
    "efficiency_class": "IE3",
    "frame_size": "315S/M",
    "enclosure_type": "TEFC"
  }
}`}</code></pre>
          </div>
          <div className="text-center mt-6">
            <Link href="/api-docs" className="text-accent hover:text-accent-light transition-colors text-sm">
              View full API documentation &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-narrow py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-cream-200">Ready to Get Started?</h2>
        <p className="text-navy-500 dark:text-cream-400 mt-3 max-w-lg mx-auto">
          Join the manufacturers already listed in SpecBase. Early partners shape the future of AI-powered product selection.
        </p>
        <div className="mt-8">
          <a href="mailto:partners@specbase.co" className="btn-primary text-lg !px-8 !py-3">
            Contact Us to Partner
          </a>
        </div>
      </section>
    </div>
  );
}
