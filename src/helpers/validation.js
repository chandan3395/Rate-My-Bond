import { safeNumber, safeString } from "./errorHandlers";

export function isValuePresent(value) {
  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  return safeString(value).trim() !== "";
}

export function validateRequiredFields(fields, values) {
  return fields
    .filter((field) => field.required && !isValuePresent(values[field.id]))
    .map((field) => field.id);
}

export function validateNumericField(field, value) {
  if (!field || (field.type !== "amount" && field.type !== "percent")) {
    return {
      isValid: true,
      normalizedValue: value,
    };
  }

  if (value === "") {
    return {
      isValid: true,
      normalizedValue: "",
    };
  }

  const numericValue = safeNumber(value, Number.NaN);

  if (!Number.isFinite(numericValue)) {
    return {
      isValid: false,
      normalizedValue: "",
    };
  }

  const min = typeof field.min === "number" ? field.min : numericValue;
  const max = typeof field.max === "number" ? field.max : numericValue;
  const normalizedValue = Math.min(Math.max(numericValue, min), max);

  return {
    isValid: numericValue >= min && numericValue <= max,
    normalizedValue,
  };
}

export function validateNumericBounds(fields, values) {
  return fields
    .filter((field) => field.type === "amount" || field.type === "percent")
    .map((field) => ({
      fieldId: field.id,
      ...validateNumericField(field, values[field.id]),
    }))
    .filter((result) => !result.isValid);
}

export function normalizeFieldValue(field, value) {
  if (!field) {
    return value ?? "";
  }

  if (field.type === "amount" || field.type === "percent") {
    return validateNumericField(field, value).normalizedValue;
  }

  if (typeof value === "string") {
    return value;
  }

  return value ?? "";
}
