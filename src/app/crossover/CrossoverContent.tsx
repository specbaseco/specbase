'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { findProductByModelNumber, findCrossoverProducts, manufacturers } from '@/lib/data';
import type { CrossoverMatch } from '@/lib/data';
import type { Product, Manufacturer, ProductCategory } from '@/types';

type ProductWithRelations = Product & { manufacturer?: Manufacturer; category?: ProductCategory };

// ── Spec comparison row ──
function SpecRow({ label, sourceValue, matchValue, matches }: {
  label: string;
  sourceValue: string;
  matchValue: string;
  matches: boolean;
}) {
  return (
    <tr className="border-t border-cream-200 dark:border-navy-700">
      <td className="py-2 pr-4 text-xs text-cream-400 font-medium whitespace-nowrap">{label}</td>
      <td className="py-2 pr-4 text-xs text-navy-800 dark:text-cream-200 font-medium">{sourceValue || '—'}</td>
      <td className={`py-2 text-xs font-medium flex items-center gap-1.5 ${
        matches
          ? 'text-green-600 dark:text-green-400'
          : 'text-amber-600 dark:text-amber-400'
      }`}>
        {matches ? (
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )}
        {matchValue || '—'}
      </td>
    </tr>
  );
}

// ── Match score badge ──
function MatchBadge({ score }: { score: number }) {
  const color = score >= 90
    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
    : score >= 70
      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';

  const label = score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : 'Partial';

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${color}`}>
      {score}% {label}
    </span>
  );
}

// ── Crossover Result Card ──
function CrossoverCard({ match, source }: { match: CrossoverMatch; source: ProductWithRelations }) {
  const [expanded, setExpanded] = useState(false);
  const p = match.product;
  const specs = p.specifications;
  const sourceSpecs = source.specifications;

  // Build spec comparison pairs dynamically based on category
  const specPairs = (() => {
    const catId = source.category_id;

    // Helper: resolve a spec value, trying multiple possible key names
    const sv = (...keys: string[]) => {
      for (const k of keys) {
        const v = sourceSpecs?.[k];
        if (v !== undefined && v !== null && v !== '') return String(v);
      }
      return '';
    };
    const cv = (...keys: string[]) => {
      for (const k of keys) {
        const v = specs?.[k];
        if (v !== undefined && v !== null && v !== '') return String(v);
      }
      return '';
    };

    if (catId === 'cat-motors') {
      return [
        { label: 'Horsepower', src: sv('horsepower'), cand: cv('horsepower'), key: 'Horsepower' },
        { label: 'Voltage', src: sv('voltage'), cand: cv('voltage'), key: 'Voltage' },
        { label: 'Phase', src: sv('phase'), cand: cv('phase'), key: 'Phase' },
        { label: 'RPM', src: sv('rpm_full_load'), cand: cv('rpm_full_load'), key: 'RPM' },
        { label: 'Frame Size', src: sv('frame_size'), cand: cv('frame_size'), key: 'Frame Size' },
        { label: 'Enclosure', src: sv('enclosure_type'), cand: cv('enclosure_type'), key: 'Enclosure' },
        { label: 'Mounting', src: sv('mounting'), cand: cv('mounting'), key: 'Mounting' },
        { label: 'Efficiency', src: sv('efficiency_class'), cand: cv('efficiency_class'), key: 'Efficiency Class' },
      ];
    }
    if (catId === 'cat-chain') {
      return [
        { label: 'ANSI #', src: sv('ansi_chain_number', 'ansi_number'), cand: cv('ansi_chain_number', 'ansi_number'), key: 'ANSI Chain #' },
        { label: 'Pitch', src: sv('pitch_inches', 'pitch'), cand: cv('pitch_inches', 'pitch'), key: 'Pitch' },
        { label: 'Strands', src: sv('number_of_strands', 'strand_count', 'strands'), cand: cv('number_of_strands', 'strand_count', 'strands'), key: 'Number of Strands' },
        { label: 'Material', src: sv('material'), cand: cv('material'), key: 'Material' },
        { label: 'Chain Type', src: sv('chain_type'), cand: cv('chain_type'), key: 'Chain Type' },
      ];
    }
    if (catId === 'cat-bearings') {
      return [
        { label: 'Shaft Size', src: sv('shaft_size'), cand: cv('shaft_size'), key: 'Shaft Size' },
        { label: 'Housing', src: sv('housing_style'), cand: cv('housing_style'), key: 'Housing' },
        { label: 'Internals', src: sv('internals'), cand: cv('internals'), key: 'Internals' },
        { label: 'Locking', src: sv('locking_type'), cand: cv('locking_type'), key: 'Locking' },
        { label: 'Dynamic Load', src: sv('dynamic_load_lbf'), cand: cv('dynamic_load_lbf'), key: 'Dynamic Load' },
        { label: 'Lubrication', src: sv('lubrication'), cand: cv('lubrication'), key: 'Lubrication' },
      ];
    }
    if (catId === 'cat-vbelts') {
      return [
        { label: 'Section', src: sv('section'), cand: cv('section'), key: 'Section' },
        { label: 'Length', src: sv('length'), cand: cv('length'), key: 'Length' },
        { label: 'Length Type', src: sv('length_type'), cand: cv('length_type'), key: 'Length Type' },
        { label: 'Strands', src: sv('strands'), cand: cv('strands'), key: 'Strands' },
        { label: 'Top Width', src: sv('top_width'), cand: cv('top_width'), key: 'Top Width' },
        { label: 'Construction', src: sv('construction'), cand: cv('construction'), key: 'Construction' },
      ];
    }
    if (catId === 'cat-sheaves') {
      return [
        { label: 'Belt Section', src: sv('belt_section'), cand: cv('belt_section'), key: 'Belt Section' },
        { label: 'Grooves', src: sv('grooves'), cand: cv('grooves'), key: 'Grooves' },
        { label: 'Bushing Type', src: sv('bushing_type'), cand: cv('bushing_type'), key: 'Bushing Type' },
        { label: 'Pitch Dia', src: sv('pitch_diameter'), cand: cv('pitch_diameter'), key: 'Pitch Dia' },
        { label: 'Material', src: sv('material'), cand: cv('material'), key: 'Material' },
      ];
    }
    if (catId === 'cat-belts') {
      return [
        { label: 'Profile', src: sv('profile'), cand: cv('profile'), key: 'Profile' },
        { label: 'Pitch (mm)', src: sv('pitch_mm'), cand: cv('pitch_mm'), key: 'Pitch (mm)' },
        { label: 'Width (mm)', src: sv('width_mm'), cand: cv('width_mm'), key: 'Width (mm)' },
        { label: 'Length (mm)', src: sv('length_mm'), cand: cv('length_mm'), key: 'Length (mm)' },
        { label: 'Teeth', src: sv('teeth'), cand: cv('teeth'), key: 'Teeth' },
        { label: 'Construction', src: sv('construction'), cand: cv('construction'), key: 'Construction' },
      ];
    }
    if (catId === 'cat-sprockets') {
      return [
        { label: 'ANSI #', src: sv('ansi_number', 'ansi_chain_number'), cand: cv('ansi_number', 'ansi_chain_number'), key: 'ANSI #' },
        { label: 'Teeth', src: sv('teeth'), cand: cv('teeth'), key: 'Teeth' },
        { label: 'Hub Style', src: sv('hub_style'), cand: cv('hub_style'), key: 'Hub Style' },
        { label: 'Bore Type', src: sv('bore_type'), cand: cv('bore_type'), key: 'Bore Type' },
        { label: 'Material', src: sv('material'), cand: cv('material'), key: 'Material' },
        { label: 'Hardened', src: sv('hardened_teeth'), cand: cv('hardened_teeth'), key: 'Hardened' },
      ];
    }
    if (catId === 'cat-bushings') {
      return [
        { label: 'Type', src: sv('bushing_type'), cand: cv('bushing_type'), key: 'Type' },
        { label: 'Series', src: sv('series'), cand: cv('series'), key: 'Series' },
        { label: 'Max Bore', src: sv('max_bore'), cand: cv('max_bore'), key: 'Max Bore' },
        { label: 'Bore Type', src: sv('bore_type'), cand: cv('bore_type'), key: 'Bore Type' },
        { label: 'OD', src: sv('outer_diameter'), cand: cv('outer_diameter'), key: 'OD' },
        { label: 'Length', src: sv('length'), cand: cv('length'), key: 'Length' },
      ];
    }
    if (catId === 'cat-couplings') {
      return [
        { label: 'Type', src: sv('coupling_type'), cand: cv('coupling_type'), key: 'Type' },
        { label: 'Series/Size', src: sv('series_size'), cand: cv('series_size'), key: 'Series/Size' },
        { label: 'Max Bore', src: sv('max_bore'), cand: cv('max_bore'), key: 'Max Bore' },
        { label: 'Material', src: sv('material'), cand: cv('material'), key: 'Material' },
        { label: 'Torque', src: sv('nominal_torque'), cand: cv('nominal_torque'), key: 'Torque' },
        { label: 'Max RPM', src: sv('max_rpm'), cand: cv('max_rpm'), key: 'Max RPM' },
      ];
    }
    if (catId === 'cat-engchain') {
      return [
        { label: 'Series', src: sv('series'), cand: cv('series'), key: 'Series' },
        { label: 'Type', src: sv('chain_type'), cand: cv('chain_type'), key: 'Type' },
        { label: 'Pitch', src: sv('pitch', 'pitch_inches'), cand: cv('pitch', 'pitch_inches'), key: 'Pitch' },
        { label: 'Tensile', src: sv('avg_tensile'), cand: cv('avg_tensile'), key: 'Tensile' },
        { label: 'Pin Style', src: sv('pin_style'), cand: cv('pin_style'), key: 'Pin Style' },
        { label: 'Attachment', src: sv('attachment'), cand: cv('attachment'), key: 'Attachment' },
      ];
    }
    if (catId === 'cat-gearboxes') {
      return [
        { label: 'Series', src: sv('series'), cand: cv('series'), key: 'Series' },
        { label: 'Gearing', src: sv('gearing_style'), cand: cv('gearing_style'), key: 'Gearing' },
        { label: 'Orientation', src: sv('orientation'), cand: cv('orientation'), key: 'Orientation' },
        { label: 'Max HP', src: sv('max_input_hp'), cand: cv('max_input_hp'), key: 'Max HP' },
        { label: 'Torque', src: sv('output_torque'), cand: cv('output_torque'), key: 'Torque' },
        { label: 'Ratio', src: sv('ratio_range'), cand: cv('ratio_range'), key: 'Ratio' },
      ];
    }
    if (catId === 'cat-gearmotors') {
      return [
        { label: 'Horsepower', src: sv('horsepower'), cand: cv('horsepower'), key: 'Horsepower' },
        { label: 'Output RPM', src: sv('output_rpm'), cand: cv('output_rpm'), key: 'Output RPM' },
        { label: 'Ratio', src: sv('ratio'), cand: cv('ratio'), key: 'Ratio' },
        { label: 'Torque (lb-in)', src: sv('torque'), cand: cv('torque'), key: 'Torque (lb-in)' },
        { label: 'Series', src: sv('series'), cand: cv('series'), key: 'Series' },
        { label: 'Enclosure', src: sv('enclosure_type'), cand: cv('enclosure_type'), key: 'Enclosure' },
        { label: 'Voltage', src: sv('voltage'), cand: cv('voltage'), key: 'Voltage' },
        { label: 'Phase', src: sv('phase'), cand: cv('phase'), key: 'Phase' },
        { label: 'Motor Type', src: sv('motor_type'), cand: cv('motor_type'), key: 'Motor Type' },
      ];
    }
    // Generic fallback: pick up to 6 non-empty spec keys
    return Object.keys(sourceSpecs || {})
      .filter(k => sourceSpecs[k] !== undefined && sourceSpecs[k] !== null && sourceSpecs[k] !== '')
      .slice(0, 6)
      .map(k => ({
        label: k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        src: String(sourceSpecs[k]),
        cand: String(specs?.[k] ?? ''),
        key: k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      }));
  })();

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-accent uppercase tracking-wider">{p.manufacturer?.name}</p>
              <MatchBadge score={match.matchScore} />
            </div>
            <Link href={`/products/${p.id}`} className="text-base font-semibold text-navy-800 dark:text-cream-200 hover:text-accent transition-colors mt-1 block">
              {p.name}
            </Link>
            <p className="text-xs text-navy-500 dark:text-cream-400 font-mono mt-0.5">{p.model_number}</p>
          </div>
        </div>

        {/* Quick spec chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          {match.matchedSpecs.map(spec => (
            <span key={spec} className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {spec}
            </span>
          ))}
          {match.mismatchedSpecs.map(spec => (
            <span key={spec} className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
              </svg>
              {spec}
            </span>
          ))}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-xs text-accent hover:text-accent-hover font-medium transition-colors flex items-center gap-1"
        >
          {expanded ? 'Hide' : 'Compare'} specs
          <svg className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Expanded comparison table */}
      {expanded && (
        <div className="border-t border-cream-300 dark:border-navy-700 bg-cream-100/50 dark:bg-navy-900/50 px-5 py-4">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-2 text-[10px] font-semibold text-cream-400 uppercase tracking-wider w-28">Spec</th>
                <th className="pb-2 text-[10px] font-semibold text-cream-400 uppercase tracking-wider">Source</th>
                <th className="pb-2 text-[10px] font-semibold text-cream-400 uppercase tracking-wider">This Product</th>
              </tr>
            </thead>
            <tbody>
              {specPairs.map(sp => (
                <SpecRow
                  key={sp.label}
                  label={sp.label}
                  sourceValue={sp.src}
                  matchValue={sp.cand}
                  matches={match.matchedSpecs.includes(sp.key)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Main Content ──
export default function CrossoverContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialModel = searchParams.get('model') || '';

  const [modelInput, setModelInput] = useState(initialModel);

  // Find the source product
  const sourceProduct = useMemo(() => {
    if (!initialModel) return null;
    return findProductByModelNumber(initialModel);
  }, [initialModel]);

  // Find crossover matches
  const crossoverMatches = useMemo(() => {
    if (!sourceProduct) return [];
    return findCrossoverProducts(sourceProduct.id);
  }, [sourceProduct]);

  // Group matches by manufacturer
  const matchesByManufacturer = useMemo(() => {
    const grouped: Record<string, CrossoverMatch[]> = {};
    for (const match of crossoverMatches) {
      const mfrName = match.product.manufacturer?.name || 'Unknown';
      if (!grouped[mfrName]) grouped[mfrName] = [];
      grouped[mfrName].push(match);
    }
    return grouped;
  }, [crossoverMatches]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modelInput.trim()) {
      router.push(`/crossover?model=${encodeURIComponent(modelInput.trim())}`);
    }
  };

  return (
    <div className="bg-cream-100 dark:bg-navy-900 min-h-screen">
      {/* Hero */}
      <section className="bg-navy-800 text-white">
        <div className="container-narrow py-16 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-navy-700/50 border border-navy-600 text-cream-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Reverse Lookup
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Find <span className="text-accent-light">Crossovers</span>
          </h1>
          <p className="text-lg text-cream-400 mt-5 max-w-2xl mx-auto leading-relaxed">
            Enter a part number. We&apos;ll pull its specs and find matching products from other manufacturers.
          </p>

          {/* Search input */}
          <form onSubmit={handleSubmit} className="mt-10 max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={modelInput}
                onChange={(e) => setModelInput(e.target.value)}
                placeholder="Enter part or model number (e.g. 131515.00)"
                className="w-full pl-14 pr-32 py-5 bg-white dark:bg-navy-800 border border-cream-300 dark:border-navy-700 rounded-2xl text-lg text-navy-800 dark:text-cream-200 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent shadow-lg shadow-navy-900/5"
              />
              <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-cream-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 btn-primary !rounded-xl !py-3 !px-6 text-sm"
              >
                Find
              </button>
            </div>
            <div className="flex items-center justify-center gap-3 mt-4 text-sm text-navy-600 dark:text-cream-400">
              <span className="text-cream-400">Try:</span>
              <button type="button" onClick={() => { setModelInput('131515.00'); router.push('/crossover?model=131515.00'); }} className="text-cream-300 hover:text-white transition-colors underline underline-offset-2">
                131515.00
              </button>
              <span className="text-cream-400">&middot;</span>
              <button type="button" onClick={() => { setModelInput('HD1P2H'); router.push('/crossover?model=HD1P2H'); }} className="text-cream-300 hover:text-white transition-colors underline underline-offset-2">
                HD1P2H
              </button>
              <span className="text-cream-400">&middot;</span>
              <button type="button" onClick={() => { setModelInput('00518ST3QIE184T-W22'); router.push('/crossover?model=00518ST3QIE184T-W22'); }} className="text-cream-300 hover:text-white transition-colors underline underline-offset-2">
                00518ST3QIE184T-W22
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Results */}
      <div className="container-wide py-8 md:py-12">
        {initialModel && !sourceProduct && (
          <div className="card p-12 text-center max-w-2xl mx-auto">
            <svg className="w-12 h-12 text-cream-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-medium text-navy-700 dark:text-cream-300">
              No product found for &ldquo;{initialModel}&rdquo;
            </h3>
            <p className="text-sm text-navy-500 dark:text-cream-400 mt-2">
              Try a different part or model number. We currently index products from {manufacturers.filter(m => m.partnership_status !== 'none' || ['mfr-nidec', 'mfr-weg', 'mfr-tsubaki', 'mfr-diamond', 'mfr-daido'].includes(m.id)).length}+ manufacturers.
            </p>
          </div>
        )}

        {sourceProduct && (
          <>
            {/* Source product card */}
            <div className="max-w-4xl mx-auto mb-8">
              <h2 className="text-sm font-semibold text-navy-500 dark:text-cream-400 uppercase tracking-wider mb-3">Source Product</h2>
              <div className="card p-6 border-2 border-accent/20">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-accent uppercase tracking-wider">{sourceProduct.manufacturer?.name}</p>
                    <Link href={`/products/${sourceProduct.id}`} className="text-xl font-bold text-navy-800 dark:text-cream-200 hover:text-accent transition-colors mt-1 block">
                      {sourceProduct.name}
                    </Link>
                    <p className="text-sm text-navy-500 dark:text-cream-400 font-mono mt-0.5">Model: {sourceProduct.model_number}</p>
                  </div>
                </div>

                {/* Key specs grid — dynamic per category */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-5">
                  {(() => {
                    const catId = sourceProduct.category_id;
                    const sp = sourceProduct.specifications;
                    // Helper: resolve the first non-empty value from multiple possible keys
                    const val = (...keys: string[]) => {
                      for (const k of keys) {
                        const v = sp?.[k];
                        if (v !== undefined && v !== null && v !== '') return String(v);
                      }
                      return '';
                    };

                    type SpecTile = { label: string; keys: string[] };

                    const tiles: SpecTile[] = (() => {
                      if (catId === 'cat-motors') {
                        return [
                          { label: 'HP', keys: ['horsepower'] },
                          { label: 'Voltage', keys: ['voltage'] },
                          { label: 'Phase', keys: ['phase'] },
                          { label: 'RPM', keys: ['rpm_full_load'] },
                          { label: 'Frame', keys: ['frame_size'] },
                          { label: 'Enclosure', keys: ['enclosure_type'] },
                          { label: 'Mounting', keys: ['mounting'] },
                          { label: 'Efficiency', keys: ['efficiency_class'] },
                        ];
                      }
                      if (catId === 'cat-chain') {
                        return [
                          { label: 'ANSI #', keys: ['ansi_chain_number', 'ansi_number'] },
                          { label: 'Pitch', keys: ['pitch_inches', 'pitch'] },
                          { label: 'Strands', keys: ['number_of_strands', 'strand_count', 'strands'] },
                          { label: 'Material', keys: ['material'] },
                          { label: 'Chain Type', keys: ['chain_type'] },
                        ];
                      }
                      if (catId === 'cat-bearings') {
                        return [
                          { label: 'Shaft Size', keys: ['shaft_size'] },
                          { label: 'Housing', keys: ['housing_style'] },
                          { label: 'Internals', keys: ['internals'] },
                          { label: 'Locking', keys: ['locking_type'] },
                          { label: 'Dynamic Load', keys: ['dynamic_load_lbf'] },
                          { label: 'Lubrication', keys: ['lubrication'] },
                        ];
                      }
                      if (catId === 'cat-vbelts') {
                        return [
                          { label: 'Section', keys: ['section'] },
                          { label: 'Length', keys: ['length'] },
                          { label: 'Length Type', keys: ['length_type'] },
                          { label: 'Strands', keys: ['strands'] },
                          { label: 'Top Width', keys: ['top_width'] },
                          { label: 'Construction', keys: ['construction'] },
                        ];
                      }
                      if (catId === 'cat-sheaves') {
                        return [
                          { label: 'Belt Section', keys: ['belt_section'] },
                          { label: 'Grooves', keys: ['grooves'] },
                          { label: 'Bushing Type', keys: ['bushing_type'] },
                          { label: 'Pitch Dia', keys: ['pitch_diameter'] },
                          { label: 'Material', keys: ['material'] },
                        ];
                      }
                      if (catId === 'cat-belts') {
                        return [
                          { label: 'Profile', keys: ['profile'] },
                          { label: 'Pitch (mm)', keys: ['pitch_mm'] },
                          { label: 'Width (mm)', keys: ['width_mm'] },
                          { label: 'Length (mm)', keys: ['length_mm'] },
                          { label: 'Teeth', keys: ['teeth'] },
                          { label: 'Construction', keys: ['construction'] },
                        ];
                      }
                      if (catId === 'cat-sprockets') {
                        return [
                          { label: 'ANSI #', keys: ['ansi_number', 'ansi_chain_number'] },
                          { label: 'Teeth', keys: ['teeth'] },
                          { label: 'Hub Style', keys: ['hub_style'] },
                          { label: 'Bore Type', keys: ['bore_type'] },
                          { label: 'Material', keys: ['material'] },
                          { label: 'Hardened', keys: ['hardened_teeth'] },
                        ];
                      }
                      if (catId === 'cat-bushings') {
                        return [
                          { label: 'Type', keys: ['bushing_type'] },
                          { label: 'Series', keys: ['series'] },
                          { label: 'Max Bore', keys: ['max_bore'] },
                          { label: 'Bore Type', keys: ['bore_type'] },
                          { label: 'OD', keys: ['outer_diameter'] },
                          { label: 'Length', keys: ['length'] },
                        ];
                      }
                      if (catId === 'cat-couplings') {
                        return [
                          { label: 'Type', keys: ['coupling_type'] },
                          { label: 'Series/Size', keys: ['series_size'] },
                          { label: 'Max Bore', keys: ['max_bore'] },
                          { label: 'Material', keys: ['material'] },
                          { label: 'Torque', keys: ['nominal_torque'] },
                          { label: 'Max RPM', keys: ['max_rpm'] },
                        ];
                      }
                      if (catId === 'cat-engchain') {
                        return [
                          { label: 'Series', keys: ['series'] },
                          { label: 'Type', keys: ['chain_type'] },
                          { label: 'Pitch', keys: ['pitch', 'pitch_inches'] },
                          { label: 'Tensile', keys: ['avg_tensile'] },
                          { label: 'Pin Style', keys: ['pin_style'] },
                          { label: 'Attachment', keys: ['attachment'] },
                        ];
                      }
                      if (catId === 'cat-gearboxes') {
                        return [
                          { label: 'Series', keys: ['series'] },
                          { label: 'Gearing', keys: ['gearing_style'] },
                          { label: 'Orientation', keys: ['orientation'] },
                          { label: 'Max HP', keys: ['max_input_hp'] },
                          { label: 'Torque', keys: ['output_torque'] },
                          { label: 'Ratio', keys: ['ratio_range'] },
                        ];
                      }
                      if (catId === 'cat-gearmotors') {
                        return [
                          { label: 'HP', keys: ['horsepower'] },
                          { label: 'Output RPM', keys: ['output_rpm'] },
                          { label: 'Ratio', keys: ['ratio'] },
                          { label: 'Torque (lb-in)', keys: ['torque'] },
                          { label: 'Series', keys: ['series'] },
                          { label: 'Enclosure', keys: ['enclosure_type'] },
                          { label: 'Voltage', keys: ['voltage'] },
                          { label: 'Phase', keys: ['phase'] },
                          { label: 'Motor Type', keys: ['motor_type'] },
                        ];
                      }
                      // Generic fallback
                      return Object.keys(sp || {})
                        .filter(k => sp[k] !== undefined && sp[k] !== null && sp[k] !== '')
                        .slice(0, 6)
                        .map(k => ({
                          label: k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                          keys: [k],
                        }));
                    })();

                    return tiles
                      .filter(t => val(...t.keys))
                      .map(t => (
                        <div key={t.label} className="bg-cream-100 dark:bg-navy-900 rounded-lg px-3 py-2">
                          <p className="text-[10px] text-cream-400 uppercase tracking-wider font-medium">{t.label}</p>
                          <p className="text-sm font-semibold text-navy-800 dark:text-cream-200">{val(...t.keys)}</p>
                        </div>
                      ));
                  })()}
                </div>
              </div>
            </div>

            {/* Crossover matches */}
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-navy-500 dark:text-cream-400 uppercase tracking-wider">
                  Crossover Matches
                  <span className="ml-2 text-accent font-bold">{crossoverMatches.length}</span>
                </h2>
                {crossoverMatches.length > 0 && (
                  <p className="text-xs text-cream-400">
                    From {Object.keys(matchesByManufacturer).length} manufacturer{Object.keys(matchesByManufacturer).length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {crossoverMatches.length === 0 && (
                <div className="card p-12 text-center">
                  <svg className="w-12 h-12 text-cream-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <h3 className="text-lg font-medium text-navy-700 dark:text-cream-300">No crossover matches found</h3>
                  <p className="text-sm text-navy-500 dark:text-cream-400 mt-2">
                    No products from other manufacturers match the key specifications of this product.
                  </p>
                </div>
              )}

              {/* Grouped by manufacturer */}
              {Object.entries(matchesByManufacturer).map(([mfrName, matches]) => (
                <div key={mfrName} className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-sm font-semibold text-navy-800 dark:text-cream-200">{mfrName}</h3>
                    <span className="text-xs text-cream-400">({matches.length} match{matches.length !== 1 ? 'es' : ''})</span>
                  </div>
                  <div className="space-y-3">
                    {matches.map(match => (
                      <CrossoverCard key={match.product.id} match={match} source={sourceProduct} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty state — no search yet */}
        {!initialModel && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="card p-12">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-navy-800 dark:text-cream-200">How it works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 text-left">
                <div>
                  <div className="w-8 h-8 rounded-full bg-navy-800 text-white flex items-center justify-center text-sm font-bold mb-2">1</div>
                  <p className="text-sm font-medium text-navy-800 dark:text-cream-200">Enter a part number</p>
                  <p className="text-xs text-navy-500 dark:text-cream-400 mt-1">Model number, catalog number, or product ID</p>
                </div>
                <div>
                  <div className="w-8 h-8 rounded-full bg-navy-800 text-white flex items-center justify-center text-sm font-bold mb-2">2</div>
                  <p className="text-sm font-medium text-navy-800 dark:text-cream-200">We pull the specs</p>
                  <p className="text-xs text-navy-500 dark:text-cream-400 mt-1">HP, voltage, frame size, enclosure, RPM, and more</p>
                </div>
                <div>
                  <div className="w-8 h-8 rounded-full bg-navy-800 text-white flex items-center justify-center text-sm font-bold mb-2">3</div>
                  <p className="text-sm font-medium text-navy-800 dark:text-cream-200">Get crossovers</p>
                  <p className="text-xs text-navy-500 dark:text-cream-400 mt-1">All matching products from other manufacturers, ranked by spec match</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
