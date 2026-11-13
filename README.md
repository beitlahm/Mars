# Mars
this is prototype
Got you. Clean, structured, airtight.

---

## 🔴 TEAM RULES — READ BEFORE TOUCHING ANYTHING

paste these rules into every single AI prompt your team writes. No exceptions.

```
STRICT RULES — FOLLOW THESE EXACTLY:
1. Only modify the file I specify. Touch nothing else.
2. Do not rename any variables that other files import.
3. Do not change any function signatures or prop names.
4. Do not install new packages without saying so explicitly.
5. Do not delete any existing code — comment it out if needed.
6. Do not modify App.jsx under any circumstances.
7. Import everything from src/data/config.js — never hardcode values.
8. Every component must have a comment at the top saying who owns it.
9. If something is unclear, add a TODO comment — do not guess.
10. End every response with: "FILES MODIFIED: [list them]"
```

---

## 👤 Person 1 — The 3D Globe
**File: `src/components/MarsGlobe.jsx` — YOU OWN THIS. NOTHING ELSE.**

### What done looks like:
```
✅ Full screen 3D Mars sphere visible in browser
✅ Mars optical imagery covering the globe
✅ Camera centered on Jezero Crater on load
✅ 5 numbered colored pins on the surface
✅ Dashed orange line connecting all 5 pins
✅ Clicking a pin calls onNodeClick(waypoint)
✅ Switching activeLayer prop changes the tile imagery
✅ Black space background, no Cesium default UI
```

### What you do NOT touch:
```
❌ Sidebar.jsx
❌ NodePanel.jsx
❌ RadiationWidget.jsx
❌ App.jsx
❌ index.css
❌ waypoints.json
```

### Your Antigravity/Cursor prompt:
```
I am Person 1 on a 4-person team.
I only own src/components/MarsGlobe.jsx.

STRICT RULES:
1. Only modify MarsGlobe.jsx. Touch nothing else.
2. Do not rename any exported function or prop.
3. Import TILES and JEZERO from ../data/config.js only.
4. Do not install new packages.
5. Do not modify App.jsx under any circumstances.
6. Comment out old code instead of deleting it.
7. End your response with "FILES MODIFIED: [list]"

TASK:
In src/components/MarsGlobe.jsx, using CesiumJS 
loaded from CDN (window.Cesium), build a full screen 
3D globe with:

- Mars optical tile layer from TILES.optical in config.js
- Camera centered on JEZERO coordinates from config.js
- 5 numbered circular pins using waypoints prop
- Each pin color: safe=green, caution=yellow, danger=red
- Dashed orange polyline connecting all pins in order
- Click handler: when pin clicked call onNodeClick(waypoint)
- activeLayer prop: when it changes swap the tile URL
  using TILES[activeLayer] from config.js
- Black background, all Cesium default UI removed

Props this component receives:
- waypoints (array) — from waypoints.json
- onNodeClick (function) — called with clicked waypoint
- activeLayer (string) — 'optical','elevation','thermal','geology'

The component must export as default MarsGlobe.
```

---

## 👤 Person 2 — Data & Node Panel
**Files: `src/data/waypoints.json` + `src/components/NodePanel.jsx` — YOU OWN THESE. NOTHING ELSE.**

### What done looks like:
```
✅ waypoints.json has 5 scientifically accurate nodes
✅ Each node has all required fields (see below)
✅ NodePanel renders all node data cleanly
✅ Rover photo loads with fallback if URL fails
✅ Safety banner is green/yellow/red correctly
✅ Close button calls onClose prop
✅ All fields match exactly what App.jsx expects
```

### What you do NOT touch:
```
❌ MarsGlobe.jsx
❌ Sidebar.jsx
❌ RadiationWidget.jsx
❌ App.jsx
❌ config.js
❌ index.css
```

### Your Antigravity/Cursor prompt:
```
I am Person 2 on a 4-person team.
I own src/data/waypoints.json and 
src/components/NodePanel.jsx only.

STRICT RULES:
1. Only modify waypoints.json and NodePanel.jsx.
2. Do not change any prop names NodePanel receives.
3. Import SAFETY from ../data/config.js for thresholds.
4. Do not install new packages.
5. Do not modify App.jsx under any circumstances.
6. Every field name in waypoints.json must match exactly:
   id, name, lat, lng, mineral, temperature, slopeAngle,
   safetyStatus, radiationLevel, scienceNote, 
   missionObjective, roverImageUrl, sol
7. End your response with "FILES MODIFIED: [list]"

TASK:
In src/data/waypoints.json create 5 waypoints at 
Jezero Crater Mars with scientifically accurate data 
based on real Perseverance rover findings:

Node 1 — Landing site (safe, flat, basalt)
Node 2 — River delta (safe, carbonates, biosignatures)
Node 3 — Crater rim (caution, steep slope, igneous rock)
Node 4 — Sulfate outcrop (safe, ancient clay layer)
Node 5 — Lake bed center (safe, lacustrine sediments)

Use real Perseverance raw image URLs from:
https://mars.nasa.gov/mars2020/multimedia/raw-images/

In src/components/NodePanel.jsx create a React component
that receives: waypoint (object), onClose (function)

Render:
- Header: node type tag + node name + close button
- Safety banner: color matches safetyStatus using 
  SAFETY thresholds from config.js
- Rover image with onError fallback div
- 2x2 data grid: temperature, slope, radiation, mineral
- Mission objective box in orange
- Science note in muted text

Dark theme: background #07080f, accent #e8541a
Font: Share Tech Mono for labels, Exo 2 for body
Export as default NodePanel.
```

