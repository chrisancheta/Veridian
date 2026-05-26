import React from 'react';
import { Sparkles, TrendingUp, ShieldAlert, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface NarrativeProps {
  text: string;
  executiveView?: boolean;
}

function translateProse(line: string, isExecutive: boolean): string {
  if (!isExecutive) return line;
  return line
    .replace(/\bcontingency variance\b/gi, "extra risk charge")
    .replace(/\bvariance distribution\b/gi, "areas where prices changed")
    .replace(/\bvariance magnitude\b/gi, "total cost change")
    .replace(/\bamortization curve\b/gi, "payment details")
    .replace(/\bline-item delta alignment\b/gi, "product price matching")
    .replace(/\bSOW criteria matching\b/gi, "project specification comparison")
    .replace(/\bFTE rate card comparison\b/gi, "team member hourly price tracking")
    .replace(/\bbilling milestone misalignment\b/gi, "mismatched payment dates")
    .replace(/\bancillary surcharge tracking\b/gi, "finding hidden extra fees")
    .replace(/\bbaseline parameters match\b/gi, "original outline matchup")
    .replace(/\bvolumetric padding\b/gi, "padded quantities")
    .replace(/\bescalated by\b/gi, "went up by")
    .replace(/\bde-escalated by\b/gi, "went down by")
    .replace(/\bvolume-tier breaks\b/gi, "bulk discounts")
    .replace(/\bover-provisioned\b/gi, "purchasing more than needed")
    .replace(/\bmulti-year commitment discounts\b/gi, "signing longer contracts for savings")
    .replace(/\bleverage volume discounting\b/gi, "get bulk savings")
    .replace(/\bvolume discounting\b/gi, "bulk discounts")
    .replace(/\bprocurement\b/gi, "buying")
    .replace(/\bnegotiation leverage\b/gi, "negotiating power")
    .replace(/\bcapital variances\b/gi, "budget changes")
    .replace(/\bvariance drivers\b/gi, "reasons for price increases")
    .replace(/\bvariance\b/gi, "price difference")
    .replace(/\bV1\b/g, "original proposal")
    .replace(/\bV2\b/g, "revised proposal");
}

export default function Narrative({ text, executiveView }: NarrativeProps) {
  if (!text || text.toLowerCase() === 'null') return null;

  // Robust parser for AI generated content
  // Split by double newline, or by lines that look like headers (e.g. "Strategic Analysis:")
  const sections: string[] = [];
  const rawLines = text.split('\n');
  let currentSection: string[] = [];

  rawLines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      if (currentSection.length > 0) {
        sections.push(currentSection.join('\n'));
        currentSection = [];
      }
      return;
    }

    // If line looks like a header (short, no bullet, ends with colon or is bold)
    const isHeader = trimmed.length < 60 && 
                    !trimmed.startsWith('*') && 
                    !trimmed.startsWith('-') && 
                    (trimmed.endsWith(':') || (trimmed.startsWith('**') && trimmed.endsWith('**')));

    if (isHeader && currentSection.length > 0) {
      sections.push(currentSection.join('\n'));
      currentSection = [line];
    } else {
      currentSection.push(line);
    }
  });

  if (currentSection.length > 0) {
    sections.push(currentSection.join('\n'));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-[rgba(78,110,83,0.06)] rounded-lg">
          <Sparkles className="w-4.5 h-4.5 text-[var(--blue)]" />
        </div>
        <h2 className="text-sm font-black uppercase text-[var(--blue2)] tracking-widest">
          {executiveView ? "Analyses & Core Findings" : "System Alignment Report"}
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-[#151D17]/80 p-6 sm:p-8 rounded-2xl border border-[var(--border2)] shadow-xs relative overflow-hidden"
      >
        {/* Subtle accent vertical tag */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--blue)] via-[var(--blue)] to-transparent" />

        <div className="space-y-10">
          {sections.map((section, i) => {
            const lines = section.split('\n').filter(l => l.trim());
            const firstLine = lines[0] || '';
            const isTitle = firstLine.length < 100 && 
                           !firstLine.trim().startsWith('*') && 
                           !firstLine.trim().startsWith('-') && 
                           !firstLine.trim().startsWith('1.');
            
            let title = isTitle ? firstLine.replace(/^[#*-\s]+/, '').replace(/[*_]/g, '').replace(/[:]$/, '').trim() : 'Analysis Insight';
            
            if (executiveView) {
              if (title.toLowerCase().includes('strategic analysis')) {
                title = "Main Agreement Highlights";
              } else if (title.toLowerCase().includes('recommendation') || title.toLowerCase().includes('leverage')) {
                title = "Smart Negotiation Guidance";
              }
            }

            const contentLines = isTitle ? lines.slice(1) : lines;

            return (
              <div key={i} className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--blue)] flex items-center gap-2 border-b border-dashed border-slate-100 dark:border-slate-800 pb-2.5">
                  {title.toLowerCase().includes('guidance') || title.toLowerCase().includes('recommendation') ? (
                    <Zap className="w-3.5 h-3.5 text-[var(--amber)]" />
                  ) : (
                    <TrendingUp className="w-3.5 h-3.5 text-[var(--blue)]" />
                  )}
                  {title}
                </h3>
                <div className="text-xs text-[var(--muted)] leading-relaxed">
                  <div className="space-y-5">
                    {contentLines.map((line, li) => {
                      const cleanLine = line.replace(/^[#*-\s]+/, '').trim();
                      if (!cleanLine) return null;
                      return (
                        <div key={li} className="border-l-2 border-slate-100 dark:border-slate-800 hover:border-[var(--blue)] pl-4 py-1.5 transition-all text-slate-600 dark:text-slate-350 font-semibold text-[12.5px] leading-relaxed">
                          {translateProse(cleanLine, !!executiveView)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
