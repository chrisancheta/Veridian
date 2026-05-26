import React, { useState } from 'react';
import { FileSpreadsheet, ShieldCheck, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface FileUploadProps {
  label: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
  description?: string;
}

export default function FileUpload({ label, file, onFileSelect, description }: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const validExtensions = ['.xlsx', '.xls', '.csv'];
      const fileExt = droppedFile.name.substring(droppedFile.name.lastIndexOf('.')).toLowerCase();
      if (validExtensions.includes(fileExt)) {
        onFileSelect(droppedFile);
      }
    }
  };

  return (
    <div 
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={() => !file && document.getElementById(`file-input-${label}`)?.click()}
      className={cn(
        "relative bg-white dark:bg-[#151D17] border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 flex flex-col justify-between min-h-[200px] shadow-sm cursor-pointer group select-none",
        file 
          ? "border-[var(--green)] bg-[rgba(55,108,67,0.015)] shadow-xs" 
          : isDragActive 
            ? "border-[var(--blue)] bg-[rgba(78,110,83,0.04)] scale-[1.01]" 
            : "border-[var(--border2)] hover:border-[var(--blue)] hover:bg-[rgba(45,60,48,0.015)]"
      )}
      id={`dropzone-${label}`}
    >
      <div>
        {/* Top Header Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={cn(
            "text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full",
            file
              ? "bg-[rgba(55,108,67,0.08)] text-[var(--green)]"
              : "bg-slate-100 dark:bg-slate-800 text-[var(--muted2)]"
          )}>
            {label}
          </span>
          <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
            <ShieldCheck className="w-3 h-3 text-[var(--green)]" />
            Local Sandbox
          </div>
        </div>

        {/* Central visual & prompt */}
        <div className="flex flex-col items-center mt-2 mb-2">
          <div className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 mb-3",
            file 
              ? "bg-[rgba(55,108,67,0.08)] text-[var(--green)] scale-110 shadow-xs" 
              : "bg-slate-50 dark:bg-slate-800 text-[var(--muted)] group-hover:text-[var(--blue)] group-hover:bg-[rgba(78,110,83,0.06)]"
          )}>
            {file ? (
              <Check className="w-5 h-5 text-[var(--green)] stroke-[3]" />
            ) : (
              <FileSpreadsheet className="w-4.5 h-4.5 transition-transform group-hover:scale-105 text-[var(--blue)]" />
            )}
          </div>

          {file ? (
            <div className="space-y-1 w-full px-2">
              <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 truncate max-w-full">
                {file.name}
              </div>
              <div className="text-[10px] text-slate-400 font-bold">
                {(file.size / 1024).toFixed(1)} KB • Worksheets ready
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-[13px] font-extrabold text-[var(--blue2)] group-hover:text-[var(--blue)] transition-colors">
                Select or Drop Document
              </div>
              <p className="text-[11px] text-[var(--muted)] max-w-[200px] mx-auto font-medium leading-normal">
                {description || "Excel spreadsheet containing SOW proposal details"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action / Requirement Bottom footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px]">
        <span className="font-bold text-slate-400">
          XLSX, XLS, CSV
        </span>
        {file ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFileSelect(null);
            }}
            className="uppercase tracking-wider font-extrabold text-[var(--red)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            Clear File
          </button>
        ) : (
          <span className="font-extrabold text-[var(--blue)] bg-[rgba(78,110,83,0.06)] px-2 py-0.5 rounded uppercase tracking-wider">
            Sandboxed
          </span>
        )}
      </div>

      <input
        type="file"
        id={`file-input-${label}`}
        style={{ display: 'none' }}
        accept=".xlsx,.xls,.csv"
        onChange={handleFileChange}
      />
    </div>
  );
}
