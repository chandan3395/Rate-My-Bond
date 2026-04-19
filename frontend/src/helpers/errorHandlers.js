export function safeString(value, fallback = "") {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return fallback;
}

export function safeNumber(value, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const parsedValue = Number.parseFloat(safeString(value, ""));
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

export function safeArray(value, fallback = []) {
  return Array.isArray(value) ? value : fallback;
}

export function getFieldDefinition(fieldId, fieldDefinitions) {
  return fieldDefinitions[fieldId] ?? null;
}

export function resolveAssistValue(field, mode, values) {
  if (!field) {
    return "";
  }

  const nextValue =
    mode === "auto"
      ? typeof field.autoValue === "function"
        ? field.autoValue(values)
        : field.autoValue
      : field.notSureValue;

  return nextValue ?? "";
}
