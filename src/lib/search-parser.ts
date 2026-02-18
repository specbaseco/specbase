/**
 * Natural language search query parser for industrial product searches.
 * Converts queries like "1/2 hp motor" into structured search criteria.
 */

import { manufacturers } from './data';

export interface ParsedQuery {
  specs: Record<string, any>;
  manufacturer?: string;  // manufacturer slug
  category?: string;      // category id
  remainingText: string;  // leftover text for fuzzy matching
}

// Fractional HP mappings
const fractionMap: Record<string, number> = {
  '1/4': 0.25,
  '1/3': 0.333,
  '1/2': 0.5,
  '3/4': 0.75,
  '1.5': 1.5,
  '7.5': 7.5,
};

// Manufacturer name aliases → slug
const manufacturerAliases: Record<string, string> = {
  'abb': 'abb',
  'siemens': 'siemens',
  'weg': 'weg',
  'nidec': 'nidec',
  'u.s. motors': 'nidec',
  'us motors': 'nidec',
  'leeson': 'leeson',
  'marathon': 'marathon',
  'baldor': 'baldor',
  'baldor-reliance': 'baldor',
  'reliance': 'baldor',
};

// Category keywords
const categoryKeywords: Record<string, string> = {
  'motor': 'cat-motors',
  'motors': 'cat-motors',
  'gearbox': 'cat-gearboxes',
  'gearboxes': 'cat-gearboxes',
  'gear box': 'cat-gearboxes',
  'reducer': 'cat-gearboxes',
  'chain': 'cat-chain',
  'roller chain': 'cat-chain',
  'belt': 'cat-belts',
  'timing belt': 'cat-belts',
  'bearing': 'cat-bearings',
  'bearings': 'cat-bearings',
};

