# 🏰 El Trono del Pintxo — Juego de Barrios de Bilbao

> *La contienda gastronómica feudal entre las ocho grandes Casas de Bilbao.*

Este proyecto implementa la arquitectura feudal integral para conectar **GitHub + Supabase + Vercel + Make**, permitiendo a los usuarios (Maestres) catar pintxos, sellar su pasaporte feudal, emitir juicios con la **Ley II de Bilbao** y automatizar notificaciones, pases VIP y bandos semanales.

---

## 🗺️ Mapa de la Arquitectura Feudal

```text
┌─────────────┐     push      ┌─────────────┐    deploy    ┌─────────────┐
│   GitHub    │──────────────▶│   Vercel    │◀────────────▶│   Usuarios  │
│  (Código)   │               │  (Hosting)  │              │  (Navegan)  │
└─────────────┘               └──────┬──────┘              └──────┬──────┘
                                     │                            │
                                     │ API / SQL                  │ votos
                                     ▼                            ▼
┌─────────────┐              ┌─────────────┐
│  Supabase   │◀────────────▶│    Make     │
│ (DB + Auth) │   webhooks   │(Automatiza) │
└─────────────┘              └─────────────┘
```

| Herramienta | Rol Feudal en el Juego | Descripción Técnica |
| :--- | :--- | :--- |
| **GitHub** | **El Archivo del Reino** | Repositorio versionado del código (`main` y `dev`). |
| **Supabase** | **El Trono de Datos** | Base de datos PostgreSQL con RLS, tablas de Casas, Maestres, Juicios, Ley II y triggers. |
| **Vercel** | **La Taberna Imperial** | Despliegue estático de alta velocidad con CI/CD automático. |
| **Make (.com)** | **El Mayordomo del Reino** | Orquestación de notificaciones (Telegram), Pases VIP (Google Docs/PDF + Gmail), rankings semanales y sellos diarios. |

---

## 📁 Estructura del Proyecto

```text
juego-de-barrios-bilbao/
├── index.html                  # "La Taberna Imperial" (SPA con diseño feudal)
├── css/
│   └── style.css               # Estilos medievales, paleta oro/carmesí y responsive
├── js/
│   ├── app.js                  # Lógica de la app, estado, sliders, tabs y QR
│   └── supabase.js             # Módulo cliente de Supabase (con fallback local)
├── sql/
│   └── schema.sql              # Esquema SQL, RLS, función Ley II y triggers Make
├── make/
│   ├── README.md               # Guía de configuración en Make.com
│   ├── escenario_a_notificar_voto.json    # Alerta a organizadores (Espíritu >= 9)
│   ├── escenario_b_pase_vip.json          # Generación PDF + envío Pase Dorado (5 sellos)
│   ├── escenario_c_ranking_semanal.json   # Cómputo dominical Ley II + Google Sheets + Slack
│   └── escenario_d_codigo_sello.json      # Generador de códigos diarios para bares
├── .env.example                # Variables de entorno requeridas
├── .env.local                  # Variables locales de desarrollo
└── README.md                   # Esta guía
```

---

## 🚀 Despliegue Paso a Paso

### 📦 Paso 1 — GitHub (El Archivo del Reino)
1. Inicializa el repositorio y sube los archivos:
   ```bash
   git init
   git add .
   git commit -m "feat: Implementación completa de El Trono del Pintxo"
   git branch -M main
   git branch dev
   git remote add origin https://github.com/TU_USUARIO/juego-de-barrios-bilbao.git
   git push -u origin main
   git push -u origin dev
   ```

