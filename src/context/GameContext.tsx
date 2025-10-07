import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockRoomApi, RoomPlayer } from '@/services/mockRoomApi';

interface GameContextType {
    playerRole: 'agent' | 'operator' | null;
    sessionId: string | null;
    completedCities: string[];
    currentCity: string | null;
    timeRemaining: number;
    isTimerRunning: boolean;
    missionFailed: boolean;
    roomPlayers: RoomPlayer[];
    currentUserId: string;
    setMissionFailed: (value: boolean) => void;
    setPlayerRole: (role: 'agent' | 'operator') => void;
    setSessionId: (id: string) => void;
    completeCity: (city: string) => void;
    setCurrentCity: (city: string | null) => void;
    startTimer: () => void;
    stopTimer: () => void;
    resetTimer: () => void;
    updateRoomPlayers: (players: RoomPlayer[]) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error('useGame must be used within GameProvider');
    return context;
};

interface GameProviderProps {
    children: ReactNode;
}

const INITIAL_TIME = 15; // secondes pour simplifier

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
    const [playerRole, setPlayerRole] = useState<'agent' | 'operator' | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [completedCities, setCompletedCities] = useState<string[]>([]);
    const [currentCity, setCurrentCity] = useState<string | null>(null);
    const [timeRemaining, setTimeRemaining] = useState(INITIAL_TIME);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [missionFailed, setMissionFailed] = useState(false);
    const [currentUserId] = useState(mockRoomApi.getCurrentUserId());
    const [roomPlayers, setRoomPlayers] = useState<RoomPlayer[]>([]);

    useEffect(() => {
        if (!isTimerRunning) return;
        const interval = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setIsTimerRunning(false);
                    setMissionFailed(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const completeCity = (city: string) => {
        if (!completedCities.includes(city)) {
            setCompletedCities(prev => [...prev, city]);
        }
    };

    const updateRoomPlayers = (players: RoomPlayer[]) => {
        setRoomPlayers(players);
    };

    const startTimer = () => setIsTimerRunning(true);
    const stopTimer = () => setIsTimerRunning(false);
    const resetTimer = () => {
        setTimeRemaining(INITIAL_TIME);
        setIsTimerRunning(false);
    };

    return (
        <GameContext.Provider
            value={{
                playerRole,
                sessionId,
                completedCities,
                currentCity,
                timeRemaining,
                isTimerRunning,
                currentUserId,
                missionFailed,
                setMissionFailed,
                setPlayerRole,
                setSessionId,
                completeCity,
                setCurrentCity,
                startTimer,
                stopTimer,
                resetTimer,
                updateRoomPlayers,
                roomPlayers,
            }}
        >
            {children}
        </GameContext.Provider>
    );
};
