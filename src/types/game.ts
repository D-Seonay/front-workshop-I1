/**
 * Types pour le système de jeu escape game
 */

export type GameStatus = 'waiting' | 'playing' | 'completed' | 'failed';
export type PlayerRole = 'agent' | 'operator';

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  isReady: boolean;
  score?: number;
}

export interface Puzzle {
  id: string;
  title: string;
  description: string;
  type: 'text' | 'code' | 'image' | 'audio' | 'sequence';
  answer: string | any;
  hints: string[];
  hintsUsed: number;
  solved: boolean;
  solvedBy?: string;
  points: number;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: Date;
  type?: 'system' | 'user';
}

export interface GameConfig {
  timeLimit: number; // en secondes
  difficulty: 'easy' | 'medium' | 'hard';
  city: 'paris' | 'tokyo' | 'newyork';
}

export interface GameState {
  roomId: string;
  players: Player[];
  puzzles: Puzzle[];
  currentPuzzleIndex: number;
  status: GameStatus;
  timer?: number;
  config?: GameConfig;
  startedAt?: Date;
  completedAt?: Date;
}

// Événements Socket.IO Client → Serveur
export interface ClientToServerEvents {
  join_room: (data: { roomId: string; playerId: string; name: string }) => void;
  start_game: (data: { roomId: string; config?: Partial<GameConfig> }) => void;
  submit_answer: (data: { roomId: string; playerId: string; puzzleId: string; answer: string | any }) => void;
  send_chat: (data: { roomId: string; playerId: string; message: string }) => void;
  request_hint: (data: { roomId: string; playerId: string; puzzleId: string }) => void;
  set_ready: (data: { roomId: string; playerId: string; isReady: boolean }) => void;
  set_role: (data: { roomId: string; playerId: string; role: PlayerRole }) => void;
}

// Événements Socket.IO Serveur → Client
export interface ServerToClientEvents {
  room_joined: (data: { gameState: GameState; players: Player[] }) => void;
  player_joined: (data: { player: Player }) => void;
  player_left: (data: { playerId: string }) => void;
  game_started: (data: { gameState: GameState; puzzles: Puzzle[] }) => void;
  state_update: (data: { gameState: GameState }) => void;
  chat_message: (message: ChatMessage) => void;
  answer_result: (data: { correct: boolean; message?: string; puzzle?: Puzzle }) => void;
  hint_provided: (data: { puzzleId: string; hint: string; hintsRemaining: number }) => void;
  timer_tick: (data: { remaining: number }) => void;
  game_end: (data: { result: 'victory' | 'defeat'; gameState: GameState }) => void;
  player_ready: (data: { playerId: string; isReady: boolean }) => void;
  player_role: (data: { playerId: string; role: PlayerRole }) => void;
  error: (data: { message: string; code?: string }) => void;
}
