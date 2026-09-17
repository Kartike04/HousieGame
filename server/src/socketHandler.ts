import { Server, Socket } from 'socket.io';
import { GameEngine } from './gameEngine';
import { ClientToServerEvents, ServerToClientEvents } from './types';

export function registerSocketHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents>,
  gameEngine: GameEngine
) {
  io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {

    socket.on('create_room', ({ hostName, config }, callback) => {
      const res = gameEngine.createRoom(socket.id, hostName, config);
      if (res.success && res.roomCode && res.playerId) {
        socket.data.roomCode = res.roomCode;
        socket.data.playerId = res.playerId;
        socket.join(res.roomCode);
        const roomState = gameEngine.getRoomState(res.roomCode);
        if (roomState) {
          socket.emit('room_state_updated', roomState);
        }
      }
      callback(res);
    });

    socket.on('join_room', ({ roomCode, playerName }, callback) => {
      const cleanCode = roomCode.trim().toUpperCase();
      const res = gameEngine.joinRoom(socket.id, cleanCode, playerName);
      if (res.success && res.roomState && res.playerId) {
        socket.data.roomCode = cleanCode;
        socket.data.playerId = res.playerId;
        socket.join(cleanCode);
        const roomState = gameEngine.getRoomState(cleanCode);
        if (roomState) {
          gameEngine.broadcastRoomState(cleanCode);
        }
      }
      callback(res);
    });

    socket.on('reconnect_player', ({ roomCode, playerId }, callback) => {
      const cleanCode = roomCode.trim().toUpperCase();
      const res = gameEngine.reconnectPlayer(socket.id, cleanCode, playerId);
      if (res.success && res.roomState && res.player) {
        socket.data.roomCode = cleanCode;
        socket.data.playerId = res.player.id;
        socket.join(cleanCode);
        gameEngine.broadcastRoomState(cleanCode);
      }
      callback(res);
    });

    socket.on('start_game', () => {
      const roomCode = getSocketRoomCode(socket);
      const playerId = getSocketPlayerId(socket);
      if (roomCode && playerId) {
        gameEngine.startGame(roomCode, playerId);
      }
    });

    socket.on('pause_game', () => {
      const roomCode = getSocketRoomCode(socket);
      const playerId = getSocketPlayerId(socket);
      if (roomCode && playerId) {
        gameEngine.pauseGame(roomCode, playerId);
      }
    });

    socket.on('resume_game', () => {
      const roomCode = getSocketRoomCode(socket);
      const playerId = getSocketPlayerId(socket);
      if (roomCode && playerId) {
        gameEngine.resumeGame(roomCode, playerId);
      }
    });

    socket.on('draw_next_manual', () => {
      const roomCode = getSocketRoomCode(socket);
      const playerId = getSocketPlayerId(socket);
      if (roomCode && playerId) {
        gameEngine.drawNextManual(roomCode, playerId);
      }
    });

    socket.on('change_interval', (newInterval) => {
      const roomCode = getSocketRoomCode(socket);
      const playerId = getSocketPlayerId(socket);
      if (roomCode && playerId) {
        gameEngine.changeInterval(roomCode, playerId, newInterval);
      }
    });

    socket.on('mark_number', ({ number }) => {
      const roomCode = getSocketRoomCode(socket);
      const playerId = getSocketPlayerId(socket);
      if (roomCode && playerId) {
        gameEngine.markNumber(roomCode, playerId, number);
      }
    });

    socket.on('claim_win', ({ category, ticketIndex }, callback) => {
      const roomCode = getSocketRoomCode(socket);
      const playerId = getSocketPlayerId(socket);
      if (roomCode && playerId) {
        const res = gameEngine.claimWin(roomCode, playerId, category, ticketIndex);
        callback(res);
      } else {
        callback({ success: false, message: 'Invalid room or session.' });
      }
    });

    socket.on('kick_player', (targetPlayerId) => {
      const roomCode = getSocketRoomCode(socket);
      const hostId = getSocketPlayerId(socket);
      if (roomCode && hostId) {
        gameEngine.kickPlayer(roomCode, hostId, targetPlayerId);
      }
    });

    socket.on('end_game', () => {
      const roomCode = getSocketRoomCode(socket);
      const hostId = getSocketPlayerId(socket);
      if (roomCode && hostId) {
        gameEngine.endGame(roomCode, hostId);
      }
    });

    socket.on('play_again', () => {
      const roomCode = getSocketRoomCode(socket);
      const hostId = getSocketPlayerId(socket);
      if (roomCode && hostId) {
        gameEngine.playAgain(roomCode, hostId);
      }
    });

    socket.on('leave_room', () => {
      const roomCode = getSocketRoomCode(socket);
      if (roomCode) {
        socket.leave(roomCode);
        gameEngine.handleDisconnect(socket.id);
        socket.data.roomCode = undefined;
        socket.data.playerId = undefined;
      }
    });

    socket.on('disconnect', () => {
      gameEngine.handleDisconnect(socket.id);
    });
  });
}

function getSocketRoomCode(socket: Socket): string | null {
  if (socket.data && socket.data.roomCode) {
    return socket.data.roomCode;
  }
  for (const room of socket.rooms) {
    if (room !== socket.id) return room;
  }
  return null;
}

function getSocketPlayerId(socket: Socket): string | null {
  if (socket.data && socket.data.playerId) {
    return socket.data.playerId;
  }
  return null;
}
