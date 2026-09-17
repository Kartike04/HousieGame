import React from 'react';
import { Grid } from 'lucide-react';

interface BoardDisplayProps {
  calledNumbers: number[];
  currentNumber: number | null;
}

export const BoardDisplay: React.FC<BoardDisplayProps> = ({
  calledNumbers,
  currentNumber,
}) => {
  const calledSet = new Set(calledNumbers);

  const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1);

  return (
    <div className="w-full glass-panel p-4 md:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Grid className="w-5 h-5 text-purple-400" />
          <h2 className="text-base font-extrabold text-white uppercase tracking-wider">
            1–90 Called Board
          </h2>
        </div>
        <div className="text-xs font-semibold text-slate-400">
          Called: <span className="text-purple-300 font-bold">{calledNumbers.length}</span> / 90
        </div>
      </div>

      {/* 10x9 Grid of 1-90 */}
      <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
        {allNumbers.map((num) => {
          const isCurrent = num === currentNumber;
          const isCalled = calledSet.has(num);

          return (
            <div
              key={num}
              className={`h-8 sm:h-10 rounded-lg flex items-center justify-center font-mono font-bold text-xs sm:text-sm transition-all ${
                isCurrent
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/40 ring-2 ring-amber-300 scale-110 z-10 animate-pulse'
                  : isCalled
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-black'
                  : 'bg-slate-900/60 text-slate-600 border border-slate-900'
              }`}
            >
              {num}
            </div>
          );
        })}
      </div>
    </div>
  );
};
