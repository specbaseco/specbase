import { Suspense } from 'react';
import CrossoverContent from './CrossoverContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crossover Lookup - SpecBase',
  description: 'Find equivalent industrial components across manufacturers. Enter a part number to discover crossover matches with matching specifications.',
};

export default function CrossoverPage() {
  return (
    <Suspense fallback={
      <div className="bg-cream-100 dark:bg-navy-900 min-h-screen flex items-center justify-center">
        <div className="text-navy-500 dark:text-cream-400 text-sm">Loading crossover lookup...</div>
      </div>
    }>
      <CrossoverContent />
    </Suspense>
  );
}
