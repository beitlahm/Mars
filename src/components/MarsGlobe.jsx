/**
 * MarsGlobe Component
 * Owned by: Person 1 (The 3D Globe)
 */

import React, { useEffect, useRef } from 'react';
import { TILES, JEZERO } from '../data/config.js';

export default function MarsGlobe({ waypoints = [], onNodeClick, activeLayer = 'optical' }) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const clickHandlerRef = useRef(null);

  // Initialize Cesium Globe
  useEffect(() => {
    if (!containerRef.current || !window.Cesium) return;

    try {
      // Configure Cesium Ion token
      if (window.Cesium.Ion) {
        window.Cesium.Ion.defaultAccessToken = '';
      }

      // Base tile layer provider
      const tileUrl = TILES[activeLayer] || TILES.optical;
      const imageryProvider = new window.Cesium.UrlTemplateImageryProvider({
        url: tileUrl,
        credit: 'NASA Trek / JPL / USGS'
      });

      // Construct Cesium Viewer stripped of default widgets
      const viewer = new window.Cesium.Viewer(containerRef.current, {
        imageryProvider: imageryProvider,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        infoBox: false,
        selectionIndicator: false,
        skyAtmosphere: false,
        scene3DOnly: true
      });

      // Styling & Environment
      viewer.scene.backgroundColor = window.Cesium.Color.BLACK;
      if (viewer.scene.globe) {
        viewer.scene.globe.baseColor = window.Cesium.Color.BLACK;
        viewer.scene.globe.enableLighting = false;
        viewer.scene.globe.depthTestAgainstTerrain = false;
      }

      // Center camera on Jezero Crater
      viewer.camera.setView({
        destination: window.Cesium.Cartesian3.fromDegrees(
          JEZERO.lng,
          JEZERO.lat,
          JEZERO.height
        ),
        orientation: {
          heading: window.Cesium.Math.toRadians(JEZERO.heading || 0),
          pitch: window.Cesium.Math.toRadians(JEZERO.pitch || -65),
          roll: window.Cesium.Math.toRadians(JEZERO.roll || 0)
        }
      });

      viewerRef.current = viewer;

      // Click event handler for Waypoint pins
      const handler = new window.Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction((click) => {
        const pickedObject = viewer.scene.pick(click.position);
        if (
          window.Cesium.defined(pickedObject) &&
          pickedObject.id &&
          pickedObject.id.waypointData &&
          typeof onNodeClick === 'function'
        ) {
          onNodeClick(pickedObject.id.waypointData);
        }
      }, window.Cesium.ScreenSpaceEventType.LEFT_CLICK);

      clickHandlerRef.current = handler;
    } catch (err) {
      console.error('Cesium globe initialization error:', err);
    }

    return () => {
      if (clickHandlerRef.current) {
        clickHandlerRef.current.destroy();
        clickHandlerRef.current = null;
      }
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  // Update Waypoint pins and connecting polyline
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !window.Cesium || viewer.isDestroyed()) return;

    // Clear existing entities
    viewer.entities.removeAll();

    if (!waypoints || waypoints.length === 0) return;

    const pinBuilder = new window.Cesium.PinBuilder();

    // 1. Plot Waypoint Pins
    waypoints.forEach((wp) => {
      let pinColor = window.Cesium.Color.fromCssColorString('#10b981'); // Safe
      if (wp.safetyStatus === 'caution') {
        pinColor = window.Cesium.Color.fromCssColorString('#f59e0b');
      } else if (wp.safetyStatus === 'danger') {
        pinColor = window.Cesium.Color.fromCssColorString('#ef4444');
      }

      const pinImage = pinBuilder.fromText(String(wp.id), pinColor, 40).toDataURL();

      viewer.entities.add({
        id: `waypoint-${wp.id}`,
        name: wp.name,
        position: window.Cesium.Cartesian3.fromDegrees(wp.lng, wp.lat, 20),
        billboard: {
          image: pinImage,
          verticalOrigin: window.Cesium.VerticalOrigin.BOTTOM,
          heightReference: window.Cesium.HeightReference.CLAMP_TO_GROUND,
          scale: 0.9
        },
        waypointData: wp
      });
    });

    // 2. Dashed Orange Polyline connecting all 5 pins in order
    const positions = waypoints.map((wp) =>
      window.Cesium.Cartesian3.fromDegrees(wp.lng, wp.lat, 10)
    );

    viewer.entities.add({
      polyline: {
        positions: positions,
        width: 3,
        material: new window.Cesium.PolylineDashMaterialProperty({
          color: window.Cesium.Color.fromCssColorString('#e8541a'),
          dashLength: 14.0
        }),
        clampToGround: true
      }
    });
  }, [waypoints, onNodeClick]);

  // Swap active layer tiles
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !window.Cesium || viewer.isDestroyed()) return;

    const newTileUrl = TILES[activeLayer] || TILES.optical;

    try {
      viewer.imageryLayers.removeAll();
      const newProvider = new window.Cesium.UrlTemplateImageryProvider({
        url: newTileUrl,
        credit: 'NASA Trek / JPL / USGS'
      });
      viewer.imageryLayers.addImageryProvider(newProvider);
    } catch (err) {
      console.warn('Failed to switch tile layer:', err);
    }
  }, [activeLayer]);

  return (
    <div
      ref={containerRef}
      className="globe-container"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#000000'
      }}
    />
  );
}

