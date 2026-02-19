/**
 * generate-data.ts
 * Reads Master_Template_Complete.xlsx and generates src/lib/spreadsheet-data.ts
 * with typed product arrays for each category.
 *
 * Usage: npx tsx scripts/generate-data.ts
 */

import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const EXCEL_PATH = path.resolve('/Users/jarvisjah/Downloads/Master_Template_Complete.xlsx');
const OUTPUT_PATH = path.resolve(__dirname, '../src/lib/spreadsheet-data.ts');

// ── Column → Spec Key Mappings ──

const MOTOR_MAP: Record<string, string> = {
  'HP': 'horsepower',
  'Frame Size': 'frame_size',
  'Enclosure': 'enclosure_type',
  'Speed (RPM)': 'rpm_full_load',
  'Voltage': 'voltage',
  'Phase': 'phase',
  'Mounting': 'mounting_type',
  'Rotation': 'rotation',
  'Electrical Type': 'electrical_type',
  'Efficiency %': 'efficiency_percentage',
  'FLA': 'full_load_amps',
  'Service Factor': 'service_factor',
  'Weight (lbs)': 'weight_lbs',
};

const BEARING_MAP: Record<string, string> = {
  'Housing Style': 'housing_style',
  'Internals': 'internals',
  'Shaft Size': 'shaft_size',
  'Bolt-to-Bolt': 'bolt_to_bolt',
  'Locking Type': 'locking_type',
  'Dynamic Load (lbf)': 'dynamic_load_lbf',
  'Lubrication': 'lubrication',
};

const ROLLER_CHAIN_MAP: Record<string, string> = {
  'ANSI Number': 'ansi_number',
  'Pitch (in)': 'pitch',
  'Roller Width (in)': 'roller_width',
  'Roller Diameter (in)': 'roller_diameter',
  'Pin Diameter (in)': 'pin_diameter',
  'Tensile Strength (lbf)': 'tensile_strength',
  'Strand Count': 'strand_count',
  'Material': 'material',
};

const VBELT_MAP: Record<string, string> = {
  'Section': 'section',
  'Strands': 'strands',
  'Length': 'length',
  'Length Type': 'length_type',
  'Top Width (in)': 'top_width',
  'Construction': 'construction',
  'Match-Free': 'match_free',
};

const SHEAVE_MAP: Record<string, string> = {
  'Belt Section': 'belt_section',
  'Grooves': 'grooves',
  'Bushing Type': 'bushing_type',
  'Bushing Series': 'bushing_series',
  'Pitch Dia (in)': 'pitch_diameter',
  'OD (in)': 'outer_diameter',
  'Face Width (in)': 'face_width',
  'Material': 'material',
  'Weight (lbs)': 'weight_lbs',
};

const TIMING_BELT_MAP: Record<string, string> = {
  'Profile / System': 'profile',
  'Construction / Cord Material': 'construction',
  'Single / Double': 'sided',
  'Pitch (mm)': 'pitch_mm',
  'Width (mm)': 'width_mm',
  'Length (mm)': 'length_mm',
  'Teeth': 'teeth',
};

const SPROCKET_MAP: Record<string, string> = {
  'ANSI Number': 'ansi_number',
  'Teeth': 'teeth',
  'Hub Style': 'hub_style',
  'Bore Type': 'bore_type',
  'Bushing / Bore Size': 'bore_size',
  'Hardened Teeth': 'hardened_teeth',
  'Pitch Dia (in)': 'pitch_diameter',
  'OD (in)': 'outer_diameter',
  'Material': 'material',
  'LTB': 'ltb',
};

const BUSHING_MAP: Record<string, string> = {
  'Bushing Type': 'bushing_type',
  'Series': 'series',
  'Max Bore (in)': 'max_bore',
  'Bore Type': 'bore_type',
  'Exact Bore (in)': 'exact_bore',
  'Keyway': 'keyway',
  'OD (in)': 'outer_diameter',
  'Length (in)': 'length',
  'Bolt Circle (in)': 'bolt_circle',
  'Hardware Included': 'hardware_included',
};

