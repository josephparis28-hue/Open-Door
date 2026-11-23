# Open Door Church — Email App Edition

This edition preserves the existing Kingdom of Heaven website, its two artwork sets, and all ten HTML pages. It replaces server-based form submission with a `mailto:` workflow that opens the visitor's own email app.

## Configure receiving email

Open `email-config.js` and enter the church's receiving address as `defaultEmail`. Example:

```javascript
window.OPEN_DOOR_EMAIL = {
  defaultEmail: 'office@yourchurch.org',
  recipients: {}
};
```

Optional: add specific topic recipients using keys `general`, `pastoral`, `ministry`, `events`, `website`, `visit`, and `prayer`. If a topic address is missing, the default inbox receives it. **Email addresses in this file are publicly visible.**

## How it works

A visitor fills out a Contact, Plan Your Visit, or Prayer form. The browser prepares an email with the selected topic in the subject line and form details in the body, then opens the visitor's default mail application. **The visitor must manually press Send.** The website cannot confirm delivery and cannot send email automatically without a backend or external form service.

This works with any static web host, including GitHub Pages or Cloudflare Pages static upload. No Worker, Resend account, Turnstile, or secret is required. The visitor must have an email application or mailto handler configured. Some devices and browsers may not open a composer; users can use the church's Facebook link instead.

## Privacy

Do not treat mailto as secure or confidential storage. Email delivery and inbox access depend on the visitor's email provider and the church's email account. Avoid requesting sensitive health information. There is no server-side spam protection or rate limiting in this edition.

## Rebuild pages

After editing `script.js`, run `node build-seo.js` to regenerate the ten static HTML pages. Editing `email-config.js` does not require rebuilding.

## Publishing

Upload the contents of this folder to any static host. Set your verified domain in `SITE_URL` when rebuilding for production. Test all topics on desktop and mobile before sharing the website.


## Edit church service times

Open `script.js` and find the `SERVICE_SCHEDULE` array near the top.
Replace the empty `time` strings with confirmed times, and edit the
`day` and `name` fields to match the actual church schedule. You may add
or remove entries. Blank times display **Time to be announced**.

Example (illustration only, not the church's confirmed schedule):

```javascript
{ day: 'Sunday', name: 'Sunday Worship', time: '10:30 AM' }
```

After editing, run `node build-seo.js` in the website folder to regenerate
all ten static HTML pages. The service schedule appears on **Home** and
**Plan Your Visit**. The site's direct-to-email forms remain unchanged.


## SEO, accessibility, and interaction upgrade (November 2026)

- All 10 pages have pre-rendered semantic HTML, unique titles/descriptions, Open Graph/Twitter metadata, and Church JSON-LD.
- The current navigation link uses `aria-current="page"`, a distinct brass indicator, and clear hover/focus feedback.
- Focus outlines, keyboard navigation, form status feedback, 44px touch targets for main mobile controls, and reduced-motion preferences have additional CSS coverage.
- `mailto:` forms still require an address in `email-config.js`, a configured email app, and the visitor pressing Send.
- **Domain-dependent SEO:** When the final HTTPS domain is known, run `SITE_URL=https://your-real-domain.example node build-seo.js` to generate canonical links, absolute sharing images, robots sitemap pointer, and `sitemap.xml`. Do not use the example domain in production.
- **Verification still required:** Run real-browser mobile/desktop testing, screen-reader testing, automated WCAG/contrast audits, check real links, and submit sitemap in Google Search Console after deployment. These steps cannot be established by static source inspection alone.
- Service times are editable in `SERVICE_SCHEDULE` at the top of `script.js`; run `node build-seo.js` after editing to update static HTML.


## New visual page upgrade
Ministries, Events, and Giving now have Scripture-inspired artwork banners, responsive content cards, and clear next-step links. These pages intentionally do not invent ministry names, dates, giving providers, or payment links. To update their wording, edit the corresponding `pages` entry in `script.js`, then run `node build-seo.js` and `python format-html.py`. The church email and service times still require confirmation.


## Scripture foundation update
Each of the 10 pages now includes three KJV Scripture references with thematic explanations and selected short quotations. The Vision page additionally includes a four-card Scripture foundation for Imagine, Innovate, Initiate, and Investigate. The Giving page retains the three full KJV passages already present, and now has a consistent reference section as well. The Tithely link remains pending and is not presented as active. To edit passages, update `scriptureFoundations` and `missionScriptures()` in `script.js`, then run `node build-seo.js` and `python format-html.py`.


## Upcoming Events (Homepage and Events Page)

The homepage and Events page now share an editable Upcoming Events section.
Edit `UPCOMING_EVENTS` near the top of `script.js` to add confirmed event dates, titles, times, locations, and descriptions. Leave it as `[]` to show a clear “Events will be announced here” message without inventing events. The homepage shows up to three entries.

Example:
```javascript
const UPCOMING_EVENTS = [
  {
    title: 'Church Fellowship',
    date: '2027-01-17',
    time: '6:00 PM',
    location: 'Church fellowship hall',
    description: 'Join us for fellowship.'
  }
];
```

After editing, run `node build-seo.js` and `python format-html.py` to regenerate static HTML.


## Homepage artwork update and source formatting

- The homepage gallery displays **Collection 1 only** (six artworks).
- All nine Collection 2 panels and their scene variants remain in `assets/images/kingdom/` for use on About, Ministries, Events, Giving, and future pages.
- `script.js` retains all 15 `kingdomScenes` metadata entries so Collection 2 can be reused without reimporting images.
- HTML pages are regenerated as readable, indented markup with `python format-html.py`.
- Source files are editable plain HTML, CSS, and JavaScript, not minified bundles. Some JavaScript HTML templates are kept as template literals so the existing site generator continues to work.
- After modifying `script.js`, run `node build-seo.js` followed by `python format-html.py`.


## GitHub Pages project path

This package is configured for `https://josephparis28-hue.github.io/Open-Door/`.
The JavaScript links and image URLs and CSS background image use `/Open-Door/` so they load correctly on GitHub Pages.
To regenerate the ten static HTML pages, run `node build-seo.js` then `python format-html.py`.
If you move the site to a custom root domain, change `SITE_BASE` in `script.js` and the CSS background URL.
