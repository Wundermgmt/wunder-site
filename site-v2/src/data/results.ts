/*
  Alle Texte und Zahlen der Results-Seite.

  Warum diese Datei existiert: der Copy-Check (scripts/check-copy.mjs, Regel 2)
  verbietet nackte Zahlen in Seiten-Copy. src/data/ ist dafuer freigegeben.
  Deshalb liegt JEDE Zahl der Results-Seite hier und nicht in results.astro.

  UMBAU 08.09.2026, Ansage Manuel. Was sich geaendert hat und warum:

  1. Jede Herkunfts- und Datumsangabe ist raus. Frueher stand unter jedem Video
     eine Herkunftszeile mit Datum und am Seitenende ein ganzer Block
     "Where these numbers come from". Eine Besucherin interessiert nicht, von
     welcher Seite ein Video stammt. Manuel: raus mit dem Hinweis auf die
     Vorgaengerseite, raus mit jeder Datumsangabe, raus mit jeder Herkunftsangabe.
  2. Der Satz "One of our team talks about the work" ist raus. Er sagt nichts.
  3. Der Name der Fan-Plattform steht nirgends mehr, auch nicht in einer Ueberschrift.
     Grund: Banken. Ersatz: "your page", "your fan page", "your subscribers".
  4. Die drei benannten Ergebnisaussagen sind keine Textkacheln mehr. Sie sind
     jetzt Bildunterschriften mit dem passenden Screenshot direkt daneben,
     Zuordnung genau wie auf wundermgmt.com. Manuel: "Die Zeilen sind
     Bildunterschriften und brauchen den passenden Screenshot direkt dabei."
     Zuordnung geprueft am 08.09.2026 am HTML der Live-Seite:
       1.500 auf 10.000 im Monat   -> case05_1500-to-10000-eur-per-month.jpg
       ueber 200k Follower         -> case06_200k-followers-6months.png
       zehntausende jeden Monat    -> case07_tens-of-thousands-monthly.jpg
     Die drei Screenshots zeigen keine Namen, keine Fans und keinen Toolnamen.
  5. Neu: die vier Kundenbewertungen, die auf der Live-Seite im Block zu
     "USD 50K+ per month" hingen. Fuenf Sterne, Datum, Vorname, Bewertungstext.
     Das ist Beweis neben Behauptung, Manuel-Korrektur 07 vom 08.09.2026.

  ============================================================================
  BLOCKER VOR DEM LIVEGANG, gefunden am 07.09.2026 abends, weiterhin offen.

  In results-02, results-05 und results-06 ist die Statistik eines Accounts als
  Bildschirmaufnahme zu sehen, samt Klarnamen und Nutzernamen zahlender Fans.
  Belegt an den Postern und an Einzelbildern:
    results-06.jpg      QuickNick, Jasonoss, Roger, Dukee, B-Dubs808, Bo
    results-02.jpg      Diegog
    results-05.jpg      Bruno "lab" BABU
    results-02.mp4 t=150  Stan @u148826603, Mike @u30457136, Bryce @b66515466
  Das sind personenbezogene Daten Dritter. Die Poster wurden inzwischen neu
  gezogen, das Video selbst zeigt die Daten beim Abspielen weiter.
  Manuel hat am 08.09.2026 gesagt, die Videos passen inhaltlich. Die Frage der
  Fan-Daten im Video ist damit NICHT entschieden. Nicht deployen, bevor sie es
  ist.
  ============================================================================
*/

export interface VideoCase {
  /** Dateiname ohne Endung, results-01 bis results-07. */
  id: string;
  /** Pfad zur MP4-Datei in public/videos/. */
  src: string;
  /** Pfad zum Poster-JPEG, gleiche Basis. */
  poster: string;
  /** Kurze Ueberschrift. Traegt die Zahl des Falls. */
  headline: string;
  /** Ein bis zwei einfache Saetze unter dem Video. */
  caption: string;
}

/*
  KORREKTUR 07.09.2026 abends, bleibt gueltig. Die Ueberschrift hiess "Real
  creators. Real numbers." und der Videoblock "Six creators tell you what
  happened." Beides ist falsch: in keinem der sieben Videos spricht eine
  Creatorin. Zu sehen ist jeweils eine Person, die am Bildschirm die Zahlen
  eines Accounts durchgeht. Geprueft an den Postern und an Einzelbildern bei
  Sekunde 40, 90 und 150 von results-01, -02 und -06.
*/
export const intro = {
  eyebrow: 'Results',
  heading: 'Look first. Then decide.',
  lead: 'We would rather show you than tell you.',
  body: 'Every screen below belongs to one creator. One account, one time span, one number.',
};

