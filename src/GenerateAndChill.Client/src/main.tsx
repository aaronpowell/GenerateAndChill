import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Index, action as generateAction } from "./pages/Index";
import { LoadingPage } from "./pages/Loading";
import { ImagePage, loader as imageLoader } from "./pages/Image";
import { NaughtyPage } from "./pages/Naughty";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    action: generateAction,
  },
  {
    path: "/loading",
    element: <LoadingPage />,
  },
  {
    path: "/naughty",
    element: <NaughtyPage />,
  },
  {
    path: "/:id",
    element: <ImagePage />,
    loader: imageLoader,
    action: generateAction,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        backgroundColor: "#24292e",
        color: "#fff",
        padding: 10,
        zIndex: 9999,
        borderBottomLeftRadius: 10,
      }}
    >
      <a
        href="https://github.com/aaronpowell/generateandchill"
        style={{ color: "#fff", textDecoration: "none" }}
      >
        Fork me on GitHub{" "}
        <img
          src="/github-light.svg"
          style={{ height: "16px", display: "inline" }}
        />
      </a>
    </div>
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
      <div className="absolute inset-0 bg-[url(/images/yow-demos.png)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>
);
