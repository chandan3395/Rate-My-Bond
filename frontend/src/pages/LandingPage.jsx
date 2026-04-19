import Hero from "../components/Hero";
import Steps from "../components/Steps";
import Features from "../components/Features";
import CTA from "../components/CTA";

function LandingPage({ onStartRating }) {
  return (
    <main>
      <Hero onStartRating={onStartRating} />
      <Steps />
      <Features />
      <CTA onStartRating={onStartRating} />
    </main>
  );
}

export default LandingPage;
