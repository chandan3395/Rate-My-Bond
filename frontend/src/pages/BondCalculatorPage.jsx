import { useCallback, useEffect, useMemo, useState ,useRef} from "react";
import AnalysisPanel from "../components/analysis/AnalysisPanel";
import FormField from "../components/form/FormField";
import CalculatorHeader from "../components/layout/CalculatorHeader";
import TermsConsentModal from "../components/TermsConsentModal";
import { ANALYSIS_PANEL_ID } from "../constants/formConstants";
import { fieldMap } from "../constants/formConstants";
import useBondForm from "../hooks/useBondForm";
import useIssuers from "../hooks/useIssuers";
import { isValuePresent } from "../helpers/validation";
import { api } from "../lib/api";

const CALCULATOR_STEPS = [
  {
    id: "bond-details",
    shortLabel: "Bond Details",
    title: "Start with the bond exactly as it is listed",
    description:
      "Capture the issuer, structure, rating, and security without changing the original entry.",
    fieldIds: [
      "issuer",
      "issuerType",
      "creditRating",
      "instrumentType",
      "securityType",
    ],
  },
  {
    id: "financials",
    shortLabel: "Financials",
    title: "Add the commercial terms and investment amount",
    description:
      "Use the listed rate, payout structure, and ticket size so the analysis reflects the real economics.",
    fieldIds: ["amount", "interestRate", "payoutType", "issueSize"],
  },
  {
    id: "risk-inputs",
    shortLabel: "Risk Inputs",
    title: "Tell the system how this bond fits your profile",
    description:
      "These answers keep the score grounded in your horizon, liquidity needs, and risk appetite.",
    fieldIds: ["horizon", "riskProfile", "returnPreference", "tenure", "liquidity"],
  },
  {
    id: "review",
    shortLabel: "Review",
    title: "Review all entries before you analyze",
    description:
      "Confirm the inputs, accept the terms, and generate the result dashboard.",
    fieldIds: [],
  },
];

const FIELD_SUGGESTION_MAP = {
  issuer: "Issuer identity anchors the rest of the bond profile.",
  issuerType: "Sector type improves contextual risk scoring.",
  creditRating: "Credit rating is one of the strongest default risk signals.",
  instrumentType: "Structure affects both complexity and downside protection.",
  securityType: "Security type sharpens recovery expectations.",
  amount: "Ticket size influences suitability and concentration warnings.",
  interestRate: "Coupon or yield helps separate value from hidden risk.",
  payoutType: "Payout frequency improves cashflow matching accuracy.",
  issueSize: "Issue size adds confidence context when available.",
  horizon: "Time horizon improves maturity fit scoring.",
  riskProfile: "Risk profile prevents a strong bond from being a poor personal fit.",
  returnPreference: "Return preference keeps the payout style aligned to your goal.",
  tenure: "Maturity helps the system judge duration risk.",
  liquidity: "Liquidity matters if you may need an early exit.",
};

function formatValue(fieldId, value) {
  const field = fieldMap[fieldId];

  if (!field || !isValuePresent(value)) {
    return "Not provided";
  }

  if (field.type === "amount") {
    return `INR ${Number(value).toLocaleString("en-IN")}`;
  }

  if (field.type === "percent") {
    return `${value}%`;
  }

  return value;
}

function getFieldLabel(fieldId) {
  return fieldMap[fieldId]?.label ?? fieldId;
}

function getStepIndexForField(fieldId) {
  return CALCULATOR_STEPS.findIndex((step) => step.fieldIds.includes(fieldId));
}

function getErrorMessage(field, value) {
  if (!field?.required) {
    return "";
  }

  return isValuePresent(value) ? "" : "This entry is required before you continue.";
}

function buildAnalysisSummary(values, analysis) {
  if (!values || !analysis) {
    return ""
  }

  return [
    `Bond: ${values.issuer || "Unknown issuer"}`,
    `Internal rating: ${analysis.ratingBand}`,
    `Overall score: ${analysis.finalScore}/100`,
    `Issuer score: ${analysis.issuerScore}/100`,
    `Fit score: ${analysis.fitScore}/100`,
  ].join("\n")
}

