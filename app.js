/* ============================================================
   FILMLISTE – app.js
   Netflix-Style Dashboard · TMDB + Supabase · GSAP + Three.js
   ============================================================ */

/* ===================== Konfiguration ===================== */
const EMBEDDED_TMDB_KEY = "5ab877727fc2529f4b758e4ac88f8ecf";
const SUPABASE_URL = "https://szoyhphyhacgjhyzrodz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_fvV4E6YpI4YWeUFHOwJgEA_UknQi5RG";

const IMG = "https://image.tmdb.org/t/p/";
const REGION = "DE";
const LANG = "de-DE";

const isMobile = () => window.matchMedia("(max-width: 767px)").matches;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGsap = typeof gsap !== "undefined";
if (hasGsap && typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);
if (hasGsap && typeof Draggable !== "undefined") gsap.registerPlugin(Draggable);
if (hasGsap && typeof InertiaPlugin !== "undefined") gsap.registerPlugin(InertiaPlugin);
// Liquid-Glass-Refraktion (SVG-Displacement in backdrop-filter) nur in Chromium
if (window.chrome && !reducedMotion) document.documentElement.classList.add("lg-on");
// PWA-Install-Prompt abfangen → Button in den Einstellungen
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const row = document.getElementById("installRow");
  if (row && document.getElementById("view-settings").style.display !== "none") row.style.display = "";
});

/* ===================== Icons ===================== */
const I = {
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  dice: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="8.5" cy="15.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>',
  bookmark: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  down: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  up: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  ext: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
  list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  star: '<polygon fill="currentColor" stroke="none" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  film: '<rect x="2" y="2" width="20" height="20" rx="2.5"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/>',
  back: '<polyline points="15 18 9 12 15 6"/>',
  compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" stroke="none"/>',
  cards: '<rect x="3" y="6" width="13" height="16" rx="2" transform="rotate(-8 9.5 14)"/><rect x="9" y="4" width="13" height="16" rx="2" transform="rotate(6 15.5 12)"/>',
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3" fill="currentColor" stroke="none"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  chev: '<polyline points="9 18 15 12 9 6"/>',
  sliders: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  sparkles: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" fill="currentColor" stroke="none"/><path d="M19 14.5l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9z" fill="currentColor" stroke="none"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>',
  ghost: '<path d="M9 10h.01M15 10h.01"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  planet: '<circle cx="12" cy="12" r="5.5"/><path d="M4.5 9.5C2.6 10.4 1.6 11.4 2 12.4c.7 1.7 5 2.6 10 2.1 5-.4 9.4-2 9.9-3.6.3-1-.8-1.9-2.7-2.4"/>',
  heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  video: '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  wand: '<path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8L19 13"/><path d="M15 9h0"/><path d="M17.8 6.2L19 5"/><path d="M3 21l9-9"/><path d="M12.2 6.2L11 5"/>',
  mic: '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/>',
  tvic: '<rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  masks: '<path d="M4 3h7v5.5a3.5 3.5 0 0 1-7 0z"/><path d="M13 8h7v5.5a3.5 3.5 0 0 1-7 0z"/><path d="M6 5.5h.01M9 5.5h.01M15 10.5h.01M18 10.5h.01"/>'
};
const GENRE_ICONS = {
  28: "zap", 12: "compass", 14: "wand", 16: "sparkles", 27: "ghost", 35: "smile",
  53: "eye", 878: "planet", 9648: "search", 10749: "heart", 80: "shield", 99: "video",
  18: "masks", 10751: "users", 36: "clock", 10402: "music", 10752: "target", 37: "target",
  10770: "tvic", 10759: "zap", 10765: "planet", 10762: "users", 10763: "mic",
  10764: "tvic", 10766: "tvic", 10767: "mic", 10768: "target"
};
function genreIcon(id) { return GENRE_ICONS[id] || "film"; }
function icon(name, size = 17) {
  return `<svg style="width:${size}px;height:${size}px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${I[name] || ""}</svg>`;
}
function hydrateIcons(root = document) {
  root.querySelectorAll("[data-ic]").forEach(el => {
    const big = el.classList.contains("ico-big");
    el.innerHTML = icon(el.dataset.ic, big ? 44 : (el.dataset.size || 17));
  });
}

/* ===================== State ===================== */
let tmdbKey = localStorage.getItem("fl_apikey") || EMBEDDED_TMDB_KEY || "";
let store = JSON.parse(localStorage.getItem("fl_store") || '{"seen":{},"watch":{}}');
let skipped = new Set(JSON.parse(localStorage.getItem("fl_skip") || "[]"));
let curView = "discover";
let curType = "movie";
let curRank = "top";
let curGenre = null;
let curPage = 1;
let curLib = "watch";
let genreCache = {};
let sb = null;
let session = null;
let myLists = [];
let currentList = null;
let currentDetail = null;

const cloudEnabled = !!(SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase);
if (cloudEnabled) sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let prefs = JSON.parse(localStorage.getItem("fl_prefs") || '{"fav":[],"hide":[]}');
let prefsDirty = false;
let allGenres = null;
let subs = JSON.parse(localStorage.getItem("fl_subs") || "[]");
let providersCache = null;
function saveSubs() { localStorage.setItem("fl_subs", JSON.stringify(subs)); }
let gFilter = JSON.parse(localStorage.getItem("fl_filter") || '{"minScore":0,"providers":[],"hideSeen":false}');
function saveFilter() { localStorage.setItem("fl_filter", JSON.stringify(gFilter)); }
let deferredPrompt = null;
let gridBuffer = [];
let gridTotalPages = 1;
let gridLoading = false;
let dashDirty = false;

function persist() { localStorage.setItem("fl_store", JSON.stringify(store)); updateCounts(); }
function persistSkips() { localStorage.setItem("fl_skip", JSON.stringify([...skipped].slice(-600))); }
function savePrefs() { localStorage.setItem("fl_prefs", JSON.stringify(prefs)); }
function isHidden(item) { return (item.genre_ids || []).some(g => prefs.hide.includes(g)); }
function keyOf(type, id) { return type + "_" + id; }
function esc(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function matchPct(v) { return v ? Math.round(v * 10) + " %" : null; }
function $(id) { return document.getElementById(id); }
let scrollLocks = 0;
function lockScroll(on) {
  scrollLocks = Math.max(0, scrollLocks + (on ? 1 : -1));
  document.body.style.overflow = scrollLocks ? "hidden" : "";
}

/* ===================== Rankings ===================== */
const currentYear = new Date().getFullYear();
const RANKS = [
  { id: "top", label: "Top aller Zeiten", desc: "Die bestbewerteten Titel überhaupt.",
    p: t => ({ sort_by: "vote_average.desc", "vote_count.gte": t === "movie" ? 3000 : 1000 }) },
  { id: "fresh", label: "Neu & gefeiert", desc: "Highlights der letzten zwei Jahre.",
    p: t => t === "movie"
      ? { sort_by: "vote_average.desc", "vote_count.gte": 300, "primary_release_date.gte": (currentYear - 2) + "-01-01" }
      : { sort_by: "vote_average.desc", "vote_count.gte": 100, "first_air_date.gte": (currentYear - 2) + "-01-01" } },
  { id: "modern", label: "Moderne Meisterwerke", desc: "Das Beste seit 2000.",
    p: t => t === "movie"
      ? { sort_by: "vote_average.desc", "vote_count.gte": 2500, "primary_release_date.gte": "2000-01-01" }
      : { sort_by: "vote_average.desc", "vote_count.gte": 800, "first_air_date.gte": "2000-01-01" } },
  { id: "classics", label: "Klassiker", desc: "Meisterwerke bis 1989.",
    p: t => t === "movie"
      ? { sort_by: "vote_average.desc", "vote_count.gte": 800, "primary_release_date.lte": "1989-12-31" }
      : { sort_by: "vote_average.desc", "vote_count.gte": 200, "first_air_date.lte": "1989-12-31" } },
  { id: "gems", label: "Hidden Gems", desc: "Hochbewertet, kaum bekannt.",
    p: () => ({ sort_by: "vote_average.desc", "vote_average.gte": 7.3, "vote_count.gte": 100, "vote_count.lte": 600 }) },
  { id: "popular", label: "Gerade beliebt", desc: "Was die Welt aktuell schaut.",
    p: () => ({ sort_by: "popularity.desc", "vote_count.gte": 100 }) }
];

/* ===================== TMDB API ===================== */
function isV4(k) { return k.startsWith("eyJ"); }
async function api(path, params = {}) {
  const url = new URL("https://api.themoviedb.org/3" + path);
  url.searchParams.set("language", LANG);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const opts = {};
  if (isV4(tmdbKey)) opts.headers = { Authorization: "Bearer " + tmdbKey };
  else url.searchParams.set("api_key", tmdbKey);
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error("API " + res.status);
  return res.json();
}
async function validateKey() {
  try { await api("/configuration"); return true; } catch { return false; }
}
async function saveKey() {
  tmdbKey = $("keyInput").value.trim();
  if (tmdbKey && await validateKey()) {
    localStorage.setItem("fl_apikey", tmdbKey);
    location.reload();
  } else {
    $("keyError").style.display = "block";
  }
}

/* ===================== Navigation ===================== */
const TABS = [
  { id: "discover", label: "Start" },
  { id: "swipe", label: "Swipe" },
  { id: "search", label: "Suche" },
  { id: "library", label: "Bibliothek" }
];
function renderTabs() {
  const nav = $("mainTabs");
  nav.innerHTML = "";
  for (const t of TABS) {
    const el = document.createElement("div");
    el.className = "tab" + (curView === t.id ? " active" : "");
    el.dataset.view = t.id;
    el.textContent = t.label;
    el.onclick = () => switchView(t.id);
    nav.appendChild(el);
  }
}
function switchView(v, fromPop = false) {
  if (v !== "listdetail") currentList = null;
  const prev = curView;
  curView = v;
  if (!fromPop && prev !== v) history.pushState({ v }, "", "");
  if (prev === "settings" && v !== "settings" && prefsDirty) {
    prefsDirty = false;
    dashDirty = false;
    buildDashboard();
    resetDeck();
  }
  if (v === "discover" && dashDirty) {
    dashDirty = false;
    buildDashboard();
  }
  const navTarget = v === "listdetail" ? "library" : (v === "grid" || v === "settings" ? "discover" : v);
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.view === navTarget));
  document.querySelectorAll(".bottom-nav button").forEach(b => b.classList.toggle("active", b.dataset.go === navTarget));
  ["discover", "grid", "swipe", "search", "library", "listdetail", "settings"].forEach(s => {
    const el = $("view-" + s);
    if (el) el.style.display = s === v ? "" : "none";
  });
  if (hasGsap && !reducedMotion && prev !== v) {
    gsap.fromTo("#view-" + v, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out", clearProps: "all" });
  }
  if (v === "library") renderLibrary();
  if (v === "swipe") { ensureDeck(); maybeShowTutorial(); }
  if (v === "settings") renderSettings();
  window.scrollTo({ top: 0 });
}

