import React, { useState, useEffect, useRef } from 'react';
import { computeSurfaceElevation } from '../data/sites.js';

export default function ControllableMarsSurfaceViewport({
  activeSite,
  activeRoute,
  autoSimRunning,
  controlInputRef,
  onTelemetryUpdate,
  onHarvestIce
}) {
  const mountRef = useRef(null);
  const [threeReady, setThreeReady] = useState(Boolean(window.THREE));
  const [cameraView, setCameraView] = useState('CHASE');

  const simRef = useRef({
    activeSite,
    activeRoute,
    autoSimRunning,
    cameraView,
    roverX: -44,
    roverZ: 42,
    roverHeading: 0.78,
    autoProgress: 0,
    iceExtractedKg: 207.5,
    batteryPct: 98.4,
    harvestedIds: {}
  });

  useEffect(() => {
    simRef.current.activeSite = activeSite;
    simRef.current.activeRoute = activeRoute;
    simRef.current.autoSimRunning = autoSimRunning;
    simRef.current.cameraView = cameraView;
  }, [activeSite, activeRoute, autoSimRunning, cameraView]);

  useEffect(() => {
    if (window.THREE) {
      setThreeReady(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    script.onload = () => setThreeReady(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!threeReady || !mountRef.current) return;
    const THREE = window.THREE;
    const container = mountRef.current;
    const width = container.clientWidth || 1100;
    const height = container.clientHeight || 650;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0e17);
    scene.fog = new THREE.FogExp2(0x1f1924, 0.0035);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.2, 900);

    scene.add(new THREE.HemisphereLight(0xcbe8ff, 0x422014, 0.85));
    const sunLight = new THREE.DirectionalLight(0xfff4e4, 1.85);
    sunLight.position.set(90, 110, 60);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Full-canvas Mars terrain (180x180 units)
    const size = 180;
    const segs = 160;
    const terrainGeo = new THREE.PlaneGeometry(size, size, segs, segs);
    terrainGeo.rotateX(-Math.PI / 2);

    const pos = terrainGeo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = computeSurfaceElevation(x, z, simRef.current.activeSite.id);
      pos.setY(i, y);

      const iceVein = Math.sin(x * 0.12) * Math.cos(z * 0.12);
      if (iceVein > 0.25) {
        colors[i * 3] = 0.45;
        colors[i * 3 + 1] = 0.82;
        colors[i * 3 + 2] = 0.95;
      } else {
        colors[i * 3] = 0.62 + iceVein * 0.08;
        colors[i * 3 + 1] = 0.34 + iceVein * 0.05;
        colors[i * 3 + 2] = 0.22 + iceVein * 0.04;
      }
    }
    terrainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    terrainGeo.computeVertexNormals();

    const terrainMesh = new THREE.Mesh(
      terrainGeo,
      new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.74, metalness: 0.08 })
    );
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);

    const grid = new THREE.GridHelper(180, 30, 0x38bdf8, 0x1e293b);
    grid.position.y = -3.2;
    grid.material.transparent = true;
    grid.material.opacity = 0.14;
    scene.add(grid);

    const baseGroup = new THREE.Group();
    baseGroup.position.set(-44, computeSurfaceElevation(-44, 42, simRef.current.activeSite.id), 42);
    const habDome = new THREE.Mesh(
      new THREE.CylinderGeometry(3.0, 3.6, 3.4, 16),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.35, roughness: 0.4 })
    );
    habDome.position.y = 1.7;
    habDome.castShadow = true;
    baseGroup.add(habDome);
    scene.add(baseGroup);

    const refineryGroup = new THREE.Group();
    refineryGroup.position.set(46, computeSurfaceElevation(46, -38, simRef.current.activeSite.id), -38);
    const tank1 = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.6, 4.8, 16),
      new THREE.MeshStandardMaterial({ color: 0x0ea5e9, metalness: 0.6, roughness: 0.25 })
    );
    tank1.position.set(-1.8, 2.4, 0);
    refineryGroup.add(tank1);
    const tank2 = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.6, 4.8, 16),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6, roughness: 0.25 })
    );
    tank2.position.set(2.0, 2.4, 0);
    refineryGroup.add(tank2);
    scene.add(refineryGroup);

    const routeGroup = new THREE.Group();
    scene.add(routeGroup);

    const rebuildRouteVisuals = (routeObj) => {
      while (routeGroup.children.length > 0) {
        routeGroup.remove(routeGroup.children[0]);
      }
      const pts = [];
      for (let i = 0; i < routeObj.waypoints.length - 1; i++) {
        const a = routeObj.waypoints[i];
        const b = routeObj.waypoints[i + 1];
        for (let s = 0; s <= 30; s++) {
          const t = s / 30;
          const wx = a.x + (b.x - a.x) * t;
          const wz = a.z + (b.z - a.z) * t;
          const wy = computeSurfaceElevation(wx, wz, simRef.current.activeSite.id) + 0.4;
          pts.push(new THREE.Vector3(wx, wy, wz));
        }
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      routeGroup.add(
        new THREE.Mesh(
          new THREE.TubeGeometry(curve, 100, 0.28, 8, false),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.92 })
        )
      );

      routeObj.waypoints.forEach((wp) => {
        const wy = computeSurfaceElevation(wp.x, wp.z, simRef.current.activeSite.id);
        const ringGeo = new THREE.RingGeometry(2.0, 2.8, 24);
        ringGeo.rotateX(-Math.PI / 2);
        const ring = new THREE.Mesh(
          ringGeo,
          new THREE.MeshBasicMaterial({
            color: wp.type === 'ICE' ? 0x22d3ee : wp.type === 'REFINERY' ? 0x10b981 : 0xf59e0b,
            side: THREE.DoubleSide
          })
        );
        ring.position.set(wp.x, wy + 0.3, wp.z);
        routeGroup.add(ring);

        const crystal = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.95, 0),
          new THREE.MeshStandardMaterial({
            color: wp.type === 'ICE' ? 0x22d3ee : 0x10b981,
            emissive: 0x0284c7,
            emissiveIntensity: 0.85
          })
        );
        crystal.position.set(wp.x, wy + 3.8, wp.z);
        routeGroup.add(crystal);
      });
    };
    rebuildRouteVisuals(simRef.current.activeRoute);
    let lastRouteId = simRef.current.activeRoute.id;

    // 6-wheel rover with free wheels
    const roverGroup = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.75, 3.0),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.55, roughness: 0.3 })
    );
    body.position.y = 0.9;
    body.castShadow = true;
    roverGroup.add(body);

    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.6, 1.2),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.3 })
    );
    cabin.position.set(0, 1.45, 0.5);
    roverGroup.add(cabin);

    const drillMast = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 1.8, 10),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.5 })
    );
    drillMast.position.set(0, 1.5, -0.95);
    roverGroup.add(drillMast);

    const wheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.35, 18);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 });

    const wheelMeshes = [];
    [
      [-1.15, 0.45, -1.0],
      [1.15, 0.45, -1.0],
      [-1.15, 0.45, 0],
      [1.15, 0.45, 0],
      [-1.15, 0.45, 1.0],
      [1.15, 0.45, 1.0]
    ].forEach(([wx, wy, wz]) => {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.position.set(wx, wy, wz);
      w.castShadow = true;
      roverGroup.add(w);
      wheelMeshes.push(w);
    });

    const headLight = new THREE.PointLight(0x38bdf8, 1.8, 20);
    headLight.position.set(0, 2.0, 1.8);
    roverGroup.add(headLight);
    scene.add(roverGroup);

    const keys = { forward: false, backward: false, left: false, right: false };
    const setKey = (e, val) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') keys.forward = val;
      if (k === 's' || k === 'arrowdown') keys.backward = val;
      if (k === 'a' || k === 'arrowleft') keys.left = val;
      if (k === 'd' || k === 'arrowright') keys.right = val;
    };
    const onKeyDown = (e) => setKey(e, true);
    const onKeyUp = (e) => setKey(e, false);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    let orbitTheta = 0.65;
    let orbitPhi = 0.88;
    const orbitRadius = 52;
    let dragging = false;
    let px = 0;
    let py = 0;

    const onDown = (e) => {
      dragging = true;
      px = e.clientX;
      py = e.clientY;
    };
    const onMove = (e) => {
      if (!dragging) return;
      orbitTheta -= (e.clientX - px) * 0.006;
      orbitPhi = Math.max(0.25, Math.min(1.4, orbitPhi - (e.clientY - py) * 0.006));
      px = e.clientX;
      py = e.clientY;
    };
    const onUp = () => {
      dragging = false;
    };
    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth || 1100;
      const h = mountRef.current.clientHeight || 650;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let animId;
    let frameCount = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      frameCount++;
      const s = simRef.current;

      if (s.activeRoute.id !== lastRouteId) {
        lastRouteId = s.activeRoute.id;
        rebuildRouteVisuals(s.activeRoute);
      }

      const extCtrl = controlInputRef?.current || {};
      const fwd = keys.forward || extCtrl.forward;
      const bwd = keys.backward || extCtrl.backward;
      const lft = keys.left || extCtrl.left;
      const rgt = keys.right || extCtrl.right;

      let currentSpeed = 0;
      if (fwd || bwd || lft || rgt) {
        if (lft) s.roverHeading += 0.045;
        if (rgt) s.roverHeading -= 0.045;
        currentSpeed = fwd ? 0.38 : bwd ? -0.25 : 0;
        if (currentSpeed !== 0) {
          s.roverX = Math.max(-80, Math.min(80, s.roverX + Math.sin(s.roverHeading) * currentSpeed));
          s.roverZ = Math.max(-80, Math.min(80, s.roverZ + Math.cos(s.roverHeading) * currentSpeed));
          s.batteryPct = Math.max(10, s.batteryPct - 0.004);
        }
      } else if (s.autoSimRunning) {
        s.autoProgress = (s.autoProgress + 0.0016) % 1;
        const wps = s.activeRoute.waypoints;
        const totalSeg = wps.length - 1;
        const scaled = s.autoProgress * totalSeg;
        const idx = Math.min(Math.floor(scaled), totalSeg - 1);
        const localT = scaled - idx;
        const p1 = wps[idx];
        const p2 = wps[idx + 1];
        s.roverX = p1.x + (p2.x - p1.x) * localT;
        s.roverZ = p1.z + (p2.z - p1.z) * localT;
        s.roverHeading = Math.atan2(p2.x - p1.x, p2.z - p1.z);
        currentSpeed = 0.32;
      }

      const ry = computeSurfaceElevation(s.roverX, s.roverZ, s.activeSite.id);
      roverGroup.position.set(s.roverX, ry, s.roverZ);
      roverGroup.rotation.y = s.roverHeading;

      wheelMeshes.forEach((w, idx) => {
        if (currentSpeed !== 0 || s.autoSimRunning) {
          w.rotation.x += currentSpeed * 0.8;
        }
        w.position.y = 0.45 + Math.sin(frameCount * 0.15 + idx * 1.2) * 0.08;
      });

      s.activeRoute.waypoints.forEach((wp) => {
        if (wp.type === 'ICE') {
          const dist = Math.hypot(s.roverX - wp.x, s.roverZ - wp.z);
          if (dist < 4.8 && !s.harvestedIds[wp.id]) {
            s.harvestedIds[wp.id] = true;
            s.iceExtractedKg = Number((s.iceExtractedKg + 85.0).toFixed(1));
            if (onHarvestIce) onHarvestIce(wp.label, s.iceExtractedKg);
          }
        }
      });

      if (s.cameraView === 'FIRST_PERSON') {
        camera.position.set(
          s.roverX + Math.sin(s.roverHeading) * 1.2,
          ry + 2.3,
          s.roverZ + Math.cos(s.roverHeading) * 1.2
        );
        camera.lookAt(
          s.roverX + Math.sin(s.roverHeading) * 20,
          ry + 1.5,
          s.roverZ + Math.cos(s.roverHeading) * 20
        );
      } else if (s.cameraView === 'ORBIT') {
        camera.position.set(
          s.roverX + orbitRadius * Math.sin(orbitPhi) * Math.sin(orbitTheta),
          ry + orbitRadius * Math.cos(orbitPhi),
          s.roverZ + orbitRadius * Math.sin(orbitPhi) * Math.cos(orbitTheta)
        );
        camera.lookAt(s.roverX, ry + 1.4, s.roverZ);
      } else {
        const targetCamX = s.roverX - Math.sin(s.roverHeading) * 16;
        const targetCamY = ry + 9.0;
        const targetCamZ = s.roverZ - Math.cos(s.roverHeading) * 16;
        camera.position.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), 0.12);
        camera.lookAt(s.roverX + Math.sin(s.roverHeading) * 6, ry + 1.6, s.roverZ + Math.cos(s.roverHeading) * 6);
      }

      if (frameCount % 8 === 0 && onTelemetryUpdate) {
        onTelemetryUpdate({
          x: s.roverX.toFixed(1),
          z: s.roverZ.toFixed(1),
          heading: Math.round(((s.roverHeading * 180) / Math.PI + 360) % 360),
          iceKg: s.iceExtractedKg,
          battery: s.batteryPct.toFixed(1)
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      dom.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [threeReady]);

  return (
    <div className="relative w-full h-full min-h-[620px] rounded-2xl overflow-hidden border border-slate-800 bg-[#060913] shadow-2xl">
      <div ref={mountRef} className="w-full h-full" />

      <div className="absolute top-4 right-4 flex gap-2 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 font-mono text-xs shadow-xl">
        {[
          { id: 'CHASE', label: 'ROVER CHASE' },
          { id: 'FIRST_PERSON', label: 'DRIVER CAM' },
          { id: 'ORBIT', label: 'FREE ORBIT' }
        ].map((cam) => (
          <button
            key={cam.id}
            onClick={() => setCameraView(cam.id)}
            className={`px-3 py-2 rounded-xl cursor-pointer transition-all font-bold ${
              cameraView === cam.id
                ? 'bg-sky-500 text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {cam.label}
          </button>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl px-4 py-2.5 text-xs font-mono text-slate-300 pointer-events-none shadow-xl">
        <div>
          DRIVE ROVER: <span className="text-sky-400 font-bold">W A S D</span> or{' '}
          <span className="text-sky-400 font-bold">ARROW KEYS</span> • 6-WHEEL FREE SUSPENSION ACTIVE
        </div>
      </div>
    </div>
  );
}
