/* ============================
   Premium Circuit Board Background Animation
   5-Layer System: Grid → Circuits → Nodes → Signals → Particles
   With mouse interaction and parallax depth
   ============================ */
function initCircuitBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  let mouseX = -1000, mouseY = -1000;
  let targetMouseX = -1000, targetMouseY = -1000;
  let time = 0;

  /* ---- Palette ---- */
  const BLUE     = '#3b82f6';
  const CYAN     = '#06b6d4';
  const TEAL     = '#0891b2';
  const DEEP     = '#1e3a5f';
  const PALE     = '#93c5fd';
  const GRID_CLR = 'rgba(59,130,246,0.04)';

  /* ---- Resize ---- */
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Regenerate circuits on resize
    generateCircuits();
    generateParticles();
  }

  /* ---- Mouse tracking (throttled) ---- */
  let mouseThrottle = false;
  function onMouseMove(e) {
    if (mouseThrottle) return;
    mouseThrottle = true;
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
    setTimeout(() => { mouseThrottle = false; }, 16);
  }
  function onMouseLeave() {
    targetMouseX = -1000;
    targetMouseY = -1000;
  }
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  document.addEventListener('mouseleave', onMouseLeave);
  window.addEventListener('resize', resize);

  /* ========================================
     LAYER 1 — Background Grid
     ======================================== */
  const GRID_SPACING = 60;

  function drawGrid() {
    ctx.save();

    // Horizontal lines
    ctx.strokeStyle = GRID_CLR;
    ctx.lineWidth = 0.5;
    const offsetY = (time * 0.02) % GRID_SPACING;
    for (let y = -GRID_SPACING + offsetY; y < height + GRID_SPACING; y += GRID_SPACING) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    // Vertical lines
    const offsetX = (time * 0.015) % GRID_SPACING;
    for (let x = -GRID_SPACING + offsetX; x < width + GRID_SPACING; x += GRID_SPACING) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Scanning shimmer — a faint bright band sweeping diagonally
    const shimmerPos = ((time * 0.3) % (width + height * 0.7)) - height * 0.35;
    const shimGrad = ctx.createLinearGradient(shimmerPos, 0, shimmerPos + 300, height * 0.5);
    shimGrad.addColorStop(0, 'rgba(59,130,246,0)');
    shimGrad.addColorStop(0.5, 'rgba(59,130,246,0.025)');
    shimGrad.addColorStop(1, 'rgba(59,130,246,0)');
    ctx.fillStyle = shimGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
  }

  /* ========================================
     LAYER 2 — Circuit Paths
     ======================================== */
  let circuits = [];

  function generateCircuits() {
    circuits = [];
    // Scale count based on screen area
    const area = width * height;
    const count = Math.floor(area / 80000) + 8;

    for (let i = 0; i < count; i++) {
      circuits.push(createCircuit());
    }
  }

  function createCircuit() {
    const path = [];
    // Start from random edge or random point on canvas
    const startEdge = Math.random();
    let x, y;

    if (startEdge < 0.3) {
      // Left edge
      x = -10; y = Math.random() * height;
    } else if (startEdge < 0.5) {
      // Top edge
      x = Math.random() * width; y = -10;
    } else if (startEdge < 0.7) {
      // Right edge
      x = width + 10; y = Math.random() * height;
    } else {
      // Random point
      x = Math.random() * width;
      y = Math.random() * height;
    }

    path.push({ x, y });

    const segCount = Math.floor(Math.random() * 6) + 4;
    let dirX = startEdge < 0.3 ? 1 : startEdge < 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 1;
    let dirY = 0;

    for (let s = 0; s < segCount; s++) {
      // Alternate between horizontal and vertical runs
      if (s % 2 === 0) {
        // Horizontal run
        const len = Math.random() * 180 + 60;
        x += len * dirX;
        path.push({ x, y });
      } else {
        // Vertical run or 45° diagonal
        const bendType = Math.random();
        if (bendType < 0.65) {
          // 90° vertical
          const len = Math.random() * 120 + 40;
          const dir = Math.random() > 0.5 ? 1 : -1;
          y += len * dir;
          path.push({ x, y });
        } else {
          // 45° diagonal
          const len = Math.random() * 80 + 30;
          const dir = Math.random() > 0.5 ? 1 : -1;
          x += len * dirX;
          y += len * dir;
          path.push({ x, y });
        }
      }
      // Occasionally flip horizontal direction
      if (Math.random() < 0.15) dirX *= -1;
    }

    // Calculate segment lengths and total length
    const segLengths = [];
    let totalLen = 0;
    for (let k = 1; k < path.length; k++) {
      const dx = path[k].x - path[k - 1].x;
      const dy = path[k].y - path[k - 1].y;
      const len = Math.sqrt(dx * dx + dy * dy);
      segLengths.push(len);
      totalLen += len;
    }

    // Color — gradient from blue to cyan
    const t = Math.random();
    const r = Math.round(59 + (6 - 59) * t);
    const g = Math.round(130 + (182 - 130) * t);
    const b = Math.round(246 + (212 - 246) * t);

    return {
      path,
      segLengths,
      totalLen,
      color: `rgb(${r},${g},${b})`,
      width: Math.random() * 0.8 + 0.4,
      opacity: Math.random() * 0.25 + 0.08,
      // Animation state
      drawProgress: 0,
      drawSpeed: Math.random() * 0.002 + 0.001,
      phase: 'drawing', // drawing → visible → fading → dead
      phaseTimer: 0,
      visibleDuration: Math.random() * 600 + 400,
      fadeSpeed: Math.random() * 0.003 + 0.002,
      currentOpacity: 0,
      // Nodes at bends
      nodes: [],
    };
  }

  function updateCircuits() {
    for (let i = circuits.length - 1; i >= 0; i--) {
      const c = circuits[i];

      switch (c.phase) {
        case 'drawing':
          c.drawProgress += c.drawSpeed;
          c.currentOpacity = Math.min(c.opacity, c.currentOpacity + 0.005);
          if (c.drawProgress >= 1) {
            c.drawProgress = 1;
            c.currentOpacity = c.opacity;
            c.phase = 'visible';
            c.phaseTimer = 0;
            // Generate nodes at path points
            c.nodes = [];
            for (let j = 1; j < c.path.length; j++) {
              if (Math.random() < 0.45) {
                c.nodes.push({
                  x: c.path[j].x,
                  y: c.path[j].y,
                  radius: Math.random() * 2.5 + 1.5,
                  pulseOffset: Math.random() * Math.PI * 2,
                  type: Math.random() < 0.5 ? 'filled' : 'ring',
                });
              }
            }
          }
          break;

        case 'visible':
          c.phaseTimer++;
          if (c.phaseTimer >= c.visibleDuration) {
            c.phase = 'fading';
          }
          break;

        case 'fading':
          c.currentOpacity -= c.fadeSpeed;
          if (c.currentOpacity <= 0) {
            c.currentOpacity = 0;
            c.phase = 'dead';
          }
          break;

        case 'dead':
          circuits[i] = createCircuit();
          break;
      }
    }
  }

  function drawCircuits() {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (const c of circuits) {
      if (c.currentOpacity <= 0) continue;

      // Parallax offset based on mouse
      const parallaxFactor = c.width * 0.8;
      const px = (mouseX - width / 2) * 0.008 * parallaxFactor;
      const py = (mouseY - height / 2) * 0.008 * parallaxFactor;

      ctx.globalAlpha = c.currentOpacity;
      ctx.strokeStyle = c.color;
      ctx.lineWidth = c.width;

      // Draw the circuit path
      const drawLen = c.totalLen * c.drawProgress;
      ctx.beginPath();
      ctx.moveTo(c.path[0].x + px, c.path[0].y + py);

      let accLen = 0;
      for (let i = 0; i < c.segLengths.length; i++) {
        const segLen = c.segLengths[i];
        if (accLen >= drawLen) break;

        const remaining = drawLen - accLen;
        if (remaining >= segLen) {
          ctx.lineTo(c.path[i + 1].x + px, c.path[i + 1].y + py);
        } else {
          const t = remaining / segLen;
          const ix = c.path[i].x + (c.path[i + 1].x - c.path[i].x) * t;
          const iy = c.path[i].y + (c.path[i + 1].y - c.path[i].y) * t;
          ctx.lineTo(ix + px, iy + py);
        }
        accLen += segLen;
      }
      ctx.stroke();

      // Draw nodes (Layer 3 integrated)
      if (c.phase === 'visible' || c.phase === 'fading') {
        for (const n of c.nodes) {
          const pulse = Math.sin(time * 0.03 + n.pulseOffset) * 0.4 + 0.6;
          const nr = n.radius * pulse;
          const nx = n.x + px;
          const ny = n.y + py;

          // Mouse proximity glow boost
          const dx = nx - mouseX;
          const dy = ny - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseGlow = dist < 150 ? (1 - dist / 150) * 0.6 : 0;

          ctx.globalAlpha = c.currentOpacity * (0.6 + pulse * 0.4 + mouseGlow);

          if (n.type === 'filled') {
            // Glow
            ctx.beginPath();
            ctx.arc(nx, ny, nr * 3, 0, Math.PI * 2);
            ctx.fillStyle = c.color;
            ctx.globalAlpha = c.currentOpacity * 0.08 * (1 + mouseGlow);
            ctx.fill();

            // Core
            ctx.beginPath();
            ctx.arc(nx, ny, nr, 0, Math.PI * 2);
            ctx.fillStyle = c.color;
            ctx.globalAlpha = c.currentOpacity * (0.7 + pulse * 0.3 + mouseGlow);
            ctx.fill();
          } else {
            // Ring node
            ctx.beginPath();
            ctx.arc(nx, ny, nr + 1, 0, Math.PI * 2);
            ctx.strokeStyle = c.color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = c.currentOpacity * (0.5 + pulse * 0.3 + mouseGlow);
            ctx.stroke();

            // Center dot
            ctx.beginPath();
            ctx.arc(nx, ny, 1.2, 0, Math.PI * 2);
            ctx.fillStyle = c.color;
            ctx.globalAlpha = c.currentOpacity * (0.8 + mouseGlow);
            ctx.fill();
          }
        }
      }
    }

    ctx.restore();
  }

  /* ========================================
     LAYER 4 — Data Signal Pulses
     ======================================== */
  let signals = [];
  const MAX_SIGNALS = 6;

  function spawnSignal() {
    // Pick a visible circuit with full path
    const candidates = circuits.filter(c => c.phase === 'visible' && c.totalLen > 100);
    if (candidates.length === 0) return;

    const cir = candidates[Math.floor(Math.random() * candidates.length)];

    signals.push({
      circuit: cir,
      progress: 0,
      speed: Math.random() * 0.006 + 0.003,
      size: Math.random() * 2 + 1.5,
      trailLength: Math.random() * 0.08 + 0.04,
    });
  }

  function getPointOnCircuit(cir, progress) {
    const targetLen = cir.totalLen * Math.max(0, Math.min(1, progress));
    let accLen = 0;

    for (let i = 0; i < cir.segLengths.length; i++) {
      const segLen = cir.segLengths[i];
      if (accLen + segLen >= targetLen) {
        const t = (targetLen - accLen) / segLen;
        return {
          x: cir.path[i].x + (cir.path[i + 1].x - cir.path[i].x) * t,
          y: cir.path[i].y + (cir.path[i + 1].y - cir.path[i].y) * t,
        };
      }
      accLen += segLen;
    }
    const last = cir.path[cir.path.length - 1];
    return { x: last.x, y: last.y };
  }

  function updateSignals() {
    for (let i = signals.length - 1; i >= 0; i--) {
      signals[i].progress += signals[i].speed;
      if (signals[i].progress > 1.1) {
        signals.splice(i, 1);
      }
    }
    // Spawn new signals periodically
    if (signals.length < MAX_SIGNALS && Math.random() < 0.015) {
      spawnSignal();
    }
  }

  function drawSignals() {
    ctx.save();

    for (const sig of signals) {
      const cir = sig.circuit;
      if (cir.currentOpacity <= 0) continue;

      const parallaxFactor = cir.width * 0.8;
      const px = (mouseX - width / 2) * 0.008 * parallaxFactor;
      const py = (mouseY - height / 2) * 0.008 * parallaxFactor;

      const head = getPointOnCircuit(cir, sig.progress);

      // Draw glowing trail
      const steps = 8;
      for (let s = 0; s <= steps; s++) {
        const tp = sig.progress - (sig.trailLength * s / steps);
        if (tp < 0) continue;
        const pt = getPointOnCircuit(cir, tp);
        const alpha = (1 - s / steps) * 0.8;

        ctx.beginPath();
        ctx.arc(pt.x + px, pt.y + py, sig.size * (1 - s / steps * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = CYAN;
        ctx.globalAlpha = alpha * cir.currentOpacity;
        ctx.fill();
      }

      // Bright head glow
      ctx.beginPath();
      ctx.arc(head.x + px, head.y + py, sig.size * 3, 0, Math.PI * 2);
      const headGlow = ctx.createRadialGradient(
        head.x + px, head.y + py, 0,
        head.x + px, head.y + py, sig.size * 4
      );
      headGlow.addColorStop(0, 'rgba(6,182,212,0.35)');
      headGlow.addColorStop(1, 'rgba(6,182,212,0)');
      ctx.fillStyle = headGlow;
      ctx.globalAlpha = cir.currentOpacity;
      ctx.fill();
    }

    ctx.restore();
  }

  /* ========================================
     LAYER 5 — Particle Network
     ======================================== */
  let particles = [];
  const PARTICLE_COUNT_BASE = 40;
  const PARTICLE_CONNECT_DIST = 120;

  function generateParticles() {
    particles = [];
    const count = Math.floor((width * height) / (1920 * 1080) * PARTICLE_COUNT_BASE) + 15;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.15 + 0.05,
      });
    }
  }

  function updateParticles() {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;

      // Mouse repulsion
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120 && dist > 0) {
        const force = (120 - dist) / 120 * 0.3;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      // Damping
      p.vx *= 0.995;
      p.vy *= 0.995;
    }
  }

  function drawParticles() {
    ctx.save();

    // Draw connections first
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < PARTICLE_CONNECT_DIST) {
          const alpha = (1 - dist / PARTICLE_CONNECT_DIST) * 0.06;
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = BLUE;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (const p of particles) {
      // Check mouse proximity for brightness
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const mouseBoost = dist < 150 ? (1 - dist / 150) * 0.3 : 0;

      ctx.globalAlpha = p.opacity + mouseBoost;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = PALE;
      ctx.fill();

      // Subtle glow for mouse-proximate particles
      if (mouseBoost > 0.1) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
        glow.addColorStop(0, `rgba(59,130,246,${mouseBoost * 0.3})`);
        glow.addColorStop(1, 'rgba(59,130,246,0)');
        ctx.fillStyle = glow;
        ctx.globalAlpha = 1;
        ctx.fill();
      }
    }

    ctx.restore();
  }

  /* ========================================
     MAIN ANIMATION LOOP
     ======================================== */
  resize();

  function animate() {
    time++;

    // Smooth mouse interpolation
    mouseX += (targetMouseX - mouseX) * 0.08;
    mouseY += (targetMouseY - mouseY) * 0.08;

    ctx.clearRect(0, 0, width, height);

    // Layer 1 — Grid
    drawGrid();

    // Layer 2+3 — Circuits + Nodes
    updateCircuits();
    drawCircuits();

    // Layer 4 — Signals
    updateSignals();
    drawSignals();

    // Layer 5 — Particles
    updateParticles();
    drawParticles();

    requestAnimationFrame(animate);
  }

  animate();
}
