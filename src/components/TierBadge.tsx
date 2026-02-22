export type ManufacturerTier = 'free' | 'verified' | 'sponsored' | 'enterprise';

interface TierBadgeProps {
  tier: ManufacturerTier;
  size?: 'sm' | 'md';
}

const tierConfig: Record<ManufacturerTier, { label: string; classes: string; icon: JSX.Element | null }> = {
  free: {
    label: 'Listed',
    classes: 'bg-cream-200 dark:bg-navy-700 text-navy-500 dark:text-cream-400',
    icon: null,
  },
  verified: {
    label: 'Verified',
    classes: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    icon: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
  },
  sponsored: {
    label: 'Preferred Data Partner',
    classes: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    icon: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
  },
  enterprise: {
    label: 'Enterprise Partner',
    classes: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    icon: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
      </svg>
    ),
  },
};

export default function TierBadge({ tier, size = 'sm' }: TierBadgeProps) {
  const config = tierConfig[tier];

  // Don't show badge for free tier by default (too noisy)
  if (tier === 'free') return null;

  const sizeClasses = size === 'sm'
    ? 'text-xs px-2 py-0.5 gap-1'
    : 'text-sm px-3 py-1 gap-1.5';

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${sizeClasses} ${config.classes}`}>
      {config.icon}
      {config.label}
    </span>
  );
}

// Export a version that always shows, even for free tier
export function TierBadgeAlways({ tier, size = 'sm' }: TierBadgeProps) {
  const config = tierConfig[tier];

  const sizeClasses = size === 'sm'
    ? 'text-xs px-2 py-0.5 gap-1'
    : 'text-sm px-3 py-1 gap-1.5';

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${sizeClasses} ${config.classes}`}>
      {config.icon}
      {config.label}
    </span>
  );
}
