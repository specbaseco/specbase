import Link from 'next/link';
import { Product } from '@/types';
import ManufacturerLogo from '@/components/ManufacturerLogo';
import { manufacturers } from '@/lib/data';

function getCategorySpecs(categoryId: string, specs: Record<string, any>): { label: string; value: any }[] {
  switch (categoryId) {
    case 'cat-motors':
      return [
        specs.horsepower && { label: 'HP', value: specs.horsepower },
        specs.voltage && { label: 'Voltage', value: specs.voltage },
        specs.rpm_full_load && { label: 'RPM', value: specs.rpm_full_load },
        specs.frame_size && { label: 'Frame', value: specs.frame_size },
        specs.enclosure_type && { label: 'Encl', value: specs.enclosure_type },
        specs.efficiency_class && { label: 'Eff', value: specs.efficiency_class },
      ].filter(Boolean) as { label: string; value: any }[];

    case 'cat-bearings':
      return [
        specs.shaft_size && { label: 'Shaft', value: specs.shaft_size + '"' },
        specs.housing_style && { label: 'Housing', value: specs.housing_style },
        specs.internals && { label: 'Internals', value: specs.internals },
        specs.dynamic_load_lbf && { label: 'Load', value: specs.dynamic_load_lbf + ' lbf' },
        specs.locking_type && { label: 'Lock', value: specs.locking_type },
      ].filter(Boolean) as { label: string; value: any }[];

    case 'cat-chain':
      return [
        (specs.ansi_chain_number || specs.ansi_number) && { label: 'ANSI', value: specs.ansi_chain_number || specs.ansi_number },
        (specs.pitch_inches || specs.pitch) && { label: 'Pitch', value: (specs.pitch_inches || specs.pitch) + '"' },
        (specs.number_of_strands || specs.strand_count) && { label: 'Strands', value: specs.number_of_strands || specs.strand_count },
        specs.tensile_strength && { label: 'Tensile', value: specs.tensile_strength + ' lbf' },
        specs.material && { label: 'Material', value: specs.material },
      ].filter(Boolean) as { label: string; value: any }[];

    case 'cat-vbelts':
      return [
        specs.section && { label: 'Section', value: specs.section },
        specs.length && { label: 'Length', value: specs.length },
        specs.length_type && { label: 'Type', value: specs.length_type },
        specs.strands && { label: 'Strands', value: specs.strands },
        specs.construction && { label: 'Constr', value: specs.construction },
      ].filter(Boolean) as { label: string; value: any }[];

    case 'cat-sheaves':
      return [
        specs.belt_section && { label: 'Section', value: specs.belt_section },
        specs.grooves && { label: 'Grooves', value: specs.grooves },
        specs.pitch_diameter && { label: 'PD', value: specs.pitch_diameter + '"' },
        specs.bushing_type && { label: 'Bushing', value: specs.bushing_type },
        specs.material && { label: 'Material', value: specs.material },
      ].filter(Boolean) as { label: string; value: any }[];

    case 'cat-belts':
      return [
        specs.profile && { label: 'Profile', value: specs.profile },
        specs.pitch_mm && { label: 'Pitch', value: specs.pitch_mm + 'mm' },
        specs.width_mm && { label: 'Width', value: specs.width_mm + 'mm' },
        specs.length_mm && { label: 'Length', value: specs.length_mm + 'mm' },
        specs.teeth && { label: 'Teeth', value: specs.teeth },
      ].filter(Boolean) as { label: string; value: any }[];

    case 'cat-sprockets':
      return [
        specs.ansi_number && { label: 'ANSI', value: specs.ansi_number },
        specs.teeth && { label: 'Teeth', value: specs.teeth },
        specs.hub_style && { label: 'Hub', value: specs.hub_style },
        specs.bore_type && { label: 'Bore', value: specs.bore_type },
        specs.material && { label: 'Material', value: specs.material },
      ].filter(Boolean) as { label: string; value: any }[];

    case 'cat-bushings':
      return [
        specs.bushing_type && { label: 'Type', value: specs.bushing_type },
        specs.series && { label: 'Series', value: specs.series },
        specs.max_bore && { label: 'Max Bore', value: specs.max_bore + '"' },
        specs.outer_diameter && { label: 'OD', value: specs.outer_diameter + '"' },
        specs.bore_type && { label: 'Bore', value: specs.bore_type },
      ].filter(Boolean) as { label: string; value: any }[];

    case 'cat-couplings':
      return [
        specs.coupling_type && { label: 'Type', value: specs.coupling_type },
        specs.series_size && { label: 'Size', value: specs.series_size },
        specs.max_bore && { label: 'Max Bore', value: specs.max_bore + '"' },
        specs.nominal_torque && { label: 'Torque', value: specs.nominal_torque + ' in-lbs' },
        specs.material && { label: 'Material', value: specs.material },
      ].filter(Boolean) as { label: string; value: any }[];

    case 'cat-engchain':
      return [
        specs.series && { label: 'Series', value: specs.series },
        specs.chain_type && { label: 'Type', value: specs.chain_type },
        specs.pitch && { label: 'Pitch', value: specs.pitch + '"' },
        specs.avg_tensile && { label: 'Tensile', value: specs.avg_tensile + ' lbs' },
        specs.pin_style && { label: 'Pin', value: specs.pin_style },
      ].filter(Boolean) as { label: string; value: any }[];

    case 'cat-gearboxes':
      return [
        specs.gearing_style && { label: 'Style', value: specs.gearing_style },
        specs.orientation && { label: 'Orient', value: specs.orientation },
        specs.max_input_hp && { label: 'Max HP', value: specs.max_input_hp },
        specs.output_torque && { label: 'Torque', value: specs.output_torque + ' lb-in' },
        specs.ratio_range && { label: 'Ratio', value: specs.ratio_range },
      ].filter(Boolean) as { label: string; value: any }[];

    case 'cat-gearmotors': {
      const fields = [
        { label: 'Horsepower', value: specs.horsepower },
        { label: 'Output RPM', value: specs.output_rpm },
        { label: 'Ratio', value: specs.ratio },
        { label: 'Torque (lb-in)', value: specs.torque },
        { label: 'Series', value: specs.series },
        { label: 'Enclosure', value: specs.enclosure_type },
        { label: 'Voltage', value: specs.voltage },
        { label: 'Phase', value: specs.phase },
        { label: 'Motor Type', value: specs.motor_type },
      ];
      return fields.filter(f => f.value);
    }

    default:
      // Generic: show first 5 non-empty specs
      return Object.entries(specs)
        .filter(([, v]) => v != null && v !== '')
        .slice(0, 5)
        .map(([k, v]) => ({ label: k.replace(/_/g, ' '), value: v }));
  }
}

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
            {getCategorySpecs(product.category_id, specs).map(({ label, value }) => (
              <span key={label} className="text-xs text-navy-600 dark:text-cream-400">
                <span className="text-cream-400">{label}:</span> {value}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
