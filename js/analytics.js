/*
 * Carga de analítica respetuosa con el consentimiento (RGPD/LSSI + Consent Mode v2).
 * Nada se inyecta hasta que la persona usuaria acepta la categoría "analíticas".
 */
(function () {
    'use strict';

    var cargado = false;

    function inyectar(src, attrs) {
        if (document.querySelector('script[src="' + src + '"]')) return;
        var s = document.createElement('script');
        s.src = src;
        s.defer = true;
        if (attrs) {
            Object.keys(attrs).forEach(function (k) { s.setAttribute(k, attrs[k]); });
        }
        document.head.appendChild(s);
    }

    function cargarVercel(cfg) {
        if (cfg.vercelAnalytics) {
            inyectar('/_vercel/insights/script.js');
        }
        if (cfg.vercelSpeedInsights) {
            inyectar('/_vercel/speed-insights/script.js');
        }
    }

    function cargarGA4(id) {
        if (!id) return;
        inyectar('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id));
        window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', id, { anonymize_ip: true });
    }

    window.loadAnalytics = function (consentimiento) {
        consentimiento = consentimiento || {};
        if (!consentimiento.analytics || cargado) return;
        cargado = true;
        var cfg = window.__ANALYTICS__ || {};
        cargarVercel(cfg);
        cargarGA4(cfg.ga4MeasurementId);
    };

    window.applyConsentToAnalytics = function (consentimiento) {
        consentimiento = consentimiento || {};
        if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                ad_storage: consentimiento.marketing ? 'granted' : 'denied',
                ad_user_data: consentimiento.marketing ? 'granted' : 'denied',
                ad_personalization: consentimiento.marketing ? 'granted' : 'denied',
                analytics_storage: consentimiento.analytics ? 'granted' : 'denied'
            });
        }
        window.loadAnalytics(consentimiento);
    };
})();
