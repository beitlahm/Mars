export const GLOBAL_COLONIZATION_SITES = [
  { id: 'gale', code: 'COL-01', name: 'GALE CRATER (AEOLIS PALUS)', lat: -4.67, lon: 137.42, suitabilityScore: 96, habitatCapacity: 12, waterIceRating: 'MODERATE (Hydrated Sulfates & Clay)', solarPotential: 'HIGH (Equatorial Insolation)', radiationShielding: 'GOOD (Mount Sharp Escarpment)', description: 'Primary command hub at the base of Mount Sharp with rich hydrated mineral deposits and stable landing plains.' },
  { id: 'jezero', code: 'COL-02', name: 'JEZERO CRATER DELTA', lat: 18.38, lon: 77.58, suitabilityScore: 94, habitatCapacity: 10, waterIceRating: 'HIGH (Ancient Lacustrine Delta)', solarPotential: 'HIGH (580 W/m² Peak)', radiationShielding: 'MODERATE (Crater Rim Cover)', description: 'Ancient river delta basin ideal for astrobiology research, carbonate extraction, and subsurface water mining.' },
  { id: 'arcadia', code: 'COL-03', name: 'ARCADIA PLANITIA ICE SHEETS', lat: 39.2, lon: -171.0, suitabilityScore: 95, habitatCapacity: 16, waterIceRating: 'EXCEPTIONAL (Shallow Glacial Ice)', solarPotential: 'MODERATE (Mid-Latitude)', radiationShielding: 'GOOD (Regolith Ice Berming)', description: 'Vast smooth volcanic plains with pure water ice less than 1 meter below the surface for ISRU propellant production.' },
  { id: 'valles', code: 'COL-04', name: 'VALLES MARINERIS (MELAS CHASMA)', lat: -9.8, lon: -76.2, suitabilityScore: 89, habitatCapacity: 8, waterIceRating: 'MODERATE (Canyon Wall Seeps)', solarPotential: 'MODERATE (Canyon Shadowing)', radiationShielding: 'EXCEPTIONAL (7km Canyon Depth)', description: 'Deepest canyon system in the solar system offering natural atmospheric pressure boost and cliffside radiation protection.' },
  { id: 'utopia', code: 'COL-05', name: 'UTOPIA PLANITIA BASIN', lat: 46.7, lon: 117.5, suitabilityScore: 91, habitatCapacity: 14, waterIceRating: 'EXCEPTIONAL (Subsurface Ice Slab)', solarPotential: 'MODERATE (Seasonal Dust)', radiationShielding: 'MODERATE (Flat Terrain)', description: 'Massive northern impact basin hosting a water ice deposit larger than Lake Superior.' },
  { id: 'hellas', code: 'COL-06', name: 'HELLAS PLANITIA LOWLANDS', lat: -42.4, lon: 70.5, suitabilityScore: 86, habitatCapacity: 8, waterIceRating: 'HIGH (Glacial Debris Aprons)', solarPotential: 'LOW-MODERATE (Southern Winter)', radiationShielding: 'HIGH (11.6 mbar Surface Pressure)', description: 'Lowest elevation on Mars providing the highest atmospheric pressure for aerobraking and radiation attenuation.' },
  { id: 'olympus', code: 'COL-07', name: 'OLYMPUS MONS LAVA TUBES', lat: 18.65, lon: -133.8, suitabilityScore: 88, habitatCapacity: 10, waterIceRating: 'LOW-MODERATE (Volcanic Vent Ice)', solarPotential: 'EXCEPTIONAL (Above Dust Layer)', radiationShielding: 'EXCEPTIONAL (Subterranean Lava Tubes)', description: 'Colossal shield volcano featuring intact subterranean basalt lava tubes suitable for radiation-proof underground cities.' },
  { id: 'elysium', code: 'COL-08', name: 'ELYSIUM PLANITIA GEOTHERMAL', lat: 3.0, lon: 154.7, suitabilityScore: 92, habitatCapacity: 12, waterIceRating: 'MODERATE (Cerberus Fossae Ice)', solarPotential: 'HIGH (Equatorial Belt)', radiationShielding: 'MODERATE (Flat Volcanic Plain)', description: 'Seismically active volcanic plain with potential subsurface geothermal heat gradients for basal ice melting.' }
];

