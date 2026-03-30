import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SitePreferencesBanner from "./components/SitePreferencesBanner";
import TermsConsentModal from "./components/TermsConsentModal";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import StaticPage from "./pages/StaticPage";
import BondCalculatorPage from "./pages/BondCalculatorPage";

const staticPages = {
  about: {
    title: "About Rate My Bond",
    description: [
    {
      heading: "Who we are",
      content: "RateMyBond is an independent bond analysis platform designed to help investors evaluate fixed-income opportunities with clarity and confidence."
    },
    {
      heading: "What we do",
      content: "We provide structured bond ratings based on key financial parameters such as credit risk, issuer strength, liquidity, returns, and repayment reliability."
    },
    {
      heading: "Problem",
      content: "Retail investors often invest in bonds without fully understanding the underlying risk, relying on fragmented or overly technical information."
    },
    {
      heading: "Solution",
      content: "RateMyBond simplifies bond evaluation by converting complex financial data into a clear, standardized rating system."
    },
    {
      heading: "Target users",
      list: [
        "Retail investors",
        "First-time bond investors",
        "Income-focused portfolios",
        "Users of platforms like Wint Wealth, Grip Invest"
      ]
    },
    {
      heading: "Mission",
      content: "To make bond investing transparent, comparable, and data-driven for everyone."
    }
  ],
  eyebrow: "Company",
},
  help: {
    title: "Help Center",
    description: [
      {
        heading: "Contact Us",
        content: "example@gmail.com",
      },
    ],
    eyebrow: "Support",
  },
  privacy: {
    title: "Privacy Policy",
    description: [
      {
        heading: "Data Collection",
        content:
          "We collect only the data necessary to improve user experience, such as:",
        list: [
          "Inputs provided for bond evaluation",
          "Basic analytics (usage patterns, session data)",
        ],
      },
      {
        heading: "Data Usage",
        list: [
          "To generate bond ratings",
          "To improve platform performance",
          "To enhance user experience",
        ],
      },
      {
        heading: "Data Protection",
        content:
          "We implement standard security measures to protect user data against unauthorized access.",
      },
      {
        heading: "Third-party sharing",
        content:
          "We do not sell or share personal data with third parties, except where required by law.",
      },
    ],
    eyebrow: "Legal",
  },
  terms: {
    title: "Terms and Conditions",
    description: [
      {
        heading: "Usage Terms",
        content: "By using RateMyBond, you agree that:",
        list: [
          <>The platform provides <strong>indicative ratings only</strong></>,
          "Decisions made based on the platform are your responsibility",
        ],
      },
      {
        heading: "No Liability",
        content: "We are not liable for:",
        list: [
          "Investment losses",
          "Incorrect financial decisions",
          "Market fluctuations",
        ],
      },
      {
        heading: "User Responsibility",
        content:
          "Users must ensure the accuracy of the data they input.",
      },
      {
        heading: "Modifications",
        content:
          "We reserve the right to update the platform, models, or terms without prior notice.",
      },
    ],
    eyebrow: "Legal",
  },
  cookies: {
    title: "Cookie Policy",
    description: [
      {
        heading: "How we use cookies",
        content:
          "We use cookies to ensure platform functionality, analyze usage, and improve your experience.",
      },
      {
        heading: "Cookie categories",
        list: [
          "Essential Cookies: required for core functionality and security",
          "Analytics Cookies: help us understand platform usage and performance",
          "Functional Cookies: enable personalization and enhanced features",
        ],
      },
      {
        heading: "Your choices",
        content:
          "You can accept all cookies, reject non-essential ones, or customize your preferences from the consent banner.",
      },
    ],
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

      <Routes>
        <Route
          path="/"
          element={<LandingPage onStartRating={openTermsModal} />}
        />
        <Route path="/calculator" element={<BondCalculatorPage />} />
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
