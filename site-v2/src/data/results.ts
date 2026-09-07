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

/*
  ============================================================================
  BLOCKER VOR DEM LIVEGANG, gefunden am 07.09.2026 abends. NICHT deployen,
  bevor Manuel entschieden hat.

  In results-02, results-05 und results-06 ist die OnlyFans-Statistik eines
  Accounts als Bildschirmaufnahme zu sehen, samt Klarnamen und Nutzernamen
  zahlender Fans. Belegt an den Postern und an Einzelbildern:
    results-06.jpg      QuickNick, Jasonoss, Roger, Dukee, B-Dubs808, Bo
    results-02.jpg      Diegog
    results-05.jpg      Bruno "lab" BABU
    results-02.mp4 t=150  Stan @u148826603, Mike @u30457136, Bryce @b66515466
  Das sind personenbezogene Daten Dritter. Die Poster zeigen sie sofort beim
  Seitenaufruf, ohne dass jemand auf Play drueckt.

  Zusaetzlich verbietet das Female-Gaze-Dossier, Abschnitt 8, ausdruecklich
  "Screenshots mit privaten Namen, Logins, Nachrichten oder nicht freigegebenen
  Zahlen", und public/img/QUELLEN.txt haelt fest, dass Verdienst-Screenshots
  bewusst NICHT uebernommen wurden. Die Videos widersprechen dieser eigenen
  Regel.

  Moegliche Wege, Entscheidung liegt bei Manuel: die drei Videos entfernen,
  oder die Statistikhaelfte im Schnitt unkenntlich machen und neue Poster
  ziehen. Ein blosser Poster-Zuschnitt reicht nicht, das Video selbst zeigt es
  weiter.
  ============================================================================
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

/*
  KORREKTUR 07.09.2026 abends. Die Ueberschrift hiess "Real creators. Real
  numbers." und der Videoblock "Six creators tell you what happened." Beides
  ist falsch: in keinem der sieben Videos spricht eine Creatorin. Zu sehen ist
  jeweils eine Person, die am Bildschirm die Zahlen eines Accounts durchgeht.
  Geprueft am 07.09.2026 an den Postern und an Einzelbildern bei Sekunde 40, 90
  und 150 von results-01, -02 und -06.

  Grundlage der Korrektur: Regel 9 des Bauauftrags (nichts erfinden, jede
  Aussage belegt), Vertrauens-Dossier These T3 (Integritaet heisst, dieselbe
  Auskunft steht ueberall) und Female-Gaze-Dossier Abschnitt 9 ("Stimmen Rolle,
  Handlung, Caption und angrenzender Text ueberein?").
*/
export const intro = {
  eyebrow: 'Results',
  heading: 'The numbers, one account at a time.',
  lead: 'These videos stood on our old website. We took them over as they were.',
  body: 'In each one you see the numbers of one account on screen while someone talks through them.',
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
    caption: 'The video goes through her OnlyFans statistics on screen.',
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
    caption: 'The video goes through her Instagram reach on screen.',
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
  caption: 'One of our team talks about the work.',
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
  eyebrow: 'Six accounts',
  heading: 'Six accounts, one video each.',
  lead: 'Press play on a video. There is no sound until you start it.',
};

export const closingBlock = {
  eyebrow: 'Your turn',
  heading: 'Read how we work, then apply.',
  lead: 'Each account above is one case. Yours would start with your own last thirty days.',
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
