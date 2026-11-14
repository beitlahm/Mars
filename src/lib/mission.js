import { sampleElevation } from './terrain.js';
export const MARS_RADIUS = 3389500;
export function distanceMeters(a, b) {
  const rad = Math.PI / 180;
  const h = Math.sin((b.lat - a.lat) * rad / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin((b.lng - a.lng) * rad / 2) ** 2;
  return 2 * MARS_RADIUS * Math.asin(Math.sqrt(Math.min(1, Math.max(0, h))));
}
export function routeSummary(points, speed = 2, reserve = 25, terrain = null) {
  const closed = points.length > 1 ? [...points, points[0]] : points;
  const meters = closed.slice(1).reduce((sum, point, i) => sum + distanceMeters(closed[i], point), 0);
  const scienceMinutes = points.reduce((sum, p) => sum + p.minutes, 0);
  const hours = (meters / 1000 / speed + scienceMinutes / 60) * (1 + reserve / 100);
  const profile = [];
  let traveled = 0;
  for (let i = 1; i < closed.length; i++) {
    const a = closed[i - 1], b = closed[i];
    const segment = distanceMeters(a, b);
    const steps = Math.max(1, Math.ceil(segment / 25));
    for (let j = 0; j < steps; j++) {
      const t = j / steps;
      const lng = a.lng + (b.lng - a.lng) * t;
      const lat = a.lat + (b.lat - a.lat) * t;
      profile.push({ distance: traveled + t * segment, elevation: terrain ? sampleElevation(terrain, lng, lat) : null });
    }
    traveled += segment;
  }
  if (closed.length > 1) profile.push({ distance: traveled, elevation: terrain ? sampleElevation(terrain, closed.at(-1).lng, closed.at(-1).lat) : null });
  return { meters, hours, scienceMinutes, profile, unknown: profile.filter(p => p.elevation === null).length };
}
export function exportRoute(points, assumptions) {
  return { type: 'FeatureCollection', properties: { body: 'Mars', coordinateConvention: 'planetocentric latitude, east longitude; degrees', status: 'proposed, unvalidated', assumptions },
    features: points.map(p => ({ type: 'Feature', properties: { id: p.id, name: p.name, kind: p.kind, minutes: p.minutes, objective: p.objective }, geometry: { type: 'Point', coordinates: [p.lng, p.lat] } })) };
}
export function parseRoute(text) {
  const file = JSON.parse(text);
  if (file.properties?.body !== 'Mars' || file.type !== 'FeatureCollection' || !Array.isArray(file.features)) throw new Error('Select a Martian Map export with body set to Mars.');
  if (file.features.length < 1 || file.features.length > 30) throw new Error('A route needs 1–30 stops.');
  const ids = new Set();
  return file.features.map((feature, index) => {
    const p = feature.properties || {};
    const coordinates = feature.geometry?.coordinates;
    if (feature.geometry?.type !== 'Point' || !Array.isArray(coordinates)) throw new Error('Every stop must be a point.');
    const [lng, lat] = coordinates;
    if (!Number.isFinite(lng) || !Number.isFinite(lat) || Math.abs(lng) > 180 || Math.abs(lat) > 90) throw new Error('Invalid Mars coordinates.');
    const id = String(p.id || 'stop-' + index);
    if (ids.has(id)) throw new Error('Stop IDs must be unique.');
    ids.add(id);
    const minutes = p.minutes ?? 15;
    if (!Number.isFinite(minutes) || minutes < 0 || minutes > 240) throw new Error('Stop duration must be 0–240 minutes.');
    return { id, lng, lat, name: String(p.name || 'Science stop').slice(0,80), objective: String(p.objective || 'Define the science objective.').slice(0,500), kind: index === 0 ? 'habitat' : 'science', minutes };
  });
}
