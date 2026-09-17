/// <reference types="vite/client" />
import { io, Socket } from 'socket.io-client';
import { RoomState, Player, WinClaim, WinningCategory, RoomConfig } from '../types/game';

// Live public backend server URL fallback for Vercel deployment
const LIVE_BACKEND_URL = 'https://sixty-months-return.loca.lt';

const SOCKET_URL =
  (import.meta.env.VITE_SOCKET_URL as string) ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:4000'
    : LIVE_BACKEND_URL);

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket', 'polling'],
  extraHeaders: {
    'bypass-tunnel-reminder': 'true',
  },
});

const ROOM_STORAGE_KEY = 'housie_room_session';

export interface RoomSession {
  roomCode: string;
  playerId: string;
  playerName: string;
}

export const saveSession = (roomCode: string, playerId: string, playerName: string) => {
  localStorage.setItem(
    ROOM_STORAGE_KEY,
    JSON.stringify({ roomCode, playerId, playerName })
  );
};

export const getSession = (): RoomSession | null => {
  const data = localStorage.getItem(ROOM_STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem(ROOM_STORAGE_KEY);
};

export const createRoomSocket = (
  hostName: string,
  config?: Partial<RoomConfig>
): Promise<{ success: boolean; roomCode?: string; playerId?: string; error?: string }> => {
  return new Promise((resolve) => {
    socket.emit(
      'create_room',
      { hostName, config },
      (res: { success: boolean; roomCode?: string; playerId?: string; error?: string }) => {
        if (res.success && res.roomCode && res.playerId) {
          saveSession(res.roomCode, res.playerId, hostName);
        }
        resolve(res);
      }
    );
  });
};

export const joinRoomSocket = (
  roomCode: string,
  playerName: string
): Promise<{ success: boolean; roomState?: RoomState; playerId?: string; error?: string }> => {
  return new Promise((resolve) => {
    socket.emit(
      'join_room',
      { roomCode, playerName },
      (res: { success: boolean; roomState?: RoomState; playerId?: string; error?: string }) => {
        if (res.success && res.playerId) {
          saveSession(roomCode.trim().toUpperCase(), res.playerId, playerName);
        }
        resolve(res);
      }
    );
  });
};

export const reconnectPlayerSocket = (
  roomCode: string,
  playerId: string
): Promise<{ success: boolean; roomState?: RoomState; player?: Player; error?: string }> => {
  return new Promise((resolve) => {
    socket.emit(
      'reconnect_player',
      { roomCode, playerId },
      (res: { success: boolean; roomState?: RoomState; player?: Player; error?: string }) => {
        resolve(res);
      }
    );
  });
};

export const claimWinSocket = (
  category: WinningCategory,
  ticketIndex?: number
): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    socket.emit(
      'claim_win',
      { category, ticketIndex },
      (res: { success: boolean; message: string }) => {
        resolve(res);
      }
    );
  });
};
