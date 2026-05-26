import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, ArrowRight, Loader2, AlertCircle, FileText, TrendingUp, Key, Sparkles, Sun, Moon, ShieldCheck } from 'lucide-react';
import { ComparisonResult } from './types';
import { parseExcelFile } from './services/excel';
import { normalizeAndCompare } from './services/gemini';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import LandingFeatures, { SeeWhatChanged } from './components/LandingFeatures';
import { VERSION_A_ITEMS, VERSION_B_ITEMS, VENDOR_A_ITEMS, VENDOR_B_ITEMS } from './constants/sampleData';
import { cn } from './lib/utils';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'light';
  });
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [comparisonType, setComparisonType] = useState<'version' | 'vendor'>('version');
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  const loadingMessages = ["Parsing line items...", "Normalizing taxonomy...", "Mapping structural variables...", "Analyzing cost centers...", "Compiling intelligence narrative..."];

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    let interval: any;
    if (isProcessing) {
      setLoadingMessageIndex(0);
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  useEffect(() => {
    const savedKey = localStorage.getItem('GEMINI_API_KEY');
    setApiKey(savedKey);
  }, []);

  const handleLaunch = async () => {
    if (!file1 || !file2) return;
    
    const currentApiKey = localStorage.getItem('GEMINI_API_KEY');
    if (!currentApiKey) {
      setError('Please provide a Gemini API key in settings to continue.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const [v1, v2] = await Promise.all([
        parseExcelFile(file1),
        parseExcelFile(file2)
      ]);

      await runComparison(currentApiKey, v1, v2);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during processing. Please check your API key and file formats.');
    } finally {
      setIsProcessing(false);
    }
  };

  const runComparison = async (apiKey: string, v1: any, v2: any) => {
    const aiResult = await normalizeAndCompare(apiKey, v1.items, v2.items, comparisonType);

    const totalV1 = v1.totalCost;
    const totalV2 = v2.totalCost;
    const delta = totalV2 - totalV1;
    const deltaPercent = totalV1 !== 0 ? delta / totalV1 : 0;

    const addedImpact = aiResult.diffs
      .filter(d => d.status === 'New')
      .reduce((sum, d) => sum + (d.totalV2 || 0), 0);
    
    const removedImpact = aiResult.diffs
      .filter(d => d.status === 'Removed')
      .reduce((sum, d) => sum + (d.totalV1 || 0), 0);

    const comparison: ComparisonResult = {
      v1,
      v2,
      diffs: aiResult.diffs,
      narrative: aiResult.narrative,
      comparisonType,
      currencySymbol: aiResult.currencySymbol,
      summary: {
        totalV1,
        totalV2,
        delta,
        deltaPercent,
        addedImpact,
        removedImpact,
        varianceDistribution: {
          price: 0.6,
          quantity: 0.3,
          scope: 0.1
        }
      }
    };

    setResult(comparison);
  };

  const handleTrySample = async () => {
    const currentApiKey = localStorage.getItem('GEMINI_API_KEY') || 'DEMO_KEY';

    setIsProcessing(true);
    setError(null);

    try {
      const isVersion = comparisonType === 'version';
      const v1Items = isVersion ? VERSION_A_ITEMS : VENDOR_A_ITEMS;
      const v2Items = isVersion ? VERSION_B_ITEMS : VENDOR_B_ITEMS;

      const v1 = {
        fileName: isVersion ? 'Budget_v1.xlsx' : 'Vendor_Alpha_Proposal.xlsx',
        items: v1Items,
        totalCost: v1Items.reduce((sum, item) => sum + item.total, 0)
      };

      const v2 = {
        fileName: isVersion ? 'Budget_v2.xlsx' : 'Vendor_Beta_Proposal.xlsx',
        items: v2Items,
        totalCost: v2Items.reduce((sum, item) => sum + item.total, 0)
      };

      await runComparison(currentApiKey, v1, v2);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while loading sample data.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetSession = () => {
    setFile1(null);
    setFile2(null);
    setResult(null);
    setError(null);
  };

  const navigateSection = (id: string) => {
    if (result) {
      setResult(null);
    }
    setTimeout(() => {
      if (id === 'demo') {
        const el = document.querySelector('.upload-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-all duration-300">
      {/* Navigation */}
      <nav>
        <a className="logo" href="#" onClick={(e) => { e.preventDefault(); setResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <div className="logo-mark bg-gradient-to-br from-[var(--blue)] to-[var(--blue2)] shadow-sm">
            <span className="text-sm font-black text-white font-sans tracking-tight">V</span>
          </div>
          <div>
            <div className="logo-name tracking-widest font-black">VERIDIAN</div>
          </div>
        </a>

        {/* Dynamic Center Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 ml-auto mr-4">
          <button 
            onClick={() => navigateSection('why-us')}
            className="text-xs font-bold text-[var(--muted2)] hover:text-[var(--blue2)] tracking-wider uppercase transition-colors cursor-pointer outline-none border-none bg-transparent"
          >
            Why Veridian
          </button>
          <button 
            onClick={() => navigateSection('how-it-works')}
            className="text-xs font-bold text-[var(--muted2)] hover:text-[var(--blue2)] tracking-wider uppercase transition-colors cursor-pointer outline-none border-none bg-transparent"
          >
            How It Works
          </button>
          <button 
            onClick={() => navigateSection('faq')}
            className="text-xs font-bold text-[var(--muted2)] hover:text-[var(--blue2)] tracking-wider uppercase transition-colors cursor-pointer outline-none border-none bg-transparent"
          >
            FAQ
          </button>
          
          <span className="h-4 w-px bg-[var(--border2)]"></span>
          
          <button 
            onClick={() => navigateSection('features')}
            className="text-xs font-bold text-[var(--blue)] hover:text-[var(--blue2)] hover:underline whitespace-nowrap cursor-pointer outline-none border-none bg-transparent"
          >
            See Product Tour
          </button>
          
          <button 
            onClick={() => navigateSection('demo')}
            className="px-4 py-2 bg-[var(--blue2)] text-white text-[11px] font-black tracking-wider uppercase rounded-lg hover:opacity-95 transition-all cursor-pointer shadow-sm ml-2"
          >
            Analyze a Sample Proposal
          </button>
        </div>

        <div className="nav-r">
          <Settings trigger={
            <button className="ib" title="API Credentials Settings">
              <Key className="w-3.5 h-3.5" />
            </button>
          } />
          <button
            onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
            className="ib"
            title={theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
          >
            {theme === 'light' ? (
              <Moon className="w-3.5 h-3.5 text-[var(--blue)]" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-[var(--blue)] animate-pulse" />
            )}
          </button>
        </div>
      </nav>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SeeWhatChanged />
              
              <LandingFeatures />

              <div ref={uploadSectionRef} className="upload-section scroll-mt-20 bg-[var(--bg)] border-t border-[var(--border)]">
                {/* Premium Header Block */}
                <div className="max-w-2xl mx-auto text-center mb-10">
                  <div className="inline-flex items-center gap-[7px] border border-[rgba(45,60,48,0.14)] bg-[rgba(45,60,48,0.02)] rounded-full px-3 py-1 text-[10px] text-[var(--blue)] font-bold tracking-[0.1em] uppercase mb-4 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-[var(--green)]" /> Zero-Retention Sandbox
                  </div>
                  <h2 className="text-3xl font-extrabold text-[var(--blue2)] tracking-tight mb-3">
                    Analyze SOW &amp; Proposal Variances
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed font-semibold max-w-xl mx-auto">
                    Select your baseline and revised files. Veridian's schema matchers map line roles, detect rate expansions, and pin unscheduled add-ons offline.
                  </p>
                </div>

                <div className="mode-tabs">
                  <button 
                    className={cn("mtab", comparisonType === 'version' && "active")}
                    onClick={() => setComparisonType('version')}
                  >
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <rect x="1" y="2" width="4" height="8" rx="1"/><rect x="7" y="2" width="4" height="8" rx="1"/>
                    </svg>
                    Compare Versions
                  </button>
                  <button 
                    className={cn("mtab", comparisonType === 'vendor' && "active")}
                    onClick={() => setComparisonType('vendor')}
                  >
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M1.5 9l2.5-2.5 2 2 4-4.5"/>
                    </svg>
                    Compare Proposals
                  </button>
                </div>

                <div className="upload-grid">
                  <FileUpload
                    label={comparisonType === 'version' ? 'Version A' : 'Proposal A'}
                    description={comparisonType === 'version' ? 'Upload original baseline SOW worksheet (v1)' : 'Upload initial proposal SOW from Vendor A'}
                    file={file1}
                    onFileSelect={setFile1}
                  />
                  <FileUpload
                    label={comparisonType === 'version' ? 'Version B' : 'Proposal B'}
                    description={comparisonType === 'version' ? 'Upload revised or updated SOW worksheet (v2)' : 'Upload revised proposal SOW from Vendor B'}
                    file={file2}
                    onFileSelect={setFile2}
                  />
                </div>

                {/* Checklist & Readiness indicator */}
                <div className="max-w-[680px] mx-auto mt-6 mb-8 p-4 rounded-2xl border border-dashed border-[var(--border2)] bg-white/50 dark:bg-[#151D17]/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                        file1 ? "bg-[var(--green)] text-white scale-110" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                      )}>
                        {file1 ? "✓" : "1"}
                      </div>
                      <span className={cn("font-bold text-[11px]", file1 ? "text-[var(--blue2)]" : "text-slate-400")}>
                        {comparisonType === 'version' ? "Version A" : "Proposal A"}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                        file2 ? "bg-[var(--green)] text-white scale-110" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                      )}>
                        {file2 ? "✓" : "2"}
                      </div>
                      <span className={cn("font-bold text-[11px]", file2 ? "text-[var(--blue2)]" : "text-slate-400")}>
                        {comparisonType === 'version' ? "Version B" : "Proposal B"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-[11px] font-bold text-slate-400 flex items-center gap-2 shrink-0">
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      (file1 && file2) ? "bg-[var(--green)] animate-pulse" : "bg-amber-400"
                    )} />
                    {(file1 && file2) ? "Ready for alignment matching" : "Awaiting files..."}
                  </div>
                </div>

                <div className="launch-wrap">
                  {isProcessing ? (
                    <button 
                      disabled={true}
                      className="launch-btn inline-flex items-center gap-2.5 px-10 py-3.5 rounded-[12px] text-[15px] font-extrabold bg-[var(--blue2)] text-white border border-[var(--blue2)] cursor-not-allowed shadow-md"
                    >
                      <Loader2 className="w-4 h-4 animate-spin text-[var(--blue)]" />
                      {loadingMessages[loadingMessageIndex]}
                    </button>
                  ) : (!file1 || !file2) ? (
                    <button 
                      disabled={true}
                      className="inline-flex items-center gap-2 px-10 py-3.5 rounded-[12px] text-[15px] font-extrabold bg-slate-50 dark:bg-[#151D17]/40 text-slate-400 border border-[var(--border2)] cursor-not-allowed opacity-80"
                    >
                      <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse mr-1" />
                      Upload files above to launch comparison
                    </button>
                  ) : (
                    <button 
                      onClick={handleLaunch}
                      className="launch-btn ready inline-flex items-center gap-2 px-10 py-3.5 rounded-[12px] text-[15px] font-extrabold bg-[var(--blue2)] text-white border border-[var(--blue2)] cursor-pointer hover:opacity-95 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                    >
                      <span className="text-[15px] leading-none">⚡</span>
                      Execute Veridian SOW Analysis
                      <svg className="w-4 h-4" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M2 7h10M8 3.5l3.5 3.5L8 10.5"/>
                      </svg>
                    </button>
                  )}
                  
                  {/* Test drive section */}
                  <div className="mt-6 flex flex-col items-center gap-2">
                    <div className="text-[11px] font-bold text-slate-400">
                      Don&apos;t have custom files handy?
                    </div>
                    <button
                      onClick={handleTrySample}
                      disabled={isProcessing}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[rgba(78,110,83,0.04)] border border-[rgba(78,110,83,0.12)] text-[11px] font-extrabold text-[var(--blue)] hover:text-[var(--blue2)] hover:bg-[rgba(78,110,83,0.08)] transition-all cursor-pointer shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[var(--green)] animate-pulse" />
                      Test Veridian with sample version data
                    </button>
                  </div>
                  
                  {error && (
                    <div className="mt-6 flex items-center justify-center gap-2 text-[var(--red)] text-sm font-medium">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="py-[72px] px-6"
            >
              <Dashboard result={result} onReset={resetSession} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="px-8 py-5 border-t border-[var(--border)] flex items-center justify-between">
        <span className="fc">© 2026 Veridian. All rights reserved.</span>
        <div className="fc flex gap-6">
          <PrivacyPolicy />
          <TermsOfService />
        </div>
      </footer>
    </div>
  );
}
