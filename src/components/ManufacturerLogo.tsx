/**
 * Inline SVG manufacturer logos / styled wordmarks.
 * Zero HTTP requests — renders as styled text in an SVG.
 * Falls back to bold initials for unknown manufacturers.
 */

interface ManufacturerLogoProps {
  manufacturerId: string;
  className?: string;
}

// Brand colors and font styles for each manufacturer
const brandStyles: Record<string, { text: string; color: string; bg: string; fontClass: string }> = {
  'mfr-abb': { text: 'ABB', color: '#FF000F', bg: '#FFF', fontClass: 'font-bold tracking-wider' },
  'mfr-weg': { text: 'WEG', color: '#E30613', bg: '#FFF', fontClass: 'font-black tracking-wide' },
  'mfr-leeson': { text: 'LEESON', color: '#003B71', bg: '#FFF', fontClass: 'font-bold tracking-wider' },
  'mfr-marathon': { text: 'MARATHON', color: '#003A70', bg: '#FFF', fontClass: 'font-bold tracking-wide' },
  'mfr-nidec': { text: 'NIDEC', color: '#00A0E3', bg: '#FFF', fontClass: 'font-bold tracking-wider' },
  'mfr-baldor': { text: 'BALDOR', color: '#003DA5', bg: '#FFF', fontClass: 'font-black tracking-wider' },
  'mfr-siemens': { text: 'SIEMENS', color: '#009999', bg: '#FFF', fontClass: 'font-bold tracking-wide' },
};

const fallbackNames: Record<string, string> = {
  'mfr-sew': 'SEW',
  'mfr-nord': 'NORD',
  'mfr-flender': 'FLENDER',
  'mfr-sumitomo': 'SUMITOMO',
  'mfr-tsubaki': 'TSUBAKI',
  'mfr-rexnord': 'REXNORD',
  'mfr-renold': 'RENOLD',
  'mfr-diamond': 'DIAMOND',
  'mfr-gates': 'GATES',
  'mfr-continental': 'CONTI',
  'mfr-optibelt': 'OPTIBELT',
  'mfr-megadyne': 'MEGADYNE',
  'mfr-skf': 'SKF',
  'mfr-nsk': 'NSK',
  'mfr-timken': 'TIMKEN',
  'mfr-schaeffler': 'FAG/INA',
};

export default function ManufacturerLogo({ manufacturerId, className = '' }: ManufacturerLogoProps) {
  const brand = brandStyles[manufacturerId];

  if (brand) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span
          className={`${brand.fontClass} text-center leading-none select-none`}
          style={{ color: brand.color, fontSize: brand.text.length > 5 ? '0.7rem' : '0.9rem' }}
        >
          {brand.text}
        </span>
      </div>
    );
  }

  // Fallback for other manufacturers
  const name = fallbackNames[manufacturerId] || manufacturerId.replace('mfr-', '').toUpperCase();
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <span
        className="font-bold text-navy-500 dark:text-cream-400 text-center leading-none select-none"
        style={{ fontSize: name.length > 5 ? '0.6rem' : '0.8rem' }}
      >
        {name}
      </span>
    </div>
  );
}
