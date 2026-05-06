(function () {
  const canvas = document.getElementById("dot-grid");
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  // ─── Appearance (#eee dots, sparse grid, breathe + cursor swell) ─────────────
  const spacing = 26;

  /** Idle dot radius (small). */
  const baseRadius = 0.65;

  /** Extra radius near pointer (additive). */
  const maxBoostRadius = 2.8;

  /** Pointer influence radius (px). */
  const influenceRadius = 260;

  /** Radius multiplier swing from breathing (e.g. 0.14 → scales between ~0.86 and 1.14). */
  const breatheRadiusAmp = 0.44;

  const breatheSpeed = 1.25;

  /** Opacity wobble (fraction of 1), subtle. */
  const breatheAlphaAmp = 0.07;

  /** #eee */
  const DOT_RGB = "238, 238, 238";

  /** Base opacity far from cursor; proximity adds up to this much. */
  const alphaFar = 0.28;
  const alphaNearBoost = 0.38;

  /** Pointer position (CSS pixels, viewport). Updated directly — no smoothing drift. */
  let pointerX = 0;
  let pointerY = 0;

  function syncPointerFromEvent(clientX, clientY) {
    pointerX = clientX;
    pointerY = clientY;
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pointerX = width / 2;
    pointerY = height / 2;
  }

  document.addEventListener(
    "pointermove",
    (e) => syncPointerFromEvent(e.clientX, e.clientY),
    { passive: true },
  );

  window.addEventListener(
    "mousemove",
    (e) => syncPointerFromEvent(e.clientX, e.clientY),
    { passive: true },
  );

  window.addEventListener(
    "pointerdown",
    (e) => syncPointerFromEvent(e.clientX, e.clientY),
    { passive: true },
  );

  function tick() {
    const nowSec = performance.now() * 0.001;
    const breath = 1 + breatheRadiusAmp * Math.sin(nowSec * breatheSpeed);
    const alphaBreath = breatheAlphaAmp * Math.sin(nowSec * breatheSpeed * 1.1);

    ctx.clearRect(0, 0, width, height);

    const cols = Math.ceil(width / spacing) + 1;
    const rows = Math.ceil(height / spacing) + 1;

    for (let gy = 0; gy < rows; gy++) {
      for (let gx = 0; gx < cols; gx++) {
        const x = gx * spacing;
        const y = gy * spacing;
        const dx = x - pointerX;
        const dy = y - pointerY;
        const dist = Math.hypot(dx, dy);
        const t = Math.max(0, 1 - dist / influenceRadius);
        const eased = t * t * (3 - 2 * t);

        const r = (baseRadius + maxBoostRadius * eased) * breath;
        const alpha = Math.min(
          0.95,
          alphaFar + alphaNearBoost * eased + alphaBreath,
        );

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${DOT_RGB}, ${alpha})`;
        ctx.fill();
      }
    }

    requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(tick);
})();
