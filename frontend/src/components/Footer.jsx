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
        <div className="rounded-[2rem] border border-white/10 bg-white/5 px-8 py-8 shadow-soft">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <Logo />

            <div className="flex flex-col gap-3 text-sm text-white/70 sm:flex-row sm:flex-wrap sm:gap-6 lg:justify-end">
              {footerLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-sm text-white/50">
              Copyright (c) 2026 Rate My Bond. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
