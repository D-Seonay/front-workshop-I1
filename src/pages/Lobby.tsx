import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { useLobby } from '@/context/LobbyProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Users, ArrowRight, User, Terminal } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';

const Lobby = () => {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();
  const { startTimer } = useGame();
  const { room, currentPlayerId, toggleReady, setRole, startGame: startLobbyGame } = useLobby();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!room && !code) {
      navigate('/');
    } else if (code && room?.code !== code) {
      navigate('/');
    }
  }, [room, code, navigate]);

  const copySessionCode = () => {
    if (room?.code) {
      navigator.clipboard.writeText(room.code);
      setCopied(true);
      sonnerToast.success('Code copié dans le presse-papier !');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const selectRole = (role: 'agent' | 'operator') => {
    if (!room) return;

    const otherPlayer = room.players.find(p => p.id !== currentPlayerId);
    if (otherPlayer?.role === role) {
      sonnerToast.error('Ce rôle est déjà pris par l\'autre joueur');
      return;
    }

    setRole(role);
  };

  const handleToggleReady = () => {
    const currentPlayer = room?.players.find(p => p.id === currentPlayerId);
    if (!room || !currentPlayer?.role) {
      sonnerToast.error('Sélectionnez un rôle d\'abord');
      return;
    }
    toggleReady();
  };

  const handleStartGame = () => {
    if (!room) return;
    startLobbyGame();
    startTimer();
    navigate('/cities');
  };

  if (!room) return null;

  const currentPlayer = room.players.find(p => p.id === currentPlayerId);
  const otherPlayer = room.players.find(p => p.id !== currentPlayerId);
  const bothPlayersReady = room.players.length === 2 &&
      room.players.every(p => p.isReady && p.role);
  const canStart = bothPlayersReady && room.status === 'waiting';

  return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 bg-card/80 backdrop-blur">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full mb-4">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-semibold">Salle d'attente</span>
            </div>

            <h1 className="text-3xl font-bold mb-3">Préparation de la mission</h1>

            <div className="flex items-center justify-center gap-3">
              <span className="text-muted-foreground">Code de session:</span>
              <Badge variant="outline" className="text-xl font-mono px-4 py-2 bg-muted">
                {room.code}
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
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">Choisissez votre rôle :</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <Card
                    className={`p-6 cursor-pointer transition-all border-2 ${
                        currentPlayer?.role === 'agent'
                            ? 'border-primary bg-primary/10 shadow-glow-gold'
                            : otherPlayer?.role === 'agent'
                                ? 'opacity-50 cursor-not-allowed border-border'
                                : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => otherPlayer?.role !== 'agent' && selectRole('agent')}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Agent de Terrain</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Explorez les musées et résolvez les énigmes visuelles
                    </p>
                    {currentPlayer?.role === 'agent' && (
                        <Badge className="bg-primary">Sélectionné</Badge>
                    )}
                    {otherPlayer?.role === 'agent' && (
                        <Badge variant="secondary">Pris par l'autre joueur</Badge>
                    )}
                  </div>
                </Card>

                <Card
                    className={`p-6 cursor-pointer transition-all border-2 ${
                        currentPlayer?.role === 'operator'
                            ? 'border-secondary bg-secondary/10 shadow-glow-cyan'
                            : otherPlayer?.role === 'operator'
                                ? 'opacity-50 cursor-not-allowed border-border'
                                : 'border-border hover:border-secondary/50'
                    }`}
                    onClick={() => otherPlayer?.role !== 'operator' && selectRole('operator')}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                      <Terminal className="w-8 h-8 text-secondary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Opérateur Console</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Guidez votre coéquipier avec les données techniques
                    </p>
                    {currentPlayer?.role === 'operator' && (
                        <Badge className="bg-secondary">Sélectionné</Badge>
                    )}
                    {otherPlayer?.role === 'operator' && (
                        <Badge variant="secondary">Pris par l'autre joueur</Badge>
                    )}
                  </div>
                </Card>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Statut des joueurs :</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-card/50 rounded">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <span>Vous ({currentPlayer?.role === 'agent' ? 'Agent' : currentPlayer?.role === 'operator' ? 'Opérateur' : 'Non sélectionné'})</span>
                  </div>
                  <Badge variant={currentPlayer?.isReady ? 'default' : 'secondary'}>
                    {currentPlayer?.isReady ? '✓ Prêt' : 'En attente'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-card/50 rounded">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-secondary" />
                    <span>
                    Coéquipier {otherPlayer
                        ? `(${otherPlayer.role === 'agent' ? 'Agent' : otherPlayer.role === 'operator' ? 'Opérateur' : 'Non sélectionné'})`
                        : '(En attente de connexion...)'}
                  </span>
                  </div>
                  <Badge variant={otherPlayer?.isReady ? 'default' : 'secondary'}>
                    {otherPlayer?.isReady ? '✓ Prêt' : 'En attente'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
                onClick={handleToggleReady}
                variant={currentPlayer?.isReady ? 'default' : 'outline'}
                size="lg"
                className="w-full"
                disabled={!currentPlayer?.role}
            >
              {currentPlayer?.isReady ? 'Prêt ✓' : 'Je suis prêt'}
            </Button>

            <Button
                onClick={handleStartGame}
                disabled={!canStart}
                size="lg"
                className="w-full gap-2 shadow-glow-gold"
            >
              Commencer l'aventure
              <ArrowRight className="w-5 h-5" />
            </Button>

            {!canStart && room.players.length === 2 && (
                <p className="text-sm text-muted-foreground text-center">
                  Les deux joueurs doivent choisir un rôle et être prêts
                </p>
            )}

            {room.players.length < 2 && (
                <p className="text-sm text-muted-foreground text-center">
                  En attente du second joueur...
                </p>
            )}

            {!currentPlayer?.role && (
                <p className="text-sm text-muted-foreground text-center">
                  Sélectionnez un rôle pour continuer
                </p>
            )}
          </div>
        </Card>
      </div>
  );
};

export default Lobby;