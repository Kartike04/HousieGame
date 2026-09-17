import { Server } from 'socket.io';
import { generateUniquePlayerTickets } from './utils/ticketGenerator';
import { validateWinClaim } from './utils/winValidator';
import {
  RoomState,
  Player,
  RoomConfig,
  WinningCategory,
  ClientToServerEvents,
  ServerToClientEvents,
  WinClaim,
} from './types';

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function generatePlayerId(): string {
  return 'ply_' + Math.random().toString(36).substr(2, 9);
}

function generateClaimId(): string {
  return 'clm_' + Math.random().toString(36).substr(2, 9);
}

export class GameEngine {
  private rooms: Map<string, RoomState> = new Map();
  private io: Server<ClientToServerEvents, ServerToClientEvents>;
  private timerHandle: NodeJS.Timeout | null = null;

  constructor(io: Server<ClientToServerEvents, ServerToClientEvents>) {
    this.io = io;
    this.startGlobalTimer();
  }

  private startGlobalTimer() {
    this.timerHandle = setInterval(() => {
      const now = Date.now();
      this.rooms.forEach((room) => {
        if (
          room.gameStatus === 'PLAYING' &&
          room.nextDrawAt !== null &&
          now >= room.nextDrawAt
        ) {
          this.drawNextNumber(room.roomCode);
        }
      });
    }, 500);
  }

  public createRoom(
    socketId: string,
    hostName: string,
    customConfig?: Partial<RoomConfig>
  ): { success: boolean; roomCode?: string; playerId?: string; error?: string } {
    const trimmedName = hostName.trim();
    if (!trimmedName) {
      return { success: false, error: 'Host name is required.' };
    }

    let roomCode = generateRoomCode();
    while (this.rooms.has(roomCode)) {
      roomCode = generateRoomCode();
    }

    const hostPlayerId = generatePlayerId();
    const ticketsPerPlayer = customConfig?.ticketsPerPlayer ?? 2;

    const config: RoomConfig = {
      maxPlayers: customConfig?.maxPlayers ?? 20,
      drawInterval: customConfig?.drawInterval ?? 10,
      ticketsPerPlayer,
      winningPatterns: customConfig?.winningPatterns ?? {
        earlyFive: true,
        topLine: true,
        middleLine: true,
        bottomLine: true,
        fullHouse: true,
      },
    };

    const hostPlayer: Player = {
      id: hostPlayerId,
      socketId,
      name: trimmedName,
      isHost: true,
      tickets: generateUniquePlayerTickets(config.ticketsPerPlayer),
      markedNumbers: [],
      claims: [],
      isConnected: true,
      lastActive: Date.now(),
    };

    const roomState: RoomState = {
      roomCode,
      hostId: hostPlayerId,
      players: [hostPlayer],
      gameStatus: 'LOBBY',
      currentNumber: null,
      calledNumbers: [],
      remainingNumbers: [],
      nextDrawAt: null,
      drawInterval: config.drawInterval,
      winners: [],
      config,
      createdAt: Date.now(),
    };

    this.rooms.set(roomCode, roomState);
    return { success: true, roomCode, playerId: hostPlayerId };
  }

  public joinRoom(
    socketId: string,
    roomCode: string,
    playerName: string
  ): { success: boolean; roomState?: RoomState; playerId?: string; error?: string } {
    const cleanCode = roomCode.trim().toUpperCase();
    const cleanName = playerName.trim();

    if (!cleanCode || !cleanName) {
      return { success: false, error: 'Room code and player name are required.' };
    }

    const room = this.rooms.get(cleanCode);
    if (!room) {
      return { success: false, error: 'Room not found. Please check the room code.' };
    }

    if (room.gameStatus !== 'LOBBY') {
      return { success: false, error: 'This game has already started.' };
    }

    if (room.players.length >= room.config.maxPlayers) {
      return { success: false, error: 'This room is full.' };
    }

    const existingName = room.players.find(
      (p) => p.name.toLowerCase() === cleanName.toLowerCase()
    );
    if (existingName) {
      return {
        success: false,
        error: 'This name is already taken in the room. Please choose another.',
      };
    }

    const playerId = generatePlayerId();
    const newPlayer: Player = {
      id: playerId,
      socketId,
      name: cleanName,
      isHost: false,
      tickets: generateUniquePlayerTickets(room.config.ticketsPerPlayer),
      markedNumbers: [],
      claims: [],
      isConnected: true,
      lastActive: Date.now(),
    };

    room.players.push(newPlayer);
    this.broadcastRoomState(cleanCode);

    return { success: true, roomState: room, playerId };
  }

