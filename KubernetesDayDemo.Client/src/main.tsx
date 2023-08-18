import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Index } from "./pages/Index";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
      <div className="absolute inset-0 bg-[url(https://dalleproduse.blob.core.windows.net/private/images/2f18adec-e106-47b5-a019-bd0914568dc2/generated_00.png?se=2023-08-19T01%3A06%3A55Z&sig=40bKP8rtmzQvzJwaJ8WUV49k2etACvB5a9lcPnnI11E%3D&ske=2023-08-19T01%3A54%3A40Z&skoid=09ba021e-c417-441c-b203-c81e5dcd7b7f&sks=b&skt=2023-08-12T01%3A54%3A40Z&sktid=33e01921-4d64-4f8c-a055-5bdaffd5e33d&skv=2020-10-02&sp=r&spr=https&sr=b&sv=2020-10-02)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <Index />
    </div>
  </React.StrictMode>
);
