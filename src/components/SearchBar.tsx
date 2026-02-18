'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  variant?: 'hero' | 'compact';
  defaultValue?: string;
  placeholder?: string;
}

export default function SearchBar({ variant = 'hero', defaultValue = '', placeholder }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className="relative w-full max-w-xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || 'Search products, manufacturers, specs...'}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-navy-800 border border-cream-300 dark:border-navy-700 rounded-lg text-sm text-navy-800 dark:text-cream-200 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || 'Search motors, gearboxes, bearings, chain...'}
          className="w-full pl-14 pr-32 py-5 bg-white dark:bg-navy-800 border border-cream-300 dark:border-navy-700 rounded-2xl text-lg text-navy-800 dark:text-cream-200 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent shadow-lg shadow-navy-900/5"
        />
        <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-cream-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 btn-primary !rounded-xl !py-3 !px-6 text-sm"
        >
          Search
        </button>
      </div>
      <div className="flex items-center justify-center gap-3 mt-4 text-sm text-navy-600 dark:text-cream-400">
        <span className="text-cream-400">Try:</span>
        <button type="button" onClick={() => { setQuery('1/2 HP motor'); }} className="text-navy-600 dark:text-cream-400 hover:text-accent transition-colors underline underline-offset-2">
          1/2 HP motor
        </button>
        <span className="text-cream-400">&middot;</span>
        <button type="button" onClick={() => { setQuery('5 HP TEFC'); }} className="text-navy-600 dark:text-cream-400 hover:text-accent transition-colors underline underline-offset-2">
          5 HP TEFC
        </button>
        <span className="text-cream-400">&middot;</span>
        <button type="button" onClick={() => { setQuery('severe duty 100HP'); }} className="text-navy-600 dark:text-cream-400 hover:text-accent transition-colors underline underline-offset-2">
          severe duty 100HP
        </button>
      </div>
    </form>
  );
}
