#!/usr/bin/env node
/*
  Copy guard. Runs before every build (npm run build) and in CI.
  It enforces the four rules from 04-konzept.md section 6.6 that a human
  reviewer keeps missing:

    1. no blocked sales claim ("insider", "guarantee", "no contracts",
       "top 0.1", "world's", "leading", "never lost")
    2. no bare number without the Figure or RecordCard component around it
    3. no long dash anywhere in the copy
    4. no record card with an empty mandatory field
    5. no page whose reading level is above sixth grade

  Cleared exceptions live in scripts/allowed-phrases.txt, one phrase per line,
  with the reason on the same line after a double slash. Everything else fails
  the build with the file, the line and the offending text.

  Regel 5, Ansage Manuel 07.09.2026 abends: die meisten Creatorinnen sind keine
  englischen Muttersprachlerinnen. Jede Seite unter src/pages wird auf
  Flesch-Kincaid Grade Level gemessen, Schwelle 6.0. Eigene Rechnung in
  JavaScript, bewusst ohne neue Abhaengigkeit: der Render-Build faehrt npm ci
  und das Projekt haelt nur astro und @astrojs/sitemap.

  Nur berichten statt brechen:  node scripts/check-copy.mjs --readability-report
*/

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const scanRoots = ['src'];
const scanExtensions = new Set(['.astro', '.md', '.mdx', '.ts', '.js', '.mjs']);

// Rule 1. Blocked claims, 04-konzept.md sections 2.4 and 6.6.
const blockedClaims = [
  'insider',
  'guarantee',
  'no contracts',
  'top 0.1',
  "world's",
  'leading',
  'never lost',
];

// Rule 2. Numbers outside the number components.
const numberPatterns = [
  { name: 'bare percentage', re: /\b\d+(?:[.,]\d+)?\s?%/g },
  { name: 'bare magnitude', re: /\b\d+(?:[.,]\d+)?\s?(?:k|m|bn)\+?\b/gi },
  { name: 'bare order of magnitude', re: /\b\d+(?:[.,]\d+)?\s?(?:billion|million|thousand)\b/gi },
];
// Files that are allowed to carry numbers because the component or the schema
// forces period, basis and source next to them.
const numberExempt = [
  'src/content/records/',
  'src/components/Figure.astro',
  'src/components/RecordCard.astro',
  'src/site.ts',
  'scripts/',
  // Registrierte Zahlenquellen. Jede Zahl in src/data/ traegt im selben Objekt
  // Zeitraum und Quelle, z.B. "live site 2026-09-07" oder
  // "wunderportal export 2026-09-07, window <von> to <bis>".
  // Ansage Manuel 07.09.2026.
  'src/data/',
];

// Rule 3. Long dashes are forbidden in every text under Manuel's name.
const longDashes = [
  { char: '—', name: 'em dash' },
  { char: '–', name: 'en dash' },
];

/*
  Rule 5. Lesbarkeit.
  Gemessen wird nur src/pages, also das, was eine Besucherin wirklich liest.
  Komponenten und Datendateien bleiben aussen vor, ihre Saetze werden ueber die
  Seite gemessen, auf der sie landen.
*/
const readabilityRoot = 'src/pages';
/*
  Zweite Wurzel, ergaenzt am 07.09.2026. Seiten wie /results und /meet-us halten
  ihre Copy bewusst in src/data, weil dort neben jeder Zahl die Quelle steht und
  die Zahlenregel das erlaubt. Ohne diese Zeile misst die Lesbarkeitspruefung
  solche Seiten mit null Woertern, also gar nicht, und die Schranke waere an der
  Stelle wirkungslos. Datendateien werden deshalb als eigener Eintrag gemessen.
*/
const readabilityDataRoot = 'src/data';
const readabilityMaxGrade = 6.0;
// Rechtstexte muessen praezise bleiben. Ein Impressum und eine
// Datenschutzerklaerung in Grundschulsprache waeren juristisch schlechter, also
// sind genau diese zwei Seiten benannt ausgenommen. Ansage Manuel 07.09.2026.
const readabilityExempt = ['src/pages/imprint.astro', 'src/pages/privacy.astro'];

