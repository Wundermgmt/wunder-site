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

  Cleared exceptions live in scripts/allowed-phrases.txt, one phrase per line,
  with the reason on the same line after a double slash. Everything else fails
  the build with the file, the line and the offending text.
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
];

// Rule 3. Long dashes are forbidden in every text under Manuel's name.
const longDashes = [
  { char: '—', name: 'em dash' },
  { char: '–', name: 'en dash' },
];

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
