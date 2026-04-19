const features = [
  {
    title: "Smart risk analysis",
    description:
      "Surface the most important credit signals quickly with a structured scoring flow.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "DSCR, ICR, LTV calculations",
    description:
      "Bring core bond and lending metrics together in one consistent evaluation model.",
    image:
      "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Clean input system",
    description:
      "Move through issuer information with intuitive forms designed to reduce rework.",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Fast results",
    description:
      "Turn a long review process into a decision-ready rating in just a few guided steps.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80",
  },
];

function Features() {
  return (
    <section className="px-6 py-16 lg:px-8" id="calculator">
      <div className="mx-auto max-w-7xl">
        <div className="flex max-w-3xl flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8fd7cf]">
            Features
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Built for bond analysis
          </h2>
          <p className="text-lg text-white/65">
            A streamlined workspace that keeps complex credit review calm,
            consistent, and easy to act on.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <img
                src={feature.image}
                alt={feature.title}
                className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/65">
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
