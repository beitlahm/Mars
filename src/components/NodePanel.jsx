/**
 * NodePanel Component
 * Owned by: Person 2 (Data & Node Panel)
 */

import React, { useState } from 'react';
import { SAFETY } from '../data/config.js';

export default function NodePanel({ waypoint, onClose }) {
  const [imageError, setImageError] = useState(false);

  if (!waypoint) return null;

  const safetyInfo = SAFETY[waypoint.safetyStatus] || SAFETY.safe;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        backgroundColor: '#07080f',
        color: '#f3f4f6',
        borderRadius: '8px',
        border: '1px solid rgba(232, 84, 26, 0.35)',
        padding: '16px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)'
      }}
    >
      {/* Header: Node Type Tag + Name + Close Button */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div>
          <div
            style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '11px',
              letterSpacing: '1.2px',
              color: '#e8541a',
              textTransform: 'uppercase',
              marginBottom: '2px'
            }}
          >
            SCIENCE NODE 0{waypoint.id} // SOL {waypoint.sol}
          </div>
          <h2
            style={{
              fontFamily: 'Exo 2, sans-serif',
              fontSize: '17px',
              fontWeight: 700,
              lineHeight: 1.25,
              color: '#ffffff'
            }}
          >
            {waypoint.name}
          </h2>
        </div>

        <button
          onClick={onClose}
          aria-label="Close node panel"
          style={{
            background: 'transparent',
            border: '1px solid rgba(232, 84, 26, 0.4)',
            color: '#e8541a',
            borderRadius: '4px',
            width: '28px',
            height: '28px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            transition: 'all 0.2s ease',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e8541a';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#e8541a';
          }}
        >
          ✕
        </button>
      </div>

      {/* Safety Status Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderRadius: '4px',
          backgroundColor: safetyInfo.bgColor,
          border: `1px solid ${safetyInfo.borderColor}`,
          color: safetyInfo.color,
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: '12px',
          letterSpacing: '0.8px'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '10px' }}>●</span>
          {safetyInfo.label}
        </span>
        <span style={{ color: '#9ca3af', fontSize: '11px' }}>
          LAT {waypoint.lat}° | LNG {waypoint.lng}°
        </span>
      </div>

      {/* Rover Image with Fallback */}
      <div
        style={{
          width: '100%',
          height: '140px',
          borderRadius: '6px',
          overflow: 'hidden',
          backgroundColor: 'rgba(13, 16, 23, 0.8)',
          border: '1px solid rgba(232, 84, 26, 0.2)',
          position: 'relative'
        }}
      >
        {!imageError && waypoint.roverImageUrl ? (
          <img
            src={waypoint.roverImageUrl}
            alt={waypoint.name}
            onError={() => setImageError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'contrast(1.05) saturate(1.1)'
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              color: '#9ca3af',
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '11px'
            }}
          >
            <span style={{ fontSize: '24px' }}>📡</span>
            <span>PERSEVERANCE MASTCAM-Z TELEMETRY</span>
            <span style={{ color: '#6b7280', fontSize: '9px' }}>[RAW SENSOR STREAM CACHED]</span>
          </div>
        )}
      </div>

      {/* 2x2 Telemetry Data Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px'
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(13, 16, 23, 0.75)',
            border: '1px solid rgba(232, 84, 26, 0.15)',
            borderRadius: '4px',
            padding: '8px'
          }}
        >
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '10px', color: '#9ca3af' }}>
            SURFACE TEMP
          </div>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '15px', fontWeight: 700, color: '#f3f4f6' }}>
            {waypoint.temperature}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(13, 16, 23, 0.75)',
            border: '1px solid rgba(232, 84, 26, 0.15)',
            borderRadius: '4px',
            padding: '8px'
          }}
        >
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '10px', color: '#9ca3af' }}>
            SLOPE ANGLE
          </div>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '15px', fontWeight: 700, color: '#f3f4f6' }}>
            {waypoint.slopeAngle}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(13, 16, 23, 0.75)',
            border: '1px solid rgba(232, 84, 26, 0.15)',
            borderRadius: '4px',
            padding: '8px'
          }}
        >
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '10px', color: '#9ca3af' }}>
            RAD FLUX
          </div>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '15px', fontWeight: 700, color: '#f3f4f6' }}>
            {waypoint.radiationLevel}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(13, 16, 23, 0.75)',
            border: '1px solid rgba(232, 84, 26, 0.15)',
            borderRadius: '4px',
            padding: '8px'
          }}
        >
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '10px', color: '#9ca3af' }}>
            DOMINANT MINERAL
          </div>
          <div
            style={{
              fontFamily: 'Exo 2, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              color: '#f3f4f6',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
            title={waypoint.mineral}
          >
            {waypoint.mineral}
          </div>
        </div>
      </div>

      {/* Mission Objective Box */}
      <div
        style={{
          borderLeft: '3px solid #e8541a',
          backgroundColor: 'rgba(232, 84, 26, 0.08)',
          padding: '8px 10px',
          borderRadius: '0 4px 4px 0'
        }}
      >
        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '10px', color: '#e8541a', marginBottom: '2px' }}>
          PRIMARY MISSION OBJECTIVE
        </div>
        <p style={{ fontFamily: 'Exo 2, sans-serif', fontSize: '12px', color: '#e5e7eb', lineHeight: 1.35 }}>
          {waypoint.missionObjective}
        </p>
      </div>

      {/* Science Note */}
      <div style={{ padding: '2px 4px' }}>
        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '10px', color: '#6b7280', marginBottom: '2px' }}>
          GEOLOGICAL CONTEXT & NOTE
        </div>
        <p style={{ fontFamily: 'Exo 2, sans-serif', fontSize: '11px', color: '#9ca3af', lineHeight: 1.4 }}>
          {waypoint.scienceNote}
        </p>
      </div>
    </div>
  );
}

