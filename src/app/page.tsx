import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Dining } from "@/components/Dining";
import { Events } from "@/components/Events";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Preloader } from "@/components/Preloader";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function HomePage() {
  return (
    <>
      <Preloader />
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Dining />
        <Events />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
