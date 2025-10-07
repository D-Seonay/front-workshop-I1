import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import CitySelection from "./pages/CitySelection";
import Paris from "./pages/Paris";
import NewYork from "./pages/NewYork";
import Tokyo from "./pages/Tokyo";
import Credits from "./pages/Credits";
import NotFound from "./pages/NotFound";
import GameWatcher from "@/components/GameWatcher.ts";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <GameProvider>
          <GameWatcher /> {/* ⚡ observe missionFailed et navigate */}
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lobby" element={<Lobby />} />
              <Route path="/cities" element={<CitySelection />} />
              <Route path="/paris" element={<Paris />} />
              <Route path="/newyork" element={<NewYork />} />
              <Route path="/tokyo" element={<Tokyo />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </GameProvider>
      </BrowserRouter>
    </QueryClientProvider>
);

export default App;
