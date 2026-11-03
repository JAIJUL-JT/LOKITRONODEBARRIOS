/**
 * 🐉 DRAGONES DE LOKITRONO — VUELO REALISTA
 * Dos dragones (rojo + azul) en silueta atmosférica, con planeo, aleteo
 * ocasional, inclinación suave y cola ondulante. Física independiente.
 * Visible en todas las pantallas que carguen este script.
 */

(function () {
    const canvas = document.createElement('canvas');
    canvas.id = 'dragon-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9998';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const PALETTES = {
        red: {
            bodyTop: '#3a0d0d', body: '#1f0808', bodyBelly: '#110303',
            wingRoot: '#2a0a0a', wingTip: '#130404', wingFar: '#0b0202',
            bone: '#5a1a1a', rim: '#b91c1c', eye: '#fbbf24'
        },
        blue: {
            bodyTop: '#0d1b3a', body: '#07101f', bodyBelly: '#03060d',
            wingRoot: '#0a1730', wingTip: '#04070d', wingFar: '#02030a',
            bone: '#1e3a8a', rim: '#3b82f6', eye: '#fde047'
        }
    };

    function createDragon(palette, opts) {
        const d = {
            palette,
            x: 0,
            y: 0,
            baseY: 0,
            band: opts.band,
            direction: opts.direction,
            speed: opts.speed,
            baseSpeed: opts.speed,
            angle: opts.direction > 0 ? 0 : Math.PI,
            pitch: 0,
            wingCycle: opts.wingPhase,
            wingFlap: 0,
            flapCooldown: Math.random() * 3,
            flapBurst: 0,
            fireCooldown: 1.5 + Math.random() * 4,
            fireBurst: 0,
            tailPhase: Math.random() * Math.PI * 2,
            bobPhase: opts.phase,
            baseScale: opts.baseScale,
            scale: opts.baseScale,
            alpha: opts.alpha
        };
        resetDragon(d, true);
        return d;
    }

    function resetDragon(d, initial) {
        const margin = 320;
        d.band = 0.2 + Math.random() * 0.55;
        d.baseY = height * d.band;
        d.y = d.baseY + (Math.random() - 0.5) * 40;
        d.x = d.direction > 0 ? -margin : width + margin;
        d.speed = d.baseSpeed * (0.85 + Math.random() * 0.3);
        d.angle = d.direction > 0 ? 0 : Math.PI;
        if (!initial) {
            d.tailPhase = Math.random() * Math.PI * 2;
            d.flapCooldown = 1 + Math.random() * 3;
        }
    }

    const dragons = [
        createDragon(PALETTES.red, {
            band: 0.3,
            direction: 1,
            speed: 2.3,
            wingPhase: 0,
            baseScale: 0.62,
            phase: 0,
            alpha: 0.9
        }),
        createDragon(PALETTES.blue, {
            band: 0.62,
            direction: -1,
            speed: 1.65,
            wingPhase: Math.PI * 0.8,
            baseScale: 0.5,
            phase: Math.PI * 0.6,
            alpha: 0.82
        })
    ];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        const factor = width < 640 ? 0.62 : width < 1024 ? 0.8 : 1;
        for (const d of dragons) {
            d.scale = d.baseScale * factor;
            d.baseY = height * d.band;
        }
    }
    resize();
    window.addEventListener('resize', resize);

    // 🔥 BOCANADAS DE FUEGO
    const fireParticles = [];
    const MAX_FIRE_PARTICLES = 360;

    function bocaMundial(d) {
        const lx = 88;
        const ly = -16;
        const a = d.angle + d.pitch;
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        return {
            x: d.x + (lx * cos - ly * sin) * d.scale,
            y: d.y + (lx * sin + ly * cos) * d.scale,
            angle: a
        };
    }

    function emitirFuego(d) {
        if (fireParticles.length >= MAX_FIRE_PARTICLES) return;
        const boca = bocaMundial(d);
        const angulo = boca.angle + (Math.random() - 0.5) * 0.44;
        const velocidad = 170 + Math.random() * 230;
        const vida = 0.65 + Math.random() * 0.35;
        fireParticles.push({
            x: boca.x + Math.cos(angulo) * 6 * d.scale,
            y: boca.y + Math.sin(angulo) * 6 * d.scale,
            vx: Math.cos(angulo) * velocidad,
            vy: Math.sin(angulo) * velocidad - 25,
            life: vida,
            initial: vida,
            size: (2.6 + Math.random() * 4.2) * d.scale,
            hue: 22 + Math.random() * 26
        });
    }

    function actualizarFuego(dt) {
        for (let i = fireParticles.length - 1; i >= 0; i--) {
            const p = fireParticles[i];
            const frenado = Math.max(0, 1 - 2.2 * dt);
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vx *= frenado;
            p.vy = p.vy * frenado - 55 * dt;
            p.life -= dt;
            if (p.life <= 0) fireParticles.splice(i, 1);
        }
    }

    function dibujarFuego(context) {
        if (fireParticles.length === 0) return;
        context.save();
        context.globalCompositeOperation = 'lighter';
        for (const p of fireParticles) {
            const t = Math.max(0, p.life / p.initial);
            const radio = p.size * (1 + (1 - t) * 2.3);
            const grad = context.createRadialGradient(p.x, p.y, 0, p.x, p.y, radio);
            grad.addColorStop(0, `hsla(${p.hue + 22}, 100%, 80%, ${0.6 * t})`);
            grad.addColorStop(0.45, `hsla(${p.hue}, 100%, 55%, ${0.42 * t})`);
            grad.addColorStop(1, `hsla(${p.hue - 12}, 100%, 40%, 0)`);
            context.fillStyle = grad;
            context.beginPath();
            context.arc(p.x, p.y, radio, 0, Math.PI * 2);
            context.fill();
        }
        context.restore();
    }

    // ==========================================
    // 🎭 DANZA / BAILE DE DRAGONES
    // ==========================================
    let modoBaile = false;
    let tiempoBaile = 0;
    const DURACION_BAILE = 14; // segundos de danza ceremonial

    function iniciarBaileDragones() {
        modoBaile = true;
        tiempoBaile = 0;
        // Posicionar ambos en el centro de la pantalla
        const centroX = width * 0.5;
        const centroY = height * 0.42;
        
        dragons[0].x = centroX - 180;
        dragons[0].y = centroY;
        dragons[0].angle = -Math.PI * 0.5;
        dragons[0].flapBurst = 1;
        dragons[0].fireBurst = 1.2;

        dragons[1].x = centroX + 180;
        dragons[1].y = centroY;
        dragons[1].angle = Math.PI * 0.5;
        dragons[1].flapBurst = 1;
        dragons[1].fireBurst = 1.2;
    }

    function detenerBaileDragones() {
        modoBaile = false;
        tiempoBaile = 0;
        resetDragon(dragons[0], false);
        resetDragon(dragons[1], false);
    }

    function toggleBaileDragones() {
        if (modoBaile) detenerBaileDragones();
        else iniciarBaileDragones();
        return modoBaile;
    }

    window.iniciarBaileDragones = iniciarBaileDragones;
    window.detenerBaileDragones = detenerBaileDragones;
    window.toggleBaileDragones = toggleBaileDragones;

    function updateDragonDanza(d, dt, now) {
        tiempoBaile += dt * 0.5; // progreso del baile
        if (tiempoBaile > DURACION_BAILE) {
            detenerBaileDragones();
            return;
        }

        // Es el dragón 0 (rojo) o el 1 (azul)
        const esRojo = d === dragons[0];
        const signo = esRojo ? 1 : -1;
        const desfase = esRojo ? 0 : Math.PI;

        // Trayectoria lemniscata / espiral doble (Danza ceremonial)
        const centroX = width * 0.5;
        const centroY = height * 0.42;
        const radioX = Math.min(width * 0.32, 380);
        const radioY = Math.min(height * 0.24, 220);

        // Movimiento en figura de 8 (lemniscata de Bernoulli)
        const t = (now * 0.0012) + desfase;
        const targetX = centroX + Math.sin(t) * radioX;
        const targetY = centroY + (Math.sin(t * 2) * 0.5) * radioY;

        // Calcular ángulo hacia adelante en la curva
        const targetNextX = centroX + Math.sin(t + 0.08) * radioX;
        const targetNextY = centroY + (Math.sin((t + 0.08) * 2) * 0.5) * radioY;
        const desiredAngle = Math.atan2(targetNextY - targetY, targetNextX - targetX);

        d.x += (targetX - d.x) * Math.min(1, dt * 5);
        d.y += (targetY - d.y) * Math.min(1, dt * 5);

        let delta = desiredAngle - d.angle;
        while (delta > Math.PI) delta -= Math.PI * 2;
        while (delta < -Math.PI) delta += Math.PI * 2;
        d.angle += delta * Math.min(1, dt * 8);

        // Aleteo sincronizado y ágil en la danza
        d.wingCycle += dt * 5.5;
        d.wingFlap = Math.sin(d.wingCycle) * 0.85;
        d.tailPhase += dt * 4;
        d.pitch = Math.sin(d.tailPhase) * 0.08;

        // Esporádicas bocanadas de fuego sincronizadas
        if (Math.sin(t * 4) > 0.6) {
            for (let i = 0; i < 2; i++) emitirFuego(d);
        }
    }

    function updateDragon(d, dt, now) {
        if (modoBaile) {
            updateDragonDanza(d, dt, now);
            return;
        }

        // Planeo predominante con ráfagas de aleteo ocasionales.
        d.flapCooldown -= dt;
        if (d.flapCooldown <= 0) {
            d.flapBurst = 1;
            d.flapCooldown = 3.2 + Math.random() * 4.5;
        }
        d.flapBurst = Math.max(0, d.flapBurst - dt * 1.25);
        d.wingCycle += dt * (2.2 + d.flapBurst * 2.6);
        d.wingFlap = Math.sin(d.wingCycle) * (0.16 + 0.84 * d.flapBurst);

        const margin = 320;
        if ((d.direction > 0 && d.x > width + margin) || (d.direction < 0 && d.x < -margin)) {
            resetDragon(d, false);
        }

        d.baseY = height * d.band;
        const targetY = d.baseY + Math.sin(now * 0.00055 + d.bobPhase) * height * 0.075;
        const targetX = d.direction > 0 ? width + margin : -margin;
        const desiredAngle = Math.atan2(targetY - d.y, targetX - d.x);
        let delta = desiredAngle - d.angle;
        while (delta > Math.PI) delta -= Math.PI * 2;
        while (delta < -Math.PI) delta += Math.PI * 2;
        d.angle += delta * Math.min(1, dt * 1.6);

        const speed = d.speed * (1 + 0.06 * Math.sin(now * 0.0008 + d.bobPhase));
        d.x += Math.cos(d.angle) * speed * dt * 60;
        d.y += Math.sin(d.angle) * speed * dt * 60;
        d.y = Math.max(70, Math.min(height - 70, d.y));

        d.tailPhase += dt * 1.6;
        d.pitch = Math.sin(d.tailPhase * 0.65) * 0.035 + d.wingFlap * 0.025;

        // Una bocanada de fuego cada cierto tiempo.
        d.fireCooldown -= dt;
        if (d.fireCooldown <= 0) {
            d.fireBurst = 0.7 + Math.random() * 0.4;
            d.fireCooldown = 5 + Math.random() * 5;
        }
        if (d.fireBurst > 0) {
            d.fireBurst -= dt;
            for (let i = 0; i < 2; i++) emitirFuego(d);
        }
    }

    function drawWing(context, d, far) {
        const p = d.palette;
        const flap = d.wingFlap;
        const rootX = far ? 6 : 16;
        const rootY = far ? -9 : -5;
        const len = far ? 96 : 114;
        const baseAngle = -1.92 + flap * 0.55;
        const tipX = rootX + Math.cos(baseAngle) * len;
        const tipY = rootY + Math.sin(baseAngle) * len;
        const hipX = -58;
        const hipY = 9;

        // Puntos de la orilla posterior (nervaduras) desde el extremo a la cadera.
        const pts = [];
        for (let i = 0; i <= 3; i++) {
            const t = i / 3;
            pts.push({
                x: tipX + (hipX - tipX) * t,
                y: tipY + (hipY - tipY) * t
            });
        }

        const lx = tipX - rootX;
        const ly = tipY - rootY;
        const llen = Math.hypot(lx, ly) || 1;
        const leadCtrlX = rootX + lx * 0.5 + (-ly / llen) * 11;
        const leadCtrlY = rootY + ly * 0.5 + (lx / llen) * 11;

        context.save();
        if (far) context.globalAlpha *= 0.7;

        context.beginPath();
        context.moveTo(rootX, rootY);
        context.quadraticCurveTo(leadCtrlX, leadCtrlY, tipX, tipY);
        for (let i = 0; i < pts.length - 1; i++) {
            const a = pts[i];
            const b = pts[i + 1];
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2;
            const ctrlX = mx + (rootX - mx) * 0.24;
            const ctrlY = my + (rootY - my) * 0.24;
            context.quadraticCurveTo(ctrlX, ctrlY, b.x, b.y);
        }
        context.closePath();

        const wingGrad = context.createLinearGradient(rootX, rootY, tipX, tipY);
        wingGrad.addColorStop(0, far ? p.wingFar : p.wingRoot);
        wingGrad.addColorStop(1, far ? p.wingFar : p.wingTip);
        context.fillStyle = wingGrad;
        context.fill();

        // Borde de fuga iluminado tenue.
        context.strokeStyle = p.rim;
        context.globalAlpha *= 0.28;
        context.lineWidth = 1.4;
        context.stroke();
        context.globalAlpha /= 0.28;

        // Nervaduras.
        const wristX = rootX + lx * 0.34;
        const wristY = rootY + ly * 0.34;
        context.strokeStyle = p.bone;
        context.globalAlpha *= 0.5;
        context.lineWidth = 1.1;
        context.beginPath();
        for (let i = 1; i < pts.length; i++) {
            context.moveTo(wristX, wristY);
            context.lineTo(pts[i].x, pts[i].y);
        }
        context.stroke();

        // Garra del ala.
        context.globalAlpha *= 1.6;
        context.strokeStyle = p.bone;
        context.lineWidth = 1.6;
        context.beginPath();
        context.moveTo(tipX, tipY);
        context.lineTo(tipX + 5, tipY - 4);
        context.stroke();

        context.restore();
    }

    function drawBody(context, d) {
        const p = d.palette;
        const sway = Math.sin(d.tailPhase) * 7;

        context.save();

        // Cola larga y fina con aleta terminal.
        context.beginPath();
        context.moveTo(-28, -9);
        context.bezierCurveTo(-68, -7, -110, -3 + sway * 0.25, -148, -9 + sway);
        context.lineTo(-166, -3 + sway);
        context.lineTo(-150, 3 + sway * 0.7);
        context.bezierCurveTo(-110, 7, -68, 9, -28, 9);
        context.closePath();
        const tailGrad = context.createLinearGradient(-166, 0, -28, 0);
        tailGrad.addColorStop(0, p.bodyBelly);
        tailGrad.addColorStop(1, p.body);
        context.fillStyle = tailGrad;
        context.fill();

        // Cuerpo aerodinámico.
        context.beginPath();
        context.moveTo(36, -3);
        context.bezierCurveTo(22, -13, 0, -15, -22, -11);
        context.bezierCurveTo(-48, -8, -66, -6, -80, -5);
        context.bezierCurveTo(-66, 1, -48, 5, -22, 8);
        context.bezierCurveTo(0, 12, 24, 10, 36, -3);
        context.closePath();
        const bodyGrad = context.createLinearGradient(0, -15, 0, 12);
        bodyGrad.addColorStop(0, p.bodyTop);
        bodyGrad.addColorStop(0.55, p.body);
        bodyGrad.addColorStop(1, p.bodyBelly);
        context.fillStyle = bodyGrad;
        context.fill();

        // Cuello y cabeza.
        context.beginPath();
        context.moveTo(28, -11);
        context.bezierCurveTo(44, -13, 56, -19, 64, -22);
        context.bezierCurveTo(68, -24, 74, -24, 78, -21);
        context.lineTo(85, -18);
        context.lineTo(84, -15);
        context.bezierCurveTo(79, -13, 73, -13, 68, -14);
        context.bezierCurveTo(60, -13, 48, -8, 34, 2);
        context.closePath();
        context.fillStyle = p.bodyTop;
        context.fill();

        // Cuernos barridos hacia atrás.
        context.fillStyle = p.bodyBelly;
        context.beginPath();
        context.moveTo(66, -22);
        context.lineTo(56, -30);
        context.lineTo(64, -21);
        context.closePath();
        context.fill();
        context.beginPath();
        context.moveTo(71, -23);
        context.lineTo(63, -31);
        context.lineTo(69, -22);
        context.closePath();
        context.fill();

        // Cresta dorsal discreta.
        context.fillStyle = p.bodyBelly;
        for (let i = 0; i < 6; i++) {
            const x = -10 - i * 12;
            const y = -13 + i * 0.5;
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x - 4, y - 5);
            context.lineTo(x - 8, y);
            context.closePath();
            context.fill();
        }

        // Ojo tenue, sin mirada caricaturesca.
        context.fillStyle = p.eye;
        context.globalAlpha *= 0.75;
        context.shadowColor = p.eye;
        context.shadowBlur = 4;
        context.beginPath();
        context.arc(73, -18.5, 1.1, 0, Math.PI * 2);
        context.fill();
        context.shadowBlur = 0;

        context.restore();
    }

    function drawDragon(context, d) {
        context.save();
        context.globalAlpha = d.alpha;
        context.shadowColor = d.palette.rim;
        context.shadowBlur = 10;
        context.translate(d.x, d.y);
        context.rotate(d.angle + d.pitch);
        context.scale(d.scale, d.scale);

        // Ala lejana (detrás del cuerpo).
        drawWing(context, d, true);
        drawBody(context, d);
        // Ala cercana (delante).
        drawWing(context, d, false);

        context.restore();
    }

    let lastTime = 0;
    function animate(now) {
        if (!lastTime) lastTime = now;
        const dt = Math.min(0.05, (now - lastTime) / 1000);
        lastTime = now;

        ctx.clearRect(0, 0, width, height);
        for (const d of dragons) {
            updateDragon(d, dt, now);
            drawDragon(ctx, d);
        }
        actualizarFuego(dt);
        dibujarFuego(ctx);
        requestAnimationFrame(animate);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(animate));
    } else {
        requestAnimationFrame(animate);
    }

    // Reloj de arena medieval
    let hourglassOverlay = null;
    function crearOverlayEspera() {
        if (document.getElementById('medieval-hourglass-loader')) {
            hourglassOverlay = document.getElementById('medieval-hourglass-loader');
            return hourglassOverlay;
        }
        const div = document.createElement('div');
        div.id = 'medieval-hourglass-loader';
        div.className = 'medieval-loading-overlay hidden';
        div.innerHTML = `
            <div class="hourglass-container">
                <div class="hourglass-frame">
                    <div class="hourglass-plate-top"></div>
                    <div class="hourglass-glass">
                        <div class="hourglass-top"><div class="sand-top"></div></div>
                        <div class="sand-stream"></div>
                        <div class="hourglass-bottom"><div class="sand-bottom"></div></div>
                    </div>
                    <div class="hourglass-plate-bottom"></div>
                </div>
            </div>
            <div id="hourglass-text-main" class="hourglass-caption">Fluyen las arenas del destino...</div>
            <div id="hourglass-text-sub" class="hourglass-subcaption">«La paciencia es virtud de nobles y maestres»</div>
        `;
        document.body.appendChild(div);
        hourglassOverlay = div;
        return div;
    }

    window.mostrarEsperaMedieval = function (mensajePrincipal, mensajeSecundario) {
        const overlay = crearOverlayEspera();
        const main = overlay.querySelector('#hourglass-text-main');
        const sub = overlay.querySelector('#hourglass-text-sub');
        if (main && mensajePrincipal) main.textContent = mensajePrincipal;
        if (sub && mensajeSecundario) sub.textContent = mensajeSecundario;
        overlay.classList.remove('hidden');
    };

    window.ocultarEsperaMedieval = function () {
        if (hourglassOverlay) {
            hourglassOverlay.classList.add('hidden');
        }
    };
})();
