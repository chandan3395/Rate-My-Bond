import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="px-6 py-16 lg:px-8" id="cta">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#103a3b] to-[#0a2728] px-8 py-14 text-center shadow-soft sm:px-12">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8fd7cf]">
          Ready when you are
        </p>
        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Start analyzing bonds today
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/65">
          Bring speed and consistency to every bond review with a workflow built
          for modern underwriting teams.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/signin"
            className="inline-flex items-center justify-center rounded-full bg-[#8fd7cf] px-6 py-3 text-sm font-semibold text-[#062021] shadow-soft transition hover:scale-[1.02] hover:bg-[#9fe5de]"
          >
            Get started
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
          >
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTA;
