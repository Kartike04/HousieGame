import React, { useState } from 'react';
import { Trophy, CheckCircle2 } from 'lucide-react';
import { WinClaim, WinningCategory, WinningPatternsConfig } from '../types/game';
import { ClaimTicketSelectModal } from './ClaimTicketSelectModal';

interface WinClaimsPanelProps {
  winningPatterns: WinningPatternsConfig;
  winners: WinClaim[];
  ticketsCount: number;
  onClaimWin: (category: WinningCategory, ticketIndex?: number) => void;
  isClaiming: boolean;
}

const CATEGORY_DETAILS: Record<
  WinningCategory,
  { name: string; desc: string; icon: string }
> = {
  earlyFive: { name: 'Early 5', desc: 'First to mark any 5 numbers', icon: '⚡' },
  topLine: { name: 'Top Line', desc: 'All 5 numbers in top row', icon: '⬆️' },
  middleLine: { name: 'Middle Line', desc: 'All 5 numbers in middle row', icon: '↔️' },
  bottomLine: { name: 'Bottom Line', desc: 'All 5 numbers in bottom row', icon: '⬇️' },
  fullHouse: { name: 'Full House', desc: 'All 15 numbers on a ticket', icon: '👑' },
};

export const WinClaimsPanel: React.FC<WinClaimsPanelProps> = ({
  winningPatterns,
  winners,
  ticketsCount,
  onClaimWin,
  isClaiming,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<WinningCategory | null>(null);

  const winnerMap = new Map<WinningCategory, WinClaim>();
  winners.forEach((w) => winnerMap.set(w.category, w));

  const handleClaimClick = (category: WinningCategory) => {
    if (ticketsCount > 1) {
      setSelectedCategory(category);
    } else {
      onClaimWin(category, 0);
    }
  };

  const handleTicketSelected = (ticketIndex: number) => {
    if (selectedCategory) {
      onClaimWin(selectedCategory, ticketIndex);
      setSelectedCategory(null);
    }
  };

  return (
    <>
      <div className="w-full glass-panel p-4 md:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-extrabold text-white uppercase tracking-wider">
              Claim Prize Rules
            </h2>
          </div>
          <div className="text-xs font-semibold text-slate-400">
            Claimed: <span className="text-amber-400 font-bold">{winners.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {(Object.keys(CATEGORY_DETAILS) as WinningCategory[]).map((catKey) => {
            if (!winningPatterns[catKey]) return null;

            const details = CATEGORY_DETAILS[catKey];
            const winner = winnerMap.get(catKey);

            return (
              <div
                key={catKey}
                className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                  winner
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl">{details.icon}</span>
                    {winner && (
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                        <CheckCircle2 className="w-3 h-3" /> Won
                      </span>
                    )}
                  </div>

                  <div className="font-bold text-sm text-white">{details.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5 mb-3">{details.desc}</div>
                </div>

                {winner ? (
                  <div className="pt-2 border-t border-amber-500/20 text-xs">
                    <span className="text-slate-400">Winner: </span>
                    <span className="font-bold text-amber-300">
                      {winner.playerName} (Ticket #{winner.ticketIndex + 1})
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleClaimClick(catKey)}
                    disabled={isClaiming}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-bold text-xs shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Trophy className="w-3.5 h-3.5 fill-current" />
                    <span>CLAIM WIN</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ticket Selection Modal */}
      <ClaimTicketSelectModal
        isOpen={!!selectedCategory}
        category={selectedCategory}
        ticketsCount={ticketsCount}
        onSelectTicket={handleTicketSelected}
        onClose={() => setSelectedCategory(null)}
      />
    </>
  );
};
