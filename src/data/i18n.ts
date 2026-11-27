import type { Sector } from './sectors';

export type Lang = 'en' | 'fil';
export type Localized<T = string> = Record<Lang, T>;

export const SECTOR_LABELS: Record<Sector, Localized> = {
  'Disaster & Recovery': {
    en: 'Disaster & Recovery',
    fil: 'Sakuna at Pagbangon',
  },
  'Social & Welfare': {
    en: 'Social & Welfare',
    fil: 'Serbisyong Panlipunan',
  },
  'Government Services': {
    en: 'Government Services',
    fil: 'Mga Serbisyo ng Gobyerno',
  },
  Travel: {
    en: 'Travel',
    fil: 'Paglalakbay',
  },
  Health: {
    en: 'Health',
    fil: 'Kalusugan',
  },
  Education: {
    en: 'Education',
    fil: 'Edukasyon',
  },
  'Business & Economy': {
    en: 'Business & Economy',
    fil: 'Negosyo at Ekonomiya',
  },
  'Taxes & Finance': {
    en: 'Taxes & Finance',
    fil: 'Buwis at Pananalapi',
  },
  'Labor & Employment': {
    en: 'Labor & Employment',
    fil: 'Paggawa at Trabaho',
  },
  'Law & Justice': {
    en: 'Law & Justice',
    fil: 'Batas at Hustisya',
  },
  'Elections & Governance': {
    en: 'Elections & Governance',
    fil: 'Halalan at Pamamahala',
  },
  'Transparency & Procurement': {
    en: 'Transparency & Procurement',
    fil: 'Transparency at Pagbili',
  },
  'Agriculture & Environment': {
    en: 'Agriculture & Environment',
    fil: 'Agrikultura at Kalikasan',
  },
  'Infrastructure & Transport': {
    en: 'Infrastructure & Transport',
    fil: 'Imprastraktura at Transportasyon',
  },
  'Public Safety': {
    en: 'Public Safety',
    fil: 'Kaligtasan ng Publiko',
  },
};

export const STATUS_LABELS: Record<string, Localized> = {
  planning: { en: 'Planning', fil: 'Pinaplano' },
  alpha: { en: 'Alpha', fil: 'Alpha' },
  beta: { en: 'Beta', fil: 'Beta' },
  stable: { en: 'Stable', fil: 'Matatag' },
  archived: { en: 'Archived', fil: 'Naka-archive' },
};

