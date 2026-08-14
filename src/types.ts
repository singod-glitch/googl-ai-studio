export type CountryCode = 'US' | 'KR';

export type StockCategory =
  | 'ALL'
  | 'semiconductor'
  | 'ai'
  | 'battery'
  | 'bio'
  | 'defense'
  | 'bigtech'
  | 'automotive'
  | 'finance';

export type SurgeStatus = 'breakout' | 'high' | 'rising' | 'steady';
export type Sentiment = 'bullish' | 'neutral' | 'bearish';

export interface HourlyInterestPoint {
  time: string;
  US: number;
  KR: number;
  [key: string]: string | number;
}

export interface NewsArticle {
  title: string;
  source: string;
  time: string;
  url?: string;
  snippet?: string;
}

export interface TrendStock {
  id: string;
  ticker: string;
  name: string;
  nameKr: string;
  country: CountryCode;
  category: StockCategory;
  score: number; // 0-100 search interest score
  surgePercentage: number; // e.g. 850 means +850%
  surgeStatus: SurgeStatus;
  sentiment: Sentiment;
  price: string;
  priceChange: string;
  isPositivePrice: boolean;
  reasons: string[];
  relatedQueries: string[];
  hourlyInterest: HourlyInterestPoint[];
  newsHeadlines: NewsArticle[];
  lastUpdated: string;
  marketCap?: string;
  searchVolumeEstimate?: string;
}

export interface TrendAnalysisResponse {
  country: CountryCode | 'ALL';
  topTrendingStocks: TrendStock[];
  marketOverview: {
    usSummary: string;
    krSummary: string;
    keyCatalysts: string[];
    topThemeToday: string;
  };
  hotKeywords: { text: string; value: number; country: CountryCode; category: string }[];
  groundingSources: { title: string; uri: string }[];
  timestamp: string;
  isLiveGrounded: boolean;
}

export interface CompareRequest {
  stockA: string;
  stockB: string;
}

export interface CompareResponse {
  stockA: TrendStock;
  stockB: TrendStock;
  compareChart: { time: string; stockAInterest: number; stockBInterest: number }[];
  aiComparativeSummary: string;
  winnerSummary: string;
}