/* ===================== Dashboard: Billboard ===================== */
let bbItems = [];
let bbIdx = 0;
let bbTimer = null;
let bbActiveImg = "A";

async function buildDashboard() {
  stopBillboard();
  $("rows").innerHTML = "";
  try {
    await ensureAllGenres();
    const trend = await api("/trending/" + curType + "/week");
    const visible = trend.results.filter(x => !isHidden(x));
    bbItems = visible.filter(x => x.backdrop_path).slice(0, 6);
    buildRows(visible.slice(0, 10));
    if (bbItems.length) {
      $("bbDots").innerHTML = bbItems.map((_, i) => `<span class="${i === 0 ? "on" : ""}"></span>`).join("");
      showBillboard(0, true);
      startBillboard();
    }
  } catch {
    $("rows").innerHTML = `<div class='empty'>Da hat etwas nicht geklappt.<br><br><button class="btn primary" id="retryDash">${icon("back", 14)} Neu laden</button></div>`;
    const r = $("retryDash");
    if (r) r.onclick = () => buildDashboard();
  }
}
function genreNamesOf(item, n = 2) {
  return (item.genre_ids || [])
    .map(id => (allGenres || []).find(g => g.id === id))
    .filter(Boolean).slice(0, n).map(g => g.name).join(", ");
}
function showBillboard(i, instant) {
  bbIdx = i;
  const item = bbItems[i];
  if (!item) return;
  const next = bbActiveImg === "A" ? "B" : "A";
  const imgNext = $("bbImg" + next);
  const imgCur = $("bbImg" + bbActiveImg);
  const src = IMG + "w780" + item.backdrop_path;

  const apply = () => {
    if (hasGsap && !reducedMotion) {
      gsap.killTweensOf([imgNext, imgCur]);
      gsap.set(imgNext, { opacity: 0 });
      gsap.to(imgNext, { opacity: 1, duration: instant ? 0.6 : 1.1, ease: "power2.inOut" });
      gsap.to(imgCur, { opacity: 0, duration: instant ? 0 : 1.1, ease: "power2.inOut" });
    } else {
      imgNext.style.opacity = 1; imgCur.style.opacity = 0;
    }
    bbActiveImg = next;
    const title = item.title || item.name;
    const year = (item.release_date || item.first_air_date || "").slice(0, 4);
    $("bbTitle").innerHTML = String(title).split("").map(c => c === " " ? " " : `<span class="ch">${esc(c)}</span>`).join("");
    $("bbMeta").innerHTML = `
      <span>${year}</span><span>·</span>
      <span>${esc(genreNamesOf(item))}</span><span>·</span>
      <span>${curType === "tv" ? "Serie" : "Film"}</span>`;
    $("bbOverview").textContent = item.overview || "";
    $("bbRating").innerHTML = item.vote_average ? `
      <span class="star"><span style="color:var(--red);display:inline-flex">${icon("star", 16)}</span> ${item.vote_average.toFixed(1).replace(".", ",")}</span>` : "";
    if (item.poster_path) {
      const p = $("bbPoster");
      if (hasGsap && !reducedMotion) {
        gsap.to(p, { opacity: 0, scale: 0.96, duration: instant ? 0 : 0.3, onComplete: () => {
          p.src = IMG + "w500" + item.poster_path;
          gsap.to(p, { opacity: 1, scale: 1, duration: 0.55, ease: "power3.out", delay: 0.05 });
        }});
      } else p.src = IMG + "w500" + item.poster_path;
    }
    updateBbSave();
    if (hasGsap && !reducedMotion) {
      gsap.fromTo([$("bbMeta"), $("bbOverview"), $("bbRating")],
        { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: "power2.out" });
      gsap.fromTo("#bbTitle .ch", { opacity: 0, yPercent: 50 },
        { opacity: 1, yPercent: 0, duration: 0.4, stagger: 0.012, ease: "power2.out" });
    }
    [...$("bbDots").children].forEach((d, di) => d.classList.toggle("on", di === i));
  };
  if (imgNext.src !== src) {
    imgNext.onload = () => { imgNext.onload = null; apply(); };
    imgNext.src = src;
    if (imgNext.complete) { imgNext.onload = null; apply(); }
  } else apply();
}
function updateBbSave() {
  const el = $("bbSave");
  const item = bbItems[bbIdx];
  if (!el || !item) return;
  const k = keyOf(curType, item.id);
  el.innerHTML = store.watch[k]
    ? `${icon("check", 16)} Gemerkt`
    : `${icon("bookmark", 16)} Speichern`;
}
function renderQuickGenres() {
  const wrap = $("quickGenres");
  wrap.querySelectorAll(".qpill.gq").forEach(el => el.remove());
  const common = [53, 878, 18, 9648, 28, 35, 27, 10749, 80, 16, 10759, 10765];
  const ids = [...new Set([...prefs.fav, ...common])]
    .filter(id => !prefs.hide.includes(id))
    .map(id => (allGenres || []).find(g => g.id === id))
    .filter(Boolean).slice(0, 10);
  for (const g of ids) {
    const p = document.createElement("div");
    p.className = "qpill liquid gq" + (curGenre === g.id ? " active" : "");
    p.innerHTML = `<span data-ic>${icon(genreIcon(g.id), 15)}</span>${esc(g.name)}`;
    p.onclick = () => { curGenre = g.id; openGrid("popular"); };
    wrap.appendChild(p);
  }
}
function startBillboard() {
  stopBillboard();
  bbTimer = setInterval(() => {
    if (document.hidden || curView !== "discover" || !bbItems.length) return;
    showBillboard((bbIdx + 1) % bbItems.length);
  }, 8000);
}
function stopBillboard() { if (bbTimer) { clearInterval(bbTimer); bbTimer = null; } }

/* ===================== Dashboard: Rows ===================== */
const rowIO = ("IntersectionObserver" in window) ? new IntersectionObserver(entries => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    rowIO.unobserve(e.target);
    const fn = e.target._loadFn;
    if (fn) fn();
  }
}, { rootMargin: "900px 0px" }) : null;

function buildRows(top10) {
  const wrap = $("rows");
  wrap.innerHTML = "";
  const addRow = (shell) => { wrap.appendChild(shell.row); revealRow(shell.row); return shell; };

  const r10 = addRow(rowShell("Top 10 diese Woche", null));
  fillTop10(r10.scroller, top10);

  const watchEntries = Object.values(store.watch);
  if (watchEntries.length >= 2) {
    const rw = addRow(rowShell("Deine Merkliste", () => { curLib = "watch"; switchView("library"); }));
    fillRowFromStore(rw.scroller, watchEntries.slice(0, 20));
  }

  // Deine Listen als Reihe
  if (session && myLists.length) {
    const rl = addRow(rowShell("Deine Listen", () => { curLib = "lists"; switchView("library"); }));
    fillListsRow(rl.scroller);
  }

  // Favoriten-Genres als eigene Reihen
  for (const gid of prefs.fav.slice(0, 3)) {
    const g = (allGenres || []).find(x => x.id === gid);
    if (!g) continue;
    const rf = addRow(rowShell("Weil du " + g.name + " magst", () => { curGenre = gid; openGrid("popular"); }));
    rf.scroller.innerHTML = "<div class='sk-tile skeleton'></div>".repeat(6);
    const loader = () => loadGenreRow(rf.scroller, gid);
    if (rowIO) { rf.row._loadFn = loader; rowIO.observe(rf.row); }
    else loader();
  }

  for (const rank of RANKS) {
    const r = addRow(rowShell(rank.label, () => openGrid(rank.id)));
    r.scroller.innerHTML = "<div class='sk-tile skeleton'></div>".repeat(6);
    const loader = () => loadRankRow(r.scroller, rank);
    if (rowIO) { r.row._loadFn = loader; rowIO.observe(r.row); }
    else loader();
  }
  if (hasGsap && typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
}
function revealRow(row) {
  if (!hasGsap || reducedMotion || typeof ScrollTrigger === "undefined") return;
  gsap.from(row, {
    opacity: 0, y: 22, duration: 0.5, ease: "power2.out",
    scrollTrigger: { trigger: row, start: "top 105%" }
  });
}
async function fillListsRow(scroller) {
  scroller.innerHTML = "";
  for (const l of myLists.slice(0, 10)) {
    const tile = document.createElement("div");
    tile.className = "list-tile liquid";
    tile.innerHTML = `<span class="lt-ico">${icon("list", 20)}</span><h3>${esc(l.name)}</h3><div class="sub">…</div>`;
    tile.onclick = () => openListDetail(l.id);
    scroller.appendChild(tile);
    sb.from("fl_list_items").select("*", { count: "exact", head: true }).eq("list_id", l.id)
      .then(({ count }) => { tile.querySelector(".sub").textContent = (count ?? 0) + " Titel"; });
  }
}
async function loadGenreRow(scroller, gid) {
  try {
    const params = {
      page: 1, watch_region: REGION, with_genres: gid,
      sort_by: "popularity.desc", "vote_count.gte": curType === "movie" ? 200 : 80
    };
    const d = await api("/discover/" + curType, params);
    scroller.innerHTML = "";
    d.results.filter(x => x.poster_path && !isHidden(x)).slice(0, 18)
      .forEach((item, i) => scroller.appendChild(makeTile(item, curType, i)));
  } catch { scroller.innerHTML = ""; }
}
function rowShell(title, onMore) {
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `
    <div class="row-head">
      <h2>${esc(title)}</h2>
      ${onMore ? `<button class="more">Alle anzeigen ${icon("chev", 13)}</button>` : ""}
    </div>
    <div class="row-scroller"></div>`;
  if (onMore) row.querySelector(".more").onclick = onMore;
  return { row, scroller: row.querySelector(".row-scroller") };
}
async function loadRankRow(scroller, rank) {
  try {
    const params = { page: 1, watch_region: REGION, ...rank.p(curType) };
    const d = await api("/discover/" + curType, params);
    scroller.innerHTML = "";
    d.results.filter(x => x.poster_path && !isHidden(x)).slice(0, 18).forEach((item, i) => {
      scroller.appendChild(makeTile(item, curType, i));
    });
  } catch { scroller.innerHTML = "<div class='empty' style='padding:14px'>Fehler beim Laden</div>"; }
}
function fillTop10(scroller, items) {
  scroller.innerHTML = "";
  items.filter(x => x.poster_path).slice(0, 10).forEach((item, i) => {
    const wrap = document.createElement("div");
    wrap.className = "tile-num";
    wrap.innerHTML = `<div class="num">${i + 1}</div>`;
    wrap.appendChild(makeTile(item, curType, i));
    scroller.appendChild(wrap);
  });
}
function fillRowFromStore(scroller, entries) {
  scroller.innerHTML = "";
  entries.forEach((e, i) => {
    const item = { id: e.id, title: e.title, name: e.title, poster_path: e.poster_path, vote_average: e.vote_average };
    scroller.appendChild(makeTile(item, e.type, i));
  });
}
function makeTile(item, type, idx) {
  const tile = document.createElement("div");
  const k = keyOf(type, item.id);
  tile.className = "tile" + (store.seen[k] ? " is-seen" : "");
  tile.innerHTML = `
    <img loading="lazy" src="${IMG}w342${item.poster_path}" alt="${esc(item.title || item.name || "")}">
    <span class="tile-seen">${icon("check", 11)}</span>`;
  tile.onclick = () => openDetail(type, item.id);
  if (hasGsap && !reducedMotion) {
    gsap.to(tile, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", delay: Math.min(idx * 0.03, 0.3),
      onStart: () => tile.classList.add("shown") });
  } else tile.classList.add("shown");
  return tile;
}
function setDashType(t) {
  curType = t;
  curGenre = null;
  document.querySelectorAll("#typePills button").forEach(b => b.classList.toggle("active", b.dataset.type === t));
  buildDashboard();
}

