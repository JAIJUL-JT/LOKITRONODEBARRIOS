// ==========================================
// CONFIGURACIÓN DE SUPABASE / PRODUCCIÓN
// ==========================================
const APP_CONFIG = Object.assign({
    SUPABASE_URL: 'https://uswikdckptzivsurzrlc.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzd2lrZGNrcHR6aXZzdXJ6cmxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5ODAwNTEsImV4cCI6MjEwNjU1NjA1MX0.3kovmMBfC_JCGKyJ_1s5iyxtkKyqVMIt77CfHnytLzI',
    MAKE_WEBHOOK_URL: ''
}, window.__APP_CONFIG__ || {});

const SUPABASE_URL = APP_CONFIG.SUPABASE_URL;
const SUPABASE_ANON_KEY = APP_CONFIG.SUPABASE_ANON_KEY;

// Inicialización segura del cliente
let supabaseClient = null;

if (typeof supabase !== 'undefined' && SUPABASE_URL && !SUPABASE_URL.includes('tu_proyecto')) {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("✅ Cliente Supabase inicializado correctamente.");
} else {
    console.error("❌ Error de Configuración: SUPABASE_URL o librería Supabase JS no disponibles.");
}

// Variable global para mantener el teléfono durante el proceso de OTP
let ultimoTelefonoFormateado = '';

const EVENTOS_FEUDALES = [
    { barrio: 'Casco Viejo', nombre: 'Ruta del Pintxo Medieval', fecha: '2026-11-03', descripcion: 'Noche de calle con degustación y música en vivo.' },
    { barrio: 'Indautxu', nombre: 'Velada del Vino y la Tradición', fecha: '2026-11-05', descripcion: 'Bodega abierta para armonizar sabor y arte.' },
    { barrio: 'Deusto', nombre: 'Jornada de los Maestres del Ría', fecha: '2026-11-08', descripcion: 'Catas y rutas junto al río.' },
    { barrio: 'San Mamés', nombre: 'Feria del León y la Gastronomía', fecha: '2026-11-12', descripcion: 'Gran vuelta por tabernas del barrio.' }
];

function abrirModalAuth() {
    const modal = document.getElementById('modal-auth');
    if (modal) modal.style.display = 'flex';
}

function cerrarModalAuth() {
    const modal = document.getElementById('modal-auth');
    if (modal) modal.style.display = 'none';
}

// ==========================================
// FUNCIÓN PARA CARGAR LA CLASIFICACIÓN REAL O DINÁMICA
// ==========================================
async function cargarClasificacion() {
    const headerRow = document.getElementById('clasificacion-header-dinamico');
    const tbody = document.getElementById('clasificacion-body');
    if (!tbody || !supabaseClient) return;

    const criterios = obtenerCriteriosActuales();

    // Actualizar encabezados dinámicamente según criterios activos
    if (headerRow) {
        headerRow.innerHTML = `
            <tr>
                <th>Estatus</th>
                <th>Reino / Feudo</th>
                ${criterios.map(c => `<th>${c.nombre} (${c.peso}%)</th>`).join('')}
                <th>Nota Final</th>
                <th>Votos</th>
            </tr>
        `;
    }

    try {
        const { data, error } = await supabaseClient.from('casas').select('*');

        if (error) {
            tbody.innerHTML = `<tr><td colspan="${criterios.length + 4}" style="text-align:center; color:#f87171;">⚠️ Los cuervos no pudieron traer las puntuaciones.</td></tr>`;
            return;
        }

        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="${criterios.length + 4}" style="text-align:center; color:#d6d3d1;">No hay reinos o puntuaciones registradas aún.</td></tr>`;
            return;
        }

        tbody.innerHTML = '';
        data.forEach((row, index) => {
            let posicion = index + 1;
            let insignia = `🏰 #${posicion}`;
            if (posicion === 1) insignia = '👑 Txapeldun';
            else if (posicion === 2) insignia = '⚔️ 2º';
            else if (posicion === 3) insignia = '🛡️ 3º';

            // Notas estáticas por defecto multiplicadas por la suma ponderada
            const valoresCrit = criterios.map(c => 8.5);
            const notaFinalCalculada = valoresCrit.reduce((sum, v, idx) => sum + (v * (criterios[idx].peso / 100)), 0);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${insignia}</strong></td>
                <td style="color:#fef08a;"><strong>${row.nombre}</strong></td>
                ${valoresCrit.map(v => `<td>${v.toFixed(1)}</td>`).join('')}
                <td><span class="score-badge">${notaFinalCalculada.toFixed(2)}</span></td>
                <td>12</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Error al cargar clasificación:", err);
    }
}


// Función auxiliar para generar un PIN de 4 dígitos
function generarPin4Digitos() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

function obtenerMakeWebhookUrl() {
    return localStorage.getItem('make_webhook_url') || window.MAKE_WEBHOOK_URL || APP_CONFIG.MAKE_WEBHOOK_URL || '';
}

function exportarRepositorioCSV() {
    const votos = getRepositorioVotos ? getRepositorioVotos() : JSON.parse(localStorage.getItem('repositorio_votos') || '[]');
    if (!votos.length) {
        alert('⚠️ El repositorio central del reino aún no tiene votos para exportar.');
        return;
    }

    const cabecera = ['maestre_id', 'casa_visitada', 'barrio', 'nota_festin', 'nota_caminos', 'nota_espiritu', 'fecha_juicio'];
    const filas = votos.map(v => [
        v.maestre_id || '',
        v.casa_visitada || '',
        v.barrio || '',
        v.nota_festin || 0,
        v.nota_caminos || 0,
        v.nota_espiritu || 0,
        v.fecha_juicio || ''
    ].map(value => `"${String(value).replace(/"/g, '""')}"`).join(','));
    const csv = [cabecera.join(','), ...filas].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'repositorio-votos-bilbao.csv';
    a.click();
    URL.revokeObjectURL(url);
    alert('📤 Repositorio exportado en formato CSV.');
}

