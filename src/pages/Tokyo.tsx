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
import {OscilloscopeGame} from "@/components/OscilloscopeGame.tsx";

const Tokyo = () => {
  const navigate = useNavigate();
  const { completeCity, playerRole } = useGame();

  const [voltCode, setVoltCode] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [showModal, setShowModal] = useState(false);

  // Énigme 1 : Oscilloscope
  const correctVoltage = "5";

  // Énigme 2 : Kanjis
  const [kanjiWord, setKanjiWord] = useState("");
  const listOfKanji = ["Rêve", "Coeur", "Voie", "Âme"];
  let i = 0;

  // Énigme 3 : Séquence de couleurs
  const [sequence, setSequence] = useState<string[]>([]);
  const correctSequence = ["red", "green", "yellow", "blue"];


  const checkVoltCode = () => {
    if (voltCode === correctVoltage) {
      toast.success("✓ Code validé !");
      setCurrentStep(2);
    } else {
      toast.error("Code incorrect");
    }
  };

  const normalize = (str: string) =>
      str
          .normalize("NFD")                 // décompose les caractères accentués
          .replace(/[\u0300-\u036f]/g, "")  // supprime les diacritiques (accents)
          .toLowerCase()                    // passe en minuscules
          .trim();                          // enlève les espaces inutiles

  const checkKanjiWord = () => {
    const inputWords = kanjiWord
        .split(/[,\s]+/)
        .map(normalize)
        .filter(Boolean);

    if (inputWords.length === 0) {
      toast.error("Entrez au moins un mot");
      return;
    }

    // Normalise aussi la liste de référence
    const normalizedList = listOfKanji.map(normalize);

    // Vérifie que les deux listes contiennent les mêmes éléments (ordre indifférent)
    const sameLength = inputWords.length === normalizedList.length;
    const allInList = inputWords.every(w => normalizedList.includes(w));
    const noExtra = normalizedList.every(w => inputWords.includes(w));

    if (sameLength && allInList && noExtra) {
      toast.success("✅ Tous les mots sont corrects !");
      setKanjiWord("");
      setCurrentStep(3);
    } else {
      toast.error("❌ Certains mots sont incorrects ou manquants");
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
              {/* Énigme 1 - Oscilloscope */}
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
                        Énigme 1: Signal électrique
                      </h3>
                      <Badge variant="secondary">Difficulté: Moyenne</Badge>
                    </div>

                    {currentStep === 1 && (
                        <div className="bg-muted/50 p-4 rounded-lg mb-4">
                          {playerRole === "operator" ? (
                              <>
                                <p className="font-semibold mb-2">📡 Opérateur:</p>
                                <p className="text-sm text-muted-foreground mt-2 text-center">
                                  <Input
                                      type="text"
                                      placeholder="Tension du courant"
                                      value={voltCode}
                                      onChange={(e) => setVoltCode(e.target.value)}
                                      maxLength={6}
                                      className="mb-2"
                                  />
                                  <Button onClick={checkVoltCode} className="w-full">
                                    Valider le code
                                  </Button>
                                </p>
                              </>
                          ) : (
                              <>
                                <p className="font-semibold mb-3">🧑‍🎨 Agent:</p>
                                <OscilloscopeGame />
                              </>
                          )}
                        </div>
                    )}
                  </Card>
              )}


              {/* Énigme 2 - Kanji et signification */}
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
                        Énigme 2: Kanjis et Signification
                      </h3>
                      <Badge variant="secondary">Difficulté: Difficile</Badge>
                    </div>

                    {currentStep === 2 && (
                        <div className="bg-muted/50 p-4 rounded-lg mb-4">
                          {playerRole === "operator" ? (
                              <>
                                <p className="font-semibold mb-2">📡 Opérateur :</p>

                                <div className="grid grid-cols-5 gap-4 text-center font-serif">
                                  {[
                                    { kanji: "風", traduction: "Vent" },
                                    { kanji: "夢", traduction: "Rêve" },
                                    { kanji: "力", traduction: "Force" },
                                    { kanji: "心", traduction: "Cœur" },
                                    { kanji: "海", traduction: "Mer" },
                                    { kanji: "道", traduction: "Voie" },
                                    { kanji: "愛", traduction: "Amour" },
                                    { kanji: "魂", traduction: "Âme" },
                                    { kanji: "光", traduction: "Lumière" },
                                    { kanji: "静", traduction: "Calme" },
                                  ].map(({ kanji, traduction }) => (
                                      <div key={kanji}>
                                        <div className="text-2xl">{kanji}</div>
                                        <div className="text-sm text-muted-foreground">{traduction}</div>
                                      </div>
                                  ))}
                                </div>
                              </>
                          ) : (
                              <>
                                <p className="font-semibold mb-2">🧑‍🎨 Agent :</p>
                                <p className="mb-3 text-sm">Trouver les mots clés :</p>
                                <div className="bg-card p-4 rounded border border-border text-center">
                                  <img
                                      src="../../public/Kanjis.png"
                                      alt="Original"
                                      className="rounded-lg mx-auto max-w-full"
                                  />
                                </div>
                                <Input
                                    placeholder="Mots décodé"
                                    value={kanjiWord}
                                    onChange={(e) => setKanjiWord(e.target.value)}
                                    className="mb-2"
                                />
                                <Button onClick={checkKanjiWord} className="w-full">
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
            onContinue={handleContinue}
        />
      </div>
  );
};

export default Tokyo;
