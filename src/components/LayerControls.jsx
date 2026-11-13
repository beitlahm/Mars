/**
 * LayerControls Component
 * Owned by: Person 3 (UI Shell)
 */

import React from 'react';

const LAYERS = [
  { id: 'optical', label: 'Optical', icon: '👁', desc: 'Viking Color Mosaic' },
  { id: 'elevation', label: 'Elevation', icon: '⛰', desc: 'MOLA Shaded Relief' },
  { id: 'thermal', label: 'Thermal', icon: '🌡', desc: 'THEMIS Daytime IR' },
  { id: 'geology', label: 'Geology', icon: '🪨', desc: 'MOLA DEM Terrain' }
];

export default function LayerControls({ activeLayer = 'optical', onLayerChange }) {
  return (
    <div style={{ padding: '16px' }}>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '1px',
          color: 'var(--accent-orange)',
          textTransform: 'uppercase',
          marginBottom: '10px'
        }}
      >
        ORBITAL SENSOR OVERLAY
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px'
        }}
      >
        {LAYERS.map((layer) => {
          const isActive = activeLayer === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => onLayerChange && onLayerChange(layer.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '10px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                backgroundColor: isActive
                  ? 'rgba(232, 84, 26, 0.16)'
                  : 'rgba(13, 16, 23, 0.6)',
                border: isActive
                  ? '1px solid var(--accent-orange)'
                  : '1px solid rgba(193, 68, 14, 0.25)',
                boxShadow: isActive
                  ? '0 0 12px rgba(232, 84, 26, 0.25)'
                  : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span style={{ fontSize: '14px' }}>{layer.icon}</span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: isActive ? '#ffffff' : 'var(--text-primary)'
                  }}
                >
                  {layer.label}
                </span>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  color: isActive ? 'var(--accent-orange)' : 'var(--text-dim)',
                  letterSpacing: '0.3px'
                }}
              >
                {layer.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

