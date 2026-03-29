import { useState } from "react";
import { Link } from "react-router-dom";

import Logo from "./Logo";

const navItems = [
  { label: "Home", to: "/#home" },
  { label: "How it Works", to: "/#how-it-works" },
  { label: "Calculator", to: "/#calculator" },
];

const moreItems = [
  { label: "About", to: "/about" },
  { label: "Help", to: "/help" },
  { label: "Privacy Policy", to: "/privacy" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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

            <div className="group relative">
              <button
                type="button"
                className="flex items-center gap-2 text-sm font-medium text-white/75 transition hover:text-white"
              >
                More
                <svg
                  className="h-4 w-4 transition group-hover:translate-y-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.51a.75.75 0 0 1-1.08 0l-4.25-4.51a.75.75 0 0 1 .02-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <div className="invisible absolute left-1/2 top-full mt-4 w-44 -translate-x-1/2 rounded-2xl border border-white/10 bg-[#0d2b2c]/95 p-2 opacity-0 shadow-soft transition duration-200 group-hover:visible group-hover:opacity-100">
                {moreItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="block rounded-xl px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/signin"
              className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/5"
            >
              Sign in
            </Link>
            <Link
              to="/signin"
              className="rounded-full bg-[#8fd7cf] px-5 py-2 text-sm font-semibold text-[#062021] shadow-soft transition hover:scale-[1.02] hover:bg-[#9fe5de]"
            >
              Start Rating
            </Link>
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
              {moreItems.map((item) => (
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
              <Link
                to="/signin"
                className="inline-flex items-center justify-center rounded-full bg-[#8fd7cf] px-5 py-2 text-sm font-semibold text-[#062021] shadow-soft transition hover:bg-[#9fe5de]"
                onClick={() => setMenuOpen(false)}
              >
                Start Rating
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default Navbar;
