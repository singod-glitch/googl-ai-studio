import React from 'react';
import { TrendStock } from '../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { X, Flame, TrendingUp, TrendingDown, Newspaper, Globe, Sparkles, ExternalLink } from 'lucide-react';

interface StockDetailModalProps {
  stock: TrendStock | null;
  onClose: () => void;
  onSearchQueryClick?: (query: string) => void;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({
  stock,
  onClose,
  onSearchQueryClick
}) => {
  if (!stock) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Header */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{stock.country === 'US' ? '🇺🇸' : '🇰🇷'}</span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{stock.nameKr}</h2>
              <span className="text-xs font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300 border border-slate-700">
                {stock.ticker}
              </span>
            </div>
            <p className="text-xs text-slate-400">{stock.name}</p>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">구글 검색 지수</span>
            <span className="text-base font-bold text-white font-mono">{stock.score} / 100</span>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px]">검색 폭발 급증률</span>
            <span className="text-base font-bold text-amber-400 font-mono flex items-center gap-1">
              <Flame className="w-4 h-4" />
              +{stock.surgePercentage}%
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px]">주가 및 변동률</span>
            <span className="text-xs font-bold text-slate-200 font-mono block mt-0.5">{stock.price}</span>
            <span
              className={`font-semibold flex items-center gap-0.5 text-[11px] font-mono ${
                stock.isPositivePrice ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {stock.isPositivePrice ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {stock.priceChange}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px]">추정 일간 검색량</span>
            <span className="text-xs font-bold text-indigo-300 font-mono block mt-1">
              {stock.searchVolumeEstimate || '1.0M+'}
            </span>
          </div>
        </div>

        {/* 24h Search Interest Chart */}
        {stock.hourlyInterest && stock.hourlyInterest.length > 0 && (
          <div className="mb-5 bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              24시간 구글 검색 관심도 추이
            </h3>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stock.hourlyInterest} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '10px',
                      fontSize: '11px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={stock.country === 'US' ? 'US' : 'KR'}
                    name="검색 관심도"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 3, fill: '#6366f1' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Top Catalyst Reasons with Sources & Grounds */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              💡 구글 검색 급증 배경 및 시장 모멘텀
            </h3>
            <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-medium">
              출처 및 근거 포함
            </span>
          </div>
          <div className="space-y-2">
            {stock.reasons.map((r, idx) => (
              <div key={idx} className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-200 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="leading-relaxed flex-1">
                  {r.includes('[') && r.includes(']') ? (
                    <>
                      <span className="text-indigo-300 font-semibold mr-1">
                        {r.substring(r.indexOf('['), r.indexOf(']') + 1)}
                      </span>
                      <span>{r.substring(r.indexOf(']') + 1)}</span>
                    </>
                  ) : (
                    <span>{r}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Search Queries */}
        {stock.relatedQueries && stock.relatedQueries.length > 0 && (
          <div className="mb-5">
            <h3 className="text-xs font-bold text-slate-300 mb-2">
              🔍 연관 구글 검색 키워드
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              {stock.relatedQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (onSearchQueryClick) onSearchQueryClick(q);
                    onClose();
                  }}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 transition"
                >
                  #{q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* News Headlines with Direct Links & KST Timestamps */}
        {stock.newsHeadlines && stock.newsHeadlines.length > 0 && (
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Newspaper className="w-4 h-4 text-indigo-400" />
                실시간 연관 뉴스 및 언론 보도 (클릭 시 이동)
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">서울시간(KST)</span>
            </div>
            <div className="space-y-2">
              {stock.newsHeadlines.map((news, idx) => {
                const newsUrl = news.url && news.url.startsWith('http')
                  ? news.url
                  : `https://news.google.com/search?q=${encodeURIComponent(stock.nameKr + ' ' + stock.ticker + ' 뉴스')}`;

                return (
                  <a
                    key={idx}
                    href={newsUrl}
                    target="_blank"
                    rel="noreferrer"
                    referrerPolicy="no-referrer"
                    className="block bg-slate-950 hover:bg-indigo-950/30 hover:border-indigo-500/50 p-3.5 rounded-2xl border border-slate-800/80 transition group"
                  >
                    <div className="flex items-start justify-between gap-3 text-xs font-semibold text-slate-200 group-hover:text-indigo-300">
                      <span className="leading-snug">{news.title}</span>
                      <span className="shrink-0 text-[11px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-lg flex items-center gap-1 group-hover:bg-indigo-500 group-hover:text-white transition">
                        기사 보기 <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2">
                      <span className="font-medium text-slate-300">{news.source || '구글 뉴스'}</span>
                      <span>•</span>
                      <span className="font-mono text-emerald-400">{news.time}</span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
