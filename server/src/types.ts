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
  drawInterval: number; // in seconds (5, 10, 15, 20, 30)
  ticketsPerPlayer: number; // 1 or 2
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
  ticketIndex: number; // 0 for Ticket #1, 1 for Ticket #2
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

export interface ClientToServerEvents {
  create_room: (data: { hostName: string; config?: Partial<RoomConfig> }, callback: (res: { success: boolean; roomCode?: string; playerId?: string; error?: string }) => void) => void;
  join_room: (data: { roomCode: string; playerName: string }, callback: (res: { success: boolean; roomState?: RoomState; playerId?: string; error?: string }) => void) => void;
  reconnect_player: (data: { roomCode: string; playerId: string }, callback: (res: { success: boolean; roomState?: RoomState; player?: Player; error?: string }) => void) => void;
  start_game: () => void;
  pause_game: () => void;
  resume_game: () => void;
  draw_next_manual: () => void;
  change_interval: (newInterval: number) => void;
  mark_number: (data: { number: number }) => void;
  claim_win: (data: { category: WinningCategory; ticketIndex?: number }, callback: (res: { success: boolean; message: string }) => void) => void;
  kick_player: (targetPlayerId: string) => void;
  end_game: () => void;
  play_again: () => void;
  leave_room: () => void;
}

export interface ServerToClientEvents {
  room_state_updated: (state: RoomState) => void;
  number_drawn: (data: { number: number; calledNumbers: number[]; remainingCount: number; nextDrawAt: number }) => void;
  winner_announced: (claim: WinClaim) => void;
  claim_rejected: (data: { category: WinningCategory; reason: string }) => void;
  game_status_changed: (status: GameStatus) => void;
  toast_message: (data: { type: 'info' | 'success' | 'warning' | 'error'; message: string }) => void;
  kicked: () => void;
}
