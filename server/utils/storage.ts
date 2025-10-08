/**
 * Stockage en mémoire pour les rooms, users et messages
 */

import { Room, User, ChatMessage, RoomStatus } from '../types/socket.types';

class Storage {
  private rooms: Map<string, Room> = new Map();
  private users: Map<string, User> = new Map();
  private messages: Map<string, ChatMessage[]> = new Map();

  // ===== ROOMS =====
  
  createRoom(id: string, name: string): Room {
    const room: Room = {
      id,
      name,
      status: 'waiting',
      createdAt: new Date(),
      users: new Map(),
      maxPlayers: 2,
    };
    this.rooms.set(id, room);
    console.log(`✅ Room créée: ${id} (${name})`);
    return room;
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  deleteRoom(roomId: string): boolean {
    const deleted = this.rooms.delete(roomId);
    if (deleted) {
      this.messages.delete(roomId);
      console.log(`🗑️  Room supprimée: ${roomId}`);
    }
    return deleted;
  }

  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  updateRoomStatus(roomId: string, status: RoomStatus): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    room.status = status;
    console.log(`🔄 Room ${roomId} -> status: ${status}`);
    return true;
  }

  // ===== USERS =====
  
  createUser(id: string, username: string): User {
    const user: User = {
      id,
      username,
      roomId: null,
      isReady: false,
      role: null,
      connectedAt: new Date(),
    };
    this.users.set(id, user);
    console.log(`👤 User créé: ${username} (${id})`);
    return user;
  }

  getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  deleteUser(userId: string): boolean {
    const deleted = this.users.delete(userId);
    if (deleted) {
      console.log(`👋 User supprimé: ${userId}`);
    }
    return deleted;
  }

  addUserToRoom(userId: string, roomId: string): boolean {
    const user = this.users.get(userId);
    const room = this.rooms.get(roomId);
    
    if (!user || !room) return false;
    if (room.users.size >= room.maxPlayers) return false;

    user.roomId = roomId;
    room.users.set(userId, user);
    console.log(`➕ User ${user.username} rejoint la room ${roomId}`);
    return true;
  }

  removeUserFromRoom(userId: string): boolean {
    const user = this.users.get(userId);
    if (!user || !user.roomId) return false;

    const room = this.rooms.get(user.roomId);
    if (room) {
      room.users.delete(userId);
      console.log(`➖ User ${user.username} quitte la room ${user.roomId}`);
      
      // Supprimer la room si elle est vide
      if (room.users.size === 0) {
        this.deleteRoom(user.roomId);
      }
    }

    user.roomId = null;
    user.isReady = false;
    user.role = null;
    return true;
  }

  getRoomUsers(roomId: string): User[] {
    const room = this.rooms.get(roomId);
    return room ? Array.from(room.users.values()) : [];
  }

  updateUserReady(userId: string, isReady: boolean): boolean {
    const user = this.users.get(userId);
    if (!user) return false;
    user.isReady = isReady;
    console.log(`${isReady ? '✅' : '❌'} User ${user.username} -> ready: ${isReady}`);
    return true;
  }

  updateUserRole(userId: string, role: 'agent' | 'operator' | null): boolean {
    const user = this.users.get(userId);
    if (!user) return false;
    user.role = role;
    console.log(`🎭 User ${user.username} -> role: ${role}`);
    return true;
  }

  // ===== MESSAGES =====
  
  addMessage(message: ChatMessage): void {
    if (!this.messages.has(message.roomId)) {
      this.messages.set(message.roomId, []);
    }
    const roomMessages = this.messages.get(message.roomId)!;
    roomMessages.push(message);
    
    // Garder seulement les 100 derniers messages
    if (roomMessages.length > 100) {
      roomMessages.shift();
    }
    
    console.log(`💬 Message de ${message.username} dans ${message.roomId}`);
  }

  getRoomMessages(roomId: string, limit: number = 50): ChatMessage[] {
    const messages = this.messages.get(roomId) || [];
    return messages.slice(-limit);
  }

  // ===== STATS =====
  
  getStats() {
    return {
      rooms: this.rooms.size,
      users: this.users.size,
      messages: Array.from(this.messages.values()).reduce((sum, msgs) => sum + msgs.length, 0),
    };
  }
}

export const storage = new Storage();
