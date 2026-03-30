import { Link } from "react-router-dom";

function StaticPage({ eyebrow, title, description }) {
  const isStructuredDescription = Array.isArray(description);

  return (
    <main className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/5 px-8 py-12 shadow-soft sm:px-12">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8fd7cf]">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>

        {isStructuredDescription ? (
          <div className="mt-10 space-y-8">
            {description.map((section) => (
              <section key={section.heading} className="space-y-3">
                <h2 className="text-xl font-semibold text-white">
                  {section.heading}
                </h2>

                {section.content ? (
                  <div className="border-l-2 border-white/15 pl-5 text-lg leading-8 text-white/72">
                    {section.content}
                  </div>
                ) : null}

                {section.list ? (
                  <ul className="list-disc space-y-2 pl-6 text-lg leading-8 text-white/72 marker:text-[#8fd7cf]">
                    {section.list.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        ) : (
          <>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              {description}
            </p>

            <div className="mt-10 rounded-2xl border border-dashed border-white/15 bg-[#0d2b2c]/75 p-6 text-sm leading-7 text-white/60">
              Content placeholder. Replace this block with your final page copy
              when you are ready.
            </div>
          </>
        )}

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-[#8fd7cf] px-6 py-3 text-sm font-semibold text-[#062021] shadow-soft transition hover:scale-[1.02] hover:bg-[#9fe5de]"
          >
            Return home
          </Link>
          <Link
            to="/signin"
            className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
          >
            Go to sign in
          </Link>
        </div>
      </div>
    </main>
  );
}

export default StaticPage;
