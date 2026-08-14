import React, { useState } from 'react';
import { CompareResponse } from '../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { Sparkles, Swords, Trophy, RefreshCw, Flame, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface CountryCompareViewProps {
  onCompareRequest: (stockA: string, stockB: string) => Promise<CompareResponse>;
}

export const CountryCompareView: React.FC<CountryCompareViewProps> = ({ onCompareRequest }) => {
  const [stockAInput, setStockAInput] = useState('NVDA');
  const [stockBInput, setStockBInput] = useState('000660.KS');
  const [loading, setLoading] = useState(false);
  const [compareData, setCompareData] = useState<CompareResponse | null>(null);

  const presets = [
    { label: '🔥 NVDA (엔비디아) vs SK하이닉스', a: 'NVDA', b: 'SK하이닉스' },
    { label: '📱 AAPL (애플) vs 삼성전자', a: 'AAPL', b: '삼성전자' },
    { label: '⚡ TSLA (테슬라) vs 현대차', a: 'TSLA', b: '현대차' },
    { label: '🧬 LLY (일라이릴리) vs 알테오젠', a: 'LLY', b: '알테오젠' },
    { label: '🛡️ PLTR (팔란티어) vs 한화에어로스페이스', a: 'PLTR', b: '한화에어로스페이스' }
  ];

  const handleRunCompare = async (a = stockAInput, b = stockBInput) => {
    if (!a.trim() || !b.trim()) return;
    setLoading(true);
    try {
      const res = await onCompareRequest(a.trim(), b.trim());
      setCompareData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const selectPreset = (a: string, b: string) => {
    setStockAInput(a);
    setStockBInput(b);
    handleRunCompare(a, b);
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Title & Presets */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">미국 vs 한국 주식 구글 트렌드 맞대결</h2>
              <p className="text-xs text-slate-400">
                미국 빅테크 주식과 한국 대장주의 실시간 구글 검색 관심도 및 모멘텀 비교
              </p>
            </div>
          </div>

          <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Gemini AI Grounded Compare
          </span>
        </div>

        {/* Preset Chips */}
        <div className="mb-4">
          <span className="text-xs text-slate-400 font-medium block mb-2">추천 매치업:</span>
          <div className="flex items-center gap-2 flex-wrap">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => selectPreset(p.a, p.b)}
                className="text-xs bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition font-medium"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Manual Comparison Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-3 border-t border-slate-800">
          <div className="md:col-span-2">
            <label className="text-[11px] text-slate-400 block mb-1">미국/종목 A (티커 또는 종목명)</label>
            <input
              type="text"
              value={stockAInput}
              onChange={(e) => setStockAInput(e.target.value)}
              placeholder="예: NVDA, TSLA, AAPL"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-[11px] text-slate-400 block mb-1">한국/종목 B (티커 또는 종목명)</label>
            <input
              type="text"
              value={stockBInput}
              onChange={(e) => setStockBInput(e.target.value)}
              placeholder="예: SK하이닉스, 삼성전자, 알테오젠"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => handleRunCompare()}
              disabled={loading}
              className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? '트렌드 비교 분석 중...' : '트렌드 맞대결 실행'}
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Results */}
      {compareData && (
        <div className="space-y-6">
          {/* Winner Banner */}
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Trophy className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  구글 검색 관심도 우세 종목
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {compareData.winnerSummary || '최고 관심도 유입 종목'}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              {compareData.aiComparativeSummary}
            </p>
          </div>

          {/* Side-by-Side Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Stock A Card */}
            <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1">
                  <span>🇺🇸</span> Stock A
                </span>
                <span className="text-xs font-bold font-mono text-white bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                  {compareData.stockA?.score}점 / 100
                </span>
              </div>

              <h3 className="text-xl font-bold text-white">
                {compareData.stockA?.nameKr || compareData.stockA?.name}{' '}
                <span className="text-xs text-slate-400 font-normal">({compareData.stockA?.ticker})</span>
              </h3>

              <div className="flex items-center gap-2 mt-2 text-xs font-mono">
                <span className="text-slate-200 font-bold">{compareData.stockA?.price}</span>
                <span className="text-emerald-400 font-semibold">{compareData.stockA?.priceChange}</span>
                <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                  <Flame className="w-3 h-3" />
                  +{compareData.stockA?.surgePercentage}%
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5">
                <span className="text-[11px] text-slate-400 font-medium block">핵심 검색 요인:</span>
                {compareData.stockA?.reasons?.map((r, idx) => (
                  <p key={idx} className="text-xs text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{r}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* Stock B Card */}
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <span>🇰🇷</span> Stock B
                </span>
                <span className="text-xs font-bold font-mono text-white bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {compareData.stockB?.score}점 / 100
                </span>
              </div>

              <h3 className="text-xl font-bold text-white">
                {compareData.stockB?.nameKr || compareData.stockB?.name}{' '}
                <span className="text-xs text-slate-400 font-normal">({compareData.stockB?.ticker})</span>
              </h3>

              <div className="flex items-center gap-2 mt-2 text-xs font-mono">
                <span className="text-slate-200 font-bold">{compareData.stockB?.price}</span>
                <span className="text-emerald-400 font-semibold">{compareData.stockB?.priceChange}</span>
                <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                  <Flame className="w-3 h-3" />
                  +{compareData.stockB?.surgePercentage}%
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5">
                <span className="text-[11px] text-slate-400 font-medium block">핵심 검색 요인:</span>
                {compareData.stockB?.reasons?.map((r, idx) => (
                  <p key={idx} className="text-xs text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{r}</span>
                  </p>
                ))}
              </div>
            </div>

          </div>

          {/* Comparison Recharts */}
          {compareData.compareChart && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h4 className="text-xs font-bold text-slate-300 mb-3">
                24시간 상대 검색 관심도 비교 그래프
              </h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={compareData.compareChart} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#f8fafc',
                        fontSize: '12px'
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="stockAInterest"
                      name={`${compareData.stockA?.nameKr || compareData.stockA?.ticker}`}
                      stroke="#818cf8"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="stockBInterest"
                      name={`${compareData.stockB?.nameKr || compareData.stockB?.ticker}`}
                      stroke="#34d399"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
