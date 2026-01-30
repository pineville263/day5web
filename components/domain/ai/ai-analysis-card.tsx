/**
 * AI 인사이트 분석 카드 컴포넌트
 * 
 * 사용자가 프롬프트를 입력하고 AI 분석 결과를 확인할 수 있는 UI
 * 비용 최적화를 위해 DB 캐싱 및 토큰 제한 적용
 */

'use client';

import { useState } from 'react';
import { Sparkles, Send, AlertCircle, Loader2, Database } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils/cn';
import { EngineSelector } from './engine-selector';

interface AIAnalysisResult {
  response: string;
  tokensUsed?: number;
  isCached: boolean;
}

export function AIAnalysisCard() {
  const [prompt, setPrompt] = useState('');
  const [provider, setProvider] = useState<'google' | 'groq'>('google');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult & { provider?: string } | null>(null);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);

  const handleAnalyze = async () => {
    if (!prompt.trim() || loading) return;

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          provider: provider,
          category: 'analysis',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw { 
          code: data.error || 'ERROR', 
          message: data.message || '요청 처리 중 오류가 발생했습니다.' 
        };
      }

      setResult(data.data);
    } catch (err: any) {
      console.error('[AI Analysis Component] Error:', err);
      setError({
        code: err.code || 'UNKNOWN_ERROR',
        message: err.message || '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">AI 인사이트 분석</h3>
          </div>
          
          <EngineSelector 
            provider={provider} 
            onChange={setProvider} 
            disabled={loading} 
          />
        </div>
        <div className="flex items-center gap-2 text-[10px] font-medium px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
          <Database className="w-3 h-3" />
          DB 저장형 & 멀티 엔진
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            placeholder="분석하고 싶은 내용을 입력하세요... (예: 이 프로젝트의 기술 스택 장단점은?)"
            className="w-full min-h-[120px] p-4 bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-700/50 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !prompt.trim()}
            className={cn(
              "absolute bottom-4 right-4 p-2 rounded-full transition-all duration-200",
              prompt.trim() && !loading 
                ? "bg-indigo-600 text-white shadow-lg hover:bg-indigo-700" 
                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
            )}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg flex gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-400">
                {error.code === 'QUOTA_EXCEEDED' ? '할당량 초과' : '오류 발생'}
              </p>
              <p className="text-xs text-red-600 dark:text-red-500/80 mt-1">
                {error.message}
              </p>
            </div>
          </div>
        )}

        {/* Result State */}
        {result && (
          <div className="p-5 bg-indigo-50/30 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-900/20 rounded-lg animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">AI Analysis</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded font-bold uppercase">
                  {result.provider === 'cached' ? 'CACHED' : (result.provider || provider)}
                </span>
              </div>
              {result.tokensUsed && (
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                  {result.isCached ? '(캐시됨) ' : ''}사용 토큰: ~{result.tokensUsed}
                </span>
              )}
            </div>
            <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none">
              <ReactMarkdown>{result.response}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-800">
        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Gemini-1.5-Flash 또는 Llama-3.3 모델로 핵심 내용만 간결하게(Max 2000 tokens) 분석합니다.
        </p>
      </div>
    </div>
  );
}
