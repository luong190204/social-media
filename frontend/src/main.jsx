import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          className: "rounded-xl shadow-lg border bg-white/90 backdrop-blur-sm",
        }}
      />
    </BrowserRouter>
  </StrictMode>
);
