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

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onStartRating}
              className="inline-flex items-center justify-center rounded-full bg-[#8fd7cf] px-6 py-3 text-sm font-semibold text-[#062021] shadow-soft transition hover:scale-[1.02] hover:bg-[#9fe5de]"
            >
              Analyze Bond
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-[#8fd7cf]/16 via-transparent to-[#103a3b]/12 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.03] p-3 shadow-soft">
            <img
              src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1400&q=80"
              alt="Finance workspace"
              className="h-[420px] w-full rounded-[1.65rem] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