const en = {
  dateLabel: 'Wednesday, 25 November 2026',
  english: 'English',
  filipino: 'Filipino',
  signIn: 'Sign in',
  subscribe: 'Subscribe',
  byPrefix: 'by',
  taglineSuffix: 'Technology, data and open government in the Philippines',
  nav: {
    openData: 'Open Data',
    budget: 'Budget',
    elections: 'Elections',
    policy: 'Policy',
    digitalServices: 'Digital Services',
    tools: 'Tools',
    opinion: 'Opinion',
    community: 'Community',
  },
  home: {
    leadPhoto:
      'Lead photo · Volunteers at a laptop-strewn table during a civic hackathon in Manila',
    leadTitle: 'The volunteers rebuilding how Filipinos read the national budget',
    leadDeck:
      'A loose network of engineers, researchers and students is turning thousands of pages of appropriations into something anyone can search, compare and question.',
    byWord: 'By',
    authorPlaceholder: '[Author name]',
    leadReadTime: '8 min read',
    topStories: 'Top stories',
    photoShort: 'Photo',
    top1Title: 'What a transparent canvassing dashboard should actually show',
    top2Title: 'Freedom of Information, explained: how to file a request that gets answered',
    top3Title: 'Why so many .gov.ph websites still break on a phone',
    top4Title: 'A field guide to spotting scam texts that impersonate government agencies',
    latest: 'Latest',
    viewAll: 'View all →',
    latest1Photo: 'Photo · Jeepney traffic along a Manila avenue',
    latest1Title: 'Mapping public transport routes when the official data runs out',
    latest1Deck: 'How commuter-sourced maps are filling gaps that agencies have yet to publish.',
    latest2Photo: 'Photo · Session hall of the House of Representatives',
    latest2Title: 'Reading the bicam report: a line-by-line guide for first-timers',
    latest2Deck:
      'The stage of the budget cycle where the biggest changes are made, and the least is explained.',
    latest3Photo: 'Photo · Barangay hall with residents queuing outside',
    latest3Title: 'Inside a barangay that put its procurement records online',
    latest3Deck: 'What changed for residents once contracts and suppliers became searchable.',
    latest4Photo: 'Photo · Close-up of a phone showing an e-government app',
    latest4Title: 'The case for one login across every government service',
    latest4Deck:
      'Digital ID promises convenience. Here is what it has to get right on privacy first.',
    featurePhoto:
      'Photo essay · Rice terraces at dawn, for a story on connectivity in upland provinces',
    longRead: 'Long read',
    featureTitle: 'Last mile, last in line: who gets left out when services go online',
    featureDeck:
      'A reporting trip through municipalities where the nearest stable signal is a jeepney ride away.',
    photographsBy: 'Photographs by',
    photographerPlaceholder: '[Photographer]',
    opinion1: 'Open data is not a website. It is a habit.',
    opinion2: 'Volunteers built it. Now government has to maintain it.',
    opinion3: 'Let AI read the bills — but keep humans in the hearing room.',
    columnistPlaceholder: '[Columnist name]',
    civicTools: 'Civic tools',
    tool1: 'Open Data Portal',
    tool2: 'Budget Explorer',
    tool3: 'ScamCheck',
    tool4: 'View All Tools',
    nlTitle: 'The Civic Tech Weekly',
    nlDesc:
      "Our editors' picks on data, digital government and the people building public tools. Every Friday.",
    nlEmailLabel: 'Email address',
    nlPlaceholder: 'you@example.com',
    nlSignUp: 'Sign up',
  },
  article: {
    kicker: 'Open Data · Feature',
    date: '25 November 2026',
    heroPhoto:
      'Hero photo · Volunteers at a laptop-strewn table during a civic hackathon in Manila',
    heroCaption: 'Volunteers compare appropriations line items during a weekend build session.',
    heroCreditPrefix: 'Photo:',
    heroCreditSuffix: 'for Civic Tech',
    shareFb: 'Share on Facebook',
    shareX: 'Share on X',
    shareCopy: 'Copy link',
    dropCapLetter: 'E',
    p1Rest:
      'very year, the General Appropriations Act arrives as a wall of PDFs. For most citizens — and many journalists — the question of where public money goes ends there, at a document too large to read and too fragmented to search.',
    p2: 'That is the problem a group of volunteers set out to fix. Working evenings and weekends, they extract tables from scanned pages, reconcile agency names that change from year to year, and publish the result as open data that anyone can download.',
    p3: '[Article body continues. Replace with the reported story — interviews, context on the budget cycle, and what the data now makes possible for reporters and local officials.]',
    quote: '“If people can’t find the line item, they can’t ask the question.”',
    quoteSource: '— [Name], volunteer data lead',
    subhead: 'From PDF to public record',
    p4: '[Section copy. Explain the pipeline in plain language: how documents are collected, checked against official sources, and versioned so changes between the proposed and enacted budget are visible.]',
    inlinePhoto: 'Inline photo · A volunteer marking up a printed budget document',
    inlineCaption: '[Caption].',
    p5: '[Section copy continues.]',
    exploreEyebrow: 'Explore the data',
    exploreDesc:
      'Search every line item in the national budget on the BetterGov.ph Open Data Portal.',
    exploreCta: 'Open the Budget Explorer →',
    related: 'Related',
    authorBio: '[Short bio — beat, background and how to reach them.]',
    moreHeading: 'More from Civic Tech',
    footerText: 'Civic Tech is an independent newsroom of BetterGov.ph.',
    sendTip: 'Send a tip',
  },
  directory: {
    kicker: 'civictech.ph · 15 Sectors',
    title: 'Civic Tech & CSO Directory',
    subtitlePrefix: '',
    subtitleSuffix:
      'civic tech projects and Civil Society Organizations migrated from OpenBayan.org and organized across 15 Philippine sectors.',
    submitViaGithub: 'Submit via GitHub →',
    showWord: 'Show',
    allEntries: 'All Entries',
    civicTechProjects: 'Civic Tech Projects',
    csos: 'CSOs',
    inWord: 'in',
    everySector: 'Every Sector',
    searchPlaceholder: 'Search projects, CSOs, or tags...',
    noResults: 'No matching entries found.',
    resetFilters: 'Reset filters',
    showing: 'Showing',
    ofWord: 'of',
    entriesWord: 'entries',
    visit: 'Visit →',
    showMore: 'Show more',
    remaining: 'remaining',
  },
  submit: {
    kicker: 'civictech.ph · Directory Submission',
    title: 'Submit a Project or CSO',
    lead: 'Fill in what you know below. Clicking Continue on GitHub opens a pre-filled issue, and our automation creates a Pull Request for review.',
    note: 'You need a free GitHub account to submit.',
    entryType: 'Entry Type',
    projectOption: 'Civic Tech Project',
    csoOption: 'Civil Society Organization (CSO)',
    name: 'Project or Organization Name',
    namePlaceholder: 'e.g. Budget Portal or Kontra Daya',
    summary: 'One-line summary',
    summaryHint: 'Up to 240 characters. Shown in the directory list.',
    description: 'What it does and who it helps',
    descriptionHint: 'Optional. Plain text, up to 1,200 characters.',
    stage: 'Stage',
    sector: 'Primary Sector',
    website: 'Website',
    websiteHint: 'Optional. Where people can see or use it.',
    repository: 'Source code',
    repositoryHint: 'Optional. Leave empty if there is no public repository.',
    license: 'License',
    tags: 'Tags',
    tagsHint: 'Up to 8, separated by commas.',
    maintainers: 'Maintainers',
    maintainersHint: 'Optional. Names separated by commas.',
    continueGithub: 'Continue on GitHub →',
    backToDirectory: '← Back to Directory',
    updateHeading: 'Post an update',
    updateLead: 'Share progress on a project or CSO that is already listed in the directory.',
    updateEntry: 'Project or CSO',
    updateStage: 'Stage (optional)',
    updateStageNoChange: 'No change',
    updateWebsite: 'Website (optional)',
    updateRepository: 'Source code (optional)',
    updateUrlHint: 'Leave empty for no change.',
    updateTitle: 'Update title',
    updateTitleHint: 'Up to 100 characters.',
    updateBody: 'What changed',
    updateBodyHint: 'Plain text, up to 1,200 characters. What shipped, what you learned, or where you need help.',
  },
  footer: {
    desc: 'An independent newsroom of BetterGov.ph, the volunteer-run movement for government transparency in the Philippines.',
    directory: 'Directory',
    civicTools: 'Civic Tools',
    submitEntry: 'Submit Project / CSO',
    postUpdate: 'Post an Update',
    about: 'About',
    ourMission: 'Our mission',
    editorialStandards: 'Editorial standards',
    corrections: 'Corrections',
    getInvolved: 'Get involved',
    volunteer: 'Volunteer',
    sendATip: 'Send a tip',
    contact: 'Contact',
    source: 'Source',
    github: 'GitHub',
    reportProblem: 'Report a problem',
  },
} as const;

