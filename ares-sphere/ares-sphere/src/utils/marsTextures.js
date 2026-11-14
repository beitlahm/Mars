export function createProceduralMarsTextures() {
  const width = 2048;
  const height = 1024;

  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = width;
  colorCanvas.height = height;
  const ctx = colorCanvas.getContext('2d');

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bCtx = bumpCanvas.getContext('2d');

  const baseGrad = ctx.createLinearGradient(0, 0, 0, height);
  baseGrad.addColorStop(0, '#7a331b');
  baseGrad.addColorStop(0.2, '#b84f29');
  baseGrad.addColorStop(0.5, '#d6683b');
  baseGrad.addColorStop(0.8, '#c45b33');
  baseGrad.addColorStop(1, '#6b2d17');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, width, height);

  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, width, height);

  for (let i = 0; i < 500; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const rx = Math.random() * 160 + 25;
    const ry = Math.random() * 90 + 20;
    const rot = Math.random() * Math.PI;
    const isDark = Math.random() > 0.38;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    const radGrad = ctx.createRadialGradient(0, 0, rx * 0.05, 0, 0, rx);
    if (isDark) {
      radGrad.addColorStop(0, 'rgba(42, 18, 12, 0.55)');
      radGrad.addColorStop(0.65, 'rgba(72, 34, 22, 0.3)');
      radGrad.addColorStop(1, 'rgba(72, 34, 22, 0)');
    } else {
      radGrad.addColorStop(0, 'rgba(245, 142, 85, 0.42)');
      radGrad.addColorStop(0.7, 'rgba(214, 104, 59, 0.18)');
      radGrad.addColorStop(1, 'rgba(214, 104, 59, 0)');
    }
    ctx.fillStyle = radGrad;
    ctx.scale(1, ry / rx);
    ctx.beginPath();
    ctx.arc(0, 0, rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  for (let i = 0; i < 1800; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height;
    const cr = Math.pow(Math.random(), 2.2) * 38 + 2.0;

    ctx.strokeStyle = 'rgba(248, 162, 112, 0.28)';
    ctx.lineWidth = Math.max(1, cr * 0.12);
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(45, 18, 10, 0.35)';
    ctx.beginPath();
    ctx.arc(cx + cr * 0.1, cy + cr * 0.1, cr * 0.82, 0, Math.PI * 2);
    ctx.fill();

    bCtx.strokeStyle = 'rgba(240, 240, 240, 0.55)';
    bCtx.lineWidth = Math.max(1.2, cr * 0.14);
    bCtx.beginPath();
    bCtx.arc(cx, cy, cr, 0, Math.PI * 2);
    bCtx.stroke();

    bCtx.fillStyle = 'rgba(25, 25, 25, 0.55)';
    bCtx.beginPath();
    bCtx.arc(cx, cy, cr * 0.78, 0, Math.PI * 2);
    bCtx.fill();
  }

  ctx.save();
  bCtx.save();
  const canyonStartX = 580;
  const canyonY = 520;
  for (let s = 0; s < 600; s += 3) {
    const t = s / 600;
    const offsetY = Math.sin(t * Math.PI * 4) * 16 + (Math.random() - 0.5) * 5;
    const canyonWidth = Math.sin(t * Math.PI) * 32 + 5;

    ctx.fillStyle = 'rgba(28, 10, 6, 0.82)';
    ctx.beginPath();
    ctx.ellipse(canyonStartX + s, canyonY + offsetY, 12, canyonWidth * 0.55, 0.12, 0, Math.PI * 2);
    ctx.fill();

    bCtx.fillStyle = 'rgba(10, 10, 10, 0.85)';
    bCtx.beginPath();
    bCtx.ellipse(canyonStartX + s, canyonY + offsetY, 12, canyonWidth * 0.5, 0.12, 0, Math.PI * 2);
    bCtx.fill();
  }
  ctx.restore();
  bCtx.restore();

  const northCap = ctx.createLinearGradient(0, 0, 0, 48);
  northCap.addColorStop(0, 'rgba(255, 252, 248, 0.92)');
  northCap.addColorStop(0.65, 'rgba(225, 185, 165, 0.35)');
  northCap.addColorStop(1, 'rgba(225, 185, 165, 0)');
  ctx.fillStyle = northCap;
  ctx.fillRect(0, 0, width, 48);

  const southCap = ctx.createLinearGradient(0, height, 0, height - 48);
  southCap.addColorStop(0, 'rgba(255, 252, 248, 0.92)');
  southCap.addColorStop(0.65, 'rgba(225, 185, 165, 0.35)');
  southCap.addColorStop(1, 'rgba(225, 185, 165, 0)');
  ctx.fillStyle = southCap;
  ctx.fillRect(0, height - 48, width, 48);

  const colorMap = new window.THREE.CanvasTexture(colorCanvas);
  colorMap.wrapS = window.THREE.RepeatWrapping;
  colorMap.wrapT = window.THREE.ClampToEdgeWrapping;
  colorMap.anisotropy = 16;

  const bumpMap = new window.THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = window.THREE.RepeatWrapping;
  bumpMap.wrapT = window.THREE.ClampToEdgeWrapping;
  bumpMap.anisotropy = 16;

  return { colorMap, bumpMap };
}
