interface SpecsTableProps {
  specifications: Record<string, any>;
}

const specLabels: Record<string, string> = {
  // Motors
  motor_type: 'Motor Type',
  horsepower: 'Horsepower (HP)',
  kilowatts: 'Power (kW)',
  voltage: 'Voltage',
  frequency_hz: 'Frequency (Hz)',
  phase: 'Phase',
  rpm_synchronous: 'Synchronous Speed (RPM)',
  rpm_full_load: 'Full Load Speed (RPM)',
  frame_size: 'Frame Size',
  enclosure_type: 'Enclosure',
  efficiency_class: 'Efficiency Class',
  efficiency_percent: 'Efficiency (%)',
  power_factor: 'Power Factor',
  full_load_amps: 'Full Load Amps (A)',
  service_factor: 'Service Factor',
  insulation_class: 'Insulation Class',
  ip_rating: 'IP Rating',
  mounting: 'Mounting',
  weight_kg: 'Weight (kg)',
  nema_design: 'NEMA Design',
  ambient_temp_c: 'Ambient Temp (°C)',
  // Roller Chain
  chain_type: 'Chain Type',
  ansi_chain_number: 'ANSI Chain Number',
  pitch_inches: 'Pitch (in)',
  tensile_strength_lbs: 'Tensile Strength (lbs)',
  working_load_lbs: 'Working Load (lbs)',
  number_of_strands: 'Number of Strands',
  roller_diameter_inches: 'Roller Diameter (in)',
  pin_diameter_inches: 'Pin Diameter (in)',
  plate_height_inches: 'Plate Height (in)',
  plate_thickness_inches: 'Plate Thickness (in)',
  overall_width_inches: 'Overall Width (in)',
  weight_per_foot_lbs: 'Weight per Foot (lbs/ft)',
  material: 'Material',
  surface_treatment: 'Surface Treatment',
  connecting_link_type: 'Connecting Link Type',
  lube_free: 'Lube-Free',
  corrosion_resistant: 'Corrosion Resistant',
  pre_loaded: 'Pre-Loaded',
  country_of_origin: 'Country of Origin',
};

function formatValue(key: string, value: any): string {
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') {
    if (key.includes('percent') || key.includes('factor')) return value.toString();
    return value.toLocaleString();
  }
  return String(value);
}

export default function SpecsTable({ specifications }: SpecsTableProps) {
  const entries = Object.entries(specifications);

  return (
    <div className="overflow-hidden rounded-xl border border-cream-300 dark:border-navy-700">
      <table className="w-full">
        <tbody>
          {entries.map(([key, value], i) => (
            <tr
              key={key}
              className={i % 2 === 0 ? 'bg-white dark:bg-navy-800' : 'bg-cream-100 dark:bg-navy-900'}
            >
              <td className="px-5 py-3 text-sm font-medium text-navy-600 dark:text-cream-400 w-1/2 border-r border-cream-300 dark:border-navy-700">
                {specLabels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </td>
              <td className="px-5 py-3 text-sm text-navy-800 dark:text-cream-200">
                {formatValue(key, value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
