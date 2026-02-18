'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';
import FilterSidebar, { SpecFilters } from '@/components/FilterSidebar';
import { searchProducts, categories, manufacturers, products } from '@/lib/data';
import { formatHP } from '@/lib/search-parser';

const emptyFilters: SpecFilters = {
  // Motor
  hp: '', kw: '', phase: '', voltage: '', rpm: '', frame: '',
  enclosure: '', ipCode: '', mounting: '', frequency: '', rotation: '', electricalType: '',
  efficiencyClass: '', efficiencyPercent: '', powerFactor: '', fullLoadAmps: '',
  serviceFactor: '', insulationClass: '', nemaDesign: '', weight: '',
  // Roller Chain
  chainType: '', ansiChainNumber: '', pitchInches: '', numberOfStrands: '', material: '',
  lubeFree: '', corrosionResistant: '', preLoaded: '', connectingLinkType: '', countryOfOrigin: '',
};

export default function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';

  const [query] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [specFilters, setSpecFilters] = useState<SpecFilters>({ ...emptyFilters });

  // Primary search results (from query + category + manufacturer)
  const primaryResults = useMemo(() => {
    let results = searchProducts(query || '');

    // Apply category filter
    if (selectedCategory) {
      const cat = categories.find(c => c.slug === selectedCategory);
      if (cat) results = results.filter(p => p.category_id === cat.id);
    }

    // Apply manufacturer filter
    if (selectedManufacturer) {
      const mfr = manufacturers.find(m => m.slug === selectedManufacturer || m.id === selectedManufacturer);
      if (mfr) results = results.filter(p => p.manufacturer_id === mfr.id);
    }

    return results;
  }, [query, selectedCategory, selectedManufacturer]);

  // Apply spec filters on top of primary results
  const results = useMemo(() => {
    let filtered = [...primaryResults];

    // Primary filters — all specs are now strings
    if (specFilters.hp) {
      filtered = filtered.filter(p => parseFloat(String(p.specifications?.horsepower)) === parseFloat(specFilters.hp));
    }
    if (specFilters.kw) {
      filtered = filtered.filter(p => parseFloat(String(p.specifications?.kw)) === parseFloat(specFilters.kw));
    }
    if (specFilters.phase) {
      filtered = filtered.filter(p => String(p.specifications?.phase) === specFilters.phase);
    }
    if (specFilters.voltage) {
      filtered = filtered.filter(p => p.specifications?.voltage === specFilters.voltage);
    }
    if (specFilters.rpm) {
      filtered = filtered.filter(p => String(p.specifications?.rpm_full_load) === specFilters.rpm);
    }
    if (specFilters.frame) {
      filtered = filtered.filter(p => p.specifications?.frame_size === specFilters.frame);
    }
    if (specFilters.enclosure) {
      filtered = filtered.filter(p => p.specifications?.enclosure_type === specFilters.enclosure);
    }
    if (specFilters.ipCode) {
      filtered = filtered.filter(p => p.specifications?.ip_code === specFilters.ipCode);
    }
    if (specFilters.mounting) {
      filtered = filtered.filter(p => p.specifications?.mounting === specFilters.mounting);
    }
    if (specFilters.frequency) {
      filtered = filtered.filter(p => String(p.specifications?.frequency) === specFilters.frequency);
    }
    if (specFilters.rotation) {
      filtered = filtered.filter(p => p.specifications?.rotation === specFilters.rotation);
    }
    if (specFilters.electricalType) {
      filtered = filtered.filter(p => p.specifications?.electrical_type === specFilters.electricalType);
    }

    // ─── Roller Chain Primary Filters ───
    if (specFilters.chainType) {
      filtered = filtered.filter(p => p.specifications?.chain_type === specFilters.chainType);
    }
    if (specFilters.ansiChainNumber) {
      filtered = filtered.filter(p => String(p.specifications?.ansi_chain_number) === specFilters.ansiChainNumber);
    }
    if (specFilters.pitchInches) {
      filtered = filtered.filter(p => String(p.specifications?.pitch_inches) === specFilters.pitchInches);
    }
    if (specFilters.numberOfStrands) {
      filtered = filtered.filter(p => String(p.specifications?.number_of_strands) === specFilters.numberOfStrands);
    }
    if (specFilters.material) {
      filtered = filtered.filter(p => p.specifications?.material === specFilters.material);
    }

    // More Options filters
    if (specFilters.efficiencyClass) {
      filtered = filtered.filter(p => p.specifications?.efficiency_class === specFilters.efficiencyClass);
    }
    if (specFilters.efficiencyPercent) {
      filtered = filtered.filter(p => String(p.specifications?.efficiency_percent) === specFilters.efficiencyPercent);
    }
    if (specFilters.powerFactor) {
      filtered = filtered.filter(p => String(p.specifications?.power_factor) === specFilters.powerFactor);
    }
    if (specFilters.fullLoadAmps) {
      filtered = filtered.filter(p => String(p.specifications?.full_load_amps) === specFilters.fullLoadAmps);
    }
    if (specFilters.serviceFactor) {
      filtered = filtered.filter(p => String(p.specifications?.service_factor) === specFilters.serviceFactor);
    }
    if (specFilters.insulationClass) {
      filtered = filtered.filter(p => p.specifications?.insulation_class === specFilters.insulationClass);
    }
    if (specFilters.nemaDesign) {
      filtered = filtered.filter(p => p.specifications?.nema_design === specFilters.nemaDesign);
    }
    if (specFilters.weight) {
      filtered = filtered.filter(p => String(p.specifications?.weight_kg) === specFilters.weight);
    }

    // ─── Roller Chain More Options Filters ───
    if (specFilters.lubeFree) {
      filtered = filtered.filter(p => p.specifications?.lube_free === specFilters.lubeFree);
    }
    if (specFilters.corrosionResistant) {
      filtered = filtered.filter(p => p.specifications?.corrosion_resistant === specFilters.corrosionResistant);
    }
    if (specFilters.preLoaded) {
      filtered = filtered.filter(p => p.specifications?.pre_loaded === specFilters.preLoaded);
    }
    if (specFilters.connectingLinkType) {
      filtered = filtered.filter(p => p.specifications?.connecting_link_type === specFilters.connectingLinkType);
    }
    if (specFilters.countryOfOrigin) {
      filtered = filtered.filter(p => p.specifications?.country_of_origin === specFilters.countryOfOrigin);
    }

    // Sort
    if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'manufacturer') filtered.sort((a, b) => {
      const mfrA = manufacturers.find(m => m.id === a.manufacturer_id)?.name || '';
      const mfrB = manufacturers.find(m => m.id === b.manufacturer_id)?.name || '';
      return mfrA.localeCompare(mfrB);
    });

    return filtered;
  }, [primaryResults, specFilters, sortBy]);

  const categoryName = selectedCategory
    ? categories.find(c => c.id === selectedCategory || c.slug === selectedCategory)?.name
    : null;

  const handleSpecFilterChange = (key: keyof SpecFilters, value: string) => {
    setSpecFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearSpecFilter = (key: keyof SpecFilters) => {
    setSpecFilters(prev => ({ ...prev, [key]: '' }));
  };

  const clearAllFilters = () => {
    setSpecFilters({ ...emptyFilters });
    setSelectedCategory('');
    setSelectedManufacturer('');
  };

  // Build active filter chips for display
  type FilterChip = { key: keyof SpecFilters; label: string; value: string };
  const activeFilters: FilterChip[] = [];

  // Primary
  if (specFilters.hp) activeFilters.push({ key: 'hp', label: 'HP', value: formatHP(parseFloat(specFilters.hp)) });
  if (specFilters.kw) activeFilters.push({ key: 'kw', label: 'kW', value: specFilters.kw });
  if (specFilters.phase) activeFilters.push({ key: 'phase', label: 'Phase', value: specFilters.phase === '1' ? '1-Phase' : '3-Phase' });
  if (specFilters.voltage) activeFilters.push({ key: 'voltage', label: 'Voltage', value: specFilters.voltage });
  if (specFilters.rpm) activeFilters.push({ key: 'rpm', label: 'RPM', value: specFilters.rpm });
  if (specFilters.frame) activeFilters.push({ key: 'frame', label: 'Frame', value: specFilters.frame });
  if (specFilters.enclosure) activeFilters.push({ key: 'enclosure', label: 'Enclosure', value: specFilters.enclosure });
  if (specFilters.ipCode) activeFilters.push({ key: 'ipCode', label: 'IP Code', value: specFilters.ipCode });
  if (specFilters.mounting) activeFilters.push({ key: 'mounting', label: 'Mounting', value: specFilters.mounting });
  if (specFilters.frequency) activeFilters.push({ key: 'frequency', label: 'Frequency', value: specFilters.frequency + ' Hz' });
  if (specFilters.rotation) activeFilters.push({ key: 'rotation', label: 'Rotation', value: specFilters.rotation });
  if (specFilters.electricalType) activeFilters.push({ key: 'electricalType', label: 'Electrical', value: specFilters.electricalType });

  // Motor More Options
  if (specFilters.efficiencyClass) activeFilters.push({ key: 'efficiencyClass', label: 'Eff. Class', value: specFilters.efficiencyClass });
  if (specFilters.efficiencyPercent) activeFilters.push({ key: 'efficiencyPercent', label: 'Efficiency', value: specFilters.efficiencyPercent + '%' });
  if (specFilters.powerFactor) activeFilters.push({ key: 'powerFactor', label: 'PF', value: specFilters.powerFactor });
  if (specFilters.fullLoadAmps) activeFilters.push({ key: 'fullLoadAmps', label: 'FLA', value: specFilters.fullLoadAmps + 'A' });
  if (specFilters.serviceFactor) activeFilters.push({ key: 'serviceFactor', label: 'SF', value: specFilters.serviceFactor });
  if (specFilters.insulationClass) activeFilters.push({ key: 'insulationClass', label: 'Insulation', value: 'Class ' + specFilters.insulationClass });
  if (specFilters.nemaDesign) activeFilters.push({ key: 'nemaDesign', label: 'NEMA', value: 'Design ' + specFilters.nemaDesign });
  if (specFilters.weight) activeFilters.push({ key: 'weight', label: 'Weight', value: specFilters.weight + ' kg' });

  // Roller Chain Primary
  if (specFilters.chainType) activeFilters.push({ key: 'chainType', label: 'Type', value: specFilters.chainType });
  if (specFilters.ansiChainNumber) activeFilters.push({ key: 'ansiChainNumber', label: 'ANSI #', value: '#' + specFilters.ansiChainNumber });
  if (specFilters.pitchInches) activeFilters.push({ key: 'pitchInches', label: 'Pitch', value: specFilters.pitchInches + '"' });
  if (specFilters.numberOfStrands) activeFilters.push({ key: 'numberOfStrands', label: 'Strands', value: specFilters.numberOfStrands === '1' ? 'Single' : specFilters.numberOfStrands === '2' ? 'Double' : specFilters.numberOfStrands });
  if (specFilters.material) activeFilters.push({ key: 'material', label: 'Material', value: specFilters.material });

  // Roller Chain More Options
  if (specFilters.lubeFree) activeFilters.push({ key: 'lubeFree', label: 'Lube-Free', value: specFilters.lubeFree });
  if (specFilters.corrosionResistant) activeFilters.push({ key: 'corrosionResistant', label: 'Corrosion Resistant', value: specFilters.corrosionResistant });
  if (specFilters.preLoaded) activeFilters.push({ key: 'preLoaded', label: 'Pre-Loaded', value: specFilters.preLoaded });
  if (specFilters.connectingLinkType) activeFilters.push({ key: 'connectingLinkType', label: 'Link Type', value: specFilters.connectingLinkType });
  if (specFilters.countryOfOrigin) activeFilters.push({ key: 'countryOfOrigin', label: 'Country', value: specFilters.countryOfOrigin });

  const hasAnyFilter = activeFilters.length > 0 || selectedCategory || selectedManufacturer;

  return (
    <div className="bg-cream-100 dark:bg-navy-900 min-h-screen">
      {/* Search header */}
      <div className="bg-white dark:bg-navy-800 border-b border-cream-300 dark:border-navy-700">
        <div className="container-wide py-3 flex items-center gap-4">
          <SearchBar
            variant="compact"
            defaultValue={query}
            placeholder="Search products..."
          />
        </div>
      </div>

      <div className="container-wide py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar — compact */}
          <FilterSidebar
            selectedCategory={selectedCategory}
            selectedManufacturer={selectedManufacturer}
            onCategoryChange={(cat) => {
              setSelectedCategory(cat);
              setSpecFilters({ ...emptyFilters });
            }}
            onManufacturerChange={(mfr) => setSelectedManufacturer(mfr)}
            results={primaryResults}
            specFilters={specFilters}
            onSpecFilterChange={handleSpecFilterChange}
          />

          {/* Results — takes majority of screen */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-lg font-semibold text-navy-800 dark:text-cream-200">
                  {query
                    ? `Results for "${query}"`
                    : categoryName
                      ? categoryName
                      : 'All Products'
                  }
                </h1>
                <p className="text-sm text-navy-500 dark:text-cream-400 mt-0.5">
                  {results.length} product{results.length !== 1 ? 's' : ''} found
                  {primaryResults.length !== results.length && (
                    <span className="text-cream-400"> (filtered from {primaryResults.length})</span>
                  )}
                </p>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-cream-300 dark:border-navy-700 rounded-lg px-3 py-2 bg-white dark:bg-navy-800 text-navy-600 dark:text-cream-400 focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="name">Sort: Name A-Z</option>
                <option value="manufacturer">Sort: Manufacturer</option>
              </select>
            </div>

            {/* Active filter chips */}
            {hasAnyFilter && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs text-navy-500 dark:text-cream-400">Active:</span>
                {selectedCategory && (
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setSpecFilters({ ...emptyFilters });
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-navy-800 text-white hover:bg-navy-700 transition-colors"
                  >
                    {categoryName}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
                {selectedManufacturer && (
                  <button
                    onClick={() => setSelectedManufacturer('')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-navy-800 text-white hover:bg-navy-700 transition-colors"
                  >
                    {selectedManufacturer}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
                {activeFilters.map(f => (
                  <button
                    key={f.key}
                    onClick={() => clearSpecFilter(f.key)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-accent text-white hover:bg-accent/90 transition-colors"
                  >
                    {f.label}: {f.value}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-navy-500 dark:text-cream-400 hover:text-accent underline underline-offset-2 ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Product list */}
            {results.length > 0 ? (
              <div className="space-y-3">
                {results.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="card p-12 text-center">
                <svg className="w-12 h-12 text-cream-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-medium text-navy-700 dark:text-cream-300">No products found</h3>
                <p className="text-sm text-navy-500 dark:text-cream-400 mt-2">
                  Try adjusting your search or filters. More products are being added regularly.
                </p>
                {hasAnyFilter && (
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 text-sm text-accent hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
