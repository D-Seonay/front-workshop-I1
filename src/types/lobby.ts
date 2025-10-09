/**
 * Types pour le système de lobby (frontend)
 */

export type RoomStatus = 'waiting' | 'playing' | 'finished';
export type PlayerRole = 'agent' | 'operator' | null;

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  isReady: boolean;
  joinedAt: string;
}

export interface Room {
  code: string;
  players: Player[];
  status: RoomStatus;
  createdAt: string;
  hostId: string;
}

export interface ChatMessage {
  name: string;
  message: string;
  timestamp: string;
}

// Événements Socket.io
export interface LobbyClientEvents {
  create_room: (data: { name: string }) => void;
  join_room: (data: { name: string; code: string }) => void;
  leave_room: (data: { code: string }) => void;
  send_message: (data: { code: string; message: string; name: string }) => void;
  toggle_ready: (data: { code: string }) => void;
  set_role: (data: { code: string; role: PlayerRole }) => void;
  start_game: (data: { code: string }) => void;
}

export interface LobbyServerEvents {
  room_created: (data: { code: string; room: Room }) => void;
  room_joined: (data: { room: Room }) => void;
  room_update: (data: { room: Room }) => void;
  message_received: (data: ChatMessage) => void;
  game_started: (data: { room: Room }) => void;
  player_left: (data: { playerId: string; playerName: string }) => void;
  error: (data: { message: string; code?: string }) => void;
}
