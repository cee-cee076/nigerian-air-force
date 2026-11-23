/* ==========================================================================
   NIGERIAN AIR FORCE — Rank data + stylised insignia renderer
   Officer insignia follow the Commonwealth air force pattern (stripes);
   other-rank insignia use chevrons / coat of arms. Drawings are stylised.
   ========================================================================== */
window.NAF_RANKS = {
  officers: [
    { name: "Marshal of the Air Force", abbr: "MAF", code: "OF-10", ins: "w4", note: "Ceremonial / honorary five-star rank" },
    { name: "Air Chief Marshal", abbr: "ACM", code: "OF-9", ins: "w3", note: "Four-star; typically Chief of Defence Staff" },
    { name: "Air Marshal", abbr: "AM", code: "OF-8", ins: "w2", note: "Three-star; Chief of the Air Staff" },
    { name: "Air Vice Marshal", abbr: "AVM", code: "OF-7", ins: "w1", note: "Two-star; branch chiefs and AOCs" },
    { name: "Air Commodore", abbr: "AIR CDRE", code: "OF-6", ins: "w0", note: "One-star; directors and group commanders" },
    { name: "Group Captain", abbr: "GP CAPT", code: "OF-5", ins: "m4", note: "Base or group command" },
    { name: "Wing Commander", abbr: "WG CDR", code: "OF-4", ins: "m3", note: "Wing or squadron command" },
    { name: "Squadron Leader", abbr: "SQN LDR", code: "OF-3", ins: "m2t", note: "Flight / squadron leadership" },
    { name: "Flight Lieutenant", abbr: "FLT LT", code: "OF-2", ins: "m2", note: "Experienced junior officer" },
    { name: "Flying Officer", abbr: "FG OFFR", code: "OF-1", ins: "m1", note: "Junior officer" },
    { name: "Pilot Officer", abbr: "PLT OFFR", code: "OF-1", ins: "t1", note: "Entry commissioned rank" }
  ],
  others: [
    { name: "Air Warrant Officer", abbr: "AWO", code: "OR-9", ins: "arms-wreath", note: "Most senior other rank" },
    { name: "Master Warrant Officer", abbr: "MWO", code: "OR-8", ins: "arms-star", note: "Senior warrant appointment" },
    { name: "Warrant Officer", abbr: "WO", code: "OR-8", ins: "arms", note: "Senior technical and leadership authority" },
    { name: "Flight Sergeant", abbr: "FS", code: "OR-7", ins: "c3s", note: "Senior NCO; section leader" },
    { name: "Sergeant", abbr: "SGT", code: "OR-6", ins: "c3", note: "NCO supervisor" },
    { name: "Corporal", abbr: "CPL", code: "OR-4", ins: "c2", note: "Junior NCO; team lead" },
    { name: "Lance Corporal", abbr: "LCPL", code: "OR-3", ins: "c1", note: "First NCO step" },
    { name: "Aircraftman / Aircraftwoman", abbr: "ACM / ACW", code: "OR-1", ins: "none", note: "Entry rank on completion of basic training" }
  ]
};

window.NAF_insignia = function (code) {
  const bar = (cls) => `<span class="bar ${cls}"></span>`;
  const chev = (n, star) => {
    let p = "";
    for (let i = 0; i < n; i++) p += `<path d="M3 ${6 + i * 7}l14 7 14-7" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>`;
    if (star) p = `<path d="M17 0l1.6 3.3 3.6.5-2.6 2.5.6 3.6L17 8.2l-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" fill="currentColor"/>` + p.replace(/M3 (\d+)/g, (m, y) => `M3 ${+y + 6}`).replace(/l14 7/g, "l14 6");
    return `<svg viewBox="0 0 34 ${star ? 32 : 30}" aria-hidden="true">${p}</svg>`;
  };
  const arms = (extra) => `<svg viewBox="0 0 34 30" aria-hidden="true">
      ${extra === "wreath" ? '<path d="M5 22c-3-6-2-13 3-17M29 22c3-6 2-13-3-17" fill="none" stroke="currentColor" stroke-width="2"/>' : ""}
      <path d="M17 4l9 4v7c0 6-4 9-9 11-5-2-9-5-9-11V8z" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M12 10l5 6 5-6M17 16v6" fill="none" stroke="currentColor" stroke-width="2"/>
      ${extra === "star" ? '<circle cx="17" cy="1.8" r="1.8" fill="currentColor"/>' : ""}
    </svg>`;
  let inner = "";
  if (code[0] === "w") { inner = bar("wide"); for (let i = 0; i < +code[1]; i++) inner += bar(""); }
  else if (code === "m2t") inner = bar("") + bar("thin") + bar("");
  else if (code[0] === "m") for (let i = 0; i < +code[1]; i++) inner += bar("");
  else if (code === "t1") inner = bar("thin");
  else if (code === "c3s") inner = chev(3, true);
  else if (code[0] === "c") inner = chev(+code[1]);
  else if (code === "arms") inner = arms();
  else if (code === "arms-star") inner = arms("star");
  else if (code === "arms-wreath") inner = arms("wreath");
  else inner = '<span class="mono" style="font-size:.55rem;color:var(--dim)">—</span>';
  return `<span class="insignia" aria-hidden="true">${inner}</span>`;
};
