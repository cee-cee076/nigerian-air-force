/* ==========================================================================
   NIGERIAN AIR FORCE — Aircraft data (shared by Home showcase + Fleet page)
   Figures are public, approximate manufacturer/open-source values.
   img: photo path. photo: "type" = same aircraft type in another operator's markings.
   typeImg: type photo used if the NAF photo has not been downloaded. img: null → blueprint card.
   ========================================================================== */
window.NAF_FLEET = [
  /* ---------- Combat / Attack ---------- */
  { id: "jf17", name: "JF-17 Thunder", role: "Multirole Fighter", cat: "combat", shape: "jet", status: "In service",
    img: "img/naf/jf17.jpg", typeImg: "img/types/jf17.jpg", origin: "Pakistan / China", inducted: "2021",
    speed: 1960, range: 3480, ceiling: 16900, crew: "1", engine: "1 × Klimov RD-93 turbofan",
    summary: "The NAF's most modern fighter, inducted in 2021 to strengthen air defence and precision strike across the North-East and North-West theatres.",
    caps: ["Air defence", "Precision strike", "Beyond-visual-range missiles", "Air-to-ground PGMs"] },
  { id: "f7ni", name: "Chengdu F-7NI / FT-7NI", role: "Interceptor / Conversion Trainer", cat: "combat", shape: "jet", status: "In service",
    img: "img/naf/f7ni.jpg", typeImg: "img/types/f7.jpg", origin: "China", inducted: "2009",
    speed: 2200, range: 2200, ceiling: 17500, crew: "1 (FT-7NI: 2)", engine: "1 × WP-13F turbojet",
    summary: "A Mach 2 delta-wing interceptor tasked with airspace sovereignty and quick-reaction alert, with the twin-seat FT-7NI used for type conversion.",
    caps: ["Quick-reaction alert", "Airspace policing", "Air-to-air missiles", "Pilot conversion"] },
  { id: "a29", name: "A-29 Super Tucano", role: "Light Attack / COIN", cat: "combat", shape: "prop", status: "In service",
    img: "img/naf/a29-naf-2041.jpg", origin: "Brazil / USA", inducted: "2021",
    speed: 590, range: 2855, ceiling: 10670, crew: "2", engine: "1 × Pratt & Whitney PT6A-68C turboprop",
    summary: "Twelve aircraft delivered in 2021, purpose-built for counter-insurgency with long loiter time, precision munitions and advanced ISR sensors.",
    caps: ["Close air support", "Laser-guided bombs", "Day/night FLIR", "Long loiter"] },
  { id: "alphajet", name: "Alpha Jet", role: "Light Attack / Advanced Trainer", cat: "combat", shape: "jet", status: "In service",
    img: "img/naf/alphajet-1.jpg", typeImg: "img/types/alphajet.jpg", origin: "France / Germany", inducted: "1981",
    speed: 1000, range: 2940, ceiling: 14630, crew: "2", engine: "2 × SNECMA Larzac 04 turbofans",
    summary: "A long-serving workhorse that combines advanced jet training with ground-attack missions in internal security operations.",
    caps: ["Advanced jet training", "Ground attack", "Rocket pods", "Gun pod"] },
  { id: "l39", name: "Aero L-39ZA Albatros", role: "Jet Trainer / Light Attack", cat: "combat", shape: "jet", status: "In service",
    img: "img/naf/l39-1.jpg", typeImg: "img/types/l39.jpg", origin: "Czech Republic", inducted: "1986",
    speed: 750, range: 1100, ceiling: 11000, crew: "2", engine: "1 × Ivchenko AI-25TL turbofan",
    summary: "Jet trainer with an under-fuselage cannon and hardpoints, used for lead-in fighter training and light strike tasks.",
    caps: ["Lead-in fighter training", "Light strike", "23 mm cannon"] },
  { id: "t129", name: "T-129 ATAK", role: "Attack Helicopter", cat: "combat", shape: "heli", status: "In service",
    img: "img/types/t129.jpg", photo: "type", origin: "Türkiye", inducted: "2024",
    speed: 281, range: 537, ceiling: 6100, crew: "2", engine: "2 × LHTEC CTS800-4A turboshafts",
    summary: "A modern tandem-seat attack helicopter delivering precise firepower and armed reconnaissance in support of ground forces.",
    caps: ["Armed reconnaissance", "Anti-armour", "20 mm turret", "EO/IR sensor"] },
  { id: "mi35", name: "Mi-35 / Mi-24", role: "Attack Helicopter", cat: "combat", shape: "heli", status: "In service",
    img: "img/naf/mi35-1.jpg", typeImg: "img/types/mi35.jpg", origin: "Russia", inducted: "1980s / 2016 (Mi-35M)",
    speed: 310, range: 450, ceiling: 4900, crew: "2–3", engine: "2 × Klimov TV3-117 turboshafts",
    summary: "The heavily armoured 'flying tank' — a combat-proven gunship able to carry troops while delivering close air support.",
    caps: ["Close air support", "Troop insertion", "Rockets & ATGMs", "Armoured cockpit"] },
  { id: "m346", name: "M-346FA", role: "Fighter-Attack / Lead-in Trainer", cat: "combat", shape: "jet", status: "Upcoming",
    img: "img/types/m346.jpg", photo: "type", origin: "Italy", inducted: "On order",
    speed: 1090, range: 1925, ceiling: 13715, crew: "1–2", engine: "2 × Honeywell F124 turbofans",
    summary: "A fighter-attack derivative of the M-346 advanced trainer, set to bridge pilot training and frontline combat capability.",
    caps: ["Lead-in fighter training", "Light combat", "Radar-equipped", "Embedded tactical training"] },
  { id: "ah1z", name: "AH-1Z Viper", role: "Attack Helicopter", cat: "combat", shape: "heli", status: "Upcoming",
    img: "img/naf/ah1z-cas-visit.jpg", photo: "naf-visit", origin: "USA", inducted: "Approved",
    speed: 411, range: 685, ceiling: 6100, crew: "2", engine: "2 × GE T700-401C turboshafts",
    summary: "A twin-engine attack helicopter ordered for Nigeria, with production under way, to provide precision fires and escort for joint operations. Photo: NAF leadership inspects a US Marine Corps AH-1Z during a 2025 visit.",
    caps: ["Precision fires", "Escort", "Hellfire / APKWS", "Target sight system"] },

  /* ---------- Helicopters ---------- */
  { id: "aw109", name: "AW109 Trekker", role: "Light Utility / Armed Scout", cat: "rotary", shape: "heli", status: "In service",
    img: "img/naf/a109.jpg", typeImg: "img/types/aw109.jpg", origin: "Italy", inducted: "2010s",
    speed: 285, range: 850, ceiling: 4575, crew: "1–2 + 6", engine: "2 × Pratt & Whitney PW207C",
    summary: "Fast twin-engine helicopter configured for armed scouting, liaison and casualty evacuation. Photo shows an earlier NAF A109.",
    caps: ["Armed scout", "Liaison", "CASEVAC", "Night-vision compatible"] },
  { id: "mi17", name: "Mi-17 / Mi-171", role: "Medium Transport Helicopter", cat: "rotary", shape: "heli", status: "In service",
    img: "img/types/mi17.jpg", photo: "type", origin: "Russia", inducted: "2000s",
    speed: 250, range: 580, ceiling: 6000, crew: "3 + 24 troops", engine: "2 × Klimov TV3-117VM",
    summary: "The backbone of tactical airlift — moving troops, supplies and casualties into austere landing zones across the theatre.",
    caps: ["Troop lift", "Underslung cargo", "CASEVAC", "Door guns"] },
  { id: "aw139", name: "AW139", role: "Medium Utility / SAR", cat: "rotary", shape: "heli", status: "In service",
    img: "img/types/aw139.jpg", photo: "type", origin: "Italy", inducted: "2010s",
    speed: 306, range: 1060, ceiling: 6096, crew: "2 + 15", engine: "2 × Pratt & Whitney PT6C-67C",
    summary: "A versatile medium twin used for search and rescue, VIP transport and maritime support.",
    caps: ["Search & rescue", "VIP transport", "Hoist", "All-weather avionics"] },
  { id: "ec135", name: "EC135", role: "Light Twin / Training", cat: "rotary", shape: "heli", status: "In service",
    img: "img/types/ec135.jpg", photo: "type", origin: "Germany / France", inducted: "2010s",
    speed: 287, range: 635, ceiling: 6096, crew: "1–2 + 6", engine: "2 × Turbomeca Arrius 2B2",
    summary: "Light twin-engine helicopter used for rotary-wing training, liaison and surveillance tasks.",
    caps: ["Rotary training", "Liaison", "Surveillance"] },
  { id: "bell412", name: "Bell 412", role: "Utility Helicopter", cat: "rotary", shape: "heli", status: "In service",
    img: "img/types/bell412.jpg", photo: "type", origin: "USA / Canada", inducted: "2010s",
    speed: 259, range: 745, ceiling: 6096, crew: "2 + 13", engine: "2 × PT6T-3D TwinPac",
    summary: "Rugged four-blade utility helicopter for troop movement, logistics and humanitarian missions.",
    caps: ["Utility lift", "Humanitarian relief", "CASEVAC"] },

  /* ---------- Transport / Special Mission ---------- */
  { id: "c130", name: "C-130H Hercules", role: "Tactical Airlift", cat: "mobility", shape: "transport", status: "In service",
    img: "img/naf/c130-naf911.jpg", origin: "USA", inducted: "1975",
    speed: 592, range: 3800, ceiling: 10060, crew: "5 + 92 troops", engine: "4 × Allison T56-A-15 turboprops",
    summary: "The NAF's strategic lifeline — airlifting troops and cargo at home and supporting peacekeeping deployments across Africa.",
    caps: ["Tactical airlift", "Airdrop", "Peacekeeping support", "Humanitarian relief"] },
  { id: "do228", name: "Dornier 228", role: "Maritime Patrol / Utility", cat: "mobility", shape: "transport", status: "In service",
    img: "img/types/do228.jpg", photo: "type", origin: "Germany", inducted: "1980s",
    speed: 428, range: 2360, ceiling: 7620, crew: "2 + 19", engine: "2 × Honeywell TPE331 turboprops",
    summary: "STOL utility aircraft employed for light transport, maritime surveillance and ISR over the Gulf of Guinea.",
    caps: ["Maritime surveillance", "Light transport", "STOL operations"] },
  { id: "atr42", name: "ATR 42-500MP Surveyor", role: "Maritime Patrol", cat: "mobility", shape: "transport", status: "In service",
    img: "img/naf/atr42-naf930.webp", origin: "France / Italy", inducted: "2009",
    speed: 556, range: 2960, ceiling: 7620, crew: "6", engine: "2 × Pratt & Whitney PW127E",
    summary: "Long-endurance maritime patrol aircraft protecting Nigeria's exclusive economic zone and offshore oil infrastructure.",
    caps: ["Maritime patrol", "Search radar", "EO/IR turret", "Anti-piracy"] },
  { id: "kingair", name: "Super King Air 350i", role: "ISR / Utility Transport", cat: "mobility", shape: "transport", status: "In service",
    img: "img/naf/kingair.jpg", typeImg: "img/types/kingair.jpg", origin: "USA", inducted: "2010s",
    speed: 578, range: 3345, ceiling: 10670, crew: "2 + 11", engine: "2 × Pratt & Whitney PT6A-60A",
    summary: "Configured for intelligence, surveillance and reconnaissance with full-motion video, as well as liaison flights.",
    caps: ["ISR", "Full-motion video", "Liaison", "Medevac"] },
  { id: "citation", name: "Cessna Citation", role: "Executive / Liaison Jet", cat: "mobility", shape: "bizjet", status: "In service",
    img: "img/types/citation.jpg", photo: "type", origin: "USA", inducted: "2000s",
    speed: 770, range: 3800, ceiling: 13716, crew: "2 + 7", engine: "2 × Williams FJ44 turbofans",
    summary: "Light business jet for command liaison, VIP movement and aerial survey tasks.",
    caps: ["Command liaison", "VIP transport", "Survey"] },

  /* ---------- UAVs ---------- */
  { id: "tb2", name: "Bayraktar TB2", role: "MALE Armed UAV", cat: "uav", shape: "uav", status: "In service",
    img: "img/types/tb2.jpg", photo: "type", origin: "Türkiye", inducted: "2020s",
    speed: 220, range: 300, ceiling: 7620, crew: "Remote", engine: "1 × Rotax 912 piston",
    summary: "Medium-altitude long-endurance armed drone providing persistent surveillance and precision strike with smart micro-munitions.",
    caps: ["27 h endurance", "MAM-L smart munitions", "EO/IR targeting", "Persistent ISR"] },
  { id: "wingloong", name: "Wing Loong II", role: "MALE Armed UAV", cat: "uav", shape: "uav", status: "In service",
    img: "img/naf/wingloong-naf141.jpg", origin: "China", inducted: "2020",
    speed: 370, range: 1500, ceiling: 9000, crew: "Remote", engine: "1 × turboprop",
    summary: "Long-endurance strike UAV supporting counter-terrorism operations with a heavy precision payload.",
    caps: ["32 h endurance", "Satellite datalink", "Precision strike", "Wide-area ISR"] },
  { id: "ch4", name: "CH-4", role: "MALE Armed UAV", cat: "uav", shape: "uav", status: "In service",
    img: "img/types/ch4.jpg", photo: "type", origin: "China", inducted: "2014",
    speed: 235, range: 3500, ceiling: 8000, crew: "Remote", engine: "1 × piston",
    summary: "One of the first armed UAVs in NAF service, delivering persistent ISR and strike capability in the North-East.",
    caps: ["30 h endurance", "AR-1 missiles", "EO/IR", "Persistent ISR"] }
];