/* ===================== Grid-Ansicht (Alle anzeigen) ===================== */
function openGrid(rankId) {
  curRank = rankId;
  curPage = 1;
  $("gridTitle").textContent = RANKS.find(r => r.id === rankId).label;
  switchView("grid");
  renderGrid(true);
}
async function loadTypeGenres() {
  if (!genreCache[curType]) {
    const d = await api("/genre/" + curType + "/list");
    genreCache[curType] = d.genres;
  }
  return genreCache[curType];
}
async function renderGridGenrePills() {
  const wrap = $("gridGenrePills");
  wrap.innerHTML = "";
  const genres = await loadTypeGenres().catch(() => []);
  const all = document.createElement("button");
  all.className = "qpill liquid" + (curGenre === null ? " active" : "");
  all.innerHTML = `<span data-ic>${icon("film", 14)}</span>Alle`;
  all.onclick = () => { curGenre = null; renderGridGenrePills(); renderGrid(true); };
  wrap.appendChild(all);
  for (const g of genres) {
    const p = document.createElement("button");
    p.className = "qpill liquid" + (curGenre === g.id ? " active" : "");
    p.innerHTML = `<span data-ic>${icon(genreIcon(g.id), 14)}</span>${esc(g.name)}`;
    p.onclick = () => { curGenre = (curGenre === g.id ? null : g.id); renderGridGenrePills(); renderGrid(true); };
    wrap.appendChild(p);
  }
}
function renderActiveFilters() {
  const bar = $("activeFilters");
  const parts = [];
  if (curGenre) {
    const g = (allGenres || []).find(x => x.id === curGenre);
    parts.push({ label: g ? g.name : "Genre", clear: () => { curGenre = null; } });
  }
  if (gFilter.minScore) parts.push({ label: "★ ≥ " + gFilter.minScore, clear: () => { gFilter.minScore = 0; } });
  for (const pid of gFilter.providers) {
    const p = (providersCache || []).find(x => x.id === pid);
    parts.push({ label: p ? p.name : "Plattform", clear: () => { gFilter.providers = gFilter.providers.filter(x => x !== pid); } });
  }
  if (gFilter.hideSeen) parts.push({ label: "Gesehenes ausgeblendet", clear: () => { gFilter.hideSeen = false; } });
  bar.style.display = parts.length ? "flex" : "none";
  bar.innerHTML = "";
  for (const part of parts) {
    const c = document.createElement("div");
    c.className = "chip active";
    c.innerHTML = `${esc(part.label)} ${icon("x", 11)}`;
    c.onclick = () => { part.clear(); saveFilter(); renderActiveFilters(); renderGrid(true); };
    bar.appendChild(c);
  }
}
const revealIO = ("IntersectionObserver" in window) ? new IntersectionObserver(entries => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    revealIO.unobserve(e.target);
    if (hasGsap && !reducedMotion) {
      gsap.to(e.target, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: (e.target._revealDelay || 0) });
    } else { e.target.style.opacity = 1; e.target.style.transform = "none"; }
    e.target.classList.remove("reveal-init");
  }
}, { rootMargin: "0px 0px 360px 0px" }) : null;
function observeReveal(el, idx = 0) {
  if (!revealIO || reducedMotion) { el.classList.remove("reveal-init"); return; }
  el.classList.add("reveal-init");
  el._revealDelay = (idx % 6) * 0.04;
  revealIO.observe(el);
}
async function renderGrid(reset) {
  const grid = $("discoverGrid");
  const spin = $("discoverSpinner");
  if (reset) { curPage = 1; gridBuffer = []; grid.innerHTML = ""; renderActiveFilters(); }
  if (gridLoading) return;
  gridLoading = true;
  spin.style.display = "block";
  $("loadMoreBtn").style.display = "none";
  try {
    const rank = RANKS.find(r => r.id === curRank);
    const params = { page: curPage, watch_region: REGION, ...rank.p(curType) };
    if (curGenre) params.with_genres = curGenre;
    if (gFilter.minScore) params["vote_average.gte"] = Math.max(gFilter.minScore, parseFloat(params["vote_average.gte"] || 0));
    if (gFilter.providers.length) {
      params.with_watch_providers = gFilter.providers.join("|");
      params.with_watch_monetization_types = "flatrate";
    }
    const d = await api("/discover/" + curType, params);
    spin.style.display = "none";
    gridTotalPages = Math.min(d.total_pages, 250);
    for (const item of d.results) {
      if (gFilter.hideSeen && store.seen[keyOf(curType, item.id)]) continue;
      if (!curGenre && isHidden(item)) continue;
      gridBuffer.push(item);
    }
    flushGridBuffer(curPage >= gridTotalPages);
    $("loadMoreBtn").style.display = (curPage < gridTotalPages && !gridIO) ? "flex" : "none";
  } catch {
    spin.textContent = "Fehler beim Laden.";
  }
  gridLoading = false;
  // IO neu anstoßen: feuert sonst nicht erneut, wenn der Sentinel im Margin sichtbar BLEIBT
  if (gridIO && curView === "grid" && curPage < gridTotalPages) {
    const s = $("gridSentinel");
    gridIO.unobserve(s);
    gridIO.observe(s);
  }
}
function flushGridBuffer(final) {
  const grid = $("discoverGrid");
  let n = gridBuffer.length;
  if (isMobile() && !final) n -= n % 2; // immer gerade Anzahl rendern
  const items = gridBuffer.splice(0, Math.max(n, 0));
  items.forEach((item, i) => {
    const card = makeCard(item, curType);
    observeReveal(card, i);
    grid.appendChild(card);
  });
  if (!grid.children.length && final) grid.innerHTML = "<div class='empty' style='grid-column:1/-1'>Nichts gefunden – Filter lockern?</div>";
}
const gridIO = ("IntersectionObserver" in window) ? new IntersectionObserver(entries => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    if (curView !== "grid" || gridLoading || curPage >= gridTotalPages) continue;
    curPage++;
    renderGrid(false);
  }
}, { rootMargin: "1400px 0px" }) : null;

/* ===================== Suche ===================== */
async function doSearch() {
  const q = $("searchInput").value.trim();
  if (!q) return;
  $("searchInput").blur(); // Tastatur einklappen
  const grid = $("searchGrid");
  $("searchEmpty").style.display = "none";
  grid.innerHTML = "<div class='spinner'>Suche …</div>";
  try {
    const d = await api("/search/multi", { query: q });
    grid.innerHTML = "";
    const hits = d.results.filter(r => r.media_type === "movie" || r.media_type === "tv");
    if (!hits.length) { grid.innerHTML = "<div class='empty'>Nichts gefunden.</div>"; return; }
    hits.forEach((item, i) => {
      const card = makeCard(item, item.media_type);
      observeReveal(card, i);
      grid.appendChild(card);
    });
  } catch { grid.innerHTML = "<div class='empty'>Fehler bei der Suche.</div>"; }
}

/* ===================== Karten (Grid/Suche/Bibliothek) ===================== */
function makeCard(item, type, hideBadge = null) {
  const id = item.id;
  const k = keyOf(type, id);
  const title = item.title || item.name || "?";
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  const rating = item.vote_average ? Number(item.vote_average).toFixed(1) : null;

  const card = document.createElement("div");
  card.className = "card"
    + (store.seen[k] ? " is-seen" : "")
    + (store.watch[k] ? " is-watch" : "")
    + (hideBadge ? ` no-${hideBadge}-badge` : "");
  card.dataset.key = k;

  const posterHtml = item.poster_path
    ? `<img class="poster" loading="lazy" src="${IMG}w342${item.poster_path}" alt="">`
    : `<div class="noposter">${icon("film", 34)}</div>`;

  card.innerHTML = `
    <div class="poster-wrap">
      ${posterHtml}
      ${rating ? `<div class="badge rating">${icon("star", 11)} ${rating}</div>` : ""}
      <div class="badge seen">${icon("check", 12)}</div>
      <div class="badge watch">${icon("bookmark", 12)}</div>
    </div>
    <div class="info">
      <div class="title">${esc(title)}</div>
      <div class="meta"><span>${year || ""}</span><span>${type === "tv" ? "Serie" : "Film"}</span></div>
    </div>`;

  card.onclick = () => openDetail(type, id);
  return card;
}

