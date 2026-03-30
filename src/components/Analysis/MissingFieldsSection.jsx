import { memo } from "react";
import { fieldLabelMap } from "../../constants/formConstants";
import { safeArray } from "../../helpers/errorHandlers";

function MissingFieldsSection({ analysis }) {
  const missingRequired = safeArray(analysis.missingRequired);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
      <h2 className="text-2xl font-semibold text-white">
        Missing Required Fields
      </h2>

      <div className="mt-5">
        {missingRequired.length ? (
          <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-white/70 marker:text-[#8fd7cf]">
            {missingRequired.map((fieldId) => (
              <li key={fieldId}>{fieldLabelMap[fieldId] ?? fieldId}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm font-medium text-[#8fd7cf]">
            All required fields completed
          </p>
        )}
      </div>
    </div>
  );
}

export default memo(MissingFieldsSection);
