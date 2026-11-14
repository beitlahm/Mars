import React, { useEffect, useRef, useState } from 'react';
import { SITE } from '../data/mission.js';
import { MARS_RADIUS } from '../lib/mission.js';
import { terrainProvider, sampleElevation } from '../lib/terrain.js';
export default function MarsGlobe({ route, selected, onSelect, onAdd, addMode, layer, opacity, exaggeration, focus, terrain, showRoute }) {
  const container = useRef(null);
  const viewerRef = useRef(null);
  const overlayRef = useRef(null);
  const actions = useRef({});
  actions.current = { onSelect, onAdd, addMode };
  const [status, setStatus] = useState('Starting terrain engine…');
  useEffect(() => {
    if (!terrain) return;
    const C = window.Cesium;
    if (!C) { setStatus('Cesium failed to load. Run npm install and npm run dev.'); return; }
    const mars = new C.Ellipsoid(MARS_RADIUS, MARS_RADIUS, MARS_RADIUS);
    let viewer, handler;
    let canceled = false;
    try {
      viewer = new C.Viewer(container.current, {
        ellipsoid: mars,
        globe: new C.Globe(mars), mapProjection: new C.GeographicProjection(mars),
        terrainProvider: terrainProvider(C, terrain, mars),
        baseLayer: false, baseLayerPicker: false, geocoder: false, homeButton: false,
        sceneModePicker: false, navigationHelpButton: false, animation: false,
        timeline: false, fullscreenButton: false, infoBox: false,
        selectionIndicator: false, skyAtmosphere: false, skyBox: false,
        scene3DOnly: true, requestRenderMode: true
      });
      viewer.scene.globe.baseColor = C.Color.fromCssColorString('#6f5141');
      viewer.scene.globe.enableLighting = false;
      viewer.scene.globe.depthTestAgainstTerrain = true;
      viewer.scene.backgroundColor = C.Color.fromCssColorString('#080d10');
      viewer.scene.screenSpaceCameraController.minimumZoomDistance = 2;
      viewerRef.current = viewer;
      C.SingleTileImageryProvider.fromUrl(import.meta.env.BASE_URL + 'mars-assets/mars-global.jpg', { credit: 'Viking / NASA / USGS' }).then(provider => {
        if (!canceled) { viewer.imageryLayers.addImageryProvider(provider, 0); viewer.scene.requestRender(); }
      }).catch(() => { if (!canceled) setStatus('Global imagery unavailable; local data remains available.'); });
      viewer.camera.setView({
        destination: C.Cartesian3.fromDegrees(SITE.lng, SITE.lat - .025, SITE.height, mars),
        orientation: { heading: 0, pitch: C.Math.toRadians(-62), roll: 0 }
      });
      handler = new C.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(event => {
        const picked = viewer.scene.pick(event.position);
        if (picked?.id?.properties?.stopId) {
          actions.current.onSelect(picked.id.properties.stopId.getValue());
          return;
        }
        if (!actions.current.addMode) return;
        const ray = viewer.camera.getPickRay(event.position);
        const position = viewer.scene.globe.pick(ray, viewer.scene);
        if (!position) return;
        const point = mars.cartesianToCartographic(position);
        actions.current.onAdd(C.Math.toDegrees(point.longitude), C.Math.toDegrees(point.latitude));
      }, C.ScreenSpaceEventType.LEFT_CLICK);
      setStatus('Local data ready · NASA/JPL-Caltech/UArizona');
    } catch (error) { setStatus('3D unavailable · ' + error.message); }
    return () => { canceled = true; handler?.destroy(); if (viewer && !viewer.isDestroyed()) viewer.destroy(); viewerRef.current = null; overlayRef.current = null; };
  }, [terrain]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !terrain) return;
    const C = window.Cesium;
    let canceled = false;
    if (overlayRef.current) { viewer.imageryLayers.remove(overlayRef.current); overlayRef.current = null; }
    const b = layer === 'thermal' ? { west: -166.9921875, east: -166.2890625, south: 40.4296875, north: 40.78125 } : terrain.bounds;
    const file = layer === 'thermal' ? 'arcadia-thermal.jpg' : layer === 'elevation' ? 'arcadia-elevation.png' : 'arcadia-optical.jpg';
    C.SingleTileImageryProvider.fromUrl(import.meta.env.BASE_URL + 'mars-assets/' + file, {
      rectangle: C.Rectangle.fromDegrees(b.west, b.south, b.east, b.north),
      credit: layer === 'thermal' ? 'THEMIS / NASA / JPL / ASU / USGS' : 'HiRISE / NASA / JPL-Caltech / UArizona'
    }).then(provider => {
      if (canceled) return;
      overlayRef.current = viewer.imageryLayers.addImageryProvider(provider);
      overlayRef.current.alpha = opacity;
      viewer.scene.requestRender();
    }).catch(() => { if (!canceled) setStatus('Local overlay failed to load. Check the asset files.'); });
    return () => { canceled = true; };
  }, [layer, terrain]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    if (overlayRef.current) overlayRef.current.alpha = opacity;
    viewer.scene.verticalExaggeration = exaggeration;
    viewer.scene.requestRender();
  }, [opacity, exaggeration]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !terrain) return;
    const C = window.Cesium, mars = viewer.scene.globe.ellipsoid;
    viewer.entities.removeAll();
    const position = point => C.Cartesian3.fromDegrees(point.lng, point.lat, 0, mars);
    route.forEach((point, index) => {
      viewer.entities.add({
        id: 'stop-' + point.id, position: position(point), properties: { stopId: point.id },
        point: { pixelSize: point.id === selected ? 15 : 10, color: C.Color.fromCssColorString(index === 0 ? '#c5e6d3' : '#ffbd8a'), outlineColor: C.Color.fromCssColorString('#182126'), outlineWidth: 3, heightReference: C.HeightReference.CLAMP_TO_GROUND, disableDepthTestDistance: Number.POSITIVE_INFINITY },
        label: { text: index === 0 ? 'HABITAT' : String(index).padStart(2,'0'), font: '12px sans-serif', pixelOffset: new C.Cartesian2(0,-25), fillColor: C.Color.WHITE, showBackground: true, backgroundColor: C.Color.fromCssColorString('#172027'), heightReference: C.HeightReference.CLAMP_TO_GROUND, disableDepthTestDistance: Number.POSITIVE_INFINITY }
      });
    });
    if (showRoute && route.length > 1) viewer.entities.add({
      polyline: { positions: [...route, route[0]].map(position), width: 3, clampToGround: true, material: new C.PolylineDashMaterialProperty({ color: C.Color.fromCssColorString('#f7bb89') }) }
    });
    const b = terrain.bounds;
    viewer.entities.add({ rectangle: { coordinates: C.Rectangle.fromDegrees(b.west,b.south,b.east,b.north), fill: false, outline: true, outlineColor: C.Color.fromCssColorString('#8da99a') } });
    viewer.scene.requestRender();
  }, [route, selected, terrain, showRoute]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !focus) return;
    const C = window.Cesium;
    const elevation = sampleElevation(terrain, focus.lng, focus.lat);
    viewer.camera.flyTo({
      destination: C.Cartesian3.fromDegrees(focus.lng, focus.lat, (focus.height || 1500) + (elevation === null ? 0 : (elevation - terrain.displayReferenceMeters) * exaggeration), viewer.scene.globe.ellipsoid),
      orientation: { heading: C.Math.toRadians(focus.heading || 0), pitch: C.Math.toRadians(focus.pitch ?? -70), roll: 0 }, duration: 1.3
    });
  }, [focus, terrain]);

  return <><div ref={container} className={'globe-container ' + (addMode ? 'adding' : '')} /><div className="map-status" role="status">{status}</div></>;
}
