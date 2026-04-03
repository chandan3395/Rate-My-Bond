import { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SitePreferencesBanner from "./components/SitePreferencesBanner";
import TermsConsentModal from "./components/TermsConsentModal";
import staticPages from "./data/staticPages";
import ProtectedRoute from "./components/ProtectedRoute";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const SignInPage = lazy(() => import("./pages/SignInPage"));
const StaticPage = lazy(() => import("./pages/StaticPage"));
const BondCalculatorPage = lazy(() => import("./pages/BondCalculatorPage"));

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");

      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });

      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.hash, location.pathname]);

  return null;
}

function App() {
  const navigate = useNavigate();
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const openTermsModal = () => {
    setIsTermsModalOpen(true);
  };

  const closeTermsModal = () => {
    setIsTermsModalOpen(false);
  };

  const acceptTermsAndContinue = () => {
    setIsTermsModalOpen(false);
    navigate("/calculator");
  };

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#081d1e] font-sans text-white">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#1b6660]/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[24rem] w-[24rem] rounded-full bg-[#0f3d3e]/20 blur-3xl" />
      </div>

      <Navbar onStartRating={openTermsModal} />
      <ScrollToHash />

      <Suspense fallback={<div className="px-6 py-16 text-white/70">Loading...</div>}>
        <Routes>
          <Route
            path="/"
            element={<LandingPage onStartRating={openTermsModal} />}
          />
          <Route
            path="/calculator"
            element={
              <ProtectedRoute>
                <BondCalculatorPage />
              </ProtectedRoute>
            }
          />
          <Route path="/signin" element={<SignInPage />} />
          <Route
            path="/about"
            element={<StaticPage {...staticPages.about} />}
          />
          <Route path="/help" element={<StaticPage {...staticPages.help} />} />
          <Route
            path="/privacy"
            element={<StaticPage {...staticPages.privacy} />}
          />
          <Route path="/terms" element={<StaticPage {...staticPages.terms} />} />
          <Route
            path="/cookies"
            element={<StaticPage {...staticPages.cookies} />}
          />
          <Route
            path="*"
            element={<LandingPage onStartRating={openTermsModal} />}
          />
        </Routes>
      </Suspense>

      <SitePreferencesBanner />
      <TermsConsentModal
        isOpen={isTermsModalOpen}
        onClose={closeTermsModal}
        onAccept={acceptTermsAndContinue}
      />
      <Footer />
    </div>
  );
}

export default App;
