import { startTransition, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth, googleProvider, hasFirebaseConfig } from "../lib/firebase";

function SignInPage() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!auth) {
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
    });

    return unsubscribe;
  }, []);

  const handleGoogleSignIn = async () => {
    if (!auth || !googleProvider) {
      setErrorMessage(
        "Add your Firebase environment variables to enable Google sign-in.",
      );
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      await signInWithPopup(auth, googleProvider);
      startTransition(() => {
        setStatus("success");
      });
    } catch (error) {
      setStatus("idle");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Google sign-in could not be completed.",
      );
    }
  };

  const handleSignOut = async () => {
    if (!auth) {
      return;
    }

    await signOut(auth);
    setStatus("idle");
  };

  return (
    <main className="px-6 py-16 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8fd7cf]">
            Secure access
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Sign in and start rating with Google
          </h1>
          <p className="mt-5 text-lg leading-8 text-white/70">
            Your sign-in experience is now routed to a dedicated page and ready
            for Google OAuth. Once your Firebase credentials are added, your
            team can authenticate without maintaining passwords manually.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={status === "loading"}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[#8fd7cf] px-6 py-3 text-sm font-semibold text-[#062021] shadow-soft transition hover:scale-[1.02] hover:bg-[#9fe5de] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  fill="#062021"
                  d="M21.8 12.23c0-.76-.07-1.49-.2-2.2H12v4.16h5.5a4.7 4.7 0 0 1-2.05 3.08v2.56h3.32c1.95-1.79 3.03-4.44 3.03-7.6Z"
                />
                <path
                  fill="#062021"
                  d="M12 22c2.74 0 5.03-.91 6.7-2.48l-3.32-2.56c-.92.62-2.09.98-3.38.98-2.6 0-4.8-1.76-5.59-4.12H2.97v2.64A10 10 0 0 0 12 22Z"
                />
                <path
                  fill="#062021"
                  d="M6.41 13.82A6 6 0 0 1 6.1 12c0-.63.11-1.24.31-1.82V7.54H2.97A10 10 0 0 0 2 12c0 1.61.38 3.13.97 4.46l3.44-2.64Z"
                />
                <path
                  fill="#062021"
                  d="M12 6.06c1.49 0 2.83.51 3.88 1.5l2.92-2.92C17.02 2.96 14.74 2 12 2a10 10 0 0 0-9.03 5.54l3.44 2.64C7.2 7.82 9.4 6.06 12 6.06Z"
                />
              </svg>
              {status === "loading" ? "Connecting..." : "Continue with Google"}
            </button>

            <Link
              to="/calculator"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
            >
              Open calculator
            </Link>
          </div>

          {errorMessage ? (
            <p className="mt-5 text-sm text-[#f7b3b3]">{errorMessage}</p>
          ) : null}

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              "Google OAuth flow",
              "Session-ready auth state",
              "Environment-based setup",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/70"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-[#0d2b2c]/85 p-8 shadow-soft">
          <div className="overflow-hidden rounded-[1.5rem] border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=1200&q=80"
              alt="Analyst workspace"
              className="h-72 w-full object-cover"
            />
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-[#8fd7cf]/15 bg-[#103a3b] p-5">
              <p className="text-sm text-white/60">Authentication status</p>
              <p className="mt-2 text-lg font-semibold text-white">
                {user ? `Signed in as ${user.displayName || user.email}` : "Not signed in"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-white/65">
              {hasFirebaseConfig
                ? "Firebase credentials detected. Google sign-in can be tested now."
                : "Firebase credentials are not set yet. Add the values from .env.example before testing Google OAuth."}
            </div>

            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex w-full items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
              >
                Sign out
              </button>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

export default SignInPage;
