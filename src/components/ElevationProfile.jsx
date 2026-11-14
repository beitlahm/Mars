import React from 'react';
export default function ElevationProfile({ profile }) {
  const valid = profile.filter(p => p.elevation !== null);
  if (!valid.length) return <p className="caption">Elevation unavailable along this route.</p>;
  const min = Math.min(...valid.map(p => p.elevation));
  const max = Math.max(...valid.map(p => p.elevation));
  const length = profile.at(-1).distance || 1;
  let penDown = false;
  const path = profile.map(p => {
    if (p.elevation === null) { penDown = false; return ''; }
    const command = penDown ? 'L' : 'M';
    penDown = true;
    return command + (p.distance / length * 300).toFixed(2) + ',' + (65 - (p.elevation - min) / Math.max(1, max - min) * 50).toFixed(2);
  }).join(' ');
  return <div className="profile"><svg viewBox="0 0 300 80" role="img" aria-label={'Route elevation ranges from ' + min.toFixed(0) + ' to ' + max.toFixed(0) + ' meters above Mars datum'}><path d="M0 70 H300" stroke="#3c474d" /><path d={path} fill="none" stroke="#b6d5c5" strokeWidth="2" /></svg><div><span>{min.toFixed(0)} → {max.toFixed(0)} m</span><span>Mars 2000 datum</span></div></div>;
}
