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

## Was hier Platzhalter ist

- Alle drei Record-Cards. Inhalt kommt aus einem Portal-Auszug, nicht aus dem Kopf.
- Alle Bilder. `Placeholder.astro` liefert Inline-SVG, bis schriftliche
  Bildfreigaben vorliegen.
- Impressum und Datenschutz. Struktur steht, jede offene Stelle ist im Text mit
  `TO BE COMPLETED BY COUNSEL` markiert.
- Umsatzsteuer-Identifikationsnummer in `src/site.ts`.
- Konditionen auf `/` und `/faq`: haengen an Entscheidung 1 und 2 aus Konzept 8.4.
