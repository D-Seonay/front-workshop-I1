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
import { CheckCircle, Circle, Terminal } from "lucide-react";
import { toast } from "sonner";
import {TerminalGame} from "@/components/TerminalGame.tsx";
import {SingleSlotPuzzle} from "@/components/SingleSlotPuzzle.tsx";
import { useLobby } from "@/context/LobbyProvider";
import { useEffect } from "react";
import { useSocket } from "@/context/SocketProvider";


const NewYork = () => {
  const navigate = useNavigate();
  const { completeCity } = useGame();
const { room, currentPlayerId, updateStep, onStepUpdated } = useLobby();
const { socket } = useSocket();

const currentPlayer = room?.players.find(p => p.id === currentPlayerId);

  const [currentStep, setCurrentStep] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const [commandInput, setCommandInput] = useState("");
  const [shapeCode, setShapeCode] = useState("");
  const [artPlaced, setArtPlaced] = useState(0);

  const correctCommand = "edit security.config";
  const correctShapeCode = "336";
  const totalArtworks = 6;

  useEffect(() => {
  onStepUpdated((step) => {
    console.log("🗽 Synchro reçue pour New York :", step);
    setCurrentStep(step);
  });
}, [onStepUpdated]);


const checkCommand = () => {
  toast.success("✓ Fichier de sécurité corrigé !");
  setCurrentStep(2);
  updateStep(2); // 🔄 synchro
};

const checkShapeCode = () => {
  if (shapeCode === correctShapeCode) {
    toast.success("✓ Code validé !");
    setCurrentStep(3);
    updateStep(3); // 🔄 synchro
  } else {
    toast.error("Code incorrect");
  }
};

const handleArtComplete = () => {
  toast.success("🎨 Puzzle terminé !");
  setShowModal(true);
  updateStep(4); // 🔄 étape finale si besoin
};


  const handleContinue = () => {
    completeCity("newyork");
    navigate("/cities");
  };

  const progress = ((currentStep - 1) / 3) * 100;

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
              {/* Énigme 1 */}
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
                        Énigme 1: Terminal de Sécurité
                      </h3>
                      <Badge variant="secondary">Difficulté: Moyenne</Badge>
                    </div>

                    {currentStep === 1 && (
                        <div className="bg-muted/50 p-4 rounded-lg mb-4">
                          {currentPlayer?.role === "operator" ? (
                              <>
                                <p className="font-semibold mb-2">📡 Opérateur:</p>
                                <div className="bg-card border border-border rounded p-3 font-mono text-sm mb-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-secondary">system@moma:~$</span>
                                  </div>
                                  <TerminalGame onComplete={checkCommand} />
                                </div>
                              </>
                          ) : (
                              <>
                                <p className="font-semibold mb-2">🧑‍🎨 Agent:</p>
                                <p className="mb-3">Fichier à supprimer:</p>
                                <div className="bg-card p-4 rounded border border-destructive">
                                  <p className="text-2xl font-bold text-destructive">alarm.sh</p>
                                  <p className="text-sm text-muted-foreground mt-2">
                                    Statut: SECURITY
                                  </p>
                                </div>
                              </>
                          )}
                        </div>
                    )}
                  </Card>
              )}


              {/* Énigme 2 */}
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
                        Énigme 2: Trouver le Code
                      </h3>
                      <Badge variant="secondary">Difficulté: Moyenne</Badge>
                    </div>

                    {currentStep === 2 && (
                        <div className="bg-muted/50 p-4 rounded-lg mb-4">
                          {currentPlayer?.role === "operator" ? (
                              <>
                                <p className="font-semibold mb-2">📡 Opérateur:</p>
                                <div className="flex justify-center items-center gap-6">
                                  {/* Rond */}
                                  <div className="w-12 h-12 bg-primary rounded-full"/>

                                  {/* Triangle */}
                                  <div
                                      className="w-0 h-0 border-l-[24px] border-r-[24px] border-b-[40px] border-l-transparent border-r-transparent border-b-primary"
                                  />

                                  {/* Carré */}
                                  <div className="w-12 h-12 bg-primary rounded-sm"/>
                                </div>

                              </>
                          ) : (
                              <>
                                <p className="font-semibold mb-2">🧑‍🎨 Agent:</p>
                                <p className="mb-3">Trouvez le code à 3 chiffres :</p>
                                <div className="flex justify-center items-center gap-4">
                                <img
                                      src="../../public/AshantiStool.png"
                                      alt="Ashanti Stool"
                                      className="rounded-lg w-60 h-auto object-contain"
                                  />
                                  <img
                                      src="../../public/ReggioSchool.png"
                                      alt="Reggio School"
                                      className="rounded-lg w-60 h-auto object-contain"
                                  />
                                  <img
                                      src="../../public/Filaments.png"
                                      alt="Filaments"
                                      className="rounded-lg w-60 h-auto object-contain"
                                  />
                                </div>
                                <Input
                                    type="text"
                                    placeholder="Code à 3 chiffres"
                                    value={shapeCode}
                                    onChange={(e) => setShapeCode(e.target.value)}
                                    maxLength={3}
                                    className="mb-2"
                                />
                                <Button onClick={checkShapeCode} className="w-full">
                                  Valider le code
                                </Button>
                              </>
                          )}
                        </div>
                    )}
                  </Card>
              )}

              {/* Énigme 3 */}
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
                        Énigme 3: Replacer le tableau
                      </h3>
                      <Badge variant="secondary">Difficulté: Moyenne</Badge>
                    </div>

                    {currentStep === 3 && (
                        <div className="bg-muted/50 p-4 rounded-lg mb-4">
                          {currentPlayer?.role === "operator" ? (
                              <>
                                <p className="font-semibold mb-2">📡 Opérateur:</p>
                                <ol className="text-sm space-y-1">
                                  <li>1. Starry Night</li>
                                  <li>2. Les Demoiselles</li>
                                  <li>3. Campbell's Soup</li>
                                  <li>4. Marilyn Monroe</li>
                                  <li>5. The Persistence</li>
                                  <li>6. Broadway Boogie</li>
                                </ol>
                              </>
                          ) : (
                              <>
                                <p className="font-semibold mb-2">🧑‍🎨 Agent:</p>
                                <p className="mb-3">
                                  Replacez l'œuvres à son emplacement correct:
                                </p>
<SingleSlotPuzzle onComplete={handleArtComplete} />
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
            cityName="New York"
            code="STAR"
            onContinue={handleContinue}
        />
      </div>
  );
};

export default NewYork;