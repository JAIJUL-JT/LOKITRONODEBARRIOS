/*
 * Gestor de consentimiento de cookies de LokiTrono de Barrios.
 * Cumple con el art. 22.2 LSSI-CE y con el RGPD: no se carga analítica ni
 * almacenamiento no esencial antes de un consentimiento informado, granular,
 * previo y revocable (con la misma facilidad para aceptar y rechazar).
 */
(function () {
    'use strict';

    var COOKIE = 'lokitrono_consent';
    var DIAS = 180;
    var VERSION = 1;

    var CATEGORIAS = [
        {
            id: 'necesarias',
            nombre: 'Técnicas o necesarias',
            descripcion: 'Imprescindibles para el funcionamiento del sitio (sesión de la corte, seguridad y preferencias básicas). No requieren consentimiento y no se pueden desactivar.',
            obligatoria: true
        },
        {
            id: 'analiticas',
            nombre: 'Analíticas',
            descripcion: 'Permiten medir de forma agregada cómo se usa el sitio para mejorarlo (por ejemplo, Vercel Web Analytics). Si no las aceptas, no se activará ninguna medición.',
            obligatoria: false
        },
        {
            id: 'marketing',
            nombre: 'Publicidad y marketing',
            descripcion: 'Destinadas a mostrarte contenido promocional o medir campañas. Actualmente no se utiliza ninguna; si no las aceptas, no se activarán.',
            obligatoria: false
        }
    ];

    function leerCookie(nombre) {
        var m = document.cookie.match(new RegExp('(?:^|; )' + nombre.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
        return m ? decodeURIComponent(m[1]) : null;
    }

    function escribirCookie(nombre, valor, dias) {
        var expira = new Date(Date.now() + dias * 864e5).toUTCString();
        document.cookie = nombre + '=' + encodeURIComponent(valor) + '; expires=' + expira + '; path=/; SameSite=Lax' +
            (location.protocol === 'https:' ? '; Secure' : '');
    }

    function leerConsentimiento() {
        var raw = leerCookie(COOKIE);
        if (!raw) {
            try { raw = localStorage.getItem(COOKIE); } catch (e) { raw = null; }
        }
        if (!raw) return null;
        try {
            var c = JSON.parse(raw);
            return (c && c.v === VERSION) ? c : null;
        } catch (e) {
            return null;
        }
    }

    function aplicar(c) {
        if (typeof window.applyConsentToAnalytics === 'function') {
            window.applyConsentToAnalytics(c);
        }
        window.dispatchEvent(new CustomEvent('lokitrono:consent', { detail: c }));
    }

    function guardar(categorias) {
        var prev = leerConsentimiento() || {};
        var c = {
            v: VERSION,
            ts: new Date().toISOString(),
            necessary: true,
            analytics: categorias.analiticas !== undefined
                ? !!categorias.analiticas
                : !!(prev.analytics),
            marketing: categorias.marketing !== undefined
                ? !!categorias.marketing
                : !!(prev.marketing)
        };
        var raw = JSON.stringify(c);
        escribirCookie(COOKIE, raw, DIAS);
        try { localStorage.setItem(COOKIE, raw); } catch (e) { /* almacenamiento no disponible */ }
        aplicar(c);
        ocultarBanner();
        return c;
    }

    var banner = null;

    function construirBanner() {
        if (banner) return banner;

        banner = document.createElement('div');
        banner.id = 'lokitrono-cookie-banner';
        banner.className = 'cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-modal', 'false');
        banner.setAttribute('aria-labelledby', 'cookie-banner-titulo');
        banner.setAttribute('aria-describedby', 'cookie-banner-desc');
        banner.innerHTML = [
            '<div class="cookie-banner__inner">',
            '  <div class="cookie-banner__texto">',
            '    <h2 id="cookie-banner-titulo" class="cookie-banner__titulo">🍪 Cookies y privacidad</h2>',
            '    <p id="cookie-banner-desc">Usamos cookies y almacenamiento técnico necesarios para que funcione la corte. Con tu permiso también usaremos analítica anónima para mejorar el juego. Puedes aceptar, rechazar o configurar tus preferencias. Más información en la <a href="legal/politica-cookies.html" target="_blank" rel="noopener">Política de Cookies</a>.</p>',
            '  </div>',
            '  <div class="cookie-banner__preferencias" hidden>',
            '    <div class="cookie-banner__lista"></div>',
            '  </div>',
            '  <div class="cookie-banner__acciones">',
            '    <button type="button" class="btn-cuervo cookie-banner__config" data-accion="configurar">Configurar</button>',
            '    <button type="button" class="btn-cuervo cookie-banner__rechazar" data-accion="rechazar">Rechazar todas</button>',
            '    <button type="button" class="btn-cuervo cookie-banner__aceptar" data-accion="aceptar">Aceptar todas</button>',
            '    <button type="button" class="btn-cuervo cookie-banner__guardar" data-accion="guardar" hidden>Guardar preferencias</button>',
            '  </div>',
            '</div>'
        ].join('\n');

        var lista = banner.querySelector('.cookie-banner__lista');
        CATEGORIAS.forEach(function (cat) {
            var item = document.createElement('label');
            item.className = 'cookie-banner__item';
            item.innerHTML = [
                '<input type="checkbox" data-cat="' + cat.id + '"' + (cat.obligatoria ? ' checked disabled' : '') + '>',
                '<span><strong>' + cat.nombre + (cat.obligatoria ? ' (siempre activas)' : '') + '</strong><br>' + cat.descripcion + '</span>'
            ].join('');
            lista.appendChild(item);
        });

        banner.addEventListener('click', function (ev) {
            var btn = ev.target.closest('[data-accion]');
            if (!btn) return;
            var accion = btn.getAttribute('data-accion');
            if (accion === 'aceptar') {
                guardar({ analiticas: true, marketing: true });
            } else if (accion === 'rechazar') {
                guardar({ analiticas: false, marketing: false });
            } else if (accion === 'configurar') {
                banner.querySelector('.cookie-banner__preferencias').hidden = false;
                banner.querySelector('[data-accion="guardar"]').hidden = false;
                btn.hidden = true;
            } else if (accion === 'guardar') {
                var analiticas = !!banner.querySelector('[data-cat="analiticas"]').checked;
                var marketing = !!banner.querySelector('[data-cat="marketing"]').checked;
                guardar({ analiticas: analiticas, marketing: marketing });
            }
        });

        document.body.appendChild(banner);
        return banner;
    }

    function mostrarBanner() {
        construirBanner();
        var prev = leerConsentimiento() || {};
        var pref = banner.querySelector('.cookie-banner__preferencias');
        pref.hidden = true;
        banner.querySelector('[data-accion="configurar"]').hidden = false;
        banner.querySelector('[data-accion="guardar"]').hidden = true;
        banner.querySelector('[data-cat="analiticas"]').checked = !!prev.analytics;
        banner.querySelector('[data-cat="marketing"]').checked = !!prev.marketing;
        banner.classList.add('cookie-banner--visible');
        document.documentElement.classList.add('cookie-banner-open');
    }

    function ocultarBanner() {
        if (!banner) return;
        banner.classList.remove('cookie-banner--visible');
        document.documentElement.classList.remove('cookie-banner-open');
    }

    window.LokiConsent = {
        get: leerConsentimiento,
        isAllowed: function (categoria) {
            var c = leerConsentimiento();
            if (!c) return categoria === 'necesarias';
            return !!c[categoria];
        },
        acceptAll: function () { return guardar({ analiticas: true, marketing: true }); },
        rejectAll: function () { return guardar({ analiticas: false, marketing: false }); },
        open: mostrarBanner
    };

    function init() {
        var guardado = leerConsentimiento();
        if (guardado) {
            aplicar(guardado);
        } else {
            mostrarBanner();
        }
        document.addEventListener('click', function (ev) {
            var abre = ev.target.closest('[data-consent-open]');
            if (abre) {
                ev.preventDefault();
                mostrarBanner();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
