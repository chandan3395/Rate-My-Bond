function Hero({ onStartRating }) {
  return (
    <section className="px-6 py-16 lg:px-8 lg:py-24" id="home">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div className="max-w-2xl">
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Understand bond risk in seconds
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
            Evaluate issuer quality, coverage metrics, and asset backing with a
            focused workflow built for fast, repeatable bond decisions.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={onStartRating}
              className="inline-flex items-center justify-center rounded-full bg-[#8fd7cf] px-6 py-3 text-sm font-semibold text-[#062021] shadow-soft transition hover:scale-[1.02] hover:bg-[#9fe5de]"
            >
              Start Rating
            </button>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
            >
              Explore Workflow
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[#8fd7cf]/20 via-transparent to-[#0f3d3e]/10 blur-2xl" />
          <img
            src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80"
            alt="Bond analytics dashboard"
            className="relative h-full min-h-[320px] w-full rounded-[2rem] border border-white/10 object-cover shadow-soft transition duration-500 hover:scale-[1.01]"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
