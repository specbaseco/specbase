'use client';

import { useState } from 'react';
import Link from 'next/link';

const exampleQueries = [
  'Baldor EM3615T',
  '10 HP 3-phase TEFC 215T frame',
  'Marathon 5K49MN4081 replacement',
  'WEG 00518ET3E184T-W22',
  '25 HP 1800 RPM 284T 460V severe duty',
  'Leeson 131537 alternative',
];

export default function FindAlternativePage() {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setHasSearched(true);
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    setHasSearched(true);
  };

  return (
    <div className="bg-cream-100 dark:bg-navy-900 min-h-screen">
      {/* Hero */}
      <section className="bg-navy-800 text-white">
        <div className="container-wide py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Cross-Reference Tool
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Find an Alternative
            </h1>
            <p className="text-cream-300 mt-4 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              Enter a part number, brand name, or describe what you need in plain language. We&apos;ll find matching and compatible products across all manufacturers.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mt-10 max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-cream-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter a part number, brand, or specs..."
                  className="w-full pl-14 pr-32 py-5 rounded-2xl bg-white text-navy-800 text-lg placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-accent shadow-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary !py-3 !px-6 !rounded-xl text-base"
                >
                  Find Match
                </button>
              </div>
            </form>

            {/* Example queries */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="text-sm text-cream-400">Try:</span>
              {exampleQueries.map((ex) => (
                <button
                  key={ex}
                  onClick={() => handleExampleClick(ex)}
                  className="text-sm text-cream-300 hover:text-accent bg-navy-700 hover:bg-navy-600 px-3 py-1 rounded-full transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results / Placeholder */}
      <section className="container-wide py-12 md:py-16">
        {hasSearched ? (
          /* Post-search state */
          <div className="max-w-4xl mx-auto">
            {/* Search context */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm text-navy-500 dark:text-cream-400">Searching for alternatives to</p>
                <p className="text-lg font-semibold text-navy-800 dark:text-cream-200 mt-0.5">&quot;{query}&quot;</p>
              </div>
              <button
                onClick={() => { setQuery(''); setHasSearched(false); }}
                className="text-sm text-accent hover:text-accent-hover transition-colors"
              >
                Clear search
              </button>
            </div>

            {/* Coming Soon Card */}
            <div className="card p-8 md:p-12 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-navy-800 dark:text-cream-200">
                Intelligent Matching Coming Soon
              </h2>
              <p className="text-navy-500 dark:text-cream-400 mt-3 max-w-lg mx-auto leading-relaxed">
                Our cross-reference engine will analyze your input and find equivalent products across {' '}
                <span className="font-medium text-navy-700 dark:text-cream-300">ABB, WEG, Leeson, Marathon, Nidec</span> {' '}
                and more, matching by specifications, frame size, and application compatibility.
              </p>

              {/* What it will do */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 text-left">
                <div className="p-5 bg-cream-100 dark:bg-navy-900 rounded-xl">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-navy-800 dark:text-cream-200 text-sm">Part Number Lookup</h3>
                  <p className="text-xs text-navy-500 dark:text-cream-400 mt-1.5 leading-relaxed">
                    Enter any manufacturer part number and we&apos;ll identify the product and show cross-brand equivalents.
                  </p>
                </div>
                <div className="p-5 bg-cream-100 dark:bg-navy-900 rounded-xl">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-navy-800 dark:text-cream-200 text-sm">Spec-Based Matching</h3>
                  <p className="text-xs text-navy-500 dark:text-cream-400 mt-1.5 leading-relaxed">
                    Describe what you need &mdash; HP, voltage, frame, enclosure &mdash; and we&apos;ll find motors that match across our 2,800+ product catalog.
                  </p>
                </div>
                <div className="p-5 bg-cream-100 dark:bg-navy-900 rounded-xl">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-navy-800 dark:text-cream-200 text-sm">Brand Comparison</h3>
                  <p className="text-xs text-navy-500 dark:text-cream-400 mt-1.5 leading-relaxed">
                    See side-by-side comparisons of equivalent products from different manufacturers, with spec differences highlighted.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Link href="/search" className="btn-primary">
                  Browse All Products
                </Link>
                <Link href="/manufacturers" className="btn-secondary">
                  Partner With Us
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Pre-search state */
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-navy-800 dark:text-cream-200 text-center mb-8">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-14 h-14 bg-navy-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold text-navy-800 dark:text-cream-200">Enter What You Have</h3>
                <p className="text-sm text-navy-500 dark:text-cream-400 mt-2 leading-relaxed">
                  Type a part number, brand and model, or describe the specs you need. Use plain language &mdash; no special syntax required.
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-navy-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold text-navy-800 dark:text-cream-200">We Match Specs</h3>
                <p className="text-sm text-navy-500 dark:text-cream-400 mt-2 leading-relaxed">
                  Our engine identifies the product, extracts its key specifications, and searches across all brands for compatible alternatives.
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-navy-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold text-navy-800 dark:text-cream-200">Compare & Choose</h3>
                <p className="text-sm text-navy-500 dark:text-cream-400 mt-2 leading-relaxed">
                  Review matched products side-by-side with full specs, efficiency data, and availability across manufacturers.
                </p>
              </div>
            </div>

            {/* Use cases */}
            <div className="mt-16 card p-8">
              <h3 className="text-lg font-semibold text-navy-800 dark:text-cream-200 mb-6 text-center">Common Use Cases</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-cream-100 dark:bg-navy-900">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-800 dark:text-cream-200">Motor Replacement</p>
                    <p className="text-xs text-navy-500 dark:text-cream-400 mt-0.5">Motor failed on your line? Enter the nameplate info and find a replacement across multiple brands.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-cream-100 dark:bg-navy-900">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-800 dark:text-cream-200">Cost Comparison</p>
                    <p className="text-xs text-navy-500 dark:text-cream-400 mt-0.5">Find equivalent products from different manufacturers to compare pricing and availability.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-cream-100 dark:bg-navy-900">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-800 dark:text-cream-200">Efficiency Upgrade</p>
                    <p className="text-xs text-navy-500 dark:text-cream-400 mt-0.5">Enter your current motor specs and find a higher-efficiency replacement that fits the same frame.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-cream-100 dark:bg-navy-900">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-800 dark:text-cream-200">Supply Chain Backup</p>
                    <p className="text-xs text-navy-500 dark:text-cream-400 mt-0.5">Pre-identify alternatives for critical motors so you&apos;re ready when lead times stretch or stock runs out.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
