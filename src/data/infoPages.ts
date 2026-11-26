import type { Localized } from './i18n';

export type InfoPageSlug =
  | 'mission'
  | 'editorial-standards'
  | 'corrections'
  | 'volunteer';

export interface InfoSection {
  heading: Localized;
  paragraphs: Localized<string[]>;
}

export interface InfoPageContent {
  slug: InfoPageSlug;
  kicker: Localized;
  title: Localized;
  deck: Localized;
  sections: InfoSection[];
  cta?: {
    label: Localized;
    href: string;
    route: 'civictools' | 'submit' | 'home';
  };
}

export const INFO_PAGES: Record<InfoPageSlug, InfoPageContent> = {
  mission: {
    slug: 'mission',
    kicker: { en: 'About · BetterGov.ph', fil: 'Tungkol · BetterGov.ph' },
    title: { en: 'Our mission', fil: 'Aming misyon' },
    deck: {
      en: 'An open, volunteer-run hub connecting Filipinos with civic technology, civil society organizations, and independent reporting on public data.',
      fil: 'Isang bukas at pinatatakbo ng mga boluntaryong sentro na nag-uugnay sa mga Pilipino sa civic technology, mga CSO, at malayang pag-uulat sa pampublikong datos.',
    },
    sections: [
      {
        heading: {
          en: 'Why civictech.ph exists',
          fil: 'Bakit nabuo ang civictech.ph',
        },
        paragraphs: {
          en: [
            'Across the Philippines, engineers, researchers, journalists, and Civil Society Organizations (CSOs) are building tools that make public budgets, procurement records, hazard maps, and government services easier to understand and use.',
            'Too often, these initiatives live in scattered repositories or social media threads. civictech.ph — continuing the open-source foundation of OpenBayan.org under BetterGov.ph — brings them together into one searchable directory across 15 public-interest sectors.',
          ],
          fil: [
            'Sa buong Pilipinas, ang mga inhinyero, mananaliksik, mamamahayag, at Civil Society Organization (CSO) ay gumagawa ng mga kasangkapang nagpapadali sa pag-unawa ng pambansang badyet, pagbili ng gobyerno, mapa ng sakuna, at serbisyo publiko.',
            'Kadalasan, kalat-kalat ang mga inisyatibong ito sa iba’t ibang repository o post sa social media. Pinagsasama-sama sila ng civictech.ph — bilang pagpapatuloy ng OpenBayan.org sa ilalim ng BetterGov.ph — sa iisang direktoryo na sumasaklaw sa 15 sektor.',
          ],
        },
      },
      {
        heading: {
          en: 'Open, independent, and user-centered',
          fil: 'Bukas, malaya, at nakatuon sa mamamayan',
        },
        paragraphs: {
          en: [
            'We operate independently of any government agency or political group, with zero ads and zero tracking. Our goal is a transparent, interoperable digital government ecosystem where open-source public tools are trusted, discovered, and sustainably maintained.',
          ],
          fil: [
            'Gumagana kami nang malaya mula sa anumang ahensya ng gobyerno o partidong pampulitika, nang walang patalastas at walang tracking. Layunin namin ang isang malinaw at nagtutulungang digital na pamamahala kung saan pinagkakatiwalaan at napapanatili ang mga bukas na kasangkapan.',
          ],
        },
      },
    ],
    cta: {
      label: { en: 'Explore the Directory →', fil: 'Galugarin ang Direktoryo →' },
      href: '/civictools',
      route: 'civictools',
    },
  },
  'editorial-standards': {
    slug: 'editorial-standards',
    kicker: { en: 'Newsroom · Policy', fil: 'Newsroom · Patakaran' },
    title: { en: 'Editorial standards', fil: 'Pamantayang editoryal' },
    deck: {
      en: 'How we report, verify data, separate opinion from reporting, and maintain independence across Civic Tech.',
      fil: 'Paano kami nag-uulat, nagbeberipika ng datos, naghihiwalay ng opinyon sa balita, at nagpapanatili ng kalayaan sa Civic Tech.',
    },
    sections: [
      {
        heading: {
          en: 'Independence and transparency',
          fil: 'Kalayaan at transparency',
        },
        paragraphs: {
          en: [
            'Civic Tech is an independent, volunteer-driven newsroom of BetterGov.ph. We do not accept paid placements, sponsored articles, or funding conditioned on editorial coverage.',
            'Whenever contributors write about tools they helped build or organizations they belong to, that relationship is disclosed clearly in the article or byline.',
          ],
          fil: [
            'Ang Civic Tech ay isang malayang newsroom na pinatatakbo ng mga boluntaryo ng BetterGov.ph. Hindi kami tumatanggap ng bayad na artikulo o pondong may kondisyon sa aming pag-uulat.',
            'Sa tuwing nagsusulat ang isang kontribyutor tungkol sa kasangkapan o organisasyong bahagi siya, malinaw itong inihahayag sa artikulo o byline.',
          ],
        },
      },
      {
        heading: {
          en: 'Primary sources and reproducible data',
          fil: 'Pangunahing sanggunian at nasusuring datos',
        },
        paragraphs: {
          en: [
            'Data-driven stories link directly to primary public records — such as the General Appropriations Act, PhilGEPS notices, official agency portals, and open repositories — so readers can inspect and verify our findings.',
            'Reported features, explanatory guides, and Opinion essays are clearly labeled. Directory listings on /civictools reflect community and maintainer submissions reviewed by volunteers.',
          ],
          fil: [
            'Ang mga ulat na nakabatay sa datos ay direktang nakaugnay sa mga opisyal na pampublikong rekord — tulad ng General Appropriations Act, PhilGEPS, at bukas na repository — upang masuri mismo ng mambabasa.',
            'Malinaw na minamarkahan ang mga tampok na ulat, gabay, at sanaysay ng Opinyon. Ang mga entri sa /civictools ay mula sa kontribusyon ng komunidad na sinusuri ng mga boluntaryo.',
          ],
        },
      },
    ],
    cta: {
      label: { en: 'Read our reporting →', fil: 'Basahin ang mga ulat →' },
      href: '/',
      route: 'home',
    },
  },
  corrections: {
    slug: 'corrections',
    kicker: { en: 'Accountability · Public Record', fil: 'Pananagutan · Pampublikong Rekord' },
    title: { en: 'Corrections', fil: 'Mga pagwawasto' },
    deck: {
      en: 'When we get a fact, link, or directory detail wrong, we fix it promptly and note the change openly.',
      fil: 'Kapag may mali kaming impormasyon, link, o detalye sa direktoryo, agad namin itong itinatama at malinaw na itinatala.',
    },
    sections: [
      {
        heading: {
          en: 'How we handle corrections',
          fil: 'Paano kami nagwawasto',
        },
        paragraphs: {
          en: [
            'Substantive factual errors in articles are corrected as soon as verified, with a dated correction note appended to the story explaining what was changed. Minor typographical fixes that do not alter meaning are updated directly.',
          ],
          fil: [
            'Ang mahahalagang pagkakamali sa katotohanan sa mga artikulo ay itinatama agad kapag naberipika, at may kasamang petsa at tala kung ano ang binago.',
          ],
        },
      },
      {
        heading: {
          en: 'Updating a project or CSO listing',
          fil: 'Pag-update ng entri ng proyekto o CSO',
        },
        paragraphs: {
          en: [
            'If a civic tech project or CSO listing has an outdated stage (Planning, Alpha, Beta, Stable, Archived), broken URL, or incorrect sector, anyone can submit an update directly through our public submission workflow.',
            'Every update creates a transparent Pull Request on GitHub so changes to the public directory remain auditable.',
          ],
          fil: [
            'Kung ang isang proyekto o CSO ay may lumang antas (Stage), sirang link, o maling sektor, maaaring magsumite ng update ang sinuman sa pamamagitan ng aming pampublikong form.',
            'Bawat update ay gumagawa ng Pull Request sa GitHub upang manatiling malinaw at nasusuri ang kasaysayan ng direktoryo.',
          ],
        },
      },
    ],
    cta: {
      label: { en: 'Post a directory update →', fil: 'Mag-post ng update sa direktoryo →' },
      href: '/civictools/submit#update',
      route: 'submit',
    },
  },
  volunteer: {
    slug: 'volunteer',
    kicker: { en: 'Get involved · BetterGov.ph', fil: 'Makisangkot · BetterGov.ph' },
    title: { en: 'Volunteer', fil: 'Magboluntaryo' },
    deck: {
      en: 'Help build, curate, and document Philippine civic technology — whether you write code, analyze budgets, design interfaces, or organize communities.',
      fil: 'Tumulong sa pagbuo, pag-ayos, at pagdodokumento ng civic technology sa Pilipinas — developer ka man, mananaliksik, designer, o manunulat.',
    },
    sections: [
      {
        heading: {
          en: 'Ways to contribute',
          fil: 'Mga paraan ng pagtulong',
        },
        paragraphs: {
          en: [
            'Developers & Data Wranglers: Maintain open-source civic tools, extract public datasets, and improve accessibility across local government portals.',
            'Researchers & Writers: Document existing civic tech projects and CSOs across our 15 sectors, verify public records, and pitch stories on open government.',
            'Designers & Testers: Audit mobile usability, test civic apps on low-bandwidth connections, and help make public information clear for every citizen.',
          ],
          fil: [
            'Mga Developer at Data Wrangler: Tumulong sa pagpapanatili ng mga open-source na kasangkapan at pag-aayos ng pampublikong dataset.',
            'Mga Mananaliksik at Manunulat: Magdokumento ng mga proyekto at CSO sa 15 sektor, at magsulat ng mga ulat tungkol sa bukas na pamamahala.',
            'Mga Designer at Tester: Suriin ang paggamit sa mobile at tiyaking malinaw at madaling gamitin ang pampublikong impormasyon.',
          ],
        },
      },
      {
        heading: {
          en: 'Start by adding a project or CSO',
          fil: 'Magsimula sa pagdagdag ng proyekto o CSO',
        },
        paragraphs: {
          en: [
            'Know a Philippine civic tech tool or Civil Society Organization that is missing from the directory? Submit it in two minutes — no coding required.',
          ],
          fil: [
            'May alam ka bang civic tech tool o Civil Society Organization sa Pilipinas na wala pa sa direktoryo? Isumite ito sa loob ng dalawang minuto.',
          ],
        },
      },
    ],
    cta: {
      label: { en: 'Submit a Project or CSO →', fil: 'Magsumite ng Proyekto o CSO →' },
      href: '/civictools/submit',
      route: 'submit',
    },
  },
};