window.NAF_CATS = {
  combat: { label: "Combat / Attack", icon: "bi-crosshair" },
  rotary: { label: "Helicopters", icon: "bi-fan" },
  mobility: { label: "Transport & Special Mission", icon: "bi-box-seam" },
  uav: { label: "UAVs", icon: "bi-broadcast" }
};

/* Top-view blueprint silhouettes (original line art) */
window.NAF_SHAPES = {
  jet: '<path d="M100 8l7 34 3 30 52 34v12l-52-14-2 30 18 14v9l-26-7-26 7v-9l18-14-2-30-52 14v-12l52-34 3-30 7-34z"/>',
  prop: '<path d="M100 14l6 24 2 34 64 10v12l-64 8-2 34 22 10v8l-28-4-28 4v-8l22-10-2-34-64-8v-12l64-10 2-34 6-24z"/><path d="M84 12h32" stroke-width="3"/>',
  transport: '<path d="M100 10c6 0 9 8 9 18v40l80 20v10l-80-6v42l26 14v8l-35-6-35 6v-8l26-14v-42l-80 6v-10l80-20v-40c0-10 3-18 9-18z"/><path d="M50 84v10M70 80v10M130 80v10M150 84v10" stroke-width="3"/>',
  bizjet: '<path d="M100 12c5 0 7 8 7 16v46l62 26v10l-62-12v32l20 12v8l-27-5-27 5v-8l20-12v-32l-62 12v-10l62-26v-46c0-8 2-16 7-16z"/>',
  heli: '<circle cx="100" cy="70" r="58" fill="none" stroke-dasharray="4 6"/><path d="M42 70h116M100 12v116" stroke-width="2"/><path d="M100 40c12 0 18 10 18 26s-6 28-18 30c-12-2-18-14-18-30s6-26 18-26z"/><path d="M97 96h6l2 60h-10z"/><path d="M88 152h24" stroke-width="3"/>',
  uav: '<path d="M100 22c5 0 7 10 7 22v24l86 10v10l-86 6v40l24 16v8l-31-8-31 8v-8l24-16v-40l-86-6v-10l86-10v-24c0-12 2-22 7-22z"/>'
};

window.NAF_blueprint = function (a) {
  return `<div class="blueprint" aria-label="${a.name} blueprint">
    <svg viewBox="0 0 200 170" aria-hidden="true">${window.NAF_SHAPES[a.shape] || window.NAF_SHAPES.jet}</svg>
    <span class="bp-tag">${a.name.toUpperCase()} · SCHEMATIC</span>
  </div>`;
};

window.NAF_fmt = (n) => Number(n).toLocaleString("en-NG");