/* ===================== Bibliothek / Toggle / Cloud-Sync ===================== */
function itemRecord(item, type) {
  return {
    id: item.id, type, title: item.title || item.name,
    poster_path: item.poster_path || null,
    vote_average: item.vote_average || null,
    date: (item.release_date || item.first_air_date || item.date || "").slice(0, 4),
    added: new Date().toISOString()
  };
}
function toggle(listName, item, type) {
  const k = keyOf(type, item.id);
  if (store[listName][k]) {
    delete store[listName][k];
    cloudDelete(listName, type, item.id);
    toast(listName === "seen" ? "Als ungesehen markiert" : "Von Merkliste entfernt");
  } else {
    store[listName][k] = itemRecord(item, type);
    cloudUpsert(listName, store[listName][k]);
    if (listName === "seen" && store.watch[k]) {
      delete store.watch[k];
      cloudDelete("watch", type, item.id);
    }
    toast(listName === "seen" ? "Als gesehen markiert" : "Auf die Merkliste gesetzt");
  }
  persist();
  updateBbSave();
}
function renderLibrary() {
  document.querySelectorAll("#libSeg button").forEach(b => b.classList.toggle("active", b.dataset.lib === curLib));
  const isLists = curLib === "lists";
  $("newListBtn").style.display = isLists ? "" : "none";
  $("shareLibBtn").style.display = isLists ? "none" : "";
  $("libraryGrid").style.display = isLists ? "none" : "";
  $("listsGrid").style.display = isLists ? "" : "none";
  $("libraryEmpty").style.display = "none";
  $("listsEmpty").style.display = "none";
  if (isLists) { renderListsTab(); return; }
  const grid = $("libraryGrid");
  const empty = $("libraryEmpty");
  grid.innerHTML = "";
  const entries = Object.values(store[curLib]).sort((a, b) => (b.added || "").localeCompare(a.added || ""));
  if (!entries.length) {
    empty.innerHTML = curLib === "watch"
      ? `<div class="ico-big">${icon("bookmark", 44)}</div>Noch nichts gemerkt.<br>Swipe nach rechts oder tippe auf „Merken“.`
      : `<div class="ico-big">${icon("check", 44)}</div>Noch nichts abgehakt.`;
    empty.style.display = ""; return;
  }
  empty.style.display = "none";
  entries.forEach((e, i) => {
    const item = { id: e.id, title: e.title, poster_path: e.poster_path, vote_average: e.vote_average, release_date: e.date };
    const card = makeCard(item, e.type, curLib);
    observeReveal(card, i);
    grid.appendChild(card);
  });
}
function updateCounts() {
  const cs = $("countSeen"), cw = $("countWatch");
  if (cs) cs.textContent = Object.keys(store.seen).length;
  if (cw) cw.textContent = Object.keys(store.watch).length;
  if (curView === "library") renderLibrary();
}
function rowFromRecord(listName, r) {
  return {
    user_id: session.user.id, list: listName, media_type: r.type, tmdb_id: r.id,
    title: r.title, poster_path: r.poster_path, vote_average: r.vote_average, year: r.date
  };
}
async function cloudUpsert(listName, record) {
  if (!session) return;
  await sb.from("fl_user_items").upsert(rowFromRecord(listName, record));
}
async function cloudDelete(listName, type, id) {
  if (!session) return;
  await sb.from("fl_user_items").delete()
    .match({ user_id: session.user.id, list: listName, media_type: type, tmdb_id: id });
}
async function syncLocalToCloud() {
  const rows = [];
  for (const ln of ["seen", "watch"])
    for (const r of Object.values(store[ln])) rows.push(rowFromRecord(ln, r));
  if (rows.length) await sb.from("fl_user_items").upsert(rows);
}
async function cloudLoad() {
  await syncLocalToCloud();
  const { data, error } = await sb.from("fl_user_items").select("*").eq("user_id", session.user.id);
  if (error || !data) return;
  const fresh = { seen: {}, watch: {} };
  for (const row of data) {
    fresh[row.list][keyOf(row.media_type, row.tmdb_id)] = {
      id: row.tmdb_id, type: row.media_type, title: row.title,
      poster_path: row.poster_path, vote_average: row.vote_average,
      date: row.year, added: row.added_at
    };
  }
  store = fresh;
  persist();
}

/* ===================== Detail (Bottom-Sheet / Modal) ===================== */
let sheetOpenFlag = false;
function openSheet() {
  $("sheetOverlay").classList.add("open");
  lockScroll(true);
  sheetOpenFlag = true;
  history.pushState({ v: curView, sheet: 1 }, "", "");
  const sheet = $("sheet");
  if (hasGsap && isMobile() && !reducedMotion) {
    gsap.fromTo(sheet, { y: "100%" }, { y: "0%", duration: 0.4, ease: "power3.out" });
  } else {
    sheet.style.transform = "translateY(0%)";
  }
}
function closeSheet(viaPop = false) {
  if (!sheetOpenFlag) return;
  if (!viaPop) { history.back(); return; } // konsumiert den Sheet-History-Eintrag → popstate schließt wirklich
  const sheet = $("sheet");
  const done = () => {
    $("sheetOverlay").classList.remove("open");
    lockScroll(false);
    sheetOpenFlag = false;
    closeTrailer();
  };
  if (hasGsap && isMobile() && !reducedMotion) {
    gsap.to(sheet, { y: "100%", duration: 0.3, ease: "power2.in", onComplete: done });
  } else done();
}
async function openDetail(type, id) {
  const box = $("sheetContent");
  box.innerHTML = "<div class='spinner'>Lade Details …</div>";
  openSheet();
  box.scrollTop = 0;
  try {
    const d = await api(`/${type}/${id}`, { append_to_response: "watch/providers,videos", include_video_language: "de,en" });
    const k = keyOf(type, id);
    const title = d.title || d.name;
    const year = (d.release_date || d.first_air_date || "").slice(0, 4);
    const runtime = type === "movie"
      ? (d.runtime ? d.runtime + " Min." : "")
      : (d.number_of_seasons ? d.number_of_seasons + " Staffel" + (d.number_of_seasons > 1 ? "n" : "") : "");
    const genres = (d.genres || []).map(g => g.name).join(" · ");
    const prov = ((d["watch/providers"] || {}).results || {})[REGION] || {};
    const provLink = prov.link || `https://www.justwatch.com/de/Suche?q=${encodeURIComponent(title)}`;
    const provSection = (label, arr, markMine) => !arr || !arr.length ? "" : `
      <h3>${label}</h3><div class="prov-row">${arr.map(p => {
        const mine = markMine && subs.includes(p.provider_id);
        return `<div class="prov ${mine ? "mine" : ""}">${mine ? `<span class="pm">${icon("check", 13)}</span>` : ""}<img src="${IMG}w92${p.logo_path}" alt=""><span>${esc(p.provider_name)}</span></div>`;
      }).join("")}
      </div>`;
    const flat = (prov.flatrate || []).slice().sort((a, b) =>
      (subs.includes(b.provider_id) ? 1 : 0) - (subs.includes(a.provider_id) ? 1 : 0));
    const mineProv = flat.filter(p => subs.includes(p.provider_id));
    const hasProv = (prov.flatrate || []).length || (prov.rent || []).length || (prov.buy || []).length;
    const vids = ((d.videos || {}).results || []).filter(v => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"));
    const trailer = vids.find(v => v.type === "Trailer") || vids[0];

    const listOptions = myLists.map(l => `<option value="${l.id}">${esc(l.name)}</option>`).join("");
    const addToListHtml = (session && myLists.length) ? `
      <div class="add-to-list">
        <select id="mListSel">${listOptions}</select>
        <button class="btn" id="addToListBtn">${icon("plus", 15)} Zu Liste</button>
      </div>` : "";

    box.innerHTML = `
      <div class="bd-wrap">
        ${d.backdrop_path ? `<img class="backdrop" src="${IMG}w780${d.backdrop_path}" alt=""><div class="bd-fade"></div>` : ""}
        <button class="share" id="sheetShare" title="Teilen">${icon("share", 16)}</button>
        <button class="close" id="sheetClose">${icon("x", 16)}</button>
      </div>
      <div class="body">
        <h2>${esc(title)}</h2>
        <div class="sub">
          ${d.vote_average ? `<span class="match">${matchPct(d.vote_average)} Bewertung</span>` : ""}
          <span>${[year, runtime].filter(Boolean).join(" · ")}</span>
          ${d.vote_average ? `<span class="star">${icon("star", 12)} ${d.vote_average.toFixed(1)} <span style="color:var(--faint);font-weight:400">(${(d.vote_count || 0).toLocaleString("de-DE")})</span></span>` : ""}
        </div>
        ${(d.genres || []).length ? `<div class="genre-tags">${d.genres.slice(0, 4).map(g =>
          `<span class="gtag"><span data-ic>${icon(genreIcon(g.id), 12)}</span>${esc(g.name)}</span>`).join("")}</div>` : ""}
        ${mineProv.length ? `<div class="abo-hint">${icon("check", 14)} In deinem Abo: ${esc(mineProv.map(p => p.provider_name).join(", "))}</div>` : ""}
        <p class="overview">${esc(d.overview || "Keine Beschreibung verfügbar.")}</p>
        <div class="big-actions">
          <button class="btn ${store.watch[k] ? "" : "primary"}" id="mWatch">${icon(store.watch[k] ? "check" : "bookmark", 15)} <span>${store.watch[k] ? "Gemerkt" : "Auf Merkliste"}</span></button>
          <button class="btn ${store.seen[k] ? "primary" : ""}" id="mSeen">${icon("check", 15)} <span>${store.seen[k] ? "Gesehen" : "Als gesehen markieren"}</span></button>
          ${trailer ? `<button class="btn glass" id="trailerBtn">${icon("play", 14)} Trailer</button>` : ""}
          <a class="btn glass" href="${provLink}" target="_blank">${icon("ext", 15)} JustWatch</a>
        </div>
        ${addToListHtml}
        <div class="providers">
          ${hasProv
            ? provSection("Im Abo enthalten", flat, true) + provSection("Leihen", prov.rent, false) + provSection("Kaufen", prov.buy, false)
            : "<h3>Streaming</h3><p style='color:var(--muted);font-size:0.88rem'>Aktuell keine Streaming-Infos für Deutschland gefunden.</p>"}
          <div class="attribution">Verfügbarkeit für Deutschland · Daten von JustWatch</div>
        </div>
      </div>`;

    currentDetail = { d, type, k };
    $("sheetClose").onclick = () => closeSheet();
    $("sheetShare").onclick = () => shareTitle(title, type, id);
    const tb = $("trailerBtn");
    if (tb && trailer) tb.onclick = () => openTrailer(trailer.key);
    const addBtn = $("addToListBtn");
    if (addBtn) addBtn.onclick = addCurrentToList;
    const refresh = () => {
      const bs = $("mSeen"), bw = $("mWatch");
      bs.className = "btn " + (store.seen[k] ? "primary" : "");
      bs.querySelector("span").textContent = store.seen[k] ? "Gesehen" : "Als gesehen markieren";
      bw.className = "btn " + (store.watch[k] ? "" : "primary");
      bw.querySelector("span").textContent = store.watch[k] ? "Gemerkt" : "Auf Merkliste";
      const card = document.querySelector(`.card[data-key="${k}"]`);
      if (card) {
        card.classList.toggle("is-seen", !!store.seen[k]);
        card.classList.toggle("is-watch", !!store.watch[k]);
      }
    };
    $("mSeen").onclick = () => { toggle("seen", d, type); refresh(); };
    $("mWatch").onclick = () => { toggle("watch", d, type); refresh(); };
  } catch {
    box.innerHTML = `<div class='body' style='padding-top:48px'><p>Fehler beim Laden der Details.</p></div>`;
  }
}
function shareTitle(title, type, id) {
  const url = location.origin + location.pathname + "#t=" + type + "_" + id;
  const data = { title: "Filmliste", text: `Schau dir „${title}“ an!`, url };
  if (navigator.share) {
    navigator.share(data).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(
      () => toast("Link kopiert"),
      () => prompt("Link zum Teilen:", url)
    );
  }
}
function initSheetDrag() {
  if (!hasGsap || typeof Draggable === "undefined" || !isMobile()) return;
  Draggable.create($("sheet"), {
    type: "y",
    trigger: $("sheetGrip"),
    bounds: { minY: 0, maxY: window.innerHeight },
    onDragEnd: function () {
      if (this.y > 110) closeSheet();
      else gsap.to($("sheet"), { y: 0, duration: 0.3, ease: "power3.out" });
    }
  });
}

/* ===================== Trailer-Popup ===================== */
function openTrailer(key) {
  $("trailerFrame").src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(key) + "?autoplay=1&rel=0&playsinline=1";
  $("trailerOverlay").classList.add("open");
  lockScroll(true);
}
function closeTrailer() {
  if (!$("trailerOverlay").classList.contains("open")) return;
  $("trailerOverlay").classList.remove("open");
  $("trailerFrame").src = "";
  lockScroll(false);
}

/* ===================== Filter-Sheet ===================== */
let filterCtx = "grid";
async function openFilter(ctx) {
  filterCtx = ctx;
  if (!$("filterOverlay").classList.contains("open")) {
    $("filterOverlay").classList.add("open");
    lockScroll(true);
  }
  $("fHideSeen").checked = !!gFilter.hideSeen;
  // Mindest-Bewertung als Sterne (1 Stern = 2.0 TMDB-Punkte)
  const starWrap = $("fStars");
  starWrap.innerHTML = "";
  const curStars = Math.round((gFilter.minScore || 0) / 2);
  for (let i = 1; i <= 5; i++) {
    const b = document.createElement("button");
    b.className = "star-btn" + (i <= curStars ? " on" : "");
    b.innerHTML = icon("star", 27);
    b.onclick = () => { gFilter.minScore = (curStars === i) ? 0 : i * 2; openFilter(filterCtx); };
    starWrap.appendChild(b);
  }
  const lbl = document.createElement("span");
  lbl.className = "score-val";
  lbl.textContent = gFilter.minScore ? "≥ " + gFilter.minScore.toFixed(1).replace(".", ",") : "Aus";
  starWrap.appendChild(lbl);
  // Genres (Single-Select)
  const gWrap = $("fGenres");
  const genres = await loadTypeGenres().catch(() => []);
  gWrap.innerHTML = "";
  for (const g of genres) {
    const on = curGenre === g.id;
    const c = document.createElement("div");
    c.className = "chip" + (on ? " active" : "");
    c.innerHTML = `${icon(genreIcon(g.id), 13)} ${esc(g.name)}`;
    c.onclick = () => { curGenre = on ? null : g.id; openFilter(filterCtx); };
    gWrap.appendChild(c);
  }
  // Plattformen (Multi-Select)
  await ensureProviders();
  const wrap = $("fProviders");
  wrap.innerHTML = "";
  for (const p of (providersCache || [])) {
    const c = document.createElement("div");
    const on = gFilter.providers.includes(p.id);
    c.className = "chip" + (on ? " sub-on" : "");
    c.innerHTML = `${p.logo ? `<img src="${IMG}w92${p.logo}" alt="">` : ""}${esc(p.name)}`;
    c.onclick = () => {
      gFilter.providers = on ? gFilter.providers.filter(x => x !== p.id) : [...gFilter.providers, p.id];
      openFilter(filterCtx);
    };
    wrap.appendChild(c);
  }
}
function closeFilter() {
  if (!$("filterOverlay").classList.contains("open")) return;
  $("filterOverlay").classList.remove("open");
  lockScroll(false);
}
function applyFilter() {
  gFilter.hideSeen = $("fHideSeen").checked;
  saveFilter();
  closeFilter();
  if (filterCtx === "dash") { curRank = "popular"; openGrid("popular"); }
  else renderGrid(true);
}
function resetFilter() {
  gFilter = { minScore: 0, providers: [], hideSeen: false };
  curGenre = null;
  saveFilter();
  openFilter(filterCtx);
}

/* ===================== Überrasch mich ===================== */
async function surpriseMe() {
  toast("Würfle …");
  try {
    const page = Math.floor(Math.random() * 5) + 1;
    const rank = RANKS.find(r => r.id === curRank) || RANKS[0];
    const params = { page, watch_region: REGION, ...rank.p(curType) };
    if (curGenre) params.with_genres = curGenre;
    const d = await api("/discover/" + curType, params);
    const unseen = d.results.filter(x => !store.seen[keyOf(curType, x.id)] && !isHidden(x));
    const pool = unseen.length ? unseen : d.results;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick) openDetail(curType, pick.id);
  } catch { toast("Fehler beim Würfeln"); }
}