const COUPLING_MAP: Record<string, string> = {
  'Coupling Type': 'coupling_type',
  'Insert / Element': 'insert_element',
  'Series / Size': 'series_size',
  'Max Bore (in)': 'max_bore',
  'Material': 'material',
  'Nominal Torque (in-lbs)': 'nominal_torque',
  'Max RPM': 'max_rpm',
};

const ENG_CHAIN_MAP: Record<string, string> = {
  'Series': 'series',
  'Type': 'chain_type',
  'Pitch (in)': 'pitch',
  'Avg Tensile (lbs)': 'avg_tensile',
  'Sidebar Height (in)': 'sidebar_height',
  'Sidebar Thickness (in)': 'sidebar_thickness',
  'Pin Style': 'pin_style',
  'Attachment': 'attachment',
};

const GEARBOX_MAP: Record<string, string> = {
  'Series': 'series',
  'Orientation': 'orientation',
  'Gearing Style': 'gearing_style',
  'Input Style': 'input_style',
  'Output Style': 'output_style',
  'Environment': 'environment',
  'Ratio Range': 'ratio_range',
  'Max Input HP': 'max_input_hp',
  'Continuous Output Torque': 'continuous_output_torque',
  'Max Output Torque (lb-in)': 'output_torque',
  'Efficiency %': 'efficiency_percentage',
};

// ── Sheet name → config ──
interface SheetConfig {
  sheetName: string;
  categoryId: string;
  specMap: Record<string, string>;
  idPrefix: string;
  partNumberCol?: string;       // Column name for part number (default: 'Part Number')
  partNumberFallback?: string[]; // If no part number column, build from these columns
}

const SHEET_CONFIGS: SheetConfig[] = [
  { sheetName: 'Motors', categoryId: 'cat-motors', specMap: MOTOR_MAP, idPrefix: 'xl-motor' },
  { sheetName: 'Bearings', categoryId: 'cat-bearings', specMap: BEARING_MAP, idPrefix: 'xl-bearing' },
  { sheetName: 'Roller Chain', categoryId: 'cat-chain', specMap: ROLLER_CHAIN_MAP, idPrefix: 'xl-chain' },
  { sheetName: 'V Belts', categoryId: 'cat-vbelts', specMap: VBELT_MAP, idPrefix: 'xl-vbelt' },
  { sheetName: 'Sheaves', categoryId: 'cat-sheaves', specMap: SHEAVE_MAP, idPrefix: 'xl-sheave' },
  { sheetName: 'Timing Belts', categoryId: 'cat-belts', specMap: TIMING_BELT_MAP, idPrefix: 'xl-tbelt' },
  { sheetName: 'Sprockets', categoryId: 'cat-sprockets', specMap: SPROCKET_MAP, idPrefix: 'xl-sprocket' },
  { sheetName: 'Bushings', categoryId: 'cat-bushings', specMap: BUSHING_MAP, idPrefix: 'xl-bushing' },
  { sheetName: 'Couplings', categoryId: 'cat-couplings', specMap: COUPLING_MAP, idPrefix: 'xl-coupling' },
  { sheetName: 'Engineering Chain', categoryId: 'cat-engchain', specMap: ENG_CHAIN_MAP, idPrefix: 'xl-engchain', partNumberFallback: ['Series', 'Type', 'Pitch (in)'] },
  { sheetName: 'Gearboxes', categoryId: 'cat-gearboxes', specMap: GEARBOX_MAP, idPrefix: 'xl-gearbox', partNumberFallback: ['Series', 'Orientation', 'Gearing Style'] },
];

