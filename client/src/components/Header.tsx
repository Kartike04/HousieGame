import React from 'react';
import { Volume2, VolumeX, Users, Pause, Play, RotateCcw, StopCircle, FastForward } from 'lucide-react';
import { RoomState, Player } from '../types/game';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  roomState: RoomState;
  currentPlayer: Player;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onPauseGame: () => void;
  onResumeGame: () => void;
  onDrawManual: () => void;
  onEndGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  roomState,
  currentPlayer,
  soundEnabled,
  onToggleSound,
  onPauseGame,
  onResumeGame,
  onDrawManual,
  onEndGame,
}) => {
  const isHost = currentPlayer.isHost;
  const isPaused = roomState.gameStatus === 'PAUSED';

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 py-3 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Room Code */}
        <div className="flex items-center gap-3">
          <span className="text-3xl filter drop-shadow">🎟️</span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
                HOUSIE
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                {roomState.roomCode}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-400" />
                {roomState.players.length} Players
              </span>
              <span>&bull;</span>
              <span
                className={`inline-flex items-center gap-1 font-bold ${
                  roomState.gameStatus === 'PLAYING'
                    ? 'text-emerald-400'
                    : roomState.gameStatus === 'PAUSED'
                    ? 'text-amber-400'
                    : 'text-slate-400'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    roomState.gameStatus === 'PLAYING'
                      ? 'bg-emerald-500 animate-pulse'
                      : roomState.gameStatus === 'PAUSED'
                      ? 'bg-amber-500'
                      : 'bg-slate-500'
                  }`}
                />
                {roomState.gameStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Host Control Toolbar & Sound Toggle */}
        <div className="flex items-center gap-2">
          {isHost && (
            <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
              {roomState.gameStatus === 'PLAYING' ? (
                <button
                  onClick={onPauseGame}
                  className="p-2 rounded-lg text-amber-400 hover:bg-amber-500/20 transition-colors"
                  title="Pause Game"
                >
                  <Pause className="w-4 h-4 fill-current" />
                </button>
              ) : (
                <button
                  onClick={onResumeGame}
                  className="p-2 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                  title="Resume Game"
                >
                  <Play className="w-4 h-4 fill-current" />
                </button>
              )}

              {isPaused && (
                <button
                  onClick={onDrawManual}
                  className="p-2 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                  title="Draw Next Number Manually"
                >
                  <FastForward className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onEndGame}
                className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
                title="End Game"
              >
                <StopCircle className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Mute/Unmute sound button */}
          <button
            onClick={onToggleSound}
            className={`p-2.5 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title={soundEnabled ? 'Mute Sound' : 'Unmute Sound'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
