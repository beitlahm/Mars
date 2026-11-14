import { cp, mkdir } from 'node:fs/promises';
await mkdir('public/vendor', { recursive: true });
await cp('node_modules/cesium/Build/Cesium', 'public/vendor/cesium', { recursive: true });
