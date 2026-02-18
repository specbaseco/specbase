interface ManufacturerBadgeProps {
  manufacturer: {
    name: string;
    logo_url?: string | null;
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { box: 'w-6 h-6', text: 'text-[8px]', img: 24 },
  md: { box: 'w-8 h-8', text: 'text-[10px]', img: 32 },
  lg: { box: 'w-12 h-12', text: 'text-sm', img: 48 },
};

function getInitials(name: string): string {
  return name.substring(0, 2).toUpperCase();
}

export default function ManufacturerBadge({ manufacturer, size = 'md', className = '' }: ManufacturerBadgeProps) {
  const s = sizeMap[size];

  if (manufacturer.logo_url) {
    return (
      <div className={`${s.box} rounded-md overflow-hidden bg-white dark:bg-navy-800 border border-cream-300 dark:border-navy-700 flex items-center justify-center ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={manufacturer.logo_url}
          alt={manufacturer.name}
          width={s.img}
          height={s.img}
          className="object-contain w-full h-full p-0.5"
          onError={(e) => {
            // On error, hide the img and show initials fallback
            const target = e.currentTarget;
            const parent = target.parentElement;
            if (parent) {
              target.style.display = 'none';
              const fallback = document.createElement('span');
              fallback.className = `${s.text} font-bold text-navy-600 dark:text-cream-400`;
              fallback.textContent = getInitials(manufacturer.name);
              parent.appendChild(fallback);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className={`${s.box} rounded-md bg-cream-200 dark:bg-navy-800 border border-cream-300 dark:border-navy-700 flex items-center justify-center ${className}`}>
      <span className={`${s.text} font-bold text-navy-600 dark:text-cream-400 leading-none`}>
        {getInitials(manufacturer.name)}
      </span>
    </div>
  );
}
