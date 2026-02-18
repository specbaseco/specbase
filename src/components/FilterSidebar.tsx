'use client';

import { useState } from 'react';
import { categories, manufacturers, categoryManufacturers } from '@/lib/data';
import { formatHP } from '@/lib/search-parser';
import { Product } from '@/types';

export interface SpecFilters {
  // Motor — Primary
  hp: string;
  kw: string;
  phase: string;
  voltage: string;
  rpm: string;
  frame: string;
  enclosure: string;
  ipCode: string;
  mounting: string;
  frequency: string;
  rotation: string;
  electricalType: string;
  // Motor — More Options
  efficiencyClass: string;
  efficiencyPercent: string;
  powerFactor: string;
  fullLoadAmps: string;
  serviceFactor: string;
  insulationClass: string;
  nemaDesign: string;
  weight: string;
  // Roller Chain — Primary
  chainType: string;
  ansiChainNumber: string;
  pitchInches: string;
  numberOfStrands: string;
  material: string;
  // Roller Chain — More Options
  lubeFree: string;
  corrosionResistant: string;
  preLoaded: string;
  connectingLinkType: string;
  countryOfOrigin: string;
}

interface FilterSidebarProps {
  selectedCategory: string;
  selectedManufacturer: string;
  onCategoryChange: (category: string) => void;
  onManufacturerChange: (manufacturer: string) => void;
  results?: Product[];
  specFilters?: SpecFilters;
  onSpecFilterChange?: (key: keyof SpecFilters, value: string) => void;
}

function getDistinctValues(results: Product[], specKey: string): string[] {
  const values = new Set<string>();
  results.forEach(p => {
    const val = p.specifications?.[specKey];
    if (val !== undefined && val !== null) {
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

const defaultSpecFilters: SpecFilters = {
  // Motor
  hp: '', kw: '', phase: '', voltage: '', rpm: '', frame: '',
  enclosure: '', ipCode: '', mounting: '', frequency: '', rotation: '', electricalType: '',
  efficiencyClass: '', efficiencyPercent: '', powerFactor: '', fullLoadAmps: '',
  serviceFactor: '', insulationClass: '', nemaDesign: '', weight: '',
  // Roller Chain
  chainType: '', ansiChainNumber: '', pitchInches: '', numberOfStrands: '', material: '',
  lubeFree: '', corrosionResistant: '', preLoaded: '', connectingLinkType: '', countryOfOrigin: '',
};

// Collapsible filter section
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
        className="w-full flex items-center justify-between py-2.5 text-left group"
      >
        <span className="text-xs font-semibold text-navy-600 dark:text-cream-400 uppercase tracking-wider group-hover:text-navy-800 dark:group-hover:text-cream-200">
          {title}
          {count !== undefined && count > 0 && (
            <span className="ml-1.5 text-[10px] font-medium bg-accent/15 text-accent px-1.5 py-0.5 rounded-full normal-case tracking-normal">
              {count}
            </span>
          )}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-navy-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-2.5">
          {children}
        </div>
      )}
    </div>
  );
}

