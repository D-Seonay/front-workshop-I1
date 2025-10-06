import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Navbar } from '@/components/Navbar';
import { ChatBox } from '@/components/ChatBox';
import { ModalEndGame } from '@/components/ModalEndGame';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle } from 'lucide-react';
import { toast } from 'sonner';

const Tokyo = () => {
  const navigate = useNavigate();
  const { completeCity } = useGame();
  
  const [enigma1Complete, setEnigma1Complete] = useState(false);
  const [enigma2Complete, setEnigma2Complete] = useState(false);
  const [enigma3Complete, setEnigma3Complete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [rgbValues, setRgbValues] = useState({ r: 128, g: 128, b: 128 });
  const [binaryWord, setBinaryWord] = useState('');
  const [sequence, setSequence] = useState<string[]>([]);

  const targetRgb = { r: 161, g: 75, b: 226 }; // #A14BE2
  const correctSequence = ['red', 'green', 'yellow', 'blue'];

  const checkRgb = () => {
    const tolerance = 10;
    const rMatch = Math.abs(rgbValues.r - targetRgb.r) < tolerance;
    const gMatch = Math.abs(rgbValues.g - targetRgb.g) < tolerance;
    const bMatch = Math.abs(rgbValues.b - targetRgb.b) < tolerance;
    
    if (rMatch && gMatch && bMatch) {
      setEnigma1Complete(true);
      toast.success('✓ Couleur parfaite !');
    } else {
      toast.error('Continuez à ajuster les couleurs');
    }
  };

  const checkBinaryWord = () => {
    if (binaryWord.toUpperCase() === 'ART') {
      setEnigma2Complete(true);
      toast.success('✓ Mot décodé correctement !');
    } else {
      toast.error('Décodage incorrect');
    }
  };

  const addToSequence = (color: string) => {
    const newSequence = [...sequence, color];
    setSequence(newSequence);
    
    if (newSequence.length === correctSequence.length) {
      if (JSON.stringify(newSequence) === JSON.stringify(correctSequence)) {
        setEnigma3Complete(true);
        toast.success('✓ Symphonie réussie !');
      } else {
        toast.error('Séquence incorrecte, recommencez');
        setSequence([]);
      }
    }
  };

  const allComplete = enigma1Complete && enigma2Complete && enigma3Complete;

  if (allComplete && !showModal) {
    setShowModal(true);
  }

  const handleContinue = () => {
    completeCity('tokyo');
    navigate('/credits');
  };

  const progress = ((+enigma1Complete + +enigma2Complete + +enigma3Complete) / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-6xl mb-3">🏮</div>
            <h1 className="text-4xl font-bold mb-2">Tokyo - Musée Numérique</h1>
            <p className="text-muted-foreground">Art numérique et synchronisation</p>
            
            <div className="mt-4 max-w-md mx-auto">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                Progression: {Math.round(progress)}%
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Énigme 1: RGB */}
            <Card className={`p-6 ${enigma1Complete ? 'border-primary bg-primary/5' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    {enigma1Complete ? <CheckCircle className="inline w-5 h-5 text-primary mr-2" /> : <Circle className="inline w-5 h-5 mr-2" />}
                    Énigme 1: RGB Fusion
                  </h3>
                  <Badge variant="secondary">Difficulté: Moyenne</Badge>
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold mb-2">📡 Code pour l'opérateur:</p>
                    <div className="bg-card p-4 rounded border border-primary">
                      <p className="text-3xl font-mono text-center text-primary">#A14BE2</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-semibold mb-3">🧑‍🎨 Agent - Ajustez les couleurs:</p>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm mb-1 block">Rouge: {rgbValues.r}</label>
                        <Slider
                          value={[rgbValues.r]}
                          onValueChange={([r]) => setRgbValues(prev => ({ ...prev, r }))}
                          max={255}
                          disabled={enigma1Complete}
                        />
                      </div>
                      <div>
                        <label className="text-sm mb-1 block">Vert: {rgbValues.g}</label>
                        <Slider
                          value={[rgbValues.g]}
                          onValueChange={([g]) => setRgbValues(prev => ({ ...prev, g }))}
                          max={255}
                          disabled={enigma1Complete}
                        />
                      </div>
                      <div>
                        <label className="text-sm mb-1 block">Bleu: {rgbValues.b}</label>
                        <Slider
                          value={[rgbValues.b]}
                          onValueChange={([b]) => setRgbValues(prev => ({ ...prev, b }))}
                          max={255}
                          disabled={enigma1Complete}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div
                    className="h-24 rounded-lg border-2 border-border"
                    style={{ backgroundColor: `rgb(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b})` }}
                  />
                  <Button onClick={checkRgb} disabled={enigma1Complete} className="w-full mt-3">
                    Vérifier la couleur
                  </Button>
                </div>
              </div>
            </Card>

            {/* Énigme 2: Binaire */}
            <Card className={`p-6 ${enigma2Complete ? 'border-primary bg-primary/5' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    {enigma2Complete ? <CheckCircle className="inline w-5 h-5 text-primary mr-2" /> : <Circle className="inline w-5 h-5 mr-2" />}
                    Énigme 2: Transmission Binaire
                  </h3>
                  <Badge variant="secondary">Difficulté: Difficile</Badge>
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold mb-2">📡 Opérateur:</p>
                    <p className="mb-2">Mot à encoder: <span className="font-bold text-primary">ART</span></p>
                    <div className="bg-card p-3 rounded border border-border">
                      <p className="text-sm text-muted-foreground mb-1">En binaire:</p>
                      <p className="font-mono text-sm">01000001 01010010 01010100</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-semibold mb-2">🧑‍🎨 Agent:</p>
                    <p className="mb-3 text-sm">Décodez le message binaire de l'opérateur:</p>
                    <Input
                      placeholder="Mot décodé"
                      value={binaryWord}
                      onChange={(e) => setBinaryWord(e.target.value)}
                      disabled={enigma2Complete}
                      className="mb-2"
                    />
                    <Button onClick={checkBinaryWord} disabled={enigma2Complete} className="w-full">
                      Vérifier le mot
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Énigme 3: Simon */}
            <Card className={`p-6 ${enigma3Complete ? 'border-primary bg-primary/5' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    {enigma3Complete ? <CheckCircle className="inline w-5 h-5 text-primary mr-2" /> : <Circle className="inline w-5 h-5 mr-2" />}
                    Énigme 3: Symphonie Numérique
                  </h3>
                  <Badge variant="secondary">Difficulté: Moyenne</Badge>
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold mb-2">📡 Opérateur:</p>
                    <p className="mb-2">Séquence à reproduire:</p>
                    <div className="flex gap-2 justify-center">
                      <div className="w-12 h-12 bg-red-500 rounded-full"></div>
                      <div className="w-12 h-12 bg-green-500 rounded-full"></div>
                      <div className="w-12 h-12 bg-yellow-500 rounded-full"></div>
                      <div className="w-12 h-12 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-semibold mb-2">🧑‍🎨 Agent:</p>
                    <p className="mb-3 text-sm">Reproduisez la séquence:</p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <Button
                        onClick={() => addToSequence('red')}
                        disabled={enigma3Complete}
                        className="h-16 bg-red-500 hover:bg-red-600"
                      />
                      <Button
                        onClick={() => addToSequence('green')}
                        disabled={enigma3Complete}
                        className="h-16 bg-green-500 hover:bg-green-600"
                      />
                      <Button
                        onClick={() => addToSequence('yellow')}
                        disabled={enigma3Complete}
                        className="h-16 bg-yellow-500 hover:bg-yellow-600"
                      />
                      <Button
                        onClick={() => addToSequence('blue')}
                        disabled={enigma3Complete}
                        className="h-16 bg-blue-500 hover:bg-blue-600"
                      />
                    </div>
                    <div className="text-sm text-center">
                      Séquence: {sequence.length}/{correctSequence.length}
                    </div>
                    {sequence.length > 0 && sequence.length < correctSequence.length && (
                      <Button
                        onClick={() => setSequence([])}
                        variant="ghost"
                        size="sm"
                        className="w-full mt-2"
                      >
                        Recommencer
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <ChatBox />
      <ModalEndGame
        open={showModal}
        cityName="Tokyo"
        code="UNITY"
        onContinue={handleContinue}
      />
    </div>
  );
};

export default Tokyo;
