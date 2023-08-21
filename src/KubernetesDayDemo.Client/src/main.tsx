import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Index } from "./pages/Index";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
      <div className="absolute inset-0 bg-[url(/azure-logo.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <Index />
    </div>
  </React.StrictMode>
);
