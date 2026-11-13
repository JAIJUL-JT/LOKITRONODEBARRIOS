# AGENTS.md

## Estructura

- SPA estática sin build/bundler/framework. Código vivo: `index.html`, `css/`, `js/`, `sql/`, `scripts/`, `supabase/functions/`, `make/`. Contenido en español.
- `js/app.js` (~428 KB, ~9.7k líneas) concentra estado, UI y lógica; no hay módulos. `window.__APP_STATE__` solo expone `eventList`.
- `js/supabase.js` es legado (helpers `localStorage`), no el cliente Supabase. `app.js` redefine `getRepositorioVotos`, `getEstadisticasAdmin` y `haVotadoCasa`; el test solo exige que esas funciones existan en `js/supabase.js`.
- `botxitrono/` es un subproyecto independiente (Aritza, plataformas medievales) con su propio `package.json`, tests, `manifest.webmanifest` y `sw.js`. Se sirve en `/botxitrono/` y se abre desde un iframe/modal en `index.html`. No lo mezcles con la app principal.
- `trivial/` es el antiguo Trivial del Botxo, ahora separado de Botxitrono: subproyecto estático propio con su `package.json`, tests y datos. Se embebe en la pestaña `#pestana-trivial` del Menú de Maestres (`./trivial/`). No vuelvas a meterlo en Botxitrono.

## Comandos

- `npm test` — `node tests/test_e2e_reino.js`; ejecútalo desde la raíz (usa `process.cwd()`). Es la verificación principal.
- `npm run dev` — `python3 -m http.server 3000`.
- `npm run preview` / `npm run deploy` — Vercel (login). `npm run build` es no-op.
- `cd botxitrono && npm test` — tests de lógica con `node --test`. El `npm test` raíz y CI no los ejecutan.
- `cd trivial && npm test` — tests de lógica del Trivial con `node --test`. Tampoco los ejecuta el `npm test` raíz.
- No hay lint/typecheck. Para sintaxis: `node --check <archivo>`. `js/analytics.js` (se carga antes de `app.js`, tras consentimiento) ya no tiene el bloque `cargarVercel` duplicado, pero `npm test` no lo valida.
- `sql/schema.sql` es **destructivo** (`DROP TABLE ... CASCADE`); no lo apliques a producción sin backup. Para cambios crea una migración nueva en `sql/migrations/`.
- `bash scripts/apply_schema.sh` aplica solo el schema; `bash scripts/apply_all.sh` aplica schema + todas las migraciones; ambos requieren `DATABASE_URL`. Migración suelta: `psql "$POSTGRES_URL_NON_POOLING" -f sql/migrations/<fichero>.sql` (credenciales en `.env.to_push`, ignorado por git). El workflow `apply_supabase_schema.yml` es manual y solo aplica `202610030001_secure_superadmin.sql`.
- Las migraciones del proyecto viven en `sql/migrations/`; `supabase/migrations/` solo contiene una migración suelta antigua. No mezcles carpetas.
- Oráculo: `python3 scripts/configurar_oraculo.py` (Supabase CLI + `SUPABASE_ACCESS_TOKEN`; secreto `GROQ_API_KEY` o `ORACULO_API_KEY`). La Edge Function no se despliega con Vercel (`.vercelignore` excluye `supabase/`).

## Gotcha: `npm test` es estático

- `tests/test_e2e_reino.js` no abre navegador ni Supabase: lee archivos y busca cadenas exactas (espacios/saltos incluidos). Reordenar, renombrar o reformatear puede romperlo.
- Archivos vigilados: `index.html`, `js/app.js`, `js/supabase.js`, `sql/schema.sql`, `sql/migrations/202610030002_replace_organizador_with_tronista.sql`; además exige que existan los JSON A-D de `make/`, `.env.example`, `.gitignore` y `README.md`.
- Cadenas frágiles: texto exacto de `puedeGestionarUsuarios` (`superadmin`/`master`), `select: "select('id, phone, name, role, pin_code, barrio_asignado')"`, `CHECK (role IN ('jugador', 'tronista', 'superadmin'))` en el schema y `SET role = 'tronista'\nWHERE role = 'organizador'` en la migración. `index.html` no debe contener `value="organizador"`.
- `js/supabase.js` debe conservar `verificarClaveSuperAdmin`, `getRepositorioVotos`, `getEstadisticasAdmin` y `haVotadoCasa`; `js/app.js`, `exportarRepositorioCSV` y `descargarICSEvento`.
- `tests/test_superadmin_voto_unico.js` está vacío.

## Puntos clave