function loadAllowList() {
  try {
    const raw = readFileSync(join(root, 'scripts/allowed-phrases.txt'), 'utf8');
    return raw
      .split('\n')
      .map((line) => line.split('//')[0].trim())
      .filter((line) => line.length > 0);
  } catch {
    return [];
  }
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist' || entry.startsWith('.')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (scanExtensions.has(extname(full))) out.push(full);
  }
  return out;
}

const allowList = loadAllowList();
const failures = [];

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

/*
  The number rule applies to copy, not to code. Style blocks, component
  frontmatter and attribute values (width="100%", viewBox, class names) are
  blanked out at the same length, so reported line numbers stay correct.
*/
const blank = (match) => ' '.repeat(match.length);
function stripNonCopy(text) {
  return text
    .replace(/<style[\s\S]*?<\/style>/g, blank)
    .replace(/<script[\s\S]*?<\/script>/g, blank)
    .replace(/^---[\s\S]*?\n---/, blank)
    .replace(/=(?:"[^"]*"|'[^']*'|\{[^}]*\})/g, blank);
}

/* ------------------------------------------------------------------ */
/*  Rule 5. Flesch-Kincaid Grade Level, eigene Rechnung.               */
/* ------------------------------------------------------------------ */

/*
  Was gemessen wird, und was nicht.

  Gemessen wird die sichtbare Copy einer Seite, in zwei Teilen:

    a) Der Rumpf der Datei. Style-Bloecke, Script-Bloecke, HTML-Kommentare,
       Tags und Attributwerte fallen weg, der Text zwischen den Tags bleibt.
       Inline-Auszeichnung (a, strong, em, span ...) trennt einen Satz NICHT,
       sonst wuerde ein Satz mit einem Link darin als drei Minisaetze zaehlen
       und die Messung schoenrechnen.

    b) Zeichenketten aus dem Frontmatter, die spaeter als Text gerendert
       werden. Ohne die waeren die FAQ-Antworten in faq.astro und die
       Feldbeschriftungen in apply.astro unsichtbar fuer die Pruefung, obwohl
       sie den groessten Teil der Seite ausmachen. Genommen werden nur
       mehrwortige Zeichenketten aus dem Frontmatter, nach Abzug der
       Kommentare und der import-Zeilen. Einzelne Woerter, Pfade und URLs
       ("portrait", "/apply", "https://") sind Technik, keine Copy.

  Nicht gemessen werden Titel und Meta-Beschreibung, weil sie als
  Attributwerte uebergeben werden und nicht auf der Seite stehen.
*/

// Tags, die mitten im Satz stehen duerfen, ohne ihn zu zerschneiden.
const inlineTags = new Set([
  'a', 'strong', 'em', 'b', 'i', 'span', 'code', 'small', 'abbr', 'u', 'sup', 'sub',
]);

const entities = { '&amp;': '&', '&nbsp;': ' ', '&quot;': '"', '&#39;': "'", '&apos;': "'" };

function decodeEntities(text) {
  return text.replace(/&(?:amp|nbsp|quot|#39|apos);/g, (match) => entities[match] ?? match);
}

/*
  Liest ein Tag ab Position start (dort steht "<") und gibt das Ende sowie den
  Tagnamen zurueck. Anfuehrungszeichen und Attribut-Ausdruecke in geschweiften
  Klammern werden uebersprungen, damit ein ">" darin das Tag nicht vorzeitig
  beendet.
*/
function readTag(text, start) {
  let i = start + 1;
  let quote = null;
  let name = '';
  let readingName = true;
  if (text[i] === '/') i++;
  while (i < text.length) {
    const ch = text[i];
    if (quote) {
      if (ch === quote) quote = null;
      i++;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      readingName = false;
      i++;
      continue;
    }
    if (ch === '{') {
      let depth = 1;
      i++;
      while (i < text.length && depth > 0) {
        if (text[i] === '{') depth++;
        else if (text[i] === '}') depth--;
        i++;
      }
      readingName = false;
      continue;
    }
    if (ch === '>') return { end: i, name: name.toLowerCase() };
    if (readingName) {
      if (/[\s/]/.test(ch)) readingName = false;
      else name += ch;
    }
    i++;
  }
  return { end: text.length, name: name.toLowerCase() };
}

/*
  Zerlegt den Rumpf einer .astro-Datei in sichtbare Textstuecke.
  In einem JSX-Ausdruck ({ items.map(...) }) wird der rohe Code ignoriert.
  Sobald darin ein Tag auftaucht, ist wieder Text zu erwarten und wird
  gesammelt, so bleibt Copy erhalten, die innerhalb einer Bedingung steht.
*/
function templateSegments(body) {
  const cleaned = body
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');

  const segments = [];
  const stack = [];
  let buffer = '';
  let collecting = true;

  const flush = () => {
    const trimmed = buffer.replace(/\s+/g, ' ').trim();
    if (/[a-zA-Z]/.test(trimmed)) segments.push(decodeEntities(trimmed));
    buffer = '';
  };

  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (ch === '<') {
      const tag = readTag(cleaned, i);
      if (inlineTags.has(tag.name)) buffer += ' ';
      else flush();
      i = tag.end;
      // Innerhalb eines Ausdrucks beginnt mit einem Tag wieder sichtbarer Text.
      if (stack.length > 0) collecting = true;
      continue;
    }
    if (ch === '{') {
      flush();
      stack.push(collecting);
      collecting = false;
      continue;
    }
    if (ch === '}') {
      flush();
      collecting = stack.length > 0 ? stack.pop() : true;
      continue;
    }
    if (collecting) buffer += ch;
  }
  flush();
  return segments;
}

/*
  Holt die sichtbaren Zeichenketten aus dem Frontmatter: Kommentare und
  import-Zeilen raus, dann jede Zeichenkette, die mindestens zwei Woerter hat
  und nicht wie ein Pfad oder eine URL aussieht.
*/
function frontmatterSegments(frontmatter) {
  const code = frontmatter
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .split('\n')
    .filter((line) => !/^\s*import\s/.test(line))
    .map((line) => line.replace(/(^|\s)\/\/.*$/, '$1'))
    .join('\n');

  const segments = [];
  const stringLiteral = /'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"|`((?:[^`\\$]|\\.)*)`/g;
  for (const match of code.matchAll(stringLiteral)) {
    const value = (match[1] ?? match[2] ?? match[3] ?? '').replace(/\\(.)/g, '$1').trim();
    if (!/[a-zA-Z]/.test(value)) continue;
    if (!/\s/.test(value)) continue;
    if (/^(?:https?:|\/|#)/.test(value)) continue;
    segments.push(value);
  }
  return segments;
}

function visibleCopy(source) {
  const front = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const frontmatter = front ? front[1] : '';
  const body = front ? source.slice(front[0].length) : source;
  return [...frontmatterSegments(frontmatter), ...templateSegments(body)];
}

/*
  Silbenzaehlung, Heuristik. Kein Woerterbuch, keine Abhaengigkeit.
    1. alles ausser Buchstaben faellt weg
    2. jede zusammenhaengende Vokalgruppe zaehlt als eine Silbe,
       "beautiful" hat die Gruppen  eau  i  u  , also drei
    3. ein stummes e am Wortende wird abgezogen, "make" ist einsilbig,
       aber nicht bei Endungen wie "-le" nach Konsonant ("simple" bleibt zwei)
    4. die Endungen "-ed" und "-es" sind meistens stumm und werden abgezogen,
       "asked" ist einsilbig. Nach t oder d ("wanted") und nach Zischlaut
       ("watches", "pages") bleiben sie eine eigene Silbe und werden stehen
       gelassen
    5. mindestens eine Silbe pro Wort
  Die Heuristik liegt bei englischer Prosa im Schnitt sehr nah an der
  Woerterbuchzaehlung. Fuer eine Schwelle, die ganze Seiten misst, reicht das.
*/
function countSyllables(word) {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (clean.length === 0) return 0;
  if (clean.length <= 3) return 1;

  let working = clean;
  // Regel 4: stumme Endungen.
  if (/[^aeiouytd]ed$/.test(working)) working = working.slice(0, -2);
  else if (/[^aeiouysxzcg]es$/.test(working) && !/(?:ch|sh)es$/.test(working)) {
    working = working.slice(0, -2);
  }
  // Regel 3: stummes e am Wortende, ausser bei "-le" nach Konsonant.
  if (/e$/.test(working) && !/[^aeiouy]le$/.test(working)) {
    working = working.slice(0, -1);
  }

  const groups = working.match(/[aeiouy]+/g);
  return groups ? Math.max(1, groups.length) : 1;
}

function sentencesOf(segment) {
  return segment
    .split(/(?<=[.!?])["')\]]*\s+/)
    .map((part) => part.trim())
    .filter((part) => /[a-zA-Z0-9]/.test(part));
}

function wordsOf(sentence) {
  return sentence.split(/[\s]+/).filter((token) => /[a-zA-Z0-9]/.test(token));
}

/*
  Flesch-Kincaid Grade Level:
    0.39 * (Woerter / Saetze) + 11.8 * (Silben / Woerter) - 15.59
*/
function readabilityOf(source, rel = '') {
  /*
    .astro wird als Seite gelesen (Frontmatter plus Template), .ts als reine
    Zeichenkettensammlung. frontmatterSegments passt dafuer eins zu eins: es
    wirft Kommentare und import-Zeilen weg und nimmt jede Zeichenkette mit
    mindestens zwei Woertern, die nicht wie ein Pfad oder eine URL aussieht.
  */
  const copy = extname(rel) === '.ts' ? frontmatterSegments(source) : visibleCopy(source);
  const sentences = [];
  for (const segment of copy) sentences.push(...sentencesOf(segment));

  let words = 0;
  let syllables = 0;
  const measured = [];
  for (const sentence of sentences) {
    const tokens = wordsOf(sentence);
    if (tokens.length === 0) continue;
    words += tokens.length;
    for (const token of tokens) syllables += countSyllables(token);
    measured.push({ text: sentence, words: tokens.length });
  }

  if (measured.length === 0 || words === 0) {
    return { grade: 0, words: 0, sentences: 0, longest: [] };
  }

  const grade =
    0.39 * (words / measured.length) + 11.8 * (syllables / words) - 15.59;

  const longest = [...measured].sort((a, b) => b.words - a.words).slice(0, 3);
  return {
    grade: Math.round(grade * 100) / 100,
    words,
    sentences: measured.length,
    longest,
  };
}

function readabilityFiles() {
  const pages = walk(join(root, readabilityRoot)).filter((file) => extname(file) === '.astro');

  // src/data existiert nicht zwingend, walk wuerde sonst werfen.
  let data = [];
  try {
    data = walk(join(root, readabilityDataRoot)).filter((file) => extname(file) === '.ts');
  } catch {
    data = [];
  }

  return [...pages, ...data]
    .map((file) => relative(root, file))
    .filter((rel) => !readabilityExempt.includes(rel))
    .sort();
}

/*
  Berichtsmodus. Bricht nichts ab, gibt nur je Seite den Grade aus.
  node scripts/check-copy.mjs --readability-report
*/
if (process.argv.slice(2).includes('--readability-report')) {
  console.log('\nFlesch-Kincaid Grade Level per page. Threshold for the build: 6.0.\n');
  for (const rel of readabilityFiles()) {
    const result = readabilityOf(readFileSync(join(root, rel), 'utf8'), rel);
    const flag = result.grade > readabilityMaxGrade ? 'over' : 'ok';
    console.log(
      `  ${result.grade.toFixed(2).padStart(6)}  ${flag.padEnd(5)} ${rel}` +
        `  (${result.words} words, ${result.sentences} sentences)`
    );
  }
  console.log(`\n  skipped on purpose: ${readabilityExempt.join(', ')}\n`);
  process.exit(0);
}

for (const scanRoot of scanRoots) {
  for (const file of walk(join(root, scanRoot))) {
    const rel = relative(root, file);
    const original = readFileSync(file, 'utf8');

    // Cleared phrases are removed before scanning, so an approved sentence
    // does not hide a second, unapproved use of the same word.
    let text = original;
    for (const phrase of allowList) {
      text = text.split(phrase).join(' '.repeat(phrase.length));
    }

    for (const claim of blockedClaims) {
      let from = 0;
      const haystack = text.toLowerCase();
      while (true) {
        const at = haystack.indexOf(claim.toLowerCase(), from);
        if (at === -1) break;
        failures.push(`${rel}:${lineOf(text, at)} blocked claim "${claim}"`);
        from = at + claim.length;
      }
    }

    if (!numberExempt.some((prefix) => rel.startsWith(prefix))) {
      const copyOnly = stripNonCopy(text);
      for (const { name, re } of numberPatterns) {
        for (const match of copyOnly.matchAll(re)) {
          failures.push(
            `${rel}:${lineOf(text, match.index)} ${name} "${match[0].trim()}" outside a Figure or RecordCard`
          );
        }
      }
    }

    for (const { char, name } of longDashes) {
      let from = 0;
      while (true) {
        const at = original.indexOf(char, from);
        if (at === -1) break;
        failures.push(`${rel}:${lineOf(original, at)} ${name} found, use a comma or a full stop`);
        from = at + 1;
      }
    }
  }
}

// Rule 4. Record cards, checked here as well so a broken card fails fast and
// with a readable message, not only inside the Astro content schema.
const requiredCardFields = [
  'baseline',
  'period',
  'whatWeDid',
  'whatHappened',
  'whatDidNotWork',
  'source',
  'readAt',
];
const recordsDir = join(root, 'src/content/records');
for (const file of walk(recordsDir)) {
  const rel = relative(root, file);
  const raw = readFileSync(file, 'utf8');
  const front = raw.split('---')[1] ?? '';
  for (const field of requiredCardFields) {
    const match = front.match(new RegExp(`^${field}:\\s*(.*)$`, 'm'));
    const value = match ? match[1].replace(/^["']|["']$/g, '').trim() : '';
    if (value === '') failures.push(`${rel} record card field "${field}" is missing or empty`);
  }
}

// Rule 5. Reading level per page.
for (const rel of readabilityFiles()) {
  const result = readabilityOf(readFileSync(join(root, rel), 'utf8'), rel);
  if (result.grade > readabilityMaxGrade) {
    failures.push(
      `${rel} reading level ${result.grade.toFixed(2)} is above ${readabilityMaxGrade.toFixed(1)}. ` +
        'Shorten the sentences and use shorter words. Longest sentences:\n' +
        result.longest
          .map((item) => `      (${item.words} words) ${item.text}`)
          .join('\n')
    );
  }
}

if (failures.length > 0) {
  console.error('\nCopy check failed. See 04-konzept.md section 6.6.\n');
  for (const failure of failures) console.error(`  ${failure}`);
  console.error(
    `\n${failures.length} problem(s). Fix the copy, or add a cleared phrase to ` +
      'scripts/allowed-phrases.txt with a reason.\n'
  );
  process.exit(1);
}

console.log('Copy check passed: no blocked claims, no bare numbers, no long dashes.');
