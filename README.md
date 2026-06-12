# 🎬 Filmliste

**Was schauen wir heute?** – Eine mobile-first Web-App zum Entdecken, Swipen und Merken von Filmen & Serien, mit Streaming-Verfügbarkeit für Deutschland.

**Live:** [filmliste-woad.vercel.app](https://filmliste-woad.vercel.app)

---

## Features

- **Dashboard** mit rotierendem Billboard (Trending der Woche), Top-10-Reihe mit großen Nummern, kuratierten Ranking-Reihen (Top aller Zeiten, Klassiker, Hidden Gems …) und persönlichen Reihen (Watchlist, eigene Listen, Lieblings-Genres)
- **Swipe-Modus** im Tinder-Stil: rechts = merken, links = weiter, hoch = schon gesehen – mit Three.js-Glow-Feedback und Einmal-Tutorial
- **Watchlist & Gesehen-Liste**, lokal (localStorage) und mit Login geräteübergreifend synchronisiert
- **Eigene Listen** erstellen und per Link teilen – Empfänger können sie mit einem Tipp übernehmen; Watchlist/Gesehen lassen sich als Schnappschuss-Liste teilen
- **Filter**: Genre, Mindest-Bewertung (Sterne), Plattform, Gesehenes ausblenden
- **Streaming-Abos** hinterlegen → Detailansicht zeigt „In deinem Abo“ (Daten: JustWatch via TMDB)
- **Trailer** als Inline-Popup (YouTube), **Teilen** einzelner Titel per nativem Share-Sheet (Deep-Link `#t=movie_123`)
- **Login** per Google (OAuth) oder E-Mail-Magic-Link über Supabase
- **PWA**: installierbar (Android: Install-Prompt, iOS: „Zum Home-Bildschirm“), Service-Worker-Shell-Cache
- **Design**: dunkles Kino-UI mit Liquid-Glass-Effekten (SVG-Displacement-Refraktion in Chromium, Glas-Fallback in Safari/Firefox), GSAP-Animationen, Three.js-Ambient

## Tech-Stack

| Bereich | Technologie |
|---|---|
| Frontend | Vanilla JS (Single Page), kein Build-Schritt |
| Daten | [TMDB API](https://developer.themoviedb.org) (Filme/Serien/Verfügbarkeit) |
| Backend | [Supabase](https://supabase.com) (Postgres + RLS, Auth, Edge Functions) |
| Animation | GSAP 3 (ScrollTrigger, Draggable), Three.js |
| Hosting | Vercel (statisch + Cron-Function) |

## Projektstruktur

```
├── index.html        # App-Shell, alle Views & Dialoge
├── styles.css        # Designsystem (Liquid Glass, mobile-first)
├── app.js            # Gesamte App-Logik
├── sw.js             # Service Worker (PWA / Offline-Shell)
├── manifest.json     # Web-App-Manifest
├── app-icon.png      # App-Icon / Favicon
├── vercel.json       # Wöchentlicher Cron (Supabase-Keep-Alive)
└── api/keepalive.js  # Vercel-Function: pingt Supabase (Free-Tier pausiert sonst nach 7 Tagen)
```

## Setup (eigene Instanz)

1. **TMDB-Key**: Kostenlos unter [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) → in `app.js` bei `EMBEDDED_TMDB_KEY` eintragen (oder leer lassen, dann fragt die App beim Start).
2. **Supabase-Projekt** anlegen und dieses Schema ausführen (Tabellen `fl_user_items`, `fl_lists`, `fl_list_items` mit RLS: eigene Einträge nur für den Besitzer, Listen öffentlich lesbar fürs Link-Sharing). URL + Publishable Key in `app.js` (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) eintragen.
3. **Google-Login**: In der Google Cloud Console einen OAuth-Client (Web) anlegen – Redirect-URI: `https://<projekt-ref>.supabase.co/auth/v1/callback` – und in Supabase unter *Authentication → Providers → Google* eintragen. Unter *Authentication → URL Configuration* die eigene Domain als Site URL + Redirect URL setzen.
4. **Deploy**: Repo zu Vercel verbinden (Framework: „Other“) – fertig. Der Cron in `vercel.json` hält die Supabase-Datenbank automatisch aktiv. In `api/keepalive.js` die eigene Supabase-URL/Key eintragen.

## Hinweise

- **Browser-Support**: Chrome/Edge/Android (volle Liquid-Glass-Refraktion), Safari/iOS & Firefox (eleganter Glas-Fallback). iOS-Besonderheiten (Viewport-Einheiten, Input-Zoom, Install-Flow) sind berücksichtigt.
- **Service Worker**: Bei Änderungen an den Assets die `CACHE`-Version in `sw.js` hochzählen, sonst sehen Bestandsnutzer die alte Version.
- Dieses Produkt nutzt die TMDB-API, ist aber nicht von TMDB unterstützt oder zertifiziert. Streaming-Verfügbarkeit von [JustWatch](https://www.justwatch.com).
