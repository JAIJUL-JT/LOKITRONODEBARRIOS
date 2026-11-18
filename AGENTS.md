# AGENTS.md

## Estructura

- SPA estática sin build/bundler/framework; contenido en español. Vivo: `index.html`, `css/`, `js/`, `assets/`, `legal/`, `sw.js`, `404.html`, `vercel.json`; datos/infra en `sql/`, `supabase/functions/`, `make/`.
- `js/app.js` (~10.9k líneas) concentra estado, UI y lógica; no hay módulos. `window.__APP_STATE__` solo expone `eventList`.
- `js/supabase.js` es legado (helpers `localStorage`), no el cliente Supabase (viene de jsdelivr en `index.html`). `app.js` redefine `getRepositorioVotos`, `getEstadisticasAdmin` y `haVotadoCasa`; el test solo exige que esas funciones existan en `js/supabase.js`.
- `botxitrono/` (Aritza) y `trivial/` (Trivial del Botxo) son subproyectos estáticos independientes con `package.json` y tests propios; Botxitrono además tiene PWA y `sw.js` propios. Se sirven en `/botxitrono/` y `./trivial/` y se abren en pestañas con iframe (`data-src`). No mezclarlos con la app principal ni entre sí.

## Comandos

- `npm test` → `node tests/test_e2e_reino.js`, desde la raíz (usa `process.cwd()`). Es la verificación principal; CI (`ci.yml`, Node 20) hace `npm ci && npm test` en push/PR a `main`.
- `npm run dev` → `python3 -m http.server 3000`. `npm run build` es no-op; `npm run preview` / `npm run deploy` usan Vercel (login).
- `cd botxitrono && npm test` / `cd trivial && npm test` → `node --test tests/`; ni el test raíz ni CI los ejecutan. Test suelto: `node --test tests/core.test.js` / `node --test tests/trivial-core.test.js` desde cada subproyecto.
- No hay lint/typecheck: usa `node --check <archivo>`. `js/analytics.js` solo inyecta GA/Vercel tras consentimiento y `npm test` no lo valida.
- `sql/schema.sql` es **destructivo** (`DROP TABLE ... CASCADE`); no aplicarlo en producción sin backup. Los cambios van en migraciones nuevas en `sql/migrations/`.
- `bash scripts/apply_schema.sh` (solo schema) y `bash scripts/apply_all.sh` (schema + migraciones en orden) requieren `DATABASE_URL`. Migración suelta: `psql "$POSTGRES_URL_NON_POOLING" -f sql/migrations/<fichero>.sql` (credenciales en `.env.to_push`, ignorado por git). `apply_supabase_schema.yml` es manual y solo aplica `202610030001_secure_superadmin.sql`.
- Las migraciones vivas están en `sql/migrations/`; `supabase/migrations/` solo contiene una migración suelta antigua. No mezcles carpetas.
- Oráculo: `python3 scripts/configurar_oraculo.py` (Supabase CLI + `SUPABASE_ACCESS_TOKEN`; secreto `GROQ_API_KEY` o `ORACULO_API_KEY`). La Edge Function no se despliega con Vercel (`.vercelignore` excluye `supabase/`).

## Gotcha: `npm test` es estático

- `tests/test_e2e_reino.js` no abre navegador ni Supabase: lee archivos y busca cadenas exactas (espacios/saltos incluidos). Reordenar, renombrar o reformatear puede romperlo.
- Archivos vigilados: `index.html`, `js/app.js`, `js/supabase.js`, `sql/schema.sql`, `sql/migrations/202610030002_replace_organizador_with_tronista.sql`; además exige los JSON A-D de `make/`, `.env.example`, `.gitignore` y `README.md`.
- Cadenas frágiles: texto exacto de `puedeGestionarUsuarios` (`superadmin`/`master`), `select: "select('id, phone, name, role, pin_code, barrio_asignado')"`, `CHECK (role IN ('jugador', 'tronista', 'superadmin'))` en el schema y `SET role = 'tronista'\nWHERE role = 'organizador'` en la migración. `index.html` no debe contener `value="organizador"` y el Papiro debe seguir justo tras Inicio en el menú.
- `js/supabase.js` debe conservar `verificarClaveSuperAdmin`, `getRepositorioVotos`, `getEstadisticasAdmin` y `haVotadoCasa`; `js/app.js`, `exportarRepositorioCSV` y `descargarICSEvento`.
- `tests/test_superadmin_voto_unico.js` está vacío.

## Puntos clave

