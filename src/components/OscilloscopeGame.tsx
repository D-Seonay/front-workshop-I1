import { useEffect, useRef, useState } from 'react';

export const OscilloscopeGame = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [running, setRunning] = useState(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        let xOffset = 0;

        const drawFrame = () => {
            if (!running) return;

            // Clear
            ctx.fillStyle = '#1f2937'; // bg-muted style
            ctx.fillRect(0, 0, width, height);

            // Trace signal sinusoïdal fixe
            ctx.beginPath();
            ctx.strokeStyle = '#10b981'; // vert oscillo
            ctx.lineWidth = 2;

            for (let x = 0; x < width; x++) {
                const y = height / 2 + Math.sin((x + xOffset) * 0.05) * 50;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }

            ctx.stroke();
            xOffset += 2;

            requestAnimationFrame(drawFrame);
        };

        drawFrame();
    }, [running]);

    // Échelle verticale (volts)
    const scaleValues = [10, 7.5, 5, 2.5, 0];

    return (
        <div className="flex items-center gap-2">
            {/* Échelle verticale */}
            <div className="flex flex-col justify-between h-[150px] text-xs text-muted-foreground">
                {scaleValues.map((v) => (
                    <span key={v}>{v} V</span>
                ))}
            </div>

            {/* Canvas */}
            <canvas
                ref={canvasRef}
                width={500}
                height={150}
                className="rounded-lg border border-border bg-muted"
            />
        </div>
    );
};
