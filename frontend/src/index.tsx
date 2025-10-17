import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const container = document.getElementById("root");
if (!container) throw new Error("#root not found");
window.addEventListener("error", (e) => {
  console.error("GlobalError:", e?.error ?? e?.message);
});
window.addEventListener("unhandledrejection", (e) => {
  console.error("UnhandledRejection:", e?.reason);
});
ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
