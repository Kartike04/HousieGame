import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { registerSocketHandlers } from './socketHandler';
import { GameEngine } from './gameEngine';
import { ClientToServerEvents, ServerToClientEvents } from './types';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const gameEngine = new GameEngine(io);
registerSocketHandlers(io, gameEngine);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Serve frontend static build if present
const clientDistPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`🎟️ Housie Real-Time Server running on port ${PORT}`);
});
