import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Navbar } from '@/components/Navbar';
import { ChatBox } from '@/components/ChatBox';
import { ModalEndGame } from '@/components/ModalEndGame';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle } from 'lucide-react';
import { toast } from 'sonner';

const Paris = () => {
  const navigate = useNavigate();
  const { completeCity, playerRole } = useGame();
  
  const [enigma1Complete, setEnigma1Complete] = useState(false);
  const [enigma2Complete, setEnigma2Complete] = useState(false);
  const [enigma3Complete, setEnigma3Complete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [binaryInput, setBinaryInput] = useState('');
  const [differencesFound, setDifferencesFound] = useState(0);

  const correctBinaryAnswer = '11'; // 1011 in binary = 11 in decimal
  const totalDifferences = 7;

  const checkBinary = () => {
    if (binaryInput === correctBinaryAnswer) {
      setEnigma1Complete(true);
      toast.success('✓ Cadenas déverrouillé !');
    } else {
      toast.error('Code incorrect, réessayez');
    }
  };

  const completeLabyrinth = () => {
    setEnigma2Complete(true);
    toast.success('✓ Labyrinthe résolu !');
  };

  const findDifference = () => {
    if (differencesFound < totalDifferences) {
      const newCount = differencesFound + 1;
      setDifferencesFound(newCount);
      if (newCount === totalDifferences) {
        setEnigma3Complete(true);
        toast.success('✓ Toutes les différences trouvées !');
      }
    }
  };

  const allComplete = enigma1Complete && enigma2Complete && enigma3Complete;

  if (allComplete && !showModal) {
    setShowModal(true);
  }

  const handleContinue = () => {
    completeCity('paris');
    navigate('/cities');
  };

  const progress = ((+enigma1Complete + +enigma2Complete + +enigma3Complete) / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-6xl mb-3">🗼</div>
            <h1 className="text-4xl font-bold mb-2">Paris - Le Louvre</h1>
            <p className="text-muted-foreground">Logique, observation et communication</p>
            
            <div className="mt-4 max-w-md mx-auto">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                Progression: {Math.round(progress)}%
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Énigme 1: Conversion Binaire */}
            <Card className={`p-6 ${enigma1Complete ? 'border-primary bg-primary/5' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    {enigma1Complete ? <CheckCircle className="inline w-5 h-5 text-primary mr-2" /> : <Circle className="inline w-5 h-5 mr-2" />}
                    Énigme 1: Conversion Binaire
                  </h3>
                  <Badge variant="secondary">Difficulté: Facile</Badge>
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                {playerRole === 'operator' ? (
                  <div>
                    <p className="font-semibold mb-2">📡 Opérateur:</p>
                    <p className="text-lg mb-2">Code binaire à transmettre à l'agent:</p>
                    <p className="text-3xl font-mono text-primary">1011</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold mb-2">🧑‍🎨 Agent:</p>
                    <p className="mb-3">L'opérateur vous donne un code binaire. Convertissez-le en décimal:</p>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Valeur décimale"
                        value={binaryInput}
                        onChange={(e) => setBinaryInput(e.target.value)}
                        disabled={enigma1Complete}
                      />
                      <Button onClick={checkBinary} disabled={enigma1Complete}>
                        Vérifier
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Énigme 2: Labyrinthe */}
            <Card className={`p-6 ${enigma2Complete ? 'border-primary bg-primary/5' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    {enigma2Complete ? <CheckCircle className="inline w-5 h-5 text-primary mr-2" /> : <Circle className="inline w-5 h-5 mr-2" />}
                    Énigme 2: Labyrinthe "Pacman"
                  </h3>
                  <Badge variant="secondary">Difficulté: Moyenne</Badge>
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                {playerRole === 'operator' ? (
                  <div>
                    <p className="font-semibold mb-2">📡 Opérateur:</p>
                    <p className="mb-2">Guidez l'agent avec ces directions:</p>
                    <p className="text-lg font-mono">→ HAUT → DROITE → BAS → DROITE → HAUT</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold mb-2">🧑‍🎨 Agent:</p>
                    <p className="mb-3">Suivez les directions de l'opérateur pour sortir du labyrinthe</p>
                    <div className="bg-card p-4 rounded border border-border mb-3">
                      <div className="grid grid-cols-5 gap-1 w-fit mx-auto">
                        {[...Array(25)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-8 h-8 rounded ${
                              i === 0 ? 'bg-secondary' : i === 24 ? 'bg-primary' : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <Button onClick={completeLabyrinth} disabled={enigma2Complete} className="w-full">
                      J'ai atteint la sortie
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Énigme 3: 7 Différences */}
            <Card className={`p-6 ${enigma3Complete ? 'border-primary bg-primary/5' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    {enigma3Complete ? <CheckCircle className="inline w-5 h-5 text-primary mr-2" /> : <Circle className="inline w-5 h-5 mr-2" />}
                    Énigme 3: Les 7 Différences
                  </h3>
                  <Badge variant="secondary">Difficulté: Moyenne</Badge>
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                {playerRole === 'operator' ? (
                  <div>
                    <p className="font-semibold mb-2">📡 Opérateur:</p>
                    <p className="mb-2">Vous avez l'original. Guidez l'agent vers les différences:</p>
                    <p className="text-sm">Coin haut gauche, centre, bas droite, etc.</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold mb-2">🧑‍🎨 Agent:</p>
                    <p className="mb-3">Trouvez les 7 différences avec l'aide de l'opérateur</p>
                    <div className="bg-card p-6 rounded border border-border mb-3 text-center">
                      <p className="text-6xl mb-3">🖼️</p>
                      <p className="text-sm text-muted-foreground">Cliquez pour trouver une différence</p>
                    </div>
                    <div className="mb-3">
                      <Progress value={(differencesFound / totalDifferences) * 100} className="h-3" />
                      <p className="text-sm text-center mt-2">
                        {differencesFound}/{totalDifferences} différences trouvées
                      </p>
                    </div>
                    <Button onClick={findDifference} disabled={enigma3Complete} className="w-full">
                      Différence trouvée !
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <ChatBox />
      <ModalEndGame
        open={showModal}
        cityName="Paris"
        onContinue={handleContinue}
      />
    </div>
  );
};

export default Paris;
