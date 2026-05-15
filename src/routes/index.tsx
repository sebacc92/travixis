import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { Navbar } from "~/components/landing/Navbar";
import { Hero } from "~/components/landing/Hero";
import { ServicesStrip } from "~/components/landing/ServicesStrip";
import { AboutSection } from "~/components/landing/AboutSection";
import { BenefitsGrid } from "~/components/landing/BenefitsGrid";
import { CoverageSection } from "~/components/landing/CoverageSection";
import { Footer } from "~/components/landing/Footer";
import { WhatsAppButton } from "~/components/ui/whatsapp-button";
import { Chatbot } from "~/components/ui/chatbot";
import { SitePopup } from "~/components/ui/site-popup";
import { getDb } from "~/db";
import { getSiteSettings } from "~/server/site-settings";
import { Contact } from "~/components/landing/Contact";
export const useSiteSettings = routeLoader$(async (requestEvent) => {
  const db = getDb(requestEvent.env);
  return (await getSiteSettings(db)) ?? null;
});

export default component$(() => {
  const settings = useSiteSettings();

  return (
    <>
      <Navbar />
      <main class="flex flex-col overflow-hidden">
        <Hero
          title1={settings.value?.homeTitle1}
          title2={settings.value?.homeTitle2}
          subtitle={settings.value?.homeSubtitle}
          whatsappNumber={settings.value?.whatsappNumber}
        />
        <ServicesStrip />
        <AboutSection />
        <BenefitsGrid />
        <CoverageSection />
        <Contact />
      </main>
      <Footer />

      <WhatsAppButton
        phone={settings.value?.whatsappNumber || undefined}
      />

      {settings.value?.aiEnabled !== false && (
        <Chatbot avatarUrl={settings.value?.aiAvatarUrl || undefined} />
      )}

      {settings.value?.popupEnabled && (
        <SitePopup
          imageUrl={settings.value?.popupImageUrl}
          title={settings.value?.popupTitle}
          description={settings.value?.popupDescription}
          ctaText={settings.value?.popupCtaText}
          ctaLink={settings.value?.popupCtaLink}
        />
      )}
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
