import { memo } from "react";
import FieldHeader from "./FieldHeader";
import FieldControl from "./FieldControl";
import HelpBlock from "./HelpBlock";

function FieldCard({
  field,
  value,
  onChange,
  onAssist,
  openHelpId,
  setOpenHelpId,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d2b2c]/80 p-5">
      <FieldHeader field={field} onAssist={onAssist} />

      <div className="mt-5">
        <FieldControl field={field} value={value} onChange={onChange} />
      </div>

      <button
        type="button"
        onClick={() =>
          setOpenHelpId((curr) => (curr === field.id ? null : field.id))
        }
        className="mt-4 text-sm font-medium text-[#8fd7cf] transition hover:text-white"
      >
        {openHelpId === field.id ? "Hide help" : "What's this?"}
      </button>

      {openHelpId === field.id && <HelpBlock field={field} />}
    </div>
  );
}

export default memo(FieldCard);
