/**
 * Mars Surface Explorer - Global Mission Configuration
 * Owned by: Team Core / Shared
 */

export const NASA_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';

// Jezero Crater primary landing & research coordinates
export const JEZERO = {
  lat: 18.38,
  lng: 77.58,
  height: 85000, // Camera height in meters for Jezero overview
  heading: 0.0,
  pitch: -65.0,
  roll: 0.0
};

// NASA Trek & USGS WMS/WMTS Mars Tile Layers
export const TILES = {
  optical: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg',
  elevation: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg',
  thermal: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MO_THEMIS-IR-Day_mosaic_global_100m_v2/1.0.0/default/default028mm/{z}/{y}/{x}.jpg',
  geology: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_DEM_mosaic_global_463m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg'
};

// Safety Status Thresholds & Themes
export const SAFETY = {
  safe: {
    status: 'safe',
    label: 'NOMINAL / SAFE',
    color: '#10b981', // Emerald green
    bgColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10b981'
  },
  caution: {
    status: 'caution',
    label: 'ELEVATED RISK / CAUTION',
    color: '#f59e0b', // Amber
    bgColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: '#f59e0b'
  },
  danger: {
    status: 'danger',
    label: 'HAZARDOUS / DANGER',
    color: '#ef4444', // Red
    bgColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#ef4444'
  }
};

// Mission Telemetry Defaults
export const MISSION_CONSTANTS = {
  missionSol: 892,
  atmoPressure: '710 Pa',
  windSpeed: '7.2 m/s',
  evaWindow: '4.2 HRS',
  tempCurrent: -63,
  tempMin: -120,
  tempMax: 20,
  radiationBaseline: 235,
  radiationCaution: 250,
  radiationDanger: 300
};

