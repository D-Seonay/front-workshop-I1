import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Timer } from './Timer';
import { Button } from './ui/button';
import { LogOut, Landmark, Shuffle } from 'lucide-react';
import { toast } from 'sonner';

export const Navbar = () => {
  const navigate = useNavigate();
  const { playerRole, setPlayerRole } = useGame();

  const handleQuit = () => {
    if (confirm('Êtes-vous sûr de vouloir quitter la mission ?')) {
      navigate('/');
    }
  };

  // ⚡ Test-only: changer de rôle localement
  const toggleRole = () => {
    const newRole = playerRole === 'agent' ? 'operator' : 'agent';
    setPlayerRole(newRole);
    toast.info(`Rôle changé : ${newRole === 'agent' ? '🧑‍🎨 Agent' : '👨‍💻 Opérateur'}`);
  };

  return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* --- Logo & Titre --- */}
          <div className="flex items-center gap-3">
            <Landmark className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Voyage dans les Musées Perdus
            </h1>
          </div>

          {/* --- Actions --- */}
          <div className="flex items-center gap-4">
            {playerRole && (
                <div className="px-3 py-1 bg-muted rounded-full text-sm">
                  Rôle :{' '}
                  <span className="font-semibold text-accent">
                {playerRole === 'agent' ? '🧑‍🎨 Agent' : '👨‍💻 Opérateur'}
              </span>
                </div>
            )}

            {/* 🧪 Bouton de test (changer de rôle) */}
            <Button
                variant="outline"
                size="sm"
                onClick={toggleRole}
                className="gap-2 hidden sm:flex"
            >
              <Shuffle className="w-4 h-4" />
              Changer de rôle
            </Button>

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
