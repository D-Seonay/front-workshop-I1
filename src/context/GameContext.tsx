import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GameContextType {
    completedCities: string[];
    currentCity: string | null;
    timeRemaining: number;
    isTimerRunning: boolean;
    missionFailed: boolean;
    setMissionFailed: (value: boolean) => void;
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

const INITIAL_TIME = 15; // secondes pour simplifier

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
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
                completedCities,
                currentCity,
                timeRemaining,
                isTimerRunning,
                missionFailed,
                setMissionFailed,
                completeCity,
                setCurrentCity,
                startTimer,
                stopTimer,
                resetTimer,
            }}
        >
            {children}
        </GameContext.Provider>
    );
};
