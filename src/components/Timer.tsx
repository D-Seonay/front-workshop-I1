import { Clock } from 'lucide-react';
import { useGame } from '@/context/GameContext';

export const Timer = () => {
  const { timeRemaining } = useGame();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
      <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
        <Clock className="w-4 h-4 text-primary" />
        <span className="font-mono text-sm font-semibold">
        {formatTime(timeRemaining)}
      </span>
      </div>
  );
};