  public reconnectPlayer(
    socketId: string,
    roomCode: string,
    playerId: string
  ): { success: boolean; roomState?: RoomState; player?: Player; error?: string } {
    const cleanCode = roomCode.trim().toUpperCase();
    const room = this.rooms.get(cleanCode);

    if (!room) {
      return { success: false, error: 'Room no longer exists.' };
    }

    const player = room.players.find((p) => p.id === playerId);
    if (!player) {
      return { success: false, error: 'Player not found in this room.' };
    }

    player.socketId = socketId;
    player.isConnected = true;
    player.lastActive = Date.now();

    this.broadcastRoomState(cleanCode);
    return { success: true, roomState: room, player };
  }

  public startGame(roomCode: string, playerId: string): boolean {
    const room = this.rooms.get(roomCode);
    if (!room || room.hostId !== playerId || room.gameStatus !== 'LOBBY') {
      return false;
    }

    const numbers: number[] = [];
    for (let i = 1; i <= 90; i++) numbers.push(i);
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    room.remainingNumbers = numbers;
    room.calledNumbers = [];
    room.currentNumber = null;
    room.gameStatus = 'PLAYING';
    
    this.drawNextNumber(roomCode);
    return true;
  }

  public pauseGame(roomCode: string, playerId: string): boolean {
    const room = this.rooms.get(roomCode);
    if (!room || room.hostId !== playerId || room.gameStatus !== 'PLAYING') {
      return false;
    }

    room.gameStatus = 'PAUSED';
    room.nextDrawAt = null;
    this.broadcastRoomState(roomCode);
    this.io.to(roomCode).emit('toast_message', {
      type: 'info',
      message: 'Game paused by host.',
    });
    return true;
  }

  public resumeGame(roomCode: string, playerId: string): boolean {
    const room = this.rooms.get(roomCode);
    if (!room || room.hostId !== playerId || room.gameStatus !== 'PAUSED') {
      return false;
    }

    room.gameStatus = 'PLAYING';
    room.nextDrawAt = Date.now() + room.drawInterval * 1000;
    this.broadcastRoomState(roomCode);
    this.io.to(roomCode).emit('toast_message', {
      type: 'info',
      message: 'Game resumed.',
    });
    return true;
  }

  public drawNextManual(roomCode: string, playerId: string): boolean {
    const room = this.rooms.get(roomCode);
    if (!room || room.hostId !== playerId) return false;
    return this.drawNextNumber(roomCode);
  }

  public changeInterval(roomCode: string, playerId: string, newInterval: number): boolean {
    const room = this.rooms.get(roomCode);
    if (!room || room.hostId !== playerId) return false;
    if (![5, 10, 15, 20, 30].includes(newInterval)) return false;

    room.drawInterval = newInterval;
    room.config.drawInterval = newInterval;
    if (room.gameStatus === 'PLAYING') {
      room.nextDrawAt = Date.now() + newInterval * 1000;
    }
    this.broadcastRoomState(roomCode);
    this.io.to(roomCode).emit('toast_message', {
      type: 'info',
      message: `Draw interval set to ${newInterval} seconds.`,
    });
    return true;
  }

  public drawNextNumber(roomCode: string): boolean {
    const room = this.rooms.get(roomCode);
    if (!room || room.remainingNumbers.length === 0) {
      if (room && room.remainingNumbers.length === 0 && room.gameStatus === 'PLAYING') {
        room.gameStatus = 'FINISHED';
        room.nextDrawAt = null;
        this.broadcastRoomState(roomCode);
        this.io.to(roomCode).emit('toast_message', {
          type: 'info',
          message: 'All 90 numbers have been called! Game over.',
        });
      }
      return false;
    }

    const drawnNumber = room.remainingNumbers.pop()!;
    room.currentNumber = drawnNumber;
    room.calledNumbers.push(drawnNumber);

    if (room.remainingNumbers.length > 0) {
      room.nextDrawAt = Date.now() + room.drawInterval * 1000;
    } else {
      room.nextDrawAt = null;
      room.gameStatus = 'FINISHED';
    }

    this.io.to(roomCode).emit('number_drawn', {
      number: drawnNumber,
      calledNumbers: room.calledNumbers,
      remainingCount: room.remainingNumbers.length,
      nextDrawAt: room.nextDrawAt || 0,
    });

    this.broadcastRoomState(roomCode);
    return true;
  }

  public markNumber(roomCode: string, playerId: string, num: number): boolean {
    const room = this.rooms.get(roomCode);
    if (!room) return false;

    const player = room.players.find((p) => p.id === playerId);
    if (!player) return false;

    if (!room.calledNumbers.includes(num)) {
      return false;
    }

    if (!player.markedNumbers.includes(num)) {
      player.markedNumbers.push(num);
    } else {
      player.markedNumbers = player.markedNumbers.filter((n) => n !== num);
    }

    this.broadcastRoomState(roomCode);
    return true;
  }

