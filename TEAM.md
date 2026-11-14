# Martian Map team handoff

| Area | Files | Next task |
| --- | --- | --- |
| Globe and terrain | `src/components/MarsGlobe.jsx`, `src/lib/terrain.js` | Improve camera transitions and assess finer terrain around key stops. |
| Science and data | `src/data/mission.js`, `public/mars-assets/`, `scripts/prepare_terrain.py` | Validate the habitat and stop placements against source coverage and document additional evidence. |
| Interface | `src/App.css`, `src/components/RoutePanel.jsx`, `src/components/SourcePanel.jsx` | Refine mobile controls and the workflow for navigating from terrain to a stop. |
| Mission logic and integration | `src/lib/mission.js`, `src/App.jsx`, `tests/` | Improve route assessment and coordinate integration across the map, science data and interface. |

Use the current `main` as the starting point. Coordinate edits to shared interfaces before changing component props or the GeoJSON format. Run `npm test` and `npm run build` before integrating changes.

Keep published terrain and imagery provenance with any replacement dataset. Use planetocentric latitude and signed east longitude in the app. Keep measured data, proposed placements and planning assumptions labeled in the interface.
