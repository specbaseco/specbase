'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ProductIcon from '@/components/ProductIcon';
import { SpecFilters } from '@/components/FilterSidebar';
import { searchProducts, categories, manufacturers, products } from '@/lib/data';
import { formatHP } from '@/lib/search-parser';
import { Product } from '@/types';

// ─── Empty filter defaults (mirrors SearchContent) ───
const emptyFilters: SpecFilters = {
  hp: '', kw: '', phase: '', voltage: '', rpm: '', frame: '',
  enclosure: '', ipCode: '', mounting: '', frequency: '', rotation: '', electricalType: '',
  efficiencyClass: '', efficiencyPercent: '', powerFactor: '', fullLoadAmps: '',
  serviceFactor: '', insulationClass: '', nemaDesign: '', weight: '',
  chainType: '', ansiChainNumber: '', pitchInches: '', numberOfStrands: '', material: '',
  lubeFree: '', corrosionResistant: '', preLoaded: '', connectingLinkType: '', countryOfOrigin: '',
  housingStyle: '', internals: '', shaftSize: '', lockingType: '', lubrication: '',
  beltSection: '', beltStrands: '', beltLength: '', lengthType: '', construction: '',
  sheaveSection: '', grooves: '', bushingType: '', sheaveMaterial: '',
  profile: '', timingConstruction: '', sided: '',
  sprocketAnsi: '', teeth: '', hubStyle: '', boreType: '', sprocketMaterial: '', hardenedTeeth: '',
  bushingTypeFilter: '', bushingSeries: '', bushingBoreType: '',
  couplingType: '', couplingMaterial: '',
  engSeries: '', engChainType: '', pinStyle: '',
  gearingStyle: '', orientation: '', environment: '',
  gearmotorSeries: '', gearmotorEnclosure: '', gearmotorMotorType: '', gearmotorVoltage: '', gearmotorPhase: '',
};

// ─── Utility: extract distinct values from results ───
function getDistinctValues(results: Product[], specKey: string): string[] {
  const values = new Set<string>();
  results.forEach(p => {
    const val = p.specifications?.[specKey];
    if (val !== undefined && val !== null && val !== '') {
      values.add(String(val));
    }
  });
  return Array.from(values).sort((a, b) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.localeCompare(b);
  });
}

// ─── Filter definition per category ───
interface FilterDef {
  key: keyof SpecFilters;
  label: string;
  specKey: string;
  formatFn?: (v: string) => string;
  defaultOpen?: boolean;
}

