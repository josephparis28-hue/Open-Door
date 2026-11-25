"use strict";
// Generate crawlable HTML for every page. Run: node build-seo.js
// Optional: SITE_URL=https://your-confirmed-domain.org node build-seo.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = __dirname;
const pages = JSON.parse(
  fs.readFileSync(path.join(root, "seo-pages.json"), "utf8"),
);
const source = fs.readFileSync(path.join(root, "script.js"), "utf8");
const sitePath = process.env.SITE_PATH ?? "/Open-Door";
if (!/^(?:\/[A-Za-z0-9_-]+)*$/.test(sitePath)) throw Error("Invalid SITE_PATH");
const context = vm.createContext({ BUILD_BASE: "/__SITE_ROOT__" });
vm.runInContext(
  source.replace(/document\.addEventListener\('click',[\s\S]*$/, "") +
    '\n globalThis.staticRender = id => header(id) + `<main id="main" tabindex="-1">` + pages[id]() + `</main>` + footer(id);',
  context,
);
const base = (
  process.env.SITE_URL || "https://josephparis28-hue.github.io"
).replace(/\/$/, "");
if (base && !/^https:\/\/[^/]+$/.test(base))
  throw Error(
    "SITE_URL must be a complete HTTPS origin, e.g. https://example.org",
  );
const escape = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
for (const [slug, [title, description]] of Object.entries(pages)) {
  const isHome = slug === "home";
  const dir = isHome ? root : path.join(root, slug);
  fs.mkdirSync(dir, { recursive: true });
  const prefix = isHome ? "" : "../";
  const pathname = isHome ? `${sitePath}/` : `${sitePath}/${slug}/`;
  const url = base ? base + pathname : null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: "Open Door Church",
    description: "Christian church established in November 1926.",
    foundingDate: "1926-11",
    address: {
      "@type": "PostalAddress",
      streetAddress: "402 W Oklahoma St",
      addressLocality: "Pampa",
      addressRegion: "TX",
      postalCode: "79065",
      addressCountry: "US",
    },
    hasMap:
      "https://www.google.com/maps/search/?api=1&query=402%20W%20Oklahoma%20St%2C%20Pampa%2C%20TX%2079065",
    sameAs: ["https://www.facebook.com/share/1DZhR4D1Pu/?mibextid=wwXIfr"],
    ...(base ? { url: base + sitePath + "/" } : {}),
  };
  const html = `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="theme-color" content="#164C52">\n<title>${escape(title)}</title>\n<meta name="description" content="${escape(description)}">\n<meta name="robots" content="index,follow,max-image-preview:large">\n<meta property="og:type" content="website">\n<meta property="og:site_name" content="Open Door Church">\n<meta property="og:title" content="${escape(title)}">\n<meta property="og:description" content="${escape(description)}">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${escape(title)}">\n<meta name="twitter:description" content="${escape(description)}">\n${url ? `<link rel="canonical" href="${escape(url)}">\n<meta property="og:url" content="${escape(url)}">\n<meta property="og:image" content="${escape(base + sitePath + "/assets/images/church-exterior.webp")}">\n<meta name="twitter:image" content="${escape(base + sitePath + "/assets/images/church-exterior.webp")}">` : ""}\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Lato:wght@400;500;700;900&display=swap" rel="stylesheet">\n<link rel="icon" href="${prefix}assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${prefix}styles.css?v=4">\n<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>\n<script src="${prefix}email-config.js" defer></script>

<script src="${prefix}script.js?v=4" defer></script>\n</head>\n<body>\n<a class="skip-link" href="#main">Skip to content</a>\n<div id="app">${context.staticRender(slug).replaceAll("/__SITE_ROOT__/", prefix || "./")}</div>\n</body>\n</html>\n`;
  fs.writeFileSync(path.join(dir, "index.html"), html);
}
fs.writeFileSync(
  path.join(root, "robots.txt"),
  `User-agent: *\nAllow: /\n${base ? `Sitemap: ${base}${sitePath}/sitemap.xml\n` : ""}`,
);
if (base) {
  const entries = Object.keys(pages)
    .map(
      (s) =>
        `  <url><loc>${base}${sitePath}${s === "home" ? "/" : "/" + s + "/"}</loc></url>`,
    )
    .join("\n");
  fs.writeFileSync(
    path.join(root, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`,
  );
} else if (fs.existsSync(path.join(root, "sitemap.xml")))
  fs.unlinkSync(path.join(root, "sitemap.xml"));
console.log(
  `Built ${Object.keys(pages).length} SEO-ready pages${base ? " with canonical URLs and sitemap" : " (domain-dependent tags deferred)"}.`,
);
