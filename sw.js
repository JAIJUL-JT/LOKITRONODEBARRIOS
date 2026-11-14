/*
 * Service worker de LokiTrono de Barrios.
 * Cachea el app shell para que la aplicación pueda abrirse sin conexión.
 * Sube CACHE_VERSION cuando cambies cualquiera de los archivos del shell.
 */
const CACHE_VERSION = 'lokitrono-app-v6';
const CACHE_PREFIX = 'lokitrono-app-';
const APP_SHELL = [
    './',
    './index.html',
    './manifest.webmanifest',
    './css/style.css',
    './css/app-bar.css',
    './css/medieval-theme.css',
    './css/legal.css',
    './js/legal-config.js',
    './js/analytics.js',
    './js/consent.js',
    './js/app.js',
    './js/supabase.js',
    './js/dragon.js',
    './loki-logo.jpeg',
    './juego-de-barrios-logo-192.png',
    './juego-de-barrios-logo-512.png',
    './favicon.ico'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys
                    .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_VERSION)
                    .map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;
    if (url.pathname.startsWith('/botxitrono/')) return;
    if (url.pathname.startsWith('/trivial/')) return;
    if (url.pathname.startsWith('/_vercel/')) return;

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response && response.ok) {
                        const copy = response.clone();
                        caches.open(CACHE_VERSION)
                            .then((cache) => cache.put('./index.html', copy))
                            .catch(() => {});
                    }
                    return response;
                })
                .catch(() => caches.match('./index.html').then((cached) => cached || new Response(
                    '<!doctype html><html lang="es"><meta charset="utf-8"><title>Sin conexión</title>' +
                    '<body style="font-family:sans-serif;background:#050505;color:#fef08a;text-align:center;padding:40px">' +
                    '<h1>Sin conexión</h1><p>No se pudo cargar LokiTrono de Barrios. ' +
                    'Vuelve a intentarlo cuando recuperes la conexión.</p></body></html>',
                    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
                )))
        );
        return;
    }

    event.respondWith(
        caches.match(request, { ignoreSearch: true }).then((cached) => {
            if (cached) return cached;
            return fetch(request).then((response) => {
                if (response && response.ok && response.type === 'basic') {
                    const copy = response.clone();
                    caches.open(CACHE_VERSION)
                        .then((cache) => cache.put(request, copy))
                        .catch(() => {});
                }
                return response;
            });
        })
    );
});
