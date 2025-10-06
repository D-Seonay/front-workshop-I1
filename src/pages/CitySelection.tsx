import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Navbar } from '@/components/Navbar';
import { ChatBox } from '@/components/ChatBox';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, CheckCircle, MapPin } from 'lucide-react';

const CitySelection = () => {
  const navigate = useNavigate();
  const { completedCities, setCurrentCity } = useGame();

  const cities = [
    {
      id: 'paris',
      name: 'Paris',
      icon: '🗼',
      description: 'Le Louvre a besoin de vous',
      unlocked: true,
      route: '/paris',
    },
    {
      id: 'newyork',
      name: 'New York',
      icon: '🗽',
      description: 'MoMA attend votre intervention',
      unlocked: completedCities.includes('paris'),
      route: '/newyork',
    },
    {
      id: 'tokyo',
      name: 'Tokyo',
      icon: '🏮',
      description: 'Mission finale au musée numérique',
      unlocked: completedCities.includes('newyork'),
      route: '/tokyo',
    },
  ];

  const handleCitySelect = (city: typeof cities[0]) => {
    if (city.unlocked) {
      setCurrentCity(city.id);
      navigate(city.route);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            Carte du Monde
          </h1>
          <p className="text-muted-foreground">
            Sélectionnez un musée à restaurer
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {cities.map((city) => {
            const isCompleted = completedCities.includes(city.id);
            const isLocked = !city.unlocked;

            return (
              <Card
                key={city.id}
                className={`relative p-6 cursor-pointer transition-all ${
                  isLocked
                    ? 'opacity-50 cursor-not-allowed'
                    : isCompleted
                    ? 'border-primary bg-primary/5 shadow-glow-gold'
                    : 'hover:border-primary/50 hover:shadow-elegant'
                }`}
                onClick={() => handleCitySelect(city)}
              >
                {isCompleted && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                )}
                
                {isLocked && (
                  <div className="absolute top-3 right-3">
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}

                <div className="text-6xl mb-4 text-center">{city.icon}</div>
                
                <h3 className="text-2xl font-bold text-center mb-2">{city.name}</h3>
                
                <p className="text-sm text-muted-foreground text-center mb-4">
                  {city.description}
                </p>

                {isCompleted ? (
                  <Badge variant="default" className="w-full justify-center">
                    ✓ Restauré
                  </Badge>
                ) : isLocked ? (
                  <Badge variant="secondary" className="w-full justify-center">
                    🔒 Verrouillé
                  </Badge>
                ) : (
                  <Button className="w-full" variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    Accéder
                  </Button>
                )}
              </Card>
            );
          })}
        </div>

        <div className="bg-card/50 backdrop-blur border border-border rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Progression de la mission
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Musées restaurés</span>
              <span className="font-bold text-primary">{completedCities.length}/3</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-primary h-2 rounded-full transition-all shadow-glow-gold"
                style={{ width: `${(completedCities.length / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </main>

      <ChatBox />
    </div>
  );
};

export default CitySelection;
