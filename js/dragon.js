/**
 * 🐉 DRAGON CINEMATOGRÁFICO DE LOKITRONO
 * Renderiza y anima un dragón feudal realista en un lienzo Canvas transparente
 * sobrevolando la pantalla con física de vuelo, aleteo orgánico, estela de brasas
 * y sombras proyectadas.
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
    canvas.style.zIndex = '9998'; // Justo bajo modales y alertas, sobre el fondo
    document.body.appendChild(canvas);
// Duplicate canvas for a second dragon with blue tint
const canvasBlue = canvas.cloneNode(true);
canvasBlue.id = 'dragon-canvas-blue';
canvasBlue.style.filter = 'hue-rotate(200deg) saturate(1.5)';
canvasBlue.style.zIndex = '9997'; // behind the red one
document.body.appendChild(canvasBlue);
// Reuse same animation logic for both canvases
const ctxBlue = canvasBlue.getContext('2d');
function drawBoth() {
  // draw original red dragon
  ctx.clearRect(0, 0, width, height);
  drawDragon();
  // draw blue dragon copy
  ctxBlue.clearRect(0, 0, width, height);
  // reuse same draw logic but with blue context
  (function drawDragonBlue(){
    // draw same as drawDragon but on blue context
    // we can call drawDragon but it uses ctx variable; duplicate code minimally
    // For simplicity, re-use the same draw steps with ctxBlue
    ctxBlue.save();
    ctxBlue.translate(dragon.x, dragon.y);
    ctxBlue.scale(dragon.scale, dragon.scale);
    ctxBlue.rotate(dragon.angle);
    const wingFlap = Math.sin(dragon.wingCycle);
    const wingSpan = 75 + wingFlap * 20;
    const wingYOffset = wingFlap * 25;
    // draw wings (same as original)
    function drawWingBlue(side){
      ctxBlue.save();
      ctxBlue.scale(1, side);
      ctxBlue.beginPath();
      ctxBlue.moveTo(-10,0);
      ctxBlue.quadraticCurveTo(5, wingSpan*0.7, 40, wingSpan+wingYOffset);
      ctxBlue.lineTo(45, wingSpan+wingYOffset+8);
      ctxBlue.quadraticCurveTo(15, wingSpan*0.8, -10, wingSpan*0.65);
      ctxBlue.quadraticCurveTo(-30, wingSpan*0.5, -45, wingSpan*0.35);
      ctxBlue.quadraticCurveTo(-50, wingSpan*0.2, -40,5);
      ctxBlue.closePath();
      const wingGrad = ctxBlue.createRadialGradient(0, wingSpan*0.5,5,0,wingSpan*0.5,wingSpan);
      wingGrad.addColorStop(0,'#7f1d1d');
      wingGrad.addColorStop(0.5,'#450a0a');
      wingGrad.addColorStop(1,'#18181b');
      ctxBlue.fillStyle = wingGrad;
      ctxBlue.fill();
      ctxBlue.strokeStyle='#27272a';
      ctxBlue.lineWidth=2.5;
      ctxBlue.beginPath();
      ctxBlue.moveTo(-10,0);
      ctxBlue.lineTo(40, wingSpan+wingYOffset);
      ctxBlue.moveTo(10, wingSpan*0.45);
      ctxBlue.lineTo(-10, wingSpan*0.65);
      ctxBlue.moveTo(5, wingSpan*0.35);
      ctxBlue.lineTo(-45, wingSpan*0.35);
      ctxBlue.stroke();
      ctxBlue.restore();
    }
    drawWingBlue(1);
    drawWingBlue(-1);
    // body placeholder (simple circle)
    ctxBlue.fillStyle = '#1e3a8a'; // blue body
    ctxBlue.beginPath();
    ctxBlue.arc(0,0,30,0,Math.PI*2);
    ctxBlue.fill();
    ctxBlue.restore();
  })();
})();


    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
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
        state: 'flying', // flying, soaring, diving
        spineNodes: [],
        nodeCount: 14
    };

    // Inicializar nodos de la columna vertebral / cola para cinemática inversa
    for (let i = 0; i < dragon.nodeCount; i++) {
        dragon.spineNodes.push({ x: dragon.x, y: dragon.y, angle: 0 });
    }

    // Partículas de brasas que deja el dragón al aletear
    const embers = [];

    function pickNewTarget() {
        const padding = 150;
        dragon.targetX = Math.random() > 0.5 ? width + padding : -padding;
        dragon.targetY = Math.random() * (height * 0.7) + height * 0.1;
        dragon.targetScale = 0.35 + Math.random() * 0.4; // Más pequeño, menos invasivo
        dragon.speed = 1.8 + Math.random() * 1.8;
    }

    pickNewTarget();

    function update() {
        // Movimiento hacia el objetivo
        const dx = dragon.targetX - dragon.x;
        const dy = dragon.targetY - dragon.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 180) {
            pickNewTarget();
        }

        const desiredAngle = Math.atan2(dy, dx);
        // Suavizado del giro para vuelos majestuosos
        let diff = desiredAngle - dragon.angle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        dragon.angle += diff * 0.035;

        // Suavizado de escala (acercarse / alejarse)
        dragon.scale += (dragon.targetScale - dragon.scale) * 0.02;

        // Desplazamiento
        dragon.x += Math.cos(dragon.angle) * dragon.speed;
        dragon.y += Math.sin(dragon.angle) * dragon.speed;

        // Ciclo de aleteo (más rápido si asciende o vuela rápido)
        dragon.wingCycle += 0.08 + dragon.speed * 0.015;

        // Actualizar cinemática de la columna (seguimiento de la cabeza a la cola)
        dragon.spineNodes[0].x = dragon.x;
        dragon.spineNodes[0].y = dragon.y;
        dragon.spineNodes[0].angle = dragon.angle;

        const segLength = 10 * dragon.scale;
        for (let i = 1; i < dragon.nodeCount; i++) {
            const prev = dragon.spineNodes[i - 1];
            const curr = dragon.spineNodes[i];
            const segDx = curr.x - prev.x;
            const segDy = curr.y - prev.y;
            const segDist = Math.hypot(segDx, segDy) || 1;
            curr.x = prev.x + (segDx / segDist) * segLength;
            curr.y = prev.y + (segDy / segDist) * segLength;
            curr.angle = Math.atan2(curr.y - prev.y, curr.x - prev.x);
        }

        // Generar brasas ardientes de dragón
        if (Math.random() < 0.4) {
            embers.push({
                x: dragon.x - Math.cos(dragon.angle) * 30 * dragon.scale + (Math.random() - 0.5) * 15,
                y: dragon.y - Math.sin(dragon.angle) * 30 * dragon.scale + (Math.random() - 0.5) * 15,
                vx: -Math.cos(dragon.angle) * 1.5 + (Math.random() - 0.5),
                vy: -Math.sin(dragon.angle) * 1.5 + Math.random() * 1.2,
                size: (2 + Math.random() * 3) * dragon.scale,
                alpha: 1,
                life: 60 + Math.random() * 30
            });
        }

        // Actualizar brasas
        for (let i = embers.length - 1; i >= 0; i--) {
            const e = embers[i];
            e.x += e.vx;
            e.y += e.vy;
            e.alpha -= 1 / e.life;
            if (e.alpha <= 0) embers.splice(i, 1);
        }
    }

    function drawDragon() {
        ctx.clearRect(0, 0, width, height);

        // 1. Dibujar Brasas Voladoras
        for (const e of embers) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, e.alpha);
            ctx.fillStyle = e.alpha > 0.5 ? '#f59e0b' : '#dc2626';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#fbbf24';
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // 2. Renderizar el Dragón
        ctx.save();
        ctx.translate(dragon.x, dragon.y);
        ctx.scale(dragon.scale, dragon.scale);
        ctx.rotate(dragon.angle);

        const wingFlap = Math.sin(dragon.wingCycle); // -1 (arriba) a 1 (abajo)
        const wingSpan = 75 + wingFlap * 20;
        const wingYOffset = wingFlap * 25;

        // Sombras y resplandor infernal
        ctx.shadowColor = 'rgba(217, 119, 6, 0.4)';
        ctx.shadowBlur = 25;

        // --- ALAS DEL DRAGÓN ---
        function drawWing(side) {
            ctx.save();
            ctx.scale(1, side);
            ctx.beginPath();
            // Articulación del hombro del ala
            ctx.moveTo(-10, 0);
            // Codo del ala
            ctx.quadraticCurveTo(5, wingSpan * 0.7, 40, wingSpan + wingYOffset);
            // Punta de la garra del ala
            ctx.lineTo(45, wingSpan + wingYOffset + 8);
            // Membrana del ala con festones
            ctx.quadraticCurveTo(15, wingSpan * 0.8, -10, wingSpan * 0.65);
            ctx.quadraticCurveTo(-30, wingSpan * 0.5, -45, wingSpan * 0.35);
            ctx.quadraticCurveTo(-50, wingSpan * 0.2, -40, 5);
            ctx.closePath();

            // Relleno de la membrana del ala (piel de reptil oscuro con trasluz carmesí)
            const wingGrad = ctx.createRadialGradient(0, wingSpan * 0.5, 5, 0, wingSpan * 0.5, wingSpan);
            wingGrad.addColorStop(0, '#7f1d1d');
            wingGrad.addColorStop(0.5, '#450a0a');
            wingGrad.addColorStop(1, '#18181b');
            ctx.fillStyle = wingGrad;
            ctx.fill();

            // Huesos/falanges del ala
            ctx.strokeStyle = '#27272a';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(-10, 0);
            ctx.lineTo(40, wingSpan + wingYOffset);
            ctx.moveTo(10, wingSpan * 0.45);
            ctx.lineTo(-10, wingSpan * 0.65);
            ctx.moveTo(5, wingSpan * 0.35);
            ctx.lineTo(-45, wingSpan * 0.35);
            ctx.stroke();

            ctx.restore();
        }

        // Ala izquierda y ala derecha
        drawWing(1);
        drawWing(-1);

        // --- CUERPO Y CABEZA DEL DRAGÓN ---
        // Cuerpo principal (pecho y lomo)
        const bodyGrad = ctx.createLinearGradient(-35, 0, 35, 0);
        bodyGrad.addColorStop(0, '#09090b');
        bodyGrad.addColorStop(0.5, '#27272a');
        bodyGrad.addColorStop(1, '#18181b');

        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, 38, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cuello y Cabeza
        ctx.beginPath();
        ctx.moveTo(25, -6);
        ctx.quadraticCurveTo(45, -4, 58, -2);
        // Hocico
        ctx.lineTo(65, 0);
        ctx.lineTo(58, 4);
        ctx.quadraticCurveTo(45, 6, 25, 6);
        ctx.closePath();
        ctx.fillStyle = '#18181b';
        ctx.fill();

        // Cuernos del Dragón
        ctx.fillStyle = '#d4af37'; // Cuernos de oro oscuro feudal
        ctx.beginPath();
        ctx.moveTo(48, -4);
        ctx.lineTo(38, -14);
        ctx.lineTo(44, -3);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(48, 4);
        ctx.lineTo(38, 14);
        ctx.lineTo(44, 3);
        ctx.fill();

        // Ojos de brasa ardiente
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(52, -3, 2, 0, Math.PI * 2);
        ctx.arc(52, 3, 2, 0, Math.PI * 2);
        ctx.fill();

        // Destello de fuego en las fauces
        if (Math.random() < 0.25) {
            ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(66, 0, 3 + Math.random() * 3, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();

        // --- COLA ARTICULADA CON CINEMÁTICA REALISTA ---
        for (let i = 1; i < dragon.nodeCount; i++) {
            const node = dragon.spineNodes[i];
            const radius = Math.max(2, (dragon.nodeCount - i) * 1.1) * dragon.scale;
            ctx.save();
            ctx.translate(node.x, node.y);
            ctx.rotate(node.angle);

            ctx.fillStyle = i % 2 === 0 ? '#18181b' : '#27272a';
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fill();

            // Espinas dorsales de la cola
            if (i > 3 && i < 14 && i % 2 === 0) {
                ctx.fillStyle = '#b45309';
                ctx.beginPath();
                ctx.moveTo(0, -radius);
                ctx.lineTo(-4 * dragon.scale, -radius - 6 * dragon.scale);
                ctx.lineTo(2 * dragon.scale, -radius);
                ctx.fill();
            }

            // Punta en pica de la cola
            if (i === dragon.nodeCount - 1) {
                ctx.fillStyle = '#b45309';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(-12 * dragon.scale, -7 * dragon.scale);
                ctx.lineTo(-16 * dragon.scale, 0);
                ctx.lineTo(-12 * dragon.scale, 7 * dragon.scale);
                ctx.closePath();
                ctx.fill();
            }

            ctx.restore();
        }
    }

    function animate() {
        update();
        drawDragon();
        requestAnimationFrame(animate);
    }

    // Iniciar animación una vez cargado el DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', animate);
    } else {
        animate();
    }

    // --- ⏳ CONTROL GLOBAL DEL RELOJ DE ARENA DE ESPERA ---
    let hourglassOverlay = null;

    function crearOverlayEspera() {
        if (hourglassOverlay) return hourglassOverlay;
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

