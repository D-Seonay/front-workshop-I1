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
import {LabyrinthGame} from "@/components/LabyrinthGame.tsx";
import SevenDifferences from "@/components/SevenDifferences.tsx";

const Paris = () => {
  const navigate = useNavigate();
  const { completeCity, playerRole } = useGame();

  const [currentMission, setCurrentMission] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const [binaryInput, setBinaryInput] = useState('');
  const [differencesFound, setDifferencesFound] = useState(0);

  const correctBinaryAnswer = '11'; // 1011 en binaire = 11 décimal
  const totalDifferences = 7;
  // p
  // --- Fonctions de résolution ---
  const checkBinary = () => {
    if (binaryInput === correctBinaryAnswer) {
      toast.success('✓ Cadenas déverrouillé !');
      setCurrentMission(2); // passe à la mission 2
    } else {
      toast.error('Code incorrect, réessayez');
    }
  };

  const completeLabyrinth = () => {
    toast.success('✓ Labyrinthe résolu !');
    setCurrentMission(3); // passe à la mission 3
  };

  const handleContinue = () => {
    completeCity('paris');
    navigate('/cities');
  };

  // --- Calcul de progression ---
  const progress = (() => {
    if (currentMission === 1) return 0;
    if (currentMission === 2) return 33;
    if (currentMission === 3) return 66 + (differencesFound / totalDifferences) * 34;
    return 100;
  })();

  return (
      <div className="min-h-screen bg-gradient-dark">
        <Navbar />

        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <div className="text-6xl mb-3">🗼</div>
            <h1 className="text-4xl font-bold mb-2">Paris - Le Louvre</h1>
            <p className="text-muted-foreground">Logique, observation et communication</p>

            <div className="mt-4 max-w-md mx-auto">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">Progression: {Math.round(progress)}%</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Énigme 1: Conversion Binaire */}
            {currentMission === 1 && (
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">
                        <Circle className="inline w-5 h-5 mr-2" />
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
                            />
                            <Button onClick={checkBinary}>Vérifier</Button>
                          </div>
                        </div>
                    )}
                  </div>
                </Card>
            )}

            {/* Énigme 2: Labyrinthe */}
            {currentMission === 2 && (
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">
                        <Circle className="inline w-5 h-5 mr-2" />
                        Énigme 2: Labyrinthe "Pacman"
                      </h3>
                      <Badge variant="secondary">Difficulté: Moyenne</Badge>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg mb-4">
                    {playerRole === 'operator' ? (
                        <div className="bg-card p-4 rounded border border-border mb-3">
                          <div className="grid grid-cols-5 gap-1 w-fit mx-auto">
                            {[...Array(25)].map((_, i) => {
                              const x = i % 5;
                              const y = Math.floor(i / 5);
                              // Cases rouges fixes
                              const bgColor =
                                  (x === 1 && y === 1) ||
                                  (x === 1 && y === 3) ||
                                  (x === 1 && y === 4) ||
                                  (x === 2 && y === 1) ||
                                  (x === 3 && y === 0) ||
                                  (x === 3 && y === 1) ||
                                  (x === 3 && y === 3) ||
                                  (x === 4 && y === 3)
                                      ? "bg-red-500"
                                      : i === 0
                                          ? "bg-secondary"
                                          : i === 24
                                              ? "bg-primary"
                                              : "bg-muted";
                              return <div key={i} className={`w-8 h-8 rounded ${bgColor}`}/>;
                            })}
                          </div>
                        </div>

                    ) : (
                        <LabyrinthGame onComplete={completeLabyrinth}/>
                    )}
                  </div>
                </Card>
            )}

            {/* Énigme 3: 7 Différences */}
            {currentMission === 3 && (
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">
                        <Circle className="inline w-5 h-5 mr-2" />
                        Énigme 3 : Les 7 Différences
                      </h3>
                      <Badge variant="secondary">Difficulté : Difficile</Badge>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg mb-4">
                    {playerRole === "operator" ? (
                        // VUE OPÉRATEUR
                        <div>
                          <p className="font-semibold mb-2">📡 Opérateur :</p>
                          <p className="mb-2">
                            Vous avez l'image originale. Guidez l'agent vers les différences.
                          </p>
                          <div className="bg-card p-4 rounded border border-border text-center">
                            <img
                                src="../../public/ARCHE_NOE.JPG"
                                alt="Original"
                                className="rounded-lg mx-auto max-w-full"
                            />
                          </div>
                        </div>
                    ) : (
                        // VUE AGENT
                        <SevenDifferences onComplete={() => setShowModal(true)} />
                    )}
                  </div>
                </Card>
            )}

          </div>
        </main>
        <ChatBox/>
        <ModalEndGame open={showModal} cityName="Paris" onContinue={handleContinue} />
      </div>
  );
};

export default Paris;
