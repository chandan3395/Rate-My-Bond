function Preview() {
  return (
    <section className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8fd7cf]">
          Preview
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          See your bond rating in action
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/65">
          Review scoring summaries, supporting ratios, and issuer strength in a
          dashboard designed for quick credit judgment.
        </p>

        <div className="mt-12 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d2b2c]/80 p-3 shadow-soft">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80"
            alt="Bond rating dashboard preview"
            className="h-full min-h-[280px] w-full rounded-[1.4rem] object-cover transition duration-500 hover:scale-[1.01]"
          />
        </div>
      </div>
    </section>
  );
}

export default Preview;
