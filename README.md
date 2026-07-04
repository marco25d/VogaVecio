<p align="center">
  <img src="VogaVecio.png" width="300" alt="VogaVecio logo" />
</p>

<h1 align="center">VogaVecio</h1>

<p align="center">
  A simple app that uses OpenStreetMap to estimate nautical travel times for rowing boats, including kayaks, SUPs, and sandolos.
</p>

<p align="center">
  <a href="https://marco25d.github.io/VogaVecio/">🌊 Open the app</a>
</p>

---

## What it does

Pick two points on the sea, choose your vessel and paddling pace, and VogaVecio gives you a realistic time estimate — adjusted in real time for live wind and wave conditions from the Open-Meteo API.

- **Tap to place** start and end points on the map
- **Use your GPS position** as the starting point
- **Choose your vessel** — Kayak, SUP, Sandolo, or Galea veneziana
- **Set your pace** — Slow, Fast, or a custom speed in km/h
- **Sea current** — Favorable, None, Against, or a custom percentage
- **Live weather** — wind speed and wave height fetched automatically, with color-coded severity levels (Very low → Extreme)
- **Safety warning** — if conditions are High or Extreme, the app discourages the trip (unless you're on a Galea veneziana)

## Land & water detection

The route between the two points is sampled at regular intervals. Each sample is tested against the [Natural Earth](https://www.naturalearthdata.com/) land polygon dataset (1:50m resolution) using a ray casting algorithm running entirely client-side — no extra API calls needed.

- **Blue line** — water segments, counted toward distance and time
- **Grey dashed line** — land segments, excluded from the estimate

> Minor inaccuracies near coastlines are expected due to the resolution of the dataset. The app is designed for open-sea wild estimates, not precision navigation.

## Works on mobile

VogaVecio is a **Progressive Web App (PWA)**. On Android or iPhone, open the link in your browser and tap *Add to Home Screen* — it installs like a native app, no app store required.

## APIs used

| API | What it provides | Why |
|-----|-----------------|-----|
| [Open-Meteo Forecast](https://open-meteo.com/) | Wind speed and direction at the route midpoint | Completely free, no API key or registration required, reliable global coverage |
| [Open-Meteo Marine](https://open-meteo.com/en/docs/marine-weather-api) | Wave height at the route midpoint | Same provider, same conditions — zero setup, returns significant wave height which is enough for a safety estimate |
| [OpenStreetMap](https://www.openstreetmap.org/) via Leaflet tiles | Map rendering | Free and open, no API key, worldwide coverage, community maintained |
| [Natural Earth](https://www.naturalearthdata.com/) 1:50m land polygons | Land/water classification along the route | Bundled in the app, no API call — enables client-side ray casting with no rate limits |

All APIs are **free and keyless** — the app works out of the box with no account or token needed.

## Tech

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [Leaflet](https://leafletjs.com/) / [react-leaflet](https://react-leaflet.js.org/) — OpenStreetMap tiles
- [Open-Meteo](https://open-meteo.com/) — free weather & marine API, no key required
- [Natural Earth](https://www.naturalearthdata.com/) — land polygon dataset for route classification
- PWA via [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)

## Run locally

```bash
npm install
npm run dev
```

## Deploy

```bash
npm run deploy   # builds and pushes to GitHub Pages
```
