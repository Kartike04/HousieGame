import React, { useState } from 'react';
import { Copy, Share2, Play, Users, Crown, Check, UserX, Clock, Settings } from 'lucide-react';
import { RoomState, Player } from '../types/game';

interface LobbyProps {
  roomState: RoomState;
  currentPlayer: Player;
  onStartGame: () => void;
  onKickPlayer: (playerId: string) => void;
  onChangeInterval: (interval: number) => void;
  onLeaveRoom: () => void;
}

export const Lobby: React.FC<LobbyProps> = ({
  roomState,
  currentPlayer,
  onStartGame,
  onKickPlayer,
  onChangeInterval,
  onLeaveRoom,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isHost = currentPlayer.isHost;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomState.roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShareLink = () => {
    const link = `${window.location.origin}?code=${roomState.roomCode}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-slate-950 text-slate-100">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* Header Header */}
        <div className="flex items-center justify-between glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎟️</span>
            <div>
              <h1 className="text-xl font-bold text-white">Housie Game Lobby</h1>
              <p className="text-xs text-slate-400">Share code with friends to join</p>
            </div>
          </div>
          <button
            onClick={onLeaveRoom}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Leave Room
          </button>
        </div>

        {/* Room Code Card */}
        <div className="glass-panel-gold p-6 md:p-8 rounded-3xl border border-amber-500/30 text-center relative overflow-hidden shadow-2xl">
          <div className="text-xs font-extrabold uppercase tracking-widest text-amber-400 mb-2">
            ROOM CODE
          </div>
          <div className="text-5xl md:text-6xl font-black tracking-widest text-white font-mono my-4 drop-shadow-md">
            {roomState.roomCode}
          </div>

          <p className="text-sm text-amber-200/80 mb-6">
            Share this 6-digit code with your friends to let them join.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm shadow-md hover:bg-amber-400 transition-colors"
            >
              {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? 'Code Copied!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleShareLink}
              className="flex items-center gap-2 px-5 py-3 rounded-xl glass-panel text-white font-bold text-sm hover:bg-slate-800 transition-colors border border-slate-700"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-amber-400" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Room'}</span>
            </button>
          </div>
        </div>

        {/* Host Control Options (Interval adjustment) */}
        {isHost && (
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Number Draw Speed</div>
                <div className="text-xs text-slate-400">Time between called numbers</div>
              </div>
            </div>
            <select
              value={roomState.drawInterval}
              onChange={(e) => onChangeInterval(Number(e.target.value))}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-amber-500"
            >
              <option value={5}>5 seconds</option>
              <option value={10}>10 seconds</option>
              <option value={15}>15 seconds</option>
              <option value={20}>20 seconds</option>
              <option value={30}>30 seconds</option>
            </select>
          </div>
        )}

        {/* Players Roster */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Connected Players</h2>
            </div>
            <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-semibold text-amber-400">
              {roomState.players.length} / {roomState.config.maxPlayers}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
            {roomState.players.map((player) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  player.id === currentPlayer.id
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      player.isConnected ? 'bg-emerald-500 shadow-sm shadow-emerald-500' : 'bg-rose-500'
                    }`}
                    title={player.isConnected ? 'Online' : 'Disconnected'}
                  />
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    {player.name}
                    {player.isHost && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                        <Crown className="w-3 h-3" /> Host
                      </span>
                    )}
                    {player.id === currentPlayer.id && (
                      <span className="text-xs text-slate-500">(You)</span>
                    )}
                  </div>
                </div>

                {isHost && !player.isHost && (
                  <button
                    onClick={() => onKickPlayer(player.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/50 transition-colors"
                    title="Remove Player"
                  >
                    <UserX className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Start Game / Waiting Banner */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-center">
          {isHost ? (
            <div className="space-y-4">
              <p className="text-sm font-medium text-slate-400">
                Ready to begin? When all your friends are in the lobby, hit Start Game!
              </p>
              <button
                onClick={onStartGame}
                disabled={roomState.players.length === 0}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-bold text-xl shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3"
              >
                <Play className="w-6 h-6 fill-current" />
                <span>🚀 START GAME</span>
              </button>
            </div>
          ) : (
            <div className="py-2 space-y-2">
              <div className="inline-block animate-spin text-2xl">⏳</div>
              <h3 className="text-lg font-bold text-amber-400">
                Waiting for host to start the game...
              </h3>
              <p className="text-xs text-slate-400">
                Get ready! Your Housie ticket has already been generated.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
