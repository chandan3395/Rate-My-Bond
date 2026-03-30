import { useState } from "react";
import { Link } from "react-router-dom";

import {
  groupWeights,
  issuerOptions,
  optionalSections,
  requiredSections,
  sampleProfile,
} from "../data/ratingModel";

const requiredFields = requiredSections.flatMap((section) => section.fields);
const optionalFields = optionalSections.flatMap((section) => section.fields);

const emptyValues = [...requiredFields, ...optionalFields].reduce(
  (accumulator, field) => ({
    ...accumulator,
    [field.id]: "",
  }),
  {},
);

function findScore(field, value) {
  return field.options?.find((option) => option.label === value)?.score;
}

function clampScore(value) {
  return Math.max(0, Math.min(100, value));
}

function getRatingBand(score) {
  if (score >= 85) {
    return "AAA";
  }
  if (score >= 75) {
    return "AA";
  }
  if (score >= 65) {
    return "A";
  }
  if (score >= 55) {
    return "BBB";
  }
  if (score >= 45) {
    return "BB";
  }
  return "B / Junk";
}

function getRatingTone(rating) {
  switch (rating) {
    case "AAA":
      return "text-[#8fd7cf]";
    case "AA":
      return "text-[#b7ebe6]";
    case "A":
      return "text-[#d8f5f1]";
    case "BBB":
      return "text-[#f2e6aa]";
    case "BB":
      return "text-[#f4c98d]";
    default:
      return "text-[#f4a6a6]";
  }
}

function calculateModel(values) {
  const missingRequired = requiredFields.filter(
    (field) => field.type !== "searchable" && !values[field.id],
  );

  const groupBreakdown = Object.entries(groupWeights).map(([group, weight]) => {
    const fields = requiredFields.filter((field) => field.group === group);
    const selectedScores = fields
      .map((field) => findScore(field, values[field.id]))
      .filter((score) => score !== undefined);

    const normalizedScore = selectedScores.length
      ? (selectedScores.reduce((total, score) => total + score, 0) /
          selectedScores.length) *
        20
      : 0;

    return {
      group,
      weight,
      score: normalizedScore,
      weightedScore: (normalizedScore * weight) / 100,
    };
  });

  const requiredScore = clampScore(
    groupBreakdown.reduce((total, item) => total + item.weightedScore, 0),
  );

  const optionalSelected = optionalFields
    .map((field) => findScore(field, values[field.id]))
    .filter((score) => score !== undefined);

  const optionalAverage = optionalSelected.length
    ? optionalSelected.reduce((total, score) => total + score, 0) /
      optionalSelected.length
    : 3;

  const refinementAdjustment = optionalSelected.length
    ? Math.max(-5, Math.min(5, (optionalAverage - 3) * 2.5))
    : 0;

  const finalScore = clampScore(requiredScore + refinementAdjustment);
  const requiredCompletion = requiredFields.filter(
    (field) => field.type === "searchable" || values[field.id],
  ).length;
  const optionalCompletion = optionalSelected.length / optionalFields.length;

  return {
    missingRequired,
    groupBreakdown,
    requiredScore,
    refinementAdjustment,
    finalScore,
    rating: getRatingBand(finalScore),
    confidence: Math.round(
      (requiredCompletion / requiredFields.length) * 65 + optionalCompletion * 35,
    ),
  };
}

