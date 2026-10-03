# 🤖 Automatizaciones de Make — "El Mayordomo del Reino"

En **El Trono del Pintxo**, Make actúa como el Mayordomo Feudal: vigila los acontecimientos en el Trono de Datos (Supabase) y ejecuta las ceremonias, alertas y reconocimientos del Reino.

---

## 🎯 Escenarios Configurados

### 1. Escenario A: Notificar Juicio con Espíritu Excepcional
- **Disparador:** Webhook de Supabase o módulo `Supabase: Watch Rows` en la tabla `juicios`.
- **Filtro:** `espiritu >= 9`.
- **Acción:** Envía mensaje instantáneo a Telegram / Discord de los Organizadores del Reino:
  > *"🏰 ¡Alerta en la Taberna! El Maestre **{{maestre_alias}}** ha otorgado un Espíritu de **{{espiritu}}/10** a la **{{casa_nombre}}** con el comentario: '{{comentario}}'"*

### 2. Escenario B: Generar Pase VIP Dorado (Gran Gala)
- **Disparador:** Supabase: Nuevo juicio o verificación periódica.
- **Acción 1:** Supabase: Ejecutar consulta o RPC `sellos_por_maestre(maestre_id)`.
- **Filtro:** `total_sellos >= 5`.
- **Acción 2:** Google Docs: Crear documento a partir de la plantilla del *Pase Dorado Imperial* rellenando nombre del Maestre y fecha.
- **Acción 3:** Google Drive: Descargar como PDF.
- **Acción 4:** Gmail: Enviar correo al Maestre con el PDF adjunto y su invitación oficial a la Gran Gala.

### 3. Escenario C: Ranking Semanal de las Casas
- **Disparador:** Schedule (Cada domingo a las 23:59).
- **Acción 1:** Supabase: Llamar función `calcular_ranking()` (Ley II de Bilbao).
- **Acción 2:** Google Sheets: Actualizar la hoja de cálculo con el Top de Casas, medias de Festín, Caminos y Espíritu.
- **Acción 3:** Slack / Discord / WhatsApp: Publicar el bando imperial con el Top 3:
  > *"👑 **BANDO IMPERIAL DE BILBAO — JORNADA SEMANAL**\n🥇 1º: {{casa_1}} ({{nota_1}} pts)\n🥈 2º: {{casa_2}} ({{nota_2}} pts)\n🥉 3º: {{casa_3}} ({{nota_3}} pts)"*

### 4. Escenario D: Emisión de Sello Diario Dinámico
- **Disparador:** Webhook receptor desde la app o programado cada mañana a las 08:00.
- **Acción 1:** Herramienta Make: Generar cadena aleatoria (`PIN-{{formatDate(now; "DD")}}{{upper(substring(uuid; 0; 4))}}`).
- **Acción 2:** Supabase: Insertar en la tabla `codigos_diarios` con `casa_id`, `codigo` y `fecha = CURRENT_DATE`.
- **Acción 3:** Email / Telegram al Tabernero para que coloque el código en la barra o imprima el QR.

---

## 📥 Importar los Blueprints en Make.com

1. Entra en [make.com](https://make.com) y crea un nuevo escenario.
2. Haz clic en los tres puntos `...` en la barra inferior y selecciona **Import Blueprint**.
3. Selecciona cualquiera de los archivos `.json` incluidos en este directorio (`escenario_a_notificar_voto.json`, etc.).
4. Vincula tus conexiones de **Supabase**, **Discord/Telegram**, **Google Docs/Drive** y **Gmail**.