function getFiltersForCategory(categoryId: string): FilterDef[] {
  switch (categoryId) {
    case 'cat-motors':
      return [
        { key: 'hp', label: 'Horsepower', specKey: 'horsepower', formatFn: v => formatHP(parseFloat(v)) + ' HP', defaultOpen: true },
        { key: 'phase', label: 'Phase', specKey: 'phase', defaultOpen: true },
        { key: 'voltage', label: 'Voltage', specKey: 'voltage', defaultOpen: true },
        { key: 'rpm', label: 'RPM', specKey: 'rpm_synchronous', defaultOpen: true },
        { key: 'frame', label: 'Frame Size', specKey: 'frame_size', defaultOpen: true },
        { key: 'enclosure', label: 'Enclosure', specKey: 'enclosure_type', defaultOpen: true },
        { key: 'mounting', label: 'Mounting', specKey: 'mounting' },
        { key: 'rotation', label: 'Rotation', specKey: 'rotation' },
        { key: 'electricalType', label: 'Electrical Type', specKey: 'electrical_type' },
        { key: 'efficiencyClass', label: 'Efficiency Class', specKey: 'efficiency_class' },
        { key: 'kw', label: 'Kilowatts', specKey: 'kilowatts' },
      ];
    case 'cat-bearings':
      return [
        { key: 'housingStyle', label: 'Housing Style', specKey: 'housing_style', defaultOpen: true },
        { key: 'internals', label: 'Internals', specKey: 'internals', defaultOpen: true },
        { key: 'shaftSize', label: 'Shaft Size', specKey: 'shaft_size', defaultOpen: true },
        { key: 'lockingType', label: 'Locking Type', specKey: 'locking_type', defaultOpen: true },
        { key: 'lubrication', label: 'Lubrication', specKey: 'lubrication' },
      ];
    case 'cat-chain':
      return [
        { key: 'ansiChainNumber', label: 'ANSI #', specKey: 'ansi_chain_number', defaultOpen: true },
        { key: 'pitchInches', label: 'Pitch', specKey: 'pitch_inches', defaultOpen: true },
        { key: 'numberOfStrands', label: 'Strands', specKey: 'number_of_strands', defaultOpen: true },
        { key: 'material', label: 'Material', specKey: 'material', defaultOpen: true },
        { key: 'chainType', label: 'Chain Type', specKey: 'chain_type' },
      ];
    case 'cat-vbelts':
      return [
        { key: 'beltSection', label: 'Section', specKey: 'section', defaultOpen: true },
        { key: 'beltLength', label: 'Length', specKey: 'length', defaultOpen: true },
        { key: 'lengthType', label: 'Length Type', specKey: 'length_type', defaultOpen: true },
        { key: 'beltStrands', label: 'Strands', specKey: 'strands' },
        { key: 'construction', label: 'Construction', specKey: 'construction' },
      ];
    case 'cat-sheaves':
      return [
        { key: 'sheaveSection', label: 'Belt Section', specKey: 'belt_section', defaultOpen: true },
        { key: 'grooves', label: 'Grooves', specKey: 'grooves', defaultOpen: true },
        { key: 'bushingType', label: 'Bushing Type', specKey: 'bushing_type', defaultOpen: true },
        { key: 'sheaveMaterial', label: 'Material', specKey: 'material' },
      ];
    case 'cat-belts':
      return [
        { key: 'profile', label: 'Profile', specKey: 'profile', defaultOpen: true },
        { key: 'timingConstruction', label: 'Construction', specKey: 'construction', defaultOpen: true },
        { key: 'sided', label: 'Sided', specKey: 'sided', defaultOpen: true },
      ];
    case 'cat-sprockets':
      return [
        { key: 'sprocketAnsi', label: 'ANSI #', specKey: 'ansi_number', formatFn: v => '#' + v, defaultOpen: true },
        { key: 'teeth', label: 'Teeth', specKey: 'teeth', defaultOpen: true },
        { key: 'hubStyle', label: 'Hub Style', specKey: 'hub_style', defaultOpen: true },
        { key: 'boreType', label: 'Bore Type', specKey: 'bore_type' },
        { key: 'sprocketMaterial', label: 'Material', specKey: 'material' },
        { key: 'hardenedTeeth', label: 'Hardened Teeth', specKey: 'hardened_teeth' },
      ];
    case 'cat-bushings':
      return [
        { key: 'bushingTypeFilter', label: 'Bushing Type', specKey: 'bushing_type', defaultOpen: true },
        { key: 'bushingSeries', label: 'Series', specKey: 'series', defaultOpen: true },
        { key: 'bushingBoreType', label: 'Bore Type', specKey: 'bore_type' },
      ];
    case 'cat-couplings':
      return [
        { key: 'couplingType', label: 'Coupling Type', specKey: 'coupling_type', defaultOpen: true },
        { key: 'couplingMaterial', label: 'Material', specKey: 'material', defaultOpen: true },
      ];
    case 'cat-engchain':
      return [
        { key: 'engSeries', label: 'Series', specKey: 'series', defaultOpen: true },
        { key: 'engChainType', label: 'Chain Type', specKey: 'chain_type', defaultOpen: true },
        { key: 'pinStyle', label: 'Pin Style', specKey: 'pin_style' },
      ];
    case 'cat-gearboxes':
      return [
        { key: 'gearingStyle', label: 'Gearing Style', specKey: 'gearing_style', defaultOpen: true },
        { key: 'orientation', label: 'Orientation', specKey: 'orientation', defaultOpen: true },
        { key: 'environment', label: 'Environment', specKey: 'environment' },
      ];
    case 'cat-gearmotors':
      return [
        { key: 'gearmotorSeries', label: 'Series', specKey: 'series', defaultOpen: true },
        { key: 'gearmotorEnclosure', label: 'Enclosure', specKey: 'enclosure_type', defaultOpen: true },
        { key: 'gearmotorMotorType', label: 'Motor Type', specKey: 'motor_type', defaultOpen: true },
        { key: 'gearmotorVoltage', label: 'Voltage', specKey: 'voltage' },
        { key: 'gearmotorPhase', label: 'Phase', specKey: 'phase' },
      ];
    default:
      return [];
  }
}

