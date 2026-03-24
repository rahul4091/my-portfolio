export const dynamic = "force-dynamic";
import Hero from "@/components/Hero";
import Skil from "@/components/Skill";
import Project from "@/components/Project";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Skil />
      <Project />
      <Contact />
      <Footer />
    </>
  );
}
