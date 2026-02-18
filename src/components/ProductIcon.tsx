interface ProductIconProps {
  categoryId: string;
  specifications?: Record<string, any>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-6 h-6',
  md: 'w-12 h-12',
  lg: 'w-20 h-20',
};

function getIconVariant(categoryId: string, specs?: Record<string, any>): string {
  if (categoryId === 'cat-motors') {
    if (specs?.mounting === 'C-Face') return 'motor-cface';
    if (specs?.enclosure_type === 'ODP') return 'motor-odp';
    return 'motor-tefc';
  }
  const map: Record<string, string> = {
    'cat-gearboxes': 'gearbox',
    'cat-chain': 'roller-chain',
    'cat-belts': 'timing-belt',
    'cat-bearings': 'bearing',
  };
  return map[categoryId] || 'generic';
}

function TEFCMotorIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      {/* Motor body */}
      <rect x="14" y="16" width="36" height="24" rx="2" />
      {/* Fan shroud */}
      <path d="M14 18 L8 14 L8 42 L14 38" />
      {/* Cooling fins */}
      <line x1="20" y1="16" x2="20" y2="13" />
      <line x1="26" y1="16" x2="26" y2="13" />
      <line x1="32" y1="16" x2="32" y2="13" />
      <line x1="38" y1="16" x2="38" y2="13" />
      <line x1="44" y1="16" x2="44" y2="13" />
      {/* Shaft */}
      <line x1="50" y1="28" x2="60" y2="28" />
      <circle cx="60" cy="28" r="1.5" />
      {/* Terminal box */}
      <rect x="28" y="10" width="8" height="6" rx="1" />
      {/* Mounting feet */}
      <path d="M16 40 L16 48 L12 48" />
      <path d="M48 40 L48 48 L52 48" />
      <line x1="10" y1="48" x2="54" y2="48" />
    </svg>
  );
}

function ODPMotorIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      {/* Motor body */}
      <rect x="12" y="16" width="38" height="24" rx="2" />
      {/* Vent slots */}
      <line x1="16" y1="22" x2="28" y2="22" />
      <line x1="16" y1="26" x2="28" y2="26" />
      <line x1="16" y1="30" x2="28" y2="30" />
      <line x1="16" y1="34" x2="28" y2="34" />
      {/* Shaft */}
      <line x1="50" y1="28" x2="60" y2="28" />
      <circle cx="60" cy="28" r="1.5" />
      {/* Terminal box */}
      <rect x="30" y="10" width="8" height="6" rx="1" />
      {/* End bell */}
      <path d="M50 18 L50 38" />
      {/* Mounting feet */}
      <path d="M14 40 L14 48 L10 48" />
      <path d="M48 40 L48 48 L52 48" />
      <line x1="8" y1="48" x2="54" y2="48" />
    </svg>
  );
}

function CFaceMotorIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      {/* Motor body */}
      <rect x="10" y="18" width="30" height="22" rx="2" />
      {/* Fan shroud */}
      <path d="M10 20 L5 17 L5 41 L10 38" />
      {/* Cooling fins */}
      <line x1="15" y1="18" x2="15" y2="15" />
      <line x1="20" y1="18" x2="20" y2="15" />
      <line x1="25" y1="18" x2="25" y2="15" />
      <line x1="30" y1="18" x2="30" y2="15" />
      <line x1="35" y1="18" x2="35" y2="15" />
      {/* C-Face flange */}
      <circle cx="44" cy="29" r="12" />
      <circle cx="44" cy="29" r="6" strokeDasharray="2 2" />
      {/* Shaft */}
      <line x1="50" y1="29" x2="60" y2="29" />
      <circle cx="60" cy="29" r="1.5" />
      {/* Bolt holes */}
      <circle cx="44" cy="19" r="1.5" fill="currentColor" />
      <circle cx="44" cy="39" r="1.5" fill="currentColor" />
      <circle cx="34" cy="29" r="1.5" fill="currentColor" />
      <circle cx="54" cy="29" r="1.5" fill="currentColor" />
      {/* Terminal box */}
      <rect x="18" y="12" width="7" height="6" rx="1" />
    </svg>
  );
}

function GearboxIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      {/* Main housing */}
      <rect x="12" y="14" width="34" height="30" rx="3" />
      {/* Input shaft */}
      <line x1="29" y1="4" x2="29" y2="14" />
      <circle cx="29" cy="4" r="2" />
      {/* Output shaft */}
      <line x1="46" y1="29" x2="60" y2="29" />
      <circle cx="60" cy="29" r="2" />
      {/* Large gear */}
      <circle cx="29" cy="24" r="6" />
      <circle cx="29" cy="24" r="2" fill="currentColor" />
      {/* Gear teeth */}
      <line x1="29" y1="17" x2="29" y2="15" />
      <line x1="35" y1="24" x2="37" y2="24" />
      <line x1="29" y1="31" x2="29" y2="33" />
      <line x1="23" y1="24" x2="21" y2="24" />
      {/* Small gear */}
      <circle cx="38" cy="35" r="4" />
      <circle cx="38" cy="35" r="1.5" fill="currentColor" />
      {/* Mounting feet */}
      <path d="M12 44 L12 50 L8 50" />
      <path d="M46 44 L46 50 L50 50" />
      <line x1="6" y1="50" x2="52" y2="50" />
    </svg>
  );
}

function RollerChainIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      {/* Link 1 outer plate */}
      <path d="M6 22 C6 18, 10 16, 14 16 L20 16 C24 16, 28 18, 28 22 L28 28 C28 32, 24 34, 20 34 L14 34 C10 34, 6 32, 6 28 Z" />
      {/* Link 1 rollers */}
      <circle cx="14" cy="25" r="3" />
      <circle cx="20" cy="25" r="3" />
      {/* Link 2 outer plate */}
      <path d="M20 20 C20 16, 24 14, 28 14 L34 14 C38 14, 42 16, 42 20 L42 30 C42 34, 38 36, 34 36 L28 36 C24 36, 20 34, 20 30 Z" />
      {/* Link 2 rollers */}
      <circle cx="28" cy="25" r="3" />
      <circle cx="34" cy="25" r="3" />
      {/* Link 3 outer plate */}
      <path d="M34 22 C34 18, 38 16, 42 16 L48 16 C52 16, 56 18, 56 22 L56 28 C56 32, 52 34, 48 34 L42 34 C38 34, 34 32, 34 28 Z" />
      {/* Link 3 rollers */}
      <circle cx="42" cy="25" r="3" />
      <circle cx="48" cy="25" r="3" />
      {/* Pin centers */}
      <circle cx="14" cy="25" r="1" fill="currentColor" />
      <circle cx="20" cy="25" r="1" fill="currentColor" />
      <circle cx="28" cy="25" r="1" fill="currentColor" />
      <circle cx="34" cy="25" r="1" fill="currentColor" />
      <circle cx="42" cy="25" r="1" fill="currentColor" />
      <circle cx="48" cy="25" r="1" fill="currentColor" />
    </svg>
  );
}

function TimingBeltIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      {/* Left pulley (driver) */}
      <circle cx="18" cy="32" r="10" />
      <circle cx="18" cy="32" r="3" />
      <circle cx="18" cy="32" r="1" fill="currentColor" />
      {/* Right pulley (driven, smaller) */}
      <circle cx="48" cy="32" r="7" />
      <circle cx="48" cy="32" r="2.5" />
      <circle cx="48" cy="32" r="1" fill="currentColor" />
      {/* Belt top span */}
      <line x1="18" y1="22" x2="48" y2="25" />
      {/* Belt bottom span */}
      <line x1="18" y1="42" x2="48" y2="39" />
      {/* Teeth on top */}
      <line x1="24" y1="22.5" x2="24" y2="20" />
      <line x1="29" y1="23" x2="29" y2="20.5" />
      <line x1="34" y1="23.5" x2="34" y2="21" />
      <line x1="39" y1="24" x2="39" y2="21.5" />
      <line x1="44" y1="24.5" x2="44" y2="22" />
      {/* Teeth on bottom */}
      <line x1="24" y1="41.5" x2="24" y2="44" />
      <line x1="29" y1="41" x2="29" y2="43.5" />
      <line x1="34" y1="40.5" x2="34" y2="43" />
      <line x1="39" y1="40" x2="39" y2="42.5" />
      <line x1="44" y1="39.5" x2="44" y2="42" />
    </svg>
  );
}

function BearingIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      {/* Outer race */}
      <circle cx="32" cy="32" r="22" />
      <circle cx="32" cy="32" r="18" />
      {/* Inner race */}
      <circle cx="32" cy="32" r="10" />
      <circle cx="32" cy="32" r="7" />
      {/* Shaft bore */}
      <circle cx="32" cy="32" r="4" strokeDasharray="2 2" />
      {/* Ball elements (8) */}
      <circle cx="32" cy="18" r="3" />
      <circle cx="41.9" cy="21.1" r="3" />
      <circle cx="46" cy="32" r="3" />
      <circle cx="41.9" cy="42.9" r="3" />
      <circle cx="32" cy="46" r="3" />
      <circle cx="22.1" cy="42.9" r="3" />
      <circle cx="18" cy="32" r="3" />
      <circle cx="22.1" cy="21.1" r="3" />
    </svg>
  );
}

function GenericIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

const iconComponents: Record<string, () => JSX.Element> = {
  'motor-tefc': TEFCMotorIcon,
  'motor-odp': ODPMotorIcon,
  'motor-cface': CFaceMotorIcon,
  'gearbox': GearboxIcon,
  'roller-chain': RollerChainIcon,
  'timing-belt': TimingBeltIcon,
  'bearing': BearingIcon,
  'generic': GenericIcon,
};

export default function ProductIcon({ categoryId, specifications, size = 'md', className = '' }: ProductIconProps) {
  const variant = getIconVariant(categoryId, specifications);
  const IconComponent = iconComponents[variant] || GenericIcon;
  const sizeClass = sizeMap[size];

  return (
    <div className={`${sizeClass} ${className}`}>
      <IconComponent />
    </div>
  );
}

// Export for use in CategoryCard
export { getIconVariant };
