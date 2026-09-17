import React, { useEffect, useState } from 'react';
import { Trophy, Sparkles, X } from 'lucide-react';
import { WinClaim } from '../types/game';
import { soundManager } from '../utils/audio';
import { Firecrackers } from './Firecrackers';

interface WinnerModalProps {
  claim: WinClaim | null;
  onClose: () => void;
}

const CATEGORY_NAMES: Record<string, string> = {
  earlyFive: 'Early 5 ⚡',
  topLine: 'Top Line ⬆️',
  middleLine: 'Middle Line ↔️',
  bottomLine: 'Bottom Line ⬇️',
  fullHouse: 'Full House / HOUSIE! 👑',
};

export const WinnerModal: React.FC<WinnerModalProps> = ({ claim, onClose }) => {
  const [showFirecrackers, setShowFirecrackers] = useState(false);

  useEffect(() => {
    if (claim) {
      soundManager.playWinFanfare();
      setShowFirecrackers(true);

      const timer = setTimeout(() => {
        setShowFirecrackers(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [claim]);

  if (!claim) return null;

  return (
    <>
      <Firecrackers active={showFirecrackers} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-pop-in">
        <div className="glass-panel-gold w-full max-w-md rounded-3xl p-6 md:p-8 border-2 border-amber-400 shadow-2xl relative text-center overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-amber-400/30 rounded-full blur-2xl pointer-events-none animate-pulse" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-amber-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-300 text-slate-950 mb-4 shadow-xl shadow-amber-500/50 animate-bounce">
            <Trophy className="w-10 h-10 fill-current" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-widest border border-amber-400/40 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 🎉 HOUSIE WINNER ANNOUNCEMENT!
          </div>

          <h2 className="text-3xl font-black text-white tracking-tight my-1">
            {claim.playerName}
          </h2>

          <p className="text-amber-200 font-bold text-lg mb-6">
            Won{' '}
            <span className="text-amber-400 font-black underline underline-offset-4">
              {CATEGORY_NAMES[claim.category] || claim.category}
            </span>{' '}
            (Ticket #{claim.ticketIndex + 1})
          </p>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 mb-6 text-xs text-slate-300 space-y-1">
            <div className="font-semibold text-slate-400">Validated by Server Engine</div>
            <div className="text-amber-300 font-mono">Timestamp: {new Date(claim.timestamp).toLocaleTimeString()}</div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black text-base shadow-lg hover:bg-amber-300 transition-all"
          >
            Continue Game 🚀
          </button>
        </div>
      </div>
    </>
  );
};
