import React, { useEffect, useState } from 'react';
import { X, Volume2, Film, Flame } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface BogusMemeModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export const BogusMemeModal: React.FC<BogusMemeModalProps> = ({
  isOpen,
  message,
  onClose,
}) => {
  const [currentMemeTag, setCurrentMemeTag] = useState<string>('BOGUS CLAIM!');
  const [currentMemeSpeech, setCurrentMemeSpeech] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const meme = soundManager.playReelsMemeSound();
      if (meme) {
        setCurrentMemeTag(meme.tag);
        setCurrentMemeSpeech(meme.speech);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleReplayAudio = () => {
    soundManager.playReelsMemeSound();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-pop-in">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 md:p-8 border-2 border-rose-500 shadow-2xl relative text-center overflow-hidden animate-bounce-short">
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-purple-600" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-rose-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Viral Reel Meme Header */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 via-rose-500 to-amber-400 text-white mb-3 shadow-xl shadow-rose-950 animate-pulse">
          <Film className="w-10 h-10" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-black uppercase tracking-widest border border-rose-500/40 mb-3">
          <Flame className="w-3.5 h-3.5 text-amber-400" /> 🎬 INSTAGRAM REEL MEME AUDIO!
        </div>

        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight my-1 uppercase">
          {currentMemeTag || 'BOGUS CLAIM!'}
        </h2>

        <p className="text-amber-300 font-extrabold text-base md:text-lg mb-4 bg-rose-950/60 p-3.5 rounded-2xl border border-rose-500/30 shadow-inner">
          "{currentMemeSpeech || 'Jaldi 5 Nahi Hua Hai Boss! 😂'}"
        </p>

        <p className="text-slate-300 text-xs md:text-sm font-medium leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleReplayAudio}
            className="w-full py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-amber-300 font-bold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>Replay Meme Audio 🔊</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-black text-base shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            Aage Se Dhyan Rakhunga Boss! 🙏
          </button>
        </div>
      </div>
    </div>
  );
};
