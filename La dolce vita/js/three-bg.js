/**
 * three-bg.js — Animated particle-network background using Three.js
 * Loaded as an ES module via navbar.js; injected once per page.
 */
import * as THREE from 'https://esm.sh/three@0.160.0';

(function () {
    /* ── Respect prefers-reduced-motion ─────────────────────────── */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /* ── Config ──────────────────────────────────────────────────── */
    const MOBILE_BREAKPOINT = 768;
    const isMobile = () => window.innerWidth < MOBILE_BREAKPOINT;
    const PARTICLE_COUNT_DESKTOP = 100;
    const PARTICLE_COUNT_MOBILE  = 50;
    const LINE_DIST = 10;          // max distance for line connections
    const PARTICLE_SIZE = 0.2;
    const PARTICLE_COLOR = 0x3498db;
    const LINE_COLOR = 0x3498db;
    const PARTICLE_OPACITY = 0.5;
    const LINE_OPACITY = 0.12;
    const SPEED_SCALE = 0.012;      // drift speed

    /* ── Scene setup ─────────────────────────────────────────────── */
    const scene    = new THREE.Scene();
    const camera   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const canvas = renderer.domElement;
    canvas.style.cssText = [
        'position:fixed',
        'top:0',
        'left:0',
        'width:100%',
        'height:100%',
        'z-index:-1',
        'pointer-events:none',
        'display:block',
    ].join(';');
    canvas.id = 'three-bg-canvas';
    document.body.appendChild(canvas);

    /* ── State ───────────────────────────────────────────────────── */
    let W = window.innerWidth;
    let H = window.innerHeight;
    let N = isMobile() ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;

    /* ── Helper: world units per pixel ──────────────────────────── */
    function updateCamera() {
        W = window.innerWidth;
        H = window.innerHeight;
        const aspect = W / H;
        // Use a fixed world height of 40 units
        const halfH = 20;
        const halfW = halfH * aspect;
        camera.left   = -halfW;
        camera.right  =  halfW;
        camera.top    =  halfH;
        camera.bottom = -halfH;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H);
    }
    updateCamera();

    /* ── Particles ───────────────────────────────────────────────── */
    // Each particle: { x, y, vx, vy }
    let particles = [];

    function halfW() { return camera.right; }
    function halfH2() { return camera.top; }

    function createParticles() {
        N = isMobile() ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
        particles = [];
        for (let i = 0; i < N; i++) {
            const angle = Math.random() * Math.PI * 2;
            particles.push({
                x: (Math.random() * 2 - 1) * halfW(),
                y: (Math.random() * 2 - 1) * halfH2(),
                vx: Math.cos(angle) * SPEED_SCALE * (0.5 + Math.random()),
                vy: Math.sin(angle) * SPEED_SCALE * (0.5 + Math.random()),
            });
        }
    }

    /* ── Three.js geometry for particles ────────────────────────── */
    let pointsGeometry, pointsMesh;

    function buildPointsMesh() {
        if (pointsMesh) {
            scene.remove(pointsMesh);
            pointsGeometry.dispose();
        }
        pointsGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(N * 3);
        pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const mat = new THREE.PointsMaterial({
            color: PARTICLE_COLOR,
            size: PARTICLE_SIZE,
            sizeAttenuation: true,
            transparent: true,
            opacity: PARTICLE_OPACITY,
            depthWrite: false,
        });
        pointsMesh = new THREE.Points(pointsGeometry, mat);
        scene.add(pointsMesh);
    }

    /* ── Three.js geometry for lines ────────────────────────────── */
    const MAX_LINES = 600; // upper bound to pre-allocate buffer
    let linesGeometry, linesMesh;

    function buildLinesMesh() {
        if (linesMesh) {
            scene.remove(linesMesh);
            linesGeometry.dispose();
        }
        linesGeometry = new THREE.BufferGeometry();
        // 2 vertices per line segment, 3 floats per vertex
        const positions = new Float32Array(MAX_LINES * 2 * 3);
        linesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        linesGeometry.setDrawRange(0, 0); // start with nothing drawn

        const mat = new THREE.LineBasicMaterial({
            color: LINE_COLOR,
            transparent: true,
            opacity: LINE_OPACITY,
            depthWrite: false,
        });
        linesMesh = new THREE.LineSegments(linesGeometry, mat);
        scene.add(linesMesh);
    }

    /* ── Initial build ───────────────────────────────────────────── */
    createParticles();
    buildPointsMesh();
    buildLinesMesh();

    /* ── Update particle positions buffer ────────────────────────── */
    function updateParticleBuffer() {
        const pos = pointsGeometry.attributes.position;
        const arr = pos.array;
        for (let i = 0; i < N; i++) {
            arr[i * 3]     = particles[i].x;
            arr[i * 3 + 1] = particles[i].y;
            arr[i * 3 + 2] = 0;
        }
        pos.needsUpdate = true;
    }

    /* ── Update lines buffer ─────────────────────────────────────── */
    function updateLinesBuffer() {
        const pos = linesGeometry.attributes.position;
        const arr = pos.array;
        let lineCount = 0;

        for (let i = 0; i < N; i++) {
            for (let j = i + 1; j < N; j++) {
                if (lineCount >= MAX_LINES) break;
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                if (dx * dx + dy * dy < LINE_DIST * LINE_DIST) {
                    const base = lineCount * 6;
                    arr[base]     = particles[i].x;
                    arr[base + 1] = particles[i].y;
                    arr[base + 2] = 0;
                    arr[base + 3] = particles[j].x;
                    arr[base + 4] = particles[j].y;
                    arr[base + 5] = 0;
                    lineCount++;
                }
            }
            if (lineCount >= MAX_LINES) break;
        }

        pos.needsUpdate = true;
        linesGeometry.setDrawRange(0, lineCount * 2);
    }

    /* ── Animate ─────────────────────────────────────────────────── */
    let frameCount = 0;

    function animate() {
        requestAnimationFrame(animate);

        const hw = halfW();
        const hh = halfH2();

        // Move particles & bounce off edges
        for (let i = 0; i < N; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            if (p.x >  hw || p.x < -hw) { p.vx *= -1; p.x = Math.max(-hw, Math.min(hw, p.x)); }
            if (p.y >  hh || p.y < -hh) { p.vy *= -1; p.y = Math.max(-hh, Math.min(hh, p.y)); }
        }

        updateParticleBuffer();

        // Only rebuild lines every 2 frames for performance
        frameCount++;
        if (frameCount % 2 === 0) {
            updateLinesBuffer();
        }

        renderer.render(scene, camera);
    }

    animate();

    /* ── Resize handler ──────────────────────────────────────────── */
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateCamera();
            // Rebuild particles for new mobile/desktop context if count changed
            const newN = isMobile() ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
            if (newN !== N) {
                createParticles();
                buildPointsMesh();
                buildLinesMesh();
            } else {
                // Clamp existing particles into new bounds
                const hw = halfW();
                const hh = halfH2();
                for (const p of particles) {
                    if (p.x > hw)  p.x =  hw;
                    if (p.x < -hw) p.x = -hw;
                    if (p.y > hh)  p.y =  hh;
                    if (p.y < -hh) p.y = -hh;
                }
            }
        }, 200);
    });
})();
