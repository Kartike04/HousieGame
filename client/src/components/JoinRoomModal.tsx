import React, { useState } from 'react';
import { X, LogIn, Hash, User } from 'lucide-react';

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (roomCode: string, playerName: string) => void;
  isLoading: boolean;
  initialRoomCode?: string;
}

export const JoinRoomModal: React.FC<JoinRoomModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialRoomCode = '',
}) => {
  const [roomCode, setRoomCode] = useState(initialRoomCode);
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = roomCode.trim().toUpperCase();
    const cleanName = playerName.trim();

    if (!cleanCode) {
      setError('Please enter the 6-character room code.');
      return;
    }
    if (cleanCode.length !== 6) {
      setError('Room code must be exactly 6 characters.');
      return;
    }
    if (!cleanName) {
      setError('Please enter your player name.');
      return;
    }

    setError('');
    onSubmit(cleanCode, cleanName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-pop-in">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-amber-500" />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎟️</span>
            <h2 className="text-2xl font-extrabold text-white">Join Housie Game</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Room Code */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-amber-400" />
              6-Digit Room Code *
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="e.g. H7K29P"
              maxLength={6}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xl tracking-widest uppercase placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all text-center font-bold"
              autoFocus
            />
          </div>

          {/* Player Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-400" />
              Your Player Name *
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="e.g. Rahul, Amit, Neha"
              maxLength={20}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-medium transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-rose-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Joining Room...</span>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Join Room</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