function descargarICSEvento(evento) {
    const fecha = (evento && evento.fecha) ? new Date(evento.fecha + 'T12:00:00') : new Date();
    const start = fecha.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const summary = encodeURIComponent((evento && evento.nombre) ? evento.nombre : 'Evento Feudal');
    const description = encodeURIComponent((evento && evento.descripcion) ? evento.descripcion : 'Evento programado por la Corte');
    const location = encodeURIComponent((evento && evento.barrio) ? evento.barrio : 'Bilbao');
    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `UID:${Date.now()}@lokitrono`,
        `DTSTAMP:${start}`,
        `DTSTART:${start}`,
        `DTEND:${start}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${location}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'evento-feudal.ics';
    a.click();
    URL.revokeObjectURL(url);
}

// Función para enviar el mensaje de Bienvenida por WhatsApp con PIN e instrucciones vía Make.com
async function enviarMensajeBienvenidaWhatsApp(phone, name, pinCode) {
    const nombreMostrar = name || 'Noble Caminante';
    const mensajeText = `¡Hola ${nombreMostrar}! Te damos la bienvenida a la Corte del Lokitrono de Bilbao ⚔️👑\n\n` +
        `Se ha activado tu acceso autorizado.\n` +
        `🔑 Tu PIN de acceso de 4 dígitos es: *${pinCode}*\n\n` +
        `📜 Instrucciones para acceder a la web:\n` +
        `1. Entra en la web de la Corte.\n` +
        `2. Pulsa en "📜 Identificarse por WhatsApp".\n` +
        `3. Introduce tu número de teléfono (${phone}).\n` +
        `4. Escribe tu PIN de 4 dígitos (${pinCode}) para entrar.`;

    const mensajeLog = `💬 [WHATSAPP BIENVENIDA A ${phone}]\n` +
        `--------------------------------------------------\n` +
        mensajeText + `\n` +
        `--------------------------------------------------`;

    console.log(mensajeLog);

    const webhookUrl = obtenerMakeWebhookUrl();
    if (webhookUrl) {
        try {
            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    evento: 'BIENVENIDA_USUARIO',
                    phone: phone,
                    name: nombreMostrar,
                    pin_code: pinCode,
                    mensaje: mensajeText,
                    timestamp: new Date().toISOString()
                })
            });
            console.log("✅ Webhook Make enviado con éxito para bienvenida WhatsApp.");
        } catch (e) {
            console.warn("⚠️ No se pudo enviar el webhook de bienvenida a Make:", e);
        }
    }
    return mensajeLog;
}

// Notificación vía WhatsApp a superadministradores por Webhook Make
async function notificarSuperAdminsWhatsApp(accion, usuarioData) {
    const nombreMostrar = usuarioData.name || 'Sin nombre (Solo teléfono)';
    const mensajeText = `🔔 [CORTE DE BILBAO] Notificación de ${accion}:\n- Usuario: ${nombreMostrar}\n- Teléfono: ${usuarioData.phone}\n- Rol: ${usuarioData.role}\n- PIN Asignado: ${usuarioData.pin_code || 'N/A'}`;

    console.log("📲 ENVIANDO NOTIFICACIÓN A SUPERADMINISTRADORES:\n" + mensajeText);

    const webhookUrl = obtenerMakeWebhookUrl();
    if (webhookUrl) {
        try {
            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    evento: 'NOTIFICACION_SUPERADMIN',
                    accion: accion,
                    usuario: usuarioData,
                    mensaje: mensajeText,
                    timestamp: new Date().toISOString()
                })
            });
            console.log("✅ Webhook Make enviado con éxito a Superadministradores.");
        } catch (e) {
            console.warn("⚠️ No se pudo enviar el webhook a Make:", e);
        }
    }
}

// Gestión del Panel de Configuración de Webhook Make en la UI
function guardarWebhookMakeConfig() {
    const inputUrl = document.getElementById('input-make-webhook-url').value.trim();
    if (!inputUrl) {
        alert("⚠️ Por favor introduce una URL válida de Webhook de Make.com.");
        return;
    }
    localStorage.setItem('make_webhook_url', inputUrl);
    window.MAKE_WEBHOOK_URL = inputUrl;
    alert("✅ URL de Webhook de Make guardada correctamente.");
    actualizarEstadoWebhookUI();
}

async function probarEnvioWebhookMake() {
    const webhookUrl = obtenerMakeWebhookUrl();
    if (!webhookUrl) {
        alert("⚠️ Primero debes guardar una URL de Webhook de Make.");
        return;
    }
    const statusMsg = document.getElementById('make-webhook-test-status');
    if (statusMsg) statusMsg.innerText = "⏳ Enviando prueba a Make.com...";
    try {
        const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                evento: 'TEST_PRUEBA_WHATSAPP',
                mensaje: '🧪 Mensaje de prueba desde la Corte del Lokitrono de Bilbao hacia Make.com y WhatsApp.',
                phone: '+34605676002',
                timestamp: new Date().toISOString()
            })
        });
        if (res.ok) {
            if (statusMsg) statusMsg.innerText = "✅ Webhook recibido con éxito por Make.com (HTTP 200 OK)";
            alert("✅ Webhook recibido con éxito por Make.com!");
        } else {
            if (statusMsg) statusMsg.innerText = `⚠️ Make devolvió respuesta HTTP ${res.status}`;
            alert(`⚠️ Make respondió con HTTP ${res.status}`);
        }
    } catch (err) {
        console.error("Error probando webhook:", err);
        if (statusMsg) statusMsg.innerText = "❌ Error de conexión al webhook de Make.";
        alert("❌ Error de conexión al enviar prueba al Webhook de Make.");
    }
}

function actualizarEstadoWebhookUI() {
    const inputUrl = document.getElementById('input-make-webhook-url');
    const badge = document.getElementById('badge-make-webhook-status');
    const urlActual = obtenerMakeWebhookUrl();
    if (inputUrl && urlActual) {
        inputUrl.value = urlActual;
    }
    if (badge) {
        if (urlActual) {
            badge.style.background = '#22c55e';
            badge.innerText = '🟢 Configurado y Activo';
        } else {
            badge.style.background = '#eab308';
            badge.innerText = '🟡 No Configurado';
        }
    }
}

// ==========================================
// FUNCIÓN DE AUTENTICACIÓN POR TELÉFONO / PIN
// ==========================================
async function enviarCuervoOTP() {
    const msg = document.getElementById('auth-message');
    if (msg) msg.innerText = '';

    if (!supabaseClient) {
        if (msg) msg.innerText = "⚠️ Error de configuración: La cliente de Supabase no está conectada.";
        return;
    }

    const inputPhone = document.getElementById('input-phone');
    if (!inputPhone) return;

    const rawPhone = inputPhone.value.trim();

    if (!rawPhone) {
        if (msg) msg.innerText = "Por favor, escribe tu número de teléfono.";
        return;
    }

    const digitsOnly = rawPhone.replace(/\D/g, '');
    let telefonoFormateado = '';

    if (digitsOnly.length === 9) {
        telefonoFormateado = '+34' + digitsOnly;
    } else if (digitsOnly.length === 11 && digitsOnly.startsWith('34')) {
        telefonoFormateado = '+' + digitsOnly;
    } else if (rawPhone.startsWith('+')) {
        telefonoFormateado = '+' + digitsOnly;
    } else {
        if (msg) msg.innerText = "Introduce un número válido (ej: 123456789).";
        return;
    }

    ultimoTelefonoFormateado = telefonoFormateado;

    console.log(`🔍 Verificando teléfono en authorized_users: ${telefonoFormateado}`);

    try {
        // 1. Consultar si el número está en la tabla de autorizados
        let { data: user, error: checkError } = await supabaseClient
            .from('authorized_users')
            .select('id, phone, name, role, pin_code, barrio_asignado, barrio_representado')
            .eq('phone', telefonoFormateado)
            .maybeSingle();

        if (checkError) {
            console.error("Error al consultar la tabla authorized_users:", checkError);
            if (msg) msg.innerText = "⚠️ Error al consultar la base de datos: " + checkError.message;
            return;
        }

        if (!user) {
            console.warn(`El número ${telefonoFormateado} no se encontró en authorized_users.`);
            if (msg) msg.innerText = `⚠️ El número ${digitsOnly} no está registrado en la lista de usuarios autorizados. Solicita tu alta a la IA de WhatsApp.`;
            return;
        }

        // Generar o recuperar PIN de 4 dígitos
        let pinCode = user.pin_code;
        if (!pinCode || pinCode.length !== 4) {
            pinCode = generarPin4Digitos();
            await supabaseClient
                .from('authorized_users')
                .update({ pin_code: pinCode })
                .eq('id', user.id);
            user.pin_code = pinCode;
        }

        usuarioAutenticado = user;

        const stepPhone = document.getElementById('step-phone');
        const stepOtp = document.getElementById('step-otp');
        const desc = document.getElementById('auth-step-desc');

        if (stepPhone) stepPhone.style.display = 'none';
        if (stepOtp) stepOtp.style.display = 'block';

        const etiquetaNombre = user.name ? `¡Hola ${user.name}!` : `¡Hola Maestre (${digitsOnly})!`;
        if (desc) desc.innerText = `📲 ${etiquetaNombre} Introduce tu PIN de 4 dígitos recibido en WhatsApp (Tu PIN: ${pinCode}):`;

    } catch (err) {
        console.error("Excepción en enviarCuervoOTP:", err);
        if (msg) msg.innerText = "Error inesperado al conectar con el servidor.";
    }
}

// ==========================================
// FUNCIÓN DE INICIO DE SESIÓN DIRECTO DESDE PANTALLA INICIAL (TELÉFONO + PIN)
// ==========================================
async function iniciarSesionDirecta() {
    const inputPhone = document.getElementById('input-phone-inicio');
    const inputPin = document.getElementById('input-pin-inicio');
    const msg = document.getElementById('login-inicio-message');
    if (msg) msg.innerText = '';

    if (!inputPhone || !inputPin) return;

    const rawPhone = inputPhone.value.trim();
    const pinCode = inputPin.value.trim();

    if (!rawPhone) {
        if (msg) msg.innerText = "Por favor, introduce tu número de teléfono.";
        return;
    }

    if (!pinCode || pinCode.length !== 4) {
        if (msg) msg.innerText = "Introduce el código PIN de 4 dígitos.";
        return;
    }

    const digitsOnly = rawPhone.replace(/\D/g, '');
    let telefonoFormateado = '';

    if (digitsOnly.length === 9) {
        telefonoFormateado = '+34' + digitsOnly;
    } else if (digitsOnly.length === 11 && digitsOnly.startsWith('34')) {
        telefonoFormateado = '+' + digitsOnly;
    } else if (rawPhone.startsWith('+')) {
        telefonoFormateado = '+' + digitsOnly;
    } else {
        if (msg) msg.innerText = "Número no válido. Ej: 123456789";
        return;
    }

    if (!supabaseClient) {
        if (msg) msg.innerText = "⚠️ Error de conexión con Supabase.";
        return;
    }

    try {
        const { data: user, error } = await supabaseClient
            .from('authorized_users')
            .select('id, phone, name, role, pin_code, barrio_asignado, barrio_representado')
            .eq('phone', telefonoFormateado)
            .maybeSingle();

        if (error || !user) {
            if (msg) msg.innerText = "⚠️ Número no registrado o no autorizado.";
            return;
        }

        // Validar PIN (Acepta el PIN guardado en DB, o PINs asignados 3007 / 1234)
        if (user.pin_code === pinCode || pinCode === "3007" || pinCode === "1234") {
            const userSession = {
                ...user,
                barrio_representado: user.barrio_representado || user.barrio_asignado || 'Forastero'
            };
            localStorage.setItem('maestre_sesion', JSON.stringify(userSession));
            actualizarEstadoUI();
        } else {
            if (msg) msg.innerText = "⚠️ Código PIN incorrecto.";
        }
    } catch (err) {
        console.error("Error en iniciarSesionDirecta:", err);
        if (msg) msg.innerText = "Error inesperado en el servidor.";
    }
}


function obtenerSesionActual() {
    const sesion = localStorage.getItem('maestre_sesion');
    if (!sesion) return null;
    try {
        return JSON.parse(sesion);
    } catch (e) {
        console.error('Error leyendo la sesión actual:', e);
        return null;
    }
}

function puedeVerMenu(role, opcion) {
    const permisos = {
        'clasificacion': ['jugador', 'tronista', 'superadmin'],
        'votacion-barrio': ['jugador', 'tronista', 'superadmin'],
        'calendario': ['jugador', 'tronista', 'superadmin'],
        'tronistas': ['tronista', 'superadmin'],
        'admin': ['superadmin'],
        'usuarios': ['superadmin'],
        'barrios': ['superadmin'],
        'roles': ['superadmin'],
        'ponderacion': ['superadmin'],
        'evento-final': ['superadmin']
    };
    return (permisos[opcion] || []).includes(role);
}

function puedeAbrirPestana(role, pestana) {
    const permisos = {
        'pestana-clasificacion': ['jugador', 'tronista', 'superadmin'],
        'pestana-votacion-barrio': ['jugador', 'tronista', 'superadmin'],
        'tab-calendario': ['jugador', 'tronista', 'superadmin'],
        'pestana-tronistas': ['tronista', 'superadmin'],
        'tab-superadmin': ['superadmin'],
        'pestana-usuarios': ['superadmin'],
        'pestana-barrios': ['superadmin'],
        'pestana-evento-final': ['superadmin']
    };
    return (permisos[pestana] || []).includes(role);
}

function puedeGestionarUsuarios(role) {
    return role === 'superadmin';
}

function puedeGestionarEventos(role) {
    return ['superadmin', 'tronista'].includes(role);
}

function esRolBasico(role) {
    return ['jugador', 'tronista'].includes(role);
}

function barrioAsignadoUsuarioActual() {
    // Compatibilidad con la sesión del tronista: .select('id, phone, name, role, pin_code, barrio_asignado')
    const user = obtenerSesionActual();
    const barrioRepresentado = user && (user.barrio_representado || user.barrio_asignado);
    return barrioRepresentado || null;
}

function puedeEditarEventoTronista(role, barrioEvento, fechaEvento, horaEvento) {
    if (role === 'superadmin') return true;
    if (role !== 'tronista') return false;

    const barrioTronista = barrioAsignadoUsuarioActual();
    if (!barrioTronista || barrioTronista !== barrioEvento) return false;

    if (!fechaEvento) return false;

    const fechaLimite = new Date(`${fechaEvento}T${horaEvento || '00:00'}`);
    const ahora = new Date();

    return !Number.isNaN(fechaLimite.getTime()) && fechaLimite.getTime() > ahora.getTime();
}

function actualizarEstadoUI() {
    const sesion = localStorage.getItem('maestre_sesion');
    const authStatusDiv = document.getElementById('auth-status');
    const pantallaLogin = document.getElementById('pantalla-login-inicio');
    const navSecciones = document.getElementById('nav-secciones-corte');
    const contenidoProtegido = document.getElementById('contenido-reino-protegido');
    const optionVotacionBarrio = document.querySelector('#select-seccion-corte option[value="pestana-votacion-barrio"]');
    const optionUsuarios = document.getElementById('option-menu-usuarios');
    const optionTronistas = document.querySelector('#select-seccion-corte option[value="pestana-tronistas"]');
    const optionConsejoReal = document.querySelector('#select-seccion-corte option[value="tab-superadmin"]');
    const optionEventoFinal = document.querySelector('#select-seccion-corte option[value="pestana-evento-final"]');
    const selectSeccionCorte = document.getElementById('select-seccion-corte');

    if (!sesion) {
        // Modo NO Autenticado: Mostrar pantalla de login inicial, ocultar contenido y menú
        if (pantallaLogin) pantallaLogin.style.display = 'block';
        if (authStatusDiv) authStatusDiv.style.display = 'none';
        if (navSecciones) navSecciones.style.display = 'none';
        if (contenidoProtegido) contenidoProtegido.style.display = 'none';
        return;
    }

    try {
        const user = JSON.parse(sesion);
        const nombreMostrar = user.name ? user.name : user.phone;
        const esSuperAdmin = (user.role === 'superadmin');
        const esRolBase = esRolBasico(user.role);
        const puedeUsuarios = puedeGestionarUsuarios(user.role);

        // Ocultar login, mostrar estado de sesión, menú y contenido protegido
        if (pantallaLogin) pantallaLogin.style.display = 'none';
        if (contenidoProtegido) contenidoProtegido.style.display = 'block';
        if (navSecciones) navSecciones.style.display = 'block';

        if (authStatusDiv) {
            authStatusDiv.style.display = 'block';
            authStatusDiv.innerHTML = `
                <div style="background: rgba(41, 37, 36, 0.9); padding: 10px 20px; border-radius: 8px; border: 1px solid var(--oro-real); display: inline-block;">
                    <span style="color: var(--oro-brillante); font-weight: bold;">👑 Maestre: ${nombreMostrar}</span> 
                    <span style="font-size: 0.85rem; color: #d6d3d1;">(${user.role})</span>
                    <button onclick="cerrarSesionMaestre()" class="btn-cuervo" style="margin-left: 15px; padding: 4px 10px; font-size: 0.8rem;">Cerrar Sesión</button>
                </div>
            `;
        }

        // Control de Visibilidad del Menú y Acciones Superadmin
        if (optionVotacionBarrio) {
            optionVotacionBarrio.style.display = '';
        }
        if (optionUsuarios) {
            optionUsuarios.style.display = puedeUsuarios ? '' : 'none';
        }
        if (optionTronistas) {
            optionTronistas.style.display = esSuperAdmin || user.role === 'tronista' ? '' : 'none';
        }
        if (optionConsejoReal) {
            optionConsejoReal.style.display = esSuperAdmin ? '' : 'none';
        }
        if (optionEventoFinal) {
            optionEventoFinal.style.display = esSuperAdmin ? '' : 'none';
        }
        if (selectSeccionCorte) {
            const optionVotacionMenu = selectSeccionCorte.querySelector('option[value="pestana-votacion-barrio"]');
            if (optionVotacionMenu) {
                optionVotacionMenu.style.display = '';
            }
            const optionSuperAdmin = selectSeccionCorte.querySelector('option[value="tab-superadmin"]');
            if (optionSuperAdmin) {
                optionSuperAdmin.style.display = esSuperAdmin ? '' : 'none';
            }
            const optionUsuariosMenu = selectSeccionCorte.querySelector('option[value="pestana-usuarios"]');
            if (optionUsuariosMenu) {
                optionUsuariosMenu.style.display = puedeUsuarios ? '' : 'none';
            }
            const optionTronistasMenu = selectSeccionCorte.querySelector('option[value="pestana-tronistas"]');
            if (optionTronistasMenu) {
                optionTronistasMenu.style.display = esSuperAdmin || user.role === 'tronista' ? '' : 'none';
            }
            const optionEventoFinalMenu = selectSeccionCorte.querySelector('option[value="pestana-evento-final"]');
            if (optionEventoFinalMenu) {
                optionEventoFinalMenu.style.display = esSuperAdmin ? '' : 'none';
            }
        }

        const accionesSimulacionDiv = document.getElementById('superadmin-simulacion-actions');
        if (accionesSimulacionDiv) {
            accionesSimulacionDiv.style.display = esSuperAdmin ? 'flex' : 'none';
        }

        const panelAdminTronistas = document.getElementById('panel-superadmin-tronistas');
        if (panelAdminTronistas) {
            panelAdminTronistas.style.display = esSuperAdmin ? 'block' : 'none';
        }

        // Tronistas mantienen permisos básicos salvo la gestión acotada de eventos de su barrio.
        aplicarRestriccionesLectura(!esSuperAdmin && !esRolBase && user.role !== 'tronista');

        // Seleccionar pestaña por defecto
        cambiarPestana('pestana-clasificacion');

    } catch (e) {
        console.error("Error leyendo sesión local:", e);
    }
}

function aplicarRestriccionesLectura(soloLectura) {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        if (form.id !== 'form-usuario') {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.style.display = soloLectura ? 'none' : 'block';
            }
        }
    });
}

function cerrarSesionMaestre() {
    localStorage.removeItem('maestre_sesion');
    location.reload();
}

// ==========================================
// CONFIGURACIÓN DINÁMICA DE CRITERIOS Y PONDERACIONES (SÓLO SUPERADMIN)
// ==========================================
const CRITERIOS_DEFECTO = [
    { id: 'crit_festin', nombre: 'Festines (Sabor / Pintxo)', peso: 50 },
    { id: 'crit_rutas', nombre: 'Rutas (Ambiente / Enclave)', peso: 20 },
    { id: 'crit_jolgorio', nombre: 'Jolgorio (Hospitalidad / Fervor)', peso: 30 }
];

function obtenerCriteriosActuales() {
    const guardados = localStorage.getItem('criterios_ponderacion');
    if (guardados) {
        try { return JSON.parse(guardados); } catch (e) { }
    }
    return CRITERIOS_DEFECTO;
}

function guardarCriteriosPonderacion(criterios) {
    localStorage.setItem('criterios_ponderacion', JSON.stringify(criterios));
}

function calcularSumaPonderacion(criterios) {
    return criterios.reduce((sum, c) => sum + (parseFloat(c.peso) || 0), 0);
}

function togglePanelPonderacionSuperadmin() {
    const panel = document.getElementById('panel-superadmin-ponderaciones');
    if (!panel) return;
    const estaVisible = panel.style.display === 'block';
    panel.style.display = estaVisible ? 'none' : 'block';
    if (!estaVisible) {
        renderizarTablaPonderacionSuperadmin();
    }
}

function renderizarTablaPonderacionSuperadmin() {
    const tbody = document.getElementById('tabla-criterios-ponderacion-body');
    const badge = document.getElementById('suma-ponderacion-badge');
    const avisador = document.getElementById('avisador-ponderacion-status');
    if (!tbody) return;

    const criterios = obtenerCriteriosActuales();
    const suma = calcularSumaPonderacion(criterios);

    if (badge) {
        badge.innerText = `${suma}%`;
        badge.style.background = (suma === 100) ? '#22c55e' : '#ef4444';
    }

    if (avisador) {
        if (suma === 100) {
            avisador.innerHTML = `✅ El reparto de ponderaciones es válido (100%).`;
            avisador.style.color = '#4ade80';
        } else if (suma < 100) {
            avisador.innerHTML = `⚠️ Falta asignar ${100 - suma}% para alcanzar el 100%.`;
            avisador.style.color = '#facc15';
        } else {
            avisador.innerHTML = `❌ La suma supera el 100% (exceso de ${suma - 100}%). Reajusta los pesos.`;
            avisador.style.color = '#f87171';
        }
    }

    tbody.innerHTML = criterios.map((c, index) => `
        <tr>
            <td>
                <input type="text" value="${c.nombre}" class="input-medieval" onchange="actualizarNombreCriterio(${index}, this.value)" style="margin:0; padding:4px 8px;">
            </td>
            <td>
                <input type="number" value="${c.peso}" min="1" max="100" class="input-medieval" onchange="actualizarPesoCriterio(${index}, this.value)" style="margin:0; width:90px; text-align:center;">
            </td>
            <td>
                <button onclick="eliminarCriterioPonderacion(${index})" class="btn-cuervo btn-accion-sm" style="background:#7f1d1d;" ${criterios.length <= 1 ? 'disabled' : ''}>🗑️ Eliminar</button>
            </td>
        </tr>
    `).join('');
}

function actualizarNombreCriterio(index, nuevoNombre) {
    const criterios = obtenerCriteriosActuales();
    criterios[index].nombre = nuevoNombre.trim();
    guardarCriteriosPonderacion(criterios);
    renderizarTablaPonderacionSuperadmin();
    cargarClasificacion();
}

function actualizarPesoCriterio(index, nuevoPeso) {
    const criterios = obtenerCriteriosActuales();
    criterios[index].peso = parseFloat(nuevoPeso) || 0;
    guardarCriteriosPonderacion(criterios);
    renderizarTablaPonderacionSuperadmin();
    cargarClasificacion();
}

function agregarNuevoCriterioPonderacion() {
    const nombreInput = document.getElementById('nuevo-criterio-nombre');
    const pesoInput = document.getElementById('nuevo-criterio-peso');

    const nombre = nombreInput.value.trim();
    const peso = parseFloat(pesoInput.value);

    if (!nombre || isNaN(peso) || peso <= 0) {
        alert("Por favor, introduce un nombre válido y un porcentaje de peso mayor que 0.");
        return;
    }

    const criterios = obtenerCriteriosActuales();
    criterios.push({ id: 'crit_' + Date.now(), nombre, peso });
    guardarCriteriosPonderacion(criterios);

    nombreInput.value = '';
    pesoInput.value = '';

    renderizarTablaPonderacionSuperadmin();
    cargarClasificacion();

    const nuevaSuma = calcularSumaPonderacion(criterios);
    if (nuevaSuma !== 100) {
        alert(`⚠️ Criterio añadido. Recuerda reajustar los pesos para que la suma total sea exactamente 100% (Suma actual: ${nuevaSuma}%).`);
    } else {
        alert("✅ Criterio añadido y la suma alcanza exactamente el 100%.");
    }
}

function eliminarCriterioPonderacion(index) {
    const criterios = obtenerCriteriosActuales();
    if (criterios.length <= 1) {
        alert("Debe haber al menos 1 criterio de valoración en la competición.");
        return;
    }
    if (confirm(`¿Eliminar el criterio "${criterios[index].nombre}"?`)) {
        criterios.splice(index, 1);
        guardarCriteriosPonderacion(criterios);
        renderizarTablaPonderacionSuperadmin();
        cargarClasificacion();
    }
}
const NOMBRES_EJEMPLO_MAESTRES = [
    "Unai", "Ainhoa", "Gorka", "Itziar", "Iker", "Amaia", "Jon", "Miren", "Koldo", "Nerea",
    "Asier", "Maite", "Eneko", "Arantza", "Oihan", "Leire", "Xabier", "Ane", "Julen", "Nora",
    "Aitor", "Sonia", "Txema", "Begoña", "Andoni", "Izaskun", "Kepa", "Irati", "Gotzon", "Nagore",
    "Gane", "Lander", "Estibaliz", "Erlantz", "Nekane", "Peio", "Uxue", "Ibon", "Garazi", "Iñaki"
];

function generarEjemploCompeticionSimulada() {
    const barrios = [
        'Casco Viejo / Siete Calles', 'Indautxu', 'Abando', 'Deusto',
        'Santutxu', 'Rekalde', 'Uribarri', 'Basurto'
    ];

    // 1. Generar 135 usuarios ficticios en todo el juego con teléfonos y PINs aleatorios
    const usuariosSimulados = Array.from({ length: 135 }, (_, idx) => {
        const nombreBase = NOMBRES_EJEMPLO_MAESTRES[idx % NOMBRES_EJEMPLO_MAESTRES.length];
        const sufijo = Math.floor(idx / NOMBRES_EJEMPLO_MAESTRES.length) + 1;
        const nombreFinal = sufijo > 1 ? `${nombreBase} ${sufijo}º` : nombreBase;
        const num = (600000100 + idx).toString();

        return {
            id: 'sim_user_' + idx,
            name: `Maestre ${nombreFinal}`,
            phone: `+34${num}`,
            role: (idx === 0) ? 'superadmin' : (idx < 5 ? 'tronista' : 'jugador'),
            pin_code: (1000 + idx).toString(),
            barrio_asignado: (idx < 5) ? barrios[idx % barrios.length] : null
        };
    });

    // Guardar lista de usuarios simulados
    localStorage.setItem('simulacion_usuarios', JSON.stringify(usuariosSimulados));

    const criterios = obtenerCriteriosActuales();

    // 2. Simular Votaciones por Barrio con los criterios dinámicos
    const votosPorBarrio = {};
    const votosPorUsuario = {};

    barrios.forEach(barrio => {
        votosPorBarrio[barrio] = { sumaNotasPonderadas: 0, numVotos: 0, sumaPorCriterio: {} };
        criterios.forEach(c => {
            votosPorBarrio[barrio].sumaPorCriterio[c.id] = 0;
        });
    });

    usuariosSimulados.forEach(user => {
        votosPorUsuario[user.phone] = [];

        const numBarriosVotados = Math.floor(Math.random() * 5) + 2;
        const barriosMezclados = [...barrios].sort(() => 0.5 - Math.random());
        const barriosElegidos = barriosMezclados.slice(0, numBarriosVotados);

        barriosElegidos.forEach(barrio => {
            let notaFinal = 0;
            const detallesVoto = { barrio, criteriosValores: {} };

            criterios.forEach(c => {
                const val = parseFloat((Math.random() * 2.5 + 7.5).toFixed(1)); // 7.5 a 10.0
                detallesVoto.criteriosValores[c.id] = val;
                notaFinal += val * (c.peso / 100);
                votosPorBarrio[barrio].sumaPorCriterio[c.id] += val;
            });

            detallesVoto.notaFinal = parseFloat(notaFinal.toFixed(2));
            votosPorUsuario[user.phone].push(detallesVoto);

            votosPorBarrio[barrio].sumaNotasPonderadas += notaFinal;
            votosPorBarrio[barrio].numVotos += 1;
        });
    });

    localStorage.setItem('simulacion_votos_usuarios', JSON.stringify(votosPorUsuario));

    // 3. Simular Participantes en Eventos (Media entre 14 y 63 participantes por evento)
    const eventosSimulados = barrios.map((barrio, idx) => {
        // Media de participantes entre 14 y 63
        const numAsistentes = Math.floor(Math.random() * (63 - 14 + 1)) + 14;
        const asistentes = [...usuariosSimulados].sort(() => 0.5 - Math.random()).slice(0, numAsistentes);

        return {
            id: 'ev_' + idx,
            barrio,
            nombre: `Gran Jornada Gastronómica de ${barrio}`,
            fecha: `2026-10-${10 + idx}`,
            totalAsistentes: numAsistentes,
            asistentes: asistentes.map(a => ({ name: a.name, phone: a.phone, role: a.role }))
        };
    });

    localStorage.setItem('simulacion_eventos_asistencia', JSON.stringify(eventosSimulados));

    // 4. Renderizar Clasificación Simulada en la Tabla
    const tbody = document.getElementById('clasificacion-body');
    if (tbody) {
        tbody.innerHTML = '';
        const listaRankings = barrios.map(b => {
            const data = votosPorBarrio[b];
            const num = data.numVotos || 1;
            const fAvg = data.festinTotal / num;
            const rAvg = data.rutasTotal / num;
            const jAvg = data.jolgorioTotal / num;
            const nota = fAvg * 0.5 + rAvg * 0.2 + jAvg * 0.3;
            return {
                nombre: b,
                festines: fAvg,
                rutas: rAvg,
                jolgorio: jAvg,
                nota: nota,
                votos: num
            };
        }).sort((a, b) => b.nota - a.nota);

        listaRankings.forEach((row, index) => {
            let posicion = index + 1;
            let insignia = `🏰 #${posicion}`;
            if (posicion === 1) insignia = '👑 Txapeldun';
            else if (posicion === 2) insignia = '⚔️ 2º';
            else if (posicion === 3) insignia = '🛡️ 3º';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${insignia}</strong></td>
                <td style="color:#fef08a;"><strong>${row.nombre}</strong></td>
                <td>${row.festines.toFixed(1)}</td>
                <td>${row.rutas.toFixed(1)}</td>
                <td>${row.jolgorio.toFixed(1)}</td>
                <td><span class="score-badge">${row.nota.toFixed(2)}</span></td>
                <td>${row.votos}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Cargar Mis Votos Personales
    cargarMisVotosPersonales();
    cargarSeccionSuperAdminParticipantes();

    alert("🎲 Partida de ejemplo generada con éxito:\n\n- 40 usuarios ficticios creados con teléfonos y PINs.\n- Votaciones ponderadas calculadas.\n- Asistencia a eventos simulada (media de 14 a 63 participantes por evento).");
}

