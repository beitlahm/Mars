"""Build a georeferenced demo patch from matching HiRISE PDS products.

Usage: python scripts/prepare_terrain.py ../work/terrain.img ../work/ortho.jp2
Requires numpy and Pillow with JPEG2000 support. Output is a preview reduction.
"""
import json
import re
import sys
from pathlib import Path
import numpy as np
from PIL import Image

source, optical = map(Path, sys.argv[1:3])
label = source.open('rb').read(20312).decode('ascii')
def number(key):
    return float(re.search(r'^\s*' + re.escape(key) + r'\s*=\s*([-\d.]+)', label, re.M).group(1))
width, height = int(number('LINE_SAMPLES')), int(number('LINES'))
offset = int(number('RECORD_BYTES') * (number('^IMAGE') - 1))
dem = np.memmap(source, dtype='<f4', mode='r', offset=offset, shape=(height, width))
# Preserve the full footprint and explicit nodata in a compact 257 x 429 grid.
xs = np.linspace(0, width - 1, 257).astype(int)
ys = np.linspace(0, height - 1, 429).astype(int)
grid = np.asarray(dem[np.ix_(ys, xs)])
valid = np.isfinite(grid) & (grid > -10000) & (grid < 10000)
values = [[round(float(v), 2) if ok else None for v, ok in zip(row, mask)] for row, mask in zip(grid, valid)]
out = Path('public/mars-assets')
out.mkdir(parents=True, exist_ok=True)
bounds = dict(west=number('WESTERNMOST_LONGITUDE') - 360, east=number('EASTERNMOST_LONGITUDE') - 360, south=number('MINIMUM_LATITUDE'), north=number('MAXIMUM_LATITUDE'))
metadata = dict(width=len(xs), height=len(ys), bounds=bounds, elevations=values,
    source='DTEEC_035651_2210_036917_2210_A01', sourceResolutionMeters=number('MAP_SCALE'),
    previewSpacingMeters=round(number('MAP_SCALE') * (width - 1) / (len(xs) - 1), 2),
    datum='Mars 2000 equipotential surface', latitudeType='planetocentric',
    minimum=float(grid[valid].min()), maximum=float(grid[valid].max()),
    displayReferenceMeters=-3945, nodata=None)
(out / 'arcadia-terrain.json').write_text(json.dumps(metadata, separators=(',', ':')))
image = Image.open(optical)
assert image.size == (width, height), 'Orthophoto and terrain grids must match'
image.thumbnail((1536, 2560))
image.convert('RGB').save(out / 'arcadia-optical.jpg', quality=90)
normalized = np.clip((grid - grid[valid].min()) / (grid[valid].max() - grid[valid].min()), 0, 1)
normalized[~valid] = 0
colors = np.zeros((*grid.shape, 4), dtype=np.uint8)
colors[:, :, 0] = 45 + normalized * 200
colors[:, :, 1] = 75 + normalized * 110
colors[:, :, 2] = 95 + normalized * 45
colors[:, :, 3] = valid * 255
Image.fromarray(colors).save(out / 'arcadia-elevation.png')
print(json.dumps({k:v for k,v in metadata.items() if k != 'elevations'}, indent=2))
print('Valid terrain fraction', float(valid.mean()))