type TranslationSchema = {
  [K in keyof typeof en]: (typeof en)[K] extends string
    ? string
    : { [S in keyof (typeof en)[K]]: string };
};

const fil: TranslationSchema = {
  dateLabel: 'Miyerkules, 25 Nobyembre 2026',
  english: 'English',
  filipino: 'Filipino',
  signIn: 'Mag-sign in',
  subscribe: 'Mag-subscribe',
  byPrefix: 'ng',
  taglineSuffix: 'Teknolohiya, datos at bukas na pamamahala sa Pilipinas',
  nav: {
    openData: 'Bukas na Datos',
    budget: 'Badyet',
    elections: 'Halalan',
    policy: 'Patakaran',
    digitalServices: 'Serbisyong Digital',
    tools: 'Mga Kasangkapan',
    opinion: 'Opinyon',
    community: 'Komunidad',
  },
  home: {
    leadPhoto:
      'Pangunahing larawan · Mga boluntaryo sa mesa na puno ng laptop sa isang civic hackathon sa Maynila',
    leadTitle: 'Ang mga boluntaryong nagbabago kung paano binabasa ng Pilipino ang pambansang badyet',
    leadDeck:
      'Isang maluwag na grupo ng mga inhinyero, mananaliksik at estudyante ang nagpapalit sa libu-libong pahina ng badyet upang madaling mahanap, maikumpara at mausisa ng sinuman.',
    byWord: 'Ni',
    authorPlaceholder: '[Pangalan ng may-akda]',
    leadReadTime: '8 minutong pagbabasa',
    topStories: 'Mga Pangunahing Balita',
    photoShort: 'Larawan',
    top1Title: 'Ano ang dapat ipakita ng isang transparent na dashboard ng canvassing',
    top2Title:
      'Paliwanag sa Freedom of Information: paano maghain ng kahilingan na nasasagot',
    top3Title: 'Bakit maraming .gov.ph website pa rin ang nasisira sa cellphone',
    top4Title:
      'Gabay sa pagtukoy ng mga scam text na nagpapanggap na ahensya ng gobyerno',
    latest: 'Pinakabago',
    viewAll: 'Tingnan lahat →',
    latest1Photo: 'Larawan · Trapiko ng jeepney sa isang abenida sa Maynila',
    latest1Title: 'Pagmamapa ng mga ruta ng pampublikong sasakyan kapag kulang ang opisyal na datos',
    latest1Deck:
      'Paano pinupunan ng mga mapang gawa ng komyuter ang mga puwang na hindi pa nailalathala ng mga ahensya.',
    latest2Photo: 'Larawan · Bulwagan ng sesyon sa Mababang Kapulungan',
    latest2Title: 'Pagbabasa ng ulat ng bicam: gabay bawat linya para sa mga baguhan',
    latest2Deck:
      'Ang yugto ng badyet kung saan ginagawa ang pinakamalalaking pagbabago, ngunit pinakakaunti ang paliwanag.',
    latest3Photo: 'Larawan · Barangay hall na may nakapilang mga residente sa labas',
    latest3Title: 'Sa loob ng isang barangay na naglagay ng mga rekord ng pagbili online',
    latest3Deck:
      'Ano ang nagbago para sa mga residente nang maging madaling hanapin ang mga kontrata at supplier.',
    latest4Photo: 'Larawan · Malapitang kuha ng cellphone na may e-government app',
    latest4Title: 'Ang kaso para sa iisang login sa bawat serbisyo ng gobyerno',
    latest4Deck:
      'Nangangako ng ginhawa ang Digital ID. Narito ang kailangang unahin sa privacy.',
    featurePhoto:
      'Photo essay · Mga hagdan-hagdang palayan sa bukang-liwayway, para sa ulat tungkol sa konektibidad sa kabundukan',
    longRead: 'Mahabang Pagbabasa',
    featureTitle: 'Huling milya, huli sa pila: sino ang naiiwan kapag nagiging online ang serbisyo',
    featureDeck:
      'Isang paglalakbay sa mga bayan kung saan isang sakay ng jeepney ang pinakamalapit na maayos na signal.',
    photographsBy: 'Mga larawan ni',
    photographerPlaceholder: '[Litratista]',
    opinion1: 'Ang bukas na datos ay hindi website. Isa itong ugali.',
    opinion2: 'Mga boluntaryo ang nagtayo. Ngayon gobyerno ang dapat magpanatili.',
    opinion3: 'Hayaang basahin ng AI ang mga panukalang batas — ngunit panatilihin ang tao sa pagdinig.',
    columnistPlaceholder: '[Pangalan ng kolumnista]',
    civicTools: 'Mga kasangkapang sibiko',
    tool1: 'Open Data Portal',
    tool2: 'Budget Explorer',
    tool3: 'ScamCheck',
    tool4: 'Tingnan Lahat ng Kasangkapan',
    nlTitle: 'Ang Lingguhang Civic Tech',
    nlDesc:
      'Mga piling ulat ng aming patnugot tungkol sa datos, digital na gobyerno at mga taong bumubuo ng pampublikong kasangkapan. Tuwing Biyernes.',
    nlEmailLabel: 'Email address',
    nlPlaceholder: 'ikaw@halimbawa.com',
    nlSignUp: 'Mag-sign up',
  },
  article: {
    kicker: 'Bukas na Datos · Tampok',
    date: '25 Nobyembre 2026',
    heroPhoto:
      'Pangunahing larawan · Mga boluntaryo sa mesa na puno ng laptop sa isang civic hackathon sa Maynila',
    heroCaption:
      'Ikinukumpara ng mga boluntaryo ang mga linya ng badyet sa isang build session tuwing weekend.',
    heroCreditPrefix: 'Larawan:',
    heroCreditSuffix: 'para sa Civic Tech',
    shareFb: 'Ibahagi sa Facebook',
    shareX: 'Ibahagi sa X',
    shareCopy: 'Kopyahin ang link',
    dropCapLetter: 'B',
    p1Rest:
      'awat taon, dumarating ang General Appropriations Act bilang makakapal na PDF. Para sa karamihan ng mamamayan — at maraming mamamahayag — dito nagtatapos ang paghahanap kung saan napupunta ang pondo ng bayan.',
    p2: 'Iyan ang problemang sinubukang ayusin ng isang grupo ng mga boluntaryo. Nagtatrabaho tuwing gabi at weekend, kinukuha nila ang mga talahanayan mula sa mga na-scan na pahina, inaayos ang nagbabagong pangalan ng mga ahensya, at inilalathala ito bilang bukas na datos.',
    p3: '[Magpapatuloy ang katawan ng artikulo. Palitan ng aktuwal na ulat — mga panayam, konteksto sa siklo ng badyet, at kung ano ang nagagawa ngayon ng datos para sa mga reporter at lokal na opisyal.]',
    quote: '“Kung hindi mahanap ng tao ang line item, hindi sila makapagtatanong.”',
    quoteSource: '— [Pangalan], boluntaryong tagapanguna sa datos',
    subhead: 'Mula PDF patungong pampublikong rekord',
    p4: '[Nilalaman ng seksyon. Ipaliwanag ang proseso sa payak na wika: paano kinokolekta, sinusuri laban sa opisyal na pinagmulan, at minamarkahan ang pagkakaiba ng panukala at aprubadong badyet.]',
    inlinePhoto: 'Larawan sa loob · Isang boluntaryong nagmamarka ng naka-print na dokumento ng badyet',
    inlineCaption: '[Pamagat ng larawan].',
    p5: '[Magpapatuloy ang nilalaman ng seksyon.]',
    exploreEyebrow: 'Suriin ang datos',
    exploreDesc:
      'Hanapin ang bawat line item sa pambansang badyet sa BetterGov.ph Open Data Portal.',
    exploreCta: 'Buksan ang Budget Explorer →',
    related: 'Kaugnay na Balita',
    authorBio: '[Maikling talambuhay — sakop na paksa, karanasan at paano sila makokontak.]',
    moreHeading: 'Marami pa mula sa Civic Tech',
    footerText: 'Ang Civic Tech ay isang malayang newsroom ng BetterGov.ph.',
    sendTip: 'Magpadala ng tip',
  },
  directory: {
    kicker: 'civictech.ph · 15 Sektor',
    title: 'Direktoryo ng Civic Tech at CSO',
    subtitlePrefix: '',
    subtitleSuffix:
      'na mga proyektong civic tech at Civil Society Organization na inilipat mula sa OpenBayan.org at inayos sa 15 sektor sa Pilipinas.',
    submitViaGithub: 'Isumite sa GitHub →',
    showWord: 'Ipakita',
    allEntries: 'Lahat ng Entri',
    civicTechProjects: 'Mga Proyektong Civic Tech',
    csos: 'Mga CSO',
    inWord: 'sa',
    everySector: 'Lahat ng Sektor',
    searchPlaceholder: 'Maghanap ng proyekto, CSO, o tag...',
    noResults: 'Walang nahanap na katugmang entri.',
    resetFilters: 'I-reset ang mga filter',
    showing: 'Ipinapakita ang',
    ofWord: 'sa',
    entriesWord: 'na entri',
    visit: 'Bisitahin →',
    showMore: 'Magpakita pa',
    remaining: 'natitira',
  },
  submit: {
    kicker: 'civictech.ph · Pagsumite sa Direktoryo',
    title: 'Magsumite ng Proyekto o CSO',
    lead: 'Punan ang mga detalye sa ibaba. Ang pag-click sa Magpatuloy sa GitHub ay magbubukas ng naka-handa nang issue, at gagawa ang aming automation ng Pull Request para masuri.',
    note: 'Kailangan ng libreng GitHub account upang makapagsumite.',
    entryType: 'Uri ng Entri',
    projectOption: 'Civic Tech Project',
    csoOption: 'Civil Society Organization (CSO)',
    name: 'Pangalan ng Proyekto o Organisasyon',
    namePlaceholder: 'hal. Budget Portal o Kontra Daya',
    summary: 'Maikling buod (isang linya)',
    summaryHint: 'Hanggang 240 karakter. Ipinapakita sa listahan ng direktoryo.',
    description: 'Ano ang ginagawa nito at sino ang tinutulungan',
    descriptionHint: 'Opsyonal. Payak na teksto, hanggang 1,200 karakter.',
    stage: 'Antas (Stage)',
    sector: 'Pangunahing Sektor',
    website: 'Website',
    websiteHint: 'Opsyonal. Kung saan ito makikita o magagamit.',
    repository: 'Source code',
    repositoryHint: 'Opsyonal. Iwanang blangko kung walang pampublikong repository.',
    license: 'Lisensya',
    tags: 'Mga Tag',
    tagsHint: 'Hanggang 8, pinaghihiwalay ng kuwit.',
    maintainers: 'Mga Tagapamahala',
    maintainersHint: 'Opsyonal. Mga pangalan na pinaghihiwalay ng kuwit.',
    continueGithub: 'Magpatuloy sa GitHub →',
    backToDirectory: '← Bumalik sa Direktoryo',
    updateHeading: 'Mag-post ng update',
    updateLead: 'Magbahagi ng bagong balita tungkol sa isang proyekto o CSO na nakalista na sa direktoryo.',
    updateEntry: 'Proyekto o CSO',
    updateStage: 'Antas / Stage (opsyonal)',
    updateStageNoChange: 'Walang pagbabago',
    updateWebsite: 'Website (opsyonal)',
    updateRepository: 'Source code (opsyonal)',
    updateUrlHint: 'Iwanang blangko kung walang pagbabago.',
    updateTitle: 'Pamagat ng update',
    updateTitleHint: 'Hanggang 100 karakter.',
    updateBody: 'Ano ang nagbago',
    updateBodyHint: 'Payak na teksto, hanggang 1,200 karakter. Ano ang nailunsad, natutunan, o saan kailangan ng tulong.',
  },
  footer: {
    desc: 'Isang malayang newsroom ng BetterGov.ph, ang kilusang pinatatakbo ng mga boluntaryo para sa transparency ng gobyerno sa Pilipinas.',
    directory: 'Direktoryo',
    civicTools: 'Mga Kasangkapan',
    submitEntry: 'Magsumite ng Proyekto / CSO',
    postUpdate: 'Mag-post ng Update',
    about: 'Tungkol sa Amin',
    ourMission: 'Aming misyon',
    editorialStandards: 'Pamantayang editoryal',
    corrections: 'Mga pagwawasto',
    getInvolved: 'Makisangkot',
    volunteer: 'Magboluntaryo',
    sendATip: 'Magpadala ng tip',
    contact: 'Makipag-ugnayan',
    source: 'Pinagmulan',
    github: 'GitHub',
    reportProblem: 'Mag-ulat ng problema',
  },
};

