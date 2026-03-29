import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import StaticPage from "./pages/StaticPage";

const staticPages = {
  about: {
    title: "About Rate My Bond",
    description:
      "We help teams review issuer strength, coverage metrics, and bond structure with a cleaner underwriting workflow.",
    eyebrow: "Company",
  },
  help: {
    title: "Help Center",
    description:
      "Need support, onboarding help, or setup guidance? This page is ready for your FAQs and contact details.",
    eyebrow: "Support",
  },
  privacy: {
    title: "Privacy Policy",
    description:
      "This placeholder is ready for your privacy policy content and data handling disclosures.",
    eyebrow: "Legal",
  },
  terms: {
    title: "Terms and Conditions",
    description:
      "This placeholder is ready for your usage terms, platform conditions, and service agreement details.",
    eyebrow: "Legal",
  },
  cookies: {
    title: "Cookie Policy",
    description:
      "This placeholder is ready for your cookie usage details, consent guidance, and tracking disclosures.",
    eyebrow: "Legal",
  },
};

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
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#081d1e] font-sans text-white">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#1b6660]/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[24rem] w-[24rem] rounded-full bg-[#0f3d3e]/20 blur-3xl" />
      </div>

      <Navbar />
      <ScrollToHash />

      <Routes>
        <Route path="/" element={<LandingPage />} />
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
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
