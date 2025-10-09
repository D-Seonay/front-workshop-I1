import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Landmark, Plus, LogIn, Globe } from 'lucide-react';
import { socketService } from '@/services/socketService';
import { useToast } from '@/hooks/use-toast';

const Home = () => {
  const navigate = useNavigate();
  const { setSessionId } = useGame();
  const [joinCode, setJoinCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const { toast } = useToast();

  // Connexion au serveur Socket.IO au montage
  useEffect(() => {
    const serverUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';
    socketService.connect(serverUrl);

    return () => {
      socketService.removeAllListeners();
    };
  }, []);

  const createSession = async () => {
    setIsCreating(true);
    try {
      const username = localStorage.getItem('username') || `Player_${Math.random().toString(36).substring(2, 7)}`;
      localStorage.setItem('username', username);

      // Écouter l'événement room_created
      socketService.onRoomCreated((data) => {
        setSessionId(data.code);
        navigate('/lobby');
      });

      socketService.onError((error) => {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.message,
        });
        setIsCreating(false);
      });

      socketService.createRoom(username);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la session",
      });
      setIsCreating(false);
    }
  };

  const joinSession = async () => {
    if (!joinCode.trim()) return;
    
    setIsJoining(true);
    try {
      const username = localStorage.getItem('username') || `Player_${Math.random().toString(36).substring(2, 7)}`;
      localStorage.setItem('username', username);

      // Écouter l'événement room_joined
      socketService.onRoomJoined((data) => {
        setSessionId(data.room.roomId);
        navigate('/lobby');
      });

      socketService.onError((error) => {
        toast({
          variant: "destructive",
          title: "Session introuvable",
          description: error.message,
        });
        setIsJoining(false);
      });

      socketService.joinRoom(joinCode.toUpperCase(), username);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de rejoindre la session",
      });
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow-gold animate-pulse">
              <Landmark className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Voyage dans les Musées Perdus
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            Une cyberattaque a effacé les musées du monde…<br />
            <span className="text-foreground font-semibold">Restaurez-les avant qu'il ne soit trop tard.</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-card/50 backdrop-blur border-border hover:border-primary transition-all hover:shadow-glow-gold">
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-3">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Créer une partie</h3>
                <p className="text-sm text-muted-foreground">
                  Lancez une nouvelle mission et invitez un coéquipier
                </p>
              </div>
              <Button 
                onClick={createSession} 
                className="w-full mt-auto shadow-glow-gold"
                size="lg"
                disabled={isCreating}
              >
                {isCreating ? 'Création...' : 'Nouvelle Mission'}
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur border-border hover:border-secondary transition-all hover:shadow-glow-cyan">
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-3">
                  <LogIn className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Rejoindre une partie</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Entrez le code de session pour commencer
                </p>
              </div>
              <div className="space-y-3 mt-auto">
                <Input
                  placeholder="Code de session (ex: ABC123)"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && joinSession()}
                  className="text-center font-mono text-lg"
                  maxLength={6}
                />
                <Button 
                  onClick={joinSession} 
                  variant="secondary"
                  className="w-full"
                  size="lg"
                  disabled={!joinCode.trim() || isJoining}
                >
                  {isJoining ? 'Connexion...' : 'Rejoindre'}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="w-4 h-4" />
            Collaboration • Communication • Art
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
