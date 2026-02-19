'use client';

import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-navy-800 text-white sticky top-0 z-50 border-b border-navy-700">
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold text-sm">
              SB
            </div>
            <span className="text-lg font-semibold tracking-tight group-hover:text-accent-light transition-colors">
              SpecBase
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/why" className="px-4 py-2 rounded-lg text-sm font-medium text-cream-300 hover:text-white hover:bg-navy-700 transition-colors">
              Why SpecBase
            </Link>
            <Link href="/" className="px-4 py-2 rounded-lg text-sm font-medium text-cream-300 hover:text-white hover:bg-navy-700 transition-colors">
              Search
            </Link>
            <Link href="/configure" className="px-4 py-2 rounded-lg text-sm font-medium text-cream-300 hover:text-white hover:bg-navy-700 transition-colors">
              Configure
            </Link>
            <Link href="/crossover" className="px-4 py-2 rounded-lg text-sm font-medium text-cream-300 hover:text-white hover:bg-navy-700 transition-colors">
              Crossover
            </Link>
            <Link href="/manufacturers" className="px-4 py-2 rounded-lg text-sm font-medium text-cream-300 hover:text-white hover:bg-navy-700 transition-colors">
              For Manufacturers
            </Link>
            <Link href="/engineers" className="px-4 py-2 rounded-lg text-sm font-medium text-cream-300 hover:text-white hover:bg-navy-700 transition-colors">
              For Engineers
            </Link>
            <Link href="/api-docs" className="px-4 py-2 rounded-lg text-sm font-medium text-cream-300 hover:text-white hover:bg-navy-700 transition-colors">
              API Docs
            </Link>
          </div>

          {/* CTA + Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/api-docs" className="text-sm text-cream-400 hover:text-white transition-colors">
              Get API Key
            </Link>
            <Link href="/manufacturers" className="btn-primary text-sm !py-2 !px-4">
              Partner With Us
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <button
              className="p-2 text-cream-300 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-navy-700 mt-2 pt-4 space-y-1">
            <Link href="/why" className="block px-4 py-2 rounded-lg text-sm text-cream-300 hover:text-white hover:bg-navy-700" onClick={() => setMobileOpen(false)}>
              Why SpecBase
            </Link>
            <Link href="/" className="block px-4 py-2 rounded-lg text-sm text-cream-300 hover:text-white hover:bg-navy-700" onClick={() => setMobileOpen(false)}>
              Search
            </Link>
            <Link href="/configure" className="block px-4 py-2 rounded-lg text-sm text-cream-300 hover:text-white hover:bg-navy-700" onClick={() => setMobileOpen(false)}>
              Configure
            </Link>
            <Link href="/crossover" className="block px-4 py-2 rounded-lg text-sm text-cream-300 hover:text-white hover:bg-navy-700" onClick={() => setMobileOpen(false)}>
              Crossover
            </Link>
            <Link href="/manufacturers" className="block px-4 py-2 rounded-lg text-sm text-cream-300 hover:text-white hover:bg-navy-700" onClick={() => setMobileOpen(false)}>
              For Manufacturers
            </Link>
            <Link href="/engineers" className="block px-4 py-2 rounded-lg text-sm text-cream-300 hover:text-white hover:bg-navy-700" onClick={() => setMobileOpen(false)}>
              For Engineers
            </Link>
            <Link href="/api-docs" className="block px-4 py-2 rounded-lg text-sm text-cream-300 hover:text-white hover:bg-navy-700" onClick={() => setMobileOpen(false)}>
              API Docs
            </Link>
            <div className="pt-2">
              <Link href="/manufacturers" className="btn-primary text-sm block text-center" onClick={() => setMobileOpen(false)}>
                Partner With Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