export const TRANSLATIONS: Record<Lang, TranslationSchema> = {
  en,
  fil,
};

const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAYS_FIL = ['Linggo', 'Lunes', 'Martes', 'Miyerkules', 'Huwebes', 'Biyernes', 'Sabado'];
const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTHS_FIL = [
  'Enero', 'Pebrero', 'Marso', 'Abril', 'Mayo', 'Hunyo',
  'Hulyo', 'Agosto', 'Setyembre', 'Oktubre', 'Nobyembre', 'Disyembre',
];

export function formatTodayDate(lang: Lang, date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '';

  const year = get('year');
  const monthIdx = Math.max(0, Number(get('month')) - 1);
  const day = get('day');
  const weekdayShort = get('weekday');
  const weekdayIdx = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(weekdayShort);

  if (lang === 'fil') {
    const wd = weekdayIdx >= 0 ? WEEKDAYS_FIL[weekdayIdx] : '';
    const mo = MONTHS_FIL[monthIdx] ?? '';
    return `${wd}, ${day} ${mo} ${year}`;
  }
  const wd = weekdayIdx >= 0 ? WEEKDAYS_EN[weekdayIdx] : '';
  const mo = MONTHS_EN[monthIdx] ?? '';
  return `${wd}, ${day} ${mo} ${year}`;
}
