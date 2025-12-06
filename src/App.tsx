import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TemposPage from "./pages/TemposPage";
import VelocidadePage from "./pages/VelocidadePage";
import ForcaPage from "./pages/ForcaPage";
import PotenciaPage from "./pages/PotenciaPage";
import VidaFerramentaPage from "./pages/VidaFerramentaPage";
import EconomiaPage from "./pages/EconomiaPage";
import RugosidadePage from "./pages/RugosidadePage";
import OtimizacaoPage from "./pages/OtimizacaoPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tempos" element={<TemposPage />} />
          <Route path="/velocidade" element={<VelocidadePage />} />
          <Route path="/forca" element={<ForcaPage />} />
          <Route path="/potencia" element={<PotenciaPage />} />
          <Route path="/vida-ferramenta" element={<VidaFerramentaPage />} />
          <Route path="/economia" element={<EconomiaPage />} />
          <Route path="/rugosidade" element={<RugosidadePage />} />
          <Route path="/otimizacao" element={<OtimizacaoPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
