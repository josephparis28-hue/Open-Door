# Open Door Church

**Rooted in Truth. Equipped to Win.**  
*A legacy of faith. A future of purpose.*

Established November 1926 · 1926–Present  
402 W Oklahoma St, Pampa, TX 79065

[Official Facebook page](https://www.facebook.com/share/1DZhR4D1Pu/?mibextid=wwXIfr)

## About this website

The official church website provides information about Open Door Church, its history, biblical beliefs, vision and mission, ministries, events, worship services, giving and visitor information. Its four guiding principles are Imagine, Innovate, Initiate and Investigate.

This repository contains a static HTML, CSS and JavaScript website. GitHub Pages is the current hosting platform; Cloudflare Pages is the planned future platform. No Java server, running Node.js server, database or paid backend is required for the existing website. Node.js and Python are development tools only.

**Content policy:** Preserve the church's approved wording, capitalization, punctuation, Scripture references and page-specific text. Do not rewrite church content or publish unconfirmed details without approval. Make permanent changes in the source templates rather than only in generated HTML.

## Website pages

| Page file | Purpose |
| --- | --- |
| `index.html` | Home: welcome, worship, service times, events, church history and mission |
| `about/index.html` | Church history and centennial heritage |
| `beliefs/index.html` | What We Believe |
| `vision/index.html` | Vision & Mission and Winner’s Mindset |
| `ministries/index.html` | Ministry information and opportunities to connect |
| `events/index.html` | Events & Announcements |
| `sermons/index.html` | Sermons & Media and Facebook link |
| `visit/index.html` | Plan Your Visit, directions, service times and visitor form |
| `giving/index.html` | Tithes & Giving, Scripture and future Tithely integration |
| `contact/index.html` | Contact Open Door, messages and prayer requests |

All ten pages are generated from `script.js` and `seo-pages.json`.

## File reference

| File or folder | Role and maintenance |
| --- | --- |
| `script.js` | Master content, reusable templates, navigation, footer, slideshow, artwork, forms and Facebook links. Edit approved wording and behavior here; rebuild afterward. |
| `styles.css` | Shared colors, typography, responsive layouts, accessibility styles and animations. Edit for design changes; no rebuild required. |
| `email-config.js` | Public receiving email addresses and optional topic routing. No rebuild required. Never put credentials here. |
| `assets/favicon.svg` | Browser tab icon. |
| `assets/images/` | Five main WebP church images. Replace an image using the same filename or update its references in the source. |
| `assets/images/kingdom/` | Kingdom of Heaven artwork, both collections and scene variants. Collection 1 appears in the homepage gallery; other artwork supports page banners. |
| `seo-pages.json` | Page titles and search descriptions. Rebuild after edits. |
| `build-seo.js` | Node.js generator for ten HTML pages, canonical URLs, social metadata, Church JSON-LD, sitemap and robots file. |
| `format-html.py` | Optional readable HTML formatting; requires Beautiful Soup 4. |
| `validate.py` | Python static checks of internal links, anchors and referenced files. |
| `sitemap.xml` | Generated public URLs for search engines. |
| `robots.txt` | Generated crawler instructions and sitemap URL. |
| `404.html` | Custom not-found page; its homepage link is generated from SITE_PATH. |
| `.nojekyll` | Empty marker to bypass Jekyll on GitHub Pages. Keep it. |
| `.github/workflows/validate.yml` | GitHub Actions syntax, build and link checks on pushes and pull requests. It does not deploy the site or compare approved wording. |
| `README.md` | This project and maintenance guide. |

### Main image files

`church-exterior.webp` (exterior), `welcome-area.webp` (welcome area), `sanctuary.webp` (sanctuary), `pulpit.webp` (pulpit), and `worship-hero.webp` (main worship image). Keep all images under `assets/images/` and preserve filename capitalization.

## Local development in VS Code

1. Extract the website package or clone the repository: using the repository’s Code menu.
2. Open the folder containing the root `index.html` in VS Code.
3. Install the Live Server extension if needed. Right-click the root `index.html` and select **Open with Live Server**.
4. Preview navigation, images and forms. Use a local HTTP server rather than opening HTML through `file://`.

Generated HTML uses relative paths; JavaScript detects its base from the script URL. No path edits are needed for normal local preview. Production canonical metadata remains pointed at the selected public host.

### Rebuild and validate (Windows PowerShell)

Install Node.js and Python for maintenance. For optional formatting, install Beautiful Soup with `python -m pip install beautifulsoup4`.

```powershell
node --check script.js
node --check build-seo.js
node build-seo.js
python format-html.py
python validate.py
```

```vscode editor
node --check script.js
node --check build-seo.js
node build-seo.js
python -X utf8 format-html.py
python -X utf8 validate.py
```

The default build uses the /Open-Door project path without a hardcoded public hostname. If you previously set `SITE_URL` or `SITE_PATH` in the terminal, remove those overrides before a GitHub build:

```powershell
Remove-Item Env:SITE_URL, Env:SITE_PATH -ErrorAction SilentlyContinue
```

Review the generated HTML changes before committing. A build can overwrite direct HTML edits. CSS and email configuration edits do not require regeneration. The static validator does not test third-party destinations, actual browser interactions, email delivery or accessibility compliance.

## Church content maintenance

### Service times and events

Edit `SERVICE_SCHEDULE` and `UPCOMING_EVENTS` near the top of `script.js`. Blank times display “Time to be announced.” Use confirmed days, names and times only. An empty event array displays the existing announcement placeholder. Event entries use `title`, `date` (YYYY-MM-DD), `time`, `location` and `description`; the shared events section shows up to three dated entries. Rebuild after changes.

### Church history, beliefs, mission and Scripture

Edit the relevant entry in `pages`, shared content arrays, `scriptureFoundations`, or `missionScriptures()` in `script.js`. Some text intentionally differs by page; preserve those differences. Review the affected pages after rebuilding.

### Contact, visitor and prayer forms

Set the verified church inbox in `email-config.js`. Optional recipient keys are `general`, `pastoral`, `ministry`, `events`, `website`, `visit` and `prayer`. Missing topic addresses fall back to the configured form-type or default inbox. All addresses are public. The default address is currently blank.

The forms prepare a `mailto:` message in the visitor's email application. The visitor must press Send; the website does not send or store the message or confirm delivery. Do not collect sensitive medical or financial details. The private-request checkbox does not guarantee confidentiality. There is no server-side spam protection. Test using a non-sensitive test message and a configured email app. Automatic submission would require a separately implemented backend or form service.

### Sermons and media

Watch services through the official [Facebook page](https://www.facebook.com/share/1DZhR4D1Pu/?mibextid=wwXIfr). The website does not maintain a recording library or upload videos.

### Giving and other integrations

Tithely is planned but the verified giving URL is pending. Update the Giving template in `script.js` only after receiving the official link; rebuild and test. Never collect card or banking details in the church forms. Confirm service times, contact information, ministries, events and any official YouTube/live-stream links before publishing. The existing Facebook link is already included.

## Publish now: GitHub Pages

1. Build and validate using the default GitHub settings above.
2. Commit the source files and generated pages together, including assets, `.nojekyll` and the validation workflow. Keep the root `index.html` at the repository root.
3. In GitHub repository **Settings → Pages**, use **Deploy from a branch**, `main`, `/ (root)`.
4. Push changes to `main` (or merge a reviewed pull request). Check Actions and Pages deployment status.
5. Visit the URL shown in Settings → Pages and test the published pages.

A sitemap is generated only when SITE_URL is configured. Submit the resulting sitemap to Search Console if configured.

## Future migration: Cloudflare Pages

Use Cloudflare **Pages** for the existing static site, not a Java server. You can connect the GitHub repository or upload prebuilt static files. No Workers, D1 or R2 resources are needed for the current functionality.

### Prepare the production files

Once the actual Cloudflare Pages hostname or custom domain is confirmed, rebuild with its HTTPS origin and an empty site path. Example PowerShell commands (replace the example domain with the real hostname):

```powershell
$env:SITE_URL = 'https://your-confirmed-domain.example'
$env:SITE_PATH = ''
node build-seo.js
python format-html.py
python validate.py
```

Use a modern PowerShell version that preserves empty environment variables (PowerShell 7.5+), or use the following command in Command Prompt to explicitly set an empty path for the Node build via Node itself:

```cmd
node -e "process.env.SITE_PATH=''; process.env.SITE_URL='https://your-confirmed-domain.example'; require('./build-seo.js')"
```

For root-path validation in environments that cannot preserve an empty variable, run `python -c "import os,runpy; os.environ['SITE_PATH']=''; runpy.run_path('validate.py',run_name='__main__')"`.

The generator updates the 404 home link from SITE_PATH. Verify canonical URLs, social images, sitemap and robots file point to the new domain. Do not publish the example domain.

### Deployment options

- **Git integration:** Connect the repository to a Cloudflare Pages project, select the production branch, use no framework preset, and publish the prebuilt static files. If using an automated build instead, configure `SITE_URL` and an explicitly empty `SITE_PATH` and use `node build-seo.js`; verify the output metadata. Keep GitHub production files separate if both hosts remain active with different canonical URLs.
- **Direct upload:** Create a clean publish folder containing the ten generated HTML pages (with their folders), `404.html`, `styles.css`, `script.js`, `email-config.js`, `assets/`, `sitemap.xml` and `robots.txt`. Upload the contents through the Pages direct-upload workflow. The README, Python scripts, generator, SEO source JSON and GitHub workflow are not required at runtime.

Test the Pages hostname first, then configure the confirmed custom domain in the Pages project and verify DNS and HTTPS. Rebuild for the final domain if it differs from the preview hostname. Submit the new sitemap and decide how to retire or redirect the old GitHub address. Keep the existing site online until the new deployment is verified. Cloudflare setup and migration have not yet been performed.

## Release checklist

- [ ] Confirm all public church wording and Scripture references remain approved.
- [ ] Verify service times, event details, contact information and external links.
- [ ] Run JavaScript syntax checks, rebuild if needed and validate internal references.
- [ ] Test desktop and mobile navigation, slideshow, artwork, keyboard controls and Back to top.
- [ ] Test the Facebook link, form preparation and giving links when configured.
- [ ] Check accessibility, contrast, screen-reader behavior and page performance.
- [ ] Verify the deployed hostname, canonical URLs, sitemap and custom 404 page.
- [ ] Keep a Git commit or backup of the last working release.

## Design and stewardship

The website uses Cinzel headings and Lato body text, with Deep Teal `#164C52`, Muted Teal `#478487`, Moran Brown `#82583F`, Warm Linen `#EEE6D9` and Antique Brass `#B89A55`. Preserve the existing church photography, Scripture-inspired artwork and approved design unless changes are authorized. Obtain permission before publishing identifiable photographs or personal information. Do not commit passwords, API keys or private prayer requests.

Website content and church materials should be used with the church's authorization. No open-source license is asserted by this README.
## Portable hosting and artwork

Edit `KINGDOM_PAGE_ART` in `script.js` to select decorative artwork for the Scripture sections. Existing text, photographs and banners remain in place. Rebuild after changes.

No personal hosting address is embedded by default. Without SITE_URL, absolute canonical/social URL metadata and sitemap.xml are omitted. Set SITE_URL to the actual HTTPS origin and SITE_PATH to the deployment prefix (empty for a root domain) when ready to publish domain-specific SEO. The 404 home link uses SITE_PATH; rebuild for the selected host.