/*
  Die drei benannten Ergebnisaussagen mit ihrem Screenshot.

  Regel dabei, Trust-Standard v1: die Ueberschrift ist die Aussage, die Caption
  sagt nur, was auf dem Bild wirklich zu sehen ist. Die Caption behauptet nichts
  dazu.
*/
export interface ProofCase {
  headline: string;
  image: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

export const proofCases: ProofCase[] = [
  {
    headline: 'She went from 1,500 euro a month to 10,000 euro a month.',
    image: 'case-monthly-pay.webp',
    alt: 'A statistics page for one creator. A blue line rises from about three thousand dollars a month to about nine thousand.',
    caption: 'Her own statistics page. The blue line is what she earned each month.',
    width: 1280,
    height: 994,
  },
  {
    headline: 'She gained more than 200,000 new followers in six months.',
    image: 'case-followers.webp',
    alt: 'A follower report for one account. The number of new follows in the period is three hundred twenty four thousand.',
    caption: 'Her own follower report. The big number is the new follows in that time.',
    width: 1300,
    height: 1016,
  },
  {
    headline: 'She now earns tens of thousands every month.',
    image: 'case-monthly-earnings.webp',
    alt: 'A statistics page for one creator over six months, with a daily bar chart of what she earned.',
    caption: 'Her own statistics page. Each spike is one day of sales to her subscribers.',
    width: 1280,
    height: 1005,
  },
];

export const proofBlock = {
  eyebrow: 'Three accounts',
  heading: 'Three creators, three screens.',
  lead: 'Each line below has the screen behind it, right next to it.',
};

/*
  Reihenfolge exakt wie auf der Live-Seite. Die Videos waren dort keine
  Vimeo- oder YouTube-Einbettungen, sondern Squarespace-eigene HLS-Streams.
  Sie liegen jetzt als 720p-MP4 mit Poster in public/videos/.

  Der Name der Fan-Plattform ist am 08.09.2026 aus allen Ueberschriften entfernt worden.
  Der Sachverhalt bleibt gleich, nur die Plattform wird nicht mehr genannt.
*/
export const videoCases: VideoCase[] = [
  {
    id: 'results-01',
    src: '/videos/results-01.mp4',
    poster: '/videos/results-01.jpg',
    headline: 'Over 100 million views on Instagram',
    caption: 'Her videos reached far past her own followers. Now millions of people see her every month.',
  },
  {
    id: 'results-02',
    src: '/videos/results-02.mp4',
    poster: '/videos/results-02.jpg',
    headline: 'More than 50,000 dollars a month from her page',
    caption: 'The video goes through her own statistics on screen.',
  },
  {
    id: 'results-03',
    src: '/videos/results-03.mp4',
    poster: '/videos/results-03.jpg',
    headline: 'More than double the growth in two months',
    caption: 'We found a plan that worked for her. Her growth kept going, week after week.',
  },
  {
    id: 'results-04',
    src: '/videos/results-04.mp4',
    poster: '/videos/results-04.jpg',
    headline: 'A million views every week',
    caption: 'The video goes through her Instagram reach on screen.',
  },
  {
    id: 'results-05',
    src: '/videos/results-05.mp4',
    poster: '/videos/results-05.jpg',
    headline: 'Close to 30,000 dollars a month from her page',
    caption: 'Her income is steady now. She can plan her month around it.',
  },
  {
    id: 'results-06',
    src: '/videos/results-06.mp4',
    poster: '/videos/results-06.jpg',
    headline: 'Four times the earnings in forty five days',
    caption: 'We changed a few small things in her setup. Her income grew four times over.',
  },
];

/*
  Video sieben. Stand auf der Live-Seite ohne eigene Ueberschrift, direkt
  vor dem Abschlussblock. Die alte Caption "One of our team talks about the
  work" ist am 08.09.2026 gestrichen worden, sie war kein logischer Satz.
*/
export const closingVideo: VideoCase = {
  id: 'results-07',
  src: '/videos/results-07.mp4',
  poster: '/videos/results-07.jpg',
  headline: 'How we read an account',
  caption: 'We go through the numbers of one account, step by step.',
};

export const videosBlock = {
  eyebrow: 'Six accounts',
  heading: 'Six accounts, one video each.',
  lead: 'Press play on a video. There is no sound until you start it.',
};

/*
  Die vier Kundenbewertungen. Auf der Live-Seite hingen sie am Block zu
  "USD 50K+ per month". Sie sind hier eigene Beweise: Sterne, Datum, Vorname
  und ein Text, den die Creatorin selbst geschrieben hat.

  Der Alt-Text gibt den Kern des Bildes wieder, damit eine Vorleseprogramm
  Nutzerin ihn auch hoert. Der volle Wortlaut steht im Bild.
*/
export interface Review {
  image: string;
  alt: string;
  caption: string;
}

export const reviews: Review[] = [
  {
    image: 'review-01.webp',
    alt: 'A five star review for Wunder Management. The creator writes that she had about six thousand followers. Barely anyone paid for her page. Lauris and Nils told her what to do. They helped her with her posts and her stories.',
    caption: 'Monique.',
  },
  {
    image: 'review-02.webp',
    alt: 'A five star review for Wunder Management. The creator writes that she was very shy at the start. Her English was not good. Nobody made her feel odd about it.',
    caption: 'Jasmina.',
  },
  {
    image: 'review-03.webp',
    alt: 'A five star review for Wunder Management. The creator writes that the team plans her content and gives her scripts for sales, and that answers sometimes take longer at the weekend.',
    caption: 'Tatjana.',
  },
  {
    image: 'review-04.webp',
    alt: 'A five star review for Wunder Management. The creator writes that she has her own small team. There is a creative person, a manager and the chat team. Brands now write to her.',
    caption: 'Alicia.',
  },
];

export const reviewsBlock = {
  eyebrow: 'In their own words',
  heading: 'What creators wrote about us.',
  lead: 'These are real reviews with a date and a name. We did not write them.',
};

export const closingBlock = {
  eyebrow: 'Your turn',
  heading: 'Read how we work, then apply.',
  lead: 'Every account here started somewhere. Yours would start with the page you have today.',
};
