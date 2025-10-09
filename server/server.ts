/**
 * Serveur Socket.IO pour le chat temps réel
 * Port: 4000
 */

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { 
  ServerToClientEvents, 
  ClientToServerEvents, 
  InterServerEvents, 
  SocketData 
} from './types/socket.types';
import { handleConnection } from './handlers/socketHandlers';

const app = express();
const httpServer = createServer(app);

// Configuration CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

// Configuration Socket.IO
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// ===== ROUTES REST (optionnelles) =====

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.get('/rooms', (req, res) => {
  res.json([]);
});

// ===== SOCKET.IO =====

io.on('connection', (socket) => {
  handleConnection(socket);
});

// ===== DÉMARRAGE DU SERVEUR =====

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log('');
  console.log('╔═══════════════════════════════════════╗');
  console.log('║   🚀 Serveur Socket.IO démarré       ║');
  console.log('╚═══════════════════════════════════════╝');
  console.log('');
  console.log(`🌐 HTTP Server: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
  console.log('');
  console.log('📋 Routes disponibles:');
  console.log(`   GET  /health  → État du serveur`);
  console.log(`   GET  /rooms   → Liste des rooms`);
  console.log('');
   console.log('⚡ WebSocket Events:');
  console.log('   create_room, join_room, toggle_ready');
  console.log('   send_message, leave_room');
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
