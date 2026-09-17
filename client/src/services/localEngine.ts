import { RoomState, Player, RoomConfig, WinningCategory, WinClaim } from '../types/game';
import { generateUniquePlayerTickets } from '../utils/ticketGenerator';
import { validateWinClaim } from '../utils/winValidator';

type StateListener = (state: RoomState) => void;
type WinnerListener = (claim: WinClaim) => void;
type ToastListener = (data: { type: 'info' | 'success' | 'warning' | 'error'; message: string }) => void;
type DrawListener = (data: { number: number }) => void;

class LocalEngine {
  private roomState: RoomState | null = null;
  private stateListeners: Set<StateListener> = new Set();
  private winnerListeners: Set<WinnerListener> = new Set();
  private toastListeners: Set<ToastListener> = new Set();
  private drawListeners: Set<DrawListener> = new Set();
  private drawTimer: any = null;

  private generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  public onState(fn: StateListener) {
    this.stateListeners.add(fn);
    if (this.roomState) fn(this.roomState);
    return () => this.stateListeners.delete(fn);
  }

  public onWinner(fn: WinnerListener) {
    this.winnerListeners.add(fn);
    return () => this.winnerListeners.delete(fn);
  }

  public onToast(fn: ToastListener) {
    this.toastListeners.add(fn);
    return () => this.toastListeners.delete(fn);
  }

  public onDraw(fn: DrawListener) {
    this.drawListeners.add(fn);
    return () => this.drawListeners.delete(fn);
  }

  private notifyState() {
    if (!this.roomState) return;
    this.stateListeners.forEach((fn) => fn({ ...this.roomState! }));
  }

  private notifyToast(type: 'info' | 'success' | 'warning' | 'error', message: string) {
    this.toastListeners.forEach((fn) => fn({ type, message }));
  }

  public createRoom(hostName: string, config?: Partial<RoomConfig>): { success: boolean; roomCode: string; playerId: string; roomState?: RoomState } {
    const roomCode = this.generateRoomCode();
    const hostId = 'local_host_' + Math.random().toString(36).substring(2, 9);

    const defaultConfig: RoomConfig = {
      maxPlayers: 20,
      drawInterval: 10,
      ticketsPerPlayer: 2,
      winningPatterns: {
        earlyFive: true,
        topLine: true,
        middleLine: true,
        bottomLine: true,
        fullHouse: true,
      },
      ...config,
    };

    const hostTickets = generateUniquePlayerTickets(defaultConfig.ticketsPerPlayer);

    const hostPlayer: Player = {
      id: hostId,
      socketId: hostId,
      name: hostName,
      isHost: true,
      tickets: hostTickets,
      markedNumbers: [],
      claims: [],
      isConnected: true,
      lastActive: Date.now(),
    };

    const numbersPool = Array.from({ length: 90 }, (_, i) => i + 1);
    for (let i = numbersPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbersPool[i], numbersPool[j]] = [numbersPool[j], numbersPool[i]];
    }

    this.roomState = {
      roomCode,
      hostId,
      players: [hostPlayer],
      gameStatus: 'LOBBY',
      currentNumber: null,
      calledNumbers: [],
      remainingNumbers: numbersPool,
      nextDrawAt: null,
      drawInterval: defaultConfig.drawInterval,
      winners: [],
      config: defaultConfig,
      createdAt: Date.now(),
    };

