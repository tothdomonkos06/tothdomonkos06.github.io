import { Hero } from "@/components/sections/Hero";
import { Statement } from "@/components/sections/Statement";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { About } from "@/components/sections/About";
import { StackMarquee } from "@/components/sections/StackMarquee";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="bg-black">
      <Hero />
      <Statement />
      <Services />
      <Work />
      <About />
      <StackMarquee />
      <Contact />
    </main>
  );
}
