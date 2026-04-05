import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

const NAV_LINKS = [
  { to: "/",              label: "Dashboard", end: true },
  { to: "/files",         label: "Upload" },
  { to: "/files/transfer",label: "Transfer" },
  { to: "/patients",      label: "Patients" },
];

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-indigo-700 to-indigo-600 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl tracking-tight no-underline">
            <span className="text-2xl">🏥</span>
            <span>Medi<span className="text-indigo-200">File</span></span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to} to={to} end={end}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 no-underline ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-indigo-100 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* User section — always visible */}
          <div className="flex items-center gap-2">
            {user && (
              <>
                <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:block text-white text-sm font-medium max-w-[120px] truncate">
                  {user.name}
                </span>
              </>
            )}
            <div className="hidden md:flex items-center gap-2 ml-1">
              {user ? (
                <button
                  onClick={logout}
                  className="px-4 py-1.5 text-sm font-medium rounded-lg border border-white/30 text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" className="px-4 py-1.5 text-sm font-medium rounded-lg bg-white text-indigo-600 hover:bg-indigo-50 transition-colors no-underline">
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-3 flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to} to={to} end={end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg text-sm font-medium no-underline ${
                    isActive ? "bg-white/20 text-white" : "text-indigo-100 hover:bg-white/10"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            {user ? (
              <button onClick={logout} className="text-left px-3 py-2.5 text-sm text-indigo-200 hover:text-white cursor-pointer">
                Logout ({user.name})
              </button>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-2.5 text-sm text-indigo-200 hover:text-white no-underline">
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

