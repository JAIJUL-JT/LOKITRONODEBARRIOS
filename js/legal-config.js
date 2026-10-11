/*
 * Configuración legal y de analítica de LokiTrono de Barrios.
 * Fuente única de verdad para datos del titular, versión de los textos legales
 * y preferencias de analítica (cargada siempre tras consentimiento).
 */
(function () {
    'use strict';

    window.LOKI_LEGAL = {
        titular: 'Julio Arteaga',
        nif: '30658217-E',
        direccion: 'Soka, 8',
        email: 'afjbilbao@gmail.com',
        sitio: 'https://lokitronodebarrios.vercel.app',
        fechaActualizacion: '11 de octubre de 2026',
        version: '1.0'
    };

    /*
     * Analítica. Por defecto solo se activa Vercel Web Analytics (sin cookies y
     * alojada en el primer origen). GA4 queda desactivada salvo que se rellene
     * ga4MeasurementId con un ID real (G-XXXXXXX). Nada se carga hasta que la
     * persona usuaria acepta la categoría "analíticas".
     */
    window.__ANALYTICS__ = window.__ANALYTICS__ || {
        vercelAnalytics: true,
        vercelSpeedInsights: false,
        ga4MeasurementId: ''
    };

    /* Consent Mode v2 de Google: por defecto todo denegado salvo lo estrictamente necesario. */
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted',
        wait_for_update: 500
    });
    window.gtag('set', 'ads_data_redaction', true);
    window.gtag('set', 'url_passthrough', false);
})();
