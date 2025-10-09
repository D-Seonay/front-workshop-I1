/**
 * Service Socket.IO pour le client React
 */

import { io, Socket } from 'socket.io-client';
import type { 
  ServerToClientEvents, 
  ClientToServerEvents, 
  Room,
  Player
} from '@/types/socket.types';

type SocketClient = Socket<ServerToClientEvents, ClientToServerEvents>;

class SocketService {
  private socket: SocketClient | null = null;
  private isConnected = false;

  /**
   * Se connecter au serveur Socket.IO
   */
  connect(serverUrl: string = 'http://localhost:4000'): SocketClient {
    if (this.socket?.connected) {
      console.log('✅ Socket déjà connecté');
      return this.socket;
    }

    console.log(`🔌 Connexion à ${serverUrl}...`);
    
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connecté:', this.socket?.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket déconnecté:', reason);
      this.isConnected = false;
    });

    this.socket.on('error', (error) => {
      console.error('❌ Erreur Socket:', error);
    });

    return this.socket;
  }

  /**
   * Se déconnecter du serveur
   */
  disconnect() {
    if (this.socket) {
      console.log('🔌 Déconnexion du socket...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Vérifier si connecté
   */
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  /**
   * Obtenir le socket
   */
  getSocket(): SocketClient | null {
    return this.socket;
  }

  // ===== ROOMS =====

  createRoom(name) {
    if (!this.socket) throw new Error('Socket non connecté');
    console.log('🏠 Création room');
    this.socket.emit('create_room' , { name });
  }

  joinRoom(code: string, name: string) {
    if (!this.socket) throw new Error('Socket non connecté');
    console.log('🚪 Rejoindre room:', code);
    this.socket.emit('join_room', { code, name });
  }

  leaveRoom(code: string) {
    if (!this.socket) throw new Error('Socket non connecté');
    console.log('👋 Quitter room');
    this.socket.emit('leave_room', { code });
  }

  toggleReady(code: string) {
    if (!this.socket) throw new Error('Socket non connecté');
    console.log('✅ Toggle ready');
    this.socket.emit('toggle_ready', { code });
  }

  // ===== CHAT =====

  sendMessage(code: string, name: string, message: string) {
    if (!this.socket) throw new Error('Socket non connecté');
    this.socket.emit('send_message', { code, name, message });
  }

  onMessageReceived(callback: (message: { id: string; name: string; message: string; timestamp: string }) => void) {
    if (!this.socket) throw new Error('Socket non connecté');
    this.socket.on('message_received', callback);
  }

  // ===== ROOM EVENTS =====

  onRoomCreated(callback: (data: { code: string; room: Room }) => void) {
    if (!this.socket) throw new Error('Socket non connecté');
    this.socket.on('room_created', callback);
  }

  onRoomJoined(callback: (data: { room: Room }) => void) {
    if (!this.socket) throw new Error('Socket non connecté');
    this.socket.on('room_joined', callback);
  }

  onRoomUpdate(callback: (data: { room: Room }) => void) {
    if (!this.socket) throw new Error('Socket non connecté');
    this.socket.on('room_update', callback);
  }

  onPlayerJoined(callback: (data: { player: Player }) => void) {
    if (!this.socket) throw new Error('Socket non connecté');
    this.socket.on('player_joined', callback);
  }

  onPlayerLeft(callback: (data: { player: Player }) => void) {
    if (!this.socket) throw new Error('Socket non connecté');
    this.socket.on('player_left', callback);
  }

  onGameStarted(callback: (data: { roomId: string }) => void) {
    if (!this.socket) throw new Error('Socket non connecté');
    this.socket.on('game_started', callback);
  }

  // ===== ERROR =====

  onError(callback: (error: { message: string }) => void) {
    if (!this.socket) throw new Error('Socket non connecté');
    this.socket.on('error', callback);
  }

  // ===== CLEANUP =====

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  offMessageReceived() {
    this.socket?.off('message_received');
  }

  offError() {
    this.socket?.off('error');
  }
}

// Instance singleton
export const socketService = new SocketService();
