import React from 'react';
import { Check, Ticket as TicketIcon } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface TicketDisplayProps {
  tickets: (number | null)[][][];
  markedNumbers: number[];
  calledNumbers: number[];
  onMarkNumber: (num: number) => void;
  onInvalidMarkAttempt: (num: number) => void;
  playerName: string;
}

export const TicketDisplay: React.FC<TicketDisplayProps> = ({
  tickets,
  markedNumbers,
  calledNumbers,
  onMarkNumber,
  onInvalidMarkAttempt,
  playerName,
}) => {
  const calledSet = new Set(calledNumbers);
  const markedSet = new Set(markedNumbers);

  const handleCellClick = (num: number | null) => {
    if (num === null) return;

    if (!calledSet.has(num)) {
      soundManager.playErrorSound();
      onInvalidMarkAttempt(num);
      return;
    }

    soundManager.playClickSound();
    onMarkNumber(num);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <TicketIcon className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-extrabold text-amber-300 uppercase tracking-wider">
            {playerName}'s Housie Tickets ({tickets.length})
          </h2>
        </div>
        <div className="text-xs font-bold text-amber-400/90 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
          Marked: {markedNumbers.length}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {tickets.map((ticket, tIdx) => (
          <div
            key={`ticket-${tIdx}`}
            className="glass-panel-gold p-4 md:p-6 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden"
          >
            {/* Ticket Badge */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-500/20">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-xs uppercase tracking-wider border border-amber-500/30">
                🎟️ Ticket #{tIdx + 1}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                3 × 9 Grid
              </span>
            </div>

            {/* 3x9 Grid Layout */}
            <div className="grid grid-rows-3 gap-2 bg-slate-950/80 p-2.5 rounded-2xl border border-amber-500/20">
              {ticket.map((row, rowIdx) => (
                <div key={`t${tIdx}-row-${rowIdx}`} className="grid grid-cols-9 gap-1.5 md:gap-2">
                  {row.map((cell, colIdx) => {
                    if (cell === null) {
                      return (
                        <div
                          key={`t${tIdx}-cell-${rowIdx}-${colIdx}`}
                          className="h-11 md:h-14 rounded-xl bg-slate-900/40 border border-slate-900/60 flex items-center justify-center pointer-events-none"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-800/50" />
                        </div>
                      );
                    }

                    const isCalled = calledSet.has(cell);
                    const isMarked = markedSet.has(cell);

                    return (
                      <button
                        type="button"
                        key={`t${tIdx}-cell-${rowIdx}-${colIdx}`}
                        onClick={() => handleCellClick(cell)}
                        className={`h-11 md:h-14 rounded-xl flex flex-col items-center justify-center font-mono font-bold text-base md:text-lg transition-all duration-200 relative group overflow-hidden ${
                          isMarked
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white border-2 border-emerald-300 shadow-lg shadow-emerald-950 scale-[0.98]'
                            : isCalled
                            ? 'bg-amber-500/20 text-amber-300 border-2 border-amber-400 animate-pulse hover:bg-amber-500/30'
                            : 'bg-slate-900 text-slate-200 border border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                        }`}
                      >
                        {isMarked ? (
                          <div className="flex items-center gap-0.5">
                            <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-200 stroke-[3]" />
                            <span>{cell}</span>
                          </div>
                        ) : (
                          <span>{cell}</span>
                        )}

                        {isCalled && !isMarked && (
                          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-xs text-amber-300/70 font-medium">
        💡 Tap a called number to mark it. Numbers only highlight once called by the server.
      </div>
    </div>
  );
};
