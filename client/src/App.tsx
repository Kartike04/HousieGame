import React, { useEffect, useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { CreateRoomModal } from './components/CreateRoomModal';
import { JoinRoomModal } from './components/JoinRoomModal';
import { Lobby } from './components/Lobby';
import { MainGame } from './components/MainGame';
import { ResultsScreen } from './components/ResultsScreen';
import { ToastContainer } from './components/Toast';
import { BogusMemeModal } from './components/BogusMemeModal';
import {
  socket,
  createRoomSocket,
  joinRoomSocket,
  reconnectPlayerSocket,
  claimWinSocket,
  getSession,
  clearSession,
} from './services/socket';
import { RoomState, WinClaim, ToastNotice, WinningCategory, RoomConfig } from './types/game';
import { soundManager } from './utils/audio';

export const App: React.FC = () => {
  const [view, setView] = useState<'LANDING' | 'GAME'>('LANDING');
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [initialJoinCode, setInitialJoinCode] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [activeWinnerClaim, setActiveWinnerClaim] = useState<WinClaim | null>(null);
  const [bogusMemeMessage, setBogusMemeMessage] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastNotice[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const addToast = (type: 'info' | 'success' | 'warning' | 'error', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auto session reconnect & Socket listener setup
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('code');
    if (codeParam) {
      setInitialJoinCode(codeParam.toUpperCase());
      setIsJoinModalOpen(true);
    }

    const handleConnect = () => {
      const session = getSession();
      if (session) {
        reconnectPlayerSocket(session.roomCode, session.playerId).then((res) => {
          if (res.success && res.roomState && res.player) {
            setRoomState(res.roomState);
            setCurrentPlayerId(res.player.id);
            setView('GAME');
          } else {
            clearSession();
          }
        });
      }
    };

    socket.on('connect', handleConnect);
    handleConnect();

    return () => {
      socket.off('connect', handleConnect);
    };
  }, []);

  // Real-time socket events
  useEffect(() => {
    socket.on('room_state_updated', (updatedState: RoomState) => {
      setRoomState(updatedState);
    });

    socket.on('number_drawn', (data) => {
      soundManager.playDrawSound();
      soundManager.announceNumber(data.number);
    });

    socket.on('winner_announced', (claim: WinClaim) => {
      setActiveWinnerClaim(claim);
    });

    socket.on('toast_message', (data) => {
      addToast(data.type, data.message);
    });

    socket.on('kicked', () => {
      clearSession();
      setRoomState(null);
      setCurrentPlayerId(null);
      setView('LANDING');
      addToast('error', 'You were removed from the room by the host.');
    });

    return () => {
      socket.off('room_state_updated');
      socket.off('number_drawn');
      socket.off('winner_announced');
      socket.off('toast_message');
      socket.off('kicked');
    };
  }, []);

  // Action Handlers
  const handleCreateRoom = async (hostName: string, config: Partial<RoomConfig>) => {
    setIsLoading(true);
    const res = await createRoomSocket(hostName, config);
    setIsLoading(false);

    if (res.success && res.roomCode && res.playerId) {
      setCurrentPlayerId(res.playerId);
      setIsCreateModalOpen(false);
      setView('GAME');
      addToast('success', `Room created! Room Code: ${res.roomCode}`);
    } else {
      addToast('error', res.error || 'Failed to create room.');
    }
  };

  const handleJoinRoom = async (roomCode: string, playerName: string) => {
    setIsLoading(true);
    const res = await joinRoomSocket(roomCode, playerName);
    setIsLoading(false);

    if (res.success && res.playerId && res.roomState) {
      setCurrentPlayerId(res.playerId);
      setRoomState(res.roomState);
      setIsJoinModalOpen(false);
      setView('GAME');
      addToast('success', `Joined room ${roomCode}`);
    } else {
      addToast('error', res.error || 'Failed to join room.');
    }
  };

  const handleStartGame = () => {
    socket.emit('start_game');
  };

  const handlePauseGame = () => {
    socket.emit('pause_game');
  };

  const handleResumeGame = () => {
    socket.emit('resume_game');
  };

  const handleDrawManual = () => {
    socket.emit('draw_next_manual');
  };

  const handleChangeInterval = (newInterval: number) => {
    socket.emit('change_interval', newInterval);
  };

  const handleEndGame = () => {
    socket.emit('end_game');
  };

  const handlePlayAgain = () => {
    socket.emit('play_again');
  };

  const handleLeaveRoom = () => {
    socket.emit('leave_room');
    clearSession();
    setRoomState(null);
    setCurrentPlayerId(null);
    setView('LANDING');
    addToast('info', 'You left the room.');
  };

  const handleKickPlayer = (targetPlayerId: string) => {
    socket.emit('kick_player', targetPlayerId);
  };

  const handleMarkNumber = (num: number) => {
    socket.emit('mark_number', { number: num });
  };

  const handleInvalidMarkAttempt = (num: number) => {
    addToast('warning', `Number ${num} has not been called yet!`);
  };

  const handleClaimWin = async (category: WinningCategory, ticketIndex?: number) => {
    setIsClaiming(true);
    const res = await claimWinSocket(category, ticketIndex);
    setIsClaiming(false);

    if (res.success) {
      addToast('success', res.message);
    } else {
      setBogusMemeMessage(res.message);
    }
  };

  const handleToggleSound = () => {
    const newState = soundManager.toggleSound();
    setSoundEnabled(newState);
    addToast('info', newState ? 'Sound enabled' : 'Sound muted');
  };

  const currentPlayer = roomState?.players.find((p) => p.id === currentPlayerId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
      {view === 'LANDING' || !roomState || !currentPlayer ? (
        <LandingPage
          onCreateClick={() => setIsCreateModalOpen(true)}
          onJoinClick={() => setIsJoinModalOpen(true)}
        />
      ) : roomState.gameStatus === 'LOBBY' ? (
        <Lobby
          roomState={roomState}
          currentPlayer={currentPlayer}
          onStartGame={handleStartGame}
          onKickPlayer={handleKickPlayer}
          onChangeInterval={handleChangeInterval}
          onLeaveRoom={handleLeaveRoom}
        />
      ) : roomState.gameStatus === 'FINISHED' ? (
        <ResultsScreen
          roomState={roomState}
          currentPlayer={currentPlayer}
          onPlayAgain={handlePlayAgain}
          onLeaveRoom={handleLeaveRoom}
        />
      ) : (
        <MainGame
          roomState={roomState}
          currentPlayer={currentPlayer}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onPauseGame={handlePauseGame}
          onResumeGame={handleResumeGame}
          onDrawManual={handleDrawManual}
          onEndGame={handleEndGame}
          onMarkNumber={handleMarkNumber}
          onInvalidMarkAttempt={handleInvalidMarkAttempt}
          onClaimWin={handleClaimWin}
          isClaiming={isClaiming}
          activeWinnerClaim={activeWinnerClaim}
          onCloseWinnerModal={() => setActiveWinnerClaim(null)}
        />
      )}

      {/* Modals */}
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateRoom}
        isLoading={isLoading}
      />

      <JoinRoomModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onSubmit={handleJoinRoom}
        isLoading={isLoading}
        initialRoomCode={initialJoinCode}
      />

      {/* Meme Bogus Claim Modal */}
      <BogusMemeModal
        isOpen={!!bogusMemeMessage}
        message={bogusMemeMessage || ''}
        onClose={() => setBogusMemeMessage(null)}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
