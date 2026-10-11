# AGENTS.md — LokiTrono de Barrios

SPA estática **sin build, sin framework, sin bundler**. Se sirve tal cual desde Vercel. El código vivo está en la raíz: `index.html`, `css/style.css`, `js/app.js`, `js/supabase.js`, `sql/`, `scripts/`, `supabase/functions/`, `make/`. Todo el contenido y los commits están en español (identidad feudal/medieval).

## Comandos

- `npm test` — ejecuta `tests/test_e2e_reino.js` (ver «Gotcha crítico» abajo). Es la verificación principal.
- `npm run dev` — `python3 -m http.server 3000` (sirve la raíz; no hay dev server con HMR).
- `npm run deploy` / `npm run preview` — `vercel` (requiere estar logueado). `npm run build` es un no-op deliberado.
- Aplicar SQL: manualmente en el SQL Editor de Supabase, o `bash scripts/apply_schema.sh` con `DATABASE_URL`, o el workflow `apply_supabase_schema.yml` (solo `workflow_dispatch`; aplica únicamente `202610030001_secure_superadmin.sql`). Las migraciones nuevas se aplican con `psql "$POSTGRES_URL_NON_POOLING" -f sql/migrations/<fichero>.sql` (credenciales en `.env.to_push`).
- `python3 scripts/configurar_oraculo_hf.py` — registra el secreto `HF_TOKEN` en Supabase y despliega la Edge Function del Oráculo (requiere Supabase CLI y `SUPABASE_ACCESS_TOKEN`).

## Gotcha crítico: el test es un grep de código fuente

`tests/test_e2e_reino.js` NO ejecuta la app. Lee `index.html`, `js/app.js`, `js/supabase.js` y `sql/schema.sql` y comprueba que contengan cadenas exactas. Algunas incluyen **espacios y saltos de línea literales**, p. ej.:

```js
assert(appJsContent.includes("function puedeGestionarUsuarios(role) {\n    return role === 'superadmin';"), ...)
```

Reformatear esas funciones rompe los tests aunque el código siga siendo correcto. Tras cualquier cambio en esos 4 archivos, corre `npm test` y respeta los textos/indentación que el test busca. `tests/test_superadmin_voto_unico.js` está vacío.

## Configuración y entorno

- No hay inyección de variables en build. Las `VITE_*` de `.env*` **no se leen** en runtime. La URL y `anon key` de Supabase están hardcodeadas en el `<script>` de `index.html` (líneas ~14-18, `window.__APP_CONFIG__`). Para cambiar de proyecto Supabase, edita `index.html`.
- `js/supabase.js` **no** es el cliente de Supabase: es un helper de respaldo basado en `localStorage` (`emitirJuicio`, `getRepositorioVotos`, `verificarClaveSuperAdmin`…). El cliente real se crea en `js/app.js` (`getSupabaseBarriosClient`, `window.supabase.createClient`). No los confundas.
- Autenticación actual: teléfono + PIN de 4 dígitos contra la tabla `authorized_users`, validado en cliente. No usa Supabase Auth. No lo presentes como seguro para producción.

## Tiempo real y Oráculo Imperial

- **Actualización en tiempo real (Supabase Realtime):** la publicación `supabase_realtime` incluye `casas`, `eventos` y `votos_evento` (migración `202610160001_realtime_y_usuarios_token.sql`). `js/app.js` (`iniciarRealtimeLokitrono`) se suscribe a `postgres_changes` y refresca con debounce (1,2 s) llamando a `cargarBarriosDesdeSupabase`, `cargarEventosDesdeSupabase` y `cargarVotosDesdeSupabase`.
- `authorized_users` **no** se publica: contiene teléfonos/PIN y su RLS está desactivado. Los administradores refrescan el listado con `listar_usuarios_por_token(p_token)` (valida `lokitrono_usuario_de_token`, revela el PIN solo al rol `master`) cada 25 s, sin volver a pedir el PIN (`refrescarUsuariosPorToken`).
- **Oráculo Imperial (IA):** usa Hugging Face (router OpenAI-compatible, `meta-llama/Llama-3.1-8B-Instruct`) a través de la Edge Function `supabase/functions/oraculo-hf`, que actúa de proxy. El token `HF_TOKEN` es un secreto del servidor y **nunca** llega al navegador. Cliente: `obtenerOraculoConfig`, `llamarModeloHuggingFace`, `generarCronicaOraculo`, `generarRecomendacionOraculo`; endpoint `window.__APP_CONFIG__.ORACULO_ENDPOINT` o `${SUPABASE_URL}/functions/v1/oraculo-hf`. Si el proxy no está desplegado, la app muestra una crónica de reserva (no falla).

## Convenciones de dominio

- Roles válidos: `jugador`, `tronista`, `superadmin`, `master` (CHECK en el esquema). El antiguo `organizador` se migró a `tronista`; `master` (Trono Mayor) es el rol superior que puede gestionar superadmins y ver PIN.
- Solo `superadmin` gestiona usuarios/roles y eventos. Ver `js/app.js` (`puedeGestionarUsuarios`, `puedeEditarEventoTronista`).
- Voto único por Maestre y Casa (`UNIQUE(maestre_id, casa_visitada)`).
- Ranking «Códice de la Villa»: media ponderada `0.50 Ocio Hostelero + 0.20 Accesibilidad + 0.30 Ambiente`, regularizada con `K = 3.0`. Implementada en `calcular_ranking()` (`sql/schema.sql`) y replicada en JS/tests.
- Barrio `Forastero` es un caso especial no competitivo.

## SQL y despliegue

- `sql/schema.sql` es el esquema base (lo valida el test); los cambios incrementales van en `sql/migrations/` con nombre `YYYYMMDDNNNN_descripcion.sql` y se aplican a mano en Supabase. No edites migraciones ya aplicadas: crea una nueva.
- Push a `main` despliega en Vercel (`.github/workflows/`; hay dos workflows redundantes de Vercel). Ramas remotas relevantes: `main`.
- `js/app.js` es un archivo enorme (~120KB) con toda la lógica de UI y estado; no hay módulos ni separación por componentes. `window.__APP_STATE__` expone `eventList`.

## Ruido en el repo (no editar por error)

Hay copias/backups que **no son** el código activo:
- Directorios duplicados `lokitrono-barrio-management-update/` y `lokitrono-login-superadmin-fix/` (snapshots completos), y sus `.zip`.
- `juego-de-barrios-bilbao.zip`.
- `js/app.js.backup*` (muchos) y `js/parche_*.py`.
- Scripts Python de parcheo en la raíz (`actualizar_*.py`, `aplicar_cambios_auth.py`).

Edita solo los archivos vivos de la raíz, no estas copias. No borres cambios preexistentes ajenos a tu tarea.

## Agente local

`.github/agents/mantenimiento-web-bilbao.agent.md` define reglas específicas del repo (cambios mínimos, no migrar framework, no tocar RLS/auth sin revisar seguridad, no exponer secretos). Respétalas.
