import { createContext, useContext, useReducer, useEffect, useState, ReactNode } from 'react';
import { GameState, Player, Puzzle, ChatMessage, GameConfig } from '@/types/game';
import { useSocket } from '@/context/SocketProvider';
import { toast } from '@/hooks/use-toast';

interface GameContextType {
  gameState: GameState;
  chatMessages: ChatMessage[];
  currentPlayer: Player | null;
  joinRoom: (roomId: string, playerName: string) => void;
  startGame: (config?: Partial<GameConfig>) => void;
  submitAnswer: (puzzleId: string, answer: string | any) => void;
  sendChat: (message: string) => void;
  requestHint: (puzzleId: string) => void;
  setReady: (isReady: boolean) => void;
  setRole: (role: 'agent' | 'operator') => void;
}

type GameAction = 
  | { type: 'SET_GAME_STATE'; payload: GameState }
  | { type: 'UPDATE_PLAYERS'; payload: Player[] }
  | { type: 'ADD_PLAYER'; payload: Player }
  | { type: 'UPDATE_PUZZLES'; payload: Puzzle[] }
  | { type: 'SET_CURRENT_PLAYER'; payload: Player }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'UPDATE_TIMER'; payload: number }
  | { type: 'SET_STATUS'; payload: GameState['status'] };

const initialGameState: GameState = {
  roomId: '',
  players: [],
  puzzles: [],
  currentPuzzleIndex: 0,
  status: 'waiting',
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_GAME_STATE':
      return action.payload;
    case 'UPDATE_PLAYERS':
      return { ...state, players: action.payload };
    case 'ADD_PLAYER':
      return { ...state, players: [...state.players, action.payload] };
    case 'UPDATE_PUZZLES':
      return { ...state, puzzles: action.payload };
    case 'UPDATE_TIMER':
      return { ...state, timer: action.payload };
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    default:
      return state;
  }
}

const GameContext = createContext<GameContextType | null>(null);

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Socket event listeners
    socket.on('room_joined', (data) => {
      dispatch({ type: 'SET_GAME_STATE', payload: data.gameState });
      dispatch({ type: 'UPDATE_PLAYERS', payload: data.players });
      
      // Find current player
      const playerId = localStorage.getItem('playerId');
      if (playerId) {
        const player = data.players.find(p => p.id === playerId);
        if (player) setCurrentPlayer(player);
      }
    });

    socket.on('player_joined', (data) => {
      dispatch({ type: 'ADD_PLAYER', payload: data.player });
      toast({
        title: "Joueur connecté",
        description: `${data.player.name} a rejoint la partie`,
      });
    });

    socket.on('game_started', (data) => {
      dispatch({ type: 'UPDATE_PUZZLES', payload: data.puzzles });
      dispatch({ type: 'SET_STATUS', payload: 'playing' });
      toast({
        title: "Partie commencée !",
        description: "L'escape game débute maintenant",
      });
    });

    socket.on('state_update', (data) => {
      dispatch({ type: 'SET_GAME_STATE', payload: data.gameState });
    });

    socket.on('chat_message', (data) => {
      setChatMessages(prev => [...prev, data]);
    });

    socket.on('answer_result', (data) => {
      if (data.correct) {
        toast({
          title: "Bonne réponse !",
          description: data.message || "Puzzle résolu avec succès",
          variant: "default",
        });
      } else {
        toast({
          title: "Réponse incorrecte",
          description: data.message || "Réessayez",
          variant: "destructive",
        });
      }
    });

    socket.on('timer_tick', (data) => {
      dispatch({ type: 'UPDATE_TIMER', payload: data.remaining });
    });

    socket.on('game_end', (data) => {
      dispatch({ type: 'SET_STATUS', payload: data.result === 'victory' ? 'completed' : 'failed' });
      toast({
        title: data.result === 'victory' ? "Victoire !" : "Temps écoulé",
        description: data.result === 'victory' ? "Félicitations, vous avez réussi !" : "La partie est terminée",
        variant: data.result === 'victory' ? "default" : "destructive",
      });
    });

    socket.on('player_ready', (data) => {
      const updatedPlayers = gameState.players.map(p => 
        p.id === data.playerId ? { ...p, isReady: data.isReady } : p
      );
      dispatch({ type: 'UPDATE_PLAYERS', payload: updatedPlayers });
    });

    socket.on('player_role', (data) => {
      const updatedPlayers = gameState.players.map(p => 
        p.id === data.playerId ? { ...p, role: data.role } : p
      );
      dispatch({ type: 'UPDATE_PLAYERS', payload: updatedPlayers });
    });

    socket.on('error', (data) => {
      toast({
        title: "Erreur",
        description: data.message,
        variant: "destructive",
      });
    });

    return () => {
      socket.off('room_joined');
      socket.off('player_joined');
      socket.off('game_started');
      socket.off('state_update');
      socket.off('chat_message');
      socket.off('answer_result');
      socket.off('timer_tick');
      socket.off('game_end');
      socket.off('player_ready');
      socket.off('player_role');
      socket.off('error');
    };
  }, [socket, gameState.players]);

  const joinRoom = (roomId: string, playerName: string) => {
    if (!socket) return;
    
    const playerId = localStorage.getItem('playerId') || `player_${Date.now()}`;
    localStorage.setItem('playerId', playerId);
    localStorage.setItem('roomId', roomId);
    
    socket.emit('join_room', { roomId, playerId, name: playerName });
  };

  const startGame = (config?: Partial<GameConfig>) => {
    if (!socket || !gameState.roomId) return;
    socket.emit('start_game', { roomId: gameState.roomId, config });
  };

  const submitAnswer = (puzzleId: string, answer: string | any) => {
    if (!socket || !currentPlayer) return;
    socket.emit('submit_answer', {
      roomId: gameState.roomId,
      playerId: currentPlayer.id,
      puzzleId,
      answer,
    });
  };

  const sendChat = (message: string) => {
    if (!socket || !currentPlayer) return;
    socket.emit('send_chat', {
      roomId: gameState.roomId,
      playerId: currentPlayer.id,
      message,
    });
  };

  const requestHint = (puzzleId: string) => {
    if (!socket || !currentPlayer) return;
    socket.emit('request_hint', {
      roomId: gameState.roomId,
      playerId: currentPlayer.id,
      puzzleId,
    });
  };

  const setReady = (isReady: boolean) => {
    if (!socket || !currentPlayer || !gameState.roomId) return;
    socket.emit('set_ready', {
      roomId: gameState.roomId,
      playerId: currentPlayer.id,
      isReady,
    });
  };

  const setRole = (role: 'agent' | 'operator') => {
    if (!socket || !currentPlayer || !gameState.roomId) return;
    socket.emit('set_role', {
      roomId: gameState.roomId,
      playerId: currentPlayer.id,
      role,
    });
  };

  return (
    <GameContext.Provider value={{
      gameState,
      chatMessages,
      currentPlayer,
      joinRoom,
      startGame,
      submitAnswer,
      sendChat,
      requestHint,
      setReady,
      setRole,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
