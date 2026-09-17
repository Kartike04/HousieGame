import React from 'react';
import { PlusCircle, LogIn, Users, ShieldCheck, Zap, Ticket } from 'lucide-react';

interface LandingPageProps {
  onCreateClick: () => void;
  onJoinClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onCreateClick, onJoinClick }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 md:p-8 relative overflow-hidden bg-radial-gradient">
      {/* Dynamic Background Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center my-auto z-10 py-12">
        {/* 3D Game Logo Display */}
        <div className="relative mb-6 group">
          <img
            src="/logo.jpg"
            alt="Housie Tambola Game Logo"
            className="w-28 h-28 md:w-36 md:h-36 rounded-3xl object-cover shadow-2xl border-2 border-amber-400/60 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 rounded-3xl bg-amber-400/20 blur-xl -z-10 animate-pulse" />
        </div>

        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel-gold text-amber-400 font-semibold text-sm mb-6 border border-amber-500/30 shadow-lg animate-pulse-glow">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Real-Time Multiplayer Experience</span>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-4 mb-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">
            HOUSIE TAMBOLA
          </h1>
          <p className="text-xl md:text-2xl font-medium text-slate-300">
            Play Tambola with Friends
          </p>
          <p className="max-w-lg mx-auto text-sm md:text-base text-slate-400 leading-relaxed">
            Create a private room, share the code with your friends, and play Housie together in real time on any device.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-12">
          <button
            onClick={onCreateClick}
            className="w-full sm:w-1/2 group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-bold text-lg shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <PlusCircle className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            <span>Create Room</span>
          </button>

          <button
            onClick={onJoinClick}
            className="w-full sm:w-1/2 group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl glass-panel hover:bg-slate-800/80 text-white font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-slate-700"
          >
            <LogIn className="w-6 h-6 text-amber-400 group-hover:translate-x-1 transition-transform duration-200" />
            <span>Join Room</span>
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Multiplayer Lobby</h3>
            <p className="text-sm text-slate-400">
              Host private rooms, share 6-character room codes, and sync players instantly.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-rose-500/40 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Authoritative Server</h3>
            <p className="text-sm text-slate-400">
              Fair play guaranteed. Server generates random numbers 1–90 and validates win claims automatically.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <Ticket className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Smart Housie Tickets</h3>
            <p className="text-sm text-slate-400">
              Auto-generated 3×9 tickets with 100% unique numbers per ticket and instant marking.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-xs text-slate-500 z-10 border-t border-slate-900">
        🎟️ Housie Tambola Real-Time &bull; Powered by Express, Socket.IO & React
      </footer>
    </div>
  );
};
