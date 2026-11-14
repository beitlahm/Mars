export function sampleElevation(data, lng, lat) {
  const b = data.bounds;
  if (lng < b.west || lng > b.east || lat < b.south || lat > b.north) return null;
  const x = (lng - b.west) / (b.east - b.west) * (data.width - 1);
  const y = (b.north - lat) / (b.north - b.south) * (data.height - 1);
  const x0 = Math.min(data.width - 2, Math.floor(x));
  const y0 = Math.min(data.height - 2, Math.floor(y));
  const values = [data.elevations[y0][x0], data.elevations[y0][x0 + 1], data.elevations[y0 + 1][x0], data.elevations[y0 + 1][x0 + 1]];
  if (values.some(v => v === null)) return null;
  const dx = x - x0, dy = y - y0;
  return values[0] * (1 - dx) * (1 - dy) + values[1] * dx * (1 - dy) + values[2] * (1 - dx) * dy + values[3] * dx * dy;
}
export function terrainProvider(C, data, ellipsoid) {
  const tilingScheme = new C.GeographicTilingScheme({ ellipsoid });
  return new C.CustomHeightmapTerrainProvider({
    width: 65, height: 65, tilingScheme,
    credit: 'HiRISE DTM · NASA/JPL-Caltech/UArizona',
    callback(x, y, level) {
      const rectangle = tilingScheme.tileXYToRectangle(x, y, level);
      const buffer = new Float32Array(65 * 65);
      for (let row = 0; row < 65; row++) {
        const lat = C.Math.toDegrees(rectangle.north + (rectangle.south - rectangle.north) * row / 64);
        for (let col = 0; col < 65; col++) {
          const lng = C.Math.toDegrees(rectangle.west + (rectangle.east - rectangle.west) * col / 64);
          const height = sampleElevation(data, lng, lat);
          // Relative relief avoids pretending areoid heights are sphere heights.
          buffer[row * 65 + col] = height === null ? 0 : height - data.displayReferenceMeters;
        }
      }
      return buffer;
    }
  });
}
