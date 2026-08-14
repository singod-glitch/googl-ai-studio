import React, { useState } from 'react';
import { TrendingUp, RefreshCw, Search, Flame, Globe2, Sparkles, Radio, CheckCircle2 } from 'lucide-react';
import { CountryCode, TrendStock } from '../types';

interface HeaderProps {
  country: CountryCode | 'ALL' | 'COMPARE';
  setCountry: (c: CountryCode | 'ALL' | 'COMPARE') => void;
  onRefresh: () => void;
  isLoading: boolean;
  isBackgroundRefreshing?: boolean;
  onSearch: (query: string) => void;
  topStocks: TrendStock[];
  lastUpdated: string;
  currentTimeKst?: string;
  autoSyncSecondsLeft?: number;
}

export const Header: React.FC<HeaderProps> = ({
  country,
  setCountry,
  onRefresh,
  isLoading,
  isBackgroundRefreshing = false,
  onSearch,
  topStocks,
  lastUpdated,
  currentTimeKst,
  autoSyncSecondsLeft
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      {/* Top Banner Ticker */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-300 flex items-center overflow-hidden">
        <div className="flex items-center gap-1.5 font-semibold text-amber-400 shrink-0 mr-4">
          <Flame className="w-3.5 h-3.5 animate-bounce" />
          <span>실시간 구글 검색 급상승</span>
        </div>
        <div className="flex items-center gap-6 animate-marquee whitespace-nowrap overflow-x-auto no-scrollbar text-xs">
          {topStocks.slice(0, 8).map((s, idx) => (
            <div key={s.id || idx} className="flex items-center gap-1.5 shrink-0 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800">
              <span className="font-bold text-slate-400">#{idx + 1}</span>
              <span className="text-slate-200 font-medium">{s.nameKr} ({s.ticker})</span>
              <span className="text-emerald-400 font-semibold">{s.score}점</span>
              <span className="text-amber-400 text-[10px] font-mono">+{s.surgePercentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Header Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-emerald-500 p-0.5 shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                    Google Trends 주식 분석
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE 실시간
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap mt-0.5">
                  <span className="text-emerald-400 font-mono text-[11px] font-semibold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    서울(KST) {currentTimeKst || lastUpdated}
                  </span>
                  {typeof autoSyncSecondsLeft === 'number' && (
                    <span className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 font-mono">
                      <Radio className={`w-3 h-3 ${isBackgroundRefreshing ? 'text-indigo-400 animate-spin' : 'text-emerald-400'}`} />
                      {isBackgroundRefreshing ? '실시간 갱신중...' : `실시간 유지 (${autoSyncSecondsLeft}초 후 갱신)`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="md:hidden p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
              title="새로고침"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
            <div className="relative">
              <input
                type="text"
                placeholder="종목명 또는 티커 검색 (예: 엔비디아, NVDA, 삼성전자, 005930)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-9 pr-20 py-2 text-xs text-slate-200 placeholder-slate-500 transition outline-none"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition flex items-center gap-1 shadow"
              >
                <Sparkles className="w-3 h-3" />
                분석
              </button>
            </div>
          </form>

          {/* Country Nav Tabs & Desktop Refresh */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => setCountry('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                  country === 'ALL'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Globe2 className="w-3.5 h-3.5" />
                전체
              </button>
              <button
                onClick={() => setCountry('US')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                  country === 'US'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>🇺🇸</span>
                미국
              </button>
              <button
                onClick={() => setCountry('KR')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                  country === 'KR'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>🇰🇷</span>
                한국
              </button>
              <button
                onClick={() => setCountry('COMPARE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                  country === 'COMPARE'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>⚔️</span>
                비교
              </button>
            </div>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 hover:text-white rounded-xl border border-indigo-500/30 text-xs font-semibold transition shadow active:scale-95"
              title="실시간 구글 데이터 즉시 새로고침"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading || isBackgroundRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
              <span>실시간 갱신</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
