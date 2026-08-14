import React from 'react';
import { StockCategory } from '../types';
import { Layers, Cpu, Battery, Dna, ShieldAlert, Car, Building2, Sparkles } from 'lucide-react';

interface CategoryFilterBarProps {
  selectedCategory: StockCategory;
  onSelectCategory: (cat: StockCategory) => void;
  stockCountMap: Record<string, number>;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  stockCountMap
}) => {
  const categories: { id: StockCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'ALL', label: '전체', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'semiconductor', label: '반도체/HBM', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'ai', label: 'AI/소프트웨어', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'bigtech', label: '빅테크', icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: 'bio', label: '바이오/제약', icon: <Dna className="w-3.5 h-3.5" /> },
    { id: 'battery', label: '2차전지/EV', icon: <Battery className="w-3.5 h-3.5" /> },
    { id: 'defense', label: '방산/우주', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
    { id: 'automotive', label: '자동차/자율주행', icon: <Car className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const count = stockCountMap[cat.id] || 0;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
              isSelected
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20 scale-[1.02]'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-800/80'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
            {count > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-800 text-slate-500'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
