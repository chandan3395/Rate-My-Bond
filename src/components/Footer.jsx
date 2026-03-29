import { Link } from "react-router-dom";

import Logo from "./Logo";

const footerLinks = [
  { label: "Terms and Conditions", to: "/terms" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Cookie Policy", to: "/cookies" },
  { label: "About", to: "/about" },
  { label: "Help", to: "/help" },
];

function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 pb-8 pt-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 rounded-[2rem] border border-white/10 bg-white/5 px-8 py-8 shadow-soft lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xl text-sm leading-7 text-white/60">
              Bond analysis, cleaner workflows, and a sign-in path ready for
              Google OAuth.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm text-white/70 sm:flex-row sm:flex-wrap sm:justify-end sm:gap-6">
            {footerLinks.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <span className="text-white/50">Email:</span>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright (c) 2026 Rate My Bond. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="transition hover:text-white">
              Privacy
            </Link>
            <Link to="/terms" className="transition hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
