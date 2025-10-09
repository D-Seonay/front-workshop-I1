import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SingleSlotPuzzleProps {
    onComplete: () => void;
}

interface Painting {
    id: string;
    src: string; // chemin de l'image
    alt: string;
}

export const SingleSlotPuzzle = ({ onComplete }: SingleSlotPuzzleProps) => {
    const paintings: Painting[] = [
        { id: "p1", src: "../../public/tableau1.png", alt: "Tableau 1" },
        { id: "p2", src: "../../public/tableau2.png", alt: "Tableau 2" }, // correct
        { id: "p3", src: "../../public/tableau3.png", alt: "Tableau 3" },
    ];

    const correctPaintingId = "p2";

    const [dragged, setDragged] = useState<string | null>(null);
    const [slot, setSlot] = useState<string | null>(null);

    const handleDragStart = (id: string) => setDragged(id);

    const handleDrop = () => {
        if (!dragged) return;
        setSlot(dragged);

        if (dragged === correctPaintingId) {
            toast.success("✅ Bon tableau placé !");
            setTimeout(onComplete, 500);
        } else {
            toast.error("❌ Mauvais tableau !");
        }
        setDragged(null);
    };

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();

    const reset = () => setSlot(null);

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="flex gap-4">
                {/* Tableaux à glisser */}
                <div className="flex flex-col gap-2">
                    {paintings.map((p) => (
                        <img
                            key={p.id}
                            src={p.src}
                            alt={p.alt}
                            draggable
                            onDragStart={() => handleDragStart(p.id)}
                            className="w-20 h-20 object-cover rounded border border-border cursor-grab"
                        />
                    ))}
                </div>

                {/* Slot unique */}
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="w-24 h-24 bg-muted border-2 border-dashed border-border rounded flex items-center justify-center"
                >
                    {slot ? (
                        <img
                            src={paintings.find((p) => p.id === slot)?.src}
                            alt={paintings.find((p) => p.id === slot)?.alt}
                            className="w-full h-full object-cover rounded"
                        />
                    ) : (
                        "Déposez ici"
                    )}
                </div>
            </div>

            <Button onClick={reset} variant="outline" size="sm">
                Réinitialiser
            </Button>
        </div>
    );
};
