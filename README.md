# ARES-SPHERE // Mars Colonization & Tactical Simulator

A comprehensive 3D Mars Reconnaissance and Surface Operations tactical simulator built for tournament and hackathon presentation.

## Features
- **Global 3D Mars Reconnaissance**: High-fidelity procedural planetary texturing, bump maps, orbital satellites, and 8 target colonization sites with detailed suitability and ISRU data.
- **3D Controllable Surface Rover Simulation**: Drive a 6-wheel articulated rover (WASD / Arrow Keys) across procedural Martian terrain with realistic elevation and ice deposits.
- **Multiple Camera Views**: Chase cam, Driver first-person perspective, and free orbit inspection.
- **Automated Route Traversal & Ice Mining**: Live telemetry, battery depletion tracking, and autonomous ISRU harvesting.
- **Modular Habitat Suitability Planner**: Deployable life-support, Sabatier propellant plants, Kilopower nuclear reactors, and communications arrays.
- **Inter-Colony Supply Chain Map**: Mapped transport corridors between colonies.
- **Judge Pitch Deck**: Real-time master metrics for hackathon evaluation.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation & Run
```bash
npm install
npm run dev
```

Open your browser at `http://localhost:5173` to explore the simulator.

## Controls
- **Global View**: Drag to rotate Mars globe, click any zone to auto-land and start simulation.
- **Surface Simulation**:
  - `W` / `Up Arrow`: Accelerate forward
  - `S` / `Down Arrow`: Reverse
  - `A` / `Left Arrow`: Turn left
  - `D` / `Right Arrow`: Turn right
