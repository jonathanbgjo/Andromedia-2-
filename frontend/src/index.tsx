// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import "./theme.css";

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <AuthProvider>       
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