    this.notifyState();
    return { success: true, roomCode, playerId: hostId, roomState: this.roomState };
  }

  public joinRoom(roomCode: string, playerName: string): { success: boolean; roomState?: RoomState; playerId?: string; error?: string } {
    if (!this.roomState || this.roomState.roomCode !== roomCode.trim().toUpperCase()) {
      // Create a fresh room automatically if joining locally!
      const res = this.createRoom(playerName);
      return { success: true, roomState: this.roomState!, playerId: res.playerId };
    }

    const playerId = 'local_player_' + Math.random().toString(36).substring(2, 9);
    const playerTickets = generateUniquePlayerTickets(this.roomState.config.ticketsPerPlayer);

    const newPlayer: Player = {
      id: playerId,
      socketId: playerId,
      name: playerName,
      isHost: false,
      tickets: playerTickets,
      markedNumbers: [],
      claims: [],
      isConnected: true,
      lastActive: Date.now(),
    };

    this.roomState.players.push(newPlayer);
    this.notifyState();
    return { success: true, roomState: this.roomState, playerId };
  }

  public startGame() {
    if (!this.roomState) return;
    this.roomState.gameStatus = 'PLAYING';
    this.notifyState();
    this.startAutoDraw();
  }

  public pauseGame() {
    if (!this.roomState) return;
    this.roomState.gameStatus = 'PAUSED';
    if (this.drawTimer) clearInterval(this.drawTimer);
    this.notifyState();
  }

  public resumeGame() {
    if (!this.roomState) return;
    this.roomState.gameStatus = 'PLAYING';
    this.notifyState();
    this.startAutoDraw();
  }

  public drawNextNumber(): number | null {
    if (!this.roomState || this.roomState.remainingNumbers.length === 0) return null;

    const nextNum = this.roomState.remainingNumbers.pop()!;
    this.roomState.calledNumbers.push(nextNum);
    this.roomState.currentNumber = nextNum;

    if (this.roomState.remainingNumbers.length === 0) {
      this.roomState.gameStatus = 'FINISHED';
      if (this.drawTimer) clearInterval(this.drawTimer);
    }

    this.drawListeners.forEach((fn) => fn({ number: nextNum }));
    this.notifyState();
    return nextNum;
  }

  private startAutoDraw() {
    if (this.drawTimer) clearInterval(this.drawTimer);
    const intervalMs = (this.roomState?.drawInterval || 10) * 1000;

    this.drawTimer = setInterval(() => {
      if (this.roomState && this.roomState.gameStatus === 'PLAYING') {
        this.drawNextNumber();
      }
    }, intervalMs);
  }

  public claimWin(playerId: string, category: WinningCategory, ticketIndex: number = 0): { success: boolean; message: string } {
    if (!this.roomState) return { success: false, message: 'Room not found.' };

    const player = this.roomState.players.find((p) => p.id === playerId);
    if (!player) return { success: false, message: 'Player not found.' };

    if (player.claims.includes(category)) {
      return { success: false, message: 'You have already claimed this prize!' };
    }

    const calledSet = new Set(this.roomState.calledNumbers);
    const validation = validateWinClaim(player.tickets, calledSet, category, ticketIndex);

    if (validation.valid) {
      player.claims.push(category);

      const winClaim: WinClaim = {
        id: Math.random().toString(36).substring(2, 9),
        playerId: player.id,
        playerName: player.name,
        category,
        timestamp: Date.now(),
        ticketIndex: validation.ticketIndex || 0,
        ticket: validation.winningTicket || player.tickets[0],
      };

      this.roomState.winners.push(winClaim);
      this.winnerListeners.forEach((fn) => fn(winClaim));
      this.notifyState();
      return { success: true, message: `🎉 ${category.toUpperCase()} claimed by ${player.name}!` };
    } else {
      const memes = [
        `Bahut jaldi hai aapko! ${validation.reason || ''}`,
        `Cheating karta hai tu! ${validation.reason || ''}`,
        `Arey bhai bhai bhai! ${validation.reason || ''}`,
      ];
      const randomMeme = memes[Math.floor(Math.random() * memes.length)];
      return { success: false, message: randomMeme };
    }
  }

  public markNumber(playerId: string, num: number) {
    if (!this.roomState) return;
    const player = this.roomState.players.find((p) => p.id === playerId);
    if (player && !player.markedNumbers.includes(num)) {
      player.markedNumbers.push(num);
      this.notifyState();
    }
  }

  public leaveRoom() {
    if (this.drawTimer) clearInterval(this.drawTimer);
    this.roomState = null;
  }
}

export const localEngine = new LocalEngine();
