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
  cards: '<rect x="3" y="6" width="13" height="16" rx="2" transform="rotate(-8 9.5 14)"/><rect x="9" y="4" width="13" height="16" rx="2" transform="rotate(6 15.5 12)"/>',
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3" fill="currentColor" stroke="none"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  chev: '<polyline points="9 18 15 12 9 6"/>',
  sliders: '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>'
};
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
let tmdbKey = EMBEDDED_TMDB_KEY || localStorage.getItem("fl_apikey") || "";
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

function persist() { localStorage.setItem("fl_store", JSON.stringify(store)); updateCounts(); }
function persistSkips() { localStorage.setItem("fl_skip", JSON.stringify([...skipped].slice(-600))); }
function savePrefs() { localStorage.setItem("fl_prefs", JSON.stringify(prefs)); }
function isHidden(item) { return (item.genre_ids || []).some(g => prefs.hide.includes(g)); }
function keyOf(type, id) { return type + "_" + id; }
function esc(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function matchPct(v) { return v ? Math.round(v * 10) + " %" : null; }
function $(id) { return document.getElementById(id); }

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
function switchView(v) {
  if (v !== "listdetail") currentList = null;
  const prev = curView;
  curView = v;
  const navTarget = v === "listdetail" ? "library" : (v === "grid" ? "discover" : v);
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.view === navTarget));
  document.querySelectorAll(".bottom-nav button").forEach(b => b.classList.toggle("active", b.dataset.go === navTarget));
  ["discover", "grid", "swipe", "search", "library", "listdetail"].forEach(s => {
    const el = $("view-" + s);
    if (el) el.style.display = s === v ? "" : "none";
  });
  if (hasGsap && !reducedMotion && prev !== v) {
    gsap.fromTo("#view-" + v, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", clearProps: "all" });
  }
  if (v === "library") renderLibrary();
  if (v === "swipe") { ensureDeck(); maybeShowTutorial(); }
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
    $("rows").innerHTML = "<div class='empty'>Fehler beim Laden – Internetverbindung prüfen.</div>";
  }
}
function showBillboard(i, instant) {
  bbIdx = i;
  const item = bbItems[i];
  if (!item) return;
  const next = bbActiveImg === "A" ? "B" : "A";
  const imgNext = $("bbImg" + next);
  const imgCur = $("bbImg" + bbActiveImg);
  const src = IMG + (isMobile() ? "w780" : "w1280") + item.backdrop_path;

  const apply = () => {
    if (hasGsap && !reducedMotion) {
      gsap.killTweensOf([imgNext, imgCur]);
      gsap.set(imgNext, { opacity: 0, scale: 1.06 });
      gsap.to(imgNext, { opacity: 1, duration: instant ? 0.6 : 1.1, ease: "power2.inOut" });
      gsap.to(imgNext, { scale: 1.14, duration: 9, ease: "none" });
      gsap.to(imgCur, { opacity: 0, duration: instant ? 0 : 1.1, ease: "power2.inOut" });
    } else {
      imgNext.style.opacity = 1; imgCur.style.opacity = 0;
    }
    bbActiveImg = next;
    const title = item.title || item.name;
    const year = (item.release_date || item.first_air_date || "").slice(0, 4);
    $("bbTitle").innerHTML = String(title).split("").map(c => c === " " ? " " : `<span class="ch">${esc(c)}</span>`).join("");
    $("bbMeta").innerHTML = `
      ${item.vote_average ? `<span class="match">${matchPct(item.vote_average)} Bewertung</span>` : ""}
      <span>${year}</span>
      <span class="chip-min">${curType === "tv" ? "Serie" : "Film"}</span>`;
    $("bbOverview").textContent = item.overview || "";
    updateBbSave();
    if (hasGsap && !reducedMotion) {
      gsap.fromTo([$("bbTag"), $("bbMeta"), $("bbOverview")],
        { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" });
      gsap.fromTo("#bbTitle .ch", { opacity: 0, yPercent: 65 },
        { opacity: 1, yPercent: 0, duration: 0.55, stagger: 0.02, ease: "power3.out" });
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
  const item = bbItems[bbIdx];
  if (!item) return;
  const k = keyOf(curType, item.id);
  $("bbSave").innerHTML = store.watch[k]
    ? `${icon("check", 16)} Gemerkt`
    : `${icon("bookmark", 16)} Merken`;
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
}, { rootMargin: "300px 0px" }) : null;

function buildRows(top10) {
  const wrap = $("rows");
  wrap.innerHTML = "";
  const addRow = (shell) => { wrap.appendChild(shell.row); revealRow(shell.row); return shell; };

  const r10 = addRow(rowShell("Top 10 diese Woche", null));
  fillTop10(r10.scroller, top10);

  const watchEntries = Object.values(store.watch);
  if (watchEntries.length >= 2) {
    const rw = addRow(rowShell("Deine Merkliste", () => switchView("library")));
    fillRowFromStore(rw.scroller, watchEntries.slice(0, 20));
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
    opacity: 0, y: 36, duration: 0.65, ease: "power3.out",
    scrollTrigger: { trigger: row, start: "top 94%" }
  });
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
    gsap.to(tile, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: Math.min(idx * 0.04, 0.5),
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
  loadGenres();
  renderGrid(true);
}
async function loadGenres() {
  if (!genreCache[curType]) {
    const d = await api("/genre/" + curType + "/list");
    genreCache[curType] = d.genres;
  }
  const wrap = $("genreChips");
  wrap.innerHTML = "";
  const all = document.createElement("div");
  all.className = "chip" + (curGenre === null ? " active" : "");
  all.textContent = "Alle";
  all.onclick = () => { curGenre = null; loadGenres(); renderGrid(true); };
  wrap.appendChild(all);
  for (const g of genreCache[curType]) {
    const c = document.createElement("div");
    c.className = "chip" + (curGenre === g.id ? " active" : "");
    c.textContent = g.name;
    c.onclick = () => { curGenre = (curGenre === g.id ? null : g.id); loadGenres(); renderGrid(true); };
    wrap.appendChild(c);
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
}, { rootMargin: "0px 0px -6% 0px" }) : null;
function observeReveal(el, idx = 0) {
  if (!revealIO || reducedMotion) { el.classList.remove("reveal-init"); return; }
  el.classList.add("reveal-init");
  el._revealDelay = (idx % 6) * 0.04;
  revealIO.observe(el);
}
async function renderGrid(reset) {
  const grid = $("discoverGrid");
  const spin = $("discoverSpinner");
  if (reset) { curPage = 1; grid.innerHTML = ""; }
  spin.style.display = "block";
  $("loadMoreBtn").style.display = "none";
  try {
    const rank = RANKS.find(r => r.id === curRank);
    const params = { page: curPage, watch_region: REGION, ...rank.p(curType) };
    if (curGenre) params.with_genres = curGenre;
    const d = await api("/discover/" + curType, params);
    spin.style.display = "none";
    const hideSeen = $("hideSeen").checked;
    let i = 0;
    for (const item of d.results) {
      if (hideSeen && store.seen[keyOf(curType, item.id)]) continue;
      if (!curGenre && isHidden(item)) continue;
      const card = makeCard(item, curType);
      observeReveal(card, i++);
      grid.appendChild(card);
    }
    $("loadMoreBtn").style.display = curPage < Math.min(d.total_pages, 250) ? "flex" : "none";
  } catch {
    spin.textContent = "Fehler beim Laden.";
  }
}

/* ===================== Suche ===================== */
async function doSearch() {
  const q = $("searchInput").value.trim();
  if (!q) return;
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
function makeCard(item, type) {
  const id = item.id;
  const k = keyOf(type, id);
  const title = item.title || item.name || "?";
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  const rating = item.vote_average ? Number(item.vote_average).toFixed(1) : null;

  const card = document.createElement("div");
  card.className = "card" + (store.seen[k] ? " is-seen" : "") + (store.watch[k] ? " is-watch" : "");
  card.dataset.key = k;

  const posterHtml = item.poster_path
    ? `<img class="poster" loading="lazy" src="${IMG}w342${item.poster_path}" alt="">`
    : `<div class="noposter">${icon("film", 34)}</div>`;

  card.innerHTML = `
    <div class="poster-wrap">
      ${posterHtml}
      ${rating ? `<div class="badge rating">${icon("star", 11)} ${rating}</div>` : ""}
      <div class="badge seen">${icon("check", 11)}</div>
      <div class="badge watch">${icon("bookmark", 11)}</div>
    </div>
    <div class="info">
      <div class="title">${esc(title)}</div>
      <div class="meta"><span>${year || ""}</span><span>${type === "tv" ? "Serie" : "Film"}</span></div>
    </div>
    <div class="actions-row">
      <button class="mini-btn ${store.seen[k] ? "on-seen" : ""}" data-act="seen">${icon("check", 14)}<span class="lbl">${store.seen[k] ? "Gesehen" : "Gesehen?"}</span></button>
      <button class="mini-btn ${store.watch[k] ? "on-watch" : ""}" data-act="watch">${icon("bookmark", 14)}<span class="lbl">${store.watch[k] ? "Gemerkt" : "Merken"}</span></button>
    </div>`;

  card.onclick = (e) => {
    const btn = e.target.closest("[data-act]");
    if (btn) {
      toggle(btn.dataset.act, item, type);
      card.replaceWith(makeCard(item, type));
    } else {
      openDetail(type, id);
    }
  };
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
    const card = makeCard(item, e.type);
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
  document.body.style.overflow = "hidden";
  sheetOpenFlag = true;
  const sheet = $("sheet");
  if (hasGsap && isMobile() && !reducedMotion) {
    gsap.fromTo(sheet, { y: "100%" }, { y: "0%", duration: 0.45, ease: "power3.out" });
  } else {
    sheet.style.transform = "translateY(0%)";
  }
}
function closeSheet() {
  if (!sheetOpenFlag) return;
  const sheet = $("sheet");
  const done = () => {
    $("sheetOverlay").classList.remove("open");
    document.body.style.overflow = "";
    sheetOpenFlag = false;
  };
  if (hasGsap && isMobile() && !reducedMotion) {
    gsap.to(sheet, { y: "100%", duration: 0.32, ease: "power2.in", onComplete: done });
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
    const provSection = (label, arr) => !arr || !arr.length ? "" : `
      <h3>${label}</h3><div class="prov-row">${arr.map(p => `
        <div class="prov"><img src="${IMG}w92${p.logo_path}" alt=""><span>${esc(p.provider_name)}</span></div>`).join("")}
      </div>`;
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
        <button class="close" id="sheetClose">${icon("x", 16)}</button>
      </div>
      <div class="body">
        <h2>${esc(title)}</h2>
        <div class="sub">
          ${d.vote_average ? `<span class="match">${matchPct(d.vote_average)} Bewertung</span>` : ""}
          <span>${[year, runtime].filter(Boolean).join(" · ")}</span>
          ${d.vote_average ? `<span class="star">${icon("star", 12)} ${d.vote_average.toFixed(1)} <span style="color:var(--faint);font-weight:400">(${(d.vote_count || 0).toLocaleString("de-DE")})</span></span>` : ""}
        </div>
        ${genres ? `<div class="sub" style="margin-top:-8px">${esc(genres)}</div>` : ""}
        <p class="overview">${esc(d.overview || "Keine Beschreibung verfügbar.")}</p>
        <div class="big-actions">
          <button class="btn ${store.watch[k] ? "" : "primary"}" id="mWatch">${icon(store.watch[k] ? "check" : "bookmark", 15)} <span>${store.watch[k] ? "Gemerkt" : "Auf Merkliste"}</span></button>
          <button class="btn ${store.seen[k] ? "primary" : ""}" id="mSeen">${icon("check", 15)} <span>${store.seen[k] ? "Gesehen" : "Als gesehen markieren"}</span></button>
          ${trailer ? `<a class="btn glass" href="https://www.youtube.com/watch?v=${esc(trailer.key)}" target="_blank">${icon("play", 14)} Trailer</a>` : ""}
          <a class="btn glass" href="${provLink}" target="_blank">${icon("ext", 15)} JustWatch</a>
        </div>
        ${addToListHtml}
        <div class="providers">
          ${hasProv
            ? provSection("Im Abo enthalten", prov.flatrate) + provSection("Leihen", prov.rent) + provSection("Kaufen", prov.buy)
            : "<h3>Streaming</h3><p style='color:var(--muted);font-size:0.88rem'>Aktuell keine Streaming-Infos für Deutschland gefunden.</p>"}
          <div class="attribution">Verfügbarkeit für Deutschland · Daten von JustWatch</div>
        </div>
      </div>`;

    currentDetail = { d, type, k };
    $("sheetClose").onclick = closeSheet;
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
}
function closeAuth() { $("authOverlay").classList.remove("open"); }
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
    avatar.textContent = name[0].toUpperCase();
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
  await loadMyLists();
  if (!myLists.length) {
    empty.innerHTML = `<div class="ico-big">${icon("list", 44)}</div>Noch keine Listen.<br>Erstelle z.B. „Filmabend-Favoriten“ und teile sie per Link.`;
    empty.style.display = ""; return;
  }
  empty.style.display = "none";
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
  $("newListName").focus();
}
function closeNewList() { $("newListOverlay").classList.remove("open"); }
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
  openListDetail(newList.id);
}
async function deleteList() {
  if (!confirm("Liste „" + currentList.list.name + "“ wirklich löschen?")) return;
  await sb.from("fl_lists").delete().eq("id", currentList.list.id);
  toast("Liste gelöscht");
  curLib = "lists";
  switchView("library");
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
async function openPrefs() {
  closeMenu();
  await ensureAllGenres();
  renderPrefChips();
  $("prefsOverlay").classList.add("open");
}
function renderPrefChips() {
  const wrap = $("prefChips");
  wrap.innerHTML = "";
  for (const g of (allGenres || [])) {
    const c = document.createElement("div");
    const state = prefs.fav.includes(g.id) ? "fav" : prefs.hide.includes(g.id) ? "hide" : "";
    c.className = ("chip " + state).trim();
    c.innerHTML = state === "fav" ? `${icon("star", 12)} ${esc(g.name)}`
      : state === "hide" ? `${icon("x", 12)} ${esc(g.name)}`
      : esc(g.name);
    c.onclick = () => {
      prefsDirty = true;
      if (prefs.fav.includes(g.id)) { prefs.fav = prefs.fav.filter(x => x !== g.id); prefs.hide.push(g.id); }
      else if (prefs.hide.includes(g.id)) { prefs.hide = prefs.hide.filter(x => x !== g.id); }
      else { prefs.fav.push(g.id); }
      savePrefs();
      renderPrefChips();
    };
    wrap.appendChild(c);
  }
}
function closePrefs() {
  if (!$("prefsOverlay").classList.contains("open")) return;
  $("prefsOverlay").classList.remove("open");
  if (prefsDirty) {
    prefsDirty = false;
    buildDashboard();
    resetDeck();
    toast("Einstellungen übernommen");
  }
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
  $("searchHBtn").onclick = () => switchView("search");
  $("loginBtn").onclick = openAuth;
  $("avatar").onclick = toggleMenu;
  $("exportBtn").onclick = exportData;
  $("importBtn").onclick = () => $("importFile").click();
  $("importFile").onchange = importData;
  $("logoutItem").onclick = doLogout;
  $("prefsBtn").onclick = openPrefs;
  $("prefsClose").onclick = closePrefs;
  $("prefsOverlay").addEventListener("click", e => { if (e.target === $("prefsOverlay")) closePrefs(); });
  $("saveKeyBtn").onclick = saveKey;
  $("resetKeyLink").onclick = (e) => { e.preventDefault(); localStorage.removeItem("fl_apikey"); location.reload(); };
  document.querySelectorAll("#typePills button").forEach(b => b.onclick = () => setDashType(b.dataset.type));
  $("bbSave").onclick = () => {
    const item = bbItems[bbIdx];
    if (item) { toggle("watch", item, curType); updateBbSave(); }
  };
  $("bbInfo").onclick = () => { const item = bbItems[bbIdx]; if (item) openDetail(curType, item.id); };
  $("gridBack").onclick = () => switchView("discover");
  $("hideSeen").onchange = () => renderGrid(true);
  $("loadMoreBtn").onclick = () => { curPage++; renderGrid(false); };
  document.querySelectorAll("#libSeg button").forEach(b => b.onclick = () => { curLib = b.dataset.lib; renderLibrary(); });
  $("searchBtn").onclick = doSearch;
  $("searchInput").addEventListener("keydown", e => { if (e.key === "Enter") doSearch(); });
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
  document.addEventListener("keydown", e => { if (e.key === "Escape") { closeSheet(); closeAuth(); closeNewList(); closePrefs(); } });
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
}

function applyFabPref() {
  $("swipeActions").style.display = localStorage.getItem("fl_fabs") === "1" ? "flex" : "none";
}

/* ===================== Hash-Route (geteilte Listen) ===================== */
function handleHashRoute() {
  const m = location.hash.match(/list=([0-9a-f-]+)/i);
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
  $("appFooter").style.display = "";
  document.body.classList.add("app-on");
  if (hasGsap && !reducedMotion) {
    gsap.from("#appHeader .logo", { y: -26, opacity: 0, duration: 0.7, ease: "power3.out", delay: 0.05, clearProps: "transform,opacity" });
    gsap.from("#appHeader .hbtn", { y: -18, opacity: 0, duration: 0.5, stagger: 0.07, delay: 0.2, clearProps: "transform,opacity" });
    gsap.from("#bottomNav button", { y: 22, opacity: 0, duration: 0.5, stagger: 0.08, delay: 0.3, ease: "back.out(1.6)", clearProps: "transform,opacity" });
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
    gsap.to(".bb-content", { yPercent: 42, opacity: 0.1, ease: "none",
      scrollTrigger: { trigger: "#billboard", start: "top top", end: "80% top", scrub: true } });
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
