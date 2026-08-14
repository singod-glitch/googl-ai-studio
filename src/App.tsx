import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CountryCode, StockCategory, TrendAnalysisResponse, TrendStock, CompareResponse } from './types';
import { Header } from './components/Header';
import { TrendOverviewCards } from './components/TrendOverviewCards';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { StockTrendList } from './components/StockTrendList';
import { TrendChartSection } from './components/TrendChartSection';
import { CountryCompareView } from './components/CountryCompareView';
import { AiMarketInsight } from './components/AiMarketInsight';
import { StockDetailModal } from './components/StockDetailModal';
import { RefreshCw, Search, Sparkles, Globe, AlertCircle, Radio, Zap } from 'lucide-react';

const AUTO_SYNC_INTERVAL_SEC = 30;

export default function App() {
  const [country, setCountry] = useState<CountryCode | 'ALL' | 'COMPARE'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<StockCategory>('ALL');
  const [data, setData] = useState<TrendAnalysisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isBackgroundRefreshing, setIsBackgroundRefreshing] = useState<boolean>(false);
  const [selectedStockModal, setSelectedStockModal] = useState<TrendStock | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('방금 전');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentTimeKst, setCurrentTimeKst] = useState<string>('');
  const [secondsLeft, setSecondsLeft] = useState<number>(AUTO_SYNC_INTERVAL_SEC);

  const countryRef = useRef(country);
  useEffect(() => {
    countryRef.current = country;
  }, [country]);

  // Live ticking KST clock (Seoul Time)
  useEffect(() => {
    const updateKstClock = () => {
      const kstString = new Date().toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      setCurrentTimeKst(kstString);
    };
    updateKstClock();
    const clockInterval = setInterval(updateKstClock, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Fetch Trends Data
  const loadTrendsData = async (forceRefresh = false, isSilent = false) => {
    if (isSilent) {
      setIsBackgroundRefreshing(true);
    } else {
      setLoading(true);
    }
    setErrorMessage(null);

    try {
      const targetCountry = countryRef.current === 'COMPARE' ? 'ALL' : countryRef.current;
      const res = await fetch(`/api/trends?country=${targetCountry}&force=${forceRefresh}`);
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const json: TrendAnalysisResponse = await res.json();
      setData(json);
      setLastUpdated(json.timestamp || new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }));
      setSecondsLeft(AUTO_SYNC_INTERVAL_SEC);
    } catch (err: any) {
      console.error('Error fetching trends:', err);
      if (!data) {
        setErrorMessage('실시간 데이터 수신에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
      setIsBackgroundRefreshing(false);
    }
  };

  // Initial load and country change
  useEffect(() => {
    loadTrendsData(false, false);
    setSecondsLeft(AUTO_SYNC_INTERVAL_SEC);
  }, [country]);

  // Real-time 1-second countdown and 30-second background auto-refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          loadTrendsData(true, true);
          return AUTO_SYNC_INTERVAL_SEC;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle Custom Stock Search
  const handleStockSearch = async (query: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search-stock?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.stock) {
          setSelectedStockModal(json.stock);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Handle Stock Comparison Request
  const handleCompareRequest = async (stockA: string, stockB: string): Promise<CompareResponse> => {
    const res = await fetch('/api/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stockA, stockB })
    });
    if (!res.ok) {
      throw new Error('Comparison failed');
    }
    return await res.json();
  };

  // Filter stocks by category
  const filteredStocks = useMemo(() => {
    if (!data?.topTrendingStocks) return [];
    let list = data.topTrendingStocks;

    if (country === 'US') list = list.filter((s) => s.country === 'US');
    if (country === 'KR') list = list.filter((s) => s.country === 'KR');

    if (selectedCategory !== 'ALL') {
      list = list.filter((s) => s.category === selectedCategory);
    }

    return list;
  }, [data, country, selectedCategory]);

  // Compute category stock counts
  const stockCountMap = useMemo(() => {
    if (!data?.topTrendingStocks) return {};
    const map: Record<string, number> = { ALL: data.topTrendingStocks.length };

    data.topTrendingStocks.forEach((s) => {
      if (country === 'ALL' || s.country === country) {
        map[s.category] = (map[s.category] || 0) + 1;
      }
    });

    return map;
  }, [data, country]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        country={country}
        setCountry={setCountry}
        onRefresh={() => loadTrendsData(true, false)}
        isLoading={loading}
        isBackgroundRefreshing={isBackgroundRefreshing}
        onSearch={handleStockSearch}
        topStocks={data?.topTrendingStocks || []}
        lastUpdated={lastUpdated}
        currentTimeKst={currentTimeKst}
        autoSyncSecondsLeft={secondsLeft}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Real-time status banner bar */}
        <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800/80 px-4 py-2 rounded-xl mb-5 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-slate-300">
              실시간 데이터 유지 중 (30초 자동 동기화 활성화)
            </span>
            {isBackgroundRefreshing && (
              <span className="text-indigo-400 text-[11px] font-semibold animate-pulse flex items-center gap-1 ml-2">
                <RefreshCw className="w-3 h-3 animate-spin" />
                최신 데이터 수신 중...
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="text-slate-400">
              마지막 업데이트: <strong className="text-slate-200">{lastUpdated}</strong>
            </span>
            <button
              onClick={() => loadTrendsData(true, false)}
              className="text-indigo-400 hover:text-indigo-300 underline font-sans text-xs"
            >
              지금 갱신
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-4 py-3 rounded-2xl mb-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => loadTrendsData(true, false)}
              className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 px-2.5 py-1 rounded-lg font-medium transition"
            >
              재시도
            </button>
          </div>
        )}

        {/* Loading Skeleton View */}
        {loading && !data && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-12 text-center my-8 shadow-xl">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-4 animate-pulse">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
            <h3 className="text-base font-bold text-slate-200">
              구글 실시간 검색 트렌드 및 주가 데이터 조회 중...
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Google Search Grounding을 통해 미국 및 한국의 최신 검색 급상승 종목과 실시간 시세를 직접 조회하고 있습니다.
            </p>
          </div>
        )}

        {/* 1. Overview KPI Cards */}
        {data?.topTrendingStocks && country !== 'COMPARE' && (
          <TrendOverviewCards
            stocks={data.topTrendingStocks}
            topThemeToday={data.marketOverview?.topThemeToday}
            onSelectStock={(s) => setSelectedStockModal(s)}
          />
        )}

        {/* 2. Country Compare View Mode */}
        {country === 'COMPARE' ? (
          <CountryCompareView onCompareRequest={handleCompareRequest} />
        ) : (
          <>
            {/* 3. Category Filter Chips */}
            <CategoryFilterBar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              stockCountMap={stockCountMap}
            />

            {/* 4. Interactive Recharts Timeline Section */}
            {data?.topTrendingStocks && (
              <TrendChartSection stocks={filteredStocks.length > 0 ? filteredStocks : data.topTrendingStocks} />
            )}

            {/* 5. Main Stock Trend Cards List */}
            <StockTrendList
              stocks={filteredStocks}
              onSelectStock={(s) => setSelectedStockModal(s)}
              onSearchQueryClick={(q) => handleStockSearch(q)}
            />

            {/* 6. AI Grounded Market Report */}
            {data && (
              <AiMarketInsight
                data={data}
                onKeywordClick={(kw) => handleStockSearch(kw)}
              />
            )}
          </>
        )}

      </main>

      {/* Stock Detail Popup Modal */}
      <StockDetailModal
        stock={selectedStockModal}
        onClose={() => setSelectedStockModal(null)}
        onSearchQueryClick={(q) => handleStockSearch(q)}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-500 text-xs py-8 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">
              실시간 미국 & 한국 주식 Google Trends 분석기
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Powered by Google GenAI Gemini 3.7 Flash & Google Search Grounding • 실시간 30초 자동 동기화 유지
          </p>
        </div>
      </footer>
    </div>
  );
}
