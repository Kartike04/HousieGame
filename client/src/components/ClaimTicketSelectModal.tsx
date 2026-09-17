import React from 'react';
import { X, Ticket, Trophy } from 'lucide-react';
import { WinningCategory } from '../types/game';

interface ClaimTicketSelectModalProps {
  isOpen: boolean;
  category: WinningCategory | null;
  ticketsCount: number;
  onSelectTicket: (ticketIndex: number) => void;
  onClose: () => void;
}

const CATEGORY_NAMES: Record<string, string> = {
  earlyFive: 'Early 5 ⚡',
  topLine: 'Top Line ⬆️',
  middleLine: 'Middle Line ↔️',
  bottomLine: 'Bottom Line ⬇️',
  fullHouse: 'Full House / HOUSIE 👑',
};

export const ClaimTicketSelectModal: React.FC<ClaimTicketSelectModalProps> = ({
  isOpen,
  category,
  ticketsCount,
  onSelectTicket,
  onClose,
}) => {
  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-pop-in">
      <div className="glass-panel-gold w-full max-w-md rounded-3xl p-6 md:p-8 border-2 border-amber-400 shadow-2xl relative text-center overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-amber-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 mb-3 shadow-lg shadow-amber-500/30">
          <Trophy className="w-8 h-8 fill-current" />
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight my-1">
          Select Ticket to Claim
        </h2>

        <p className="text-amber-300 font-bold text-sm mb-6 bg-slate-900/80 p-2.5 rounded-xl border border-amber-500/30">
          Category: <span className="text-amber-400 uppercase font-extrabold">{CATEGORY_NAMES[category] || category}</span>
        </p>

        <p className="text-slate-300 text-xs font-semibold mb-4">
          Aapki konsi ticket par win hua hai? Ticket choose karein:
        </p>

        <div className="grid grid-cols-1 gap-3 mb-4">
          {Array.from({ length: ticketsCount }, (_, i) => (
            <button
              key={`claim-ticket-${i}`}
              onClick={() => onSelectTicket(i)}
              className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-rose-500 text-slate-950 font-black text-base md:text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <Ticket className="w-6 h-6 text-slate-950 fill-current" />
                <span>Ticket #{i + 1}</span>
              </div>
              <span className="text-xs bg-slate-950 text-amber-300 px-3 py-1 rounded-full font-bold border border-amber-400/40">
                Claim Now 🚀
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-white font-semibold underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