function FieldControl({ field, value, onChange }) {
  if (field.type === "searchable") {
    return (
      <>
        <input
          list="issuer-options"
          value={value}
          placeholder={field.placeholder}
          onChange={(event) => onChange(field.id, event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-[#103a3b] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#8fd7cf]/50"
        />
        <datalist id="issuer-options">
          {issuerOptions.map((issuer) => (
            <option key={issuer} value={issuer} />
          ))}
        </datalist>
      </>
    );
  }

  return (
    <select
      value={value}
      onChange={(event) => onChange(field.id, event.target.value)}
      className="w-full rounded-2xl border border-white/10 bg-[#103a3b] px-4 py-3 text-sm text-white outline-none transition focus:border-[#8fd7cf]/50"
    >
      <option value="">Select an option</option>
      {field.options.map((option) => (
        <option key={option.label} value={option.label}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function BondCalculatorPage() {
  const [values, setValues] = useState(emptyValues);
  const [showOptional, setShowOptional] = useState(true);

  const model = calculateModel(values);

  const updateValue = (fieldId, nextValue) => {
    setValues((current) => ({
      ...current,
      [fieldId]: nextValue,
    }));
  };

  const loadSampleDeal = () => {
    setValues(sampleProfile);
  };

  const resetForm = () => {
    setValues(emptyValues);
  };

  return (
    <main className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8fd7cf]">
              Bond calculator
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Build a bond rating from structured dropdown inputs
            </h1>
            <p className="mt-5 text-lg leading-8 text-white/70">
              This is the first working version of the rating engine. Required
              fields drive the base rating, while optional fields refine score
              confidence and add a small adjustment layer.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={loadSampleDeal}
              className="rounded-full bg-[#8fd7cf] px-5 py-3 text-sm font-semibold text-[#062021] transition hover:scale-[1.02] hover:bg-[#9fe5de]"
            >
              Load sample deal
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
            >
              Reset inputs
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    Compulsory Inputs
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-white/65">
                    These dropdowns drive the core rating calculation and must
                    be completed for a valid result.
                  </p>
                </div>
                <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60">
                  {requiredFields.filter((field) => values[field.id]).length}/
                  {requiredFields.length} completed
                </div>
              </div>

              <div className="mt-8 space-y-6">
                {requiredSections.map((section) => (
                  <div
                    key={section.id}
                    className="rounded-2xl border border-white/10 bg-[#0d2b2c]/80 p-5"
                  >
                    <div className="mb-5">
                      <h3 className="text-lg font-semibold text-white">
                        {section.title}
                      </h3>
                      <p className="mt-2 text-sm text-white/60">
                        {section.description}
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {section.fields.map((field) => (
                        <div key={field.id} className="space-y-2">
                          <label className="text-sm font-medium text-white/75">
                            {field.label}
                          </label>
                          <FieldControl
                            field={field}
                            value={values[field.id]}
                            onChange={updateValue}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    Optional Refinement Inputs
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-white/65">
                    These are not required for the base rating, but they improve
                    confidence and can slightly refine the final score.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowOptional((current) => !current)}
                  className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
                >
                  {showOptional ? "Hide optional inputs" : "Show optional inputs"}
                </button>
              </div>

              {showOptional ? (
                <div className="mt-8 space-y-6">
                  {optionalSections.map((section) => (
                    <div
                      key={section.id}
                      className="rounded-2xl border border-white/10 bg-[#0d2b2c]/80 p-5"
                    >
                      <h3 className="text-lg font-semibold text-white">
                        {section.title}
                      </h3>
                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        {section.fields.map((field) => (
                          <div key={field.id} className="space-y-2">
                            <label className="text-sm font-medium text-white/75">
                              {field.label}
                            </label>
                            <FieldControl
                              field={field}
                              value={values[field.id]}
                              onChange={updateValue}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </section>

          <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#103a3b] to-[#0a2728] p-6 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8fd7cf]">
                Live result
              </p>
              <div className="mt-6 flex items-end justify-between gap-6">
                <div>
                  <p className="text-sm text-white/60">Indicative rating</p>
                  <p
                    className={`mt-2 text-5xl font-semibold tracking-tight ${getRatingTone(
                      model.rating,
                    )}`}
                  >
                    {model.missingRequired.length ? "--" : model.rating}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/60">Final score</p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {model.missingRequired.length
                      ? "Incomplete"
                      : model.finalScore.toFixed(1)}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-white/60">Base score</p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {model.requiredScore.toFixed(1)}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-white/60">Confidence</p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {model.confidence}%
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-white/65">
                {model.missingRequired.length ? (
                  <>
                    Complete all compulsory dropdowns to unlock the final rating
                    output and weighted score.
                  </>
                ) : (
                  <>
                    Optional inputs are applying a refinement of{" "}
                    <span className="font-semibold text-white">
                      {model.refinementAdjustment >= 0 ? "+" : ""}
                      {model.refinementAdjustment.toFixed(1)}
                    </span>{" "}
                    to the base score.
                  </>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    Weighted Breakdown
                  </h2>
                  <p className="mt-2 text-sm text-white/60">
                    Mirrors the rating logic you defined for the backend.
                  </p>
                </div>
                <Link
                  to="/terms"
                  className="text-sm font-medium text-[#8fd7cf] transition hover:text-white"
                >
                  View terms
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                {model.groupBreakdown.map((item) => (
                  <div key={item.group} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium capitalize text-white/75">
                        {item.group === "financialStrength"
                          ? "Financial Strength"
                          : item.group === "cashFlow"
                            ? "Cash Flow"
                            : item.group === "bondStructure"
                              ? "Bond Structure"
                              : item.group === "riskFlags"
                                ? "Risk Flags"
                                : "Ratios"}
                      </span>
                      <span className="text-white/55">
                        {item.score.toFixed(1)} / 100
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div
                        className="h-2 rounded-full bg-[#8fd7cf] transition-all"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-white/45">
                      Weight: {item.weight}% | Contribution:{" "}
                      {item.weightedScore.toFixed(1)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
              <h2 className="text-2xl font-semibold text-white">
                Missing Inputs
              </h2>
              <p className="mt-2 text-sm text-white/60">
                Use this checklist to finish the mandatory fields quickly.
              </p>

              <div className="mt-5">
                {model.missingRequired.length ? (
                  <ul className="list-disc space-y-2 pl-5 text-sm text-white/70 marker:text-[#8fd7cf]">
                    {model.missingRequired.map((field) => (
                      <li key={field.id}>{field.label}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[#8fd7cf]">
                    All compulsory inputs are completed.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default BondCalculatorPage;
