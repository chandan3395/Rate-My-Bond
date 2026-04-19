const steps = [
  {
    title: "Capture the bond as listed",
    description:
      "Keep the original issuer, rating, structure, and security entries intact.",
  },
  {
    title: "Add financial terms",
    description:
      "Use the listed coupon, payout type, and investment amount to anchor the economics.",
  },
  {
    title: "Layer on investor fit",
    description:
      "Match the bond against horizon, liquidity needs, and risk tolerance.",
  },
  {
    title: "Review and analyze",
    description:
      "Confirm the entries, accept the terms, and open the final dashboard.",
  },
];

function Steps() {
  return (
    <section className="px-6 py-16 lg:px-8" id="how-it-works">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8fd7cf]">
            Workflow
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            A guided four-step review flow
          </h2>
          <p className="mt-4 text-lg text-white/65">
            Designed so users feel progress, not form fatigue
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:bg-white/[0.08]"
            >
              <p className="inline-flex rounded-full bg-[#8fd7cf]/10 px-3 py-1 text-sm font-semibold text-[#8fd7cf]">
                Step {index + 1}
              </p>
              <h3 className="mt-5 text-xl font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/65">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Steps;
