import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-3 text-white transition hover:text-[#8fd7cf]"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#8fd7cf]/20 bg-[#0f3d3e] shadow-soft">
        <svg
          viewBox="0 0 40 40"
          className="h-6 w-6"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M20 4 31 8.4v8.8c0 7.2-4.4 13.8-11 16.8-6.6-3-11-9.6-11-16.8V8.4L20 4Z"
            className="fill-[#8fd7cf] opacity-90"
          />
          <path
            d="M14 23.5 18 19l3 3 5-6"
            stroke="#062021"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <span className="flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-[0.26em] text-[#8fd7cf]">
          Rate
        </span>
        <span className="text-lg font-semibold tracking-tight text-white">
          My Bond
        </span>
      </span>
    </Link>
  );
}

export default Logo;