// ─── FilterChips component ───
function FilterChips({
  values,
  selected,
  onSelect,
  formatFn,
}: {
  values: string[];
  selected: string;
  onSelect: (value: string) => void;
  formatFn?: (v: string) => string;
}) {
  if (values.length < 2) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {values.map(val => {
        const isSelected = val === selected;
        const displayVal = formatFn ? formatFn(val) : val;
        return (
          <button
            key={val}
            onClick={() => onSelect(isSelected ? '' : val)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isSelected
                ? 'bg-accent text-white shadow-sm'
                : 'bg-white dark:bg-navy-800 text-navy-600 dark:text-cream-400 hover:bg-cream-200 dark:hover:bg-navy-700 border border-cream-300 dark:border-navy-700'
            }`}
          >
            {displayVal}
          </button>
        );
      })}
    </div>
  );
}

// ─── Collapsible filter section ───
function FilterSection({
  title,
  defaultOpen = false,
  count,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  count?: number;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-cream-200 dark:border-navy-700 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-left group"
      >
        <span className="text-sm font-medium text-navy-700 dark:text-cream-300 group-hover:text-navy-900 dark:group-hover:text-cream-100">
          {title}
          {count !== undefined && count > 0 && (
            <span className="ml-2 text-[10px] font-medium bg-accent/15 text-accent px-1.5 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </span>
        <svg
          className={`w-4 h-4 text-navy-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-3">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Step Indicator ───
function StepIndicator({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  const steps = [
    { num: 1 as const, label: 'Select Category' },
    { num: 2 as const, label: 'Set Filters' },
    { num: 3 as const, label: 'View Results' },
  ];

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2">
      {steps.map((step, idx) => (
        <div key={step.num} className="flex items-center">
          <div className={`
            flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all text-xs sm:text-sm font-medium
            ${currentStep === step.num
              ? 'bg-accent text-white shadow-sm'
              : currentStep > step.num
                ? 'bg-accent/15 text-accent'
                : 'bg-cream-200 dark:bg-navy-700 text-cream-400 dark:text-navy-500'
            }
          `}>
            <span className="w-5 h-5 flex items-center justify-center font-semibold text-xs">
              {currentStep > step.num ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : step.num}
            </span>
            <span className="hidden sm:inline">{step.label}</span>
          </div>
          {idx < steps.length - 1 && (
            <svg className="w-4 h-4 mx-1 sm:mx-2 text-cream-300 dark:text-navy-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════
export default function ConfigureContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCategory = searchParams.get('category') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [specFilters, setSpecFilters] = useState<SpecFilters>({ ...emptyFilters });
  const [sortBy, setSortBy] = useState('relevance');
  const [searchQuery, setSearchQuery] = useState('');

  // ─── Derive current step ───
  const hasActiveFilters = Object.values(specFilters).some(v => v !== '');
  const currentStep: 1 | 2 | 3 = !selectedCategory ? 1 : hasActiveFilters ? 3 : 2;

  // ─── Get the resolved category ───
  const category = categories.find(c => c.slug === selectedCategory || c.id === selectedCategory);

  // ─── Primary results (category + manufacturer + search) ───
  const primaryResults = useMemo(() => {
    let results = searchQuery ? searchProducts(searchQuery) : [...products];

    if (category) {
      results = results.filter(p => p.category_id === category.id);
    }

    if (selectedManufacturer) {
      const mfr = manufacturers.find(m => m.slug === selectedManufacturer || m.id === selectedManufacturer);
      if (mfr) results = results.filter(p => p.manufacturer_id === mfr.id);
    }

    return results;
  }, [searchQuery, category, selectedManufacturer]);

  // ─── Apply spec filters on top (same logic as SearchContent) ───
  const filteredResults = useMemo(() => {
    let filtered = [...primaryResults];

    // Motor
    if (specFilters.hp) filtered = filtered.filter(p => parseFloat(String(p.specifications?.horsepower)) === parseFloat(specFilters.hp));
    if (specFilters.kw) filtered = filtered.filter(p => parseFloat(String(p.specifications?.kw)) === parseFloat(specFilters.kw));
    if (specFilters.phase) filtered = filtered.filter(p => String(p.specifications?.phase) === specFilters.phase);
    if (specFilters.voltage) filtered = filtered.filter(p => p.specifications?.voltage === specFilters.voltage);
    if (specFilters.rpm) filtered = filtered.filter(p => String(p.specifications?.rpm_full_load) === specFilters.rpm);
    if (specFilters.frame) filtered = filtered.filter(p => p.specifications?.frame_size === specFilters.frame);
    if (specFilters.enclosure) filtered = filtered.filter(p => p.specifications?.enclosure_type === specFilters.enclosure);
    if (specFilters.ipCode) filtered = filtered.filter(p => p.specifications?.ip_code === specFilters.ipCode);
    if (specFilters.mounting) filtered = filtered.filter(p => p.specifications?.mounting === specFilters.mounting);
    if (specFilters.frequency) filtered = filtered.filter(p => String(p.specifications?.frequency) === specFilters.frequency);
    if (specFilters.rotation) filtered = filtered.filter(p => p.specifications?.rotation === specFilters.rotation);
    if (specFilters.electricalType) filtered = filtered.filter(p => p.specifications?.electrical_type === specFilters.electricalType);
    if (specFilters.efficiencyClass) filtered = filtered.filter(p => p.specifications?.efficiency_class === specFilters.efficiencyClass);
    if (specFilters.efficiencyPercent) filtered = filtered.filter(p => String(p.specifications?.efficiency_percent) === specFilters.efficiencyPercent);
    if (specFilters.powerFactor) filtered = filtered.filter(p => String(p.specifications?.power_factor) === specFilters.powerFactor);
    if (specFilters.fullLoadAmps) filtered = filtered.filter(p => String(p.specifications?.full_load_amps) === specFilters.fullLoadAmps);
    if (specFilters.serviceFactor) filtered = filtered.filter(p => String(p.specifications?.service_factor) === specFilters.serviceFactor);
    if (specFilters.insulationClass) filtered = filtered.filter(p => p.specifications?.insulation_class === specFilters.insulationClass);
    if (specFilters.nemaDesign) filtered = filtered.filter(p => p.specifications?.nema_design === specFilters.nemaDesign);
    if (specFilters.weight) filtered = filtered.filter(p => String(p.specifications?.weight_kg) === specFilters.weight);

    // Roller Chain
    if (specFilters.chainType) filtered = filtered.filter(p => p.specifications?.chain_type === specFilters.chainType);
    if (specFilters.ansiChainNumber) filtered = filtered.filter(p => String(p.specifications?.ansi_chain_number) === specFilters.ansiChainNumber);
    if (specFilters.pitchInches) filtered = filtered.filter(p => String(p.specifications?.pitch_inches) === specFilters.pitchInches);
    if (specFilters.numberOfStrands) filtered = filtered.filter(p => String(p.specifications?.number_of_strands) === specFilters.numberOfStrands);
    if (specFilters.material) filtered = filtered.filter(p => p.specifications?.material === specFilters.material);
    if (specFilters.lubeFree) filtered = filtered.filter(p => p.specifications?.lube_free === specFilters.lubeFree);
    if (specFilters.corrosionResistant) filtered = filtered.filter(p => p.specifications?.corrosion_resistant === specFilters.corrosionResistant);
    if (specFilters.preLoaded) filtered = filtered.filter(p => p.specifications?.pre_loaded === specFilters.preLoaded);
    if (specFilters.connectingLinkType) filtered = filtered.filter(p => p.specifications?.connecting_link_type === specFilters.connectingLinkType);
    if (specFilters.countryOfOrigin) filtered = filtered.filter(p => p.specifications?.country_of_origin === specFilters.countryOfOrigin);

    // Bearings
    if (specFilters.housingStyle) filtered = filtered.filter(p => p.specifications?.housing_style === specFilters.housingStyle);
    if (specFilters.internals) filtered = filtered.filter(p => p.specifications?.internals === specFilters.internals);
    if (specFilters.shaftSize) filtered = filtered.filter(p => String(p.specifications?.shaft_size) === specFilters.shaftSize);
    if (specFilters.lockingType) filtered = filtered.filter(p => p.specifications?.locking_type === specFilters.lockingType);
    if (specFilters.lubrication) filtered = filtered.filter(p => p.specifications?.lubrication === specFilters.lubrication);

    // V-Belts
    if (specFilters.beltSection) filtered = filtered.filter(p => p.specifications?.section === specFilters.beltSection);
    if (specFilters.beltStrands) filtered = filtered.filter(p => String(p.specifications?.strands) === specFilters.beltStrands);
    if (specFilters.beltLength) filtered = filtered.filter(p => String(p.specifications?.length) === specFilters.beltLength);
    if (specFilters.lengthType) filtered = filtered.filter(p => p.specifications?.length_type === specFilters.lengthType);
    if (specFilters.construction) filtered = filtered.filter(p => p.specifications?.construction === specFilters.construction);

    // Sheaves
    if (specFilters.sheaveSection) filtered = filtered.filter(p => p.specifications?.belt_section === specFilters.sheaveSection);
    if (specFilters.grooves) filtered = filtered.filter(p => String(p.specifications?.grooves) === specFilters.grooves);
    if (specFilters.bushingType) filtered = filtered.filter(p => p.specifications?.bushing_type === specFilters.bushingType);
    if (specFilters.sheaveMaterial) filtered = filtered.filter(p => p.specifications?.material === specFilters.sheaveMaterial);

    // Timing Belts
    if (specFilters.profile) filtered = filtered.filter(p => p.specifications?.profile === specFilters.profile);
    if (specFilters.timingConstruction) filtered = filtered.filter(p => p.specifications?.construction === specFilters.timingConstruction);
    if (specFilters.sided) filtered = filtered.filter(p => p.specifications?.sided === specFilters.sided);

    // Sprockets
    if (specFilters.sprocketAnsi) filtered = filtered.filter(p => String(p.specifications?.ansi_number) === specFilters.sprocketAnsi);
    if (specFilters.teeth) filtered = filtered.filter(p => String(p.specifications?.teeth) === specFilters.teeth);
    if (specFilters.hubStyle) filtered = filtered.filter(p => p.specifications?.hub_style === specFilters.hubStyle);
    if (specFilters.boreType) filtered = filtered.filter(p => p.specifications?.bore_type === specFilters.boreType);
    if (specFilters.sprocketMaterial) filtered = filtered.filter(p => p.specifications?.material === specFilters.sprocketMaterial);
    if (specFilters.hardenedTeeth) filtered = filtered.filter(p => p.specifications?.hardened_teeth === specFilters.hardenedTeeth);

    // Bushings
    if (specFilters.bushingTypeFilter) filtered = filtered.filter(p => p.specifications?.bushing_type === specFilters.bushingTypeFilter);
    if (specFilters.bushingSeries) filtered = filtered.filter(p => p.specifications?.series === specFilters.bushingSeries);
    if (specFilters.bushingBoreType) filtered = filtered.filter(p => p.specifications?.bore_type === specFilters.bushingBoreType);

    // Couplings
    if (specFilters.couplingType) filtered = filtered.filter(p => p.specifications?.coupling_type === specFilters.couplingType);
    if (specFilters.couplingMaterial) filtered = filtered.filter(p => p.specifications?.material === specFilters.couplingMaterial);

    // Engineering Chain
    if (specFilters.engSeries) filtered = filtered.filter(p => p.specifications?.series === specFilters.engSeries);
    if (specFilters.engChainType) filtered = filtered.filter(p => p.specifications?.chain_type === specFilters.engChainType);
    if (specFilters.pinStyle) filtered = filtered.filter(p => p.specifications?.pin_style === specFilters.pinStyle);

    // Gearboxes
    if (specFilters.gearingStyle) filtered = filtered.filter(p => p.specifications?.gearing_style === specFilters.gearingStyle);
    if (specFilters.orientation) filtered = filtered.filter(p => p.specifications?.orientation === specFilters.orientation);
    if (specFilters.environment) filtered = filtered.filter(p => p.specifications?.environment === specFilters.environment);

    // Sort
    if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'manufacturer') {
      filtered.sort((a, b) => {
        const mfrA = manufacturers.find(m => m.id === a.manufacturer_id)?.name || '';
        const mfrB = manufacturers.find(m => m.id === b.manufacturer_id)?.name || '';
        return mfrA.localeCompare(mfrB);
      });
    }

    return filtered;
  }, [primaryResults, specFilters, sortBy]);

  // ─── Handlers ───
  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setSpecFilters({ ...emptyFilters });
    setSelectedManufacturer('');
    setSearchQuery('');
    router.replace(`/configure?category=${slug}`, { scroll: false });
  };

  const handleBackToCategories = () => {
    setSelectedCategory('');
    setSpecFilters({ ...emptyFilters });
    setSelectedManufacturer('');
    setSearchQuery('');
    router.replace('/configure', { scroll: false });
  };

  const handleBackToFilters = () => {
    setSpecFilters({ ...emptyFilters });
  };

  const handleSpecFilterChange = (key: keyof SpecFilters, value: string) => {
    setSpecFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearSpecFilter = (key: keyof SpecFilters) => {
    setSpecFilters(prev => ({ ...prev, [key]: '' }));
  };

  const clearAllFilters = () => {
    setSpecFilters({ ...emptyFilters });
  };

  // ─── Build active filter chips ───
  type FilterChipItem = { key: keyof SpecFilters; label: string; value: string };
  const activeFilterChips: FilterChipItem[] = [];
  const filterDefs = category ? getFiltersForCategory(category.id) : [];
  for (const def of filterDefs) {
    const val = specFilters[def.key];
    if (val) {
      activeFilterChips.push({
        key: def.key,
        label: def.label,
        value: def.formatFn ? def.formatFn(val) : val,
      });
    }
  }

  // ─── Category product counts ───
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of categories) {
      counts[cat.id] = products.filter(p => p.category_id === cat.id).length;
    }
    return counts;
  }, []);

  return (
    <div className="bg-cream-100 dark:bg-navy-900 min-h-screen">
      {/* Step Indicator Header */}
      <div className="bg-white dark:bg-navy-800 border-b border-cream-300 dark:border-navy-700">
        <div className="container-wide py-3">
          <StepIndicator currentStep={currentStep} />
        </div>
      </div>

      <div className="container-wide py-8">
        {/* ═══ STEP 1: Category Selection ═══ */}
        {currentStep === 1 && (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-navy-800 dark:text-cream-200 tracking-tight">
                What are you looking for?
              </h1>
              <p className="text-navy-500 dark:text-cream-400 mt-3 text-lg">
                Select a product category to start configuring
              </p>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categories.map(cat => {
                const count = categoryCounts[cat.id] || 0;
                return (
                  <button
                    key={cat.id}
                    onClick={() => count > 0 && handleCategorySelect(cat.slug)}
                    disabled={count === 0}
                    className={`text-left p-5 rounded-xl border transition-all ${
                      count > 0
                        ? 'bg-white dark:bg-navy-800 border-cream-300 dark:border-navy-700 hover:border-accent/40 hover:shadow-md cursor-pointer group'
                        : 'bg-cream-200/50 dark:bg-navy-800/50 border-cream-200 dark:border-navy-700/50 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                      count > 0
                        ? 'bg-cream-200 dark:bg-navy-700 text-navy-600 dark:text-cream-400 group-hover:bg-accent/10 group-hover:text-accent'
                        : 'bg-cream-200/60 dark:bg-navy-700/60 text-cream-400'
                    }`}>
                      <ProductIcon categoryId={cat.id} size="md" />
                    </div>

                    {/* Name */}
                    <h3 className={`text-base font-semibold mb-1 transition-colors ${
                      count > 0
                        ? 'text-navy-800 dark:text-cream-200 group-hover:text-accent'
                        : 'text-navy-500 dark:text-cream-400'
                    }`}>
                      {cat.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-navy-500 dark:text-cream-400 leading-relaxed mb-3 line-clamp-2">
                      {cat.description}
                    </p>

                    {/* Count badge */}
                    <div className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                      count > 0
                        ? 'bg-accent/10 text-accent'
                        : 'bg-cream-200 dark:bg-navy-700 text-cream-400'
                    }`}>
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                      </svg>
                      {count > 0 ? `${count} products` : 'Coming soon'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Secondary search */}
            <div className="mt-12 text-center">
              <p className="text-sm text-navy-500 dark:text-cream-400 mb-3">
                Know what you&apos;re looking for?
              </p>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search directly by model or specs
              </Link>
            </div>
          </div>
        )}

        {/* ═══ STEP 2: Filter Refinement ═══ */}
        {currentStep === 2 && category && (
          <div className="max-w-5xl mx-auto">
            {/* Breadcrumb + back */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={handleBackToCategories}
                className="flex items-center gap-1.5 text-sm text-navy-500 dark:text-cream-400 hover:text-accent transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                All Categories
              </button>
              <span className="text-cream-300 dark:text-navy-600">/</span>
              <span className="text-sm font-medium text-navy-800 dark:text-cream-200">{category.name}</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Filter Panel */}
              <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
                <div className="bg-white dark:bg-navy-800 rounded-xl border border-cream-300 dark:border-navy-700 overflow-hidden sticky top-20">
                  {/* Filter header */}
                  <div className="px-4 py-3 bg-navy-800 text-white">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                      <span className="text-sm font-semibold">Configure {category.name}</span>
                    </div>
                  </div>

                  <div className="px-4 py-2">
                    {/* Manufacturer filter */}
                    <FilterSection title="Manufacturer" defaultOpen={false}>
                      <div className="space-y-0.5 max-h-48 overflow-y-auto">
                        <button
                          onClick={() => setSelectedManufacturer('')}
                          className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                            !selectedManufacturer ? 'bg-accent/10 text-accent font-medium' : 'text-navy-600 dark:text-cream-400 hover:bg-cream-100 dark:hover:bg-navy-700'
                          }`}
                        >
                          All Manufacturers
                        </button>
                        {manufacturers
                          .filter(m => primaryResults.some(p => p.manufacturer_id === m.id))
                          .map(m => (
                            <button
                              key={m.id}
                              onClick={() => setSelectedManufacturer(m.id === selectedManufacturer ? '' : m.id)}
                              className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                                m.id === selectedManufacturer ? 'bg-accent/10 text-accent font-medium' : 'text-navy-600 dark:text-cream-400 hover:bg-cream-100 dark:hover:bg-navy-700'
                              }`}
                            >
                              {m.name}
                            </button>
                          ))}
                      </div>
                    </FilterSection>

                    {/* Category-specific filters */}
                    {filterDefs.map(def => {
                      const values = getDistinctValues(primaryResults, def.specKey);
                      if (values.length < 2) return null;
                      return (
                        <FilterSection
                          key={def.key}
                          title={def.label}
                          defaultOpen={def.defaultOpen ?? false}
                          count={specFilters[def.key] ? 1 : 0}
                        >
                          <FilterChips
                            values={values}
                            selected={specFilters[def.key]}
                            onSelect={(v) => handleSpecFilterChange(def.key, v)}
                            formatFn={def.formatFn}
                          />
                        </FilterSection>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Preview / Info Panel */}
              <div className="flex-1 min-w-0">
                <div className="card p-8 text-center">
                  {/* Category Icon */}
                  <div className="w-20 h-20 mx-auto bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-5">
                    <ProductIcon categoryId={category.id} size="lg" />
                  </div>
                  <h2 className="text-2xl font-bold text-navy-800 dark:text-cream-200 mb-2">
                    {category.name}
                  </h2>
                  <p className="text-navy-500 dark:text-cream-400 mb-6 max-w-md mx-auto">
                    {category.description}
                  </p>

                  {/* Live result count */}
                  <div className="inline-flex items-center gap-3 bg-cream-100 dark:bg-navy-900 px-6 py-4 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-bold text-navy-800 dark:text-cream-200">
                        {filteredResults.length}
                      </div>
                      <div className="text-xs text-navy-500 dark:text-cream-400">
                        products available
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <p className="mt-6 text-sm text-navy-500 dark:text-cream-400">
                    Use the filters on the left to narrow down your search.
                    <br />Click a filter value to apply it — the count updates in real-time.
                  </p>

                  {/* Quick actions */}
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        // Show all results without filters
                        setSortBy('name');
                        // Navigate to step 3 by setting a dummy filter then clearing
                        setSpecFilters(prev => ({ ...prev }));
                      }}
                      className="text-sm text-accent hover:text-accent-hover font-medium transition-colors"
                    >
                      Browse all {primaryResults.length} {category.name.toLowerCase()} &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: Product Results ═══ */}
        {currentStep === 3 && category && (
          <div className="max-w-5xl mx-auto">
            {/* Breadcrumb + back */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={handleBackToCategories}
                className="flex items-center gap-1.5 text-sm text-navy-500 dark:text-cream-400 hover:text-accent transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                All Categories
              </button>
              <span className="text-cream-300 dark:text-navy-600">/</span>
              <button
                onClick={handleBackToFilters}
                className="text-sm text-navy-500 dark:text-cream-400 hover:text-accent transition-colors"
              >
                {category.name}
              </button>
              <span className="text-cream-300 dark:text-navy-600">/</span>
              <span className="text-sm font-medium text-navy-800 dark:text-cream-200">Results</span>
            </div>

            {/* Results header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-navy-800 dark:text-cream-200">
                  {category.name} Results
                </h1>
                <p className="text-sm text-navy-500 dark:text-cream-400 mt-0.5">
                  {filteredResults.length} product{filteredResults.length !== 1 ? 's' : ''} found
                  {primaryResults.length !== filteredResults.length && (
                    <span className="text-cream-400"> (filtered from {primaryResults.length})</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToFilters}
                  className="text-sm text-accent hover:text-accent-hover font-medium transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Refine
                </button>
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
            </div>

            {/* Active filter chips */}
            {activeFilterChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs text-navy-500 dark:text-cream-400">Active:</span>
                {activeFilterChips.map(f => (
                  <button
                    key={f.key}
                    onClick={() => clearSpecFilter(f.key)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-accent text-white hover:bg-accent/90 transition-colors"
                  >
                    {f.label}: {f.value}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
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
            {filteredResults.length > 0 ? (
              <div className="space-y-3">
                {filteredResults.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="card p-12 text-center">
                <svg className="w-12 h-12 text-cream-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-medium text-navy-700 dark:text-cream-300">No products match your filters</h3>
                <p className="text-sm text-navy-500 dark:text-cream-400 mt-2">
                  Try removing some filters or selecting a different category.
                </p>
                <div className="flex justify-center gap-3 mt-6">
                  <button onClick={clearAllFilters} className="btn-primary text-sm">
                    Clear Filters
                  </button>
                  <button onClick={handleBackToCategories} className="btn-secondary text-sm">
                    Change Category
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
