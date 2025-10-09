/**
 * Types et interfaces pour le système Socket.IO
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
  // Messages du chat
  'chat:message': (message: ChatMessage) => void;
  'chat:history': (messages: ChatMessage[]) => void;

  // Gestion de la room
  'room:created': (room: { id: string; name: string }) => void;
  'room:joined': (data: { roomId: string; users: User[] }) => void;
  'room:user_joined': (user: User) => void;
  'room:user_left': (data: { userId: string; username: string }) => void;
  'room:status_changed': (status: RoomStatus) => void;
  'room:users': (users: User[]) => void;
  'room:update': (data: { users: User[]; status: RoomStatus }) => void;

  // Gestion des joueurs
  'player:ready': (data: { userId: string; isReady: boolean }) => void;
  'player:role': (data: { userId: string; role: PlayerRole }) => void;

  // Erreurs
  'error': (error: { message: string; code?: string }) => void;
}

export interface ClientToServerEvents {
  // Connexion/Déconnexion
  'user:register': (data: { username: string }) => void;

  // Gestion de la room
  'room:create': (data: { name: string }) => void;
  'room:join': (roomId: string) => void;
  'room:leave': () => void;
  'room:start': () => void;

  // Chat
  'chat:send': (content: string) => void;

  // Joueur
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
