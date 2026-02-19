import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-navy-800 text-cream-400 border-t border-navy-700">
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold text-sm">
                SB
              </div>
              <span className="text-lg font-semibold text-white">SpecBase</span>
            </div>
            <p className="text-sm text-cream-400 leading-relaxed">
              The intelligence layer for industrial components — starting with power transmission and motion control.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-2.5">
              <li><Link href="/why" className="text-sm hover:text-white transition-colors">Why SpecBase</Link></li>
              <li><Link href="/" className="text-sm hover:text-white transition-colors">Search Products</Link></li>
              <li><Link href="/configure" className="text-sm hover:text-white transition-colors">Configure</Link></li>
              <li><Link href="/crossover" className="text-sm hover:text-white transition-colors">Crossover Lookup</Link></li>
              <li><Link href="/api-docs" className="text-sm hover:text-white transition-colors">API Documentation</Link></li>
            </ul>
          </div>

          {/* For You */}
          <div>
            <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">For You</h4>
            <ul className="space-y-2.5">
              <li><Link href="/manufacturers" className="text-sm hover:text-white transition-colors">Manufacturers</Link></li>
              <li><Link href="/engineers" className="text-sm hover:text-white transition-colors">Engineers & OEMs</Link></li>
              <li><Link href="/engineers" className="text-sm hover:text-white transition-colors">Distributors</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2.5">
              <li><Link href="/search?category=motors" className="text-sm hover:text-white transition-colors">Motors</Link></li>
              <li><Link href="/search?category=gearboxes" className="text-sm hover:text-white transition-colors">Gearboxes</Link></li>
              <li><Link href="/search?category=roller-chain" className="text-sm hover:text-white transition-colors">Roller Chain</Link></li>
              <li><Link href="/search?category=timing-belts" className="text-sm hover:text-white transition-colors">Timing Belts</Link></li>
              <li><Link href="/search?category=bearings" className="text-sm hover:text-white transition-colors">Bearings</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cream-400">
            &copy; {new Date().getFullYear()} SpecBase. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-cream-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs text-cream-400 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="text-xs text-cream-400 hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
