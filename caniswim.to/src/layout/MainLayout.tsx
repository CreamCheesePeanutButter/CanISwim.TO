import { Outlet } from "react-router-dom";
import { NavBar } from "../components/NavBar.tsx";

export function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen width-full">
      <NavBar />
      <main className="grow p-4">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center width-full">
        &copy; {new Date().getFullYear()} CanISwim.TO. All rights reserved.
      </footer>
    </div>
  );
}
