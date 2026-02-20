import Link from 'next/link';
import type { Metadata } from 'next';
import { products, manufacturers } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Why SpecBase - Industrial Component Intelligence',
  description: 'See how SpecBase helps AI agents and engineers find the right industrial components faster with structured, machine-readable product data.',
};

/* ── Reusable icon components (inline SVG) ── */

function RobotIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 14.5M14.25 3.104c.251.023.501.05.75.082M19.8 14.5a2.25 2.25 0 010 3l-3.3 3.3a2.25 2.25 0 01-3.182 0L12 19.482l-1.318 1.318a2.25 2.25 0 01-3.182 0l-3.3-3.3a2.25 2.25 0 010-3L7.2 14.5" />
      <circle cx="9" cy="10" r="0.75" fill="currentColor" />
      <circle cx="15" cy="10" r="0.75" fill="currentColor" />
    </svg>
  );
}

function EngineerIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
    </svg>
  );
}

function ArrowDown() {
  return (
    <div className="flex justify-center my-2">
      <svg className="w-5 h-5 text-cream-400 dark:text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  );
}

/* ── Step Card Component ── */

interface StepProps {
  icon: React.ReactNode;
  label: string;
  detail: string;
  variant: 'muted' | 'accent';
}

function StepCard({ icon, label, detail, variant }: StepProps) {
  const styles = variant === 'muted'
    ? 'bg-cream-200 dark:bg-navy-800 border-cream-300 dark:border-navy-700 text-navy-500 dark:text-cream-400'
    : 'bg-accent/5 dark:bg-accent/10 border-accent/20 text-accent';

  return (
    <div className={`rounded-xl border p-4 flex items-start gap-3 ${styles}`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
        variant === 'muted'
          ? 'bg-cream-300/60 dark:bg-navy-700 text-cream-400 dark:text-navy-500'
          : 'bg-accent/10 text-accent'
      }`}>
        {icon}
      </div>
      <div>
        <p className={`text-sm font-semibold ${
          variant === 'muted' ? 'text-navy-600 dark:text-cream-300' : 'text-accent'
        }`}>{label}</p>
        <p className={`text-xs mt-0.5 ${
          variant === 'muted' ? 'text-navy-500 dark:text-cream-400' : 'text-navy-500 dark:text-cream-400'
        }`}>{detail}</p>
      </div>
    </div>
  );
}

/* ── Outcome Badge ── */

function OutcomeBadge({ variant, label }: { variant: 'bad' | 'good'; label: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
      variant === 'bad'
        ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-800'
        : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
    }`}>
      {variant === 'bad' ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {label}
    </div>
  );
}

/* ── Main Page ── */

export default function WhyPage() {
  return (
    <div className="bg-cream-100 dark:bg-navy-900 min-h-screen">
      {/* Hero */}
      <section className="bg-navy-800 text-white">
        <div className="container-narrow py-16 md:py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Why <span className="text-accent-light">SpecBase</span>?
          </h1>
          <p className="text-lg text-cream-400 mt-5 max-w-2xl mx-auto leading-relaxed">
            Industrial product data is trapped in PDFs, scattered across manufacturer websites,
            and impossible for software to read. We&apos;re fixing that.
          </p>
        </div>
      </section>

      {/* Story 1: AI Agents */}
      <section className="container-wide py-16 md:py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <RobotIcon className="w-4 h-4" />
            For AI Agents
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-cream-200">
            AI needs structured data, not PDFs
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Without SpecBase */}
          <div className="rounded-2xl border border-cream-300 dark:border-navy-700 bg-white dark:bg-navy-800 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-navy-500 dark:text-cream-400 uppercase tracking-wider">Without SpecBase</h3>
            </div>

            <StepCard
              variant="muted"
              icon={<RobotIcon className="w-5 h-5" />}
              label="AI Agent receives request"
              detail={'"Find me a 50HP TEFC motor for a pump application"'}
            />
            <ArrowDown />
            <StepCard
              variant="muted"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              }
              label="Scrapes PDFs & websites"
              detail="Unstructured catalogs, inconsistent formats across 6+ manufacturers"
            />
            <ArrowDown />
            <StepCard
              variant="muted"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              label="Slow, incomplete results"
              detail="Missing specs, can't compare across brands, hallucination risk"
            />
            <div className="mt-4">
              <OutcomeBadge variant="bad" label="Unreliable recommendation" />
            </div>
          </div>

          {/* With SpecBase */}
          <div className="rounded-2xl border-2 border-accent/30 bg-white dark:bg-navy-800 p-6 md:p-8 relative">
            <div className="absolute -top-3 left-6 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
              BETTER WAY
            </div>
            <div className="flex items-center gap-2 mb-6 mt-1">
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-accent uppercase tracking-wider">With SpecBase</h3>
            </div>

            <StepCard
              variant="accent"
              icon={<RobotIcon className="w-5 h-5" />}
              label="AI Agent receives request"
              detail={'"Find me a 50HP TEFC motor for a pump application"'}
            />
            <ArrowDown />
            <StepCard
              variant="accent"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
              }
              label="Calls SpecBase API"
              detail="Structured query: HP=50, enclosure=TEFC, voltage=460V"
            />
            <ArrowDown />
            <StepCard
              variant="accent"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              }
              label="Instant, structured results"
              detail="Complete specs, comparable across manufacturers, zero hallucination"
            />
            <div className="mt-4">
              <OutcomeBadge variant="good" label="Verified match with full specs" />
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container-wide">
        <div className="border-t border-cream-300 dark:border-navy-700" />
      </div>

      {/* Story 2: Engineers */}
      <section className="container-wide py-16 md:py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <EngineerIcon className="w-4 h-4" />
            For Engineers
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-cream-200">
            Stop opening 6 browser tabs to find one motor
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Without SpecBase */}
          <div className="rounded-2xl border border-cream-300 dark:border-navy-700 bg-white dark:bg-navy-800 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-navy-500 dark:text-cream-400 uppercase tracking-wider">The Old Way</h3>
            </div>

            <StepCard
              variant="muted"
              icon={<EngineerIcon className="w-5 h-5" />}
              label="Engineer needs a replacement motor"
              detail={'"The ABB motor on line 3 failed — I need an equivalent"'}
            />
            <ArrowDown />
            <StepCard
              variant="muted"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25m-18 0V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6zM7.5 6h.008v.008H7.5V6zm2.25 0h.008v.008H9.75V6z" />
                </svg>
              }
              label="Opens 6 manufacturer websites"
              detail="ABB, Siemens, WEG, Nidec, Leeson, Marathon — each with different layouts"
            />
            <ArrowDown />
            <StepCard
              variant="muted"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              label="Hours of manual comparison"
              detail="Copy-paste specs into spreadsheet, check frame compatibility, verify voltage"
            />
            <div className="mt-4">
              <OutcomeBadge variant="bad" label="Hours wasted, might still miss a match" />
            </div>
          </div>

          {/* With SpecBase */}
          <div className="rounded-2xl border-2 border-accent/30 bg-white dark:bg-navy-800 p-6 md:p-8 relative">
            <div className="absolute -top-3 left-6 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
              BETTER WAY
            </div>
            <div className="flex items-center gap-2 mb-6 mt-1">
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-accent uppercase tracking-wider">With SpecBase</h3>
            </div>

            <StepCard
              variant="accent"
              icon={<EngineerIcon className="w-5 h-5" />}
              label="Engineer needs a replacement motor"
              detail={'"The ABB motor on line 3 failed — I need an equivalent"'}
            />
            <ArrowDown />
            <StepCard
              variant="accent"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              }
              label="One search, all manufacturers"
              detail={'"50HP TEFC 460V" — natural language, no dropdowns or filters needed'}
            />
            <ArrowDown />
            <StepCard
              variant="accent"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              }
              label="Side-by-side comparison"
              detail="Every spec normalized — frame, voltage, efficiency, weight — across all brands"
            />
            <div className="mt-4">
              <OutcomeBadge variant="good" label="Right part in minutes, not hours" />
            </div>
          </div>
        </div>
      </section>

      {/* The Data Advantage */}
      <section className="bg-navy-800 text-white">
        <div className="container-wide py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">What makes this possible</h2>
            <p className="text-cream-400 mt-3">Every product in SpecBase is structured, normalized, and queryable</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: 'Structured Specs',
                desc: 'Every product has 20+ normalized specification fields — horsepower, voltage, frame size, enclosure, efficiency class, and more.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v.75" />
                  </svg>
                ),
              },
              {
                title: 'Natural Language Search',
                desc: '"50 HP TEFC 460V motor" gets parsed into structured filters automatically — horsepower, enclosure type, voltage, category.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                ),
              },
              {
                title: 'REST API',
                desc: 'JSON endpoints for search, compare, and browse. Built for AI agents, chatbots, and any software that needs component data.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-12 h-12 rounded-xl bg-navy-700 flex items-center justify-center text-accent-light mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-cream-400 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream-200 dark:bg-navy-800 border-t border-cream-300 dark:border-navy-700">
        <div className="container-narrow py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-800 dark:text-cream-200">
            Try it yourself
          </h2>
          <p className="text-navy-500 dark:text-cream-400 mt-3 max-w-lg mx-auto">
            Search {products.length.toLocaleString()}+ products across {manufacturers.filter(m => products.some(p => p.manufacturer_id === m.id)).length} manufacturers. No account required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="/search" className="btn-primary">
              Search Products
            </Link>
            <Link href="/api-docs" className="btn-secondary">
              View API Docs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
