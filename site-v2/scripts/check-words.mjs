#!/usr/bin/env node
/*
  Wortfilter. Laeuft vor jedem Build, zusammen mit check-copy.mjs.

  Ansage Manuel 08.09.2026. Es gibt Woerter, die nirgends auf der Seite stehen
  duerfen, und zwar unabhaengig davon, ob sie in der Copy, in einer Alt-Zeile,
  in einem Kommentar oder in einer Datendatei auftauchen. Ein Wort, das im
  Quelltext steht, landet frueher oder spaeter im Text.

  Die Liste und der Grund je Eintrag:

  1. Der Name der Fan-Plattform. Banken sehen sich die Seite an. Ersatz:
     "your page", "your fan page", "your subscribers", "your fan platform".
  2. Die Produktnamen der Werkzeuge, mit denen wir arbeiten. Eine Creatorin
     kann damit nichts anfangen, und wir geben unseren Aufbau nicht preis.
     Ersatz: "the programs we built for this".
  3. "matched against" und "managed against". Eine Leserin, deren Englisch
     Fremdsprache ist, versteht "against" als "gegen sie". Genau daran ist die
     alte Headline gescheitert.
  4. Jeder Hinweis auf die Vorgaengerseite und jede Herkunftszeile mit Datum.
     Eine Besucherin interessiert nicht, woher ein Video kommt.

  Wer einen Treffer bekommt, formuliert um. Es gibt hier bewusst keine
  Ausnahmeliste. Wenn ein Wort wirklich stehen bleiben muss, ist das eine
  Entscheidung von Manuel und gehoert dann hier hinein, mit Begruendung.
*/

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const scanRoots = ['src'];
const scanExtensions = new Set(['.astro', '.ts', '.md', '.mjs', '.css', '.html']);

const banned = [
  { find: 'onlyfans', why: 'Plattformname. Banken lesen mit. Nimm "your page" oder "your fan platform".' },
  { find: 'zernio', why: 'Toolname. Nimm "the programs we built for this".' },
  { find: 'infloww', why: 'Toolname. Nimm "the programs we built for this".' },
  { find: 'matched against', why: 'Wird als "gegen sie" gelesen. Sag, was wir tun.' },
  { find: 'managed against', why: 'Wird als "gegen sie" gelesen. Sag, was wir tun.' },
  { find: 'old website', why: 'Herkunftsangabe. Interessiert keine Besucherin.' },
  { find: 'alten website', why: 'Herkunftsangabe. Interessiert keine Besucherin.' },
  { find: 'september 2026', why: 'Datumsangabe. Datum im Text ist raus, im Kommentar als ISO schreiben.' },
];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist' || entry.startsWith('.')) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (scanExtensions.has(extname(full))) out.push(full);
  }
  return out;
}

const failures = [];

for (const dir of scanRoots) {
  for (const file of walk(join(root, dir))) {
    const text = readFileSync(file, 'utf8');
    const lower = text.toLowerCase();
    for (const rule of banned) {
      let at = lower.indexOf(rule.find);
      while (at !== -1) {
        const line = text.slice(0, at).split('\n').length;
        failures.push({
          file: relative(root, file),
          line,
          found: text.slice(at, at + rule.find.length),
          why: rule.why,
        });
        at = lower.indexOf(rule.find, at + rule.find.length);
      }
    }
  }
}

if (failures.length > 0) {
  console.error('\nWortfilter: gesperrte Woerter gefunden.\n');
  for (const f of failures) {
    console.error(`  ${f.file}:${f.line}  "${f.found}"`);
    console.error(`      ${f.why}`);
  }
  console.error(`\n${failures.length} Treffer. Der Build ist gestoppt.\n`);
  process.exit(1);
}

console.log('Word check passed: no banned platform name, no tool name, no source line.');
