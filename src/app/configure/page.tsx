import { Suspense } from 'react';
import ConfigureContent from './ConfigureContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Configure - SpecBase',
  description: 'Interactive product configurator for industrial components. Select a category, refine with filters, and find the right part across leading manufacturers.',
};

export default function ConfigurePage() {
  return (
    <Suspense fallback={
      <div className="bg-cream-100 dark:bg-navy-900 min-h-screen flex items-center justify-center">
        <div className="text-navy-500 dark:text-cream-400 text-sm">Loading configurator...</div>
      </div>
    }>
      <ConfigureContent />
    </Suspense>
  );
}
