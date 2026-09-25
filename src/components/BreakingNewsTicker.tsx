import React from 'react';
import { Volume2, Zap } from 'lucide-react';

interface BreakingNewsTickerProps {
  tickerItems: string[];
  onSelectHeadline?: (text: string) => void;
}

export const BreakingNewsTicker: React.FC<BreakingNewsTickerProps> = ({
  tickerItems,
  onSelectHeadline,
}) => {
  const fullText = tickerItems.join('   ★   ');

  return (
    <div className="bg-slate-900 border-y border-slate-800 text-slate-100 py-1.5 px-3 flex items-center gap-2 overflow-hidden shadow-md relative z-20">
      {/* Ticker Badge */}
      <div className="shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-extrabold uppercase px-3 py-1 rounded-md shadow-sm glow-red">
        <Zap className="w-3.5 h-3.5 fill-white text-white animate-bounce" />
        <span className="tracking-wider whitespace-nowrap">BREAKING NEWS</span>
      </div>

      {/* Audio Icon indicator */}
      <div className="hidden sm:flex items-center text-slate-400 shrink-0 border-r border-slate-800 pr-2">
        <Volume2 className="w-4 h-4 text-amber-400" />
      </div>

      {/* Marquee Content */}
      <div className="flex-1 overflow-hidden relative flex items-center">
        <div className="animate-marquee whitespace-nowrap text-xs sm:text-sm font-medium text-slate-200">
          <span
            onClick={() => onSelectHeadline && onSelectHeadline(fullText)}
            className="cursor-pointer hover:text-amber-300 transition-colors tracking-wide pr-12 inline-block"
          >
            {fullText}
          </span>
          {/* Repeat for seamless infinite loop */}
          <span
            onClick={() => onSelectHeadline && onSelectHeadline(fullText)}
            className="cursor-pointer hover:text-amber-300 transition-colors tracking-wide pr-12 inline-block"
          >
            {fullText}
          </span>
        </div>
      </div>
    </div>
  );
};
