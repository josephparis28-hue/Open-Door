"use strict";

// Browser-only behavior; page text and templates live in script.js.

function initializeChurchForms() {
  const topicLabels = {
    general: "General Questions",
    pastoral: "Pastoral Care",
    ministry: "Ministries",
    events: "Church Events",
    website: "Website Support",
  };

  document.querySelectorAll(".church-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      const data = new FormData(form);
      const type = form.dataset.formType;
      const topic =
        type === "contact"
          ? topicLabels[data.get("topic")] || "General Questions"
          : type === "visit"
            ? "Plan Your Visit"
            : "Prayer Request";
      const config = window.OPEN_DOOR_EMAIL || {};
      const destinations = config.recipients || {};
      const recipient = String(
        destinations[data.get("topic")] ||
          destinations[type] ||
          config.defaultEmail ||
          "",
      ).trim();
      const status = form.querySelector(".form-status");

      status.classList.remove("form-error", "form-success");

      if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
        status.classList.add("form-error");
        status.textContent =
          "The church email address has not been configured yet. Please contact the church through its Facebook page.";
        return;
      }

      const subjectDetail = String(data.get("subject") || "").trim();
      const subject = `[Open Door Church - ${topic}]${subjectDetail ? ` ${subjectDetail}` : ""}`;
      const fields = [
        ["Topic", topic],
        ["Name", data.get("name") || "Not provided"],
        ["Email", data.get("email") || "Not provided"],
        ["Phone", data.get("phone") || "Not provided"],
        ...(type === "visit"
          ? [
              ["Planned visit date", data.get("visitDate") || "Not specified"],
              ["Number of guests", data.get("guests") || "Not specified"],
            ]
          : []),
        ...(type === "prayer"
          ? [["Private request", data.has("confidential") ? "Yes" : "No"]]
          : []),
        ["Message", data.get("message") || ""],
      ];
      const body = fields
        .map(([label, value]) => `${label}: ${value}`)
        .join("\n\n");
      const url = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      status.classList.add("form-success");
      status.textContent =
        "Your email app should open with a prepared message. Please press Send in your email app; nothing has been sent by this website.";
      window.location.href = url;
    });
  });
}

function initSlideshow() {
  clearInterval(slideTimer);
  const root = document.querySelector(".church-slideshow");
  if (!root) return;
  const slides = [...root.querySelectorAll(".church-slide")],
    dots = [...root.querySelectorAll(".slide-dot")];
  let current = 0,
    playing = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const playButton = root.querySelector(".slide-play");
  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === current);
      slide.setAttribute("aria-hidden", String(i !== current));
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === current);
      dot.setAttribute("aria-current", String(i === current));
    });
  }
  function start() {
    clearInterval(slideTimer);
    if (playing) slideTimer = setInterval(() => show(current + 1), 6500);
    playButton.textContent = playing ? "Pause" : "Play";
    playButton.setAttribute(
      "aria-label",
      playing ? "Pause slideshow" : "Play slideshow",
    );
  }
  root.querySelector(".slide-prev").addEventListener("click", () => {
    show(current - 1);
    start();
  });
  root.querySelector(".slide-next").addEventListener("click", () => {
    show(current + 1);
    start();
  });
  dots.forEach((dot, i) =>
    dot.addEventListener("click", () => {
      show(i);
      start();
    }),
  );
  playButton.addEventListener("click", () => {
    playing = !playing;
    start();
  });
  root.addEventListener("mouseenter", () => clearInterval(slideTimer));
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", () => clearInterval(slideTimer));
  root.addEventListener("focusout", (e) => {
    if (!root.contains(e.relatedTarget)) start();
  });
  start();
}

