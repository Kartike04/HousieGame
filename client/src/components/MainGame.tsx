import React from 'react';
import { Header } from './Header';
import { CurrentNumberDisplay } from './CurrentNumberDisplay';
import { TicketDisplay } from './TicketDisplay';
import { WinClaimsPanel } from './WinClaimsPanel';
import { BoardDisplay } from './BoardDisplay';
import { WinnerModal } from './WinnerModal';
import { RoomState, Player, WinClaim, WinningCategory } from '../types/game';

interface MainGameProps {
  roomState: RoomState;
  currentPlayer: Player;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onPauseGame: () => void;
  onResumeGame: () => void;
  onDrawManual: () => void;
  onEndGame: () => void;
  onMarkNumber: (num: number) => void;
  onInvalidMarkAttempt: (num: number) => void;
  onClaimWin: (category: WinningCategory, ticketIndex?: number) => void;
  isClaiming: boolean;
  activeWinnerClaim: WinClaim | null;
  onCloseWinnerModal: () => void;
}

export const MainGame: React.FC<MainGameProps> = ({
  roomState,
  currentPlayer,
  soundEnabled,
  onToggleSound,
  onPauseGame,
  onResumeGame,
  onDrawManual,
  onEndGame,
  onMarkNumber,
  onInvalidMarkAttempt,
  onClaimWin,
  isClaiming,
  activeWinnerClaim,
  onCloseWinnerModal,
}) => {
  const isHost = currentPlayer.isHost;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 pb-12">
      {/* Header Toolbar */}
      <Header
        roomState={roomState}
        currentPlayer={currentPlayer}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        onPauseGame={onPauseGame}
        onResumeGame={onResumeGame}
        onDrawManual={onDrawManual}
        onEndGame={onEndGame}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-6 space-y-6 flex-1">
        {/* Top: Current Number & Countdown & History */}
        <CurrentNumberDisplay
          currentNumber={roomState.currentNumber}
          calledNumbers={roomState.calledNumbers}
          nextDrawAt={roomState.nextDrawAt}
          drawInterval={roomState.drawInterval}
          gameStatus={roomState.gameStatus}
        />

        {/* Dynamic Grid Layout */}
        {isHost ? (
          /* Host View: 7 Cols for Tickets + Win Claims, 5 Cols for 1-90 Board */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-6">
              <TicketDisplay
                tickets={currentPlayer.tickets}
                markedNumbers={currentPlayer.markedNumbers}
                calledNumbers={roomState.calledNumbers}
                onMarkNumber={onMarkNumber}
                onInvalidMarkAttempt={onInvalidMarkAttempt}
                playerName={currentPlayer.name}
              />

              <WinClaimsPanel
                winningPatterns={roomState.config.winningPatterns}
                winners={roomState.winners}
                ticketsCount={currentPlayer.tickets.length}
                onClaimWin={onClaimWin}
                isClaiming={isClaiming}
              />
            </div>

            <div className="lg:col-span-5">
              <div className="mb-2 text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                👑 Host Master Board (1–90)
              </div>
              <BoardDisplay
                calledNumbers={roomState.calledNumbers}
                currentNumber={roomState.currentNumber}
              />
            </div>
          </div>
        ) : (
          /* Normal Joined Player View: 1-90 Board is hidden! Tickets & Claims take full width */
          <div className="max-w-4xl mx-auto space-y-6">
            <TicketDisplay
              tickets={currentPlayer.tickets}
              markedNumbers={currentPlayer.markedNumbers}
              calledNumbers={roomState.calledNumbers}
              onMarkNumber={onMarkNumber}
              onInvalidMarkAttempt={onInvalidMarkAttempt}
              playerName={currentPlayer.name}
            />

            <WinClaimsPanel
              winningPatterns={roomState.config.winningPatterns}
              winners={roomState.winners}
              ticketsCount={currentPlayer.tickets.length}
              onClaimWin={onClaimWin}
              isClaiming={isClaiming}
            />
          </div>
        )}
      </main>

      {/* Winner Modal popup */}
      <WinnerModal claim={activeWinnerClaim} onClose={onCloseWinnerModal} />
    </div>
  );
};
