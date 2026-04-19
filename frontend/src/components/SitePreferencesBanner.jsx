import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const COOKIE_STORAGE_KEY = "rate-my-bond-cookie-consent";

const defaultPreferences = {
  essential: true,
  analytics: false,
  functional: false,
};

function Toggle({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
        checked ? "bg-[#8fd7cf]" : "bg-white/10"
      } ${disabled ? "cursor-not-allowed opacity-70" : ""}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-[#062021] transition ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SitePreferencesBanner() {
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preferences, setPreferences] = useState(defaultPreferences);

  useEffect(() => {
    const savedPreferences = window.localStorage.getItem(COOKIE_STORAGE_KEY);

    if (!savedPreferences) {
      setIsConsentOpen(true);
      return;
    }

    try {
      const parsedPreferences = JSON.parse(savedPreferences);
      setPreferences({
        essential: true,
        analytics: Boolean(parsedPreferences.analytics),
        functional: Boolean(parsedPreferences.functional),
      });
    } catch {
      setIsConsentOpen(true);
    }
  }, []);

  const persistPreferences = (nextPreferences) => {
    window.localStorage.setItem(
      COOKIE_STORAGE_KEY,
      JSON.stringify({
        ...nextPreferences,
        consentedAt: new Date().toISOString(),
      }),
    );
    setPreferences(nextPreferences);
    setIsConsentOpen(false);
    setIsModalOpen(false);
  };

  const handleAcceptAll = () => {
    persistPreferences({
      essential: true,
      analytics: true,
      functional: true,
    });
  };

  const handleRejectNonEssential = () => {
    persistPreferences({
      essential: true,
      analytics: false,
      functional: false,
    });
  };

  const handleSavePreferences = () => {
    persistPreferences(preferences);
  };

  const togglePreference = (key) => {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <>
      {isConsentOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#021011]/45 px-4 py-8 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#0b2f30]/96 p-8 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8fd7cf]">
              Privacy choices
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              We use cookies
            </h2>
            <p className="mt-4 text-base leading-7 text-white/70">
              We use cookies to ensure platform functionality, analyze usage,
              and improve your experience. You can accept all cookies, reject
              non-essential ones, or customize your preferences.
            </p>
            <p className="mt-4 text-sm text-white/55">
              Learn more in our{" "}
              <Link
                to="/cookies"
                className="font-medium text-[#8fd7cf] transition hover:text-white"
              >
                Cookie Policy
              </Link>
              .
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="rounded-full bg-[#8fd7cf] px-5 py-3 text-sm font-semibold text-[#062021] transition hover:scale-[1.02] hover:bg-[#9fe5de]"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="rounded-full border border-[#8fd7cf]/30 px-5 py-3 text-sm font-semibold text-[#8fd7cf] transition hover:bg-[#8fd7cf]/10"
              >
                Customize Settings
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isModalOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#021011]/70 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[#0b2f30] p-8 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8fd7cf]">
                  Cookie preferences
                </p>
                <h3 className="mt-3 text-3xl font-semibold text-white">
                  Customize Settings
                </h3>
              </div>
              {isConsentOpen ? null : (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                >
                  Close
                </button>
              )}
            </div>

            <div className="mt-8 space-y-5">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      Essential Cookies
                    </h4>
                    <p className="mt-2 text-sm leading-7 text-white/65">
                      Required for core functionality and security. Cannot be
                      disabled.
                    </p>
                  </div>
                  <Toggle checked disabled />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      Analytics Cookies
                    </h4>
                    <p className="mt-2 text-sm leading-7 text-white/65">
                      Help us understand how users interact with the platform to
                      improve performance.
                    </p>
                  </div>
                  <Toggle
                    checked={preferences.analytics}
                    onChange={() => togglePreference("analytics")}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      Functional Cookies
                    </h4>
                    <p className="mt-2 text-sm leading-7 text-white/65">
                      Enable personalization and enhanced features.
                    </p>
                  </div>
                  <Toggle
                    checked={preferences.functional}
                    onChange={() => togglePreference("functional")}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleSavePreferences}
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
              >
                Save Preferences
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="rounded-full bg-[#8fd7cf] px-5 py-3 text-sm font-semibold text-[#062021] transition hover:scale-[1.02] hover:bg-[#9fe5de]"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default SitePreferencesBanner;
