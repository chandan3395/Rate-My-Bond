import { memo } from "react";

function FieldHeader({ field, onAssist }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-white/85">
            {field.label}
          </label>
          <span
            title={field.tooltip}
            className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/15 text-[11px] text-white/60"
          >
            ?
          </span>
          {field.required ? (
            <span className="rounded-full bg-[#8fd7cf]/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8fd7cf]">
              Required
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm text-white/55">{field.tooltip}</p>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => onAssist(field, "notSure")}
          className="rounded-full border border-white/10 px-3 py-1.5 text-white/60 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
        >
          Not sure
        </button>
        <button
          type="button"
          onClick={() => onAssist(field, "auto")}
          className="rounded-full border border-[#8fd7cf]/20 px-3 py-1.5 text-[#8fd7cf] transition hover:bg-[#8fd7cf]/10"
        >
          Auto-detect
        </button>
      </div>
    </div>
  );
}

export default memo(FieldHeader);
