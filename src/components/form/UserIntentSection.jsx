import { memo } from "react";
import FieldCard from "./FieldCard";
import { CALCULATOR_COPY } from "../../constants/formConstants";

function UserIntentSection({
  fields,
  values,
  onChange,
  onAssist,
  openHelpId,
  setOpenHelpId,
  requiredCompleted,
  totalRequired,
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            {CALCULATOR_COPY.userIntentTitle}
          </h2>
          <p className="mt-2 text-sm leading-7 text-white/65">
            {CALCULATOR_COPY.userIntentDescription}
          </p>
        </div>
        <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60">
          {requiredCompleted}/{totalRequired} required fields completed
        </div>
      </div>

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

export default memo(UserIntentSection);
