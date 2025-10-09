/**
 * Serveur Socket.IO pour le système de lobby et rooms
 * Port: 4000
 */

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { ClientToServerEvents, ServerToClientEvents } from './types/room.types';
import { handleLobbyConnection } from './sockets/lobby';
import { roomStorage } from './utils/roomStorage';

const app = express();
const httpServer = createServer(app);

// Configuration CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

// Configuration Socket.IO
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// ===== ROUTES REST (optionnelles) =====

app.get('/health', (req, res) => {
  const stats = roomStorage.getStats();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    stats,
  });
});

app.get('/rooms', (req, res) => {
  const rooms = roomStorage.getAllRooms().map(room => ({
    code: room.code,
    status: room.status,
    players: room.players.length,
    maxPlayers: 2,
    createdAt: room.createdAt,
  }));
  res.json(rooms);
});

// ===== SOCKET.IO =====

io.on('connection', (socket) => {
  handleLobbyConnection(socket);
});

// ===== DÉMARRAGE DU SERVEUR =====

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log('');
  console.log('╔═══════════════════════════════════════╗');
  console.log('║   🚀 Serveur Lobby Socket.IO         ║');
  console.log('╚═══════════════════════════════════════╝');
  console.log('');
  console.log(`🌐 HTTP Server: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
  console.log('');
  console.log('📋 Routes REST:');
  console.log(`   GET  /health  → État du serveur`);
  console.log(`   GET  /rooms   → Liste des rooms actives`);
  console.log('');
  console.log('⚡ Événements WebSocket:');
  console.log('   create_room, join_room, leave_room');
  console.log('   send_message, toggle_ready, set_role, start_game');
  console.log('');
});

// Gestion propre de l'arrêt
process.on('SIGTERM', () => {
  console.log('⏹️  SIGTERM reçu. Arrêt du serveur...');
  httpServer.close(() => {
    console.log('✅ Serveur arrêté proprement');
    process.exit(0);
  });
});
