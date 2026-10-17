const STORAGE_KEYS = {
    usuarioActual: 'usuario_actual',
    repositorioVotos: 'repositorio_votos',
    usuarios: 'usuarios_autorizados',
    barrios: 'barrios_reino'
};

/* ==========================================
   MODO EDICIÓN (resaltado visual de formularios)
   ==========================================
   Aplica un color distintivo al formulario cuando se está editando un
   registro existente (usuario, barrio, evento, rol, votos…) para
   diferenciarlo claramente de la creación de uno nuevo. */
function activarModoEdicion(form, etiqueta) {
    const formulario = typeof form === 'string' ? document.getElementById(form) : form;
    if (!formulario) return null;
    formulario.classList.add('modo-edicion');
    formulario.setAttribute(
        'data-modo-edicion',
        `✏️ MODO EDICIÓN — ${etiqueta || 'modificando un registro existente'}`
    );
    return formulario;
}

function desactivarModoEdicion(form) {
    const formulario = typeof form === 'string' ? document.getElementById(form) : form;
    if (!formulario) return null;
    formulario.classList.remove('modo-edicion');
    formulario.removeAttribute('data-modo-edicion');
    return formulario;
}

const EVENTOS_FEUDALES = [
    { id: 'evt-01', nombre: 'Ruta del Pintxo del Casco Viejo', barrio: 'Casco Viejo', casaId: 'casa-01', fecha: '2026-10-10', hora: '20:30', lugar: 'Plaza Nueva' },
    { id: 'evt-02', nombre: 'Velada de Indautxu', barrio: 'Indautxu', casaId: 'casa-02', fecha: '2026-10-11', hora: '21:00', lugar: 'Avenida Lehendakari Aguirre' },
    { id: 'evt-03', nombre: 'Noches de Deusto', barrio: 'Deusto', casaId: 'casa-03', fecha: '2026-10-12', hora: '19:45', lugar: 'Muelle del Abra' },
    { id: 'evt-04', nombre: 'Tarde de Santutxu', barrio: 'Santutxu', casaId: 'casa-04', fecha: '2026-10-13', hora: '18:30', lugar: 'Avenida de la Libertad' },
    { id: 'evt-05', nombre: 'Día de Abando', barrio: 'Abando', casaId: 'casa-05', fecha: '2026-10-14', hora: '20:00', lugar: 'Gran Vía 1' },
    { id: 'evt-06', nombre: 'Pasión en San Mamés', barrio: 'San Mamés - Basurto', casaId: 'casa-06', fecha: '2026-10-15', hora: '21:30', lugar: 'Campo de San Mamés' }
];

function puedeGestionarUsuarios(role) {
    return role === 'superadmin' || role === 'master';
}

function puedeGestionarEventosBarrio(role) {
    return role === 'superadmin' || role === 'master';
}

/*
 * Jerarquía feudal de la corte:
 *   master > superadmin > tronista (lokitronista) / jugador (maestre)
 *
 * El master (Administración) y los superadmins gestionan usuarios, barrios y eventos.
 * Maestres y lokitronistas no crean roles, barrios ni eventos.
 */
const ROLES_VALIDOS = ['jugador', 'tronista', 'superadmin'];

function esRolMaster(role) {
    return role === 'master';
}

// Administradores de la corte: superadmin y master comparten el panel de gestión.
function puedeAdministrar(role) {
    return role === 'superadmin' || role === 'master';
}

// ¿Puede el actor asignar/crear el rol indicado?
function puedeAsignarRol(actorRole, targetRole) {
    if (actorRole === 'master') return targetRole === 'jugador' || targetRole === 'tronista' || targetRole === 'superadmin';
    if (actorRole === 'superadmin') return targetRole === 'jugador' || targetRole === 'tronista';
    return false;
}

// ¿Puede el actor editar o eliminar a un usuario que ya tiene cierto rol?
function puedeGestionarRolDe(actorRole, targetRole) {
    if (actorRole === 'master') return true;
    if (actorRole === 'superadmin') return targetRole === 'jugador' || targetRole === 'tronista';
    return false;
}

// Un lokitronista (tronista) no vota en eventos celebrados en su propio barrio.
function lokitronistaNoPuedeVotarEn(evento, usuario) {
    if (!usuario || usuario.role !== 'tronista' || !evento) return false;
    const objetivo = String(evento.barrio || '').trim().toLowerCase();
    if (!objetivo) return false;
    const representado = String(usuario.barrio_representado || '').trim().toLowerCase();
    const asignado = String(usuario.barrio_asignado || '').trim().toLowerCase();
    return (representado && representado !== 'forastero' && representado === objetivo) ||
        (asignado && asignado === objetivo);
}

function getCurrentUser() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.usuarioActual);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        return null;
    }
}

function setCurrentUser(user) {
    localStorage.setItem(STORAGE_KEYS.usuarioActual, JSON.stringify(user || null));
}

const PESTANAS_ADMIN = ['pestana-generar-evento', 'tab-superadmin', 'pestana-usuarios', 'pestana-barrios', 'pestana-sorteo-eventos', 'pestana-oraculo-ia', 'pestana-locales-promocion'];

/* ==========================================
   FIN DEL JUEGO: ESTADO, PROTECCIÓN Y BLOQUEO
   ========================================== */

const STORAGE_KEY_ESTADO_JUEGO = 'lokitrono_estado_juego';
let estadoJuegoDetalle = null;
let estadoJuegoFinalizado = false;

// ¿El juego (competición real) está finalizado y sus datos protegidos?
function juegoEstaFinalizado() {
    return estadoJuegoFinalizado === true;
}

// ¿Ha transcurrido ya la fecha de la Gran Gala Final?
function galaFinalTranscurrida() {
    try {
        const cfg = getGalaFinalConfig();
        if (!cfg || !cfg.fecha) return false;
        const fin = new Date(cfg.fecha);
        if (isNaN(fin.getTime())) return false;
        return Date.now() >= fin.getTime();
    } catch (error) {
        return false;
    }
}

// El juego concluye cuando TODOS los eventos con votación han cerrado su
// votación y ya se ha celebrado la Gran Gala Final.
function juegoConcluidoAutomaticamente() {
    try {
        return competicionVotacionCompleta() && galaFinalTranscurrida();
    } catch (error) {
        return false;
    }
}

// Situación de "fin de juego" (por sellado manual o por conclusión natural).
function restriccionFinDeJuegoActiva() {
    return juegoEstaFinalizado() || juegoConcluidoAutomaticamente();
}

// Cuando el juego está sellado, nadie escribe hasta que el Administrador lo reabra.
function puedeEscribirAhora() {
    return !juegoEstaFinalizado();
}

// Aviso estándar para operaciones bloqueadas por el sellado del juego.
function avisoJuegoFinalizado() {
    alert('🏁 El juego está FINALIZADO y sus datos protegidos. Solo la administración puede reabrirlo para volver a modificarlos.');
}

async function cargarEstadoJuego() {
    try {
        const client = getSupabaseBarriosClient();
        if (client) {
            const { data, error } = await client.rpc('estado_juego_actual');
            if (error) throw error;
            if (data) {
                estadoJuegoDetalle = data;
                estadoJuegoFinalizado = data.finalizado === true;
                try { localStorage.setItem(STORAGE_KEY_ESTADO_JUEGO, JSON.stringify(data)); } catch (_) {}
            }
        }
    } catch (error) {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_ESTADO_JUEGO);
            if (raw) {
                const data = JSON.parse(raw);
                estadoJuegoDetalle = data;
                estadoJuegoFinalizado = data.finalizado === true;
            }
        } catch (_) {}
    }
    aplicarFinDeJuegoUI();
}

// FINALIZAR / REABRIR el juego (exclusivo del Administrador).
async function finalizarJuegoSupabase(finalizar) {
    const usuario = getCurrentUser();
    if (!usuario || !esRolMaster(usuario.role)) {
        alert('Acceso restringido: solo el Administrador (Administración) puede finalizar o reabrir el juego.');
        return;
    }
    if (!usuario.token) {
        alert('No se pudo verificar la sesión (falta el token). Vuelve a iniciar sesión.');
        return;
    }
    if (!finalizar) {
        const ok = confirm('¿Reabrir el juego? Los datos dejarán de estar protegidos y podrán volver a modificarse.');
        if (!ok) return;
    } else {
        const ok = confirm('¿FINALIZAR el juego y proteger sus datos? Después solo el Administrador podrá reabrirlo.');
        if (!ok) return;
    }

    const client = getSupabaseBarriosClient();
    if (!client) {
        alert('No se ha podido conectar con el servidor de la competición.');
        return;
    }
    try {
        const { data, error } = await client.rpc('finalizar_juego', {
            p_token: usuario.token,
            p_finalizado: !!finalizar
        });
        if (error) throw error;
        estadoJuegoDetalle = data || null;
        estadoJuegoFinalizado = !!(data && data.finalizado === true);
        try { localStorage.setItem(STORAGE_KEY_ESTADO_JUEGO, JSON.stringify(estadoJuegoDetalle)); } catch (_) {}
        if (typeof mostrarNotificacionGlobal === 'function') {
            mostrarNotificacionGlobal(
                finalizar
                    ? '🏁 El juego ha finalizado. Los datos de la competición quedan protegidos.'
                    : '🔓 El juego ha sido reabierto. Los datos vuelven a ser modificables.',
                finalizar ? 'exito' : 'info'
            );
        }
        aplicarFinDeJuegoUI();
    } catch (error) {
        alert('No se pudo actualizar el estado del juego: ' + (error.message || error));
    }
}

// Refresca el aviso global y el panel de control del fin de juego.
function aplicarFinDeJuegoUI() {
    const usuario = getCurrentUser();
    const esMaster = !!(usuario && esRolMaster(usuario.role));

    const panel = document.getElementById('panel-fin-juego');
    if (panel) panel.style.display = esMaster ? 'block' : 'none';

    const btn = document.getElementById('btn-finalizar-juego');
    if (btn) {
        btn.textContent = juegoEstaFinalizado() ? '🔓 REABRIR JUEGO' : '🏁 FINALIZAR JUEGO';
        btn.style.background = juegoEstaFinalizado() ? '#166534' : '#b45309';
    }

    const estadoTxt = document.getElementById('fin-juego-estado');
    if (estadoTxt) {
        if (juegoEstaFinalizado()) {
            const quien = estadoJuegoDetalle && estadoJuegoDetalle.finalizado_por ? ' por ' + estadoJuegoDetalle.finalizado_por : '';
            estadoTxt.innerHTML = `🔒 Juego <strong>FINALIZADO</strong>${quien}. Los datos están protegidos.`;
        } else if (juegoConcluidoAutomaticamente()) {
            estadoTxt.innerHTML = '⏳ Todos los eventos con votación y la Gran Gala Final han concluido. Puedes <strong>finalizar el juego</strong> para sellar y proteger los datos.';
        } else {
            estadoTxt.innerHTML = 'El juego está en curso.';
        }
    }

    const banner = document.getElementById('banner-fin-juego');
    if (banner) {
        const activo = restriccionFinDeJuegoActiva();
        banner.style.display = activo ? 'block' : 'none';
        const det = document.getElementById('banner-fin-juego-detalle');
        if (det) {
            det.textContent = juegoEstaFinalizado()
                ? 'La competición oficial está cerrada y sus datos protegidos. Solo se muestra el resultado final.'
                : 'La competición ha concluido (último evento con votación y Gala Final). Solo se muestra el resultado final.';
        }
    }

    aplicarRestriccionNavegacionFinJuego();
}

// Tras concluir el juego, los roles no administradores solo acceden a Clasificación.
function aplicarRestriccionNavegacionFinJuego() {
    const usuario = getCurrentUser();
    const restringido = restriccionFinDeJuegoActiva() && !(usuario && puedeAdministrar(usuario.role));
    const select = document.getElementById('select-seccion-corte');
    if (select) {
        Array.from(select.options).forEach(opt => {
            opt.disabled = restringido && opt.value !== 'pestana-clasificacion';
        });
        Array.from(select.querySelectorAll('optgroup')).forEach(g => {
            const hayHabilitada = Array.from(g.querySelectorAll('option')).some(o => !o.disabled);
            g.disabled = restringido && !hayHabilitada;
        });
    }
    if (restringido) {
        const activa = document.querySelector('.tab-content.active');
        if (!activa || activa.id !== 'pestana-clasificacion') {
            cambiarPestana('pestana-clasificacion');
        }
    }
}

window.finalizarJuegoSupabase = finalizarJuegoSupabase;
window.cargarEstadoJuego = cargarEstadoJuego;
window.juegoEstaFinalizado = juegoEstaFinalizado;
window.juegoConcluidoAutomaticamente = juegoConcluidoAutomaticamente;
window.restriccionFinDeJuegoActiva = restriccionFinDeJuegoActiva;


function cambiarPestana(valor) {
    const usuario = getCurrentUser();
    const esSuperadmin = !!(usuario && puedeAdministrar(usuario.role));
    const esMaster = !!(usuario && esRolMaster(usuario.role));
    // El Oráculo Imperial es territorio exclusivo del Administración (rol master).
    const esOraculo = valor === 'pestana-oraculo-ia' || valor === 'tab-oraculo-ia';
    if (esOraculo && !esMaster) {
        valor = 'pestana-clasificacion';
    }
    const esLocalesPromocion = valor === 'pestana-locales-promocion' || valor === 'tab-locales-promocion';
    if (esLocalesPromocion && !esMaster) {
        valor = 'pestana-clasificacion';
    }
    if (!esSuperadmin && PESTANAS_ADMIN.includes(valor)) {
        valor = 'pestana-clasificacion';
    }
    // La Gala Final permanece oculta a los no administradores hasta publicarse.
    if ((valor === 'pestana-evento-final' || valor === 'tab-evento-final')
        && !esSuperadmin && !galaFinalEstaPublicada()) {
        valor = 'pestana-clasificacion';
    }
    // Con el juego concluido, los roles no administradores solo ven Clasificación.
    if (!esSuperadmin && typeof restriccionFinDeJuegoActiva === 'function' && restriccionFinDeJuegoActiva() && valor !== 'pestana-clasificacion') {
        valor = 'pestana-clasificacion';
    }
    if (esLocalesPromocion && esMaster && typeof cargarLocalesPromocion === 'function') {
        cargarLocalesPromocion();
    }
    if (valor === 'pestana-sorteo-eventos' && esSuperadmin && typeof cargarOrdenSorteoBarrios === 'function') {
        cargarOrdenSorteoBarrios();
    }
    const sections = document.querySelectorAll('.tab-content');
    sections.forEach(section => {
        const shouldShow = section.id === valor || section.dataset.tab === valor;
        section.style.display = shouldShow ? 'block' : 'none';
        section.classList.toggle('active', shouldShow);
    });
    const selector = document.getElementById('select-seccion-corte');
    if (selector && selector.value !== valor) selector.value = valor;
}

function actualizarInterfazSesion(usuario) {
    const loginBox = document.getElementById('pantalla-login-inicio');
    const authStatus = document.getElementById('auth-status');
    const nav = document.getElementById('nav-secciones-corte');
    const contenido = document.getElementById('contenido-reino-protegido');
    const optgroupAdmin = document.getElementById('optgroup-admin-menu');

    if (typeof lokibotActualizarVisibilidad === 'function') lokibotActualizarVisibilidad(usuario);

    if (usuario) {
        if (loginBox) loginBox.style.display = 'none';
        if (authStatus) {
            authStatus.style.display = 'block';
            authStatus.innerHTML = `
                <div class="pill-user" style="display: inline-flex; align-items: center; gap: 15px; background: rgba(10,10,10,0.9); border: 1px solid var(--oro-real); padding: 8px 16px; border-radius: 20px;">
                    <span><strong>Maestre en la corte:</strong> <strong>${getTituloCompleto(usuario)}</strong></span>
                    <button onclick="cerrarSesionDirecta()" class="btn-cuervo" style="padding: 4px 10px; font-size: 0.8rem; background: #7f1d1d;">🚪 Cerrar Sesión</button>
                </div>
            `;
        }
        if (nav) nav.style.display = 'block';
        if (contenido) contenido.style.display = 'block';
        const esSuperadmin = puedeAdministrar(usuario.role);
        if (optgroupAdmin) optgroupAdmin.style.display = esSuperadmin ? '' : 'none';
        const optConfigJuego = document.querySelector("option[value=\"tab-superadmin\"]");
        if (optConfigJuego) optConfigJuego.style.display = usuario.role === "master" ? "" : "none";
        // La Gala Final solo aparece a los maestres cuando ya está publicada.
        aplicarVisibilidadGalaFinal();
        if (typeof cargarGalaFinalDesdeSupabase === 'function') cargarGalaFinalDesdeSupabase();
        const panelTronistasAdmin = document.getElementById('panel-superadmin-tronistas');
        if (panelTronistasAdmin) panelTronistasAdmin.style.display = esSuperadmin ? 'block' : 'none';
        const panelConfigTitulos = document.getElementById('panel-config-titulos-usuarios');
        if (panelConfigTitulos) panelConfigTitulos.style.display = esSuperadmin ? 'block' : 'none';

        const panelSorteo = document.getElementById('panel-sorteo-barrios');
        if (panelSorteo) panelSorteo.style.display = esSuperadmin ? 'block' : 'none';

        const esMaster = esRolMaster(usuario.role);
        const optgroupMaster = document.getElementById('optgroup-oraculo-menu');
        if (optgroupMaster) optgroupMaster.style.display = esMaster ? '' : 'none';
        const optgroupLocales = document.getElementById('optgroup-locales-menu');
        if (optgroupLocales) optgroupLocales.style.display = esMaster ? '' : 'none';
        const grupoPin = document.getElementById('group-usuario-pin');
        if (grupoPin) grupoPin.style.display = esMaster ? 'block' : 'none';
        const accionesCredenciales = document.getElementById('acciones-credenciales-pin');
        if (accionesCredenciales) accionesCredenciales.style.display = esMaster ? 'block' : 'none';

        if (typeof renderOpcionesRolUsuario === 'function') renderOpcionesRolUsuario();
        if (typeof actualizarBadgeMake === 'function') actualizarBadgeMake();

        if (esSuperadmin) iniciarAutoRefreshUsuarios();
        else detenerAutoRefreshUsuarios();

        // Relee los votos centrales al iniciar sesión para que la Clasificación
        // muestre siempre el repositorio común de Supabase, no la caché previa.
        if (typeof cargarVotosDesdeSupabase === 'function') cargarVotosDesdeSupabase();

        cambiarPestana('pestana-clasificacion');
        if (typeof aplicarFinDeJuegoUI === 'function') aplicarFinDeJuegoUI();

        // Nombre de la edición bajo la portada y guías de primer uso.
        if (typeof aplicarNombreJuego === 'function') aplicarNombreJuego();
        if (typeof actualizarVisibilidadTutorialConfig === 'function') actualizarVisibilidadTutorialConfig(usuario);
        if (typeof iniciarGuiasPrimerUso === 'function') iniciarGuiasPrimerUso(usuario);
    } else {
        detenerAutoRefreshUsuarios();
        const panelSorteo = document.getElementById('panel-sorteo-barrios');
        if (panelSorteo) panelSorteo.style.display = 'none';

        if (loginBox) loginBox.style.display = 'block';
        if (authStatus) {
            authStatus.style.display = 'none';
            authStatus.innerHTML = '';
        }
        if (nav) nav.style.display = 'none';
        if (contenido) contenido.style.display = 'none';

        cambiarPestana('pestana-clasificacion');
    }
}


function cerrarSesionDirecta() {
    const usuario = getCurrentUser();
    if (usuario && usuario.token) {
        const client = getSupabaseBarriosClient();
        if (client) {
            Promise.resolve(client.rpc('cerrar_sesion_lokitrono', { p_token: usuario.token })).catch(() => {});
        }
    }
    detenerAutoRefreshUsuarios();
    setCurrentUser(null);
    actualizarInterfazSesion(null);
}

function getUsuariosAutorizadosLocal() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.usuarios);
        let usuarios = raw ? JSON.parse(raw) : [];
        const superadminPhones = ['605676002', '+34605676002', '123456789', 'admin', '456123456'];
        
        if (!Array.isArray(usuarios) || usuarios.length === 0) {
            usuarios = [
                { id: 'user-julio-01', phone: '605676002', name: 'Julio', role: 'master', pin_code: '123456', barrio_representado: 'Forastero', barrio_asignado: 'Zorrotza' },
                { id: 'user-julio-02', phone: '+34605676002', name: 'Julio', role: 'master', pin_code: '123456', barrio_representado: 'Forastero', barrio_asignado: 'Zorrotza' },
                { id: 'user-superadmin-01', phone: '123456789', name: 'Superadmin Bilbao', role: 'superadmin', pin_code: '123456', barrio_representado: 'Abando', barrio_asignado: 'Abando' },
                { id: 'user-superadmin-02', phone: 'admin', name: 'Superadmin Sistema', role: 'superadmin', pin_code: '123456', barrio_representado: 'Abando', barrio_asignado: 'Abando' },
                { id: 'user-soraya', phone: '456123456', name: 'SORAYA', role: 'superadmin', pin_code: '123456', barrio_representado: 'Deusto', barrio_asignado: 'Deusto' },
                { id: 'user-ainhoa-01', phone: '663366786', name: 'Ainhoa', role: 'jugador', pin_code: '123456', barrio_representado: 'Deusto', barrio_asignado: '' }
            ];
            localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(usuarios));
        } else {
            // Asegurar que las cuentas con teléfonos superadmin tengan el rol superadmin actualizado
            let actualizado = false;
            usuarios.forEach(u => {
                if (superadminPhones.includes(u.phone) && u.role !== 'superadmin' && u.role !== 'master') {
                    u.role = 'superadmin';
                    actualizado = true;
                }
                // El autor de la aplicación ostenta en exclusiva el Administración (rol master).
                if (String(u.phone || '').replace(/\D/g, '').slice(-9) === '605676002') {
                    if (u.role !== 'master' || u.name !== 'Julio' || u.barrio_asignado !== 'Zorrotza') {
                        u.role = 'master';
                        u.name = 'Julio';
                        u.barrio_asignado = 'Zorrotza';
                        actualizado = true;
                    }
                }
            });
            const tieneMaster = usuarios.some(u =>
                String(u.phone || '').replace(/\D/g, '').slice(-9) === '605676002'
            );
            if (!tieneMaster) {
                usuarios.push({
                    id: 'user-julio-master',
                    phone: '605676002',
                    name: 'Julio',
                    role: 'master',
                    pin_code: '123456',
                    barrio_representado: 'Forastero',
                    barrio_asignado: 'Zorrotza'
                });
                actualizado = true;
            }
            if (actualizado) {
                localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(usuarios));
            }
        }
        // Barrio por defecto «Forastero» cuando no se configura ninguno.
        let barriosNormalizados = false;
        usuarios.forEach(u => {
            if (!u.barrio_asignado) { u.barrio_asignado = 'Forastero'; barriosNormalizados = true; }
            if (!u.barrio_representado) { u.barrio_representado = 'Forastero'; barriosNormalizados = true; }
        });
        if (barriosNormalizados) {
            localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(usuarios));
        }
        return usuarios;
    } catch (e) {
        return [];
    }
}

/* ==========================================
   SISTEMA DE TÍTULOS Y RANGOS
   ========================================== */

const TITULOS_CONFIG_DEFAULT = {
    jugador_masculino: 'Lord',
    jugador_femenino: 'Lady',
    tronista_masculino: 'Lokitronista Lord',
    tronista_femenino: 'Lokitronista Lady',
    superadmin_masculino: 'Gran Maestre',
    superadmin_femenino: 'Gran Maestra',
    master_masculino: ' Administrador',
    master_femenino: ' Administradora',
    consejero_masculino: 'Consejero del LokiTrono',
    consejero_femenino: 'Consejera del LokiTrono'
};

const CONSEJEROS_ESPECIALES = ['605676002', '+34605676002', '663366786'];

function getTituloConfig() {
    try {
        const raw = localStorage.getItem('titulos_usuarios_config');
        if (raw) {
            return { ...TITULOS_CONFIG_DEFAULT, ...JSON.parse(raw) };
        }
    } catch (e) { /* noop */ }
    return { ...TITULOS_CONFIG_DEFAULT };
}

function guardarTitulosConfig(config) {
    try {
        if (config && typeof config === 'object') {
            localStorage.setItem('titulos_usuarios_config', JSON.stringify(config));
        } else {
            // Save from form inputs
            const cfg = {};
            ['jugador_masculino', 'jugador_femenino', 'tronista_masculino', 'tronista_femenino',
             'superadmin_masculino', 'superadmin_femenino', 'master_masculino', 'master_femenino'].forEach(key => {
                const el = document.getElementById(`titulo-config-${key}`);
                if (el) cfg[key] = el.value.trim() || TITULOS_CONFIG_DEFAULT[key];
            });
            localStorage.setItem('titulos_usuarios_config', JSON.stringify(cfg));
            alert('✅ Configuración de títulos guardada.');
            renderTablaUsuarios();
            renderListaTronistas();
        }
    } catch (e) { /* noop */ }
}

function getIconoRango(rol, phone) {
    if (phone && CONSEJEROS_ESPECIALES.includes(String(phone))) return '💎';
    if (rol === 'master') return '🌟';
    if (rol === 'superadmin') return '🏰';
    if (rol === 'tronista') return '👑';
    return '⚔️';
}

function getTituloCompleto(usuario) {
    if (!usuario) return '';
    const config = getTituloConfig();
    const phone = String(usuario.phone || '');
    const rol = usuario.role || 'jugador';
    const nombre = usuario.name || phone;

    // Título personalizado overrides everything
    if (usuario.titulo_custom && usuario.titulo_custom.trim()) {
        const icon = getIconoRango(rol, phone);
        return `${icon} ${usuario.titulo_custom.trim()} ${nombre}`;
    }

    const icon = getIconoRango(rol, phone);

    // Consejeros del Lokitrono (usuarios especiales de la corte)
    if (CONSEJEROS_ESPECIALES.includes(phone)) {
        // Ainhoa → Consejera del LokiTrono (663366786)
        const esVeladora = phone === '663366786';
        const titulo = esVeladora ? config.consejero_femenino : config.consejero_masculino;
        return `${icon} ${titulo} ${nombre}`;
    }

    let titulo = '';
    const gender = usuario.gender || 'M';
    if (rol === 'master') {
        titulo = gender === 'F' ? (config.master_femenino || ' Administradora') : (config.master_masculino || ' Administrador');
    } else if (rol === 'superadmin') {
        titulo = gender === 'F' ? config.superadmin_femenino : config.superadmin_masculino;
    } else if (rol === 'tronista') {
        titulo = gender === 'F' ? config.tronista_femenino : config.tronista_masculino;
    } else {
        titulo = gender === 'F' ? config.jugador_femenino : config.jugador_masculino;
    }

    return `${icon} ${titulo} ${nombre}`;
}



async function iniciarSesionDirecta() {
    const phoneInput = document.getElementById('input-phone-inicio');
    const pinInput = document.getElementById('input-pin-inicio');
    const message = document.getElementById('login-inicio-message');
    const button = document.querySelector('#login-step-phone button');

    const phone = (phoneInput?.value || '').trim();
    const pin = (pinInput?.value || '').trim();

    if (!phone || !pin) {
        if (message) message.textContent = 'Completa teléfono y PIN para entrar.';
        return;
    }
    if (!/^\d{6}$/.test(pin)) {
        if (message) message.textContent = 'El PIN debe contener exactamente seis dígitos.';
        return;
    }

    // La identidad y el rol deben proceder de Supabase, no de localStorage.
    const client = getSupabaseBarriosClient();
    if (!client) {
        if (message) message.textContent = 'No se ha podido conectar con Supabase. Comprueba la configuración e inténtalo de nuevo.';
        return;
    }

    if (button) button.disabled = true;
    if (message) message.textContent = 'Verificando credenciales…';
    if (typeof window.mostrarEsperaMedieval === 'function') {
        window.mostrarEsperaMedieval('Consultando el Códice Real...', '«Verificando credenciales con los escribanos de Supabase»');
    }
    try {
        const { data, error } = await client.rpc('validar_login_lokitrono', {
            p_phone: phone,
            p_pin: pin
        });
        if (error) throw error;
        if (!data || !data.phone || !data.role) {
            throw new Error('Teléfono o PIN incorrectos, o cuenta no autorizada.');
        }

        const usuario = {
            id: data.id,
            phone: data.phone,
            name: data.name || data.phone,
            email: data.email || null,
            role: data.role,
            barrio_asignado: data.barrio_asignado || 'Forastero',
            barrio_representado: data.barrio_representado || 'Forastero',
            gender: data.gender || 'M',
            titulo_custom: data.titulo_custom || '',
            token: data.token || '',
            token_expira_en: data.token_expira_en || null
        };
        setCurrentUser(usuario);
        // Mantener una copia de visualización actualizada, sin guardar el PIN.
        const usuarios = getUsuariosAutorizadosLocal().filter(u => u.phone !== usuario.phone);
        usuarios.push(usuario);
        localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(usuarios));
        if (message) message.textContent = '';
        actualizarInterfazSesion(usuario);
        if (typeof renderTablaUsuarios === 'function') renderTablaUsuarios();
    } catch (error) {
        console.error('Error de inicio de sesión:', error);
        if (message) message.textContent = error.message?.includes('Teléfono o PIN incorrectos')
            ? error.message
            : 'No se pudo validar la cuenta en Supabase. Comprueba que se haya aplicado la migración de acceso.';
    } finally {
        if (typeof window.ocultarEsperaMedieval === 'function') {
            window.ocultarEsperaMedieval();
        }
        if (button) button.disabled = false;
    }
}

function toggleFormularioEmitirVoto() {
    const panel = document.getElementById('formulario-emitir-voto-div');
    if (!panel) return;
    const isVisible = panel.style.display !== 'none';
    panel.style.display = isVisible ? 'none' : 'block';
}

// Devuelve el primer evento cuya ventana de votación está abierta ahora mismo.
function getEventoVotacionActivo() {
    return getEventosDelAmbito().find(evento => {
        try {
            return obtenerEstadoVotacionEvento(evento).estado === 'ABIERTA';
        } catch (error) {
            return false;
        }
    }) || null;
}

function abrirPanelPuntuacion() {
    const panel = document.getElementById('formulario-emitir-voto-div');
    if (!panel) return;
    const evento = getEventoVotacionActivo();
    if (!evento) {
        actualizarBloqueVotacion();
        return;
    }
    const selectEvento = document.getElementById('voto-select-evento');
    if (selectEvento) selectEvento.value = String(evento.id);
    const campoBarrio = document.getElementById('voto-barrio-evento');
    if (campoBarrio) campoBarrio.value = evento.barrio || '';
    const selectBarrio = document.getElementById('voto-select-barrio');
    if (selectBarrio && evento.barrio) selectBarrio.value = evento.barrio;
    panel.style.display = 'block';
    actualizarEstadoFormularioVoto();
    actualizarResumenesVoto();
    try {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) { /* navegadores antiguos */ }
}

function cerrarPanelPuntuacion() {
    const panel = document.getElementById('formulario-emitir-voto-div');
    if (panel) panel.style.display = 'none';
}

// Bloque 1 en tiempo real: muestra el barrio a puntuar y habilita/deshabilita el
// botón VOTAR según la ventana del evento activo, el voto único y la neutralidad.
function actualizarBloqueVotacion() {
    const sinActividad = document.getElementById('voto-sin-actividad');
    const actividad = document.getElementById('voto-actividad');
    if (!sinActividad || !actividad) return;

    const evento = getEventoVotacionActivo();
    const panel = document.getElementById('formulario-emitir-voto-div');

    if (!evento) {
        sinActividad.style.display = 'block';
        actividad.style.display = 'none';
        if (panel && panel.style.display !== 'none') panel.style.display = 'none';
        return;
    }

    sinActividad.style.display = 'none';
    actividad.style.display = 'block';

    const user = getCurrentUser();
    const estado = obtenerEstadoVotacionEvento(evento);

    const barrioEl = document.getElementById('voto-barrio-objetivo');
    const eventoEl = document.getElementById('voto-evento-objetivo');
    const ventanaEl = document.getElementById('voto-ventana-objetivo');
    if (barrioEl) barrioEl.textContent = evento.barrio || 'Reino sin nombre';
    if (eventoEl) {
        eventoEl.textContent = `Evento: ${evento.nombre || evento.barrio || 'Justa'}${evento.fecha ? ` · ${evento.fecha}` : ''}`;
    }
    if (ventanaEl) ventanaEl.textContent = `⏰ Ventana abierta: ${estado.horaInicio}–${estado.horaFin}`;

    const userId = user && String(user.phone || user.id || '');
    const duplicado = !!userId && getRepositorioVotos().some(v =>
        String(v.maestre_id || '') === userId &&
        String(v.evento_id || '') === String(evento.id)
    );
    const bloqueadoPorBarrio = lokitronistaNoPuedeVotarEn(evento, user);
    const puedeVotar = !!user && !duplicado && !bloqueadoPorBarrio;

    const boton = document.getElementById('btn-votar-principal');
    if (boton) boton.disabled = !puedeVotar;

    const aviso = document.getElementById('voto-aviso');
    if (aviso) {
        let mensaje = '';
        if (!user) {
            mensaje = 'Inicia sesión para emitir tu voto.';
        } else if (bloqueadoPorBarrio) {
            mensaje = `Como Lokitronista de ${evento.barrio || 'tu barrio'}, no puedes puntuar el evento de tu propio barrio.`;
        } else if (duplicado) {
            mensaje = 'Ya has emitido tu voto para esta justa.';
        }
        aviso.textContent = mensaje;
        aviso.style.display = mensaje ? 'block' : 'none';
    }
    if (duplicado && panel && panel.style.display !== 'none') panel.style.display = 'none';
}

function renderOpcionesVoto() {
    const selectBarrio = document.getElementById('voto-select-barrio');
    if (selectBarrio) {
        const barrios = getBarriosRegistradosDelAmbito();
        selectBarrio.innerHTML = barrios.map(barrio =>
            `<option value="${escaparHTML(barrio)}">${escaparHTML(barrio)}</option>`
        ).join('');
    }

    const container = document.getElementById('contenedor-inputs-criterios-voto');
    if (container) container.innerHTML = buildCriteriosVotoMarkup();

    const selectEvento = document.getElementById('voto-select-evento');
    if (selectEvento) {
        const eventos = getEventosConVotacionDelAmbito().slice().sort((a, b) =>
            `${a.fecha || ''} ${a.hora_inicio_votacion || a.hora || ''}`.localeCompare(
                `${b.fecha || ''} ${b.hora_inicio_votacion || b.hora || ''}`
            )
        );
        const anterior = selectEvento.value;
        selectEvento.innerHTML = '<option value="">Selecciona un evento...</option>' +
            eventos.map(evt =>
                `<option value="${escaparHTML(String(evt.id))}">${escaparHTML(evt.fecha || '')} — ${escaparHTML(evt.nombre || evt.barrio || 'Evento')} (${escaparHTML(evt.barrio || 'Reino')})</option>`
            ).join('');
        if (eventos.some(evt => String(evt.id) === anterior)) selectEvento.value = anterior;

        selectEvento.onchange = actualizarEstadoFormularioVoto;
        actualizarEstadoFormularioVoto();
    }

    renderMisVotosPersonales();
    actualizarResumenesVoto();
    actualizarBloqueVotacion();
    renderOpcionesRecomendacionOraculo();
}

// El Oráculo solo puede recomendar barrios que existan realmente en el ámbito
// (en el Reino real, barrios dados de alta y participantes). Nunca inventa barrios.
function renderOpcionesRecomendacionOraculo() {
    const select = document.getElementById('select-barrio-recomendacion');
    if (!select) return;

    const barrios = getBarriosDelAmbito();
    if (barrios.length === 0) {
        select.innerHTML = '<option value="">Sin barrios creados en el Reino</option>';
        select.disabled = true;
        return;
    }

    const anterior = select.value;
    select.disabled = false;
    select.innerHTML = barrios.map(barrio =>
        `<option value="${escaparHTML(barrio)}">${escaparHTML(barrio)}</option>`
    ).join('');
    if (barrios.includes(anterior)) select.value = anterior;
}

function actualizarEstadoFormularioVoto() {
    const selectEvento = document.getElementById('voto-select-evento');
    const campoBarrio = document.getElementById('voto-barrio-evento');
    const estado = document.getElementById('estado-votacion-formulario');
    const boton = document.querySelector('#form-votar-barrio button[type="submit"]');
    if (!selectEvento) return;

    const evento = getEventosDelAmbito().find(evt => String(evt.id) === selectEvento.value);
    if (!evento) {
        if (campoBarrio) campoBarrio.value = '';
        if (estado) estado.textContent = 'Selecciona un evento para consultar su estado.';
        if (boton) boton.disabled = true;
        return;
    }

    if (campoBarrio) campoBarrio.value = evento.barrio || '';
    const estadoVotacion = obtenerEstadoVotacionEvento(evento);
    const user = getCurrentUser();
    const userId = user && (user.phone || user.id);
    const duplicado = userId && getVotosDelAmbito().some(v =>
        String(v.maestre_id) === String(userId) &&
        String(v.evento_id || '') === String(evento.id)
    );
    const bloqueadoPorBarrio = lokitronistaNoPuedeVotarEn(evento, user);
    const puedeVotar = estadoVotacion.estado === 'ABIERTA' && !duplicado && !bloqueadoPorBarrio;

    if (estado) {
        estado.textContent = bloqueadoPorBarrio
            ? `Como Lokitronista de ${evento.barrio || 'tu barrio'}, no puedes votar en el evento de tu propio barrio (se evita el conflicto de interés). Puedes votar en los eventos de otros barrios.`
            : duplicado
                ? 'Ya has votado en este evento. Puedes consultar tu historial.'
                : estadoVotacion.estado === 'ABIERTA'
                    ? `Votación abierta: ${estadoVotacion.horaInicio}–${estadoVotacion.horaFin}.`
                    : estadoVotacion.texto;
    }
    if (boton) boton.disabled = !puedeVotar;
    const opcionesVoto = document.getElementById('voto-opciones-box');
    if (opcionesVoto) opcionesVoto.style.display = puedeVotar ? 'block' : 'none';
}

function renderMisVotosPersonales() {
    const contenedor = document.getElementById('contenedor-mis-votos-body');
    if (!contenedor) return;

    const user = getCurrentUser();
    if (!user) {
        contenedor.innerHTML = '<p>Inicia sesión para consultar tus votos.</p>';
        return;
    }

    const userId = String(user.phone || user.id || '');
    // Se muestra únicamente el historial del usuario conectado.
    const votos = getRepositorioVotos()
        .filter(v => String(v.maestre_id || '') === userId)
        .slice()
        .sort((a, b) => String(b.fecha_juicio || '').localeCompare(String(a.fecha_juicio || '')));

    if (!votos.length) {
        contenedor.innerHTML = '<p style="color:#d6d3d1;">No ha emitido ninguna votación.</p>';
        return;
    }

    const eventos = getEventosDelAmbito();
    contenedor.innerHTML = `
        <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;">
                <thead><tr>
                    <th>Evento</th><th>Barrio</th><th>🍽️ Ocio Hostelero</th><th>🚌 Accesibilidad</th><th>🎉 Ambiente</th><th>🏆 Nota Final</th><th>Fecha del voto</th><th>Estado</th>
                </tr></thead>
                <tbody>${votos.map(v => {
                    const evt = eventos.find(e => String(e.id) === String(v.evento_id));
                    const estado = evt ? obtenerEstadoVotacionEvento(evt).estado : 'Histórico';
                    const final = (Number(v.nota_festin || 0) * 0.50) + (Number(v.nota_caminos || 0) * 0.20) + (Number(v.nota_espiritu || 0) * 0.30);
                    return `<tr>
                        <td>${escaparHTML(v.evento_nombre || (evt && evt.nombre) || 'Evento anterior')}</td>
                        <td>${escaparHTML(v.barrio || v.casa_visitada || '')}</td>
                        <td>${Number(v.nota_festin || 0)}</td>
                        <td>${Number(v.nota_caminos || 0)}</td>
                        <td>${Number(v.nota_espiritu || 0)}</td>
                        <td><strong>${final.toFixed(2)}</strong></td>
                        <td>${escaparHTML(v.fecha_juicio ? new Date(v.fecha_juicio).toLocaleString() : '')}</td>
                        <td>${escaparHTML(estado)}</td>
                    </tr>`;
                }).join('')}</tbody>
            </table>
        </div>`;
}

function validarNotas(notas) {
    for (const key in notas) {
        if (notas[key] > 10 || notas[key] < 0) return false;
    }
    return true;
}

function mostrarMensajeVoto(tipo, texto) {
    const el = document.getElementById('voto-mensaje-resultado');
    if (!el) {
        alert(texto);
        return;
    }
    const estilos = {
        exito: { fondo: 'rgba(20, 83, 45, 0.85)', borde: '#22c55e', color: '#bbf7d0', icono: '✅' },
        aviso: { fondo: 'rgba(120, 53, 15, 0.85)', borde: '#f59e0b', color: '#fde68a', icono: '⚠️' },
        error: { fondo: 'rgba(127, 29, 29, 0.85)', borde: '#ef4444', color: '#fecaca', icono: '⛔' }
    };
    const estilo = estilos[tipo] || estilos.aviso;
    el.style.display = 'block';
    el.style.background = estilo.fondo;
    el.style.border = `1px solid ${estilo.borde}`;
    el.style.color = estilo.color;
    el.textContent = `${estilo.icono} ${texto}`;
}

async function guardarVotoBarrioUsuario(event) {
    if (event) event.preventDefault();

    const user = getCurrentUser();
    if (!user) {
        mostrarMensajeVoto('error', 'Debe iniciar sesión antes de emitir un voto.');
        return;
    }

    const selectEvento = document.getElementById('voto-select-evento');
    const evento = selectEvento
        ? getEventosDelAmbito().find(evt => String(evt.id) === selectEvento.value)
        : null;

    if (!evento) {
        mostrarMensajeVoto('error', 'Selecciona un evento válido antes de votar.');
        return;
    }

    if (evento.tiene_votacion === false) {
        mostrarMensajeVoto('error', 'Este evento es informativo y no admite votación.');
        actualizarEstadoFormularioVoto();
        return;
    }

    if (lokitronistaNoPuedeVotarEn(evento, user)) {
        mostrarMensajeVoto('error', 'No puedes puntuar el evento celebrado en tu propio barrio (neutralidad del Tronista).');
        actualizarEstadoFormularioVoto();
        return;
    }

    const estado = obtenerEstadoVotacionEvento(evento);
    if (estado.estado !== 'ABIERTA') {
        mostrarMensajeVoto('error', 'La votación de este evento no está abierta en estos momentos. No se ha recibido tu voto.');
        actualizarEstadoFormularioVoto();
        return;
    }

    const maestreId = String(user.phone || user.id || '');
    const votosGuardados = getVotosDelAmbito();
    if (votosGuardados.some(v =>
        String(v.maestre_id || '') === maestreId &&
        String(v.evento_id || '') === String(evento.id)
    )) {
        mostrarMensajeVoto('error', 'Ya has emitido un voto para este evento. No se ha recibido un nuevo voto.');
        actualizarEstadoFormularioVoto();
        return;
    }

    const selectBarrio = document.getElementById('voto-select-barrio');
    const barrio = (selectBarrio ? String(selectBarrio.value).trim() : '') || evento.barrio || '';
    const values = document.querySelectorAll('#contenedor-inputs-criterios-voto [data-criterio]');
    const notas = {};
    values.forEach(input => {
        notas[input.dataset.criterio] = Number(input.value || 0);
    });

    if (!validarNotas(notas)) {
        alert('El límite máximo del Reino es de 10 puntos por criterio.');
        return;
    }

    // Códice de la Villa: cada disciplina se calcula como la media ponderada de
    // sus subcategorías (Plebeyo/Real/Elitista/Poteo, Carruajes/Dragones/Establos/
    // Caminos, Originalidad/Organización/Gozo).
    const notaOcio = notaCriterioODefecto('crit-ocio', notas, ['crit-festin', 'crit-festin-sabor']);
    const notaAccesibilidad = notaCriterioODefecto('crit-acceso', notas, ['crit-caminos']);
    const notaAmbiente = notaCriterioODefecto('crit-ambiente', notas, ['crit-espiritu']);

    const voto = {
        maestre_id: maestreId,
        evento_id: String(evento.id),
        evento_nombre: evento.nombre || '',
        casa_visitada: barrio,
        barrio,
        nota_festin: Number(notaOcio !== null ? notaOcio : (notas['crit-festin-sabor'] || notas['crit-ocio'] || 8)),
        nota_caminos: Number(notaAccesibilidad !== null ? notaAccesibilidad : (notas['crit-caminos'] || notas['crit-acceso'] || 8)),
        nota_espiritu: Number(notaAmbiente !== null ? notaAmbiente : (notas['crit-espiritu'] || notas['crit-ambiente'] || 8)),
        detalles_notas: notas,
        fecha_juicio: new Date().toISOString()
    };

    // Persistencia central en Supabase: es la ÚNICA fuente de verdad del Reino.
    // Un voto que el servidor no confirme NO se guarda en local, para evitar
    // votos fantasma que el resto de usuarios no puede ver en la Clasificación.
    const client = getSupabaseBarriosClient();
    if (!client || !user.token) {
        mostrarMensajeVoto('error', 'No hay conexión con el servidor de la competición. Vuelve a iniciar sesión e inténtalo de nuevo.');
        return;
    }

    try {
        const casa = (typeof casasCache !== 'undefined' ? casasCache : [])
            .find(c => String(c.nombre) === String(barrio));
        const { error } = await client.rpc('emitir_voto_lokitrono', {
            p_token: user.token,
            p_evento_id: String(evento.id),
            p_casa_id: casa ? casa.id : null,
            p_barrio: barrio,
            p_festin: voto.nota_festin,
            p_caminos: voto.nota_caminos,
            p_espiritu: voto.nota_espiritu,
            p_detalles: notas
        });
        if (error) throw error;
    } catch (error) {
        console.error('No se pudo registrar el voto en Supabase:', error);
        const detalle = error && error.message ? String(error.message) : 'error desconocido';
        mostrarMensajeVoto('error', `El servidor rechazó el voto: ${detalle}`);
        return;
    }

    // Relée el repositorio central para que este navegador y el resto de
    // usuarios converjan en el mismo estado (sin votos fantasma locales).
    await cargarVotosDesdeSupabase();
    renderMisVotosPersonales();
    actualizarBloqueVotacion();

    const formulario = document.getElementById('form-votar-barrio');
    if (formulario) formulario.reset();
    cerrarPanelPuntuacion();
    mostrarMensajeVoto('exito', `¡Voto recibido y registrado! Tu puntuación para ${barrio} ya cuenta en el Códice de la Villa.`);
}

const CRITERIOS_VERSION = 2;
const CRITERIOS_JERARQUICOS_DEFAULT = [
    { id: 'crit-ocio', nombre: '🍽️ Ocio Hostelero', parentId: null, peso: 50, nivel: 1 },
    { id: 'crit-ocio-plebeyo', nombre: '🍢 Pintxo de Plebeyo', parentId: 'crit-ocio', peso: 20, nivel: 2 },
    { id: 'crit-ocio-real', nombre: '👑 Pintxo Real', parentId: 'crit-ocio', peso: 15, nivel: 2 },
    { id: 'crit-ocio-elitista', nombre: '💎 Elixir Elitista', parentId: 'crit-ocio', peso: 10, nivel: 2 },
    { id: 'crit-ocio-poteo', nombre: '🍺 Pócima de Poteo', parentId: 'crit-ocio', peso: 5, nivel: 2 },
    { id: 'crit-acceso', nombre: '🚌 Accesibilidad', parentId: null, peso: 20, nivel: 1 },
    { id: 'crit-acceso-carruajes', nombre: '🚍 Carruajes (Autobuses)', parentId: 'crit-acceso', peso: 5, nivel: 2 },
    { id: 'crit-acceso-dragones', nombre: '🐲 Dragones Subterráneos (Metro)', parentId: 'crit-acceso', peso: 5, nivel: 2 },
    { id: 'crit-acceso-establos', nombre: '🏇 Establos (Aparcamiento)', parentId: 'crit-acceso', peso: 5, nivel: 2 },
    { id: 'crit-acceso-caminos', nombre: '🛤️ Solidez de Caminos', parentId: 'crit-acceso', peso: 5, nivel: 2 },
    { id: 'crit-ambiente', nombre: '🎉 Ambiente de Barrio', parentId: null, peso: 30, nivel: 1 },
    { id: 'crit-ambiente-originalidad', nombre: '✨ Originalidad', parentId: 'crit-ambiente', peso: 15, nivel: 2 },
    { id: 'crit-ambiente-organizacion', nombre: '📯 Organización (Guía del Tronista)', parentId: 'crit-ambiente', peso: 10, nivel: 2 },
    { id: 'crit-ambiente-gozo', nombre: '🎊 Gozo del Pueblo', parentId: 'crit-ambiente', peso: 5, nivel: 2 }
];

function getCriteriosJerarquicos() {
    try {
        const raw = JSON.parse(localStorage.getItem('criterios_valoracion_jerarquicos') || 'null');
        if (raw && typeof raw === 'object' && !Array.isArray(raw) && raw.v === CRITERIOS_VERSION && Array.isArray(raw.items)) {
            return raw.items;
        }
    } catch (e) { /* noop */ }
    return CRITERIOS_JERARQUICOS_DEFAULT;
}

function guardarCriteriosJerarquicos(criterios) {
    localStorage.setItem('criterios_valoracion_jerarquicos', JSON.stringify({ v: CRITERIOS_VERSION, items: criterios }));
}

// Calcula la nota de un criterio: media ponderada de sus descendientes con nota,
// o su propia nota si no tiene descendientes valorados.
function obtenerNotaCriterio(id, notas) {
    if (!id) return null;
    const criterios = getCriteriosJerarquicos();
    const hijos = criterios.filter(c => c.parentId === id);
    if (hijos.length > 0) {
        let suma = 0;
        let pesos = 0;
        hijos.forEach(h => {
            const notaHijo = obtenerNotaCriterio(h.id, notas);
            if (notaHijo !== null) {
                const peso = Number(h.peso) || 0;
                suma += peso * notaHijo;
                pesos += peso;
            }
        });
        if (pesos > 0) return suma / pesos;
    }
    const directo = notas[id];
    return (directo === undefined || directo === null || directo === '') ? null : (Number(directo) || 0);
}

function notaCriterioODefecto(raizId, notas, alternativas = []) {
    for (const id of [raizId, ...alternativas]) {
        const valor = obtenerNotaCriterio(id, notas);
        if (valor !== null) return valor;
    }
    return null;
}

function calcularNivelElemento(parentId, criterios) {
    if (!parentId) return 1;
    const padre = criterios.find(c => c.id === parentId);
    if (!padre) return 1;
    return (padre.nivel || 1) + 1;
}

function agregarNuevoCriterioJerarquico() {
    const usuario = getCurrentUser();
    if (!usuario || !puedeAdministrar(usuario.role)) {
        alert('Solo el Superadmin puede modificar los criterios.');
        return;
    }

    const nombreInput = document.getElementById('nuevo-criterio-nombre');
    const padreSelect = document.getElementById('nuevo-criterio-padre');
    const pesoInput = document.getElementById('nuevo-criterio-peso');

    const nombre = (nombreInput?.value || '').trim();
    const parentId = padreSelect?.value || null;
    const peso = Number(pesoInput?.value || 0);

    if (!nombre) {
        alert('Escribe un nombre para el criterio.');
        return;
    }

    const criterios = getCriteriosJerarquicos();
    const nivel = calcularNivelElemento(parentId, criterios);

    if (nivel > 10) {
        alert('⚠️ Límite de jerarquía alcanzado: No es posible exceder los 10 niveles de profundidad.');
        return;
    }

    const nuevoItem = {
        id: `crit-${Date.now()}`,
        nombre,
        parentId,
        peso,
        nivel
    };

    criterios.push(nuevoItem);
    guardarCriteriosJerarquicos(criterios);

    if (nombreInput) nombreInput.value = '';
    if (pesoInput) pesoInput.value = '';

    renderCriteriosJerarquicos();
    renderOpcionesVoto();
    alert(`✅ Ítem "${nombre}" añadido en el Nivel ${nivel}.`);
}

function eliminarCriterioJerarquico(id) {
    const usuario = getCurrentUser();
    if (!usuario || !puedeAdministrar(usuario.role)) {
        alert('Acceso denegado.');
        return;
    }

    if (confirm('🗑️ ¿Deseas eliminar este criterio y sus subconjuntos descendientes?')) {
        let criterios = getCriteriosJerarquicos();
        const idsAEliminar = new Set([id]);

        let cambio = true;
        while (cambio) {
            cambio = false;
            criterios.forEach(c => {
                if (c.parentId && idsAEliminar.has(c.parentId) && !idsAEliminar.has(c.id)) {
                    idsAEliminar.add(c.id);
                    cambio = true;
                }
            });
        }

        criterios = criterios.filter(c => !idsAEliminar.has(c.id));
        guardarCriteriosJerarquicos(criterios);
        renderCriteriosJerarquicos();
        renderOpcionesVoto();
        alert('Criterio eliminado.');
    }
}

function renderCriteriosJerarquicos() {
    const tbody = document.getElementById('tabla-criterios-ponderacion-body');
    const selectPadre = document.getElementById('nuevo-criterio-padre');

    const criterios = getCriteriosJerarquicos();

    if (selectPadre) {
        selectPadre.innerHTML = `
            <option value="">Raíz (Nivel 1 - Conjunto Principal)</option>
            ${criterios.filter(c => c.nivel < 10).map(c => `
                <option value="${c.id}">${'— '.repeat(c.nivel - 1)} ${c.nombre} (Nivel ${c.nivel})</option>
            `).join('')}
        `;
    }

    if (tbody) {
        tbody.innerHTML = criterios.length ? criterios.map(c => `
            <tr>
                <td style="padding-left: ${(c.nivel - 1) * 20 + 10}px;">
                    ${c.nivel > 1 ? '↳ ' : '📦 '} <strong>${c.nombre}</strong>
                </td>
                <td><span class="pill-user" style="font-size: 0.75rem;">Nivel ${c.nivel}/10</span></td>
                <td>${c.peso}%</td>
                <td>
                    <button onclick="eliminarCriterioJerarquico('${c.id}')" class="btn-cuervo" style="padding: 3px 8px; font-size: 0.8rem; background: #7f1d1d;">🗑️ Eliminar</button>
                </td>
            </tr>
        `).join('') : '<tr><td colspan="4" style="text-align: center; color: #d6d3d1;">Sin criterios registrados.</td></tr>';
    }
}

function buildCriteriosVotoMarkup() {
    const criterios = getCriteriosJerarquicos();
    const raices = criterios.filter(c => !c.parentId);

    return raices.map(raiz => {
        const hijos = criterios.filter(c => c.parentId === raiz.id);
        const filas = hijos.map(hijo => `
            <div class="voto-slider-fila">
                <div class="voto-slider-cabecera">
                    <span class="voto-slider-nombre">${escaparHTML(hijo.nombre)}</span>
                    <span class="voto-slider-valor" id="valor-${hijo.id}">8</span>
                </div>
                <input type="range" min="1" max="10" step="1" value="8"
                    id="voto-${hijo.id}" data-criterio="${hijo.id}" data-raiz="${raiz.id}"
                    oninput="actualizarResumenesVoto()" aria-label="${escaparHTML(hijo.nombre)}">
            </div>
        `).join('');

        return `
            <section class="voto-disciplina" data-raiz="${raiz.id}">
                <header class="voto-disciplina-cabecera">
                    <h4>${escaparHTML(raiz.nombre)}</h4>
                    <span class="voto-disciplina-peso">Peso ${Number(raiz.peso) || 0}%</span>
                    <span class="voto-disciplina-nota" id="nota-raiz-${raiz.id}">8.0</span>
                </header>
                ${filas}
            </section>
        `;
    }).join('');
}

// Recalcula en vivo la nota de cada disciplina y el resultado final ponderado.
function actualizarResumenesVoto() {
    const inputs = document.querySelectorAll('#contenedor-inputs-criterios-voto [data-criterio]');
    const notas = {};
    inputs.forEach(input => {
        const val = Number(input.value || 0);
        notas[input.dataset.criterio] = val;
        const indicador = document.getElementById(`valor-${input.dataset.criterio}`);
        if (indicador) indicador.textContent = val;
        if (input.type === 'range') {
            const min = Number(input.min || 1);
            const max = Number(input.max || 10);
            const pct = max > min ? ((val - min) / (max - min)) * 100 : 0;
            input.style.setProperty('--voto-rango-pct', `${pct}%`);
        }
    });

    const criterios = getCriteriosJerarquicos();
    const raices = criterios.filter(c => !c.parentId);
    const notasRaiz = {};
    let suma = 0;
    let pesoTotal = 0;

    raices.forEach(raiz => {
        const nota = obtenerNotaCriterio(raiz.id, notas);
        notasRaiz[raiz.id] = nota;
        const el = document.getElementById(`nota-raiz-${raiz.id}`);
        if (el) el.textContent = nota === null ? '—' : Number(nota).toFixed(1);
        const peso = Number(raiz.peso) || 0;
        if (nota !== null) {
            suma += nota * peso;
            pesoTotal += peso;
        }
    });

    const final = pesoTotal > 0 ? suma / pesoTotal : 0;
    const resumen = document.getElementById('voto-resumen-final');
    if (resumen) {
        resumen.innerHTML = `
            <h4 class="voto-resumen-titulo">📊 Resultado de tu voto</h4>
            ${raices.map(raiz => {
                const nota = notasRaiz[raiz.id];
                return `<div class="voto-resumen-fila">
                    <span>${escaparHTML(raiz.nombre)} <em>(${Number(raiz.peso) || 0}%)</em></span>
                    <strong>${nota === null || nota === undefined ? '—' : Number(nota).toFixed(1)}</strong>
                </div>`;
            }).join('')}
            <div class="voto-resumen-final">
                <span>🏆 Nota Final Ponderada</span>
                <strong>${final.toFixed(2)}</strong>
            </div>
        `;
    }
}



function exportarRepositorioCSV() {
    const votos = typeof getVotosDelAmbito === 'function'
        ? getVotosDelAmbito()
        : JSON.parse(localStorage.getItem(STORAGE_KEYS.repositorioVotos) || '[]');
    if (!Array.isArray(votos) || votos.length === 0) {
        alert('No hay votos para exportar.');
        return;
    }
    const header = ['maestre_id', 'casa_visitada', 'barrio', 'nota_festin', 'nota_caminos', 'nota_espiritu', 'fecha_juicio'];
    const filas = votos.map(v => header.map(c => `"${String(v[c] ?? '').replace(/"/g, '""')}"`).join(','));
    const csv = [header.join(','), ...filas].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'repositorio_votos.csv';
    link.click();
    URL.revokeObjectURL(url);
}

function descargarICSEvento(evento) {
    const safeName = (evento?.nombre || 'Evento del reino').replace(/[,;\\]/g, '');
    const start = evento?.fecha ? `${evento.fecha.replace(/-/g, '')}T${evento.hora || '20:00'}00` : '20261008T200000';
    const fechaFin = evento?.fecha_fin || evento?.fecha;
    const horaFin = evento?.hora_fin || evento?.hora || '20:00';
    const end = fechaFin ? `${fechaFin.replace(/-/g, '')}T${horaFin}00` : start;
    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `SUMMARY:${safeName}`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `LOCATION:${evento?.lugar || 'Bilbao'}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(evento?.id || 'evento')}.ics`;
    link.click();
    URL.revokeObjectURL(url);
}

function puedeEditarEventoTronista(evento, role, usuario) {
    if (role === 'superadmin') return true;
    if (role === 'master') return true;
    return false;
}

function renderRepositorioVotos() {
    const cuerpo = document.getElementById('repositorio-votos-body');
    if (!cuerpo) return;
    const votos = getVotosDelAmbito();
    const user = getCurrentUser ? getCurrentUser() : null;
    const esAdmin = user && puedeAdministrar(user.role);

    cuerpo.innerHTML = votos.length
        ? votos.map((v, index) => `
            <tr>
                <td>${v.maestre_id || 'anon'}</td>
                <td>${v.barrio || 'sin-barrio'}</td>
                <td>${v.casa_visitada || 'sin-casa'}</td>
                <td>${v.nota_festin ?? 0} / ${v.nota_caminos ?? 0} / ${v.nota_espiritu ?? 0}</td>
                <td>${new Date(v.fecha_juicio || Date.now()).toLocaleString()}</td>
                <td>
                    ${esAdmin ? `<button onclick="eliminarVotoRepositorio(${index})" class="btn-cuervo" style="padding: 4px 8px; font-size: 0.8rem; background: #7f1d1d;">🗑️ Eliminar</button>` : '-'}
                </td>
            </tr>
        `).join('')
        : `<tr><td colspan="6" style="text-align: center; color: #d6d3d1;">Sin votos registrados en el repositorio central.</td></tr>`;
}

async function eliminarVotoRepositorio(index) {
    const user = getCurrentUser();
    if (!user || !puedeAdministrar(user.role)) {
        alert('Solo el Administrador o un Superadmin puede eliminar votos.');
        return;
    }
    if (!confirm('🗑️ ¿Deseas eliminar este voto del repositorio?')) return;

    const voto = getRepositorioVotos()[index];
    const client = getSupabaseBarriosClient();
    if (client && user.token && voto && voto.id) {
        try {
            const { error } = await client.rpc('eliminar_voto_superadmin', {
                p_token: user.token,
                p_voto_id: voto.id
            });
            if (error) throw error;
            await cargarVotosDesdeSupabase();
            alert('Voto eliminado correctamente.');
        } catch (error) {
            console.error('No se pudo eliminar el voto en Supabase:', error);
            alert(`No se pudo eliminar el voto: ${error.message || 'error desconocido'}`);
        }
        return;
    }

    // Respaldo local si no hay conexión o el voto no tiene id (datos antiguos).
    const key = getStorageKeyVotos();
    const votos = JSON.parse(localStorage.getItem(key) || '[]');
    votos.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(votos));
    renderRepositorioVotos();
    if (typeof renderClasificacionReal === 'function') renderClasificacionReal();
    if (typeof renderEstadisticasCodice === 'function') renderEstadisticasCodice();
    alert('Voto eliminado correctamente.');
}

function getRepositorioVotos() {
    try {
        const key = typeof getStorageKeyVotos === 'function' ? getStorageKeyVotos() : STORAGE_KEYS.repositorioVotos;
        const votos = JSON.parse(localStorage.getItem(key) || '[]');
        return Array.isArray(votos) ? votos : [];
    } catch (error) {
        return [];
    }
}

// Descarga los votos centralizados en Supabase y REEMPLAZA la caché local.
async function cargarVotosDesdeSupabase() {
    const client = getSupabaseBarriosClient();
    if (!client) return;
    try {
        const { data, error } = await client.rpc('listar_votos_lokitrono');
        if (error) throw error;
        const remotos = Array.isArray(data) ? data : [];

        // Sincronización por REEMPLAZO: Supabase es la fuente de verdad del
        // Reino real. Así, tras un reinicio real, la caché local no conserva
        // votos fantasma (antes se fusionaba y nunca se vaciaba).
        const votos = remotos.map(r => ({
            id: r.id,
            maestre_id: r.usuario_phone || r.usuario_id,
            evento_id: String(r.evento_id || ''),
            casa_visitada: r.barrio || '',
            barrio: r.barrio || '',
            nota_festin: Number(r.nota_festin) || 0,
            nota_caminos: Number(r.nota_caminos) || 0,
            nota_espiritu: Number(r.nota_espiritu) || 0,
            detalles_notas: r.detalles_notas || {},
            fecha_juicio: r.created_at || new Date().toISOString()
        }));

        localStorage.setItem(STORAGE_KEYS.repositorioVotos, JSON.stringify(votos));
        if (typeof renderRepositorioVotos === 'function') renderRepositorioVotos();
        if (typeof renderClasificacionReal === 'function') renderClasificacionReal();
        if (typeof renderEstadisticasCodice === 'function') renderEstadisticasCodice();
        renderMisVotosPersonales();
    } catch (error) {
        console.warn('No se pudieron cargar los votos desde Supabase:', error?.message || error);
    }
}

// Códice de la Villa: media ponderada 0,50 Ocio Hostelero + 0,20 Accesibilidad + 0,30 Ambiente de Barrio.
function calcularNotaLeyII(festin, caminos, espiritu) {
    if (typeof calcularMediaPonderada === 'function') {
        return calcularMediaPonderada(Number(festin) || 0, Number(caminos) || 0, Number(espiritu) || 0);
    }
    return (Number(festin) || 0) * 0.50 + (Number(caminos) || 0) * 0.20 + (Number(espiritu) || 0) * 0.30;
}

// Regularización bayesiana de la Ley II: media global con umbral de confianza K.
const LEY_II_K = 3.0;

function calcularPuntuacionLeyII(festin, caminos, espiritu, n, mediaGlobal, k = LEY_II_K) {
    if (!n || n <= 0) return 0;
    const crudo = calcularNotaLeyII(festin, caminos, espiritu);
    return ((n * crudo) + (k * (Number(mediaGlobal) || 0))) / (n + k);
}

// Vista activa del panel de clasificación: 'general' | 'evento' | 'historico'.
let vistaRankingActual = 'general';

// Cabecera común de las tablas de ranking.
const TABLA_RANKING_HEADER = `<tr>
    <th>Estatus</th>
    <th>Reino / Feudo</th>
    <th>Ocio Hostelero (50%)</th>
    <th>Accesibilidad (20%)</th>
    <th>Ambiente (30%)</th>
    <th>Nota Final</th>
    <th>Votos</th>
</tr>`;

// Calcula el ranking de barrios (Ley II) a partir de un conjunto de votos.
// Se reutiliza para el Ranking General, el del Evento y el Histórico por evento.
function calcularRankingBarrios(votos, barrios) {
    const lista = Array.isArray(votos) ? votos : [];
    const mediaGlobal = lista.length === 0 ? 0 : lista.reduce((acc, v) => {
        return acc + calcularNotaLeyII(v.nota_festin, v.nota_caminos, v.nota_espiritu);
    }, 0) / lista.length;

    const estadisticas = (barrios || []).map(barrio => {
        const votosBarrio = lista.filter(v => (v.barrio || v.casa_visitada) === barrio);
        const totalVotos = votosBarrio.length;
        if (totalVotos === 0) {
            return { barrio, festin: '0.0', caminos: '0.0', espiritu: '0.0', notaFinal: 0, totalVotos: 0 };
        }
        const sumFestin = votosBarrio.reduce((acc, v) => acc + Number(v.nota_festin || 0), 0);
        const sumCaminos = votosBarrio.reduce((acc, v) => acc + Number(v.nota_caminos || 0), 0);
        const sumEspiritu = votosBarrio.reduce((acc, v) => acc + Number(v.nota_espiritu || 0), 0);

        const festin = (sumFestin / totalVotos).toFixed(1);
        const caminos = (sumCaminos / totalVotos).toFixed(1);
        const espiritu = (sumEspiritu / totalVotos).toFixed(1);
        const notaFinal = calcularPuntuacionLeyII(festin, caminos, espiritu, totalVotos, mediaGlobal);

        return { barrio, festin, caminos, espiritu, notaFinal: Number(notaFinal.toFixed(2)), totalVotos };
    });

    estadisticas.sort((a, b) => b.notaFinal - a.notaFinal);
    return { estadisticas, mediaGlobal };
}

// Fila HTML de una posición del ranking.
function filaRankingHTML(item, index) {
    const medallas = ['🥇 1º', '🥈 2º', '🥉 3º'];
    const estatus = medallas[index] || `🏰 ${index + 1}º`;
    return `
        <tr>
            <td><strong>${estatus}</strong></td>
            <td><strong>${escaparHTML(item.barrio)}</strong></td>
            <td>${item.festin}</td>
            <td>${item.caminos}</td>
            <td>${item.espiritu}</td>
            <td><strong style="color: var(--oro-brillante); font-size: 1.1rem;">${item.notaFinal} pts</strong></td>
            <td>${item.totalVotos}</td>
        </tr>
    `;
}

// Votos computables que pertenecen a un evento concreto. Si el evento no tiene
// votos con evento_id (datos antiguos), se aproxima por barrio anfitrión.
function votosDeEvento(evento) {
    if (!evento) return [];
    const todos = getVotosComputablesDelAmbito();
    const porId = todos.filter(v => v.evento_id != null && String(v.evento_id) === String(evento.id));
    if (porId.length) return porId;
    return todos.filter(v => (v.barrio || v.casa_visitada) === evento.barrio);
}

// Evento cuya ventana de votación está abierta ahora mismo (el «evento en curso»).
function obtenerEventoEnCurso() {
    const abiertos = getEventosConVotacionDelAmbito().filter(e => {
        try { return obtenerEstadoVotacionEvento(e).estado === 'ABIERTA'; } catch (_) { return false; }
    });
    if (!abiertos.length) return null;
    abiertos.sort((a, b) => `${a.fecha || ''}${a.hora || ''}`.localeCompare(`${b.fecha || ''}${b.hora || ''}`));
    return abiertos[0];
}

// Eventos ya celebrados/votados, en orden cronológico (para el histórico).
function obtenerEventosHistoricos() {
    const votos = getVotosDelAmbito();
    const conVotos = getEventosConVotacionDelAmbito().filter(e =>
        votos.some(v => String(v.evento_id || '') === String(e.id) || (v.barrio || v.casa_visitada) === e.barrio)
    );
    conVotos.sort((a, b) => `${a.fecha || ''}${a.hora || ''}`.localeCompare(`${b.fecha || ''}${b.hora || ''}`));
    return conVotos;
}

// Ranking General: agrega los votos de TODOS los eventos celebrados con votación.
function renderRankingGeneral() {
    const cuerpo = document.getElementById('clasificacion-body');
    if (!cuerpo) return;

    const votos = getVotosComputablesDelAmbito();
    const barrios = getBarriosDelAmbito();

    if (barrios.length === 0) {
        cuerpo.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#a1a1aa;font-style:italic;">Aún no hay barrios participantes en la competición.</td></tr>';
        renderGanadoresPorCategoria([]);
        return;
    }

    const { estadisticas } = calcularRankingBarrios(votos, barrios);
    cuerpo.innerHTML = estadisticas.map(filaRankingHTML).join('');
    renderGanadoresPorCategoria(estadisticas);
}

// Ranking del Evento: solo los votos del evento en curso.
function renderRankingEvento() {
    const info = document.getElementById('ranking-evento-info');
    const cuerpo = document.getElementById('ranking-evento-body');
    if (!cuerpo) return;

    const evento = obtenerEventoEnCurso();
    if (!evento) {
        if (info) info.innerHTML = '<p style="margin:0;color:#d6d3d1;font-style:italic;">⏳ No hay ninguna votación abierta en estos momentos.</p>';
        cuerpo.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#a1a1aa;font-style:italic;">Sin evento en curso.</td></tr>';
        return;
    }

    const estado = (() => { try { return obtenerEstadoVotacionEvento(evento); } catch (_) { return { texto: '' }; } })();
    if (info) {
        info.innerHTML = `🗳️ <strong>${escaparHTML(evento.nombre || evento.barrio || 'Evento en curso')}</strong>
            · Barrio anfitrión: <strong>${escaparHTML(evento.barrio || '—')}</strong>
            · ${escaparHTML(evento.fecha || '')}
            · <span style="color:#4ade80;">${escaparHTML(estado.texto || '')}</span>`;
    }

    const votos = votosDeEvento(evento);
    const barrios = [...new Set(votos.map(v => v.barrio || v.casa_visitada).filter(Boolean))];
    if (!barrios.length) {
        cuerpo.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#a1a1aa;font-style:italic;">Aún no hay votos registrados en el evento en curso.</td></tr>';
        return;
    }

    const { estadisticas } = calcularRankingBarrios(votos, barrios);
    cuerpo.innerHTML = estadisticas.map(filaRankingHTML).join('');
}

// Ranking Histórico: una tabla con los resultados de cada evento celebrado.
function renderRankingHistorico() {
    const contenedor = document.getElementById('ranking-historico-contenido');
    if (!contenedor) return;

    const eventos = obtenerEventosHistoricos();
    if (!eventos.length) {
        contenedor.innerHTML = '<p style="text-align:center;color:#d6d3d1;font-style:italic;">Todavía no hay eventos con votos registrados.</p>';
        return;
    }

    contenedor.innerHTML = eventos.map(evento => {
        const votos = votosDeEvento(evento);
        const barrios = [...new Set(votos.map(v => v.barrio || v.casa_visitada).filter(Boolean))];
        const filas = barrios.length
            ? calcularRankingBarrios(votos, barrios).estadisticas.map(filaRankingHTML).join('')
            : '<tr><td colspan="7" style="text-align:center;color:#a1a1aa;font-style:italic;">Sin votos registrados en este evento.</td></tr>';
        const estado = (() => { try { return obtenerEstadoVotacionEvento(evento).texto; } catch (_) { return ''; } })();
        return `
            <div style="margin-bottom:24px;background:rgba(15,23,42,0.6);border:1px solid rgba(212,175,55,0.3);border-radius:8px;padding:16px;">
                <h4 style="color:var(--oro-brillante);font-family:'Cinzel',serif;margin:0 0 4px;">${escaparHTML(evento.nombre || evento.barrio || 'Evento')}</h4>
                <p style="margin:0 0 12px;color:#a1a1aa;font-size:0.85rem;">
                    🏰 ${escaparHTML(evento.barrio || '—')} · 📅 ${escaparHTML(evento.fecha || '')} · ${escaparHTML(estado)}
                </p>
                <div class="table-responsive">
                    <table class="leaderboard-table">
                        <thead>${TABLA_RANKING_HEADER}</thead>
                        <tbody>${filas}</tbody>
                    </table>
                </div>
            </div>
        `;
    }).join('');
}

// Dispatcher: dibuja la vista de ranking seleccionada y refresca en tiempo real.
function renderClasificacionReal() {
    const selector = document.getElementById('ranking-vista-selector');
    if (selector) {
        selector.querySelectorAll('button[data-ranking]').forEach(btn => {
            const activo = btn.dataset.ranking === vistaRankingActual;
            btn.style.background = activo ? '#1e40af' : '#0f172a';
            btn.style.borderColor = activo ? '#facc15' : '#3b82f6';
        });
    }
    const paneles = {
        general: 'ranking-general-panel',
        evento: 'ranking-evento-panel',
        historico: 'ranking-historico-panel'
    };
    Object.entries(paneles).forEach(([clave, id]) => {
        const el = document.getElementById(id);
        if (el) el.style.display = clave === vistaRankingActual ? 'block' : 'none';
    });

    if (vistaRankingActual === 'evento') renderRankingEvento();
    else if (vistaRankingActual === 'historico') renderRankingHistorico();
    else renderRankingGeneral();
}

function setRankingVista(vista) {
    if (!['general', 'evento', 'historico'].includes(vista)) return;
    vistaRankingActual = vista;
    renderClasificacionReal();
}

// Ganadores del Códice: campeón global, uno por categoría (nivel 1) y uno por
// subcategoría (hoja). Se calculan sobre los votos del repositorio activo.
function renderGanadoresPorCategoria(estadisticas) {
    const contenedor = document.getElementById('ganadores-reino');
    if (!contenedor) return;

    const votos = getVotosComputablesDelAmbito();
    const conVotos = estadisticas.filter(e => e.totalVotos > 0);
    const criterios = getCriteriosJerarquicos();
    const raices = criterios.filter(c => !c.parentId);
    const hojas = criterios.filter(c => !criterios.some(hijo => hijo.parentId === c.id));

    const esc = typeof escaparHTML === 'function' ? escaparHTML : (v => String(v ?? ''));

    if (conVotos.length === 0) {
        contenedor.innerHTML = '<p style="text-align:center;color:#a1a1aa;font-style:italic;">Aún no hay votos registrados para proclamar ganadores.</p>';
        return;
    }

    const votosDeBarrio = barrio => votos.filter(v => (v.barrio || v.casa_visitada) === barrio);

    const mediaRaiz = (barrio, raizId) => {
        let suma = 0;
        let n = 0;
        votosDeBarrio(barrio).forEach(v => {
            let nota = null;
            if (v.detalles_notas && typeof obtenerNotaCriterio === 'function') {
                nota = obtenerNotaCriterio(raizId, v.detalles_notas);
            }
            if (nota === null || nota === undefined) {
                if (raizId === 'crit-ocio') nota = Number(v.nota_festin);
                else if (raizId === 'crit-acceso') nota = Number(v.nota_caminos);
                else if (raizId === 'crit-ambiente') nota = Number(v.nota_espiritu);
            }
            if (Number.isFinite(nota)) { suma += nota; n += 1; }
        });
        return n > 0 ? suma / n : null;
    };

    const mediaHoja = (barrio, hojaId) => {
        let suma = 0;
        let n = 0;
        votosDeBarrio(barrio).forEach(v => {
            const det = v.detalles_notas;
            if (!det) return;
            const val = Number(det[hojaId]);
            if (Number.isFinite(val)) { suma += val; n += 1; }
        });
        return n > 0 ? suma / n : null;
    };

    const tarjetaGanador = (icono, etiqueta, barrio, valor, color) => `
        <div class="card-item" style="background:rgba(15,12,6,0.95);border:1px solid ${color};border-radius:10px;padding:14px;text-align:center;">
            <div style="font-size:1.6rem;margin-bottom:4px;">${icono}</div>
            <div style="font-size:0.78rem;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.5px;">${esc(etiqueta)}</div>
            <div style="font-family:'Cinzel',serif;color:${color};font-size:1.05rem;margin:6px 0;">${esc(barrio || '—')}</div>
            <div style="font-weight:bold;color:#e7e5e4;">${valor === null ? '—' : Number(valor).toFixed(2)} pts</div>
        </div>`;

    const campeon = conVotos[0];

    // El campeón global solo se proclama cuando TODOS los eventos con votación
    // han cerrado (como una liga: no hay campeón hasta jugar todos los partidos).
    const eventosConVotacion = getEventosConVotacionDelAmbito();
    const eventosPendientes = eventosConVotacion.filter(e => {
        try { return obtenerEstadoVotacionEvento(e).estado !== 'FINALIZADA'; } catch (error) { return true; }
    }).length;
    const competicionCompleta = eventosConVotacion.length > 0 && eventosPendientes === 0;

    const campeonHTML = competicionCompleta
        ? tarjetaGanador('👑', 'Lokibarrio Txapeldun (Global)', campeon.barrio, campeon.notaFinal, 'var(--oro-brillante)')
        : `<div class="card-item" style="background:rgba(15,12,6,0.95);border:1px dashed #a16207;border-radius:10px;padding:14px;text-align:center;">
                <div style="font-size:1.6rem;margin-bottom:4px;">⏳</div>
                <div style="font-size:0.78rem;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.5px;">Lokibarrio Txapeldun (Global)</div>
                <div style="font-family:'Cinzel',serif;color:#eab308;font-size:1rem;margin:6px 0;">Campeón por proclamar</div>
                <div style="font-weight:bold;color:#e7e5e4;">Quedan ${eventosPendientes}/${eventosConVotacion.length} eventos con votación por cerrar</div>
            </div>`;

    const bannerPendiente = (competicionCompleta || eventosConVotacion.length === 0)
        ? ''
        : `<div style="background:rgba(120,53,15,0.55);border:1px solid #d97706;border-radius:8px;padding:12px 16px;margin-bottom:18px;text-align:center;color:#fde68a;font-size:0.9rem;">
                ⚔️ <strong>La competición sigue en marcha.</strong> El Lokibarrio Txapeldun se proclamará cuando finalicen <strong>todos</strong> los eventos con votación
                (${eventosConVotacion.length - eventosPendientes}/${eventosConVotacion.length} cerrados). Mientras tanto se muestran los líderes provisionales por categoría.
            </div>`;

    let html = `
        <h3 style="color:var(--oro-brillante);font-family:'Cinzel',serif;text-align:center;margin-bottom:6px;">🏆 Salón de la Fama del Códice</h3>
        <p style="text-align:center;color:#d6d3d1;font-size:0.9rem;margin-bottom:18px;">Campeón global, vencedores por cada categoría y por cada subcategoría.</p>
        ${bannerPendiente}
        <div style="${'display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px;'}">
            ${campeonHTML}
            ${raices.map((raiz, i) => {
                let mejor = null;
                conVotos.forEach(e => {
                    const val = mediaRaiz(e.barrio, raiz.id);
                    if (val !== null && (mejor === null || val > mejor.valor)) mejor = { barrio: e.barrio, valor: val };
                });
                const icono = ['🥇', '🚌', '🎉', '⭐'][i % 4];
                return tarjetaGanador(icono, `Categoría · ${raiz.nombre}`, mejor && mejor.barrio, mejor && mejor.valor, '#facc15');
            }).join('')}
        </div>
    `;

    if (hojas.length > 0) {
        html += `
            <h4 style="color:var(--oro-brillante);font-family:'Cinzel',serif;text-align:center;margin:26px 0 14px;">🎯 Vencedores por Subcategoría</h4>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;">
                ${hojas.map(hoja => {
                    let mejor = null;
                    conVotos.forEach(e => {
                        const val = mediaHoja(e.barrio, hoja.id);
                        if (val !== null && (mejor === null || val > mejor.valor)) mejor = { barrio: e.barrio, valor: val };
                    });
                    return tarjetaGanador('🎖️', hoja.nombre, mejor && mejor.barrio, mejor && mejor.valor, '#93c5fd');
                }).join('')}
            </div>
        `;
    }

    contenedor.innerHTML = html;
}

function getEstadisticasAdmin() {
    const votos = getVotosDelAmbito();
    const total = votos.length;
    const media = total === 0 ? 0 : votos.reduce((sum, voto) => {
        const nota = [voto.nota_festin, voto.nota_caminos, voto.nota_espiritu]
            .map(Number)
            .reduce((acc, value) => acc + (Number.isFinite(value) ? value : 0), 0);
        return sum + nota / 3;
    }, 0) / total;

    return {
        total,
        media,
        votos: votos.map(voto => ({
            maestre_id: voto.maestre_id || 'anon',
            casa_visitada: voto.casa_visitada || 'sin-casa',
            barrio: voto.barrio || 'sin-barrio',
            nota_festin: Number(voto.nota_festin) || 0,
            nota_caminos: Number(voto.nota_caminos) || 0,
            nota_espiritu: Number(voto.nota_espiritu) || 0,
            fecha_juicio: voto.fecha_juicio || new Date().toISOString()
        }))
    };
}

function haVotadoCasa(maestreId, casaId) {
    return getVotosDelAmbito().some(v => v.maestre_id === maestreId && v.casa_visitada === casaId);
}

function getStorageKeyVotos() {
    return STORAGE_KEYS.repositorioVotos;
}

// Votos de la competición. Supabase es la fuente de verdad; la caché local solo
// es un espejo que `cargarVotosDesdeSupabase` reemplaza por completo.
function getVotosDelAmbito() {
    return getRepositorioVotos();
}

// Barrios participantes de la competición.
function getBarriosDelAmbito() {
    return (typeof casasCache !== 'undefined' ? casasCache : [])
        .filter(c => c.participa !== false)
        .map(c => c.nombre)
        .filter(Boolean);
}

function getEventosDelAmbito() {
    return getTodosLosEventos();
}

// Eventos que sí admiten votación (excluye los informativos).
// Son los únicos que cuentan para proclamar el campeón final.
function getEventosConVotacionDelAmbito() {
    return getEventosDelAmbito().filter(e => e.tiene_votacion !== false);
}

// Votos que cuentan para la clasificación: se descartan los que pertenecieran a
// un evento informativo (sin votación). Los votos sin evento_id (datos antiguos)
// se conservan.
function getVotosComputablesDelAmbito() {
    const sinVotacion = new Set(
        getEventosDelAmbito()
            .filter(e => e.tiene_votacion === false)
            .map(e => String(e.id))
    );
    if (sinVotacion.size === 0) return getVotosDelAmbito();
    return getVotosDelAmbito().filter(v =>
        v.evento_id == null || !sinVotacion.has(String(v.evento_id))
    );
}

// La competición solo corona campeón cuando TODOS los eventos con votación han
// cerrado su votación (como una liga: no hay campeón hasta jugar todos los
// partidos). Si no hay ningún evento con votación, no hay campeón.
function competicionVotacionCompleta() {
    const eventos = getEventosConVotacionDelAmbito();
    if (eventos.length === 0) return false;
    return eventos.every(e => {
        try {
            return obtenerEstadoVotacionEvento(e).estado === 'FINALIZADA';
        } catch (error) {
            return false;
        }
    });
}

function getUsuariosDelAmbito() {
    return getUsuariosAutorizadosLocal();
}

function getBarriosObjetosDelAmbito() {
    return (typeof casasCache !== 'undefined' ? casasCache : []);
}

// Nombres de TODOS los barrios registrados (incluidos los no participantes).
// Es lo que usan los selectores de formularios.
function getBarriosRegistradosDelAmbito() {
    return getBarriosLocal();
}

/* ==========================================
   LÓGICA Y NAVEGACIÓN DEL CALENDARIO MEDIEVAL
   ========================================== */

let calState = {
    mesActual: new Date().getMonth(),
    anioActual: new Date().getFullYear(),
    fechaFiltro: null
};

const NOMBRES_MESES = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
];

function getTodosLosEventos() {
    const porId = new Map();

    // Los eventos «de serie» (EVENTOS_FEUDALES) ya NO se mezclan aquí: el
    // calendario se nutre solo de Supabase y de los eventos locales heredados.
    // Así «Restaurar competición» deja de verdad 0 eventos.

    // Conservamos los eventos locales existentes durante la transición.
    try {
        const raw = localStorage.getItem('eventos_feudales_custom');
        const customEvents = raw ? JSON.parse(raw) : [];
        if (Array.isArray(customEvents)) {
            customEvents.forEach(evt => {
                if (evt && evt.id != null) {
                    porId.set(String(evt.id), { ...evt });
                }
            });
        }
    } catch (error) {
        console.warn('No se pudieron leer los eventos locales:', error);
    }

    // Los datos de Supabase prevalecen sobre los datos locales con el mismo ID.
    eventosSupabaseCache.forEach(row => {
        if (!row || row.id == null) return;

        if (row.eliminado) {
            porId.delete(String(row.id));
            return;
        }

        porId.set(String(row.id), {
            id: String(row.id),
            nombre: row.nombre || '',
            barrio: row.barrio || 'Reino',
            fecha: typeof row.fecha === 'string'
                ? row.fecha.slice(0, 10)
                : '',
            fecha_fin: typeof row.fecha_fin === 'string'
                ? row.fecha_fin.slice(0, 10)
                : '',
            lugar: row.lugar || '',
            hora: row.hora || '20:00',
            hora_fin: row.hora_fin || '',
            hora_inicio_votacion: row.hora_inicio_votacion || '20:30',
            hora_fin_votacion: row.hora_fin_votacion || '23:30',
            fecha_fin_votacion: typeof row.fecha_fin_votacion === 'string'
                ? row.fecha_fin_votacion.slice(0, 10)
                : '',
            desc: row.descripcion || '',
            cerrado_manualmente: Boolean(row.cerrado_manualmente),
            tiene_votacion: row.tiene_votacion !== false
        });
    });

    // Evita mostrar eventos eliminados, incluidos los predeterminados.
    const eliminados = new Set(
        eventosSupabaseCache
            .filter(row => row && row.eliminado)
            .map(row => String(row.id))
    );

    return [...porId.values()].filter(evt => !eliminados.has(String(evt.id)));
}

function initCalendarioMedieval() {
    const selectAnio = document.getElementById('cal-select-anio');
    const selectMes = document.getElementById('cal-select-mes');

    if (selectAnio) {
        const anioActual = new Date().getFullYear();
        let opcionesAnios = '';
        for (let y = anioActual - 2; y <= anioActual + 8; y++) {
            opcionesAnios += `<option value="${y}">${y}</option>`;
        }
        selectAnio.innerHTML = opcionesAnios;
        selectAnio.value = calState.anioActual;
    }

    if (selectMes) {
        selectMes.value = calState.mesActual;
    }

    actualizarCalendarioMedieval();
}

function cambiarMesCalendario(delta) {
    calState.mesActual += delta;
    if (calState.mesActual < 0) {
        calState.mesActual = 11;
        calState.anioActual--;
    } else if (calState.mesActual > 11) {
        calState.mesActual = 0;
        calState.anioActual++;
    }

    const selectAnio = document.getElementById('cal-select-anio');
    const selectMes = document.getElementById('cal-select-mes');
    if (selectAnio) selectAnio.value = calState.anioActual;
    if (selectMes) selectMes.value = calState.mesActual;

    actualizarCalendarioMedieval();
}

function irAFechaActual() {
    const hoy = new Date();
    calState.mesActual = hoy.getMonth();
    calState.anioActual = hoy.getFullYear();
    calState.fechaFiltro = null;

    const selectAnio = document.getElementById('cal-select-anio');
    const selectMes = document.getElementById('cal-select-mes');
    if (selectAnio) selectAnio.value = calState.anioActual;
    if (selectMes) selectMes.value = calState.mesActual;

    actualizarCalendarioMedieval();
}

function actualizarCalendarioMedieval() {
    const selectMes = document.getElementById('cal-select-mes');
    const selectAnio = document.getElementById('cal-select-anio');

    if (selectMes) calState.mesActual = parseInt(selectMes.value, 10);
    if (selectAnio) calState.anioActual = parseInt(selectAnio.value, 10);

    const tituloMes = document.getElementById('cal-titulo-mes');
    if (tituloMes) {
        tituloMes.textContent = `${NOMBRES_MESES[calState.mesActual]} DE ${calState.anioActual}`;
    }

    const grid = document.getElementById('cal-grid-dias');
    if (!grid) return;

    const eventos = getEventosDelAmbito();
    const year = calState.anioActual;
    const month = calState.mesActual;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const paddingDays = (firstDayIndex + 6) % 7;

    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();

    const todayStr = new Date().toISOString().split('T')[0];

    let html = '';

    for (let i = paddingDays - 1; i >= 0; i--) {
        const dayNum = prevMonthTotalDays - i;
        html += `<div class="cal-dia-cell fuera-mes"><span class="cal-dia-numero">${dayNum}</span></div>`;
    }

    for (let d = 1; d <= totalDaysInMonth; d++) {
        const monthStr = String(month + 1).padStart(2, '0');
        const dayStr = String(d).padStart(2, '0');
        const fullDateStr = `${year}-${monthStr}-${dayStr}`;

        const eventosDia = eventos.filter(e => e.fecha === fullDateStr);
        const tieneEvento = eventosDia.length > 0;

        const isToday = fullDateStr === todayStr;
        const isSelected = calState.fechaFiltro === fullDateStr;

        let classes = ['cal-dia-cell'];
        if (isToday) classes.push('hoy');
        if (isSelected) classes.push('seleccionado');
        if (tieneEvento) classes.push('con-evento');

        let contenidoInner = `<span class="cal-dia-numero">${d}</span>`;

        if (tieneEvento) {
            contenidoInner += `<div class="cal-cruz-roja-marca" title="📅 Evento oficial: ${eventosDia.map(e => e.nombre).join(', ')}"><div class="cal-sello-logo"></div></div>`;
            contenidoInner += `<div class="cal-evento-badge" title="${eventosDia[0].nombre}">${eventosDia[0].barrio || 'Evento'}</div>`;
        }

        html += `
            <div class="${classes.join(' ')}" onclick="filtrarEventosPorFecha('${fullDateStr}')">
                ${contenidoInner}
            </div>
        `;
    }

    const totalCells = paddingDays + totalDaysInMonth;
    const remainingCells = (7 - (totalCells % 7)) % 7;
    for (let j = 1; j <= remainingCells; j++) {
        html += `<div class="cal-dia-cell fuera-mes"><span class="cal-dia-numero">${j}</span></div>`;
    }

    grid.innerHTML = html;
    renderEventos();
}

function filtrarEventosPorFecha(fechaStr) {
    if (calState.fechaFiltro === fechaStr) {
        calState.fechaFiltro = null;
    } else {
        calState.fechaFiltro = fechaStr;
    }
    actualizarCalendarioMedieval();
}

function limpiarFiltroFechaCalendario() {
    calState.fechaFiltro = null;
    actualizarCalendarioMedieval();
}

function obtenerEstadoVotacionEvento(evento) {
    // Los eventos sin votación son meramente informativos: nunca abren ventana
    // de puntuación ni cuentan para el campeón final.
    if (evento.tiene_votacion === false) {
        return {
            estado: 'SIN_VOTACION',
            texto: '📜 Evento informativo (sin votación)',
            clase: 'badge-sin-votacion',
            horaInicio: null,
            horaFin: null,
            fechaInicio: evento.fecha || '',
            fechaFin: evento.fecha_fin_votacion || evento.fecha || ''
        };
    }

    const horaInicio = evento.hora_inicio_votacion || evento.hora || '20:30';
    const horaFin = evento.hora_fin_votacion || '23:30';
    const fechaInicio = evento.fecha || '';
    const fechaFin = evento.fecha_fin_votacion || fechaInicio;

    if (evento.cerrado_manualmente) {
        return {
            estado: 'FINALIZADA',
            texto: `🔒 Votación Finalizada (Resultados Actualizados)`,
            clase: 'badge-cerrado',
            horaInicio,
            horaFin,
            fechaInicio,
            fechaFin
        };
    }

    const ahora = new Date();
    const ahoraHHMM = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
    const hoyStr = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')}`;

    if (!fechaInicio) {
        return {
            estado: 'NO_INICIADA',
            texto: `⏳ Votación Programada (Votación: ${horaInicio} a ${horaFin})`,
            clase: 'badge-pendiente',
            horaInicio,
            horaFin,
            fechaInicio,
            fechaFin
        };
    }

    const momentoInicio = fechaInicio ? `${fechaInicio}T${horaInicio}` : '';
    const momentoFin = fechaFin ? `${fechaFin}T${horaFin}` : '';
    const momentoAhora = `${hoyStr}T${ahoraHHMM}`;

    if (momentoInicio && momentoAhora < momentoInicio) {
        return {
            estado: 'NO_INICIADA',
            texto: `⏳ Votación No Iniciada (Empieza a las ${horaInicio})`,
            clase: 'badge-pendiente',
            horaInicio,
            horaFin,
            fechaInicio,
            fechaFin
        };
    }

    if (momentoFin && momentoAhora > momentoFin) {
        return {
            estado: 'FINALIZADA',
            texto: fechaFin !== fechaInicio
                ? `🔒 Votación Finalizada (Cerró el ${fechaFin} a las ${horaFin})`
                : `🔒 Votación Finalizada (Cerró a las ${horaFin})`,
            clase: 'badge-cerrado',
            horaInicio,
            horaFin,
            fechaInicio,
            fechaFin
        };
    }

    return {
        estado: 'ABIERTA',
        texto: `🟢 Votación Abierta (${horaInicio} - ${horaFin})`,
        clase: 'badge-abierto',
        horaInicio,
        horaFin,
        fechaInicio,
        fechaFin
    };
}

function renderEventos() {
    const lista = document.getElementById('lista-eventos');
    const tituloCronica = document.getElementById('titulo-cronica-eventos');
    const btnResetFiltro = document.getElementById('btn-reset-filtro-fecha');

    if (!lista) return;

    const todosLosEventos = getEventosDelAmbito();
    let eventosAmostrar = [];

    if (calState.fechaFiltro) {
        eventosAmostrar = todosLosEventos.filter(e => e.fecha === calState.fechaFiltro);
        if (tituloCronica) tituloCronica.textContent = `📜 Eventos del ${calState.fechaFiltro}`;
        if (btnResetFiltro) btnResetFiltro.style.display = 'inline-block';
    } else {
        const monthStr = String(calState.mesActual + 1).padStart(2, '0');
        const prefix = `${calState.anioActual}-${monthStr}`;
        eventosAmostrar = todosLosEventos.filter(e => e.fecha && e.fecha.startsWith(prefix));
        if (tituloCronica) tituloCronica.textContent = `📜 Crónica de Eventos: ${NOMBRES_MESES[calState.mesActual]} DE ${calState.anioActual}`;
        if (btnResetFiltro) btnResetFiltro.style.display = 'none';
    }

    if (eventosAmostrar.length === 0) {
        lista.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: #d6d3d1; padding: 25px; background: rgba(15,15,15,0.8); border: 1px dashed var(--oro-real); border-radius: 8px;">
                <p style="font-size: 1.1rem; font-style: italic; margin: 0;">🏰 No hay justas ni eventos registrados para ${calState.fechaFiltro ? 'el día ' + calState.fechaFiltro : 'el mes de ' + NOMBRES_MESES[calState.mesActual] + ' de ' + calState.anioActual}.</p>
                <p style="font-size: 0.85rem; color: #a1a1aa; margin-top: 6px;">Navega a otros meses o años con los botones de control para consultar las fechas de eventos publicados.</p>
            </div>
        `;
        return;
    }

    const repositorioVotos = getVotosDelAmbito();

    lista.innerHTML = eventosAmostrar.map(evt => {
        const estadoVot = obtenerEstadoVotacionEvento(evt);
        const votosEvt = repositorioVotos.filter(v =>
            v.evento_id != null
                ? String(v.evento_id) === String(evt.id)
                : (v.barrio || v.casa_visitada) === evt.barrio
                    && String(evt.id).startsWith('legacy-')
        );
        const numVotos = votosEvt.length;

        let resumenResultadosHTML = '';
        if (numVotos > 0) {
            const sumF = votosEvt.reduce((a, b) => a + Number(b.nota_festin || 0), 0);
            const sumC = votosEvt.reduce((a, b) => a + Number(b.nota_caminos || 0), 0);
            const sumE = votosEvt.reduce((a, b) => a + Number(b.nota_espiritu || 0), 0);

            const mediaF = (sumF / numVotos).toFixed(1);
            const mediaC = (sumC / numVotos).toFixed(1);
            const mediaE = (sumE / numVotos).toFixed(1);
            const notaLey2 = calcularNotaLeyII(mediaF, mediaC, mediaE).toFixed(2);
            const votacionCerrada = estadoVot.estado === 'FINALIZADA';

            resumenResultadosHTML = `
                <div style="margin: 12px 0; background: ${votacionCerrada ? 'rgba(35, 28, 15, 0.95)' : 'rgba(20, 30, 20, 0.8)'}; border: 2px solid ${votacionCerrada ? 'var(--oro-real)' : '#22c55e'}; padding: 10px; border-radius: 6px;">
                    <div style="font-family: 'Cinzel', serif; font-size: 0.8rem; color: ${votacionCerrada ? 'var(--oro-brillante)' : '#4ade80'}; font-weight: bold; margin-bottom: 4px; text-align: center; letter-spacing: 1px;">
                        ${votacionCerrada ? '🏆 RESULTADO FINAL DEL EVENTO' : '📊 RESULTADOS OFICIALES ACTUALIZADOS'} (${numVotos} votos)
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.82rem; color: #d6d3d1;">
                        <span>Ocio Hostelero: <strong>${mediaF}</strong></span>
                        <span>Accesibilidad: <strong>${mediaC}</strong></span>
                        <span>Ambiente: <strong>${mediaE}</strong></span>
                    </div>
                    <div style="margin-top: 4px; font-size: 0.95rem; color: var(--oro-brillante); font-weight: bold; text-align: center;">
                        🏆 Media del Códice: ${notaLey2} pts
                    </div>
                    ${votacionCerrada ? `<div style="margin-top:4px; font-size:0.78rem; color:#cbd5e1; text-align:center;">✅ Votación cerrada · resultado definitivo de <strong>${evt.barrio || 'Reino'}</strong></div>` : ''}
                </div>
            `;
        }

        const relojHTML = evt.tiene_votacion === false ? '' : construirHTMLRelojCuentaAtras(evt);
        const esSinVotacion = evt.tiene_votacion === false;
        const colorBadge = estadoVot.estado === 'ABIERTA' ? '#15803d'
            : estadoVot.estado === 'FINALIZADA' ? '#7f1d1d'
            : estadoVot.estado === 'SIN_VOTACION' ? '#334155'
            : '#854d0e';

        return `
            <div class="card-item" style="position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <span class="pill-user" style="background: rgba(185,28,28,0.8); color: #fff; font-weight: bold; padding: 3px 8px; border-radius: 12px; font-size: 0.8rem;">
                        🏰 ${evt.barrio || 'Reino'}
                    </span>
                    <span style="font-size: 0.82rem; color: var(--oro-brillante); font-weight: bold;">📅 ${evt.fecha} (${evt.hora || '20:00'})${evt.fecha_fin || evt.hora_fin ? ` → ${evt.fecha_fin || evt.fecha}${evt.hora_fin ? ` (${evt.hora_fin})` : ''}` : ''}</span>
                </div>

                <div style="margin-bottom: 6px;">
                    <span class="pill-user" style="font-size: 0.75rem; font-weight: bold; padding: 4px 10px; background: ${colorBadge}; color: #ffffff; display: inline-block;">
                        ${estadoVot.texto}
                    </span>
                </div>

                <!-- RELOJ CON CUENTA ATRÁS IMPERIAL EN TIEMPO REAL -->
                ${relojHTML}

                <h3 style="color: var(--oro-real); font-family: 'Cinzel', serif; margin: 6px 0 8px; font-size: 1.15rem;">${evt.nombre}</h3>
                <p style="font-size: 0.88rem; color: #d6d3d1; margin-bottom: 6px;"><strong>📍 Lugar:</strong> ${evt.lugar || 'Bilbao'}</p>
                ${esSinVotacion ? `<p style="font-size: 0.82rem; color: #cbd5e1; margin-bottom: 10px;">📜 <strong>Evento informativo:</strong> no admite votación ni puntuación.</p>` : `<p style="font-size: 0.82rem; color: #a1a1aa; margin-bottom: 10px;">
                    ⏰ <strong>Franja Votación:</strong> ${estadoVot.horaInicio} hs a ${estadoVot.horaFin} hs
                </p>`}

                ${evt.desc ? `<p style="font-size: 0.85rem; color: #a1a1aa; font-style: italic; margin-bottom: 10px;">"${evt.desc}"</p>` : ''}
                
                ${resumenResultadosHTML}

                <button onclick='descargarICSEvento(${JSON.stringify(evt)})' class="btn-cuervo" style="padding: 6px 12px; font-size: 0.85rem; background: #15803d; width: 100%; margin-top: 4px;">
                    📅 Añadir a Google Calendar (.ics)
                </button>
            </div>
        `;
    }).join('');
}

let timerRelojCuentaAtrasId = null;

function construirHTMLRelojCuentaAtras(evt) {
    const estadoVot = obtenerEstadoVotacionEvento(evt);
    const horaInicio = evt.hora_inicio_votacion || evt.hora || '20:30';
    const horaFin = evt.hora_fin_votacion || '23:30';

    const fechaEvtStr = evt.fecha || new Date().toISOString().split('T')[0];
    const fechaFinVotStr = evt.fecha_fin_votacion || fechaEvtStr;
    const targetInicio = new Date(`${fechaEvtStr}T${horaInicio}:00`);
    const targetFin = new Date(`${fechaFinVotStr}T${horaFin}:00`);
    const ahora = new Date();

    if (evt.cerrado_manualmente || estadoVot.estado === 'FINALIZADA' || ahora > targetFin) {
        return `
            <div class="countdown-box-medieval">
                <div style="font-size: 0.78rem; color: #a1a1aa; font-weight: bold; text-transform: uppercase;">🔒 Votación Concluida</div>
                <div style="font-size: 0.88rem; color: #ef4444; font-weight: bold; margin-top: 2px;">Resultados Oficiales Publicados</div>
            </div>
        `;
    }

    let claseBox = 'countdown-box-medieval';
    let tituloBox = '';
    let targetTime = null;
    let esActiva = false;

    if (ahora < targetInicio) {
        claseBox = 'countdown-box-medieval pendiente';
        tituloBox = '⏳ Inicio de Votación en:';
        targetTime = targetInicio;
    } else {
        esActiva = true;
        claseBox = 'countdown-box-medieval activo';
        tituloBox = '🔥 ¡Votación Activa! Cierre en:';
        targetTime = targetFin;
    }

    const diffMs = Math.max(0, targetTime - ahora);
    const totalSeg = Math.floor(diffMs / 1000);
    const esUltimoMinuto = esActiva && totalSeg <= 60;

    if (esUltimoMinuto) {
        claseBox = 'countdown-box-medieval activo ultimo-minuto';
        tituloBox = '🚨 ¡ÚLTIMO MINUTO PARA EMITIR TU VOTO!';
    }

    const dias = Math.floor(totalSeg / (3600 * 24));
    const horas = Math.floor((totalSeg % (3600 * 24)) / 3600);
    const minutos = Math.floor((totalSeg % 3600) / 60);
    const segundos = totalSeg % 60;

    const pad = n => String(n).padStart(2, '0');

    let digitsHTML = '';
    if (dias > 0) {
        digitsHTML += `<span>${dias}d</span>:`;
    }
    digitsHTML += `<span>${pad(horas)}h</span>:<span>${pad(minutos)}m</span>:<span style="${esUltimoMinuto ? 'color:#ef4444;font-size:1.3rem;' : ''}">${pad(segundos)}s</span>`;

    const bannerAlerta = esUltimoMinuto ? `
        <div class="aviso-ultimo-minuto-banner">
            🚨 ¡ATENCIÓN MAESTRE! ÚLTIMO MINUTO PARA VOTAR EN ESTA JUSTA. LA VOTACIÓN CIERRA EN BREVE. 🚨
        </div>
    ` : '';

    return `
        <div class="${claseBox}" data-countdown-evt-id="${evt.id}" data-target="${targetTime.getTime()}" data-is-active="${esActiva ? '1' : '0'}">
            <div class="countdown-label" style="font-size: 0.78rem; color: ${esUltimoMinuto ? '#f87171' : '#e5c36a'}; font-weight: bold; text-transform: uppercase;">${tituloBox}</div>
            <div class="countdown-timer-digits">${digitsHTML}</div>
            ${bannerAlerta}
        </div>
    `;
}

function iniciarTimerRelojCuentaAtras() {
    if (timerRelojCuentaAtrasId) clearInterval(timerRelojCuentaAtrasId);

    let tickBloqueVotacion = 0;
    timerRelojCuentaAtrasId = setInterval(() => {
        if (++tickBloqueVotacion % 5 === 0 && typeof actualizarBloqueVotacion === 'function') {
            actualizarBloqueVotacion();
        }
        const boxes = document.querySelectorAll('[data-countdown-evt-id]');
        if (boxes.length === 0) return;

        const ahora = new Date();

        boxes.forEach(box => {
            const targetMs = parseInt(box.getAttribute('data-target'), 10);
            if (!targetMs) return;

            const diffMs = Math.max(0, targetMs - ahora);
            const totalSeg = Math.floor(diffMs / 1000);
            const isActive = box.getAttribute('data-is-active') === '1';

            if (totalSeg <= 0) {
                if (typeof renderEventos === 'function') renderEventos();
                return;
            }

            const esUltimoMinuto = isActive && totalSeg <= 60;
            if (esUltimoMinuto && !box.classList.contains('ultimo-minuto')) {
                box.classList.add('ultimo-minuto');
                const label = box.querySelector('.countdown-label');
                if (label) {
                    label.textContent = '🚨 ¡ÚLTIMO MINUTO PARA EMITIR TU VOTO!';
                    label.style.color = '#f87171';
                }
                let banner = box.querySelector('.aviso-ultimo-minuto-banner');
                if (!banner) {
                    banner = document.createElement('div');
                    banner.className = 'aviso-ultimo-minuto-banner';
                    banner.innerHTML = '🚨 ¡ATENCIÓN MAESTRE! ÚLTIMO MINUTO PARA VOTAR EN ESTA JUSTA. LA VOTACIÓN CIERRA EN BREVE. 🚨';
                    box.appendChild(banner);
                }
            }

            const dias = Math.floor(totalSeg / (3600 * 24));
            const horas = Math.floor((totalSeg % (3600 * 24)) / 3600);
            const minutos = Math.floor((totalSeg % 3600) / 60);
            const segundos = totalSeg % 60;
            const pad = n => String(n).padStart(2, '0');

            const digitsEl = box.querySelector('.countdown-timer-digits');
            if (digitsEl) {
                let digitsHTML = '';
                if (dias > 0) {
                    digitsHTML += `<span>${dias}d</span>:`;
                }
                digitsHTML += `<span>${pad(horas)}h</span>:<span>${pad(minutos)}m</span>:<span style="${esUltimoMinuto ? 'color:#ef4444;font-size:1.3rem;' : ''}">${pad(segundos)}s</span>`;
                digitsEl.innerHTML = digitsHTML;
            }
        });
    }, 1000);
}


async function pedirCredencialesSuperadmin() {
    const user = getCurrentUser();
    if (!user || !puedeAdministrar(user.role)) {
        throw new Error('Solo el superadministrador puede gestionar eventos.');
    }

    const phone = String(user.phone || user.telefono || '').trim();
    if (!phone) {
        throw new Error('La sesión no contiene el teléfono del usuario.');
    }

    const pin = window.prompt(
        'Introduce el PIN de administración para confirmar la operación:'
    );

    if (pin === null || !pin.trim()) {
        return null;
    }

    const client = getSupabaseBarriosClient();
    if (!client) {
        throw new Error('No se ha podido conectar con Supabase.');
    }

    return { client, phone, pin: pin.trim() };
}

async function guardarEventoEnSupabase(evento) {
    const credenciales = await pedirCredencialesSuperadmin();
    if (!credenciales) return false;

    const { client, phone, pin } = credenciales;
    const payload = {
        id: String(evento.id),
        nombre: String(evento.nombre || '').trim(),
        barrio: String(evento.barrio || 'Reino').trim(),
        fecha: String(evento.fecha || '').slice(0, 10),
        fecha_fin: evento.fecha_fin ? String(evento.fecha_fin).slice(0, 10) : null,
        lugar: String(evento.lugar || '').trim(),
        hora: evento.hora || '20:00',
        hora_fin: evento.hora_fin || null,
        hora_inicio_votacion: evento.hora_inicio_votacion || '20:30',
        hora_fin_votacion: evento.hora_fin_votacion || '23:30',
        fecha_fin_votacion: evento.fecha_fin_votacion ? String(evento.fecha_fin_votacion).slice(0, 10) : null,
        desc: evento.desc || evento.descripcion || '',
        tiene_votacion: evento.tiene_votacion !== false,
        cerrado_manualmente: Boolean(evento.cerrado_manualmente)
    };

    const { data, error } = await client.rpc('guardar_evento_superadmin', {
        p_phone: phone,
        p_pin: pin,
        p_evento: payload
    });

    if (error) throw error;

    await cargarEventosDesdeSupabase();

    const guardado = Array.isArray(data) ? data[0] : data;
    if (!guardado || String(guardado.id) !== payload.id) {
        throw new Error(
            'Supabase respondió, pero no se pudo confirmar el evento guardado.'
        );
    }

    return true;
}

async function eliminarEventoEnSupabase(eventoId) {
    const credenciales = await pedirCredencialesSuperadmin();
    if (!credenciales) return false;

    const { client, phone, pin } = credenciales;
    const { data, error } = await client.rpc('eliminar_evento_superadmin', {
        p_phone: phone,
        p_pin: pin,
        p_evento_id: String(eventoId)
    });

    if (error) throw error;
    if (data !== true) {
        throw new Error('Supabase no confirmó la eliminación del evento.');
    }

    await cargarEventosDesdeSupabase();
    return true;
}

function editarEventoBarrio(eventoId) {
    const user = getCurrentUser();
    if (!user || !puedeAdministrar(user.role)) {
        alert('Solo el Superadministrador puede editar eventos.');
        return;
    }

    const todos = getEventosDelAmbito();
    const evt = todos.find(e => e.id === eventoId);
    if (!evt) return;

    document.getElementById('evento-id-edit').value = evt.id;
    document.getElementById('evento-barrio').value = evt.barrio || 'Casco Viejo';
    document.getElementById('evento-nombre').value = evt.nombre || '';
    document.getElementById('evento-fecha').value = evt.fecha || '';
    document.getElementById('evento-fecha-fin').value = evt.fecha_fin || '';
    document.getElementById('evento-lugar').value = evt.lugar || '';
    document.getElementById('evento-hora').value = evt.hora || '20:00';
    document.getElementById('evento-hora-fin').value = evt.hora_fin || '';
    document.getElementById('evento-votacion-inicio').value = evt.hora_inicio_votacion || '20:30';
    document.getElementById('evento-votacion-fin').value = evt.hora_fin_votacion || '23:30';
    document.getElementById('evento-votacion-fecha-fin').value = evt.fecha_fin_votacion || '';
    document.getElementById('evento-desc').value = evt.desc || '';

    const btnGuardar = document.getElementById('btn-guardar-evento');
    const btnCancelar = document.getElementById('btn-cancelar-evento');
    if (btnGuardar) btnGuardar.textContent = '💾 Actualizar Evento';
    if (btnCancelar) btnCancelar.style.display = 'inline-block';

    const panelAdmin = document.getElementById('contenedor-gestion-eventos-admin');
    if (panelAdmin) {
        panelAdmin.style.display = 'block';
        panelAdmin.scrollIntoView({ behavior: 'smooth' });
    }
    activarModoEdicion(document.getElementById('form-evento'), `evento: ${evt.nombre || evt.id}`);
}

function resetFormEvento() {
    const form = document.getElementById('form-evento');
    if (form) form.reset();
    desactivarModoEdicion(form);
    const editId = document.getElementById('evento-id-edit');
    if (editId) editId.value = '';
    const btnGuardar = document.getElementById('btn-guardar-evento');
    const btnCancelar = document.getElementById('btn-cancelar-evento');
    if (btnGuardar) btnGuardar.textContent = '📅 Programar / Editar Evento';
    if (btnCancelar) btnCancelar.style.display = 'none';
}


async function eliminarEventoBarrio(eventoId) {
    const user = getCurrentUser();
    if (!user || !puedeAdministrar(user.role)) {
        alert('Solo el Superadministrador puede borrar eventos.');
        return;
    }

    if (!confirm('¿Seguro que deseas eliminar este evento del calendario oficial?')) {
        return;
    }

    try {
        await eliminarEventoEnSupabase(eventoId);
        alert('Evento eliminado correctamente en Supabase.');
        actualizarCalendarioMedieval();
        renderEventosGeneradosPestanaAdmin();
    } catch (error) {
        console.error('Error al eliminar evento:', error);
        alert('No se pudo eliminar el evento: ' + (error.message || error));
    }
}


async function toggleCerrarVotacionEvento(eventoId) {
    const user = getCurrentUser();
    if (!user || !puedeAdministrar(user.role)) {
        alert('Solo el Superadministrador puede cerrar o abrir votaciones.');
        return;
    }

    const evt = getEventosDelAmbito().find(
        e => String(e.id) === String(eventoId)
    );

    if (!evt) {
        alert('No se ha encontrado el evento.');
        return;
    }

    const actualizado = {
        ...evt,
        cerrado_manualmente: !Boolean(evt.cerrado_manualmente)
    };

    try {
        const guardado = await guardarEventoEnSupabase(actualizado);
        if (!guardado) return;

        alert(
            `Votación del evento "${actualizado.nombre}" ` +
            `${actualizado.cerrado_manualmente ? 'cerrada' : 'reabierta'} correctamente.`
        );
        actualizarCalendarioMedieval();
    } catch (error) {
        console.error('Error al cambiar el estado de votación:', error);
        alert('No se pudo actualizar la votación: ' + (error.message || error));
    }
}


async function guardarEventoBarrio(event) {
    if (event) event.preventDefault();

    const user = getCurrentUser();
    if (!user || !puedeAdministrar(user.role)) {
        alert('Solo el Superadministrador puede programar o editar eventos.');
        return;
    }

    const editId = document.getElementById('evento-id-edit')?.value;
    const barrio = document.getElementById('evento-barrio')?.value || 'Reino';
    const nombre = document.getElementById('evento-nombre')?.value?.trim();
    const fecha = document.getElementById('evento-fecha')?.value;
    const fechaFin = document.getElementById('evento-fecha-fin')?.value || '';
    const lugar = document.getElementById('evento-lugar')?.value?.trim();
    const hora = document.getElementById('evento-hora')?.value || '20:00';
    const horaFin = document.getElementById('evento-hora-fin')?.value || '';
    const horaInicioVotacion =
        document.getElementById('evento-votacion-inicio')?.value || '20:30';
    const horaFinVotacion =
        document.getElementById('evento-votacion-fin')?.value || '23:30';
    const fechaFinVotacion =
        document.getElementById('evento-votacion-fecha-fin')?.value || '';
    const desc = document.getElementById('evento-desc')?.value || '';

    if (!nombre || !fecha || !lugar) {
        alert('Por favor completa los campos obligatorios del evento.');
        return;
    }

    if (!String(barrio || '').trim() || barrio === 'Reino'
        || !getBarriosRegistradosDelAmbito().includes(barrio)) {
        alert('Primero da de alta el barrio en «Gestión de Barrios» para poder programar su evento. Ese barrio entrará en el sorteo.');
        return;
    }

    const yaExisteEventoBarrio = getEventosDelAmbito().find(e =>
        e.barrio === barrio && String(e.id) !== String(editId || ''));
    if (yaExisteEventoBarrio) {
        alert(`El barrio «${barrio}» ya tiene un evento programado ("${yaExisteEventoBarrio.nombre}"). Solo puede existir un evento por barrio.`);
        return;
    }

    if (fechaFin && fechaFin < fecha) {
        alert('La fecha de finalización del evento no puede ser anterior a la fecha de inicio.');
        return;
    }

    if (fechaFinVotacion && fechaFinVotacion < fecha) {
        alert('La fecha de cierre de votaciones no puede ser anterior a la fecha del evento.');
        return;
    }

    const evento = {
        id: editId || `evt-custom-${Date.now()}`,
        nombre,
        barrio,
        fecha,
        fecha_fin: fechaFin,
        lugar,
        hora,
        hora_fin: horaFin,
        hora_inicio_votacion: horaInicioVotacion,
        hora_fin_votacion: horaFinVotacion,
        fecha_fin_votacion: fechaFinVotacion,
        desc,
        cerrado_manualmente: editId
            ? Boolean(getEventosDelAmbito().find(e => String(e.id) === String(editId))?.cerrado_manualmente)
            : false
    };

    try {
        const guardado = await guardarEventoEnSupabase(evento);
        if (!guardado) return;

        alert(`Evento "${nombre}" ${editId ? 'actualizado' : 'creado'} correctamente en Supabase.`);
        resetFormEvento();
        actualizarCalendarioMedieval();
    } catch (error) {
        console.error('Error al guardar evento:', error);
        alert('No se pudo guardar el evento: ' + (error.message || error));
    }
}


function poblarSelectBarriosEvento() {
    const select = document.getElementById('evento-barrio');
    const selectDedicated = document.getElementById('evento-dedicated-barrio');
    const barrios = getBarriosRegistradosDelAmbito();
    const optionsHTML = barrios.map(b => `<option value="${b}">${b}</option>`).join('');

    if (select) select.innerHTML = optionsHTML;
    if (selectDedicated) selectDedicated.innerHTML = optionsHTML;
}


async function guardarEventoBarrioDesdePestana(event) {
    if (event) event.preventDefault();

    const user = getCurrentUser();
    if (!user || !puedeAdministrar(user.role)) {
        alert('Solo el Superadministrador puede gestionar eventos.');
        return;
    }

    const editId = document.getElementById('evento-dedicated-id-edit')?.value;
    const barrio = document.getElementById('evento-dedicated-barrio')?.value || 'Reino';
    const nombre = document.getElementById('evento-dedicated-nombre')?.value?.trim();
    const fecha = document.getElementById('evento-dedicated-fecha')?.value;
    const fechaFin = document.getElementById('evento-dedicated-fecha-fin')?.value || '';
    const lugar = document.getElementById('evento-lugar')?.value?.trim();
    const hora = document.getElementById('evento-hora')?.value || '20:00';
    const horaFin = document.getElementById('evento-dedicated-hora-fin')?.value || '';
    const horaInicioVotacion =
        document.getElementById('evento-dedicated-votacion-inicio')?.value || '20:30';
    const horaFinVotacion =
        document.getElementById('evento-dedicated-votacion-fin')?.value || '23:30';
    const fechaFinVotacion =
        document.getElementById('evento-dedicated-votacion-fecha-fin')?.value || '';
    const desc = document.getElementById('evento-dedicated-desc')?.value || '';
    const tieneVotacion =
        (document.getElementById('evento-dedicated-tiene-votacion')?.value || 'con') !== 'sin';

    if (!nombre || !fecha || !lugar) {
        alert('Por favor, completa los campos requeridos del evento.');
        return;
    }

    if (!String(barrio || '').trim() || barrio === 'Reino'
        || !getBarriosRegistradosDelAmbito().includes(barrio)) {
        alert('Primero da de alta el barrio en «Gestión de Barrios» para poder programar su evento. Ese barrio entrará en el sorteo.');
        return;
    }

    const yaExisteEventoBarrio = getEventosDelAmbito().find(e =>
        e.barrio === barrio && String(e.id) !== String(editId || ''));
    if (yaExisteEventoBarrio) {
        alert(`El barrio «${barrio}» ya tiene un evento programado ("${yaExisteEventoBarrio.nombre}"). Solo puede existir un evento por barrio.`);
        return;
    }

    if (fechaFin && fechaFin < fecha) {
        alert('La fecha de finalización del evento no puede ser anterior a la fecha de inicio.');
        return;
    }

    if (tieneVotacion && fechaFinVotacion && fechaFinVotacion < fecha) {
        alert('La fecha de cierre de votaciones no puede ser anterior a la fecha del evento.');
        return;
    }

    const evento = {
        id: editId || `evt-custom-${Date.now()}`,
        nombre,
        barrio,
        fecha,
        fecha_fin: fechaFin,
        lugar,
        hora,
        hora_fin: horaFin,
        hora_inicio_votacion: horaInicioVotacion,
        hora_fin_votacion: horaFinVotacion,
        fecha_fin_votacion: fechaFinVotacion,
        desc,
        tiene_votacion: tieneVotacion,
        cerrado_manualmente: editId
            ? Boolean(getEventosDelAmbito().find(e => String(e.id) === String(editId))?.cerrado_manualmente)
            : false
    };

    try {
        const guardado = await guardarEventoEnSupabase(evento);
        if (!guardado) return;

        alert(`Evento "${nombre}" ${editId ? 'actualizado' : 'creado'} correctamente en Supabase.`);
        resetFormEventoDedicated();
        actualizarCalendarioMedieval();
        renderEventosGeneradosPestanaAdmin();
    } catch (error) {
        console.error('Error al guardar evento desde administración:', error);
        alert('No se pudo guardar el evento: ' + (error.message || error));
    }
}

// Muestra u oculta los campos de la ventana de votación según el tipo de evento
// elegido (Con Votación / Sin Votación). Al ocultarlos se desactivan para que no
// bloqueen el envío del formulario con la validación `required`.
function alternarCamposVotacionEvento() {
    const selector = document.getElementById('evento-dedicated-tiene-votacion');
    const campos = document.getElementById('evento-dedicated-votacion-campos');
    if (!selector || !campos) return;
    const conVotacion = selector.value !== 'sin';
    campos.style.display = conVotacion ? 'flex' : 'none';
    campos.querySelectorAll('input').forEach(input => {
        input.disabled = !conVotacion;
    });
}

function resetFormEventoDedicated() {
    const form = document.getElementById('form-evento-admin-dedicated');
    if (form) form.reset();
    desactivarModoEdicion(form);
    const editId = document.getElementById('evento-dedicated-id-edit');
    if (editId) editId.value = '';
    const btnGuardar = document.getElementById('btn-guardar-evento-dedicated');
    const btnCancelar = document.getElementById('btn-cancelar-evento-dedicated');
    if (btnGuardar) btnGuardar.textContent = '✨ Generar / Guardar Evento';
    if (btnCancelar) btnCancelar.style.display = 'none';
    const selector = document.getElementById('evento-dedicated-tiene-votacion');
    if (selector) selector.value = 'con';
    alternarCamposVotacionEvento();
}

function editarEventoBarrioDesdePestana(eventoId) {
    const todos = getEventosDelAmbito();
    const evt = todos.find(e => e.id === eventoId);
    if (!evt) return;

    document.getElementById('evento-dedicated-id-edit').value = evt.id;
    document.getElementById('evento-dedicated-barrio').value = evt.barrio || 'Casco Viejo';
    document.getElementById('evento-dedicated-nombre').value = evt.nombre || '';
    document.getElementById('evento-dedicated-fecha').value = evt.fecha || '';
    document.getElementById('evento-dedicated-fecha-fin').value = evt.fecha_fin || '';
    document.getElementById('evento-lugar').value = evt.lugar || '';
    document.getElementById('evento-hora').value = evt.hora || '20:00';
    document.getElementById('evento-dedicated-hora-fin').value = evt.hora_fin || '';
    document.getElementById('evento-dedicated-votacion-inicio').value = evt.hora_inicio_votacion || '20:30';
    document.getElementById('evento-dedicated-votacion-fin').value = evt.hora_fin_votacion || '23:30';
    document.getElementById('evento-dedicated-votacion-fecha-fin').value = evt.fecha_fin_votacion || '';
    document.getElementById('evento-dedicated-desc').value = evt.desc || '';
    const selectorVotacion = document.getElementById('evento-dedicated-tiene-votacion');
    if (selectorVotacion) selectorVotacion.value = evt.tiene_votacion === false ? 'sin' : 'con';
    alternarCamposVotacionEvento();

    const btnGuardar = document.getElementById('btn-guardar-evento-dedicated');
    const btnCancelar = document.getElementById('btn-cancelar-evento-dedicated');
    if (btnGuardar) btnGuardar.textContent = '💾 Actualizar Evento';
    if (btnCancelar) btnCancelar.style.display = 'inline-block';

    const form = document.getElementById('form-evento-admin-dedicated');
    if (form) form.scrollIntoView({ behavior: 'smooth' });
    activarModoEdicion(form, `evento: ${evt.nombre || evt.id}`);
}

function renderEventosGeneradosPestanaAdmin() {
    const container = document.getElementById('lista-eventos-generados-admin');
    if (!container) return;

    const eventos = getEventosDelAmbito();
    if (!eventos || eventos.length === 0) {
        container.innerHTML = `<div style="text-align: center; color: #94a3b8; padding: 20px;">No hay eventos generados registrados.</div>`;
        return;
    }

    container.innerHTML = eventos.map(evt => {
        const estadoVot = obtenerEstadoVotacionEvento(evt);
        return `
            <div class="card-item" style="border: 1px solid var(--oro-real); background: rgba(20, 15, 10, 0.9);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span class="pill-user" style="background: rgba(185,28,28,0.8); color: #fff; font-weight: bold; padding: 3px 8px; border-radius: 12px; font-size: 0.8rem;">
                        🏰 ${evt.barrio || 'Reino'}
                    </span>
                    <span style="font-size: 0.82rem; color: var(--oro-brillante); font-weight: bold;">📅 ${evt.fecha} (${evt.hora || '20:00'})${evt.fecha_fin || evt.hora_fin ? ` → ${evt.fecha_fin || evt.fecha}${evt.hora_fin ? ` (${evt.hora_fin})` : ''}` : ''}</span>
                </div>
                <h4 style="color: var(--oro-real); font-family: 'Cinzel', serif; margin: 4px 0;">${evt.nombre}</h4>
                <p style="font-size: 0.85rem; color: #d6d3d1; margin-bottom: 4px;"><strong>📍 Lugar:</strong> ${evt.lugar || 'N/A'}</p>
                ${evt.tiene_votacion === false
                    ? `<p style="font-size: 0.82rem; color: #cbd5e1; margin-bottom: 10px;">📜 <strong>Tipo:</strong> Evento informativo (sin votación)</p>`
                    : `<p style="font-size: 0.82rem; color: #a1a1aa; margin-bottom: 10px;">
                    🗳️ <strong>Tipo:</strong> Con votación · ⏰ ${estadoVot.horaInicio} a ${estadoVot.horaFin} hs (${estadoVot.texto})
                </p>`}
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                    <button onclick="editarEventoBarrioDesdePestana('${evt.id}')" class="btn-cuervo" style="padding: 4px 8px; font-size: 0.78rem; background: #2563eb; flex: 1;">✏️ Editar</button>
                    ${evt.tiene_votacion === false ? '' : `<button onclick="toggleCerrarVotacionEvento('${evt.id}')" class="btn-cuervo" style="padding: 4px 8px; font-size: 0.78rem; background: ${evt.cerrado_manualmente ? '#166534' : '#d97706'}; flex: 1.2;">
                        ${evt.cerrado_manualmente ? '🟢 Abrir' : '🔒 Cerrar'}
                    </button>`}
                    <button onclick="eliminarEventoBarrio('${evt.id}')" class="btn-cuervo" style="padding: 4px 8px; font-size: 0.78rem; background: #7f1d1d; flex: 0.8;">🗑️ Eliminar</button>
                </div>
            </div>
        `;
    }).join('');
}

/* ==========================================
   LÓGICA DE LA GRAN GALA FINAL DE CELEBRACIÓN
   ========================================== */

const GALA_FINAL_DEFAULT = {
    titulo: 'Gran Coronación del Lokibarrio Txapeldun',
    lugar: 'Teatro Arriaga / Plaza Nueva',
    fecha: '2026-10-20T20:30',
    premio: 'El Barril de Oro Imperial, el Trono Feudal de Bilbao y Pase VIP Dorado para la Gran Gala Final para todos sus Maestres de Honor.'
};

// Configuración de la Gala Final cacheada desde el servidor del Reino. Es la
// fuente de verdad compartida: todos los navegadores ven exactamente lo mismo.
let galaFinalConfigServidor = null;

function getGalaFinalConfig() {
    if (galaFinalConfigServidor && typeof galaFinalConfigServidor === 'object') {
        return galaFinalConfigServidor;
    }
    return GALA_FINAL_DEFAULT;
}

// La Gala Final solo se considera publicada cuando la corte la ha guardado en
// el servidor. Hasta entonces su pestaña permanece oculta a los maestres.
function galaFinalEstaPublicada() {
    return Boolean(galaFinalConfigServidor && galaFinalConfigServidor.publicada !== false);
}

// Lee la convocatoria de la Gala Final desde Supabase (sin token: es
// información pública para toda la corte) y refresca la interfaz.
async function cargarGalaFinalDesdeSupabase() {
    const client = getSupabaseBarriosClient();
    if (!client) return;
    try {
        const { data, error } = await client.rpc('gala_final_config_actual');
        if (error) throw error;
        galaFinalConfigServidor = (data && typeof data === 'object') ? data : null;
    } catch (error) {
        console.error('No se pudo cargar la Gala Final desde Supabase:', error);
    }
    renderGalaFinal();
    aplicarVisibilidadGalaFinal();
}

// Muestra u oculta la opción de la Gala Final en el menú de la corte según el
// rol del usuario y si la administración ya la ha publicado.
function aplicarVisibilidadGalaFinal() {
    const usuario = getCurrentUser();
    const esAdmin = Boolean(usuario && puedeAdministrar(usuario.role));
    const option = document.querySelector('#select-seccion-corte option[value="pestana-evento-final"]');
    if (option) option.style.display = (esAdmin || galaFinalEstaPublicada()) ? '' : 'none';
}

function renderGalaFinal() {
    const config = getGalaFinalConfig();

    const displayTitulo = document.getElementById('display-gala-titulo');
    const displayLugar = document.getElementById('display-gala-lugar');
    const displayFecha = document.getElementById('display-gala-fecha');
    const displayPremio = document.getElementById('display-gala-premio');

    if (displayTitulo) displayTitulo.textContent = config.titulo || GALA_FINAL_DEFAULT.titulo;
    if (displayLugar) displayLugar.textContent = config.lugar || GALA_FINAL_DEFAULT.lugar;
    if (displayFecha) {
        const dateObj = config.fecha ? new Date(config.fecha) : new Date('2026-10-20T20:30');
        displayFecha.textContent = !isNaN(dateObj) ? dateObj.toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' }) : config.fecha;
    }
    if (displayPremio) displayPremio.textContent = config.premio || GALA_FINAL_DEFAULT.premio;

    const currentUser = getCurrentUser();
    const esAdmin = currentUser && puedeAdministrar(currentUser.role);

    const panelAdmin = document.getElementById('contenedor-gala-admin-panel');
    if (panelAdmin) panelAdmin.style.display = esAdmin ? 'block' : 'none';

    const inputTitulo = document.getElementById('final-titulo');
    const inputLugar = document.getElementById('final-lugar');
    const inputFecha = document.getElementById('final-fecha');
    const inputPremio = document.getElementById('final-premio');

    if (inputTitulo) inputTitulo.value = config.titulo || '';
    if (inputLugar) inputLugar.value = config.lugar || '';
    if (inputFecha && !inputFecha.value) inputFecha.value = config.fecha || '2026-10-20T20:30';
    if (inputPremio) inputPremio.value = config.premio || '';
}

async function guardarEventoFinal(event) {
    if (event) event.preventDefault();

    const user = getCurrentUser();
    if (!user || !puedeAdministrar(user.role)) {
        alert('Acceso restringido: Solo el Superadministrador puede modificar la Gala Final.');
        return;
    }

    const client = getSupabaseBarriosClient();
    if (!client || !user.token) {
        alert('No hay conexión con el servidor del Reino. Vuelve a iniciar sesión e inténtalo de nuevo.');
        return;
    }

    const config = {
        titulo: document.getElementById('final-titulo')?.value || GALA_FINAL_DEFAULT.titulo,
        lugar: document.getElementById('final-lugar')?.value || GALA_FINAL_DEFAULT.lugar,
        fecha: document.getElementById('final-fecha')?.value || GALA_FINAL_DEFAULT.fecha,
        premio: document.getElementById('final-premio')?.value || GALA_FINAL_DEFAULT.premio,
        publicada: true
    };

    const button = document.getElementById('btn-guardar-gala');
    if (button) button.disabled = true;
    try {
        const { data, error } = await client.rpc('guardar_gala_final', {
            p_token: user.token,
            p_config: config
        });
        if (error) throw error;
        galaFinalConfigServidor = (data && typeof data === 'object') ? data : config;
        alert('👑 ¡Gala Final publicada! Toda la corte podrá ver la convocatoria.');
    } catch (error) {
        console.error('No se pudo publicar la Gala Final:', error);
        alert(`No se pudo guardar la Gala Final: ${error.message || 'error desconocido'}`);
    } finally {
        if (button) button.disabled = false;
    }
    renderGalaFinal();
    aplicarVisibilidadGalaFinal();
}

async function borrarConfiguracionGalaFinal() {
    const user = getCurrentUser();
    if (!user || !puedeAdministrar(user.role)) {
        alert('Acceso restringido a Superadmin.');
        return;
    }

    if (!confirm('🗑️ ¿Deseas despublicar y restablecer la Gala Final a sus valores predeterminados del Reino?')) {
        return;
    }

    const client = getSupabaseBarriosClient();
    if (!client || !user.token) {
        alert('No hay conexión con el servidor del Reino. Vuelve a iniciar sesión e inténtalo de nuevo.');
        return;
    }

    try {
        const { error } = await client.rpc('borrar_gala_final', { p_token: user.token });
        if (error) throw error;
        galaFinalConfigServidor = null;
        alert('✅ Gala Final despublicada y restablecida.');
    } catch (error) {
        console.error('No se pudo despublicar la Gala Final:', error);
        alert(`No se pudo restablecer la Gala Final: ${error.message || 'error desconocido'}`);
    }
    renderGalaFinal();
    aplicarVisibilidadGalaFinal();
}

function descargarICSGalaFinal() {
    const config = getGalaFinalConfig();
    const evento = {
        id: 'gala-final-bilbao',
        nombre: config.titulo || 'Gran Gala Final del Lokitrono',
        lugar: config.lugar || 'Teatro Arriaga',
        fecha: (config.fecha || '2026-10-20').split('T')[0],
        hora: (config.fecha || '2026-10-20T20:30').split('T')[1] || '20:30'
    };
    descargarICSEvento(evento);
}

/* ==========================================
   INTEGRACIÓN MAKE.COM & WHATSAPP (Bienvenidas y PIN)
   ========================================== */

function getSitioPublico() {
    const base = (window.LOKI_LEGAL && window.LOKI_LEGAL.sitio) || 'https://lokitronodebarrios.vercel.app';
    return base.endsWith('/') ? base : `${base}/`;
}

function generarPinSeisDigitos() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

// El escenario de Make antepone "34" al número (to = "34{{telefono}}").
// Normalizamos a los 9 dígitos nacionales para evitar destinos como "34+34605676002".
function normalizarTelefonoWhatsApp(phone) {
    if (!phone) return "";
    let p = String(phone).replace(/\s+/g, "").replace(/\+/g, "");
    p = p.replace(/\D/g, "");
    if (p.startsWith("0034")) p = p.slice(4);
    else if (p.startsWith("34") && p.length > 9) p = p.slice(2);
    return p;
}

function etiquetaRol(role) {
    const etiquetas = {
        master: ' Administrador',
        superadmin: 'Superadmin',
        tronista: 'Lokitronista',
        jugador: 'Maestre'
    };
    return etiquetas[role] || 'Maestre';
}

function getMakeWebhookUrl() {
    try {
        const guardada = localStorage.getItem('make_webhook_url');
        if (guardada && guardada.trim()) return guardada.trim();
    } catch (e) { /* almacenamiento no disponible */ }
    const cfg = (window.__APP_CONFIG__ && window.__APP_CONFIG__.MAKE_WEBHOOK_URL) || window.MAKE_WEBHOOK_URL || '';
    return String(cfg).trim();
}

function actualizarBadgeMake() {
    const badge = document.getElementById('badge-make-webhook-status');
    const input = document.getElementById('input-make-webhook-url');
    const url = getMakeWebhookUrl();
    if (input && !input.value) input.value = url;
    if (!badge) return;
    if (url) {
        badge.textContent = '🟢 Configurado';
        badge.style.background = '#22c55e';
    } else {
        badge.textContent = '🟡 No Configurado';
        badge.style.background = '#eab308';
    }
    badge.style.color = '#000';
}

function guardarWebhookMakeConfig() {
    const input = document.getElementById('input-make-webhook-url');
    const estado = document.getElementById('make-webhook-test-status');
    const url = (input?.value || '').trim();
    if (url && !/^https?:\/\//i.test(url)) {
        if (estado) estado.textContent = 'La URL del webhook debe empezar por http:// o https://';
        return;
    }
    try {
        if (url) localStorage.setItem('make_webhook_url', url);
        else localStorage.removeItem('make_webhook_url');
    } catch (e) { /* noop */ }
    actualizarBadgeMake();
    if (estado) {
        estado.textContent = url
            ? '💾 Webhook guardado. Las bienvenidas por WhatsApp se enviarán a esta URL.'
            : 'Webhook eliminado.';
    }
}

async function enviarWebhookMake(payload) {
    const client = getSupabaseBarriosClient();
    if (!client) return { ok: false, motivo: "sin_cliente" };
    
    try {
        const { error } = await client.rpc("enviar_webhook_whatsapp_admin", { 
            p_payload: payload 
        });
        if (error) throw error;
        return { ok: true, status: 200 };
    } catch (error) {
        console.error("Error en el túnel de envío (Servidor):", error);
        return { ok: false, motivo: "error_servidor", detail: error.message };
    }
}

function construirMensajeBienvenidaTexto({ phone, name, pin, role }) {
    const sitio = getSitioPublico();
    const telefono = normalizarTelefonoWhatsApp(phone) || String(phone || '').trim();
    const nombre = (name || telefono || '').trim() || 'Maestre';
    return [
        `🏰 ¡Bienvenido/a a LokiTrono de Barrios, ${nombre}!`,
        '',
        `Ya formas parte de la corte como ${etiquetaRol(role)}.`,
        `Accede al juego en: ${sitio}`,
        `Teléfono de acceso: ${telefono}`,
        `PIN de acceso: ${pin}`,
        '',
        'Guarda este PIN. Si lo pierdes, pide a la organización que genere uno nuevo.'
    ].join('\n');
}

function generarEnlaceWhatsAppDirecto(phone, mensaje) {
    const p = normalizarTelefonoWhatsApp(phone) || String(phone || '').trim();
    const prefijo = (p.length === 9 && !p.startsWith('34')) ? `34${p}` : p;
    return `https://wa.me/${prefijo}?text=${encodeURIComponent(mensaje)}`;
}

function abrirWhatsAppDirecto(phone, mensaje) {
    const url = generarEnlaceWhatsAppDirecto(phone, mensaje);
    window.open(url, '_blank', 'noopener,noreferrer');
}

// Mensaje de bienvenida con la dirección pública del juego y el PIN de acceso.
async function enviarBienvenidaWhatsApp({ phone, name, pin, role }) {
    const sitio = getSitioPublico();
    const telefono = normalizarTelefonoWhatsApp(phone) || String(phone || '').trim();
    const nombre = (name || telefono || '').trim() || 'Maestre';
    const mensaje = construirMensajeBienvenidaTexto({ phone, name, pin, role });

    return enviarWebhookMake({
        evento: 'BIENVENIDA_USUARIO',
        telefono,
        nombre,
        pin,
        rol: role || 'jugador',
        rol_etiqueta: etiquetaRol(role),
        url_publica: sitio,
        mensaje
    });
}

async function probarEnvioWebhookMake() {
    const estado = document.getElementById('make-webhook-test-status');
    if (!getMakeWebhookUrl()) {
        if (estado) estado.textContent = 'Configura y guarda una URL de webhook antes de probar.';
        return;
    }
    if (estado) estado.textContent = 'Enviando prueba…';
    const resultado = await enviarWebhookMake({
        evento: 'PRUEBA_WEBHOOK',
        telefono: '605676002',
        nombre: 'Julio',
        mensaje: '🧪 Prueba de conexión desde LokiTrono de Barrios. Si recibes este mensaje, el webhook está operativo.'
    });
    if (estado) {
        estado.textContent = resultado.ok
            ? `✅ Prueba enviada correctamente (HTTP ${resultado.status}).`
            : `❌ No se pudo enviar la prueba (${resultado.motivo || 'HTTP ' + resultado.status}).`;
    }
}

// Genera un PIN nuevo para un usuario y lo reenvía por WhatsApp.
async function regenerarPinYEnviarWhatsApp(userId) {
    const currentUser = getCurrentUser();
    if (!currentUser || !puedeAdministrar(currentUser.role)) {
        alert('Solo un administrador puede regenerar PINs.');
        return;
    }

    const objetivo = getUsuariosDelAmbito().find(u => u.id === userId) || null;
    if (objetivo && !puedeGestionarRolDe(currentUser.role, objetivo.role)) {
        alert('No tienes permiso para gestionar el PIN de un usuario con ese rol.');
        return;
    }
    if (!esUUID(userId)) {
        alert('Este usuario solo existe en el respaldo local; no se puede regenerar su PIN en el servidor.');
        return;
    }
    if (!window.confirm('Se generará un PIN nuevo y se enviará por WhatsApp al usuario. ¿Continuar?')) return;

    const nuevoPin = generarPinSeisDigitos();
    try {
        const credenciales = await pedirCredencialesSuperadmin();
        if (!credenciales) return;
        const { error } = await credenciales.client.rpc('restablecer_pin_superadmin', {
            p_phone: credenciales.phone,
            p_pin: credenciales.pin,
            p_usuario_id: userId,
            p_nuevo_pin: nuevoPin
        });
        if (error) throw error;

        const envio = await enviarBienvenidaWhatsApp({
            phone: objetivo?.phone || '',
            name: objetivo?.name || '',
            pin: nuevoPin,
            role: objetivo?.role || 'jugador'
        });
        if (envio.ok) {
            alert('✅ PIN regenerado y enviado por WhatsApp.');
        } else if (envio.motivo === 'sin_webhook') {
            alert(`✅ PIN regenerado: ${nuevoPin}\n⚠️ No hay webhook de Make configurado; no se pudo enviar por WhatsApp.`);
        } else {
            alert(`✅ PIN regenerado: ${nuevoPin}\n⚠️ Error de envío: ${envio.status || envio.motivo}. Revisa la consola.`);
        }
    } catch (error) {
        console.error('Error regenerando el PIN:', error);
        alert(`No se pudo regenerar el PIN: ${error?.message || 'error desconocido'}`);
    }
}

// Establece manualmente un PIN de 6 dígitos para un usuario (solo rol Administrador).
async function editarPinUsuario(userId) {
    const currentUser = getCurrentUser();
    if (!currentUser || !esRolMaster(currentUser.role)) {
        alert('No tienes permiso para editar el PIN.');
        return;
    }

    const objetivo = getUsuariosDelAmbito().find(u => u.id === userId) || null;
    if (!objetivo) {
        alert('No se ha encontrado el usuario.');
        return;
    }
    if (!esUUID(userId)) {
        alert('Este usuario solo existe en el respaldo local; no se puede editar su PIN en el servidor.');
        return;
    }

    const nuevo = window.prompt(`Introduce el nuevo PIN de 6 dígitos para ${objetivo.name || objetivo.phone}:`, objetivo.pin_code || '');
    if (nuevo === null || !nuevo.trim()) return;
    if (!/^\d{6}$/.test(nuevo.trim())) {
        alert('El PIN debe contener exactamente 6 dígitos.');
        return;
    }

    try {
        const credenciales = await pedirCredencialesSuperadmin();
        if (!credenciales) return;
        const { error } = await credenciales.client.rpc('restablecer_pin_superadmin', {
            p_phone: credenciales.phone,
            p_pin: credenciales.pin,
            p_usuario_id: userId,
            p_nuevo_pin: nuevo.trim()
        });
        if (error) throw error;
        await recargarUsuariosSupabase(credenciales);
        alert('✅ PIN actualizado correctamente.');
    } catch (error) {
        console.error('Error al editar el PIN:', error);
        alert(`No se pudo editar el PIN: ${error?.message || 'error desconocido'}`);
    }
}

// Borra el PIN de un usuario y revoca sus sesiones (exclusivo del Administrador).
async function borrarPinUsuario(userId) {
    const currentUser = getCurrentUser();
    if (!currentUser || !esRolMaster(currentUser.role)) {
        alert('No tienes permiso para borrar el PIN de acceso.');
        return;
    }
    const objetivo = getUsuariosDelAmbito().find(u => u.id === userId) || null;
    if (!objetivo) {
        alert('No se ha encontrado el usuario.');
        return;
    }
    if (!esUUID(userId)) {
        alert('Este usuario solo existe en el respaldo local; no se puede borrar su PIN en el servidor.');
        return;
    }
    if (!window.confirm(`¿Eliminar el PIN de ${objetivo.name || objetivo.phone}? La cuenta no podrá iniciar sesión hasta que se le asigne uno nuevo.`)) return;

    try {
        const credenciales = await pedirCredencialesSuperadmin();
        if (!credenciales) return;
        const { error } = await credenciales.client.rpc('borrar_pin_superadmin', {
            p_phone: credenciales.phone,
            p_pin: credenciales.pin,
            p_usuario_id: userId
        });
        if (error) throw error;
        await recargarUsuariosSupabase(credenciales);
        alert('✅ PIN eliminado. Genera uno nuevo para que el usuario pueda acceder.');
    } catch (error) {
        console.error('Error al borrar el PIN:', error);
        alert(`No se pudo borrar el PIN: ${error?.message || 'error desconocido'}`);
    }
}

// Descarga un CSV con las credenciales de todos los usuarios (exclusivo del Administrador).
function descargarUsuariosCSV() {
    const currentUser = getCurrentUser();
    if (!currentUser || !esRolMaster(currentUser.role)) {
        alert('No tienes permiso para descargar las credenciales de los usuarios.');
        return;
    }

    const usuarios = getUsuariosDelAmbito();
    if (!usuarios || usuarios.length === 0) {
        alert('No hay usuarios para exportar.');
        return;
    }

    const escaparCsv = valor => {
        const texto = valor === null || valor === undefined ? '' : String(valor);
        return `"${texto.replace(/"/g, '""')}"`;
    };

    const cabecera = ['id', 'telefono', 'nombre', 'email', 'rol', 'pin', 'barrio_asignado', 'barrio_representado', 'genero'];
    const filas = usuarios.map(u => [
        u.id, u.phone, u.name, u.email, u.role, u.pin_code,
        u.barrio_asignado, u.barrio_representado, u.gender
    ].map(escaparCsv).join(','));

    const csv = [cabecera.join(','), ...filas].join('\n');
    const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `credenciales_lokitrono_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function abrirWhatsAppUsuario(userId) {
    const usuarios = getUsuariosDelAmbito();
    const user = usuarios.find(u => u.id === userId);
    if (!user) {
        alert('Usuario no encontrado.');
        return;
    }
    const pinTexto = user.pin_code ? String(user.pin_code) : '(solicitar a la corte)';
    const mensaje = construirMensajeBienvenidaTexto({
        phone: user.phone,
        name: user.name || user.phone,
        pin: pinTexto,
        role: user.role
    });
    abrirWhatsAppDirecto(user.phone, mensaje);
}

window.guardarWebhookMakeConfig = guardarWebhookMakeConfig;
window.probarEnvioWebhookMake = probarEnvioWebhookMake;
window.regenerarPinYEnviarWhatsApp = regenerarPinYEnviarWhatsApp;
window.editarPinUsuario = editarPinUsuario;
window.borrarPinUsuario = borrarPinUsuario;
window.descargarUsuariosCSV = descargarUsuariosCSV;
window.abrirWhatsAppUsuario = abrirWhatsAppUsuario;
window.abrirWhatsAppDirecto = abrirWhatsAppDirecto;

/* ==========================================
   GESTIÓN DE USUARIOS AUTORIZADOS
   ========================================== */

let ordenUsuariosCol = null;
let ordenUsuariosAsc = true;

window.cambiarOrdenUsuarios = function(col) {
    if (ordenUsuariosCol === col) {
        ordenUsuariosAsc = !ordenUsuariosAsc;
    } else {
        ordenUsuariosCol = col;
        ordenUsuariosAsc = true;
    }
    renderTablaUsuarios();
};

// Reconstruye las opciones del selector de rol según los permisos del administrador en sesión.
function renderOpcionesRolUsuario() {
    const select = document.getElementById('usuario-role');
    if (!select) return;
    const currentUser = getCurrentUser();
    const actor = currentUser && currentUser.role;
    const opcionesPermitidas = ROLES_VALIDOS.filter(rol => puedeAsignarRol(actor, rol));
    const valorPrevio = select.value;
    const etiquetas = { master: 'Master', superadmin: '🏰 Superadmin', tronista: '👑 Lokitronista', jugador: '⚔️ Maestre' };
    select.innerHTML = opcionesPermitidas
        .map(rol => `<option value="${rol}">${etiquetas[rol] || rol}</option>`)
        .join('');
    if (opcionesPermitidas.includes(valorPrevio)) select.value = valorPrevio;
}

function renderTablaUsuarios() {
    const tbody = document.getElementById('tabla-usuarios-body');
    if (!tbody) return;

    const currentUser = getCurrentUser();
    const esSuperadmin = currentUser && puedeAdministrar(currentUser.role);
    // Solo el propio Administración (master) ve  la administración; ante el resto de
    // usuarios el master se muestra con el mismo rango que un superadmin.
    const viewerEsMaster = !!(currentUser && esRolMaster(currentUser.role));
    let usuarios = getUsuariosDelAmbito();

    if (usuarios && usuarios.length > 0 && ordenUsuariosCol) {
        usuarios.sort((a, b) => {
            let valA = (a[ordenUsuariosCol] || '').toString().toLowerCase();
            let valB = (b[ordenUsuariosCol] || '').toString().toLowerCase();
            if (valA < valB) return ordenUsuariosAsc ? -1 : 1;
            if (valA > valB) return ordenUsuariosAsc ? 1 : -1;
            return 0;
        });
    }

    if (!usuarios || usuarios.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;color:#94a3b8;padding:20px;">No hay usuarios registrados.</td></tr>`;
        return;
    }

    tbody.innerHTML = usuarios.map(user => {
        const ocultaComoSuperadmin = user.role === 'master' && !viewerEsMaster;
        const rolVisible = ocultaComoSuperadmin ? 'superadmin' : user.role;
        const usuarioVisible = ocultaComoSuperadmin ? { ...user, role: 'superadmin' } : user;
        const icono = getIconoRango(rolVisible, user.phone);
        const tituloCompleto = getTituloCompleto(usuarioVisible);

        let rolBadge = '';
        if (rolVisible === 'master') {
            rolBadge = `<span class="pill-user" style="background:rgba(120,53,15,0.9);color:#fde68a;border:1px solid var(--oro-brillante);padding:2px 8px;border-radius:12px;font-size:0.78rem;">🌟 Administrador</span>`;
        } else if (rolVisible === 'superadmin') {
            rolBadge = `<span class="pill-user" style="background:rgba(22,101,52,0.8);color:#86efac;border:1px solid #4ade80;padding:2px 8px;border-radius:12px;font-size:0.78rem;">🏰 Superadmin</span>`;
        } else if (rolVisible === 'tronista') {
            rolBadge = `<span class="pill-user" style="background:rgba(120,53,15,0.8);color:var(--oro-brillante);border:1px solid var(--oro-real);padding:2px 8px;border-radius:12px;font-size:0.78rem;">👑 Lokitronista</span>`;
        } else {
            rolBadge = `<span class="pill-user" style="background:rgba(63,63,70,0.8);color:#d4d4d8;border:1px solid #52525b;padding:2px 8px;border-radius:12px;font-size:0.78rem;">⚔️ Jugador</span>`;
        }

        const puedeGestionarFila = esSuperadmin &&
            (!currentUser || puedeGestionarRolDe(currentUser.role, user.role));
        const esMasterActor = !!(currentUser && esRolMaster(currentUser.role));
        const acciones = puedeGestionarFila
            ? `<button class="btn-cuervo" style="padding:3px 8px;font-size:0.78rem;" title="Editar usuario" onclick="editarUsuario('${user.id}')">✏️</button>
               <button class="btn-cuervo" style="padding:3px 8px;font-size:0.78rem;background:#166534;" title="Abrir WhatsApp para enviar mensaje de acceso" onclick="abrirWhatsAppUsuario('${user.id}')">📲</button>
               <button class="btn-cuervo" style="padding:3px 8px;font-size:0.78rem;background:#7f1d1d;" title="Eliminar usuario" onclick="eliminarUsuario('${user.id}')">🗑️</button>`
            : '-';

        let celdaPin;
        if (!puedeGestionarFila) {
            celdaPin = '••••';
        } else if (esMasterActor) {
            const pinVisible = user.pin_code ? String(user.pin_code) : '—';
            celdaPin = `<code style="color:#fde68a;font-weight:bold;">${pinVisible}</code>
                <button class="btn-cuervo" style="padding:2px 6px;font-size:0.72rem;margin-left:6px;" title="Editar PIN" onclick="editarPinUsuario('${user.id}')">✏️</button>
                <button class="btn-cuervo" style="padding:2px 6px;font-size:0.72rem;margin-left:4px;" title="Regenerar PIN y reenviar por WhatsApp" onclick="regenerarPinYEnviarWhatsApp('${user.id}')">🔑</button>
                <button class="btn-cuervo" style="padding:2px 6px;font-size:0.72rem;margin-left:4px;background:#7f1d1d;" title="Borrar PIN" onclick="borrarPinUsuario('${user.id}')">🗑️</button>`;
        } else if (esSuperadmin && puedeGestionarFila) {
            celdaPin = `<span aria-hidden="true">••••••</span>
                <button class="btn-cuervo" style="padding:2px 6px;font-size:0.72rem;margin-left:6px;" title="Regenerar PIN y reenviar por WhatsApp" onclick="regenerarPinYEnviarWhatsApp('${user.id}')">🔑</button>`;
        } else {
            celdaPin = '••••';
        }

        return `<tr>
            <td style="font-size:1.5rem;text-align:center;">${icono}</td>
            <td style="color:var(--oro-brillante);font-weight:bold;">${tituloCompleto}</td>
            <td>${user.phone || '-'}</td>
            <td>${rolBadge}</td>
            <td>${user.email || '-'}</td>
            <td>${user.barrio_representado || 'Forastero'}</td>
            <td>${user.barrio_asignado || 'Forastero'}</td>
            <td>${celdaPin}</td>
            <td>${acciones}</td>
        </tr>`;
    }).join('');

    // Also populate tronista assignment selects
    const selectUsuario = document.getElementById('select-usuario-tronista');
    const selectBarrio = document.getElementById('select-barrio-tronista');
    if (selectUsuario) {
        selectUsuario.innerHTML = usuarios
            .map(u => {
                const visible = (u.role === 'master' && !viewerEsMaster) ? { ...u, role: 'superadmin' } : u;
                return `<option value="${u.id}">${getTituloCompleto(visible)} (${u.phone})</option>`;
            })
            .join('');
    }
    if (selectBarrio) {
        const barrios = getBarriosRegistradosDelAmbito();
        selectBarrio.innerHTML = barrios
            .map(nombre => `<option value="${escaparHTML(nombre)}">${escaparHTML(nombre)}</option>`)
            .join('');
    }
}

function esUUID(valor) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(valor || ''));
}

async function recargarUsuariosSupabase(credenciales) {
    try {
        const { data, error } = await credenciales.client.rpc('listar_usuarios_superadmin', {
            p_phone: credenciales.phone,
            p_pin: credenciales.pin
        });
        if (error) throw error;
        const lista = Array.isArray(data) ? data : [];
        localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(lista));
        renderTablaUsuarios();
        renderListaTronistas();
        return true;
    } catch (error) {
        console.warn('No se pudieron cargar los usuarios desde Supabase:', error?.message || error);
        return false;
    }
}

async function cargarUsuariosDesdeSupabase() {
    const currentUser = getCurrentUser();
    if (!currentUser || !puedeAdministrar(currentUser.role)) return false;
    const credenciales = await pedirCredencialesSuperadmin();
    if (!credenciales) return false;
    return recargarUsuariosSupabase(credenciales);
}

async function guardarUsuario(event) {
    if (event) event.preventDefault();
    const currentUser = getCurrentUser();
    if (!currentUser || !puedeAdministrar(currentUser.role)) {
        alert('Solo un administrador puede gestionar usuarios.');
        return;
    }

    const editId = document.getElementById('usuario-id-edit')?.value?.trim();
    const phone = document.getElementById('usuario-phone')?.value?.trim();
    const nombre = document.getElementById('usuario-nombre')?.value?.trim();
    const role = document.getElementById('usuario-role')?.value || 'jugador';
    const barrioRep = document.getElementById('usuario-barrio-representado')?.value || 'Forastero';
    const barrioAsig = document.getElementById('usuario-barrio-asignado')?.value?.trim() || 'Forastero';
    const email = document.getElementById('usuario-email')?.value?.trim() || '';
    const tituloCustom = document.getElementById('usuario-titulo-custom')?.value?.trim() || '';
    const gender = document.getElementById('usuario-gender')?.value || 'M';
    const pinManual = esRolMaster(currentUser.role)
        ? (document.getElementById('usuario-pin')?.value?.trim() || '')
        : '';

    if (!phone) {
        alert('El teléfono es obligatorio.');
        return;
    }

    if (pinManual && !/^\d{6}$/.test(pinManual)) {
        alert('El PIN debe contener exactamente 6 dígitos (o déjalo vacío para generar uno automáticamente).');
        return;
    }

    // Jerarquía de roles: el master lo puede todo; el superadmin solo maestres y lokitronistas.
    if (!puedeAsignarRol(currentUser.role, role)) {
        alert('No tienes permiso para asignar ese rol.');
        return;
    }

    // Límite feudal: máximo 2 Lokitronistas por barrio representado/asignado.
    if (role === 'tronista') {
        const barrioObjetivo = (barrioRep && barrioRep !== 'Forastero') ? barrioRep : barrioAsig;
        const ocupados = getUsuariosDelAmbito().filter(u =>
            u.id !== editId && u.role === 'tronista' && barrioEfectivoDe(u) === barrioObjetivo).length;
        if (ocupados >= 2) {
            alert(`El barrio ${barrioObjetivo} ya tiene sus 2 Lokitronistas (máximo permitido por barrio).`);
            return;
        }
    }

    const usuariosExistentes = getUsuariosDelAmbito();
    const usuarioEditado = editId ? usuariosExistentes.find(u => u.id === editId) : null;
    if (usuarioEditado && !puedeGestionarRolDe(currentUser.role, usuarioEditado.role)) {
        alert('No tienes permiso para editar a un usuario con ese rol.');
        return;
    }

    const esCreacion = !editId;
    const pinAcceso = pinManual || generarPinSeisDigitos();

    // Persistencia central en Supabase (si el usuario editado ya procede de allí).
    if (!editId || esUUID(editId)) {
        try {
            const credenciales = await pedirCredencialesSuperadmin();
            if (credenciales === null) return;
            const datos = {
                phone,
                name: nombre || phone,
                email,
                role,
                barrio_asignado: barrioAsig,
                barrio_representado: barrioRep,
                gender,
                titulo_custom: tituloCustom
            };
            if (pinManual) datos.pin_code = pinManual;
            if (editId) {
                const { error } = await credenciales.client.rpc('editar_usuario_superadmin', {
                    p_phone: credenciales.phone,
                    p_pin: credenciales.pin,
                    p_usuario_id: editId,
                    p_datos: datos
                });
                if (error) throw error;
            } else {
                datos.pin_code = pinAcceso;
                const { error } = await credenciales.client.rpc('crear_usuario_superadmin', {
                    p_phone: credenciales.phone,
                    p_pin: credenciales.pin,
                    p_datos: datos
                });
                if (error) throw error;
            }
            await recargarUsuariosSupabase(credenciales);
            resetFormUsuario();
            if (esCreacion) {
                await enviarBienvenidaTrasAlta({ phone, name: nombre || phone, pin: pinAcceso, role });
            } else {
                alert('✅ Usuario actualizado.');
            }
            return;
        } catch (error) {
            console.warn('Guardado de usuario en Supabase no disponible; se usa el respaldo local:', error?.message || error);
        }
    }

    let usuarios = getUsuariosAutorizadosLocal();

    if (editId) {
        const idx = usuarios.findIndex(u => u.id === editId);
        if (idx !== -1) {
            usuarios[idx] = {
                ...usuarios[idx],
                phone,
                name: nombre || phone,
                role,
                barrio_representado: barrioRep,
                barrio_asignado: barrioAsig,
                email,
                titulo_custom: tituloCustom,
                gender,
                ...(pinManual ? { pin_code: pinManual } : {})
            };
        }
    } else {
        const nuevoId = `user-${Date.now()}`;
        usuarios.push({
            id: nuevoId,
            phone,
            name: nombre || phone,
            role,
            pin_code: pinAcceso,
            barrio_representado: barrioRep,
            barrio_asignado: barrioAsig,
            email,
            titulo_custom: tituloCustom,
            gender
        });
    }

    localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(usuarios));
    resetFormUsuario();
    renderTablaUsuarios();
    renderListaTronistas();
    if (esCreacion) {
        await enviarBienvenidaTrasAlta({ phone, name: nombre || phone, pin: pinAcceso, role });
    } else {
        alert('✅ Usuario actualizado.');
    }
}

// Envía el mensaje de bienvenida por WhatsApp (vía Make o enlace directo gratuito wa.me) y avisa al administrador.
async function enviarBienvenidaTrasAlta({ phone, name, pin, role }) {
    const mensajeTexto = construirMensajeBienvenidaTexto({ phone, name, pin, role });
    const abrirDirecto = () => abrirWhatsAppDirecto(phone, mensajeTexto);

    const resultado = await enviarBienvenidaWhatsApp({ phone, name, pin, role });
    if (resultado.ok) {
        const abrir = window.confirm(`✅ Usuario añadido con éxito.\nSe ha notificado vía Make.\n\n¿Deseas abrir WhatsApp Web / App ahora para enviarle el mensaje de bienvenida y PIN directamente en 1 clic?`);
        if (abrir) abrirDirecto();
    } else {
        const abrir = window.confirm(`✅ Usuario añadido con éxito (PIN: ${pin}).\n\n¿Deseas abrir WhatsApp ahora para enviarle el mensaje de bienvenida y PIN directamente gratis?`);
        if (abrir) abrirDirecto();
    }
}

function editarUsuario(userId) {
    const usuarios = getUsuariosDelAmbito();
    const user = usuarios.find(u => u.id === userId);
    if (!user) return;

    const currentUser = getCurrentUser();
    if (!currentUser || !puedeGestionarRolDe(currentUser.role, user.role)) {
        alert('No tienes permiso para editar a un usuario con ese rol.');
        return;
    }

    if (typeof renderOpcionesRolUsuario === 'function') renderOpcionesRolUsuario();

    const idEdit = document.getElementById('usuario-id-edit');
    const phoneEl = document.getElementById('usuario-phone');
    const nombreEl = document.getElementById('usuario-nombre');
    const roleEl = document.getElementById('usuario-role');
    const barrioRepEl = document.getElementById('usuario-barrio-representado');
    const barrioAsigEl = document.getElementById('usuario-barrio-asignado');
    const emailEl = document.getElementById('usuario-email');
    const tituloEl = document.getElementById('usuario-titulo-custom');
    const genderEl = document.getElementById('usuario-gender');
    const pinEl = document.getElementById('usuario-pin');
    const btnGuardar = document.getElementById('btn-guardar-user');
    const btnCancelar = document.getElementById('btn-cancelar-user');

    if (idEdit) idEdit.value = user.id;
    if (phoneEl) phoneEl.value = user.phone || '';
    if (nombreEl) nombreEl.value = user.name || '';
    if (roleEl) roleEl.value = user.role || 'jugador';
    if (barrioRepEl) barrioRepEl.value = user.barrio_representado || 'Forastero';
    if (barrioAsigEl) {
        const valorAsignado = user.barrio_asignado || 'Forastero';
        if (valorAsignado && ![].some.call(barrioAsigEl.options, option => option.value === valorAsignado)) {
            barrioAsigEl.add(new Option(valorAsignado, valorAsignado));
        }
        barrioAsigEl.value = valorAsignado;
    }
    if (emailEl) emailEl.value = user.email || '';
    if (tituloEl) tituloEl.value = user.titulo_custom || '';
    if (genderEl) genderEl.value = user.gender || 'M';
    if (pinEl) pinEl.value = esRolMaster(currentUser.role) ? (user.pin_code || '') : '';
    if (btnGuardar) btnGuardar.textContent = '💾 Actualizar Usuario';
    if (btnCancelar) btnCancelar.style.display = 'inline-block';

    const form = document.getElementById('form-usuario');
    activarModoEdicion(form, `usuario: ${user.name || user.phone || user.id}`);
    if (form) form.scrollIntoView({ behavior: 'smooth' });
}

async function eliminarUsuario(userId) {
    const currentUser = getCurrentUser();
    if (!currentUser || !puedeAdministrar(currentUser.role)) {
        alert('Solo un administrador puede eliminar usuarios del Reino.');
        return;
    }
    const objetivo = getUsuariosDelAmbito().find(u => u.id === userId) || null;
    if (objetivo && !puedeGestionarRolDe(currentUser.role, objetivo.role)) {
        alert('No tienes permiso para eliminar a un usuario con ese rol.');
        return;
    }
    if (!confirm('🗑️ ¿Eliminar este usuario del Reino?')) return;

    if (esUUID(userId)) {
        try {
            const credenciales = await pedirCredencialesSuperadmin();
            if (credenciales === null) return;
            const { error } = await credenciales.client.rpc('eliminar_usuario_superadmin', {
                p_phone: credenciales.phone,
                p_pin: credenciales.pin,
                p_usuario_id: userId
            });
            if (error) throw error;
            await recargarUsuariosSupabase(credenciales);
            return;
        } catch (error) {
            console.warn('Eliminación en Supabase no disponible; se usa el respaldo local:', error?.message || error);
        }
    }

    let usuarios = getUsuariosAutorizadosLocal();
    usuarios = usuarios.filter(u => u.id !== userId);
    localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(usuarios));
    renderTablaUsuarios();
    renderListaTronistas();
}

function resetFormUsuario() {
    const form = document.getElementById('form-usuario');
    if (form) form.reset();
    desactivarModoEdicion(form);
    const idEdit = document.getElementById('usuario-id-edit');
    if (idEdit) idEdit.value = '';
    const btnGuardar = document.getElementById('btn-guardar-user');
    const btnCancelar = document.getElementById('btn-cancelar-user');
    if (btnGuardar) btnGuardar.textContent = '➕ Añadir Usuario Autorizado';
    if (btnCancelar) btnCancelar.style.display = 'none';
}

async function restablecerPinUsuario(userId) {
    const currentUser = getCurrentUser();
    if (!currentUser || !puedeAdministrar(currentUser.role)) {
        alert('Solo Superadmin puede restablecer PINs.');
        return;
    }
    if (!esUUID(userId)) {
        alert('Este usuario solo existe en el respaldo local; no se puede restablecer su PIN.');
        return;
    }

    const nuevoPin = window.prompt('Introduce el nuevo PIN de 6 dígitos para este usuario:');
    if (nuevoPin === null) return;
    if (!/^\d{6}$/.test(nuevoPin.trim())) {
        alert('El PIN debe contener exactamente seis dígitos.');
        return;
    }

    try {
        const credenciales = await pedirCredencialesSuperadmin();
        if (!credenciales) return;
        const { error } = await credenciales.client.rpc('restablecer_pin_superadmin', {
            p_phone: credenciales.phone,
            p_pin: credenciales.pin,
            p_usuario_id: userId,
            p_nuevo_pin: nuevoPin.trim()
        });
        if (error) throw error;
        alert('✅ PIN restablecido correctamente.');
    } catch (error) {
        console.error('Error restableciendo el PIN:', error);
        alert(`No se pudo restablecer el PIN: ${error?.message || 'error desconocido'}`);
    }
}

async function asignarTronistaAdmin(event) {
    if (event) event.preventDefault();
    const currentUser = getCurrentUser();
    if (!currentUser || !puedeAdministrar(currentUser.role)) {
        alert('Solo Superadmin puede asignar títulos de Lokitronista.');
        return;
    }

    const userId = document.getElementById('select-usuario-tronista')?.value;
    const barrio = document.getElementById('select-barrio-tronista')?.value;

    if (!userId || !barrio) {
        alert('Selecciona un usuario y un barrio.');
        return;
    }

    const objetivo = getUsuariosDelAmbito().find(u => u.id === userId) || null;
    if (objetivo && !puedeGestionarRolDe(currentUser.role, objetivo.role)) {
        alert('No tienes permiso para nombrar Lokitronista a este usuario.');
        return;
    }

    // Límite feudal: máximo 2 Lokitronistas por barrio.
    const tronistasDelBarrio = getUsuariosDelAmbito().filter(u =>
        u.id !== userId && u.role === 'tronista' && barrioEfectivoDe(u) === barrio);
    if (tronistasDelBarrio.length >= 2) {
        alert(`El barrio ${barrio} ya tiene sus 2 Lokitronistas (máximo permitido por barrio).`);
        return;
    }

    if (esUUID(userId)) {
        try {
            const credenciales = await pedirCredencialesSuperadmin();
            if (credenciales === null) return;
            const { error } = await credenciales.client.rpc('asignar_tronista_superadmin', {
                p_phone: credenciales.phone,
                p_pin: credenciales.pin,
                p_usuario_id: userId,
                p_barrio: barrio
            });
            if (error) throw error;
            await recargarUsuariosSupabase(credenciales);
            alert(`👑 ¡Título de Lokitronista de ${barrio} asignado!`);
            return;
        } catch (error) {
            console.warn('Asignación de Lokitronista en Supabase no disponible; se usa el respaldo local:', error?.message || error);
        }
    }

    let usuarios = getUsuariosAutorizadosLocal();
    const idx = usuarios.findIndex(u => u.id === userId);
    if (idx === -1) { alert('Usuario no encontrado.'); return; }

    usuarios[idx].role = 'tronista';
    usuarios[idx].barrio_asignado = barrio;
    usuarios[idx].barrio_representado = barrio;
    usuarios[idx].fecha_designacion = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(usuarios));
    renderTablaUsuarios();
    renderListaTronistas();
    alert(`👑 ¡${usuarios[idx].name} ha sido designado/a Lokitronista de ${barrio}!`);
}

/* ==========================================
   HALL OF FAME — LOKITRONISTAS Y VELADORES
   ========================================== */

const VELADORES_LOKITRONO_PHONES = ['605676002', '663366786'];

// ¿El teléfono corresponde a uno de los Consejeros del Lokitrono?
function esConsejeroDelLokitrono(phone) {
    const p = String(phone || '').replace(/\D/g, '').slice(-9);
    return VELADORES_LOKITRONO_PHONES.some(v => String(v).replace(/\D/g, '').slice(-9) === p);
}

// Barrio efectivo que representa un usuario (el representado si existe; si no, el asignado).
function barrioEfectivoDe(user) {
    const rep = String(user.barrio_representado || '').trim();
    const asig = String(user.barrio_asignado || '').trim();
    return (rep && rep !== 'Forastero') ? rep : (asig || 'Forastero');
}

function renderListaTronistas() {
    const container = document.getElementById('lista-tronistas');
    if (!container) return;
    container.style.display = 'block';

    const usuarios = getUsuariosDelAmbito();
    const tronistas = usuarios.filter(u => u.role === 'tronista');
    // Consejeros del Lokitrono (usuarios especiales): 605676002 y 663366786.
    const veladores = [];
    const vistoConsejero = new Set();
    usuarios.forEach(u => {
        if (esConsejeroDelLokitrono(u.phone)) {
            const norm = String(u.phone || '').replace(/\D/g, '').slice(-9);
            if (!vistoConsejero.has(norm)) { vistoConsejero.add(norm); veladores.push(u); }
        }
    });

    if ((!tronistas || tronistas.length === 0) && veladores.length === 0) {
        container.innerHTML = `<div style="text-align:center;color:#94a3b8;padding:30px;font-style:italic;">Ningún Maestre ha recibido aún el título de Lokitronista de Barrio.</div>`;
        return;
    }

    const repositorioVotos = getVotosDelAmbito();

    function phoneMask(phone) {
        const p = String(phone || '');
        return p.length >= 5 ? p.slice(0, 3) + '**' + p.slice(-2) : p;
    }
    function votosDe(phone) {
        return repositorioVotos.filter(v => String(v.maestre_id || '') === String(phone || '')).length;
    }
    function tarjetaLokitronista(user) {
        const telefono = String(user.phone || '');
        const fechaDesig = user.fecha_designacion
            ? `<div style="text-align:center;font-size:0.78rem;color:#a1a1aa;">📅 Designado/a: ${new Date(user.fecha_designacion).toLocaleDateString('es-ES')}</div>`
            : '';
        return `<div class="card-item" style="background:rgba(30,24,8,0.95);border:2px solid var(--oro-real);padding:18px;border-radius:10px;">
            <div style="text-align:center;margin-bottom:10px;"><span style="font-size:2.5rem;">👑</span></div>
            <div style="text-align:center;margin-bottom:8px;"><strong style="color:var(--oro-brillante);font-family:'Cinzel',serif;font-size:1.05rem;">${getTituloCompleto(user)}</strong></div>
            <div style="text-align:center;font-size:0.82rem;color:#a1a1aa;margin-bottom:6px;">📱 ${phoneMask(telefono)}</div>
            <div style="text-align:center;margin-bottom:6px;"><span class="pill-user" style="background:rgba(120,53,15,0.8);color:var(--oro-brillante);border:1px solid var(--oro-real);padding:2px 8px;border-radius:12px;font-size:0.78rem;">👑 Lokitronista de Barrio</span></div>
            <div style="text-align:center;font-size:0.82rem;color:#d6d3d1;margin-bottom:6px;">⚔️ Votos emitidos: <strong>${votosDe(telefono)}</strong></div>
            ${fechaDesig}
            <hr style="border-color:var(--oro-real);opacity:0.3;margin:12px 0 0 0;">
        </div>`;
    }
    function tarjetaConsejero(user) {
        return `<div class="card-item" style="background:rgba(20,16,5,0.95);border:2px solid #a78bfa;padding:18px;border-radius:10px;">
            <div style="text-align:center;margin-bottom:10px;"><span style="font-size:2.5rem;">💎</span></div>
            <div style="text-align:center;margin-bottom:8px;"><strong style="color:#c4b5fd;font-family:'Cinzel',serif;font-size:1.05rem;">${getTituloCompleto(user)}</strong></div>
            <div style="text-align:center;font-size:0.82rem;color:#a1a1aa;margin-bottom:6px;">📱 ${phoneMask(user.phone)}</div>
            <div style="text-align:center;margin-bottom:6px;"><span class="pill-user" style="background:rgba(76,29,149,0.7);color:#d8b4fe;border:1px solid #a78bfa;padding:2px 8px;border-radius:12px;font-size:0.78rem;">💎 Consejero/a del LokiTrono</span></div>
            <div style="text-align:center;font-size:0.82rem;color:#d6d3d1;margin-bottom:6px;">⚔️ Votos emitidos: <strong>${votosDe(user.phone)}</strong></div>
            <hr style="border-color:#a78bfa;opacity:0.3;margin:12px 0 0 0;">
        </div>`;
    }

    const GRID = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px;';
    let html = '';

    // Los Consejeros del Lokitrono se muestran antes que los Lokitronistas.
    if (veladores.length > 0) {
        html += `<div style="margin-bottom:8px;">
            <div style="display:flex;align-items:center;gap:10px;justify-content:center;margin:18px 0 12px;flex-wrap:wrap;">
                <span style="font-size:1.5rem;">💎</span>
                <h4 style="color:#c4b5fd;font-family:'Cinzel',serif;margin:0;font-size:1.15rem;">💎 Consejeros del Lokitrono</h4>
                <span class="pill-user" style="background:rgba(76,29,149,0.7);color:#d8b4fe;border:1px solid #a78bfa;padding:2px 10px;border-radius:12px;font-size:0.78rem;">${veladores.length}/2</span>
            </div>
            <div style="${GRID}">${veladores.map(tarjetaConsejero).join('')}</div>
        </div>`;
    }

    // Agrupado por cada barrio representado (máximo 2 Lokitronistas por barrio).
    const porBarrio = new Map();
    tronistas.forEach(u => {
        const barrio = barrioEfectivoDe(u);
        if (!porBarrio.has(barrio)) porBarrio.set(barrio, []);
        if (porBarrio.get(barrio).length < 2) porBarrio.get(barrio).push(u);
    });

    porBarrio.forEach((lista, barrio) => {
        html += `<div style="margin-bottom:8px;">
            <div style="display:flex;align-items:center;gap:10px;justify-content:center;margin:18px 0 12px;flex-wrap:wrap;">
                <span style="font-size:1.5rem;">🏰</span>
                <h4 style="color:var(--oro-brillante);font-family:'Cinzel',serif;margin:0;font-size:1.15rem;">${barrio}</h4>
                <span class="pill-user" style="background:rgba(120,53,15,0.8);color:var(--oro-brillante);border:1px solid var(--oro-real);padding:2px 10px;border-radius:12px;font-size:0.78rem;">${lista.length}/2 Lokitronistas</span>
            </div>
            <div style="${GRID}">${lista.map(tarjetaLokitronista).join('')}</div>
        </div>`;
    });

    container.innerHTML = html;
}


/* ==========================================
   GESTIÓN DE BARRIOS (tabla maestra: casas)
   ========================================== */
let casasCache = [];
let supabaseBarriosClient = null;

// Caché compartida de eventos descargados de Supabase.
let eventosSupabaseCache = [];
let cargaEventosSupabaseEnCurso = false;

async function cargarEventosDesdeSupabase() {
    if (cargaEventosSupabaseEnCurso) return;
    cargaEventosSupabaseEnCurso = true;

    try {
        const client = getSupabaseBarriosClient();
        if (!client) {
            console.warn('Supabase no está configurado; se mantienen los eventos locales.');
            return;
        }

        const { data, error } = await client
            .from('eventos')
            .select('*')
            .order('fecha', { ascending: true });

        if (error) {
            console.error('No se pudieron cargar los eventos desde Supabase:', error.message);
            return;
        }

        eventosSupabaseCache = Array.isArray(data) ? data : [];

        actualizarCalendarioMedieval();

        if (typeof renderEventosGeneradosPestanaAdmin === 'function') {
            renderEventosGeneradosPestanaAdmin();
        }

        console.info(
            `Eventos recibidos de Supabase: ${eventosSupabaseCache.length}`
        );
    } catch (error) {
        console.error('Error al cargar los eventos de Supabase:', error);
    } finally {
        cargaEventosSupabaseEnCurso = false;
        if (typeof actualizarBloqueVotacion === 'function') actualizarBloqueVotacion();
    }
}

function getSupabaseBarriosClient() {
    if (supabaseBarriosClient) return supabaseBarriosClient;
    const config = window.__APP_CONFIG__ || {};
    if (!window.supabase || !window.supabase.createClient || !config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
        return null;
    }
    supabaseBarriosClient = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
    return supabaseBarriosClient;
}

// ==============================================================================
// 🔄 ACTUALIZACIÓN DE DATOS EN TIEMPO REAL (SUPABASE REALTIME)
// ==============================================================================
// casas, eventos y votos_evento están publicadas en `supabase_realtime`, de modo
// que cualquier cambio se propaga en vivo a todos los clientes. Los usuarios no
// se publican (contienen datos sensibles); se refrescan por token de sesión.

let realtimeLokitrono = null;
const realtimeRefrescosPendientes = {};

function programarRefrescoRealtime(clave, tarea, retraso = 1200) {
    if (realtimeRefrescosPendientes[clave]) clearTimeout(realtimeRefrescosPendientes[clave]);
    realtimeRefrescosPendientes[clave] = setTimeout(() => {
        delete realtimeRefrescosPendientes[clave];
        try {
            tarea();
        } catch (error) {
            console.warn('Fallo en el refresco en tiempo real:', error);
        }
    }, retraso);
}

function iniciarRealtimeLokitrono() {
    if (realtimeLokitrono) return;
    const client = getSupabaseBarriosClient();
    if (!client || typeof client.channel !== 'function') return;
    try {
        realtimeLokitrono = client
            .channel('lokitrono-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'casas' },
                () => programarRefrescoRealtime('casas', () => cargarBarriosDesdeSupabase()))
            .on('postgres_changes', { event: '*', schema: 'public', table: 'eventos' },
                () => programarRefrescoRealtime('eventos', async () => {
                    await cargarEventosDesdeSupabase();
                    if (typeof actualizarBloqueVotacion === 'function') actualizarBloqueVotacion();
                    if (typeof renderClasificacionReal === 'function') renderClasificacionReal();
                    if (typeof renderEstadisticasCodice === 'function') renderEstadisticasCodice();
    if (typeof detectarCierresVotacion === 'function') detectarCierresVotacion();
    if (typeof aplicarFinDeJuegoUI === 'function') aplicarFinDeJuegoUI();
                    if (typeof renderEventosGeneradosPestanaAdmin === 'function') renderEventosGeneradosPestanaAdmin();
                    if (typeof aplicarFinDeJuegoUI === 'function') aplicarFinDeJuegoUI();
                }))
            .on('postgres_changes', { event: '*', schema: 'public', table: 'votos_evento' },
                () => programarRefrescoRealtime('votos', async () => {
                    await cargarVotosDesdeSupabase();
                    if (typeof renderClasificacionReal === 'function') renderClasificacionReal();
                    if (typeof renderEstadisticasCodice === 'function') renderEstadisticasCodice();
                    if (typeof aplicarFinDeJuegoUI === 'function') aplicarFinDeJuegoUI();
                }))
            .subscribe((estado) => {
                console.info('Supabase Realtime LokiTrono:', estado);
            });
    } catch (error) {
        console.warn('No se pudo iniciar Supabase Realtime:', error);
    }
}

function detenerRealtimeLokitrono() {
    if (!realtimeLokitrono) return;
    const client = getSupabaseBarriosClient();
    try {
        if (client && typeof client.removeChannel === 'function') client.removeChannel(realtimeLokitrono);
    } catch (_) { /* sin conexión: nada que limpiar */ }
    realtimeLokitrono = null;
}

// Refresco de usuarios para administradores autenticados, sin volver a pedir el PIN.
let usuariosAutoRefreshTimer = null;

async function refrescarUsuariosPorToken(silencioso = true) {
    const usuario = getCurrentUser();
    if (!usuario || !puedeAdministrar(usuario.role) || !usuario.token) return false;
    const client = getSupabaseBarriosClient();
    if (!client) return false;
    try {
        const { data, error } = await client.rpc('listar_usuarios_por_token', { p_token: usuario.token });
        if (error) throw error;
        const lista = Array.isArray(data) ? data : [];
        if (!lista.length) return false;
        localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(lista));
        renderTablaUsuarios();
        renderListaTronistas();
        return true;
    } catch (error) {
        if (!silencioso) console.warn('No se pudieron refrescar los usuarios por token:', error?.message || error);
        return false;
    }
}

function iniciarAutoRefreshUsuarios() {
    const usuario = getCurrentUser();
    if (!usuario || !puedeAdministrar(usuario.role) || !usuario.token) return;
    detenerAutoRefreshUsuarios();
    usuariosAutoRefreshTimer = setInterval(() => refrescarUsuariosPorToken(true), 25000);
}

function detenerAutoRefreshUsuarios() {
    if (usuariosAutoRefreshTimer) clearInterval(usuariosAutoRefreshTimer);
    usuariosAutoRefreshTimer = null;
}

function escaparHTML(valor) {
    return String(valor ?? '').replace(/[&<>"']/g, caracter => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[caracter]));
}

function getBarriosLocal() {
    if (casasCache.length) return casasCache.map(casa => casa.nombre);
    try {
        const raw = JSON.parse(localStorage.getItem(STORAGE_KEYS.barrios) || '[]');
        if (Array.isArray(raw) && raw.length) return raw.map(b => typeof b === 'string' ? b : b.nombre).filter(Boolean);
    } catch (_) {}
    return [];
}

function getBarriosRegistrados() {
    return getBarriosLocal();
}

async function cargarBarriosDesdeSupabase() {
    const client = getSupabaseBarriosClient();
    if (!client) {
        renderListaBarrios();
        return;
    }
    const { data, error } = await client.from('casas')
        .select('id,nombre,lema,emblema,color_heraldo,imagen_url,participa,created_at,ciudad_id,distrito_id,barrio_id,codigo_postal')
        .order('nombre', { ascending: true });
    if (error) {
        console.error('No se pudieron cargar los barrios desde casas:', error.message);
        const lista = document.getElementById('lista-barrios-grid');
        if (lista) lista.innerHTML = '<p role="status">No se pudieron cargar los barrios de Supabase. Comprueba la conexión y las políticas de lectura.</p>';
        return;
    }
    casasCache = data || [];
    localStorage.setItem(STORAGE_KEYS.barrios, JSON.stringify(casasCache));
    renderListaBarrios();
    poblarSelectBarriosEvento();
    renderOpcionesVoto();
    renderTablaUsuarios();
    renderListaTronistas();
    actualizarSelectoresBarriosDinamicos();
}

function actualizarSelectoresBarriosDinamicos() {
    const nombres = getBarriosRegistradosDelAmbito();
    const ids = ['usuario-barrio-representado', 'usuario-barrio-asignado', 'select-barrio-tronista',
        'evento-barrio', 'evento-dedicated-barrio', 'voto-select-barrio'];
    ids.forEach(id => {
        const select = document.getElementById(id);
        if (!select) return;
        const valorActual = select.value;
        const primera = select.options.length && (select.options[0].value === '' || select.options[0].value === 'Forastero')
            ? { value: select.options[0].value, text: select.options[0].textContent } : null;
        select.innerHTML = '';
        if (primera) select.add(new Option(primera.text, primera.value));
        nombres.forEach(nombre => {
            if (primera && String(nombre) === String(primera.value)) return;
            select.add(new Option(nombre, nombre));
        });
        if (valorActual && [...select.options].some(option => option.value === valorActual)) select.value = valorActual;
    });
}


// LOKITRONO_GESTION_BARRIOS_V1

function renderListaBarrios() {
    const contenedor = document.getElementById('lista-barrios-grid');
    if (!contenedor) return;

    const barriosAmbito = getBarriosObjetosDelAmbito();
    if (!barriosAmbito.length) {
        contenedor.innerHTML =
            '<p style="color:#d6d3d1;">No hay barrios cargados desde la tabla <code>casas</code>.</p>';
        return;
    }

    let usuarios = [];
    if (typeof getUsuariosAutorizadosLocal === 'function') {
        usuarios = getUsuariosDelAmbito();
    } else {
        usuarios = [];
    }
    const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    const esSuperadmin = !!(currentUser && puedeAdministrar(currentUser.role));

    contenedor.innerHTML = barriosAmbito.map(casa => {
        const id = escaparHTML(String(casa.id || casa.nombre || ''));
        const nombre = escaparHTML(casa.nombre || '');
        const lema = escaparHTML(casa.lema || 'Sin lema asignado');
        const emblema = escaparHTML(casa.emblema || '🏰');
        const estado = casa.participa
            ? 'Participa en la competición'
            : 'No participa actualmente';

        const integrantes = usuarios.filter(u => u.barrio_representado === casa.nombre || u.barrio_asignado === casa.nombre);
        
        let integrantesHTML = '<div style="margin-top: 15px; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 6px;">';
        integrantesHTML += `<h5 style="color: #93c5fd; margin: 0 0 10px; font-size: 0.85rem; text-align: center;">👥 Integrantes (${integrantes.length})</h5>`;
        
        if (integrantes.length === 0) {
            integrantesHTML += '<p style="font-size: 0.75rem; text-align: center; color: #a1a1aa; margin: 0;">Sin integrantes</p>';
        } else {
            integrantesHTML += '<ul style="list-style: none; padding: 0; margin: 0; font-size: 0.8rem; color: #e2e8f0;">';
            integrantes.forEach(u => {
                integrantesHTML += `<li style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 65%;" title="${escaparHTML(u.name || u.phone)}">👤 ${escaparHTML(u.name || u.phone)}</span>
                    ${esSuperadmin ? `<button type="button" class="btn-cuervo" style="padding: 3px 8px; font-size: 0.7rem; background: #7f1d1d;" data-accion-barrio="quitar-usuario" data-user-phone="${escaparHTML(u.phone)}">Quitar</button>` : ''}
                </li>`;
            });
            integrantesHTML += '</ul>';
        }
        integrantesHTML += '</div>';

        return `
            <article class="panel-card" style="min-width:240px;padding:16px;display:flex;flex-direction:column;justify-content:space-between;">
                <div>
                    <div style="font-size:2rem;text-align:center;">${emblema}</div>
                    <h4 style="text-align:center;color:var(--oro-brillante);margin:8px 0;">${nombre}</h4>
                    <p style="text-align:center;color:#d6d3d1;font-size:.9rem;">${lema}</p>
                    <p style="text-align:center;font-size:.8rem;color:#a1a1aa;">${estado}</p>
                    ${integrantesHTML}
                </div>
                <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:15px;">
                    ${esSuperadmin ? `<button type="button" class="btn-cuervo"
                        data-accion-barrio="editar" data-barrio-id="${id}"
                        style="padding:8px 12px;flex:1;">✏️ Editar</button>
                    <button type="button" class="btn-cuervo"
                        data-accion-barrio="eliminar" data-barrio-id="${id}"
                        style="padding:8px 12px;background:#7f1d1d;flex:1;">🗑️ Eliminar</button>` : ''}
                </div>
            </article>`;
    }).join('');

    contenedor.querySelectorAll('[data-accion-barrio]').forEach(boton => {
        boton.addEventListener('click', () => {
            const accion = boton.dataset.accionBarrio;
            if (accion === 'editar') {
                editarBarrio(boton.dataset.barrioId);
            } else if (accion === 'eliminar') {
                eliminarBarrio(boton.dataset.barrioId);
            } else if (accion === 'quitar-usuario') {
                quitarUsuarioBarrio(boton.dataset.userPhone);
            }
        });
    });
}

async function quitarUsuarioBarrio(phone) {
    const usuarioAuth = getCurrentUser();
    if (!usuarioAuth || !puedeAdministrar(usuarioAuth.role)) {
        alert('Solo un superadministrador puede desvincular usuarios.');
        return;
    }

    const confirmacion = window.confirm(`¿Seguro que deseas desvincular al usuario (Tel: ${phone}) de su barrio actual?\nPasará a ser 'Forastero'.`);
    if (!confirmacion) return;

    const pinConfirmacion = window.prompt('Introduce tu PIN de administración para confirmar:');
    if (pinConfirmacion === null) return;
    if (!/^\d{6}$/.test(pinConfirmacion.trim())) {
        alert('El PIN debe contener exactamente seis dígitos.');
        return;
    }

    // 1. Actualización local
    let usuarios = typeof getUsuariosAutorizadosLocal === 'function' ? getUsuariosAutorizadosLocal() : [];
    const index = usuarios.findIndex(u => String(u.phone) === String(phone));
    if (index !== -1) {
        usuarios[index].barrio_representado = 'Forastero';
        usuarios[index].barrio_asignado = 'Forastero';
        localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(usuarios));
    }

    // 2. Intentar actualizar Supabase si existe el RPC
    const client = getSupabaseBarriosClient();
    if (client) {
        try {
            await client.rpc('desvincular_usuario_barrio_superadmin', {
                p_phone: String(usuarioAuth.phone || ''),
                p_pin: pinConfirmacion.trim(),
                p_target_phone: phone
            });
        } catch (e) {
            console.warn('Aviso: No se pudo actualizar el usuario en Supabase (es posible que falte aplicar la migración SQL o el usuario sea solo local).', e);
        }
    }

    renderListaBarrios();
    if (typeof renderTablaUsuarios === 'function') renderTablaUsuarios();
    alert('Usuario desvinculado correctamente del barrio. Ahora podrás eliminar el barrio si ya no tiene integrantes.');
}

function editarBarrio(id) {
    const usuario = getCurrentUser();
    if (!usuario || !puedeAdministrar(usuario.role)) {
        alert('Solo un superadministrador puede editar barrios.');
        return;
    }

    const casa = getBarriosObjetosDelAmbito().find(item => String(item.id || item.nombre) === String(id));
    if (!casa) {
        alert('No se encuentra el barrio seleccionado. Actualiza la lista.');
        return;
    }

    const campoId = document.getElementById('barrio-id-edit');
    const campoNombre = document.getElementById('barrio-nombre');
    const campoLema = document.getElementById('barrio-lema');
    const campoEmblema = document.getElementById('barrio-emblema');
    const botonGuardar = document.getElementById('btn-guardar-barrio');
    const botonCancelar = document.getElementById('btn-cancelar-barrio');

    if (!campoId || !campoNombre || !campoLema || !campoEmblema) {
        alert('No se encuentran todos los campos del formulario de barrios.');
        return;
    }

    campoId.value = casa.id || casa.nombre;
    campoNombre.value = casa.nombre || '';
    campoLema.value = casa.lema || '';

    // Si un emblema antiguo no aparece en el selector, se añade temporalmente.
    if (![...campoEmblema.options].some(option => option.value === (casa.emblema || '🏰'))) {
        campoEmblema.add(new Option(casa.emblema || '🏰', casa.emblema || '🏰'));
    }
    campoEmblema.value = casa.emblema || '🏰';

    if (typeof barrioGeoSetDesde === 'function') barrioGeoSetDesde(casa);

    if (botonGuardar) botonGuardar.textContent = '💾 Guardar Cambios';
    if (botonCancelar) botonCancelar.style.display = 'inline-block';

    document.getElementById('form-barrio')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
    activarModoEdicion(document.getElementById('form-barrio'), `barrio: ${casa.nombre}`);
    campoNombre.focus();
}

async function guardarBarrio(event) {
    if (event) event.preventDefault();

    const usuario = getCurrentUser();
    if (!usuario || !puedeAdministrar(usuario.role)) {
        alert('Solo un superadministrador puede gestionar barrios.');
        return;
    }

    const nombre = document.getElementById('barrio-nombre')?.value.trim();
    const lema = document.getElementById('barrio-lema')?.value.trim() || null;
    const emblema = document.getElementById('barrio-emblema')?.value || '🏰';
    const idEdit = document.getElementById('barrio-id-edit')?.value;

    if (!nombre) {
        alert('Introduce el nombre del barrio.');
        return;
    }

    if (nombre.length > 100) {
        alert('El nombre del barrio no puede superar los 100 caracteres.');
        return;
    }

    const duplicado = getBarriosObjetosDelAmbito().some(casa =>
        String(casa.nombre || '').localeCompare(nombre, 'es', { sensitivity: 'base' }) === 0
        && String(casa.id || casa.nombre) !== String(idEdit || '')
    );

    if (duplicado) {
        alert('Ya existe un barrio con ese nombre.');
        return;
    }

    const client = getSupabaseBarriosClient();
    if (!client) {
        alert('No se ha podido inicializar Supabase. Revisa la configuración.');
        return;
    }

    const pinConfirmacion = window.prompt(
        `Introduce tu PIN de administración para confirmar ${idEdit ? 'la edición' : 'la creación'} del barrio:`
    );

    if (pinConfirmacion === null) return;
    if (!/^\d{6}$/.test(pinConfirmacion.trim())) {
        alert('El PIN debe contener exactamente seis dígitos.');
        return;
    }

    const ubicacion = (typeof barrioGeoUbicacion === 'function')
        ? barrioGeoUbicacion()
        : { ciudad_id: null, distrito_id: null, barrio_id: null, codigo_postal: null, ruta: '' };
    const imagenFicha = ubicacion.ciudad_id
        ? geoFichaMiniatura({ nombre, color: '#d4af37', emblema })
        : null;

    const boton = document.getElementById('btn-guardar-barrio');
    const textoOriginal = boton?.textContent || '➕ Añadir Nuevo Barrio';
    if (boton) {
        boton.disabled = true;
        boton.textContent = 'Guardando…';
    }

    try {
        let data;
        let error;

        if (idEdit) {
            ({ data, error } = await client.rpc('editar_casa_superadmin', {
                p_phone: String(usuario.phone || ''),
                p_pin: pinConfirmacion.trim(),
                p_casa_id: idEdit,
                p_nombre: nombre,
                p_lema: lema,
                p_emblema: emblema,
                p_color_heraldo: casasCache.find(c => String(c.id) === String(idEdit))?.color_heraldo || '#d4af37',
                p_participa: casasCache.find(c => String(c.id) === String(idEdit))?.participa ?? true,
                p_ciudad_id: ubicacion.ciudad_id,
                p_distrito_id: ubicacion.distrito_id,
                p_barrio_id: ubicacion.barrio_id,
                p_codigo_postal: ubicacion.codigo_postal,
                p_imagen_url: imagenFicha
            }));
        } else {
            ({ data, error } = await client.rpc('crear_casa_superadmin', {
                p_phone: String(usuario.phone || ''),
                p_pin: pinConfirmacion.trim(),
                p_nombre: nombre,
                p_lema: lema,
                p_emblema: emblema,
                p_ciudad_id: ubicacion.ciudad_id,
                p_distrito_id: ubicacion.distrito_id,
                p_barrio_id: ubicacion.barrio_id,
                p_codigo_postal: ubicacion.codigo_postal,
                p_imagen_url: imagenFicha
            }));
        }

        if (error) throw error;
        if (!data) {
            throw new Error('Supabase no confirmó la operación.');
        }

        resetFormBarrio();
        await cargarBarriosDesdeSupabase();

        alert(idEdit
            ? `Barrio «${nombre}» actualizado correctamente.`
            : `Barrio «${nombre}» creado correctamente.`);
    } catch (error) {
        console.error('Error guardando barrio:', error);
        const mensaje = error?.message || 'Error desconocido';

        if (/duplicate|unique|ya existe/i.test(mensaje)) {
            alert('Ya existe un barrio con ese nombre.');
        } else if (/no autorizado|superadministrador/i.test(mensaje)) {
            alert('Supabase no ha autorizado la operación. Comprueba el teléfono, el PIN y el rol.');
        } else {
            alert(`No se pudo guardar el barrio: ${mensaje}`);
        }
    } finally {
        if (boton) {
            boton.disabled = false;
            boton.textContent = document.getElementById('barrio-id-edit')?.value
                ? '💾 Guardar Cambios'
                : '➕ Añadir Nuevo Barrio';
        }
    }
}

async function eliminarBarrio(id) {
    const usuario = getCurrentUser();
    if (!usuario || !puedeAdministrar(usuario.role)) {
        alert('Solo un superadministrador puede eliminar barrios.');
        return;
    }

    const casa = getBarriosObjetosDelAmbito().find(item => String(item.id || item.nombre) === String(id));
    if (!casa) {
        alert('No se encuentra el barrio seleccionado. Actualiza la lista.');
        return;
    }

    const confirmacion = window.confirm(
        `¿Seguro que deseas eliminar el barrio «${casa.nombre}»?\n\n` +
        'Esta operación solo se completará si no tiene votos, códigos diarios, maestres ni usuarios asociados.'
    );
    if (!confirmacion) return;

    const pinConfirmacion = window.prompt(
        `Introduce tu PIN de administración para eliminar «${casa.nombre}»:`
    );
    if (pinConfirmacion === null) return;

    if (!/^\d{6}$/.test(pinConfirmacion.trim())) {
        alert('El PIN debe contener exactamente seis dígitos.');
        return;
    }

    const client = getSupabaseBarriosClient();
    if (!client) {
        alert('No se ha podido inicializar Supabase. Revisa la configuración.');
        return;
    }

    try {
        const { data, error } = await client.rpc('eliminar_casa_superadmin', {
            p_phone: String(usuario.phone || ''),
            p_pin: pinConfirmacion.trim(),
            p_casa_id: id
        });

        if (error) throw error;
        if (!data) throw new Error('Supabase no confirmó la eliminación.');

        if (String(document.getElementById('barrio-id-edit')?.value || '') === String(id)) {
            resetFormBarrio();
        }

        await cargarBarriosDesdeSupabase();
        alert(`Barrio «${casa.nombre}» eliminado correctamente.`);
    } catch (error) {
        console.error('Error eliminando barrio:', error);
        const mensaje = error?.message || 'Error desconocido';

        if (/tiene votos|códigos diarios|maestres asociados|usuarios asociados|no se ha encontrado/i.test(mensaje)) {
            alert(`${mensaje}\n\nPuedes desactivar la participación del barrio en lugar de eliminarlo.`);
        } else if (/no autorizado|superadministrador/i.test(mensaje)) {
            alert('Supabase no ha autorizado la operación. Comprueba el teléfono, el PIN y el rol.');
        } else {
            alert(`No se pudo eliminar el barrio: ${mensaje}`);
        }
    }
}

function resetFormBarrio() {
    const form = document.getElementById('form-barrio');
    if (form) form.reset();
    desactivarModoEdicion(form);

    const id = document.getElementById('barrio-id-edit');
    if (id) id.value = '';

    const boton = document.getElementById('btn-guardar-barrio');
    if (boton) {
        boton.disabled = false;
        boton.textContent = '➕ Añadir Nuevo Barrio';
    }

    const cancelar = document.getElementById('btn-cancelar-barrio');
    if (cancelar) cancelar.style.display = 'none';

    barrioGeoReset();
}

/* ============================================================================
 * LOKITRONO — UBICACIÓN GEOGRÁFICA DEL BARRIO (CASCADA)
 * CCAA → provincia → municipio → distrito → barrio → CP. Reutiliza el catálogo
 * del panel de geografía. La ubicación se guarda en `casas` y alimenta el
 * sorteo de barrios y la ficha del puzzle de ubicaciones.
 * ========================================================================== */
const barrioGeoEstado = { ine: null, distritos: [], barrios: [], cps: [] };

function barrioGeoOpt(txt) { return `<option value="">${geoEsc(txt)}</option>`; }

function barrioGeoRefrescar() {
    const sel = document.getElementById('barrio-geo-ccaa');
    if (!sel) return;
    if (!geoEstado.comunidades.size && typeof geoCargarCatalogo === 'function') {
        geoCargarCatalogo().then(barrioGeoRefrescar);
        return;
    }
    const previo = sel.value;
    const ccaa = [...geoEstado.comunidades.entries()].sort((a, b) => a[1].localeCompare(b[1], 'es'));
    sel.innerHTML = barrioGeoOpt('— Comunidad —') +
        ccaa.map(([id, n]) => `<option value="${geoEsc(id)}">${geoEsc(n)}</option>`).join('');
    if (previo && geoEstado.comunidades.has(previo)) sel.value = previo;
    barrioGeoRenderProvincias();
}

function barrioGeoRenderProvincias() {
    const sel = document.getElementById('barrio-geo-provincia');
    if (!sel) return;
    const ccaa = document.getElementById('barrio-geo-ccaa')?.value || '';
    const previo = sel.value;
    let provs = [...geoEstado.provincias.values()];
    if (ccaa) provs = provs.filter(p => String(p.comunidad_id || '') === ccaa);
    provs.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    sel.innerHTML = barrioGeoOpt('— Provincia —') +
        provs.map(p => `<option value="${geoEsc(p.id)}">${geoEsc(p.nombre)}</option>`).join('');
    if (previo && geoEstado.provincias.has(previo)) sel.value = previo;
    barrioGeoRenderCiudades();
}

function barrioGeoRenderCiudades() {
    const sel = document.getElementById('barrio-geo-ciudad');
    if (!sel) return;
    const prov = document.getElementById('barrio-geo-provincia')?.value || '';
    const ccaa = document.getElementById('barrio-geo-ccaa')?.value || '';
    const previo = sel.value;
    let lista = [];
    if (prov) {
        lista = geoEstado.ciudadesPorProvincia.get(String(prov)) || [];
    } else {
        const provincias = [...geoEstado.provincias.values()]
            .filter(p => !ccaa || String(p.comunidad_id || '') === ccaa);
        for (const p of provincias) {
            lista = lista.concat(geoEstado.ciudadesPorProvincia.get(String(p.id)) || []);
        }
    }
    lista = [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    sel.innerHTML = barrioGeoOpt('— Municipio —') +
        lista.map(c => `<option value="${geoEsc(c.id)}">${geoEsc(c.nombre)}</option>`).join('');
    if (previo && [...sel.options].some(o => o.value === previo)) sel.value = previo;
    barrioGeoCargarEntidadesCiudad(sel.value);
}

async function barrioGeoCargarEntidadesCiudad(ine) {
    barrioGeoEstado.ine = ine ? String(ine) : null;
    barrioGeoEstado.distritos = [];
    barrioGeoEstado.barrios = [];
    barrioGeoEstado.cps = [];
    if (barrioGeoEstado.ine) {
        try {
            if (!geoEstado.cargadas.has(barrioGeoEstado.ine) && typeof geoCargarCiudad === 'function') {
                await geoCargarCiudad(barrioGeoEstado.ine);
            }
        } catch (error) { /* sin entidades */ }
        const reg = (typeof geoReg === 'function') ? geoReg(barrioGeoEstado.ine) : null;
        if (reg) {
            barrioGeoEstado.distritos = reg.distritos || [];
            barrioGeoEstado.barrios = reg.barrios || [];
            barrioGeoEstado.cps = reg.cps || [];
        }
    }
    barrioGeoRenderDistritos();
}

function barrioGeoRenderDistritos() {
    const sel = document.getElementById('barrio-geo-distrito');
    if (!sel) return;
    const previo = sel.value;
    const distritos = [...(barrioGeoEstado.distritos || [])];
    sel.innerHTML = barrioGeoOpt('— Distrito —') +
        distritos.map(d => `<option value="${geoEsc(d.codigo)}">${geoEsc(d.nombre)}</option>`).join('');
    sel.disabled = distritos.length === 0;
    if (previo && [...sel.options].some(o => o.value === previo)) sel.value = previo;
    barrioGeoRenderBarrios();
}

function barrioGeoRenderBarrios() {
    const sel = document.getElementById('barrio-geo-barrio');
    if (!sel) return;
    const dist = document.getElementById('barrio-geo-distrito')?.value || '';
    const previo = sel.value;
    let barrios = [...(barrioGeoEstado.barrios || [])];
    if (dist) barrios = barrios.filter(b => String(b.distrito_codigo) === dist);
    sel.innerHTML = barrioGeoOpt('— Barrio —') +
        barrios.map(b => `<option value="${geoEsc(b.codigo)}">${geoEsc(b.nombre)}</option>`).join('');
    sel.disabled = (barrioGeoEstado.barrios || []).length === 0;
    if (previo && [...sel.options].some(o => o.value === previo)) sel.value = previo;
    barrioGeoRenderCps();
}

function barrioGeoRenderCps() {
    const sel = document.getElementById('barrio-geo-cp');
    if (!sel) return;
    const previo = sel.value;
    const cps = [...(barrioGeoEstado.cps || [])]
        .map(c => (typeof c === 'string' ? c : c.codigo)).filter(Boolean);
    sel.innerHTML = barrioGeoOpt(cps.length ? '— Código postal —' : '— Sin CP —') +
        cps.map(cp => `<option value="${geoEsc(cp)}">${geoEsc(cp)}</option>`).join('');
    sel.disabled = cps.length === 0;
    if (previo && [...sel.options].some(o => o.value === previo)) sel.value = previo;
    barrioGeoRenderFicha();
}

// Ficha-mini-mapa simple (decisión c): color + emblema + nombre, sin geometría.
function geoFichaMiniatura({ nombre, color, emblema } = {}) {
    const c = (color && /^#[0-9a-fA-F]{3,8}$/.test(color)) ? color : '#d4af37';
    const em = emblema || '🏰';
    const txt = String(nombre || 'Ubicación').slice(0, 20).replace(/[<>&"]/g, '');
    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">` +
        `<rect width="120" height="120" rx="14" fill="#1c1917" stroke="${c}" stroke-width="4"/>` +
        `<text x="60" y="60" font-size="42" text-anchor="middle">${em}</text>` +
        `<text x="60" y="98" font-size="14" text-anchor="middle" fill="${c}" font-family="sans-serif">${txt}</text>` +
        `</svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function barrioGeoUbicacion() {
    const selCcaa = document.getElementById('barrio-geo-ccaa');
    if (!selCcaa) return { ciudad_id: null, distrito_id: null, barrio_id: null, codigo_postal: null, ruta: '' };
    const ine = document.getElementById('barrio-geo-ciudad')?.value || '';
    const dist = document.getElementById('barrio-geo-distrito')?.value || '';
    const bar = document.getElementById('barrio-geo-barrio')?.value || '';
    const cp = document.getElementById('barrio-geo-cp')?.value || '';
    const distrito_id = (ine && dist) ? `${ine}-${dist}` : null;
    const barrio_id = (ine && dist && bar) ? `${ine}-${dist}-${bar}` : null;

    const partes = [];
    if (selCcaa.value) partes.push(geoNombreComunidad(selCcaa.value));
    const prov = document.getElementById('barrio-geo-provincia')?.value || '';
    if (prov) partes.push(geoNombreProvincia(prov));
    if (ine) partes.push(geoEstado.porIne.get(String(ine))?.nombre || ine);
    if (dist) partes.push((barrioGeoEstado.distritos.find(d => String(d.codigo) === dist) || {}).nombre || dist);
    if (bar) partes.push((barrioGeoEstado.barrios.find(b => String(b.codigo) === bar) || {}).nombre || bar);
    if (cp) partes.push('CP ' + cp);

    return {
        ciudad_id: ine || null, distrito_id, barrio_id,
        codigo_postal: cp || null, ruta: partes.filter(Boolean).join(' › ')
    };
}

function barrioGeoRenderFicha() {
    const cont = document.getElementById('barrio-geo-ficha');
    if (!cont) return;
    const u = barrioGeoUbicacion();
    const nombre = document.getElementById('barrio-nombre')?.value?.trim() || '';
    const emblema = document.getElementById('barrio-emblema')?.value || '🏰';
    if (!u.ciudad_id) {
        cont.innerHTML = '<span style="color:#a1a1aa;font-size:.85rem;">Sin ubicación geográfica asignada (opcional).</span>';
        return;
    }
    const img = geoFichaMiniatura({ nombre, color: '#d4af37', emblema });
    cont.innerHTML =
        `<img src="${img}" alt="Ficha de ${geoEsc(nombre || 'la ubicación')}" width="72" height="72" style="border-radius:10px;">` +
        `<span style="color:#d6d3d1;font-size:.85rem;">${geoEsc(u.ruta)}</span>`;
}

function barrioGeoCambioCcaa() { barrioGeoRenderProvincias(); }
function barrioGeoCambioProvincia() { barrioGeoRenderCiudades(); }
function barrioGeoCambioCiudad() {
    const ine = document.getElementById('barrio-geo-ciudad')?.value || '';
    barrioGeoCargarEntidadesCiudad(ine);
}
function barrioGeoCambioDistrito() { barrioGeoRenderBarrios(); }
function barrioGeoCambioBarrio() { barrioGeoRenderCps(); }

function barrioGeoReset() {
    barrioGeoEstado.ine = null;
    barrioGeoEstado.distritos = [];
    barrioGeoEstado.barrios = [];
    barrioGeoEstado.cps = [];
    const ccaa = document.getElementById('barrio-geo-ccaa');
    if (ccaa) ccaa.value = '';
    barrioGeoRenderProvincias();
    barrioGeoRenderFicha();
}

async function barrioGeoSetDesde(casa) {
    if (!casa || !casa.ciudad_id) { barrioGeoReset(); return; }
    if (!geoEstado.comunidades.size && typeof geoCargarCatalogo === 'function') {
        await geoCargarCatalogo();
    }
    const ine = String(casa.ciudad_id);

    let provinciaId = '';
    for (const [pid, lista] of geoEstado.ciudadesPorProvincia) {
        if (lista.some(c => String(c.id) === ine)) { provinciaId = String(pid); break; }
    }
    const prov = geoEstado.provincias.get(provinciaId);
    const selCcaa = document.getElementById('barrio-geo-ccaa');
    if (selCcaa && prov && prov.comunidad_id) { selCcaa.value = String(prov.comunidad_id); barrioGeoRenderProvincias(); }
    const selProv = document.getElementById('barrio-geo-provincia');
    if (selProv && provinciaId) { selProv.value = provinciaId; barrioGeoRenderCiudades(); }
    const selCiudad = document.getElementById('barrio-geo-ciudad');
    if (selCiudad) { selCiudad.value = ine; await barrioGeoCargarEntidadesCiudad(ine); }

    const partes = (casa.barrio_id || casa.distrito_id || '').split('-');
    if (casa.distrito_id && partes[1]) {
        const selDist = document.getElementById('barrio-geo-distrito');
        if (selDist) { selDist.value = partes[1]; barrioGeoRenderBarrios(); }
    }
    if (casa.barrio_id && partes[2]) {
        const selBar = document.getElementById('barrio-geo-barrio');
        if (selBar) { selBar.value = partes[2]; barrioGeoRenderCps(); }
    }
    if (casa.codigo_postal) {
        const selCp = document.getElementById('barrio-geo-cp');
        if (selCp) selCp.value = String(casa.codigo_postal);
    }
    barrioGeoRenderFicha();
}

function generarLemaAleatorio() {
    const lemas = [
        'Por el honor de nuestra Casa',
        'Donde nace la leyenda',
        'Unidos bajo el mismo estandarte',
        'La lealtad forja nuestro reino',
        'Firme el escudo, noble el corazón',
        'Ni temor ni rendición',
        'Nuestra historia, nuestra gloria',
        'El valor nos abre camino',
        'Un barrio, mil hazañas',
        'La unión es nuestra fortaleza',
        'Que resuene nuestro blasón',
        'Defensores de nuestro legado',
        'La palabra dada es ley',
        'Honor antes que fortuna',
        'Con coraje hacia la victoria',
        'De piedra firme y espíritu indomable',
        'Nuestra casa jamás se rinde',
        'Por la gloria del reino',
        'El deber guía nuestra espada',
        'Tradición que conquista',
        'La nobleza está en los actos',
        'Guardianes de nuestra tierra',
        'El fuego de la casa nunca muere',
        'Con astucia, honor y valor',
        'Un estandarte, un destino',
        'La victoria honra a los valientes',
        'La historia recuerda a los audaces',
        'Bajo nuestra bandera, unidos',
        'Que la justicia reine en Bilbao',
        'Lealtad eterna a nuestra Casa'
    ];

    const campo = document.getElementById('barrio-lema');
    if (campo) campo.value = lemas[Math.floor(Math.random() * lemas.length)];
}


function initApp() {
    cargarBarriosDesdeSupabase();
    cargarEventosDesdeSupabase();
    cargarVotosDesdeSupabase();
    poblarSelectBarriosEvento();
    initCalendarioMedieval();
    renderGalaFinal();
    renderRepositorioVotos();
    renderOpcionesVoto();
    renderTablaUsuarios();
    renderListaTronistas();
    if (typeof renderEventosGeneradosPestanaAdmin === 'function') renderEventosGeneradosPestanaAdmin();
    if (typeof renderCriteriosJerarquicos === 'function') renderCriteriosJerarquicos();
    if (typeof renderClasificacionReal === 'function') renderClasificacionReal();
    if (typeof iniciarTimerRelojCuentaAtras === 'function') iniciarTimerRelojCuentaAtras();
    iniciarRealtimeLokitrono();
    if (typeof cargarEstadoJuego === 'function') cargarEstadoJuego().catch(() => {});
    if (typeof cargarGalaFinalDesdeSupabase === 'function') cargarGalaFinalDesdeSupabase();
    if (typeof aplicarNombreJuego === 'function') aplicarNombreJuego();
    const currentUser = getCurrentUser();
    if (currentUser) {
        actualizarInterfazSesion(currentUser);
    }
    if (typeof renderEstadisticasCodice === 'function') renderEstadisticasCodice();
    if (typeof detectarCierresVotacion === 'function') detectarCierresVotacion();
    setInterval(() => {
        if (typeof detectarCierresVotacion === 'function') detectarCierresVotacion();
        if (typeof aplicarFinDeJuegoUI === 'function') aplicarFinDeJuegoUI();
    }, 30000);
    // Al volver a la pestaña, relee los votos centrales: garantiza que todos los
    // usuarios vean exactamente el mismo repositorio aunque falle Realtime.
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && typeof cargarVotosDesdeSupabase === 'function') {
            cargarVotosDesdeSupabase();
        }
    });
    const fecha = document.getElementById('final-fecha');
    if (fecha && !fecha.value) {
        fecha.value = '2026-10-20T20:30';
    }
}



let simChartInstances = {};

function createOrUpdateChart(canvasId, type, data, options) {
    if (simChartInstances[canvasId]) {
        simChartInstances[canvasId].destroy();
    }
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    if (typeof Chart !== 'undefined') {
        simChartInstances[canvasId] = new Chart(canvas.getContext('2d'), { type, data, options });
    }
}

/* ==========================================
   ESTADÍSTICAS DEL CÓDICE (CAPILARIDAD DE CADA VOTO)
   Se alimentan de los accesores de ámbito y se refrescan en tiempo real
   a medida que avanzan las votaciones.
   ========================================== */

// Valor por defecto de una categoría raíz cuando el voto no trae `detalles_notas`.
const ESTAD_FALLBACK_RAIZ = {
    'crit-ocio': 'nota_festin',
    'crit-acceso': 'nota_caminos',
    'crit-ambiente': 'nota_espiritu'
};

// Nota de un voto concreto en un criterio (raíz o subcategoría). Devuelve null
// si ese criterio no fue valorado. Es la unidad de la "capilaridad" del voto.
function notaVotoEnCriterio(voto, criterio) {
    if (!voto || !criterio) return null;
    const detalles = voto.detalles_notas;
    let nota = null;
    if (detalles && typeof obtenerNotaCriterio === 'function') {
        nota = obtenerNotaCriterio(criterio.id, detalles);
    }
    if ((nota === null || nota === undefined) && ESTAD_FALLBACK_RAIZ[criterio.id]) {
        nota = Number(voto[ESTAD_FALLBACK_RAIZ[criterio.id]]);
    }
    return Number.isFinite(Number(nota)) && nota !== null && nota !== '' ? Number(nota) : null;
}

// Agrega los votos del ámbito activo por barrio y por criterio. Devuelve, por
// cada barrio, la media en cada categoría raíz y en cada subcategoría, además de
// la puntuación Ley II regularizada. Es la base del desglose "capilar".
function calcularEstadisticasPorBarrio() {
    const barrios = getBarriosDelAmbito();
    const votos = getVotosComputablesDelAmbito();
    const criterios = getCriteriosJerarquicos();
    const raices = criterios.filter(c => !c.parentId);
    const hojas = criterios.filter(c => !criterios.some(h => h.parentId === c.id));

    const mediaGlobal = votos.length
        ? votos.reduce((acc, v) => acc + calcularNotaLeyII(v.nota_festin, v.nota_caminos, v.nota_espiritu), 0) / votos.length
        : 0;

    const mediaDeVotos = (listaVotos, criterio) => {
        let suma = 0;
        let n = 0;
        listaVotos.forEach(v => {
            const nota = notaVotoEnCriterio(v, criterio);
            if (nota !== null) { suma += nota; n += 1; }
        });
        return n > 0 ? suma / n : null;
    };

    const filas = barrios.map(barrio => {
        const votosBarrio = votos.filter(v => (v.barrio || v.casa_visitada) === barrio);
        const total = votosBarrio.length;
        const media = campo => total ? votosBarrio.reduce((acc, v) => acc + Number(v[campo] || 0), 0) / total : 0;
        const festin = media('nota_festin');
        const caminos = media('nota_caminos');
        const espiritu = media('nota_espiritu');
        const notaFinal = calcularPuntuacionLeyII(festin, caminos, espiritu, total, mediaGlobal);

        const raicesBarrio = {};
        raices.forEach(r => { raicesBarrio[r.id] = mediaDeVotos(votosBarrio, r); });
        const hojasBarrio = {};
        hojas.forEach(h => { hojasBarrio[h.id] = mediaDeVotos(votosBarrio, h); });

        return { barrio, total, festin, caminos, espiritu, notaFinal, raices: raicesBarrio, hojas: hojasBarrio };
    });

    filas.sort((a, b) => b.notaFinal - a.notaFinal);
    return { barrios, votos, raices, hojas, mediaGlobal, filas };
}

// Renderiza el panel completo de Estadísticas del Códice.
function renderEstadisticasCodice() {
    if (!document.getElementById('panel-estadisticas-codice')) return;

    const { votos, raices, hojas, filas } = calcularEstadisticasPorBarrio();
    const eventosConVot = getEventosConVotacionDelAmbito();
    const cerrados = eventosConVot.filter(e => {
        try { return obtenerEstadoVotacionEvento(e).estado === 'FINALIZADA'; } catch (_) { return false; }
    }).length;
    const pendientes = eventosConVot.length - cerrados;
    const completa = competicionVotacionCompleta();

    const nota = document.getElementById('estad-ambito-nota');
    if (nota) {
        nota.innerHTML = '🏰 <strong>Estadísticas de la competición oficial</strong> del LokiTrono.';
        nota.style.color = '#fde68a';
    }

    const resumen = document.getElementById('estad-resumen');
    if (resumen) {
        const tarjeta = (etiqueta, valor, color) => `
            <div style="background:rgba(15,23,42,0.9);border:1px solid ${color};border-radius:8px;padding:10px;text-align:center;">
                <div style="font-size:0.72rem;color:#a1a1aa;text-transform:uppercase;letter-spacing:0.5px;">${escaparHTML(etiqueta)}</div>
                <div style="font-size:1.35rem;font-weight:bold;color:${color};margin-top:4px;">${valor}</div>
            </div>`;
        resumen.innerHTML =
            tarjeta('Barrios', filas.length, '#facc15') +
            tarjeta('Votos', votos.length, '#4ade80') +
            tarjeta('Eventos c/ votación', eventosConVot.length, '#60a5fa') +
            tarjeta('Cerradas', cerrados, '#22c55e') +
            tarjeta('Pendientes', pendientes, pendientes > 0 ? '#f87171' : '#22c55e') +
            tarjeta('Campeón', completa ? 'Proclamado' : 'Por proclamar', completa ? '#facc15' : '#a16207');
    }

    createOrUpdateChart('estad-chart-ranking', 'bar', {
        labels: filas.map(f => f.barrio),
        datasets: [{
            label: 'Ley II (pts)',
            data: filas.map(f => Number(f.notaFinal.toFixed(2))),
            backgroundColor: 'rgba(212, 175, 55, 0.8)',
            borderColor: '#f59e0b',
            borderWidth: 1.5
        }]
    }, {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, max: 10 } }
    });

    const eventosOrdenados = getEventosDelAmbito().slice().sort((a, b) =>
        `${a.fecha || ''}`.localeCompare(`${b.fecha || ''}`));
    createOrUpdateChart('estad-chart-eventos', 'bar', {
        labels: eventosOrdenados.map(e => `${e.barrio || 'Reino'}${e.tiene_votacion === false ? ' (s/v)' : ''}`),
        datasets: [{
            label: 'Votos emitidos',
            data: eventosOrdenados.map(e => votos.filter(v => String(v.evento_id || '') === String(e.id)).length),
            backgroundColor: eventosOrdenados.map(e => e.tiene_votacion === false ? '#475569' : '#3b82f6')
        }]
    }, {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
    });

    const coloresRaiz = ['#ef4444', '#3b82f6', '#10b981', '#a855f7', '#f59e0b'];
    createOrUpdateChart('estad-chart-criterios', 'bar', {
        labels: filas.map(f => f.barrio),
        datasets: raices.map((r, i) => ({
            label: r.nombre,
            data: filas.map(f => f.raices[r.id] === null ? 0 : Number(Number(f.raices[r.id]).toFixed(2))),
            backgroundColor: coloresRaiz[i % coloresRaiz.length]
        }))
    }, {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, max: 10 } }
    });

    createOrUpdateChart('estad-chart-progreso', 'doughnut', {
        labels: ['Cerradas', 'Pendientes'],
        datasets: [{
            data: [cerrados, Math.max(0, pendientes)],
            backgroundColor: ['#22c55e', '#ef4444'],
            borderColor: '#0f172a',
            borderWidth: 2
        }]
    }, {
        responsive: true,
        maintainAspectRatio: false
    });

    const head = document.getElementById('estad-capilaridad-head');
    if (head) {
        head.innerHTML = '<th>Barrio</th><th>Votos</th>' +
            raices.map(r => `<th>${escaparHTML(r.nombre)} <span style="color:#a1a1aa;">(${r.peso}%)</span></th>`).join('') +
            hojas.map(h => `<th>${escaparHTML(h.nombre)}</th>`).join('') +
            '<th>Ley II</th>';
    }

    const body = document.getElementById('estad-capilaridad-body');
    if (body) {
        if (votos.length === 0) {
            body.innerHTML = `<tr><td colspan="${2 + raices.length + hojas.length + 1}" style="text-align:center;color:#a1a1aa;padding:16px;">Aún no hay votos registrados en este ámbito.</td></tr>`;
        } else {
            const celda = val => (val === null || val === undefined)
                ? '<span style="color:#71717a;">—</span>'
                : Number(val).toFixed(2);
            body.innerHTML = filas.map((f, i) => {
                const medal = ['🥇 1º', '🥈 2º', '🥉 3º'][i] || `🏰 ${i + 1}º`;
                return `<tr>
                    <td><strong>${medal} ${escaparHTML(f.barrio)}</strong></td>
                    <td>${f.total}</td>
                    ${raices.map(r => `<td>${celda(f.raices[r.id])}</td>`).join('')}
                    ${hojas.map(h => `<td>${celda(f.hojas[h.id])}</td>`).join('')}
                    <td><strong style="color:var(--oro-brillante);">${Number(f.notaFinal).toFixed(2)}</strong></td>
                </tr>`;
            }).join('');
        }
    }

    const detalle = document.getElementById('estad-votos-detalle');
    if (detalle) {
        if (votos.length === 0) {
            detalle.innerHTML = '<p style="color:#a1a1aa;font-style:italic;">Sin votos registrados todavía.</p>';
        } else {
            const criteriosOrden = [...raices, ...hojas];
            detalle.innerHTML = votos.slice().sort((a, b) =>
                String(b.fecha_juicio || '').localeCompare(String(a.fecha_juicio || ''))
            ).map(v => {
                const desglose = criteriosOrden.map(c => {
                    const nota = notaVotoEnCriterio(v, c);
                    return `<div style="display:flex;justify-content:space-between;gap:10px;padding:2px 0;border-bottom:1px dashed rgba(212,175,55,0.15);">
                        <span style="color:#d6d3d1;font-size:0.78rem;">${escaparHTML(c.nombre)}</span>
                        <span style="color:#facc15;font-weight:bold;font-size:0.82rem;">${nota === null ? '—' : nota.toFixed(1)}</span>
                    </div>`;
                }).join('');
                const ley = calcularNotaLeyII(v.nota_festin, v.nota_caminos, v.nota_espiritu).toFixed(2);
                const evento = getEventosDelAmbito().find(e => String(e.id) === String(v.evento_id));
                return `<details style="background:rgba(15,23,42,0.7);border:1px solid rgba(212,175,55,0.25);border-radius:8px;padding:8px 12px;margin-bottom:8px;">
                    <summary style="cursor:pointer;color:#fde68a;font-size:0.88rem;">
                        ${escaparHTML(v.maestre_nombre || v.maestre_id || 'Maestre')} · <span style="color:#d6d3d1;">${escaparHTML(v.barrio || v.casa_visitada || '—')}</span>
                        ${evento ? `· <span style="color:#a1a1aa;">${escaparHTML(evento.nombre || evento.barrio || '')}</span>` : ''}
                        · <span style="color:#facc15;font-weight:bold;">${ley} pts</span>
                    </summary>
                    <div style="margin-top:8px;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:4px 18px;">${desglose}</div>
                    <div style="margin-top:6px;font-size:0.72rem;color:#71717a;">${escaparHTML(v.fecha_juicio ? new Date(v.fecha_juicio).toLocaleString('es-ES') : '')}</div>
                </details>`;
            }).join('');
        }
    }
}

// Exporta a CSV la capilaridad completa de cada voto (todas sus notas).
function exportarEstadisticasVotosCSV() {
    const { votos, raices, hojas } = calcularEstadisticasPorBarrio();
    if (!votos.length) {
        alert('No hay votos que exportar en este ámbito.');
        return;
    }
    const eventos = getEventosDelAmbito();
    const criteriosOrden = [...raices, ...hojas];
    const escCSV = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const cabecera = ['Maestre', 'Barrio', 'Evento', 'Fecha', ...criteriosOrden.map(c => c.nombre), 'Ley II'];
    const filas = votos.map(v => {
        const evento = eventos.find(e => String(e.id) === String(v.evento_id));
        return [
            v.maestre_nombre || v.maestre_id || '',
            v.barrio || v.casa_visitada || '',
            evento ? (evento.nombre || evento.barrio || '') : '',
            v.fecha_juicio ? new Date(v.fecha_juicio).toLocaleString('es-ES') : '',
            ...criteriosOrden.map(c => { const n = notaVotoEnCriterio(v, c); return n === null ? '' : n; }),
            calcularNotaLeyII(v.nota_festin, v.nota_caminos, v.nota_espiritu).toFixed(2)
        ].map(escCSV).join(';');
    });
    const csv = '\ufeff' + [cabecera.map(escCSV).join(';'), ...filas].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `estadisticas_codice_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    URL.revokeObjectURL(url);
}

// Aviso flotante global para todos los usuarios y roles. Se autodestruye.
function mostrarNotificacionGlobal(mensaje, tipo = 'info') {
    try {
        let contenedor = document.getElementById('lokitrono-toasts');
        if (!contenedor) {
            contenedor = document.createElement('div');
            contenedor.id = 'lokitrono-toasts';
            contenedor.style.cssText = 'position:fixed;top:16px;right:16px;z-index:99999;display:flex;flex-direction:column;gap:10px;max-width:340px;';
            document.body.appendChild(contenedor);
        }
        const paletas = {
            info: ['#1e3a8a', '#93c5fd'],
            exito: ['#14532d', '#86efac'],
            aviso: ['#78350f', '#fde68a']
        };
        const [fondo, borde] = paletas[tipo] || paletas.info;
        const aviso = document.createElement('div');
        aviso.style.cssText = `background:${fondo};color:${borde};border:1px solid ${borde};border-radius:10px;padding:12px 14px;box-shadow:0 6px 20px rgba(0,0,0,0.5);font-size:0.88rem;line-height:1.3;`;
        aviso.textContent = mensaje;
        contenedor.appendChild(aviso);
        setTimeout(() => {
            aviso.style.transition = 'opacity .4s';
            aviso.style.opacity = '0';
            setTimeout(() => aviso.remove(), 450);
        }, 6000);
    } catch (_) { /* sin DOM disponible */ }
}

// Detecta el cierre de la votación de un evento y avisa a todos los usuarios y
// roles. La primera pasada solo memoriza el estado actual (sin avisar) para no
// generar avisos masivos al cargar la página.
const eventosCerradosNotificados = new Set();
let cierresVotacionInicializados = false;

function detectarCierresVotacion() {
    const eventos = getEventosConVotacionDelAmbito();
    const finalizados = [];
    eventos.forEach(e => {
        try {
            if (obtenerEstadoVotacionEvento(e).estado === 'FINALIZADA') finalizados.push(e);
        } catch (_) { /* evento inválido: se ignora */ }
    });

    if (!cierresVotacionInicializados) {
        finalizados.forEach(e => eventosCerradosNotificados.add(`real:${e.id}`));
        cierresVotacionInicializados = true;
        return;
    }

    finalizados.forEach(e => {
        const clave = `real:${e.id}`;
        if (!eventosCerradosNotificados.has(clave)) {
            eventosCerradosNotificados.add(clave);
            mostrarNotificacionGlobal(
                `🏁 Votación cerrada: ${e.nombre || e.barrio || 'evento'}. El ranking y las estadísticas se han actualizado al instante.`,
                'aviso'
            );
        }
    });
}


document.addEventListener('DOMContentLoaded', initApp);

const supabaseQuery = { select: "select('id, phone, name, role, pin_code, barrio_asignado')" };

window.EVENTOS_FEUDALES = EVENTOS_FEUDALES;
window.guardarBarrio = guardarBarrio;
window.resetFormBarrio = resetFormBarrio;
window.generarLemaAleatorio = generarLemaAleatorio;
window.getBarriosLocal = getBarriosLocal;
window.getBarriosRegistrados = getBarriosRegistrados;
window.cargarBarriosDesdeSupabase = cargarBarriosDesdeSupabase;
window.descargarICSEvento = descargarICSEvento;
window.cambiarPestana = cambiarPestana;
window.iniciarSesionDirecta = iniciarSesionDirecta;
window.cerrarSesionDirecta = cerrarSesionDirecta;
window.toggleFormularioEmitirVoto = toggleFormularioEmitirVoto;
window.guardarVotoBarrioUsuario = guardarVotoBarrioUsuario;
window.exportarRepositorioCSV = exportarRepositorioCSV;
window.puedeGestionarUsuarios = puedeGestionarUsuarios;
window.restablecerPinUsuario = restablecerPinUsuario;
window.cargarVotosDesdeSupabase = cargarVotosDesdeSupabase;
window.puedeGestionarEventosBarrio = puedeGestionarEventosBarrio;
window.puedeEditarEventoTronista = puedeEditarEventoTronista;
window.getCurrentUser = getCurrentUser;
window.haVotadoCasa = haVotadoCasa;
window.eliminarVotoRepositorio = eliminarVotoRepositorio;
window.agregarNuevoCriterioJerarquico = agregarNuevoCriterioJerarquico;
window.eliminarCriterioJerarquico = eliminarCriterioJerarquico;
window.renderCriteriosJerarquicos = renderCriteriosJerarquicos;
window.getRepositorioVotos = getRepositorioVotos;
window.getEstadisticasAdmin = getEstadisticasAdmin;
window.renderClasificacionReal = renderClasificacionReal;
window.setRankingVista = setRankingVista;

window.cambiarMesCalendario = cambiarMesCalendario;
window.actualizarCalendarioMedieval = actualizarCalendarioMedieval;
window.irAFechaActual = irAFechaActual;
window.filtrarEventosPorFecha = filtrarEventosPorFecha;
window.limpiarFiltroFechaCalendario = limpiarFiltroFechaCalendario;
window.guardarEventoBarrio = guardarEventoBarrio;
window.resetFormEvento = resetFormEvento;

window.guardarEventoFinal = guardarEventoFinal;
window.borrarConfiguracionGalaFinal = borrarConfiguracionGalaFinal;
window.descargarICSGalaFinal = descargarICSGalaFinal;
window.renderGalaFinal = renderGalaFinal;

window.__APP_STATE__ = { eventList: EVENTOS_FEUDALES };

// Sistema de títulos y rangos
window.getTituloConfig = getTituloConfig;
window.getTituloCompleto = getTituloCompleto;
window.guardarTitulosConfig = guardarTitulosConfig;
window.getIconoRango = getIconoRango;

// Gestión de usuarios
window.renderTablaUsuarios = renderTablaUsuarios;
window.guardarUsuario = guardarUsuario;
window.cargarUsuariosDesdeSupabase = cargarUsuariosDesdeSupabase;
window.editarUsuario = editarUsuario;
window.eliminarUsuario = eliminarUsuario;
window.resetFormUsuario = resetFormUsuario;
window.asignarTronistaAdmin = asignarTronistaAdmin;
window.renderListaTronistas = renderListaTronistas;

// ==============================================================================
// 🔮 INTEGRACIÓN DE MODELOS DE IA (GROQ VÍA PROXY) & ORÁCULO IMPERIAL
// ==============================================================================
// El Oráculo no llama directamente al proveedor: lo hace a través de la Edge
// Function `oraculo`, que guarda la clave GROQ_API_KEY como secreto del servidor.
// El navegador nunca ve la clave. Ver scripts/configurar_oraculo.py.

const ORACULO_MODELO_DEFECTO = 'openai/gpt-oss-120b';

function obtenerEndpointOraculo() {
    const config = window.__APP_CONFIG__ || {};
    if (config.ORACULO_ENDPOINT) return config.ORACULO_ENDPOINT;
    if (config.SUPABASE_URL) return `${String(config.SUPABASE_URL).replace(/\/$/, '')}/functions/v1/oraculo`;
    return '';
}

function obtenerOraculoConfig() {
    const modelSelect = document.getElementById('select-modelo-oraculo');
    const model = modelSelect ? modelSelect.value : (localStorage.getItem('oraculo_modelo') || ORACULO_MODELO_DEFECTO);
    return { model };
}

function guardarAjustesOraculo() {
    const { model } = obtenerOraculoConfig();
    localStorage.setItem('oraculo_modelo', model);

    const statusEl = document.getElementById('oraculo-config-status');
    if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.textContent = `✅ Configuración guardada: modelo ${model} seleccionado.`;
        setTimeout(() => { statusEl.style.display = 'none'; }, 4000);
    }
}

async function llamarModeloOraculo(promptText, modelOverride) {
    const { model: defaultModel } = obtenerOraculoConfig();
    const model = modelOverride || defaultModel;
    const endpoint = obtenerEndpointOraculo();
    const config = window.__APP_CONFIG__ || {};

    if (endpoint) {
        try {
            const headers = { 'Content-Type': 'application/json' };
            if (config.SUPABASE_ANON_KEY) {
                headers['apikey'] = config.SUPABASE_ANON_KEY;
                headers['Authorization'] = `Bearer ${config.SUPABASE_ANON_KEY}`;
            }
            const response = await fetch(endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify({ prompt: promptText, model })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || `HTTP ${response.status}`);
            }

            const data = await response.json();
            if (data && data.text) {
                return { text: data.text, model: data.model || model, fuente: 'Groq (proxy)' };
            }
        } catch (err) {
            console.warn('Error llamando al Oráculo (Groq), recurriendo a simulación:', err);
        }
    }

    return {
        text: `🔮 [Dictamen del Oráculo Feudal - ${model.toUpperCase()}]\n\n` +
            `«¡Oíd, Maestres del Reino de Bilbao! El Oráculo ha procesado las plegarias e inspeccionado la mesa del festín.\n\n` +
            promptText.substring(0, 150) + `...\n\n` +
            `✨ Dictamen Feudal: ¡Que fluya el txakoli y que el honor de las Siete Calles brille en cada barra de pintxos!»\n\n` +
            `💡 Consejo: El Oráculo se conecta en directo con Groq a través del servidor seguro. Si ves este mensaje, revisa la configuración del proxy (${model}).`,
        model,
        fuente: 'Oráculo Feudal Autónomo'
    };
}

async function generarCronicaOraculo() {
    const btn = document.getElementById('btn-generar-cronica');
    const contenedor = document.getElementById('contenedor-resultado-oraculo');
    const salida = document.getElementById('salida-oraculo');
    const badge = document.getElementById('badge-modelo-usado');
    const tonoSelect = document.getElementById('select-tono-cronica');
    const tono = tonoSelect ? tonoSelect.value : 'epico';

    if (btn) btn.disabled = true;
    if (salida) salida.textContent = '🔮 Invocando al Oráculo e interpretando los signos del Reino...';
    if (contenedor) contenedor.style.display = 'block';

    const votos = typeof getRepositorioVotos === 'function' ? getRepositorioVotos() : [];
    const prompt = `Redacta una crónica medieval feudal sobre el concurso 'El Trono del Pintxo' en Bilbao.
Tono: ${tono}.
Total de juicios emitidos por Maestres: ${votos.length}.
Instrucciones: Incluye referencias medievales a las Casas de Indautxu, Casco Viejo, Deusto, Santutxu y Abando, mencionando el festín, los caminos y el espíritu tabernero.`;

    const { model } = obtenerOraculoConfig();
    const res = await llamarModeloOraculo(prompt, model);

    if (salida) salida.textContent = res.text;
    if (badge) badge.textContent = `${res.model} (${res.fuente})`;
    if (btn) btn.disabled = false;
}

async function generarRecomendacionOraculo() {
    const btn = document.getElementById('btn-generar-recomendacion');
    const contenedor = document.getElementById('contenedor-resultado-oraculo');
    const salida = document.getElementById('salida-oraculo');
    const badge = document.getElementById('badge-modelo-usado');

    const barrioSelect = document.getElementById('select-barrio-recomendacion');
    const antojoInput = document.getElementById('input-antojo-oraculo');

    const barrio = barrioSelect ? barrioSelect.value : '';
    const antojo = antojoInput && antojoInput.value.trim() ? antojoInput.value.trim() : 'Pintxos tradicionales y ambiente festivo';

    if (!barrio) {
        if (contenedor) contenedor.style.display = 'block';
        if (salida) salida.textContent = '🔮 El Oráculo no puede recomendar ninguna ruta: aún no hay barrios creados en el Reino. Da de alta un barrio en la pestaña de Barrios.';
        if (badge) badge.textContent = 'Sin barrios';
        return;
    }

    if (btn) btn.disabled = true;
    if (salida) salida.textContent = `🍷 Consultando a las mentes sabias sobre la mejor ruta en ${barrio}...`;
    if (contenedor) contenedor.style.display = 'block';

    const prompt = `Recomienda una ruta feudal de pintxos y maridaje en el barrio de ${barrio} (Bilbao) para un Maestre con preferencia: '${antojo}'.
Instrucciones: Sugiere 3 especialidades (ej. Gilda imperial, Tortilla de patatas jugosa, Taco de bonito) con maridaje de vino/txakoli y un lema caballeresco para la ruta.`;

    const { model } = obtenerOraculoConfig();
    const res = await llamarModeloOraculo(prompt, model);

    if (salida) salida.textContent = res.text;
    if (badge) badge.textContent = `${res.model} (${res.fuente})`;
    if (btn) btn.disabled = false;
}

// Exponer funciones en window para invocación desde HTML
window.obtenerOraculoConfig = obtenerOraculoConfig;
window.guardarAjustesOraculo = guardarAjustesOraculo;
window.llamarModeloOraculo = llamarModeloOraculo;
window.generarCronicaOraculo = generarCronicaOraculo;
window.generarRecomendacionOraculo = generarRecomendacionOraculo;

/* ==========================================
   CARGA DE DATOS DE SEMILLA (DEMO)
   ========================================== */

function cargarDatosSemilla() {
    const currentUser = getCurrentUser();
    if (!currentUser || !puedeAdministrar(currentUser.role)) {
        alert('Solo Superadmin puede cargar los datos de demostración.');
        return;
    }
    if (!confirm('⚠️ Esto reemplazará TODOS los datos actuales (usuarios, barrios, votos, eventos) con datos de demostración.\n\n¿Continuar?')) return;

    const nombresM = ['Iker', 'Mikel', 'Aitor', 'Gorka', 'Jokin', 'Unai', 'Eneko', 'Iñaki', 'Kepa', 'Asier', 'Koldo', 'Patxi'];
    const nombresF = ['Nerea', 'Ane', 'Leire', 'Miren', 'Izaro', 'Amaia', 'Ainara', 'Garazi', 'Nahia', 'Saioa', 'Maialen', 'Onintza'];
    const apellidos = ['Etxebarria', 'Agirre', 'Zubiaurre', 'Goikoetxea', 'Uriarte', 'Bilbao', 'Larrinaga', 'Arteaga', 'Zabala', 'Mendizabal', 'Iturriaga', 'Elorza'];
    const barriosActivos = ['Indautxu', 'Santutxu', 'Rekalde', 'Deusto', 'Casco Viejo'];
    const emblemas = ['🍷', '🛡️', '🔥', '⚓', '🏰'];

    function rItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function rPhone() { return '6' + String(Math.floor(10000000 + Math.random() * 90000000)); }
    function rPin() { return String(Math.floor(100000 + Math.random() * 900000)); }

    // Superadmins predeterminados
    const superadmins = [
        { id: 'user-julio-01', phone: '605676002', name: 'Maestre Julio', role: 'superadmin', pin_code: '123456', barrio_representado: 'Indautxu', barrio_asignado: 'Indautxu', gender: 'M' },
        { id: 'user-julio-02', phone: '+34605676002', name: 'Maestre Julio', role: 'superadmin', pin_code: '123456', barrio_representado: 'Indautxu', barrio_asignado: 'Indautxu', gender: 'M' },
        { id: 'user-superadmin-01', phone: '123456789', name: 'Superadmin Bilbao', role: 'superadmin', pin_code: '123456', barrio_representado: 'Casco Viejo', barrio_asignado: 'Casco Viejo', gender: 'M' },
        { id: 'user-superadmin-02', phone: 'admin', name: 'Superadmin Sistema', role: 'superadmin', pin_code: '123456', barrio_representado: 'Casco Viejo', barrio_asignado: 'Casco Viejo', gender: 'M' },
        { id: 'user-soraya', phone: '456123456', name: 'SORAYA', role: 'superadmin', pin_code: '123456', barrio_representado: 'Deusto', barrio_asignado: 'Deusto', gender: 'F' },
        { id: 'user-ainhoa-01', phone: '663366786', name: 'Ainhoa', role: 'jugador', pin_code: '123456', barrio_representado: 'Deusto', barrio_asignado: '', gender: 'F' }
    ];

    const usedPhones = new Set(superadmins.map(u => u.phone));

    // 10 jugadores (maestres) aleatorios
    const jugadores = [];
    for (let i = 0; i < 10; i++) {
        const esFem = Math.random() < 0.5;
        const nombre = esFem ? rItem(nombresF) : rItem(nombresM);
        const apellido = rItem(apellidos);
        let phone;
        do { phone = rPhone(); } while (usedPhones.has(phone));
        usedPhones.add(phone);
        jugadores.push({
            id: `user-jugador-${String(i + 1).padStart(2, '0')}`,
            phone,
            name: `${nombre} ${apellido}`,
            role: 'jugador',
            pin_code: rPin(),
            barrio_representado: rItem(barriosActivos),
            barrio_asignado: '',
            gender: esFem ? 'F' : 'M'
        });
    }

    // 2 tronistas por barrio (1 M + 1 F)
    const tronistas = [];
    let tIdx = 0;
    barriosActivos.forEach(barrio => {
        for (let t = 0; t < 2; t++) {
            tIdx++;
            const esFem = t === 1;
            const nombre = esFem ? rItem(nombresF) : rItem(nombresM);
            const apellido = rItem(apellidos);
            let phone;
            do { phone = rPhone(); } while (usedPhones.has(phone));
            usedPhones.add(phone);
            tronistas.push({
                id: `user-tronista-${String(tIdx).padStart(2, '0')}`,
                phone,
                name: `${nombre} ${apellido}`,
                role: 'tronista',
                pin_code: rPin(),
                barrio_representado: barrio,
                barrio_asignado: barrio,
                gender: esFem ? 'F' : 'M'
            });
        }
    });

    const todosUsuarios = [...superadmins, ...jugadores, ...tronistas];

    // Barrios
    const barriosData = barriosActivos.map((nombre, i) => ({
        id: `casa-seed-${String(i + 1).padStart(2, '0')}`,
        nombre,
        lema: '',
        emblema: emblemas[i],
        color_heraldo: '',
        imagen_url: '',
        participa: true,
        created_at: new Date().toISOString()
    }));

    // Escribir en localStorage
    localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(todosUsuarios));
    localStorage.setItem(STORAGE_KEYS.barrios, JSON.stringify(barriosData));
    localStorage.setItem(STORAGE_KEYS.repositorioVotos, JSON.stringify([]));
    localStorage.setItem('eventos_feudales_custom', JSON.stringify([]));

    alert(`✅ Datos de semilla cargados:\n• ${superadmins.length} superadmins\n• ${jugadores.length} jugadores (maestres)\n• ${tronistas.length} tronistas (2 por barrio)\n• ${barriosActivos.length} barrios: ${barriosActivos.join(', ')}\n• 0 votos\n• 0 eventos\n\nLa página se recargará ahora.`);
    location.reload();
}


// ==========================================
// SORTEO Y ORDEN DE BARRIOS
// ==========================================

let ordenSorteoBarrios = [];

function moverBarrioSorteo(indice, desplazamiento) {
    const destino = indice + desplazamiento;
    if (destino < 0 || destino >= ordenSorteoBarrios.length) return;

    [ordenSorteoBarrios[indice], ordenSorteoBarrios[destino]] =
        [ordenSorteoBarrios[destino], ordenSorteoBarrios[indice]];

    renderOrdenSorteoBarrios();
}

function renderOrdenSorteoBarrios() {
    const lista = document.getElementById('lista-orden-sorteo-barrios');
    if (!lista) return;

    lista.innerHTML = '';

    if (!ordenSorteoBarrios.length) {
        lista.innerHTML = '<li>No hay barrios participantes cargados.</li>';
        return;
    }

    ordenSorteoBarrios.forEach((barrio, indice) => {
        const li = document.createElement('li');
        li.style.cssText = 'margin:10px 0;padding:10px;border:1px solid #57534e;border-radius:8px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;';

        const nombre = document.createElement('span');
        nombre.textContent = `${barrio.emblema || '🏰'} ${barrio.nombre}`;
        nombre.style.cssText = 'flex:1;min-width:150px;';
        li.appendChild(nombre);

        const posicion = document.createElement('span');
        posicion.textContent = `Posición ${indice + 1}`;
        posicion.style.color = '#d6d3d1';
        li.appendChild(posicion);

        [
            { texto: '↑', delta: -1, etiqueta: `Subir ${barrio.nombre}`, desactivado: indice === 0 },
            { texto: '↓', delta: 1, etiqueta: `Bajar ${barrio.nombre}`, desactivado: indice === ordenSorteoBarrios.length - 1 }
        ].forEach(opcion => {
            const boton = document.createElement('button');
            boton.type = 'button';
            boton.textContent = opcion.texto;
            boton.setAttribute('aria-label', opcion.etiqueta);
            boton.disabled = opcion.desactivado;
            boton.style.cssText = 'padding:6px 12px;border-radius:6px;cursor:pointer;';
            boton.addEventListener('click', () => moverBarrioSorteo(indice, opcion.delta));
            li.appendChild(boton);
        });

        lista.appendChild(li);
    });

    renderResultadoSorteoModal();
}

function renderResultadoSorteoModal() {
    const detalle = document.getElementById('detalle-resultado-sorteo');
    if (!detalle) return;

    detalle.innerHTML = '';

    if (!ordenSorteoBarrios.length) {
        detalle.innerHTML = '<li>No hay barrios participantes cargados. Genera un sorteo o carga el orden.</li>';
        return;
    }

    ordenSorteoBarrios.forEach((barrio, indice) => {
        const li = document.createElement('li');
        li.style.cssText = 'margin:10px 0;padding:10px 14px;border:1px solid #57534e;border-left:4px solid var(--oro-brillante, #d4af37);border-radius:8px;display:flex;gap:12px;align-items:center;';

        const posicion = document.createElement('span');
        posicion.textContent = String(indice + 1);
        posicion.style.cssText = 'width:28px;height:28px;border-radius:50%;background:var(--oro-brillante, #d4af37);color:#221c0a;font-weight:bold;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;';
        li.appendChild(posicion);

        const nombre = document.createElement('span');
        nombre.textContent = `${barrio.emblema || '🏰'} ${barrio.nombre}`;
        nombre.style.flex = '1';
        li.appendChild(nombre);

        detalle.appendChild(li);
    });
}

function abrirResultadoSorteo() {
    const modal = document.getElementById('modal-resultado-sorteo');
    if (!modal) return;
    if (!ordenSorteoBarrios.length) cargarOrdenSorteoBarrios();
    renderResultadoSorteoModal();
    modal.style.display = 'flex';
}

function cerrarResultadoSorteo() {
    const modal = document.getElementById('modal-resultado-sorteo');
    if (modal) modal.style.display = 'none';
}

async function realizarSorteoDesdeVentana() {
    await generarSorteoBarrios();
    renderResultadoSorteoModal();
}


async function cargarOrdenSorteoBarrios() {
    const estado = document.getElementById('estado-sorteo-barrios');
    const boton = document.getElementById('btn-recargar-orden-sorteo');
    const client = getSupabaseBarriosClient();

    if (!client) {
        if (estado) estado.textContent = 'Error: no se ha podido inicializar Supabase.';
        return;
    }

    if (boton) boton.disabled = true;
    if (estado) estado.textContent = 'Cargando orden desde Supabase…';

    try {
        const { data, error } = await client.rpc('obtener_orden_sorteo_barrios');
        if (error) throw error;

        ordenSorteoBarrios = (data || []).map(b => ({
            id: b.barrio_id,
            nombre: b.nombre,
            emblema: b.emblema || '🏰'
        }));

        renderOrdenSorteoBarrios();
        if (estado) estado.textContent = `Orden cargado: ${ordenSorteoBarrios.length} barrios participantes.`;
    } catch (error) {
        console.error('Error al cargar el orden del sorteo:', error);
        if (estado) estado.textContent = `No se pudo cargar el orden: ${error.message || 'error desconocido'}`;
    } finally {
        if (boton) boton.disabled = false;
    }
}

async function generarSorteoBarrios() {
    const usuario = getCurrentUser();
    const estado = document.getElementById('estado-sorteo-barrios');
    const boton = document.getElementById('btn-generar-sorteo-barrios');
    const client = getSupabaseBarriosClient();

    if (!usuario || !puedeAdministrar(usuario.role)) {
        alert('Solo un administrador puede generar el sorteo.');
        return;
    }

    if (!client) {
        if (estado) estado.textContent = 'Error: no se ha podido inicializar Supabase.';
        return;
    }

    const pin = window.prompt('Introduce tu PIN de administración para generar el sorteo:');
    if (pin === null) return;
    if (!/^\d{6}$/.test(pin.trim())) {
        alert('El PIN debe contener exactamente seis dígitos.');
        return;
    }

    if (!window.confirm('Se generará y guardará un nuevo orden aleatorio de los barrios participantes. ¿Continuar?')) return;

    if (boton) boton.disabled = true;
    if (estado) estado.textContent = 'Generando sorteo…';

    try {
        const { data, error } = await client.rpc('generar_sorteo_barrios_superadmin', {
            p_phone: String(usuario.phone || ''),
            p_pin: pin.trim()
        });
        if (error) throw error;

        await cargarOrdenSorteoBarrios();
        if (estado) estado.textContent = `Sorteo guardado en Supabase: ${Number(data) || 0} barrios participantes.`;
    } catch (error) {
        console.error('Error al generar el sorteo:', error);
        if (estado) estado.textContent = `No se pudo generar el sorteo: ${error.message || 'error desconocido'}`;
    } finally {
        if (boton) boton.disabled = false;
    }
}

async function guardarOrdenSorteoBarrios() {
    const usuario = getCurrentUser();
    const estado = document.getElementById('estado-sorteo-barrios');
    const boton = document.getElementById('btn-guardar-orden-sorteo');
    const client = getSupabaseBarriosClient();

    if (!usuario || !puedeAdministrar(usuario.role)) {
        alert('Solo un administrador puede guardar el orden.');
        return;
    }

    if (!client) {
        if (estado) estado.textContent = 'Error: no se ha podido inicializar Supabase.';
        return;
    }

    if (!ordenSorteoBarrios.length) {
        alert('Carga primero el orden de los barrios participantes.');
        return;
    }

    const pin = window.prompt('Introduce tu PIN de administración para guardar el orden:');
    if (pin === null) return;
    if (!/^\d{6}$/.test(pin.trim())) {
        alert('El PIN debe contener exactamente seis dígitos.');
        return;
    }

    if (!window.confirm('¿Guardar en Supabase el orden manual mostrado?')) return;

    if (boton) boton.disabled = true;
    if (estado) estado.textContent = 'Guardando orden…';

    try {
        const { data, error } = await client.rpc('guardar_orden_sorteo_barrios_superadmin', {
            p_phone: String(usuario.phone || ''),
            p_pin: pin.trim(),
            p_orden: ordenSorteoBarrios.map(b => b.id)
        });
        if (error) throw error;

        if (estado) estado.textContent = `Orden guardado correctamente: ${Number(data) || 0} barrios.`;
    } catch (error) {
        console.error('Error al guardar el orden:', error);
        if (estado) estado.textContent = `No se pudo guardar el orden: ${error.message || 'error desconocido'}`;
    } finally {
        if (boton) boton.disabled = false;
    }
}

async function restaurarCompeticion() {
    const usuario = getCurrentUser();
    const estado = document.getElementById('estado-restaurar-competicion');
    const boton = document.getElementById('btn-restaurar-competicion');
    const client = getSupabaseBarriosClient();

    if (!usuario || !puedeAdministrar(usuario.role)) {
        alert('Solo un superadministrador puede restaurar la competición.');
        return;
    }

    if (!client) {
        if (estado) estado.textContent = 'Error: no se ha podido inicializar Supabase.';
        return;
    }

    if (!window.confirm('⚠️ Se borrarán votos, eventos, códigos diarios, barrios (excepto Forastero) y todas las cuentas salvo superadmin. Esta acción NO se puede deshacer. ¿Continuar?')) {
        return;
    }

    const pin = window.prompt('Introduce tu PIN de administración para restaurar la competición:');
    if (pin === null) return;
    if (!/^\d{6}$/.test(pin.trim())) {
        alert('El PIN debe contener exactamente seis dígitos.');
        return;
    }

    if (!window.confirm('Última confirmación: ¿restaurar la competición a su estado inicial?')) return;

    if (boton) boton.disabled = true;
    if (estado) estado.textContent = 'Restaurando la competición…';

    try {
        const { data, error } = await client.rpc('restaurar_competicion_superadmin', {
            p_phone: String(usuario.phone || ''),
            p_pin: pin.trim()
        });
        if (error) throw error;

        // Los eventos locales heredados también forman parte de la partida.
        try { localStorage.setItem('eventos_feudales_custom', JSON.stringify([])); } catch (_) { /* almacenamiento no disponible */ }
        eventosSupabaseCache = [];

        const r = data || {};
        if (estado) {
            estado.textContent = `Competición restaurada. Barrios eliminados: ${r.casas_eliminadas || 0}, `
                + `usuarios eliminados: ${r.usuarios_eliminados || 0}, votos: ${r.votos_evento || 0}, `
                + `juicios: ${r.juicios || 0}, eventos: ${r.eventos || 0}, códigos: ${r.codigos_diarios || 0}.`;
        }

        if (typeof cargarBarriosDesdeSupabase === 'function') await cargarBarriosDesdeSupabase();
        if (typeof cargarEventosDesdeSupabase === 'function') await cargarEventosDesdeSupabase();
        if (typeof cargarVotosDesdeSupabase === 'function') await cargarVotosDesdeSupabase();
        if (typeof cargarOrdenSorteoBarrios === 'function') await cargarOrdenSorteoBarrios();
        if (typeof cargarEstadoJuego === 'function') await cargarEstadoJuego();
        if (typeof renderEstadisticasCodice === 'function') renderEstadisticasCodice();
        if (typeof renderClasificacionReal === 'function') renderClasificacionReal();
        if (typeof aplicarFinDeJuegoUI === 'function') aplicarFinDeJuegoUI();
    } catch (error) {
        console.error('Error al restaurar la competición:', error);
        if (estado) estado.textContent = `No se pudo restaurar la competición: ${error.message || 'error desconocido'}`;
    } finally {
        if (boton) boton.disabled = false;
    }
}


window.cargarDatosSemilla = cargarDatosSemilla;

window.generarSorteoBarrios = generarSorteoBarrios;
window.guardarOrdenSorteoBarrios = guardarOrdenSorteoBarrios;
window.cargarOrdenSorteoBarrios = cargarOrdenSorteoBarrios;
window.abrirResultadoSorteo = abrirResultadoSorteo;
window.cerrarResultadoSorteo = cerrarResultadoSorteo;
window.realizarSorteoDesdeVentana = realizarSorteoDesdeVentana;
window.restaurarCompeticion = restaurarCompeticion;


/* ============================================================================
 * LOKI-BOT — ASISTENTE DE AYUDA (FAQ LOCAL, SIN IA)
 * Responde sobre el sistema de votación, la ventana para votar, las vistas del
 * menú, los roles y los conceptos del juego. Si no sabe responder, registra la
 * pregunta en Supabase (RPC registrar_consulta_lokibot) para ampliar la ayuda.
 * ========================================================================== */

const LOKIBOT_FAQ = [
    {
        id: 'acceso',
        categoria: 'Acceso',
        claves: ['entrar', 'entrar al juego', 'iniciar sesion', 'login', 'acceder', 'como entro', 'como inicio', 'acceso', 'telefono y pin', 'credenciales'],
        respuesta: 'Para entrar necesitas tu teléfono y un PIN de 6 dígitos. Escribe ambos en la pantalla de acceso y pulsa «Entrar al Reino». Si es tu primera vez, la organización te habrá enviado el PIN por WhatsApp.'
    },
    {
        id: 'pin-perdido',
        categoria: 'Acceso',
        claves: ['olvide', 'olvidado', 'perdi el pin', 'perdi mi pin', 'no recuerdo el pin', 'recuperar pin', 'nuevo pin', 'cambiar pin', 'restablecer pin', 'regenerar pin'],
        respuesta: 'Si pierdes el PIN, un administrador puede generar uno nuevo por ti. Pide a la organización que lo regenere: aparecerá un botón 🔑 junto a tu usuario en la gestión de usuarios, y el nuevo PIN se reenviará por WhatsApp.'
    },
    {
        id: 'roles',
        categoria: 'Roles',
        claves: ['roles', 'que es un rol', 'significan los roles', 'maestre', 'lokitronista', 'tronista', 'superadmin', 'administrador', 'permisos'],
        respuesta: 'Estos son los roles del reino:\n• 👑 Maestre (jugador): participa y vota en los eventos.\n• ⚔️ Lokitronista (tronista): representa a un barrio; hay un máximo de 2 por barrio.\n• 🏰 Superadmin: gestiona usuarios, roles, eventos y barrios.'
    },
    {
        id: 'lokitronista-que-hace',
        categoria: 'Roles',
        claves: ['que hace un lokitronista', 'que hace un tronista', 'funcion del lokitronista', 'representar barrio', 'maximo lokitronistas', 'cuantos lokitronistas', 'ser lokitronista'],
        respuesta: 'Un Lokitronista representa oficialmente a un barrio. Cada barrio puede tener como máximo 2 Lokitronistas. Para evitar conflictos de interés, un Lokitronista no puede votar en los eventos que se celebran en su propio barrio, aunque sí puede votar en los de otros barrios.'
    },
    {
        id: 'votar-cuando',
        categoria: 'Votación',
        claves: ['cuando puedo votar', 'cuando se vota', 'horario votacion', 'hora votacion', 'a que hora', 'ventana votacion', 'se puede votar', 'empieza la votacion', 'termina la votacion'],
        respuesta: 'Cada evento abre su propia ventana de votación. Empieza a la hora de inicio indicada por la organización (por defecto 20:30) y termina a la hora de cierre (por defecto 23:30), pudiendo abarcar hasta la fecha de fin de votación. En la ficha del evento verás una etiqueta con el estado: 🟢 Abierta, 🟡 No iniciada o 🔒 Finalizada.'
    },
    {
        id: 'votar-estados',
        categoria: 'Votación',
        claves: ['estado de la votacion', 'votacion cerrada', 'votacion abierta', 'votacion finalizada', 'no iniciada', 'cerrada', 'abierta', 'pendiente', 'etiqueta estado'],
        respuesta: 'Los estados de una votación son:\n• 🟡 No iniciada: aún no ha llegado la hora de apertura.\n• 🟢 Abierta: puedes emitir tu juicio.\n• 🔒 Finalizada: se superó la hora de cierre o un administrador la cerró manualmente; ya no se puede votar.'
    },
    {
        id: 'votar-dos-veces',
        categoria: 'Votación',
        claves: ['votar dos veces', 'voto unico', 'cuantos votos', 'repetir voto', 'voto repetido', 'volver a votar', 'varias veces'],
        respuesta: 'El voto es único por Maestre y Casa: un Maestre solo puede valorar cada Casa (barrio participante) una sola vez. Si intentas votar de nuevo la misma Casa, el sistema te avisará de que ya lo has hecho.'
    },
    {
        id: 'votar-no-puedo',
        categoria: 'Votación',
        claves: ['no me deja votar', 'no puedo votar', 'por que no puedo votar', 'no me deja', 'bloqueado', 'no me funciona el voto', 'sin permiso para votar'],
        respuesta: 'No puedes votar cuando se cumple alguna de estas causas:\n• La votación no está abierta (fuera de la ventana horaria o ya finalizada).\n• Ya has votado a esa Casa (voto único por Maestre y Casa).\n• Eres Lokitronista y el evento es de tu propio barrio.\nRevisa la etiqueta de estado del evento; si crees que es un error, avisa a la organización.'
    },
    {
        id: 'criterios',
        categoria: 'Votación',
        claves: ['que criterios', 'criterios de valoracion', 'como valoro', 'que valoro', 'ocio', 'accesibilidad', 'ambiente', 'notas', 'puntuacion', 'subcriterios', 'que puntuo'],
        respuesta: 'Al votar una Casa valoras tres grandes bloques:\n• 🍷 Ocio Hostelero (50%): el festín y la pócima de poteo.\n• 🚌 Accesibilidad (20%): carruajes, dragones subterráneos (metro), establos y solidez de caminos.\n• 🎉 Ambiente de Barrio (30%): originalidad, organización y gozo del pueblo.\nDentro de cada bloque hay subcriterios que se combinan entre sí.'
    },
    {
        id: 'clasificacion',
        categoria: 'Clasificación',
        claves: ['como se calcula la clasificacion', 'clasificacion real', 'ranking', 'codice de la villa', 'quien va primero', 'puntuacion final', 'ley ii', 'media ponderada'],
        respuesta: 'La clasificación (el «Códice de la Villa») es una media ponderada: 0,50 Ocio Hostelero + 0,20 Accesibilidad + 0,30 Ambiente. Además se regulariza con un factor (K = 3) para que pocas valoraciones no disparen la nota. La encuentras en la vista 🏆 Clasificación Real.'
    },
    {
        id: 'menus',
        categoria: 'Menú',
        claves: ['que vistas hay', 'vistas del menu', 'opciones del menu', 'pestanas', 'que puedo hacer en el menu', 'menu', 'secciones', 'navegacion'],
        respuesta: 'El menú del reino incluye:\n• 🏆 Clasificación Real\n• 🗳️ Votación de Barrio\n• 👑 Lokitronistas de Barrios\n• 📅 Calendario de Eventos\n• 🎉 Gala Final\nSi eres administrador verás además: ⚙️ Generar y Gestionar Eventos, 📊 Auditoría de Votos, 👤 Usuarios y 🏰 Barrios.'
    },
    {
        id: 'vista-votacion-barrio',
        categoria: 'Menú',
        claves: ['votacion de barrio', 'donde voto', 'formulario de voto', 'emitir voto', 'como voto'],
        respuesta: 'En 🗳️ Votación de Barrio eliges el barrio y la Casa, y emites tu juicio con las notas de cada criterio. Solo verás la opción de votar cuando la ventana del evento esté 🟢 Abierta y no hayas votado ya esa Casa (ni seas Lokitronista de ese barrio).'
    },
    {
        id: 'vista-calendario',
        categoria: 'Menú',
        claves: ['calendario', 'calendario de eventos', 'fechas de eventos', 'proximos eventos', 'sincronizar calendario', 'ics'],
        respuesta: 'El 📅 Calendario de Eventos muestra las fiestas del reino por fechas. Puedes filtrar por día, volver a hoy y sincronizar cada evento con tu calendario (.ics) para no perderte ninguna votación.'
    },
    {
        id: 'vista-gala',
        categoria: 'Menú',
        claves: ['gala final', 'gala', 'final', 'premios', 'ganadores', 'ceremonia'],
        respuesta: 'La 🎉 Gala Final es la ceremonia de clausura donde se proclaman las Casas ganadoras según el Códice de la Villa. Puede incluir un sorteo entre los barrios participantes.'
    },
    {
        id: 'vista-clasificacion-rankings',
        categoria: 'Menú',
        claves: ['ranking general', 'ranking del evento', 'historico por evento', 'historico', 'vistas de ranking', 'tres rankings', 'pestañas de clasificacion'],
        respuesta: 'En 🏆 Clasificación Real tienes tres rankings:\n• 🏆 Ranking General: suma los votos de todos los eventos.\n• 🗳️ Ranking del Evento: solo el evento que tiene la votación abierta ahora.\n• 📜 Histórico por Evento: el resultado de cada evento celebrado, en orden.'
    },
    {
        id: 'vista-tronistas',
        categoria: 'Menú',
        claves: ['lokitronistas de barrios', 'veladores', 'vista tronistas', 'quienes son los lokitronistas', 'representantes'],
        respuesta: 'La vista 👑 Lokitronistas de Barrios muestra qué Maestres representan cada barrio. Recuerda: cada barrio tiene como máximo 2 Lokitronistas y no pueden votar en su propio barrio.'
    },
    {
        id: 'primeros-pasos',
        categoria: 'Ayuda',
        claves: ['primeros pasos', 'como empiezo', 'soy nuevo', 'que hago', 'guia', 'tutorial', 'por donde empiezo'],
        respuesta: 'Guía rápida del Maestre:\n1) Mira el 📅 Calendario para ver la próxima fiesta y su horario.\n2) Cuando la votación esté 🟢 Abierta, entra en 🗳️ Votación de Barrio y valora la Casa.\n3) Sigue la tabla en 🏆 Clasificación Real.\n4) Consulta la 🎉 Gala Final para el cierre.\nYo, Loki-Bot, te resuelvo las dudas en cualquier momento.'
    },
    {
        id: 'evento',
        categoria: 'Conceptos',
        claves: ['que es un evento', 'eventos', 'como funciona un evento', 'crear evento', 'fecha del evento', 'duracion evento'],
        respuesta: 'Un evento es una jornada de la contienda en un barrio concreto: tiene fecha, hora de celebración y una ventana de votación (inicio, fin y fecha de cierre). Tras el evento, los Maestres emiten sus juicios mientras la ventana esté abierta; al cerrarse, las notas se consolidan en la clasificación.'
    },
    {
        id: 'forastero',
        categoria: 'Conceptos',
        claves: ['forastero', 'barrio forastero', 'participar sin barrio', 'no competitivo', 'sin barrio'],
        respuesta: '«Forastero» es el barrio especial para usuarios sin barrio asignado. Es un caso no competitivo: sirve para poder participar sin representar a ningún barrio del reino.'
    },
    {
        id: 'oraculo',
        categoria: 'Conceptos',
        claves: ['oraculo', 'oraculo imperial', 'ia', 'inteligencia artificial', 'cronica', 'recomendacion del oraculo', 'groq'],
        respuesta: 'El 🔮 Oráculo Imperial es un asistente con IA (Groq) que redacta crónicas y recomendaciones del reino. Yo, Loki-Bot, no uso IA: respondo solo con la información de ayuda del reino.'
    },
    {
        id: 'cerrar-sesion',
        categoria: 'Acceso',
        claves: ['cerrar sesion', 'salir', 'logout', 'desconectarme'],
        respuesta: 'Para salir, pulsa el botón «🚪 Cerrar Sesión» que aparece junto a tu nombre, en la parte superior de la corte. Tu PIN no se guarda: para volver a entrar tendrás que escribirlo de nuevo.'
    },
    {
        id: 'contacto',
        categoria: 'Ayuda',
        claves: ['contacto', 'contactar', 'organizacion', 'soporte', 'ayuda humana', 'problema', 'error'],
        respuesta: 'Si algo no funciona o necesitas ayuda humana, contacta con la organización del juego (los administradores del reino). Ellos pueden regenerar tu PIN, corregir tu barrio o ajustar un evento.'
    }
];

const LOKIBOT_SUGERENCIAS = [
    '¿Por dónde empiezo?',
    '¿Cuándo puedo votar?',
    '¿Puedo votar dos veces?',
    '¿Qué significan los roles?',
    '¿Qué rankings hay?',
    '¿Cómo se calcula la clasificación?'
];

function lokibotNormalizar(texto) {
    return String(texto || '')
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9ñ\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function lokibotPuntuar(consulta, claves) {
    const palabras = consulta.split(' ');
    let puntuacion = 0;
    claves.forEach(clave => {
        const c = lokibotNormalizar(clave);
        if (!c) return;
        if (c.includes(' ')) {
            if (consulta.includes(c)) puntuacion += 3;
        } else if (palabras.includes(c)) {
            puntuacion += 1;
        } else if (c.length >= 6 && consulta.includes(c)) {
            puntuacion += 1;
        }
    });
    return puntuacion;
}

function lokibotBuscarRespuesta(mensaje) {
    const consulta = lokibotNormalizar(mensaje);
    if (!consulta) return null;
    let mejor = null;
    let mejorPuntuacion = 0;
    LOKIBOT_FAQ.forEach(faq => {
        const p = lokibotPuntuar(consulta, faq.claves);
        if (p > mejorPuntuacion) {
            mejorPuntuacion = p;
            mejor = faq;
        }
    });
    return (mejor && mejorPuntuacion >= 1) ? mejor : null;
}

function lokibotRespuestaSocial(consulta) {
    if (!consulta) return null;
    if (/^(hola|buenas|buenos dias|buenas tardes|hey|que tal|saludos)\b/.test(consulta)) {
        return '¡Saludos, Maestre! 🏰 Soy Loki-Bot, el ayuda del reino. Pregúntame por la votación, sus horarios, los roles o las vistas del menú.';
    }
    if (/\b(gracias|muchas gracias)\b/.test(consulta)) {
        return '¡De nada, Maestre! Para eso está este humilde bot. ⚔️ ¿Algo más?';
    }
    if (/^(adios|hasta luego|chao|nos vemos)\b/.test(consulta)) {
        return '¡Que el honor de las Casas te acompañe! Vuelve cuando necesites ayuda. 👑';
    }
    return null;
}

function lokibotResolver(mensaje) {
    const consulta = lokibotNormalizar(mensaje);
    const social = lokibotRespuestaSocial(consulta);
    if (social) return { texto: social, resuelta: true, id: null };
    const hallazgo = lokibotBuscarRespuesta(mensaje);
    if (hallazgo) return { texto: hallazgo.respuesta, resuelta: true, id: hallazgo.id };
    return {
        texto: 'Aún no tengo una respuesta guardada para eso. 🤔\nPrueba con algo como:\n• ¿Cuándo puedo votar?\n• ¿Puedo votar dos veces?\n• ¿Qué significan los roles?\n• ¿Qué vistas tiene el menú?\n• ¿Cómo se calcula la clasificación?\n\nHe anotado tu pregunta para ampliar el manual de ayuda.',
        resuelta: false,
        id: null
    };
}

function lokibotAnadirMensaje(texto, quien) {
    const cont = document.getElementById('lokibot-mensajes');
    if (!cont) return;
    const div = document.createElement('div');
    div.className = 'lokibot-msg ' + (quien === 'user' ? 'lokibot-msg-user' : 'lokibot-msg-bot');
    div.textContent = texto;
    cont.appendChild(div);
    cont.scrollTop = cont.scrollHeight;
}

function lokibotRenderSugerencias() {
    const cont = document.getElementById('lokibot-sugerencias');
    if (!cont || cont.dataset.listado === '1') return;
    cont.dataset.listado = '1';
    cont.innerHTML = LOKIBOT_SUGERENCIAS
        .map(s => `<button type="button" class="lokibot-chip" onclick="lokibotResponderChip(this.textContent)">${escaparHTML(s)}</button>`)
        .join('');
}

function lokibotAbrirPanel() {
    const panel = document.getElementById('lokibot-panel');
    if (!panel) return;
    panel.classList.add('lokibot-abierto');
    lokibotRenderSugerencias();
    const cont = document.getElementById('lokibot-mensajes');
    if (cont && cont.dataset.saludo !== '1') {
        cont.dataset.saludo = '1';
        lokibotAnadirMensaje('¡Saludos, Maestre! Soy Loki-Bot, el ayuda del reino. Pregúntame sobre la votación, los horarios, los roles o las vistas del menú.', 'bot');
    }
    const input = document.getElementById('lokibot-input');
    if (input) input.focus();
}

function lokibotCerrarPanel() {
    const panel = document.getElementById('lokibot-panel');
    if (panel) panel.classList.remove('lokibot-abierto');
}

function lokibotAlternarPanel() {
    const panel = document.getElementById('lokibot-panel');
    if (!panel) return;
    if (panel.classList.contains('lokibot-abierto')) lokibotCerrarPanel();
    else lokibotAbrirPanel();
}

function lokibotEnviar(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    const input = document.getElementById('lokibot-input');
    const texto = (input ? input.value : '').trim();
    if (!texto) return;
    if (input) input.value = '';
    lokibotProcesarMensaje(texto);
}

function lokibotResponderChip(texto) {
    lokibotProcesarMensaje(String(texto || '').trim());
}

function lokibotProcesarMensaje(texto) {
    if (!texto) return;
    lokibotAnadirMensaje(texto, 'user');
    const res = lokibotResolver(texto);
    lokibotAnadirMensaje(res.texto, 'bot');
    if (!res.resuelta) lokibotRegistrarConsulta(texto, false);
    else lokibotRegistrarConsulta(texto, true);
}

function lokibotActualizarVisibilidad(usuario) {
    const burbuja = document.getElementById('lokibot-burbuja');
    if (!burbuja) return;
    if (usuario) {
        burbuja.classList.add('lokibot-visible');
    } else {
        burbuja.classList.remove('lokibot-visible');
        lokibotCerrarPanel();
    }
}

async function lokibotRegistrarConsulta(pregunta, resuelta) {
    try {
        const usuario = getCurrentUser();
        if (!usuario || !usuario.token) return;
        const client = getSupabaseBarriosClient();
        if (!client) return;
        await client.rpc('registrar_consulta_lokibot', {
            p_token: usuario.token,
            p_pregunta: String(pregunta || '').slice(0, 2000),
            p_resuelta: !!resuelta
        });
    } catch (error) {
        console.warn('No se pudo registrar la consulta de Loki-Bot:', error?.message || error);
    }
}

window.lokibotAlternarPanel = lokibotAlternarPanel;
window.lokibotCerrarPanel = lokibotCerrarPanel;
window.lokibotEnviar = lokibotEnviar;
window.lokibotResponderChip = lokibotResponderChip;


/* ============================================================================
 * CONFIGURACIÓN INICIAL Y GUÍAS DE PRIMER USO
 * - Administrador/Superadmin: nombre del juego + panel-checklist y recorrido guiado.
 * - Maestres: aviso de bienvenida que resume para qué sirve cada menú.
 * Todo se apoya en datos reales (barrios, usuarios, eventos, gala) para saber
 * qué pasos están hechos; localStorage solo recuerda lo descartado/visto.
 * ========================================================================== */

const NOMBRE_JUEGO_DEFAULT = 'LokiTrono de Barrios';

function getNombreJuego() {
    try { return localStorage.getItem('config_juego_nombre') || NOMBRE_JUEGO_DEFAULT; }
    catch (_) { return NOMBRE_JUEGO_DEFAULT; }
}

function guardarNombreJuego(nombre) {
    const limpio = String(nombre || '').trim().slice(0, 80);
    try {
        if (limpio) localStorage.setItem('config_juego_nombre', limpio);
        else localStorage.removeItem('config_juego_nombre');
    } catch (_) { /* almacenamiento no disponible */ }
    aplicarNombreJuego();
}

function aplicarNombreJuego() {
    const sub = document.getElementById('subtitulo-juego');
    if (!sub) return;
    let guardado = null;
    try { guardado = localStorage.getItem('config_juego_nombre'); } catch (_) { guardado = null; }
    sub.textContent = guardado ? `🎮 ${guardado}` : '';
    sub.style.display = guardado ? 'block' : 'none';
    const input = document.getElementById('tutorial-input-nombre-juego');
    if (input && document.activeElement !== input) input.value = guardado || '';
}

// Pasos de la puesta en marcha del juego. `tab` es la pestaña a la que enlaza.
const TUTORIAL_PASOS_DEF = [
    { id: 'juego', icono: '🎮', titulo: 'Crea el juego y ponle nombre',
      desc: 'Define el nombre de esta edición o competición. Aparecerá bajo el título de la portada.' },
    { id: 'ubicaciones', icono: '🏰', titulo: 'Da de alta los barrios (ubicaciones)',
      desc: 'Registra los barrios del reino y marca cuáles participan en la competición.', tab: 'pestana-barrios' },
    { id: 'sorteo', icono: '🎲', titulo: 'Genera el sorteo y su orden',
      desc: 'Reparte el orden de los eventos o las piezas entre los barrios participantes.', tab: 'pestana-sorteo-eventos' },
    { id: 'usuarios', icono: '👥', titulo: 'Crea los usuarios',
      desc: 'Da de alta a los participantes con su teléfono y su PIN de acceso.', tab: 'pestana-usuarios' },
    { id: 'roles', icono: '👑', titulo: 'Designa los roles',
      desc: 'Asigna Lokitronistas (máximo 2 por barrio), superadmins y masters.', tab: 'pestana-usuarios' },
    { id: 'eventos', icono: '📅', titulo: 'Programa los eventos',
      desc: 'Crea cada jornada en su barrio y define su ventana de votación.', tab: 'pestana-generar-evento' },
    { id: 'gala', icono: '🎉', titulo: 'Configura y publica la Gala Final',
      desc: 'Fija título, lugar, fecha y premio. Al publicarla se mostrará a los maestres.', tab: 'pestana-evento-final' }
];

// Calcula qué pasos están completados a partir de los datos reales disponibles.
function estadoPasosConfiguracion() {
    const barrios = (typeof casasCache !== 'undefined' ? casasCache : [])
        .filter(c => c && c.nombre && c.nombre !== 'Forastero');
    const usuarios = getUsuariosDelAmbito();
    const eventos = getEventosDelAmbito();
    const rolesAsignados = usuarios.some(u => ['tronista', 'superadmin', 'master'].includes(u.role));
    const gala = typeof galaFinalEstaPublicada === 'function' && galaFinalEstaPublicada();
    let nombreJuego = null;
    try { nombreJuego = localStorage.getItem('config_juego_nombre'); } catch (_) { nombreJuego = null; }
    const sorteo = typeof ordenSorteoBarrios !== 'undefined' && ordenSorteoBarrios.length > 0;

    return TUTORIAL_PASOS_DEF.map(paso => {
        let hecho = false;
        switch (paso.id) {
            case 'juego': hecho = Boolean(nombreJuego); break;
            case 'ubicaciones': hecho = barrios.length > 0; break;
            case 'sorteo': hecho = sorteo; break;
            case 'usuarios': hecho = usuarios.length > 0; break;
            case 'roles': hecho = rolesAsignados; break;
            case 'eventos': hecho = eventos.length > 0; break;
            case 'gala': hecho = gala; break;
        }
        return { ...paso, hecho };
    });
}

function irAPasoConfiguracion(tab) {
    cerrarTutorialConfiguracion();
    if (tab && typeof cambiarPestana === 'function') cambiarPestana(tab);
}

function guardarNombreJuegoDesdeTutorial() {
    const input = document.getElementById('tutorial-input-nombre-juego');
    guardarNombreJuego(input ? input.value : '');
    renderTutorialConfiguracion();
}

function borrarNombreJuegoDesdeTutorial() {
    guardarNombreJuego('');
    renderTutorialConfiguracion();
}

function renderTutorialConfiguracion() {
    const cont = document.getElementById('tutorial-config-pasos');
    if (!cont) return;
    const pasos = estadoPasosConfiguracion();
    const hechos = pasos.filter(p => p.hecho).length;

    const barra = document.getElementById('tutorial-progreso-barra');
    if (barra) barra.style.width = `${Math.round((hechos / pasos.length) * 100)}%`;
    const texto = document.getElementById('tutorial-progreso-texto');
    if (texto) texto.textContent = `${hechos} de ${pasos.length} pasos completados.`;

    cont.innerHTML = pasos.map(paso => {
        const extra = paso.id === 'juego'
            ? `<div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">
                   <input type="text" id="tutorial-input-nombre-juego" class="input-medieval"
                       placeholder="Nombre del juego o edición" style="flex:1;min-width:160px;">
                   <button type="button" class="btn-cuervo" onclick="guardarNombreJuegoDesdeTutorial()">Guardar</button>
                   <button type="button" class="btn-cuervo" style="background:#78350f;" onclick="borrarNombreJuegoDesdeTutorial()">Borrar</button>
               </div>`
            : `<button type="button" class="btn-cuervo" style="margin-top:8px;"
                   onclick="irAPasoConfiguracion('${paso.tab}')">Ir →</button>`;
        return `
            <div class="tutorial-paso ${paso.hecho ? 'tutorial-hecho' : ''}">
                <div class="tutorial-paso-icono">${paso.hecho ? '✅' : paso.icono}</div>
                <div class="tutorial-paso-cuerpo">
                    <p class="tutorial-paso-titulo">${paso.titulo}${paso.hecho ? ' · hecho' : ''}</p>
                    <p class="tutorial-paso-desc">${paso.desc}</p>
                    ${extra}
                </div>
            </div>
        `;
    }).join('');
    aplicarNombreJuego();
}

function abrirTutorialConfiguracion() {
    const overlay = document.getElementById('tutorial-config-overlay');
    if (!overlay) return;
    renderTutorialConfiguracion();
    overlay.style.display = 'flex';
}

function cerrarTutorialConfiguracion() {
    const overlay = document.getElementById('tutorial-config-overlay');
    if (overlay) overlay.style.display = 'none';
}

function descartarTutorialConfiguracion() {
    try { localStorage.setItem('tutorial_config_descartado', '1'); } catch (_) { /* noop */ }
    cerrarTutorialConfiguracion();
    actualizarVisibilidadTutorialConfig(getCurrentUser());
}

function actualizarVisibilidadTutorialConfig(usuario) {
    const burbuja = document.getElementById('tutorial-config-burbuja');
    if (!burbuja) return;
    const esAdmin = usuario && puedeAdministrar(usuario.role);
    let descartado = false;
    try { descartado = localStorage.getItem('tutorial_config_descartado') === '1'; } catch (_) { descartado = false; }
    burbuja.style.display = esAdmin ? 'flex' : 'none';
    burbuja.style.opacity = '1';
    burbuja.title = descartado
        ? 'Configuración inicial (oculta: «No volver a mostrar»)'
        : 'Configuración inicial del reino';
    if (!esAdmin) cerrarTutorialConfiguracion();
}

// Recorrido guiado (primer inicio de sesión de un administrador).
let tourPasoActual = 0;

function renderTourPaso() {
    const pasos = TUTORIAL_PASOS_DEF;
    const paso = pasos[tourPasoActual];
    if (!paso) return;
    const set = (id, valor) => { const el = document.getElementById(id); if (el) el.textContent = valor; };
    set('tour-paso-icono', paso.icono);
    set('tour-paso-titulo', paso.titulo);
    set('tour-paso-desc', paso.desc);
    set('tour-paso-contador', `Paso ${tourPasoActual + 1} de ${pasos.length}`);
    const btnAnt = document.getElementById('tour-btn-anterior');
    if (btnAnt) btnAnt.style.visibility = tourPasoActual === 0 ? 'hidden' : 'visible';
    const btnSig = document.getElementById('tour-btn-siguiente');
    if (btnSig) btnSig.textContent = tourPasoActual === pasos.length - 1 ? 'Abrir checklist →' : 'Siguiente →';
}

function abrirTourConfiguracion() {
    const overlay = document.getElementById('tutorial-tour-overlay');
    if (!overlay) return;
    tourPasoActual = 0;
    renderTourPaso();
    overlay.style.display = 'flex';
}

function cerrarTourConfiguracion(abrirChecklist) {
    const overlay = document.getElementById('tutorial-tour-overlay');
    if (overlay) overlay.style.display = 'none';
    try { localStorage.setItem('tutorial_admin_visto', '1'); } catch (_) { /* noop */ }
    if (abrirChecklist) abrirTutorialConfiguracion();
}

function tourSiguiente() {
    if (tourPasoActual >= TUTORIAL_PASOS_DEF.length - 1) { cerrarTourConfiguracion(true); return; }
    tourPasoActual += 1;
    renderTourPaso();
}

function tourAnterior() {
    if (tourPasoActual > 0) { tourPasoActual -= 1; renderTourPaso(); }
}

// Aviso de bienvenida para maestres (no administradores).
function mostrarBienvenidaMaestre() {
    const overlay = document.getElementById('bienvenida-maestre-overlay');
    const lista = document.getElementById('bienvenida-guia-lista');
    if (lista) {
        const puntos = [
            ['🏆 Clasificación Real', 'La tabla de la competición y sus rankings (general, del evento en curso e histórico).'],
            ['🗳️ Votación de Barrio', 'Aquí emites tu juicio cuando la ventana de un evento está abierta.'],
            ['👑 Lokitronistas', 'Quiénes representan a cada barrio.'],
            ['📅 Calendario', 'Las próximas fiestas y sus horarios de votación.'],
            ['🎉 Gala Final', 'La ceremonia de cierre y los premios.']
        ];
        lista.innerHTML = puntos.map(([t, d]) => `<li><strong>${t}:</strong> ${d}</li>`).join('');
    }
    if (overlay) overlay.style.display = 'flex';
}

function cerrarBienvenidaMaestre(noVolver) {
    const overlay = document.getElementById('bienvenida-maestre-overlay');
    if (overlay) overlay.style.display = 'none';
    try {
        localStorage.setItem('bienvenida_maestre_vista', '1');
        if (noVolver) localStorage.setItem('bienvenida_maestre_no_mostrar', '1');
    } catch (_) { /* noop */ }
}

// Decide qué guía mostrar en cada inicio de sesión.
function iniciarGuiasPrimerUso(usuario) {
    if (!usuario) return;
    const esAdmin = puedeAdministrar(usuario.role);
    if (esAdmin) {
        let visto = false;
        try { visto = localStorage.getItem('tutorial_admin_visto') === '1'; } catch (_) { visto = false; }
        if (!visto) abrirTourConfiguracion();
    } else {
        let vista = false, noMostrar = false;
        try {
            vista = localStorage.getItem('bienvenida_maestre_vista') === '1';
            noMostrar = localStorage.getItem('bienvenida_maestre_no_mostrar') === '1';
        } catch (_) { /* noop */ }
        if (!vista && !noMostrar) mostrarBienvenidaMaestre();
    }
}

window.abrirTutorialConfiguracion = abrirTutorialConfiguracion;
window.cerrarTutorialConfiguracion = cerrarTutorialConfiguracion;
window.descartarTutorialConfiguracion = descartarTutorialConfiguracion;
window.guardarNombreJuegoDesdeTutorial = guardarNombreJuegoDesdeTutorial;
window.borrarNombreJuegoDesdeTutorial = borrarNombreJuegoDesdeTutorial;
window.irAPasoConfiguracion = irAPasoConfiguracion;
window.tourSiguiente = tourSiguiente;
window.tourAnterior = tourAnterior;
window.cerrarTourConfiguracion = cerrarTourConfiguracion;
window.cerrarBienvenidaMaestre = cerrarBienvenidaMaestre;


/* ============================================================================
 * LOKITRONO — GEOGRAFÍA: mapa interactivo y selección en cascada
 * Ciudades (todos los municipios) → distritos → barrios → códigos postales.
 * Los mapas se cargan a demanda (lazy) desde data/ciudades/<ine>.*.
 * ========================================================================== */
const GEO_PALETA = [
    '#e11d48', '#f97316', '#eab308', '#22c55e', '#14b8a6',
    '#3b82f6', '#8b5cf6', '#ec4899', '#84cc16', '#06b6d4'
];

const geoEstado = {
    catalogo: [],
    porIne: new Map(),
    cargadas: new Map(),
    activa: null,
    mapa: null,
    seleccion: new Map(),
    pendientes: new Map(),
    comunidades: new Map(),
    provincias: new Map(),
    ciudadesPorProvincia: new Map()
};

function geoHexAHsl(hex) {
    let h = String(hex || '').replace('#', '').trim();
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    if (!/^[0-9a-fA-F]{6}$/.test(h)) return { h: 210, s: 0.6, l: 0.5 };
    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let hue = 0, sat = 0;
    if (max !== min) {
        const d = max - min;
        sat = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) hue = (g - b) / d + (g < b ? 6 : 0);
        else if (max === g) hue = (b - r) / d + 2;
        else hue = (r - g) / d + 4;
        hue /= 6;
    }
    return { h: hue, s: sat, l };
}

function geoHslAHex(h, s, l) {
    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const k = (n + h * 12) % 12;
        const c = l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
        return Math.round(255 * c).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function geoColorDistrito(indice, colorExistente) {
    return colorExistente || GEO_PALETA[indice % GEO_PALETA.length];
}

function geoVariante(hexBase, indice, total) {
    const { h, s, l } = geoHexAHsl(hexBase);
    const factor = total <= 1 ? 0.5 : indice / (total - 1);
    const nuevaL = 0.30 + factor * 0.42;
    const nuevaS = Math.max(0.35, Math.min(1, s + 0.08));
    return geoHslAHex(h, nuevaS, Math.max(0.22, Math.min(0.78, nuevaL)));
}

async function geoCargarCatalogo() {
    try {
        const res = await fetch('data/ciudades/index.json', { cache: 'no-store' });
        if (res.ok) {
            const json = await res.json();
            geoEstado.catalogo = json.ciudades || [];
        }
    } catch (error) {
        console.warn('No se pudo cargar el catálogo geográfico:', error);
    }
    geoEstado.porIne = new Map(geoEstado.catalogo.map(c => [String(c.ine), c]));

    const client = (typeof getSupabaseBarriosClient === 'function') ? getSupabaseBarriosClient() : null;
    if (!client) { geoRenderFiltros(); return; }

    // Comunidades autónomas.
    try {
        const { data } = await client.from('comunidades').select('id, nombre').order('nombre');
        if (Array.isArray(data)) geoEstado.comunidades = new Map(data.map(x => [String(x.id), x.nombre]));
    } catch (error) { console.warn('Comunidades no disponibles:', error); }

    // Provincias (con comunidad y capital; tolerante a migración pendiente).
    geoEstado.provincias = new Map();
    geoEstado.ciudadesPorProvincia = new Map();
    try {
        let provs = [];
        let { data, error } = await client.from('provincias')
            .select('id, nombre, ccaa, comunidad_id, capital_id').order('nombre');
        if (error) {
            ({ data } = await client.from('provincias').select('id, nombre, ccaa').order('nombre'));
        }
        provs = data || [];
        for (const p of provs) {
            geoEstado.provincias.set(String(p.id), {
                id: String(p.id), nombre: p.nombre, ccaa: p.ccaa || '',
                comunidad_id: p.comunidad_id ? String(p.comunidad_id) : null,
                capital_id: p.capital_id ? String(p.capital_id) : null
            });
        }
    } catch (error) { console.warn('Provincias no disponibles:', error); }

    // Municipios de toda España, agrupados por provincia. PostgREST recorta a
    // 1000 filas por petición, así que se pagina hasta agotar el catálogo.
    try {
        const PAGE = 1000;
        let todos = [];
        for (let desde = 0; ; desde += PAGE) {
            const { data, error } = await client.from('ciudades')
                .select('id, nombre, provincia_id, es_capital')
                .order('id', { ascending: true })
                .range(desde, desde + PAGE - 1);
            if (error) { console.warn('Catálogo Supabase no disponible:', error); break; }
            if (!Array.isArray(data) || data.length === 0) break;
            todos = todos.concat(data);
            if (data.length < PAGE) break;
        }
        for (const c of todos) {
            const prov = c.provincia_id ? String(c.provincia_id) : null;
            if (prov) {
                if (!geoEstado.ciudadesPorProvincia.has(prov)) geoEstado.ciudadesPorProvincia.set(prov, []);
                geoEstado.ciudadesPorProvincia.get(prov).push({
                    id: String(c.id), nombre: c.nombre, es_capital: !!c.es_capital
                });
            }
            const ine = String(c.id);
            if (!geoEstado.porIne.has(ine)) {
                geoEstado.porIne.set(ine, {
                    ine, nombre: c.nombre, provincia: prov,
                    geom: null, distritos: null, barrios: null, entidades: null,
                    centro: [null, null], es_capital: !!c.es_capital
                });
            }
        }
        // Ordenar los municipios de cada provincia por nombre.
        for (const lista of geoEstado.ciudadesPorProvincia.values()) {
            lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
        }
    } catch (error) { console.warn('Catálogo Supabase no disponible:', error); }

    geoRenderFiltros();
    geoRenderDatalist();
}

function geoNombreComunidad(id) {
    return geoEstado.comunidades.get(String(id)) || '';
}

function geoNombreProvincia(id) {
    const p = geoEstado.provincias.get(String(id));
    return p ? p.nombre : '';
}

function geoCapitalDeProvincia(provinciaId) {
    const p = geoEstado.provincias.get(String(provinciaId));
    return p ? p.capital_id : null;
}

function geoRenderFiltros() {
    const selCcaa = document.getElementById('geo-select-ccaa');
    const selProv = document.getElementById('geo-select-provincia');
    const selCiudad = document.getElementById('geo-select-ciudad');
    const selCp = document.getElementById('geo-select-cp');
    if (!selCcaa || !selProv) return;

    const ccaa = [...geoEstado.comunidades.entries()]
        .sort((a, b) => a[1].localeCompare(b[1], 'es'));
    const valorCcaa = selCcaa.value;
    selCcaa.innerHTML = '<option value="">Todas las comunidades</option>' +
        ccaa.map(([id, nombre]) => `<option value="${geoEsc(id)}">${geoEsc(nombre)}</option>`).join('');
    if (valorCcaa && geoEstado.comunidades.has(valorCcaa)) selCcaa.value = valorCcaa;

    geoRenderSelectProvincias();
    geoRenderSelectCiudades();
    if (selCp) selCp.innerHTML = '<option value="">— Elige un municipio primero —</option>';
}

function geoRenderSelectProvincias() {
    const selCcaa = document.getElementById('geo-select-ccaa');
    const selProv = document.getElementById('geo-select-provincia');
    if (!selProv) return;
    const ccaaSel = selCcaa ? selCcaa.value : '';
    const previo = selProv.value;

    let provincias = [...geoEstado.provincias.values()];
    if (ccaaSel) provincias = provincias.filter(p => String(p.comunidad_id || '') === ccaaSel);
    provincias.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

    selProv.innerHTML = '<option value="">Todas las provincias</option>' +
        provincias.map(p => {
            const cap = p.capital_id ? geoEstado.porIne.get(String(p.capital_id)) : null;
            const capNombre = cap ? ` — ${cap.nombre}` : '';
            return `<option value="${geoEsc(p.id)}">${geoEsc(p.nombre)}${geoEsc(capNombre)}</option>`;
        }).join('');
    if (previo && geoEstado.provincias.has(previo)) selProv.value = previo;
}

function geoCiudadesVisibles() {
    const selCcaa = document.getElementById('geo-select-ccaa');
    const selProv = document.getElementById('geo-select-provincia');
    const soloCap = document.getElementById('geo-solo-capitales');
    const ccaaSel = selCcaa ? selCcaa.value : '';
    const provSel = selProv ? selProv.value : '';
    const soloCapitales = !!(soloCap && soloCap.checked);

    let provincias = [...geoEstado.provincias.values()];
    if (ccaaSel) provincias = provincias.filter(p => String(p.comunidad_id || '') === ccaaSel);
    if (provSel) provincias = provincias.filter(p => String(p.id) === provSel);

    const resultado = [];
    for (const p of provincias) {
        let lista = geoEstado.ciudadesPorProvincia.get(String(p.id)) || [];
        if (soloCapitales) lista = lista.filter(c => c.es_capital);
        resultado.push({ provincia: p, ciudades: lista });
    }
    return resultado;
}

function geoRenderSelectCiudades() {
    const sel = document.getElementById('geo-select-ciudad');
    if (!sel) return;
    const grupos = geoCiudadesVisibles();
    const hayProvincias = grupos.some(g => g.ciudades.length);
    if (!hayProvincias) {
        sel.innerHTML = '<option value="">— Sin municipios para este filtro —</option>';
        return;
    }
    let html = '<option value="">Elige un municipio…</option>';
    const unProvincia = grupos.length === 1;
    for (const g of grupos) {
        const opciones = g.ciudades.map(c =>
            `<option value="${geoEsc(c.id)}">${c.es_capital ? '⭐ ' : ''}${geoEsc(c.nombre)}</option>`
        ).join('');
        if (unProvincia) html += opciones;
        else html += `<optgroup label="${geoEsc(g.provincia.nombre)}">${opciones}</optgroup>`;
    }
    sel.innerHTML = html;
}

function geoRenderDatalist() {
    const lista = document.getElementById('geo-lista-ciudades');
    if (!lista) return;
    const ciudades = [...geoEstado.porIne.values()]
        .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    lista.innerHTML = ciudades.map(c =>
        `<option value="${geoEsc(c.nombre)}" data-ine="${geoEsc(c.ine)}">${geoEsc(c.ine)}${c.provincia ? ' · ' + geoEsc(c.provincia) : ''}</option>`
    ).join('');
}

function geoEsc(v) {
    return String(v == null ? '' : v)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function geoActivarMapa() {
    if (geoEstado.mapa) return geoEstado.mapa;
    const cont = document.getElementById('geo-mapa');
    if (!cont || !window.L) return null;
    geoEstado.mapa = L.map(cont, { scrollWheelZoom: true }).setView([40.4168, -3.7038], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
    }).addTo(geoEstado.mapa);
    return geoEstado.mapa;
}

function geoBuscarPorNombre(termino) {
    const t = String(termino || '').trim().toLowerCase();
    if (!t) return null;
    const ciudades = [...geoEstado.porIne.values()];
    return ciudades.find(c => String(c.ine) === t)
        || ciudades.find(c => c.nombre.toLowerCase() === t)
        || ciudades.find(c => c.nombre.toLowerCase().startsWith(t))
        || null;
}

async function geoCargarCiudad(ine) {
    ine = String(ine);
    const estado = document.getElementById('geo-estado');
    const mapa = geoActivarMapa();

    if (!geoEstado.porIne.has(ine)) {
        if (estado) estado.textContent = 'Municipio no encontrado en el catálogo.';
        return;
    }
    if (geoEstado.cargadas.has(ine)) {
        geoEstado.activa = ine;
        geoRefrescarSegunActiva();
        if (estado) estado.textContent = `${geoEstado.porIne.get(ine).nombre}: ya estaba cargado.`;
        return;
    }

    const info = geoEstado.porIne.get(ine);
    if (estado) estado.textContent = `Cargando ${info.nombre}…`;

    const registro = { info, distritos: [], barrios: [], cps: [], capa: null, distColor: new Map() };

    // Entidades (distritos/barrios/CP) — asset local o Supabase.
    let entidades = null;
    if (info.entidades) {
        try { entidades = await (await fetch(info.entidades, { cache: 'force-cache' })).json(); } catch (e) { /* ignore */ }
    }
    if (!entidades) entidades = await geoCargarEntidadesSupabase(ine);
    if (entidades) {
        registro.distritos = entidades.distritos || [];
        registro.barrios = entidades.barrios || [];
        registro.cps = (entidades.codigos_postales || []).map(cp => (typeof cp === 'string' ? { codigo: cp } : cp));
        registro.info = { ...registro.info, ...{ nombre: entidades.nombre || info.nombre, provincia: entidades.provincia || info.provincia } };
    }

    // Asignar colores a los distritos.
    registro.distritos.forEach((d, i) => {
        registro.distColor.set(String(d.codigo), geoColorDistrito(i, d.color));
    });
    // Asignar color (variante) a los barrios dentro de su distrito.
    const porDistrito = new Map();
    registro.barrios.forEach(b => {
        const k = String(b.distrito_codigo);
        if (!porDistrito.has(k)) porDistrito.set(k, []);
        porDistrito.get(k).push(b);
    });
    for (const [k, lista] of porDistrito) {
        const base = registro.distColor.get(k) || geoColorDistrito(registro.distColor.size, null);
        if (!registro.distColor.has(k)) registro.distColor.set(k, base);
        lista.forEach((b, i) => {
            b._color = b.color || geoVariante(base, i, lista.length);
        });
    }
    registro.distritos.forEach(d => { d._color = registro.distColor.get(String(d.codigo)); });

    geoEstado.cargadas.set(ine, registro);
    geoEstado.activa = ine;

    // Geometría en el mapa (lazy).
    if (mapa) {
        const grupo = L.layerGroup().addTo(mapa);
        registro.capa = grupo;
        const capasCiudad = [];

        const cargarCapa = async (ruta, { tipo, colorPorFeature, relleno, peso, opacidad }) => {
            if (!ruta) return null;
            try {
                const gj = await (await fetch(ruta, { cache: 'force-cache' })).json();
                const capa = L.geoJSON(gj, {
                    style: (f) => {
                        const color = colorPorFeature ? colorPorFeature(f) : '#d4af37';
                        return { color: '#fde68a', weight: peso, fillColor: color, fillOpacity: opacidad };
                    },
                    onEachFeature: (f, layer) => {
                        const cod = f.properties && (f.properties.codigo || f.properties.DISTRICTE || f.properties.distrito || '');
                        layer.on('click', () => geoAlternarDesdeMapa(tipo, cod, ine));
                    }
                }).addTo(grupo);
                capasCiudad.push(capa);
                return capa;
            } catch (error) {
                console.warn('No se pudo cargar la capa', ruta, error);
                return null;
            }
        };

        await cargarCapa(info.geom, {
            tipo: 'ciudad', relleno: '#1f2937', peso: 2, opacidad: 0.05
        });
        if (info.barrios) {
            await cargarCapa(info.barrios, {
                tipo: 'barrio', peso: 1, opacidad: 0.55,
                colorPorFeature: (f) => {
                    const cod = f.properties && (f.properties.codigo || f.properties.BARRI);
                    const dist = f.properties && (f.properties.DISTRICTE);
                    const b = registro.barrios.find(x => String(x.codigo) === String(cod) &&
                        (dist == null || String(x.distrito_codigo) === String(dist)));
                    return (b && b._color) || '#3b82f6';
                }
            });
        }
        if (info.distritos) {
            await cargarCapa(info.distritos, {
                tipo: 'distrito', peso: 2, opacidad: 0.18,
                colorPorFeature: (f) => registro.distColor.get(String(f.properties && f.properties.DISTRICTE)) || '#22c55e'
            });
        }
        if (capasCiudad.length) {
            const bounds = L.featureGroup(capasCiudad).getBounds();
            if (bounds.isValid()) mapa.fitBounds(bounds, { padding: [20, 20] });
        }
    }

    geoRefrescarSegunActiva();
    if (estado) estado.textContent = `${registro.info.nombre} cargado (${registro.distritos.length} distritos, ${registro.barrios.length} barrios, ${registro.cps.length} CP).`;
    geoActualizarAtribucion();
}

async function geoCargarEntidadesSupabase(ine) {
    const client = (typeof getSupabaseBarriosClient === 'function') ? getSupabaseBarriosClient() : null;
    if (!client) return null;
    try {
        const [dist, barr, cpMap] = await Promise.all([
            client.from('distritos').select('codigo, nombre, color, orden').eq('ciudad_id', ine).order('orden'),
            client.from('barrios').select('distrito_id, codigo, nombre, color, orden').eq('ciudad_id', ine).order('orden'),
            client.from('codigo_postal_ciudad').select('codigo_postal').eq('ciudad_id', ine)
        ]);
        if (dist.error || barr.error) return null;
        return {
            distritos: (dist.data || []).map(d => ({ codigo: d.codigo, nombre: d.nombre, color: d.color })),
            barrios: (barr.data || []).map(b => ({
                distrito_codigo: String(b.distrito_id).split('-').pop(),
                codigo: b.codigo, nombre: b.nombre, color: b.color
            })),
            codigos_postales: (cpMap.data || []).map(r => ({ codigo: r.codigo_postal }))
        };
    } catch (error) {
        return null;
    }
}

function geoRefrescarSegunActiva() {
    geoRenderCiudadesCargadas();
    geoRenderDistritos();
    geoRenderBarrios();
    geoRenderCps();
    geoRenderSeleccion();
    geoActualizarEstadoPendientes();
}

function geoRenderCiudadesCargadas() {
    const cont = document.getElementById('geo-lista-ciudades-cargadas');
    if (!cont) return;
    cont.innerHTML = [...geoEstado.cargadas.values()].map(reg => {
        const activa = reg.info.ine === geoEstado.activa ? ' (activa)' : '';
        const marcada = geoEstado.pendientes.has(`ciudad:${reg.info.ine}`) ? ' checked' : '';
        return `<li><label><input type="checkbox" data-geo-ciudad="${geoEsc(reg.info.ine)}"${marcada}> ${geoEsc(reg.info.nombre)}${activa}</label></li>`;
    }).join('');
    cont.onclick = (ev) => {
        const input = ev.target.closest('input[data-geo-ciudad]');
        if (!input) return;
        const ine = input.dataset.geoCiudad;
        const reg = geoReg(ine);
        geoAlternarPendiente('ciudad', ine, reg && reg.info.nombre, reg);
    };
}

function geoReg(ine) { return geoEstado.cargadas.get(String(ine)); }

function geoRenderDistritos() {
    const cont = document.getElementById('geo-lista-distritos');
    if (!cont) return;
    const r = geoEstado.activa ? geoReg(geoEstado.activa) : null;
    if (!r || !r.distritos.length) { cont.innerHTML = '<li style="color:#a1a1aa;">—</li>'; return; }
    cont.innerHTML = r.distritos.map(d => {
        const id = `${r.info.ine}-${d.codigo}`;
        const on = geoEstado.pendientes.has(`distrito:${id}`) ? ' checked' : '';
        return `<li><label><input type="checkbox" data-geo-dist="${geoEsc(d.codigo)}"${on}>
            <span class="geo-barra-color" style="background:${geoEsc(d._color)}"></span> ${geoEsc(d.nombre)}</label></li>`;
    }).join('');
    cont.onclick = (ev) => {
        const input = ev.target.closest('input[data-geo-dist]');
        if (!input) return;
        const d = r.distritos.find(x => String(x.codigo) === String(input.dataset.geoDist));
        const id = `${r.info.ine}-${d.codigo}`;
        geoAlternarPendiente('distrito', id, d.nombre, r, d);
    };
}

function geoRenderBarrios() {
    const cont = document.getElementById('geo-lista-barrios');
    if (!cont) return;
    const r = geoEstado.activa ? geoReg(geoEstado.activa) : null;
    if (!r || !r.barrios.length) { cont.innerHTML = '<li style="color:#a1a1aa;">—</li>'; return; }
    const porDistrito = new Map();
    r.barrios.forEach(b => {
        const k = String(b.distrito_codigo);
        if (!porDistrito.has(k)) porDistrito.set(k, []);
        porDistrito.get(k).push(b);
    });
    let html = '';
    for (const [k, lista] of porDistrito) {
        const nombreDist = (r.distritos.find(d => String(d.codigo) === k) || {}).nombre || k;
        html += `<li style="margin-top:6px;color:#fde68a;font-size:.8rem;">${geoEsc(nombreDist)}</li>`;
        html += lista.map(b => {
            const id = `${r.info.ine}-${b.distrito_codigo}-${b.codigo}`;
            const on = geoEstado.pendientes.has(`barrio:${id}`) ? ' checked' : '';
            return `<li><label><input type="checkbox" data-geo-barr="${geoEsc(b.codigo)}" data-geo-dist="${geoEsc(b.distrito_codigo)}"${on}>
                <span class="geo-barra-color" style="background:${geoEsc(b._color)}"></span> ${geoEsc(b.nombre)}</label></li>`;
        }).join('');
    }
    cont.innerHTML = html;
    cont.onclick = (ev) => {
        const input = ev.target.closest('input[data-geo-barr]');
        if (!input) return;
        const b = r.barrios.find(x => String(x.codigo) === String(input.dataset.geoBarr) &&
            String(x.distrito_codigo) === String(input.dataset.geoDist));
        const id = `${r.info.ine}-${b.distrito_codigo}-${b.codigo}`;
        geoAlternarPendiente('barrio', id, b.nombre, r, b);
    };
}

function geoRenderCps() {
    const cont = document.getElementById('geo-lista-cp');
    if (!cont) return;
    const r = geoEstado.activa ? geoReg(geoEstado.activa) : null;
    if (!r || !r.cps.length) { cont.innerHTML = '<li style="color:#a1a1aa;">—</li>'; return; }
    cont.innerHTML = r.cps.map(c => {
        const cp = c.codigo || c;
        const id = `${r.info.ine}-${cp}`;
        const on = geoEstado.pendientes.has(`cp:${id}`) ? ' checked' : '';
        return `<li><label><input type="checkbox" data-geo-cp="${geoEsc(cp)}"${on}> 📮 ${geoEsc(cp)}</label></li>`;
    }).join('');
    cont.onclick = (ev) => {
        const input = ev.target.closest('input[data-geo-cp]');
        if (!input) return;
        const cp = input.dataset.geoCp;
        const id = `${r.info.ine}-${cp}`;
        geoAlternarPendiente('cp', id, cp, r);
    };
}

function geoColorEntidad(tipo, entidad) {
    if ((tipo === 'distrito' || tipo === 'barrio') && entidad) return entidad._color || '#d4af37';
    return '#d4af37';
}

function geoMarcarPendiente(tipo, id, nombre, r, entidad) {
    geoEstado.pendientes.set(`${tipo}:${id}`, {
        tipo, id, nombre: nombre || id, color: geoColorEntidad(tipo, entidad),
        ciudad: r ? r.info.ine : null,
        ciudadNombre: r ? r.info.nombre : null
    });
}

function geoAlternarPendiente(tipo, id, nombre, r, entidad) {
    const key = `${tipo}:${id}`;
    if (geoEstado.pendientes.has(key)) geoEstado.pendientes.delete(key);
    else geoMarcarPendiente(tipo, id, nombre, r, entidad);
    geoRefrescarCheckboxes();
    geoActualizarEstadoPendientes();
}

function geoAnadirSeleccionados() {
    if (!geoEstado.pendientes.size) {
        geoAvisoGeo('No hay nada marcado. Marca municipios, distritos, barrios o códigos postales y vuelve a pulsar.');
        return;
    }
    let nuevos = 0;
    for (const [key, valor] of geoEstado.pendientes) {
        if (!geoEstado.seleccion.has(key)) { geoEstado.seleccion.set(key, valor); nuevos += 1; }
    }
    geoEstado.pendientes.clear();
    geoRefrescarCheckboxes();
    geoRenderSeleccion();
    geoActualizarEstadoPendientes();
    geoAvisoGeo(`Añadidos ${nuevos} elemento(s) a la selección. Total: ${geoEstado.seleccion.size}.`);
    if (typeof geoPuzzleSincronizarDesdeSeleccion === 'function') geoPuzzleSincronizarDesdeSeleccion();
}

function geoBorrarSeleccion() {
    geoEstado.seleccion.clear();
    geoEstado.pendientes.clear();
    geoRefrescarCheckboxes();
    geoRenderSeleccion();
    geoActualizarEstadoPendientes();
    geoAvisoGeo('Selección borrada.');
    if (typeof geoPuzzleSincronizarDesdeSeleccion === 'function') geoPuzzleSincronizarDesdeSeleccion();
}

function geoAvisoGeo(texto) {
    const estado = document.getElementById('geo-estado');
    if (estado) estado.textContent = texto;
}

function geoAlternarDesdeMapa(tipo, codigo, ine) {
    const r = (ine && geoReg(ine)) || (geoEstado.activa ? geoReg(geoEstado.activa) : null);
    if (!r || codigo === '' || codigo == null) return;
    if (tipo === 'barrio') {
        const b = r.barrios.find(x => String(x.codigo) === String(codigo));
        if (!b) return;
        geoAlternarPendiente('barrio', `${r.info.ine}-${b.distrito_codigo}-${b.codigo}`, b.nombre, r, b);
    } else if (tipo === 'distrito') {
        const d = r.distritos.find(x => String(x.codigo) === String(codigo));
        if (!d) return;
        geoAlternarPendiente('distrito', `${r.info.ine}-${d.codigo}`, d.nombre, r, d);
    } else if (tipo === 'ciudad') {
        geoAlternarPendiente('ciudad', r.info.ine, r.info.nombre, r);
    }
}

function geoRefrescarCheckboxes() {
    geoRenderCiudadesCargadas();
    geoRenderDistritos();
    geoRenderBarrios();
    geoRenderCps();
}

function geoQuitarSeleccion(key) {
    geoEstado.seleccion.delete(key);
    geoRefrescarCheckboxes();
    geoRenderSeleccion();
    geoActualizarEstadoPendientes();
    if (typeof geoPuzzleSincronizarDesdeSeleccion === 'function') geoPuzzleSincronizarDesdeSeleccion();
}

function geoActualizarEstadoPendientes() {
    const cont = document.getElementById('geo-pendientes-info');
    if (!cont) return;
    const marcados = geoEstado.pendientes.size;
    const total = geoEstado.seleccion.size;
    const partes = [`${total} en selección`];
    if (marcados) partes.push(`${marcados} marcado(s) sin añadir`);
    cont.textContent = partes.join(' · ');
}

function geoRenderSeleccion() {
    const cont = document.getElementById('geo-seleccion');
    if (!cont) return;
    if (!geoEstado.seleccion.size) {
        cont.innerHTML = '<span style="color:#a1a1aa;">Sin selección. Marca elementos y pulsa «Añadir seleccionados».</span>';
        return;
    }
    cont.innerHTML = [...geoEstado.seleccion.values()].map(s => {
        const etiqueta = s.tipo === 'cp' ? `📮 ${geoEsc(s.nombre)}` :
            `${geoEsc(s.nombre)} <em style="opacity:.7;">(${geoEsc(s.ciudadNombre || geoNombreProvincia(s.ciudad) || '')})</em>`;
        return `<span class="geo-ficha">
            <span class="geo-barra-color" style="background:${geoEsc(s.color)}"></span>
            ${etiqueta} <button type="button" data-geo-quitar="${geoEsc(s.tipo + ':' + s.id)}" aria-label="Quitar">×</button>
        </span>`;
    }).join('');
    cont.onclick = (ev) => {
        const btn = ev.target.closest('button[data-geo-quitar]');
        if (btn) geoQuitarSeleccion(btn.dataset.geoQuitar);
    };
}

function geoActualizarAtribucion() {
    const cont = document.getElementById('geo-atribucion');
    if (!cont) return;
    const partes = ['Municipios y CP: INE', 'Límites: IGN/CNIG (CC-BY 4.0)'];
    if (geoReg('08019')) partes.push('Barcelona: Open Data BCN (CC-BY 4.0)');
    if (geoReg('48020')) partes.push('Bilbao: Ayto. de Bilbao (CC-BY 3.0)');
    cont.textContent = 'Fuentes: ' + partes.join(' · ');
}

function geoLimpiar() {
    geoEstado.seleccion.clear();
    geoEstado.pendientes.clear();
    geoEstado.cargadas.clear();
    if (geoEstado.mapa) geoEstado.mapa.eachLayer(layer => {
        if (layer instanceof L.TileLayer) return;
        geoEstado.mapa.removeLayer(layer);
    });
    geoEstado.activa = null;
    geoRefrescarSegunActiva();
    geoAvisoGeo('Selección limpiada.');
}

/* ============================================================================
 * LOKITRONO — PUZZLE DE UBICACIONES PARTICIPANTES
 * Cada pieza se recorta del mapa y se integra en un puzzle ligado a un evento.
 * Al guardarlo se crean las ubicaciones (casas) y el sorteo reparte las piezas.
 * ========================================================================== */
const geoPuzzleEstado = { eventoId: '', piezas: [], cargado: false };
let geoPuzzleMapa = null;
let geoPuzzleCapa = null;

function geoPuzzleClave(p) { return `${p.tipo}:${p.ref_id}`; }

function geoSeleccionAPieza(s) {
    const id = String(s.id || '');
    const ine = (s.ciudad ? String(s.ciudad) : id.slice(0, 5));
    const pieza = {
        tipo: s.tipo, ref_id: id, nombre: s.nombre || id,
        ciudad_id: ine || null, distrito_id: null, barrio_id: null, codigo_postal: null,
        color: s.color || '#d4af37', posicion: null, casa_id: null
    };
    if (s.tipo === 'distrito') {
        pieza.distrito_id = id;
    } else if (s.tipo === 'barrio') {
        pieza.distrito_id = id.split('-').slice(0, 2).join('-');
        pieza.barrio_id = id;
    } else if (s.tipo === 'cp') {
        pieza.codigo_postal = id.split('-')[1] || '';
    }
    return pieza;
}

function geoPuzzleAnadirSeleccion() {
    if (!geoEstado.seleccion.size) {
        geoAvisoGeo('La selección está vacía. Marca elementos y pulsa «Añadir seleccionados» primero.');
        return;
    }
    let nuevos = 0;
    for (const s of geoEstado.seleccion.values()) {
        const p = geoSeleccionAPieza(s);
        if (!geoPuzzleEstado.piezas.some(x => geoPuzzleClave(x) === geoPuzzleClave(p))) {
            geoPuzzleEstado.piezas.push(p);
            nuevos += 1;
        }
    }
    geoPuzzleRender();
    geoPuzzleEstadoAviso(`Añadidas ${nuevos} pieza(s) al puzzle. Total: ${geoPuzzleEstado.piezas.length}.`);
}

function geoPuzzleQuitar(refKey) {
    geoPuzzleEstado.piezas = geoPuzzleEstado.piezas.filter(x => geoPuzzleClave(x) !== refKey);
    geoPuzzleRender();
}

function geoPuzzleLimpiar() {
    geoPuzzleEstado.piezas = [];
    geoPuzzleRender();
    geoPuzzleEstadoAviso('Puzzle vaciado (recuerda guardarlo para aplicar los cambios).');
}

function geoPuzzleEstadoAviso(texto) {
    const cont = document.getElementById('geo-puzzle-estado');
    if (cont) cont.textContent = texto;
}

function geoPuzzleRender() {
    geoPuzzleRenderOrden();
    geoPuzzleRenderMapa();
    const total = geoPuzzleEstado.piezas.length;
    const conPos = geoPuzzleEstado.piezas.filter(p => p.posicion != null).length;
    const info = document.getElementById('geo-puzzle-estado');
    if (info && total) {
        info.textContent = `${total} pieza(s) en el puzzle${conPos ? ` · ${conPos} con posición sorteada` : ''}.`;
    }
}

function geoPuzzleRenderOrden() {
    const cont = document.getElementById('geo-puzzle-orden');
    if (!cont) return;
    if (!geoPuzzleEstado.piezas.length) {
        cont.innerHTML = '<li style="color:#a1a1aa;">El puzzle está vacío. Añade una selección y guárdala.</li>';
        return;
    }
    const ordenadas = [...geoPuzzleEstado.piezas].sort((a, b) => {
        const pa = a.posicion == null ? 1e9 : a.posicion;
        const pb = b.posicion == null ? 1e9 : b.posicion;
        return pa - pb;
    });
    cont.innerHTML = ordenadas.map((p, i) => {
        const pos = p.posicion == null ? (i + 1) : p.posicion;
        const tipo = p.tipo === 'cp' ? `📮 ${geoEsc(p.codigo_postal || '')}` : geoEsc(p.tipo);
        const ubic = geoEsc(p.ciudad_id || '');
        const ficha = geoFichaMiniatura({ nombre: p.nombre, color: p.color, emblema: p.tipo === 'cp' ? '📮' : '🧩' });
        return `<li>
            <span class="geo-pos">${pos}</span>
            <img src="${ficha}" alt="" width="40" height="40" style="border-radius:8px;flex:none;">
            <span class="geo-barra-color" style="background:${geoEsc(p.color || '#d4af37')}"></span>
            <strong>${geoEsc(p.nombre)}</strong>
            <em style="opacity:.7;font-size:.8rem;">${tipo}${ubic ? ' · ' + ubic : ''}</em>
            <button type="button" data-geo-puzzle-quitar="${geoEsc(geoPuzzleClave(p))}" aria-label="Quitar pieza"
                style="background:none;border:none;color:#fca5a5;cursor:pointer;font-size:1rem;margin-left:auto;">×</button>
        </li>`;
    }).join('');
    cont.onclick = (ev) => {
        const btn = ev.target.closest('button[data-geo-puzzle-quitar]');
        if (btn) geoPuzzleQuitar(btn.dataset.geoPuzzleQuitar);
    };
}

function geoPuzzleActivarMapa() {
    if (geoPuzzleMapa) return geoPuzzleMapa;
    const cont = document.getElementById('geo-puzzle-mapa');
    if (!cont || !window.L) return null;
    geoPuzzleMapa = L.map(cont, { scrollWheelZoom: true }).setView([40.4168, -3.7038], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, attribution: '&copy; OpenStreetMap'
    }).addTo(geoPuzzleMapa);
    geoPuzzleCapa = L.layerGroup().addTo(geoPuzzleMapa);
    return geoPuzzleMapa;
}

async function geoPuzzleRenderMapa() {
    if (geoPuzzleEstado.piezas.length) geoPuzzleActivarMapa();
    if (!geoPuzzleMapa || !geoPuzzleCapa) return;
    geoPuzzleCapa.clearLayers();
    const capas = [];
    for (const p of geoPuzzleEstado.piezas) {
        await geoPuzzlePintarPieza(p, capas);
    }
    if (capas.length) {
        try {
            const bounds = L.featureGroup(capas).getBounds();
            if (bounds.isValid()) geoPuzzleMapa.fitBounds(bounds, { padding: [24, 24] });
        } catch (e) { /* ignore */ }
    }
}

async function geoPuzzlePintarPieza(pieza, capas) {
    const manifest = pieza.ciudad_id ? geoEstado.porIne.get(String(pieza.ciudad_id)) : null;
    let ruta = null;
    let filtro = null;

    if (pieza.tipo === 'ciudad') {
        ruta = manifest && manifest.geom;
    } else if (pieza.tipo === 'distrito') {
        ruta = manifest && manifest.distritos;
        filtro = { campo: ['DISTRICTE', 'codigo'], valor: String(pieza.distrito_id || '').split('-')[1] };
    } else if (pieza.tipo === 'barrio') {
        ruta = manifest && manifest.barrios;
        filtro = { campo: ['BARRI', 'codigo'], valor: String(pieza.barrio_id || '').split('-').slice(-1)[0] };
    }

    if (ruta) {
        try {
            const gj = await (await fetch(ruta, { cache: 'force-cache' })).json();
            let features = gj.features || [];
            if (filtro) {
                features = features.filter(f => {
                    const props = f.properties || {};
                    return filtro.campo.some(campo => String(props[campo]) === String(filtro.valor));
                });
            }
            if (features.length) {
                const capa = L.geoJSON({ type: 'FeatureCollection', features }, {
                    style: () => ({ color: '#fde68a', weight: 2, fillColor: pieza.color || '#d4af37', fillOpacity: 0.6 }),
                    onEachFeature: (f, layer) => layer.bindTooltip(geoEsc(pieza.nombre), { sticky: true })
                }).addTo(geoPuzzleCapa);
                capas.push(capa);
                return;
            }
        } catch (error) { /* sin geometría */ }
    }

    const centro = manifest && Array.isArray(manifest.centro) ? manifest.centro : null;
    if (centro && centro[0] != null && centro[1] != null) {
        const marcador = L.circleMarker([centro[0], centro[1]], {
            radius: 9, color: '#fde68a', weight: 2,
            fillColor: pieza.color || '#d4af37', fillOpacity: 0.85
        }).addTo(geoPuzzleCapa);
        marcador.bindTooltip(geoEsc(pieza.nombre), { sticky: true });
        capas.push(marcador);
    }
}

function geoPuzzleEventos() {
    const cache = (typeof eventosSupabaseCache !== 'undefined' && Array.isArray(eventosSupabaseCache))
        ? eventosSupabaseCache : [];
    return cache.filter(e => e && !e.eliminado);
}

function geoPuzzleRenderEventos() {
    const sel = document.getElementById('geo-puzzle-evento');
    if (!sel) return;
    const eventos = geoPuzzleEventos();
    const previo = sel.value || geoPuzzleEstado.eventoId;
    sel.innerHTML = '<option value="">— Elige un evento —</option>' +
        eventos.map(e => {
            const etiqueta = `${e.nombre || e.id}${e.barrio ? ' · ' + e.barrio : ''}${e.fecha ? ' · ' + e.fecha : ''}`;
            return `<option value="${geoEsc(e.id)}">${geoEsc(etiqueta)}</option>`;
        }).join('');
    if (previo && eventos.some(e => String(e.id) === String(previo))) sel.value = previo;
}

async function geoPuzzleCargar(eventoId) {
    geoPuzzleEstado.eventoId = eventoId || '';
    if (!eventoId) { geoPuzzleEstado.piezas = []; geoPuzzleEstado.cargado = false; geoPuzzleRender(); return; }
    const client = getSupabaseBarriosClient();
    if (!client) { geoPuzzleEstadoAviso('Supabase no disponible.'); return; }
    try {
        const { data, error } = await client.from('piezas_puzzle')
            .select('id, tipo, ref_id, nombre, ciudad_id, distrito_id, barrio_id, codigo_postal, color, posicion, casa_id')
            .eq('evento_id', eventoId)
            .order('posicion', { ascending: true, nullsFirst: false });
        if (error) throw error;
        geoPuzzleEstado.piezas = (data || []).map(p => ({ ...p, posicion: p.posicion == null ? null : Number(p.posicion) }));
        geoPuzzleEstado.cargado = true;
        geoPuzzleRender();
        geoPuzzleEstadoAviso(geoPuzzleEstado.piezas.length
            ? `Puzzle del evento cargado: ${geoPuzzleEstado.piezas.length} pieza(s).`
            : 'Ese evento aún no tiene piezas guardadas.');
    } catch (error) {
        console.error('Error al cargar el puzzle:', error);
        geoPuzzleEstadoAviso(`No se pudo cargar el puzzle: ${error.message || 'error desconocido'}`);
    }
}

async function geoPuzzleGuardar() {
    const usuario = getCurrentUser();
    const client = getSupabaseBarriosClient();
    if (!usuario || !puedeAdministrar(usuario.role)) { alert('Solo un superadministrador puede guardar el puzzle.'); return; }
    if (!client) { geoPuzzleEstadoAviso('Supabase no disponible.'); return; }
    const sel = document.getElementById('geo-puzzle-evento');
    const eventoId = sel ? sel.value : geoPuzzleEstado.eventoId;
    if (!eventoId) { alert('Elige el evento al que pertenece el puzzle.'); return; }
    if (!geoPuzzleEstado.piezas.length) { alert('El puzzle está vacío. Añade una selección al puzzle.'); return; }

    const pin = window.prompt('Introduce tu PIN de administración para guardar el puzzle:');
    if (pin === null) return;
    if (!/^\d{6}$/.test(pin.trim())) { alert('El PIN debe contener exactamente seis dígitos.'); return; }
    if (!window.confirm(`Se guardarán ${geoPuzzleEstado.piezas.length} pieza(s) y se crearán/reutilizarán sus ubicaciones participantes. ¿Continuar?`)) return;

    geoPuzzleEstadoAviso('Guardando puzzle…');
    try {
        const piezas = geoPuzzleEstado.piezas.map(p => ({
            tipo: p.tipo, ref_id: p.ref_id, nombre: p.nombre,
            ciudad_id: p.ciudad_id, distrito_id: p.distrito_id,
            barrio_id: p.barrio_id, codigo_postal: p.codigo_postal, color: p.color
        }));
        const { data, error } = await client.rpc('guardar_piezas_puzzle_superadmin', {
            p_phone: String(usuario.phone || ''),
            p_pin: pin.trim(),
            p_evento_id: String(eventoId),
            p_piezas: piezas
        });
        if (error) throw error;
        await geoPuzzleCargar(eventoId);
        geoPuzzleEstadoAviso(`Puzzle guardado: ${Number(data) || 0} pieza(s).`);
    } catch (error) {
        console.error('Error al guardar el puzzle:', error);
        geoPuzzleEstadoAviso(`No se pudo guardar el puzzle: ${error.message || 'error desconocido'}`);
    }
}

async function geoPuzzleSortear() {
    const usuario = getCurrentUser();
    const client = getSupabaseBarriosClient();
    if (!usuario || !puedeAdministrar(usuario.role)) { alert('Solo un superadministrador puede sortear las piezas.'); return; }
    if (!client) { geoPuzzleEstadoAviso('Supabase no disponible.'); return; }
    const sel = document.getElementById('geo-puzzle-evento');
    const eventoId = sel ? sel.value : geoPuzzleEstado.eventoId;
    if (!eventoId) { alert('Elige el evento del puzzle.'); return; }

    const pin = window.prompt('Introduce tu PIN de administración para sortear las piezas:');
    if (pin === null) return;
    if (!/^\d{6}$/.test(pin.trim())) { alert('El PIN debe contener exactamente seis dígitos.'); return; }
    if (!window.confirm('Se repartirán aleatoriamente las piezas del puzzle de este evento. ¿Continuar?')) return;

    geoPuzzleEstadoAviso('Sorteando piezas…');
    try {
        const { data, error } = await client.rpc('sortear_piezas_puzzle_superadmin', {
            p_phone: String(usuario.phone || ''),
            p_pin: pin.trim(),
            p_evento_id: String(eventoId)
        });
        if (error) throw error;
        await geoPuzzleCargar(eventoId);
        geoPuzzleEstadoAviso(`Sorteo guardado: ${Number(data) || 0} pieza(s) repartidas.`);
    } catch (error) {
        console.error('Error al sortear las piezas:', error);
        geoPuzzleEstadoAviso(`No se pudo sortear: ${error.message || 'error desconocido'}`);
    }
}

function geoPuzzleSincronizarDesdeSeleccion() {
    // La selección se incorpora al puzzle de forma explícita con «Añadir selección al puzzle».
}

async function geoCargarCiudadSeleccionada() {
    const sel = document.getElementById('geo-select-ciudad');
    const ine = sel ? sel.value : '';
    if (!ine) { geoAvisoGeo('Elige un municipio (ciudad o pueblo) para cargarlo en el mapa.'); return; }
    await geoCargarCiudad(ine);
}

async function geoCargarCpsDeCiudad(ine) {
    const sel = document.getElementById('geo-select-cp');
    if (!sel) return;
    if (!ine) { sel.innerHTML = '<option value="">— Elige un municipio primero —</option>'; return; }
    sel.innerHTML = '<option value="">Cargando…</option>';
    const client = getSupabaseBarriosClient();
    if (!client) { sel.innerHTML = '<option value="">— Sin conexión —</option>'; return; }
    try {
        const { data, error } = await client.from('codigo_postal_ciudad')
            .select('codigo_postal').eq('ciudad_id', ine).order('codigo_postal');
        if (error) throw error;
        const cps = [...new Set((data || []).map(r => r.codigo_postal))];
        sel.innerHTML = '<option value="">Todos los códigos postales</option>' +
            cps.map(cp => `<option value="${geoEsc(cp)}">${geoEsc(cp)}</option>`).join('');
    } catch (error) {
        sel.innerHTML = '<option value="">— Error al cargar CP —</option>';
    }
}

async function geoSeleccionarCp(ine, cp) {
    if (!ine || !cp) return;
    await geoCargarCiudad(ine);
    const r = geoReg(ine);
    geoMarcarPendiente('cp', `${ine}-${cp}`, cp, r);
    geoRefrescarCheckboxes();
    geoActualizarEstadoPendientes();
    geoAvisoGeo(`Código postal ${cp} marcado. Pulsa «Añadir seleccionados».`);
}

function geoAplicarPreset(ccaaId) {
    const selCcaa = document.getElementById('geo-select-ccaa');
    if (!selCcaa) return;
    selCcaa.value = ccaaId;
    geoRenderSelectProvincias();
    geoRenderSelectCiudades();
    geoCargarCpsDeCiudad('');
    geoAvisoGeo(`Filtro aplicado: ${geoNombreComunidad(ccaaId) || ccaaId}.`);
}

function geoInicializar() {
    const panel = document.getElementById('panel-geografia');
    if (!panel || panel.dataset.geoInit === '1') return;
    panel.dataset.geoInit = '1';

    const selCcaa = document.getElementById('geo-select-ccaa');
    const selProv = document.getElementById('geo-select-provincia');
    const selCiudad = document.getElementById('geo-select-ciudad');
    const selCp = document.getElementById('geo-select-cp');
    const chkCap = document.getElementById('geo-solo-capitales');
    const btnCargar = document.getElementById('geo-btn-cargar-ciudad');
    const btnAnadir = document.getElementById('geo-btn-anadir-seleccionados');
    const btnBorrar = document.getElementById('geo-btn-borrar-seleccion');
    const selEvento = document.getElementById('geo-puzzle-evento');

    if (selCcaa) selCcaa.addEventListener('change', () => {
        geoRenderSelectProvincias();
        geoRenderSelectCiudades();
        geoCargarCpsDeCiudad('');
    });
    if (selProv) selProv.addEventListener('change', () => {
        geoRenderSelectCiudades();
        geoCargarCpsDeCiudad('');
    });
    if (chkCap) chkCap.addEventListener('change', geoRenderSelectCiudades);
    if (selCiudad) selCiudad.addEventListener('change', () => geoCargarCpsDeCiudad(selCiudad.value));
    if (selCp) selCp.addEventListener('change', () => {
        const ine = selCiudad ? selCiudad.value : '';
        geoSeleccionarCp(ine, selCp.value);
    });
    if (btnCargar) btnCargar.addEventListener('click', geoCargarCiudadSeleccionada);
    if (btnAnadir) btnAnadir.addEventListener('click', geoAnadirSeleccionados);
    if (btnBorrar) btnBorrar.addEventListener('click', geoBorrarSeleccion);

    panel.querySelectorAll('[data-geo-ccaa]').forEach(b =>
        b.addEventListener('click', () => geoAplicarPreset(b.dataset.geoCcaa)));

    const btnPzAnadir = document.getElementById('geo-btn-puzzle-anadir');
    const btnPzGuardar = document.getElementById('geo-btn-puzzle-guardar');
    const btnPzSortear = document.getElementById('geo-btn-puzzle-sortear');
    const btnPzLimpiar = document.getElementById('geo-btn-puzzle-limpiar');
    if (btnPzAnadir) btnPzAnadir.addEventListener('click', geoPuzzleAnadirSeleccion);
    if (btnPzGuardar) btnPzGuardar.addEventListener('click', geoPuzzleGuardar);
    if (btnPzSortear) btnPzSortear.addEventListener('click', geoPuzzleSortear);
    if (btnPzLimpiar) btnPzLimpiar.addEventListener('click', geoPuzzleLimpiar);
    if (selEvento) {
        selEvento.addEventListener('focus', geoPuzzleRenderEventos);
        selEvento.addEventListener('change', () => geoPuzzleCargar(selEvento.value));
    }

    geoCargarCatalogo();
    if (typeof barrioGeoRefrescar === 'function') barrioGeoRefrescar();
    geoPuzzleRenderEventos();
    geoPuzzleRender();
    geoRefrescarSegunActiva();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', geoInicializar);
} else {
    geoInicializar();
}

window.geoInicializar = geoInicializar;
window.geoCargarCiudad = geoCargarCiudad;
window.geoLimpiar = geoLimpiar;
window.geoAnadirSeleccionados = geoAnadirSeleccionados;
window.geoBorrarSeleccion = geoBorrarSeleccion;
window.geoPuzzleCargar = geoPuzzleCargar;
window.geoPuzzleGuardar = geoPuzzleGuardar;
window.geoPuzzleSortear = geoPuzzleSortear;
window.geoPuzzleRenderEventos = geoPuzzleRenderEventos;
window.geoEstado = geoEstado;
window.geoPuzzleEstado = geoPuzzleEstado;

/* ============================================================================
 * LOKITRONO — LOCALES PROMOCIONADOS (sección privada del ADMINISTRACIÓN)
 * Promoción de los locales donde se celebran los eventos: nombre, dirección,
 * redes sociales, foto, cuenta atrás (fecha/hora propias del evento en el
 * local) y sello de donación confirmada para el mantenimiento del portal.
 * Solo el Administración (rol master) consulta y gestiona la sección.
 * ========================================================================== */
const localesPromocionEstado = { locales: [], tickActivo: false, cargando: false };

async function cargarLocalesPromocion() {
    const usuario = getCurrentUser();
    const client = getSupabaseBarriosClient();
    const estado = document.getElementById('locales-estado');
    if (!usuario || !esRolMaster(usuario.role)) return;
    if (!client) {
        if (estado) estado.textContent = 'Supabase no disponible.';
        return;
    }
    if (localesPromocionEstado.cargando) return;
    localesPromocionEstado.cargando = true;
    if (estado) estado.textContent = 'Cargando locales…';
    try {
        const { data, error } = await client.rpc('listar_locales_promocion_token', {
            p_token: usuario.token
        });
        if (error) throw error;
        localesPromocionEstado.locales = Array.isArray(data) ? data : [];
        renderLocalesPromocion();
        if (estado) estado.textContent = `${localesPromocionEstado.locales.length} local(es) registrado(s).`;
    } catch (error) {
        console.error('Error al listar los locales promocionados:', error);
        if (estado) estado.textContent = `No se pudieron cargar los locales: ${error.message || 'error desconocido'}`;
    } finally {
        localesPromocionEstado.cargando = false;
    }
}

function localTraducirRed(red) {
    const url = red && red.url ? red.url : '';
    const nombre = (red && red.nombre ? red.nombre : '') || String(url).replace(/^https?:\/\/(www\.)?/i, '');
    return { nombre, url };
}

function localCuentaAtras(fecha, hora) {
    if (!fecha) return null;
    const objetivo = new Date(`${fecha}T${hora || '20:00'}:00`);
    const ms = objetivo.getTime() - Date.now();
    if (ms <= 0) return { celebrado: true, texto: '⚔️ Evento ya celebrado', ms: 0 };
    const dias = Math.floor(ms / 86400000);
    const horas = Math.floor((ms % 86400000) / 3600000);
    const minutos = Math.floor((ms % 3600000) / 60000);
    const segundos = Math.floor((ms % 60000) / 1000);
    return {
        celebrado: false, ms,
        texto: `${String(dias).padStart(2, '0')} d : ${String(horas).padStart(2, '0')} h : ${String(minutos).padStart(2, '0')} m : ${String(segundos).padStart(2, '0')} s`
    };
}

function renderLocalesPromocion() {
    const cont = document.getElementById('grid-locales-promocion');
    if (!cont) return;
    if (!localesPromocionEstado.locales.length) {
        cont.innerHTML = '<p class="local-preview-vacia">Aún no hay locales promocionados. Crea el primero con el formulario.</p>';
        return;
    }
    const mapa = new Map(localesPromocionEstado.locales.map(l => [String(l.id), l]));
    cont.innerHTML = localesPromocionEstado.locales.map(local => {
        const redes = (Array.isArray(local.redes) ? local.redes : [])
            .map(localTraducirRed)
            .filter(r => r.url)
            .map(r => `<a class="local-red-link" href="${geoEsc(r.url)}" target="_blank" rel="noopener">${geoEsc(r.nombre || r.url)}</a>`)
            .join('');
        const cd = localCuentaAtras(local.fecha_evento, local.hora_evento);
        const cdHtml = cd
            ? `<div class="local-cuenta-atras${cd.celebrado ? ' celebrado' : ''}" data-locales-cd="${geoEsc(String(local.id))}">${cd.celebrado ? cd.texto : '⏳ ' + cd.texto}</div>`
            : '<div class="local-cuenta-atras celebrado">Sin evento programado</div>';
        const foto = local.foto_url
            ? `<img class="local-foto" src="${geoEsc(local.foto_url)}" alt="${geoEsc(local.nombre)}" loading="lazy">`
            : '<div class="local-foto-placeholder">🍺</div>';
        const badge = local.donacion_confirmada
            ? '<span class="local-badge portada">💰 Donación OK</span>'
            : '<span class="local-badge espera">⏳ Pendiente de donación</span>';
        return `<article class="local-card${local.donacion_confirmada ? ' donado' : ''}${local.activo === false ? ' inactivo' : ''}" style="position:relative;">
            ${foto}${badge}
            <div class="local-cuerpo">
                <h4>${geoEsc(local.nombre)}</h4>
                ${local.direccion ? `<div class="local-direccion">📍 ${geoEsc(local.direccion)}</div>` : ''}
                ${redes ? `<div class="local-redes">${redes}</div>` : ''}
                ${cdHtml}
                <div class="local-acciones">
                    <button type="button" class="btn-cuervo" data-local-editar="${geoEsc(String(local.id))}">✏️ Editar</button>
                    <button type="button" class="btn-cuervo" data-local-donacion="${geoEsc(String(local.id))}" style="background:#713f12;">${local.donacion_confirmada ? '🚫 Quitar donación' : '💰 Confirmar donación'}</button>
                </div>
            </div>
        </article>`;
    }).join('');

    cont.onclick = (ev) => {
        const btnEditar = ev.target.closest('button[data-local-editar]');
        if (btnEditar) {
            const loc = mapa.get(btnEditar.dataset.localEditar);
            if (loc) cargarLocalEnFormulario(loc);
            return;
        }
        const btnDon = ev.target.closest('button[data-local-donacion]');
        if (btnDon) {
            const loc = mapa.get(btnDon.dataset.localDonacion);
            if (loc) marcarDonacionLocal(String(loc.id), !loc.donacion_confirmada);
        }
    };

    iniciarTickLocales();
}

function lokitronoTickLocales() {
    const mapa = new Map(localesPromocionEstado.locales.map(l => [String(l.id), l]));
    document.querySelectorAll('[data-locales-cd]').forEach(nodo => {
        const loc = mapa.get(nodo.dataset.localesCd);
        if (!loc) return;
        const cd = localCuentaAtras(loc.fecha_evento, loc.hora_evento);
        if (cd) nodo.textContent = cd.celebrado ? cd.texto : '⏳ ' + cd.texto;
    });
}

function iniciarTickLocales() {
    if (localesPromocionEstado.tickActivo) return;
    localesPromocionEstado.tickActivo = true;
    setInterval(lokitronoTickLocales, 1000);
}

function anadirFilaRed(nombre, url) {
    const cont = document.getElementById('local-redes-filas');
    if (!cont) return;
    const div = document.createElement('div');
    div.className = 'fila-red';
    div.innerHTML = `
        <input type="text" class="input-medieval" placeholder="Nombre (Instagram, Facebook, web…)" value="${geoEsc(nombre || '')}">
        <input type="text" class="input-medieval" placeholder="https://…" value="${geoEsc(url || '')}">
        <button type="button" class="fila-red-eliminar" aria-label="Quitar enlace">×</button>`;
    div.querySelector('.fila-red-eliminar').addEventListener('click', () => div.remove());
    cont.appendChild(div);
}

function recogerRedes() {
    const redes = [];
    document.querySelectorAll('#local-redes-filas .fila-red').forEach(fila => {
        const inputs = fila.querySelectorAll('input');
        const url = inputs[1].value.trim();
        if (url) redes.push({ nombre: inputs[0].value.trim(), url });
    });
    return redes;
}

function actualizarPreviewFoto() {
    const url = document.getElementById('local-foto-url').value.trim();
    const img = document.getElementById('local-foto-preview');
    if (!img) return;
    if (url) {
        img.src = url;
        img.style.display = 'block';
    } else {
        img.removeAttribute('src');
        img.style.display = 'none';
    }
}

function campoLocal(id) { return document.getElementById(id); }

function cargarLocalEnFormulario(local) {
    campoLocal('local-id').value = local.id || '';
    campoLocal('local-nombre').value = local.nombre || '';
    campoLocal('local-direccion').value = local.direccion || '';
    campoLocal('local-fecha-evento').value = local.fecha_evento || '';
    campoLocal('local-hora-evento').value = local.hora_evento || '';
    campoLocal('local-orden').value = local.orden == null ? 0 : local.orden;
    campoLocal('local-foto-url').value = local.foto_url || '';
    campoLocal('local-foto-file').value = '';
    campoLocal('local-donacion-confirmada').checked = !!local.donacion_confirmada;
    campoLocal('local-activo').checked = local.activo !== false;
    campoLocal('local-btn-eliminar').style.display = '';
    campoLocal('local-redes-filas').innerHTML = '';
    const redes = Array.isArray(local.redes) ? local.redes : [];
    redes.forEach(r => anadirFilaRed(r.nombre, r.url));
    if (!redes.length) anadirFilaRed('', '');
    actualizarPreviewFoto();
    const form = document.getElementById('form-local-promocion');
    if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function limpiarFormularioLocal() {
    campoLocal('local-id').value = '';
    campoLocal('local-nombre').value = '';
    campoLocal('local-direccion').value = '';
    campoLocal('local-fecha-evento').value = '';
    campoLocal('local-hora-evento').value = '';
    campoLocal('local-orden').value = 0;
    campoLocal('local-foto-url').value = '';
    campoLocal('local-foto-file').value = '';
    campoLocal('local-donacion-confirmada').checked = false;
    campoLocal('local-activo').checked = true;
    campoLocal('local-btn-eliminar').style.display = 'none';
    campoLocal('local-redes-filas').innerHTML = '';
    anadirFilaRed('', '');
    actualizarPreviewFoto();
}

async function subirFotoLocal(file) {
    const estado = document.getElementById('locales-estado');
    const client = getSupabaseBarriosClient();
    if (!client) {
        if (estado) estado.textContent = 'Supabase no disponible para subir la foto.';
        return;
    }
    if (!file) return;
    const nombre = `locales/${Date.now()}_${String(file.name).replace(/[^a-z0-9._-]/gi, '_')}`;
    try {
        const { error } = await client.storage.from('locales-promocion').upload(nombre, file, {
            upsert: true,
            cacheControl: '3600'
        });
        if (error) throw error;
        const { data } = client.storage.from('locales-promocion').getPublicUrl(nombre);
        const url = data && data.publicUrl ? data.publicUrl : '';
        campoLocal('local-foto-url').value = url;
        actualizarPreviewFoto();
        if (estado) estado.textContent = 'Foto subida. Revisa la vista previa y pulsa «Guardar local».';
    } catch (error) {
        console.error('Error al subir la foto del local:', error);
        if (estado) estado.textContent = `No se pudo subir la foto: ${error.message || 'error desconocido'}`;
    }
}

async function guardarLocalFormulario() {
    const usuario = getCurrentUser();
    const client = getSupabaseBarriosClient();
    const estado = document.getElementById('locales-estado');
    if (!usuario || !esRolMaster(usuario.role)) {
        alert('Solo el Administración puede gestionar los locales promocionados.');
        return;
    }
    if (!client) {
        if (estado) estado.textContent = 'Supabase no disponible.';
        return;
    }

    const nombre = campoLocal('local-nombre').value.trim();
    const fecha = campoLocal('local-fecha-evento').value;
    const hora = campoLocal('local-hora-evento').value;
    if (!nombre) { alert('El nombre del local es obligatorio.'); return; }
    if (!!fecha !== !!hora) {
        alert('La fecha y la hora del evento deben indicarse juntas.');
        return;
    }

    const pin = window.prompt('Introduce tu PIN de administración para guardar el local:');
    if (pin === null) return;
    if (!/^\d{6}$/.test(pin.trim())) { alert('El PIN debe contener exactamente seis dígitos.'); return; }

    const local = {
        nombre,
        direccion: campoLocal('local-direccion').value.trim(),
        redes: recogerRedes(),
        foto_url: campoLocal('local-foto-url').value.trim(),
        fecha_evento: fecha || null,
        hora_evento: hora || null,
        donacion_confirmada: campoLocal('local-donacion-confirmada').checked,
        activo: campoLocal('local-activo').checked,
        orden: Number(campoLocal('local-orden').value || 0) || 0
    };
    const id = campoLocal('local-id').value.trim();
    if (id) local.id = id;

    if (estado) estado.textContent = 'Guardando local…';
    try {
        const { error } = await client.rpc('guardar_local_promocion_master', {
            p_phone: String(usuario.phone || ''),
            p_pin: pin.trim(),
            p_local: local
        });
        if (error) throw error;
        await cargarLocalesPromocion();
        if (estado) estado.textContent = 'Local guardado.';
    } catch (error) {
        console.error('Error al guardar el local:', error);
        if (estado) estado.textContent = `No se pudo guardar el local: ${error.message || 'error desconocido'}`;
    }
}

async function eliminarLocalFormulario() {
    const id = campoLocal('local-id').value.trim();
    if (!id) return;
    if (!window.confirm('¿Eliminar este local promocionado definitivamente?')) return;

    const usuario = getCurrentUser();
    const client = getSupabaseBarriosClient();
    const estado = document.getElementById('locales-estado');
    if (!usuario || !esRolMaster(usuario.role) || !client) return;

    const pin = window.prompt('Introduce tu PIN de administración para eliminar el local:');
    if (pin === null) return;
    if (!/^\d{6}$/.test(pin.trim())) { alert('El PIN debe contener exactamente seis dígitos.'); return; }

    try {
        const { error } = await client.rpc('eliminar_local_promocion_master', {
            p_phone: String(usuario.phone || ''),
            p_pin: pin.trim(),
            p_local_id: id
        });
        if (error) throw error;
        limpiarFormularioLocal();
        await cargarLocalesPromocion();
        if (estado) estado.textContent = 'Local eliminado.';
    } catch (error) {
        console.error('Error al eliminar el local:', error);
        if (estado) estado.textContent = `No se pudo eliminar el local: ${error.message || 'error desconocido'}`;
    }
}

async function marcarDonacionLocal(id, confirmada) {
    const usuario = getCurrentUser();
    const client = getSupabaseBarriosClient();
    const estado = document.getElementById('locales-estado');
    if (!usuario || !esRolMaster(usuario.role) || !client) return;

    const mensaje = confirmada
        ? 'Registra la donación del local introduciendo tu PIN de administración:'
        : 'Retira la donación del local introduciendo tu PIN de administración:';
    const pin = window.prompt(mensaje);
    if (pin === null) return;
    if (!/^\d{6}$/.test(pin.trim())) { alert('El PIN debe contener exactamente seis dígitos.'); return; }

    try {
        const { error } = await client.rpc('marcar_donacion_local_master', {
            p_phone: String(usuario.phone || ''),
            p_pin: pin.trim(),
            p_local_id: id,
            p_confirmada: confirmada
        });
        if (error) throw error;
        await cargarLocalesPromocion();
        if (estado) estado.textContent = confirmada ? 'Donación del local confirmada.' : 'Donación retirada.';
    } catch (error) {
        console.error('Error al marcar la donación del local:', error);
        if (estado) estado.textContent = `No se pudo actualizar la donación: ${error.message || 'error desconocido'}`;
    }
}

function inicializarLocalesPromocion() {
    const form = document.getElementById('form-local-promocion');
    if (!form || form.dataset.localesInit === '1') return;
    form.dataset.localesInit = '1';

    form.addEventListener('submit', ev => { ev.preventDefault(); guardarLocalFormulario(); });

    const btnNuevo = document.getElementById('local-btn-nuevo');
    if (btnNuevo) btnNuevo.addEventListener('click', limpiarFormularioLocal);

    const btnEliminar = document.getElementById('local-btn-eliminar');
    if (btnEliminar) btnEliminar.addEventListener('click', eliminarLocalFormulario);

    const btnRed = document.getElementById('local-btn-anadir-red');
    if (btnRed) btnRed.addEventListener('click', () => anadirFilaRed('', ''));

    const inFoto = document.getElementById('local-foto-url');
    if (inFoto) inFoto.addEventListener('input', actualizarPreviewFoto);

    const fileFoto = document.getElementById('local-foto-file');
    if (fileFoto) fileFoto.addEventListener('change', () => subirFotoLocal(fileFoto.files && fileFoto.files[0]));

    limpiarFormularioLocal();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarLocalesPromocion);
} else {
    inicializarLocalesPromocion();
}

window.localesPromocionEstado = localesPromocionEstado;
window.cargarLocalesPromocion = cargarLocalesPromocion;
window.renderLocalesPromocion = renderLocalesPromocion;
window.cargarLocalEnFormulario = cargarLocalEnFormulario;
window.limpiarFormularioLocal = limpiarFormularioLocal;
window.marcarDonacionLocal = marcarDonacionLocal;

// Efecto de Luz de Antorcha Dinámica
document.addEventListener('mousemove', (e) => {
    const torch = document.querySelector('.atmosfera-antorcha');
    if (torch) {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        torch.style.setProperty('--torch-x', x + '%');
        torch.style.setProperty('--torch-y', y + '%');
    }
});

// ============================================================================
// ⏳ SISTEMA DE RELOJ DE JUSTA Y EFECTOS DINÁMICOS
// ============================================================================

function actualizarRelojJusta() {
    const timerContainer = document.getElementById('timer-justa-activa');
    const clockEl = document.getElementById('timer-clock');
    if (!timerContainer || !clockEl) return;

    const eventos = getEventosDelAmbito();
    const eventoActivo = eventos.find(e => {
        const ahora = new Date();
        const inicio = new Date(e.fecha + 'T' + e.hora_inicio_votacion);
        const fin = new Date((e.fecha_fin_votacion || e.fecha) + 'T' + e.hora_fin_votacion);
        return ahora >= inicio && ahora <= fin;
    });

    if (!eventoActivo) {
        timerContainer.style.display = 'none';
        return;
    }

    timerContainer.style.display = 'block';
    const ahora = new Date();
    const fin = new Date((eventoActivo.fecha_fin_votacion || eventoActivo.fecha) + 'T' + eventoActivo.hora_fin_votacion);
    const diff = fin - ahora;

    if (diff <= 0) {
        clockEl.textContent = "00:00:00:00";
        clockEl.style.color = "red";
        return;
    }

    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const segs = Math.floor((diff / 1000) % 60);

    clockEl.textContent = 
        String(dias).padStart(2, '0') + ':' + 
        String(horas).padStart(2, '0') + ':' + 
        String(mins).padStart(2, '0') + ':' + 
        String(segs).padStart(2, '0');
    clockEl.style.color = "#fff";
}

function lanzarEfectosJusta() {
    const container = document.getElementById('efectos-especiales-votacion');
    if (!container) return;

    // ⚡ Relámpago aleatorio
    if (Math.random() < 0.02) {
        const flash = document.createElement('div');
        flash.className = 'lightning-flash flash-active';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 200);
    }

    // 🕷️ Araña moviéndose
    if (Math.random() < 0.05) {
        const spider = document.createElement('div');
        spider.className = 'spider-entity';
        spider.textContent = '🕷️';
        spider.style.left = Math.random() * 100 + 'vw';
        spider.style.top = Math.random() * 100 + 'vh';
        container.appendChild(spider);

        setTimeout(() => {
            spider.style.left = Math.random() * 100 + 'vw';
            spider.style.top = Math.random() * 100 + 'vh';
        }, 100);

        setTimeout(() => spider.remove(), 5000);
    }

    // 🐦 Cuervo volando
    if (Math.random() < 0.01) {
        const crow = document.createElement('div');
        crow.className = 'crow-entity';
        crow.textContent = '🐦';
        crow.style.top = Math.random() * 60 + 'vh';
        container.appendChild(crow);
        setTimeout(() => crow.remove(), 10000);
    }
}

// Integrar en el ciclo de vida de la aplicación
const originalDetectarCierres = typeof detectarCierresVotacion === 'function' ? detectarCierresVotacion : function(){};
detectarCierresVotacion = function() {
    originalDetectarCierres();
    actualizarRelojJusta();
    // Solo lanzar efectos si el usuario está en la pestaña de votación
    if (document.getElementById('pestana-votacion-barrio').style.display !== 'none') {
        lanzarEfectosJusta();
    }
};

// Intervalo dedicado para el reloj de la Justa (cada segundo)
setInterval(actualizarRelojJusta, 1000);
// Intervalo para efectos visuales (más frecuente que el de cierres)
setInterval(() => {
    if (document.getElementById('pestana-votacion-barrio') && document.getElementById('pestana-votacion-barrio').style.display !== 'none') {
        lanzarEfectosJusta();
    }
}, 500);

// ============================================================================
// 🌌 SISTEMA DE PARTÍCULAS DE POLVO (Sustancia Atmosférica)
// ============================================================================
function crearParticulasPolvo() {
    const body = document.body;
    const numParticulas = 40;
    
    for (let i = 0; i < numParticulas; i++) {
        const part = document.createElement('div');
        part.className = 'particula-polvo';
        
        // Tamaño aleatorio
        const size = Math.random() * 4 + 1;
        part.style.width = size + 'px';
        part.style.height = size + 'px';
        
        // Posición inicial aleatoria
        part.style.left = Math.random() * 100 + 'vw';
        part.style.top = Math.random() * 100 + 'vh';
        
        // Duración y retraso aleatorio
        const duration = Math.random() * 10 + 10;
        part.style.animationDuration = duration + 's';
        part.style.animationDelay = Math.random() * 10 + 's';
        
        body.appendChild(part);
    }
}

// Inicialización de atmósfera al cargar la app
document.addEventListener('DOMContentLoaded', () => {
    crearParticulasPolvo();
});
