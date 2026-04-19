import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function TermsConsentModal({ isOpen, onClose, onAccept }) {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setAccepted(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#021011]/75 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#0b2f30] p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8fd7cf]">
          Before you continue
        </p>
        <h3 className="mt-3 text-3xl font-semibold text-white">
          Accept the Terms and Conditions
        </h3>
        <p className="mt-4 text-base leading-7 text-white/70">
          To start rating bonds on the platform, you need to confirm that you
          have read and accepted our terms. This step helps keep the experience
          clear, compliant, and consistent for every user.
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-white/65">
          <p>
            By proceeding, you confirm that you understand our platform
            provides indicative ratings and that final investment decisions
            remain your responsibility.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <Link to="/terms" className="text-[#8fd7cf] transition hover:text-white">
              Read Terms and Conditions
            </Link>
            <Link to="/privacy" className="text-[#8fd7cf] transition hover:text-white">
              Read Privacy Policy
            </Link>
          </div>
        </div>

        <label className="mt-6 flex items-start gap-3 rounded-2xl border border-white/10 bg-[#103a3b] p-4 text-sm text-white/80">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-[#8fd7cf] focus:ring-[#8fd7cf]"
          />
          <span>
            I have read and accept the Terms and Conditions and Privacy Policy.
          </span>
        </label>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onAccept}
            disabled={!accepted}
            className="rounded-full bg-[#8fd7cf] px-5 py-3 text-sm font-semibold text-[#062021] transition hover:scale-[1.02] hover:bg-[#9fe5de] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Accept and Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default TermsConsentModal;
