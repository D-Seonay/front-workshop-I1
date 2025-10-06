import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Timer } from './Timer';
import { Button } from './ui/button';
import { LogOut, Landmark } from 'lucide-react';

export const Navbar = () => {
  const navigate = useNavigate();
  const { playerRole } = useGame();

  const handleQuit = () => {
    if (confirm('Êtes-vous sûr de vouloir quitter la mission ?')) {
      navigate('/');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Landmark className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Voyage dans les Musées Perdus
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          {playerRole && (
            <div className="px-3 py-1 bg-muted rounded-full text-sm">
              Rôle: <span className="font-semibold text-accent">{playerRole === 'agent' ? '🧑‍🎨 Agent' : '👨‍💻 Opérateur'}</span>
            </div>
          )}
          
          <Timer />
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleQuit}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Quitter
          </Button>
        </div>
      </div>
    </nav>
  );
};