// Compact chip-style filter options
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
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              isSelected
                ? 'bg-accent text-white shadow-sm'
                : 'bg-cream-100 dark:bg-navy-900 text-navy-600 dark:text-cream-400 hover:bg-cream-200 dark:hover:bg-navy-700 border border-cream-300 dark:border-navy-700'
            }`}
          >
            {displayVal}
          </button>
        );
      })}
    </div>
  );
}

// List-style filter options (for category/manufacturer)
function FilterList({
  items,
  selected,
  onSelect,
  allLabel,
}: {
  items: { value: string; label: string }[];
  selected: string;
  onSelect: (value: string) => void;
  allLabel: string;
}) {
  return (
    <div className="space-y-0.5 max-h-48 overflow-y-auto">
      <button
        onClick={() => onSelect('')}
        className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
          !selected ? 'bg-accent/10 text-accent font-medium' : 'text-navy-600 dark:text-cream-400 hover:bg-cream-100 dark:hover:bg-navy-700'
        }`}
      >
        {allLabel}
      </button>
      {items.map(item => (
        <button
          key={item.value}
          onClick={() => onSelect(item.value === selected ? '' : item.value)}
          className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
            item.value === selected ? 'bg-accent/10 text-accent font-medium' : 'text-navy-600 dark:text-cream-400 hover:bg-cream-100 dark:hover:bg-navy-700'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

// "More Options" collapsible wrapper
function MoreOptionsSection({
  children,
  moreActiveCount,
}: {
  children: React.ReactNode;
  moreActiveCount: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2.5 text-left group"
      >
        <span className="text-xs font-semibold text-navy-500 dark:text-cream-400 uppercase tracking-wider group-hover:text-navy-700 dark:group-hover:text-cream-300">
          More Options
          {moreActiveCount > 0 && (
            <span className="ml-1.5 text-[10px] font-medium bg-accent/15 text-accent px-1.5 py-0.5 rounded-full normal-case tracking-normal">
              {moreActiveCount}
            </span>
          )}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-navy-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="border-t border-cream-200 dark:border-navy-700 pt-1">
          {children}
        </div>
      )}
    </div>
  );
}

export default function FilterSidebar({
  selectedCategory,
  selectedManufacturer,
  onCategoryChange,
  onManufacturerChange,
  results = [],
  specFilters = defaultSpecFilters,
  onSpecFilterChange,
}: FilterSidebarProps) {
  const relevantManufacturers = selectedCategory
    ? manufacturers.filter(m => {
        const catMfrs = categoryManufacturers[selectedCategory] || [];
        return catMfrs.includes(m.id);
      })
    : manufacturers;

  // Compute facets from results — Primary
  const hpValues = getDistinctValues(results, 'horsepower');
  const kwValues = getDistinctValues(results, 'kilowatts');
  const phaseValues = getDistinctValues(results, 'phase');
  const voltageValues = getDistinctValues(results, 'voltage');
  const rpmValues = getDistinctValues(results, 'rpm_synchronous');
  const frameValues = getDistinctValues(results, 'frame_size');
  const enclosureValues = getDistinctValues(results, 'enclosure_type');
  const ipValues = getDistinctValues(results, 'ip_rating');
  const mountingValues = getDistinctValues(results, 'mounting');
  const freqValues = getDistinctValues(results, 'frequency_hz');
  const rotationValues = getDistinctValues(results, 'rotation');
  const electricalValues = getDistinctValues(results, 'electrical_type');

  // Compute facets from results — More Options (Motors)
  const effClassValues = getDistinctValues(results, 'efficiency_class');
  const effPercentValues = getDistinctValues(results, 'efficiency_percent');
  const pfValues = getDistinctValues(results, 'power_factor');
  const flaValues = getDistinctValues(results, 'full_load_amps');
  const sfValues = getDistinctValues(results, 'service_factor');
  const insClassValues = getDistinctValues(results, 'insulation_class');
  const nemaValues = getDistinctValues(results, 'nema_design');
  const weightValues = getDistinctValues(results, 'weight_kg');

  // Compute facets from results — Roller Chain Primary
  const chainTypeValues = getDistinctValues(results, 'chain_type');
  const ansiNumberValues = getDistinctValues(results, 'ansi_chain_number');
  const pitchValues = getDistinctValues(results, 'pitch_inches');
  const strandsValues = getDistinctValues(results, 'number_of_strands');
  const materialValues = getDistinctValues(results, 'material');

  // Compute facets from results — Roller Chain More Options
  const lubeFreeValues = getDistinctValues(results, 'lube_free');
  const corrosionValues = getDistinctValues(results, 'corrosion_resistant');
  const preLoadedValues = getDistinctValues(results, 'pre_loaded');
  const connectingLinkValues = getDistinctValues(results, 'connecting_link_type');
  const countryValues = getDistinctValues(results, 'country_of_origin');

  const handleSpecFilter = (key: keyof SpecFilters, value: string) => {
    if (onSpecFilterChange) {
      onSpecFilterChange(key, value);
    }
  };

  // Count active filters for badges
  const primaryKeys: (keyof SpecFilters)[] = [
    'hp', 'kw', 'phase', 'voltage', 'rpm', 'frame',
    'enclosure', 'ipCode', 'mounting', 'frequency', 'rotation', 'electricalType',
    'chainType', 'ansiChainNumber', 'pitchInches', 'numberOfStrands', 'material',
  ];
  const moreKeys: (keyof SpecFilters)[] = [
    'efficiencyClass', 'efficiencyPercent', 'powerFactor', 'fullLoadAmps',
    'serviceFactor', 'insulationClass', 'nemaDesign', 'weight',
    'lubeFree', 'corrosionResistant', 'preLoaded', 'connectingLinkType', 'countryOfOrigin',
  ];
  const activePrimaryCount = primaryKeys.filter(k => specFilters[k] !== '').length;
  const activeMoreCount = moreKeys.filter(k => specFilters[k] !== '').length;
  const totalActiveCount = activePrimaryCount + activeMoreCount;

  return (
    <aside className="w-full lg:w-56 xl:w-60 flex-shrink-0">
      <div className="bg-white dark:bg-navy-800 rounded-xl border border-cream-300 dark:border-navy-700 overflow-hidden">
        {/* Filter header */}
        <div className="px-4 py-2.5 bg-navy-800 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="text-sm font-semibold">Filters</span>
            </div>
            {totalActiveCount > 0 && (
              <span className="text-[10px] font-medium bg-accent px-1.5 py-0.5 rounded-full">
                {totalActiveCount}
              </span>
            )}
          </div>
        </div>

        <div className="px-3">
          {/* Category */}
          <FilterSection title="Category" defaultOpen={!!selectedCategory}>
            <FilterList
              items={categories.map(c => ({ value: c.id, label: c.name }))}
              selected={selectedCategory}
              onSelect={onCategoryChange}
              allLabel="All Categories"
            />
          </FilterSection>

          {/* Manufacturer */}
          <FilterSection title="Brand" defaultOpen={!!selectedManufacturer}>
            <FilterList
              items={relevantManufacturers.map(m => ({ value: m.slug, label: m.name }))}
              selected={selectedManufacturer}
              onSelect={onManufacturerChange}
              allLabel="All Brands"
            />
          </FilterSection>

          {/* ─── Primary Spec Filters ─── */}

          {/* Horsepower */}
          {hpValues.length >= 2 && (
            <FilterSection title="Horsepower" defaultOpen={true} count={specFilters.hp ? 1 : 0}>
              <FilterChips
                values={hpValues}
                selected={specFilters.hp}
                onSelect={(v) => handleSpecFilter('hp', v)}
                formatFn={(v) => formatHP(parseFloat(v)) + ' HP'}
              />
            </FilterSection>
          )}

          {/* Kilowatts */}
          {kwValues.length >= 2 && (
            <FilterSection title="Kilowatts" defaultOpen={true} count={specFilters.kw ? 1 : 0}>
              <FilterChips
                values={kwValues}
                selected={specFilters.kw}
                onSelect={(v) => handleSpecFilter('kw', v)}
                formatFn={(v) => v + ' kW'}
              />
            </FilterSection>
          )}

          {/* Phase */}
          {phaseValues.length >= 2 && (
            <FilterSection title="Phase" defaultOpen={true} count={specFilters.phase ? 1 : 0}>
              <FilterChips
                values={phaseValues}
                selected={specFilters.phase}
                onSelect={(v) => handleSpecFilter('phase', v)}
                formatFn={(v) => v === '1' ? '1-Phase' : v === '3' ? '3-Phase' : v + '-Phase'}
              />
            </FilterSection>
          )}

          {/* Voltage */}
          {voltageValues.length >= 2 && (
            <FilterSection title="Voltage" defaultOpen={true} count={specFilters.voltage ? 1 : 0}>
              <FilterChips
                values={voltageValues}
                selected={specFilters.voltage}
                onSelect={(v) => handleSpecFilter('voltage', v)}
              />
            </FilterSection>
          )}

          {/* Speed (RPM) */}
          {rpmValues.length >= 2 && (
            <FilterSection title="Speed (RPM)" defaultOpen={true} count={specFilters.rpm ? 1 : 0}>
              <FilterChips
                values={rpmValues}
                selected={specFilters.rpm}
                onSelect={(v) => handleSpecFilter('rpm', v)}
              />
            </FilterSection>
          )}

          {/* Enclosure */}
          {enclosureValues.length >= 2 && (
            <FilterSection title="Enclosure" defaultOpen={true} count={specFilters.enclosure ? 1 : 0}>
              <FilterChips
                values={enclosureValues}
                selected={specFilters.enclosure}
                onSelect={(v) => handleSpecFilter('enclosure', v)}
              />
            </FilterSection>
          )}

          {/* Frame Size */}
          {frameValues.length >= 2 && (
            <FilterSection title="Frame Size" defaultOpen={false} count={specFilters.frame ? 1 : 0}>
              <FilterChips
                values={frameValues}
                selected={specFilters.frame}
                onSelect={(v) => handleSpecFilter('frame', v)}
              />
            </FilterSection>
          )}

          {/* IP Code */}
          {ipValues.length >= 2 && (
            <FilterSection title="IP Code" defaultOpen={false} count={specFilters.ipCode ? 1 : 0}>
              <FilterChips
                values={ipValues}
                selected={specFilters.ipCode}
                onSelect={(v) => handleSpecFilter('ipCode', v)}
              />
            </FilterSection>
          )}

          {/* Mounting */}
          {mountingValues.length >= 2 && (
            <FilterSection title="Mounting" defaultOpen={false} count={specFilters.mounting ? 1 : 0}>
              <FilterChips
                values={mountingValues}
                selected={specFilters.mounting}
                onSelect={(v) => handleSpecFilter('mounting', v)}
              />
            </FilterSection>
          )}

          {/* Frequency */}
          {freqValues.length >= 2 && (
            <FilterSection title="Frequency" defaultOpen={false} count={specFilters.frequency ? 1 : 0}>
              <FilterChips
                values={freqValues}
                selected={specFilters.frequency}
                onSelect={(v) => handleSpecFilter('frequency', v)}
                formatFn={(v) => v + ' Hz'}
              />
            </FilterSection>
          )}

          {/* Rotation */}
          {rotationValues.length >= 2 && (
            <FilterSection title="Rotation" defaultOpen={false} count={specFilters.rotation ? 1 : 0}>
              <FilterChips
                values={rotationValues}
                selected={specFilters.rotation}
                onSelect={(v) => handleSpecFilter('rotation', v)}
              />
            </FilterSection>
          )}

          {/* Electrical Type */}
          {electricalValues.length >= 2 && (
            <FilterSection title="Electrical Type" defaultOpen={false} count={specFilters.electricalType ? 1 : 0}>
              <FilterChips
                values={electricalValues}
                selected={specFilters.electricalType}
                onSelect={(v) => handleSpecFilter('electricalType', v)}
              />
            </FilterSection>
          )}

          {/* ─── Roller Chain Primary Filters ─── */}

          {/* Chain Type */}
          {chainTypeValues.length >= 2 && (
            <FilterSection title="Chain Type" defaultOpen={true} count={specFilters.chainType ? 1 : 0}>
              <FilterChips
                values={chainTypeValues}
                selected={specFilters.chainType}
                onSelect={(v) => handleSpecFilter('chainType', v)}
              />
            </FilterSection>
          )}

          {/* ANSI Chain Number */}
          {ansiNumberValues.length >= 2 && (
            <FilterSection title="ANSI Chain #" defaultOpen={true} count={specFilters.ansiChainNumber ? 1 : 0}>
              <FilterChips
                values={ansiNumberValues}
                selected={specFilters.ansiChainNumber}
                onSelect={(v) => handleSpecFilter('ansiChainNumber', v)}
                formatFn={(v) => '#' + v}
              />
            </FilterSection>
          )}

          {/* Pitch */}
          {pitchValues.length >= 2 && (
            <FilterSection title="Pitch (in)" defaultOpen={true} count={specFilters.pitchInches ? 1 : 0}>
              <FilterChips
                values={pitchValues}
                selected={specFilters.pitchInches}
                onSelect={(v) => handleSpecFilter('pitchInches', v)}
                formatFn={(v) => v + '"'}
              />
            </FilterSection>
          )}

          {/* Number of Strands */}
          {strandsValues.length >= 2 && (
            <FilterSection title="Strands" defaultOpen={false} count={specFilters.numberOfStrands ? 1 : 0}>
              <FilterChips
                values={strandsValues}
                selected={specFilters.numberOfStrands}
                onSelect={(v) => handleSpecFilter('numberOfStrands', v)}
                formatFn={(v) => v === '1' ? 'Single' : v === '2' ? 'Double' : v === '3' ? 'Triple' : v + '-Strand'}
              />
            </FilterSection>
          )}

          {/* Material */}
          {materialValues.length >= 2 && (
            <FilterSection title="Material" defaultOpen={false} count={specFilters.material ? 1 : 0}>
              <FilterChips
                values={materialValues}
                selected={specFilters.material}
                onSelect={(v) => handleSpecFilter('material', v)}
              />
            </FilterSection>
          )}

          {/* ─── More Options ─── */}
          <MoreOptionsSection moreActiveCount={activeMoreCount}>
            {/* Efficiency Class */}
            {effClassValues.length >= 2 && (
              <FilterSection title="Efficiency Class" defaultOpen={false} count={specFilters.efficiencyClass ? 1 : 0}>
                <FilterChips
                  values={effClassValues}
                  selected={specFilters.efficiencyClass}
                  onSelect={(v) => handleSpecFilter('efficiencyClass', v)}
                />
              </FilterSection>
            )}

            {/* Efficiency % */}
            {effPercentValues.length >= 2 && (
              <FilterSection title="Efficiency %" defaultOpen={false} count={specFilters.efficiencyPercent ? 1 : 0}>
                <FilterChips
                  values={effPercentValues}
                  selected={specFilters.efficiencyPercent}
                  onSelect={(v) => handleSpecFilter('efficiencyPercent', v)}
                  formatFn={(v) => v + '%'}
                />
              </FilterSection>
            )}

            {/* Power Factor */}
            {pfValues.length >= 2 && (
              <FilterSection title="Power Factor" defaultOpen={false} count={specFilters.powerFactor ? 1 : 0}>
                <FilterChips
                  values={pfValues}
                  selected={specFilters.powerFactor}
                  onSelect={(v) => handleSpecFilter('powerFactor', v)}
                />
              </FilterSection>
            )}

            {/* Full Load Amps */}
            {flaValues.length >= 2 && (
              <FilterSection title="Full Load Amps" defaultOpen={false} count={specFilters.fullLoadAmps ? 1 : 0}>
                <FilterChips
                  values={flaValues}
                  selected={specFilters.fullLoadAmps}
                  onSelect={(v) => handleSpecFilter('fullLoadAmps', v)}
                  formatFn={(v) => v + 'A'}
                />
              </FilterSection>
            )}

            {/* Service Factor */}
            {sfValues.length >= 2 && (
              <FilterSection title="Service Factor" defaultOpen={false} count={specFilters.serviceFactor ? 1 : 0}>
                <FilterChips
                  values={sfValues}
                  selected={specFilters.serviceFactor}
                  onSelect={(v) => handleSpecFilter('serviceFactor', v)}
                />
              </FilterSection>
            )}

            {/* Insulation Class */}
            {insClassValues.length >= 2 && (
              <FilterSection title="Insulation Class" defaultOpen={false} count={specFilters.insulationClass ? 1 : 0}>
                <FilterChips
                  values={insClassValues}
                  selected={specFilters.insulationClass}
                  onSelect={(v) => handleSpecFilter('insulationClass', v)}
                  formatFn={(v) => 'Class ' + v}
                />
              </FilterSection>
            )}

            {/* NEMA Design */}
            {nemaValues.length >= 2 && (
              <FilterSection title="NEMA Design" defaultOpen={false} count={specFilters.nemaDesign ? 1 : 0}>
                <FilterChips
                  values={nemaValues}
                  selected={specFilters.nemaDesign}
                  onSelect={(v) => handleSpecFilter('nemaDesign', v)}
                  formatFn={(v) => 'Design ' + v}
                />
              </FilterSection>
            )}

            {/* Weight */}
            {weightValues.length >= 2 && (
              <FilterSection title="Weight (kg)" defaultOpen={false} count={specFilters.weight ? 1 : 0}>
                <FilterChips
                  values={weightValues}
                  selected={specFilters.weight}
                  onSelect={(v) => handleSpecFilter('weight', v)}
                  formatFn={(v) => v + ' kg'}
                />
              </FilterSection>
            )}

            {/* ─── Roller Chain More Options ─── */}

            {/* Lube-Free */}
            {lubeFreeValues.length >= 2 && (
              <FilterSection title="Lube-Free" defaultOpen={false} count={specFilters.lubeFree ? 1 : 0}>
                <FilterChips
                  values={lubeFreeValues}
                  selected={specFilters.lubeFree}
                  onSelect={(v) => handleSpecFilter('lubeFree', v)}
                />
              </FilterSection>
            )}

            {/* Corrosion Resistant */}
            {corrosionValues.length >= 2 && (
              <FilterSection title="Corrosion Resistant" defaultOpen={false} count={specFilters.corrosionResistant ? 1 : 0}>
                <FilterChips
                  values={corrosionValues}
                  selected={specFilters.corrosionResistant}
                  onSelect={(v) => handleSpecFilter('corrosionResistant', v)}
                />
              </FilterSection>
            )}

            {/* Pre-Loaded */}
            {preLoadedValues.length >= 2 && (
              <FilterSection title="Pre-Loaded" defaultOpen={false} count={specFilters.preLoaded ? 1 : 0}>
                <FilterChips
                  values={preLoadedValues}
                  selected={specFilters.preLoaded}
                  onSelect={(v) => handleSpecFilter('preLoaded', v)}
                />
              </FilterSection>
            )}

            {/* Connecting Link */}
            {connectingLinkValues.length >= 2 && (
              <FilterSection title="Connecting Link" defaultOpen={false} count={specFilters.connectingLinkType ? 1 : 0}>
                <FilterChips
                  values={connectingLinkValues}
                  selected={specFilters.connectingLinkType}
                  onSelect={(v) => handleSpecFilter('connectingLinkType', v)}
                />
              </FilterSection>
            )}

            {/* Country of Origin */}
            {countryValues.length >= 2 && (
              <FilterSection title="Country of Origin" defaultOpen={false} count={specFilters.countryOfOrigin ? 1 : 0}>
                <FilterChips
                  values={countryValues}
                  selected={specFilters.countryOfOrigin}
                  onSelect={(v) => handleSpecFilter('countryOfOrigin', v)}
                />
              </FilterSection>
            )}
          </MoreOptionsSection>
        </div>
      </div>
    </aside>
  );
}
