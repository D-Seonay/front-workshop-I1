import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGame } from '@/context/GameContext';
import { Trophy, Home, RotateCcw } from 'lucide-react';

const Credits = () => {
  const navigate = useNavigate();
  const { timeElapsed, resetTimer } = useGame();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReplay = () => {
    resetTimer();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-3xl w-full">
        <Card className="p-12 bg-card/80 backdrop-blur text-center">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow-gold animate-pulse">
              <Trophy className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Mission Accomplie !
          </h1>

          <p className="text-xl text-foreground mb-2">
            Grâce à votre collaboration,
          </p>
          <p className="text-xl text-foreground font-semibold mb-8">
            l'art du monde entier a été restauré.
          </p>

          <div className="bg-muted/50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Codes de Restauration</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-3xl mb-2">🗼</div>
                <p className="text-sm text-muted-foreground mb-1">Paris</p>
                <Badge className="font-mono text-lg">LISA</Badge>
              </div>
              <div>
                <div className="text-3xl mb-2">🗽</div>
                <p className="text-sm text-muted-foreground mb-1">New York</p>
                <Badge className="font-mono text-lg">ARTS</Badge>
              </div>
              <div>
                <div className="text-3xl mb-2">🏮</div>
                <p className="text-sm text-muted-foreground mb-1">Tokyo</p>
                <Badge className="font-mono text-lg">UNITY</Badge>
              </div>
            </div>
          </div>

          <div className="bg-gradient-cyber/10 rounded-lg p-4 mb-8 border border-secondary/30">
            <p className="text-lg text-foreground leading-relaxed">
              "Vous avez appris à <span className="font-bold text-primary">décoder</span>, 
              à <span className="font-bold text-secondary">observer</span> et 
              à <span className="font-bold text-accent">communiquer</span> — 
              tout comme les grands explorateurs du savoir."
            </p>
          </div>

          <div className="inline-block bg-muted/50 px-6 py-3 rounded-full mb-8">
            <p className="text-sm text-muted-foreground mb-1">Temps total</p>
            <p className="text-2xl font-bold font-mono">{formatTime(timeElapsed)}</p>
          </div>

          <div className="border-t border-border pt-8 mb-6">
            <p className="text-2xl font-bold mb-2 bg-gradient-cyber bg-clip-text text-transparent">
              Quand l'art unit le monde,
            </p>
            <p className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              il renaît.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={handleReplay} size="lg" className="gap-2 shadow-glow-gold">
              <RotateCcw className="w-5 h-5" />
              Rejouer
            </Button>
            <Button onClick={() => navigate('/')} variant="secondary" size="lg" className="gap-2">
              <Home className="w-5 h-5" />
              Accueil
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Credits;