- Config runtime: URL/anon key de Supabase, webhook Make y `ORACULO_ENDPOINT` están hardcodeados en `window.__APP_CONFIG__` dentro de `index.html`; no se usan `VITE_*`, aunque `.env.example` los liste. Para cambiar de proyecto, edita `index.html`.
- Auth: teléfono + PIN de **6 dígitos** mediante RPC `validar_login_lokitrono` (`authorized_users.pin_hash`), no Supabase Auth. `usuarioActual` no guarda PIN, pero `STORAGE_KEYS.usuarios` incluye `pin_code` y cuentas hardcodeadas con PIN `123456`; no lo uses como autorización. No hay rate limiting.
- Roles reales: `master` > `superadmin` > `tronista`/`jugador`. `organizador` se migró a `tronista` (schema base: 3 roles) y `master` lo añade `202610140001_*`. `puedeEditarEventoTronista` solo devuelve true para `superadmin`/`master`, pese al nombre.
- `esRolMaster`/`puedeAdministrar` elevan a master por teléfono/nombre hardcodeados (`605676002`, `663366786`, Julio/Ainhoa). No dupliques esa lógica ni la uses como única autorización.
- Navegación: el botón hamburguesa fijo (`#btn-menu-hamburguesa`) abre `#menu-hamburguesa`, generado desde el `<select id="select-seccion-corte">` oculto; conserva los `value`/`data-tab`, los IDs de opciones y `onchange="cambiarPestana(this.value)"` para no romper `cambiarPestana`, `PESTANAS_ADMIN` ni el test estático.
- Realtime: `supabase_realtime` cubre `casas`, `eventos`, `votos_evento` (`iniciarRealtimeLokitrono`, debounce 1,2 s). `authorized_users` no se publica; se refresca cada 25 s con `listar_usuarios_por_token(p_token)` (`refrescarUsuariosPorToken`).
- Eventos: ventana de votación `[fecha+hora_inicio_votacion, (fecha_fin_votacion||fecha)+hora_fin_votacion]`; fin de evento `[(fecha_fin||fecha)+(hora_fin||hora)]` (migración `202610170001_*`). Defaults 20:30/23:30.
- Ranking Códice: `0.50 Festín + 0.20 Caminos + 0.30 Espíritu`, K=3.0, en `calcular_ranking()` y `calcularMediaPonderada` (`js/supabase.js`). `README.md` y la simulación de `tests/test_e2e_reino.js` usan 0.25/0.25: están obsoletos. `Forastero` no compite.
- El Papiro del Norte: lectura pública en `#pestana-blog` (Menú de Maestres, tras Inicio) y editor en `#pestana-blog-editor` (Administración, `PESTANAS_ADMIN`). Tabla `blog_posts` (`202611130001_*`, `202611130002_*`) con SELECT público por RLS y escritura solo por RPC `guardar_blog_post_admin`/`eliminar_blog_post_admin` (token + rol master/superadmin). Categorías: `cronica`, `anuncio`, `bando`, `evento`, `entrevista`, `receta`, `otro`; el editor incluye el Oráculo «Generador de Crónicas del Reino». `imagen_url` y el bucket `eventos-media` los añade `202611150001_*`. Copia local en `localStorage` (`lokitrono_blog_posts`) como respaldo.
- Buzón de Sugerencias y recuperación de PIN: tablas `buzon_sugerencias` y `solicitudes_pin` (`202611180002_*`), RPC `registrar_sugerencia_reino`/`registrar_solicitud_pin_reino` (acceso anon autorizado). El envío usa webhook Make con fallback en `localStorage` (`lokitrono_sugerencias_enviadas`); la URL activa del webhook vive en `configuracion_reino` (`202611160001_*`).
- RLS activo en `authorized_users`, `casas`, `maestres`, `juicios`, `codigos_diarios`, `configuracion_reino`, tablas de organizaciones (`202611180001_*`, sin acceso directo anon/authenticated) y las del buzón; escrituras directas revocadas y RPC `SECURITY DEFINER`. `is_superadmin()` incluye `superadmin` y `master`. No toques RLS/auth sin revisar las migraciones.
- Oráculo: Edge Function Deno `supabase/functions/oraculo`; proxy OpenAI-compatible, por defecto Groq `openai/gpt-oss-120b`. El cliente llama a `ORACULO_ENDPOINT` o `${SUPABASE_URL}/functions/v1/oraculo`; si falla, `llamarModeloOraculo` usa una crónica local. La clave nunca va al navegador.
- PWA: la app principal registra `sw.js` (cache `lokitrono-app-v*`, app shell offline); el SW ignora `/botxitrono/` y `/trivial/`. Sube `CACHE_VERSION` al cambiar el shell.
- Cache busting: `index.html` versiona CSS/JS con `?v=`; al editar esos archivos, actualiza la query y `CACHE_VERSION` en `sw.js`.
- CSP/headers: `vercel.json` aplica CSP/HSTS a todo el sitio. Dependencias de CDN (Supabase JS, Chart.js, Leaflet, fuentes, GA) se cargan en `index.html`; si añades otras, actualiza `Content-Security-Policy` (ya permite jsdelivr, Supabase, GA, Vercel Insights y `worker-src 'self' blob:`).
- Deploy: push a `main` despliega en Vercel (workflow con IDs fijos); `vercel.json` sirve la raíz (`outputDirectory: "."`). `.vercelignore` excluye `tests/`, `scripts/`, `sql/`, `supabase/`, `*.py`, `.env*`; `botxitrono/` y `trivial/` sí se publican.
- Ruido: `backups/`, `no-usados/`, `*.zip`, `*.pptx`, `q*.png` en raíz, `Captura de pantalla*.png`, `.qwen/`. `botxitrono/` y `trivial/` **no** son ruido.
- Respeta `.github/agents/mantenimiento-web-bilbao.agent.md` (cambios mínimos, no migrar framework, no exponer secretos).
