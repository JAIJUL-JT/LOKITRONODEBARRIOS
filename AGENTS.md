# AGENTS.md — LokiTrono de Barrios

SPA estática **sin build, sin framework, sin bundler**. Se sirve tal cual desde Vercel. El código vivo está en la raíz: `index.html`, `css/style.css`, `js/app.js`, `js/supabase.js`, `sql/`, `make/`. Todo el contenido y los commits están en español (identidad feudal/medieval).

## Comandos

- `npm test` — ejecuta `tests/test_e2e_reino.js` (ver «Gotcha crítico» abajo). Es la verificación principal.
- `npm run dev` — `python3 -m http.server 3000` (sirve la raíz; no hay dev server con HMR).
- `npm run deploy` / `npm run preview` — `vercel` (requiere estar logueado). `npm run build` es un no-op deliberado.
- Aplicar SQL: manualmente en el SQL Editor de Supabase, o `bash scripts/apply_schema.sh` con `DATABASE_URL`, o el workflow `apply_supabase_schema.yml` (solo `workflow_dispatch`; aplica únicamente `202610030001_secure_superadmin.sql`).

## Gotcha crítico: el test es un grep de código fuente

`tests/test_e2e_reino.js` NO ejecuta la app. Lee `index.html`, `js/app.js`, `js/supabase.js` y `sql/schema.sql` y comprueba que contengan cadenas exactas. Algunas incluyen **espacios y saltos de línea literales**, p. ej.:

```js
assert(appJsContent.includes("function puedeGestionarUsuarios(role) {\n    return role === 'superadmin';"), ...)
```

Reformatear esas funciones rompe los tests aunque el código siga siendo correcto. Tras cualquier cambio en esos 4 archivos, corre `npm test` y respeta los textos/indentación que el test busca. `tests/test_superadmin_voto_unico.js` está vacío.

## Configuración y entorno

- No hay inyección de variables en build. Las `VITE_*` de `.env*` **no se leen** en runtime. La URL y `anon key` de Supabase están hardcodeadas en el `<script>` de `index.html` (líneas ~14-18, `window.__APP_CONFIG__`). Para cambiar de proyecto Supabase, edita `index.html`.
- `js/supabase.js` **no** es el cliente de Supabase: es un helper de respaldo basado en `localStorage` (`emitirJuicio`, `getRepositorioVotos`, `verificarClaveSuperAdmin`…). El cliente real se crea en `js/app.js` (~línea 2221, `window.supabase.createClient`). No los confundas.
- Autenticación actual: teléfono + PIN de 4 dígitos contra la tabla `authorized_users`, validado en cliente. No usa Supabase Auth. No lo presentes como seguro para producción.

## Convenciones de dominio

- Roles válidos: `jugador`, `tronista`, `superadmin` (CHECK en el esquema). El antiguo `organizador` se migró a `tronista`.
- Solo `superadmin` gestiona usuarios/roles y eventos. Ver `js/app.js` (`puedeGestionarUsuarios`, `puedeEditarEventoTronista`).
- Voto único por Maestre y Casa (`UNIQUE(maestre_id, casa_visitada)`).
- Ranking «Ley II de Bilbao»: media ponderada `0.50 Festín + 0.25 Caminos + 0.25 Espíritu`, regularizada con `K = 3.0`. Implementada en `calcular_ranking()` (`sql/schema.sql`) y replicada en JS/tests.
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
