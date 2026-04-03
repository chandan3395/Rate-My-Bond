import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";       
import { auth } from "../lib/firebase";         
import Logo from "./Logo";

const navItems = [
  { label: "Home", to: "/#home" },
  { label: "How it Works", to: "/#how-it-works" },
  { label: "Calculator", to: "/calculator" },
];

function Navbar({ onStartRating }) {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#081d1e]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
        <div className="flex items-center justify-between">
          <Logo />

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-sm font-medium text-white/75 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
  {user ? (
    // Logged in — show avatar, name, and sign out
    <div className="flex items-center gap-3">
      <img
        src={user.photoURL}
        alt={user.displayName}
        className="h-8 w-8 rounded-full border border-white/20"
      />
      <span className="text-sm text-white/75">{user.displayName}</span>
      <button
        type="button"
        onClick={handleSignOut}
        className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/5"
      >
        Sign out
      </button>
    </div>
  ) : (
    // Not logged in — show original sign in + start rating buttons
    <>
      <Link
        to="/signin"
        className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/5"
      >
        Sign in
      </Link>
      <button
        type="button"
        onClick={onStartRating}
        className="rounded-full bg-[#8fd7cf] px-5 py-2 text-sm font-semibold text-[#062021] shadow-soft transition hover:scale-[1.02] hover:bg-[#9fe5de]"
      >
        Start Rating
      </button>
    </>
  )}
</div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white transition hover:bg-white/5 md:hidden"
            aria-label="Open navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
            </span>
          </button>
        </div>

        {menuOpen ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-[#0d2b2c]/95 p-4 shadow-soft md:hidden">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
              <Link
                to="/signin"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/5"
                onClick={() => setMenuOpen(false)}
              >
                Sign in
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onStartRating();
                }}
                className="inline-flex items-center justify-center rounded-full bg-[#8fd7cf] px-5 py-2 text-sm font-semibold text-[#062021] shadow-soft transition hover:bg-[#9fe5de]"
              >
                Start Rating
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default Navbar;
