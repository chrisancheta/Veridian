import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Key, X, ExternalLink, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface SettingsProps {
  trigger?: React.ReactNode;
}

export default function Settings({ trigger }: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('GEMINI_API_KEY');
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleSave = () => {
    localStorage.setItem('GEMINI_API_KEY', apiKey);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setIsOpen(false);
    }, 1000);
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#FAF9F5] border border-[var(--border2)] rounded-2xl shadow-2xl w-full max-w-md relative my-auto flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[var(--border)] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[var(--blue)]/10 rounded-lg">
                  <Key className="w-5 h-5 text-[var(--blue)]" />
                </div>
                <h2 className="text-xl font-bold text-[var(--blue2)]">API Configuration</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X className="w-5 h-5 text-[var(--muted)]" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider">Google Gemini API Key</label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Paste your key here..."
                    className="w-full px-4 py-3 bg-white border border-[var(--border2)] rounded-xl focus:ring-2 focus:ring-[var(--blue)] focus:border-transparent transition-all outline-none font-mono text-sm pr-12 text-[var(--text)] shadow-sm"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-[var(--muted)] flex items-center gap-1.5 mt-2">
                  Stored locally in your browser.
                  <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[var(--blue)] font-bold hover:underline inline-flex items-center gap-0.5"
                  >
                    Get a key <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>

              <div className="bg-[var(--navy)] border border-[var(--border)] p-4 rounded-xl">
                <p className="text-xs text-[var(--muted)] leading-relaxed font-semibold">
                  <strong>Security Note:</strong> Your API key is never sent to our servers. It is used directly from your browser to communicate with Google's AI models.
                </p>
              </div>
            </div>

            <div className="p-6 bg-[var(--navy)]/35 border-t border-[var(--border)] flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 text-[var(--muted)] font-bold hover:text-[var(--blue2)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!apiKey}
                className={cn(
                  "px-8 py-2 rounded-xl font-bold flex items-center gap-2 transition-all duration-300",
                  isSaved 
                    ? "bg-[var(--green)] text-white" 
                    : apiKey 
                      ? "bg-[var(--blue2)] text-white hover:opacity-90 shadow-[var(--blue2)]/10" 
                      : "bg-black/5 text-[var(--muted2)] cursor-not-allowed"
                )}
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Saved!
                  </>
                ) : (
                  'Save Configuration'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>{trigger}</div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-black/5 rounded-full transition-colors relative group"
          title="API Settings"
        >
          <Key className="w-5 h-5 text-[var(--blue)] group-hover:text-[var(--blue2)] transition-colors" />
          {!apiKey && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[var(--red)] rounded-full border-2 border-[var(--bg)] animate-pulse" />
          )}
        </button>
      )}

      {createPortal(modalContent, document.body)}
    </>
  );
}
