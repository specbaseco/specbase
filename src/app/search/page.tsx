import { Suspense } from 'react';
import SearchContent from './SearchContent';

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="bg-cream-100 dark:bg-navy-900 min-h-screen flex items-center justify-center">
        <div className="text-navy-500 dark:text-cream-400 text-sm">Loading search...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
