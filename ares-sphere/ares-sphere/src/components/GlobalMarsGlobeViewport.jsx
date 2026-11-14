import React, { useState, useEffect, useRef } from 'react';
import { GLOBAL_COLONIZATION_SITES } from '../data/sites.js';
import { createProceduralMarsTextures } from '../utils/marsTextures.js';

export default function GlobalMarsGlobeViewport({ selectedSiteId, onSelectSite, onDiveToSurface }) {
  const mountRef = useRef(null);
  const [threeReady, setThreeReady] = useState(Boolean(window.THREE));
  const [loadError, setLoadError] = useState(null);

  const stateRef = useRef({ selectedSiteId, onSelectSite, onDiveToSurface });

  useEffect(() => {
    stateRef.current = { selectedSiteId, onSelectSite, onDiveToSurface };
  }, [selectedSiteId, onSelectSite, onDiveToSurface]);

  useEffect(() => {
    if (window.THREE) {
      setThreeReady(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    script.onload = () => setThreeReady(true);
    script.onerror = () => setLoadError('Unable to load Three.js WebGL engine.');
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!threeReady || !mountRef.current) return;
    const THREE = window.THREE;
    const container = mountRef.current;
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010204);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 2000);
    camera.position.set(0, 12, 132);

    scene.add(new THREE.AmbientLight(0x2a140d, 0.38));
    const sunLight = new THREE.DirectionalLight(0xffebd6, 2.5);
    sunLight.position.set(-130, 55, 110);
    scene.add(sunLight);

    const starsGeo = new THREE.BufferGeometry();
    const starCount = 1600;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 1200;
      starPos[i + 1] = (Math.random() - 0.5) * 1200;
      starPos[i + 2] = (Math.random() - 0.5) * 1200;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0xffe8d6, size: 1.05, transparent: true, opacity: 0.75 });
    scene.add(new THREE.Points(starsGeo, starsMat));

    const marsRadius = 46;
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const marsGeo = new THREE.SphereGeometry(marsRadius, 96, 96);
    const { colorMap, bumpMap } = createProceduralMarsTextures();
    const marsMat = new THREE.MeshStandardMaterial({
      map: colorMap,
      bumpMap: bumpMap,
      bumpScale: 1.6,
      roughness: 0.84,
      metalness: 0.02
    });
    const marsMesh = new THREE.Mesh(marsGeo, marsMat);
    globeGroup.add(marsMesh);

    const atmoGeo = new THREE.SphereGeometry(marsRadius * 1.05, 64, 64);
    const atmoMat = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        sunDirection: { value: new THREE.Vector3(-130, 55, 110).normalize() }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        uniform vec3 sunDirection;
        void main() {
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float rim = pow(0.65 - dot(vNormal, viewDir), 3.0);
          float sunSide = smoothstep(-0.35, 0.85, dot(normalize(vWorldPosition), sunDirection));
          vec3 glowColor = vec3(0.92, 0.40, 0.18);
          gl_FragColor = vec4(glowColor, rim * (0.32 + sunSide * 0.68));
        }
      `
    });
    scene.add(new THREE.Mesh(atmoGeo, atmoMat));

    const satGroup = new THREE.Group();
    satGroup.add(
      new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.6, 0.6),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 })
      )
    );
    const panelGeo = new THREE.BoxGeometry(5.0, 0.08, 1.2);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.7 });
    const p1 = new THREE.Mesh(panelGeo, panelMat);
    p1.position.set(3.4, 0, 0);
    satGroup.add(p1);
    const p2 = new THREE.Mesh(panelGeo, panelMat);
    p2.position.set(-3.4, 0, 0);
    satGroup.add(p2);
    scene.add(satGroup);

    const siteMeshes = [];
    GLOBAL_COLONIZATION_SITES.forEach((site) => {
      const phi = (90 - site.lat) * (Math.PI / 180);
      const theta = (site.lon + 180) * (Math.PI / 180);
      const sx = -(marsRadius + 0.8) * Math.sin(phi) * Math.cos(theta);
      const sy = (marsRadius + 0.8) * Math.cos(phi);
      const sz = (marsRadius + 0.8) * Math.sin(phi) * Math.sin(theta);

      const markerGroup = new THREE.Group();
      markerGroup.position.set(sx, sy, sz);

      const ringGeo = new THREE.RingGeometry(1.5, 2.3, 24);
      ringGeo.rotateX(Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: site.id === 'gale' ? 0x38bdf8 : 0xf59e0b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.92
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      markerGroup.add(ring);

      const pin = new THREE.Mesh(
        new THREE.SphereGeometry(0.85, 16, 16),
        new THREE.MeshBasicMaterial({ color: site.id === 'gale' ? 0x38bdf8 : 0xf59e0b })
      );
      pin.position.y = 1.5;
      pin.userData = { siteId: site.id };
      markerGroup.add(pin);

      globeGroup.add(markerGroup);
      siteMeshes.push({ id: site.id, group: markerGroup, ring });
    });

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let dragDistance = 0;
    let globeRotationY = -0.35;
    let globeRotationX = 0.12;

    const onPointerDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      dragDistance = 0;
    };
    const onPointerMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      dragDistance += Math.hypot(dx, dy);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      globeRotationY += dx * 0.006;
      globeRotationX = Math.max(-1.1, Math.min(1.1, globeRotationX + dy * 0.006));
    };
    const onPointerUp = () => {
      isDragging = false;
    };

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const onClick = (e) => {
      if (dragDistance > 6) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);

      const hitTargets = siteMeshes.map((s) => s.group.children[1]);
      const hits = raycaster.intersectObjects(hitTargets);
      if (hits.length > 0 && stateRef.current.onDiveToSurface) {
        stateRef.current.onDiveToSurface(hits[0].object.userData.siteId);
        return;
      }

      const planetHits = raycaster.intersectObject(marsMesh);
      if (planetHits.length > 0 && stateRef.current.onDiveToSurface) {
        const localPt = globeGroup.worldToLocal(planetHits[0].point.clone());
        const clickedLat = 90 - (Math.acos(Math.max(-1, Math.min(1, localPt.y / marsRadius))) * 180) / Math.PI;
        const waterIceSites = GLOBAL_COLONIZATION_SITES.filter(
          (s) => s.waterIceRating.includes('EXCEPTIONAL') || s.waterIceRating.includes('HIGH')
        );
        let bestSite = waterIceSites[0];
        let minLatDiff = Infinity;
        waterIceSites.forEach((s) => {
          const diff = Math.abs(s.lat - clickedLat);
          if (diff < minLatDiff) {
            minLatDiff = diff;
            bestSite = s;
          }
        });
        stateRef.current.onDiveToSurface(bestSite.id);
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    domElem.addEventListener('click', onClick);

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth || 900;
      const h = mountRef.current.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let animId;
    let clock = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      clock += 0.02;

      if (!isDragging) globeRotationY += 0.0014;
      globeGroup.rotation.y = globeRotationY;
      globeGroup.rotation.x = globeRotationX;

      const satOrbitAngle = clock * 0.45;
      satGroup.position.set(Math.cos(satOrbitAngle) * 76, Math.sin(clock * 0.25) * 14, Math.sin(satOrbitAngle) * 76);
      satGroup.rotation.y = -satOrbitAngle;

      siteMeshes.forEach((s) => {
        const pulse = 1 + Math.sin(clock * 3) * 0.25;
        s.ring.scale.set(pulse, pulse, 1);
        const isSel = s.id === stateRef.current.selectedSiteId;
        s.ring.material.opacity = isSel ? 0.98 : 0.65;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      domElem.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      domElem.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [threeReady]);

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-950 text-red-400 font-mono text-xs">
        {loadError}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[620px] rounded-2xl overflow-hidden border border-slate-800 bg-[#010204] cursor-pointer shadow-2xl">
      <div ref={mountRef} className="w-full h-full" />
      {!threeReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 text-sky-400 font-mono text-xs">
          INITIALIZING SPHERICAL MARS ORBITAL ENGINE...
        </div>
      )}
      <div className="absolute bottom-4 left-4 bg-slate-950/90 backdrop-blur-md border border-sky-500/40 rounded-xl px-4 py-2.5 text-xs font-mono text-sky-300 pointer-events-none shadow-xl">
        <div>CLICK ANYWHERE ON MARS GLOBE TO AUTO-DROP ONTO WATER &amp; ICE RESERVES + LAUNCH CONTROLLABLE 3D SIMULATION</div>
      </div>
    </div>
  );
}
