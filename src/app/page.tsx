import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/layout/Hero";
import { Catalog } from "@/components/catalog/Catalog";
import { WhySoley } from "@/components/layout/WhySoley";
import { Audience } from "@/components/layout/Audience";
import { Process } from "@/components/layout/Process";
import { Instagram } from "@/components/layout/Instagram";
import { FAQ } from "@/components/layout/FAQ";
import { Contact } from "@/components/layout/Contact";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Catalog />
        <WhySoley />
        <Audience />
        <Process />
        <Instagram />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
