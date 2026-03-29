const steps = [
  {
    title: "Enter issuer and bond details",
    description:
      "Add term sheet inputs, collateral structure, and issuer profile without friction.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Analyze financial strength",
    description:
      "Review leverage, cash flow coverage, and risk signals in a focused workflow.",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Get instant bond rating",
    description:
      "Receive a clear rating output with the context your team needs to move fast.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
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
            Three simple steps
          </h2>
          <p className="mt-4 text-lg text-white/65">
            From input to rating in moments
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <img
                src={step.image}
                alt={step.title}
                className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="p-6">
                <p className="text-sm font-semibold text-[#8fd7cf]">
                  Step {index + 1}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/65">
                  {step.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Steps;
