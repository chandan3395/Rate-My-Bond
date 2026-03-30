import { memo } from "react";
import FieldCard from "./FieldCard";
import { CALCULATOR_COPY } from "../../constants/formConstants";

function BondDetailsSection({
  fields,
  values,
  onChange,
  onAssist,
  openHelpId,
  setOpenHelpId,
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
      <h2 className="text-2xl font-semibold text-white">
        {CALCULATOR_COPY.bondDetailsTitle}
      </h2>
      <p className="mt-2 text-sm leading-7 text-white/65">
        {CALCULATOR_COPY.bondDetailsDescription}
      </p>

      <div className="mt-8 space-y-5">
        {fields.map((field) => (
          <FieldCard
            key={field.id}
            field={field}
            value={values[field.id]}
            onChange={onChange}
            onAssist={onAssist}
            openHelpId={openHelpId}
            setOpenHelpId={setOpenHelpId}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(BondDetailsSection);
