import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Check, 
  X, 
  Info, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  Compass, 
  FolderLock, 
  ChevronDown, 
  BarChart3, 
  Zap, 
  Table2, 
  FileText,
  MousePointerClick
} from 'lucide-react';
import { cn } from '../lib/utils';

// Helper to scroll smoothly to a page target
const scrollToSection = (id: string) => {
  const el = document.querySelector(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

export function SeeWhatChanged() {
  return (
    <div id="hero" className="relative overflow-hidden pt-[60px] pb-[72px] bg-[var(--bg)]">
      {/* Dynamic Background Orbs */}
      <div className="absolute top-[10%] left-[-5%] w-[450px] h-[450px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(163,177,155,0.11) 0%, transparent 75%)',
        }}
      />
      <div className="absolute bottom-[5%] right-[-5%] w-[450px] h-[450px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(78,110,83,0.08) 0%, transparent 75%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Pure Decisive Message Content */}
        <div className="lg:col-span-6 text-left space-y-6">
          <div className="inline-flex items-center gap-[7px] border border-[rgba(45,60,48,0.14)] bg-[rgba(45,60,48,0.03)] rounded-full px-4 py-1 text-[11px] text-[var(--blue)] font-bold tracking-[0.1em] uppercase shadow-sm">
            <span className="relative w-1.5 h-1.5 rounded-full bg-[var(--green)] flex shrink-0 animate-pulse" />
            Scope Creep & Markup Engine
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-[var(--blue2)] leading-[1.08]">
            Find hidden proposal deltas before signing.
          </h1>

          <p className="text-[15px] sm:text-[16px] text-[var(--muted)] leading-relaxed font-medium max-w-xl">
            Align mismatched line items, detect scope creep, and surface vendor pricing changes in minutes—enabling biotech ops teams to negotiate from evidence.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => scrollToSection('.upload-section')}
              className="px-6 py-3.5 bg-[var(--blue2)] text-white font-extrabold rounded-xl flex items-center gap-2 shadow-sm hover:opacity-95 transition-all text-xs uppercase tracking-wider cursor-pointer group"
            >
              Analyze a Sample Proposal
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => scrollToSection('#features')}
              className="px-6 py-3.5 bg-white border border-[var(--border2)] text-[var(--blue2)] font-extrabold rounded-xl flex items-center gap-2 hover:bg-[var(--navy)] transition-all text-xs uppercase tracking-wider cursor-pointer"
            >
              Watch 2-Minute Tour
            </button>
          </div>

          {/* Support line */}
          <p className="text-[11px] font-bold text-[var(--muted2)] uppercase tracking-wide">
            Zero-retention workflow. Export, reset, and clear files permanently.
          </p>

          {/* Visual Callouts - Reduced context to keep it clean and focused */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-6 border-t border-[var(--border)] max-w-md">
            {[
              "Scope changes detected",
              "Pricing markup surfaced"
            ].map((text, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-bold text-[var(--blue2)]">
                <span className="w-5 h-5 rounded-md bg-[rgba(78,110,83,0.08)] flex items-center justify-center text-[var(--blue)] font-black text-[10px]">✓</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Re-designed, Obvious Sequential Reading Flow */}
        <div className="lg:col-span-6 relative flex justify-center">
          <div className="stage w-full max-w-[480px] h-auto min-h-[390px] rounded-3xl border border-[var(--border2)] bg-gradient-to-b from-white to-[rgba(245,247,244,0.4)] backdrop-blur-sm shadow-md relative overflow-hidden flex flex-col justify-between p-6">
            <div className="orb orb-center-glow absolute inset-0 m-auto pointer-events-none opacity-40 animate-pulse" />
            
            {/* SEQUENCE 1: Revised / Competing Proposal Comparison */}
            <div className="w-full flex items-center justify-between gap-3 relative z-10 select-none">
              <div className="flex-1 bg-white border border-[var(--border2)] rounded-xl p-3 shadow-xs">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">DOC A: Baseline</span>
                </div>
                <div className="text-xs font-mono font-bold text-[var(--blue2)] tracking-tight truncate">Clin_SOW_v1.xlsx</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">$413,000 Budget</div>
              </div>
              
              <div className="flex flex-col items-center shrink-0">
                <span className="text-[10px] font-bold text-[var(--muted2)] font-mono mb-1 uppercase tracking-wider">VS</span>
                <div className="w-6 h-6 rounded-full bg-[rgba(78,110,83,0.06)] border border-[rgba(78,110,83,0.12)] flex items-center justify-center">
                  <ArrowRight className="w-3 h-3 text-[var(--blue)]" />
                </div>
              </div>

              <div className="flex-1 bg-white border border-[var(--blue)] rounded-xl p-3 shadow-sm relative">
                <div className="absolute top-2.5 right-2.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--green)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--green)]"></span>
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" />
                  <span className="text-[10px] font-bold text-[var(--green)] uppercase tracking-wider">DOC B: Revised</span>
                </div>
                <div className="text-xs font-mono font-bold text-[var(--blue2)] tracking-tight truncate">Clin_SOW_v2.xlsx</div>
                <div className="text-[10px] text-[var(--green)] font-bold mt-0.5">$450,000 Budget</div>
              </div>
            </div>

            {/* Connection Node */}
            <div className="w-full flex justify-center my-3 relative z-10">
              <div className="h-6 w-[2px] bg-gradient-to-b from-slate-200 to-[var(--blue)] opacity-60" />
            </div>

            {/* SEQUENCE 2 & 3: Surfaced Issue, Savings Opportunity, and Recommendation */}
            <div className="w-full bg-white border-2 border-[var(--blue2)] rounded-2xl p-4.5 shadow-lg relative z-10 transition-all hover:shadow-xl group">
              {/* Surfaced Insight Header */}
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[var(--blue)] bg-[rgba(78,110,83,0.08)] px-2 py-0.5 rounded uppercase tracking-wide">
                    Surfaced Finding
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    ID: VR-204
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-extrabold text-[var(--blue2)]">
                  <Sparkles className="w-3 h-3 text-[var(--blue)] animate-pulse" />
                  SOW Aligned
                </div>
              </div>

              {/* Finding / Delta section */}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-extrabold text-[var(--blue2)] tracking-tight">+$37,000</span>
                <span className="text-xs font-bold text-[var(--muted)]">Spend Increase Detected</span>
              </div>

              {/* The Surfaced markup issue */}
              <div className="text-xs text-slate-600 bg-amber-50/50 border border-amber-100 rounded-lg p-2.5 mb-3 flex items-start gap-2">
                <span className="text-sm select-none shrink-0">⚠️</span>
                <span className="leading-relaxed font-semibold">
                  <strong className="text-[var(--blue2)]">Senior Scientist II</strong> rate increased from <span className="line-through text-slate-400">$140</span> to <strong className="text-[var(--red)]">$195/hr</strong> (39.2% variance)
                </span>
              </div>

              {/* Recommendation Action Section */}
              <div className="bg-[rgba(55,108,67,0.04)] border border-[rgba(55,108,67,0.1)] rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[rgba(55,108,67,0.1)] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[var(--green)]" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[var(--muted2)] uppercase tracking-wider">Negotiation Leverage</div>
                    <div className="text-[11px] font-extrabold text-[var(--blue2)]">Request guide rate alignment</div>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-extrabold text-[var(--green)] bg-white px-2 py-1 rounded-md border border-[rgba(55,108,67,0.12)] shrink-0">
                  Save $22k
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default function LandingFeatures() {
  const [activeFeature, setActiveFeature] = useState<number>(0);
  const [pausedUntil, setPausedUntil] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  // FAQs exact text mapping
  const faqs = [
    {
      q: "How does Veridian align mismatched line item names?",
      a: "It maps corresponding roles by analyzing structural patterns and naming similarity, instantly pinning exact rate changes."
    },
    {
      q: "Is sensitive pricing or vendor data stored?",
      a: "No. Veridian is a zero-retention workspace. Your files stay local to your browser and are cleared when you close or reset."
    },
    {
      q: "What files are supported?",
      a: "It is built specifically for spreadsheet-based SOWs, RFP responses, and proposals where formatting or structure differs."
    },
    {
      q: "Can I export my findings?",
      a: "Yes. Export your full comparison workspace, differential table, and talking points instantly to PDF or Excel."
    }
  ];

  // Features mapping
  const tourFeatures = [
    {
      title: "Benchmark pricing changes",
      badge: "Rate Variance",
      tagline: "Track shifted unit pricing, hour changes, and rate increases instantly by category.",
      mockupObj: {
        item: "Sr. Research Scientist II",
        baseline: "$140/hr",
        vendor: "$195/hr",
        markup: "39.2% rate escalation",
        severity: "critical",
        alert: "Flagged: FTE hourly price increased by 39.2% compared to original baseline parameters. Recommending back to guide rates.",
        recommendedAction: "Request guide rate"
      },
      icon: <Table2 className="w-5 h-5 text-[var(--blue)]" />
    },
    {
      title: "Detect hidden scope shifts",
      badge: "Add-on Detection",
      tagline: "Flag new surcharges, added items, and inflated quantities between versions.",
      mockupObj: {
        item: "Ancillary Lead PM Markup",
        baseline: "$0 (Standard)",
        vendor: "$18,200",
        markup: "Unscheduled Surcharge",
        severity: "warning",
        alert: "Warning: Unscheduled operational charge injected in revised SOW. There is no baseline equivalent found.",
        recommendedAction: "Audit contract terms"
      },
      icon: <Check className="w-5 h-5 text-[var(--amber)]" />
    },
    {
      title: "Generate talking points",
      badge: "Evidence Deck",
      tagline: "Generate clear counters and evidence-backed leverage summaries for review meetings.",
      mockupObj: {
        item: "Smart Counter-Offer",
        baseline: "Standard Review",
        vendor: "Veridian Brief v1",
        markup: "Evidence-Backed",
        severity: "info",
        alert: "Calculated Opportunity: Accept overall revised framework but negotiate tier breaks on units to recover $22k.",
        recommendedAction: "Request volume tier discount"
      },
      icon: <Zap className="w-5 h-5 text-[var(--green)]" />
    }
  ];

  // Autoplay and click-pause logic for Product Tour
  React.useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
    let pauseInterval: NodeJS.Timeout | null = null;

    const updatePauseStatus = () => {
      const now = Date.now();
      const paused = now < pausedUntil;
      setIsPaused(paused);
      setSecondsLeft(paused ? Math.max(0, Math.ceil((pausedUntil - now) / 1000)) : 0);
    };

    updatePauseStatus();
    pauseInterval = setInterval(updatePauseStatus, 250);

    const tick = () => {
      const now = Date.now();
      if (now >= pausedUntil) {
        setActiveFeature((prev) => (prev + 1) % tourFeatures.length);
        timerId = setTimeout(tick, 15000);
      } else {
        const remaining = pausedUntil - now;
        timerId = setTimeout(() => {
          setActiveFeature((prev) => (prev + 1) % tourFeatures.length);
          timerId = setTimeout(tick, 15000);
        }, remaining);
      }
    };

    const now = Date.now();
    if (now >= pausedUntil) {
      timerId = setTimeout(tick, 15000);
    } else {
      timerId = setTimeout(() => {
        setActiveFeature((prev) => (prev + 1) % tourFeatures.length);
        timerId = setTimeout(tick, 15000);
      }, pausedUntil - now);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
      if (pauseInterval) clearInterval(pauseInterval);
    };
  }, [pausedUntil, tourFeatures.length]);

  const handleFeatureClick = (index: number) => {
    setActiveFeature(index);
    setPausedUntil(Date.now() + 35000);
  };

  return (
    <>
      {/* SECTION 3: WHY TEAMS USE VERIDIAN */}
      <section id="why-us" className="w-full bg-[var(--navy)] border-t border-[var(--border)] scroll-mt-20">
        <div className="section max-w-7xl mx-auto text-left py-20 px-6">
          <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--blue)] mb-3">
            Why Teams Use Veridian
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--blue2)] tracking-tight max-w-4xl mb-6 leading-tight">
            Why manual spreadsheet comparisons fail.
          </h2>
          <p className="text-[15px] text-[var(--muted)] max-w-3xl font-medium leading-relaxed mb-12">
            Renamed roles, buried add-on fees, and inconsistent formatting make side-by-side reviews slow and error-prone. Veridian automates the alignment, highlighting exact SOW variances in minutes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mt-8">
            {/* Without Veridian */}
            <div className="bg-white border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-[var(--red)] mb-6 flex items-center gap-2 pb-3 border-b border-[var(--border)]">
                <span className="w-4 h-4 rounded-full bg-[rgba(168,66,66,0.1)] text-[var(--red)] flex items-center justify-center text-[10px] font-black">✕</span>
                Without Veridian
              </h3>
              <ul className="space-y-4">
                {[
                  "Manual tracing of renamed, mismatched line items SOWs",
                  "Surcharges and padding missed in tight review schedules",
                  "Rebuilding side-by-side sheets for every new revision",
                  "Negotiating with vendors without structured quantitative evidence"
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-xs font-bold text-slate-700 leading-normal">
                    <span className="text-[var(--red)] select-none mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* With Veridian */}
            <div className="bg-white border border-[var(--blue)] rounded-2xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-[var(--green)] mb-6 flex items-center gap-2 pb-3 border-b border-[var(--border)]">
                <span className="w-4 h-4 rounded-full bg-[rgba(55,108,67,0.1)] text-[var(--green)] flex items-center justify-center text-[10px] font-black">✓</span>
                With Veridian
              </h3>
              <ul className="space-y-4">
                {[
                  "Instant normalized alignment across proposal versions",
                  "Automatic detection of rate shifts and hidden fee additions",
                  "Reviews completed in minutes with clear financial insights",
                  "Exportable talking points and aligned comparison summaries"
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-xs font-bold text-[var(--blue2)] leading-normal">
                    <span className="text-[var(--green)] select-none mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS */}
      <section id="how-it-works" className="w-full bg-[var(--bg)] border-t border-[var(--border)] scroll-mt-20">
        <div className="section max-w-7xl mx-auto py-20 px-6 text-left">
          <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--blue)] mb-3">
            How It Works
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--blue2)] tracking-tight mb-12">
            Veridian turns spreadsheet revisions into a clean decision.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mt-8">
            {[
              {
                num: "01",
                title: "Upload Documents",
                desc: "Upload two proposal versions. Veridian handles complex Excel files even if structure, formatting, or task naming differs."
              },
              {
                num: "02",
                title: "Smart Alignment",
                desc: "The match engine maps corresponding roles across mismatched sheets, instantly pinpointing cost additions and removals."
              },
              {
                num: "03",
                title: "Drill into Deltas",
                desc: "Review spend shifts, category variances, and direct negotiation playbooks on an evidence-driven single-screen view."
              },
              {
                num: "04",
                title: "Export & Reset",
                desc: "Export your variance findings to Excel or PDF reports, then clear your session data securely at any time."
              }
            ].map((step, idx) => (
              <div key={idx} className="bg-white border border-[var(--border)] p-6 rounded-2xl flex flex-col justify-between hover:border-[var(--blue)] hover:shadow-sm transition-all duration-200">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-2xl font-black text-[var(--blue)] font-mono tracking-wider shrink-0">
                      {step.num}
                    </span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--blue2)]">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[var(--muted)] leading-relaxed font-semibold">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MID-PAGE CTA */}
      <section className="w-full bg-[var(--navy)] border-t border-[var(--border)]">
        <div className="section max-w-5xl mx-auto py-24 px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[var(--blue2)] tracking-tight leading-none">
            Review proposals faster. Surface savings sooner.
          </h2>
          <p className="text-[14px] sm:text-base text-[var(--muted)] max-w-2xl mx-auto font-medium">
            Start with a sample comparison and see how Veridian turns spreadsheet revisions into a clearer decision.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => scrollToSection('.upload-section')}
              className="px-6 py-3.5 bg-[var(--blue2)] text-white font-extrabold rounded-xl flex items-center gap-2 shadow-sm hover:opacity-95 transition-all text-xs uppercase tracking-wider cursor-pointer group"
            >
              Analyze a Sample Proposal
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <button
              onClick={() => scrollToSection('#features')}
              className="px-6 py-3.5 bg-white border border-[var(--border2)] text-[var(--blue2)] font-extrabold rounded-xl flex items-center gap-2 hover:bg-[var(--navy)] transition-all text-xs uppercase tracking-wider cursor-pointer"
            >
              View Product Tour
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 5: PRODUCT TOUR */}
      <section id="features" className="w-full bg-[var(--bg)] border-t border-[var(--border)] scroll-mt-20">
        <div className="section max-w-7xl mx-auto py-20 px-6 text-left">
          <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--blue)] mb-3">
            Product Tour
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--blue2)] tracking-tight mb-10">
            Built for review speed, not spreadsheet archaeology.
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
            {/* Features list (left 5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {tourFeatures.map((f, i) => (
                <button
                  key={i}
                  onClick={() => handleFeatureClick(i)}
                  className={cn(
                    "p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 pointer-events-auto block w-full outline-none relative overflow-hidden",
                    activeFeature === i 
                      ? "bg-white border-[var(--blue2)] shadow-sm translate-x-1"
                      : "bg-white/40 border-[var(--border)] hover:border-[var(--blue)] hover:bg-white"
                  )}
                >
                  {activeFeature === i && !isPaused && (
                    <motion.div 
                      key={i}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 15, ease: "linear" }}
                      className="absolute bottom-0 left-0 h-[3px] bg-[var(--blue)]"
                    />
                  )}
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-[34px] h-[34px] rounded-lg bg-[rgba(45,60,48,0.04)] border border-[var(--border)] flex items-center justify-center">
                      {f.icon}
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-[var(--blue)] tracking-wider uppercase bg-[rgba(78,110,83,0.08)] px-2 py-0.5 rounded-full">
                        {f.badge}
                      </span>
                      <h3 className="text-sm font-extrabold text-[var(--blue2)] mt-1">{f.title}</h3>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--muted)] mt-2 font-semibold leading-relaxed relative z-10">
                    {f.tagline}
                  </p>
                </button>
              ))}
            </div>

            {/* Simulated Live Terminal View (right 7 cols) */}
            <div className="lg:col-span-7 bg-white border border-[var(--border2)] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between border-b border-[var(--border2)] pb-4 mb-4 select-none">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "w-2.5 h-2.5 rounded-full transition-colors",
                    isPaused ? "bg-amber-500" : "bg-[var(--green)] animate-pulse"
                  )}></span>
                  <span className="text-xs font-bold font-mono uppercase text-[var(--blue2)]">Match Workspace</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold font-mono uppercase">
                  {isPaused ? (
                    <span className="text-amber-600 bg-amber-50/50 px-2 py-0.5 rounded border border-amber-200 font-mono tracking-tight">
                      Paused
                    </span>
                  ) : (
                    <span className="text-[var(--blue)] bg-[rgba(78,110,83,0.06)] px-2 py-0.5 rounded border border-[rgba(78,110,83,0.12)] flex items-center gap-1 font-mono">
                      <span className="w-1 h-1 rounded-full bg-[var(--blue)] animate-ping" />
                      Comparing SOWs
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded">
                    Match Confidence: 98%
                  </span>
                </div>
              </div>

              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Visual metadata block */}
                <div className="bg-[var(--bg)] p-4 rounded-xl border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-[9px] font-bold text-[var(--muted2)] uppercase tracking-wider">Identified Line-Item</div>
                    <div className="text-base font-extrabold text-[var(--blue2)] leading-tight">{tourFeatures[activeFeature].mockupObj.item}</div>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <div className="text-[9px] font-bold text-[var(--muted2)] uppercase tracking-wider">Original Base (V1)</div>
                      <div className="text-xs font-bold font-mono text-[var(--text)]">{tourFeatures[activeFeature].mockupObj.baseline}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-[var(--muted2)] uppercase tracking-wider">Revised (V2)</div>
                      <div className="text-xs font-bold font-mono text-[var(--red)]">{tourFeatures[activeFeature].mockupObj.vendor}</div>
                    </div>
                  </div>
                </div>

                {/* Status indicator badges */}
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold px-3 py-1 bg-[rgba(168,66,66,0.08)] text-[var(--red)] rounded-full border border-[rgba(168,66,66,0.12)]">
                    ⚠️ {tourFeatures[activeFeature].mockupObj.markup}
                  </span>
                  <span className="text-[10px] font-bold px-3 py-1 bg-[var(--navy)] text-[var(--blue2)] rounded-full border border-[var(--border)]">
                    Review Required
                  </span>
                </div>

                {/* Recommendation insight box */}
                <div className="p-4 rounded-xl border border-dashed border-[rgba(78,110,83,0.3)] bg-[rgba(78,110,83,0.02)] flex gap-3">
                  <span className="text-lg">⚡</span>
                  <p className="text-xs text-[var(--muted)] leading-relaxed font-semibold">
                    {tourFeatures[activeFeature].mockupObj.alert}
                  </p>
                </div>

                {/* Control simulation line */}
                <div className="border-t border-[var(--border)] pt-4 flex justify-between items-center bg-[var(--bg)] p-3 rounded-xl text-xs font-bold text-[var(--muted)]">
                  <span>Recommended Action</span>
                  <span className="text-[10px] uppercase text-[var(--green)] font-extrabold tracking-wider bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                    {tourFeatures[activeFeature].mockupObj.recommendedAction}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: RESULTS WORKSPACE */}
      <section className="w-full bg-[var(--navy)] border-t border-[var(--border)]">
        <div className="section max-w-7xl mx-auto py-24 px-6 text-left">
          <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--blue)] mb-3">
            Results Workspace
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--blue2)] tracking-tight mb-4">
            Focus on high-value variances.
          </h2>
          <p className="text-[15px] text-[var(--muted)] max-w-2xl font-medium leading-relaxed mb-12">
            The results workspace consolidates executive findings, detailed line variance listings, spend charts, and contract leverage tips in one easily navigable, unified screen.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mt-8 items-center">
            {/* Visual Product Proof Left: High-Fidelity Mini Workspace Dashboard */}
            <div className="lg:col-span-7 bg-white border border-[var(--border2)] rounded-2xl p-6 shadow-md relative overflow-hidden select-none">
              {/* Corner accent ornament representing neural workspace */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[rgba(78,110,83,0.02)] border-l border-b border-dashed border-[rgba(78,110,83,0.1)] rounded-bl-3xl pointer-events-none flex items-center justify-center text-[10px] font-mono text-slate-300 font-bold uppercase tracking-wide">
                Normalized View
              </div>

              {/* Workspace Mock Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[var(--blue)] font-mono">Veridian Analytical Workspace</span>
                  <div className="text-sm font-bold text-[var(--blue2)]">Proposal SOW Comparison Brief</div>
                </div>
                <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 px-2 py-0.5 rounded text-[10px] font-extrabold text-[var(--green)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-pulse" />
                  98% Alignment Score
                </div>
              </div>

              {/* Mock Metrics/Insights */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-[var(--bg)] border border-[var(--border)] p-2.5 rounded-xl">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Identified Savings</div>
                  <div className="text-base font-black text-[var(--blue2)] mt-0.5">$37,200</div>
                </div>
                <div className="bg-[var(--bg)] border border-[var(--border)] p-2.5 rounded-xl">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Scope Variance</div>
                  <div className="text-base font-black text-amber-600 mt-0.5">+4 Shifts</div>
                </div>
                <div className="bg-[var(--bg)] border border-[var(--border)] p-2.5 rounded-xl">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Confidence Level</div>
                  <div className="text-base font-black text-[var(--green)] mt-0.5">High</div>
                </div>
              </div>

              {/* Mock Mapped Line Items Table */}
              <div className="space-y-2 mb-5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Mismatched Line Alignment (Resolved)</span>
                  <span className="font-mono text-[9px] text-[var(--blue)]">2 Items Flagged</span>
                </div>

                {/* Line Item #1 */}
                <div className="border border-red-100 bg-red-50/20 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-800 font-extrabold">Sr. Research Scientist II</strong>
                      <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-mono font-bold uppercase tracking-tight">Rate Escalation</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-semibold">Mapped to: &quot;Lead Sci II&quot; in baseline</div>
                  </div>
                  <div className="flex gap-4 sm:text-right shrink-0">
                    <div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase">Baseline</div>
                      <div className="font-mono font-bold">$140/hr</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase">Revised</div>
                      <div className="font-mono font-extrabold text-[var(--red)]">$195/hr</div>
                    </div>
                  </div>
                </div>

                {/* Line Item #2 */}
                <div className="border border-amber-100 bg-amber-50/20 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-800 font-extrabold">Ancillary PM Surcharge</strong>
                      <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.2 rounded font-mono font-bold uppercase tracking-tight">Scope Creep</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-semibold">No comparable baseline item found</div>
                  </div>
                  <div className="flex gap-4 sm:text-right shrink-0">
                    <div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase">Baseline</div>
                      <div className="font-mono font-bold text-slate-400">—</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase">Revised</div>
                      <div className="font-mono font-extrabold text-amber-600">$18,200</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mock Interactive Negotiation Playbook Card */}
              <div className="border border-dashed border-[rgba(78,110,83,0.3)] bg-[rgba(78,110,83,0.02)] p-3.5 rounded-xl text-xs">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--green)] shrink-0" />
                  <span className="text-[10px] font-black uppercase text-[var(--blue2)] tracking-wide">Target Playbook Recommendation</span>
                </div>
                <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">
                  Request vendor revert Scientist hourly rate to the approved guideline ($140/hr) to recover <strong className="text-[var(--blue2)]">$22,200</strong> in budget surplus.
                </p>
              </div>
            </div>

            {/* Feature Callouts Right Side: Shorter, Scalable, and Laser Focused */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {[
                {
                  icon: <FileText className="w-4 h-4 text-[var(--blue)]" />,
                  title: "1. Executive Analytics",
                  desc: "Instantly spot overall budget shifts, matching consistency parameters, and simplified plain English delta overviews on workspace initialization."
                },
                {
                  icon: <Table2 className="w-4 h-4 text-[var(--blue)]" />,
                  title: "2. Differential Listing",
                  desc: "Work inside a highly detailed comparative grid that organizes changed, added, and newly introduced line items side-by-side with complete structural alignment."
                },
                {
                  icon: <BarChart3 className="w-4 h-4 text-[var(--blue)]" />,
                  title: "3. Category Spend Weights",
                  desc: "Access visual diagrams detailing exactly where price expansion, quantity padding, and rate escalation occur, ordered by cost impact."
                },
                {
                  icon: <Zap className="w-4 h-4 text-[var(--green)]" />,
                  title: "4. Negotiation Playbook",
                  desc: "Leverage direct, evidence-backed talking points and targeted counters formulated to guide review meetings and secure guidelines compliance."
                }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-9 h-9 rounded-lg bg-white border border-[var(--border2)] flex items-center justify-center shrink-0 shadow-xs">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-[var(--blue2)] mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[var(--muted)] leading-relaxed font-semibold">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: ZERO-RETENTION DESIGN */}
      <section className="w-full bg-[var(--bg)] border-t border-[var(--border)]">
        <div className="section max-w-5xl mx-auto py-20 px-6 text-left">
          <div className="p-8 bg-white border border-[var(--border2)] rounded-3xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-sm">
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[rgba(78,110,83,0.08)] border border-[rgba(78,110,83,0.12)] text-[var(--blue)] text-[9px] font-black uppercase tracking-widest rounded-full">
                <FolderLock className="w-3.5 h-3.5" />
                No Retention Policy
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--blue2)] tracking-tight">
                Zero-retention workflow.
              </h2>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed font-semibold">
                Designed entirely around data privacy. Users analyze files, export reports, and reset the dashboard without saving sensitive pricing files to our servers.
              </p>
            </div>
            <div className="md:col-span-4 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-[rgba(78,110,83,0.08)] border border-[rgba(78,110,83,0.14)] flex items-center justify-center text-4xl shadow-inner">
                🔒
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: FAQ (Four exact items inside collapsible Accordion) */}
      <section id="faq" className="w-full bg-[var(--navy)] border-t border-[var(--border)] scroll-mt-20">
        <div className="section max-w-4xl mx-auto py-20 px-6 text-left">
          <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--blue)] mb-3 text-center">
            FAQ
          </div>
          <h2 className="text-3xl font-extrabold text-[var(--blue2)] tracking-tight text-center mb-10">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:border-[var(--border2)]"
              >
                <button
                  onClick={() => setFaqOpenIndex(faqOpenIndex === idx ? null : idx)}
                  className="w-full text-left p-6 font-bold text-sm text-[var(--blue2)] flex items-center justify-between gap-4 select-none outline-none cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-[var(--blue)] transition-transform duration-300",
                    faqOpenIndex === idx ? "rotate-180 text-[var(--red)]" : ""
                  )} />
                </button>
                
                <AnimatePresence initial={false}>
                  {faqOpenIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pt-5 pb-6 text-xs text-[var(--muted)] leading-relaxed font-semibold border-t border-[var(--border)] bg-slate-50/20 dark:bg-slate-800/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