function StepRail({
  currentStep,
  onSelectStep,
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8fd7cf]">
          Workflow
        </p>
        <p className="text-sm text-white/50">
          Step {currentStep + 1} of {CALCULATOR_STEPS.length}
        </p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#8fd7cf] to-[#d5f2de] transition-all duration-300"
          style={{
            width: `${((currentStep + 1) / CALCULATOR_STEPS.length) * 100}%`,
          }}
        />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {CALCULATOR_STEPS.map((step, index) => {
          const isActive = index === currentStep;
          const isComplete = index < currentStep;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelectStep(index)}
              className={`rounded-[1.25rem] border px-4 py-4 text-left transition ${
                isActive
                  ? "border-[#8fd7cf]/50 bg-[#103a3b]"
                  : isComplete
                    ? "border-white/10 bg-white/5 hover:bg-white/[0.08]"
                    : "border-white/10 bg-transparent hover:bg-white/[0.04]"
              }`}
            >
              <p
                className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                  isActive || isComplete ? "text-[#8fd7cf]" : "text-white/40"
                }`}
              >
                {isComplete ? "Done" : `Step ${index + 1}`}
              </p>
              <p className="mt-2 text-base font-semibold text-white">
                {step.shortLabel}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ReviewSection({ values }) {
  return (
    <div className="space-y-6">
      {CALCULATOR_STEPS.slice(0, 3).map((step) => (
        <section
          key={step.id}
          className="rounded-[1.5rem] border border-white/10 bg-[#0d2b2c]/80 p-5"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8fd7cf]">
                {step.shortLabel}
              </p>
              <h3 className="mt-1 text-xl font-semibold text-white">
                {step.title}
              </h3>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {step.fieldIds.map((fieldId) => (
              <div
                key={fieldId}
                className="rounded-2xl border border-white/10 bg-[#103a3b] p-4"
              >
                <p className="text-sm text-white/55">{fieldMap[fieldId].label}</p>
                <p className="mt-2 text-base font-semibold text-white">
                  {formatValue(fieldId, values[fieldId])}
                </p>
                <p className="mt-2 text-sm leading-6 text-white/45">
                  {FIELD_SUGGESTION_MAP[fieldId]}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function BondCalculatorPage() {
  const { issuers, issuerMap } = useIssuers();
  const {
    values,
    updateValue,
    handleAssist,
    clearInputs,
    loadSample,
    missingRequiredFields,
    requiredCompleted,
    totalRequired,
    hasAnyInputs,
  } = useBondForm(issuerMap);
  const [openHelpId, setOpenHelpId] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [touchedFields, setTouchedFields] = useState([]);
  const [submittedValues, setSubmittedValues] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState("idle");
  const [serverFieldErrors, setServerFieldErrors] = useState({});
  const [pendingScrollFieldId, setPendingScrollFieldId] = useState(null);

  const stepTopRef = useRef(null);

  const scrollToStepTop = useCallback(() => {
    stepTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const [analysis, setAnalysis] = useState(null)

  const activeStep = CALCULATOR_STEPS[currentStep];
  const activeFields = useMemo(
    () =>
      activeStep.fieldIds.map((fieldId) => {
        const field = fieldMap[fieldId];
        // Feed the issuer search field its options from the Mongo-backed list.
        if (fieldId === "issuer") {
          return { ...field, options: issuers };
        }
        return field;
      }),
    [activeStep, issuers],
  );
  const touchedFieldSet = useMemo(() => new Set(touchedFields), [touchedFields]);
  const localFieldErrors = useMemo(
    () =>
      Object.fromEntries(
        CALCULATOR_STEPS.flatMap((step) =>
          step.fieldIds.map((fieldId) => {
            const field = fieldMap[fieldId];

            return [
              fieldId,
              touchedFieldSet.has(fieldId)
                ? getErrorMessage(field, values[fieldId])
                : "",
            ];
          }),
        ),
      ),
    [touchedFieldSet, values],
  );
  const fieldErrors = useMemo(
    () => ({
      ...localFieldErrors,
      ...serverFieldErrors,
    }),
    [localFieldErrors, serverFieldErrors],
  );
  const panelState = isAnalyzing
    ? "loading"
    : submittedValues
      ? "ready"
      : "empty";
  const hasPendingChanges = useMemo(() => {
    if (!submittedValues) {
      return false;
    }

    return JSON.stringify(values) !== JSON.stringify(submittedValues);
  }, [submittedValues, values]);
const analysisSummary = useMemo(
  () => buildAnalysisSummary(submittedValues, analysis),
  [analysis, submittedValues],
);

  useEffect(() => {
    if (copyStatus !== "copied") {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setCopyStatus("idle");
    }, 2400);

    return () => window.clearTimeout(timerId);
  }, [copyStatus]);

  useEffect(() => {
    if (!pendingScrollFieldId) {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      const anchor = document.getElementById(`field-anchor-${pendingScrollFieldId}`);

      if (!anchor) {
        return;
      }

      anchor.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setPendingScrollFieldId(null);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [currentStep, pendingScrollFieldId]);

  const markFieldsTouched = useCallback((fieldIds) => {
    setTouchedFields((current) => [...new Set([...current, ...fieldIds])]);
  }, []);

  const clearServerError = useCallback((fieldId) => {
    if (!fieldId) {
      return;
    }

    setServerFieldErrors((current) => {
      if (!current[fieldId]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[fieldId];
      return nextErrors;
    });
  }, []);

  const focusField = useCallback((fieldId) => {
    if (!fieldId) {
      return;
    }

    setPendingScrollFieldId(fieldId);
  }, []);

  const handleFieldChange = useCallback(
    (fieldId, nextValue) => {
      clearServerError(fieldId);
      updateValue(fieldId, nextValue);
    },
    [clearServerError, updateValue],
  );

  const handleFieldAssist = useCallback(
    (field, mode) => {
      clearServerError(field?.id);
      handleAssist(field, mode);
    },
    [clearServerError, handleAssist],
  );

  const scrollToResults = useCallback(() => {
    document.getElementById(ANALYSIS_PANEL_ID)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const runAnalysis = useCallback(async () => {
  setIsAnalyzing(true);
  setCopyStatus("idle");
  setServerFieldErrors({});
  scrollToResults();

  const startedAt = performance.now();

  try {
    // Goes through the authenticated API client (adds the Bearer token).
    const result = await api.post("/api/analyze", values);

    // dynamic time lapse
    const elapsed = performance.now() - startedAt;
    if (elapsed < 2000) {
      await new Promise((resolve) => setTimeout(resolve, 2000 - elapsed));
    }

    setSubmittedValues({ ...values });
    setAnalysis(result);
  } catch (err) {
    // Backend validation errors arrive as { message, fields, requestId }.
    const fields = err?.data?.fields;
    if (fields) {
      const invalidFieldIds = Object.keys(fields);
      const firstInvalidFieldId = invalidFieldIds[0];

      setServerFieldErrors(fields);
      markFieldsTouched(invalidFieldIds);

      if (firstInvalidFieldId) {
        const targetStep = getStepIndexForField(firstInvalidFieldId);
        setCurrentStep(targetStep === -1 ? 0 : targetStep);
        focusField(firstInvalidFieldId);
      }
    }

    console.error(err);
  } finally {
    setIsAnalyzing(false);
  }
}, [focusField, markFieldsTouched, scrollToResults, values]);


  const handleStartAnalysis = useCallback(() => {
    if (missingRequiredFields.length) {
      markFieldsTouched(missingRequiredFields);
      const firstMissingFieldId = missingRequiredFields[0];
      const targetStep = getStepIndexForField(firstMissingFieldId);
      setCurrentStep(targetStep === -1 ? 0 : targetStep);
      focusField(firstMissingFieldId);
      return;
    }

    setIsTermsModalOpen(true);
  }, [focusField, markFieldsTouched, missingRequiredFields]);

  const handleSelectStep = useCallback((targetIndex) => {
    setCurrentStep(targetIndex);
  }, []);

  const handleNextStep = useCallback(() => {
    const missingInStep = activeFields
      .filter((field) => field.required && !isValuePresent(values[field.id]))
      .map((field) => field.id);

    if (missingInStep.length) {
      markFieldsTouched(missingInStep);
      focusField(missingInStep[0]);
      return;
    }

    setCurrentStep((stepIndex) =>
      Math.min(stepIndex + 1, CALCULATOR_STEPS.length - 1),
    );

    window.requestAnimationFrame(scrollToStepTop);
  }, [activeFields, focusField, markFieldsTouched, scrollToStepTop, values]);

  const handlePreviousStep = useCallback(() => {
    setCurrentStep((stepIndex) => Math.max(stepIndex - 1, 0));
  }, []);

  const handleLoadSample = useCallback(() => {
    loadSample();
    setSubmittedValues(null);
    setCurrentStep(0);
    setTouchedFields([]);
    setOpenHelpId(null);
    setCopyStatus("idle");
    setServerFieldErrors({});
    setPendingScrollFieldId(null);
  }, [loadSample]);

  const handleClearInputs = useCallback(() => {
    clearInputs();
    setCurrentStep(0);
    setTouchedFields([]);
    setOpenHelpId(null);
    setSubmittedValues(null);
    setIsAnalyzing(false);
    setIsTermsModalOpen(false);
    setCopyStatus("idle");
    setServerFieldErrors({});
    setPendingScrollFieldId(null);
  }, [clearInputs]);

  const handleCopySummary = useCallback(async () => {
    if (!analysisSummary) {
      return;
    }

    try {
      await navigator.clipboard.writeText(analysisSummary);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  }, [analysisSummary]);

  const handleEditInputs = useCallback(() => {
    setCurrentStep(0);
  }, []);

  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <CalculatorHeader
          hasAnyInputs={hasAnyInputs}
          hasAnalysis={Boolean(submittedValues)}
          currentStep={currentStep}
          totalSteps={CALCULATOR_STEPS.length}
          onLoadSample={handleLoadSample}
          onClearInputs={handleClearInputs}
          onJumpToResults={scrollToResults}
        />

        <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <section className="space-y-6">
            <StepRail currentStep={currentStep} onSelectStep={handleSelectStep} />

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft sm:p-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8fd7cf]">
                    {activeStep.shortLabel}
                  </p>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    {activeStep.title}
                  </h1>
                  <p className="mt-4 text-base leading-7 text-white/68">
                    {activeStep.description}
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-[#103a3b] px-5 py-4">
                  <p className="text-sm text-white/50">Required progress</p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {requiredCompleted}/{totalRequired}
                  </p>
                  <p className="mt-1 text-sm text-white/55">
                    Fill all required entries to unlock the result dashboard.
                  </p>
                </div>
              </div>

              <div ref={stepTopRef} className="mt-8">
                {currentStep < 3 ? (
                  <div className="space-y-5">
                    {activeFields.map((field) => (
                      <div key={field.id} id={`field-anchor-${field.id}`}>
                        <FormField
                          field={field}
                          value={values[field.id]}
                          onChange={handleFieldChange}
                          onAssist={handleFieldAssist}
                          openHelpId={openHelpId}
                          setOpenHelpId={setOpenHelpId}
                          error={fieldErrors[field.id]}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <ReviewSection values={values} />
                )}
              </div>

              <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-white/55">
                  {currentStep < 3
                    ? "Your entries stay saved while you move between steps."
                    : "Submit once the entries above match the original bond listing and your profile."}
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    disabled={currentStep === 0}
                    className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Back
                  </button>

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="rounded-full bg-[#8fd7cf] px-5 py-3 text-sm font-semibold text-[#062021] transition hover:scale-[1.01] hover:bg-[#9fe5de]"
                    >
                      Next step
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStartAnalysis}
                      disabled={isAnalyzing}
                      className="rounded-full bg-[#8fd7cf] px-5 py-3 text-sm font-semibold text-[#062021] transition hover:scale-[1.01] hover:bg-[#9fe5de]"
                    >
                      {isAnalyzing ? "Analyzing..." : "Analyze bond"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {hasPendingChanges ? (
              <div className="rounded-[1.5rem] border border-[#f2c66d]/25 bg-[#2b2415] px-5 py-4 text-sm text-[#f6dfb2]">
                Inputs have changed since the last analysis. Review them and run the analysis again to refresh the dashboard.
              </div>
            ) : null}
          </section>

          <section className="space-y-6">
            <AnalysisPanel
              state={panelState}
              analysis={analysis}
              copyStatus={copyStatus}
              onCopySummary={handleCopySummary}
              onEditInputs={handleEditInputs}
              onReset={handleClearInputs}
              requiredCompleted={requiredCompleted}
              totalRequired={totalRequired}
              hasPendingChanges={hasPendingChanges}
              onReanalyze={handleStartAnalysis}
            />

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8fd7cf]">
                Accuracy notes
              </p>
              <div className="mt-5 space-y-4">
                {missingRequiredFields.length ? (
                  missingRequiredFields.map((fieldId) => (
                    <div
                      key={fieldId}
                      className="rounded-2xl border border-white/10 bg-[#103a3b] p-4"
                    >
                      <p className="text-sm font-semibold text-white">
                        Add {getFieldLabel(fieldId).toLowerCase()}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/60">
                        {FIELD_SUGGESTION_MAP[fieldId]}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-7 text-white/62">
                    All required entries are complete. You can analyze now, copy the summary, or go back and fine-tune inputs without losing your work.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      <TermsConsentModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAccept={() => {
          setIsTermsModalOpen(false);
          runAnalysis();
        }}
      />
    </main>
  );
}

export default BondCalculatorPage;
