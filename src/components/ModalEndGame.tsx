import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Trophy, ArrowRight } from 'lucide-react';

interface ModalEndGameProps {
  open: boolean;
  cityName: string;
  code: string;
  onContinue: () => void;
}

export const ModalEndGame = ({ open, cityName, code, onContinue }: ModalEndGameProps) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow-gold">
              <Trophy className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Mission Accomplie !</DialogTitle>
          <DialogDescription className="text-center space-y-4">
            <p>Vous avez restauré le musée de <span className="font-bold text-primary">{cityName}</span> !</p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Code de restauration</p>
              <p className="text-3xl font-bold font-mono text-primary tracking-wider">{code}</p>
            </div>
            <p className="text-sm">
              L'art a été sauvé grâce à votre collaboration exceptionnelle.
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-4">
          <Button onClick={onContinue} className="gap-2 shadow-glow-gold">
            Continuer l'aventure
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
