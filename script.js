'use strict';

/* Internal routes are functional. External destinations are intentionally not connected yet. */
const NAV = [
  ['home', 'Home'], ['about', 'About'], ['beliefs', 'Beliefs'],
  ['vision', 'Vision & Mission'], ['ministries', 'Ministries'],
  ['events', 'Events'], ['sermons', 'Sermons'], ['visit', 'Plan Your Visit'],
  ['giving', 'Giving'], ['contact', 'Contact']
];
const IMAGES = {
  hero: '/assets/images/worship-hero.webp', exterior: '/assets/images/church-exterior.webp',
  welcome: '/assets/images/welcome-area.webp', sanctuary: '/assets/images/sanctuary.webp',
  pulpit: '/assets/images/pulpit.webp'
};
const link = (page, label, cls = '', current = false) => `<a class="${cls}" href="${page === 'home' ? '/' : '/' + page + '/'}"${current ? ' aria-current="page"' : ''}>${label}</a>`;
const image = (src, alt, cls = '', eager = false) => `<img class="${cls}" src="${src}" alt="${alt}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
const eyebrow = text => `<p class="eyebrow">${text}</p>`;
const intro = (kicker, title, desc) => `<div class="page-intro container">${eyebrow(kicker)}<h1>${title}</h1><p class="lead">${desc}</p></div>`;
const unavailable = label => `<span class="coming-soon" aria-label="${label} link to be added">${label} <small>Coming soon</small></span>`;

// EDIT SERVICE TIMES HERE. Leave times blank until they are confirmed.
// Add or remove entries as needed. Example time format: '10:30 AM'.
const SERVICE_SCHEDULE = [
  { day: 'Sunday', name: 'Sunday Worship', time: '' },
  { day: 'Wednesday', name: 'Midweek Bible Study', time: '' }
];

// EDIT UPCOMING EVENTS HERE. Keep the array empty until dates are confirmed.
// Example: { title: 'Church Fellowship', date: '2027-01-17', time: '6:00 PM', location: 'Church fellowship hall', description: 'Join us for fellowship.' }
const UPCOMING_EVENTS = [];

function upcomingEventsSection() {
  const visibleEvents = UPCOMING_EVENTS
    .filter(event => event && event.title && event.date)
    .slice()
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
    .slice(0, 3);

  return `
    <section class="section upcoming-events-section" aria-labelledby="upcoming-events-title">
      <div class="container">
        <div class="upcoming-events-header">
          <div>
            ${eyebrow('Gather with us')}
            <h2 id="upcoming-events-title">Upcoming Events</h2>
            <p>Join us for worship, fellowship, and opportunities to grow together.</p>
          </div>
          ${link('events', 'View All Events', 'button button-outline')}
        </div>
        ${visibleEvents.length ? `
          <div class="upcoming-events-grid">
            ${visibleEvents.map(event => `
              <article class="upcoming-event-card">
                <p class="upcoming-event-date">${escapeScheduleText(event.date)}</p>
                <h3>${escapeScheduleText(event.title)}</h3>
                ${event.time ? `<p><strong>Time:</strong> ${escapeScheduleText(event.time)}</p>` : ''}
                ${event.location ? `<p><strong>Location:</strong> ${escapeScheduleText(event.location)}</p>` : ''}
                ${event.description ? `<p>${escapeScheduleText(event.description)}</p>` : ''}
              </article>
            `).join('')}
          </div>
        ` : `
          <div class="upcoming-events-empty">
            <div class="upcoming-events-empty-icon" aria-hidden="true">✦</div>
            <div>
              <h3>Events will be announced here</h3>
              <p>Check back for confirmed dates and details. You can also follow the church's official Facebook page for announcements.</p>
              <a class="text-link" href="https://www.facebook.com/share/1DZhR4D1Pu/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">Church announcements on Facebook ↗</a>
            </div>
          </div>
        `}
      </div>
    </section>
  `;
}

function escapeScheduleText(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function serviceTimesSection() {
  return `
    <section class="section service-times-section" aria-labelledby="service-times-title">
      <div class="container">
        <div class="service-times-heading">
          ${eyebrow('Join us in worship')}
          <h2 id="service-times-title">Service Times</h2>
          <p>We look forward to worshiping with you. Times will be posted once confirmed.</p>
        </div>
        <div class="service-times-grid">
          ${SERVICE_SCHEDULE.map(service => `
            <article class="service-time-card">
              <span class="service-time-day">${escapeScheduleText(service.day)}</span>
              <h3>${escapeScheduleText(service.name)}</h3>
              <p class="service-time-value">${service.time ? escapeScheduleText(service.time) : 'Time to be announced'}</p>
            </article>
          `).join('')}
        </div>
        <p class="service-times-location">402 W Oklahoma St, Pampa, TX 79065</p>
        ${link('visit', 'Plan Your Visit', 'button button-outline')}
      </div>
    </section>
  `;
}

const mission = [
  {name:'Imagine', summary:'See beyond current circumstances and envision God’s greater purpose.', verse:'Ephesians 3:20', number:'01'},
  {name:'Innovate', summary:'Apply biblical truth with creativity, wisdom, and excellence.', verse:'Colossians 3:23', number:'02'},
  {name:'Initiate', summary:'Move from inspiration to bold, disciplined action.', verse:'James 1:22', number:'03'},
  {name:'Investigate', summary:'Pursue wisdom, understanding, and discernment through God’s Word.', verse:'James 1:5', number:'04'}
];
const beliefs = [
  ['The Trinity', 'We believe in one God, eternally existent in three persons: Father, Son, and Holy Spirit—equal in power, authority, and glory.'],
  ['The Infallibility of Scripture', 'We believe the Bible is the inspired, infallible, and authoritative Word of God, our final standard for doctrine, life, leadership, and decision-making.'],
  ['Divine Healing', 'We believe God has the power to heal physically, emotionally, and spiritually according to His will. Jesus Christ is the same yesterday, today, and forever.'],
  ['The Gifts of the Spirit', 'We believe the Holy Spirit remains active today, empowering believers with spiritual gifts for the edification of the Church and the advancement of God’s Kingdom.']
];

const pathwayCards = [
  {page:'visit', number:'01', label:'New here?', title:'Plan Your First Visit', copy:'Explore the space, know what to expect, and find the details you need before arriving.', action:'Explore your visit'},
  {page:'beliefs', number:'02', label:'Our foundation', title:'Discover What We Believe', copy:'Learn about the biblical truths that guide our worship, ministry, and everyday lives.', action:'Our beliefs'},
  {page:'vision', number:'03', label:'Find your purpose', title:'Grow With Intention', copy:'Explore the four principles that shape a Winner’s Mindset and purposeful Christian living.', action:'Our mission'}
];
const pathways = () => `<section class="section pathways-section" aria-labelledby="pathways-title"><div class="container"><div class="section-topline">${eyebrow('Your next step')}<span class="fine-rule" aria-hidden="true"></span></div><div class="section-heading-row"><h2 id="pathways-title">There’s a Place for You Here.</h2><p>Whether you’re visiting for the first time or looking to grow, discover where to begin.</p></div><div class="pathway-grid">${pathwayCards.map(c=>`<article class="pathway-card"><span class="pathway-index">${c.number} / ${c.label}</span><h3>${c.title}</h3><p>${c.copy}</p>${link(c.page,`${c.action} <span aria-hidden="true">↗</span>`,'pathway-link')}</article>`).join('')}</div></div></section>`;
const visitSteps = () => `<section class="section section-muted" aria-labelledby="visit-steps-title"><div class="container center-heading">${eyebrow('Your first Sunday')}<h2 id="visit-steps-title">Feel at Home From the Start</h2><p>A simple guide to getting acquainted with Open Door Church.</p></div><div class="container visit-steps"><article><span>01</span><h3>Explore the Church</h3><p>See photos of the exterior, welcome area, and sanctuary before your visit.</p></article><article><span>02</span><h3>Check the Details</h3><p>Service times are being confirmed. Directions to 402 W Oklahoma St, Pampa, TX 79065 are available below.</p></article><article><span>03</span><h3>Come as You Are</h3><p>Join us as we gather around worship, fellowship, and the Word of God.</p></article></div></section>`;
const visitFAQ = () => `<section class="section container faq-layout" aria-labelledby="faq-title"><div>${eyebrow('Good to know')}<h2 id="faq-title">First Visit Questions</h2><p>We want your visit to feel comfortable and straightforward.</p></div><div class="faq-list"><details><summary>Where is Open Door Church located?</summary><p>Open Door Church is at 402 W Oklahoma St, Pampa, TX 79065. <a href="https://www.google.com/maps/search/?api=1&query=402%20W%20Oklahoma%20St%2C%20Pampa%2C%20TX%2079065" target="_blank" rel="noopener noreferrer">Get directions</a>.</p></details><details><summary>What time are services?</summary><p>The current service schedule is being confirmed with church leadership.</p></details><details><summary>What will I find inside?</summary><p>Take a look at the welcome area and sanctuary photos on this page to become familiar with the space.</p></details><details><summary>How can I contact the church?</summary><p>Visit our Contact page. Phone and email details will be added after verification.</p></details></div></section>`;
// Accessible, reusable forms for contact, first-time visitors, and prayer requests.
function churchForm(type) {
  const configurations = {
    contact: {
      heading: 'Send Us a Message',
      description: 'Have a question? Send a message to the church team.',
      topic: true
    },
    visit: {
      heading: 'Let Us Know You Are Coming',
      description: 'Planning a visit? We would love to welcome you.',
      date: true,
      guests: true
    },
    prayer: {
      heading: 'Share a Prayer Request',
      description: 'Share what is on your heart. Please avoid including medical or other highly sensitive details.',
      confidential: true
    }
  };
  const configuration = configurations[type];
  const isPrayer = type === 'prayer';
  const nameField = isPrayer ? 'Your name (optional)' : 'Your name';
  const required = isPrayer ? '' : 'required';

  return `
    <section class="section form-section" aria-labelledby="${type}-form-title">
      <div class="container form-layout">
        <div class="form-intro">
          ${eyebrow('Connect with Open Door')}
          <h2 id="${type}-form-title">${configuration.heading}</h2>
          <p>${configuration.description}</p>
          <p class="form-privacy-note">This form prepares an email in your own email app. You must press Send there to deliver it. The website does not store or transmit the message. Please avoid including sensitive personal or medical information.</p>
        </div>
        <form class="church-form" data-form-type="${type}" method="get" action="#">
          <div class="form-row">
            <div class="form-field">
              <label for="${type}-name">${nameField}</label>
              <input id="${type}-name" name="name" type="text" maxlength="100" autocomplete="name" ${required}>
            </div>
            <div class="form-field">
              <label for="${type}-email">Email address ${isPrayer ? '(optional)' : ''}</label>
              <input id="${type}-email" name="email" type="email" maxlength="254" autocomplete="email" ${required}>
            </div>
          </div>
          <div class="form-field">
            <label for="${type}-phone">Phone number (optional)</label>
            <input id="${type}-phone" name="phone" type="tel" maxlength="30" autocomplete="tel">
          </div>
          ${configuration.topic ? `
            <div class="form-field">
              <label for="${type}-topic">What is your message about?</label>
              <select id="${type}-topic" name="topic" required>
                <option value="">Select a topic</option>
                <option value="general">General Questions</option>
                <option value="pastoral">Pastoral Care (Private)</option>
                <option value="ministry">Ministries</option>
                <option value="events">Church Events</option>
                <option value="website">Website Support</option>
              </select>
            </div>
            <div class="form-field">
              <label for="${type}-subject">Subject</label>
              <input id="${type}-subject" name="subject" type="text" maxlength="120" required>
            </div>` : ''}
          ${configuration.date ? `
            <div class="form-row">
              <div class="form-field">
                <label for="${type}-date">Planned visit date (optional)</label>
                <input id="${type}-date" name="visitDate" type="date">
              </div>
              <div class="form-field">
                <label for="${type}-guests">Number of guests (optional)</label>
                <input id="${type}-guests" name="guests" type="number" min="1" max="30">
              </div>
            </div>` : ''}
          <div class="form-field">
            <label for="${type}-message">${isPrayer ? 'Prayer request' : 'Message'}</label>
            <textarea id="${type}-message" name="message" rows="6" minlength="5" maxlength="4000" required></textarea>
          </div>
          ${configuration.confidential ? `
            <label class="form-checkbox">
              <input name="confidential" type="checkbox" value="true" checked>
              Mark this email as private (recipient access depends on the church inbox)
            </label>` : ''}
          <label class="form-checkbox">
            <input name="consent" type="checkbox" value="true" required>
            I agree to have this information used to respond to my request.
          </label>
          <div class="form-field form-anti-spam" aria-hidden="true">
            <label for="${type}-website">Website</label>
            <input id="${type}-website" name="website" type="text" tabindex="-1" autocomplete="off">
          </div>
          
          <button class="button button-primary form-submit" type="submit">Prepare ${isPrayer ? 'Prayer Email' : 'Email'}</button>
          <p class="form-status" role="status" aria-live="polite"></p>
        </form>
      </div>
    </section>`;
}

function initializeChurchForms() {
  const topicLabels = {
    general: 'General Questions',
    pastoral: 'Pastoral Care',
    ministry: 'Ministries',
    events: 'Church Events',
    website: 'Website Support'
  };

  document.querySelectorAll('.church-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      const data = new FormData(form);
      const type = form.dataset.formType;
      const topic = type === 'contact'
        ? (topicLabels[data.get('topic')] || 'General Questions')
        : type === 'visit'
          ? 'Plan Your Visit'
          : 'Prayer Request';
      const config = window.OPEN_DOOR_EMAIL || {};
      const destinations = config.recipients || {};
      const recipient = String(destinations[data.get('topic')] || destinations[type] || config.defaultEmail || '').trim();
      const status = form.querySelector('.form-status');

      status.classList.remove('form-error', 'form-success');

      if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
        status.classList.add('form-error');
        status.textContent = 'The church email address has not been configured yet. Please contact the church through its Facebook page.';
        return;
      }

      const subjectDetail = String(data.get('subject') || '').trim();
      const subject = `[Open Door Church - ${topic}]${subjectDetail ? ` ${subjectDetail}` : ''}`;
      const fields = [
        ['Topic', topic],
        ['Name', data.get('name') || 'Not provided'],
        ['Email', data.get('email') || 'Not provided'],
        ['Phone', data.get('phone') || 'Not provided'],
        ...(type === 'visit' ? [
          ['Planned visit date', data.get('visitDate') || 'Not specified'],
          ['Number of guests', data.get('guests') || 'Not specified']
        ] : []),
        ...(type === 'prayer' ? [
          ['Private request', data.has('confidential') ? 'Yes' : 'No']
        ] : []),
        ['Message', data.get('message') || '']
      ];
      const body = fields.map(([label, value]) => `${label}: ${value}`).join('\n\n');
      const url = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      status.classList.add('form-success');
      status.textContent = 'Your email app should open with a prepared message. Please press Send in your email app; nothing has been sent by this website.';
      window.location.href = url;
    });
  });
}

const centennialTimeline = () => `<section class="section timeline-section"><div class="container"><div class="center-heading">${eyebrow('Our story continues')}<h2>One Century. An Enduring Foundation.</h2><p>Honoring our beginning and looking ahead without losing sight of God’s Word.</p></div><div class="timeline-grid"><article><span class="timeline-year">1926</span><h3>A Church Is Established</h3><p>Open Door Church was established in November 1926.</p></article><article><span class="timeline-year">2026</span><h3>A Century of Faith</h3><p>November 2026 marks 100 years since the church’s establishment.</p></article><article><span class="timeline-year">Beyond</span><h3>Our Mission Continues</h3><p>We remain committed to equipping believers spiritually and naturally.</p></article></div></div></section>`;


const SLIDES = [
  {src:IMAGES.hero, alt:'Church service at the pulpit', title:'Gather in Faith', subtitle:'A place to worship and grow in God’s Word.'},
  {src:IMAGES.sanctuary, alt:'Open Door Church sanctuary', title:'A Place to Belong', subtitle:'Discover a welcoming place for worship and fellowship.'},
  {src:IMAGES.exterior, alt:'Exterior of Open Door Church', title:'100 Years of Faith', subtitle:'Honoring our legacy since November 1926.'},
  {src:IMAGES.pulpit, alt:'Open Door Church pulpit and cross', title:'Rooted in Truth', subtitle:'God’s Word remains our foundation.'}
];
function slideshow() {
  return `<section class="section showcase-section" aria-labelledby="showcase-title"><div class="container"><div class="section-topline">${eyebrow('Life at Open Door')}<span class="fine-rule"></span></div><div class="section-heading-row"><h2 id="showcase-title">Experience Our Church</h2><p>A glimpse of the people, spaces, and heritage of Open Door Church.</p></div><div class="church-slideshow" aria-roledescription="carousel" aria-label="Church photographs"><div class="slide-stage">${SLIDES.map((slide,i)=>`<figure class="church-slide ${i===0?'is-active':''}" aria-hidden="${i!==0}"><img src="${slide.src}" alt="${slide.alt}" loading="${i===0?'eager':'lazy'}"><figcaption><strong>${slide.title}</strong><span>${slide.subtitle}</span></figcaption></figure>`).join('')}</div><div class="slide-toolbar"><button type="button" class="slide-arrow slide-prev" aria-label="Previous photo">←</button><div class="slide-dots" aria-label="Choose a photo">${SLIDES.map((_,i)=>`<button type="button" class="slide-dot ${i===0?'is-active':''}" data-slide="${i}" aria-label="Show photo ${i+1}" aria-current="${i===0}"></button>`).join('')}</div><button type="button" class="slide-arrow slide-next" aria-label="Next photo">→</button><button type="button" class="slide-play" aria-label="Pause slideshow">Pause</button></div></div></div></section>`;
}
function serviceLibrary() {
  return `<section class="section container" aria-labelledby="service-library-title"><div class="section-topline">${eyebrow('Recorded worship & teaching')}<span class="fine-rule"></span></div><div class="section-heading-row"><h2 id="service-library-title">Service Recordings</h2><p>Watch previous services and messages as recordings become available.</p></div><div class="service-filters"><label for="service-search">Search recordings</label><input id="service-search" type="search" placeholder="Search by title or speaker" autocomplete="off"><label for="service-type">Category</label><select id="service-type"><option value="all">All recordings</option><option value="Sunday Service">Sunday Service</option><option value="Bible Study">Bible Study</option><option value="Special Service">Special Service</option></select></div><div id="service-results" class="service-grid" aria-live="polite"><p class="service-empty">Loading service recordings…</p></div><div class="media-notice"><h3>Church media team</h3><p>New services can be published by adding a recording link to <code>data/services.json</code> and uploading the updated site to Cloudflare Pages. For direct video uploads or a password-protected dashboard, an additional media hosting and administration service is needed.</p></div></section>`;
}
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let slideTimer;
function initSlideshow() {
  clearInterval(slideTimer);
  const root = document.querySelector('.church-slideshow');
  if (!root) return;
  const slides = [...root.querySelectorAll('.church-slide')], dots = [...root.querySelectorAll('.slide-dot')];
  let current = 0, playing = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const playButton = root.querySelector('.slide-play');
  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide,i) => { slide.classList.toggle('is-active',i===current); slide.setAttribute('aria-hidden',String(i!==current)); });
    dots.forEach((dot,i) => {dot.classList.toggle('is-active',i===current); dot.setAttribute('aria-current',String(i===current));});
  }
  function start() {clearInterval(slideTimer); if(playing) slideTimer = setInterval(()=>show(current+1),6500); playButton.textContent=playing?'Pause':'Play'; playButton.setAttribute('aria-label',playing?'Pause slideshow':'Play slideshow');}
  root.querySelector('.slide-prev').addEventListener('click',()=>{show(current-1);start();});
  root.querySelector('.slide-next').addEventListener('click',()=>{show(current+1);start();});
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>{show(i);start();}));
  playButton.addEventListener('click',()=>{playing=!playing;start();});
  root.addEventListener('mouseenter',()=>clearInterval(slideTimer));
  root.addEventListener('mouseleave',start);
  root.addEventListener('focusin',()=>clearInterval(slideTimer));
  root.addEventListener('focusout',e=>{if(!root.contains(e.relatedTarget))start();});
  start();
}
async function initServiceLibrary() {
  const results = document.getElementById('service-results');
  if (!results) return;
  let services = [];
  try {
    const response = await fetch('/data/services.json', {cache:'no-store'});
    if(!response.ok) throw new Error('Unable to load recordings');
    const data = await response.json();
    if(!Array.isArray(data)) throw new Error('Invalid recording data');
    services = data.filter(x => x && x.title && x.url && /^https:\/\//.test(x.url));
  } catch (error) {
    results.innerHTML='<p class="service-empty">The recordings list could not be loaded. Please check the site media file.</p>';
    return;
  }
  const search = document.getElementById('service-search'), type = document.getElementById('service-type');
  function render() {
    const term=search.value.trim().toLowerCase(), category=type.value;
    const filtered=services.filter(x=>(category==='all'||x.category===category)&&[x.title,x.speaker,x.description].join(' ').toLowerCase().includes(term));
    results.innerHTML=filtered.length?filtered.map(x=>`<article class="service-card"><div class="service-card-art"><span aria-hidden="true">▶</span><span>${escapeHtml(x.category||'Service')}</span></div><div class="service-card-body"><p class="service-date">${escapeHtml(x.date||'')}</p><h3>${escapeHtml(x.title)}</h3>${x.speaker?`<p>${escapeHtml(x.speaker)}</p>`:''}${x.description?`<p>${escapeHtml(x.description)}</p>`:''}<a class="button button-primary" href="${escapeHtml(x.url)}" target="_blank" rel="noopener noreferrer">Watch Recording ↗</a></div></article>`).join(''):`<div class="service-empty"><h3>${services.length?'No matching recordings':'Service recordings coming soon'}</h3><p>${services.length?'Try a different search or category.':'Recordings will appear here when the church media team publishes the first service.'}</p></div>`;
  }
  search.addEventListener('input',render); type.addEventListener('change',render); render();
}


const kingdomScenes = [
  { set: 1, slug: 'throne-room', title: 'The Throne Room', verse: 'Revelation 4:2–4' },
  { set: 1, slug: 'holy-spirit', title: 'The Holy Spirit', verse: 'John 14:26' },
  { set: 1, slug: 'living-word', title: 'The Living Word', verse: 'Hebrews 4:12' },
  { set: 1, slug: 'spiritual-warfare', title: 'Spiritual Warfare', verse: 'Ephesians 6:10–18' },
  { set: 1, slug: 'kingdom-gates', title: 'The Kingdom of Heaven', verse: 'Matthew 6:33' },
  { set: 1, slug: 'kingdom-authority', title: 'Kingdom Authority', verse: 'Matthew 28:18–20' },
  { set: 2, slug: 'throne-room', title: 'The Throne Room', verse: 'Revelation 4:8' },
  { set: 2, slug: 'holy-spirit', title: 'The Holy Spirit', verse: 'Acts 1:8' },
  { set: 2, slug: 'spiritual-warfare', title: 'Spiritual Warfare', verse: 'Ephesians 6:11' },
  { set: 2, slug: 'living-word', title: 'The Living Word', verse: 'Hebrews 4:12' },
  { set: 2, slug: 'kingdom-authority', title: 'Kingdom Authority', verse: 'Matthew 16:18' },
  { set: 2, slug: 'cross', title: 'The Cross', verse: '1 Corinthians 1:18' },
  { set: 2, slug: 'kingdom-living', title: 'Kingdom Living', verse: 'Matthew 6:33' },
  { set: 2, slug: 'worship', title: 'Worship', verse: 'Psalm 150:6' },
  { set: 2, slug: 'purpose', title: 'Your Purpose', verse: 'Ephesians 2:10' }
];

function kingdomGallery() {
  return `
    <section class="section kingdom-gallery" aria-labelledby="kingdom-gallery-title">
      <div class="container">
        <div class="kingdom-heading">
          ${eyebrow('Kingdom of Heaven • Scripture-inspired artwork')}
          <h2 id="kingdom-gallery-title">A Vision of Majesty, Truth & Purpose</h2>
          <p>Explore artwork from the first Kingdom collection. These are artistic illustrations inspired by Scripture, not literal photographs of the spiritual realm.</p>
        </div>
        <div class="kingdom-art-grid">
          ${kingdomScenes.filter((scene) => scene.set === 1).map((scene) => `
            <figure class="kingdom-art-card reveal-on-scroll">
              <img
                src="/assets/images/kingdom/set-${scene.set}-${scene.slug}.webp"
                alt="Scripture-inspired artwork: ${scene.title}"
                loading="lazy"
                decoding="async"
                width="510"
                height="425"
              >
              <figcaption>
                <span class="kingdom-art-set">Kingdom Artwork</span>
                <strong>${scene.title}</strong>
                <small>${scene.verse}</small>
              </figcaption>
            </figure>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function kingdomBanner(slug, title, subtitle) {
  return `
    <section class="kingdom-banner reveal-on-scroll" aria-label="${title}">
      <img src="/assets/images/kingdom/${slug}" alt="" loading="lazy" decoding="async">
      <div class="kingdom-banner-shade"></div>
      <div class="container kingdom-banner-content kingdom-glass">
        <p class="eyebrow">The Kingdom of Heaven</p>
        <h2>${title}</h2>
        <p>${subtitle}</p>
      </div>
    </section>
  `;
}

function initKingdomMotion() {
  const items = document.querySelectorAll('.reveal-on-scroll');
  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(item => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  items.forEach(item => observer.observe(item));
}


// Scripture references and summaries are visible HTML, not text embedded in artwork.
// KJV quotations below are short and the remaining references are thematic summaries.
const scriptureFoundations = {
  home: [
    ['John 17:17', '“Sanctify them through thy truth: thy word is truth.”', 'God’s Word is the foundation of truth.'],
    ['Ephesians 6:10–11', '', 'Stand strong in the Lord and put on the whole armor of God.'],
    ['Matthew 6:33', '', 'Seek first the kingdom of God and His righteousness.']
  ],
  about: [
    ['Psalm 78:4', '', 'Declare the works of the Lord to the generations that follow.'],
    ['Hebrews 13:8', '“Jesus Christ the same yesterday, and to day, and for ever.”', 'Christ remains constant across generations.'],
    ['Psalm 100:5', '', 'The Lord’s mercy and truth endure through all generations.']
  ],
  beliefs: [
    ['2 Timothy 3:16–17', '', 'Scripture is God-inspired and equips believers for good works.'],
    ['John 1:1', '“In the beginning was the Word, and the Word was with God, and the Word was God.”', 'The divine Word is central to our faith.'],
    ['Hebrews 4:12', '', 'God’s Word is living, powerful, and discerning.']
  ],
  vision: [
    ['Proverbs 29:18', '', 'Vision must remain connected to God’s revealed instruction.'],
    ['Habakkuk 2:2–3', '', 'Write the vision plainly and remain faithful in waiting.'],
    ['Matthew 28:19–20', '', 'Make disciples and teach the commands of Christ.']
  ],
  ministries: [
    ['Ephesians 4:11–12', '', 'Ministry gifts equip the saints for the work of ministry.'],
    ['1 Corinthians 12:4–7', '', 'Different gifts serve the body through the same Spirit.'],
    ['1 Peter 4:10', '', 'Use the gifts you have received to serve one another.']
  ],
  events: [
    ['Hebrews 10:24–25', '', 'Gather together and encourage one another toward love and good works.'],
    ['Matthew 18:20', '', 'Jesus speaks of His presence where believers gather in His name.'],
    ['Psalm 122:1', '“I was glad when they said unto me, Let us go into the house of the LORD.”', 'Gathering for worship is a joy.']
  ],
  sermons: [
    ['Romans 10:17', '“So then faith cometh by hearing, and hearing by the word of God.”', 'Faith grows through hearing God’s Word.'],
    ['2 Timothy 4:2', '', 'Preach the Word faithfully.'],
    ['James 1:22', '', 'Put the Word into practice, rather than only listening.']
  ],
  visit: [
    ['Romans 15:7', '', 'Welcome one another as Christ has welcomed us.'],
    ['Psalm 100:4', '', 'Enter His gates with thanksgiving and praise.'],
    ['Hebrews 13:2', '', 'Remember to show hospitality to others.']
  ],
  giving: [
    ['Malachi 3:10', '', 'The Lord addresses bringing tithes into the storehouse.'],
    ['Proverbs 3:9', '', 'Honor the Lord with your substance and firstfruits.'],
    ['2 Corinthians 9:7', '', 'Give willingly and cheerfully, not under compulsion.']
  ],
  contact: [
    ['Philippians 4:6–7', '', 'Bring your requests to God with prayer and thanksgiving.'],
    ['James 5:16', '', 'Pray for one another.'],
    ['1 John 5:14', '', 'Pray with confidence according to God’s will.']
  ]
};

function scriptureSection(page) {
  const verses = scriptureFoundations[page] || [];
  if (!verses.length) return '';
  return `
    <section class="section scripture-foundation-section" aria-labelledby="scripture-${page}-title">
      <div class="container">
        <div class="center-heading">
          ${eyebrow('Our biblical foundation')}
          <h2 id="scripture-${page}-title">Grounded in God’s Word</h2>
          <p>Scriptures that support the message and purpose of this page.</p>
        </div>
        <div class="scripture-foundation-grid">
          ${verses.map(([reference, quotation, explanation]) => `
            <article class="scripture-foundation-card">
              <p class="scripture-reference">${escapeHtml(reference)} · KJV</p>
              ${quotation ? `<blockquote><p>${escapeHtml(quotation)}</p></blockquote>` : ''}
              <p>${escapeHtml(explanation)}</p>
            </article>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function missionScriptures() {
  const principles = [
    ['Imagine', 'Ephesians 3:20', 'God is able to do beyond all we ask or think.'],
    ['Innovate', 'Isaiah 43:19', 'God declares that He will do a new thing.'],
    ['Initiate', 'James 2:17', 'Living faith expresses itself in action.'],
    ['Investigate', 'Acts 17:11', 'Examine the Scriptures carefully.']
  ];
  return `
    <section class="section section-muted" aria-labelledby="mission-scripture-title">
      <div class="container">
        <div class="center-heading">
          ${eyebrow('Scripture and our four principles')}
          <h2 id="mission-scripture-title">Faith Put Into Practice</h2>
          <p>These are thematic biblical connections, not claims that the verses name our four principles.</p>
        </div>
        <div class="scripture-foundation-grid mission-scripture-grid">
          ${principles.map(([name, reference, description]) => `
            <article class="scripture-foundation-card">
              <h3>${name}</h3>
              <p class="scripture-reference">${reference} · KJV</p>
              <p>${description}</p>
            </article>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

const pages = {
  home: () => `
    <section class="cinematic-hero" aria-labelledby="hero-title">
      <div class="cinematic-hero-photo" role="img" aria-label="Scripture-inspired golden gates opening into radiant light"></div>
      <div class="cinematic-hero-light" aria-hidden="true"></div>
      <div class="cinematic-hero-shade"></div>
      <div class="container cinematic-hero-content">
        <div class="cinematic-kicker"><span class="kicker-line"></span> ESTABLISHED NOVEMBER 1926 <span class="kicker-line"></span></div>
        <h1 id="hero-title">Rooted in Truth.<br><em>Equipped to Win.</em></h1>
        <p class="cinematic-lead">A legacy of faith. A future of purpose.</p>
        <p class="cinematic-description">Welcome to Open Door Church, where God’s Word is our foundation and faith moves us forward.</p>
        <div class="actions cinematic-actions">${link('visit','Plan Your Visit','button button-brass')}${link('sermons','Watch Services','button button-ghost')}</div>
      </div>
      <div class="cinematic-bottom"><span>OPEN DOOR CHURCH</span><span>100 YEARS OF FAITH · 1926–Present</span></div>
    </section>
    <section class="welcome-strip" aria-label="Quick links"><div class="container welcome-strip-inner"><div><span class="welcome-strip-icon">✦</span><div><strong>New to Open Door?</strong><small>Discover what to expect when you visit.</small></div></div>${link('visit','Plan Your Visit ↗','welcome-strip-link')}</div></section>
    <section class="section latest-message" aria-labelledby="latest-title"><div class="container latest-message-layout"><div class="latest-message-copy">${eyebrow('Worship beyond Sunday')}<h2 id="latest-title">The Word, Wherever You Are.</h2><p>Explore worship services and biblical teaching from Open Door Church. Recorded messages will appear as the church media team publishes them.</p>${link('sermons','Explore Sermons & Media','button button-primary')}<a class="text-link facebook-inline-link" href="https://www.facebook.com/share/1DZhR4D1Pu/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">Watch on Facebook ↗</a></div><div class="latest-message-art"><img src="${IMAGES.pulpit}" alt="Open Door Church pulpit and cross" loading="lazy"><div class="latest-message-art-overlay"><span class="video-play-symbol" aria-hidden="true">▶</span><strong>Service Recordings</strong><small>Browse the church media library</small></div></div></div></section>
    ${slideshow()}
    ${serviceTimesSection()}
    ${upcomingEventsSection()}
    ${kingdomGallery()}
    ${pathways()}
    <section class="heritage-band"><div class="container heritage-grid"><div><strong>1926</strong><span>Established</span></div><div><strong>100</strong><span>Years of ministry in 2026</span></div><div><strong>4</strong><span>Mission principles</span></div></div></section>
    <section class="section anniversary-feature" aria-labelledby="centennial-heading"><div class="container anniversary-inner"><div class="anniversary-emblem" aria-label="Celebrating 100 years, 1926 to 2026"><strong>100</strong><span>Years of Faith</span><small>1926–Present</small></div><div>${eyebrow('Our centennial legacy')}<h2 id="centennial-heading">A Century of Faithfulness</h2><p>Since November 1926, Open Door Church has stood on the foundation of God’s Word. As we honor a century of ministry, we look forward with gratitude, faith, and purpose.</p>${link('about','Explore Our History','text-link')}</div></div></section>
    <section class="section container split-section"><div class="section-photo">${image(IMAGES.exterior,'Exterior of Open Door Church with its brick sign')}</div><div class="section-copy">${eyebrow('Who we are')}<h2>A Legacy of Faith.<br>A Future of Purpose.</h2><p>Through generations and changes in leadership, Open Door has remained anchored in God’s Word as the standard for life, leadership, and decision-making.</p>${link('about','Our Story','text-link')}</div></section>
    <section class="section section-muted"><div class="container center-heading">${eyebrow('Our mission')}<h2>Equipping Believers to Win</h2><p>Four principles shape how we pursue God’s purpose with faith, wisdom, and excellence.</p></div><div class="container mission-grid">${mission.map(m=>`<article class="mission-card"><span class="card-number">${m.number}</span><h3>${m.name}</h3><p>${m.summary}</p><span class="verse">${m.verse}</span></article>`).join('')}</div><div class="center-action">${link('vision','Explore Our Vision & Mission','button button-outline')}</div></section>
    ${visitSteps()}
    <section class="section container split-section reverse"><div class="section-photo">${image(IMAGES.sanctuary,'Open Door Church sanctuary with wooden pews and center aisle')}</div><div class="section-copy">${eyebrow('You are welcome here')}<h2>Come Worship With Us</h2><p>Get to know our church, see our sanctuary, and find helpful information for your first visit.</p>${link('visit','Plan Your Visit','button button-primary')}</div></section>
    <section class="section statement-section"><div class="container statement-inner">${eyebrow('Our foundation')}<h2>God’s Word Remains Our Standard.</h2><p>Grounded in truth. Growing in faith. Building with excellence.</p>${link('beliefs','What We Believe','button button-light')}</div></section>
  
    ${scriptureSection('home')}`,
  about: () => `${intro('Our story','A Century of Faith','Established in November 1926, Open Door Church has faithfully served the community through generations of change and growth.')}
    <section class="section container split-section"><div class="section-photo">${image(IMAGES.exterior,'Open Door Church exterior and entrance')}</div><div class="section-copy">${eyebrow('Established 1926')}<h2>One Unchanging Foundation</h2><p>Through seasons of growth and transitions of leadership, the church has remained anchored in God’s Word as its standard for life, leadership, and decision-making.</p><p>Guided by a Winner’s Mindset, Open Door seeks to equip believers to win spiritually and naturally, grounded in truth and growing in faith.</p></div></section>
    ${kingdomBanner('set-2-throne-room-scene.webp', 'A Heritage of Faith', 'Our history is grounded in the Word of God.')}
    ${centennialTimeline()}
    <section class="section section-muted"><div class="container center-heading">${eyebrow('1926–Present')}<h2>Honoring 100 Years</h2><p>We celebrate the faithfulness of God and the generations who have helped carry this ministry forward.</p></div></section>
    <section class="section container split-section reverse"><div class="section-photo">${image(IMAGES.welcome,'Open Door Church welcome area with chairs and wall decorations')}</div><div class="section-copy">${eyebrow('Looking ahead')}<h2>Building for the Future</h2><p>Our commitment remains to stand on biblical truth, cultivate faith, and pursue excellence in serving others.</p>${link('vision','Our Vision & Mission','text-link')}</div></section>
    ${scriptureSection('about')}`,
  beliefs: () => `${intro('Our foundation','What We Believe','Our faith is rooted in historic biblical truth and empowered by the active work of the Holy Spirit.')}
    <section class="section container split-section"><div class="section-photo">${image(IMAGES.pulpit,'Open Door Church pulpit and cross')}</div><div class="section-copy">${eyebrow('Grounded in scripture')}<h2>God’s Word Is Our Standard</h2><p>Scripture guides our faith, doctrine, leadership, and everyday decisions.</p><p>We believe the same Spirit who empowered the early Church continues to empower believers today.</p></div></section>
    ${kingdomBanner('set-1-living-word-scene.webp', 'The Living Word', 'The Scriptures remain the foundation of our faith.')}
    <section class="section section-muted"><div class="container belief-grid">${beliefs.map(([name,body],i)=>`<article class="belief-card"><span class="card-number">0${i+1}</span><h2>${name}</h2><p>${body}</p></article>`).join('')}</div></section>
    ${scriptureSection('beliefs')}`,
  vision: () => `${intro('Our purpose','Vision & Mission','A Winner’s Mindset is rooted in obedience, alignment with God’s Word, and fulfilling His assignment with excellence.')}
    ${kingdomBanner('set-1-kingdom-gates-scene.webp', 'Seek First the Kingdom', 'Faith and purpose guided by the Word of God.')}
    <section class="section container narrow"><div class="center-heading">${eyebrow('Our vision')}<h2>Know God’s Purpose. Walk by Faith. Finish Strong.</h2><p>We see believers thriving in every area of life with a Winner’s Mindset, walking in faith and completing God’s assignment with excellence.</p></div></section>
    <section class="section section-muted"><div class="container center-heading">${eyebrow('Our mission')}<h2>Equipping Believers Spiritually and Naturally</h2><p>Our four guiding principles help connect biblical truth to purposeful action.</p></div><div class="container mission-grid">${mission.map(m=>`<article class="mission-card"><span class="card-number">${m.number}</span><h3>${m.name}</h3><p>${m.summary}</p><span class="verse">${m.verse}</span></article>`).join('')}</div></section>
    ${scriptureSection('vision')}
    ${missionScriptures()}`,
  ministries: () => `${intro('Grow together','Ministries','Discover opportunities to connect, serve, and grow in faith at Open Door Church.')}
    ${kingdomBanner('set-2-kingdom-living.webp', 'Faith in Action', 'Growing together through the Word, worship, and service.')}
    <section class="section container" aria-labelledby="ministries-overview">
      <div class="center-heading">${eyebrow('Find your place')}<h2 id="ministries-overview">Connect. Grow. Serve.</h2><p>We are preparing verified ministry information. In the meantime, explore ways to get connected with our church family.</p></div>
      <div class="feature-grid">
        <article class="feature-card"><span class="feature-icon" aria-hidden="true">✦</span><h3>Worship Together</h3><p>Gather around worship and the teaching of God’s Word.</p>${link('visit','Plan a Visit','text-link')}</article>
        <article class="feature-card"><span class="feature-icon" aria-hidden="true">✧</span><h3>Grow in Faith</h3><p>Learn about the biblical beliefs and vision that guide our church.</p>${link('beliefs','Explore Our Beliefs','text-link')}</article>
        <article class="feature-card"><span class="feature-icon" aria-hidden="true">✺</span><h3>Get Connected</h3><p>Ask the church team about current groups and ways to serve.</p>${link('contact','Ask About Ministries','text-link')}</article>
      </div>
    </section>
    <section class="section section-muted"><div class="container editorial-cta"><div>${eyebrow('Ministry directory')}<h2>Ministry Details Coming Soon</h2><p>Names, meeting times, leaders, and volunteer opportunities will be added after confirmation. No unverified ministries are listed.</p></div>${link('contact','Contact Open Door','button button-primary')}</div></section>
    ${scriptureSection('ministries')}`,
  events: () => `${intro('Gather with us','Events & Announcements','Stay connected with worship, fellowship, and future church gatherings.')}
    ${kingdomBanner('set-2-worship.webp', 'Gather in Faith', 'A place to worship, connect, and encourage one another.')}
    ${upcomingEventsSection()}
    <section class="section section-muted"><div class="container editorial-cta"><div>${eyebrow('Visit us')}<h2>Worship With Us</h2><p>Find our location, explore the sanctuary, and check the service schedule before visiting.</p></div>${link('visit','Plan Your Visit','button button-primary')}</div></section>
    ${scriptureSection('events')}`,
  sermons: () => `${intro('The Word','Sermons & Media','Worship services, biblical teaching, and messages from Open Door Church.')}
    <section class="section container split-section"><div class="section-photo">${image(IMAGES.hero,'A message being delivered at Open Door Church')}</div><div class="section-copy">${eyebrow('Worship & the Word')}<h2>Watch. Reflect. Grow.</h2><p>Explore our service archive below. As new recordings are published, they will appear in the library for members and visitors to watch.</p></div></section>
    <section class='section facebook-feature'><div class='container facebook-feature-inner'><div><p class='eyebrow'>Official church Facebook</p><h2>Watch & Stay Connected</h2><p>Find worship services and updates on our official Facebook page. Individual recordings will appear in the library when public links are available.</p><a class="button button-primary" href="https://www.facebook.com/share/1DZhR4D1Pu/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">Visit Our Official Facebook Page ↗</a></div></div></section>
    ${serviceLibrary()}
    ${scriptureSection('sermons')}`,
  visit: () => `${intro('You are welcome','Plan Your Visit','We look forward to welcoming you to Open Door Church.')}
    <section class="section container split-section"><div class="section-photo">${image(IMAGES.exterior,'Front exterior and sign of Open Door Church')}</div><div class="section-copy">${eyebrow('Your first visit')}<h2>Find Your Way to Open Door</h2><p>See the church building before you arrive and explore our worship space below.</p><div class="info-list"><div><strong>Service times</strong><span>See the editable service schedule below</span></div><div><strong>Church address</strong><span>402 W Oklahoma St, Pampa, TX 79065</span></div><div><strong>Directions</strong><span><a href="https://www.google.com/maps/search/?api=1&query=402%20W%20Oklahoma%20St%2C%20Pampa%2C%20TX%2079065" target="_blank" rel="noopener noreferrer">Get directions on Google Maps</a></span></div></div></div></section>
    ${visitSteps()}
    ${serviceTimesSection()}
    ${churchForm('visit')}
    <section class="section section-muted"><div class="container center-heading">${eyebrow('Inside the church')}<h2>Get to Know Our Space</h2></div><div class="container photo-grid"><figure>${image(IMAGES.welcome,'Welcome area with seating')}<figcaption>Welcome area</figcaption></figure><figure>${image(IMAGES.sanctuary,'Sanctuary pews and central aisle')}<figcaption>Sanctuary</figcaption></figure><figure>${image(IMAGES.pulpit,'Church pulpit with a cross behind it')}<figcaption>Pulpit & worship area</figcaption></figure></div></section>${visitFAQ()}
    ${scriptureSection('visit')}`,
  giving: () => `${intro('Worship through generosity', 'Tithes & Giving', 'Honoring God with our firstfruits and giving with a willing heart.')}
    ${kingdomBanner('set-2-cross-scene.webp', 'A Heart of Generosity', 'Giving is an act of worship, gratitude, and trust in God.')}

    <section class="section container" aria-labelledby="giving-heading">
      <div class="center-heading">
        ${eyebrow('Giving at Open Door')}
        <h2 id="giving-heading">Tithes, Offerings & Generosity</h2>
        <p>Scripture teaches us to honor God with what He has entrusted to us. Explore these passages on tithes, firstfruits, and cheerful giving.</p>
      </div>
      <div class="giving-scripture-grid">
        <article class="giving-scripture-card">
          <span class="giving-verse-label">Tithes</span>
          <h3>Bring the Tithes</h3>
          <blockquote><p>“Bring ye all the tithes into the storehouse, that there may be meat in mine house, and prove me now herewith, saith the LORD of hosts, if I will not open you the windows of heaven, and pour you out a blessing, that there shall not be room enough to receive it.”</p></blockquote>
          <p class="giving-reference">Malachi 3:10 · KJV</p>
        </article>
        <article class="giving-scripture-card">
          <span class="giving-verse-label">Firstfruits</span>
          <h3>Honor the Lord</h3>
          <blockquote><p>“Honour the LORD with thy substance, and with the firstfruits of all thine increase:”</p></blockquote>
          <p class="giving-reference">Proverbs 3:9 · KJV</p>
        </article>
        <article class="giving-scripture-card">
          <span class="giving-verse-label">Cheerful Giving</span>
          <h3>Give From the Heart</h3>
          <blockquote><p>“Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver.”</p></blockquote>
          <p class="giving-reference">2 Corinthians 9:7 · KJV</p>
        </article>
      </div>
      <p class="giving-scripture-note">These passages include teachings on tithes and firstfruits in the Old Testament and willing generosity in the New Testament.</p>
    </section>

    <section class="section section-muted" aria-labelledby="tithely-heading">
      <div class="container editorial-cta">
        <div>
          ${eyebrow('Online giving')}
          <h2 id="tithely-heading">Tithely Giving — Coming Soon</h2>
          <p>Open Door Church plans to offer online giving through Tithely. The church's verified giving link will be added here when available. Online donations are not yet enabled on this website.</p>
          <p>For current giving instructions, please contact the church. Do not send payment card or banking details through email forms.</p>
          ${link('contact', 'Ask About Giving', 'text-link')}
        </div>
        <span class="coming-soon" aria-label="Online giving is not yet available">Tithely Link Pending</span>
      </div>
    </section>
    ${scriptureSection('giving')}`,
  contact: () => `${intro('Connect with us','Contact Open Door','We welcome your questions and look forward to connecting with you.')}
    ${churchForm('contact')}
    ${churchForm('prayer')}
    <section class="section container"><div class="contact-grid"><article class="info-card"><h2>Visit</h2><p>402 W Oklahoma St, Pampa, TX 79065. <a href="https://www.google.com/maps/search/?api=1&query=402%20W%20Oklahoma%20St%2C%20Pampa%2C%20TX%2079065" target="_blank" rel="noopener noreferrer">Get directions</a>.</p>${link('visit','Plan Your Visit','text-link')}</article><article class="info-card"><h2>Call or Email</h2><p>Phone number and email address will be added later.</p>${unavailable('Contact Details')}</article><article class="info-card"><h2>Stay Connected</h2><p>Follow Open Door Church for worship services, announcements, and community updates.</p><a class="button button-primary" href="https://www.facebook.com/share/1DZhR4D1Pu/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">Visit Our Official Facebook Page ↗</a></article></div></section>
    ${scriptureSection('contact')}`
};

function header(page) {
  return `<div class="top-ribbon"><div class="container ribbon-inner"><span>Celebrating 100 years of faith • 1926–Present</span>${link('visit','New here? Plan your visit ↗')}</div></div><header class="site-header"><div class="container header-inner">
    ${link('home','<span class="brand-mark" aria-hidden="true">✦</span><span class="brand-name">Open Door <span>Church</span><small>EST. NOVEMBER 1926</small></span>','brand')}
    <button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="primary-nav"><span></span><span></span><span></span></button>
    <nav id="primary-nav" class="primary-nav" aria-label="Main navigation">${NAV.map(([id,label])=>link(id,label,page===id?'active':'',page===id)).join('')}</nav>
  </div></header>`;
}
function footer() {
  return `<footer class="site-footer"><div class="container footer-grid"><div><h2>Open Door Church</h2><p>Rooted in Truth. Equipped to Win.</p><p class="footer-small">Established November 1926</p></div><div><h3>Explore</h3>${[['about','About Us'],['beliefs','What We Believe'],['vision','Vision & Mission'],['ministries','Ministries']].map(([id,label])=>link(id,label)).join('')}</div><div><h3>Connect</h3>${[['visit','Plan Your Visit'],['events','Events'],['sermons','Sermons'],['contact','Contact']].map(([id,label])=>link(id,label)).join('')}<a href="https://www.facebook.com/share/1DZhR4D1Pu/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Open Door Church official Facebook page">Facebook ↗</a></div><div><h3>Information</h3><p>402 W Oklahoma St, Pampa, TX 79065. See the Service Times section on our homepage or Plan Your Visit page. <a href="https://www.google.com/maps/search/?api=1&query=402%20W%20Oklahoma%20St%2C%20Pampa%2C%20TX%2079065" target="_blank" rel="noopener noreferrer">Directions</a>.</p></div></div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} Open Door Church. All rights reserved.</span><a href="#main" class="back-to-top">Back to top ↑</a></div></footer>`;
}
function route() {
  const page = location.pathname.split('/').filter(Boolean)[0] || 'home';
  const validPage = Object.prototype.hasOwnProperty.call(pages,page) ? page : 'home';
  document.getElementById('app').innerHTML = `${header(validPage)}<main id="main" tabindex="-1">${pages[validPage]()}</main>${footer()}`;
  initSlideshow();
  initKingdomMotion();
  initServiceLibrary();
  initializeChurchForms();
  document.title = document.querySelector('title')?.textContent || 'Open Door Church';
  const menu = document.querySelector('.menu-toggle');
  menu.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded',String(!expanded));
    menu.setAttribute('aria-label',expanded?'Open navigation':'Close navigation');
    document.getElementById('primary-nav').classList.toggle('open',!expanded);
  });
  document.getElementById('primary-nav').addEventListener('click', event => {
    if (event.target.closest('a')) {
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Open navigation');
      document.getElementById('primary-nav').classList.remove('open');
    }
  });
  menu.closest('.site-header').addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      menu.setAttribute('aria-expanded','false');
      menu.setAttribute('aria-label','Open navigation');
      document.getElementById('primary-nav').classList.remove('open');
      menu.focus();
    }
  });
  if (!window.location.hash) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

}
document.addEventListener('click', event => {
  const topLink = event.target.closest('.back-to-top');
  if (topLink) {
    event.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    document.querySelector('#main')?.focus({ preventScroll: true });
  }
});
window.addEventListener('hashchange',route);
route();
