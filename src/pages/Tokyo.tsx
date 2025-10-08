import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "@/context/GameContext";
import { Navbar } from "@/components/Navbar";
import { ChatBox } from "@/components/ChatBox";
import { ModalEndGame } from "@/components/ModalEndGame";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle } from "lucide-react";
import { toast } from "sonner";

const Tokyo = () => {
  const navigate = useNavigate();
  const { completeCity, playerRole } = useGame();

  const [currentStep, setCurrentStep] = useState(1);
  const [showModal, setShowModal] = useState(false);

  // Énigme 1 : RGB Fusion
  const [rgbValues, setRgbValues] = useState({ r: 128, g: 128, b: 128 });
  const targetRgb = { r: 161, g: 75, b: 226 }; // #A14BE2

  // Énigme 2 : Mot binaire
  const [binaryWord, setBinaryWord] = useState("");

  // Énigme 3 : Séquence de couleurs
  const [sequence, setSequence] = useState<string[]>([]);
  const correctSequence = ["red", "green", "yellow", "blue"];

  const checkRgb = () => {
    const tolerance = 10;
    const rMatch = Math.abs(rgbValues.r - targetRgb.r) < tolerance;
    const gMatch = Math.abs(rgbValues.g - targetRgb.g) < tolerance;
    const bMatch = Math.abs(rgbValues.b - targetRgb.b) < tolerance;

    if (rMatch && gMatch && bMatch) {
      toast.success("✓ Couleur parfaite !");
      setCurrentStep(2);
    } else {
      toast.error("Continuez à ajuster les couleurs");
    }
  };

  const checkBinaryWord = () => {
    if (binaryWord.toUpperCase() === "ART") {
      toast.success("✓ Mot décodé correctement !");
      setCurrentStep(3);
    } else {
      toast.error("Décodage incorrect");
    }
  };

  const addToSequence = (color: string) => {
    const newSequence = [...sequence, color];
    setSequence(newSequence);

    if (newSequence.length === correctSequence.length) {
      if (JSON.stringify(newSequence) === JSON.stringify(correctSequence)) {
        toast.success("✓ Symphonie réussie !");
        setCurrentStep(4);
      } else {
        toast.error("Séquence incorrecte, recommencez");
        setSequence([]);
      }
    }
  };

  const allComplete = currentStep > 3;

  if (allComplete && !showModal) {
    setShowModal(true);
  }

  const handleContinue = () => {
    completeCity("tokyo");
    navigate("/credits");
  };

  const progress = ((currentStep - 1) / 3) * 100;

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
              {/* Énigme 1 - RGB Fusion */}
              {currentStep >= 1 && (
                  <Card
                      className={`p-6 ${
                          currentStep > 1 ? "border-primary bg-primary/5" : ""
                      }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold mb-1">
                        {currentStep > 1 ? (
                            <CheckCircle className="inline w-5 h-5 text-primary mr-2" />
                        ) : (
                            <Circle className="inline w-5 h-5 mr-2" />
                        )}
                        Énigme 1: RGB Fusion
                      </h3>
                      <Badge variant="secondary">Difficulté: Moyenne</Badge>
                    </div>

                    {currentStep === 1 && (
                        <div className="bg-muted/50 p-4 rounded-lg mb-4">
                          {playerRole === "operator" ? (
                              <>
                                <p className="font-semibold mb-2">📡 Opérateur:</p>
                                <div className="bg-card p-4 rounded border border-primary">
                                  <p className="text-3xl font-mono text-center text-primary">
                                    #A14BE2
                                  </p>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2 text-center">
                                  Envoyez le code couleur à l’agent.
                                </p>
                              </>
                          ) : (
                              <>
                                <p className="font-semibold mb-3">🧑‍🎨 Agent:</p>
                                <div className="space-y-3">
                                  {["r", "g", "b"].map((key) => (
                                      <div key={key}>
                                        <label className="text-sm mb-1 block">
                                          {key === "r"
                                              ? "Rouge"
                                              : key === "g"
                                                  ? "Vert"
                                                  : "Bleu"}
                                          : {rgbValues[key as "r" | "g" | "b"]}
                                        </label>
                                        <input
                                            type="range"
                                            min={0}
                                            max={255}
                                            value={rgbValues[key as "r" | "g" | "b"]}
                                            onChange={(e) =>
                                                setRgbValues((prev) => ({
                                                  ...prev,
                                                  [key]: Number(e.target.value),
                                                }))
                                            }
                                            className="w-full"
                                        />
                                      </div>
                                  ))}
                                </div>
                                <div
                                    className="h-24 rounded-lg border-2 border-border mt-4"
                                    style={{
                                      backgroundColor: `rgb(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b})`,
                                    }}
                                />
                                <Button onClick={checkRgb} className="w-full mt-3">
                                  Vérifier la couleur
                                </Button>
                              </>
                          )}
                        </div>
                    )}
                  </Card>
              )}

              {/* Énigme 2 - Transmission Binaire */}
              {currentStep >= 2 && (
                  <Card
                      className={`p-6 ${
                          currentStep > 2 ? "border-primary bg-primary/5" : ""
                      }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold mb-1">
                        {currentStep > 2 ? (
                            <CheckCircle className="inline w-5 h-5 text-primary mr-2" />
                        ) : (
                            <Circle className="inline w-5 h-5 mr-2" />
                        )}
                        Énigme 2: Transmission Binaire
                      </h3>
                      <Badge variant="secondary">Difficulté: Difficile</Badge>
                    </div>

                    {currentStep === 2 && (
                        <div className="bg-muted/50 p-4 rounded-lg mb-4">
                          {playerRole === "operator" ? (
                              <>
                                <p className="font-semibold mb-2">📡 Opérateur:</p>
                                <p className="mb-2">
                                  Mot à encoder: <span className="font-bold text-primary">ART</span>
                                </p>
                                <div className="bg-card p-3 rounded border border-border">
                                  <p className="text-sm text-muted-foreground mb-1">
                                    En binaire:
                                  </p>
                                  <p className="font-mono text-sm">
                                    01000001 01010010 01010100
                                  </p>
                                </div>
                              </>
                          ) : (
                              <>
                                <p className="font-semibold mb-2">🧑‍🎨 Agent:</p>
                                <p className="mb-3 text-sm">
                                  Décodez le message binaire de l'opérateur:
                                </p>
                                <Input
                                    placeholder="Mot décodé"
                                    value={binaryWord}
                                    onChange={(e) => setBinaryWord(e.target.value)}
                                    className="mb-2"
                                />
                                <Button onClick={checkBinaryWord} className="w-full">
                                  Vérifier le mot
                                </Button>
                              </>
                          )}
                        </div>
                    )}
                  </Card>
              )}

              {/* Énigme 3 - Séquence Simon */}
              {currentStep >= 3 && (
                  <Card
                      className={`p-6 ${
                          currentStep > 3 ? "border-primary bg-primary/5" : ""
                      }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold mb-1">
                        {currentStep > 3 ? (
                            <CheckCircle className="inline w-5 h-5 text-primary mr-2" />
                        ) : (
                            <Circle className="inline w-5 h-5 mr-2" />
                        )}
                        Énigme 3: Symphonie Numérique
                      </h3>
                      <Badge variant="secondary">Difficulté: Moyenne</Badge>
                    </div>

                    {currentStep === 3 && (
                        <div className="bg-muted/50 p-4 rounded-lg mb-4">
                          {playerRole === "operator" ? (
                              <>
                                <p className="font-semibold mb-2">📡 Opérateur:</p>
                                <p className="mb-2">Séquence à reproduire:</p>
                                <div className="flex gap-2 justify-center">
                                  <div className="w-12 h-12 bg-red-500 rounded-full"></div>
                                  <div className="w-12 h-12 bg-green-500 rounded-full"></div>
                                  <div className="w-12 h-12 bg-yellow-500 rounded-full"></div>
                                  <div className="w-12 h-12 bg-blue-500 rounded-full"></div>
                                </div>
                              </>
                          ) : (
                              <>
                                <p className="font-semibold mb-2">🧑‍🎨 Agent:</p>
                                <p className="mb-3 text-sm">
                                  Reproduisez la séquence donnée par l'opérateur :
                                </p>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                  {["red", "green", "yellow", "blue"].map((color) => (
                                      <Button
                                          key={color}
                                          onClick={() => addToSequence(color)}
                                          className={`h-16 bg-${color}-500 hover:bg-${color}-600`}
                                      />
                                  ))}
                                </div>
                                <div className="text-sm text-center">
                                  Séquence: {sequence.length}/{correctSequence.length}
                                </div>
                              </>
                          )}
                        </div>
                    )}
                  </Card>
              )}
            </div>
          </div>
        </main>

        <ChatBox />
        <ModalEndGame
            open={showModal}
            cityName="Tokyo"
            code="FUJI"
            onContinue={handleContinue}
        />
      </div>
  );
};

export default Tokyo;
