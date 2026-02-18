'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-navy-800 dark:text-cream-200 mb-4">
          Something went wrong
        </h2>
        <p className="text-navy-500 dark:text-cream-400 mb-6">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <button
          onClick={() => reset()}
          className="btn-primary"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
