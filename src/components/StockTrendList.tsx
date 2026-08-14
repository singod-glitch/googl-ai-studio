import React from 'react';
import { TrendStock } from '../types';
import { Flame, ArrowUpRight, TrendingUp, TrendingDown, Search, ExternalLink } from 'lucide-react';

interface StockTrendListProps {
  stocks: TrendStock[];
  onSelectStock: (stock: TrendStock) => void;
  onSearchQueryClick?: (query: string) => void;
}

export const StockTrendList: React.FC<StockTrendListProps> = ({
  stocks,
  onSelectStock,
  onSearchQueryClick
}) => {
  if (stocks.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center my-6">
        <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-300">해당 카테고리의 트렌드 종목이 없습니다.</h3>
        <p className="text-xs text-slate-500 mt-1">다른 카테고리 또는 '전체' 탭을 선택해 보세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5 mb-8">
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-medium">
        <span>실시간 구글 검색 순위 TOP {stocks.length}</span>
        <span className="hidden sm:inline">관심도 점수 (0-100) / 검색 급증률</span>
      </div>

      {stocks.map((stock, index) => {
        const rank = index + 1;
        const isTop3 = rank <= 3;

        let rankBadgeClass = 'bg-slate-800 text-slate-400 border-slate-700';
        if (rank === 1) rankBadgeClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold';
        if (rank === 2) rankBadgeClass = 'bg-slate-300/20 text-slate-200 border-slate-300/40 font-bold';
        if (rank === 3) rankBadgeClass = 'bg-amber-700/20 text-amber-400 border-amber-700/40 font-bold';

        return (
          <div
            key={stock.id || `${stock.ticker}-${rank}`}
            className={`bg-slate-900/90 border rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:scale-[1.005] cursor-pointer group shadow-lg ${
              isTop3
                ? 'border-indigo-500/30 hover:border-indigo-500/70 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/20'
                : 'border-slate-800 hover:border-slate-700'
            }`}
            onClick={() => onSelectStock(stock)}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Left Column: Rank, Country, Ticker, Name, Price */}
              <div className="flex items-start gap-3.5 flex-1">
                <div
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 text-xs font-mono shadow ${rankBadgeClass}`}
                >
                  #{rank}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base">{stock.country === 'US' ? '🇺🇸' : '🇰🇷'}</span>
                    <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition truncate">
                      {stock.nameKr}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {stock.ticker}
                    </span>

                    {/* Surge Badge */}
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono border ${
                        stock.surgeStatus === 'breakout'
                          ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
                          : stock.surgeStatus === 'high'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      <Flame className="w-3 h-3" />
                      +{stock.surgePercentage}%
                    </span>
                  </div>

                  {/* Stock Price & Price Change */}
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className="text-slate-300 font-semibold font-mono">{stock.price}</span>
                    <span
                      className={`font-semibold flex items-center gap-0.5 font-mono ${
                        stock.isPositivePrice ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {stock.isPositivePrice ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {stock.priceChange}
                    </span>
                    {stock.marketCap && (
                      <span className="text-slate-500 text-[11px] hidden sm:inline">
                        시가총액: {stock.marketCap}
                      </span>
                    )}
                  </div>

                  {/* Top Search Spike Reasons */}
                  <div className="mt-2.5 space-y-1">
                    {stock.reasons.slice(0, 2).map((reason, rIdx) => (
                      <p key={rIdx} className="text-xs text-slate-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                        <span className="truncate">
                          {reason.includes('[') && reason.includes(']') ? (
                            <>
                              <span className="text-indigo-300 font-medium mr-1">
                                {reason.substring(reason.indexOf('['), reason.indexOf(']') + 1)}
                              </span>
                              <span>{reason.substring(reason.indexOf(']') + 1)}</span>
                            </>
                          ) : (
                            reason
                          )}
                        </span>
                      </p>
                    ))}
                  </div>

                  {/* Related Search Queries */}
                  {stock.relatedQueries && stock.relatedQueries.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                      <span className="text-[11px] text-slate-500 font-medium">연관 검색어:</span>
                      {stock.relatedQueries.slice(0, 4).map((q, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSearchQueryClick) onSearchQueryClick(q);
                          }}
                          className="text-[11px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-2 py-0.5 rounded-lg border border-slate-700 transition"
                        >
                          #{q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Search Interest Score Bar */}
              <div className="lg:w-64 shrink-0 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400 font-medium">구글 검색 지수</span>
                  <span className="font-bold text-white font-mono text-sm">
                    {stock.score} <span className="text-xs font-normal text-slate-500">/ 100</span>
                  </span>
                </div>

                {/* Score Progress Bar */}
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(10, stock.score))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>추정 검색량: {stock.searchVolumeEstimate || '높음'}</span>
                  <span className="text-indigo-400 group-hover:text-indigo-300 font-medium flex items-center gap-0.5">
                    상세분석 <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};
