// Importation React
import React from "react";

// Importation ReactDOM
import ReactDOM from "react-dom/client";

// Importation composant principal
import App from "./App";

// Importation TailwindCSS
import "./index.css";

// Création du root React
ReactDOM.createRoot(document.getElementById("root")!).render(

  // Mode strict React
  <React.StrictMode>

    {/* Application */}
    <App />

  </React.StrictMode>
);