import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Metaverse from "./pages/Metaverse";
import Properties from "./pages/Properties";
import Dashboard from "./pages/Dashboard";
import Property3DViewer from "./pages/Property3DViewer";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { PropertyModal } from "./components/property/PropertyModal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/metaverse" element={<Metaverse />} />
          <Route path="/metaverse/:propertyId" element={<Property3DViewer />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <PropertyModal />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
