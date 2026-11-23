/* ==========================================================================
   NIGERIAN AIR FORCE — Shared layout (header, mobile menu, footer)
   Single source of truth for site navigation. Every page includes:
     <div id="site-header"></div> ... <div id="site-footer"></div>
   and sets <body data-page="key">.
   ========================================================================== */
(function () {
  "use strict";

  const NAV = [
    { label: "Home", href: "index.html", key: "home" },
    {
      label: "About", key: "about-group",
      items: [
        { label: "Heritage & History", href: "about.html", key: "about", icon: "bi-bank", desc: "Six decades defending Nigerian airspace" },
        { label: "Command & Leadership", href: "leadership.html", key: "leadership", icon: "bi-star", desc: "The officers and enlisted leaders in command" },
        { label: "Core Values", href: "about.html#values", key: "values", icon: "bi-shield-check", desc: "Integrity, service, excellence" }
      ]
    },
    {
      label: "Operations", key: "ops-group",
      items: [
        { label: "Aircraft Fleet", href: "fleet.html", key: "fleet", icon: "bi-airplane", desc: "Combat, rotary, mobility and ISR platforms" },
        { label: "Missions", href: "mission.html", key: "mission", icon: "bi-crosshair", desc: "Active operations and mission zones" }
      ]
    },
    {
      label: "People", key: "people-group",
      items: [
        { label: "Personnel", href: "personnel.html", key: "personnel", icon: "bi-people", desc: "NAF ranks, insignia and branches" },
        { label: "Careers", href: "careers.html", key: "careers", icon: "bi-person-badge", desc: "Officer cadet, airman and specialist entry" }
      ]
    },
    {
      label: "Media", key: "media-group",
      items: [
        { label: "Newsroom", href: "news.html", key: "news", icon: "bi-newspaper", desc: "Press releases and operational updates" },
        { label: "Gallery", href: "gallery.html", key: "gallery", icon: "bi-images", desc: "Aircraft, people and operations" }
      ]
    },
    { label: "Contact", href: "contact.html", key: "contact" }
  ];

  const page = document.body.dataset.page || "";
  const isActive = (k) => k === page;
  const groupActive = (g) => g.items && g.items.some((i) => isActive(i.key));

  /* ---------- Header ---------- */
  function headerHTML() {
    const links = NAV.map((n) => {
      if (!n.items) {
        return `<li class="nav-item"><a class="nav-link-gaf${isActive(n.key) ? " active" : ""}" href="${n.href}"${isActive(n.key) ? ' aria-current="page"' : ""}>${n.label}</a></li>`;
      }
      const panel = n.items.map((i) => `
        <a href="${i.href}" class="${isActive(i.key) ? "active" : ""}"${isActive(i.key) ? ' aria-current="page"' : ""}>
          <i class="bi ${i.icon}" aria-hidden="true"></i>
          <div><strong>${i.label}</strong><span>${i.desc}</span></div>
        </a>`).join("");
      return `<li class="nav-item">
        <button class="nav-link-gaf${groupActive(n) ? " active" : ""}" aria-haspopup="true">${n.label} <i class="bi bi-chevron-down" aria-hidden="true"></i></button>
        <div class="nav-panel">${panel}</div>
      </li>`;
    }).join("");

    const mobile = [
      { title: "Main", items: [{ label: "Home", href: "index.html", key: "home" }, { label: "Contact", href: "contact.html", key: "contact" }] },
      ...NAV.filter((n) => n.items).map((n) => ({ title: n.label, items: n.items }))
    ].map((g, gi) => `
      <div class="group" style="transition-delay:${0.15 + gi * 0.06}s">
        <div class="group-title">${g.title}</div>
        ${g.items.map((i) => `<a href="${i.href}" class="${isActive(i.key) ? "active" : ""}">${i.label}<i class="bi bi-arrow-up-right" aria-hidden="true"></i></a>`).join("")}
      </div>`).join("");

    return `
      <a class="skip-link" href="#main">Skip to content</a>
      <div class="scroll-progress" aria-hidden="true"></div>
      <div class="gov-banner">
        <div class="container-xl">
          <span class="flag official"><span class="roundel" aria-hidden="true"></span> Concept redesign · not an official NAF website · <a href="https://airforce.mil.ng" target="_blank" rel="noopener">airforce.mil.ng</a></span>
          <span class="status"><span class="dot-live" aria-hidden="true"></span><span class="hide-sm">Abuja</span> <span data-clock>--:--:-- WAT</span></span>
        </div>
      </div>
      <div class="flag-stripe" aria-hidden="true"></div>
      <header class="site-header" role="banner">
        <div class="container-xl">
          <a class="brand" href="index.html" aria-label="Nigerian Air Force — Home">
            <img src="img/emblem.svg" alt="" width="40" height="40">
            <span class="brand-text"><strong>Nigerian Air Force</strong><small>WILLING · ABLE · READY</small></span>
          </a>
          <nav class="main-nav" aria-label="Primary"><ul>${links}</ul></nav>
          <a class="btn-gaf btn-sm-gaf header-cta" href="careers.html">Join the Force <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
          <button class="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span><span></span></button>
        </div>
      </header>
      <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
        ${mobile}
        <a class="btn-gaf" href="careers.html">Join the Force <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
      </div>`;
  }

  /* ---------- Footer ---------- */
  function footerHTML() {
    const year = new Date().getFullYear();
    return `
      <footer class="site-footer" role="contentinfo">
        <div class="container-xl">
          <div class="row gy-5">
            <div class="col-lg-4 footer-brand">
              <a class="brand" href="index.html"><img src="img/emblem.svg" alt="" width="40" height="40"><span class="brand-text"><strong>Nigerian Air Force</strong><small>WILLING · ABLE · READY</small></span></a>
              <div class="footer-motto">Willing. Able.<br><span>Ready.</span></div>
              <p>Projecting decisive airpower, airlift and ISR in defence of Nigeria's territorial integrity and in support of national security.</p>
              <div class="socials">
                <a href="#" aria-label="X"><i class="bi bi-twitter-x"></i></a>
                <a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
                <a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
                <a href="#" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
                <a href="#" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>
              </div>
            </div>
            <div class="col-6 col-md-4 col-lg-2 footer-col">
              <h4>Organization</h4>
              <ul>
                <li><a href="about.html">Heritage</a></li>
                <li><a href="leadership.html">Leadership</a></li>
                <li><a href="about.html#values">Core Values</a></li>
                <li><a href="personnel.html">Personnel</a></li>
              </ul>
            </div>
            <div class="col-6 col-md-4 col-lg-2 footer-col">
              <h4>Operations</h4>
              <ul>
                <li><a href="fleet.html">Aircraft Fleet</a></li>
                <li><a href="mission.html">Missions</a></li>
                <li><a href="news.html">Newsroom</a></li>
                <li><a href="gallery.html">Gallery</a></li>
                <li><a href="careers.html">Careers</a></li>
              </ul>
            </div>
            <div class="col-md-4 col-lg-4 footer-col">
              <h4>Contact</h4>
              <div class="hotline"><small>Headquarters NAF, Abuja</small><strong>Airport Road, Abuja</strong></div>
              <div class="hotline"><small>Official website</small><strong><a href="https://airforce.mil.ng" target="_blank" rel="noopener">airforce.mil.ng</a></strong></div>
              <a href="contact.html" class="link-arrow">Media &amp; public inquiries <i class="bi bi-arrow-right"></i></a>
            </div>
          </div>
          <div class="footer-watermark" aria-hidden="true">Nigerian Air Force</div>
          <div class="footer-bottom">
            <span>&copy; ${year} Concept redesign inspired by the Nigerian Air Force. Not affiliated with or endorsed by the NAF. Photos: Wikimedia Commons — see <a href="gallery.html#credits">credits</a>.</span>
            <nav aria-label="Legal">
              <a href="#">Privacy</a><a href="#">Accessibility</a><a href="#">FOIA</a><a href="#">Security</a><a href="contact.html">Webmaster</a>
            </nav>
          </div>
        </div>
      </footer>
      <button class="to-top" aria-label="Back to top"><i class="bi bi-arrow-up"></i></button>
      <div class="toast-gaf" role="status" aria-live="polite"><i class="bi bi-check-circle-fill"></i><span></span></div>`;
  }

  const h = document.getElementById("site-header");
  const f = document.getElementById("site-footer");
  if (h) h.outerHTML = headerHTML();
  if (f) f.outerHTML = footerHTML();
})();
