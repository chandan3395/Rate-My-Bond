import { useCallback, useMemo, useState } from "react";
import {
  createEmptyFormValues,
  fieldMap,
  requiredFields,
  sampleFormValues,
} from "../constants/formConstants";
import {
  getFieldDefinition,
  resolveAssistValue,
} from "../helpers/errorHandlers";
import {
  isValuePresent,
  normalizeFieldValue,
  validateRequiredFields,
} from "../helpers/validation";

function useBondForm() {
  const [values, setValues] = useState(createEmptyFormValues);

  const updateValue = useCallback((fieldId, nextValue) => {
    if (!fieldId) {
      return;
    }

    setValues((currentValues) => {
      const field = getFieldDefinition(fieldId, fieldMap);

      if (!field) {
        return currentValues;
      }

      const normalizedValue = normalizeFieldValue(field, nextValue);

      if (Object.is(currentValues[fieldId], normalizedValue)) {
        return currentValues;
      }

      return {
        ...currentValues,
        [fieldId]: normalizedValue,
      };
    });
  }, []);

  const handleAssist = useCallback(
    (field, mode) => {
      if (!field?.id) {
        return;
      }

      const nextValue = resolveAssistValue(field, mode, values);
      updateValue(field.id, nextValue);
    },
    [updateValue, values],
  );

  const clearInputs = useCallback(() => {
    setValues(createEmptyFormValues());
  }, []);

  const loadSample = useCallback(() => {
    setValues({ ...sampleFormValues });
  }, []);

  const missingRequiredFields = useMemo(
    () => validateRequiredFields(requiredFields, values),
    [values],
  );

  const requiredCompleted = useMemo(
    () => requiredFields.length - missingRequiredFields.length,
    [missingRequiredFields],
  );

  const hasAnyInputs = useMemo(
    () => Object.values(values).some((value) => isValuePresent(value)),
    [values],
  );

  return {
    values,
    updateValue,
    handleAssist,
    clearInputs,
    loadSample,
    requiredCompleted,
    totalRequired: requiredFields.length,
    hasAnyInputs,
  };
}

export default useBondForm;
