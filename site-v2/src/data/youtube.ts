/*
  Die Videos der Seite /meet-us.

  Quelle: der YouTube-Kanal von Lauris Kalnins, https://www.youtube.com/@lauris.kalnins
  Abgezogen am 7. September 2026 mit yt-dlp. Der Kanal hatte zu dem Zeitpunkt
  zehn regulaere Videos plus Shorts. Ausgewaehlt sind die sechs, in denen man
  Menschen trifft: die beiden Gruender und die Creatorin Katrina Zaiceva.
  Reine Verkaufsvideos und die Agentur-Business-Folgen sind bewusst draussen.

  Warum die Zahlen hier stehen und nicht in der Seite: der Copy-Check
  (scripts/check-copy.mjs, Regel 2) verbietet nackte Zahlen in Seiten-Copy.
  src/data/ ist freigegeben, weil neben jeder Zahl die Quelle steht.

  Die Titel sind gekuerzt und vereinfacht. Die Originaltitel auf YouTube sind
  laenger, tragen Zahlen, Emoji und lange Gedankenstriche und wuerden den
  Copy-Check brechen. Inhaltlich sagen die kurzen Titel dasselbe.
  Ansage Manuel 07.09.2026.
*/

/** Einheitliche Quellenangabe. Steht an jedem Eintrag. */
export const YOUTUBE_SOURCE = 'youtube.com/@lauris.kalnins, read 2026-09-07' as const;

export type YouTubeSource = typeof YOUTUBE_SOURCE;

export interface TeamVideo {
  /** YouTube-Video-ID, elf Zeichen. Geht so in die Embed-URL. */
  id: string;
  /** Gekuerzter, einfacher Titel. Zugleich der Name des Play-Buttons. */
  title: string;
  /** Volle URL zum Video, fuer den Textlink unter der Karte. */
  url: string;
  /** Uploaddatum als ISO-Datum, laut yt-dlp. */
  publishedAt: string;
  /** Laufzeit als fertiger Text, auf volle Minuten gerundet. */
  durationLabel: string;
  /** Ein bis zwei sehr einfache Saetze: was man sieht. */
  blurb: string;
  /*
    Liegt ein eigenes Standbild unter public/img/youtube/<id>.webp?
    Die YouTube-Vorschaubilder tragen teils Werbetext ins Bild gebrannt
    ("NEW PENTHOUSE + BMW", Zahlen ohne Bezugsgroesse). Wo der Zuschnitt das
    nicht wegbekommt, steht hier false und die Karte zeigt die ruhige
    CI-Flaeche mit Abspielsymbol. Ansage Manuel: keine Claims auf der Seite,
    und ein Bild ist auch eine Aussage. Der Copy-Check kann Text in Bildern
    nicht sehen, deshalb ist das hier von Hand entschieden.
  */
  poster: boolean;
  source: YouTubeSource;
}

/*
  Reihenfolge: das neueste Video zuerst. Laufzeiten aus dem Feld
  duration_string von yt-dlp, auf volle Minuten gerundet.
*/
export const teamVideos: TeamVideo[] = [
  {
    id: 'ION-xrM6GOM',
    poster: false,
    title: 'Life as a Wunder creator',
    url: 'https://www.youtube.com/watch?v=ION-xrM6GOM',
    publishedAt: '2026-07-28',
    durationLabel: '16 min',
    blurb: 'Katrina shows her home and her week. She says what changed for her.',
    source: YOUTUBE_SOURCE,
  },
  {
    id: 'V6q4O55fIyA',
    poster: true,
    title: 'Four months with Katrina',
    url: 'https://www.youtube.com/watch?v=V6q4O55fIyA',
    publishedAt: '2026-02-17',
    durationLabel: '14 min',
    blurb: 'Lauris meets Katrina again. She tells him what grew, and what she does each day.',
    source: YOUTUBE_SOURCE,
  },
  {
    id: 'ZQwUQf3c7lE',
    poster: true,
    title: 'How Lauris got started',
    url: 'https://www.youtube.com/watch?v=ZQwUQf3c7lE',
    publishedAt: '2026-01-09',
    durationLabel: '36 min',
    blurb: 'Lauris tells his own story. He grew up in Riga and built a team.',
    source: YOUTUBE_SOURCE,
  },
  {
    id: 'z_tpNrxZRoU',
    poster: true,
    title: 'Why Katrina joined us',
    url: 'https://www.youtube.com/watch?v=z_tpNrxZRoU',
    publishedAt: '2026-01-02',
    durationLabel: '29 min',
    blurb: 'Katrina came to us from another agency. She talks about that move.',
    source: YOUTUBE_SOURCE,
  },
  {
    id: 'UhjMp8M-bco',
    poster: false,
    title: 'Manuel on our podcast',
    url: 'https://www.youtube.com/watch?v=UhjMp8M-bco',
    publishedAt: '2025-11-03',
    durationLabel: '28 min',
    blurb: 'Manuel sits down with Lauris. They talk about how creators find new fans.',
    source: YOUTUBE_SOURCE,
  },
  {
    id: 'PUhy7hBKLzs',
    poster: false,
    title: 'Meet our second founder',
    url: 'https://www.youtube.com/watch?v=PUhy7hBKLzs',
    publishedAt: '2025-10-10',
    durationLabel: '36 min',
    blurb: 'Lauris brings Manuel on the show. The two tell how they began.',
    source: YOUTUBE_SOURCE,
  },
];

/*
  Hinweis unter jedem Video. Steht hier, damit er an genau einer Stelle
  gepflegt wird und auf jeder Karte gleich lautet.
*/
export const loadNote = 'Press play and the video loads from YouTube.';
