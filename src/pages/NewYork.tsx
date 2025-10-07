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
import { CheckCircle, Circle, Terminal } from 'lucide-react';
import { toast } from 'sonner';

const NewYork = () => {
  const navigate = useNavigate();
  const { completeCity, playerRole } = useGame();
  
  const [enigma1Complete, setEnigma1Complete] = useState(false);
  const [enigma2Complete, setEnigma2Complete] = useState(false);
  const [enigma3Complete, setEnigma3Complete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [commandInput, setCommandInput] = useState('');
  const [shapeCode, setShapeCode] = useState('');
  const [artPlaced, setArtPlaced] = useState(0);

  const correctCommand = 'edit security.config';
  const correctShapeCode = '532194';
  const totalArtworks = 6;

  const checkCommand = () => {
    if (commandInput.toLowerCase() === correctCommand) {
      setEnigma1Complete(true);
      toast.success('✓ Fichier de sécurité corrigé !');
    } else {
      toast.error('Commande incorrecte');
    }
  };

  const checkShapeCode = () => {
    if (shapeCode === correctShapeCode) {
      setEnigma2Complete(true);
      toast.success('✓ Code validé !');
    } else {
      toast.error('Code incorrect');
    }
  };

  const placeArtwork = () => {
    if (artPlaced < totalArtworks) {
      const newCount = artPlaced + 1;
      setArtPlaced(newCount);
      if (newCount === totalArtworks) {
        setEnigma3Complete(true);
        toast.success('✓ Tous les tableaux replacés !');
      }
    }
  };

  const allComplete = enigma1Complete && enigma2Complete && enigma3Complete;

  if (allComplete && !showModal) {
    setShowModal(true);
  }

  const handleContinue = () => {
    completeCity('newyork');
    navigate('/cities');
  };

  const progress = ((+enigma1Complete + +enigma2Complete + +enigma3Complete) / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-6xl mb-3">🗽</div>
            <h1 className="text-4xl font-bold mb-2">New York - MoMA</h1>
            <p className="text-muted-foreground">Logique moderne et analyse</p>
            
            <div className="mt-4 max-w-md mx-auto">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                Progression: {Math.round(progress)}%
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Énigme 1: Terminal */}
            <Card className={`p-6 ${enigma1Complete ? 'border-primary bg-primary/5' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    {enigma1Complete ? <CheckCircle className="inline w-5 h-5 text-primary mr-2" /> : <Circle className="inline w-5 h-5 mr-2" />}
                    Énigme 1: Terminal de Sécurité
                  </h3>
                  <Badge variant="secondary">Difficulté: Moyenne</Badge>
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                {playerRole === 'operator' ? (
                  <div>
                    <p className="font-semibold mb-2">📡 Opérateur:</p>
                    <div className="bg-card border border-border rounded p-3 font-mono text-sm mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Terminal className="w-4 h-4 text-secondary" />
                        <span className="text-secondary">system@moma:~$</span>
                      </div>
                      <p className="text-muted-foreground mb-1"># Fichiers disponibles:</p>
                      <p>- security.config (ERREUR)</p>
                      <p>- database.db</p>
                      <p>- artwork_list.json</p>
                      <p className="mt-2 text-muted-foreground"># Tapez la commande pour corriger le fichier</p>
                    </div>
                    <Input
                      placeholder="Entrez votre commande..."
                      value={commandInput}
                      onChange={(e) => setCommandInput(e.target.value)}
                      disabled={enigma1Complete}
                      className="font-mono"
                    />
                    <Button onClick={checkCommand} disabled={enigma1Complete} className="w-full mt-2">
                      Exécuter
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold mb-2">🧑‍🎨 Agent:</p>
                    <p className="mb-3">Fichier à corriger:</p>
                    <div className="bg-card p-4 rounded border border-destructive">
                      <p className="text-2xl font-bold text-destructive">security.config</p>
                      <p className="text-sm text-muted-foreground mt-2">Statut: ERREUR</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Énigme 2: Formes */}
            <Card className={`p-6 ${enigma2Complete ? 'border-primary bg-primary/5' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    {enigma2Complete ? <CheckCircle className="inline w-5 h-5 text-primary mr-2" /> : <Circle className="inline w-5 h-5 mr-2" />}
                    Énigme 2: Compter les Formes
                  </h3>
                  <Badge variant="secondary">Difficulté: Difficile</Badge>
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                {playerRole === 'operator' ? (
                  <div>
                    <p className="font-semibold mb-2">📡 Opérateur:</p>
                    <p className="mb-2">Méthode de comptage:</p>
                    <ul className="text-sm space-y-1 mb-3">
                      <li>• Carrés → 5</li>
                      <li>• Triangles → 3</li>
                      <li>• Cercles → 2</li>
                      <li>• Hexagones → 1</li>
                      <li>• Étoiles → 9</li>
                      <li>• Losanges → 4</li>
                    </ul>
                    <p className="text-sm text-muted-foreground">Code: 532194</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold mb-2">🧑‍🎨 Agent:</p>
                    <p className="mb-3">Comptez chaque type de forme et créez le code à 6 chiffres:</p>
                    <div className="grid grid-cols-3 gap-2 mb-4 text-4xl text-center">
                      <div>⬜</div>
                      <div>🔺</div>
                      <div>⚪</div>
                      <div>⬡</div>
                      <div>⭐</div>
                      <div>🔶</div>
                    </div>
                    <Input
                      type="text"
                      placeholder="Code à 6 chiffres"
                      value={shapeCode}
                      onChange={(e) => setShapeCode(e.target.value)}
                      disabled={enigma2Complete}
                      maxLength={6}
                      className="mb-2"
                    />
                    <Button onClick={checkShapeCode} disabled={enigma2Complete} className="w-full">
                      Valider le code
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Énigme 3: Placement d'art */}
            <Card className={`p-6 ${enigma3Complete ? 'border-primary bg-primary/5' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    {enigma3Complete ? <CheckCircle className="inline w-5 h-5 text-primary mr-2" /> : <Circle className="inline w-5 h-5 mr-2" />}
                    Énigme 3: Remettre les Tableaux
                  </h3>
                  <Badge variant="secondary">Difficulté: Moyenne</Badge>
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                {playerRole === 'operator' ? (
                  <div>
                    <p className="font-semibold mb-2">📡 Opérateur:</p>
                    <p className="mb-2">Ordre officiel des œuvres:</p>
                    <ol className="text-sm space-y-1">
                      <li>1. Starry Night</li>
                      <li>2. Les Demoiselles</li>
                      <li>3. Campbell's Soup</li>
                      <li>4. Marilyn Monroe</li>
                      <li>5. The Persistence</li>
                      <li>6. Broadway Boogie</li>
                    </ol>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold mb-2">🧑‍🎨 Agent:</p>
                    <p className="mb-3">Replacez les œuvres dans le bon ordre avec l'aide de l'opérateur:</p>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className={`p-4 rounded border text-center ${
                            i < artPlaced ? 'border-primary bg-primary/10' : 'border-border'
                          }`}
                        >
                          <p className="text-3xl mb-1">🖼️</p>
                          <p className="text-xs">Position {i + 1}</p>
                        </div>
                      ))}
                    </div>
                    <Progress value={(artPlaced / totalArtworks) * 100} className="h-3 mb-3" />
                    <Button onClick={placeArtwork} disabled={enigma3Complete} className="w-full">
                      Placer l'œuvre ({artPlaced}/{totalArtworks})
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
        cityName="New York"
        onContinue={handleContinue}
      />
    </div>
  );
};

export default NewYork;
