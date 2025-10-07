import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockRoomApi, RoomPlayer } from '@/services/mockRoomApi';

interface GameContextType {
    playerRole: 'agent' | 'operator' | null;
    sessionId: string | null;
    completedCities: string[];
    currentCity: string | null;
    timeRemaining: number;
    isTimerRunning: boolean;
    missionFailed: boolean;              // ⬅️ nouveau
    setMissionFailed: (value: boolean) => void; // ⬅️ nouveau
    setPlayerRole: (role: 'agent' | 'operator') => void;
    setSessionId: (id: string) => void;
    completeCity: (city: string) => void;
    setCurrentCity: (city: string | null) => void;
    startTimer: () => void;
    stopTimer: () => void;
    resetTimer: () => void;
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

const INITIAL_TIME = 15; // 30 minutes en secondes

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
    const [playerRole, setPlayerRole] = useState<'agent' | 'operator' | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [completedCities, setCompletedCities] = useState<string[]>([]);
    const [currentCity, setCurrentCity] = useState<string | null>(null);
    const [timeRemaining, setTimeRemaining] = useState(INITIAL_TIME);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [missionFailed, setMissionFailed] = useState(false);


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
                setPlayerRole,
                setSessionId,
                completeCity,
                setCurrentCity,
                startTimer,
                stopTimer,
                resetTimer,
                missionFailed,
                setMissionFailed,
            }}
        >
            {children}
        </GameContext.Provider>
    );
};
