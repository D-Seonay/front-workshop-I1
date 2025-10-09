import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Users, ArrowRight, User, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import { socketService } from '@/services/socketService';

const Lobby = () => {
  const navigate = useNavigate();
  const { sessionId, playerRole, setPlayerRole, startTimer, currentUserId, roomPlayers, updateRoomPlayers } = useGame();
  const [copied, setCopied] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Écouter les événements Socket.IO
  useEffect(() => {
    if (!sessionId) {
      navigate('/');
      return;
    }

    // Écouter les mises à jour de la room
    socketService.onRoomUpdate((data) => {
      updateRoomPlayers(data.room.players);
      const currentPlayer = data.room.players.find(p => p.id === socketService.getSocket()?.id);
      if (currentPlayer?.isReady !== undefined) {
        setIsReady(currentPlayer.isReady);
      }
    });

    // Écouter les nouveaux joueurs
    socketService.onPlayerJoined((data) => {
      toast(`${data.player.name} a rejoint la partie`);
    });

    // Écouter les départs
    socketService.onPlayerLeft((data) => {
      toast(`${data.player.name} a quitté la partie`);
    });

    // Écouter le démarrage du jeu
    socketService.onGameStarted((data) => {
      startTimer();
      navigate('/cities');
    });

    return () => {
      socketService.removeAllListeners();
    };
  }, [sessionId, navigate, startTimer, updateRoomPlayers]);

  const copySessionCode = () => {
    if (sessionId) {
      navigator.clipboard.writeText(sessionId);
      setCopied(true);
      toast.success('Code copié dans le presse-papier !');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const selectRole = (role: 'agent' | 'operator') => {
    if (!sessionId) return;
    setPlayerRole(role);
    toast.success(`Rôle sélectionné : ${role === 'agent' ? 'Agent' : 'Opérateur'}`);
  };

  const toggleReady = () => {
    if (!sessionId || !playerRole) return;

    socketService.toggleReady(sessionId);
    const newReadyState = !isReady;
    setIsReady(newReadyState);
    toast.success(newReadyState ? 'Vous êtes prêt !' : 'Vous n\'êtes plus prêt');
  };

  const startGame = () => {
    if (!sessionId) return;
    // Le démarrage sera géré automatiquement par l'événement game_started
    // qui se déclenche quand tous les joueurs sont prêts
  };

  const socketId = socketService.getSocket()?.id;
  const currentPlayer = roomPlayers.find(p => p.id === socketId);
  const otherPlayer = roomPlayers.find(p => p.id !== socketId);
  const bothPlayersReady = roomPlayers.length === 2 && roomPlayers.every(p => p.isReady);
  const canStart = bothPlayersReady && playerRole !== null;

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
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Agent de Terrain</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Explorez les musées et résolvez les énigmes visuelles
                    </p>
                    {playerRole === 'agent' && (
                        <Badge className="bg-primary">Sélectionné</Badge>
                    )}
                  </div>
                </Card>

                <Card
                    className={`p-6 cursor-pointer transition-all border-2 ${
                        playerRole === 'operator'
                            ? 'border-secondary bg-secondary/10 shadow-glow-cyan'
                            : 'border-border hover:border-secondary/50'
                    }`}
                    onClick={() => selectRole('operator')}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                      <Terminal className="w-8 h-8 text-secondary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Opérateur Console</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Guidez votre coéquipier avec les données techniques
                    </p>
                    {playerRole === 'operator' && (
                        <Badge className="bg-secondary">Sélectionné</Badge>
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
                    <span>Vous ({playerRole === 'agent' ? 'Agent' : playerRole === 'operator' ? 'Opérateur' : 'Non sélectionné'})</span>
                  </div>
                  <Badge variant={isReady ? 'default' : 'secondary'}>
                    {isReady ? '✓ Prêt' : 'En attente'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-card/50 rounded">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-secondary" />
                    <span>
                    Coéquipier {otherPlayer ? `(${otherPlayer.name})` : '(En attente de connexion...)'}
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
                onClick={toggleReady}
                variant={isReady ? 'default' : 'outline'}
                size="lg"
                className="w-full"
                disabled={!playerRole}
            >
              {isReady ? 'Prêt ✓' : 'Je suis prêt'}
            </Button>

            <Button
                onClick={startGame}
                disabled={!canStart}
                size="lg"
                className="w-full gap-2 shadow-glow-gold"
            >
              Commencer l'aventure
              <ArrowRight className="w-5 h-5" />
            </Button>

            {!canStart && roomPlayers.length === 2 && (
                <p className="text-sm text-muted-foreground text-center">
                  Les deux joueurs doivent choisir un rôle et être prêts
                </p>
            )}

            {roomPlayers.length < 2 && (
                <p className="text-sm text-muted-foreground text-center">
                  En attente du second joueur...
                </p>
            )}

            {!playerRole && (
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