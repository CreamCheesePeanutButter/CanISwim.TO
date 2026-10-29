import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App.tsx";
import { MainLayout } from "./layout/MainLayout.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MapPage } from "./pages/MapPage.tsx";
import { NotFoundPage } from "./pages/NotFoundPage.tsx";
import { MainPage } from "./pages/MainPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFoundPage />, // TODO: THE NOT FOUND PAGE IS NOT DONE YET JUST A DEMO
    children: [
      {
        index: true,
        element: <MainPage />, // TODO: YOUR MAIN PAGE GOES HERE. - DONEE
      },
      {
        path: "map",
        element: <MapPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
);
