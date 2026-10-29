import { NavLink } from "react-router-dom";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Map", to: "/map" },
];

export function NavBar() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <nav
        aria-label="Main navigation"
        className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3"
      >
        {/* Header Branding */}
        <NavLink to="/" className="flex items-center gap-3">
          <div className="bg-emerald-700 p-2 rounded-xl text-white shadow-sm shadow-emerald-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <span className="text-base font-bold text-gray-900">CanISwim.TO</span>
        </NavLink>

        {/* Navigation Links */}
        <ul className="flex gap-2">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-emerald-50 text-emerald-800"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}