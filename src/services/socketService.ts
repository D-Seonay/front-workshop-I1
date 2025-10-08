/**
 * Service Socket.IO pour le client React
 */

import { io, Socket } from 'socket.io-client';
import type { 
  ServerToClientEvents, 
  ClientToServerEvents, 
  ChatMessage, 
  User,
  RoomStatus,
  PlayerRole
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

  // ===== USER =====

  registerUser(username: string) {
    if (!this.socket) throw new Error('Socket non connecté');
    console.log('👤 Enregistrement:', username);
    this.socket.emit('user:register', { username });
  }

  // ===== ROOMS =====

  createRoom(name: string) {
    if (!this.socket) throw new Error('Socket non connecté');
    console.log('🏠 Création room:', name);
    this.socket.emit('room:create', { name });
  }

  joinRoom(roomId: string) {
    if (!this.socket) throw new Error('Socket non connecté');
    console.log('🚪 Rejoindre room:', roomId);
    this.socket.emit('room:join', roomId);
  }

  leaveRoom() {
    if (!this.socket) throw new Error('Socket non connecté');
    console.log('👋 Quitter room');
    this.socket.emit('room:leave');
  }

  startGame() {
    if (!this.socket) throw new Error('Socket non connecté');
    console.log('🎮 Démarrer partie');
    this.socket.emit('room:start');
  }

  // ===== CHAT =====

  sendMessage(content: string) {
    if (!this.socket) throw new Error('Socket non connecté');
    this.socket.emit('chat:send', content);
  }

  onChatMessage(callback: (message: ChatMessage) => void) {
    if (!this.socket) throw new Error('Socket non connecté');
    this.socket.on('chat:message', callback);
  }

  onChatHistory(callback: (messages: ChatMessage[]) => void) {
    if (!this.socket) throw new Error('Socket non connecté');
    this.socket.on('chat:history', callback);
  }

  // ===== PLAYER =====

  setReady(isReady: boolean) {
    if (!this.socket) throw new Error('Socket non connecté');
    console.log(`${isReady ? '✅' : '❌'} Set ready:`, isReady);
    this.socket.emit('player:set_ready', isReady);
  }

  setRole(role: PlayerRole) {
    if (!this.socket) throw new Error('Socket non connecté');
    console.log('🎭 Set role:', role);
    this.socket.emit('player:set_role', role);
  }

  onPlayerReady(callback: (data: { userId: string; isReady: boolean }) => void) {
    if (!this.socket) throw new Error('Socket non connecté');
    this.socket.on('player:ready', callback);
  }

  onPlayerRole(callback: (data: { userId: string; role: PlayerRole }) => void) {
    if (!this.socket) throw new Error('Socket non connecté');
    this.socket.on('player:role', callback);
  }

  // ===== ROOM EVENTS =====

  onRoomCreated(callback: (data: { id: string; name: string }) => void) {
    if (!this.socket) throw new Error('Socket non connecté');
    this.socket.on('room:created', callback);
  }

  onRoomJoined(callback: (data: { roomId: string; users: User[] }) => void) {
    if (!this.socket) throw new Error('Socket non connecté');
    this.socket.on('room:joined', callback);
  }

  onRoomUserJoined(callback: (user: User) => void) {
    if (!this.socket) throw new Error('Socket non connecté');
    this.socket.on('room:user_joined', callback);
  }

  onRoomUserLeft(callback: (data: { userId: string; username: string }) => void) {
    if (!this.socket) throw new Error('Socket non connecté');
    this.socket.on('room:user_left', callback);
  }

  onRoomStatusChanged(callback: (status: RoomStatus) => void) {
    if (!this.socket) throw new Error('Socket non connecté');
    this.socket.on('room:status_changed', callback);
  }

  onRoomUpdate(callback: (data: { users: User[]; status: RoomStatus }) => void) {
    if (!this.socket) throw new Error('Socket non connecté');
    this.socket.on('room:update', callback);
  }

  // ===== ERROR =====

  onError(callback: (error: { message: string; code?: string }) => void) {
    if (!this.socket) throw new Error('Socket non connecté');
    this.socket.on('error', callback);
  }

  // ===== CLEANUP =====

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  offChatMessage() {
    this.socket?.off('chat:message');
  }

  offChatHistory() {
    this.socket?.off('chat:history');
  }

  offError() {
    this.socket?.off('error');
  }
}

// Instance singleton
export const socketService = new SocketService();
