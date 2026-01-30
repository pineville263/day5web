'use client';

import { cn } from '@/lib/utils/cn';
import { Sparkles, Zap, Bot, Cpu } from 'lucide-react';

interface EngineSelectorProps {
  provider: 'google' | 'groq';
  onChange: (provider: 'google' | 'groq') => void;
  disabled?: boolean;
  className?: string;
}

export function EngineSelector({ provider, onChange, disabled, className }: EngineSelectorProps) {
  return (
    <div className={cn(
      "flex p-1 bg-zinc-900/10 dark:bg-white/5 backdrop-blur-md rounded-xl border border-zinc-200/50 dark:border-white/10 shadow-sm w-full sm:w-auto",
      className
    )}>
      {/* Google Gemini Card */}
      <button
        onClick={() => onChange('google')}
        disabled={disabled}
        className={cn(
          "flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 relative overflow-hidden group",
          provider === 'google' 
            ? "bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 shadow-[0_0_15px_-3px_rgba(79,70,229,0.2)]" 
            : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-900/5 dark:hover:bg-white/5"
        )}
      >
        <div className={cn(
          "p-1.5 rounded-md transition-colors",
          provider === 'google' ? "bg-indigo-600/10 dark:bg-indigo-500/20" : "bg-transparent group-hover:bg-zinc-900/5 dark:group-hover:bg-white/5"
        )}>
          <Bot className="w-4 h-4" />
        </div>
        <div className="flex flex-col items-start translate-y-[1px]">
          <span className="text-xs font-bold leading-none tracking-tight">Gemini</span>
          <span className="text-[10px] opacity-60 leading-none mt-1">Google</span>
        </div>
        {provider === 'google' && (
          <div className="absolute inset-0 border border-indigo-500/30 rounded-lg pointer-events-none" />
        )}
      </button>

      {/* Groq Llama Card */}
      <button
        onClick={() => onChange('groq')}
        disabled={disabled}
        className={cn(
          "flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 relative overflow-hidden group",
          provider === 'groq' 
            ? "bg-orange-600/10 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 shadow-[0_0_15px_-3px_rgba(249,115,22,0.2)]" 
            : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-900/5 dark:hover:bg-white/5"
        )}
      >
        <div className={cn(
          "p-1.5 rounded-md transition-colors",
          provider === 'groq' ? "bg-orange-600/10 dark:bg-orange-500/20" : "bg-transparent group-hover:bg-zinc-900/5 dark:group-hover:bg-white/5"
        )}>
          <Cpu className="w-4 h-4" />
        </div>
        <div className="flex flex-col items-start translate-y-[1px]">
          <span className="text-xs font-bold leading-none tracking-tight">Groq</span>
          <span className="text-[10px] opacity-60 leading-none mt-1">Llama 3.3</span>
        </div>
        {provider === 'groq' && (
          <div className="absolute inset-0 border border-orange-500/30 rounded-lg pointer-events-none" />
        )}
      </button>

      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden -z-10">
        <div className={cn(
          "absolute inset-0 opacity-[0.02] transition-colors duration-1000",
          provider === 'google' ? "bg-indigo-600" : "bg-orange-600"
        )} />
      </div>
    </div>
  );
}