### 🗄️ Paso 2 — Supabase (El Trono de Datos)
1. Entra en [supabase.com](https://supabase.com) y crea un nuevo proyecto: `trono-del-pintxo`.
2. Ve a **SQL Editor** y ejecuta el contenido completo de [`sql/schema.sql`](file:///root/antigravity-termux/antigravity-termux/juego-de-barrios-bilbao/sql/schema.sql).
   - Creará las tablas: `casas`, `maestres`, `juicios` y `codigos_diarios`.
   - Insertará los datos semilla de las 8 Casas de Bilbao (Casco Viejo, Indautxu, Deusto, Santutxu, Abando, San Mamés, Bilbao La Vieja, Uribarri).
   - Configurará la función de la **Ley II de Bilbao** (`calcular_ranking()`).
   - Configurará el trigger para avisar a Make mediante `pg_net`.
3. En **Project Settings → API**, copia tu `Project URL` y tu `anon public key`.

### ⚡ Paso 3 — Vercel (La Taberna Imperial)
1. Entra en [vercel.com](https://vercel.com) y haz clic en **Add New → Project**.
2. Importa el repositorio `juego-de-barrios-bilbao`.
3. Configuración del proyecto:
   - **Framework Preset:** `Other`
   - **Build Command:** *(dejar vacío)*
   - **Output Directory:** `./`
4. En **Environment Variables**, añade:
   - `VITE_SUPABASE_URL` = `https://tu-proyecto.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `tu-anon-key`
5. Haz clic en **Deploy**. ¡Cada `push` a la rama `main` se desplegará automáticamente!

### 🤖 Paso 4 — Make (El Mayordomo Automático)
1. Entra en [make.com](https://make.com) y crea un nuevo escenario.
2. En el menú inferior `...`, selecciona **Import Blueprint** y carga:
   - [`make/escenario_a_notificar_voto.json`](file:///root/antigravity-termux/antigravity-termux/juego-de-barrios-bilbao/make/escenario_a_notificar_voto.json): Notificaciones instantáneas si Espíritu ≥ 9.
   - [`make/escenario_b_pase_vip.json`](file:///root/antigravity-termux/antigravity-termux/juego-de-barrios-bilbao/make/escenario_b_pase_vip.json): Pase Dorado VIP para Maestres con 5 o más sellos.
   - [`make/escenario_c_ranking_semanal.json`](file:///root/antigravity-termux/antigravity-termux/juego-de-barrios-bilbao/make/escenario_c_ranking_semanal.json): Bando semanal con podio dominical.
   - [`make/escenario_d_codigo_sello.json`](file:///root/antigravity-termux/antigravity-termux/juego-de-barrios-bilbao/make/escenario_d_codigo_sello.json): Distribución diaria de sellos a tabernas.
3. Copia la URL del Webhook generado en el Escenario A y colócala en `sql/schema.sql` en la función `notificar_make()`, o guárdala directamente desde la pestaña **🔏 Cámara del Escribano** en la aplicación web.

---

## ⚖️ Ley II de Bilbao (Cálculo del Ranking)

Para evitar que una Casa con un único voto perfecto de 10 supere injustamente a Casas con decenas de votos, la **Ley II** aplica una media ponderada combinada con regularización bayesiana:

$$\text{Puntuación Base} = 0.50 \times \text{Festín} + 0.25 \times \text{Caminos} + 0.25 \times \text{Espíritu}$$

$$\text{Puntuación Final} = \frac{N \times \text{Puntuación Base} + K \times \text{Media Global Reino}}{N + K}$$

Donde $N$ es el total de juicios recibidos y $K = 3.0$ es la constante de confianza del jurado imperial.

---

## 📱 Flujo del Maestre
1. El usuario accede a la Taberna Imperial en Vercel.
2. Se identifica como Maestre (Alias + Casa de Origen).
3. Visita un barrio y escanea el código QR de la taberna (o introduce el código de sello del día).
4. Emite su Juicio Real puntuando Festín, Caminos y Espíritu.
5. El voto se graba en Supabase → Supabase dispara el Webhook a Make.
6. El ranking se actualiza en tiempo real y el Maestre acumula un nuevo sello hacia su **Pase Dorado**.
# LOKITRONODEBARRIOS
