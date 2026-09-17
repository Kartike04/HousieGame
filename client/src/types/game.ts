export type GameStatus = 'LOBBY' | 'PLAYING' | 'PAUSED' | 'FINISHED';

export type WinningCategory = 
  | 'earlyFive' 
  | 'topLine' 
  | 'middleLine' 
  | 'bottomLine' 
  | 'fullHouse';

export interface WinningPatternsConfig {
  earlyFive: boolean;
  topLine: boolean;
  middleLine: boolean;
  bottomLine: boolean;
  fullHouse: boolean;
}

export interface RoomConfig {
  maxPlayers: number;
  drawInterval: number; // in seconds
  ticketsPerPlayer: number; // 1 or 2 tickets
  winningPatterns: WinningPatternsConfig;
}

export interface Player {
  id: string;
  socketId: string;
  name: string;
  isHost: boolean;
  tickets: (number | null)[][][]; // Array of 3x9 tickets (1 or 2)
  markedNumbers: number[];
  claims: WinningCategory[];
  isConnected: boolean;
  lastActive: number;
}

export interface WinClaim {
  id: string;
  playerId: string;
  playerName: string;
  category: WinningCategory;
  timestamp: number;
  ticketIndex: number;
  ticket: (number | null)[][];
}

export interface RoomState {
  roomCode: string;
  hostId: string;
  players: Player[];
  gameStatus: GameStatus;
  currentNumber: number | null;
  calledNumbers: number[];
  remainingNumbers: number[];
  nextDrawAt: number | null;
  drawInterval: number;
  winners: WinClaim[];
  config: RoomConfig;
  createdAt: number;
}

export interface ToastNotice {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}
