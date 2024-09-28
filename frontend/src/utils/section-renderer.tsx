import Hero from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import Pricing from "../components/Pricing";
import Email from "../components/Email";
import LargeVideo from "../components/LargeVideo";
import TextSection from "@/components/TextSection";

export function sectionRenderer(section: any, index: number) {
  switch (section.__component) {
    case "sections.large-video":
      return <LargeVideo key={index} data={section} />;
    case "sections.hero":
      return <Hero key={index} data={section} />;
    case "sections.features":
      return <Features key={index} data={section} />;
    case "sections.testimonials-group":
      return <Testimonials key={index} data={section} />;
    case "sections.pricing":
      return <Pricing key={index} data={section} />;
    case "sections.text-section":
      return <TextSection key={index} data={section} />;
    default:
      return null;
  }
}
