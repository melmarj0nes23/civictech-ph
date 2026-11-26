import type { Localized } from './i18n';

export type CategorySlug =
  | 'open-data'
  | 'budget'
  | 'elections'
  | 'policy'
  | 'digital-services'
  | 'tools'
  | 'opinion'
  | 'community';

export interface CategoryMeta {
  slug: CategorySlug;
  label: Localized;
  description: Localized;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: 'open-data',
    label: { en: 'Open Data', fil: 'Bukas na Datos' },
    description: {
      en: 'Public datasets, machine-readable records, and volunteer data pipelines across the Philippines.',
      fil: 'Mga pampublikong dataset, rekord na madaling basahin ng makina, at mga proyektong datos ng boluntaryo.',
    },
  },
  {
    slug: 'budget',
    label: { en: 'Budget', fil: 'Badyet' },
    description: {
      en: 'Tracking the General Appropriations Act, bicam insertions, and local public spending.',
      fil: 'Pagsubaybay sa General Appropriations Act, mga pagbabago sa bicam, at lokal na paggastos ng pondo.',
    },
  },
  {
    slug: 'elections',
    label: { en: 'Elections', fil: 'Halalan' },
    description: {
      en: 'Election transparency, canvassing dashboards, campaign finance, and citizen monitoring.',
      fil: 'Transparency sa halalan, dashboard ng canvassing, pondo sa kampanya, at pagbabantay ng mamamayan.',
    },
  },
  {
    slug: 'policy',
    label: { en: 'Policy', fil: 'Patakaran' },
    description: {
      en: 'Freedom of Information, digital governance policy, and legislative analysis.',
      fil: 'Freedom of Information, patakaran sa digital na pamamahala, at pagsusuri ng mga batas.',
    },
  },
  {
    slug: 'digital-services',
    label: { en: 'Digital Services', fil: 'Serbisyong Digital' },
    description: {
      en: 'Evaluating .gov.ph portals, mobile accessibility, digital ID, and e-government.',
      fil: 'Pagsusuri sa mga .gov.ph portal, access sa mobile, digital ID, at e-government.',
    },
  },
  {
    slug: 'tools',
    label: { en: 'Tools', fil: 'Mga Kasangkapan' },
    description: {
      en: 'Guides, field manuals, and practical civic technology tools built for everyday citizens.',
      fil: 'Mga gabay, manwal, at praktikal na kasangkapang civic tech para sa pang-araw-araw na mamamayan.',
    },
  },
  {
    slug: 'opinion',
    label: { en: 'Opinion', fil: 'Opinyon' },
    description: {
      en: 'Essays and commentary from civic technologists, researchers, and public-interest builders.',
      fil: 'Mga sanaysay at komentaryo mula sa mga civic technologist, mananaliksik, at tagapagtaguyod.',
    },
  },
  {
    slug: 'community',
    label: { en: 'Community', fil: 'Komunidad' },
    description: {
      en: 'Stories from barangays, volunteer hackathons, and grassroots transparency movements.',
      fil: 'Mga kuwento mula sa barangay, hackathon ng mga boluntaryo, at kilusang pangkomunidad.',
    },
  },
];

export interface ArticleItem {
  slug: string;
  category: CategorySlug;
  kicker: Localized;
  title: Localized;
  deck: Localized;
  author: Localized;
  date: Localized;
  readTime: Localized;
  photoLabel: Localized;
  body: Localized<string[]>;
  quote?: {
    text: Localized;
    source: Localized;
  };
}

