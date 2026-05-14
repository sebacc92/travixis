import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Navbar } from "~/components/landing/Navbar";
import { Hero } from "~/components/landing/Hero";
import { BenefitsGrid } from "~/components/landing/BenefitsGrid";
import { CoverageSection } from "~/components/landing/CoverageSection";
import { Footer } from "~/components/landing/Footer";

export default component$(() => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <BenefitsGrid />
        <CoverageSection />
      </main>
      <Footer />
    </>
  );
});

export const head: DocumentHead = {
  title: "Travixis Travel Care – Asistencia al viajero 24/7",
  meta: [
    {
      name: "description",
      content:
        "Viajar con respaldo real. Emergencias médicas, reintegro de medicamentos y cobertura de equipaje. Llamá al 54 9 11 5053-2300.",
    },
    {
      name: "keywords",
      content:
        "asistencia al viajero, emergencias médicas, cobertura viaje, travixis, universal assistance",
    },
    { property: "og:title", content: "Travixis Travel Care" },
    {
      property: "og:description",
      content: "Tu asistencia, estés donde estés. Cobertura integral durante el viaje.",
    },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
};
