/* ==========================================================================
   NIGERIAN AIR FORCE — Home page: hero slider, depth, ticker, showcase
   ========================================================================== */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Hero slider (keeps original carousel images) ---------- */
  const slides = $$(".hero-slide");
  const caps = $$(".hero-caption > div");
  const dots = $$(".slide-nav button");
  const DUR = 7000;
  let current = 0;
  let timer = null;
  document.documentElement.style.setProperty("--slide-dur", DUR / 1000 + "s");

  function go(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle("active", k === current));
    caps.forEach((c, k) => c.classList.toggle("active", k === current));
    dots.forEach((d, k) => {
      d.classList.remove("active");
      d.setAttribute("aria-selected", String(k === current));
    });
    void dots[current].offsetWidth; // restart the fill animation
    dots[current].classList.add("active");
    // re-run headline mask animation on the incoming caption
    const h = caps[current].querySelector("h1, h2");
    if (h && h.dataset.split === undefined) {
      h.animate([{ opacity: 0, transform: "translateY(30px)" }, { opacity: 1, transform: "none" }], { duration: 900, easing: "cubic-bezier(.22,1,.36,1)" });
    }
    restart();
  }
  function restart() {
    clearTimeout(timer);
    if (!reduceMotion) timer = setTimeout(() => go(current + 1), DUR);
  }
  dots.forEach((d, i) => d.addEventListener("click", () => go(i)));
  document.addEventListener("keydown", (e) => {
    if ($(".overlay.open") || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    const heroVisible = window.scrollY < window.innerHeight * 0.6;
    if (!heroVisible) return;
    if (e.key === "ArrowRight") go(current + 1);
    if (e.key === "ArrowLeft") go(current - 1);
  });
  // swipe on touch
  const hero = $(".hero");
  let sx = null;
  hero.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
  hero.addEventListener("touchend", (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 60) go(current + (dx < 0 ? 1 : -1));
    sx = null;
  });
  // pause when tab hidden
  document.addEventListener("visibilitychange", () => (document.hidden ? clearTimeout(timer) : restart()));
  // lazily promote the other slide images once the first has painted
  window.addEventListener("load", () => $$(".hero-slide img[loading='lazy']").forEach((img) => img.removeAttribute("loading")));
  restart();

  /* ---------- Hero pointer depth (layered 3D parallax) ---------- */
  if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const layers = $$("[data-depth]", hero);
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    hero.addEventListener("pointerleave", () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
    function loop() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      layers.forEach((l) => {
        const d = parseFloat(l.dataset.depth);
        const extra = l.classList.contains("hero-hud") ? " translateY(-40%)" : "";
        l.style.transform = `translate3d(${(-cx * 24 * d).toFixed(2)}px, ${(-cy * 18 * d).toFixed(2)}px, 0) rotateY(${(cx * 6 * d).toFixed(2)}deg) rotateX(${(-cy * 4 * d).toFixed(2)}deg)${extra}`;
      });
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(loop) : null;
    }
  }

  /* ---------- Ticker ---------- */
  const updates = [
    ["NOV 2026", "CAS approves redeployment of senior officers across HQ NAF and operational commands"],
    ["NOV 2026", "Air component of Operation Hadin Kai sustains round-the-clock ISR coverage"],
    ["OCT 2026", "Mobility Command airlifts relief materials to flood-affected communities"],
    ["OCT 2026", "Recruitment into the NAF is FREE — beware of fraudsters requesting payment"],
    ["SEP 2026", "Air Training Command graduates new set of student pilots"],
    ["SEP 2026", "NAF medical outreach provides free healthcare to rural communities"]
  ];
  const ticker = $("#ticker");
  if (ticker) {
    const html = updates.map(([d, t]) => `<span class="ticker-item"><time>${d}</time>${t}</span>`).join("");
    ticker.innerHTML = html + html.replace(/class="ticker-item"/g, 'class="ticker-item" aria-hidden="true"');
  }

  /* ---------- Fleet showcase (3D stage) ---------- */
  const picks = ["jf17", "a29", "mi35", "c130", "atr42"];
  const data = picks.map((id) => window.NAF_FLEET.find((a) => a.id === id)).filter(Boolean);
  const tabs = $("#showcaseTabs");
  const frame = $("#stageFrame");
  const specs = $("#stageSpecs");
  if (!tabs || !data.length) return;

  tabs.innerHTML = data.map((a, i) => `
    <button class="showcase-tab${i === 0 ? " active" : ""}" role="tab" aria-selected="${i === 0}" data-i="${i}">
      <span class="n">0${i + 1}</span>
      <span><strong>${a.name}</strong><small>${a.role}</small></span>
    </button>`).join("");

  function render(a) {
    const media = a.img ? `<img src="${a.img}" data-bp="${a.id}" alt="${a.name} of the Nigerian Air Force">` : window.NAF_blueprint(a);
    frame.innerHTML = `${media}<div class="stage-title"><span class="badge-gaf status-active">${a.status}</span><h3>${a.name}</h3></div>`;
    specs.innerHTML = `
      <div class="spec-chip"><small>Max speed</small><strong>${window.NAF_fmt(a.speed)} km/h</strong></div>
      <div class="spec-chip"><small>Range</small><strong>${window.NAF_fmt(a.range)} km</strong></div>
      <div class="spec-chip"><small>Ceiling</small><strong>${window.NAF_fmt(a.ceiling)} m</strong></div>`;
  }
  render(data[0]);

  let swapping = false;
  tabs.addEventListener("click", (e) => {
    const b = e.target.closest(".showcase-tab");
    if (!b || b.classList.contains("active") || swapping) return;
    $$(".showcase-tab", tabs).forEach((t) => { t.classList.toggle("active", t === b); t.setAttribute("aria-selected", String(t === b)); });
    swapping = true;
    frame.classList.add("swap");
    setTimeout(() => {
      render(data[+b.dataset.i]);
      requestAnimationFrame(() => requestAnimationFrame(() => { frame.classList.remove("swap"); swapping = false; }));
    }, reduceMotion ? 0 : 420);
  });
})();
