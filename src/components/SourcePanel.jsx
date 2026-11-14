import React from 'react';
import { SOURCES } from '../data/mission.js';
export default function SourcePanel() {
  return <div><h2>Evidence, in context.</h2><p className="muted">Three observed data types support this demonstration. Each has a different scale and purpose.</p>
    {SOURCES.map(source => <article className="source-card" key={source.name}><div className="section-heading"><span className="eyebrow">{source.type}</span><span className="data-tag">{source.status}</span></div><h3>{source.name}</h3><p>{source.text}</p><p className="caption">{source.resolution}</p><a href={source.url} target="_blank" rel="noreferrer">Open source ↗</a></article>)}
    <div className="notice"><strong>How to read the terrain</strong><p>The local model displays measured relief relative to −3,945 m. Absolute elevations in the route profile retain the Mars 2000 datum. Outside coverage, the globe is smooth. Edge transitions are visualization artifacts.</p></div>
    <p className="caption">The preview reduces the 1 m terrain to ~20 m samples. Small rocks, trenches and local steep faces may be unresolved. No astronaut safety certification is implied.</p>
  </div>;
}