export const ARTICLES: ArticleItem[] = [
  {
    slug: 'volunteers-national-budget',
    category: 'open-data',
    kicker: { en: 'Open Data · Feature', fil: 'Bukas na Datos · Tampok' },
    title: {
      en: 'The volunteers rebuilding how Filipinos read the national budget',
      fil: 'Ang mga boluntaryong nagbabago kung paano binabasa ng Pilipino ang pambansang badyet',
    },
    deck: {
      en: 'A loose network of engineers, researchers and students is turning thousands of pages of appropriations into something anyone can search, compare and question.',
      fil: 'Isang maluwag na grupo ng mga inhinyero, mananaliksik at estudyante ang nagpapalit sa libu-libong pahina ng badyet upang madaling mahanap, maikumpara at mausisa ng sinuman.',
    },
    author: { en: '[Author name]', fil: '[Pangalan ng may-akda]' },
    date: { en: '25 November 2026', fil: '25 Nobyembre 2026' },
    readTime: { en: '8 min read', fil: '8 minutong pagbabasa' },
    photoLabel: {
      en: 'Hero photo · Volunteers at a laptop-strewn table during a civic hackathon in Manila',
      fil: 'Pangunahing larawan · Mga boluntaryo sa mesa na puno ng laptop sa isang civic hackathon sa Maynila',
    },
    quote: {
      text: {
        en: '“If people can’t find the line item, they can’t ask the question.”',
        fil: '“Kung hindi mahanap ng tao ang line item, hindi sila makapagtatanong.”',
      },
      source: {
        en: '— [Name], volunteer data lead',
        fil: '— [Pangalan], boluntaryong tagapanguna sa datos',
      },
    },
    body: {
      en: [
        'Every year, the General Appropriations Act arrives as a wall of PDFs. For most citizens — and many journalists — the question of where public money goes ends there, at a document too large to read and too fragmented to search.',
        'That is the problem a group of volunteers set out to fix. Working evenings and weekends, they extract tables from scanned pages, reconcile agency names that change from year to year, and publish the result as open data that anyone can download.',
        '[Article body continues. Replace with the reported story — interviews, context on the budget cycle, and what the data now makes possible for reporters and local officials.]',
      ],
      fil: [
        'Bawat taon, dumarating ang General Appropriations Act bilang makakapal na PDF. Para sa karamihan ng mamamayan — at maraming mamamahayag — dito nagtatapos ang paghahanap kung saan napupunta ang pondo ng bayan.',
        'Iyan ang problemang sinubukang ayusin ng isang grupo ng mga boluntaryo. Nagtatrabaho tuwing gabi at weekend, kinukuha nila ang mga talahanayan mula sa mga na-scan na pahina, inaayos ang nagbabagong pangalan ng mga ahensya, at inilalathala ito bilang bukas na datos.',
        '[Magpapatuloy ang katawan ng artikulo. Palitan ng aktuwal na ulat — mga panayam, konteksto sa siklo ng badyet, at kung ano ang nagagawa ngayon ng datos para sa mga reporter at lokal na opisyal.]',
      ],
    },
  },
  {
    slug: 'transparent-canvassing',
    category: 'elections',
    kicker: { en: 'Elections', fil: 'Halalan' },
    title: {
      en: 'What a transparent canvassing dashboard should actually show',
      fil: 'Ano ang dapat ipakita ng isang transparent na dashboard ng canvassing',
    },
    deck: {
      en: 'Designing election result monitors that citizens and watchers can independently audit in real time.',
      fil: 'Pagdidisenyo ng mga monitor ng resulta ng halalan na maaaring suriin nang malaya ng mamamayan sa real time.',
    },
    author: { en: '[Author name]', fil: '[Pangalan ng may-akda]' },
    date: { en: '22 November 2026', fil: '22 Nobyembre 2026' },
    readTime: { en: '5 min read', fil: '5 minutong pagbabasa' },
    photoLabel: {
      en: 'Photo · Election watchers reviewing precinct returns',
      fil: 'Larawan · Mga tagamasid ng halalan na sumusuri ng resulta ng presinto',
    },
    body: {
      en: [
        'A credible election dashboard does more than display totals — it surfaces precinct-level transmission logs, hash verifications, and discrepancy flags.',
        '[Placeholder article copy. Replace with reporting on transparent canvassing standards and open election monitoring tools.]',
      ],
      fil: [
        'Ang mapagkakatiwalaang dashboard ng halalan ay hindi lang nagpapakita ng kabuuan — ipinapakita rin nito ang transmission log bawat presinto, hash verification, at mga babala sa pagkakaiba.',
        '[Pansamantalang teksto ng artikulo. Palitan ng aktuwal na ulat tungkol sa pamantayan ng transparency sa halalan.]',
      ],
    },
  },
  {
    slug: 'foi-explained',
    category: 'policy',
    kicker: { en: 'Policy', fil: 'Patakaran' },
    title: {
      en: 'Freedom of Information, explained: how to file a request that gets answered',
      fil: 'Paliwanag sa Freedom of Information: paano maghain ng kahilingan na nasasagot',
    },
    deck: {
      en: 'Practical templates and lessons from hundreds of eFOI requests filed by researchers and CSOs.',
      fil: 'Mga praktikal na template at aral mula sa daan-daang eFOI request ng mga mananaliksik at CSO.',
    },
    author: { en: '[Author name]', fil: '[Pangalan ng may-akda]' },
    date: { en: '19 November 2026', fil: '19 Nobyembre 2026' },
    readTime: { en: '6 min read', fil: '6 minutong pagbabasa' },
    photoLabel: {
      en: 'Photo · Public records archive desk',
      fil: 'Larawan · Mesa ng pampublikong rekord',
    },
    body: {
      en: [
        'Specificity matters: framing requests around existing agency datasets and statutory timelines dramatically improves response rates.',
        '[Placeholder article copy. Replace with step-by-step eFOI request tips and sample templates.]',
      ],
      fil: [
        'Mahalaga ang pagiging tiyak: ang pagtutok ng kahilingan sa mga kasalukuyang dataset ng ahensya at takdang oras ng batas ay nagpapataas ng tsansang masagot.',
        '[Pansamantalang teksto ng artikulo. Palitan ng mga gabay at halimbawa ng eFOI request.]',
      ],
    },
  },
  {
    slug: 'gov-ph-mobile',
    category: 'digital-services',
    kicker: { en: 'Digital Services', fil: 'Serbisyong Digital' },
    title: {
      en: 'Why so many .gov.ph websites still break on a phone',
      fil: 'Bakit maraming .gov.ph website pa rin ang nasisira sa cellphone',
    },
    deck: {
      en: 'An audit of frontline agency portals reveals common accessibility and mobile-first gaps.',
      fil: 'Isang pagsusuri ng mga portal ng ahensya ang nagpapakita ng karaniwang kakulangan sa accessibility at mobile.',
    },
    author: { en: '[Author name]', fil: '[Pangalan ng may-akda]' },
    date: { en: '15 November 2026', fil: '15 Nobyembre 2026' },
    readTime: { en: '4 min read', fil: '4 minutong pagbabasa' },
    photoLabel: {
      en: 'Photo · Smartphone displaying a government portal',
      fil: 'Larawan · Smartphone na nagpapakita ng portal ng gobyerno',
    },
    body: {
      en: [
        'Most Filipinos access public services on mid-range Android phones over congested mobile data, yet many portals still ship unoptimized desktop PDFs.',
        '[Placeholder article copy. Replace with findings from mobile accessibility audits across .gov.ph domains.]',
      ],
      fil: [
        'Karamihan sa mga Pilipino ay gumagamit ng Android phone at mobile data upang ma-access ang mga serbisyo ng gobyerno, ngunit maraming portal pa rin ang puno ng mabibigat na PDF.',
        '[Pansamantalang teksto ng artikulo. Palitan ng resulta ng pagsusuri sa mga .gov.ph website.]',
      ],
    },
  },
  {
    slug: 'spotting-scam-texts',
    category: 'tools',
    kicker: { en: 'Tools', fil: 'Mga Kasangkapan' },
    title: {
      en: 'A field guide to spotting scam texts that impersonate government agencies',
      fil: 'Gabay sa pagtukoy ng mga scam text na nagpapanggap na ahensya ng gobyerno',
    },
    deck: {
      en: 'How community-maintained blocklists and domain checks help citizens avoid phishing traps.',
      fil: 'Paano nakakatulong ang mga blocklist ng komunidad at pagsusuri ng domain upang maiwasan ang phishing.',
    },
    author: { en: '[Author name]', fil: '[Pangalan ng may-akda]' },
    date: { en: '12 November 2026', fil: '12 Nobyembre 2026' },
    readTime: { en: '5 min read', fil: '5 minutong pagbabasa' },
    photoLabel: {
      en: 'Photo · Mobile phone security alert',
      fil: 'Larawan · Babalang pang-seguridad sa cellphone',
    },
    body: {
      en: [
        'Official agencies rarely send shortened links demanding urgent payments; verifying the .gov.ph domain remains the first line of defense.',
        '[Placeholder article copy. Replace with ScamCheck examples and practical verification steps.]',
      ],
      fil: [
        'Hindi nagpapadala ang mga opisyal na ahensya ng pinaikling link na humihingi ng agarang bayad; ang pagsusuri sa .gov.ph domain ang unang depensa.',
        '[Pansamantalang teksto ng artikulo. Palitan ng mga halimbawa mula sa ScamCheck.]',
      ],
    },
  },
  {
    slug: 'mapping-public-transport',
    category: 'open-data',
    kicker: { en: 'Open Data', fil: 'Bukas na Datos' },
    title: {
      en: 'Mapping public transport routes when the official data runs out',
      fil: 'Pagmamapa ng mga ruta ng pampublikong sasakyan kapag kulang ang opisyal na datos',
    },
    deck: {
      en: 'How commuter-sourced maps are filling gaps that agencies have yet to publish.',
      fil: 'Paano pinupunan ng mga mapang gawa ng komyuter ang mga puwang na hindi pa nailalathala ng mga ahensya.',
    },
    author: { en: '[Author name]', fil: '[Pangalan ng may-akda]' },
    date: { en: '10 November 2026', fil: '10 Nobyembre 2026' },
    readTime: { en: '6 min read', fil: '6 minutong pagbabasa' },
    photoLabel: {
      en: 'Photo · Jeepney traffic along a Manila avenue',
      fil: 'Larawan · Trapiko ng jeepney sa isang abenida sa Maynila',
    },
    body: {
      en: [
        'Commuter-led GTFS mapping projects have become essential infrastructure for millions of daily riders.',
        '[Placeholder article copy. Replace with interviews from open transit mappers and transport advocates.]',
      ],
      fil: [
        'Ang mga proyektong GTFS mapping na pinangungunahan ng mga komyuter ay naging mahalagang imprastraktura para sa milyun-milyong pasahero araw-araw.',
        '[Pansamantalang teksto ng artikulo. Palitan ng mga panayam sa mga tagapagmapa ng ruta.]',
      ],
    },
  },
  {
    slug: 'reading-bicam-report',
    category: 'budget',
    kicker: { en: 'Budget', fil: 'Badyet' },
    title: {
      en: 'Reading the bicam report: a line-by-line guide for first-timers',
      fil: 'Pagbabasa ng ulat ng bicam: gabay bawat linya para sa mga baguhan',
    },
    deck: {
      en: 'The stage of the budget cycle where the biggest changes are made, and the least is explained.',
      fil: 'Ang yugto ng badyet kung saan ginagawa ang pinakamalalaking pagbabago, ngunit pinakakaunti ang paliwanag.',
    },
    author: { en: '[Author name]', fil: '[Pangalan ng may-akda]' },
    date: { en: '8 November 2026', fil: '8 Nobyembre 2026' },
    readTime: { en: '7 min read', fil: '7 minutong pagbabasa' },
    photoLabel: {
      en: 'Photo · Session hall of the House of Representatives',
      fil: 'Larawan · Bulwagan ng sesyon sa Mababang Kapulungan',
    },
    body: {
      en: [
        'Understanding bicameral conference committee insertions requires comparing House, Senate, and final enrolled versions side by side.',
        '[Placeholder article copy. Replace with a walkthrough using Budget Portal comparisons.]',
      ],
      fil: [
        'Ang pag-unawa sa mga pagbabago ng bicameral conference committee ay nangangailangan ng paghahambing sa bersyon ng Kamara, Senado, at pinal na panukala.',
        '[Pansamantalang teksto ng artikulo. Palitan ng gabay gamit ang Budget Portal.]',
      ],
    },
  },
  {
    slug: 'barangay-procurement',
    category: 'community',
    kicker: { en: 'Community', fil: 'Komunidad' },
    title: {
      en: 'Inside a barangay that put its procurement records online',
      fil: 'Sa loob ng isang barangay na naglagay ng mga rekord ng pagbili online',
    },
    deck: {
      en: 'What changed for residents once contracts and suppliers became searchable.',
      fil: 'Ano ang nagbago para sa mga residente nang maging madaling hanapin ang mga kontrata at supplier.',
    },
    author: { en: '[Author name]', fil: '[Pangalan ng may-akda]' },
    date: { en: '5 November 2026', fil: '5 Nobyembre 2026' },
    readTime: { en: '5 min read', fil: '5 minutong pagbabasa' },
    photoLabel: {
      en: 'Photo · Barangay hall with residents queuing outside',
      fil: 'Larawan · Barangay hall na may nakapilang mga residente sa labas',
    },
    body: {
      en: [
        'Publishing simple spreadsheets of barangay bids and supplier lists built immediate trust between councilors and neighborhood associations.',
        '[Placeholder article copy. Replace with a local case study.]',
      ],
      fil: [
        'Ang paglalathala ng mga simpleng spreadsheet ng mga kontrata at supplier sa barangay ay agad nagpalakas ng tiwala ng mga residente.',
        '[Pansamantalang teksto ng artikulo. Palitan ng lokal na case study.]',
      ],
    },
  },
  {
    slug: 'one-login-gov',
    category: 'digital-services',
    kicker: { en: 'Digital Services', fil: 'Serbisyong Digital' },
    title: {
      en: 'The case for one login across every government service',
      fil: 'Ang kaso para sa iisang login sa bawat serbisyo ng gobyerno',
    },
    deck: {
      en: 'Digital ID promises convenience. Here is what it has to get right on privacy first.',
      fil: 'Nangangako ng ginhawa ang Digital ID. Narito ang kailangang unahin sa privacy.',
    },
    author: { en: '[Author name]', fil: '[Pangalan ng may-akda]' },
    date: { en: '2 November 2026', fil: '2 Nobyembre 2026' },
    readTime: { en: '6 min read', fil: '6 minutong pagbabasa' },
    photoLabel: {
      en: 'Photo · Close-up of a phone showing an e-government app',
      fil: 'Larawan · Malapitang kuha ng cellphone na may e-government app',
    },
    body: {
      en: [
        'Federated identity only works when data minimization, consent logs, and independent oversight are baked in from day one.',
        '[Placeholder article copy. Replace with privacy and digital identity analysis.]',
      ],
      fil: [
        'Gumagana lamang ang iisang digital identity kapag nakapaloob mula sa simula ang data minimization, consent logs, at malayang pagbabantay.',
        '[Pansamantalang teksto ng artikulo. Palitan ng pagsusuri sa digital identity at privacy.]',
      ],
    },
  },
  {
    slug: 'last-mile-connectivity',
    category: 'community',
    kicker: { en: 'Long read', fil: 'Mahabang Pagbabasa' },
    title: {
      en: 'Last mile, last in line: who gets left out when services go online',
      fil: 'Huling milya, huli sa pila: sino ang naiiwan kapag nagiging online ang serbisyo',
    },
    deck: {
      en: 'A reporting trip through municipalities where the nearest stable signal is a jeepney ride away.',
      fil: 'Isang paglalakbay sa mga bayan kung saan isang sakay ng jeepney ang pinakamalapit na maayos na signal.',
    },
    author: { en: '[Author name]', fil: '[Pangalan ng may-akda]' },
    date: { en: '29 October 2026', fil: '29 Oktubre 2026' },
    readTime: { en: '12 min read', fil: '12 minutong pagbabasa' },
    photoLabel: {
      en: 'Photo essay · Rice terraces at dawn, for a story on connectivity in upland provinces',
      fil: 'Photo essay · Mga hagdan-hagdang palayan sa bukang-liwayway, para sa ulat tungkol sa konektibidad sa kabundukan',
    },
    body: {
      en: [
        'Digitalization without offline fallbacks risks excluding the very communities that rely most on public welfare and agricultural support.',
        '[Placeholder article copy. Replace with field reporting from upland municipalities.]',
      ],
      fil: [
        'Ang digitalization nang walang offline na opsyon ay nanganganib na iwanan ang mga komunidad na pinaka-nangangailangan ng serbisyo publiko.',
        '[Pansamantalang teksto ng artikulo. Palitan ng ulat mula sa mga liblib na bayan.]',
      ],
    },
  },
  {
    slug: 'open-data-habit',
    category: 'opinion',
    kicker: { en: 'Opinion', fil: 'Opinyon' },
    title: {
      en: 'Open data is not a website. It is a habit.',
      fil: 'Ang bukas na datos ay hindi website. Isa itong ugali.',
    },
    deck: {
      en: 'Why publishing a portal once is not enough without regular updates and community feedback.',
      fil: 'Bakit hindi sapat ang paglulunsad ng portal nang isang beses kung walang regular na update.',
    },
    author: { en: '[Columnist name]', fil: '[Pangalan ng kolumnista]' },
    date: { en: '24 November 2026', fil: '24 Nobyembre 2026' },
    readTime: { en: '4 min read', fil: '4 minutong pagbabasa' },
    photoLabel: { en: 'Opinion', fil: 'Opinyon' },
    body: {
      en: [
        'Open data succeeds when agencies treat machine-readable publishing as part of daily operations rather than a one-off compliance checkbox.',
        '[Placeholder opinion essay.]',
      ],
      fil: [
        'Nagtatagumpay ang bukas na datos kapag itinuturing ng mga ahensya ang regular na paglalathala nito bilang bahagi ng pang-araw-araw na trabaho.',
        '[Pansamantalang sanaysay ng opinyon.]',
      ],
    },
  },
  {
    slug: 'volunteers-built-it',
    category: 'opinion',
    kicker: { en: 'Opinion', fil: 'Opinyon' },
    title: {
      en: 'Volunteers built it. Now government has to maintain it.',
      fil: 'Mga boluntaryo ang nagtayo. Ngayon gobyerno ang dapat magpanatili.',
    },
    deck: {
      en: 'Civic hackathons spark prototypes, but public institutions must own long-term stewardship.',
      fil: 'Nagsisimula ang mga prototype sa hackathon, ngunit kailangan ng pangmatagalang pagmamay-ari ng institusyon.',
    },
    author: { en: '[Columnist name]', fil: '[Pangalan ng kolumnista]' },
    date: { en: '20 November 2026', fil: '20 Nobyembre 2026' },
    readTime: { en: '4 min read', fil: '4 minutong pagbabasa' },
    photoLabel: { en: 'Opinion', fil: 'Opinyon' },
    body: {
      en: [
        'Civic technologists can prove what is possible in a weekend; sustaining public digital infrastructure requires dedicated budgets and civil service teams.',
        '[Placeholder opinion essay.]',
      ],
      fil: [
        'Kayang patunayan ng mga civic technologist kung ano ang posible sa isang weekend; ang pagpapanatili nito ay nangangailangan ng nakalaang pondo at koponan.',
        '[Pansamantalang sanaysay ng opinyon.]',
      ],
    },
  },
  {
    slug: 'ai-and-hearings',
    category: 'opinion',
    kicker: { en: 'Opinion', fil: 'Opinyon' },
    title: {
      en: 'Let AI read the bills — but keep humans in the hearing room.',
      fil: 'Hayaang basahin ng AI ang mga panukalang batas — ngunit panatilihin ang tao sa pagdinig.',
    },
    deck: {
      en: 'Using language models to summarize legislation without losing democratic accountability.',
      fil: 'Paggamit ng AI upang ibuod ang mga batas nang hindi nawawala ang demokratikong pananagutan.',
    },
    author: { en: '[Columnist name]', fil: '[Pangalan ng kolumnista]' },
    date: { en: '16 November 2026', fil: '16 Nobyembre 2026' },
    readTime: { en: '4 min read', fil: '4 minutong pagbabasa' },
    photoLabel: { en: 'Opinion', fil: 'Opinyon' },
    body: {
      en: [
        'Automated bill diffing saves researchers hours, but civic judgment and public testimony remain irreducibly human.',
        '[Placeholder opinion essay.]',
      ],
      fil: [
        'Nakakatipid ng oras sa pananaliksik ang awtomatikong pagbabasa ng panukalang batas, ngunit ang paghatol at testimonya ng mamamayan ay nananatiling makatao.',
        '[Pansamantalang sanaysay ng opinyon.]',
      ],
    },
  },
];

export function getArticleBySlug(slug: string): ArticleItem {
  return ARTICLES.find((a) => a.slug === slug) ?? ARTICLES[0];
}

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
