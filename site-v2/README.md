# site-v2

Neubau von wundermgmt.com nach `~/manuel-os/projects/wunder-website/04-konzept.md`.
Astro, statisch, kein Client-Framework, keine Cookies, keine Third-Party-Fonts.

Der bestehende Stand im Repo-Wurzelverzeichnis bleibt unangetastet. Nichts an
Squarespace, DNS oder Render wurde geaendert.

## Lokal starten

```bash
cd site-v2
npm install
npm run dev      # http://localhost:4321
npm run build    # Copy-Check plus statischer Build nach dist/
npm run preview  # dist/ lokal ausliefern
```

## Umgebungsvariablen

| Variable | Standard | Zweck |
|---|---|---|
| `FORM_ENDPOINT` | leer | Ziel des Bewerbungsformulars. Leer bedeutet: Formular rendert deaktiviert. Kein Apps Script, kein Endpunkt im Repository. |
| `PUBLIC_PLAUSIBLE_DOMAIN` | leer | Schaltet cookielose Statistik ein. Leer bedeutet: kein Skript, kein Consent-Banner. |

Beide Werte gehoeren in die Umgebung des Hosters, niemals ins Repository.

## Copy-Check

`npm run build` ruft zuerst `scripts/check-copy.mjs`. Der Lauf bricht ab bei:

1. gesperrten Verkaufsaussagen (`insider`, `guarantee`, `no contracts`, `top 0.1`,
   `world's`, `leading`, `never lost`)
2. nackten Prozentwerten und Groessenordnungen ausserhalb von `Figure` und `RecordCard`
3. Gedankenstrichen im Textbestand
4. Record-Cards mit leerem Pflichtfeld

Freigegebene Ausnahmen stehen mit Begruendung in `scripts/allowed-phrases.txt`.
Eine Zeile dort ist eine Textentscheidung, keine technische.

## Zahlen und Belege

Zwei Schloesser, beide muessen passieren:

1. Das Schema in `src/content.config.ts` verlangt fuer jede Record-Card
   `baseline`, `period`, `whatWeDid`, `whatHappened`, `whatDidNotWork`, `source`,
   `readAt`. Fehlt eines, scheitert der Astro-Build.
2. `src/components/RecordCard.astro` prueft dieselben Felder noch einmal zur
   Bauzeit und wirft mit Feldnamen.

`src/components/Figure.astro` ist das gleiche Prinzip fuer eine einzelne Zahl im
Fliesstext (`value`, `period`, `basis`, `source`, `readAt`). Noch nicht im
Einsatz, weil heute keine Zahl alle fuenf Angaben traegt.

## SEO und Social-Share

- `astro.config.mjs` bindet `@astrojs/sitemap`. Der Build erzeugt
  `dist/sitemap-index.xml` und `dist/sitemap-0.xml`. Impressum, Datenschutz und
  die Bestaetigungsseite `/apply/thank-you` bleiben ausgeschlossen (`noindex`
  in `Base.astro`, gleicher Filter im Sitemap-Integration-Aufruf).
- `robots.txt` verweist auf `/sitemap-index.xml`.
- `Base.astro` setzt og:title, og:description, og:image, og:url, twitter:card
  und den canonical Link auf jeder Seite. Das og:image ist
  `public/og-image.png`, 1200x630, selbst erzeugt aus den Design-Tokens und
  der Anton-Schrift, die hier schon liegt. Kein KI-Bild, kein Stockfoto.
- Favicon: `public/favicon.ico`, `favicon-32.png` und `apple-touch-icon.png`,
  gleiche Herkunft wie das og:image, ein "W" in der Akzentfarbe.

## Was hier Platzhalter ist

- Alle drei Record-Cards. Inhalt kommt aus einem Portal-Auszug, nicht aus dem Kopf.
- Alle Bilder im Seiteninhalt. `Placeholder.astro` liefert Inline-SVG, bis
  schriftliche Bildfreigaben vorliegen. Favicon und og:image sind keine
  Platzhalter, siehe oben.
- Impressum und Datenschutz. Struktur steht, jede offene Stelle ist im Text mit
  `TO BE COMPLETED BY COUNSEL` markiert. Der Live-Auftritt unter
  kgmodelmanagement.com/imprint liefert kein zusaetzliches Fakteninventar,
  dort steht nur ein generischer Datenschutz-Generator-Text ohne USt-ID,
  Telefonnummer oder Registerangaben.
- Umsatzsteuer-Identifikationsnummer in `src/site.ts`.
- Konditionen auf `/` und `/faq`: haengen an Entscheidung 1 und 2 aus Konzept 8.4.
- AGB/Terms-Seite: nicht gebaut. Es gibt keinen freigegebenen oeffentlichen
  Vertragstext, der eigentliche Vertrag ist ein privates, individuell
  unterschriebenes Dokument. Mit Entscheidung 1 und 2 oben kommt der Inhalt
  fuer eine Terms-Seite erst zustande.
- Cookie-Consent: nicht gebaut. Die Seite setzt keine Cookies, Plausible laeuft
  cookielos und ist per Default aus. Kein Consent-Banner noetig, solange das
  so bleibt.
