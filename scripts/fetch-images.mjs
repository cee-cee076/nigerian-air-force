// Downloads the approved, freely licensed Nigerian Air Force photos from
// Wikimedia Commons into img/naf/ and writes img/naf/credits.json.
// Resumable: files already present are skipped. Paced slowly to respect
// Wikimedia's rate limits. Run from the project root:  node scripts/fetch-images.mjs
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("img/naf");
const UA = { headers: { "User-Agent": "NAF-concept-site/1.0 (static site image fetch)" } };
const API = "https://commons.wikimedia.org/w/api.php?format=json&";
const WIDTH = 1280; // a standard Wikimedia thumbnail step
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const PICK = {
  "a29-training.jpg": "Nigerian Air Force set for training on A-29 Super Tucano.jpg",
  "a29-training-2.jpg": "Nigerian Air Force set for training on A-29 Super Tucano - 49897209066.jpg",
  "a29-guns.jpg": "Nigerian Air Force A-29 Super Tucano aircraft pilot fires two .50-caliber machine guns.jpg",
  "a29-facilities.jpg": "Nigerian Air Force receives new facilities for A-29 Super Tucano fleet.jpg",
  "jf17.jpg": "Jf-17-nigeria.jpg",
  "f7ni.jpg": "Nigerian Air Force Chengdu F-7NI Airguard Iwelumo-1.jpg",
  "ft7ni-1.jpg": "Nigerian Air Force Chengdu FT-7NI Iwelumo-1.jpg",
  "ft7ni-2.jpg": "Nigerian Air Force Chengdu FT-7NI Iwelumo-2.jpg",
  "alphajet-1.jpg": "Nigerian Air Force Dassault-Dornier Alpha Jet Iwelumo-1.jpg",
  "alphajet-2.jpg": "Nigerian Air Force Dassault-Dornier Alpha Jet Iwelumo-2.jpg",
  "l39-1.jpg": "Nigerian Air Force Aero L-39ZA Albatros Iwelumo-1.jpg",
  "l39-2.jpg": "Nigerian Air Force Aero L-39ZA Albatros Iwelumo-2.jpg",
  "mi35-1.jpg": "Nigerian Air Force Mil Mi-35P Iwelumo-1.jpg",
  "mi35-2.jpg": "Nigerian Air Force Mil Mi-35P Iwelumo-2.jpg",
  "mi24-1.jpg": "Nigerian Air Force Mil Mi-24V Iwelumo-1.jpg",
  "mi24-2.jpg": "Nigerian Air Force Mil Mi-24V Iwelumo-2.jpg",
  "a109.jpg": "Nigerian Air Force Agusta A-109 Iwelumo-1.jpg",
  "atr42-1.jpg": "Nigerian Air Force ATR ATR-42-500MP Surveyor Iwelumo-1.jpg",
  "atr42-2.jpg": "Nigerian Airforce (NAF931) ATR 42MP-500 20130914.jpg",
  "do128.jpg": "Nigerian Air Force Dornier Do-128-6 Turbo Skyservant Iwelumo-1.jpg",
  "kingair.jpg": "Nigerian Air Force Beechcraft B300 King Air 350i NAF202.jpg",
  "c130-1.jpg": "Nigerian Air Force C-130 (6837681965).jpg",
  "c130-2.jpg": "Lockheed C-130H Hercules NAF 090825-F-9276L-101.jpg",
  "heli-sambisa.png": "Nigerian Helicopter - Sambisa Forest, 2017.png",
  "base-abuja.jpg": "Defense attachés from Russia and Pakistan visit the communications tent at the Nigerian Air Force Base, Abuja, Nigeria.jpg",
  "cas-meeting.jpg": "Gen Hecker meets with Nigerian Air Force chief of staff (8880210).jpg",
  "afridex.jpg": "AFRICOM leaders attends AFRIDEX in Lagos, Nigeria (10052175).jpg",
  "partnership-flight.jpg": "African Partnership Flight solidifies HA-DR tabletop exercise (8772607).jpg",
  "yisa-doko.jpg": "John Yisa-Doko DF-ST-84-08140.jpg",
  "naf102.jpg": "NAF 102 - One of the War Planes used during the Biafran War in Nigeria.jpg"
};

async function getJSON(q) {
  for (let k = 0; k < 4; k++) {
    try { return JSON.parse(await (await fetch(API + q, UA)).text()); }
    catch { await wait(15000 * (k + 1)); } // network error or rate-limit page
  }
  return {};
}

fs.mkdirSync(OUT, { recursive: true });
const credits = [];
let failed = 0;
for (const [name, title] of Object.entries(PICK)) {
  const r = await getJSON(`action=query&prop=imageinfo&iiprop=size|url|extmetadata&iiurlwidth=${WIDTH}&titles=${encodeURIComponent("File:" + title)}`);
  const page = Object.values(r.query?.pages || {})[0];
  const ii = page?.imageinfo?.[0];
  if (!ii) { console.log("NO INFO", name); failed++; continue; }
  const m = ii.extmetadata || {};
  credits.push({
    file: `img/naf/${name}`, title,
    author: (m.Artist?.value || "").replace(/<[^>]*>/g, "").trim(),
    license: m.LicenseShortName?.value || "", source: ii.descriptionurl
  });
  const dest = path.join(OUT, name);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 10000) { console.log("skip", name); continue; }
  const url = (ii.width > WIDTH ? ii.thumburl : ii.url).split("?")[0];
  let res;
  try { res = await fetch(url, UA); }
  catch (e) { console.log("FAIL", name, "network error:", e.cause?.code || e.message); failed++; continue; }
  if (res.ok) { fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer())); console.log("OK  ", name, (fs.statSync(dest).size / 1024 | 0) + " KB"); }
  else { console.log("FAIL", name, res.status, res.status === 429 ? "(rate limited: wait 10+ min, then run again)" : ""); failed++; if (res.status === 429) break; }
  await wait(8000);
}
fs.writeFileSync(path.join(OUT, "credits.json"), JSON.stringify(credits, null, 1));
console.log(failed ? `\n${failed} not downloaded — run again later to resume.` : "\nAll images downloaded.");
