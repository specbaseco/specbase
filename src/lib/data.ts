import { Product, ProductCategory, Manufacturer } from '@/types';
import { parseSearchQuery } from './search-parser';
import {
  xl_motorProducts,
  xl_bearingProducts,
  xl_chainProducts,
  xl_vbeltProducts,
  xl_sheaveProducts,
  xl_tbeltProducts,
  xl_sprocketProducts,
  xl_bushingProducts,
  xl_couplingProducts,
  xl_engchainProducts,
  xl_gearboxProducts,
  xl_gearmotorProducts,
} from './spreadsheet-data';

export const categories: ProductCategory[] = [
  { id: 'cat-motors', name: 'Motors', slug: 'motors', icon: 'Zap', description: 'AC induction, servo, DC, and BLDC motors for industrial applications' },
  { id: 'cat-gearboxes', name: 'Gearboxes', slug: 'gearboxes', icon: 'Settings', description: 'Helical, worm, planetary, and bevel gearboxes for speed reduction and torque multiplication' },
  { id: 'cat-chain', name: 'Roller Chain', slug: 'roller-chain', icon: 'Link', description: 'Standard, heavy-duty, and specialty roller chain for power transmission' },
  { id: 'cat-belts', name: 'Timing Belts', slug: 'timing-belts', icon: 'CircleDot', description: 'Synchronous timing belts for precise motion control applications' },
  { id: 'cat-bearings', name: 'Bearings', slug: 'bearings', icon: 'Circle', description: 'Ball, roller, and specialty bearings for rotary and linear motion' },
  { id: 'cat-vbelts', name: 'V-Belts', slug: 'v-belts', icon: 'CircleDot', description: 'Classical and narrow section V-belts for industrial power transmission drives' },
  { id: 'cat-sheaves', name: 'Sheaves', slug: 'sheaves', icon: 'Circle', description: 'V-belt sheaves and pulleys for belt-driven power transmission systems' },
  { id: 'cat-sprockets', name: 'Sprockets', slug: 'sprockets', icon: 'Settings', description: 'Roller chain sprockets for conveyor, drive, and power transmission applications' },
  { id: 'cat-bushings', name: 'Bushings', slug: 'bushings', icon: 'Circle', description: 'QD, taper-lock, and split taper bushings for sheaves, sprockets, and couplings' },
  { id: 'cat-couplings', name: 'Couplings', slug: 'couplings', icon: 'Link', description: 'Jaw, gear, and flexible couplings for shaft-to-shaft power transmission' },
  { id: 'cat-engchain', name: 'Engineering Chain', slug: 'engineering-chain', icon: 'Link', description: 'Heavy-duty engineering class chain for conveyor and material handling applications' },
  { id: 'cat-gearmotors', name: 'Gearmotors', slug: 'gearmotors', icon: 'Settings', description: 'Integrated gear-motor units combining electric motors with gearboxes for direct-drive applications' },
];

