/**
 * Sidebar Component
 * Owned by: Person 3 (UI Shell)
 */

import React from 'react';
import LayerControls from './LayerControls.jsx';
import RadiationWidget from './RadiationWidget.jsx';
import NodePanel from './NodePanel.jsx';

export default function Sidebar({
  selectedNode,
  onCloseNode,
  activeLayer,
  onLayerChange,
  hudMode,
  onToggleHud,
  missionStats = { total: 5, safe: 4, caution: 1 }
}) {
  return (
    <aside
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        width: '360px',
        height: '100vh',
        backgroundColor: 'rgba(7, 8, 15, 0.92)',
        borderLeft: '1px solid rgba(232, 84, 26, 0.2)',
        backdropFilter: 'blur(12px)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        color: '#f3f4f6'
      }}
    >
      {/* 1. Header Section */}
      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '1.5px',
            color: 'var(--accent-orange)',
            fontWeight: 700
          }}
        >
          NASA SPACE APPS 2026
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '20px',
            fontWeight: 800,
            letterSpacing: '0.5px',
            color: '#ffffff',
            lineHeight: 1.15
          }}
        >
          MARS SURFACE EXPLORER
        </h1>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            letterSpacing: '0.8px'
          }}
        >
          JEZERO CRATER — ACTIVE MISSION
        </div>

        {/* Sol Row & HUD Toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '8px',
            paddingTop: '8px',
            borderTop: '1px dashed rgba(232, 84, 26, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-dim)' }}>
              MISSION SOL
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 800, color: 'var(--caution-amber)' }}>
              892
            </span>
          </div>

          <button
            onClick={onToggleHud}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.5px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backgroundColor: hudMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(13, 16, 23, 0.7)',
              border: hudMode ? '1px solid #ef4444' : '1px solid rgba(232, 84, 26, 0.3)',
              color: hudMode ? '#ef4444' : 'var(--text-muted)'
            }}
          >
            {hudMode ? '◉ HUD ON' : '◎ HUD OFF'}
          </button>
        </div>
      </div>

      {/* 2. Divider */}
      <div style={{ height: '1px', backgroundColor: 'rgba(232, 84, 26, 0.13)', width: '100%' }} />

      {/* 3. Layer Controls Slot */}
      <LayerControls activeLayer={activeLayer} onLayerChange={onLayerChange} />

      {/* 4. Divider */}
      <div style={{ height: '1px', backgroundColor: 'rgba(232, 84, 26, 0.13)', width: '100%' }} />

      {/* 5. Radiation Slot */}
      <RadiationWidget />

      {/* 6. Divider */}
      <div style={{ height: '1px', backgroundColor: 'rgba(232, 84, 26, 0.13)', width: '100%' }} />

      {/* 7. Node Panel Slot */}
      <div style={{ padding: '16px', flex: 1 }}>
        {selectedNode ? (
          <NodePanel waypoint={selectedNode} onClose={onCloseNode} />
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px 16px',
              textAlign: 'center',
              border: '1px dashed rgba(232, 84, 26, 0.25)',
              borderRadius: '8px',
              backgroundColor: 'rgba(13, 16, 23, 0.4)'
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📍</div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--accent-orange)',
                marginBottom: '12px'
              }}
            >
              Click a waypoint node on the map
            </div>

            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-around',
                paddingTop: '12px',
                borderTop: '1px solid rgba(232, 84, 26, 0.1)',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px'
              }}
            >
              <div>
                <span style={{ color: 'var(--text-dim)' }}>TOTAL: </span>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>{missionStats.total || 5}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>SAFE: </span>
                <span style={{ color: 'var(--safe-green)', fontWeight: 'bold' }}>{missionStats.safe || 4}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>CAUTION: </span>
                <span style={{ color: 'var(--caution-amber)', fontWeight: 'bold' }}>{missionStats.caution || 1}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

