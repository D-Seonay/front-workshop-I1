// Mock API pour la gestion des rooms sans backend
// Utilise localStorage pour simuler une base de données

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

const ROOMS_KEY = 'game_rooms';
const PLAYERS_KEY = 'game_players';
const CURRENT_USER_KEY = 'current_user_id';

// Génère un ID utilisateur unique pour cette session
const getUserId = (): string => {
  let userId = localStorage.getItem(CURRENT_USER_KEY);
  if (!userId) {
    userId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem(CURRENT_USER_KEY, userId);
  }
  return userId;
};

const getRooms = (): Room[] => {
  const data = localStorage.getItem(ROOMS_KEY);
  return data ? JSON.parse(data) : [];
};

const setRooms = (rooms: Room[]) => {
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
};

const getPlayers = (): RoomPlayer[] => {
  const data = localStorage.getItem(PLAYERS_KEY);
  return data ? JSON.parse(data) : [];
};

const setPlayers = (players: RoomPlayer[]) => {
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
};

export const mockRoomApi = {
  // Créer une nouvelle room
  createRoom: async (): Promise<{ room: Room; player: RoomPlayer }> => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const userId = getUserId();
    
    const room: Room = {
      id: roomId,
      createdAt: new Date().toISOString(),
      status: 'waiting',
    };
    
    const player: RoomPlayer = {
      roomId,
      userId,
      role: null,
      isReady: false,
      joinedAt: new Date().toISOString(),
    };
    
    const rooms = getRooms();
    rooms.push(room);
    setRooms(rooms);
    
    const players = getPlayers();
    players.push(player);
    setPlayers(players);
    
    return { room, player };
  },

  // Rejoindre une room existante
  joinRoom: async (roomId: string): Promise<{ room: Room; player: RoomPlayer } | null> => {
    const rooms = getRooms();
    const room = rooms.find(r => r.id === roomId);
    
    if (!room || room.status !== 'waiting') {
      return null;
    }
    
    const userId = getUserId();
    const players = getPlayers();
    const roomPlayers = players.filter(p => p.roomId === roomId);
    
    if (roomPlayers.length >= 2) {
      return null; // Room complète
    }
    
    // Vérifier si l'utilisateur est déjà dans la room
    const existingPlayer = roomPlayers.find(p => p.userId === userId);
    if (existingPlayer) {
      return { room, player: existingPlayer };
    }
    
    const player: RoomPlayer = {
      roomId,
      userId,
      role: null,
      isReady: false,
      joinedAt: new Date().toISOString(),
    };
    
    players.push(player);
    setPlayers(players);
    
    return { room, player };
  },

  // Mettre à jour le rôle d'un joueur
  updatePlayerRole: async (roomId: string, role: 'agent' | 'operator'): Promise<boolean> => {
    const userId = getUserId();
    const players = getPlayers();
    const playerIndex = players.findIndex(p => p.roomId === roomId && p.userId === userId);
    
    if (playerIndex === -1) return false;
    
    players[playerIndex].role = role;
    setPlayers(players);
    
    return true;
  },

  // Marquer un joueur comme prêt
  setPlayerReady: async (roomId: string, isReady: boolean): Promise<boolean> => {
    const userId = getUserId();
    const players = getPlayers();
    const playerIndex = players.findIndex(p => p.roomId === roomId && p.userId === userId);
    
    if (playerIndex === -1) return false;
    
    players[playerIndex].isReady = isReady;
    setPlayers(players);
    
    return true;
  },

  // Récupérer l'état d'une room
  getRoomState: async (roomId: string): Promise<{ room: Room; players: RoomPlayer[] } | null> => {
    const rooms = getRooms();
    const room = rooms.find(r => r.id === roomId);
    
    if (!room) return null;
    
    const players = getPlayers();
    const roomPlayers = players.filter(p => p.roomId === roomId);
    
    return { room, players: roomPlayers };
  },

  // Démarrer la partie
  startGame: async (roomId: string): Promise<boolean> => {
    const rooms = getRooms();
    const roomIndex = rooms.findIndex(r => r.id === roomId);
    
    if (roomIndex === -1) return false;
    
    rooms[roomIndex].status = 'playing';
    setRooms(rooms);
    
    return true;
  },

  // Obtenir l'ID de l'utilisateur courant
  getCurrentUserId: (): string => {
    return getUserId();
  },
};
