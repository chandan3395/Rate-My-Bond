import {
  bondDetailFields,
  sampleInputs,
  userIntentFields,
} from "../data/bondFormConfig";

export const ANALYSIS_PANEL_ID = "analysis-panel";

export const FORM_ACTION_LABELS = Object.freeze({
  clear: "Clear inputs",
  loadSample: "Load Sample Inputs",
  rate: "Rate",
});

export const CALCULATOR_COPY = Object.freeze({
  eyebrow: "Guided bond analysis",
  title: "Rate a bond with guided inputs, not financial guesswork",
  description:
    "Start with your investing intent, then describe the bond using structured fields. Every step explains what it means, how to choose it, and what the backend will do with it.",
  userIntentTitle: "User Intent",
  userIntentDescription:
    "These fields define your investing context before the bond is evaluated.",
  bondDetailsTitle: "Bond Details",
  bondDetailsDescription:
    "These fields describe the bond itself. Beginners can use the inline help, while advanced users can fill them quickly from the listing page.",
});

export const allFields = [...userIntentFields, ...bondDetailFields];

export const fieldMap = Object.freeze(
  Object.fromEntries(allFields.map((field) => [field.id, field])),
);

export const fieldLabelMap = Object.freeze(
  Object.fromEntries(allFields.map((field) => [field.id, field.label])),
);

export const requiredFields = allFields.filter((field) => field.required);

export const requiredFieldIds = requiredFields.map((field) => field.id);

export const numericFields = allFields.filter(
  (field) => field.type === "amount" || field.type === "percent",
);

export function createEmptyFormValues() {
  return allFields.reduce(
    (accumulator, field) => ({
      ...accumulator,
      [field.id]: "",
    }),
    {},
  );
}

export const sampleFormValues = Object.freeze({ ...sampleInputs });