export const COLONIZATION_ROUTES = [
  { id: 'RT-01', name: 'EQUATORIAL ISRU EXPRESS', from: 'Gale Crater (COL-01)', to: 'Elysium Planitia (COL-08)', cargo: 'Liquid Methane (CH₄) & LOX Propellant', distanceKm: 1120, status: 'ACTIVE CONVOY' },
  { id: 'RT-02', name: 'NORTHERN CRYO-PIPELINE', from: 'Arcadia Planitia (COL-03)', to: 'Olympus Mons Lava Tubes (COL-07)', cargo: 'Purified Water Ice & Hydrogen Feedstock', distanceKm: 1840, status: 'ACTIVE CONVOY' },
  { id: 'RT-03', name: 'SYRTIS-JEZERO SCIENCE CORRIDOR', from: 'Jezero Crater Delta (COL-02)', to: 'Utopia Planitia Basin (COL-05)', cargo: 'Hydroponic Nutrients & Core Samples', distanceKm: 2310, status: 'SCHEDULED' },
  { id: 'RT-04', name: 'CHASM HEAVY FREIGHT HIGHWAY', from: 'Valles Marineris (COL-04)', to: 'Hellas Planitia Lowlands (COL-06)', cargo: 'Basalt Regolith Bricks & Habitat Modules', distanceKm: 3450, status: 'ACTIVE CONVOY' }
];

export const WATER_ICE_SURFACE_ROUTES = [
  {
    id: 'ICE-RT-01',
    name: 'GLACIAL ICE TRENCH ALPHA -> SABATIER REFINERY',
    distanceM: 640,
    iceConcentration: '94.2% Pure Subsurface Water Ice',
    waypoints: [
      { id: 'WP-START', label: 'ICE LANDING PAD', x: -44, z: 42, type: 'BASE' },
      { id: 'WP-DRILL-1', label: 'SHALLOW ICE CORE #1 (0.8m)', x: -16, z: 18, type: 'ICE' },
      { id: 'WP-DRILL-2', label: 'PERMAFROST SCAR #2 (1.1m)', x: 18, z: -12, type: 'ICE' },
      { id: 'WP-ISRU', label: 'ISRU WATER MELTER & CH4 PLANT', x: 46, z: -38, type: 'REFINERY' }
    ]
  },
  {
    id: 'ICE-RT-02',
    name: 'NORTHERN CRYO-AQUIFER CORRIDOR',
    distanceM: 820,
    iceConcentration: '89.7% Hydrated Clay & Ice Slab',
    waypoints: [
      { id: 'WP-START', label: 'ICE LANDING PAD', x: -44, z: 42, type: 'BASE' },
      { id: 'WP-AQUA-1', label: 'BRINE SEEP BASIN', x: -30, z: -22, type: 'ICE' },
      { id: 'WP-AQUA-2', label: 'SUB-GLACIAL CAVERN', x: 12, z: -44, type: 'ICE' },
      { id: 'WP-ISRU', label: 'ISRU WATER MELTER & CH4 PLANT', x: 46, z: -38, type: 'REFINERY' }
    ]
  }
];

export function computeSurfaceElevation(x, z, siteId) {
  let y = Math.sin(x * 0.045) * Math.cos(z * 0.045) * 3.5 + Math.sin(x * 0.1 + z * 0.08) * 1.2;
  if (siteId === 'arcadia' || siteId === 'utopia') {
    const poly = Math.abs(Math.sin(x * 0.2) * Math.cos(z * 0.2)) * 1.2;
    y = y * 0.4 + poly;
  } else if (siteId === 'valles') {
    const canyon = Math.abs(x + z * 0.3);
    if (canyon < 32) y -= Math.cos((canyon / 32) * (Math.PI * 0.5)) * 14.0;
  } else if (siteId === 'olympus') {
    y += Math.max(0, 18 - Math.hypot(x, z) * 0.18);
  }
  const distPad = Math.hypot(x + 44, z - 42);
  if (distPad < 12) {
    const blend = Math.max(0, Math.min(1, (distPad - 5) / 7));
    y = -1.5 * (1 - blend) + y * blend;
  }
  return y;
}
