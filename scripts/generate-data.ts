/**
 * generate-data.ts
 * Reads a master Excel spreadsheet and generates src/lib/spreadsheet-data.ts
 * with typed product arrays for each category.
 *
 * Usage:
 *   npm run generate                              # uses data/Master_Template_Complete.xlsx
 *   npm run generate -- /path/to/spreadsheet.xlsx  # custom path
 *   EXCEL_PATH=/path/to/file.xlsx npm run generate # via env var
 *
 * Resolution order for Excel path:
 *   1. CLI argument (process.argv[2])
 *   2. EXCEL_PATH environment variable
 *   3. data/Master_Template_Complete.xlsx (project default)
 */

import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

function resolveExcelPath(): string {
  // 1. CLI argument
  if (process.argv[2]) {
    const p = path.resolve(process.argv[2]);
    if (!fs.existsSync(p)) {
      console.error(`❌ File not found: ${p}`);
      process.exit(1);
    }
    return p;
  }
  // 2. Environment variable
  if (process.env.EXCEL_PATH) {
    const p = path.resolve(process.env.EXCEL_PATH);
    if (!fs.existsSync(p)) {
      console.error(`❌ File not found (EXCEL_PATH): ${p}`);
      process.exit(1);
    }
    return p;
  }
  // 3. Default: data/ folder in project root
  const defaultPath = path.resolve(__dirname, '../data/Master_Template_Complete.xlsx');
  if (!fs.existsSync(defaultPath)) {
    console.error(`❌ No spreadsheet found. Place your Excel file at:`);
    console.error(`   ${defaultPath}`);
    console.error(`\n   Or specify a path:`);
    console.error(`   npm run generate -- /path/to/spreadsheet.xlsx`);
    process.exit(1);
  }
  return defaultPath;
}

const EXCEL_PATH = resolveExcelPath();
const OUTPUT_PATH = path.resolve(__dirname, '../src/lib/spreadsheet-data.ts');

// ── Column → Spec Key Mappings ──

const MOTOR_MAP: Record<string, string> = {
  'Horsepower': 'horsepower',
  'Frame Size': 'frame_size',
  'Enclosure': 'enclosure_type',
  'Speed': 'rpm_full_load',
  'Voltage': 'voltage',
  'Phase': 'phase',
  'Mounting': 'mounting_type',
  'Rotation': 'rotation',
  'Electrical Type': 'electrical_type',
  'Efficiency %': 'efficiency_percentage',
  'Full Load Amps (FLA)': 'full_load_amps',
  'Service Factor': 'service_factor',
  'Weight': 'weight_lbs',
};

const BEARING_MAP: Record<string, string> = {
  'Housing Style': 'housing_style',
  'Internals': 'internals',
  'Shaft Size (in)': 'shaft_size',
  'Bolt-to-Bolt (in)': 'bolt_to_bolt',
  'Locking Type': 'locking_type',
  'Dynamic Load (kN)': 'dynamic_load_kn',
  'Lubrication': 'lubrication',
};

const ROLLER_CHAIN_MAP: Record<string, string> = {
  'ANSI Number': 'ansi_number',
  'Pitch (in)': 'pitch',
  'Roller Width (in)': 'roller_width',
  'Roller Diameter (in)': 'roller_diameter',
  'Pin Diameter (in)': 'pin_diameter',
  'Tensile Strength (lbs)': 'tensile_strength',
  'Strand Count': 'strand_count',
  'Material': 'material',
};

const VBELT_MAP: Record<string, string> = {
  'Section': 'section',
  'Strands': 'strands',
  'Length (in)': 'length',
  'Length Type': 'length_type',
  'Top Width (per strand)': 'top_width',
  'Construction': 'construction',
  'Match-Free': 'match_free',
};

const SHEAVE_MAP: Record<string, string> = {
  'Belt Section': 'belt_section',
  'Grooves': 'grooves',
  'Bushing Type': 'bushing_type',
  'Bushing Series': 'bushing_series',
  'Pitch Diameter (in)': 'pitch_diameter',
  'Outside Diameter (in)': 'outer_diameter',
  'Face Width (in)': 'face_width',
  'Material': 'material',
  'Approx Weight (lbs)': 'weight_lbs',
};

const TIMING_BELT_MAP: Record<string, string> = {
  'Profile / System': 'profile',
  'Construction Material': 'construction',
  'Cord Material': 'cord_material',
  'Single Vs. Double Sided': 'sided',
  'Pitch (mm)': 'pitch_mm',
  'Width (mm)': 'width_mm',
  'Length (mm)': 'length_mm',
  'No. of Teeth': 'teeth',
};

