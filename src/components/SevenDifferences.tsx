import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";



const differences = [
    { xPct: 0.0853, yPct: 0.0430, rPct: 0.0163 },
    { xPct: 0.3451, yPct: 0.1133, rPct: 0.0195 },
    { xPct: 0.3939, yPct: 0.0469, rPct: 0.0163 },
    { xPct: 0.8372, yPct: 0.4414, rPct: 0.0163 },
    { xPct: 0.4993, yPct: 0.6396, rPct: 0.0163 },
    { xPct: 0.9310, yPct: 0.8936, rPct: 0.0163 },
    { xPct: 0.4066, yPct: 0.1934, rPct: 0.0163 },
];

export default function SevenDifferences({ onComplete }) {
    const totalDifferences = differences.length;
    const [found, setFound] = useState([]);

    const handleClick = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        differences.forEach((diff, index) => {
            // Conversion des pourcentages en pixels réels selon la taille actuelle de l'image
            const diffX = diff.xPct * rect.width;
            const diffY = diff.yPct * rect.height;
            const r = diff.rPct * rect.width; // rayon basé sur la largeur

            const distance = Math.sqrt((x - diffX) ** 2 + (y - diffY) ** 2);

            if (distance < r && !found.includes(index)) {
                setFound((prev) => [...prev, index]);
            }
        });
    };


    const allFound = found.length === totalDifferences;

    return (
        <div>
            <p className="font-semibold mb-2">🧑‍🎨 Agent :</p>
            <p className="mb-3">
                Trouvez les 7 différences avec l'aide de l'opérateur.
            </p>

            <div className="relative inline-block cursor-crosshair" onClick={handleClick}>
                <img
                    src="../../public/ARCHE_NOE_DIFF.png"
                    alt="7 Differences"
                    className="rounded-lg max-w-full"
                />

                {/* Cercles rouges sur différences trouvées */}
                {found.map((index) => {
                    const { x, y, r } = differences[index];
                    return (
                        <div
                            key={index}
                            className="absolute border-4 border-red-500 rounded-full"
                            style={{
                                left: x - r,
                                top: y - r,
                                width: r * 2,
                                height: r * 2,
                            }}
                        />
                    );
                })}
            </div>

            <div className="mb-3 mt-4">
                <Progress value={(found.length / totalDifferences) * 100} className="h-3" />
                <p className="text-sm text-center mt-2">
                    {found.length}/{totalDifferences} différences trouvées
                </p>
            </div>

            {allFound ? (
                <Button onClick={onComplete} className="w-full">
                    Valider les différences trouvées
                </Button>
            ) : (
                <Button disabled className="w-full opacity-50">
                    Trouvez toutes les différences pour valider
                </Button>
            )}
        </div>
    );
}
