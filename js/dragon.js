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


    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', function () {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    function crearOverlayEspera() {
        if (document.getElementById('hourglass-overlay')) {
            hourglassOverlay = document.getElementById('hourglass-overlay');
            return hourglassOverlay;
        }
        const div = document.createElement('div');
        div.id = 'hourglass-overlay';
        div.className = 'hourglass-overlay hidden';
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
