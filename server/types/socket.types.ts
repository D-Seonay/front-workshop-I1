/**
 * Types et interfaces pour le système Socket.IO
 */

export type RoomStatus = 'waiting' | 'playing' | 'finished';
export type PlayerRole = 'agent' | 'operator' | null;

export interface Player {
  id: string;
  name: string;
  connected: boolean;
  isReady: boolean;
  joinedAt: number;
}

export interface User {
  id: string;
  username: string;
  roomId: string | null;
  isReady: boolean;
  role: PlayerRole;
  connectedAt: Date;
}

export interface Room {
  roomId: string;
  players: Player[];
  status: 'lobby' | 'playing' | 'finished';
  createdAt: number;
  timer?: number;
  interval?: NodeJS.Timeout;
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
  'room_created': (data: { code: string; room: Room }) => void;
  'room_joined': (data: { room: Room }) => void;
  'room_update': (data: { room: Room }) => void;
  'player_joined': (data: { player: Player }) => void;
  'player_left': (data: { player: Player }) => void;
  'game_started': (data: { roomId: string }) => void;
  'message_received': (message: { id: string; name: string; message: string; timestamp: string }) => void;
  'error': (error: { message: string }) => void;
}

export interface ClientToServerEvents {
  'create_room': (data: { name: string }) => void;
  'join_room': (data: { code: string; name: string }) => void;
  'toggle_ready': (data: { code: string }) => void;
  'send_message': (data: { code: string; name: string; message: string }) => void;
  'leave_room': (data: { code: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
  username: string;
}
