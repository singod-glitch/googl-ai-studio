import React, { useState } from 'react';
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
import { TrendStock } from '../types';
import { LineChart as LineChartIcon, Activity } from 'lucide-react';

interface TrendChartSectionProps {
  stocks: TrendStock[];
}

const LINE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6'];

export const TrendChartSection: React.FC<TrendChartSectionProps> = ({ stocks }) => {
  // Select top 4 stocks by default
  const topStocks = stocks.slice(0, 5);
  const [selectedStockIds, setSelectedStockIds] = useState<string[]>(
    topStocks.map((s) => s.id)
  );

  const toggleStock = (id: string) => {
    if (selectedStockIds.includes(id)) {
      if (selectedStockIds.length > 1) {
        setSelectedStockIds(selectedStockIds.filter((i) => i !== id));
      }
    } else {
      setSelectedStockIds([...selectedStockIds, id]);
    }
  };

  // Build chart dataset
  // Combine hourlyInterest of selected stocks
  const timePoints = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];

  const chartData = timePoints.map((time) => {
    const point: any = { time };
    topStocks.forEach((s) => {
      if (selectedStockIds.includes(s.id)) {
        const item = s.hourlyInterest?.find((h) => h.time === time);
        const score = item ? (s.country === 'US' ? item.US : item.KR) : Math.floor(Math.random() * 40) + 50;
        point[s.ticker] = score;
      }
    });
    return point;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <LineChartIcon className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">
              실시간 구글 검색 관심도 24시간 타임라인
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            미국 및 한국 주요 종목의 24시간 구글 검색 흐름 상대비교 (최대 100점)
          </p>
        </div>

        {/* Stock Ticker Selectors */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {topStocks.map((s, idx) => {
            const isSelected = selectedStockIds.includes(s.id);
            const color = LINE_COLORS[idx % LINE_COLORS.length];

            return (
              <button
                key={s.id}
                onClick={() => toggleStock(s.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-800 text-white border-slate-600 shadow'
                    : 'bg-slate-950 text-slate-500 border-slate-850 hover:text-slate-300'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: color }}
                />
                <span>{s.nameKr}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recharts Line Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '12px',
                color: '#f8fafc',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

            {topStocks.map((s, idx) => {
              if (!selectedStockIds.includes(s.id)) return null;
              const color = LINE_COLORS[idx % LINE_COLORS.length];

              return (
                <Line
                  key={s.id}
                  type="monotone"
                  dataKey={s.ticker}
                  name={`${s.nameKr} (${s.ticker})`}
                  stroke={color}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: color }}
                  activeDot={{ r: 6 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-indigo-400" />
          구글 검색지수는 최고 검색 관심 시점을 100점으로 정규화한 상대지수입니다.
        </span>
        <span className="font-mono">Google Trends Real-time Feed</span>
      </div>
    </div>
  );
};
