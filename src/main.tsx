import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { WalletContextProvider } from "@/providers/WalletContextProvider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <WalletContextProvider>
    <App />
  </WalletContextProvider>
);
