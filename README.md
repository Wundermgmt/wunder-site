# wundermgmt.com — main marketing site

The public Wunder Management website. Static files only — no build step, no server,
no cookies, no analytics. Same deploy pattern as `wunder-careers-site`.

Replaces the old Squarespace site (rebuilt 2026-08-21). The old site's pages were
mostly fluff; this one is 3 indexed pages plus legal.

## Pages

| Path | What it is |
|---|---|
| `/` | Everything: hero, stats, the 4 proof videos, what we do, who it's for, how it works, FAQ |
| `/results/` | The 4 creator proof videos (kept at the old URL — it was indexed) |
| `/apply/` | Qualify form only (name, phone, IG, OF, WhatsApp). Submit opens mailto:info@wundermgmt.com. Calendly and Book a call are gone. |
| `/imprint/`, `/privacy/` | Legal (KG Models SIA), noindex |
| `render.yaml` | Render static-site blueprint, incl. 301s for every URL in the old Squarespace sitemap |

## Content sources

- Copy: rewritten from the old site's own claims (stats, guarantees, requirements).
  Nothing invented. The revenue split is deliberately NOT on the site — terms are
  covered after you apply.
- Videos: downloaded from the old site's Squarespace CDN (their signed HLS URLs
  expire), re-encoded to 720p H.264, self-hosted in `assets/video/`.
- Fonts: Anton + Epilogue, self-hosted woff2 (GDPR: no Google Fonts requests).
- robots.txt: deliberately open to all crawlers, AI bots included. The old
  Squarespace robots.txt blocked ~30 AI crawlers by platform default; we opened
  it because AI search is a discovery channel. Reverse in robots.txt if unwanted.
- Videos have no subtitle tracks (WCAG 1.2.2 gap, same as the old site).
  Follow-up: generate .vtt captions from real transcripts, never fabricated.

## Deploying

1. Render dashboard → New → Blueprint → pick this repo. That creates the
   `wunder-site` static service from `render.yaml`.
2. Verify on the `.onrender.com` URL.
3. Add the custom domain `wundermgmt.com` (+ `www`) to the service and switch
   DNS at the registrar per Render's instructions.
4. After DNS: submit `https://wundermgmt.com/sitemap.xml` in Google Search Console.

## Cutover checklist (before killing Squarespace)

- [ ] The 3 Zapier zaps fire on Squarespace form submissions (Inbound stage 40 +
      email to rg@). The new site apply page is a form that opens a mailto to
      info@. Confirm that path covers what the zaps did, or accept the change
      knowingly.
- [ ] Any ads/bio links pointing at `/workshop`, `/influencer`, `/call` etc. keep
      working via the 301s in `render.yaml` — spot-check the ones in use.
- [ ] Keep the Squarespace subscription until DNS has fully switched.
