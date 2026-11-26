import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { MainLayout } from "./layout/MainLayout.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MapPage } from "./pages/MapPage.tsx";
import { NotFoundPage } from "./pages/NotFoundPage.tsx";
import { MainPage } from "./pages/MainPage.tsx";
import { BeachInfoPage } from "./pages/BeachInfoPage.tsx";
import { PoolInfoPage } from "./pages/PoolInfoPage.tsx";
import { LocationInfoLayout } from "./layout/LocationInfoLayout.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFoundPage />, // TODO: THE NOT FOUND PAGE IS NOT DONE YET JUST A DEMO
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "map",
        element: <MapPage />,
      },
      {
        path: "location",
        element: <LocationInfoLayout />,
        children: [
          {
            path: "beach/:beachId", // URL: /location/beach/123
            element: <BeachInfoPage />,
          },
          {
            path: "pool/:id", // URL: /location/pool/123
            element: <PoolInfoPage />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
