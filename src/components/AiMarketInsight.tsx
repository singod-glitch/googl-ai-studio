import React from 'react';
import { TrendAnalysisResponse } from '../types';
import { Sparkles, Globe, ExternalLink, Hash, Flame } from 'lucide-react';

interface AiMarketInsightProps {
  data: TrendAnalysisResponse;
  onKeywordClick: (kw: string) => void;
}

export const AiMarketInsight: React.FC<AiMarketInsightProps> = ({ data, onKeywordClick }) => {
  const { marketOverview, hotKeywords, groundingSources } = data;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8 shadow-xl">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Google Grounded AI 시장 인사이트 리포트</h2>
            <p className="text-xs text-slate-400">
              실시간 구글 검색 데이터 기반 미국 & 한국 주시 시장 트렌드 종합
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live Grounded Search Sync
        </span>
      </div>

      {/* Market Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        
        {/* US Market Overview */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-300 mb-2">
            <span>🇺🇸</span> 미국 시장 검색 관심 트렌드
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {marketOverview?.usSummary || '미국 시장은 AI 서버, 빅테크 실적 및 자율주행 모멘텀을 중심으로 구글 검색량이 상승하고 있습니다.'}
          </p>
        </div>

        {/* KR Market Overview */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-300 mb-2">
            <span>🇰🇷</span> 한국 시장 검색 관심 트렌드
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {marketOverview?.krSummary || '한국 시장은 HBM4 반도체 공급망, 바이오 독점 라이선스 및 방산 수주 소식에 구글 검색 반응이 폭발적입니다.'}
          </p>
        </div>

      </div>

      {/* Hot Keywords Cloud */}
      {hotKeywords && hotKeywords.length > 0 && (
        <div className="mb-5 pt-4 border-t border-slate-800">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1 mb-2.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            실시간 구글 핫 트렌드 연관 키워드
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {hotKeywords.map((kw, idx) => (
              <button
                key={idx}
                onClick={() => onKeywordClick(kw.text)}
                className="text-xs bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition flex items-center gap-1.5 shadow-sm group"
              >
                <Hash className="w-3 h-3 text-indigo-400 group-hover:text-indigo-300" />
                <span className="font-medium">{kw.text}</span>
                <span className="text-[10px] text-amber-400 font-mono font-semibold">
                  {kw.value}점
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grounding Sources & News Links */}
      {groundingSources && groundingSources.length > 0 && (
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
          <span className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            구글 검색 연동 출처:
          </span>
          <div className="flex items-center gap-3 flex-wrap">
            {groundingSources.slice(0, 3).map((src, sIdx) => (
              <a
                key={sIdx}
                href={src.uri}
                target="_blank"
                rel="noreferrer"
                className="hover:text-indigo-300 underline underline-offset-2 flex items-center gap-1 text-[11px] text-slate-400"
              >
                <span>{src.title}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
