import Features from "./_components/Features";
import GetApp from "./_components/GetApp";
import Hero from "./_components/Hero";
import HowWeWork from "./_components/HowWeWork";
import OurImpact from "./_components/OurImpact";

export default function Home() {
  return (
    <div className="w-full h-full">
      <Hero />
      <Features />
      <HowWeWork />
      {/* <Testimonials /> */}
      {/* <Opportunities /> */}
      <OurImpact />
      <GetApp />
    </div>
  );
}
