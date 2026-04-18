function Hero({ onStartRating }) {
  return (
    <section className="px-6 pb-16 pt-12 lg:px-8 lg:pb-24 lg:pt-16" id="home">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8fd7cf]">
            Institutional-style bond screening
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Get institutional-level bond ratings in seconds
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
            Move from raw bond listings to a guided decision dashboard with clear scoring, fit signals, and risk context that is easy to act on.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={onStartRating}
              className="inline-flex items-center justify-center rounded-full bg-[#8fd7cf] px-6 py-3 text-sm font-semibold text-[#062021] shadow-soft transition hover:scale-[1.02] hover:bg-[#9fe5de]"
            >
              Analyze Bond
            </button>
            <a
              href="#sample-output"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
            >
              See sample output
            </a>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              "Guided 4-step flow",
              "Clear suitability score",
              "Built for faster bond review",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/70"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#103a3b] to-[#081d1e] p-6 shadow-soft">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#8fd7cf]/10 blur-3xl" />
          <div className="relative">
            <div className="rounded-[1.5rem] border border-white/10 bg-[#081d1e]/75 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-white/50">Sample result</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Northstar Utilities
                  </h2>
                </div>
                <span className="rounded-full bg-[#67d391]/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#b6efc7]">
                  AA view
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-[#103a3b] p-4">
                  <p className="text-sm text-white/50">Overall score</p>
                  <p className="mt-2 text-3xl font-semibold text-white">84</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#103a3b] p-4">
                  <p className="text-sm text-white/50">Bond quality</p>
                  <p className="mt-2 text-3xl font-semibold text-white">80</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#103a3b] p-4">
                  <p className="text-sm text-white/50">Profile fit</p>
                  <p className="mt-2 text-3xl font-semibold text-white">92</p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8fd7cf]">
                  Strengths
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-white/70">
                  <li>Higher-rated issuer profile</li>
                  <li>Secured structure and manageable coupon</li>
                  <li>Good match for medium-term holding</li>
                </ul>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#8fd7cf]">
                  Watchpoints
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-white/70">
                  <li>Moderate exit liquidity</li>
                  <li>Always validate the live listing details</li>
                  <li>Use review step before submitting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
