import Link from 'next/link';
import { Product } from '@/types';
import ManufacturerLogo from '@/components/ManufacturerLogo';
import { manufacturers } from '@/lib/data';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const specs = product.specifications;
  const mfr = manufacturers.find(m => m.id === product.manufacturer_id);

  return (
    <Link href={`/products/${product.id}`} className="card p-5 block group">
      <div className="flex gap-4">
        {/* Manufacturer logo box */}
        <div className="w-24 h-24 flex-shrink-0 bg-white dark:bg-navy-800 rounded-lg border border-cream-300 dark:border-navy-700 flex items-center justify-center group-hover:border-accent/30 transition-colors">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain rounded-lg p-1"
            />
          ) : (
            <ManufacturerLogo manufacturerId={product.manufacturer_id} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-accent uppercase tracking-wider">
                {mfr?.name}
              </p>
              <h3 className="text-sm font-semibold text-navy-800 dark:text-cream-200 group-hover:text-accent transition-colors mt-0.5 line-clamp-1">
                {product.name}
              </h3>
              <p className="text-xs text-navy-500 dark:text-cream-400 font-mono mt-0.5">
                {product.model_number}
              </p>
            </div>
            {product.is_featured && (
              <span className="text-[10px] font-medium bg-accent/10 text-accent px-2 py-0.5 rounded-full flex-shrink-0">
                Featured
              </span>
            )}
          </div>

          {/* Key specs */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
            {specs.horsepower && (
              <span className="text-xs text-navy-600 dark:text-cream-400">
                <span className="text-cream-400">HP:</span> {specs.horsepower}
              </span>
            )}
            {specs.voltage && (
              <span className="text-xs text-navy-600 dark:text-cream-400">
                <span className="text-cream-400">Voltage:</span> {specs.voltage}
              </span>
            )}
            {specs.rpm_full_load && (
              <span className="text-xs text-navy-600 dark:text-cream-400">
                <span className="text-cream-400">RPM:</span> {specs.rpm_full_load}
              </span>
            )}
            {specs.frame_size && (
              <span className="text-xs text-navy-600 dark:text-cream-400">
                <span className="text-cream-400">Frame:</span> {specs.frame_size}
              </span>
            )}
            {specs.enclosure_type && (
              <span className="text-xs text-navy-600 dark:text-cream-400">
                <span className="text-cream-400">Encl:</span> {specs.enclosure_type}
              </span>
            )}
            {specs.efficiency_class && (
              <span className="text-xs text-navy-600 dark:text-cream-400">
                <span className="text-cream-400">Eff:</span> {specs.efficiency_class}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
