/**
 * Mars Surface Explorer - Main Application
 * Owned by: Person 4 (Integration & Widgets)
 */

import React, { useState, useEffect, useMemo } from 'react';
import MarsGlobe from './components/MarsGlobe.jsx';
import Sidebar from './components/Sidebar.jsx';
import waypointsData from './data/waypoints.json';
import { JEZERO } from './data/config.js';
import './App.css';

// Loading Screen Component
function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div style={{ fontSize: '48px' }} className="loading-pulse">🪐</div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '16px',
          fontWeight: 700,
          letterSpacing: '2px',
          color: 'var(--accent-orange)'
        }}
      >
        LOADING MARS SURFACE DATA...
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '1px',
          color: 'var(--text-muted)'
        }}
      >
        CONNECTING TO NASA TREK TILE SERVER
      </div>
    </div>
  );
}

// Top Status Bar Component
function TopBar() {
  const [utcTime, setUtcTime] = useState(new Date().toUTCString().replace('GMT', 'UTC'));

  useEffect(() => {
    const timer = setInterval(() => {
      setUtcTime(new Date().toUTCString().replace('GMT', 'UTC'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: '360px',
        height: '36px',
        backgroundColor: 'rgba(7, 8, 15, 0.88)',
        borderBottom: '1px solid rgba(232, 84, 26, 0.2)',
        backdropFilter: 'blur(8px)',
        zIndex: 9,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        color: 'var(--text-muted)'
      }}
    >
      {/* Live Indicator & Target */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              boxShadow: '0 0 8px #ef4444'
            }}
          />
          <span style={{ color: '#ef4444', fontWeight: 'bold', letterSpacing: '1px' }}>LIVE DSN FEED</span>
        </div>
        <span style={{ color: 'rgba(232, 84, 26, 0.4)' }}>|</span>
        <span>TARGET: JEZERO CRATER ({JEZERO.lat}° N, {JEZERO.lng}° E)</span>
      </div>

      {/* UTC Clock & Crew Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span>CREW STATUS: <strong style={{ color: 'var(--safe-green)' }}>NOMINAL (EVA-3)</strong></span>
        <span style={{ color: 'rgba(232, 84, 26, 0.4)' }}>|</span>
        <span>O₂ RESERVE: <strong style={{ color: '#38bdf8' }}>94.2%</strong></span>
        <span style={{ color: 'rgba(232, 84, 26, 0.4)' }}>|</span>
        <span style={{ color: '#ffffff' }}>{utcTime}</span>
      </div>
    </header>
  );
}

export default function App() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeLayer, setActiveLayer] = useState('optical');
  const [hudMode, setHudMode] = useState(false);
  const [cesiumReady, setCesiumReady] = useState(false);

  // Compute Mission Stats from waypoints
  const missionStats = useMemo(() => {
    const total = waypointsData.length;
    const safe = waypointsData.filter((w) => w.safetyStatus === 'safe').length;
    const caution = waypointsData.filter((w) => w.safetyStatus === 'caution').length;
    const danger = waypointsData.filter((w) => w.safetyStatus === 'danger').length;
    return { total, safe, caution, danger };
  }, []);

  // Cesium CDN Dynamic Loader
  useEffect(() => {
    if (window.Cesium) {
      if (window.Cesium.Ion) {
        window.Cesium.Ion.defaultAccessToken = '';
      }
      setCesiumReady(true);
      return;
    }

    // Inject CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cesium.com/downloads/cesiumjs/releases/1.119/Build/Cesium/Widgets/widgets.css';
    document.head.appendChild(link);

    // Inject Script
    const script = document.createElement('script');
    script.src = 'https://cesium.com/downloads/cesiumjs/releases/1.119/Build/Cesium/Cesium.js';
    script.async = true;
    script.onload = () => {
      if (window.Cesium && window.Cesium.Ion) {
        window.Cesium.Ion.defaultAccessToken = '';
      }
      setCesiumReady(true);
    };
    script.onerror = () => {
      console.error('Failed to load CesiumJS from CDN.');
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div className="app-container">
      {/* Loading Screen Overlay */}
      {!cesiumReady && <LoadingScreen />}

      {/* HUD Vignette & Scanlines */}
      {hudMode && (
        <>
          <div className="hud-vignette" />
          <div className="hud-scanlines" />
          <div className="hud-scanline-beam" />
        </>
      )}

      {/* Top Status Bar */}
      <TopBar />

      {/* Cesium Mars Globe */}
      {cesiumReady && (
        <MarsGlobe
          waypoints={waypointsData}
          onNodeClick={setSelectedNode}
          activeLayer={activeLayer}
        />
      )}

      {/* Mission Sidebar */}
      <Sidebar
        selectedNode={selectedNode}
        onCloseNode={() => setSelectedNode(null)}
        activeLayer={activeLayer}
        onLayerChange={setActiveLayer}
        hudMode={hudMode}
        onToggleHud={() => setHudMode((h) => !h)}
        missionStats={missionStats}
      />
    </div>
  );
}

