import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Users, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const Lobby = () => {
  const navigate = useNavigate();
  const { sessionId, playerRole, setPlayerRole, startTimer } = useGame();
  const [copied, setCopied] = useState(false);
  const [player1Ready, setPlayer1Ready] = useState(false);
  const [player2Ready, setPlayer2Ready] = useState(false);

  const copySessionCode = () => {
    if (sessionId) {
      navigator.clipboard.writeText(sessionId);
      setCopied(true);
      toast.success('Code copié dans le presse-papier !');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const selectRole = (role: 'agent' | 'operator') => {
    setPlayerRole(role);
    setPlayer1Ready(true);
    toast.success(`Rôle sélectionné : ${role === 'agent' ? 'Agent' : 'Opérateur'}`);
  };

  const startGame = () => {
    if (player1Ready) {
      startTimer();
      navigate('/cities');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 bg-card/80 backdrop-blur">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full mb-4">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-semibold">Salle d'attente</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-3">Préparation de la mission</h1>
          
          {sessionId && (
            <div className="flex items-center justify-center gap-3">
              <span className="text-muted-foreground">Code de session:</span>
              <Badge variant="outline" className="text-xl font-mono px-4 py-2 bg-muted">
                {sessionId}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={copySessionCode}
                className="gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Choisissez votre rôle :</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Card
                className={`p-6 cursor-pointer transition-all border-2 ${
                  playerRole === 'agent'
                    ? 'border-primary bg-primary/10 shadow-glow-gold'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => selectRole('agent')}
              >
                <div className="text-4xl mb-3">🧑‍🎨</div>
                <h3 className="text-xl font-bold mb-2">Agent</h3>
                <p className="text-sm text-muted-foreground">
                  Vue graphique, interagit avec les énigmes visuelles
                </p>
              </Card>

              <Card
                className={`p-6 cursor-pointer transition-all border-2 ${
                  playerRole === 'operator'
                    ? 'border-secondary bg-secondary/10 shadow-glow-cyan'
                    : 'border-border hover:border-secondary/50'
                }`}
                onClick={() => selectRole('operator')}
              >
                <div className="text-4xl mb-3">👨‍💻</div>
                <h3 className="text-xl font-bold mb-2">Opérateur</h3>
                <p className="text-sm text-muted-foreground">
                  Vue console, fournit les informations cruciales
                </p>
              </Card>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Statut des joueurs :</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Joueur 1 ({playerRole || 'Non sélectionné'})</span>
                <Badge variant={player1Ready ? 'default' : 'secondary'}>
                  {player1Ready ? '✓ Prêt' : 'En attente'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Joueur 2 (simulé)</span>
                <Badge variant="secondary">En attente</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={startGame}
            disabled={!player1Ready}
            size="lg"
            className="gap-2 shadow-glow-gold"
          >
            Commencer l'aventure
            <ArrowRight className="w-5 h-5" />
          </Button>
          {!player1Ready && (
            <p className="text-sm text-muted-foreground mt-3">
              Sélectionnez un rôle pour continuer
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Lobby;