/* ===================== Export / Import ===================== */
function exportData() {
  const blob = new Blob([JSON.stringify(store, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "filmliste-backup.json";
  a.click();
  toast("Backup gespeichert");
  closeMenu();
}
function importData(ev) {
  const file = ev.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data.seen || !data.watch) throw 0;
      store = data;
      persist();
      if (session) syncLocalToCloud();
      toast("Liste importiert");
    } catch { toast("Datei konnte nicht gelesen werden"); }
  };
  reader.readAsText(file);
  ev.target.value = "";
  closeMenu();
}

/* ===================== Auth ===================== */
function openAuth() {
  if (!cloudEnabled) { toast("Konten sind gerade nicht verfügbar."); return; }
  $("authOverlay").classList.add("open");
  lockScroll(true);
}
function closeAuth() {
  if (!$("authOverlay").classList.contains("open")) return;
  $("authOverlay").classList.remove("open");
  lockScroll(false);
}
async function googleLogin() {
  const { error } = await sb.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: location.origin + location.pathname }
  });
  if (error) { $("authError").textContent = "Google-Login: " + error.message; $("authError").style.display = "block"; }
}
async function sendMagicLink() {
  const email = $("authEmail").value.trim();
  const ok = $("authOk"), err = $("authError");
  ok.style.display = "none"; err.style.display = "none";
  if (!email.includes("@")) { err.textContent = "Bitte gültige E-Mail eingeben."; err.style.display = "block"; return; }
  $("magicBtn").disabled = true;
  const { error } = await sb.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: location.origin + location.pathname }
  });
  $("magicBtn").disabled = false;
  if (error) { err.textContent = "Fehler: " + error.message; err.style.display = "block"; }
  else ok.style.display = "block";
}
async function doLogout() {
  await sb.auth.signOut();
  closeMenu();
  toast("Abgemeldet – Listen bleiben lokal erhalten");
}
function toggleMenu() { $("acctMenu").classList.toggle("open"); }
function closeMenu() { $("acctMenu").classList.remove("open"); }
function updateAuthUi() {
  const loginBtn = $("loginBtn");
  const avatar = $("avatar");
  if (session) {
    loginBtn.style.display = "none";
    avatar.style.display = "flex";
    const u = session.user;
    const name = (u.user_metadata && (u.user_metadata.name || u.user_metadata.full_name)) || u.email || "?";
    const pic = u.user_metadata && (u.user_metadata.avatar_url || u.user_metadata.picture);
    avatar.innerHTML = pic
      ? `<img src="${esc(pic)}" alt="" referrerpolicy="no-referrer" onerror="this.remove()">`
      : esc(name[0].toUpperCase());
    $("whoami").textContent = u.email || name;
  } else {
    loginBtn.style.display = "";
    avatar.style.display = "none";
  }
}