const SPROCKET_MAP: Record<string, string> = {
  'ANSI Number': 'ansi_number',
  'Teeth': 'teeth',
  'Hub Style': 'hub_style',
  'Bore Type': 'bore_type',
  'Bushing/Bore Size': 'bore_size',
  'Hardened Teeth': 'hardened_teeth',
  'Pitch Diameter (in)': 'pitch_diameter',
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
  'Keyway Size (in)': 'keyway',
  'OD / Flange Dia (in)': 'outer_diameter',
  'Length (in)': 'length',
  'Bolt Circle (in)': 'bolt_circle',
  'Hardware Required': 'hardware_included',
};

const COUPLING_MAP: Record<string, string> = {
  'Coupling Type': 'coupling_type',
  'Insert / Element': 'insert_element',
  'Series / Size': 'series_size',
  'Max Bore (in)': 'max_bore',
  'Bore Type': 'bore_type',
  'Exact Bore (in)': 'exact_bore',
  'OD (in)': 'outer_diameter',
  'Material': 'material',
  'Nominal Torque (lb-in)': 'nominal_torque',
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
  'Max Output Torque (lb-in)': 'output_torque',
  'Efficiency %': 'efficiency_percentage',
};

const GEARMOTOR_MAP: Record<string, string> = {
  'Horsepower': 'horsepower',
  'Output RPM': 'output_rpm',
  'Ratio': 'ratio',
  'Torque (lb-in)': 'torque',
  'Series': 'series',
  'Enclosure': 'enclosure_type',
  'Voltage': 'voltage',
  'Phase': 'phase',
  'Motor Type': 'motor_type',
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
  { sheetName: 'Gearmotors', categoryId: 'cat-gearmotors', specMap: GEARMOTOR_MAP, idPrefix: 'xl-gearmotor' },
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

// ── Validation ──
interface ValidationWarning {
  sheet: string;
  row: number;
  message: string;
}

function validateRow(
  config: SheetConfig,
  row: Record<string, any>,
  rowIndex: number,
  warnings: ValidationWarning[]
) {
  // Check for missing spec columns (column name in specMap doesn't match any header)
  const rowKeys = Object.keys(row);
  for (const excelCol of Object.keys(config.specMap)) {
    if (!rowKeys.includes(excelCol)) {
      // Only warn once per sheet per missing column (tracked outside this fn)
      warnings.push({
        sheet: config.sheetName,
        row: rowIndex,
        message: `Column "${excelCol}" not found in sheet headers`,
      });
    }
  }

  // Check for empty manufacturer
  if (!String(row['Manufacturer'] || '').trim()) {
    warnings.push({
      sheet: config.sheetName,
      row: rowIndex,
      message: 'Missing Manufacturer',
    });
  }

  // Check for empty part number
  const partNumberCol = config.partNumberCol || 'Part Number';
  const partNumber = String(row[partNumberCol] || '').trim();
  if (!partNumber && !config.partNumberFallback) {
    warnings.push({
      sheet: config.sheetName,
      row: rowIndex,
      message: `Missing ${partNumberCol}`,
    });
  }
}

// ── Main ──
function main() {
  console.log(`\n📊 SpecBase Data Generator`);
  console.log(`${'─'.repeat(50)}`);
  console.log(`Source:  ${EXCEL_PATH}`);
  console.log(`Output:  ${OUTPUT_PATH}`);
  console.log(`${'─'.repeat(50)}\n`);

  const wb = XLSX.readFile(EXCEL_PATH);
  console.log(`Sheets found: ${wb.SheetNames.join(', ')}\n`);

  const allManufacturers = new Map<string, { id: string; name: string }>();
  const categoryArrays: Record<string, string> = {};
  const warnings: ValidationWarning[] = [];
  const stats: { sheet: string; rows: number; products: number; skipped: number }[] = [];
  let totalProducts = 0;

  // Track which missing-column warnings we've already reported (once per sheet)
  const reportedMissingCols = new Set<string>();

  for (const config of SHEET_CONFIGS) {
    const ws = wb.Sheets[config.sheetName];
    if (!ws) {
      console.warn(`  ⚠  Sheet "${config.sheetName}" not found, skipping.`);
      stats.push({ sheet: config.sheetName, rows: 0, products: 0, skipped: 0 });
      continue;
    }

    const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(ws, { defval: '' });

    // Validate first row to check column names (only report missing columns once)
    if (rows.length > 0) {
      const rowKeys = Object.keys(rows[0]);
      for (const excelCol of Object.keys(config.specMap)) {
        const key = `${config.sheetName}::${excelCol}`;
        if (!rowKeys.includes(excelCol) && !reportedMissingCols.has(key)) {
          reportedMissingCols.add(key);
          warnings.push({
            sheet: config.sheetName,
            row: 0,
            message: `Expected column "${excelCol}" not found in headers: [${rowKeys.slice(0, 5).join(', ')}${rowKeys.length > 5 ? '...' : ''}]`,
          });
        }
      }
    }

    const products: string[] = [];
    let skipped = 0;
    const usedIds = new Set<string>(); // Track IDs to handle duplicates

    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
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

      if (!mfrRaw || !partNumber) {
        skipped++;
        continue;
      }

      const mfr = normalizeManufacturer(mfrRaw);
      allManufacturers.set(mfr.id, mfr);

      // Generate stable ID from model number (slug-based, not sequential)
      const slug = partNumber.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      let productId = `${config.idPrefix}-${slug}`;
      // Handle duplicate model numbers within same category
      if (usedIds.has(productId)) {
        let suffix = 2;
        while (usedIds.has(`${productId}-${suffix}`)) suffix++;
        productId = `${productId}-${suffix}`;
      }
      usedIds.add(productId);

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
    totalProducts += products.length;
    stats.push({ sheet: config.sheetName, rows: rows.length, products: products.length, skipped });
  }

  // Generate output TypeScript file
  let output = `// AUTO-GENERATED by scripts/generate-data.ts — DO NOT EDIT MANUALLY\n`;
  output += `// Source: ${path.basename(EXCEL_PATH)}\n`;
  output += `// Generated: ${new Date().toISOString()}\n\n`;
  output += `import { Product } from '@/types';\n\n`;

  for (const [varName, productsStr] of Object.entries(categoryArrays)) {
    // For large arrays (>500 products), split into chunks to avoid TS
    // "Expression produces a union type that is too complex" error
    const productCount = (productsStr.match(/\n  \{/g) || []).length;
    if (productCount > 500) {
      const products = productsStr.split(/,\n(?=  \{)/);
      const chunkSize = 500;
      const chunks: string[][] = [];
      for (let i = 0; i < products.length; i += chunkSize) {
        chunks.push(products.slice(i, i + chunkSize));
      }
      // Write each chunk as a separate array
      for (let i = 0; i < chunks.length; i++) {
        output += `const ${varName}_${i}: Product[] = [\n${chunks[i].join(',\n')}\n];\n\n`;
      }
      // Combine into final export
      const chunkNames = chunks.map((_, i) => `...${varName}_${i}`).join(', ');
      output += `export const ${varName}: Product[] = [${chunkNames}];\n\n`;
    } else {
      output += `export const ${varName}: Product[] = [\n${productsStr}\n];\n\n`;
    }
  }

  // Generate new manufacturers list
  output += `// New manufacturers discovered from spreadsheet\n`;
  output += `export const spreadsheetManufacturers = [\n`;
  Array.from(allManufacturers.entries()).forEach(([id, mfr]) => {
    output += `  { id: '${id}', name: ${JSON.stringify(mfr.name)} },\n`;
  });
  output += `];\n`;

  fs.writeFileSync(OUTPUT_PATH, output, 'utf-8');

  // ── Summary Report ──
  console.log(`\n📋 Generation Summary`);
  console.log(`${'─'.repeat(60)}`);
  console.log(`${'Category'.padEnd(22)} ${'Rows'.padStart(6)} ${'Products'.padStart(10)} ${'Skipped'.padStart(9)}`);
  console.log(`${'─'.repeat(60)}`);
  for (const s of stats) {
    const marker = s.products === 0 ? ' ⚠' : ' ✓';
    console.log(`${marker} ${s.sheet.padEnd(20)} ${String(s.rows).padStart(6)} ${String(s.products).padStart(10)} ${String(s.skipped).padStart(9)}`);
  }
  console.log(`${'─'.repeat(60)}`);
  console.log(`  TOTAL${' '.repeat(15)} ${String(stats.reduce((a, s) => a + s.rows, 0)).padStart(6)} ${String(totalProducts).padStart(10)} ${String(stats.reduce((a, s) => a + s.skipped, 0)).padStart(9)}`);
  console.log(`\n  Manufacturers: ${allManufacturers.size}`);
  console.log(`  Output: ${OUTPUT_PATH}`);

  // Show warnings
  if (warnings.length > 0) {
    console.log(`\n⚠  Warnings (${warnings.length}):`);
    for (const w of warnings.slice(0, 20)) {
      console.log(`   ${w.sheet} row ${w.row}: ${w.message}`);
    }
    if (warnings.length > 20) {
      console.log(`   ... and ${warnings.length - 20} more`);
    }
  }

  console.log(`\n✅ Done! Run \`npm run build\` to compile, then deploy.\n`);
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
    case 'cat-gearmotors': {
      const parts = [];
      if (specs.horsepower) parts.push(`${specs.horsepower} HP`);
      if (specs.output_rpm) parts.push(`${specs.output_rpm} RPM`);
      if (specs.ratio) parts.push(`${specs.ratio}:1`);
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
