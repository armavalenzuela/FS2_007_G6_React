import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import "./styles/admin.css";
import App from "./App.jsx";
import { SesionProvider } from "./context/SesionContext.jsx";
import { CarritoProvider } from "./context/CarritoContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SesionProvider>
        <CarritoProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </CarritoProvider>
      </SesionProvider>
    </BrowserRouter>
  </StrictMode>
);