// ── Manufacturer Name Normalization ──
function normalizeManufacturer(raw: string): { id: string; name: string } {
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();

  // Map known variations to canonical names and IDs
  // Keys are LOWERCASE for matching
  const knownMap: Record<string, { id: string; name: string }> = {
    // Exact matches from spreadsheet (with parent company info)
    'abb (baldor-reliance)': { id: 'mfr-abb', name: 'ABB' },
    'abb': { id: 'mfr-abb', name: 'ABB' },
    'weg': { id: 'mfr-weg', name: 'WEG' },
    'marathon': { id: 'mfr-marathon', name: 'Marathon' },
    'marathon electric': { id: 'mfr-marathon', name: 'Marathon' },
    'leeson (regal rexnord)': { id: 'mfr-leeson', name: 'Leeson' },
    'leeson': { id: 'mfr-leeson', name: 'Leeson' },
    'nidec': { id: 'mfr-nidec', name: 'Nidec' },
    'skf': { id: 'mfr-skf', name: 'SKF' },
    'timken': { id: 'mfr-timken', name: 'Timken' },
    'ntn': { id: 'mfr-ntn', name: 'NTN' },
    'schaeffler (fag)': { id: 'mfr-schaeffler', name: 'Schaeffler (FAG/INA)' },
    'schaeffler': { id: 'mfr-schaeffler', name: 'Schaeffler (FAG/INA)' },
    'schaeffler (fag/ina)': { id: 'mfr-schaeffler', name: 'Schaeffler (FAG/INA)' },
    'u.s. tsubaki': { id: 'mfr-tsubaki', name: 'U.S. Tsubaki' },
    'tsubaki': { id: 'mfr-tsubaki', name: 'U.S. Tsubaki' },
    'diamond chain': { id: 'mfr-diamond', name: 'Diamond Chain' },
    'diamond': { id: 'mfr-diamond', name: 'Diamond Chain' },
    'daido (did)': { id: 'mfr-daido', name: 'Daido' },
    'daido': { id: 'mfr-daido', name: 'Daido' },
    'renold': { id: 'mfr-renold', name: 'Renold' },
    'rexnord (rexpro)': { id: 'mfr-rexnord', name: 'Rexnord' },
    'rexnord': { id: 'mfr-rexnord', name: 'Rexnord' },
    'gates': { id: 'mfr-gates', name: 'Gates' },
    'mbl (mitsuboshi)': { id: 'mfr-mbl', name: 'MBL' },
    'mbl': { id: 'mfr-mbl', name: 'MBL' },
    'continental (contitech)': { id: 'mfr-continental', name: 'Continental (ContiTech)' },
    'continental': { id: 'mfr-continental', name: 'Continental (ContiTech)' },
    'optibelt': { id: 'mfr-optibelt', name: 'Optibelt' },
    'browning (regal rexnord)': { id: 'mfr-browning', name: 'Browning' },
    'browning': { id: 'mfr-browning', name: 'Browning' },
    'martin sprocket': { id: 'mfr-martin', name: 'Martin Sprocket' },
    'martin': { id: 'mfr-martin', name: 'Martin Sprocket' },
    'dodge (abb)': { id: 'mfr-dodge', name: 'Dodge' },
    'dodge': { id: 'mfr-dodge', name: 'Dodge' },
    'maska': { id: 'mfr-maska', name: 'Maska' },
    'bando': { id: 'mfr-bando', name: 'Bando' },
    'linn gear': { id: 'mfr-linngear', name: 'Linn Gear' },
    'lovejoy (timken)': { id: 'mfr-lovejoy', name: 'Lovejoy' },
    'lovejoy': { id: 'mfr-lovejoy', name: 'Lovejoy' },
    'falk (rexnord)': { id: 'mfr-falk', name: 'Falk' },
    'falk': { id: 'mfr-falk', name: 'Falk' },
    'ktr': { id: 'mfr-ktr', name: 'KTR' },
    "tb wood's (altra)": { id: 'mfr-tbwoods', name: "TB Wood's" },
    "tb wood's": { id: 'mfr-tbwoods', name: "TB Wood's" },
    'tb woods': { id: 'mfr-tbwoods', name: "TB Wood's" },
    'webster industries': { id: 'mfr-webster', name: 'Webster' },
    'webster': { id: 'mfr-webster', name: 'Webster' },
    'promac': { id: 'mfr-promac', name: 'Promac' },
    'jeffrey chain': { id: 'mfr-jeffrey', name: 'Jeffrey' },
    'jeffrey': { id: 'mfr-jeffrey', name: 'Jeffrey' },
    'sew': { id: 'mfr-sew', name: 'SEW-Eurodrive' },
    'sew-eurodrive': { id: 'mfr-sew', name: 'SEW-Eurodrive' },
    'nord': { id: 'mfr-nord', name: 'Nord Drivesystems' },
    'stober': { id: 'mfr-stober', name: 'STOBER' },
    'rossi': { id: 'mfr-rossi', name: 'Rossi' },
    'bonfiglioli': { id: 'mfr-bonfiglioli', name: 'Bonfiglioli' },
    'siemens': { id: 'mfr-siemens', name: 'Siemens' },
    'baldor': { id: 'mfr-baldor', name: 'Baldor-Reliance' },
    'baldor-reliance': { id: 'mfr-baldor', name: 'Baldor-Reliance' },
  };

  if (knownMap[lower]) return knownMap[lower];

  // Generate ID for unknown manufacturers
  const slug = lower.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return { id: `mfr-${slug}`, name: trimmed };
}

