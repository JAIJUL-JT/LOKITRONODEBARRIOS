/**
 * 🐉 DRAGON CINEMATOGRÁFICO DE LOKITRONO
 * Renderiza y anima dos dragones (rojo + azul) con física de vuelo,
 * aleteo orgánico, estela de brasas y bocanadas de fuego.
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

    const canvasBlue = canvas.cloneNode(false);
    canvasBlue.id = 'dragon-canvas-blue';
    canvasBlue.style.filter = 'hue-rotate(200deg) saturate(1.6) brightness(1.1)';
    canvasBlue.style.zIndex = '9997';
    canvasBlue.style.pointerEvents = 'none';
    document.body.appendChild(canvasBlue);

    const ctx = canvas.getContext('2d');
    const ctxBlue = canvasBlue.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    canvasBlue.width = width;
    canvasBlue.height = height;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        canvasBlue.width = width;
        canvasBlue.height = height;
    });

    // Estado del Dragón
    const dragon = {
        x: -200,
        y: height * 0.3,
        targetX: width + 200,
        targetY: height * 0.4,
        speed: 2.2,
        angle: 0,
        wingCycle: 0,
        scale: 0.55,
        targetScale: 0.55,
        alpha: 0.9,
        state: 'flying',
        spineNodes: [],
        nodeCount: 14,
        fireTimer: 0,
        fireInterval: 180
    };

    for (let i = 0; i < dragon.nodeCount; i++) {
        dragon.spineNodes.push({ x: dragon.x, y: dragon.y, angle: 0 });
    }

    const embers = [];
    const fireParticles = [];

    function createEmber() {
        if (Math.random() > 0.4) return;
        embers.push({
            x: dragon.x - Math.cos(dragon.angle) * 40,
            y: dragon.y - Math.sin(dragon.angle) * 10,
            vx: -Math.cos(dragon.angle) * 1.5 - (Math.random() - 0.5) * 0.8,
            vy: -Math.sin(dragon.angle) * 0.8 + (Math.random() - 0.5) * 0.6,
            life: 1.0,
            decay: 0.015 + Math.random() * 0.01,
            size: 1 + Math.random() * 2
        });
    }

    function createFireBreath() {
        const mouthX = dragon.x + Math.cos(dragon.angle) * 52;
        const mouthY = dragon.y + Math.sin(dragon.angle) * 3;
        for (let i = 0; i < 8; i++) {
            fireParticles.push({
                x: mouthX,
                y: mouthY,
                vx: Math.cos(dragon.angle + (Math.random() - 0.5) * 0.4) * (4 + Math.random() * 3),
                vy: Math.sin(dragon.angle + (Math.random() - 0.5) * 0.4) * (2 + Math.random() * 2) + (Math.random() - 0.5) * 1.5,
                life: 1.0,
                decay: 0.02 + Math.random() * 0.015,
                size: 3 + Math.random() * 4,
                hue: Math.random() < 0.3 ? 45 : 15
            });
        }
    }

    function updateDragon() {
        dragon.wingCycle += 0.16;
        dragon.fireTimer++;

        if (dragon.fireTimer > dragon.fireInterval) {
            dragon.fireTimer = 0;
            dragon.fireInterval = 120 + Math.random() * 200;
            if (Math.random() < 0.6) {
                createFireBreath();
            }
        }

        if (dragon.x > width + 250) {
            dragon.x = -250;
            dragon.y = height * (0.2 + Math.random() * 0.4);
            dragon.targetY = height * (0.25 + Math.random() * 0.5);
            dragon.speed = 1.8 + Math.random() * 0.8;
        }

        const dx = dragon.targetX - dragon.x;
        const dy = dragon.targetY - dragon.y;
        dragon.angle = Math.atan2(dy, dx);

        dragon.x += Math.cos(dragon.angle) * dragon.speed;
        dragon.y += Math.sin(dragon.angle) * dragon.speed;

        dragon.targetY += Math.sin(Date.now() * 0.0008) * 0.3;
        dragon.targetX += Math.cos(Date.now() * 0.0005) * 0.2;

        createEmber();

        for (let i = embers.length - 1; i >= 0; i--) {
            const e = embers[i];
            e.x += e.vx;
            e.y += e.vy;
            e.vy -= 0.01;
            e.life -= e.decay;
            if (e.life <= 0) embers.splice(i, 1);
        }

        for (let i = fireParticles.length - 1; i >= 0; i--) {
            const f = fireParticles[i];
            f.x += f.vx;
            f.y += f.vy;
            f.vx *= 0.95;
            f.vy *= 0.95;
            f.life -= f.decay;
            if (f.life <= 0) fireParticles.splice(i, 1);
        }

        dragon.spineNodes[0].x = dragon.x;
        dragon.spineNodes[0].y = dragon.y;
        dragon.spineNodes[0].angle = dragon.angle;

        for (let i = 1; i < dragon.spineNodes.length; i++) {
            const prev = dragon.spineNodes[i - 1];
            const node = dragon.spineNodes[i];
            const dxn = prev.x - node.x;
            const dyn = prev.y - node.y;
            const dist = Math.sqrt(dxn * dxn + dyn * dyn) || 1;
            const followDist = 8 - i * 0.3;
            node.x = prev.x - (dxn / dist) * followDist;
            node.y = prev.y - (dyn / dist) * followDist;
            node.angle = Math.atan2(dyn, dxn);
        }
    }

    function drawDragonOn(context) {
        context.save();
        context.globalAlpha = dragon.alpha;

        // Estela de brasas
        for (let i = 0; i < embers.length; i++) {
            const e = embers[i];
            context.save();
            context.globalAlpha = e.life * 0.6;
            const grad = context.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.size * 2);
            grad.addColorStop(0, 'rgba(255, 200, 100, 0.8)');
            grad.addColorStop(0.5, 'rgba(239, 68, 68, 0.4)');
            grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
            context.fillStyle = grad;
            context.beginPath();
            context.arc(e.x, e.y, e.size, 0, Math.PI * 2);
            context.fill();
            context.restore();
        }

        context.translate(dragon.x, dragon.y);
        context.scale(dragon.scale, dragon.scale);
        context.rotate(dragon.angle);

        const wingFlap = Math.sin(dragon.wingCycle);
        const wingSpan = 75 + wingFlap * 20;
        const wingYOffset = wingFlap * 25;

        function drawWing(side) {
            context.save();
            context.scale(1, side);
            context.beginPath();
            context.moveTo(-10, 0);
            context.quadraticCurveTo(5, wingSpan * 0.7, 40, wingSpan + wingYOffset);
            context.lineTo(45, wingSpan + wingYOffset + 8);
            context.quadraticCurveTo(15, wingSpan * 0.8, -10, wingSpan * 0.65);
            context.quadraticCurveTo(-30, wingSpan * 0.5, -45, wingSpan * 0.35);
            context.quadraticCurveTo(-50, wingSpan * 0.2, -40, 5);
            context.closePath();
            const wingGrad = context.createRadialGradient(0, wingSpan * 0.5, 5, 0, wingSpan * 0.5, wingSpan);
            wingGrad.addColorStop(0, '#dc2626');
            wingGrad.addColorStop(0.5, '#991b1b');
            wingGrad.addColorStop(1, '#450a0a');
            context.fillStyle = wingGrad;
            context.fill();
            context.strokeStyle = '#7f1d1d';
            context.lineWidth = 2.5;
            context.beginPath();
            context.moveTo(-10, 0);
            context.lineTo(40, wingSpan + wingYOffset);
            context.moveTo(10, wingSpan * 0.45);
            context.lineTo(-10, wingSpan * 0.65);
            context.moveTo(5, wingSpan * 0.35);
            context.lineTo(-45, wingSpan * 0.35);
            context.stroke();
            context.restore();
        }

        drawWing(1);
        drawWing(-1);

        // Cuerpo
        const bodyGrad = context.createLinearGradient(-30, -20, 40, 20);
        bodyGrad.addColorStop(0, '#b91c1c');
        bodyGrad.addColorStop(0.6, '#991b1b');
        bodyGrad.addColorStop(1, '#7f1d1d');
        context.fillStyle = bodyGrad;
        context.beginPath();
        context.ellipse(0, 0, 38, 16, 0, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = '#450a0a';
        context.lineWidth = 2;
        context.stroke();

        // Cuello y cabeza
        context.save();
        context.translate(35, 0);
        context.rotate(wingFlap * 0.08);
        const headGrad = context.createRadialGradient(8, -2, 2, 12, 0, 14);
        headGrad.addColorStop(0, '#dc2626');
        headGrad.addColorStop(1, '#991b1b');
        context.fillStyle = headGrad;
        context.beginPath();
        context.ellipse(12, 0, 16, 12, 0, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = '#450a0a';
        context.lineWidth = 2;
        context.stroke();

        // Cuernos
        context.fillStyle = '#a16207';
        context.beginPath();
        context.moveTo(8, -10);
        context.lineTo(12, -18);
        context.lineTo(16, -10);
        context.closePath();
        context.fill();
        context.beginPath();
        context.moveTo(14, -8);
        context.lineTo(18, -16);
        context.lineTo(22, -8);
        context.closePath();
        context.fill();

        // Ojos
        context.fillStyle = '#fbbf24';
        context.beginPath();
        context.arc(18, -4, 3, 0, Math.PI * 2);
        context.arc(18, 4, 3, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = '#000';
        context.beginPath();
        context.arc(19, -4, 1.2, 0, Math.PI * 2);
        context.arc(19, 4, 1.2, 0, Math.PI * 2);
        context.fill();

        // Narices
        context.fillStyle = '#450a0a';
        context.beginPath();
        context.arc(26, -2, 1.5, 0, Math.PI * 2);
        context.arc(26, 2, 1.5, 0, Math.PI * 2);
        context.fill();

        // Destello de fuego en las fauces
        if (Math.random() < 0.25) {
            context.fillStyle = 'rgba(239, 68, 68, 0.85)';
            context.shadowColor = '#ef4444';
            context.shadowBlur = 12;
            context.beginPath();
            context.arc(28, 0, 2.5, 0, Math.PI * 2);
            context.fill();
            context.shadowBlur = 0;
        }

        context.restore();
        context.restore();

        // Boca
        context.save();
        context.translate(dragon.x + Math.cos(dragon.angle) * 45, dragon.y + Math.sin(dragon.angle) * 2);
        context.rotate(dragon.angle);
        context.fillStyle = 'rgba(69, 10, 10, 0.9)';
        context.beginPath();
        context.ellipse(0, 0, 6, 3, 0, 0, Math.PI * 2);
        context.fill();
        context.restore();

        // Partículas de fuego
        for (let i = 0; i < fireParticles.length; i++) {
            const f = fireParticles[i];
            context.save();
            context.globalAlpha = f.life * 0.8;
            const gradF = context.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size);
            if (f.hue === 45) {
                gradF.addColorStop(0, 'rgba(251, 191, 36, 0.9)');
                gradF.addColorStop(0.5, 'rgba(239, 68, 68, 0.6)');
                gradF.addColorStop(1, 'rgba(239, 68, 68, 0)');
            } else {
                gradF.addColorStop(0, 'rgba(252, 165, 165, 0.9)');
                gradF.addColorStop(0.5, 'rgba(220, 38, 38, 0.6)');
                gradF.addColorStop(1, 'rgba(153, 27, 27, 0)');
            }
            context.fillStyle = gradF;
            context.beginPath();
            context.arc(f.x, f.y, f.size * f.life, 0, Math.PI * 2);
            context.fill();
            context.restore();
        }

        context.restore();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctxBlue.clearRect(0, 0, width, height);

        updateDragon();
        drawDragonOn(ctx);
        drawDragonOn(ctxBlue);

        requestAnimationFrame(animate);
    }

    document.addEventListener('DOMContentLoaded', animate);
    animate();

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