- Config runtime: URL/anon key de Supabase y webhook Make están hardcodeados en el `<script>` de `index.html` (`window.__APP_CONFIG__`); no se usan `VITE_*`. Para cambiar de proyecto, edita `index.html`.
- Auth: teléfono + PIN de **6 dígitos** mediante RPC `validar_login_lokitrono` (`authorized_users.pin_hash`). No es Supabase Auth. La sesión (`usuarioActual`) no guarda PIN, pero el listado local de respaldo (`STORAGE_KEYS.usuarios`) incluye `pin_code` y cuentas hardcodeadas con PIN `123456`; no lo uses como autorización. La administración puede verlo/restablecerlo por RPC. No hay rate limiting: no lo consideres listo para producción.
- Roles reales: `master` (Administración) > `superadmin` > `tronista`/`jugador`. `organizador` se migró a `tronista`; el schema base solo declara 3 roles y `202610140001_rol_master_y_bienvenida.sql` añade `master`. `puedeEditarEventoTronista` solo devuelve true para `superadmin`/`master`, pese al nombre.
- `esRolMaster`/`puedeAdministrar` elevan a master por teléfono/nombre hardcodeados (`605676002`, `663366786`, Julio/Ainhoa). No dupliques esa lógica ni la uses como única autorización.
- Navegación: el botón hamburguesa fijo (`#btn-menu-hamburguesa`) abre `#menu-hamburguesa`, generado desde el `<select id="select-seccion-corte">` oculto; conserva los `value`/`data-tab`, los IDs de opciones y `onchange="cambiarPestana(this.value)"` para no romper `cambiarPestana`, `PESTANAS_ADMIN` ni el test estático.
- Realtime: `supabase_realtime` cubre `casas`, `eventos`, `votos_evento` (`iniciarRealtimeLokitrono`, debounce 1,2 s). `authorized_users` no se publica; se refresca cada 25 s con `listar_usuarios_por_token(p_token)` (`refrescarUsuariosPorToken`).
- Eventos: ventana de votación `[fecha+hora_inicio_votacion, (fecha_fin_votacion||fecha)+hora_fin_votacion]`; fin de evento `[(fecha_fin||fecha)+(hora_fin||hora)]` (migración `202610170001_*`). Defaults 20:30/23:30.
- Ranking Códice: `0.50 Festín + 0.20 Caminos + 0.30 Espíritu`, K=3.0, en `calcular_ranking()` y `calcularMediaPonderada` (`js/supabase.js`). `README.md` y la simulación de `tests/test_e2e_reino.js` usan 0.25/0.25: están obsoletos. `Forastero` no compite.
- El Papiro del Norte: lectura pública en `#pestana-blog` (Menú de Maestres, justo tras Inicio, visible para todos los roles) y editor en `#pestana-blog-editor` (Administración, `PESTANAS_ADMIN`). Tabla `blog_posts` (migraciones `202611130001_blog_del_reino.sql` y `202611130002_papiro_del_norte_categorias.sql`) con SELECT público por RLS y escritura solo por RPC `guardar_blog_post_admin`/`eliminar_blog_post_admin` (token + rol master/superadmin). Las crónicas llevan `categoria` (`cronica`, `anuncio`, `bando`, `evento`, `entrevista`, `receta`, `otro`) y el editor incluye el Oráculo Imperial «Generador de Crónicas del Reino» (`generarCronicaOraculoEditor`). `js/app.js` mantiene copia en `localStorage` (`lokitrono_blog_posts`) como respaldo.
- RLS activo en `authorized_users`, `casas`, `maestres`, `juicios`, `codigos_diarios`; escrituras directas revocadas y RPC `SECURITY DEFINER`. `is_superadmin()` incluye `superadmin` y `master`. No toques RLS/auth sin revisar las migraciones.
- Oráculo: Edge Function Deno `supabase/functions/oraculo`; proxy OpenAI-compatible, por defecto Groq `openai/gpt-oss-120b`. El cliente llama a `ORACULO_ENDPOINT` o `${SUPABASE_URL}/functions/v1/oraculo`; si falla, `llamarModeloOraculo` usa una crónica local. La clave nunca va al navegador.
- PWA: la app principal registra `sw.js` (cache `lokitrono-app-v4`, app shell offline); sube `CACHE_VERSION` al cambiar CSS/JS o el shell. `botxitrono/` tiene su propio `sw.js` (`CACHE = 'aritza-reino-v4'`); no borres su cache desde el SW raíz.
- Cache busting: `index.html` versiona CSS/JS con `?v=YYYYMMDD` (`app.js?v=20261113d`, `style.css?v=20261110`, `analytics.js?v=20261110`, `dragon.js?v=20261101`). Actualiza la query al editar esos archivos.
- CSP/headers: `vercel.json` aplica CSP/HSTS a todo el sitio. Si añades CDNs, fuentes o APIs, actualiza `Content-Security-Policy` (ya permite jsdelivr, Supabase, Google Analytics, Vercel Insights y `worker-src 'self' blob:`).
- Deploy: push a `main` despliega en Vercel (workflow con IDs fijos); `vercel.json` sirve la raíz (`outputDirectory: "."`). `.vercelignore` excluye `tests/`, `scripts/`, `sql/`, `supabase/`, `*.py`; `botxitrono/` sí se publica.
- Ruido: `backups/`, `*.zip`, `*.pptx`, `q*.png`, `Captura de pantalla*.png`, `.qwen/`. `botxitrono/` **no** es ruido.
- Respeta `.github/agents/mantenimiento-web-bilbao.agent.md` (mínimos cambios, no migrar framework, no exponer secretos).