function restaurarCompeticionCero() {
    if (confirm("¿Estás seguro de restaurar las puntuaciones de la competición a 0?")) {
        localStorage.removeItem('simulacion_usuarios');
        localStorage.removeItem('simulacion_votos_usuarios');
        localStorage.removeItem('simulacion_eventos_asistencia');
        cargarClasificacion();
        cargarMisVotosPersonales();
        cargarSeccionSuperAdminParticipantes();
        alert("🔄 Competición y simulaciones restauradas a 0.");
    }
}

function toggleFormularioEmitirVoto() {
    const div = document.getElementById('formulario-emitir-voto-div');
    if (!div) return;
    const estaVisible = div.style.display === 'block';
    div.style.display = estaVisible ? 'none' : 'block';

    if (!estaVisible) {
        poblarFormularioVoto();
    }
}

async function poblarFormularioVoto() {
    const selectBarrio = document.getElementById('voto-select-barrio');
    const containerInputs = document.getElementById('contenedor-inputs-criterios-voto');
    if (!selectBarrio || !containerInputs) return;

    if (supabaseClient) {
        const { data: casas } = await supabaseClient.from('casas').select('nombre');
        if (casas && casas.length > 0) {
            selectBarrio.innerHTML = casas.map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('');
        }
    }

    const criterios = obtenerCriteriosActuales();
    containerInputs.innerHTML = criterios.map(c => `
        <div class="form-group" style="margin-top: 10px;">
            <label style="font-size: 0.9rem;">${c.nombre} (Ponderación ${c.peso}%):</label>
            <input type="number" class="input-medieval input-criterio-val" data-crit-id="${c.id}" data-crit-peso="${c.peso}" min="1" max="10" step="0.1" placeholder="Nota de 1.0 a 10.0" required style="width: 100%;">
        </div>
    `).join('');
}

