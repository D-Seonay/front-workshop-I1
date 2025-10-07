import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGame } from '@/context/GameContext';
import { Trophy, Home, RotateCcw, Skull } from 'lucide-react';

const Credits = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get('status') || 'success'; // "success" ou "failure"

  const { timeRemaining, setMissionFailed, resetTimer } = useGame();

  const isFailure = status === 'failure';

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReplay = () => {
    resetTimer();
    setMissionFailed(false);
    navigate('/');
  };

  return (
      <div
          className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${
              isFailure ? 'bg-gradient-to-b from-black via-gray-900 to-red-950' : 'bg-gradient-dark'
          }`}
      >
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          {!isFailure ? (
              <>
                <div className="absolute top-10 left-10 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl animate-pulse delay-1000"></div>
              </>
          ) : (
              <>
                <div className="absolute top-0 left-0 w-96 h-96 bg-red-900 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-800 rounded-full blur-3xl animate-pulse delay-1000"></div>
              </>
          )}
        </div>

        <div className="relative z-10 max-w-3xl w-full">
          <Card
              className={`p-12 backdrop-blur text-center transition-all ${
                  isFailure ? 'bg-card/80 border-red-800 shadow-lg' : 'bg-card/80'
              }`}
          >
            <div className="flex justify-center mb-6">
              <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg animate-pulse ${
                      isFailure
                          ? 'bg-gradient-to-br from-red-800 to-black shadow-glow-red'
                          : 'bg-gradient-primary shadow-glow-gold'
                  }`}
              >
                {isFailure ? (
                    <Skull className="w-12 h-12 text-red-100" />
                ) : (
                    <Trophy className="w-12 h-12 text-primary-foreground" />
                )}
              </div>
            </div>

            <h1
                className={`text-4xl md:text-5xl font-bold mb-4 ${
                    isFailure
                        ? 'bg-gradient-to-r from-red-500 to-gray-300 bg-clip-text text-transparent'
                        : 'bg-gradient-primary bg-clip-text text-transparent'
                }`}
            >
              {isFailure ? 'Mission Échouée' : 'Mission Accomplie !'}
            </h1>

            <p className="text-xl text-foreground mb-2">
              {isFailure
                  ? 'Le temps imparti est écoulé...'
                  : 'Grâce à votre collaboration,'}
            </p>
            <p className="text-xl text-foreground font-semibold mb-8">
              {isFailure
                  ? "L'art du monde reste plongé dans l'ombre."
                  : "l'art du monde entier a été restauré."}
            </p>

            <div
                className={`rounded-lg p-4 mb-8 border ${
                    isFailure ? 'bg-red-950/30 border-red-700' : 'bg-gradient-cyber/10 border-secondary/30'
                }`}
            >
              <p className="text-lg text-foreground leading-relaxed">
                {isFailure ? (
                    <>
                      "Chaque seconde compte... mais même dans l’échec, les véritables agents{" "}
                      <span className="font-bold text-red-400">apprennent</span> et{" "}
                      <span className="font-bold text-gray-300">persévèrent</span>."
                    </>
                ) : (
                    <>
                      "Vous avez appris à <span className='font-bold text-primary'>décoder</span>, à{" "}
                      <span className='font-bold text-secondary'>observer</span> et à{" "}
                      <span className='font-bold text-accent'>communiquer</span> — tout comme les
                      grands explorateurs du savoir."
                    </>
                )}
              </p>
            </div>

            <div className="inline-block bg-muted/50 px-6 py-3 rounded-full mb-8">
              <p className="text-sm text-muted-foreground mb-1">
                {isFailure ? 'Temps écoulé' : 'Temps total'}
              </p>
              <p className="text-2xl font-bold font-mono">
                {formatTime(timeRemaining)}
              </p>
            </div>

            <div className="border-t border-border pt-8 mb-6">
              <p
                  className={`text-2xl font-bold mb-2 ${
                      isFailure
                          ? 'bg-gradient-to-r from-red-500 to-gray-400 bg-clip-text text-transparent'
                          : 'bg-gradient-cyber bg-clip-text text-transparent'
                  }`}
              >
                {isFailure
                    ? "L'art attend toujours ses héros..."
                    : "Quand l'art unit le monde,"}
              </p>
              {!isFailure && (
                  <p className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    il renaît.
                  </p>
              )}
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                  onClick={handleReplay}
                  size="lg"
                  className={`gap-2 ${
                      isFailure ? 'shadow-glow-red bg-red-700 hover:bg-red-800' : 'shadow-glow-gold'
                  }`}
              >
                <RotateCcw className="w-5 h-5" />
                Rejouer
              </Button>
            </div>
          </Card>
        </div>
      </div>
  );
};

export default Credits;