// ── Main ──
function main() {
  console.log(`Reading ${EXCEL_PATH}...`);
  const wb = XLSX.readFile(EXCEL_PATH);

  const allManufacturers = new Map<string, { id: string; name: string }>();
  const categoryArrays: Record<string, string> = {};

  for (const config of SHEET_CONFIGS) {
    const ws = wb.Sheets[config.sheetName];
    if (!ws) {
      console.warn(`  ⚠ Sheet "${config.sheetName}" not found, skipping.`);
      continue;
    }

    const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(ws, { defval: '' });
    console.log(`  ${config.sheetName}: ${rows.length} rows`);

    const products: string[] = [];
    let idx = 0;

    for (const row of rows) {
      const mfrRaw = String(row['Manufacturer'] || '').trim();

      // Determine part number from column or fallback
      const partNumberCol = config.partNumberCol || 'Part Number';
      let partNumber = String(row[partNumberCol] || '').trim();

      // If no part number and fallback defined, build from multiple columns
      if (!partNumber && config.partNumberFallback) {
        partNumber = config.partNumberFallback
          .map(col => String(row[col] || '').trim())
          .filter(Boolean)
          .join(' ');
      }

      if (!mfrRaw || !partNumber) continue;

      const mfr = normalizeManufacturer(mfrRaw);
      allManufacturers.set(mfr.id, mfr);

      idx++;
      const productId = `${config.idPrefix}-${idx}`;

      // Build specifications object
      const specs: Record<string, string> = {};
      for (const [excelCol, specKey] of Object.entries(config.specMap)) {
        const val = row[excelCol];
        if (val !== undefined && val !== null && val !== '') {
          specs[specKey] = String(val).trim();
        }
      }

      // Build product name
      const namePrefix = mfr.name;
      const specSummary = buildSpecSummary(config.categoryId, specs);
      const productName = `${namePrefix} ${partNumber}${specSummary ? ' - ' + specSummary : ''}`;

      const product = {
        id: productId,
        manufacturer_id: mfr.id,
        category_id: config.categoryId,
        model_number: partNumber,
        name: productName,
        description: `${mfr.name} ${config.sheetName.replace(/s$/, '')} - ${partNumber}`,
        specifications: specs,
        image_url: null as string | null,
        is_featured: false,
        created_at: '2024-01-15',
      };

      products.push(formatProduct(product));
    }

    const varName = config.idPrefix.replace(/-/g, '_') + 'Products';
    categoryArrays[varName] = products.join(',\n');
    console.log(`    → ${products.length} valid products as ${varName}`);
  }

  // Generate output TypeScript file
  let output = `// AUTO-GENERATED by scripts/generate-data.ts — DO NOT EDIT MANUALLY\n`;
  output += `// Source: Master_Template_Complete.xlsx\n`;
  output += `// Generated: ${new Date().toISOString()}\n\n`;
  output += `import { Product } from '@/types';\n\n`;

  for (const [varName, productsStr] of Object.entries(categoryArrays)) {
    output += `export const ${varName}: Product[] = [\n${productsStr}\n];\n\n`;
  }

  // Generate new manufacturers list
  output += `// New manufacturers discovered from spreadsheet\n`;
  output += `export const spreadsheetManufacturers = [\n`;
  Array.from(allManufacturers.entries()).forEach(([id, mfr]) => {
    output += `  { id: '${id}', name: ${JSON.stringify(mfr.name)} },\n`;
  });
  output += `];\n`;

  fs.writeFileSync(OUTPUT_PATH, output, 'utf-8');
  console.log(`\nWrote ${OUTPUT_PATH}`);
  console.log(`Total manufacturers: ${allManufacturers.size}`);
}