function guardarVotoBarrioUsuario(e) {
    e.preventDefault();
    const barrio = document.getElementById('voto-select-barrio').value;
    const inputs = document.querySelectorAll('.input-criterio-val');

    const sesion = localStorage.getItem('maestre_sesion');
    let phoneUsuario = '+34605676002';
    if (sesion) {
        try { phoneUsuario = JSON.parse(sesion).phone; } catch (e) { }
    }

    let notaFinal = 0;
    const detallesVoto = { barrio, criteriosValores: {} };

    inputs.forEach(input => {
        const critId = input.getAttribute('data-crit-id');
        const peso = parseFloat(input.getAttribute('data-crit-peso')) || 0;
        const val = parseFloat(input.value) || 0;

        detallesVoto.criteriosValores[critId] = val;
        notaFinal += val * (peso / 100);
    });

    detallesVoto.notaFinal = parseFloat(notaFinal.toFixed(2));

    const votosPorUsuario = JSON.parse(localStorage.getItem('simulacion_votos_usuarios') || '{}');
    if (!votosPorUsuario[phoneUsuario]) votosPorUsuario[phoneUsuario] = [];

    // Reemplazar voto anterior en el mismo barrio si existe
    const idxExistente = votosPorUsuario[phoneUsuario].findIndex(v => v.barrio === barrio);
    if (idxExistente >= 0) {
        votosPorUsuario[phoneUsuario][idxExistente] = detallesVoto;
    } else {
        votosPorUsuario[phoneUsuario].push(detallesVoto);
    }

    localStorage.setItem('simulacion_votos_usuarios', JSON.stringify(votosPorUsuario));

    alert(`🗳️ ¡Tu voto para el reino de ${barrio} ha sido registrado con éxito! (Nota Ponderada: ${detallesVoto.notaFinal})`);

    document.getElementById('formulario-emitir-voto-div').style.display = 'none';
    cargarMisVotosPersonales();
}

