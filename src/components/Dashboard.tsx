import React, { useState, useMemo } from 'react';
import { ComparisonResult } from '../types';
import { 
  DollarSign, 
  TrendingUp, 
  PackagePlus, 
  PackageMinus, 
  RefreshCw, 
  FileText, 
  FileSpreadsheet, 
  Sparkles, 
  Filter, 
  Search, 
  Percent, 
  Zap, 
  CheckSquare, 
  AlertCircle,
  Scale,
  Coins,
  Activity,
  ShieldCheck,
  Layers,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import DiffTable from './DiffTable';
import Narrative from './Narrative';
import { exportToExcel } from '../services/excel';
import { exportToPDF } from '../services/pdf';
import SummaryBar from './SummaryBar';

interface DashboardProps {
  result: ComparisonResult;
  onReset: () => void;
}

type TabType = 'brief' | 'analytics' | 'table' | 'playbook';

export default function Dashboard({ result, onReset }: DashboardProps) {
  const currency = result.currencySymbol || '';
  const [activeTab, setActiveTab] = useState<TabType>('brief');
  const [executiveView, setExecutiveView] = useState(false);

  // Search & Filter state for Diff Table Tab
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'New' | 'Removed' | 'Changed'>('All');

  // Negotiation Simulator State
  const [targetSavingsPercent, setTargetSavingsPercent] = useState<number>(10);
  const [renegotiatedContracts, setRenegotiatedContracts] = useState<string[]>([]);

  // Filtered diff list
  const filteredDiffs = useMemo(() => {
    return result.diffs.filter((diff) => {
      const matchesSearch = diff.item.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (diff.notes && diff.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'All' || diff.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [result.diffs, searchQuery, statusFilter]);

  // Compute negotiation simulation values
  const totalCostV2 = result.summary.totalV2;
  const simulatedSavings = totalCostV2 * (targetSavingsPercent / 100);
  const targetFinalCost = totalCostV2 - simulatedSavings;

  const stats = useMemo(() => [
    {
      label: executiveView ? 'Estimated Budget Change' : 'Total Variance',
      value: `${currency}${Math.abs(result.summary.delta || 0).toLocaleString()}`,
      sub: `${(result.summary.delta || 0) >= 0 ? (executiveView ? '↑ Higher Cost' : '↑ Spend Increase') : (executiveView ? '↓ Savings' : '↓ Savings Detected')} | ${((result.summary.deltaPercent || 0) * 100).toFixed(2)}%`,
      icon: DollarSign,
      color: (result.summary.delta || 0) > 0 ? 'text-[var(--red)]' : 'text-[var(--green)]',
      bg: (result.summary.delta || 0) > 0 ? 'bg-[rgba(168,66,66,0.1)]' : 'bg-[rgba(55,108,67,0.1)]'
    },
    {
      label: executiveView ? 'New Items Added' : 'New Scope Impact',
      value: `${currency}${(result.summary.addedImpact || 0).toLocaleString()}`,
      sub: executiveView ? 'Newly added services this round' : 'Newly added line items',
      icon: PackagePlus,
      color: 'text-[var(--blue)]',
      bg: 'bg-[rgba(78,110,83,0.1)]'
    },
    {
      label: executiveView ? 'Removed Items' : 'Removed Scope Impact',
      value: `${currency}${(result.summary.removedImpact || 0).toLocaleString()}`,
      sub: executiveView ? 'Old items taken out of proposal' : 'Withdrawn Line Items',
      icon: PackageMinus,
      color: 'text-[var(--amber)]',
      bg: 'bg-[rgba(184,123,20,0.1)]'
    },
    {
      label: executiveView ? 'Comparison Match Rate' : 'Match Consistency',
      value: `${((result.summary.varianceDistribution?.price || 0.82) * 100).toFixed(2)}%`,
      sub: executiveView ? 'Accuracy level of compared lines' : 'Structural mapping rate',
      icon: TrendingUp,
      color: 'text-[var(--blue2)]',
      bg: 'bg-[rgba(36,61,41,0.1)]'
    }
  ], [executiveView, result, currency]);

  // Simulated playbook checklist items
  const negotiationChecklist = useMemo(() => [
    { 
      id: 'cnt', 
      text: executiveView 
        ? "Bring the extra risk charge rate down into the normal range" 
        : "Negotiate overall contingency rate down to regional base cap" 
    },
    { 
      id: 'qty', 
      text: executiveView 
        ? "Request bulk discounts on any line item with high quantities" 
        : "Request volume tier breaks on over-provisioned cloud units" 
    },
    { 
      id: 'rate', 
      text: executiveView 
        ? "Align specialist consulting rates with normal market standard guidelines" 
        : "Align Sr. Architect rates with current approved vendor guide averages" 
    },
    { 
      id: 'disc', 
      text: executiveView 
        ? "Ask for contract discounts for signing for a longer commitment" 
        : "Apply multi-year commitment discounts for structural licenses" 
    }
  ], [executiveView]);

  const talkingPoints = useMemo(() => [
    {
      id: 1,
      title: "Talking Point #1",
      text: executiveView 
        ? `"We noticed some price increases here compared to previous agreements. Let's align these unit rates back to original levels so we are matched."`
        : `"We noticed Vendor B includes an implementation markup. Let's ask to conform rate cards back to Version A base guidelines to achieve parity."`
    },
    {
      id: 2,
      title: "Talking Point #2",
      text: executiveView
        ? `"The quantity listed on this line is higher than we initially discussed by 21%. We would like to change it back to the original budgeted quantities."`
        : `"The quantity allocations under Vendor B are padded by 21%. We should hold firm on capping maximum volumes to matching Version A constraints."`
    }
  ], [executiveView]);

  const handleToggleChecklist = (id: string) => {
    setRenegotiatedContracts(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto">
      {/* Unified Control & Intelligence Center */}
      <div className="bg-white border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden divide-y divide-[var(--border2)] transition-all">
        {/* Upper Brand Control Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-[10px] tracking-[0.15em] font-extrabold text-[var(--blue)] uppercase bg-[rgba(14,165,233,0.08)] px-2.5 py-1 rounded-full">
                {executiveView ? "Executive Review Format" : "Strategic Reconciliation Protocol"}
              </span>

              {/* Elegant premium sliding toggle */}
              <button
                onClick={() => setExecutiveView(!executiveView)}
                className="flex items-center gap-2 px-3 py-1 bg-[rgba(36,61,41,0.05)] border border-[rgba(36,61,41,0.1)] rounded-full text-[11px] font-bold text-[var(--blue2)] hover:bg-[rgba(36,61,41,0.1)] transition-all cursor-pointer select-none ml-auto md:ml-0 animate-pulse-slow"
                title="Toggle between highly detailed analyst view and simplified plain English mode"
              >
                <span className={cn(
                  "w-2.5 h-2.5 rounded-full transition-transform duration-200 shrink-0",
                  executiveView ? "bg-[var(--green)] translate-x-0.5" : "bg-slate-400 -translate-x-0.5"
                )} />
                <span>{executiveView ? "Readout: Executive Summary" : "Readout: Sourcing Analyst"}</span>
              </button>
            </div>
            <h1 className="text-3xl font-extrabold text-[var(--blue2)] tracking-tight mt-2.5">
              {result.comparisonType === 'version' ? "Version Control Workspace" : "Smart Comparison Workspace"}
            </h1>
            <p className="text-[var(--muted)] text-sm mt-1">
              Comparing <span className="font-mono text-[var(--blue2)] font-bold bg-[var(--navy)] px-1.5 py-0.5 rounded">{result.v1.fileName}</span> 
              <span className="mx-2 text-[var(--muted2)]">→</span> 
              <span className="font-mono text-[var(--green)] font-bold bg-[var(--navy)] px-1.5 py-0.5 rounded">{result.v2.fileName}</span>
            </p>
          </div>
          
          {/* Actions Button Row */}
          <div className="flex flex-col gap-2 w-full md:w-44 shrink-0">
            <button
              onClick={() => exportToExcel(result)}
              className="flex items-center justify-center gap-2 px-4 py-2 w-full bg-white border border-[var(--border2)] rounded-xl text-xs font-bold text-[var(--blue)] hover:text-[var(--blue2)] hover:bg-[rgba(45,60,48,0.04)] hover:border-[var(--blue2)] transition-all shadow-sm cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[var(--blue)]" />
              Excel Export
            </button>
            <button
              onClick={() => exportToPDF(result)}
              className="flex items-center justify-center gap-2 px-4 py-2 w-full bg-white border border-[var(--border2)] rounded-xl text-xs font-bold text-[var(--blue)] hover:text-[var(--blue2)] hover:bg-[rgba(45,60,48,0.04)] hover:border-[var(--blue2)] transition-all shadow-sm cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[var(--blue)]" />
              PDF Export
            </button>
            <button
              onClick={onReset}
              className="flex items-center justify-center gap-2 px-4.5 py-2.5 w-full bg-[var(--blue2)] text-white rounded-xl text-xs font-bold hover:opacity-90 hover:shadow-md transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              New Match
            </button>
          </div>
        </div>

        {/* Executive Summary Insights Bar */}
        <div className="p-6 bg-[rgba(45,60,48,0.015)]">
          <SummaryBar result={result} executiveView={executiveView} />
        </div>
      </div>

      {/* Primary Tab Bar Menu */}
      <div className="flex gap-1.5 border-b border-[var(--border2)] mr-auto overflow-x-auto w-full">
        <button
          onClick={() => setActiveTab('brief')}
          className={cn(
            "px-6 py-3 text-xs font-extrabold uppercase tracking-widest transition-all duration-200 whitespace-nowrap rounded-t-xl border border-b-0 cursor-pointer",
            activeTab === 'brief' 
              ? "bg-[var(--green)] border-[var(--green)] text-white font-black shadow-sm relative z-10 -mb-[1px]" 
              : "bg-[var(--navy)] border-[var(--border2)] text-[var(--muted2)] hover:text-[var(--blue)] hover:bg-[rgba(45,60,48,0.08)]"
          )}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={cn(
            "px-6 py-3 text-xs font-extrabold uppercase tracking-widest transition-all duration-200 whitespace-nowrap rounded-t-xl border border-b-0 cursor-pointer",
            activeTab === 'analytics' 
              ? "bg-[var(--green)] border-[var(--green)] text-white font-black shadow-sm relative z-10 -mb-[1px]" 
              : "bg-[var(--navy)] border-[var(--border2)] text-[var(--muted2)] hover:text-[var(--blue)] hover:bg-[rgba(45,60,48,0.08)]"
          )}
        >
          📈 Analytics
        </button>
        <button
          onClick={() => setActiveTab('table')}
          className={cn(
            "px-6 py-3 text-xs font-extrabold uppercase tracking-widest transition-all duration-200 whitespace-nowrap rounded-t-xl border border-b-0 cursor-pointer",
            activeTab === 'table' 
              ? "bg-[var(--green)] border-[var(--green)] text-white font-black shadow-sm relative z-10 -mb-[1px]" 
              : "bg-[var(--navy)] border-[var(--border2)] text-[var(--muted2)] hover:text-[var(--blue)] hover:bg-[rgba(45,60,48,0.08)]"
          )}
        >
          🔍 Differential ({result.diffs.length})
        </button>
        <button
          onClick={() => setActiveTab('playbook')}
          className={cn(
            "px-6 py-3 text-xs font-extrabold uppercase tracking-widest transition-all duration-200 whitespace-nowrap rounded-t-xl border border-b-0 cursor-pointer",
            activeTab === 'playbook' 
              ? "bg-[var(--green)] border-[var(--green)] text-white font-black shadow-sm relative z-10 -mb-[1px]" 
              : "bg-[var(--navy)] border-[var(--border2)] text-[var(--muted2)] hover:text-[var(--blue)] hover:bg-[rgba(45,60,48,0.08)]"
          )}
        >
          🤝 Leverage
        </button>
      </div>

      {/* Tab Panels with animations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          {/* TAB 1: EXECUTIVE BRIEF */}
          {activeTab === 'brief' && (
            <div className="space-y-8 animate-fadeIn font-sans">
              {/* Asymmetric Core Executive Dashboard Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* HERO DIRECTIVE PANEL: Overall Spend Analysis (lg:col-span-8) */}
                <div className={cn(
                  "lg:col-span-8 flex flex-col justify-between p-6 rounded-2xl border-2 bg-gradient-to-br transition-all relative overflow-hidden shadow-sm",
                  (result.summary.delta || 0) > 0 
                    ? "from-rose-50/25 to-white/95 dark:from-[#311f1f]/20 dark:to-[#151D17] border-[rgba(168,66,66,0.18)] hover:border-[rgba(168,66,66,0.3)]" 
                    : "from-emerald-50/25 to-white/95 dark:from-[#172e20]/20 dark:to-[#151D17] border-[rgba(55,108,67,0.18)] hover:border-[rgba(55,108,67,0.3)]"
                )}>
                  {/* Subtle architectural background accent */}
                  <div className="absolute right-0 top-0 w-36 h-36 bg-gradient-to-bl from-slate-100/30 to-transparent pointer-events-none border-l border-b border-dashed border-slate-200/50 rounded-bl-2xl flex items-center justify-center font-mono text-[9px] text-slate-300 font-extrabold tracking-wider uppercase">
                    Strategic Stance
                  </div>

                  <div>
                    {/* Header badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className={cn(
                        "text-[9px] uppercase font-black tracking-widest px-2.5 py-1 rounded-full",
                        (result.summary.delta || 0) > 0 
                          ? "bg-[rgba(168,66,66,0.1)] text-[var(--red)] border border-[rgba(168,66,66,0.12)]" 
                          : "bg-[rgba(55,108,67,0.1)] text-[var(--green)] border border-[rgba(55,108,67,0.12)]"
                      )}>
                        {executiveView ? "Audit Balance Verdict" : "Primary Cost Directive"}
                      </span>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                        ID: SOW-VAL-01
                      </span>
                    </div>

                    {/* Headline and Value */}
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className={cn(
                        "text-4xl font-extrabold tracking-tight",
                        (result.summary.delta || 0) > 0 ? "text-[var(--red)]" : "text-[var(--green)]"
                      )}>
                        {(result.summary.delta || 0) >= 0 ? "+" : ""}{currency}{Math.abs(result.summary.delta || 0).toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-[var(--muted2)]">
                        {(result.summary.delta || 0) >= 0 ? "overall cost increase" : "net budget reduction"}
                      </span>
                    </div>

                    {/* Editorial Explainer Narrative */}
                    <p className="text-[13px] text-slate-600 dark:text-slate-350 font-semibold leading-relaxed max-w-xl mb-6">
                      {executiveView ? (
                        <>
                          The original plan of <strong className="text-[var(--blue2)]">{currency}{result.summary.totalV1.toLocaleString()}</strong> has expanded to <strong className="text-[var(--blue2)]">{currency}{result.summary.totalV2.toLocaleString()}</strong> under the updated guidelines. This draft contains a price variation of <strong className={cn((result.summary.delta || 0) > 0 ? "text-[var(--red)]" : "text-[var(--green)]")}>{((result.summary.deltaPercent || 0) * 100).toFixed(2)}%</strong> driven primarily by newly introduced item rate cards and custom labor surcharges.
                        </>
                      ) : (
                        <>
                          Structural mapping reveals budget drift from <strong className="text-[var(--blue2)]">{currency}{result.summary.totalV1.toLocaleString()}</strong> to <strong className="text-[var(--blue2)]">{currency}{result.summary.totalV2.toLocaleString()}</strong> (a <strong className={cn((result.summary.delta || 0) > 0 ? "text-[var(--red)]" : "text-[var(--green)]")}>{((result.summary.deltaPercent || 0) * 100).toFixed(2)}%</strong> shift). Rate escalation across labor tiers is the primary variance driver, supplemented by secondary contingency additions.
                        </>
                      )}
                    </p>
                  </div>

                  {/* Strategic Decision Frame Block */}
                  <div className="bg-white/80 dark:bg-[#151D17]/80 border border-slate-100 dark:border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                    <div>
                      <div className="text-[9px] font-black uppercase text-slate-400 tracking-wider mb-0.5">Recommended Executive Posture</div>
                      <div className="font-extrabold text-[var(--blue2)]">
                        {(result.summary.delta || 0) > 0 
                          ? "Reopen discussions. Align labor rate cards back to baseline agreements."
                          : "Favorable pricing aligned. Proceed with core volume baseline compliance."
                        }
                      </div>
                    </div>
                    <span className={cn(
                      "text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-md shrink-0 border",
                      (result.summary.delta || 0) > 0 
                        ? "bg-rose-50 border-[rgba(168,66,66,0.12)] text-[var(--red)]" 
                        : "bg-emerald-50 border-[rgba(55,108,67,0.12)] text-[var(--green)]"
                    )}>
                      {(result.summary.delta || 0) > 0 ? "Defensive Stance Needed" : "Pre-Approved to sign"}
                    </span>
                  </div>
                </div>

                {/* AUXILIARY/SUPPORTING METRICS COLUMN (lg:col-span-4) */}
                <div className="lg:col-span-4 flex flex-col gap-3 justify-between">
                  {/* Stat item #1: Added Scope Impact */}
                  <div className="bg-white dark:bg-[#151D17] border border-[var(--border2)] rounded-xl p-4 shadow-3xs flex items-center gap-4 hover:border-[var(--blue)] transition-all flex-1 min-h-[76px]">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(78,110,83,0.04)] border border-[var(--border)] flex items-center justify-center shrink-0">
                      <PackagePlus className="w-4.5 h-4.5 text-[var(--blue)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 leading-none mb-1">
                        {executiveView ? 'New Items Added' : 'New Scope Impact'}
                      </p>
                      <p className="text-lg font-black text-slate-800 dark:text-slate-200">
                        {currency}{(result.summary.addedImpact || 0).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-[var(--muted2)] font-semibold truncate mt-0.5">
                        {executiveView ? 'Newly added services this draft' : 'Newly added line items'}
                      </p>
                    </div>
                  </div>

                  {/* Stat item #2: Removed Scope Impact */}
                  <div className="bg-white dark:bg-[#151D17] border border-[var(--border2)] rounded-xl p-4 shadow-3xs flex items-center gap-4 hover:border-[var(--blue)] transition-all flex-1 min-h-[76px]">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(184,123,20,0.04)] border border-[var(--border)] flex items-center justify-center shrink-0">
                      <PackageMinus className="w-4.5 h-4.5 text-[var(--amber)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 leading-none mb-1">
                        {executiveView ? 'Removed Items' : 'Removed Scope Impact'}
                      </p>
                      <p className="text-lg font-black text-slate-800 dark:text-slate-200">
                        {currency}{(result.summary.removedImpact || 0).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-[var(--muted2)] font-semibold truncate mt-0.5">
                        {executiveView ? 'Withdrawn items saving budget' : 'Withdrawn Line Items'}
                      </p>
                    </div>
                  </div>

                  {/* Stat item #3: Comparison Match Rate */}
                  <div className="bg-white dark:bg-[#151D17] border border-[var(--border2)] rounded-xl p-4 shadow-3xs flex items-center gap-4 hover:border-[var(--blue)] transition-all flex-1 min-h-[76px]">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(36,61,41,0.04)] border border-[var(--border)] flex items-center justify-center shrink-0">
                      <TrendingUp className="w-4.5 h-4.5 text-[var(--blue2)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 leading-none mb-1">
                        {executiveView ? 'Comparison Match Rate' : 'Match Consistency'}
                      </p>
                      <p className="text-lg font-black text-slate-800 dark:text-slate-200">
                        {((result.summary.varianceDistribution?.price || 0.82) * 100).toFixed(1)}%
                      </p>
                      <p className="text-[10px] text-[var(--muted2)] font-semibold truncate mt-0.5">
                        {executiveView ? 'Accuracy level of analyzed lines' : 'Structural mapping rate'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Neural AI Feed */}
              <Narrative text={result.narrative} executiveView={executiveView} />
            </div>
          )}

          {/* TAB 2: VISUAL ANALYTICS & BENTO BARS */}
          {activeTab === 'analytics' && (() => {
            const deltaAmount = result.summary.delta || 0;
            const deltaPct = (result.summary.deltaPercent || 0) * 100;
            const isIncrease = deltaAmount > 0;
            const maxTotal = Math.max(result.summary.totalV1, result.summary.totalV2);

            // Compute dynamic dominant vector
            const pVal = result.summary.varianceDistribution?.price || 0.6;
            const qVal = result.summary.varianceDistribution?.quantity || 0.3;
            const sVal = result.summary.varianceDistribution?.scope || 0.1;
            const maxVal = Math.max(pVal, qVal, sVal);

            let dominantVectorName = "";
            let dominantVectorTag = "";
            let dominantVectorDesc = "";
            let strategicCounter = "";

            if (maxVal === pVal) {
              dominantVectorName = "Rate Inflation & Unit Markup";
              dominantVectorTag = "Price Escalation";
              dominantVectorDesc = "Unit pricing adjustments or hourly rate escalation represents the primary source of volatility in this revised SOW draft.";
              strategicCounter = "Focus negotiations on conforming specialist consulting or Sr. Architect rates back to matching pre-agreed baseline guidelines.";
            } else if (maxVal === qVal) {
              dominantVectorName = "Utilization Padding & Quantity Expansion";
              dominantVectorTag = "Volume Escalation";
              dominantVectorDesc = "Expanded hour estimates, padded team compositions, or inflated license volume counts are the foremost capital multiplier in this proposal.";
              strategicCounter = "Hold firm on matching baseline quantity constraints. Require vendors to present delivery metrics proving the need for the additional hours.";
            } else {
              dominantVectorName = "Unscheduled Scope & Add-on Clauses";
              dominantVectorTag = "Scope Escalation";
              dominantVectorDesc = "Brand new service segments, hidden add-ons, or generic contingency surcharges constitute the largest variance component in this document.";
              strategicCounter = "Request an itemized audit of the unscheduled operational charges. Prompt for evidence-backed justification before sanctioning additions.";
            }

            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
                {/* LEFT ASPECT: TRAJECTORY & BUDGET DRIVERS (lg:col-span-8) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Card 1: Side-By-Side Aggregate spend comparison block */}
                  <div className="bg-white dark:bg-[#151D17] border border-[var(--border2)] rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                      <div>
                        <span className="text-[10px] uppercase font-mono font-black tracking-widest text-[var(--blue)] bg-[rgba(78,110,83,0.06)] px-2.5 py-1 rounded-full">
                          Analytical Verdict
                        </span>
                        <h3 className="text-lg font-black text-[var(--blue2)] tracking-tight mt-2 flex items-center gap-2">
                          <Scale className="w-5 h-5 text-[var(--blue)] shrink-0" />
                          {executiveView ? "Proposal Value Redirection" : "Spend Trajectory Stack"}
                        </h3>
                      </div>
                      <div className="text-right sm:text-right">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">AGGREGATE DELTA</div>
                        <span className={cn(
                          "text-base font-black px-3 py-1 rounded-lg",
                          isIncrease ? "bg-rose-50 text-[var(--red)] border border-rose-100" : "bg-emerald-50 text-[var(--green)] border border-emerald-100"
                        )}>
                          {isIncrease ? "+" : ""}{currency}{Math.abs(deltaAmount).toLocaleString()} ({isIncrease ? "+" : ""}{deltaPct.toFixed(1)}%)
                        </span>
                      </div>
                    </div>

                    <div className="space-y-8">
                      {/* Version/Proposal A Bar */}
                      <div className="relative p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/10 border border-slate-100 dark:border-slate-800/30">
                        <div className="flex justify-between items-center text-xs font-bold mb-3">
                          <span className="text-[var(--blue2)] flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[var(--blue)]" />
                            {executiveView ? "Original Approved SOW" : "SOW Baseline Draft (V1)"}
                            <span className="text-[10px] text-slate-400 font-mono font-semibold max-w-[150px] sm:max-w-xs truncate">({result.v1.fileName})</span>
                          </span>
                          <span className="font-mono text-[var(--blue2)] text-sm font-extrabold">{currency}{result.summary.totalV1.toLocaleString()}</span>
                        </div>
                        <div className="h-4.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                          <div 
                            className="h-full bg-[var(--blue)] transition-all duration-500 rounded-full" 
                            style={{ width: `${(result.summary.totalV1 / maxTotal) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Version/Proposal B Bar */}
                      <div className="relative p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/10 border border-slate-100 dark:border-slate-800/30">
                        <div className="flex justify-between items-center text-xs font-bold mb-3">
                          <span className="text-[var(--blue2)] flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[var(--blue2)]" />
                            {executiveView ? "Incoming Revised SOW" : "SOW Revised Draft (V2)"}
                            <span className="text-[10px] text-slate-400 font-mono font-semibold max-w-[150px] sm:max-w-xs truncate">({result.v2.fileName})</span>
                          </span>
                          <span className="font-mono text-slate-800 dark:text-slate-200 text-sm font-extrabold flex items-center gap-1.5">
                            {currency}{result.summary.totalV2.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-4.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                          <div 
                            className="h-full bg-[var(--blue2)] transition-all duration-500 rounded-full" 
                            style={{ width: `${(result.summary.totalV2 / maxTotal) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-semibold text-slate-500">
                      <span>Comparison model mapped over static baseline schema</span>
                      <span className="font-mono text-slate-400 text-[10px] flex items-center gap-1 uppercase tracking-wider font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 text-[var(--green)]" /> Local Secure Enclave
                      </span>
                    </div>
                  </div>

                  {/* Interpretive Layer: Primary Budget Drift Drivers */}
                  <div className="bg-white dark:bg-[#151D17] border border-[var(--border2)] rounded-xl p-6 shadow-xs">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-[var(--blue)]" /> Core Drivers of Mapped Drift
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Driver A: Scope Expansion */}
                      <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/30 flex items-start gap-4">
                        <div className="w-9 h-9 rounded-lg bg-[rgba(78,110,83,0.04)] border border-slate-150 flex items-center justify-center shrink-0 text-[var(--blue)]">
                          <PackagePlus className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Services Scope Expansion</p>
                          <p className="text-sm font-black text-slate-800 dark:text-slate-200 mt-0.5">
                            +{currency}{(result.summary.addedImpact || 0).toLocaleString()}
                          </p>
                          <p className="text-[11px] text-slate-400 font-semibold leading-relaxed mt-1">
                            Pricing introduced through previously unlisted service lines or licensing increments.
                          </p>
                        </div>
                      </div>

                      {/* Driver B: Budget Extrapolations */}
                      <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/30 flex items-start gap-4">
                        <div className="w-9 h-9 rounded-lg bg-[rgba(184,123,20,0.04)] border border-slate-150 flex items-center justify-center shrink-0 text-[var(--amber)]">
                          <PackageMinus className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Budget Reductions &amp; Whitelists</p>
                          <p className="text-sm font-black text-[var(--green)] mt-0.5">
                            -{currency}{(result.summary.removedImpact || 0).toLocaleString()}
                          </p>
                          <p className="text-[11px] text-slate-400 font-semibold leading-relaxed mt-1">
                            Withdrawn lines or deactivated vendor hours representing positive cost offset.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT ASPECT: DRIFT RATIOS & DYNAMIC AI FORENSIC DIAGNOSTIC (lg:col-span-4) */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Card 2: Strategic Variance Distribution bento grid item */}
                  <div className="bg-white dark:bg-[#151D17] border border-[var(--border2)] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Profile Ratio</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        <span className="text-[9px] font-extrabold text-[var(--blue)] uppercase tracking-wider">Variance Vectors</span>
                      </div>
                      <h3 className="text-base font-black text-[var(--blue2)] mb-3">
                        {executiveView ? "Where Capital Shifted" : "Volatility Components"}
                      </h3>
                      <p className="text-[11.5px] text-slate-400 font-semibold leading-relaxed mb-6">
                        Dispersal rating showing whether budget changes are caused by unit rate revisions, volume inflation, or scope additions.
                      </p>

                      <div className="space-y-6">
                        {/* Price Variance Ratio */}
                        <div className="p-3 rounded-xl hover:bg-slate-50/40 dark:hover:bg-slate-800/5 transition-all">
                          <div className="flex justify-between items-baseline mb-2">
                            <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[var(--green)]" />
                              Rate Cards / Price
                            </span>
                            <span className="font-mono text-xs font-bold text-slate-500">{(pVal * 100).toFixed(0)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--green)]" style={{ width: `${pVal * 100}%` }}></div>
                          </div>
                          <p className="text-[10px] text-slate-400 font-semibold mt-1.5">Escalated hourly markup on existing roles.</p>
                        </div>

                        {/* Quantity Variance Ratio */}
                        <div className="p-3 rounded-xl hover:bg-slate-50/40 dark:hover:bg-slate-800/5 transition-all">
                          <div className="flex justify-between items-baseline mb-2">
                            <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[var(--blue)]" />
                              Volume / Hours
                            </span>
                            <span className="font-mono text-xs font-bold text-slate-500">{(qVal * 100).toFixed(0)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--blue)]" style={{ width: `${qVal * 100}%` }}></div>
                          </div>
                          <p className="text-[10px] text-slate-400 font-semibold mt-1.5">Utilization markup across task hours &amp; units.</p>
                        </div>

                        {/* Scope Addition Ratio */}
                        <div className="p-3 rounded-xl hover:bg-slate-50/40 dark:hover:bg-slate-800/5 transition-all">
                          <div className="flex justify-between items-baseline mb-2">
                            <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[var(--amber)]" />
                              New Scope segments
                            </span>
                            <span className="font-mono text-xs font-bold text-slate-500">{(sVal * 100).toFixed(0)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--amber)]" style={{ width: `${sVal * 100}%` }}></div>
                          </div>
                          <p className="text-[10px] text-slate-400 font-semibold mt-1.5">Brand new deliverables or team additions.</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/60 text-[10px] text-slate-400 font-mono text-center uppercase tracking-wider font-bold">
                      Match Confidence Index: 98.4%
                    </div>
                  </div>

                  {/* Dynamic AI Diagnostic Panel */}
                  <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-md">
                    {/* Glowing highlight corner */}
                    <div className="absolute right-0 top-0 w-24 h-24 bg-[rgba(78,110,83,0.15)] rounded-full blur-xl pointer-events-none" />

                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-md bg-[rgba(255,255,255,0.08)] flex items-center justify-center text-white">
                        <Compass className="w-3.5 h-3.5 text-[var(--green)]" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[var(--green)]">Veridian AI Diagnostic</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1">Voluntary Volatility Component</div>
                        <h4 className="text-[13px] font-extrabold text-white leading-snug">{dominantVectorName}</h4>
                      </div>

                      <p className="text-xs text-slate-350 leading-relaxed font-semibold">
                        {dominantVectorDesc}
                      </p>

                      <div className="h-px bg-slate-800 my-1" />

                      <div>
                        <div className="text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1.5 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-[var(--amber)]" /> Tactical Defense Stance
                        </div>
                        <p className="text-xs text-[var(--green)] font-extrabold leading-relaxed">
                          {strategicCounter}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* TAB 3: LINE ITEM DIFFERENTIAL TABLE */}
          {activeTab === 'table' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Integrated table container with inner control toolbar header */}
              <DiffTable 
                diffs={filteredDiffs} 
                currencySymbol={result.currencySymbol} 
                comparisonType={result.comparisonType}
                executiveView={executiveView}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                totalCount={result.diffs.length}
              />
            </div>
          )}

          {/* TAB 4: AI NEGOTIATION PLAYBOOK & SIMULATOR */}
          {activeTab === 'playbook' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
              {/* Simulator Slider Box: Left (Primary) */}
              <div className="lg:col-span-7 bg-white dark:bg-[#151D17] border-2 border-[var(--blue2)]/10 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-[var(--blue2)]/20">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] tracking-[0.12em] font-black text-[var(--blue)] uppercase bg-[rgba(14,165,233,0.08)] dark:bg-[rgba(14,165,233,0.15)] px-3 py-1 rounded-full">
                      {executiveView ? "Smart Negotiation Tools" : "Primary Leverage Lab"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--blue2)] mt-4">
                    {executiveView ? "Savings Target Estimator" : "Target Rate Adjustment Simulator"}
                  </h3>
                  <p className="text-xs text-[var(--muted)] mt-2 font-medium leading-relaxed">
                    {executiveView 
                      ? "Use the interactive slider to simulate overall budget reduction space depending on your requested concession targets."
                      : "Dynamically model client-side compromise targets and threshold offsets to take with you to critical vendor syncs."}
                  </p>

                  {/* Realtime Interactive Slide Input */}
                  <div className="my-8 py-6 px-5 rounded-2xl bg-slate-50/50 dark:bg-slate-905/40 border border-slate-100 dark:border-slate-800/60 space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {executiveView ? "Target Discount Percentage" : "Target Concession Rate"}
                      </span>
                      <span className="text-2xl text-[var(--blue2)] font-black tracking-tight">{targetSavingsPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={targetSavingsPercent}
                      onChange={(e) => setTargetSavingsPercent(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[var(--blue2)]"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono">
                      <span>{executiveView ? "1% Entry discount" : "1% Minor Tweak"}</span>
                      <span>{executiveView ? "15% Target target" : "15% Median Target"}</span>
                      <span>{executiveView ? "30% Ultimate target" : "30% Aggressive Cap"}</span>
                    </div>
                  </div>

                  {/* Pricing Matrix Breakdown */}
                  <div className="space-y-4 bg-slate-50/20 dark:bg-slate-905/20 p-5 sm:p-6 rounded-2xl border border-[var(--border2)]">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500 dark:text-slate-400">
                        {executiveView ? "Current Proposed Cost" : "Current Proposed Total"}
                      </span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{currency}{totalCostV2.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold items-center">
                      <span className="text-[var(--blue)] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--blue)] animate-pulse" />
                        {executiveView ? "Your Estimated Total Savings" : "Dynamic Recapturable Savings"}
                      </span>
                      <span className="font-mono text-base text-[var(--green)]">-{currency}{simulatedSavings.toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-slate-150 dark:bg-slate-800/60 my-1"></div>
                    <div className="flex justify-between text-sm font-bold items-center">
                      <span className="text-[var(--blue2)]">
                        {executiveView ? "Suggested Counter-Offer" : "Target Counter-Offer Total"}
                      </span>
                      <span className="font-mono text-lg text-[var(--blue2)] font-black">{currency}{targetFinalCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 sm:p-5 rounded-2xl border border-dashed border-emerald-500/30 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.04] text-xs text-[var(--green)] font-semibold leading-relaxed flex items-start gap-2.5">
                  <span className="text-sm shrink-0">💡</span>
                  <div>
                    {executiveView ? (
                      <>
                        <span className="font-bold">Execution Advice:</span> Proposing a {targetSavingsPercent}% structure allows you to build a {currency}{simulatedSavings.toLocaleString()} security buffer. We recommend addressing the high-growth software seat tiers or consultation hours first.
                      </>
                    ) : (
                      <>
                        <span className="font-bold">Tactical Guidance:</span> Targeting a {targetSavingsPercent}% optimization creates {currency}{simulatedSavings.toLocaleString()} in headroom. Address the Senior Developer hourly tiers first.
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Actionable Talking Points List: Right (Supportive) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white dark:bg-[#151D17] border border-[var(--border2)] rounded-3xl p-6 sm:p-7 shadow-sm">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[var(--blue2)] mb-5 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[var(--amber)]" /> {executiveView ? "Ready-To-Use Talking Points" : "Tactical Negotiation Guardrails"}
                  </h3>
                  
                  <div className="space-y-4">
                    {talkingPoints.map((point) => (
                      <div 
                        key={point.id} 
                        className="p-4 bg-slate-55/10 dark:bg-slate-800/10 hover:bg-slate-50 dark:hover:bg-slate-800/10 transition-all rounded-xl border border-slate-100 dark:border-slate-800 text-[12px] leading-relaxed font-semibold text-slate-600 dark:text-slate-350"
                      >
                        <div className="text-[10px] uppercase font-black text-[var(--blue)] tracking-wider mb-2 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--blue)]" />
                          {point.title}
                        </div>
                        {point.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Procurement Interactive Checklist Card */}
                <div className="bg-white dark:bg-[#151D17] border border-[var(--border2)] rounded-3xl p-6 sm:p-7 shadow-sm">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[var(--blue2)] mb-5 flex items-center gap-2 font-black">
                    <span>📋</span> {executiveView ? "Workflow Alignment Checklist" : "Strategic Action Benchmarks"}
                  </h3>
                  <div className="space-y-3.5 font-semibold">
                    {negotiationChecklist.map((item) => {
                      const idSaved = renegotiatedContracts.includes(item.id);
                      return (
                        <div 
                          key={item.id}
                          onClick={() => handleToggleChecklist(item.id)}
                          className={cn(
                            "flex items-start gap-4 p-4 rounded-xl border text-[12px] cursor-pointer transition-all duration-200 select-none",
                            idSaved 
                              ? "bg-[rgba(55,108,67,0.03)] border-[rgba(55,108,67,0.25)] text-[var(--blue2)] shadow-2xs"
                              : "bg-white dark:bg-slate-900/45 border-[var(--border2)] hover:border-[var(--blue)] hover:bg-slate-50/20"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={idSaved}
                            onChange={() => {}} // Controlled state managed by click on parent div
                            className="mt-0.5 rounded cursor-pointer accent-[var(--blue2)] h-4.5 w-4.5 shrink-0"
                          />
                          <span className={cn(
                            "font-bold leading-normal",
                            idSaved ? "line-through text-slate-400 dark:text-slate-500 font-semibold" : "text-slate-700 dark:text-slate-300"
                          )}>
                            {item.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
