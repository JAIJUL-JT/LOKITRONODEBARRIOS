# BotxoTetrix 🧱

**El Tetris medieval de Bilbao.** Piezas = Casas Feudales, murallas de sillería y paisajes del Botxo nivel a nivel. Subproyecto estático de [LokiTrono de Barrios](../), en consonancia con **Botxitrono** y **El Trivial del Botxo**.

## Cómo jugar

| Control | Acción |
|---|---|
| `←` `→` | Mover pieza |
| `↑` / `X` / `Z` | Rotar (con wall-kick) |
| `↓` | Bajar rápido |
| `Espacio` | Caída dura |
| `Esc` / `P` | Pausa |

En móvil: botones táctiles inferiores.

- **7 piezas** = 7 Casas: Uribarri 🦅, Indautxu 🍷, Casco Viejo 🏰, Deusto ⚓, Santutxu 🛡️, Abando 👑, San Mamés 🦁.
- **Puntos**: 100/300/500/800 × nivel por 1/2/3/4 líneas.
- **Nivel** +1 cada 10 líneas (más rápido). Cada nivel cambia el **escenario de Bilbao** (La Salve, Guggenheim, Siete Calles… hasta las Murallas del Reino).

## Estructura

```
botxotetrix/
├── index.html          # Shell: canvas, HUD, overlays
├── css/style.css       # Paleta LokiTrono (oro/piedra) + Cinzel
├── js/
│   ├── core.js         # Lógica pura (testeable, sin DOM)
│   ├── render.js       # Canvas: tablero, piezas, escenas Bilbao
│   ├── main.js         # Bucle, estados, controles, SW
│   ├── audio.js        # WebAudio sintetizado
│   └── scores.js       # Supabase + fallback localStorage
├── sql/botxotetrix_scores.sql
└── tests/core.test.js  # node:test
```

Sin build ni dependencias. ES modules.

## Tests

```bash
cd botxotetrix && npm test
```

## Puntuaciones (Supabase)

1. Aplicar la migración manualmente (no se despliega con Vercel; `sql/` va en `.vercelignore`):

```bash
psql "$POSTGRES_URL_NON_POOLING" -f sql/botxotetrix_scores.sql
```

2. Tabla `botxotetrix_scores` con RLS lectura/insert públicos + publicación `supabase_realtime`.
3. Fallback: `localStorage` (`botxotetrix_local_scores_v1`) si falla la red.

## PWA

`sw.js` + `manifest.webmanifest`. Sube `CACHE` en `sw.js` al cambiar el shell.

## Integración en la app principal

- Tarjeta en **Extras → MINI-JUEGOS** (`index.html` raíz).
- Pestaña `#pestana-botxotetrix` con iframe lazy (`data-src="./botxotetrix/"`).
- Pasaporte: **4 sellos** (como Botxitrono/Trivial).
- El `sw.js` raíz excluye `/botxotetrix/` para no interferir.

## Servidor local

```bash
cd botxotetrix && npm run dev
# → http://localhost:3000/
```
