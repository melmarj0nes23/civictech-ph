import type { Lang } from './i18n';

const FIL_SUMMARIES: Record<string, string> = {
  '2026-budget-analysis':
    'Suriin ang isang malayang pagsusuri ng 2026 pambansang badyet ng Pilipinas.',
  'asean-in-data':
    'Ikumpara ang ekonomiya, populasyon, pamamahala, at panganib sa Timog-Silangang Asya gamit ang mga tsart at mada-download na datos.',
  'barangay-api':
    'Bukas na API para sa datos ng mga barangay at lokal na yunit sa Pilipinas.',
  'batas-watch':
    'Subaybayan ang mga panukalang batas sa Kamara at Senado mula sa ika-20 Kongreso kasama ang estado, may-akda, komite, at opisyal na sanggunian.',
  bettergov:
    'Kilusang pinangungunahan ng komunidad upang bumuo ng mas madaling gamiting pambansang website ng gobyerno para sa serbisyo at impormasyon.',
  'bettergov-sso-account-application':
    'Nakalaang identity provider na nagbibigay sa mga gumagamit ng BetterGov ng iisang account na may ligtas na pag-login at JWT-based SSO.',
  betterlgu:
    'Maghanap at mag-ambag sa mga portal ng transparency para sa mga lokal na pamahalaan sa buong Pilipinas.',
  'bisto-proyekto':
    'Subaybayan at iulat ang mga proyekto sa imprastraktura ng gobyerno sa pamamagitan ng interface na pinatatakbo ng mamamayan.',
  'budget-portal':
    'Suriin ang panukalang pambansang badyet para sa FY 2027 at ikumpara ito bawat linya sa FY 2026 General Appropriations Act.',
  cadena:
    'Tuklasin ang panukalang digital budget transparency para sa paglalathala ng masusubaybayang transaksyon sa badyet ng gobyerno.',
  'congress-datasets-api':
    'Pinag-isang dataset at API para sa lehislatibong datos ng Pilipinas, kabilang ang mga mambabatas, panukalang batas, at komite.',
  'data-research':
    'Galugarin ang mga interaktibong tsart, grap, at mapa na sumusuri sa badyet, pagbili, at imprastraktura ng gobyerno.',
  dynasties:
    'Tingnan ang bawat kandidato sa lokal na halalan mula 2001: sino ang nanalo, natalo, bumabalik, at aling apelyido ang may hawak ng puwesto.',
  'flood-control-browser':
    'Suriin ang mga pampublikong rekord ng mga proyektong flood-control sa buong Pilipinas.',
  floodtrack:
    'Platapormang pinatatakbo ng komunidad para sa pag-uulat ng baha na nagmamapa ng panganib, ligtas na lugar, at tulong sa real time.',
  'floodwatch-philippines':
    'Platapormang laban sa korapsyon na naglalantad ng mga iregular na proyektong flood-control gamit ang mga mapa at ligtas na pag-uulat.',
  'jeepney-design-system':
    'Isang makulay na design system para sa mga web at native na aplikasyon.',
  'juris-ph':
    'Maghanap ng mga desisyon ng Korte Suprema at Republic Acts sa isang libre at bukas na legal research interface.',
  'kuya-j':
    'Magtanong sa isang AI assistant tungkol sa serbisyo ng gobyerno, batas, badyet, at pampublikong datos sa Ingles, Filipino, o Taglish.',
  'lottolens-ph-open-data':
    'Mga iskedyul ng bola at historikal na resulta ng PCSO na inilathala bilang bukas at muling magagamit na datos.',
  'open-congress-api':
    'I-access ang nakabalangkas na mga dokumento ng Kongreso, estado ng mga panukalang batas, at impormasyon ng mga kinatawan.',
  'open-data-portal':
    'Mag-browse ng mga pampublikong dataset na inayos para sa pananaliksik, muling paggamit, at pananagutang sibiko.',
  openbayan: 'Isang showcase ng mga open-source na proyekto para sa Pilipinas.',
  opengovchain:
    'Tuklasin ang mga bukas na pamantayang nakabatay sa blockchain para sa mga kontrata, imprastraktura, at pambansang badyet.',
  opentaxjs:
    'Rules-based engine na nag-iisa sa pagkalkula ng buwis sa Pilipinas upang hindi na ulitin ng mga app ang kumplikadong lohika.',
  openverify:
    'Hindi opisyal na API wrapper na sumusuri sa PhilSys at eGov QR code para mapadali ang pagberipika ng pagkakakilanlan.',
  petitions:
    'Magsimula, pumirma, at magbahagi ng mga petisyon sa mga opisyal nang hindi gumagawa ng account.',
  'ph-contributions-calculator':
    'Libreng website, REST API, at TypeScript library para sa pagkalkula ng kontribusyon sa SSS, PhilHealth, at Pag-IBIG.',
  'ph-hotlines-directory':
    'Direktoryo ng mga lokal na emergency hotline sa mga lungsod sa Pilipinas, nagsimula sa Cavite at bukas sa kontribusyon.',
  'philgeps-browser':
    'Mag-browse ng mga oportunidad at rekord ng pagbili ng gobyerno ng Pilipinas.',
  'philippine-projects-heatmap':
    'Visual tracker ng mga proyekto sa Pilipinas patungo sa live na dataset at daloy ng mga kontribyutor.',
  'philippine-quiz':
    'Subukan ang iyong kaalaman sa kasaysayan, kultura, pamahalaan, at heograpiya ng Pilipinas.',
  'philippines-tax-directory':
    'Gabay na pinamamahalaan ng komunidad na nag-iisa sa impormasyon at sanggunian tungkol sa buwis sa Pilipinas.',
  politiko:
    'Kilalanin ang mga miyembro ng ika-20 Kongreso sa pamamagitan ng madaling gamiting swipe-based civic discovery.',
  'price-guides':
    'Suriin ang mahahalagang economic indicator tulad ng presyo sa palengke, gasolina, palitan ng piso, at pampublikong datos.',
  'psgc-api':
    'Philippine Standard Geographic Code (PSGC) API na isinulat gamit ang Rust.',
  regov:
    'Isang AI agent na sumusuri sa lumang website ng gobyerno at muling binubuo ito sa BetterGov.ph Kapwa design system.',
  'saln-tracker-ph':
    'Web platform para sa pagsubaybay at pagpapakita ng SALN ng mga opisyal ng gobyerno para sa transparency at pananagutan.',
  scamcheck:
    'I-paste ang kahina-hinalang text, mag-upload ng screenshot, o mag-forward ng email upang suriin kung may senyales ng scam.',
  'startupdatabase-ph':
    'Tuklasin ang mga Pilipinong startup, produkto, tagapagtatag, mamumuhunan, trabaho, at pananaliksik sa direktoryo ng komunidad.',
  'statistics-explorer':
    'Maghanap ng mga dataset ng Philippine Statistics Authority OpenSTAT ayon sa paksa at mag-download ng piling datos.',
  'transparency-portal':
    'Maghanap at mag-browse ng mga rekord ng pagbili, buwis, badyet, at imprastraktura ng gobyerno sa iisang interface.',
  'action-for-economic-reforms':
    'Malayang organisasyon sa pananaliksik at adbokasiya na tumatalakay sa patakarang piskal, reporma sa buwis, at proteksyong panlipunan.',
  'altmobility-ph':
    'Grupong sibiko na nagsusulong ng makataong pampublikong transportasyon, aktibong paglalakbay, at inklusibong patakaran sa transportasyon.',
  'bantay-kita':
    'Pambansang koalisyon ng mga CSO na nagsusulong ng transparency at pananagutan sa mga industriyang extractive at likas na yaman.',
  cdrc: 'Organisasyong pang-sibiko sa Pilipinas na nangunguna sa pamamahala ng sakuna, kahandaan, at pagtugon na nakabatay sa komunidad.',
  ctuhr:
    'Non-profit na organisasyon sa pananaliksik at adbokasiya na nagdodokumento ng karapatan sa paggawa at kalagayan ng mga manggagawa.',
  'e-net-philippines':
    'Network ng mga CSO para sa reporma sa edukasyon na nagsusulong ng inklusibo at pantay na kalidad ng edukasyon sa bansa.',
  'foundation-for-media-alternatives':
    'Non-profit na nagtatanggol sa mga karapatang digital, privacy ng datos, kaligtasan online, at pantay na access sa ICT.',
  'g-watch':
    'Malayang organisasyon na nagbibigay-kapangyarihan sa mga mamamayan upang bantayan ang serbisyo publiko at lokal na badyet.',
  hain: 'Non-profit na nagsasagawa ng pananaliksik sa pampublikong kalusugan, edukasyong pangkalusugan, at adbokasiya sa patakaran.',
  'haribon-foundation':
    'Nangungunang CSO sa pangangalaga ng kalikasan na nagtataguyod ng proteksyon ng biodiversity at pagpapanumbalik ng kagubatan.',
  'kontra-daya':
    'Koalisyon ng mga tagapagbantay sa halalan na sumusuri sa automated election system, pondo sa kampanya, at integridad ng boto.',
  namfrel:
    'Pambansang kilusan ng mga mamamayan na nangunguna sa pagbabantay ng malinis na halalan at parallel vote count sa Pilipinas.',
  pcij: 'Malayang ahensya ng investigative journalism na gumagawa ng ulat na nakabatay sa datos tungkol sa pamamahala at hustisya.',
  'right-to-know-right-now':
    'Koalisyon ng lipunang sibil na nangangampanya para sa komprehensibong batas sa Freedom of Information at bukas na paglalathala.',
  'vera-files':
    'Non-profit na organisasyong pang-midya na nakatuon sa fact-checking, pananagutan ng publiko, at karapatang pantao.',
};

const LGU_REGEX = /^Community-maintained transparency portal for (.+), listed in the BetterLGU directory\.$/;

export function getLocalizedSummary(
  slug: string,
  enSummary: string,
  lang: Lang,
  summaryFil?: string
): string {
  const cleanEn = enSummary === '|' ? 'Open API for Philippine barangay and geographic data.' : enSummary;
  if (lang === 'en') return cleanEn;
  if (summaryFil) return summaryFil;
  if (FIL_SUMMARIES[slug]) return FIL_SUMMARIES[slug];

  const lguMatch = cleanEn.match(LGU_REGEX);
  if (lguMatch) {
    return `Portal ng transparency na pinamamahalaan ng komunidad para sa ${lguMatch[1]}, na nakalista sa direktoryo ng BetterLGU.`;
  }
  return cleanEn;
}
