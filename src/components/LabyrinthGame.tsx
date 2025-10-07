import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LabyrinthGameProps {
    onComplete: () => void;
}

export const LabyrinthGame = ({ onComplete }: LabyrinthGameProps) => {
    const gridSize = 5;
    const start = { x: 0, y: 0 };
    const goal = { x: 4, y: 4 };
    const [player, setPlayer] = useState(start);
    const [isStarted, setIsStarted] = useState(false);

    // Optionnel : mur (exemple)
    const walls = [
        { x: 1, y: 1 },
        { x: 1, y: 3 },
        { x: 1, y: 4 },
        { x: 2, y: 1 },
        { x: 3, y: 0 },
        { x: 3, y: 1 },
        { x: 3, y: 3 },
        { x: 4, y: 3 },
    ];

    const isWall = (x: number, y: number) =>
        walls.some((w) => w.x === x && w.y === y);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!isStarted) return;

            let { x, y } = player;
            if (e.key === "ArrowUp") y--;
            if (e.key === "ArrowDown") y++;
            if (e.key === "ArrowLeft") x--;
            if (e.key === "ArrowRight") x++;

            // Vérifie les limites
            if (x < 0 || y < 0 || x >= gridSize || y >= gridSize) return;
            if (isWall(x, y)) return;

            const newPos = { x, y };
            setPlayer(newPos);

            // Vérifie si gagné
            if (x === goal.x && y === goal.y) {
                toast.success("🎉 Vous avez atteint la sortie !");
                setTimeout(onComplete, 800);
            }
        },
        [player, isStarted, onComplete]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div className="flex flex-col items-center">
            {!isStarted ? (
                <Button onClick={() => setIsStarted(true)} className="mb-3">
                    Commencer le labyrinthe
                </Button>
            ) : (
                <p className="text-sm mb-2 text-muted-foreground">
                    Utilisez les flèches du clavier pour vous déplacer
                </p>
            )}

            <div className="bg-card p-4 rounded border border-border mb-3">
                <div
                    className="grid gap-1"
                    style={{
                        gridTemplateColumns: `repeat(${gridSize}, 2rem)`,
                        gridTemplateRows: `repeat(${gridSize}, 2rem)`,
                    }}
                >
                    {[...Array(gridSize * gridSize)].map((_, i) => {
                        const x = i % gridSize;
                        const y = Math.floor(i / gridSize);

                        const isPlayer = x === player.x && y === player.y;
                        const isGoal = x === goal.x && y === goal.y;
                        const wall = isWall(x, y);

                        let bg = "bg-muted";
                        if (isPlayer) bg = "bg-secondary";
                        else if (isGoal) bg = "bg-primary";

                        return (
                            <div
                                key={i}
                                className={`w-8 h-8 rounded ${bg} border border-border`}
                            />
                        );
                    })}
                </div>
            </div>

            {isStarted && (
                <Button onClick={() => setPlayer(start)} variant="outline" size="sm">
                    Réinitialiser
                </Button>
            )}
        </div>
    );
};