// Build a brief spec summary for product names
function buildSpecSummary(categoryId: string, specs: Record<string, string>): string {
  switch (categoryId) {
    case 'cat-motors': {
      const parts = [];
      if (specs.horsepower) parts.push(`${specs.horsepower} HP`);
      if (specs.enclosure_type) parts.push(specs.enclosure_type);
      if (specs.frame_size) parts.push(`Frame ${specs.frame_size}`);
      return parts.join(', ');
    }
    case 'cat-bearings': {
      const parts = [];
      if (specs.housing_style) parts.push(specs.housing_style);
      if (specs.shaft_size) parts.push(`${specs.shaft_size}" Shaft`);
      return parts.join(', ');
    }
    case 'cat-chain': {
      const parts = [];
      if (specs.ansi_number) parts.push(`ANSI ${specs.ansi_number}`);
      if (specs.pitch) parts.push(`${specs.pitch}" Pitch`);
      return parts.join(', ');
    }
    case 'cat-vbelts': {
      const parts = [];
      if (specs.section) parts.push(specs.section);
      if (specs.length) parts.push(`${specs.length}"`);
      return parts.join(', ');
    }
    case 'cat-sheaves': {
      const parts = [];
      if (specs.belt_section) parts.push(specs.belt_section);
      if (specs.grooves) parts.push(`${specs.grooves}-Groove`);
      return parts.join(', ');
    }
    case 'cat-belts': {
      const parts = [];
      if (specs.profile) parts.push(specs.profile);
      if (specs.width_mm) parts.push(`${specs.width_mm}mm`);
      return parts.join(', ');
    }
    case 'cat-sprockets': {
      const parts = [];
      if (specs.ansi_number) parts.push(`ANSI ${specs.ansi_number}`);
      if (specs.teeth) parts.push(`${specs.teeth}T`);
      return parts.join(', ');
    }
    case 'cat-bushings': {
      const parts = [];
      if (specs.bushing_type) parts.push(specs.bushing_type);
      if (specs.series) parts.push(specs.series);
      return parts.join(', ');
    }
    case 'cat-couplings': {
      const parts = [];
      if (specs.coupling_type) parts.push(specs.coupling_type);
      if (specs.series_size) parts.push(specs.series_size);
      return parts.join(', ');
    }
    case 'cat-engchain': {
      const parts = [];
      if (specs.series) parts.push(specs.series);
      if (specs.pitch) parts.push(`${specs.pitch}" Pitch`);
      return parts.join(', ');
    }
    case 'cat-gearboxes': {
      const parts = [];
      if (specs.gearing_style) parts.push(specs.gearing_style);
      if (specs.orientation) parts.push(specs.orientation);
      return parts.join(', ');
    }
    default: return '';
  }
}

function formatProduct(product: any): string {
  const specs = Object.entries(product.specifications)
    .map(([k, v]) => `      ${k}: ${JSON.stringify(v)},`)
    .join('\n');

  return `  {
    id: ${JSON.stringify(product.id)},
    manufacturer_id: ${JSON.stringify(product.manufacturer_id)},
    category_id: ${JSON.stringify(product.category_id)},
    model_number: ${JSON.stringify(product.model_number)},
    name: ${JSON.stringify(product.name)},
    description: ${JSON.stringify(product.description)},
    specifications: {
${specs}
    },
    datasheet_url: null,
    image_url: null,
    is_featured: false,
    created_at: ${JSON.stringify(product.created_at)},
  }`;
}

main();
