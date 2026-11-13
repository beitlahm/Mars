/**
 * RadiationWidget Component
 * Owned by: Person 4 (Widgets & Integration)
 */

import React from 'react';
import {
  LineChart,
  Line,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const RAD_DATA = [
  { sol: 'Sol 886', rad: 224 },
  { sol: 'Sol 887', rad: 238 },
  { sol: 'Sol 888', rad: 245 },
  { sol: 'Sol 889', rad: 262 }, // Spike into caution
  { sol: 'Sol 890', rad: 251 },
  { sol: 'Sol 891', rad: 236 },
  { sol: 'Sol 892', rad: 229 }
];

const currentRad = RAD_DATA[RAD_DATA.length - 1].rad;
const radLineColor = currentRad >= 300 ? '#ef4444' : currentRad >= 250 ? '#f59e0b' : '#10b981';

// Temperature bar calculations: range -120°C to +20°C (span 140°C)
const tempCurrent = -63;
const tempMin = -120;
const tempMax = 20;
const tempPercent = Math.min(100, Math.max(0, ((tempCurrent - tempMin) / (tempMax - tempMin)) * 100));

const CustomRadTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: '#07080f',
          border: '1px solid rgba(232, 84, 26, 0.4)',
          borderRadius: '4px',
          padding: '4px 8px',
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: '10px',
          color: '#f3f4f6'
        }}
      >
        <div>{data.sol}</div>
        <div style={{ color: radLineColor, fontWeight: 'bold' }}>{data.rad} μGy/day</div>
      </div>
    );
  }
  return null;
};

export default function RadiationWidget() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '16px'
      }}
    >
      {/* 1. Radiation Telemetry Line Chart */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--accent-orange)',
            marginBottom: '6px'
          }}
        >
          <span>RAD INSTRUMENT TELEMETRY (7 SOLS)</span>
          <span style={{ color: radLineColor, fontWeight: 'bold' }}>{currentRad} μGy/day</span>
        </div>

        <div style={{ width: '100%', height: '90px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={RAD_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <ReferenceLine y={250} stroke="#f59e0b" strokeDasharray="3 3" />
              <ReferenceLine y={300} stroke="#ef4444" strokeDasharray="3 3" />
              <Tooltip content={<CustomRadTooltip />} />
              <Line
                type="monotone"
                dataKey="rad"
                stroke={radLineColor}
                strokeWidth={2}
                dot={{ r: 2.5, fill: radLineColor }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'var(--text-dim)',
            marginTop: '2px'
          }}
        >
          <span>SOL 886</span>
          <span style={{ color: '#f59e0b' }}>⚠️ 250 CAUTION</span>
          <span style={{ color: '#ef4444' }}>🛑 300 DANGER</span>
          <span>SOL 892</span>
        </div>
      </div>

      {/* 2. Temperature Bar */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--text-muted)',
            marginBottom: '4px'
          }}
        >
          <span>SURFACE THERMAL GRADIENT</span>
          <span style={{ color: '#38bdf8' }}>{tempCurrent}°C</span>
        </div>

        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '10px',
            borderRadius: '5px',
            background: 'linear-gradient(to right, #0284c7, #10b981, #f59e0b, #ef4444)',
            marginBottom: '16px'
          }}
        >
          {/* Floating Bubble Indicator */}
          <div
            style={{
              position: 'absolute',
              left: `${tempPercent}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: '2px solid #07080f',
              boxShadow: '0 0 8px rgba(0,0,0,0.8)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: `${tempPercent}%`,
              top: '14px',
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap'
            }}
          >
            {tempCurrent}°C
          </div>
        </div>
      </div>

      {/* 3. Stats Row (3 chips) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '6px'
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(13, 16, 23, 0.65)',
            border: '1px solid rgba(232, 84, 26, 0.15)',
            borderRadius: '4px',
            padding: '6px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--text-dim)' }}>
            ATMO PRESSURE
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            ~710 Pa
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(13, 16, 23, 0.65)',
            border: '1px solid rgba(232, 84, 26, 0.15)',
            borderRadius: '4px',
            padding: '6px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--text-dim)' }}>
            WIND SPEED
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            ~7.2 m/s
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(13, 16, 23, 0.65)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '4px',
            padding: '6px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--text-dim)' }}>
            EVA WINDOW
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 'bold', color: '#10b981' }}>
            4.2 HRS
          </div>
        </div>
      </div>
    </div>
  );
}

