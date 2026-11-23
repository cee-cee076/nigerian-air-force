/* ==========================================================================
   NIGERIAN AIR FORCE — Core interactions & motion
   Runs on every page after layout.js. No dependencies.
   ========================================================================== */
(function () {
  "use strict";

  const root = document.documentElement;
  root.classList.add("js");

  /* ---------- Missing-image fallback (photos not yet downloaded) ---------- */
  document.addEventListener("error", (e) => {
    const img = e.target;
    if (!(img instanceof HTMLImageElement) || img.dataset.fallback) return;
    img.dataset.fallback = "1";
    img.classList.remove("lazy-pending");
    const ac = img.dataset.bp && window.NAF_FLEET && window.NAF_FLEET.find((a) => a.id === img.dataset.bp);
    if (ac) {
      if (ac.typeImg && !img.dataset.triedType) { img.dataset.triedType = "1"; delete img.dataset.fallback; img.src = ac.typeImg;
        if (img.parentElement.classList.contains("card-media") && !img.parentElement.querySelector(".photo-note")) img.insertAdjacentHTML("afterend", '<span class="photo-note">Type photo · not NAF markings</span>');
        return; }
      img.outerHTML = window.NAF_blueprint(ac); return;
    }
    const tile = img.closest("[data-hide-if-missing]");
    if (tile) { tile.remove(); return; }
    img.src = "img/fallback.svg";
  }, true);
  // images that already failed before this script ran
  document.querySelectorAll("img").forEach((img) => {
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) img.dispatchEvent(new Event("error"));
  });
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Intro loader (first visit per session only) ---------- */
  (function loader() {
    let seen = false;
    try { seen = sessionStorage.getItem("naf-intro") === "1"; sessionStorage.setItem("naf-intro", "1"); } catch (e) { seen = true; }
    if (seen || reduceMotion) return;
    const el = document.createElement("div");
    el.className = "intro-loader";
    el.innerHTML = '<div class="inner"><img src="img/emblem.svg" alt=""><div class="bar"><span></span></div><div class="mono">NIGERIAN AIR FORCE</div></div>';
    document.body.appendChild(el);
    window.addEventListener("load", () => setTimeout(() => { el.classList.add("done"); setTimeout(() => el.remove(), 900); }, 600));
    setTimeout(() => el.classList.add("done"), 3500); // failsafe
  })();

  /* ---------- Header: scrolled state, hide on scroll down ---------- */
  const header = $(".site-header");
  const progress = $(".scroll-progress");
  const toTop = $(".to-top");
  let lastY = window.scrollY;
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (header) {
      header.classList.toggle("is-scrolled", y > 40);
      const menuOpen = document.body.classList.contains("menu-open");
      header.classList.toggle("is-hidden", !menuOpen && y > 400 && y > lastY + 4);
      if (y < lastY - 4) header.classList.remove("is-hidden");
    }
    if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (toTop) toTop.classList.toggle("show", y > 900);
    lastY = y;
    parallax();
    ticking = false;
  }
  window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  /* ---------- Mobile menu ---------- */
  const toggle = $(".menu-toggle");
  const mobileMenu = $("#mobile-menu");
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    document.body.classList.toggle("no-scroll", open);
    if (toggle) { toggle.setAttribute("aria-expanded", String(open)); toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu"); }
    if (mobileMenu) mobileMenu.setAttribute("aria-hidden", String(!open));
  }
  if (toggle) toggle.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  if (mobileMenu) mobileMenu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  window.addEventListener("resize", () => { if (window.innerWidth >= 1200) setMenu(false); });

  /* ---------- Split headlines into masked words ---------- */
  $$("[data-split]").forEach((el) => {
    const base = parseFloat(el.dataset.splitDelay || 0);
    let i = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            const w = document.createElement("span");
            w.className = "split-word";
            w.innerHTML = `<span style="--d:${(base + i++ * 0.06).toFixed(2)}s">${part}</span>`;
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
      });
    };
    walk(el);
    if (!el.hasAttribute("data-reveal")) el.setAttribute("data-reveal", "fade");
  });

  /* ---------- Stagger children ---------- */
  $$("[data-stagger]").forEach((parent) => {
    const step = parseFloat(parent.dataset.stagger) || 0.08;
    $$(":scope > *", parent).forEach((child, i) => {
      if (!child.hasAttribute("data-reveal")) child.setAttribute("data-reveal", parent.dataset.staggerType || "up");
      child.style.setProperty("--d", `${(i * step).toFixed(2)}s`);
    });
  });
  $$("[data-delay]").forEach((el) => el.style.setProperty("--d", `${el.dataset.delay}s`));

  /* ---------- Reveal on scroll ---------- */
  const revealIO = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-visible");
          e.target.dispatchEvent(new CustomEvent("revealed"));
          revealIO.unobserve(e.target);
        });
      }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" })
    : null;
  window.NAF_observe = (el) => { if (revealIO) revealIO.observe(el); else el.classList.add("is-visible"); };
  $$("[data-reveal], .timeline li").forEach(window.NAF_observe);

  /* ---------- Counters ---------- */
  function runCounter(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = (el.dataset.count.split(".")[1] || "").length;
    const dur = parseInt(el.dataset.duration || 2200, 10);
    const out = el.querySelector(".num") || el;
    if (reduceMotion) { out.textContent = target.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }); return; }
    const t0 = performance.now();
    const ease = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      out.textContent = (target * ease(p)).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  const countIO = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { runCounter(e.target); countIO.unobserve(e.target); } });
  }, { threshold: 0.5 }) : null;
  $$("[data-count]").forEach((el) => (countIO ? countIO.observe(el) : runCounter(el)));

  /* ---------- Progress bars ---------- */
  const barIO = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.style.width = e.target.dataset.progress + "%"; barIO.unobserve(e.target); } });
  }, { threshold: 0.3 }) : null;
  window.NAF_bars = (scope = document) => $$("[data-progress]", scope).forEach((el) => (barIO ? barIO.observe(el) : (el.style.width = el.dataset.progress + "%")));
  window.NAF_bars();

  /* ---------- Timeline progress line ---------- */
  $$(".timeline").forEach((tl) => {
    const line = document.createElement("span");
    line.className = "tl-progress";
    tl.prepend(line);
    const update = () => {
      const r = tl.getBoundingClientRect();
      const p = Math.min(Math.max((window.innerHeight * 0.6 - r.top) / r.height, 0), 1);
      line.style.height = `${p * 100}%`;
    };
    window.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
    update();
  });

  /* ---------- Parallax ---------- */
  const parallaxEls = $$("[data-parallax]");
  function parallax() {
    if (reduceMotion) return;
    const vh = window.innerHeight;
    parallaxEls.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const speed = parseFloat(el.dataset.parallax) || 0.2;
      const offset = (r.top + r.height / 2 - vh / 2) * -speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });
  }

  /* ---------- 3D tilt ---------- */
  window.NAF_tilt = (scope = document) => {
    if (!finePointer || reduceMotion) return;
    $$("[data-tilt]", scope).forEach((card) => {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = "1";
      const max = parseFloat(card.dataset.tilt) || 8;
      let raf = null;
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transition = "transform 0.12s linear";
          card.style.transform = `perspective(1000px) rotateX(${((0.5 - y) * max).toFixed(2)}deg) rotateY(${((x - 0.5) * max).toFixed(2)}deg) translateZ(0)`;
          card.style.setProperty("--gx", `${x * 100}%`);
          card.style.setProperty("--gy", `${y * 100}%`);
        });
      });
      card.addEventListener("pointerleave", () => {
        cancelAnimationFrame(raf);
        card.style.transition = "";
        card.style.transform = "";
      });
    });
  };
  window.NAF_tilt();

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduceMotion) {
    $$("[data-magnetic]").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
      });
      btn.addEventListener("pointerleave", () => (btn.style.transform = ""));
    });
  }

  /* ---------- Clock (West Africa Time, UTC+1) ---------- */
  const clocks = $$("[data-clock]");
  if (clocks.length) {
    const tickClock = () => {
      const d = new Date(Date.now() + 3600000);
      const t = d.toISOString().substr(11, 8);
      clocks.forEach((c) => (c.textContent = `${t} WAT`));
    };
    tickClock();
    setInterval(tickClock, 1000);
  }

  /* ---------- Overlays: modal + lightbox ---------- */
  let lastFocus = null;
  window.NAF_openOverlay = (overlay) => {
    lastFocus = document.activeElement;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    const f = overlay.querySelector(".modal-close, button, a");
    if (f) setTimeout(() => f.focus(), 50);
  };
  window.NAF_closeOverlay = (overlay) => {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (lastFocus) lastFocus.focus();
  };
  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-open]");
    if (opener) { const o = document.getElementById(opener.dataset.open); if (o) { e.preventDefault(); window.NAF_openOverlay(o); } }
    const closer = e.target.closest("[data-close]");
    if (closer) window.NAF_closeOverlay(closer.closest(".overlay"));
    if (e.target.classList.contains("overlay")) window.NAF_closeOverlay(e.target);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const open = $(".overlay.open");
    if (open) window.NAF_closeOverlay(open);
    else if (document.body.classList.contains("menu-open")) setMenu(false);
  });

  /* Lightbox for [data-lightbox] links (grouped) */
  (function lightbox() {
    const triggers = () => $$("[data-lightbox]:not(.is-hidden)");
    if (!$("[data-lightbox]")) return;
    const lb = document.createElement("div");
    lb.className = "overlay lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-hidden", "true");
    lb.innerHTML = `<button class="modal-close" data-close aria-label="Close"><i class="bi bi-x-lg"></i></button>
      <button class="lb-nav lb-prev" aria-label="Previous"><i class="bi bi-chevron-left"></i></button>
      <figure><img alt=""><figcaption><span class="mono"></span><span class="cap"></span></figcaption></figure>
      <button class="lb-nav lb-next" aria-label="Next"><i class="bi bi-chevron-right"></i></button>`;
    document.body.appendChild(lb);
    const img = $("img", lb);
    let list = [];
    let idx = 0;
    const show = (i) => {
      idx = (i + list.length) % list.length;
      const a = list[idx];
      img.style.opacity = 0;
      const next = new Image();
      next.onload = () => { img.src = next.src; img.alt = a.dataset.caption || ""; img.style.opacity = 1; };
      next.src = a.getAttribute("href");
      $(".mono", lb).textContent = `${a.dataset.tag || "NAF"} · ${idx + 1} / ${list.length}`;
      $(".cap", lb).textContent = a.dataset.caption || "";
    };
    document.addEventListener("click", (e) => {
      const a = e.target.closest("[data-lightbox]");
      if (!a) return;
      e.preventDefault();
      list = triggers().filter((t) => t.dataset.lightbox === a.dataset.lightbox);
      show(list.indexOf(a));
      window.NAF_openOverlay(lb);
    });
    $(".lb-prev", lb).addEventListener("click", () => show(idx - 1));
    $(".lb-next", lb).addEventListener("click", () => show(idx + 1));
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
    let sx = null;
    lb.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
    lb.addEventListener("touchend", (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      sx = null;
    });
  })();

  /* ---------- Toast ---------- */
  window.NAF_toast = (msg) => {
    const t = $(".toast-gaf");
    if (!t) return;
    $("span", t).textContent = msg;
    t.classList.add("show");
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove("show"), 4200);
  };

  /* ---------- Lazy images fade in ---------- */
  $$("img[loading='lazy']").forEach((img) => {
    if (img.complete) return;
    img.classList.add("lazy-pending");
    const done = () => img.classList.remove("lazy-pending");
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
  });

  onScroll();
})();