export function parseSearchQuery(rawQuery: string): ParsedQuery {
  const specs: Record<string, any> = {};
  let manufacturer: string | undefined;
  let category: string | undefined;

  // Work with a mutable copy, tracking what we've consumed
  let query = rawQuery.trim();
  const consumed: string[] = [];

  // 1. Extract HP values (including fractions like "1/2 hp", "1/2hp")
  // Match patterns: "1/2 hp", "1/2hp", "0.5 hp", "50HP", "100 hp", "7.5hp"
  const hpPattern = /(\d+\/\d+|\d+\.?\d*)\s*(?:hp|horsepower)\b/gi;
  let hpMatch = hpPattern.exec(query);
  if (hpMatch) {
    const hpStr = hpMatch[1];
    let hpValue: number;
    if (fractionMap[hpStr]) {
      hpValue = fractionMap[hpStr];
    } else if (hpStr.includes('/')) {
      const [num, den] = hpStr.split('/');
      hpValue = parseFloat(num) / parseFloat(den);
    } else {
      hpValue = parseFloat(hpStr);
    }
    if (!isNaN(hpValue)) {
      specs.horsepower = hpValue;
      consumed.push(hpMatch[0]);
      query = query.replace(hpMatch[0], ' ');
    }
  }

  // 2. Extract voltage patterns (e.g., "460V", "230/460V", "208-230/460V", "115/230V")
  const voltagePattern = /(\d{2,3}(?:[-\/]\d{2,3})*)\s*(?:v|volt|volts)\b/gi;
  let voltMatch = voltagePattern.exec(query);
  if (voltMatch) {
    specs.voltage = voltMatch[1] + 'V';
    consumed.push(voltMatch[0]);
    query = query.replace(voltMatch[0], ' ');
  }

  // 3. Extract frame size (e.g., "56C", "184T", "405T", "326TS", "56", "56H")
  const framePattern = /\b(\d{2,3}[CTHSLM]{0,3}(?:\/[MLH])?)\s*(?:frame)?\b/gi;
  let frameMatch: RegExpExecArray | null;
  // Be careful not to match HP numbers we already consumed
  const tempQuery = query;
  while ((frameMatch = framePattern.exec(tempQuery)) !== null) {
    const candidate = frameMatch[1].toUpperCase();
    // Validate it looks like a real NEMA frame size
    const frameNum = parseInt(candidate);
    if ([42, 48, 56, 143, 145, 182, 184, 213, 215, 254, 256, 284, 286, 324, 326, 364, 365, 404, 405, 444, 445, 447, 449].includes(frameNum) ||
        [42, 48, 56, 143, 145, 182, 184, 213, 215, 254, 256, 284, 286, 324, 326, 364, 365, 404, 405].some(f => candidate.startsWith(String(f)))) {
      specs.frame_size = candidate;
      consumed.push(frameMatch[0]);
      query = query.replace(frameMatch[0], ' ');
      break;
    }
  }

  // 4. Extract enclosure type (TEFC, ODP, TENV, TEBC, WPI, WPII)
  const enclosurePattern = /\b(TEFC|ODP|TENV|TEBC|WPI|WPII|XPFC)\b/gi;
  let encMatch = enclosurePattern.exec(query);
  if (encMatch) {
    specs.enclosure_type = encMatch[1].toUpperCase();
    consumed.push(encMatch[0]);
    query = query.replace(encMatch[0], ' ');
  }

  // 5. Extract phase ("single phase", "1-phase", "1 phase", "3-phase", "3 phase", "three phase")
  const phasePattern = /\b(?:(single|1)\s*[-]?\s*phase|(three|3)\s*[-]?\s*phase)\b/gi;
  let phaseMatch = phasePattern.exec(query);
  if (phaseMatch) {
    if (phaseMatch[1]) {
      specs.phase = 1;
    } else if (phaseMatch[2]) {
      specs.phase = 3;
    }
    consumed.push(phaseMatch[0]);
    query = query.replace(phaseMatch[0], ' ');
  }

  // 6. Extract RPM ("1800 RPM", "3600RPM", "1800rpm")
  const rpmPattern = /(\d{3,4})\s*(?:rpm)\b/gi;
  let rpmMatch = rpmPattern.exec(query);
  if (rpmMatch) {
    const rpm = parseInt(rpmMatch[1]);
    if ([900, 1200, 1800, 3600].includes(rpm)) {
      specs.rpm_synchronous = rpm;
      consumed.push(rpmMatch[0]);
      query = query.replace(rpmMatch[0], ' ');
    }
  }

  // 7. Extract efficiency class keywords
  const efficiencyPatterns: [RegExp, string][] = [
    [/\bnema\s*premium\b/gi, 'NEMA Premium'],
    [/\bieee[\s-]*841\b/gi, 'IEEE 841'],
    [/\bie3\b/gi, 'IE3'],
    [/\bie4\b/gi, 'IE4'],
    [/\bie2\b/gi, 'IE2'],
  ];
  for (const [pattern, value] of efficiencyPatterns) {
    if (pattern.test(query)) {
      specs.efficiency_class = value;
      query = query.replace(pattern, ' ');
      break;
    }
  }

  // 8. Extract manufacturer names
  const queryLower = query.toLowerCase();
  for (const [alias, slug] of Object.entries(manufacturerAliases)) {
    // Match whole word (with word boundaries)
    const mfrPattern = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (mfrPattern.test(queryLower)) {
      manufacturer = slug;
      query = query.replace(mfrPattern, ' ');
      break;
    }
  }

  // 9. Extract category keywords
  for (const [keyword, catId] of Object.entries(categoryKeywords)) {
    const catPattern = new RegExp(`\\b${keyword}\\b`, 'gi');
    if (catPattern.test(query)) {
      category = catId;
      query = query.replace(catPattern, ' ');
      break;
    }
  }

  // 10. "severe duty" → keep as search text (matches description)
  // Already handled by remaining text - these are important keywords that match descriptions

  // Clean up remaining text
  const remainingText = query.replace(/\s+/g, ' ').trim();

  return {
    specs,
    manufacturer,
    category,
    remainingText,
  };
}

/**
 * Format HP values for display (e.g., 0.5 → "1/2", 0.25 → "1/4")
 */
export function formatHP(hp: number): string {
  const reverseMap: Record<number, string> = {
    0.25: '1/4',
    0.333: '1/3',
    0.5: '1/2',
    0.75: '3/4',
    1.5: '1-1/2',
    7.5: '7-1/2',
  };
  return reverseMap[hp] || String(hp);
}