/* ===================== Eigene Listen ===================== */
async function loadMyLists() {
  if (!session) { myLists = []; return; }
  const { data } = await sb.from("fl_lists").select("*").eq("owner", session.user.id).order("created_at", { ascending: false });
  myLists = data || [];
}
async function renderListsTab() {
  const grid = $("listsGrid");
  const empty = $("listsEmpty");
  grid.innerHTML = "";
  if (!cloudEnabled) { empty.innerHTML = "Listen sind gerade nicht verfügbar."; empty.style.display = ""; return; }
  if (!session) {
    empty.innerHTML = `<div class="ico-big">${icon("list", 44)}</div>Melde dich an, um eigene Listen zu erstellen und mit Freunden zu teilen.<br><br><button class="btn primary" id="listsLoginBtn">${icon("user", 15)} Anmelden</button>`;
    empty.style.display = "";
    $("listsLoginBtn").onclick = openAuth;
    return;
  }
  empty.innerHTML = "<div class='spinner' style='padding:14px'>Lade Listen …</div>";
  empty.style.display = "";
  await loadMyLists();
  if (!myLists.length) {
    empty.innerHTML = `<div class="ico-big">${icon("list", 44)}</div>Noch keine Listen.<br>Erstelle z.B. „Filmabend-Favoriten“ und teile sie per Link.`;
    empty.style.display = ""; return;
  }
  empty.style.display = "none";
  empty.innerHTML = "";
  for (const l of myLists) {
    const { count } = await sb.from("fl_list_items").select("*", { count: "exact", head: true }).eq("list_id", l.id);
    const card = document.createElement("div");
    card.className = "list-card";
    card.innerHTML = `<h3>${esc(l.name)}</h3><div class="sub">${count ?? 0} Titel${l.description ? " · " + esc(l.description) : ""}</div>`;
    card.onclick = () => openListDetail(l.id);
    grid.appendChild(card);
  }
}
function openNewList() {
  if (!session) { openAuth(); return; }
  $("newListOverlay").classList.add("open");
  lockScroll(true);
  $("newListName").focus();
}
function closeNewList() {
  if (!$("newListOverlay").classList.contains("open")) return;
  $("newListOverlay").classList.remove("open");
  lockScroll(false);
}
function ownerName() {
  return (session.user.user_metadata && (session.user.user_metadata.name || session.user.user_metadata.full_name)) || (session.user.email || "").split("@")[0];
}
async function createList() {
  const name = $("newListName").value.trim();
  if (!name) return;
  const desc = $("newListDesc").value.trim();
  const { error } = await sb.from("fl_lists").insert({ owner: session.user.id, owner_name: ownerName(), name, description: desc || null });
  if (error) { toast("Fehler: " + error.message); return; }
  closeNewList();
  $("newListName").value = ""; $("newListDesc").value = "";
  toast("Liste erstellt");
  dashDirty = true;
  renderListsTab();
}
async function addCurrentToList() {
  if (!currentDetail || !session) return;
  const listId = $("mListSel").value;
  const r = itemRecord(currentDetail.d, currentDetail.type);
  const { error } = await sb.from("fl_list_items").upsert({
    list_id: listId, media_type: r.type, tmdb_id: r.id,
    title: r.title, poster_path: r.poster_path, vote_average: r.vote_average, year: r.date
  });
  toast(error ? "Fehler: " + error.message : "Zur Liste hinzugefügt");
}
async function openListDetail(listId) {
  switchView("listdetail");
  const head = $("listHead");
  const grid = $("listGrid");
  head.innerHTML = "<div class='spinner'>Lade Liste …</div>";
  grid.innerHTML = "";
  const { data: list } = await sb.from("fl_lists").select("*").eq("id", listId).single();
  if (!list) { head.innerHTML = "<div>Liste nicht gefunden.</div>"; return; }
  const { data: items } = await sb.from("fl_list_items").select("*").eq("list_id", listId).order("added_at");
  const mine = session && session.user.id === list.owner;
  currentList = { list, mine };

  head.innerHTML = `
    <div>
      <h2>${esc(list.name)}</h2>
      <div class="by">Liste von ${esc(list.owner_name || "anonym")} · ${(items || []).length} Titel</div>
      ${list.description ? `<div class="desc">${esc(list.description)}</div>` : ""}
    </div>
    <div class="head-actions">
      <button class="btn" id="shareListBtn">${icon("link", 15)} Link kopieren</button>
      ${!mine && session ? `<button class="btn" id="copyListBtn">${icon("copy", 15)} Zu meinen Listen</button>` : ""}
      ${!mine && !session ? `<button class="btn" id="listAuthBtn">${icon("user", 15)} Anmelden zum Übernehmen</button>` : ""}
      ${mine ? `<button class="btn danger" id="deleteListBtn">${icon("trash", 15)} Löschen</button>` : ""}
    </div>`;
  $("shareListBtn").onclick = shareList;
  const cb = $("copyListBtn"); if (cb) cb.onclick = copyListToMine;
  const lb = $("listAuthBtn"); if (lb) lb.onclick = openAuth;
  const db = $("deleteListBtn"); if (db) db.onclick = deleteList;

  $("listEmpty").style.display = (items || []).length ? "none" : "";
  (items || []).forEach((it, i) => {
    const item = { id: it.tmdb_id, title: it.title, poster_path: it.poster_path, vote_average: it.vote_average, release_date: it.year };
    const card = makeCard(item, it.media_type);
    if (mine) {
      const rm = document.createElement("button");
      rm.className = "mini-btn";
      rm.style.margin = "0 8px 8px";
      rm.innerHTML = `${icon("trash", 13)}<span class="lbl">Entfernen</span>`;
      rm.onclick = async (e) => {
        e.stopPropagation();
        await sb.from("fl_list_items").delete().match({ list_id: listId, media_type: it.media_type, tmdb_id: it.tmdb_id });
        card.remove();
        toast("Entfernt");
      };
      card.appendChild(rm);
    }
    observeReveal(card, i);
    grid.appendChild(card);
  });
}
function shareList() {
  const url = location.origin + location.pathname + "#list=" + currentList.list.id;
  navigator.clipboard.writeText(url).then(
    () => toast("Link kopiert – einfach an Freunde schicken"),
    () => prompt("Link zum Teilen:", url)
  );
}
async function copyListToMine() {
  const src = currentList.list;
  const { data: newList, error } = await sb.from("fl_lists").insert({
    owner: session.user.id, owner_name: ownerName(), name: src.name, description: src.description
  }).select().single();
  if (error || !newList) { toast("Fehler beim Übernehmen"); return; }
  const { data: items } = await sb.from("fl_list_items").select("*").eq("list_id", src.id);
  if (items && items.length) {
    await sb.from("fl_list_items").upsert(items.map(it => ({
      list_id: newList.id, media_type: it.media_type, tmdb_id: it.tmdb_id,
      title: it.title, poster_path: it.poster_path, vote_average: it.vote_average, year: it.year
    })));
  }
  toast("Liste übernommen");
  await loadMyLists();
  dashDirty = true;
  openListDetail(newList.id);
}
async function deleteList() {
  if (!confirm("Liste „" + currentList.list.name + "“ wirklich löschen?")) return;
  await sb.from("fl_lists").delete().eq("id", currentList.list.id);
  myLists = myLists.filter(l => l.id !== currentList.list.id);
  dashDirty = true;
  toast("Liste gelöscht");
  curLib = "lists";
  switchView("library");
}

/* ===================== Merkliste/Gesehen teilen (Snapshot-Liste) ===================== */
async function shareLibrary() {
  if (curLib === "lists") return;
  if (!session) { openAuth(); return; }
  const entries = Object.values(store[curLib]);
  if (!entries.length) { toast("Noch nichts zum Teilen drin"); return; }
  toast("Erstelle Teilen-Link …");
  const name = (curLib === "watch" ? "Merkliste" : "Gesehen") + " von " + ownerName();
  try {
    await loadMyLists();
    let list = myLists.find(l => l.name === name);
    if (!list) {
      const { data, error } = await sb.from("fl_lists")
        .insert({ owner: session.user.id, owner_name: ownerName(), name, description: "Automatischer Schnappschuss" })
        .select().single();
      if (error || !data) throw error;
      list = data;
    }
    await sb.from("fl_list_items").delete().eq("list_id", list.id);
    const rows = entries.slice(0, 200).map(r => ({
      list_id: list.id, media_type: r.type, tmdb_id: r.id,
      title: r.title, poster_path: r.poster_path, vote_average: r.vote_average, year: r.date
    }));
    if (rows.length) await sb.from("fl_list_items").upsert(rows);
    dashDirty = true;
    const url = location.origin + location.pathname + "#list=" + list.id;
    if (navigator.share) await navigator.share({ title: "Filmliste", text: name, url }).catch(() => {});
    else { await navigator.clipboard.writeText(url); toast("Link kopiert"); }
  } catch { toast("Teilen fehlgeschlagen"); }
}

