import React from 'react';
import { Trophy, RotateCcw, Users, Award, Crown } from 'lucide-react';
import { RoomState, Player } from '../types/game';

interface ResultsScreenProps {
  roomState: RoomState;
  currentPlayer: Player;
  onPlayAgain: () => void;
  onLeaveRoom: () => void;
}

const CATEGORY_NAMES: Record<string, string> = {
  earlyFive: 'Early 5',
  topLine: 'Top Line',
  middleLine: 'Middle Line',
  bottomLine: 'Bottom Line',
  fourCorners: 'Four Corners',
  fullHouse: 'Full House',
};

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  roomState,
  currentPlayer,
  onPlayAgain,
  onLeaveRoom,
}) => {
  const isHost = currentPlayer.isHost;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-slate-950 text-slate-100">
      <div className="w-full max-w-2xl mx-auto space-y-6 animate-pop-in">
        {/* Game Over Banner */}
        <div className="glass-panel-gold p-8 rounded-3xl border border-amber-500/40 text-center relative overflow-hidden shadow-2xl">
          <div className="text-6xl mb-3">🎉</div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-amber-400 via-rose-400 to-yellow-300 bg-clip-text text-transparent">
            GAME OVER
          </h1>
          <p className="text-amber-200/80 text-sm mt-2">
            All 90 numbers called or Full House claimed! Here are the room results:
          </p>
        </div>

        {/* Winners Leaderboard */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-extrabold text-white">Winners Hall of Fame</h2>
          </div>

          {roomState.winners.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-500 italic">
              No claims were made in this game.
            </div>
          ) : (
            <div className="space-y-3">
              {roomState.winners.map((winner) => (
                <div
                  key={winner.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-white text-base">{winner.playerName}</div>
                      <div className="text-xs text-amber-400 font-semibold">
                        🏆 {CATEGORY_NAMES[winner.category] || winner.category}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 font-mono">
                    {new Date(winner.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Player Roster Summary */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <h2 className="text-base font-bold text-white">Participants ({roomState.players.length})</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-semibold">
            {roomState.players.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between text-slate-300"
              >
                <span>{p.name}</span>
                {p.isHost && <Crown className="w-3.5 h-3.5 text-amber-400" />}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {isHost ? (
            <button
              onClick={onPlayAgain}
              className="w-full sm:w-2/3 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-bold text-lg shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>🔄 Play Again (Reset Room)</span>
            </button>
          ) : (
            <div className="w-full sm:w-2/3 p-4 rounded-2xl glass-panel text-center text-sm font-semibold text-amber-300">
              Waiting for host to click Play Again...
            </div>
          )}

          <button
            onClick={onLeaveRoom}
            className="w-full sm:w-1/3 py-4 rounded-2xl glass-panel text-slate-300 hover:text-white font-bold text-sm border border-slate-700 hover:bg-slate-800 transition-colors"
          >
            Leave Game
          </button>
        </div>
      </div>
    </div>
  );
};
