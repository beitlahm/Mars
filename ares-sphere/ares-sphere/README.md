# ARES-SPHERE // Mars Colonization & Tactical Simulator

3D Mars globe with colonization sites, plus a drivable 6-wheel rover ISRU surface simulation (Three.js r128 + React).

## Run
```bash
npm install
npm run dev
```

## Structure
- `src/data/sites.js` – sites, supply routes, ice routes, terrain elevation
- `src/utils/marsTextures.js` – procedural Mars color/bump textures
- `src/components/GlobalMarsGlobeViewport.jsx` – orbital globe
- `src/components/ControllableMarsSurfaceViewport.jsx` – rover simulation
- `src/App.jsx` – app shell and views

Controls: drag globe, click a site to land; W/A/S/D or arrows to drive.
