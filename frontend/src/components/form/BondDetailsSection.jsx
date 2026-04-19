import { memo } from "react";
import FormField from "./FormField";
import { CALCULATOR_COPY } from "../../constants/formConstants";

function BondDetailsSection({
  fields,
  values,
  onChange,
  onAssist,
  openHelpId,
  setOpenHelpId,
  errors,
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-white">
          {CALCULATOR_COPY.bondDetailsTitle}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-white/65">
          {CALCULATOR_COPY.bondDetailsDescription}
        </p>
      </div>

      {fields.map((field) => (
        <FormField
          key={field.id}
          field={field}
          value={values[field.id]}
          onChange={onChange}
          onAssist={onAssist}
          openHelpId={openHelpId}
          setOpenHelpId={setOpenHelpId}
          error={errors?.[field.id]}
        />
      ))}
    </div>
  );
}

export default memo(BondDetailsSection);