// Divine Presence: one observer, decorative layers only, visible content by default.
function initKingdomMotion() {
  const sectionSelector = [
    ".cinematic-hero", ".kingdom-gallery", ".home-foundation",
    ".scripture-foundation-section", ".page-intro", ".kingdom-banner",
    ".home-heritage", ".home-visit", ".home-media", ".timeline-section", ".heritage-band",
    ".upcoming-events-section", ".service-times-section",
  ].join(", ");
  const sections = [...document.querySelectorAll(sectionSelector)].filter(
    (section) => !section.matches(".home-foundation .scripture-foundation-section")
  );
  const frames = [...document.querySelectorAll(
    ".kingdom-art-card, .section-photo, .kingdom-page-art-frame, .photo-grid figure, .mission-card"
  )];
  const sectionSet = new Set(sections);
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const particles = [[8, 22], [92, 79], [13, 9], [94, 35], [62, 12], [5, 74], [86, 25], [93, 88], [3, 49], [97, 62], [21, 91], [79, 5]];

  sections.forEach((section) => {
    if (section.matches(".cinematic-hero, .kingdom-gallery, .home-foundation, .scripture-foundation-section, .kingdom-banner, .timeline-section, .heritage-band")) {
      section.classList.add("divine-dark");
    }
    const veil = document.createElement("div");
    veil.className = "divine-veil-layer";
    veil.setAttribute("aria-hidden", "true");
    section.prepend(veil);

    if (section.matches(".cinematic-hero, .kingdom-gallery, .home-foundation, .scripture-foundation-section")) {
      const layer = document.createElement("div");
      layer.className = "divine-particle-layer";
      layer.setAttribute("aria-hidden", "true");
      particles.forEach(([x, y], index) => {
        const dot = document.createElement("span");
        dot.style.left = `${x}%`;
        dot.style.top = `${y}%`;
        dot.style.setProperty("--mote-size", `${2 + index % 3}px`);
        dot.style.setProperty("--mote-duration", `${16 + index % 5 * 2}s`);
        dot.style.setProperty("--mote-delay", `${-(index % 6) * 1.4}s`);
        if (index % 4 === 1) dot.classList.add("flow-sparkle");
        layer.append(dot);
      });
      section.prepend(layer);
    }
  });
  document.querySelectorAll(".mission-grid").forEach((grid) => {
    grid.querySelectorAll(".mission-card").forEach((card, index) => {
      card.style.setProperty("--divine-order", index);
    });
  });

  let paused = false;
  try { paused = localStorage.getItem("open-door-effects-paused") === "true"; } catch (_) {}
  let observer;
  const root = document.documentElement;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "divine-motion-toggle";
  button.textContent = "Pause visual effects";
  button.setAttribute("aria-pressed", "false");
  document.querySelector(".footer-bottom")?.append(button);

  function applyMotionPreference() {
    observer?.disconnect();
    root.classList.toggle("divine-paused", paused || motion.matches);
    button.hidden = motion.matches;
    button.setAttribute("aria-pressed", String(paused));
    button.textContent = paused ? "Resume visual effects" : "Pause visual effects";
    if (paused || motion.matches || !("IntersectionObserver" in window)) return;
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add(sectionSet.has(entry.target) ? "divine-in" : "divine-float");
        observer.unobserve(entry.target);
      });
    }, { threshold: .05 });
    [...sections, ...frames].forEach((item) => {
      if (!item.classList.contains("divine-in") && !item.classList.contains("divine-float")) observer.observe(item);
    });
  }
  button.addEventListener("click", () => {
    paused = !paused;
    try { localStorage.setItem("open-door-effects-paused", String(paused)); } catch (_) {}
    applyMotionPreference();
  });
  motion.addEventListener?.("change", applyMotionPreference);
  applyMotionPreference();
}

function initNavigationGroups() {
  const groups = [...document.querySelectorAll(".nav-group")];
  groups.forEach(group => group.addEventListener("toggle", () => {
    if (group.open) groups.filter(other => other !== group).forEach(other => { other.open = false; });
  }));
  document.addEventListener("click", event => {
    groups.filter(group => !group.contains(event.target)).forEach(group => { group.open = false; });
  });
}