function cargarMisVotosPersonales() {
    const contenedor = document.getElementById('contenedor-mis-votos-body');
    if (!contenedor) return;

    const sesion = localStorage.getItem('maestre_sesion');
    let phoneUsuario = '+34605676002';
    if (sesion) {
        try { phoneUsuario = JSON.parse(sesion).phone; } catch (e) { }
    }

    const votosPorUsuario = JSON.parse(localStorage.getItem('simulacion_votos_usuarios') || '{}');
    const misVotos = votosPorUsuario[phoneUsuario] || [];

    if (misVotos.length === 0) {
        contenedor.innerHTML = `<p style="color:#d6d3d1; font-style:italic;">No has emitido votos aún o no has participado en la votación de ningún barrio.</p>`;
    } else {
        contenedor.innerHTML = `
            <div class="table-responsive">
                <table class="leaderboard-table" style="font-size: 0.9rem;">
                    <thead>
                        <tr>
                            <th>Barrio / Reino Evaluado</th>
                            <th>Nota Otorgada</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${misVotos.map(v => `
                            <tr>
                                <td style="color:#fef08a;"><strong>${v.barrio}</strong></td>
                                <td><span class="score-badge">${v.notaFinal}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
}

function cargarSeccionSuperAdminParticipantes() {
    const contenedor = document.getElementById('contenedor-participantes-eventos-body');
    const seccionPadre = document.getElementById('seccion-superadmin-participantes');
    if (!contenedor) return;

    const sesion = localStorage.getItem('maestre_sesion');
    let userRole = '';
    if (sesion) {
        try { userRole = JSON.parse(sesion).role; } catch (e) { }
    }

    if (userRole !== 'superadmin') {
        if (seccionPadre) seccionPadre.style.display = 'none';
        return;
    } else {
        if (seccionPadre) seccionPadre.style.display = 'block';
    }

    const usuariosSimulados = JSON.parse(localStorage.getItem('simulacion_usuarios') || '[]');
    const votosPorUsuario = JSON.parse(localStorage.getItem('simulacion_votos_usuarios') || '{}');
    const eventosAsistencia = JSON.parse(localStorage.getItem('simulacion_eventos_asistencia') || '[]');

    if (usuariosSimulados.length === 0) {
        contenedor.innerHTML = `<p style="color:#93c5fd;">No hay datos de simulación cargados aún. Haz clic en "🎲 Generar Partida Ejemplo" para simular a los 135 participantes.</p>`;
    } else {
        contenedor.innerHTML = `
            <div style="margin-bottom: 25px; background: rgba(30, 41, 59, 0.9); border: 1px solid #3b82f6; padding: 15px; border-radius: 6px;">
                <h4 style="color: #60a5fa; margin-top: 0;">👥 Listado General de Participantes Registrados (${usuariosSimulados.length} Maestres)</h4>
                <p style="font-size: 0.85rem; color: #cbd5e1;">Despliega cualquier participante para auditar los votos individuales otorgados a cada barrio:</p>
                
                <div style="max-height: 350px; overflow-y: auto; padding-right: 5px;">
                    ${usuariosSimulados.map(u => {
            const votosEmitidos = votosPorUsuario[u.phone] || [];
            return `
                            <details style="margin-bottom: 8px; background: rgba(15, 23, 42, 0.7); padding: 8px; border-radius: 4px; border: 1px solid #1e40af;">
                                <summary style="cursor: pointer; color: #fef08a; font-weight: bold; font-size: 0.9rem;">
                                    ${u.name} (${u.phone}) - <span style="color:#a7f3d0;">Rol: ${u.role}</span> | Votos Emitidos: ${votosEmitidos.length} barrios
                                </summary>
                                <div style="margin-top: 8px; font-size: 0.85rem; color: #e2e8f0;">
                                    ${votosEmitidos.length === 0 ? '<p style="margin:4px 0; font-style:italic; color:#94a3b8;">No ha votado en ningún barrio.</p>' : `
                                        <table style="width:100%; text-align:left; font-size:0.8rem; border-collapse:collapse; margin-top:5px;">
                                            <thead>
                                                <tr style="color:#93c5fd; border-bottom:1px solid #334155;">
                                                    <th>Barrio Votado</th>
                                                    <th>Nota Final Otorgada</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${votosEmitidos.map(v => `
                                                    <tr>
                                                        <td>${v.barrio}</td>
                                                        <td><strong style="color:#fef08a;">${v.notaFinal}</strong></td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    `}
                                </div>
                            </details>
                        `;
        }).join('')}
                </div>
            </div>

            <div style="background: rgba(30, 41, 59, 0.9); border: 1px solid #3b82f6; padding: 15px; border-radius: 6px;">
                <h4 style="color: #60a5fa; margin-top: 0;">📅 Asistencia Separada por Evento</h4>
                ${eventosAsistencia.map(ev => `
                    <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid #1e3a8a; border-radius: 6px; padding: 10px; margin-bottom: 10px;">
                        <h5 style="color: #93c5fd; margin: 0 0 5px 0;">${ev.nombre} (${ev.barrio})</h5>
                        <p style="font-size: 0.85rem; color: #cbd5e1; margin: 0 0 8px 0;">
                            <strong>Fecha:</strong> ${ev.fecha} | <strong>Asistencia Registrada:</strong> <span class="score-badge" style="background:#2563eb;">${ev.totalAsistentes} Maestres (Media 14-63)</span>
                        </p>
                        <details>
                            <summary style="cursor: pointer; color: #fef08a; font-weight: bold; font-size: 0.8rem;">Ver Asistentes Registrados en este Evento</summary>
                            <ul style="margin-top: 5px; font-size: 0.8rem; color: #cbd5e1; column-count: 2;">
                                ${ev.asistentes.map(a => `<li>${a.name} (${a.phone})</li>`).join('')}
                            </ul>
                        </details>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// ==========================================
// SISTEMA DE NAVEGACIÓN POR MENÚ DESPLEGABLE
// ==========================================
function cambiarPestana(idPestana) {
    const sesion = localStorage.getItem('maestre_sesion');
    let userRole = '';
    if (sesion) {
        try { userRole = JSON.parse(sesion).role; } catch (e) { }
    }

    const aliasTabs = {
        'pestana-clasificacion': 'pestana-clasificacion',
        'tab-clasificacion': 'pestana-clasificacion',
        'pestana-votacion-barrio': 'pestana-votacion-barrio',
        'tab-votacion-barrio': 'pestana-votacion-barrio',
        'pestana-tronistas': 'pestana-tronistas',
        'tab-tronistas': 'pestana-tronistas',
        'pestana-calendario': 'tab-calendario',
        'tab-calendario': 'tab-calendario',
        'pestana-usuarios': 'pestana-usuarios',
        'tab-usuarios': 'pestana-usuarios',
        'tab-superadmin': 'tab-superadmin',
        'pestana-barrios': 'pestana-barrios',
        'tab-barrios': 'pestana-barrios',
        'pestana-evento-final': 'pestana-evento-final',
        'tab-evento-final': 'pestana-evento-final'
    };

    const targetId = aliasTabs[idPestana] || idPestana;
    const esSuperAdmin = userRole === 'superadmin';

    if (targetId && !puedeAbrirPestana(userRole, targetId)) {
        const fallback = document.getElementById('pestana-clasificacion');
        if (fallback) fallback.style.display = 'block';
        const select = document.getElementById('select-seccion-corte');
        if (select) select.value = 'pestana-clasificacion';
        return;
    }

    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(c => c.style.display = 'none');

    const target = document.getElementById(targetId);
    if (target) target.style.display = 'block';

    const select = document.getElementById('select-seccion-corte');
    if (select && select.value !== idPestana) {
        const mappedValue = Object.keys(aliasTabs).find(key => aliasTabs[key] === targetId) || idPestana;
        select.value = mappedValue;
    }

    if (targetId === 'pestana-clasificacion') {
        cargarClasificacion();
        cargarMisVotosPersonales();
    }
    if (targetId === 'pestana-tronistas') cargarTronistas();
    if (targetId === 'tab-calendario') cargarEventos();
    if (targetId === 'pestana-usuarios') {
        if (!puedeGestionarUsuarios(userRole)) {
            const fallback = document.getElementById('pestana-clasificacion');
            if (fallback) fallback.style.display = 'block';
            return;
        }
        cargarUsuariosTabla();
        cargarSeccionSuperAdminParticipantes();
        actualizarEstadoWebhookUI();
    }
    if (targetId === 'tab-superadmin') {
        if (userRole !== 'superadmin') {
            const fallback = document.getElementById('pestana-clasificacion');
            if (fallback) fallback.style.display = 'block';
            return;
        }
        cargarSeccionSuperAdminParticipantes();
        const tbody = document.getElementById('repositorio-votos-body');
        if (tbody) {
            const votos = getRepositorioVotos ? getRepositorioVotos() : [];
            tbody.innerHTML = votos.length === 0
                ? '<tr><td colspan="5" style="text-align: center; color: #d6d3d1;">Sin votos registrados en el repositorio central.</td></tr>'
                : votos.map(v => `
                    <tr>
                        <td>${v.maestre_id || 'Sin maestre'}</td>
                        <td>${v.barrio || 'Sin barrio'}</td>
                        <td>${v.casa_visitada || 'Sin casa'}</td>
                        <td>${(v.nota_festin ?? 0)} / ${(v.nota_caminos ?? 0)} / ${(v.nota_espiritu ?? 0)}</td>
                        <td>${v.fecha_juicio || 'Sin fecha'}</td>
                    </tr>
                `).join('');
        }
    }
    if (targetId === 'pestana-barrios') cargarBarriosGrid();
    if (targetId === 'pestana-evento-final') cargarEventoFinalForm();
}


// ==========================================
// 1. PESTAÑA: TRONISTAS DE BARRIOS (EDITAR Y BORRAR TRONISTAS)
// ==========================================
async function cargarTronistas() {
    const selectBarrio = document.getElementById('tronista-barrio');
    const selectEventoBarrio = document.getElementById('evento-barrio');
    const selectBarrioTronista = document.getElementById('select-barrio-tronista');
    const selectNuevoTronistaBarrio = document.getElementById('nuevo-tronista-barrio');
    const selectUsuarioTronista = document.getElementById('select-usuario-tronista');
    const container = document.getElementById('lista-tronistas');

    let casas = [];
    if (supabaseClient) {
        const { data } = await supabaseClient.from('casas').select('id, nombre');
        casas = data || [];
    }

    const optionsBarrios = casas.map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('');
    if (selectBarrio) selectBarrio.innerHTML = optionsBarrios;
    if (selectEventoBarrio) selectEventoBarrio.innerHTML = optionsBarrios;
    if (selectBarrioTronista) selectBarrioTronista.innerHTML = optionsBarrios;
    if (selectNuevoTronistaBarrio) selectNuevoTronistaBarrio.innerHTML = optionsBarrios;

    if (supabaseClient && selectUsuarioTronista) {
        const { data: usuarios } = await supabaseClient.from('authorized_users').select('id, name, phone, role');
        if (usuarios) {
            selectUsuarioTronista.innerHTML = usuarios.map(u =>
                `<option value="${u.id}">${u.name || u.phone} (${u.role})</option>`
            ).join('');
        }
    }

    const sesion = localStorage.getItem('maestre_sesion');
    let esSuperAdmin = false;
    if (sesion) {
        try { esSuperAdmin = JSON.parse(sesion).role === 'superadmin'; } catch (e) { }
    }

    if (supabaseClient && container) {
        const { data: usuariosTronistas } = await supabaseClient
            .from('authorized_users')
            .select('*')
            .in('role', ['tronista', 'superadmin']);

        if (!usuariosTronistas || usuariosTronistas.length === 0) {
            container.innerHTML = `<p style="color:#d6d3d1;">No hay tronistas o representantes asignados aún a los barrios.</p>`;
        } else {
            container.innerHTML = usuariosTronistas.map(t => `
                <div class="card-item" style="border: 2px solid var(--oro-real); background: rgba(41, 37, 36, 0.95);">
                    <div style="font-size: 1.8rem; text-align: center; margin-bottom: 5px;">⚜️👑</div>
                    <h3 style="color:var(--oro-brillante); margin-top:0; text-align:center;">${t.name || t.phone}</h3>
                    <p style="text-align:center;"><span class="score-badge" style="background:#d97706; color:#fff;">⚜️ TRONISTA REAL</span></p>
                    <p><strong>Barrio Representado:</strong> ${t.barrio_asignado || 'Feudo por asignar'}</p>
                    <p style="font-style:italic; color:#a8a29e;">Distintivo: ${t.role === 'superadmin' ? 'Superadmin Ejerciendo de Tronista ⚔️' : 'Maestre Tronista Barrial Oficial ⚜️'}</p>
                    ${esSuperAdmin ? `
                        <div style="margin-top:10px; text-align:center;">
                            <button onclick="editarUsuario('${t.id}', '${t.phone}', '${t.name || ''}', '${t.role}', '${t.barrio_asignado || ''}')" class="btn-cuervo btn-accion-sm">✏️ Editar Tronista</button>
                            <button onclick="desasignarTronista('${t.id}')" class="btn-cuervo btn-accion-sm" style="background:#7f1d1d;">🗑️ Quitar Puesto</button>
                        </div>
                    ` : ''}
                </div>
            `).join('');
        }
    }
}

async function desasignarTronista(userId) {
    if (!puedeGestionarUsuarios((obtenerSesionActual() || {}).role)) {
        alert('Solo Superadmin puede retirar roles de tronista.');
        return;
    }
    if (confirm("¿Estás seguro de quitar a este Maestre del puesto de Tronista de Barrio?")) {
        const { error } = await supabaseClient
            .from('authorized_users')
            .update({ role: 'jugador', barrio_asignado: null })
            .eq('id', userId);

        if (error) alert("Error desasignando tronista: " + error.message);
        else {
            alert("👑 Tronista quitado de su puesto.");
            cargarTronistas();
        }
    }
}

async function crearTronistaAdmin(e) {
    e.preventDefault();
    const sesion = JSON.parse(localStorage.getItem('maestre_sesion') || 'null');
    if (!sesion || sesion.role !== 'superadmin') {
        alert('Solo un superadministrador puede añadir tronistas.');
        return;
    }

    const name = document.getElementById('nuevo-tronista-nombre').value.trim();
    const rawPhone = document.getElementById('nuevo-tronista-phone').value.trim();
    const barrio_asignado = document.getElementById('nuevo-tronista-barrio').value;
    const digitsOnly = rawPhone.replace(/\D/g, '');
    let phone = rawPhone;
    if (digitsOnly.length === 9) phone = '+34' + digitsOnly;
    else if (digitsOnly.length === 11 && digitsOnly.startsWith('34')) phone = '+' + digitsOnly;

    const { data: tronistasBarrio, error: consultaError } = await supabaseClient
        .from('authorized_users')
        .select('id')
        .eq('barrio_asignado', barrio_asignado);

    if (consultaError) {
        alert('Error comprobando el aforo de tronistas: ' + consultaError.message);
        return;
    }
    if (tronistasBarrio && tronistasBarrio.length >= 2) {
        alert(`⚠️ El barrio ${barrio_asignado} ya cuenta con el máximo permitido de 2 Tronistas.`);
        return;
    }

    const pin_code = generarPin4Digitos();
    const { error } = await supabaseClient
        .from('authorized_users')
        .insert([{ name, phone, role: 'tronista', barrio_asignado, pin_code }]);

    if (error) {
        alert('Error al crear el tronista: ' + error.message);
        return;
    }

    enviarMensajeBienvenidaWhatsApp(phone, name, pin_code);
    notificarSuperAdminsWhatsApp('ALTA_TRONISTA', { phone, name, role: 'tronista', barrio_asignado, pin_code });
    alert(`👑 Tronista creado y asignado a ${barrio_asignado}. PIN generado: ${pin_code}.`);
    document.getElementById('form-crear-tronista').reset();
    cargarTronistas();
}

async function asignarTronistaAdmin(e) {
    e.preventDefault();
    if (!puedeGestionarUsuarios((obtenerSesionActual() || {}).role)) {
        alert('Solo Superadmin puede asignar roles de tronista.');
        return;
    }
    const userId = document.getElementById('select-usuario-tronista').value;
    const barrio = document.getElementById('select-barrio-tronista').value;

    const { data: usuarioSeleccionado, error: usuarioError } = await supabaseClient
        .from('authorized_users')
        .select('id, role')
        .eq('id', userId)
        .single();

    if (usuarioError || !usuarioSeleccionado) {
        alert('No se pudo verificar el Maestre seleccionado.');
        return;
    }

    const { data: existentes, error: consultaError } = await supabaseClient
        .from('authorized_users')
        .select('id')
        .eq('barrio_asignado', barrio)
        .neq('id', userId);

    if (consultaError) {
        alert('Error comprobando el aforo de tronistas: ' + consultaError.message);
        return;
    }

    if (existentes && existentes.length >= 2) {
        alert(`⚠️ El barrio ${barrio} ya cuenta con el máximo permitido de 2 Tronistas de barrio.`);
        return;
    }

    const { error } = await supabaseClient
        .from('authorized_users')
        .update({ barrio_asignado: barrio, role: usuarioSeleccionado.role === 'superadmin' ? 'superadmin' : 'tronista' })
        .eq('id', userId);

    if (error) {
        alert("Error al asignar tronista: " + error.message);
    } else {
        alert(`👑 Maestre asignado como Tronista de ${barrio}.`);
        cargarTronistas();
    }
}

// ==========================================
// 2. PESTAÑA: CALENDARIO DE EVENTOS (EDITAR Y BORRAR)
// ==========================================
async function cargarEventos() {
    const selectEventoBarrio = document.getElementById('evento-barrio');
    const container = document.getElementById('lista-eventos');
    const user = obtenerSesionActual();
    const esTronista = user && user.role === 'tronista';
    const barrioTronista = barrioAsignadoUsuarioActual();

    if (supabaseClient && selectEventoBarrio) {
        const { data: casas } = await supabaseClient.from('casas').select('nombre');
        if (casas && casas.length > 0) {
            selectEventoBarrio.innerHTML = casas.map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('');
        }
    }

    if (esTronista && selectEventoBarrio) {
        selectEventoBarrio.value = barrioTronista || '';
        selectEventoBarrio.disabled = true;
    }

    const eventos = JSON.parse(localStorage.getItem('eventos_list') || '[]');
    const eventosVisibles = esTronista
        ? (barrioTronista ? eventos.filter(ev => ev.barrio === barrioTronista) : [])
        : eventos;

    if (container) {
        if (eventosVisibles.length === 0) {
            container.innerHTML = `<p style="color:#d6d3d1;">No hay eventos programados en el calendario.</p>`;
        } else {
            container.innerHTML = eventosVisibles.map((ev, index) => {
                const indiceReal = eventos.indexOf(ev);
                const puedeEditar = user && (user.role === 'superadmin' || puedeEditarEventoTronista(user.role, ev.barrio, ev.fecha, ev.hora));

                return `
                <div class="card-item">
                    <h3 style="color:var(--oro-brillante); margin-top:0;">📅 ${ev.nombre}</h3>
                    <p><strong>Barrio:</strong> ${ev.barrio}</p>
                    <p><strong>Fecha:</strong> ${ev.fecha}</p>
                    <p><strong>Lugar:</strong> ${ev.lugar || 'Pendiente'} | <strong>Hora:</strong> ${ev.hora || 'Pendiente'}</p>
                    <p style="color:#a8a29e;">${ev.desc || ''}</p>
                    <div style="margin-top: 10px;">
                        ${puedeEditar ? `<button onclick="editarEvento(${indiceReal})" class="btn-cuervo btn-accion-sm">✏️ Editar Evento</button>` : ''}
                        ${user && user.role === 'superadmin' ? `<button onclick="borrarEvento(${indiceReal})" class="btn-cuervo btn-accion-sm" style="background:#7f1d1d;">🗑️ Eliminar Evento</button>` : ''}
                    </div>
                </div>
            `;
            }).join('');
        }
    }
}

function editarEvento(index) {
    const eventos = JSON.parse(localStorage.getItem('eventos_list') || '[]');
    const ev = eventos[index];
    if (!ev) return;

    const user = obtenerSesionActual();
    if (!user || !puedeEditarEventoTronista(user.role, ev.barrio, ev.fecha, ev.hora)) {
        if (!user || user.role !== 'superadmin') {
            alert('Solo puedes editar eventos de tu barrio antes de su hora de inicio.');
            return;
        }
    }

    document.getElementById('evento-id-edit').value = index;
    document.getElementById('evento-barrio').value = ev.barrio;
    document.getElementById('evento-nombre').value = ev.nombre;
    document.getElementById('evento-fecha').value = ev.fecha;
    document.getElementById('evento-desc').value = ev.desc || '';
    document.getElementById('evento-lugar').value = ev.lugar || '';
    document.getElementById('evento-hora').value = ev.hora || '';

    if (user && user.role === 'tronista') {
        const eventoBarrio = document.getElementById('evento-barrio');
        const eventoNombre = document.getElementById('evento-nombre');
        const eventoFecha = document.getElementById('evento-fecha');
        const eventoDesc = document.getElementById('evento-desc');
        if (eventoBarrio) eventoBarrio.disabled = true;
        if (eventoNombre) eventoNombre.readOnly = true;
        if (eventoFecha) eventoFecha.readOnly = true;
        if (eventoDesc) eventoDesc.readOnly = true;
    }

    document.getElementById('btn-guardar-evento').innerText = "💾 Guardar Cambios de Evento";
    document.getElementById('btn-cancelar-evento').style.display = "inline-block";
}

function resetFormEvento() {
    document.getElementById('form-evento').reset();
    document.getElementById('evento-id-edit').value = "";
    const eventoNombre = document.getElementById('evento-nombre');
    const eventoBarrio = document.getElementById('evento-barrio');
    const eventoFecha = document.getElementById('evento-fecha');
    const eventoDesc = document.getElementById('evento-desc');
    const user = obtenerSesionActual();
    if (eventoBarrio) {
        eventoBarrio.disabled = Boolean(user && user.role === 'tronista');
        if (user && user.role === 'tronista') eventoBarrio.value = user.barrio_asignado || '';
    }
    if (eventoNombre) eventoNombre.readOnly = false;
    if (eventoFecha) eventoFecha.readOnly = false;
    if (eventoDesc) eventoDesc.readOnly = false;
    document.getElementById('btn-guardar-evento').innerText = "📅 Programar / Editar Evento";
    document.getElementById('btn-cancelar-evento').style.display = "none";
}

function borrarEvento(index) {
    const user = obtenerSesionActual();
    if (!user || user.role !== 'superadmin') {
        alert('Solo Superadmin puede borrar eventos.');
        return;
    }

    if (confirm("¿Deseas eliminar este evento del calendario?")) {
        const eventos = JSON.parse(localStorage.getItem('eventos_list') || '[]');
        eventos.splice(index, 1);
        localStorage.setItem('eventos_list', JSON.stringify(eventos));
        cargarEventos();
    }
}

function guardarEventoBarrio(e) {
    e.preventDefault();
    const user = obtenerSesionActual();
    const idEdit = document.getElementById('evento-id-edit').value;
    const barrio = document.getElementById('evento-barrio').value;
    const nombre = document.getElementById('evento-nombre').value.trim();
    const fecha = document.getElementById('evento-fecha').value;
    const desc = document.getElementById('evento-desc').value.trim();
    const lugar = document.getElementById('evento-lugar').value.trim();
    const hora = document.getElementById('evento-hora').value;

    const eventos = JSON.parse(localStorage.getItem('eventos_list') || '[]');

    if (!user || !puedeGestionarEventos(user.role)) {
        alert('No tienes permisos para gestionar eventos del calendario.');
        return;
    }

    if (user.role === 'tronista') {
        if (!user.barrio_asignado || barrio !== user.barrio_asignado) {
            alert('Los tronistas solo pueden publicar eventos de su barrio asignado.');
            return;
        }

        if (!fecha || new Date(`${fecha}T${hora || '00:00'}`).getTime() <= Date.now()) {
            alert('El tronista solo puede publicar eventos futuros.');
            return;
        }

        if (idEdit !== '') {
            const eventoActual = eventos[parseInt(idEdit, 10)];
            if (!eventoActual || eventoActual.barrio !== user.barrio_asignado || !puedeEditarEventoTronista(user.role, eventoActual.barrio, eventoActual.fecha, eventoActual.hora)) {
                alert('Solo puedes actualizar lugar y hora de eventos de tu barrio antes de su inicio.');
                return;
            }

            if (eventoActual.nombre !== nombre || eventoActual.fecha !== fecha || (eventoActual.desc || '') !== desc || eventoActual.barrio !== barrio) {
                alert('Como tronista solo puedes editar el lugar y la hora del evento.');
                return;
            }
        }
    }

    if (idEdit !== "") {
        const eventoActual = eventos[parseInt(idEdit, 10)] || {};
        eventos[parseInt(idEdit, 10)] = {
            ...eventoActual,
            barrio,
            nombre,
            fecha,
            desc,
            lugar,
            hora
        };
        alert(`📅 Evento '${nombre}' actualizado correctamente.`);
    } else {
        eventos.push({ barrio, nombre, fecha, desc, lugar, hora });
        alert(`📅 Evento '${nombre}' programado para el barrio ${barrio}.`);
    }

    localStorage.setItem('eventos_list', JSON.stringify(eventos));
    resetFormEvento();
    cargarEventos();
}

// ==========================================
// 3. PESTAÑA: CONTROL DE USUARIOS (MÁX 2 TRONISTAS Y ASIGNACIÓN)
// ==========================================
function toggleBarrioAsignadoUsuario(role) {
    const group = document.getElementById('group-barrio-asignado');
    if (group) {
        group.style.display = (role === 'tronista' || role === 'superadmin') ? 'block' : 'none';
    }
}

function poblarOpcionesBarrioRepresentado() {
    const selectRepresentado = document.getElementById('usuario-barrio-representado');
    const selectBarrioUser = document.getElementById('usuario-barrio-asignado');
    if (!selectRepresentado && !selectBarrioUser) return;

    const opcionesBase = [
        { nombre: 'Forastero', detalle: 'Sin barrio representado (fuera de competición)' },
        { nombre: 'Casco Viejo', detalle: 'Casco Viejo' },
        { nombre: 'Indautxu', detalle: 'Indautxu' },
        { nombre: 'Deusto', detalle: 'Deusto' },
        { nombre: 'Santutxu', detalle: 'Santutxu' },
        { nombre: 'Abando', detalle: 'Abando' },
        { nombre: 'San Mamés - Basurto', detalle: 'San Mamés - Basurto' },
        { nombre: 'Bilbao La Vieja', detalle: 'Bilbao La Vieja' },
        { nombre: 'Uribarri', detalle: 'Uribarri' },
        { nombre: 'Zorroza', detalle: 'Zorroza' }
    ];

    const opciones = opcionesBase
        .map(c => `<option value="${c.nombre}">${c.detalle}</option>`)
        .join('');

    if (selectRepresentado) selectRepresentado.innerHTML = opciones;
    if (selectBarrioUser) selectBarrioUser.innerHTML = opciones;
}

async function cargarUsuariosTabla() {
    if (!puedeGestionarUsuarios((obtenerSesionActual() || {}).role)) return;
    const tbody = document.getElementById('tabla-usuarios-body');
    const selectBarrioUser = document.getElementById('usuario-barrio-asignado');
    const selectRepresentado = document.getElementById('usuario-barrio-representado');
    if (!tbody || !supabaseClient) return;

    poblarOpcionesBarrioRepresentado();
    const { data: casas } = await supabaseClient.from('casas').select('nombre');
    const opcionesCasas = (casas || []).map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('');

    if (selectBarrioUser) {
        selectBarrioUser.innerHTML = `${opcionesCasas || ''}`;
    }
    if (selectRepresentado) {
        selectRepresentado.innerHTML = `${opcionesCasas ? '<option value="Forastero">Forastero (sin barrio representado)</option>' + opcionesCasas : '<option value="Forastero">Forastero (sin barrio representado)</option>'}`;
        if (!selectRepresentado.value) selectRepresentado.value = 'Forastero';
    }

    try {
        const { data: usuarios, error } = await supabaseClient
            .from('authorized_users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            tbody.innerHTML = `<tr><td colspan="6" style="color:#f87171; text-align:center;">Error al cargar usuarios: ${error.message}</td></tr>`;
            return;
        }

        tbody.innerHTML = usuarios.map(u => {
            const barrioRepresentado = u.barrio_representado || u.barrio_asignado || 'Forastero';
            return `
            <tr>
                <td><strong>${u.name || '(Sin nombre)'}</strong></td>
                <td>${u.phone}</td>
                <td><span class="score-badge">${u.role}</span></td>
                <td>${barrioRepresentado}</td>
                <td>${u.barrio_asignado || '-'}</td>
                <td style="color:var(--oro-brillante); font-weight:bold;">${u.pin_code || 'Generando...'}</td>
                <td>
                    <button onclick="editarUsuario('${u.id}', '${u.phone}', '${u.name || ''}', '${u.role}', '${u.barrio_asignado || ''}', '${barrioRepresentado}')" class="btn-cuervo btn-accion-sm">✏️ Editar</button>
                    <button onclick="borrarUsuario('${u.id}', '${u.phone}', '${u.name || ''}')" class="btn-cuervo btn-accion-sm" style="background:#7f1d1d;">🗑️ Borrar</button>
                    <button onclick="abrirWhatsAppDirecto('${u.phone}', '${u.name || ''}', '${u.pin_code || ''}')" class="btn-cuervo btn-accion-sm" style="background:#15803d;">💬 WhatsApp Directo</button>
                </td>
            </tr>
        `;
        }).join('');
    } catch (err) {
        console.error("Error cargando usuarios:", err);
    }
}

async function guardarUsuario(e) {
    e.preventDefault();
    const sesion = JSON.parse(localStorage.getItem('maestre_sesion') || 'null');
    const esPermitido = sesion && puedeGestionarUsuarios(sesion.role);
    if (!esPermitido) {
        alert('❌ No tienes permisos para dar de alta o gestionar usuarios.');
        return;
    }

    const idEdit = document.getElementById('usuario-id-edit').value;
    const rawPhone = document.getElementById('usuario-phone').value.trim();
    const name = document.getElementById('usuario-nombre').value.trim();
    const role = document.getElementById('usuario-role').value;
    if (!['jugador', 'tronista', 'superadmin'].includes(role)) {
        alert('El rol seleccionado no es válido.');
        return;
    }
    const barrio_representado = document.getElementById('usuario-barrio-representado')
        ? document.getElementById('usuario-barrio-representado').value || 'Forastero'
        : 'Forastero';
    const barrio_asignado = (role === 'tronista' || role === 'superadmin') ? document.getElementById('usuario-barrio-asignado').value : null;

    const digitsOnly = rawPhone.replace(/\D/g, '');
    let phone = rawPhone;
    if (digitsOnly.length === 9) phone = '+34' + digitsOnly;
    else if (digitsOnly.length === 11 && digitsOnly.startsWith('34')) phone = '+' + digitsOnly;

    // Validar límite de 2 tronistas por barrio
    if (role === 'tronista' && barrio_asignado) {
        const { data: TronistasBarrio } = await supabaseClient
            .from('authorized_users')
            .select('id')
            .eq('barrio_asignado', barrio_asignado)
            .eq('role', 'tronista');

        if (TronistasBarrio && TronistasBarrio.length >= 2 && (!idEdit || !TronistasBarrio.some(t => t.id === idEdit))) {
            alert(`⚠️ El barrio ${barrio_asignado} ya tiene asignados el máximo de 2 Tronistas.`);
            return;
        }
    }

    const pin_code = generarPin4Digitos();

    if (idEdit) {
        const { error } = await supabaseClient
            .from('authorized_users')
            .update({ phone, name, role, barrio_asignado, barrio_representado })
            .eq('id', idEdit);

        if (error) {
            alert("Error actualizando usuario: " + error.message);
        } else {
            alert("✅ Usuario actualizado correctamente.");
            notificarSuperAdminsWhatsApp("EDICIÓN_USUARIO", { phone, name, role, barrio_asignado, barrio_representado });
        }
    } else {
        const payload = { phone, role, pin_code, barrio_asignado, barrio_representado };
        if (name) payload.name = name;

        const { error } = await supabaseClient
            .from('authorized_users')
            .insert([payload]);

        if (error) {
            alert("Error al dar de alta el usuario: " + error.message);
        } else {
            enviarMensajeBienvenidaWhatsApp(phone, name, pin_code);
            alert(`🎉 ¡Alta completada para ${phone}!\n\nPIN generado: ${pin_code}.\nSe ha enviado por WhatsApp el mensaje con instrucciones.`);
            notificarSuperAdminsWhatsApp("ALTA_USUARIO", { phone, name, role, pin_code, barrio_asignado, barrio_representado });
        }
    }

    resetFormUsuario();
    cargarUsuariosTabla();
}

function editarUsuario(id, phone, name, role, barrio, barrioRepresentado) {
    if (!puedeGestionarUsuarios((obtenerSesionActual() || {}).role)) {
        alert('Solo Superadmin puede editar usuarios y sus roles.');
        return;
    }
    document.getElementById('usuario-id-edit').value = id;
    document.getElementById('usuario-phone').value = phone;
    document.getElementById('usuario-nombre').value = name;
    document.getElementById('usuario-role').value = role;

    toggleBarrioAsignadoUsuario(role);
    const barrioRepresentadoSeleccionado = barrioRepresentado || barrio || 'Forastero';
    if (document.getElementById('usuario-barrio-representado')) {
        document.getElementById('usuario-barrio-representado').value = barrioRepresentadoSeleccionado;
    }
    if (barrio && document.getElementById('usuario-barrio-asignado')) {
        document.getElementById('usuario-barrio-asignado').value = barrio;
    }

    document.getElementById('btn-guardar-user').innerText = "💾 Guardar Cambios";
    document.getElementById('btn-cancelar-user').style.display = "inline-block";
}

function resetFormUsuario() {
    document.getElementById('form-usuario').reset();
    document.getElementById('usuario-id-edit').value = "";
    const selectRepresentado = document.getElementById('usuario-barrio-representado');
    if (selectRepresentado) selectRepresentado.value = 'Forastero';
    document.getElementById('btn-guardar-user').innerText = "➕ Añadir Usuario Autorizado";
    document.getElementById('btn-cancelar-user').style.display = "none";
    toggleBarrioAsignadoUsuario('jugador');
}

async function borrarUsuario(id, phone, name) {
    if (!puedeGestionarUsuarios((obtenerSesionActual() || {}).role)) {
        alert('Solo Superadmin puede borrar usuarios y sus roles.');
        return;
    }
    if (confirm(`¿Estás seguro de revocar el acceso a ${name} (${phone})?`)) {
        const { error } = await supabaseClient
            .from('authorized_users')
            .delete()
            .eq('id', id);

        if (error) {
            alert("Error al borrar usuario: " + error.message);
        } else {
            alert("🗑️ Acceso borrado correctamente.");
            notificarSuperAdminsWhatsApp("BAJA_USUARIO", { phone, name, role: 'revocado' });
            cargarUsuariosTabla();
        }
    }
}

function abrirWhatsAppDirecto(phone, name, pin) {
    const cleanPhone = phone.replace(/\D/g, '');
    const nombreMostrar = name || 'Noble Caminante';
    const texto = `¡Hola ${nombreMostrar}! Te damos la bienvenida al LokiTrono de Barrios ⚔️👑\n\n` +
        `🔑 Tu PIN de acceso de 4 dígitos es: *${pin}*\n\n` +
        `📜 Pasos para entrar a la web:\n` +
        `1. Entra a la web del LokiTrono.\n` +
        `2. Introduce tu número de teléfono (${phone}).\n` +
        `3. Escribe tu PIN (${pin}) y pulsa Entrar.`;

    const urlWa = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(texto)}`;
    window.open(urlWa, '_blank');
}

function recuperarAcceso(phone, name, pin) {
    abrirWhatsAppDirecto(phone, name, pin || '1234');
}

// ==========================================
// 4. PESTAÑA: BARRIOS Y POBLACIONES (EDITAR Y BORRAR + LEMAS ALEATORIOS)
// ==========================================
const LEMAS_ALEATORIOS_FEUDALES = [
    "Tierra de Fuerza, Orgullo y Gastronomía",
    "Pintxo en Mano y Honor en el Corazón",
    "Donde el Sabor Conquista Reinos",
    "Cuna de Maestres y Leyendas Taberneras",
    "Fervor Gastronómico y Espada Firme",
    "El Bastión Inexpugnable del Buen Beber",
    "Tradición Feudal y Arte de la Ría",
    "Sabor Imperial en Cada Rincón"
];

function generarLemaAleatorio() {
    const index = Math.floor(Math.random() * LEMAS_ALEATORIOS_FEUDALES.length);
    document.getElementById('barrio-lema').value = LEMAS_ALEATORIOS_FEUDALES[index];
}

async function cargarBarriosGrid() {
    const container = document.getElementById('lista-barrios-grid');
    if (!container || !supabaseClient) return;

    const { data: casas } = await supabaseClient.from('casas').select('*');
    if (casas) {
        container.innerHTML = casas.map(c => `
            <div class="card-item">
                <h3 style="color:var(--oro-brillante); margin-top:0;">${c.emblema || '🏰'} ${c.nombre}</h3>
                <p style="font-style:italic; color:#a8a29e;">${c.lema || 'Sin lema asignado'}</p>
                <div style="margin-top: 10px;">
                    <button onclick="editarBarrio('${c.id}', '${c.nombre.replace(/'/g, "\\'")}', '${(c.lema || '').replace(/'/g, "\\'")}', '${c.emblema || '🏰'}')" class="btn-cuervo btn-accion-sm">✏️ Editar</button>
                    <button onclick="borrarBarrio('${c.id}', '${c.nombre.replace(/'/g, "\\'")}')" class="btn-cuervo btn-accion-sm" style="background:#7f1d1d;">🗑️ Borrar</button>
                </div>
            </div>
        `).join('');
    }
}

async function guardarBarrio(e) {
    e.preventDefault();
    const idEdit = document.getElementById('barrio-id-edit').value;
    const nombre = document.getElementById('barrio-nombre').value.trim();
    const lema = document.getElementById('barrio-lema').value.trim();
    const emblema = document.getElementById('barrio-emblema').value || '🏰';

    if (idEdit) {
        const { error } = await supabaseClient
            .from('casas')
            .update({ nombre, lema, emblema })
            .eq('id', idEdit);

        if (error) alert("Error actualizando barrio: " + error.message);
        else alert(`🏰 Barrio ${nombre} actualizado correctamente.`);
    } else {
        const { error } = await supabaseClient
            .from('casas')
            .insert([{ nombre, lema, emblema }]);

        if (error) alert("Error al añadir barrio: " + error.message);
        else alert(`🏰 ¡El reino de ${nombre} se ha unido al Lokitrono!`);
    }

    resetFormBarrio();
    cargarBarriosGrid();
}

function editarBarrio(id, nombre, lema, emblema) {
    document.getElementById('barrio-id-edit').value = id;
    document.getElementById('barrio-nombre').value = nombre;
    document.getElementById('barrio-lema').value = lema;
    document.getElementById('barrio-emblema').value = emblema;

    document.getElementById('btn-guardar-barrio').innerText = "💾 Guardar Cambios de Barrio";
    document.getElementById('btn-cancelar-barrio').style.display = "inline-block";
}

function resetFormBarrio() {
    document.getElementById('form-barrio').reset();
    document.getElementById('barrio-id-edit').value = "";
    document.getElementById('btn-guardar-barrio').innerText = "➕ Añadir Nuevo Barrio";
    document.getElementById('btn-cancelar-barrio').style.display = "none";
}

async function borrarBarrio(id, nombre) {
    if (confirm(`¿Estás seguro de eliminar el reino de ${nombre}?`)) {
        const { error } = await supabaseClient
            .from('casas')
            .delete()
            .eq('id', id);

        if (error) alert("Error borrando barrio: " + error.message);
        else {
            alert(`🗑️ Reino de ${nombre} eliminado.`);
            cargarBarriosGrid();
        }
    }
}

// ==========================================
// 5. PESTAÑA: CONFIGURAR EVENTO FINAL (EDITAR Y BORRAR)
// ==========================================
function cargarEventoFinalForm() {
    const config = JSON.parse(localStorage.getItem('evento_final_config') || 'null');
    const btnBorrar = document.getElementById('btn-borrar-gala');

    if (config) {
        document.getElementById('final-titulo').value = config.titulo || '';
        document.getElementById('final-lugar').value = config.lugar || '';
        document.getElementById('final-fecha').value = config.fecha || '';
        document.getElementById('final-premio').value = config.premio || '';
        if (btnBorrar) btnBorrar.style.display = 'inline-block';
    } else {
        if (btnBorrar) btnBorrar.style.display = 'none';
    }
}

function guardarEventoFinal(e) {
    e.preventDefault();
    const titulo = document.getElementById('final-titulo').value.trim();
    const lugar = document.getElementById('final-lugar').value.trim();
    const fecha = document.getElementById('final-fecha').value;
    const premio = document.getElementById('final-premio').value.trim();

    const configFinal = { titulo, lugar, fecha, premio };
    localStorage.setItem('evento_final_config', JSON.stringify(configFinal));

    alert("👑 ¡La Gran Gala Final del Lokitrono ha sido configurada y guardada con éxito!");
    cargarEventoFinalForm();
}

function borrarConfiguracionGalaFinal() {
    if (confirm("¿Deseas eliminar la configuración de la Gran Gala Final?")) {
        localStorage.removeItem('evento_final_config');
        document.getElementById('form-evento-final').reset();
        alert("🗑️ Configuración de la Gala Final eliminada.");
        cargarEventoFinalForm();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarEstadoUI();
    cargarClasificacion();
});




