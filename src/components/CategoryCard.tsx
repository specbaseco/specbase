import Link from 'next/link';
import ProductIcon from '@/components/ProductIcon';

interface CategoryCardProps {
  name: string;
  slug: string;
  description: string;
  icon: string;
  categoryId: string;
  productCount: number;
}

export default function CategoryCard({ name, slug, description, categoryId, productCount }: CategoryCardProps) {
  const hasProducts = productCount > 0;

  const content = (
    <>
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
        hasProducts
          ? 'bg-cream-200 dark:bg-navy-800 text-navy-600 dark:text-cream-400 group-hover:bg-accent/10 group-hover:text-accent'
          : 'bg-cream-200/60 dark:bg-navy-800/60 text-cream-400 dark:text-navy-600'
      }`}>
        <ProductIcon categoryId={categoryId} size="sm" />
      </div>
      <h3 className={`text-base font-semibold mt-4 transition-colors ${
        hasProducts
          ? 'text-navy-800 dark:text-cream-200 group-hover:text-accent'
          : 'text-navy-500 dark:text-cream-400'
      }`}>
        {name}
      </h3>
      <p className="text-xs text-navy-500 dark:text-cream-400 mt-1.5 line-clamp-2 leading-relaxed">
        {description}
      </p>
      <p className={`text-xs mt-3 ${hasProducts ? 'text-cream-400' : 'text-cream-400/60'}`}>
        {hasProducts ? `${productCount} products` : 'Expanding soon'}
      </p>
    </>
  );

  if (!hasProducts) {
    return (
      <div className="card p-6 flex flex-col items-center text-center opacity-70 cursor-default">
        {content}
      </div>
    );
  }

  return (
    <Link
      href={`/search?category=${slug}`}
      className="card p-6 flex flex-col items-center text-center group hover:border-accent/30 transition-all"
    >
      {content}
    </Link>
  );
}
