import test from 'node:test';
import assert from 'node:assert/strict';
import { distanceMeters, routeSummary, exportRoute, parseRoute, MARS_RADIUS } from '../src/lib/mission.js';
import { sampleElevation } from '../src/lib/terrain.js';
import { INITIAL_ROUTE } from '../src/data/mission.js';

test('Mars distances use the Mars radius and include the return leg', () => {
  const a = { lng: 0, lat: 0, minutes: 0 }, b = { lng: 1, lat: 0, minutes: 0 };
  assert.ok(Math.abs(distanceMeters(a,b) - MARS_RADIUS * Math.PI / 180) < 0.001);
  assert.equal(routeSummary([a,b],2,0).meters, 2 * distanceMeters(a,b));
  assert.equal(routeSummary([a],2,0).meters, 0);
});
test('route roundtrip preserves mission data and rejects malformed imports', () => {
  assert.deepEqual(parseRoute(JSON.stringify(exportRoute(INITIAL_ROUTE))), INITIAL_ROUTE);
  assert.throws(() => parseRoute('{}'));
  const bad = exportRoute(INITIAL_ROUTE);
  bad.features[0].geometry.coordinates[0] = 500;
  assert.throws(() => parseRoute(JSON.stringify(bad)), /coordinates/);
  const duplicate = exportRoute(INITIAL_ROUTE);
  duplicate.features[1].properties.id = duplicate.features[0].properties.id;
  assert.throws(() => parseRoute(JSON.stringify(duplicate)), /unique/);
});
test('terrain interpolates known elevations while preserving unknown coverage', () => {
  const terrain = { bounds: {west:0,east:1,south:0,north:1}, width:2,height:2,elevations:[[0,10],[20,30]] };
  assert.equal(sampleElevation(terrain,.5,.5),15);
  assert.equal(sampleElevation(terrain,1,0),30);
  assert.equal(sampleElevation(terrain,2,0),null);
  terrain.elevations[0][0] = null;
  assert.equal(sampleElevation(terrain,.5,.5),null);
});
