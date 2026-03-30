import { memo } from "react";

function CardsField({ field, value, onChange }) {
  const columns =
    field.options.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2";

  return (
    <div className={`grid gap-3 ${columns}`}>
      {field.options.map((option) => {
        const optionValue = option.value ?? option.label;
        const active = value === optionValue;

        return (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange(field.id, optionValue)}
            className={`rounded-2xl border p-4 text-left transition ${
              active
                ? "border-[#8fd7cf]/60 bg-[#8fd7cf]/10 text-white"
                : "border-white/10 bg-[#103a3b] text-white/70 hover:border-white/20 hover:bg-white/5"
            }`}
          >
            <p className="font-semibold">{option.label}</p>
            {option.sublabel ? (
              <p className="mt-2 text-sm leading-6 text-inherit/80">
                {option.sublabel}
              </p>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export default memo(CardsField);