---

## 👤 Person 3 — UI Shell
**Files: `src/components/Sidebar.jsx` + `src/components/LayerControls.jsx` — YOU OWN THESE. NOTHING ELSE.**

### What done looks like:
```
✅ Dark panel fixed to right side, 360px wide
✅ Mission header with title and sol counter
✅ HUD toggle button that toggles hudMode prop
✅ Layer controls: 4 buttons in 2x2 grid
✅ Active layer button glows orange
✅ Node panel slot: shows NodePanel when node selected
✅ Empty state message when nothing selected
✅ When HUD mode on: red vignette on screen edges
✅ Scanline animation runs across screen in HUD mode
✅ Looks like NASA mission control not a website
```

### What you do NOT touch:
```
❌ MarsGlobe.jsx
❌ NodePanel.jsx
❌ RadiationWidget.jsx
❌ App.jsx
❌ config.js
❌ waypoints.json
```

### Your Antigravity/Cursor prompt:
```
I am Person 3 on a 4-person team.
I own src/components/Sidebar.jsx and 
src/components/LayerControls.jsx only.

STRICT RULES:
1. Only modify Sidebar.jsx and LayerControls.jsx.
2. Do not change any prop names these components receive.
3. Do not import from MarsGlobe or RadiationWidget directly.
4. Do not install new packages.
5. Do not modify App.jsx under any circumstances.
6. Do not hardcode any colors — use CSS variables from index.css.
7. All props must match exactly what App.jsx passes:
   Sidebar: selectedNode, onCloseNode, activeLayer,
            onLayerChange, hudMode, onToggleHud, missionStats
   LayerControls: activeLayer, onLayerChange
8. End your response with "FILES MODIFIED: [list]"

TASK:
In src/components/Sidebar.jsx build a right panel:
- Position: fixed right 0, top 0, width 360px, height 100vh
- Background: rgba(7,8,15,0.92), border-left 1px #e8541a33
- Backdrop blur: 12px
- Z-index: 10

Layout top to bottom:
1. HEADER SECTION (padding 20px 16px):
   - Small tag: "NASA SPACE APPS 2026" in #e8541a
   - Large title: "MARS SURFACE EXPLORER" bold white
   - Subtitle: "JEZERO CRATER — ACTIVE MISSION" muted
   - Sol row: "MISSION SOL" label + "892" value in amber
   - HUD button: toggles between ◉ HUD ON / ◎ HUD OFF
     calls onToggleHud prop on click

2. THIN DIVIDER (1px #e8541a22)

3. LAYER CONTROLS SLOT:
   Import and render LayerControls component
   Pass activeLayer and onLayerChange props

4. THIN DIVIDER

5. RADIATION SLOT:
   Import and render RadiationWidget component
   (import from ./RadiationWidget)

6. THIN DIVIDER

7. NODE PANEL SLOT:
   If selectedNode exists: import and render NodePanel
   passing waypoint=selectedNode, onClose=onCloseNode
   If no selectedNode: show centered message:
   "📍 Click a waypoint node on the map"
   and show missionStats.total + safe/caution counts

In src/components/LayerControls.jsx build a 2x2 grid:
Buttons: Optical 👁, Elevation ⛰, Thermal 🌡, Geology 🪨
Active button: border #e8541a, background rgba(232,84,26,0.12)
Inactive: border #c1440e33, background rgba(13,16,23,0.6)
Each button shows icon + label + description text
On click: call onLayerChange(layerId)

Export Sidebar as default. Export LayerControls as default.
```

---

## 👤 Person 4 — Widgets + Integration + Deploy
**Files: `src/components/RadiationWidget.jsx` + `src/App.jsx` — YOU OWN THESE. NOTHING ELSE.**

### What done looks like:
```
✅ Radiation line chart: 7 sols, caution + danger lines
✅ Temperature bar with floating label
✅ 3 stat chips: pressure, wind, EVA window
✅ Top bar: coordinates, crew status, live UTC clock
✅ Cesium loads from CDN via script injection
✅ All 4 components imported and mounted in App.jsx
✅ Clicking globe pin → selectedNode updates → NodePanel opens
✅ Layer button click → activeLayer updates → globe tiles change
✅ HUD toggle → hudMode updates → vignette + scanline appear
✅ App deployed to Vercel with live URL shared with team
```

