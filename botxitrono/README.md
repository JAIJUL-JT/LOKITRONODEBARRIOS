# Aritza: Heroína del Reino

Plataformas laterales de estética medieval inspiradas en los clásicos de Mario,
protagonizadas por **Aritza**, una heroína que cruza reinos de bosques, murallas,
ocasos y cumbres nevadas. Corre, salta, aplasta trasgos y murciélagos, recoge
monedas y llega al castillo para superar cada nivel.

Proyecto independiente: HTML5 Canvas + JavaScript vanilla (ES modules), sin build,
sin framework, sin backend y sin conexión a Supabase. El progreso se guarda en
`localStorage`.

## Cómo jugar

- **Moverse:** flechas `←` `→`, teclas `A` / `D` o los botones en pantalla.
- **Saltar:** `Espacio`, `↑`, `W` o el botón **SALTAR**. Mantén pulsado para saltar
  más alto.
- **Enemigos:** cae sobre trasgos y murciélagos para aplastarlos. Si te tocan de
  lado, pierdes un corazón.
- **Monedas:** cada moneda de oro suma 10 puntos.
- **Meta:** llega al castillo al final del nivel. Cada nivel superado sube la
  dificultad y te devuelve un corazón (máximo 3).
- **Pausa:** botón ⏸, `Esc` o `P`. Se pausa sola al cambiar de pestaña.
- **Música:** melodía medieval sintetizada en tiempo real (laúd, zumbido y
  tambor). El botón 🔊 silencia a la vez música y efectos.

## Comandos

```bash
npm test    # tests de lógica con node --test
npm run dev # servidor local en http://localhost:3000
```

No hay paso de build: `npm run build` es un no-op informativo. Para desplegar,
sirve la carpeta como sitio estático (Vercel, GitHub Pages, Netlify...).

> **Service worker:** al desplegar cambios en JS/CSS, sube la versión de `CACHE`
> en `sw.js` (por ejemplo de `aritza-reino-v3` a `aritza-reino-v4`). Si no, los
> navegadores que ya instalaron el juego pueden seguir usando los archivos
> cacheados.

## Estructura

```text
lokitrono-runner/
├── index.html            # App shell: canvas + HUD + overlays
├── css/style.css         # Estilos medievales, HUD y paneles
├── js/
│   ├── core.js           # Lógica pura: física, niveles, enemigos, colisiones
│   ├── render.js         # Canvas: heroína, paisaje medieval, castillos, monedas
│   ├── storage.js        # Perfil y récords en localStorage
│   ├── audio.js          # Efectos y música medieval con WebAudio (sin ficheros)
│   └── main.js           # Bucle, estados, controles táctil/teclado, PWA
├── tests/core.test.js    # Tests de la lógica pura
├── manifest.webmanifest  # PWA instalable
├── sw.js                 # Service worker: app shell offline
└── icon.svg
```

## Diseño técnico

- **Resolución lógica:** altura fija de 800 unidades; la anchura se adapta a la
  pantalla. Se escala con `devicePixelRatio` (máximo 2).
- **Mundo lateral:** los niveles se generan de forma determinista con un `rng`
  inyectable. La cámara sigue a la heroína horizontalmente.
- **Física:** aceleración y rozamiento, salto con *coyote time*, *jump buffer* y
  altura variable según se mantenga el botón.
- **Colisiones:** AABB por ejes contra plataformas sólidas; los enemigos se
  aplastan cayendo sobre ellos desde arriba.
- **Lógica separada del DOM:** `core.js` no toca el DOM ni el canvas, por lo que
  se puede probar con Node.
- **Accesibilidad:** controles por teclado, pausa automática al ocultar la
  pestaña y respeto a `prefers-reduced-motion`.
- **Privacidad:** no hay red, ni cuentas, ni datos personales. Solo se guardan
  récords locales.

## Ajustar dificultad

En `js/core.js`:

- `PLAYER.gravity`, `PLAYER.jumpVelocity`, `PLAYER.maxSpeed`: sensación de salto
  y velocidad.
- `PLAYER.maxHearts`, `PLAYER.invulnerableTime`: margen de error.
- `ENEMY_DEFS`: tamaño, velocidad y puntos de cada enemigo.
- `createLevel`: longitud, huecos, repisas, monedas y densidad de enemigos.
- `nextLevel`: bonus por nivel y curación entre niveles.

## Fuera de alcance (MVP)

Ranking global, login, multijugador, monetización, guardado en la nube y
empaquetado para tiendas.
