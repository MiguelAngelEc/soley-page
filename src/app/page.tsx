import {
  Header,
  Footer,
  Hero,
  WhySoley,
  TargetMarkets,
  ContactCTA
} from '@/components/layout';
import { FeaturedProducts } from '@/components/catalog';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section id="inicio">
          <Hero />
        </section>

        <FeaturedProducts />
        <WhySoley />
        <TargetMarkets />
        <ContactCTA />
      </main>

      <Footer />
    </div>
  );
}