function initArtworkViewer() {
  const links = document.querySelectorAll(".art-expand");
  if (!links.length || typeof HTMLDialogElement === "undefined") return;
  const dialog = document.createElement("dialog");
  dialog.className = "royal-art-dialog";
  dialog.setAttribute("aria-labelledby", "royal-art-title");
  dialog.innerHTML = `<button type="button" class="art-close" aria-label="Close artwork">Close ×</button><img alt=""><h2 id="royal-art-title"></h2><p></p>`;
  document.body.append(dialog);
  let opener;
  links.forEach(anchor => anchor.addEventListener("click", event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = anchor;
    const figure = anchor.closest("figure");
    const img = dialog.querySelector("img");
    img.src = anchor.href;
    img.alt = anchor.querySelector("img").alt;
    dialog.querySelector("h2").textContent = figure.querySelector("strong").textContent;
    dialog.querySelector("p").textContent = figure.querySelector("small").textContent;
    dialog.showModal();
    dialog.querySelector("button").focus();
  }));
  dialog.querySelector("button").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => opener?.focus());
}

// Clipboard fallback for browsers without the modern Clipboard API.
function fallbackCopyAddress() {
  const input = document.createElement("textarea");
  input.value = CHURCH_ADDRESS;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.append(input);
  input.select();
  try {
    return document.execCommand("copy");
  } finally {
    input.remove();
  }
}

function initCopyAddress() {
  document.querySelectorAll(".copy-address").forEach((button) => {
    button.hidden = false;
    button.addEventListener("click", async () => {
      const status = button.parentElement.querySelector(".copy-status");
      let copied = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(CHURCH_ADDRESS);
          copied = true;
        }
      } catch (_) {
        // A denied clipboard permission can still allow the legacy fallback.
      }
      if (!copied) {
        try { copied = fallbackCopyAddress(); } catch (_) { /* show manual alternative */ }
      }
      status.textContent = copied
        ? "Address copied."
        : `Copy this address manually: ${CHURCH_ADDRESS}`;
      button.focus({ preventScroll: true });
    });
  });
}

function route() {
  const relativePath = location.pathname.slice(SITE_BASE.length);
  const segment = relativePath.split("/").filter(Boolean)[0];
  const page = !segment || segment === "index.html" ? "home" : segment;
  const validPage = Object.prototype.hasOwnProperty.call(pages, page)
    ? page
    : "home";
  // Preserve the pre-rendered HTML and its anchors; initialize interactions only.
  if (!document.querySelector("#app #main")) {
    document.getElementById("app").innerHTML =
      `${header(validPage)}<main id="main" tabindex="-1">${pages[validPage]()}</main>${footer(validPage)}`;
  }
  initSlideshow();
  initKingdomMotion();
  initArtworkViewer();
  initNavigationGroups();
  initCopyAddress();
  initializeChurchForms();
  document.title =
    document.querySelector("title")?.textContent || "Open Door Church";
  const menu = document.querySelector(".menu-toggle");
  document.documentElement.classList.add("navigation-ready");
  menu.addEventListener("click", () => {
    const expanded = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", String(!expanded));
    menu.setAttribute(
      "aria-label",
      expanded ? "Open navigation" : "Close navigation",
    );
    document.getElementById("primary-nav").classList.toggle("open", !expanded);
  });
  document.getElementById("primary-nav").addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menu.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-label", "Open navigation");
      document.getElementById("primary-nav").classList.remove("open");
    }
  });
  menu.closest(".site-header").addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      menu.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-label", "Open navigation");
      document.getElementById("primary-nav").classList.remove("open");
      const openGroup = e.target.closest("details[open]");
      if (openGroup) { openGroup.open = false; openGroup.querySelector("summary").focus(); }
      else if (menu.offsetWidth) menu.focus();
    }
  });
  if (!window.location.hash) {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }
}
if (typeof document !== "undefined") {
  document.addEventListener("click", (event) => {
    const topLink = event.target.closest(".back-to-top");
    if (topLink) {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
      document.querySelector("#main")?.focus({ preventScroll: true });
    }
  });
  route();
}
