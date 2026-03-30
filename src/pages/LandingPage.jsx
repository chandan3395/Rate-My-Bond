import Hero from "../components/Hero";
import Steps from "../components/Steps";
import Features from "../components/Features";
import Preview from "../components/Preview";
import CTA from "../components/CTA";

function LandingPage({ onStartRating }) {
  return (
    <main>
      <Hero onStartRating={onStartRating} />
      <Steps />
      <Features />
      <Preview />
      <CTA onStartRating={onStartRating} />
    </main>
  );
}

export default LandingPage;
