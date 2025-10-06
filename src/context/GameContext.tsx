import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GameContextType {
  playerRole: 'agent' | 'operator' | null;
  sessionId: string | null;
  completedCities: string[];
  currentCity: string | null;
  timeElapsed: number;
  isTimerRunning: boolean;
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
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [playerRole, setPlayerRole] = useState<'agent' | 'operator' | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [completedCities, setCompletedCities] = useState<string[]>([]);
  const [currentCity, setCurrentCity] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
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
    setTimeElapsed(0);
    setIsTimerRunning(false);
  };

  return (
    <GameContext.Provider
      value={{
        playerRole,
        sessionId,
        completedCities,
        currentCity,
        timeElapsed,
        isTimerRunning,
        setPlayerRole,
        setSessionId,
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
