# AGENTS.md

## Estructura

SPA estática sin build/bundler/framework. Código vivo en raíz: `index.html`, `css/style.css`, `js/app.js`, `js/supabase.js`, `sql/`, `scripts/`, `supabase/functions/`, `make/`. Contenido en español.

## Comandos

- `npm test` — `node tests/test_e2e_reino.js` (ver gotcha). Verificación principal.
- `npm run dev` — `python3 -m http.server 3000`.
- `npm run preview` / `npm run deploy` — `vercel` (requiere login). `npm run build` es no-op.
- SQL: editor Supabase, o `bash scripts/apply_schema.sh` con `DATABASE_URL`, o `apply_supabase_schema.yml` (solo `workflow_dispatch`, aplica `202610030001_secure_superadmin.sql`). Nuevas migraciones: `psql "$POSTGRES_URL_NON_POOLING" -f sql/migrations/<fichero>.sql` (credenciales `.env.to_push`).
- Oráculo: `python3 scripts/configurar_oraculo.py` (requiere Supabase CLI + `SUPABASE_ACCESS_TOKEN`).

## Gotcha: test depende de cadenas exactas

`tests/test_e2e_reino.js` lee `index.html`, `js/app.js`, `js/supabase.js`, `sql/schema.sql` y busca cadenas exactas (incluye espacios/saltos de línea). Tras cambiar esos 4 archivos, ejecuta `npm test` y respeta la indentación/texto que el test espera. No reformatees esas funciones. `tests/test_superadmin_voto_unico.js` está vacío.

## Puntos clave

- Config runtime: URL y anon key de Supabase hardcodeadas en `<script>` de `index.html` (`window.__APP_CONFIG__`). No usa `VITE_*`. Para cambiar de proyecto, edita `index.html`.
- `js/supabase.js` = helpers `localStorage` (no cliente Supabase). Cliente real: `getSupabaseBarriosClient` en `js/app.js` (`window.supabase.createClient`).
- Auth: teléfono + PIN 4 dígitos contra `authorized_users` (validación cliente). No Supabase Auth. No apto producción.
- Realtime: publicación `supabase_realtime` cubre `casas`, `eventos`, `votos_evento` (`iniciarRealtimeLokitrono`, debounce ~1,2s). `authorized_users` NO publicado. Listado admin: `listar_usuarios_por_token(p_token)` cada ~25s (`refrescarUsuariosPorToken`), revela PIN solo a `master`.
- Eventos: ventana votación `[fecha+hora_inicio_votacion, (fecha_fin_votacion||fecha)+hora_fin_votacion]`; fin evento `[(fecha_fin||fecha)+(hora_fin||hora)]` (migraciones `202610170001_*`). 
- RLS: activo en varias tablas; `is_superadmin()` SECURITY DEFINER. App lee `eventos`, `casas` directamente; escrituras via RPC SECURITY DEFINER. No tocar RLS/auth sin revisar seguridad.
- Oráculo: Edge Function `supabase/functions/oraculo` proxy Groq (`openai/gpt-oss-120b`) por defecto; clave `GROQ_API_KEY` nunca llega a navegador. Fallback a crónica si falla.
- Roles: `jugador`, `tronista`, `superadmin`, `master`. Migrado `organizador->tronista`. `master` gestiona superadmins y ve PIN. Permisos: ver `puedeGestionarUsuarios`, `puedeEditarEventoTronista` en `js/app.js`.
- Voto único: `UNIQUE(maestre_id, casa_visitada)`. Ranking Códice (0.50/0.20/0.30, K=3.0) en `calcular_ranking()` SQL y replicado en JS/tests. `Forastero` no competitivo.
- SQL: `sql/schema.sql` base; cambios en `sql/migrations/YYYYMMDDNNNN_*.sql`. No editar migraciones aplicadas. Crear nueva.
- Archivo gigante: `js/app.js` ~120KB (UI+estado), sin módulos. `window.__APP_STATE__` expone `eventList`.
- Ignorar ruido: carpetas/zip/backup/parches (`lokitrono-*`, `*.backup*`, `js/parche_*.py`, `actualizar_*.py`, `aplicar_cambios_auth.py`). Editar solo archivos vivos en raíz.
- Respeta `.github/agents/mantenimiento-web-bilbao.agent.md` (mínimos cambios, no migrar framework, no exponer secretos).
