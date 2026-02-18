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
  return (
    <Link
      href={`/search?category=${slug}`}
      className="card p-6 flex flex-col items-center text-center group hover:border-accent/30 transition-all"
    >
      <div className="w-16 h-16 rounded-2xl bg-cream-200 dark:bg-navy-800 flex items-center justify-center text-navy-600 dark:text-cream-400 group-hover:bg-accent/10 group-hover:text-accent transition-all">
        <ProductIcon categoryId={categoryId} size="sm" />
      </div>
      <h3 className="text-base font-semibold text-navy-800 dark:text-cream-200 mt-4 group-hover:text-accent transition-colors">
        {name}
      </h3>
      <p className="text-xs text-navy-500 dark:text-cream-400 mt-1.5 line-clamp-2 leading-relaxed">
        {description}
      </p>
      <p className="text-xs text-cream-400 mt-3">
        {productCount > 0 ? `${productCount} products` : 'Coming soon'}
      </p>
    </Link>
  );
}
