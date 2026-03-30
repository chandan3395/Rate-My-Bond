import { memo } from "react";
import CardsField from "./CardsField";
import { issuerCatalog } from "../../data/bondFormConfig";
import { validateNumericField } from "../../helpers/validation";

function FieldControl({ field, value, onChange }) {
  const issuerOptionsId = `${field.id}-options`;

  if (field.type === "amount") {
    return (
      <div className="space-y-4">
        <input
          type="range"
          min={field.min}
          max={field.max}
          step={field.step}
          value={value || field.min}
          onChange={(event) => onChange(field.id, Number(event.target.value))}
          className="w-full accent-[#8fd7cf]"
        />
        <input
          type="number"
          min={field.min}
          max={field.max}
          step={field.step}
          value={value}
          onChange={(event) =>
            onChange(
              field.id,
              validateNumericField(field, event.target.value).normalizedValue,
            )
          }
          placeholder="Enter amount in INR"
          className="w-full rounded-2xl border border-white/10 bg-[#103a3b] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#8fd7cf]/50"
        />
      </div>
    );
  }

  if (field.type === "percent") {
    return (
      <div className="relative">
        <input
          type="number"
          min={field.min}
          max={field.max}
          step={field.step}
          value={value}
          onChange={(event) =>
            onChange(
              field.id,
              validateNumericField(field, event.target.value).normalizedValue,
            )
          }
          placeholder="Enter rate"
          className="w-full rounded-2xl border border-white/10 bg-[#103a3b] px-4 py-3 pr-10 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#8fd7cf]/50"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/45">
          %
        </span>
      </div>
    );
  }

  if (field.type === "search") {
    return (
      <>
        <input
          list={issuerOptionsId}
          value={value}
          placeholder="Search issuer"
          onChange={(event) => onChange(field.id, event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-[#103a3b] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#8fd7cf]/50"
        />
        <datalist id={issuerOptionsId}>
          {Object.keys(issuerCatalog).map((issuer) => (
            <option key={issuer} value={issuer} />
          ))}
        </datalist>
      </>
    );
  }

  if (field.type === "cards") {
    return <CardsField field={field} value={value} onChange={onChange} />;
  }

  if (field.type === "toggle") {
    return (
      <div className="inline-flex rounded-full border border-white/10 bg-[#103a3b] p-1">
        {field.options.map((option) => {
          const active = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(field.id, option.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-[#8fd7cf] text-[#062021]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <select
      value={value}
      onChange={(event) => onChange(field.id, event.target.value)}
      className="w-full rounded-2xl border border-white/10 bg-[#103a3b] px-4 py-3 text-sm text-white outline-none transition focus:border-[#8fd7cf]/50"
    >
      <option value="">Select an option</option>
      {field.options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export default memo(FieldControl);
