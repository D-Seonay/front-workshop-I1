/**
 * Types Socket.IO partagés (copie du serveur)
 */

export type RoomStatus = 'waiting' | 'playing' | 'finished';
export type PlayerRole = 'agent' | 'operator' | null;

export interface User {
  id: string;
  username: string;
  roomId: string | null;
  isReady: boolean;
  role: PlayerRole;
  connectedAt: Date;
}

export interface Room {
  id: string;
  name: string;
  status: RoomStatus;
  createdAt: Date;
  users: Map<string, User>;
  maxPlayers: number;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
}

export interface ServerToClientEvents {
  'chat:message': (message: ChatMessage) => void;
  'chat:history': (messages: ChatMessage[]) => void;
  'room:created': (room: { id: string; name: string }) => void;
  'room:joined': (data: { roomId: string; users: User[] }) => void;
  'room:user_joined': (user: User) => void;
  'room:user_left': (data: { userId: string; username: string }) => void;
  'room:status_changed': (status: RoomStatus) => void;
  'room:users': (users: User[]) => void;
  'room:update': (data: { users: User[]; status: RoomStatus }) => void;
  'player:ready': (data: { userId: string; isReady: boolean }) => void;
  'player:role': (data: { userId: string; role: PlayerRole }) => void;
  'error': (error: { message: string; code?: string }) => void;
}

export interface ClientToServerEvents {
  'user:register': (data: { username: string }) => void;
  'room:create': (data: { name: string }) => void;
  'room:join': (roomId: string) => void;
  'room:leave': () => void;
  'room:start': () => void;
  'chat:send': (content: string) => void;
  'player:set_ready': (isReady: boolean) => void;
  'player:set_role': (role: PlayerRole) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
  username: string;
}
