/*
  Alle Texte und Zahlen der Results-Seite.

  Warum diese Datei ueberhaupt existiert: der Copy-Check
  (scripts/check-copy.mjs, Regel 2) verbietet nackte Zahlen in Seiten-Copy.
  src/data/ ist dafuer freigegeben, weil hier neben jeder Zahl die Quelle
  steht. Deshalb liegt JEDE Zahl der Results-Seite hier und nicht in
  results.astro. Die Seite gibt nur Variablen aus.

  Herkunft: der Tab "Resultate" von wundermgmt.com, Sicherung vom
  7. September 2026. Die Formulierungen wurden fuer die Zielgruppe in
  einfaches Englisch umgeschrieben, Ansage Manuel 07.09.2026. Zahlen und
  Sachverhalt bleiben unveraendert. Gesperrte Claims der Live-Seite
  (erster Anbieter weltweit, viralste Creatorin der Welt, einziger
  Premium-Partner) sind bewusst nicht uebernommen.
*/

/** Einheitliche Quellenangabe. Steht an jedem Eintrag mit einer Zahl. */
export const RESULTS_SOURCE = 'live site 2026-09-07' as const;

export type ResultsSource = typeof RESULTS_SOURCE;

export interface VideoCase {
  /** Dateiname ohne Endung, results-01 bis results-07. */
  id: string;
  /** Pfad zur MP4-Datei in public/videos/. */
  src: string;
  /** Pfad zum Poster-JPEG, gleiche Basis. */
  poster: string;
  /** Kurze Ueberschrift. Traegt die Zahl des Falls. Leer beim Abschlussvideo. */
  headline: string;
  /** Ein bis zwei einfache Saetze unter dem Video. */
  caption: string;
  /** Laufzeit als fertiger Text, damit die Seite nicht rechnen muss. */
  duration: string;
  /** Laufzeit in Sekunden, gemessen an der Datei. */
  durationSeconds: number;
  source: ResultsSource;
}

export const intro = {
  eyebrow: 'Results',
  heading: 'Real creators. Real numbers.',
  lead: 'Trust is the base of our work. So we share the stories of creators like you.',
  body: 'Watch them below. Each one says what changed, and how long it took.',
};

/*
  Reihenfolge exakt wie auf der Live-Seite. Die Videos waren dort keine
  Vimeo- oder YouTube-Einbettungen, sondern Squarespace-eigene HLS-Streams.
  Sie liegen jetzt als 720p-MP4 mit Poster in public/videos/.
*/
export const videoCases: VideoCase[] = [
  {
    id: 'results-01',
    src: '/videos/results-01.mp4',
    poster: '/videos/results-01.jpg',
    headline: 'Over 100 million Instagram views',
    caption: 'Her videos reached far past her own followers. Now millions of people see her every month.',
    duration: '2 min 43 s',
    durationSeconds: 163,
    source: RESULTS_SOURCE,
  },
  {
    id: 'results-02',
    src: '/videos/results-02.mp4',
    poster: '/videos/results-02.jpg',
    headline: 'More than USD 50K per month on OnlyFans',
    caption: 'She earns in one month what many people earn in a full year.',
    duration: '3 min 28 s',
    durationSeconds: 208,
    source: RESULTS_SOURCE,
  },
  {
    id: 'results-03',
    src: '/videos/results-03.mp4',
    poster: '/videos/results-03.jpg',
    headline: 'More than 100% growth in 2 months',
    caption: 'We found a plan that worked for her. Her growth kept going, week after week.',
    duration: '2 min 51 s',
    durationSeconds: 171,
    source: RESULTS_SOURCE,
  },
  {
    id: 'results-04',
    src: '/videos/results-04.mp4',
    poster: '/videos/results-04.jpg',
    headline: '1 million views every week',
    caption: 'She reaches more people in one day than many creators reach in a year.',
    duration: '2 min 2 s',
    durationSeconds: 122,
    source: RESULTS_SOURCE,
  },
  {
    id: 'results-05',
    src: '/videos/results-05.mp4',
    poster: '/videos/results-05.jpg',
    headline: 'Close to USD 30K per month on OnlyFans',
    caption: 'Her income is steady now. She can plan her month around it.',
    duration: '4 min 3 s',
    durationSeconds: 243,
    source: RESULTS_SOURCE,
  },
  {
    id: 'results-06',
    src: '/videos/results-06.mp4',
    poster: '/videos/results-06.jpg',
    headline: '4x more earnings in 45 days',
    caption: 'We changed a few small things in her setup. Her income grew four times over.',
    duration: '3 min 42 s',
    durationSeconds: 222,
    source: RESULTS_SOURCE,
  },
];

/*
  Video sieben. Stand auf der Live-Seite ohne eigene Ueberschrift, direkt
  vor dem Block "ALL OF THIS COULD BE YOU".
*/
export const closingVideo: VideoCase = {
  id: 'results-07',
  src: '/videos/results-07.mp4',
  poster: '/videos/results-07.jpg',
  headline: '',
  caption: 'One more look at how we work with creators.',
  duration: '2 min 1 s',
  durationSeconds: 121,
  source: RESULTS_SOURCE,
};

export interface ResultStatement {
  text: string;
  source: ResultsSource;
}

/*
  Die drei benannten Ergebnisaussagen. Standen auf der Live-Seite als
  eigene Textbloecke zwischen den Videos.
*/
export const statements: ResultStatement[] = [
  {
    text: 'This creator grew from 1,500 EUR to 10,000 EUR per month in 12 weeks.',
    source: RESULTS_SOURCE,
  },
  {
    text: 'This creator gained more than 200k followers in just 6 months.',
    source: RESULTS_SOURCE,
  },
  {
    text: 'This creator now earns tens of thousands every single month.',
    source: RESULTS_SOURCE,
  },
];

export const statementsBlock = {
  eyebrow: 'In their own numbers',
  heading: 'What changed for them.',
  lead: 'Three creators, three starting points. Each line is one person.',
};

export const videosBlock = {
  eyebrow: 'Their stories',
  heading: 'Six creators tell you what happened.',
  lead: 'Press play on a video. There is no sound until you start it.',
};

export const closingBlock = {
  eyebrow: 'Your turn',
  heading: 'This could be you.',
  lead: 'Want the same path? Read how we work, then apply.',
};

/*
  Ruhiger Quellenhinweis am Seitenende. Kein Kleingedrucktes-Ton, aber
  klar: Einzelfall, kein typisches Ergebnis.
*/
export const sourceNote = {
  heading: 'Where these numbers come from.',
  lines: [
    'Every number and video here comes from our own website. We took them on 7 September 2026.',
    'Each result belongs to one creator. It is a single case, not a normal result.',
    'Your own numbers can be higher or lower. We do not promise you the same.',
  ],
};

/** Kurzform fuer die Fusszeile unter jedem Video. */
export const videoSourceNote = 'From our website, 7 September 2026.';
