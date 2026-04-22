import { memo } from "react";
import { issuerCatalog } from "../../data/bondFormConfig";
import { validateNumericField } from "../../helpers/validation";

function getInputClasses(hasError) {
  return `w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 ${
    hasError
      ? "border-[#f39a8d]/70 bg-[#2b1c1a] focus:border-[#f39a8d]"
      : "border-white/10 bg-[#103a3b] focus:border-[#8fd7cf]/50"
  }`;
}

function renderControl(field, value, onChange, hasError) {
  const issuerOptionsId = `${field.id}-options`;
  const inputClasses = getInputClasses(hasError);

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
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/45">
            INR
          </span>
          <input
            id={field.id}
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
            placeholder="Enter amount"
            className={`${inputClasses} pl-14`}
          />
        </div>
      </div>
    );
  }

  if (field.type === "percent") {
    return (
      <div className="relative">
        <input
          id={field.id}
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
          className={`${inputClasses} pr-10`}
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/45">
          %
        </span>
      </div>
    );
  }

  if (field.type === "search") {
    return (
      <>
        <input
          id={field.id}
          list={issuerOptionsId}
          value={value}
          placeholder="Search issuer"
          onChange={(event) => onChange(field.id, event.target.value)}
          className={inputClasses}
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
                  : hasError
                    ? "border-[#f39a8d]/40 bg-[#2b1c1a]/65 text-white/80 hover:border-[#f39a8d]/65"
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

  if (field.type === "toggle") {
    return (
      <div className="inline-flex flex-wrap rounded-full border border-white/10 bg-[#103a3b] p-1">
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
      id={field.id}
      value={value}
      onChange={(event) => onChange(field.id, event.target.value)}
      className={inputClasses}
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

function renderBadgePreview(field, value) {
  if (!field.badgeMap) {
    return null;
  }

  const selectedClassName = field.badgeMap[value] || "bg-white/5 text-white/65 border-white/10";
  const legend = field.badgeLegend ?? [];

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
        Rating view
      </span>
      {legend.map((option) => (
        <span
          key={option}
          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${field.badgeMap[option]}`}
        >
          {option}
        </span>
      ))}
      {value ? (
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${selectedClassName}`}
        >
          Selected: {value}
        </span>
      ) : null}
    </div>
  );
}

function FormField({
  field,
  value,
  onChange,
  onAssist,
  openHelpId,
  setOpenHelpId,
  error,
}) {
  const hasError = Boolean(error);
  const isHelpOpen = openHelpId === field.id;

  return (
    <div
      className={`rounded-[1.5rem] border p-5 transition ${
        hasError
          ? "border-[#f39a8d]/45 bg-[#1d1615]"
          : "border-white/10 bg-[#0d2b2c]/80"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor={field.id} className="text-base font-semibold text-white">
              {field.label}
            </label>
            {field.required ? (
              <span className="rounded-full bg-[#8fd7cf]/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8fd7cf]">
                Required
              </span>
            ) : (
              <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Optional
              </span>
            )}
          </div>
          <p className="mt-2 text-sm leading-6 text-white/60">{field.tooltip}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => onAssist(field, "auto")}
            className="rounded-full border border-[#8fd7cf]/20 px-3 py-1.5 text-[#8fd7cf] transition hover:bg-[#8fd7cf]/10"
          >
            Auto-detect
          </button>
        </div>
      </div>

      <div className="mt-5">{renderControl(field, value, onChange, hasError)}</div>
      {renderBadgePreview(field, value)}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {hasError ? (
          <p className="text-sm font-medium text-[#f7b3b3]">{error}</p>
        ) : (
          <p className="text-sm text-white/45">Keep the original entry as listed.</p>
        )}

        <button
          type="button"
          onClick={() =>
            setOpenHelpId((currentId) => (currentId === field.id ? null : field.id))
          }
          className="text-sm font-medium text-[#8fd7cf] transition hover:text-white"
        >
          {isHelpOpen ? "Hide field guide" : "Open field guide"}
        </button>
      </div>

      {isHelpOpen ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-[#103a3b] px-4 py-4 text-sm text-white/70">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <p className="font-semibold text-white">Meaning</p>
              <p className="mt-1 leading-7">{field.meaning}</p>
            </div>
            <div>
              <p className="font-semibold text-white">Explanation</p>
              <p className="mt-1 leading-7">{field.details}</p>
            </div>
            <div>
              <p className="font-semibold text-white">Example</p>
              <p className="mt-1 leading-7">{field.example}</p>
            </div>
            <div>
              <p className="font-semibold text-white">How to choose</p>
              <p className="mt-1 leading-7">{field.howToChoose}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default memo(FormField);
