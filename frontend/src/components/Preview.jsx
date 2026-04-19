import { sampleInputs } from "../data/bondFormConfig";
import { analyzeBond } from "../utils/bondAnalysis";

const previewAnalysis = analyzeBond(sampleInputs);

function Preview() {
  return (
    <section className="px-6 py-16 lg:px-8" id="sample-output">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8fd7cf]">
          Sample analysis output
        </p>
        <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          See the kind of decision-ready dashboard you get after submission
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-white/65">
          The output is designed to answer the real question quickly: should this bond move forward for deeper review, or does it need caution?
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#103a3b] to-[#0a2728] p-6 shadow-soft">
            <p className="text-sm text-white/55">Northstar Utilities</p>
            <div className="mt-6 flex items-end justify-between gap-6">
              <div>
                <p className="text-sm text-white/50">Internal rating</p>
                <p className="mt-2 text-5xl font-semibold text-[#b6efc7]">
                  {previewAnalysis.ratingBand}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/50">Overall score</p>
                <p className="mt-2 text-4xl font-semibold text-white">
                  {previewAnalysis.overallScore}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-white/50">Bond quality</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {previewAnalysis.bondQualityScore}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-white/50">Profile fit</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {previewAnalysis.fitScore}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
            <div className="grid gap-4">
              {previewAnalysis.narrative.slice(0, 3).map((item) => (
                <div
                  key={item}
                  className="rounded-[1.5rem] border border-white/10 bg-[#103a3b] p-4"
                >
                  <p className="text-sm leading-7 text-white/72">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              {previewAnalysis.bondQualityBreakdown.slice(0, 4).map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm text-white/70">
                    <span>{item.label}</span>
                    <span>{item.score}/100</span>
                  </div>
                  <div className="mt-2 h-2.5 rounded-full bg-white/10">
                    <div
                      className="h-2.5 rounded-full bg-[#8fd7cf]"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Preview;
