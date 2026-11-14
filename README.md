# Martian Map

An interactive Cesium mission-planning prototype for a proposed astronaut excursion in Arcadia Planitia. The demo combines local HiRISE imagery and stereo terrain with THEMIS daytime infrared context and a Viking global basemap.

## Run locally

Use Node.js 22 or later.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Use `npm run build` for a production build and `npm run preview` to serve it locally. The build copies Cesium and its workers from the pinned npm package. The map imagery and terrain ship with the app, and the globe requires WebGL.

## Plan an excursion

Switch between optical, elevation and thermal layers. Use the planet, field, overhead and surface cameras to inspect the site. Select a stop to edit its name, objective and duration, or place another stop on terrain with coverage. The planner estimates time and distance for a return to the habitat and shows the elevation profile where coverage exists. Export and import the plan as Mars GeoJSON.

The habitat and stops are concept placements. Orbital datasets inform the preview, and the route still requires ground validation for hazards and suitability.

See [team ownership and next steps](TEAM.md) and [map data provenance](public/mars-assets/README.md).

## GitHub Pages

In Settings → Pages, set the source to **GitHub Actions**. The Deploy Martian Map workflow builds and publishes the app on pushes to main, using the base path reported by GitHub Pages.
