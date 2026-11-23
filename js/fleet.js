/* ==========================================================================
   NIGERIAN AIR FORCE — Fleet page: filter, search, detail, compare
   ========================================================================== */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const FLEET = window.NAF_FLEET;
  const CATS = window.NAF_CATS;
  const fmt = window.NAF_fmt;
  const max = { speed: Math.max(...FLEET.map((a) => a.speed)), range: Math.max(...FLEET.map((a) => a.range)), ceiling: Math.max(...FLEET.map((a) => a.ceiling)) };

  const grid = $("#fleetGrid");
  const filters = $("#catFilters");
  const search = $("#fleetSearch");
  const count = $("#resultCount");
  let cat = (location.hash || "").replace("#", "");
  if (!CATS[cat]) cat = "all";
  let query = "";
  const compare = [];

  const media = (a) => (a.img ? `<img src="${a.img}" data-bp="${a.id}" alt="${a.name} of the Nigerian Air Force" loading="lazy">` : window.NAF_blueprint(a));
  const statusClass = (s) => (s === "Upcoming" ? "status-training" : "status-active");

  /* ---------- Filters ---------- */
  const catCount = (k) => (k === "all" ? FLEET.length : FLEET.filter((a) => a.cat === k).length);
  filters.innerHTML = [["all", "All aircraft"], ...Object.entries(CATS).map(([k, v]) => [k, v.label])]
    .map(([k, l]) => `<button class="chip${k === cat ? " active" : ""}" data-cat="${k}" aria-pressed="${k === cat}">${l}<span class="count">${catCount(k)}</span></button>`).join("");

  /* ---------- Cards ---------- */
  grid.innerHTML = FLEET.map((a) => `
    <div class="col-sm-6 col-xl-4" data-id="${a.id}" data-cat="${a.cat}" data-reveal="up">
      <article class="card-gaf aircraft-card" data-tilt="5" tabindex="0" aria-label="${a.name}, ${a.role}">
        <div class="card-media">
          ${media(a)}
          <span class="badge-gaf ${statusClass(a.status)}">${a.status}</span>
          ${a.photo === "type" ? '<span class="photo-note">Type photo · not NAF markings</span>' : ""}
          <span class="badge-gaf plain cat"><i class="bi ${CATS[a.cat].icon}"></i> ${CATS[a.cat].label.split(" ")[0]}</span>
        </div>
        <div class="card-body-gaf">
          <h3>${a.name}</h3>
          <div class="role">${a.role}</div>
          <div class="spec-row">
            <div><strong>${fmt(a.speed)}</strong><span>km/h</span></div>
            <div><strong>${fmt(a.range)}</strong><span>km range</span></div>
            <div><strong>${fmt(a.ceiling)}</strong><span>m ceiling</span></div>
          </div>
          <div class="card-actions">
            <span class="link-arrow">Details <i class="bi bi-arrow-right"></i></span>
            <button class="compare-toggle" data-compare="${a.id}" aria-pressed="false"><i class="bi bi-plus-lg"></i> Compare</button>
          </div>
        </div>
      </article>
    </div>`).join("");
  $$("[data-reveal]", grid).forEach((el, i) => { el.style.setProperty("--d", `${(i % 3) * 0.08}s`); window.NAF_observe(el); });
  window.NAF_tilt(grid);

  function apply() {
    let n = 0;
    $$(":scope > div", grid).forEach((col) => {
      const a = FLEET.find((x) => x.id === col.dataset.id);
      const hay = `${a.name} ${a.role} ${a.origin} ${a.caps.join(" ")}`.toLowerCase();
      const show = (cat === "all" || a.cat === cat) && (!query || hay.includes(query));
      col.classList.toggle("is-hidden", !show);
      if (show) { n++; col.classList.add("is-visible"); }
    });
    count.textContent = `${n} aircraft · ${cat === "all" ? "All categories" : CATS[cat].label}`;
  }
  filters.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    cat = b.dataset.cat;
    $$(".chip", filters).forEach((c) => { c.classList.toggle("active", c === b); c.setAttribute("aria-pressed", String(c === b)); });
    history.replaceState(null, "", cat === "all" ? location.pathname : `#${cat}`);
    apply();
  });
  search.addEventListener("input", () => { query = search.value.trim().toLowerCase(); apply(); });
  apply();

  /* ---------- Detail modal ---------- */
  const detail = $("#detailModal");
  function openDetail(a) {
    $("#detailContent").innerHTML = `
      <div class="detail-media">${a.img ? `<img src="${a.img}" data-bp="${a.id}" alt="${a.name}">` : window.NAF_blueprint(a)}</div>
      <div class="detail-body">
        <span class="badge-gaf ${statusClass(a.status)}">${a.status}</span>
        <h2 id="detailTitle" class="mt-3">${a.name}</h2>
        <div class="role" style="color:var(--gold);font-weight:600;letter-spacing:.08em;text-transform:uppercase;font-size:.85rem">${a.role}</div>
        <p class="mt-3" style="max-width:70ch">${a.summary}</p>
        <div class="row gy-4 mt-1">
          <div class="col-md-6">
            <div class="spec-bars">
              ${bar("Max speed", a.speed, max.speed, "km/h")}
              ${bar("Range", a.range, max.range, "km")}
              ${bar("Service ceiling", a.ceiling, max.ceiling, "m")}
            </div>
            <h4 class="h5 mt-4 mb-3">Capabilities</h4>
            <div class="tag-list">${a.caps.map((c) => `<span>${c}</span>`).join("")}</div>
          </div>
          <div class="col-md-6">
            <table class="spec-table"><tbody>
              <tr><td>Category</td><td>${CATS[a.cat].label}</td></tr>
              <tr><td>Crew</td><td>${a.crew}</td></tr>
              <tr><td>Powerplant</td><td>${a.engine}</td></tr>
              <tr><td>Origin</td><td>${a.origin}</td></tr>
              <tr><td>In NAF service</td><td>${a.inducted}</td></tr>
            </tbody></table>
            <button class="btn-gaf btn-sm-gaf mt-4" data-compare-from="${a.id}">Add to compare <i class="bi bi-arrow-left-right"></i></button>
          </div>
        </div>
      </div>`;
    window.NAF_openOverlay(detail);
    setTimeout(() => $$(".spec-bar .track span", detail).forEach((s) => (s.style.width = s.dataset.w + "%")), 200);
  }
  const bar = (label, v, m, u) => `<div class="spec-bar"><div class="top"><span>${label}</span><strong>${fmt(v)} ${u}</strong></div><div class="track"><span data-w="${Math.max(4, (v / m) * 100).toFixed(1)}"></span></div></div>`;

  grid.addEventListener("click", (e) => {
    const cmp = e.target.closest("[data-compare]");
    if (cmp) { e.stopPropagation(); toggleCompare(cmp.dataset.compare); return; }
    const card = e.target.closest(".aircraft-card");
    if (card) openDetail(FLEET.find((a) => a.id === card.parentElement.dataset.id));
  });
  grid.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("aircraft-card")) {
      e.preventDefault();
      openDetail(FLEET.find((a) => a.id === e.target.parentElement.dataset.id));
    }
  });
  detail.addEventListener("click", (e) => {
    const b = e.target.closest("[data-compare-from]");
    if (!b) return;
    if (!compare.includes(b.dataset.compareFrom)) toggleCompare(b.dataset.compareFrom);
    window.NAF_closeOverlay(detail);
  });

  /* ---------- Compare ---------- */
  const tray = $("#compareTray");
  const slots = $("#compareSlots");
  const go = $("#compareGo");
  function toggleCompare(id) {
    const i = compare.indexOf(id);
    if (i > -1) compare.splice(i, 1);
    else { if (compare.length === 2) compare.shift(); compare.push(id); }
    syncCompare();
  }
  function syncCompare() {
    $$("[data-compare]", grid).forEach((b) => {
      const on = compare.includes(b.dataset.compare);
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", String(on));
      b.innerHTML = on ? '<i class="bi bi-check-lg"></i> Selected' : '<i class="bi bi-plus-lg"></i> Compare';
    });
    slots.innerHTML = [0, 1].map((k) => {
      const a = FLEET.find((x) => x.id === compare[k]);
      return `<span class="slot${a ? " filled" : ""}">${a ? a.name : "Select aircraft"}</span>`;
    }).join("");
    tray.classList.toggle("show", compare.length > 0);
    go.disabled = compare.length < 2;
  }
  $("#compareClear").addEventListener("click", () => { compare.length = 0; syncCompare(); });
  go.addEventListener("click", () => {
    const [a, b] = compare.map((id) => FLEET.find((x) => x.id === id));
    const row = (label, k, u) => {
      const m = Math.max(a[k], b[k]);
      const w = (v) => ((v / m) * 100).toFixed(1);
      return `<div class="cmp-row">
        <div class="a ${a[k] >= b[k] ? "win" : ""}">${fmt(a[k])} ${u}<div class="cmp-bar"><span data-w="${w(a[k])}"></span></div></div>
        <div class="lbl">${label}</div>
        <div class="b ${b[k] >= a[k] ? "win" : ""}">${fmt(b[k])} ${u}<div class="cmp-bar"><span data-w="${w(b[k])}"></span></div></div>
      </div>`;
    };
    const txt = (label, k) => `<div class="cmp-row"><div class="a">${a[k]}</div><div class="lbl">${label}</div><div class="b">${b[k]}</div></div>`;
    const side = (x) => `<div><div class="media">${x.img ? `<img src="${x.img}" data-bp="${x.id}" alt="${x.name}">` : window.NAF_blueprint(x)}</div><h3 class="h4 mb-1">${x.name}</h3><div style="color:var(--gold);font-size:.8rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em">${x.role}</div></div>`;
    $("#compareContent").innerHTML = `
      <span class="eyebrow">Side-by-side</span>
      <div class="compare-grid mb-4">${side(a)}<div class="vs">VS</div>${side(b)}</div>
      ${row("Max speed", "speed", "km/h")}${row("Range", "range", "km")}${row("Ceiling", "ceiling", "m")}
      ${txt("Role", "role")}${txt("Crew", "crew")}${txt("Powerplant", "engine")}${txt("Origin", "origin")}${txt("In service", "inducted")}`;
    window.NAF_openOverlay($("#compareModal"));
    setTimeout(() => $$("#compareContent .cmp-bar span").forEach((s) => (s.style.width = s.dataset.w + "%")), 250);
  });
  syncCompare();
})();
