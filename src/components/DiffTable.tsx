import React from 'react';
import { DiffItem } from '../types';
import { ArrowUpRight, ArrowDownRight, Minus, AlertCircle, Sparkles, CheckCircle2, Search, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

interface DiffTableProps {
  diffs: DiffItem[];
  currencySymbol?: string;
  comparisonType?: 'version' | 'vendor';
  executiveView?: boolean;
  searchQuery?: string;
  setSearchQuery?: (val: string) => void;
  statusFilter?: 'All' | 'New' | 'Removed' | 'Changed';
  setStatusFilter?: (val: 'All' | 'New' | 'Removed' | 'Changed') => void;
  totalCount?: number;
}

export function translateToPlainEnglish(text: string): string {
  if (!text) return text;
  let result = text;
  
  const substitutions: [RegExp, string][] = [
    [/Exact lexical match of core license model/gi, "Exact name match of software package"],
    [/Close lexical match with seat count changes/gi, "Same product but list of users went up or down"],
    [/Fuzzy match on storage tiers \(Ambiguous unit price drop\)/gi, "Vague match on digital storage limits with a slight bulk price reduction"],
    [/Orphaned line item not found in comparator version/gi, "Old item taken out of latest proposal"],
    [/New operational support add-on added in active comparator version/gi, "New helpline program added this round"],
    [/High category similarity and matched licensing modules/gi, "Matched items under software licenses"],
    [/Categorical equivalence for external application access endpoints/gi, "Similar integration points for third-party tools"],
    [/Ambiguous alignment between pro-rated workshops and flat fee onboarding/gi, "Mismatched units between standard training plans and grouped flat-rate setup packages"],
    [/New vendor capabilities with no direct equivalence in baseline proposal/gi, "A new feature from the provider with no match in previous docs"],
    [/lexical match/gi, "exact name matching"],
    [/baseline/gi, "original version"],
    [/comparator/gi, "new version"],
    [/compensation/gi, "payment support"],
    [/unit price/gi, "price per unit"],
    [/volume/gi, "bulk order size"],
    [/contingency/gi, "extra safety margins"],
    [/amortization/gi, "payment schedules"],
    [/variance/gi, "price difference"],
  ];

  substitutions.forEach(([regex, replacement]) => {
    result = result.replace(regex, replacement);
  });

  return result;
}

export default function DiffTable({ 
  diffs, 
  currencySymbol, 
  comparisonType, 
  executiveView,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  totalCount
}: DiffTableProps) {
  const currency = currencySymbol || '';
  const isVendor = comparisonType === 'vendor';

  const formatQty = (val: number | null | undefined) => {
    if (val === 0) return '0';
    if (!val) return '0';
    const rounded = Math.round(val * 100) / 100;
    return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(2);
  };

  return (
    <div className="bg-white dark:bg-[#151D17] rounded-2xl border border-[var(--border2)] shadow-sm overflow-hidden">
      {/* Integrated Control Header / Toolbar */}
      {searchQuery !== undefined && setSearchQuery && statusFilter && setStatusFilter && (
        <div>
          <div className="p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-800/5">
            {/* Left: Interactive Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search line items or notes..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold outline-none text-slate-800 dark:text-slate-250 focus:ring-1 focus:ring-[var(--blue)] focus:border-[var(--blue)] transition-all"
              />
            </div>

            {/* Right: Premium Status Filter Badges */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto self-stretch md:self-auto justify-start md:justify-end">
              <span className="text-[10px] uppercase font-mono font-black tracking-widest text-slate-400 mr-2 flex items-center gap-1 whitespace-nowrap">
                <Filter className="w-3 h-3" /> Status:
              </span>
              {(['All', 'New', 'Removed', 'Changed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border",
                    statusFilter === st 
                      ? "bg-[var(--blue2)] text-white border-[var(--blue2)] shadow-3xs"
                      : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850"
                  )}
                >
                  {st === 'All' ? 'All Diffs' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Mapped stats counter ribbon */}
          <div className="px-5 py-3 bg-slate-50/10 dark:bg-slate-800/10 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono font-bold text-[10px] uppercase tracking-wider">
              Showing {diffs.length} of {totalCount || diffs.length} mapped variances
            </span>
            {(searchQuery || statusFilter !== 'All') && (
              <button 
                onClick={() => { setSearchQuery(''); setStatusFilter('All'); }} 
                className="text-[10px] font-black uppercase text-[var(--blue)] hover:underline tracking-wider"
              >
                Clear Search Filters
              </button>
            )}
          </div>
        </div>
      )}

      {diffs.length === 0 ? (
        <div className="p-12 text-center bg-slate-50/20 dark:bg-slate-800/5">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-450 font-semibold text-xs leading-relaxed">No mapped line item variances match the filter criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/70">
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-[var(--blue2)]">
                {executiveView ? "Change Type" : "Status"}
              </th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-[var(--blue2)]">Item / Description</th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-[var(--blue2)] text-right">
                {executiveView ? "Quantity (Old → New)" : "Qty (V1 → V2)"}
              </th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-[var(--blue2)] text-right">
                {executiveView ? "Price (Old → New)" : "Price (V1 → V2)"}
              </th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-[var(--blue2)] text-right">
                {executiveView ? "Match Trust Level" : "Match Confidence (%)"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {diffs.map((diff, i) => {
              const showConfidence = diff.confidence !== undefined;
              const isAmbiguous = diff.needsReview || (diff.confidence !== undefined && diff.confidence < 0.85);

              return (
                <tr key={i} className="hover:bg-[rgba(45,60,48,0.02)]/50 transition-colors group">
                  <td className="p-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      diff.status === 'New' && "bg-[rgba(55,108,67,0.1)] text-[var(--green)] border border-[rgba(55,108,67,0.2)]",
                      diff.status === 'Removed' && "bg-[rgba(168,66,66,0.1)] text-[var(--red)] border border-[rgba(168,66,66,0.2)]",
                      diff.status === 'Changed' && "bg-[rgba(78,110,83,0.1)] text-[var(--blue)] border border-[rgba(78,110,83,0.2)]"
                    )}>
                      {diff.status === 'New' && <ArrowUpRight className="w-3 h-3" />}
                      {diff.status === 'Removed' && <ArrowDownRight className="w-3 h-3" />}
                      {diff.status === 'Changed' && <Minus className="w-3 h-3" />}
                      {diff.status === 'New' 
                        ? (executiveView ? 'Added' : 'New') 
                        : diff.status === 'Removed' 
                        ? (executiveView ? 'Removed' : 'Removed') 
                        : (executiveView ? 'Adjusted' : 'Changed')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1.5">
                      <div>
                        <p className="font-bold text-[var(--blue2)] text-sm">{diff.item || 'Unnamed Item'}</p>
                        {diff.notes && diff.notes.toLowerCase() !== 'null' && (
                           <p className="text-[11px] text-[var(--muted)] mt-1 font-medium italic">
                             {executiveView ? translateToPlainEnglish(diff.notes) : diff.notes}
                           </p>
                        )}
                      </div>
 
                      {/* Match reasons and ambiguous reviewer warnings */}
                      <div className="mt-3.5 space-y-2">
                        {/* High-trust match explainability UX */}
                        {diff.status === 'Changed' ? (
                          <div className="bg-emerald-50/20 dark:bg-emerald-950/5 border border-emerald-105/40 dark:border-emerald-900/20 rounded-xl p-3.5 sm:p-4 text-xs max-w-xl shadow-3xs hover:border-emerald-200/80 transition-colors">
                            <div className="flex items-center gap-1.5 text-[var(--green)] font-black text-[10px] uppercase tracking-widest mb-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>{executiveView ? "Comparison Alignment" : "Match Explainability"}</span>
                            </div>
                            <p className="leading-relaxed text-[var(--muted)] font-semibold text-[11.5px]">
                              {executiveView ? (
                                <>
                                  Aligned by <span className="font-extrabold text-slate-700 dark:text-slate-300">matching descriptive text</span>, <span className="font-extrabold text-slate-700 dark:text-slate-300">how many items are being bought</span>, and <span className="font-extrabold text-slate-700 dark:text-slate-300">unit pricing</span>.
                                </>
                              ) : (
                                <>
                                  Matched by <span className="font-extrabold text-slate-700 dark:text-slate-300">description similarity</span>, <span className="font-extrabold text-slate-700 dark:text-slate-300">quantity pattern</span>, and <span className="font-extrabold text-slate-700 dark:text-slate-300">rate structure</span>.
                                </>
                              )}
                            </p>
                            {diff.matchReason && (
                              <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1.5 italic">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] shrink-0"></span>
                                {executiveView ? "Alignment reason" : "Core alignment signal"}: {translateToPlainEnglish(diff.matchReason)}
                              </p>
                            )}
                          </div>
                        ) : diff.status === 'New' ? (
                          <div className="bg-emerald-50/20 dark:bg-emerald-950/5 border border-emerald-105/40 dark:border-emerald-900/20 rounded-xl p-3.5 sm:p-4 text-xs max-w-xl shadow-3xs hover:border-emerald-200/80 transition-colors">
                            <div className="flex items-center gap-1.5 text-[var(--green)] font-black text-[10px] uppercase tracking-widest mb-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{executiveView ? "Added Scope Check" : "Scope Addition Audit"}</span>
                            </div>
                            <p className="leading-relaxed text-[var(--muted)] font-semibold text-[11.5px]">
                              {executiveView ? (
                                <>
                                  This is a <span className="font-extrabold text-slate-700 dark:text-slate-300">newly included line-item</span> in the proposed agreement. There is no match in the original proposal.
                                </>
                              ) : (
                                <>
                                  Processed as a <span className="font-extrabold text-slate-700 dark:text-slate-300">unique line-item addition</span> in Comparator. No equivalent entry exists in Baseline.
                                </>
                              )}
                            </p>
                            {diff.matchReason && (
                              <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1.5 italic">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] shrink-0"></span>
                                {executiveView ? "Why it is marked as new" : "Decision signal"}: {translateToPlainEnglish(diff.matchReason)}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="bg-rose-50/20 dark:bg-rose-950/5 border border-rose-105/40 dark:border-rose-900/20 rounded-xl p-3.5 sm:p-4 text-xs max-w-xl shadow-3xs hover:border-rose-200/80 transition-colors">
                            <div className="flex items-center gap-1.5 text-[var(--red)] font-black text-[10px] uppercase tracking-widest mb-1.5">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>{executiveView ? "Deleted Scope Check" : "Scope Reduction Audit"}</span>
                            </div>
                            <p className="leading-relaxed text-[var(--muted)] font-semibold text-[11.5px]">
                              {executiveView ? (
                                <>
                                  This original item has been <span className="font-extrabold text-slate-700 dark:text-slate-300">taken out</span> and does not appear in the new version.
                                </>
                              ) : (
                                <>
                                  Processed as an <span className="font-extrabold text-slate-700 dark:text-slate-300">omitted catalog line</span>. It was removed completely in Comparator.
                                </>
                              )}
                            </p>
                            {diff.matchReason && (
                              <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1.5 italic">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--red)] shrink-0"></span>
                                {executiveView ? "Why it is marked as removed" : "Decision signal"}: {translateToPlainEnglish(diff.matchReason)}
                              </p>
                            )}
                          </div>
                        )}
 
                        {isAmbiguous && (
                          <div className="flex items-center gap-1.5 bg-[rgba(184,123,20,0.06)] text-[var(--amber)] border border-[rgba(184,123,20,0.15)] px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider w-max animate-pulse mt-1">
                            ⚠️ Needs Review
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-mono text-sm text-[var(--text)] font-semibold">
                        {formatQty(diff.qtyV1)} → {formatQty(diff.qtyV2)}
                      </span>
                      <span className={cn(
                        "text-[10px] font-bold flex items-center gap-1 mt-0.5",
                        (diff.qtyDelta || 0) > 0 ? "text-[var(--red)]" : (diff.qtyDelta || 0) < 0 ? "text-[var(--green)]" : "text-[var(--muted2)]"
                      )}>
                        {(diff.qtyDelta || 0) > 0 ? '↑' : (diff.qtyDelta || 0) < 0 ? '↓' : ''}
                        {formatQty(Math.abs(diff.qtyDelta || 0))} ({(diff.qtyDeltaPercent > 0 ? '+' : '')}{(diff.qtyDeltaPercent * 100).toFixed(2)}%)
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-mono text-sm text-[var(--text)] font-semibold">
                        {currency}{(diff.priceV1 || 0).toLocaleString()} → {currency}{(diff.priceV2 || 0).toLocaleString()}
                      </span>
                      <span className={cn(
                        "text-[10px] font-bold flex items-center gap-1 mt-0.5",
                        (diff.priceDelta || 0) > 0 ? "text-[var(--red)]" : (diff.priceDelta || 0) < 0 ? "text-[var(--green)]" : "text-[var(--muted2)]"
                      )}>
                        {(diff.priceDelta || 0) > 0 ? '↑' : (diff.priceDelta || 0) < 0 ? '↓' : ''}
                        {currency}{Math.abs(diff.priceDelta || 0).toLocaleString()} ({(diff.priceDeltaPercent || 0) > 0 ? '+' : ''}{((diff.priceDeltaPercent || 0) * 100).toFixed(2)}%)
                      </span>
                      <span className={cn(
                        "text-[10px] font-bold mt-1.5 px-1.5 py-0.5 bg-[var(--bg)] border border-[var(--border)] rounded",
                        (diff.totalDelta || 0) > 0 ? "text-[var(--red)]" : (diff.totalDelta || 0) < 0 ? "text-[var(--green)]" : "text-[var(--muted2)]"
                      )}>
                        {executiveView ? "Full Budget Shift" : "Total Impact"}: {currency}{Math.abs(diff.totalDelta || 0).toLocaleString()} ({(diff.totalDeltaPercent || 0) > 0 ? '+' : ''}{((diff.totalDeltaPercent || 0) * 100).toFixed(2)}%)
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className={cn(
                        "font-mono text-sm font-bold",
                        !showConfidence && "text-[var(--muted2)]",
                        showConfidence && (diff.confidence || 0) >= 0.9 ? "text-[var(--green)]" : (diff.confidence || 0) >= 0.7 ? "text-[var(--blue)]" : "text-[var(--amber)]"
                      )}>
                        {showConfidence ? `${((diff.confidence || 0) * 100).toFixed(2)}%` : '—'}
                      </span>
                      <span className="text-[9px] font-bold text-[var(--muted2)] uppercase tracking-wider">
                        {executiveView ? "Match Trust" : "Match Rate"}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}