  public claimWin(
    roomCode: string,
    playerId: string,
    category: WinningCategory,
    ticketIndex?: number
  ): { success: boolean; message: string } {
    const room = this.rooms.get(roomCode);
    if (!room) return { success: false, message: 'Room not found.' };

    const player = room.players.find((p) => p.id === playerId);
    if (!player) return { success: false, message: 'Player not found.' };

    if (!room.config.winningPatterns[category]) {
      return { success: false, message: `Category ${category} is disabled in this room.` };
    }

    const existingClaim = room.winners.find((w) => w.category === category);
    if (existingClaim) {
      return {
        success: false,
        message: `${category} has already been claimed by ${existingClaim.playerName}!`,
      };
    }

    const calledSet = new Set(room.calledNumbers);
    const result = validateWinClaim(player.tickets, calledSet, category, ticketIndex);

    if (!result.valid) {
      return {
        success: false,
        message: result.reason || 'Invalid claim. Required numbers have not all been called.',
      };
    }

    const winningTicketIndex = result.ticketIndex ?? 0;
    const winningTicket = result.winningTicket || player.tickets[winningTicketIndex] || player.tickets[0];

    const winClaim: WinClaim = {
      id: generateClaimId(),
      playerId: player.id,
      playerName: player.name,
      category,
      timestamp: Date.now(),
      ticketIndex: winningTicketIndex,
      ticket: winningTicket,
    };

    room.winners.push(winClaim);
    if (!player.claims.includes(category)) {
      player.claims.push(category);
    }

    if (category === 'fullHouse') {
      room.gameStatus = 'FINISHED';
      room.nextDrawAt = null;
    }

    this.io.to(roomCode).emit('winner_announced', winClaim);
    this.broadcastRoomState(roomCode);

    return {
      success: true,
      message: `Congratulations! Your claim for ${category} on Ticket #${winningTicketIndex + 1} has been validated!`,
    };
  }

  public kickPlayer(roomCode: string, hostId: string, targetPlayerId: string): boolean {
    const room = this.rooms.get(roomCode);
    if (!room || room.hostId !== hostId) return false;

    const targetPlayer = room.players.find((p) => p.id === targetPlayerId);
    if (!targetPlayer || targetPlayer.isHost) return false;

    room.players = room.players.filter((p) => p.id !== targetPlayerId);
    this.io.to(targetPlayer.socketId).emit('kicked');
    this.broadcastRoomState(roomCode);
    return true;
  }

  public endGame(roomCode: string, hostId: string): boolean {
    const room = this.rooms.get(roomCode);
    if (!room || room.hostId !== hostId) return false;

    room.gameStatus = 'FINISHED';
    room.nextDrawAt = null;
    this.broadcastRoomState(roomCode);
    return true;
  }

  public playAgain(roomCode: string, hostId: string): boolean {
    const room = this.rooms.get(roomCode);
    if (!room || room.hostId !== hostId) return false;

    room.gameStatus = 'LOBBY';
    room.currentNumber = null;
    room.calledNumbers = [];
    room.remainingNumbers = [];
    room.nextDrawAt = null;
    room.winners = [];

    room.players.forEach((p) => {
      p.tickets = generateUniquePlayerTickets(room.config.ticketsPerPlayer);
      p.markedNumbers = [];
      p.claims = [];
    });

    this.broadcastRoomState(roomCode);
    this.io.to(roomCode).emit('toast_message', {
      type: 'info',
      message: 'Host has reset the room for a new game! Fresh unique tickets generated.',
    });
    return true;
  }

  public handleDisconnect(socketId: string) {
    this.rooms.forEach((room, roomCode) => {
      const player = room.players.find((p) => p.socketId === socketId);
      if (player) {
        player.isConnected = false;
        player.lastActive = Date.now();

        if (player.isHost) {
          const connectedPlayers = room.players.filter((p) => p.isConnected && p.id !== player.id);
          if (connectedPlayers.length > 0) {
            player.isHost = false;
            const newHost = connectedPlayers[0];
            newHost.isHost = true;
            room.hostId = newHost.id;
            this.io.to(roomCode).emit('toast_message', {
              type: 'warning',
              message: `Host disconnected. ${newHost.name} is now the host!`,
            });
          }
        }

        this.broadcastRoomState(roomCode);
      }
    });
  }

  public getRoomState(roomCode: string): RoomState | undefined {
    return this.rooms.get(roomCode.trim().toUpperCase());
  }

  public broadcastRoomState(roomCode: string) {
    const room = this.rooms.get(roomCode);
    if (room) {
      this.io.to(roomCode).emit('room_state_updated', room);
    }
  }
}
