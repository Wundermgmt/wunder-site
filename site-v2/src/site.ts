/*
  One place for the facts that repeat on every page.
  Legal entity data: 04-konzept.md section 4.3 (/company, /imprint) and
  00-faktenbasis-intern.md section 1.
*/

export const legal = {
  brandLine: 'Wunder is a brand by KG Models SIA',
  company: 'KG Models SIA',
  regNumber: '50203451401',
  registered: '3 January 2023',
  street: 'Vaļņu iela 5-6',
  city: 'Riga LV-1050',
  country: 'Latvia',
  // Placeholder. The VAT identification number is not documented in the
  // fact base and has to come from Manuel or Lauris before the site goes live.
  vatId: 'PLACEHOLDER_VAT_ID',
  contactEmail: 'info@wundermgmt.com',
  privacyEmail: 'privacy@wundermgmt.com',
  /*
    Ziel des Bewerbungsformulars, Ansage Manuel 07.09.2026 abends: Ralfs.
    Adresse am 07.09.2026 gegen aspmx.l.google.com geprueft, RCPT TO wurde mit
    250 angenommen, eine erfundene Adresse auf derselben Domain mit 550
    abgelehnt. Das Postfach existiert also und es gibt kein Catch all.
  */
  applyRecipient: 'rg@wundermgmt.com',
} as const;

export const cta = {
  primary: 'Apply for a vibe check',
  primaryHref: '/apply',
  secondary: 'See how it works',
  secondaryHref: '/how-it-works',
} as const;

/*
  Application form target. Set FORM_ENDPOINT in the host environment.
  Empty by default on purpose: no Google Apps Script, no open endpoint in the
  repository (04-konzept.md section 6.3). With no endpoint the form renders in a
  disabled state instead of posting somewhere unintended.

  Die Empfaengeradresse steht oben in legal.applyRecipient. Offen bleibt, welcher
  Formulardienst die Zustellung uebernimmt, ein Static Site auf Render kann
  selbst keine Mail versenden. TODO vor dem Livegang.
*/
export const formEndpoint: string = import.meta.env.FORM_ENDPOINT ?? '';

/*
  Cookieless analytics, optional. Set PUBLIC_PLAUSIBLE_DOMAIN to switch it on.
  No cookies, no cross site identifiers, therefore no consent banner
  (04-konzept.md section 6.4).
*/
export const plausibleDomain: string = import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN ?? '';
