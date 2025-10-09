import { useState } from 'react';

type FileSystem = {
    [key: string]: any;
};

interface TerminalGameProps {
    onComplete?: () => void;
}

const initialFs: FileSystem = {
    '/': {
        security: {
            'security.config': true,
            'securityboot.config': true,
            'alarm.sh': true,
        },
        display: {
            'screen.config': true,
        },
        museum: {
            'config.txt': true,
            'screen.sh': true,
        },
    },
};

export const TerminalGame = ({ onComplete }: TerminalGameProps) => {
    const [fs, setFs] = useState<FileSystem>(structuredClone(initialFs));
    const [currentPath, setCurrentPath] = useState<string[]>(['/']);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState<string[]>([]);

    const pathToString = (path: string[]) => path.join('/') === '//' ? '/' : path.join('/');

    const runCommand = () => {
        const [cmd, arg] = input.trim().split(' ');
        let newOutput: string[] = [];

        // Naviguer jusqu'au dossier courant
        let pointer: any = fs['/'];
        for (let i = 1; i < currentPath.length; i++) {
            pointer = pointer[currentPath[i]];
        }

        switch (cmd) {
            case 'ls':
                newOutput = Object.keys(pointer);
                break;

            case 'cd':
                if (!arg) {
                    newOutput = ['bash: cd: argument manquant'];
                } else if (arg === '..') {
                    if (currentPath.length > 1) setCurrentPath(currentPath.slice(0, -1));
                } else if (pointer[arg]) {
                    setCurrentPath([...currentPath, arg]);
                } else {
                    newOutput = [`bash: cd: ${arg}: Aucun dossier de ce nom`];
                }
                break;

            case 'rm':
                if (!arg) {
                    newOutput = ['bash: rm: argument manquant'];
                } else if (pointer[arg]) {
                    const updatedFs = structuredClone(fs);
                    let p: any = updatedFs['/'];
                    for (let i = 1; i < currentPath.length; i++) p = p[currentPath[i]];
                    delete p[arg];
                    setFs(updatedFs);
                    newOutput = [`Fichier supprimé: ${arg}`];

                    if (arg === 'alarm.sh' && onComplete) onComplete();
                } else {
                    newOutput = [`bash: rm: ${arg}: Aucun fichier de ce nom`];
                }
                break;

            default:
                newOutput = [`bash: ${cmd}: commande introuvable`];
        }

        setOutput(prev => [...prev, `$ ${input}`, ...newOutput]);
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') runCommand();
    };

    return (
        <div className="bg-card p-3 rounded font-mono text-sm">
            <div className="mb-2 text-secondary">{pathToString(currentPath)} $</div>
            <div className="mb-2">
                {output.map((line, i) => (
                    <div key={i}>{line}</div>
                ))}
            </div>
            <input
                className="w-full bg-muted/50 p-2 rounded border border-border focus:outline-none focus:ring focus:ring-primary"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tapez votre commande..."
            />
        </div>
    );
};
