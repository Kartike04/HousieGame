import React, { useEffect, useState } from 'react';
import { Clock, History, Volume2 } from 'lucide-react';

interface CurrentNumberDisplayProps {
  currentNumber: number | null;
  calledNumbers: number[];
  nextDrawAt: number | null;
  drawInterval: number;
  gameStatus: string;
}

const NUMBER_WORDS: Record<number, string> = {
  1: 'ONE', 2: 'TWO', 3: 'THREE', 4: 'FOUR', 5: 'FIVE', 6: 'SIX', 7: 'SEVEN', 8: 'EIGHT', 9: 'NINE', 10: 'TEN',
  11: 'ELEVEN', 12: 'TWELVE', 13: 'THIRTEEN', 14: 'FOURTEEN', 15: 'FIFTEEN', 16: 'SIXTEEN', 17: 'SEVENTEEN', 18: 'EIGHTEEN', 19: 'NINETEEN', 20: 'TWENTY',
  21: 'TWENTY ONE', 22: 'TWENTY TWO', 23: 'TWENTY THREE', 24: 'TWENTY FOUR', 25: 'TWENTY FIVE', 26: 'TWENTY SIX', 27: 'TWENTY SEVEN', 28: 'TWENTY EIGHT', 29: 'TWENTY NINE', 30: 'THIRTY',
  31: 'THIRTY ONE', 32: 'THIRTY TWO', 33: 'THIRTY THREE', 34: 'THIRTY FOUR', 35: 'THIRTY FIVE', 36: 'THIRTY SIX', 37: 'THIRTY SEVEN', 38: 'THIRTY EIGHT', 39: 'THIRTY NINE', 40: 'FORTY',
  41: 'FORTY ONE', 42: 'FORTY TWO', 43: 'FORTY THREE', 44: 'FORTY FOUR', 45: 'FORTY FIVE', 46: 'FORTY SIX', 47: 'FORTY SEVEN', 48: 'FORTY EIGHT', 49: 'FORTY NINE', 50: 'FIFTY',
  51: 'FIFTY ONE', 52: 'FIFTY TWO', 53: 'FIFTY THREE', 54: 'FIFTY FOUR', 55: 'FIFTY FIVE', 56: 'FIFTY SIX', 57: 'FIFTY SEVEN', 58: 'FIFTY EIGHT', 59: 'FIFTY NINE', 60: 'SIXTY',
  61: 'SIXTY ONE', 62: 'SIXTY TWO', 63: 'SIXTY THREE', 64: 'SIXTY FOUR', 65: 'SIXTY FIVE', 66: 'SIXTY SIX', 67: 'SIXTY SEVEN', 68: 'SIXTY EIGHT', 69: 'SIXTY NINE', 70: 'SEVENTY',
  71: 'SEVENTY ONE', 72: 'SEVENTY TWO', 73: 'SEVENTY THREE', 74: 'SEVENTY FOUR', 75: 'SEVENTY FIVE', 76: 'SEVENTY SIX', 77: 'SEVENTY SEVEN', 78: 'SEVENTY EIGHT', 79: 'SEVENTY NINE', 80: 'EIGHTY',
  81: 'EIGHTY ONE', 82: 'EIGHTY TWO', 83: 'EIGHTY THREE', 84: 'EIGHTY FOUR', 85: 'EIGHTY FIVE', 86: 'EIGHTY SIX', 87: 'EIGHTY SEVEN', 88: 'EIGHTY EIGHT', 89: 'EIGHTY NINE', 90: 'NINETY',
};

export const CurrentNumberDisplay: React.FC<CurrentNumberDisplayProps> = ({
  currentNumber,
  calledNumbers,
  nextDrawAt,
  drawInterval,
  gameStatus,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!nextDrawAt || gameStatus !== 'PLAYING') {
      setTimeLeft(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((nextDrawAt - now) / 1000));
      setTimeLeft(diff);
    }, 200);

    return () => clearInterval(interval);
  }, [nextDrawAt, gameStatus]);

  const historyList = [...calledNumbers].reverse();

  return (
    <div className="w-full flex flex-col items-center gap-6 my-2">
      {/* 3D Hyper-Realistic Sphere Ball */}
      <div className="relative group flex flex-col items-center">
        <div className="w-44 h-44 md:w-52 md:h-52 rounded-full housie-ball-3d flex flex-col items-center justify-center p-4 border-4 border-amber-300/60 shadow-2xl animate-pop-in relative z-10 transition-transform duration-300 group-hover:scale-105">
          {currentNumber !== null ? (
            <>
              <span className="text-xs uppercase font-black tracking-widest text-amber-950/80 mb-0.5">
                CURRENT NUMBER
              </span>
              <span className="text-6xl md:text-7xl font-black text-amber-950 font-mono tracking-tighter drop-shadow-md">
                {currentNumber}
              </span>
              <span className="text-xs md:text-sm font-extrabold text-amber-950 uppercase tracking-wide text-center mt-0.5">
                {NUMBER_WORDS[currentNumber] || ''}
              </span>
            </>
          ) : (
            <span className="text-5xl animate-pulse">🎱</span>
          )}
        </div>

        {/* Ambient Halo Glow */}
        <div className="absolute inset-0 w-44 h-44 md:w-52 md:h-52 rounded-full bg-amber-400/30 blur-3xl animate-pulse pointer-events-none" />
      </div>

      {/* Countdown Timer */}
      {gameStatus === 'PLAYING' && (
        <div className="flex flex-col items-center gap-2 w-full max-w-xs">
          <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-widest">
            <Clock className="w-4 h-4 animate-spin" />
            <span>Next Draw in {String(timeLeft).padStart(2, '0')}s</span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500 transition-all duration-300 ease-linear rounded-full shadow-md"
              style={{
                width: `${Math.min(100, Math.max(0, (timeLeft / drawInterval) * 100))}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Called Numbers History Strip */}
      <div className="w-full max-w-2xl glass-panel p-3 rounded-2xl border border-slate-800 flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-400 shrink-0">
          <History className="w-3.5 h-3.5 text-amber-400" />
          <span>Called ({calledNumbers.length}/90)</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none text-sm font-mono font-bold">
          {historyList.length === 0 ? (
            <span className="text-xs text-slate-500 italic">No numbers called yet</span>
          ) : (
            historyList.map((num, idx) => (
              <span
                key={num + '-' + idx}
                className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 font-black ${
                  idx === 0
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/40 scale-105 border border-amber-300'
                    : 'bg-slate-900/90 text-slate-300 border border-slate-800'
                }`}
              >
                {num}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
