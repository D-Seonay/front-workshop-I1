import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { Room, ChatMessage, LobbyClientEvents, LobbyServerEvents, PlayerRole } from '@/types/lobby';
import { toast } from '@/hooks/use-toast';
import { redirect } from 'react-router-dom';

type LobbySocket = Socket<LobbyServerEvents, LobbyClientEvents>;

interface LobbyContextType {
  socket: LobbySocket | null;
  connected: boolean;
  room: Room | null;
  messages: ChatMessage[];
  currentPlayerId: string | null;
  createRoom: (name: string) => void;
  joinRoom: (name: string, code: string) => void;
  leaveRoom: () => void;
  sendMessage: (message: string) => void;
  toggleReady: () => void;
  setRole: (role: PlayerRole) => void;
  startGame: () => void;
  // 👇 ajout pour synchroniser la progression
  updateStep: (step: number) => void;
  onStepUpdated: (callback: (step: number) => void) => void;
}

const LobbyContext = createContext<LobbyContextType | null>(null);

interface LobbyProviderProps {
  children: ReactNode;
}

export function LobbyProvider({ children }: LobbyProviderProps) {
  const [socket, setSocket] = useState<LobbySocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string>('');

  // Connexion Socket.io
  useEffect(() => {
    const socketUrl = 'http://localhost:4000';
    console.log('🔌 Connexion au serveur lobby:', socketUrl);

    const socketInstance = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
    }) as LobbySocket;

    socketInstance.on('connect', () => {
      console.log('✅ Connecté au serveur lobby:', socketInstance.id);
      setConnected(true);
      setCurrentPlayerId(socketInstance.id);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('🔌 Déconnecté:', reason);
      setConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('❌ Erreur de connexion:', error);
      toast({ title: 'Erreur', description: 'Erreur de connexion au serveur', variant: 'destructive' });
      redirect('/');
    });

    // === 🎮 Événements du lobby ===
    socketInstance.on('room_created', ({ code, room: newRoom }) => {
      console.log('🏠 Room créée:', code);
      setRoom(newRoom);
      toast({
        title: 'Room créée !',
        description: `Code: ${code} - Partagez-le avec votre partenaire`,
      });
    });

    socketInstance.on('room_joined', ({ room: joinedRoom }) => {
      console.log('✅ Room rejointe:', joinedRoom.code);
      setRoom(joinedRoom);
      toast({
        title: 'Room rejointe !',
        description: `Vous êtes dans la room ${joinedRoom.code}`,
      });
    });

    socketInstance.on('room_update', ({ room: updatedRoom }) => {
      console.log('🔄 Room mise à jour:', updatedRoom);
      setRoom(updatedRoom);
    });

    socketInstance.on('message_received', (message) => {
      console.log('💬 Message reçu:', message);
      setMessages(prev => [...prev, message]);
    });

    socketInstance.on('game_started', ({ room: startedRoom }) => {
      console.log('🎮 Partie démarrée !');
      setRoom(startedRoom);
      toast({
        title: 'Partie lancée !',
        description: 'Le jeu commence maintenant',
      });
    });

    socketInstance.on('player_left', ({ playerName: leftPlayerName }) => {
      toast({
        title: 'Joueur parti',
        description: `${leftPlayerName} a quitté la room`,
        variant: 'destructive',
      });
    });

    socketInstance.on('error', ({ message, code }) => {
      console.error('❌ Erreur serveur:', code, message);
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
      redirect('/');
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // === 💬 Fonctions d'actions ===
  const createRoom = (name: string) => {
    if (!socket || !connected) {
      toast({ title: 'Erreur', description: 'Non connecté au serveur', variant: 'destructive' });
      return;
    }
    setPlayerName(name);
    socket.emit('create_room', { name });
  };

  const joinRoom = (name: string, code: string) => {
    if (!socket || !connected) {
      toast({ title: 'Erreur', description: 'Non connecté au serveur', variant: 'destructive' });
      return;
    }
    setPlayerName(name);
    socket.emit('join_room', { name, code: code.toUpperCase() });
  };

  const leaveRoom = () => {
    if (!socket || !room) return;
    socket.emit('leave_room', { code: room.code });
    setRoom(null);
    setMessages([]);
  };

  const sendMessage = (message: string) => {
    if (!socket || !room || !playerName) return;
    socket.emit('send_message', { code: room.code, message, name: playerName });
  };

  const toggleReady = () => {
    if (!socket || !room) return;
    socket.emit('toggle_ready', { code: room.code });
  };

  const setRole = (role: PlayerRole) => {
    if (!socket || !room) return;
    socket.emit('set_role', { code: room.code, role });
  };

  const startGame = () => {
    if (!socket || !room) return;
    socket.emit('start_game', { code: room.code });
  };

  // === 🧩 Gestion des étapes synchronisées ===
  const updateStep = (step: number) => {
    if (!socket || !room) return;
    console.log('🚀 Envoi de update_step:', step);
    socket.emit('update_step', { code: room.code, step });
  };

  const onStepUpdated = (callback: (step: number) => void) => {
    if (!socket) return;
    socket.off('step_updated'); // pour éviter les doublons
    socket.on('step_updated', ({ step }) => {
      console.log('🔁 Step reçu:', step);
      callback(step);
    });
  };

  return (
    <LobbyContext.Provider
      value={{
        socket,
        connected,
        room,
        messages,
        currentPlayerId,
        createRoom,
        joinRoom,
        leaveRoom,
        sendMessage,
        toggleReady,
        setRole,
        startGame,
        updateStep,
        onStepUpdated,
      }}
    >
      {children}
    </LobbyContext.Provider>
  );
}

export function useLobby() {
  const context = useContext(LobbyContext);
  if (!context) {
    throw new Error('useLobby must be used within a LobbyProvider');
  }
  return context;
}