/* ===================== Swipe: Three.js-Glow ===================== */
let glowUniforms = null;
function initSwipeFX() {
  const canvas = $("swipeCanvas");
  if (!canvas || reducedMotion || typeof THREE === "undefined") return;
  try {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    glowUniforms = {
      uTime: { value: 0 },
      uDir: { value: new THREE.Vector2(0, 0) },
      uIntensity: { value: 0 },
      uColor: { value: new THREE.Color(0xe50914) },
      uAspect: { value: 1 }
    };
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: glowUniforms,
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position,1.0); }",
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime; uniform vec2 uDir; uniform float uIntensity;
        uniform vec3 uColor; uniform float uAspect;
        void main(){
          vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
          // sanfter atmender Grund-Glow in der Mitte unten
          float base = 0.10 * (0.6 + 0.4 * sin(uTime * 0.6)) * smoothstep(0.95, 0.0, length(p - vec2(0.0, -0.42)));
          // Richtungs-Glow beim Swipen
          vec2 target = uDir * vec2(0.62 * uAspect, 0.62);
          float d = length(p - target);
          float glow = uIntensity * smoothstep(0.85, 0.0, d);
          float a = clamp(base + glow * 0.55, 0.0, 0.6);
          gl_FragColor = vec4(uColor, a);
        }`
    });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
    function resize() {
      const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
      renderer.setSize(w, h, false);
      glowUniforms.uAspect.value = w / h;
    }
    resize();
    window.addEventListener("resize", resize);
    const clock = new THREE.Clock();
    (function animate() {
      requestAnimationFrame(animate);
      if (document.hidden || curView !== "swipe") return;
      glowUniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    })();
  } catch { /* WebGL fehlt */ }
}
const GLOW_COLORS = { save: 0xe50914, nope: 0x6b6b74, seen: 0x46d369 };
function setGlow(action, dx, dy, t) {
  // Edge-Labels + FABs synchron aufleuchten lassen
  $("edgeSave").style.opacity = action === "save" ? t : 0;
  $("edgeNope").style.opacity = action === "nope" ? t : 0;
  $("edgeSeen").style.opacity = action === "seen" ? t : 0;
  $("fabSave").classList.toggle("lit", action === "save" && t > 0.25);
  $("fabNope").classList.toggle("lit", action === "nope" && t > 0.25);
  if (!glowUniforms) return;
  if (action) glowUniforms.uColor.value.setHex(GLOW_COLORS[action]);
  glowUniforms.uDir.value.set(dx, dy);
  glowUniforms.uIntensity.value = t;
}
function resetGlow() {
  setGlow(null, 0, 0, 0);
  if (glowUniforms && hasGsap) gsap.to(glowUniforms.uIntensity, { value: 0, duration: 0.3 });
}

/* ===================== Swipe-Deck ===================== */
let deckItems = [];
let deckType = "movie";
let deckGenre = "";
let deckPage = 0;
let deckBusy = false;
let deckInit = false;

async function ensureDeck() {
  if (!deckInit) {
    deckInit = true;
    await populateSwipeGenres();
  }
  if (deckItems.length < 3) await fillDeck();
  renderDeck();
}
async function populateSwipeGenres() {
  if (!genreCache[deckType]) {
    try { const d = await api("/genre/" + deckType + "/list"); genreCache[deckType] = d.genres; } catch { return; }
  }
  const sel = $("swipeGenre");
  const cur = sel.value;
  sel.innerHTML = '<option value="">Alle Genres</option>' +
    genreCache[deckType].map(g => `<option value="${g.id}">${esc(g.name)}</option>`).join("");
  sel.value = cur;
}
async function fillDeck() {
  if (deckBusy) return;
  deckBusy = true;
  try {
    for (let tries = 0; tries < 4 && deckItems.length < 10; tries++) {
      deckPage = deckPage % 25 + 1;
      const params = {
        page: deckPage, watch_region: REGION,
        sort_by: "vote_average.desc",
        "vote_count.gte": deckType === "movie" ? 1500 : 500
      };
      if (deckGenre) params.with_genres = deckGenre;
      else if (prefs.fav.length && tries % 2 === 0) params.with_genres = prefs.fav.join("|");
      const d = await api("/discover/" + deckType, params);
      for (const item of d.results) {
        const k = keyOf(deckType, item.id);
        if (store.seen[k] || store.watch[k] || skipped.has(k)) continue;
        if (!item.poster_path || isHidden(item)) continue;
        if (deckItems.some(x => x.id === item.id)) continue;
        deckItems.push(item);
      }
      if (d.total_pages && deckPage >= d.total_pages) deckPage = 0;
    }
  } catch { /* offline */ }
  deckBusy = false;
}
function resetDeck() {
  deckItems = [];
  deckPage = Math.floor(Math.random() * 5);
  $("deck").innerHTML = "";
  ensureDeck();
}
function renderDeck() {
  const deck = $("deck");
  deck.innerHTML = "";
  $("deckEmpty").style.display = deckItems.length ? "none" : "";
  const visible = deckItems.slice(0, 3);
  for (let i = visible.length - 1; i >= 0; i--) {
    deck.appendChild(makeDeckCard(visible[i], i));
  }
}
function makeDeckCard(item, depth) {
  const el = document.createElement("div");
  el.className = "deck-card";
  el.dataset.id = item.id;
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  el.innerHTML = `
    <img src="${IMG}w500${item.poster_path}" alt="" draggable="false">
    <div class="dc-grad"></div>
    <div class="dc-info">
      <div class="dc-title">${esc(item.title || item.name)}</div>
      <div class="dc-meta">
        ${item.vote_average ? `<span class="match">${matchPct(item.vote_average)}</span>` : ""}
        <span>${year}</span><span>${deckType === "tv" ? "Serie" : "Film"}</span>
      </div>
      <div class="dc-overview">${esc(item.overview || "")}</div>
    </div>
    <div class="stamp save">Merken</div>
    <div class="stamp nope">Weiter</div>
    <div class="stamp seen">Gesehen</div>`;
  applyDepth(el, depth, false);
  if (depth === 0) makeTopDraggable(el, item);
  return el;
}
function applyDepth(el, depth, animate) {
  const props = { scale: 1 - depth * 0.05, y: depth * 14, opacity: depth > 2 ? 0 : 1 };
  if (hasGsap && animate && !reducedMotion) gsap.to(el, { ...props, duration: 0.3, ease: "power2.out" });
  else if (hasGsap) gsap.set(el, props);
  else el.style.transform = `translateY(${props.y}px) scale(${props.scale})`;
}
function dragAction(x, y) {
  if (y < -60 && Math.abs(x) < Math.abs(y)) return "seen";
  if (x > 30) return "save";
  if (x < -30) return "nope";
  return null;
}
function makeTopDraggable(el, item) {
  if (!hasGsap || typeof Draggable === "undefined") {
    el.onclick = () => openDetail(deckType, item.id);
    return;
  }
  const stamps = {
    save: el.querySelector(".stamp.save"),
    nope: el.querySelector(".stamp.nope"),
    seen: el.querySelector(".stamp.seen")
  };
  Draggable.create(el, {
    type: "x,y",
    onClick: () => openDetail(deckType, item.id),
    onDrag: function () {
      gsap.set(el, { rotation: this.x / 14 });
      const act = dragAction(this.x, this.y);
      const dist = Math.sqrt(this.x * this.x + this.y * this.y);
      const t = Math.min(dist / 150, 1);
      gsap.set(stamps.save, { opacity: act === "save" ? t : 0 });
      gsap.set(stamps.nope, { opacity: act === "nope" ? t : 0 });
      gsap.set(stamps.seen, { opacity: act === "seen" ? t : 0 });
      const len = dist || 1;
      setGlow(act, this.x / len, -this.y / len, act ? t : 0);
    },
    onDragEnd: function () {
      const act = dragAction(this.x, this.y);
      const dist = Math.sqrt(this.x * this.x + this.y * this.y);
      if (act && dist > 110) commitSwipe(act);
      else {
        resetGlow();
        gsap.to(el, { x: 0, y: 0, rotation: 0, duration: 0.45, ease: "elastic.out(1, 0.6)" });
        gsap.to([stamps.save, stamps.nope, stamps.seen], { opacity: 0, duration: 0.2 });
      }
    }
  });
}
function commitSwipe(action) {
  const item = deckItems[0];
  if (!item) return;
  const el = $("deck").querySelector(`.deck-card[data-id="${item.id}"]`);
  const k = keyOf(deckType, item.id);
  if (action === "save") { if (!store.watch[k]) toggle("watch", { ...item }, deckType); }
  else if (action === "seen") { if (!store.seen[k]) toggle("seen", { ...item }, deckType); }
  else { skipped.add(k); persistSkips(); }

  // Glow kurz aufflackern lassen, dann zurück
  const dir = action === "save" ? [1, 0] : action === "nope" ? [-1, 0] : [0, 1];
  setGlow(action, dir[0], dir[1], 1);
  setTimeout(resetGlow, 350);

  deckItems.shift();
  const finish = () => {
    renderDeck();
    if (deckItems.length < 4) fillDeck().then(() => { if (deckItems.length && !$("deck").children.length) renderDeck(); });
  };
  if (el && hasGsap && !reducedMotion) {
    gsap.killTweensOf(el);
    gsap.to(el, {
      x: action === "seen" ? 0 : (action === "save" ? 1 : -1) * window.innerWidth * 1.2,
      y: action === "seen" ? -window.innerHeight : 50,
      rotation: action === "seen" ? 0 : (action === "save" ? 22 : -22),
      duration: 0.42, ease: "power2.in",
      onComplete: finish
    });
  } else finish();
}

/* ===================== Swipe-Tutorial ===================== */
let tutTl = null;
function maybeShowTutorial() {
  if (localStorage.getItem("fl_tut")) return;
  const ov = $("tutOverlay");
  ov.style.display = "flex";
  if (!hasGsap || reducedMotion) return;
  const ghost = $("tutGhost");
  const txt = $("tutText");
  const stamps = {
    save: ov.querySelector(".tut-stamp.save"),
    nope: ov.querySelector(".tut-stamp.nope"),
    seen: ov.querySelector(".tut-stamp.seen")
  };
  const setText = (html) => { txt.innerHTML = html; };
  tutTl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
  tutTl
    .call(() => setText('Wisch nach <b class="c-save">rechts</b>, um dir einen Titel zu <b class="c-save">merken</b>'))
    .to(ghost, { x: 80, rotation: 9, duration: 0.7, ease: "power2.inOut" })
    .to(stamps.save, { opacity: 1, duration: 0.2 }, "<0.2")
    .to(ghost, { x: 0, rotation: 0, duration: 0.5, ease: "power2.inOut", delay: 0.5 })
    .to(stamps.save, { opacity: 0, duration: 0.2 }, "<")
    .call(() => setText('Wisch nach <b class="c-nope">links</b>, wenn er dich <b class="c-nope">nicht interessiert</b>'))
    .to(ghost, { x: -80, rotation: -9, duration: 0.7, ease: "power2.inOut", delay: 0.2 })
    .to(stamps.nope, { opacity: 1, duration: 0.2 }, "<0.2")
    .to(ghost, { x: 0, rotation: 0, duration: 0.5, ease: "power2.inOut", delay: 0.5 })
    .to(stamps.nope, { opacity: 0, duration: 0.2 }, "<")
    .call(() => setText('Wisch nach <b class="c-seen">oben</b>, wenn du ihn <b class="c-seen">schon gesehen</b> hast'))
    .to(ghost, { y: -70, duration: 0.7, ease: "power2.inOut", delay: 0.2 })
    .to(stamps.seen, { opacity: 1, duration: 0.2 }, "<0.2")
    .to(ghost, { y: 0, duration: 0.5, ease: "power2.inOut", delay: 0.5 })
    .to(stamps.seen, { opacity: 0, duration: 0.2 }, "<");
}
function closeTutorial() {
  localStorage.setItem("fl_tut", "1");
  if (tutTl) { tutTl.kill(); tutTl = null; }
  const ov = $("tutOverlay");
  if (hasGsap && !reducedMotion) gsap.to(ov, { opacity: 0, duration: 0.3, onComplete: () => { ov.style.display = "none"; ov.style.opacity = 1; } });
  else ov.style.display = "none";
}

/* ===================== Genre-Einstellungen ===================== */
async function ensureAllGenres() {
  if (allGenres) return;
  try {
    const [m, t] = await Promise.all([api("/genre/movie/list"), api("/genre/tv/list")]);
    const map = new Map();
    [...m.genres, ...t.genres].forEach(g => { if (!map.has(g.id)) map.set(g.id, g); });
    allGenres = [...map.values()].sort((a, b) => a.name.localeCompare(b.name, "de"));
  } catch { allGenres = []; }
}
async function ensureProviders() {
  if (providersCache) return;
  try {
    const [m, t] = await Promise.all([
      api("/watch/providers/movie", { watch_region: REGION }),
      api("/watch/providers/tv", { watch_region: REGION })
    ]);
    const map = new Map();
    [...(m.results || []), ...(t.results || [])].forEach(p => {
      const prio = (p.display_priorities && p.display_priorities[REGION]) ?? p.display_priority ?? 999;
      if (!map.has(p.provider_id) || prio < map.get(p.provider_id)._prio) {
        map.set(p.provider_id, { id: p.provider_id, name: p.provider_name, logo: p.logo_path, _prio: prio });
      }
    });
    providersCache = [...map.values()].sort((a, b) => a._prio - b._prio).slice(0, 18);
  } catch { providersCache = []; }
}
async function renderSettings() {
  const row = $("installRow");
  if (row) row.style.display = deferredPrompt ? "" : "none";
  await Promise.all([ensureAllGenres(), ensureProviders()]);
  renderPrefs();
}
function renderPrefs() {
  // Abos: ein Tipp = an/aus
  const subsWrap = $("prefSubs");
  subsWrap.innerHTML = "";
  for (const p of (providersCache || [])) {
    const c = document.createElement("div");
    c.className = "chip" + (subs.includes(p.id) ? " sub-on" : "");
    c.innerHTML = `${p.logo ? `<img src="${IMG}w92${p.logo}" alt="">` : ""}${esc(p.name)}${subs.includes(p.id) ? " " + icon("check", 12) : ""}`;
    c.onclick = () => {
      subs = subs.includes(p.id) ? subs.filter(x => x !== p.id) : [...subs, p.id];
      saveSubs();
      renderPrefs();
    };
    subsWrap.appendChild(c);
  }
  // Genres: zwei getrennte Single-Tap-Listen
  const mk = (wrapId, listName, otherName, cls) => {
    const wrap = $(wrapId);
    wrap.innerHTML = "";
    for (const g of (allGenres || [])) {
      const on = prefs[listName].includes(g.id);
      const c = document.createElement("div");
      c.className = "chip" + (on ? " " + cls : "");
      c.innerHTML = `${icon(genreIcon(g.id), 13)} ${esc(g.name)}`;
      c.onclick = () => {
        prefsDirty = true;
        if (on) prefs[listName] = prefs[listName].filter(x => x !== g.id);
        else {
          prefs[listName] = [...prefs[listName], g.id];
          prefs[otherName] = prefs[otherName].filter(x => x !== g.id);
        }
        savePrefs();
        renderPrefs();
      };
      wrap.appendChild(c);
    }
  };
  mk("prefFav", "fav", "hide", "fav");
  mk("prefHide", "hide", "fav", "hide");
}
async function changeApiKey() {
  const k = prompt("Neuen TMDB-API-Schlüssel eingeben (leer = Standard):", "");
  if (k === null) return;
  if (k.trim()) localStorage.setItem("fl_apikey", k.trim());
  else localStorage.removeItem("fl_apikey");
  location.reload();
}

/* ===================== Ambient-Hintergrund (Three.js) ===================== */
function initAmbient() {
  const canvas = $("bgCanvas");
  if (!canvas || reducedMotion || typeof THREE === "undefined") return;
  try {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" });
    renderer.setPixelRatio(1);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = { uTime: { value: 0 }, uAspect: { value: 1 } };
    const mat = new THREE.ShaderMaterial({
      transparent: true, uniforms,
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position,1.0); }",
      fragmentShader: `
        varying vec2 vUv; uniform float uTime; uniform float uAspect;
        void main(){
          vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
          float t = uTime;
          float b1 = smoothstep(1.0, 0.0, length(p - vec2(sin(t*0.11)*0.55, cos(t*0.07)*0.4)));
          float b2 = smoothstep(0.9, 0.0, length(p - vec2(sin(t*0.08+2.1)*-0.5, cos(t*0.12+1.3)*0.35)));
          vec3 col = vec3(0.90, 0.035, 0.08) * b1 + vec3(0.45, 0.04, 0.30) * b2;
          gl_FragColor = vec4(col, (b1 + b2) * 0.05);
        }`
    });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
    function resize() {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      uniforms.uAspect.value = window.innerWidth / window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    const clock = new THREE.Clock();
    (function animate() {
      requestAnimationFrame(animate);
      if (document.hidden) return;
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    })();
  } catch { /* WebGL fehlt */ }
}

/* ===================== Toast ===================== */
let toastTimer;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ===================== Events ===================== */
function wireEvents() {
  document.querySelectorAll("[data-go]").forEach(el =>
    el.addEventListener("click", () => switchView(el.dataset.go)));
  $("surpriseBtn").onclick = surpriseMe;
  $("loginBtn").onclick = openAuth;
  $("avatar").onclick = toggleMenu;
  $("exportBtn").onclick = exportData;
  $("importBtn").onclick = () => $("importFile").click();
  $("importFile").onchange = importData;
  $("logoutItem").onclick = doLogout;
  $("prefsBtn").onclick = () => { closeMenu(); switchView("settings"); };
  $("settingsBack").onclick = () => history.back();
  $("apiKeyBtn").onclick = changeApiKey;
  $("installBtn").onclick = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt = null;
    $("installRow").style.display = "none";
  };
  $("saveKeyBtn").onclick = saveKey;
  document.querySelectorAll("#typePills button").forEach(b => b.onclick = () => setDashType(b.dataset.type));
  $("bbInfo").onclick = () => { const item = bbItems[bbIdx]; if (item) openDetail(curType, item.id); };
  $("gridBack").onclick = () => history.back();
  $("gridFilterBtn").onclick = () => openFilter("grid");
  $("filterBtn").onclick = () => openFilter("dash");
  $("filterClose").onclick = closeFilter;
  $("filterApply").onclick = applyFilter;
  $("filterReset").onclick = resetFilter;
  $("filterOverlay").addEventListener("click", e => { if (e.target === $("filterOverlay")) closeFilter(); });
  $("loadMoreBtn").onclick = () => { curPage++; renderGrid(false); };
  if (gridIO) gridIO.observe($("gridSentinel"));
  document.querySelectorAll("#libSeg button").forEach(b => b.onclick = () => { curLib = b.dataset.lib; renderLibrary(); });
  $("shareLibBtn").onclick = shareLibrary;
  $("searchBtn").onclick = doSearch;
  $("searchInput").addEventListener("keydown", e => { if (e.key === "Enter") doSearch(); });
  $("searchInput").addEventListener("input", () => {
    $("searchClear").style.display = $("searchInput").value ? "flex" : "none";
  });
  $("searchClear").onclick = () => {
    $("searchInput").value = "";
    $("searchClear").style.display = "none";
    $("searchGrid").innerHTML = "";
    $("searchEmpty").style.display = "";
    $("searchInput").focus();
  };
  $("newListBtn").onclick = openNewList;
  $("backToLists").onclick = () => { curLib = "lists"; switchView("library"); history.replaceState(null, "", location.pathname + location.search); };
  $("createListBtn").onclick = createList;
  $("newListClose").onclick = closeNewList;
  $("authClose").onclick = closeAuth;
  $("googleBtn").onclick = googleLogin;
  $("magicBtn").onclick = sendMagicLink;
  $("authEmail").addEventListener("keydown", e => { if (e.key === "Enter") sendMagicLink(); });
  $("sheetOverlay").addEventListener("click", e => { if (e.target === $("sheetOverlay")) closeSheet(); });
  $("authOverlay").addEventListener("click", e => { if (e.target === $("authOverlay")) closeAuth(); });
  $("newListOverlay").addEventListener("click", e => { if (e.target === $("newListOverlay")) closeNewList(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { closeSheet(); closeAuth(); closeNewList(); closeFilter(); closeTrailer(); } });
  document.addEventListener("click", e => { if (!$("acctWrap").contains(e.target)) closeMenu(); });
  let lastScrollY = 0;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    $("appHeader").classList.toggle("scrolled", y > 14);
    if (isMobile()) {
      if (y > lastScrollY + 8 && y > 150) $("appHeader").classList.add("hide");
      else if (y < lastScrollY - 8 || y < 80) $("appHeader").classList.remove("hide");
    } else {
      $("appHeader").classList.remove("hide");
    }
    lastScrollY = y;
  }, { passive: true });
  document.querySelectorAll("#swipeTypeSeg button").forEach(b => b.onclick = async () => {
    deckType = b.dataset.type;
    document.querySelectorAll("#swipeTypeSeg button").forEach(x => x.classList.toggle("active", x === b));
    await populateSwipeGenres();
    resetDeck();
  });
  $("swipeGenre").onchange = () => { deckGenre = $("swipeGenre").value; resetDeck(); };
  $("swipeGearBtn").onclick = (e) => { e.stopPropagation(); $("swipePop").classList.toggle("open"); };
  $("swipePop").addEventListener("click", e => e.stopPropagation());
  document.addEventListener("click", () => $("swipePop").classList.remove("open"));
  $("fabToggle").checked = localStorage.getItem("fl_fabs") === "1";
  applyFabPref();
  $("fabToggle").onchange = () => {
    localStorage.setItem("fl_fabs", $("fabToggle").checked ? "1" : "0");
    applyFabPref();
  };
  $("resetSkipsBtn").onclick = () => {
    skipped.clear();
    persistSkips();
    resetDeck();
    $("swipePop").classList.remove("open");
    toast("Übersprungene Titel kommen wieder");
  };
  $("fabNope").onclick = () => commitSwipe("nope");
  $("fabSave").onclick = () => commitSwipe("save");
  $("fabInfo").onclick = () => { if (deckItems[0]) openDetail(deckType, deckItems[0].id); };
  $("tutDone").onclick = closeTutorial;
  $("trailerClose").onclick = closeTrailer;
  $("trailerOverlay").addEventListener("click", e => { if (e.target === $("trailerOverlay")) closeTrailer(); });

  // History: Hardware-Zurück schließt erst Overlays/Sheet, dann Views – statt die Seite zu zerlegen
  window.addEventListener("popstate", (e) => {
    closeTrailer();
    if (sheetOpenFlag) { closeSheet(true); return; }
    closeAuth(); closeNewList(); closeFilter();
    switchView((e.state && e.state.v) || "discover", true);
  });
  // bfcache-Restore (Zurück aus anderer Seite): Daten frisch aufbauen statt kaputtem Zustand
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      buildDashboard();
      if (hasGsap && typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    }
  });
}

function applyFabPref() {
  $("swipeActions").style.display = localStorage.getItem("fl_fabs") === "1" ? "flex" : "none";
}

/* ===================== Hash-Route (geteilte Listen) ===================== */
function handleHashRoute() {
  const t = location.hash.match(/t=(movie|tv)_(\d+)/i);
  const m = location.hash.match(/list=([0-9a-f-]+)/i);
  if (t || m) history.replaceState({ v: curView }, "", location.pathname + location.search);
  if (t) { openDetail(t[1].toLowerCase(), Number(t[2])); return; }
  if (m && cloudEnabled) openListDetail(m[1]);
}

/* ===================== Boot ===================== */
async function boot() {
  hydrateIcons();
  if (!tmdbKey || !(await validateKey())) {
    $("setup").style.display = "block";
    return;
  }
  $("setup").style.display = "none";
  $("appHeader").style.display = "";
  $("appMain").style.display = "";
  document.body.classList.add("app-on");
  history.replaceState({ v: "discover" }, "", "");
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
  if (hasGsap && !reducedMotion) {
    gsap.from("#appHeader .logo", { y: -26, opacity: 0, duration: 0.7, ease: "power3.out", delay: 0.05, clearProps: "transform,opacity" });
    gsap.from("#appHeader .hbtn", { y: -18, opacity: 0, duration: 0.5, stagger: 0.07, delay: 0.2, clearProps: "transform,opacity" });
    gsap.from("#bottomNav button", { scale: 0.4, opacity: 0, duration: 0.45, stagger: 0.06, delay: 0.25, ease: "back.out(2)", clearProps: "transform,opacity" });
  }
  renderTabs();
  wireEvents();
  updateCounts();
  initSheetDrag();
  initSwipeFX();
  initAmbient();
  if (hasGsap && typeof ScrollTrigger !== "undefined" && !reducedMotion) {
    gsap.to(".bb-img-wrap", { yPercent: 20, ease: "none",
      scrollTrigger: { trigger: "#billboard", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".bb-split", { yPercent: 30, opacity: 0.15, ease: "none",
      scrollTrigger: { trigger: "#billboard", start: "top top", end: "85% top", scrub: true } });
  }
  buildDashboard();

  if (cloudEnabled) {
    const { data } = await sb.auth.getSession();
    session = data.session;
    updateAuthUi();
    sb.auth.onAuthStateChange(async (_event, s) => {
      const wasLoggedOut = !session;
      session = s;
      updateAuthUi();
      if (s && wasLoggedOut) {
        closeAuth();
        await cloudLoad();
        await loadMyLists();
        toast("Angemeldet" + (s.user.email ? " als " + s.user.email : ""));
        if (curView === "library") renderLibrary();
      }
    });
    if (session) { await cloudLoad(); await loadMyLists(); }
  }
  handleHashRoute();
  window.addEventListener("hashchange", handleHashRoute);
}
boot();