### What you do NOT touch:
```
❌ MarsGlobe.jsx
❌ NodePanel.jsx
❌ Sidebar.jsx
❌ LayerControls.jsx
❌ waypoints.json
❌ index.css
```

### Your Antigravity/Cursor prompt:
```
I am Person 4 on a 4-person team.
I own src/components/RadiationWidget.jsx 
and src/App.jsx only.

STRICT RULES:
1. Only modify RadiationWidget.jsx and App.jsx.
2. Do not change any component APIs — only wire them together.
3. Import NASA_KEY and all constants from ../data/config.js.
4. Do not modify any other component files.
5. Do not change folder structure or file names.
6. All state must live in App.jsx — no state in other components
   unless it is purely UI state inside that component.
7. If Cesium fails to load, show a clear error message 
   not a blank white screen.
8. End your response with "FILES MODIFIED: [list]"

TASK:
In src/components/RadiationWidget.jsx using recharts:

1. LineChart (height 90px):
   - 7 sols of radiation data (200-300 μGy/day range)
   - Based on real Curiosity RAD instrument readings
   - ReferenceLine at 250 (caution, yellow dashed)
   - ReferenceLine at 300 (danger, red dashed)
   - Line color matches current radiation status
   - Custom tooltip: dark theme matching the app

2. Temperature bar:
   - Current: -63°C, range: -120°C to 20°C
   - Gradient fill left to right: blue → green → amber
   - Floating bubble showing current value

3. Stats row (3 chips):
   - ATMO PRESSURE: ~700 Pa
   - WIND SPEED: ~7 m/s
   - EVA WINDOW: 4.2 HRS (green color)

Export as default RadiationWidget.

In src/App.jsx wire everything together:

STATE:
- selectedNode (null) → set by globe pin click
- activeLayer ('optical') → set by layer button click
- hudMode (false) → set by HUD toggle
- cesiumReady (false) → set when Cesium CDN loads

CESIUM LOADING (useEffect on mount):
- If window.Cesium exists → setCesiumReady(true)
- Else inject Cesium CSS link tag then Cesium script tag
- script.onload → window.Cesium.Ion.defaultAccessToken=''
  then setCesiumReady(true)
- Show LoadingScreen component while cesiumReady is false

LAYOUT:
- Outer div: 100vw 100vh, overflow hidden, background #000
- HUD vignette overlay div (only when hudMode true):
  fixed inset-0, pointer-events none, z-index 5,
  radial gradient transparent center to red edges
- MarsGlobe: absolute full screen background
  props: onNodeClick=setSelectedNode, 
         activeLayer=activeLayer,
         waypoints=imported from waypoints.json
- TopBar component (defined in this file):
  fixed top-0 left-0, right 360px, height 36px
  shows: LIVE indicator, coordinates, UTC clock,
  crew status, O2 reserve
  clock updates every second via setInterval
- Sidebar: absolute right 0
  props: selectedNode, onCloseNode=()=>setSelectedNode(null),
         activeLayer, onLayerChange=setActiveLayer,
         hudMode, onToggleHud=()=>setHudMode(h=>!h),
         missionStats (computed from waypoints)

LoadingScreen: centered div, Mars emoji, 
"LOADING MARS SURFACE DATA..." in #e8541a
"CONNECTING TO NASA TREK TILE SERVER" muted below
```

---

## 🚨 The Merge Rule (Person 4 enforces this)

```
Before merging anyone's work into main:

1. Does npm run dev still work? Yes → merge. No → fix first.
2. Does the globe still show? Yes → merge. No → fix first.
3. Does clicking a pin still work? Yes → merge. No → fix first.
4. Run this checklist every single merge. No exceptions.
```

---

## 📋 Done Checklist — All 4 Together

```
[ ] Mars globe visible in 3D          → Person 1
[ ] 5 pins on Jezero Crater           → Person 1
[ ] Orange route line between pins    → Person 1
[ ] Click pin opens data panel        → Person 2 + 4
[ ] Rover photo in panel              → Person 2
[ ] Safety color correct per node     → Person 2
[ ] Dark sidebar shell visible        → Person 3
[ ] 4 layer buttons work              → Person 3 + 1
[ ] HUD mode toggle works             → Person 3 + 4
[ ] Radiation chart visible           → Person 4
[ ] Temperature bar visible           → Person 4
[ ] Top status bar with live clock    → Person 4
[ ] Deployed to Vercel, URL shared    → Person 4
[ ] No console errors in browser      → Everyone
```

Copy this into your group chat. Check boxes off as you go. 🚀
