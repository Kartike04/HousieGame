import React, { useState } from 'react';
import { X, Clock, Users, Trophy, Play, Ticket } from 'lucide-react';
import { RoomConfig, WinningPatternsConfig } from '../types/game';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (hostName: string, config: Partial<RoomConfig>) => void;
  isLoading: boolean;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [hostName, setHostName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(20);
  const [drawInterval, setDrawInterval] = useState(10);
  const [ticketsPerPlayer, setTicketsPerPlayer] = useState(2); // 1 or 2 tickets!
  const [winningPatterns, setWinningPatterns] = useState<WinningPatternsConfig>({
    earlyFive: true,
    topLine: true,
    middleLine: true,
    bottomLine: true,
    fullHouse: true,
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostName.trim()) {
      setError('Please enter your name.');
      return;
    }
    setError('');
    onSubmit(hostName.trim(), {
      maxPlayers,
      drawInterval,
      ticketsPerPlayer,
      winningPatterns,
    });
  };

  const togglePattern = (pattern: keyof WinningPatternsConfig) => {
    setWinningPatterns((prev) => ({
      ...prev,
      [pattern]: !prev[pattern],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-pop-in">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500" />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👑</span>
            <h2 className="text-2xl font-extrabold text-white">Create Housie Room</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Host Name Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Your Name (Host) *
            </label>
            <input
              type="text"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              placeholder="e.g. Rahul, Priya, Alex"
              maxLength={20}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-medium transition-all"
              autoFocus
            />
          </div>

          {/* Tickets Per Player Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-amber-400" />
              Tickets Per Player
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTicketsPerPlayer(1)}
                className={`py-3 px-4 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  ticketsPerPlayer === 1
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <span>🎟️ 1 Ticket</span>
              </button>
              <button
                type="button"
                onClick={() => setTicketsPerPlayer(2)}
                className={`py-3 px-4 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  ticketsPerPlayer === 2
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md ring-2 ring-amber-500/30'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                <span>🎟️🎟️ 2 Tickets (Recommended)</span>
              </button>
            </div>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Draw Interval */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Draw Interval
              </label>
              <select
                value={drawInterval}
                onChange={(e) => setDrawInterval(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500 transition-all font-medium"
              >
                <option value={5}>5 seconds (Fast)</option>
                <option value={10}>10 seconds (Standard)</option>
                <option value={15}>15 seconds (Relaxed)</option>
                <option value={20}>20 seconds</option>
                <option value={30}>30 seconds</option>
              </select>
            </div>

            {/* Max Players */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-rose-400" />
                Max Players
              </label>
              <select
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500 transition-all font-medium"
              >
                <option value={10}>10 Players</option>
                <option value={20}>20 Players</option>
                <option value={50}>50 Players</option>
                <option value={100}>100 Players</option>
              </select>
            </div>
          </div>

          {/* Enabled Winning Rules */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-purple-400" />
              Winning Rules Enabled
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'earlyFive', label: 'Early 5' },
                { id: 'topLine', label: 'Top Line' },
                { id: 'middleLine', label: 'Middle Line' },
                { id: 'bottomLine', label: 'Bottom Line' },
                { id: 'fullHouse', label: 'Full House' },
              ].map((pattern) => {
                const key = pattern.id as keyof WinningPatternsConfig;
                const isChecked = winningPatterns[key];
                return (
                  <button
                    type="button"
                    key={pattern.id}
                    onClick={() => togglePattern(key)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isChecked
                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 font-semibold'
                        : 'bg-slate-900/50 border-slate-800 text-slate-500'
                    }`}
                  >
                    <span>{pattern.label}</span>
                    <span className={`w-2 h-2 rounded-full ${isChecked ? 'bg-amber-400' : 'bg-slate-700'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-bold text-lg shadow-lg hover:shadow-amber-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Creating Room...</span>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Create Room</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