export const manufacturers: Manufacturer[] = [
  // Motors
  { id: 'mfr-abb', name: 'ABB', slug: 'abb', logo_url: null, website: 'https://www.abb.com', description: 'Global technology leader in electrification and automation. One of the world\'s largest manufacturers of motors and drives.', partnership_status: 'active', featured: true, created_at: '2024-01-01' },
  { id: 'mfr-siemens', name: 'Siemens', slug: 'siemens', logo_url: null, website: 'https://www.siemens.com', description: 'Global industrial manufacturing powerhouse with comprehensive motor and drive solutions.', partnership_status: 'active', featured: true, created_at: '2024-01-01' },
  { id: 'mfr-weg', name: 'WEG', slug: 'weg', logo_url: null, website: 'https://www.weg.net', description: 'Brazilian multinational and one of the largest electric motor manufacturers in the world.', partnership_status: 'pending', featured: false, created_at: '2024-01-01' },
  { id: 'mfr-nidec', name: 'Nidec', slug: 'nidec', logo_url: null, website: 'https://www.nidec.com', description: 'World\'s largest manufacturer of electric motors for various applications from industrial to consumer.', partnership_status: 'pending', featured: false, created_at: '2024-01-01' },
  { id: 'mfr-leeson', name: 'Leeson', slug: 'leeson', logo_url: null, website: 'https://www.leeson.com', description: 'A Regal Rexnord brand specializing in fractional and integral HP motors for OEM and industrial applications. Known for small-frame motors and custom solutions.', partnership_status: 'active', featured: true, created_at: '2024-01-01' },
  { id: 'mfr-marathon', name: 'Marathon', slug: 'marathon', logo_url: null, website: 'https://www.marathonelectric.com', description: 'A Regal Rexnord brand manufacturing industrial-grade electric motors. Known for Blue Chip XRI, Black Max, and severe duty product lines.', partnership_status: 'active', featured: true, created_at: '2024-01-01' },
  { id: 'mfr-baldor', name: 'Baldor-Reliance', slug: 'baldor', logo_url: null, website: 'https://www.baldor.com', description: 'An ABB brand and one of the most recognized names in industrial motors. Known for Super-E premium efficiency and severe duty ECP product lines.', partnership_status: 'active', featured: true, created_at: '2024-01-01' },
  // Gearboxes
  { id: 'mfr-sew', name: 'SEW-Eurodrive', slug: 'sew-eurodrive', logo_url: null, website: 'https://www.sew-eurodrive.com', description: 'Global market leader in drive technology and automation solutions.', partnership_status: 'active', featured: true, created_at: '2024-01-01' },
  { id: 'mfr-nord', name: 'Nord Drivesystems', slug: 'nord', logo_url: null, website: 'https://www.nord.com', description: 'Full-range supplier of drive technology with headquarters in Germany.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  { id: 'mfr-flender', name: 'Flender', slug: 'flender', logo_url: null, website: 'https://www.flender.com', description: 'A Siemens company and leading global supplier of mechanical and electrical drive systems.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  { id: 'mfr-sumitomo', name: 'Sumitomo Drive Technologies', slug: 'sumitomo', logo_url: null, website: 'https://www.sumitomodrive.com', description: 'Leading manufacturer of power transmission equipment including gearboxes and gearmotors.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  // Roller Chain
  { id: 'mfr-tsubaki', name: 'U.S. Tsubaki', slug: 'tsubaki', logo_url: null, website: 'https://www.ustsubaki.com', description: 'World leader in chain technology, offering the most complete line of chain products.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  { id: 'mfr-rexnord', name: 'Rexnord', slug: 'rexnord', logo_url: null, website: 'https://www.rexnord.com', description: 'Leading manufacturer of process/motion control and water management solutions.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  { id: 'mfr-renold', name: 'Renold', slug: 'renold', logo_url: null, website: 'https://www.renold.com', description: 'Global leader in industrial chain manufacturing with over 140 years of heritage.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  { id: 'mfr-diamond', name: 'Diamond Chain', slug: 'diamond-chain', logo_url: null, website: 'https://www.diamondchain.com', description: 'A Timken company and premier manufacturer of roller chain products.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  { id: 'mfr-daido', name: 'Daido', slug: 'daido', logo_url: null, website: 'https://www.daidocorp.com', description: 'Japanese manufacturer of precision roller chain and power transmission products, known for quality standard and specialty chains.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  // Timing Belts
  { id: 'mfr-gates', name: 'Gates', slug: 'gates', logo_url: null, website: 'https://www.gates.com', description: 'Global manufacturer of power transmission belts and fluid power products.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  { id: 'mfr-continental', name: 'Continental (ContiTech)', slug: 'continental', logo_url: null, website: 'https://www.continental-industry.com', description: 'Leading manufacturer of industrial timing belts and power transmission solutions.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  { id: 'mfr-optibelt', name: 'Optibelt', slug: 'optibelt', logo_url: null, website: 'https://www.optibelt.com', description: 'German manufacturer of high-performance drive belts for industrial applications.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  { id: 'mfr-megadyne', name: 'Megadyne', slug: 'megadyne', logo_url: null, website: 'https://www.megadynegroup.com', description: 'International group specializing in timing belts and power transmission solutions.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  // Bearings
  { id: 'mfr-skf', name: 'SKF', slug: 'skf', logo_url: null, website: 'https://www.skf.com', description: 'Swedish multinational and world-leading supplier of bearings, seals, and lubrication systems.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  { id: 'mfr-nsk', name: 'NSK', slug: 'nsk', logo_url: null, website: 'https://www.nsk.com', description: 'Japanese manufacturer and one of the world\'s largest bearing companies.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  { id: 'mfr-timken', name: 'Timken', slug: 'timken', logo_url: null, website: 'https://www.timken.com', description: 'American manufacturer of tapered roller bearings and power transmission products.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  { id: 'mfr-schaeffler', name: 'Schaeffler (FAG/INA)', slug: 'schaeffler', logo_url: null, website: 'https://www.schaeffler.com', description: 'German manufacturer of rolling element bearings under the FAG and INA brands.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  // NTN
  { id: 'mfr-ntn', name: 'NTN', slug: 'ntn', logo_url: null, website: 'https://www.ntn.com', description: 'Japanese multinational manufacturer of bearings, CV joints, and precision equipment.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  // V-Belts
  { id: 'mfr-mbl', name: 'MBL', slug: 'mbl', logo_url: null, website: 'https://www.mblusa.com', description: 'Mitsuboshi Belting — manufacturer of industrial V-belts, timing belts, and specialty belts.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  // Sheaves & Sprockets
  { id: 'mfr-browning', name: 'Browning', slug: 'browning', logo_url: null, website: 'https://www.browning.com', description: 'A Regal Rexnord brand manufacturing sheaves, sprockets, and power transmission components.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  { id: 'mfr-martin', name: 'Martin Sprocket', slug: 'martin', logo_url: null, website: 'https://www.martinsprocket.com', description: 'Full-line manufacturer of sprockets, gears, sheaves, couplings, and other power transmission products.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  { id: 'mfr-dodge', name: 'Dodge', slug: 'dodge', logo_url: null, website: 'https://www.dodgeindustrial.com', description: 'An ABB brand known for mounted bearings, enclosed gearing, and power transmission products.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  { id: 'mfr-maska', name: 'Maska', slug: 'maska', logo_url: null, website: 'https://www.maska.com', description: 'Canadian manufacturer of sheaves, bushings, and power transmission components.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  { id: 'mfr-linngear', name: 'Linn Gear', slug: 'linn-gear', logo_url: null, website: 'https://www.linngear.com', description: 'American manufacturer of gears, sprockets, and power transmission components since 1953.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  // Timing Belts
  { id: 'mfr-bando', name: 'Bando', slug: 'bando', logo_url: null, website: 'https://www.bandousa.com', description: 'Japanese manufacturer of industrial power transmission and conveyor belts.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  // Couplings
  { id: 'mfr-lovejoy', name: 'Lovejoy', slug: 'lovejoy', logo_url: null, website: 'https://www.lovejoy-inc.com', description: 'A Timken brand specializing in jaw, gear, and disc couplings for industrial power transmission.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  { id: 'mfr-falk', name: 'Falk', slug: 'falk', logo_url: null, website: 'https://www.rexnord.com/falk', description: 'A Rexnord brand manufacturing gear couplings, grid couplings, and industrial drives.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  { id: 'mfr-ktr', name: 'KTR', slug: 'ktr', logo_url: null, website: 'https://www.ktr.com', description: 'German manufacturer of couplings, clamping sets, and hydraulic components for power transmission.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  { id: 'mfr-tbwoods', name: "TB Wood's", slug: 'tb-woods', logo_url: null, website: 'https://www.tbwoods.com', description: 'An Altra Industrial Motion brand manufacturing couplings, sheaves, and variable speed drives.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  // Engineering Chain
  { id: 'mfr-webster', name: 'Webster', slug: 'webster', logo_url: null, website: 'https://www.websterchain.com', description: 'Manufacturer of engineering class chain, conveyor chain, and material handling chain.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  { id: 'mfr-promac', name: 'Promac', slug: 'promac', logo_url: null, website: 'https://www.promacchain.com', description: 'Manufacturer of engineering chain and conveyor chain for industrial applications.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  { id: 'mfr-jeffrey', name: 'Jeffrey', slug: 'jeffrey', logo_url: null, website: 'https://www.jeffreychain.com', description: 'Legacy manufacturer of engineering chain for mining, lumber, and material handling industries.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  // Gearboxes (new entries)
  { id: 'mfr-stober', name: 'STOBER', slug: 'stober', logo_url: null, website: 'https://www.stober.com', description: 'German manufacturer of precision gear units and servo gearboxes for automation.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  { id: 'mfr-rossi', name: 'Rossi', slug: 'rossi', logo_url: null, website: 'https://www.rossi-group.com', description: 'Italian manufacturer of gear reducers, gearmotors, and variable speed drives.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
  { id: 'mfr-bonfiglioli', name: 'Bonfiglioli', slug: 'bonfiglioli', logo_url: null, website: 'https://www.bonfiglioli.com', description: 'Italian manufacturer of gearmotors, drive systems, and planetary gearboxes.', partnership_status: 'none', featured: false, created_at: '2024-01-01' },
];

export const products: Product[] = [
  ...xl_motorProducts,
  ...xl_chainProducts,
  ...xl_bearingProducts,
  ...xl_vbeltProducts,
  ...xl_sheaveProducts,
  ...xl_tbeltProducts,
  ...xl_sprocketProducts,
  ...xl_bushingProducts,
  ...xl_couplingProducts,
  ...xl_engchainProducts,
  ...xl_gearboxProducts,
  ...xl_gearmotorProducts,
];

// Helper functions
export function getProductWithRelations(productId: string) {
  const product = products.find(p => p.id === productId);
  if (!product) return null;

  const mfr = manufacturers.find(m => m.id === product.manufacturer_id);
  // Strip internal business fields from public responses
  const safeMfr = mfr ? (() => { const { partnership_status, featured, ...rest } = mfr; return rest; })() : undefined;

  return {
    ...product,
    manufacturer: safeMfr,
    category: categories.find(c => c.id === product.category_id),
  };
}

export function searchProducts(query: string) {
  if (!query.trim()) return products;

  const parsed = parseSearchQuery(query);

  return products.filter(product => {
    const specs = product.specifications;
    const mfr = manufacturers.find(m => m.id === product.manufacturer_id);

    // Check extracted spec filters — use parseFloat for numeric comparisons
    if (parsed.specs.horsepower != null && parseFloat(String(specs.horsepower)) !== parseFloat(String(parsed.specs.horsepower))) return false;
    if (parsed.specs.voltage) {
      if (!specs.voltage) return false;
      if (!specs.voltage.includes(parsed.specs.voltage.replace('V', ''))) return false;
    }
    if (parsed.specs.phase != null && parseFloat(String(specs.phase)) !== parseFloat(String(parsed.specs.phase))) return false;
    if (parsed.specs.rpm_synchronous) {
      if (!specs.rpm_full_load) return false;
      if (parseFloat(String(specs.rpm_full_load)) !== parseFloat(String(parsed.specs.rpm_synchronous))) return false;
    }
    if (parsed.specs.frame_size) {
      if (!specs.frame_size) return false;
      if (!specs.frame_size.toUpperCase().includes(parsed.specs.frame_size.toUpperCase())) return false;
    }
    if (parsed.specs.enclosure_type) {
      if (!specs.enclosure_type) return false;
      if (!specs.enclosure_type.toUpperCase().includes(parsed.specs.enclosure_type.toUpperCase())) return false;
    }
    if (parsed.specs.efficiency_class) {
      if (!specs.efficiency_class) return false;
      if (!specs.efficiency_class.toLowerCase().includes(parsed.specs.efficiency_class.toLowerCase())) return false;
    }

    // Manufacturer filter
    if (parsed.manufacturer) {
      if (mfr?.slug !== parsed.manufacturer) return false;
    }

    // Category filter
    if (parsed.category) {
      if (product.category_id !== parsed.category) return false;
    }

    // Text search on remaining terms
    if (parsed.remainingText.trim()) {
      const terms = parsed.remainingText.trim().toLowerCase().split(/\s+/);
      const searchableText = [
        product.name,
        product.model_number,
        product.description,
        mfr?.name || '',
        String(specs.horsepower || ''),
        specs.voltage || '',
        specs.frame_size || '',
        specs.enclosure_type || '',
        specs.efficiency_class || '',
      ].join(' ').toLowerCase();

      return terms.every(term => searchableText.includes(term));
    }

    return true;
  });
}

// ── Crossover / Reverse Lookup ──
// Find a product by model number, then find all products from OTHER manufacturers
// that match its key specifications.

export function findProductByModelNumber(modelNumber: string) {
  const normalized = modelNumber.trim().toLowerCase();
  // Exact match first
  let product = products.find(p => p.model_number.toLowerCase() === normalized);
  // Partial match fallback (model number contains the query or vice versa)
  if (!product) {
    product = products.find(p =>
      p.model_number.toLowerCase().includes(normalized) ||
      normalized.includes(p.model_number.toLowerCase())
    );
  }
  // Also search by product ID
  if (!product) {
    product = products.find(p => p.id.toLowerCase() === normalized);
  }
  if (!product) return null;
  return {
    ...product,
    manufacturer: manufacturers.find(m => m.id === product!.manufacturer_id),
    category: categories.find(c => c.id === product!.category_id),
  };
}

export interface CrossoverMatch {
  product: Product & { manufacturer?: typeof manufacturers[0]; category?: typeof categories[0] };
  matchScore: number;        // 0-100, how close the specs match
  matchedSpecs: string[];    // which specs matched
  mismatchedSpecs: string[]; // which specs differed
}

export function findCrossoverProducts(sourceProductId: string): CrossoverMatch[] {
  const source = products.find(p => p.id === sourceProductId);
  if (!source) return [];

  const specs = source.specifications;
  const catId = source.category_id;

  // Get candidates: same category, different manufacturer
  const candidates = products.filter(p =>
    p.category_id === source.category_id &&
    p.manufacturer_id !== source.manufacturer_id
  );

  const results: CrossoverMatch[] = [];

  // Helper: compare spec values (case-insensitive string match)
  function specMatch(a: any, b: any): boolean {
    if (a == null || b == null || a === '' || b === '') return false;
    return String(a).toLowerCase().trim() === String(b).toLowerCase().trim();
  }

  // Helper: compare numeric specs within tolerance
  function numericClose(a: any, b: any, tolerance: number = 0): boolean {
    const na = parseFloat(String(a));
    const nb = parseFloat(String(b));
    if (isNaN(na) || isNaN(nb)) return false;
    return Math.abs(na - nb) <= tolerance;
  }

  // Helper: push match or mismatch
  function compareSpec(label: string, srcVal: any, candVal: any, matched: string[], mismatched: string[], numeric = false, tolerance = 0) {
    if (srcVal == null || srcVal === '' || candVal == null || candVal === '') return;
    if (numeric ? numericClose(srcVal, candVal, tolerance) : specMatch(srcVal, candVal)) {
      matched.push(label);
    } else {
      mismatched.push(label);
    }
  }

  for (const candidate of candidates) {
    const cSpecs = candidate.specifications;
    const matched: string[] = [];
    const mismatched: string[] = [];

    if (catId === 'cat-motors') {
      // ── Motor matching logic ──
      const hpMatch = numericClose(specs.horsepower, cSpecs.horsepower);
      const phaseMatch = numericClose(specs.phase, cSpecs.phase);
      if (!hpMatch || !phaseMatch) continue;
      matched.push('Horsepower', 'Phase');

      // Voltage — multi-voltage compatibility
      const srcVoltages = String(specs.voltage || '').split(/[\/,]/).map(v => v.trim().replace('V', ''));
      const candVoltages = String(cSpecs.voltage || '').split(/[\/,]/).map(v => v.trim().replace('V', ''));
      const voltageOverlap = srcVoltages.some(v => candVoltages.some(cv => cv.includes(v) || v.includes(cv)));
      if (voltageOverlap) matched.push('Voltage'); else mismatched.push('Voltage');

      compareSpec('RPM', specs.rpm_full_load, cSpecs.rpm_full_load, matched, mismatched, true, 50);
      compareSpec('Frame Size', specs.frame_size, cSpecs.frame_size, matched, mismatched);
      compareSpec('Enclosure', specs.enclosure_type, cSpecs.enclosure_type, matched, mismatched);
      compareSpec('Mounting', specs.mounting || specs.mounting_type, cSpecs.mounting || cSpecs.mounting_type, matched, mismatched);
      compareSpec('Efficiency Class', specs.efficiency_class, cSpecs.efficiency_class, matched, mismatched);
      compareSpec('Frequency', specs.frequency, cSpecs.frequency, matched, mismatched);

    } else if (catId === 'cat-chain') {
      // ── Roller Chain matching logic ──
      // Support both old spec keys (pitch_inches) and new (pitch)
      const srcPitch = specs.pitch_inches || specs.pitch;
      const candPitch = cSpecs.pitch_inches || cSpecs.pitch;
      if (!specMatch(srcPitch, candPitch) && !numericClose(srcPitch, candPitch, 0.001)) continue;
      matched.push('Pitch');

      const srcStrands = specs.number_of_strands || specs.strand_count;
      const candStrands = cSpecs.number_of_strands || cSpecs.strand_count;
      compareSpec('Strands', srcStrands, candStrands, matched, mismatched);

      const srcAnsi = specs.ansi_chain_number || specs.ansi_number;
      const candAnsi = cSpecs.ansi_chain_number || cSpecs.ansi_number;
      compareSpec('ANSI #', srcAnsi, candAnsi, matched, mismatched);
      compareSpec('Material', specs.material, cSpecs.material, matched, mismatched);
      compareSpec('Chain Type', specs.chain_type, cSpecs.chain_type, matched, mismatched);

    } else if (catId === 'cat-bearings') {
      // ── Bearings: shaft size + housing must match ──
      if (!specMatch(specs.shaft_size, cSpecs.shaft_size)) continue;
      if (!specMatch(specs.housing_style, cSpecs.housing_style)) continue;
      matched.push('Shaft Size', 'Housing Style');

      compareSpec('Internals', specs.internals, cSpecs.internals, matched, mismatched);
      compareSpec('Locking Type', specs.locking_type, cSpecs.locking_type, matched, mismatched);
      compareSpec('Lubrication', specs.lubrication, cSpecs.lubrication, matched, mismatched);
      compareSpec('Dynamic Load', specs.dynamic_load_lbf, cSpecs.dynamic_load_lbf, matched, mismatched, true, 500);

    } else if (catId === 'cat-vbelts') {
      // ── V-Belts: section + length type must match ──
      if (!specMatch(specs.section, cSpecs.section)) continue;
      if (!specMatch(specs.length_type, cSpecs.length_type)) continue;
      matched.push('Section', 'Length Type');

      compareSpec('Length', specs.length, cSpecs.length, matched, mismatched);
      compareSpec('Strands', specs.strands, cSpecs.strands, matched, mismatched);
      compareSpec('Top Width', specs.top_width, cSpecs.top_width, matched, mismatched);
      compareSpec('Construction', specs.construction, cSpecs.construction, matched, mismatched);

    } else if (catId === 'cat-sheaves') {
      // ── Sheaves: belt section + grooves must match ──
      if (!specMatch(specs.belt_section, cSpecs.belt_section)) continue;
      if (!specMatch(specs.grooves, cSpecs.grooves)) continue;
      matched.push('Belt Section', 'Grooves');

      compareSpec('Bushing Type', specs.bushing_type, cSpecs.bushing_type, matched, mismatched);
      compareSpec('Pitch Dia', specs.pitch_diameter, cSpecs.pitch_diameter, matched, mismatched, true, 0.1);
      compareSpec('Material', specs.material, cSpecs.material, matched, mismatched);

    } else if (catId === 'cat-belts') {
      // ── Timing Belts: profile + pitch must match ──
      if (!specMatch(specs.profile, cSpecs.profile)) continue;
      if (!numericClose(specs.pitch_mm, cSpecs.pitch_mm, 0.1)) continue;
      matched.push('Profile', 'Pitch');

      compareSpec('Width', specs.width_mm, cSpecs.width_mm, matched, mismatched, true, 1);
      compareSpec('Length', specs.length_mm, cSpecs.length_mm, matched, mismatched, true, 5);
      compareSpec('Teeth', specs.teeth, cSpecs.teeth, matched, mismatched, true, 0);
      compareSpec('Construction', specs.construction, cSpecs.construction, matched, mismatched);
      compareSpec('Sided', specs.sided, cSpecs.sided, matched, mismatched);

    } else if (catId === 'cat-sprockets') {
      // ── Sprockets: ANSI number + teeth must match ──
      if (!specMatch(specs.ansi_number, cSpecs.ansi_number)) continue;
      if (!numericClose(specs.teeth, cSpecs.teeth)) continue;
      matched.push('ANSI #', 'Teeth');

      compareSpec('Hub Style', specs.hub_style, cSpecs.hub_style, matched, mismatched);
      compareSpec('Bore Type', specs.bore_type, cSpecs.bore_type, matched, mismatched);
      compareSpec('Material', specs.material, cSpecs.material, matched, mismatched);
      compareSpec('Hardened Teeth', specs.hardened_teeth, cSpecs.hardened_teeth, matched, mismatched);

    } else if (catId === 'cat-bushings') {
      // ── Bushings: type + series must match ──
      if (!specMatch(specs.bushing_type, cSpecs.bushing_type)) continue;
      if (!specMatch(specs.series, cSpecs.series)) continue;
      matched.push('Bushing Type', 'Series');

      compareSpec('Max Bore', specs.max_bore, cSpecs.max_bore, matched, mismatched, true, 0.05);
      compareSpec('Bore Type', specs.bore_type, cSpecs.bore_type, matched, mismatched);
      compareSpec('OD', specs.outer_diameter, cSpecs.outer_diameter, matched, mismatched, true, 0.05);
      compareSpec('Length', specs.length, cSpecs.length, matched, mismatched, true, 0.05);

    } else if (catId === 'cat-couplings') {
      // ── Couplings: coupling type must match ──
      if (!specMatch(specs.coupling_type, cSpecs.coupling_type)) continue;
      matched.push('Coupling Type');

      compareSpec('Series/Size', specs.series_size, cSpecs.series_size, matched, mismatched);
      compareSpec('Max Bore', specs.max_bore, cSpecs.max_bore, matched, mismatched, true, 0.1);
      compareSpec('Material', specs.material, cSpecs.material, matched, mismatched);
      compareSpec('Torque', specs.nominal_torque, cSpecs.nominal_torque, matched, mismatched, true, 100);
      compareSpec('Max RPM', specs.max_rpm, cSpecs.max_rpm, matched, mismatched, true, 100);

    } else if (catId === 'cat-engchain') {
      // ── Engineering Chain: pitch + series must match ──
      if (!numericClose(specs.pitch, cSpecs.pitch, 0.01)) continue;
      matched.push('Pitch');

      compareSpec('Series', specs.series, cSpecs.series, matched, mismatched);
      compareSpec('Type', specs.chain_type, cSpecs.chain_type, matched, mismatched);
      compareSpec('Tensile', specs.avg_tensile, cSpecs.avg_tensile, matched, mismatched, true, 1000);
      compareSpec('Pin Style', specs.pin_style, cSpecs.pin_style, matched, mismatched);
      compareSpec('Attachment', specs.attachment, cSpecs.attachment, matched, mismatched);

    } else if (catId === 'cat-gearboxes') {
      // ── Gearboxes: gearing style + orientation must match ──
      if (!specMatch(specs.gearing_style, cSpecs.gearing_style)) continue;
      if (!specMatch(specs.orientation, cSpecs.orientation)) continue;
      matched.push('Gearing Style', 'Orientation');

      compareSpec('Max Input HP', specs.max_input_hp, cSpecs.max_input_hp, matched, mismatched, true, 2);
      compareSpec('Output Torque', specs.output_torque, cSpecs.output_torque, matched, mismatched, true, 500);
      compareSpec('Ratio Range', specs.ratio_range, cSpecs.ratio_range, matched, mismatched);
      compareSpec('Efficiency', specs.efficiency_percentage, cSpecs.efficiency_percentage, matched, mismatched);

    } else {
      // Generic matching fallback
      const specKeys = Object.keys(specs);
      for (const key of specKeys) {
        if (specs[key] && cSpecs[key]) {
          if (String(specs[key]).toLowerCase() === String(cSpecs[key]).toLowerCase()) {
            matched.push(key);
          } else {
            mismatched.push(key);
          }
        }
      }
      if (matched.length === 0) continue;
    }

    // Calculate match score
    const totalComparable = matched.length + mismatched.length;
    const matchScore = totalComparable > 0
      ? Math.round((matched.length / totalComparable) * 100)
      : 0;

    // Only include products with a reasonable match
    if (matchScore >= 50) {
      results.push({
        product: {
          ...candidate,
          manufacturer: manufacturers.find(m => m.id === candidate.manufacturer_id),
          category: categories.find(c => c.id === candidate.category_id),
        },
        matchScore,
        matchedSpecs: matched,
        mismatchedSpecs: mismatched,
      });
    }
  }

  // Sort by match score descending, then by manufacturer name
  results.sort((a, b) => {
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
    return (a.product.manufacturer?.name || '').localeCompare(b.product.manufacturer?.name || '');
  });

  return results;
}

// Category to manufacturer mapping (computed from product data)
export const categoryManufacturers: Record<string, string[]> = (() => {
  const map: Record<string, Set<string>> = {};
  for (const p of products) {
    if (!map[p.category_id]) map[p.category_id] = new Set();
    map[p.category_id].add(p.manufacturer_id);
  }
  const result: Record<string, string[]> = {};
  for (const [catId, mfrSet] of Object.entries(map)) {
    result[catId] = Array.from(mfrSet);
  }
  // Add all categories even if no products yet
  for (const cat of categories) {
    if (!result[cat.id]) result[cat.id] = [];
  }
  return result;
})();