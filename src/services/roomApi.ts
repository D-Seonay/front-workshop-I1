export interface Room {
  id: string;
  createdAt: string;
  status: 'waiting' | 'playing' | 'finished';
}

export interface RoomPlayer {
  roomId: string;
  userId: string;
  role: 'agent' | 'operator' | null;
  isReady: boolean;
  joinedAt: string;
}

const API_URL = 'http://localhost:4000';

export const roomApi = {
  createRoom: async (): Promise<{ room: Room; player: RoomPlayer }> => {
    const res = await fetch(`${API_URL}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to create room');
    return await res.json();
  },

  joinRoom: async (roomId: string): Promise<{ room: Room; player: RoomPlayer } | null> => {
    const res = await fetch(`${API_URL}/rooms/${roomId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return null;
    return await res.json();
  },

  updatePlayerRole: async (roomId: string, role: 'agent' | 'operator'): Promise<boolean> => {
    const res = await fetch(`${API_URL}/rooms/${roomId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    return res.ok;
  },

  setPlayerReady: async (roomId: string, isReady: boolean): Promise<boolean> => {
    const res = await fetch(`${API_URL}/rooms/${roomId}/ready`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isReady }),
    });
    return res.ok;
  },

  getRoomState: async (roomId: string): Promise<{ room: Room; players: RoomPlayer[] } | null> => {
    const res = await fetch(`${API_URL}/rooms/${roomId}`);
    if (!res.ok) return null;
    return await res.json();
  },

  startGame: async (roomId: string): Promise<boolean> => {
    const res = await fetch(`${API_URL}/rooms/${roomId}/start`, {
      method: 'POST',
    });
    return res.ok;
  },

  getCurrentUserId: (): string => {
    // À adapter selon la gestion d'authentification côté backend
    return localStorage.getItem('current_user_id') || '';
  },
};
