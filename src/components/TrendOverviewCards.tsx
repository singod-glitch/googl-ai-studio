import React from 'react';
import { TrendStock } from '../types';
import { Flame, ArrowUpRight, TrendingUp, Sparkles, Award } from 'lucide-react';

interface TrendOverviewCardsProps {
  stocks: TrendStock[];
  topThemeToday?: string;
  onSelectStock: (stock: TrendStock) => void;
}

export const TrendOverviewCards: React.FC<TrendOverviewCardsProps> = ({
  stocks,
  topThemeToday,
  onSelectStock
}) => {
  const topUs = stocks.find((s) => s.country === 'US') || stocks[0];
  const topKr = stocks.find((s) => s.country === 'KR') || stocks[1];
  
  // Highest surge stock
  const highestSurgeStock = [...stocks].sort((a, b) => b.surgePercentage - a.surgePercentage)[0] || stocks[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. US Top Stock Card */}
      {topUs && (
        <div
          onClick={() => onSelectStock(topUs)}
          className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 cursor-pointer transition shadow-lg hover:shadow-indigo-500/10 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <span>🇺🇸</span> 미국 구글 검색 1위
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
              <Award className="w-3 h-3" /> TOP 1
            </span>
          </div>

          <div className="flex items-baseline justify-between mb-1">
            <div className="font-bold text-lg text-white group-hover:text-indigo-300 transition">
              {topUs.nameKr} <span className="text-xs text-slate-400 font-normal">({topUs.ticker})</span>
            </div>
            <div className="text-xs font-bold text-emerald-400 flex items-center">
              {topUs.priceChange}
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800 text-xs">
            <div>
              <span className="text-slate-400">검색 관심도: </span>
              <span className="font-bold text-white font-mono text-sm">{topUs.score}</span>
              <span className="text-slate-500 text-[10px]"> / 100</span>
            </div>
            <div className="text-amber-400 font-semibold font-mono flex items-center gap-0.5">
              <Flame className="w-3 h-3" />
              +{topUs.surgePercentage}% 급증
            </div>
          </div>
        </div>
      )}

      {/* 2. KR Top Stock Card */}
      {topKr && (
        <div
          onClick={() => onSelectStock(topKr)}
          className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4 cursor-pointer transition shadow-lg hover:shadow-emerald-500/10 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <span>🇰🇷</span> 한국 구글 검색 1위
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <Award className="w-3 h-3" /> TOP 1
            </span>
          </div>

          <div className="flex items-baseline justify-between mb-1">
            <div className="font-bold text-lg text-white group-hover:text-emerald-300 transition">
              {topKr.nameKr} <span className="text-xs text-slate-400 font-normal">({topKr.ticker})</span>
            </div>
            <div className="text-xs font-bold text-emerald-400 flex items-center">
              {topKr.priceChange}
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800 text-xs">
            <div>
              <span className="text-slate-400">검색 관심도: </span>
              <span className="font-bold text-white font-mono text-sm">{topKr.score}</span>
              <span className="text-slate-500 text-[10px]"> / 100</span>
            </div>
            <div className="text-amber-400 font-semibold font-mono flex items-center gap-0.5">
              <Flame className="w-3 h-3" />
              +{topKr.surgePercentage}% 급증
            </div>
          </div>
        </div>
      )}

      {/* 3. Highest Surge Stock Card */}
      {highestSurgeStock && (
        <div
          onClick={() => onSelectStock(highestSurgeStock)}
          className="bg-slate-900/90 border border-amber-500/30 hover:border-amber-500/70 rounded-2xl p-4 cursor-pointer transition shadow-lg hover:shadow-amber-500/10 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 animate-pulse" />
              오늘의 최대 검색 폭발 종목
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              EXPLOSIVE
            </span>
          </div>

          <div className="flex items-baseline justify-between mb-1">
            <div className="font-bold text-lg text-white group-hover:text-amber-300 transition">
              {highestSurgeStock.nameKr} <span className="text-xs text-slate-400 font-normal">({highestSurgeStock.ticker})</span>
            </div>
            <div className="text-xs font-bold text-amber-400 flex items-center font-mono">
              +{highestSurgeStock.surgePercentage}%
            </div>
          </div>

          <p className="text-[11px] text-slate-400 truncate mt-1">
            {highestSurgeStock.reasons[0] || '검색량 폭발적 증가'}
          </p>

          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/80 text-xs text-indigo-400 group-hover:text-indigo-300 font-medium">
            <span>트렌드 이유 보기</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}

      {/* 4. Market Sentiment & AI Theme Card */}
      <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-800/40 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              오늘의 구글 검색 테마
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              AI REAL-TIME
            </span>
          </div>

          <div className="text-xs font-bold text-slate-200 mt-1 leading-relaxed">
            {topThemeToday || '🔥 글로벌 AI 반도체 & K-바이오 대장주 폭발적 검색 상승'}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">시장 검색 열기:</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> 매우 뜨겁음 (94/100)
          </span>
        </div>
      </div>

    </div>
  );
};
