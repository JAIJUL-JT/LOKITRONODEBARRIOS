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
    return role === 'superadmin';
}

function puedeGestionarEventosBarrio(role) {
    return role === 'superadmin';
}

/*
 * Jerarquía feudal de la corte:
 *   master (Lokitrono Mayor) > superadmin > tronista (lokitronista) / jugador (maestre)
 *
 * El rol master se reserva a quien ostenta el Trono Mayor: puede conceder, editar
 * y borrar cualquier rol, y es el único facultado para crear superadmins.
 * Los superadmins solo crean maestres (jugador) y lokitronistas (tronista).
 * Maestres y lokitronistas no crean roles, barrios ni eventos.
 */
const ROLES_VALIDOS = ['jugador', 'tronista', 'superadmin', 'master'];

function esRolMaster(role) {
    return role === 'master';
}

// Administradores de la corte: superadmin y master comparten el panel de gestión.
function puedeAdministrar(role) {
    return role === 'superadmin' || role === 'master';
}

// ¿Puede el actor asignar/crear el rol indicado?
function puedeAsignarRol(actorRole, targetRole) {
    if (actorRole === 'master') return ROLES_VALIDOS.includes(targetRole);
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

const PESTANAS_ADMIN = ['pestana-generar-evento', 'tab-superadmin', 'pestana-usuarios', 'pestana-barrios', 'pestana-oraculo-ia'];

function cambiarPestana(valor) {
    const usuario = getCurrentUser();
    const esSuperadmin = !!(usuario && puedeAdministrar(usuario.role));
    const esMaster = !!(usuario && esRolMaster(usuario.role));
    // El Oráculo Imperial es territorio exclusivo del Trono Mayor (rol master).
    const esOraculo = valor === 'pestana-oraculo-ia' || valor === 'tab-oraculo-ia';
    if (esOraculo && !esMaster) {
        valor = 'pestana-clasificacion';
    }
    if (!esSuperadmin && PESTANAS_ADMIN.includes(valor)) {
        valor = 'pestana-clasificacion';
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
        const panelTronistasAdmin = document.getElementById('panel-superadmin-tronistas');
        if (panelTronistasAdmin) panelTronistasAdmin.style.display = esSuperadmin ? 'block' : 'none';
        const panelConfigTitulos = document.getElementById('panel-config-titulos-usuarios');
        if (panelConfigTitulos) panelConfigTitulos.style.display = esSuperadmin ? 'block' : 'none';

        const panelSorteo = document.getElementById('panel-sorteo-barrios');
        if (panelSorteo) panelSorteo.style.display = esSuperadmin ? 'block' : 'none';

        const esMaster = esRolMaster(usuario.role);
        const optgroupMaster = document.getElementById('optgroup-master-menu');
        if (optgroupMaster) optgroupMaster.style.display = esMaster ? '' : 'none';
        const grupoPin = document.getElementById('group-usuario-pin');
        if (grupoPin) grupoPin.style.display = esMaster ? 'block' : 'none';
        const accionesCredenciales = document.getElementById('acciones-credenciales-master');
        if (accionesCredenciales) accionesCredenciales.style.display = esMaster ? 'block' : 'none';

        if (typeof renderOpcionesRolUsuario === 'function') renderOpcionesRolUsuario();
        if (typeof actualizarBadgeMake === 'function') actualizarBadgeMake();

        if (esSuperadmin) iniciarAutoRefreshUsuarios();
        else detenerAutoRefreshUsuarios();

        cambiarPestana('pestana-clasificacion');
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
                // El autor de la aplicación ostenta en exclusiva el Trono Mayor (rol master).
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
    master_masculino: 'Lokitrono Mayor',
    master_femenino: 'Lokitrona Mayor',
    consejero_masculino: 'Consejero',
    consejero_femenino: 'Consejera'
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
    if (phone && CONSEJEROS_ESPECIALES.includes(String(phone))) return '🔱';
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

    // Consejeros especiales
    if (CONSEJEROS_ESPECIALES.includes(phone)) {
        // Ainhoa → Consejera (663366786)
        const esConsejera = phone === '663366786';
        const titulo = esConsejera ? config.consejero_femenino : config.consejero_masculino;
        return `${icon} ${titulo} ${nombre}`;
    }

    let titulo = '';
    const gender = usuario.gender || 'M';
    if (rol === 'master') {
        titulo = gender === 'F' ? (config.master_femenino || 'Lokitrona Mayor') : (config.master_masculino || 'Lokitrono Mayor');
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
        if (button) button.disabled = false;
    }
}

function toggleFormularioEmitirVoto() {
    const panel = document.getElementById('formulario-emitir-voto-div');
    if (!panel) return;
    const isVisible = panel.style.display !== 'none';
    panel.style.display = isVisible ? 'none' : 'block';
}

function renderOpcionesVoto() {
    const selectBarrio = document.getElementById('voto-select-barrio');
    if (selectBarrio) {
        const barrios = getBarriosLocal();
        selectBarrio.innerHTML = barrios.map(barrio =>
            `<option value="${escaparHTML(barrio)}">${escaparHTML(barrio)}</option>`
        ).join('');
    }

    const container = document.getElementById('contenedor-inputs-criterios-voto');
    if (container) container.innerHTML = buildCriteriosVotoMarkup();

    const selectEvento = document.getElementById('voto-select-evento');
    if (selectEvento) {
        const eventos = getTodosLosEventos().slice().sort((a, b) =>
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
}

function actualizarEstadoFormularioVoto() {
    const selectEvento = document.getElementById('voto-select-evento');
    const campoBarrio = document.getElementById('voto-barrio-evento');
    const estado = document.getElementById('estado-votacion-formulario');
    const boton = document.querySelector('#form-votar-barrio button[type="submit"]');
    if (!selectEvento) return;

    const evento = getTodosLosEventos().find(evt => String(evt.id) === selectEvento.value);
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
    const duplicado = userId && getRepositorioVotos().some(v =>
        String(v.maestre_id) === String(userId) &&
        String(v.evento_id || '') === String(evento.id)
    );
    const bloqueadoPorBarrio = lokitronistaNoPuedeVotarEn(evento, user);
    const puedeVotar = estadoVotacion.estado === 'ABIERTA' && !duplicado && !bloqueadoPorBarrio;

    if (estado) {
        estado.textContent = bloqueadoPorBarrio
            ? `Como Lokitronista de ${evento.barrio || 'este barrio'} no puedes votar en el evento de tu propio barrio.`
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
    const votos = getRepositorioVotos()
        .filter(v => String(v.maestre_id || '') === userId)
        .sort((a, b) => String(b.fecha_juicio || '').localeCompare(String(a.fecha_juicio || '')));

    if (!votos.length) {
        contenedor.innerHTML = '<p style="color:#d6d3d1;">Todavía no has emitido votos.</p>';
        return;
    }

    const eventos = getTodosLosEventos();
    contenedor.innerHTML = `
        <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;">
                <thead><tr>
                    <th>Evento</th><th>Barrio</th><th>Ocio Hostelero</th><th>Accesibilidad</th><th>Ambiente</th><th>Fecha del voto</th><th>Estado</th>
                </tr></thead>
                <tbody>${votos.map(v => {
                    const evt = eventos.find(e => String(e.id) === String(v.evento_id));
                    const estado = evt ? obtenerEstadoVotacionEvento(evt).estado : 'Histórico';
                    return `<tr>
                        <td>${escaparHTML(v.evento_nombre || (evt && evt.nombre) || 'Evento anterior')}</td>
                        <td>${escaparHTML(v.barrio || v.casa_visitada || '')}</td>
                        <td>${Number(v.nota_festin || 0)}</td>
                        <td>${Number(v.nota_caminos || 0)}</td>
                        <td>${Number(v.nota_espiritu || 0)}</td>
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

async function guardarVotoBarrioUsuario(event) {
    if (event) event.preventDefault();

    const user = getCurrentUser();
    if (!user) {
        alert('Debe iniciar sesión antes de emitir un voto.');
        return;
    }

    const selectEvento = document.getElementById('voto-select-evento');
    const evento = selectEvento
        ? getTodosLosEventos().find(evt => String(evt.id) === selectEvento.value)
        : null;

    if (!evento) {
        alert('Selecciona un evento válido antes de votar.');
        return;
    }

    if (lokitronistaNoPuedeVotarEn(evento, user)) {
        alert(`Como Lokitronista de ${evento.barrio || 'este barrio'} no puedes votar en el evento de tu propio barrio.`);
        actualizarEstadoFormularioVoto();
        return;
    }

    const estado = obtenerEstadoVotacionEvento(evento);
    if (estado.estado !== 'ABIERTA') {
        alert('La votación de este evento no está abierta. Puedes consultar tus votos anteriores.');
        actualizarEstadoFormularioVoto();
        return;
    }

    const maestreId = String(user.phone || user.id || '');
    const votosGuardados = getRepositorioVotos();
    if (votosGuardados.some(v =>
        String(v.maestre_id || '') === maestreId &&
        String(v.evento_id || '') === String(evento.id)
    )) {
        alert('Ya has emitido un voto para este evento.');
        actualizarEstadoFormularioVoto();
        return;
    }

    const selectBarrio = document.getElementById('voto-select-barrio');
    const barrio = evento.barrio || (selectBarrio ? selectBarrio.value : '');
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

    // Persistencia central en Supabase, autenticada por el token de sesión.
    let sincronizado = false;
    const client = getSupabaseBarriosClient();
    if (client && user.token) {
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
            sincronizado = true;
        } catch (error) {
            console.warn('No se pudo registrar el voto en Supabase; se guarda en el respaldo local:', error?.message || error);
        }
    }

    votosGuardados.push(voto);
    localStorage.setItem(getStorageKeyVotos(), JSON.stringify(votosGuardados));

    if (typeof renderRepositorioVotos === 'function') renderRepositorioVotos();
    if (typeof renderClasificacionReal === 'function') renderClasificacionReal();
    renderMisVotosPersonales();
    actualizarEstadoFormularioVoto();

    const formulario = document.getElementById('form-votar-barrio');
    if (formulario) formulario.reset();
    alert(sincronizado
        ? 'Voto registrado correctamente.'
        : 'Voto guardado en este dispositivo. Se sincronizará con el Reino cuando la votación esté disponible en el servidor.');
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
    const hojas = criterios.filter(c => !criterios.some(child => child.parentId === c.id));

    return hojas.map(criterio => `
        <div class="form-group">
            <label for="voto-${criterio.id}">${'— '.repeat(criterio.nivel - 1)} ${criterio.nombre} (Nivel ${criterio.nivel})</label>
            <input id="voto-${criterio.id}" data-criterio="${criterio.id}" type="number" min="1" max="10" value="8" required>
        </div>
    `).join('');
}



function exportarRepositorioCSV() {
    const votos = JSON.parse(localStorage.getItem(STORAGE_KEYS.repositorioVotos) || '[]');
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
    const key = getStorageKeyVotos ? getStorageKeyVotos() : STORAGE_KEYS.repositorioVotos;
    const votos = JSON.parse(localStorage.getItem(key) || '[]');
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
        : '<tr><td colspan="6" style="text-align: center; color: #d6d3d1;">Sin votos registrados en el repositorio central.</td></tr>';
}

function eliminarVotoRepositorio(index) {
    const user = getCurrentUser();
    if (!user || !puedeAdministrar(user.role)) {
        alert('Solo el Superadmin puede eliminar votos.');
        return;
    }
    if (confirm('🗑️ ¿Deseas eliminar este voto del repositorio?')) {
        const key = getStorageKeyVotos();
        const votos = JSON.parse(localStorage.getItem(key) || '[]');
        votos.splice(index, 1);
        localStorage.setItem(key, JSON.stringify(votos));
        renderRepositorioVotos();
        alert('Voto eliminado correctamente.');
    }
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

// Descarga los votos centralizados en Supabase y los fusiona con el respaldo local.
async function cargarVotosDesdeSupabase() {
    const client = getSupabaseBarriosClient();
    if (!client) return;
    try {
        const { data, error } = await client.rpc('listar_votos_lokitrono');
        if (error) throw error;
        const remotos = Array.isArray(data) ? data : [];
        if (!remotos.length) return;

        const key = getStorageKeyVotos();
        let locales = [];
        try {
            locales = JSON.parse(localStorage.getItem(key) || '[]');
        } catch (_) {
            locales = [];
        }
        if (!Array.isArray(locales)) locales = [];

        const vistos = new Set(locales.map(v => String(v.id || `${v.maestre_id}|${v.evento_id}`)));
        remotos.forEach(r => {
            const id = String(r.id || `${r.usuario_phone}|${r.evento_id}`);
            if (vistos.has(id)) return;
            locales.push({
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
            });
            vistos.add(id);
        });

        localStorage.setItem(key, JSON.stringify(locales));
        if (typeof renderRepositorioVotos === 'function') renderRepositorioVotos();
        if (typeof renderClasificacionReal === 'function') renderClasificacionReal();
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

function renderClasificacionReal() {
    const cuerpo = document.getElementById('clasificacion-body');
    if (!cuerpo) return;

    const votos = getRepositorioVotos();
    const barriosParticipantes = (typeof casasCache !== 'undefined' ? casasCache : [])
        .filter(c => c.participa !== false)
        .map(c => c.nombre)
        .filter(Boolean);
    const barrios = barriosParticipantes.length > 0
        ? barriosParticipantes
        : ['Casco Viejo', 'Indautxu', 'Deusto', 'Santutxu', 'Abando', 'San Mamés - Basurto'];

    const mediaGlobal = votos.length === 0 ? 0 : votos.reduce((acc, v) => {
        return acc + calcularNotaLeyII(v.nota_festin, v.nota_caminos, v.nota_espiritu);
    }, 0) / votos.length;

    const estadisticas = barrios.map(barrio => {
        const votosBarrio = votos.filter(v => (v.barrio || v.casa_visitada) === barrio);
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

    cuerpo.innerHTML = estadisticas.map((item, index) => {
        const medallas = ['🥇 1º', '🥈 2º', '🥉 3º'];
        const estatus = medallas[index] || `🏰 ${index + 1}º`;
        return `
            <tr>
                <td><strong>${estatus}</strong></td>
                <td><strong>${item.barrio}</strong></td>
                <td>${item.festin}</td>
                <td>${item.caminos}</td>
                <td>${item.espiritu}</td>
                <td><strong style="color: var(--oro-brillante); font-size: 1.1rem;">${item.notaFinal} pts</strong></td>
                <td>${item.totalVotos}</td>
            </tr>
        `;
    }).join('');
}

function getEstadisticasAdmin() {
    const votos = getRepositorioVotos();
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
    return getRepositorioVotos().some(v => v.maestre_id === maestreId && v.casa_visitada === casaId);
}

function getStorageKeyVotos() {
    const modoSimulacion = localStorage.getItem('modo_sandbox_simulacion') === 'true';
    return modoSimulacion ? 'repositorio_votos_simulacion' : STORAGE_KEYS.repositorioVotos;
}

function generarEjemploCompeticionSimulada() {
    const usuario = getCurrentUser();
    if (!usuario || !puedeAdministrar(usuario.role)) {
        alert('Acceso restringido: Solo Superadministradores pueden generar partidas simuladas.');
        return;
    }

    const votosSimulados = [
        { maestre_id: 'sim-01', casa_visitada: 'Casco Viejo', barrio: 'Casco Viejo', nota_festin: 9, nota_caminos: 8, nota_espiritu: 9, fecha_juicio: new Date().toISOString() },
        { maestre_id: 'sim-02', casa_visitada: 'Indautxu', barrio: 'Indautxu', nota_festin: 10, nota_caminos: 9, nota_espiritu: 10, fecha_juicio: new Date().toISOString() },
        { maestre_id: 'sim-03', casa_visitada: 'Deusto', barrio: 'Deusto', nota_festin: 8, nota_caminos: 8, nota_espiritu: 9, fecha_juicio: new Date().toISOString() }
    ];

    localStorage.setItem('repositorio_votos_simulacion', JSON.stringify(votosSimulados));
    localStorage.setItem('modo_sandbox_simulacion', 'true');
    alert('🎮 Partida de simulación generada en el Sandbox. La competición real NO se ha visto afectada.');
    if (typeof renderRepositorioVotos === 'function') renderRepositorioVotos();
}

function restaurarCompeticionCero() {
    const usuario = getCurrentUser();
    if (!usuario || !puedeAdministrar(usuario.role)) {
        alert('Acceso restringido: Solo Superadministradores.');
        return;
    }

    if (confirm('🔄 ¿Deseas reiniciar a 0 la partida de simulación? (Los datos reales del juego permanecerán intactos).')) {
        localStorage.removeItem('repositorio_votos_simulacion');
        localStorage.setItem('modo_sandbox_simulacion', 'false');
        alert('✅ Sandbox de simulación reiniciado a 0.');
        if (typeof renderRepositorioVotos === 'function') renderRepositorioVotos();
    }
}

function crearNuevoJuegoTorneo(event) {
    if (event) event.preventDefault();
    const usuario = getCurrentUser();
    if (!usuario || !puedeAdministrar(usuario.role)) {
        alert('Acceso restringido a Superadmin.');
        return;
    }

    const nombreInput = document.getElementById('nuevo-juego-nombre');
    const modoInput = document.getElementById('nuevo-juego-modo');
    const nombre = (nombreInput?.value || '').trim();
    const modo = modoInput?.value || 'oficial';

    if (!nombre) {
        alert('Indica el nombre de la nueva edición o competición.');
        return;
    }

    const nuevoJuego = {
        id: `juego-${Date.now()}`,
        nombre,
        modo,
        fechaCreacion: new Date().toISOString(),
        estado: 'activo'
    };

    const juegos = JSON.parse(localStorage.getItem('juegos_competiciones') || '[]');
    juegos.push(nuevoJuego);
    localStorage.setItem('juegos_competiciones', JSON.stringify(juegos));
    localStorage.setItem('juego_activo_id', nuevoJuego.id);

    if (nombreInput) nombreInput.value = '';
    alert(`🏆 ¡Nuevo juego "${nombre}" creado correctamente (${modo === 'simulacion' ? 'Modo Sandbox' : 'Modo Oficial'})!`);
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

    // Eventos incluidos de serie en la aplicación.
    EVENTOS_FEUDALES.forEach(evt => porId.set(String(evt.id), { ...evt }));

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
            cerrado_manualmente: Boolean(row.cerrado_manualmente)
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

    const eventos = getTodosLosEventos();
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
            contenidoInner += `<div class="cal-cruz-roja-marca" title="📅 Evento oficial: ${eventosDia.map(e => e.nombre).join(', ')}">❌</div>`;
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
    const panelAdmin = document.getElementById('contenedor-gestion-eventos-admin');

    const currentUser = getCurrentUser();
    const esAdmin = currentUser && puedeAdministrar(currentUser.role);

    if (panelAdmin) {
        panelAdmin.style.display = esAdmin ? 'block' : 'none';
    }

    if (!lista) return;

    const todosLosEventos = getTodosLosEventos();
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

    const repositorioVotos = getRepositorioVotos();

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

            resumenResultadosHTML = `
                <div style="margin: 12px 0; background: rgba(20, 30, 20, 0.8); border: 1px solid #22c55e; padding: 10px; border-radius: 6px;">
                    <div style="font-size: 0.8rem; color: #4ade80; font-weight: bold; margin-bottom: 4px;">
                        📊 RESULTADOS OFICIALES ACTUALIZADOS (${numVotos} VOTOS)
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.82rem; color: #d6d3d1;">
                        <span>Ocio Hostelero: <strong>${mediaF}</strong></span>
                        <span>Accesibilidad: <strong>${mediaC}</strong></span>
                        <span>Ambiente: <strong>${mediaE}</strong></span>
                    </div>
                    <div style="margin-top: 4px; font-size: 0.95rem; color: var(--oro-brillante); font-weight: bold; text-align: center;">
                        🏆 Media del Códice: ${notaLey2} pts
                    </div>
                </div>
            `;
        }

        let adminControlsHTML = '';
        if (esAdmin) {
            const isManualClosed = evt.cerrado_manualmente;
            adminControlsHTML = `
                <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px;">
                    <button onclick="editarEventoBarrio('${evt.id}')" class="btn-cuervo" style="padding: 4px 8px; font-size: 0.78rem; background: #2563eb; flex: 1;">✏️ Editar</button>
                    <button onclick="toggleCerrarVotacionEvento('${evt.id}')" class="btn-cuervo" style="padding: 4px 8px; font-size: 0.78rem; background: ${isManualClosed ? '#166534' : '#d97706'}; flex: 1.2;">
                        ${isManualClosed ? '🟢 Abrir Votación' : '🔒 Cerrar Votación'}
                    </button>
                    <button onclick="eliminarEventoBarrio('${evt.id}')" class="btn-cuervo" style="padding: 4px 8px; font-size: 0.78rem; background: #7f1d1d; flex: 0.8;">🗑️ Eliminar</button>
                </div>
            `;
        }

        const relojHTML = construirHTMLRelojCuentaAtras(evt);

        return `
            <div class="card-item" style="position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <span class="pill-user" style="background: rgba(185,28,28,0.8); color: #fff; font-weight: bold; padding: 3px 8px; border-radius: 12px; font-size: 0.8rem;">
                        🏰 ${evt.barrio || 'Reino'}
                    </span>
                    <span style="font-size: 0.82rem; color: var(--oro-brillante); font-weight: bold;">📅 ${evt.fecha} (${evt.hora || '20:00'})${evt.fecha_fin || evt.hora_fin ? ` → ${evt.fecha_fin || evt.fecha}${evt.hora_fin ? ` (${evt.hora_fin})` : ''}` : ''}</span>
                </div>

                <div style="margin-bottom: 6px;">
                    <span class="pill-user" style="font-size: 0.75rem; font-weight: bold; padding: 4px 10px; background: ${estadoVot.estado === 'ABIERTA' ? '#15803d' : (estadoVot.estado === 'FINALIZADA' ? '#7f1d1d' : '#854d0e')}; color: #ffffff; display: inline-block;">
                        ${estadoVot.texto}
                    </span>
                </div>

                <!-- RELOJ CON CUENTA ATRÁS IMPERIAL EN TIEMPO REAL -->
                ${relojHTML}

                <h3 style="color: var(--oro-real); font-family: 'Cinzel', serif; margin: 6px 0 8px; font-size: 1.15rem;">${evt.nombre}</h3>
                <p style="font-size: 0.88rem; color: #d6d3d1; margin-bottom: 6px;"><strong>📍 Lugar:</strong> ${evt.lugar || 'Bilbao'}</p>
                <p style="font-size: 0.82rem; color: #a1a1aa; margin-bottom: 10px;">
                    ⏰ <strong>Franja Votación:</strong> ${estadoVot.horaInicio} hs a ${estadoVot.horaFin} hs
                </p>

                ${evt.desc ? `<p style="font-size: 0.85rem; color: #a1a1aa; font-style: italic; margin-bottom: 10px;">"${evt.desc}"</p>` : ''}
                
                ${resumenResultadosHTML}

                <button onclick='descargarICSEvento(${JSON.stringify(evt)})' class="btn-cuervo" style="padding: 6px 12px; font-size: 0.85rem; background: #15803d; width: 100%; margin-top: 4px;">
                    📅 Añadir a Google Calendar (.ics)
                </button>

                ${adminControlsHTML}
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

    timerRelojCuentaAtrasId = setInterval(() => {
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
        'Introduce el PIN de superadministrador para confirmar la operación:'
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

    const todos = getTodosLosEventos();
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

    const evt = getTodosLosEventos().find(
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
            ? Boolean(getTodosLosEventos().find(e => String(e.id) === String(editId))?.cerrado_manualmente)
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
    const barrios = getBarriosRegistrados();
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
    const lugar = document.getElementById('evento-dedicated-lugar')?.value?.trim();
    const hora = document.getElementById('evento-dedicated-hora')?.value || '20:00';
    const horaFin = document.getElementById('evento-dedicated-hora-fin')?.value || '';
    const horaInicioVotacion =
        document.getElementById('evento-dedicated-votacion-inicio')?.value || '20:30';
    const horaFinVotacion =
        document.getElementById('evento-dedicated-votacion-fin')?.value || '23:30';
    const fechaFinVotacion =
        document.getElementById('evento-dedicated-votacion-fecha-fin')?.value || '';
    const desc = document.getElementById('evento-dedicated-desc')?.value || '';

    if (!nombre || !fecha || !lugar) {
        alert('Por favor, completa los campos requeridos del evento.');
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
            ? Boolean(getTodosLosEventos().find(e => String(e.id) === String(editId))?.cerrado_manualmente)
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
}

function editarEventoBarrioDesdePestana(eventoId) {
    const todos = getTodosLosEventos();
    const evt = todos.find(e => e.id === eventoId);
    if (!evt) return;

    document.getElementById('evento-dedicated-id-edit').value = evt.id;
    document.getElementById('evento-dedicated-barrio').value = evt.barrio || 'Casco Viejo';
    document.getElementById('evento-dedicated-nombre').value = evt.nombre || '';
    document.getElementById('evento-dedicated-fecha').value = evt.fecha || '';
    document.getElementById('evento-dedicated-fecha-fin').value = evt.fecha_fin || '';
    document.getElementById('evento-dedicated-lugar').value = evt.lugar || '';
    document.getElementById('evento-dedicated-hora').value = evt.hora || '20:00';
    document.getElementById('evento-dedicated-hora-fin').value = evt.hora_fin || '';
    document.getElementById('evento-dedicated-votacion-inicio').value = evt.hora_inicio_votacion || '20:30';
    document.getElementById('evento-dedicated-votacion-fin').value = evt.hora_fin_votacion || '23:30';
    document.getElementById('evento-dedicated-votacion-fecha-fin').value = evt.fecha_fin_votacion || '';
    document.getElementById('evento-dedicated-desc').value = evt.desc || '';

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

    const eventos = getTodosLosEventos();
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
                <p style="font-size: 0.82rem; color: #a1a1aa; margin-bottom: 10px;">
                    ⏰ <strong>Votación:</strong> ${estadoVot.horaInicio} a ${estadoVot.horaFin} hs (${estadoVot.texto})
                </p>
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                    <button onclick="editarEventoBarrioDesdePestana('${evt.id}')" class="btn-cuervo" style="padding: 4px 8px; font-size: 0.78rem; background: #2563eb; flex: 1;">✏️ Editar</button>
                    <button onclick="toggleCerrarVotacionEvento('${evt.id}')" class="btn-cuervo" style="padding: 4px 8px; font-size: 0.78rem; background: ${evt.cerrado_manualmente ? '#166534' : '#d97706'}; flex: 1.2;">
                        ${evt.cerrado_manualmente ? '🟢 Abrir' : '🔒 Cerrar'}
                    </button>
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

function getGalaFinalConfig() {
    try {
        const raw = localStorage.getItem('evento_final_config');
        return raw ? JSON.parse(raw) : GALA_FINAL_DEFAULT;
    } catch (e) {
        return GALA_FINAL_DEFAULT;
    }
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

function guardarEventoFinal(event) {
    if (event) event.preventDefault();

    const user = getCurrentUser();
    if (!user || !puedeAdministrar(user.role)) {
        alert('Acceso restringido: Solo el Superadministrador puede modificar la Gala Final.');
        return;
    }

    const titulo = document.getElementById('final-titulo')?.value || GALA_FINAL_DEFAULT.titulo;
    const lugar = document.getElementById('final-lugar')?.value || GALA_FINAL_DEFAULT.lugar;
    const fecha = document.getElementById('final-fecha')?.value || GALA_FINAL_DEFAULT.fecha;
    const premio = document.getElementById('final-premio')?.value || GALA_FINAL_DEFAULT.premio;

    const config = { titulo, lugar, fecha, premio };
    localStorage.setItem('evento_final_config', JSON.stringify(config));

    alert('👑 ¡Configuración de la Gran Gala Final guardada correctamente!');
    renderGalaFinal();
}

function borrarConfiguracionGalaFinal() {
    const user = getCurrentUser();
    if (!user || !puedeAdministrar(user.role)) {
        alert('Acceso restringido a Superadmin.');
        return;
    }

    if (confirm('🗑️ ¿Deseas restablecer la Gala Final a sus valores predeterminados del Reino?')) {
        localStorage.removeItem('evento_final_config');
        alert('✅ Gala Final restablecida.');
        renderGalaFinal();
    }
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
    return (window.LOKI_LEGAL && window.LOKI_LEGAL.sitio) || window.location.origin;
}

function generarPinSeisDigitos() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

function etiquetaRol(role) {
    const etiquetas = {
        master: 'Lokitrono Mayor',
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
    const url = getMakeWebhookUrl();
    if (!url) return { ok: false, motivo: 'sin_webhook' };
    try {
        const respuesta = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return { ok: respuesta.ok, status: respuesta.status };
    } catch (error) {
        console.warn('No se pudo enviar el webhook de Make/WhatsApp:', error?.message || error);
        return { ok: false, motivo: 'error_red' };
    }
}

// Mensaje de bienvenida con la dirección pública del juego y el PIN de acceso.
async function enviarBienvenidaWhatsApp({ phone, name, pin, role }) {
    const sitio = getSitioPublico();
    const nombre = (name || phone || '').trim() || 'Maestre';
    const mensaje = [
        `🏰 ¡Bienvenido/a a LokiTrono de Barrios, ${nombre}!`,
        '',
        `Ya formas parte de la corte como ${etiquetaRol(role)}.`,
        `Accede al juego en: ${sitio}`,
        `Teléfono de acceso: ${phone}`,
        `PIN de acceso: ${pin}`,
        '',
        'Guarda este PIN. Si lo pierdes, pide a la organización que genere uno nuevo.'
    ].join('\n');

    return enviarWebhookMake({
        evento: 'BIENVENIDA_USUARIO',
        telefono: phone,
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
        telefono: '000000000',
        nombre: 'Prueba del Reino',
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
        alert('Solo un administrador (Superadmin o Master) puede regenerar PINs.');
        return;
    }

    const objetivo = getUsuariosAutorizadosLocal().find(u => u.id === userId) || null;
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
            alert(`✅ PIN regenerado: ${nuevoPin}\n⚠️ No se pudo enviar por WhatsApp.`);
        }
    } catch (error) {
        console.error('Error regenerando el PIN:', error);
        alert(`No se pudo regenerar el PIN: ${error?.message || 'error desconocido'}`);
    }
}

// Establece manualmente un PIN de 6 dígitos para un usuario (exclusivo del Master).
async function editarPinUsuario(userId) {
    const currentUser = getCurrentUser();
    if (!currentUser || !esRolMaster(currentUser.role)) {
        alert('Solo el Master puede editar el PIN de forma manual.');
        return;
    }

    const objetivo = getUsuariosAutorizadosLocal().find(u => u.id === userId) || null;
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

// Borra el PIN de un usuario y revoca sus sesiones (exclusivo del Master).
async function borrarPinUsuario(userId) {
    const currentUser = getCurrentUser();
    if (!currentUser || !esRolMaster(currentUser.role)) {
        alert('Solo el Master puede borrar PIN de acceso.');
        return;
    }
    const objetivo = getUsuariosAutorizadosLocal().find(u => u.id === userId) || null;
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

// Descarga un CSV con las credenciales de todos los usuarios (exclusivo del Master).
function descargarUsuariosCSV() {
    const currentUser = getCurrentUser();
    if (!currentUser || !esRolMaster(currentUser.role)) {
        alert('Solo el Master puede descargar las credenciales de los usuarios.');
        return;
    }

    const usuarios = getUsuariosAutorizadosLocal();
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

window.guardarWebhookMakeConfig = guardarWebhookMakeConfig;
window.probarEnvioWebhookMake = probarEnvioWebhookMake;
window.regenerarPinYEnviarWhatsApp = regenerarPinYEnviarWhatsApp;
window.editarPinUsuario = editarPinUsuario;
window.borrarPinUsuario = borrarPinUsuario;
window.descargarUsuariosCSV = descargarUsuariosCSV;

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
    const etiquetas = { master: '🌟 Master (Lokitrono Mayor)', superadmin: '🏰 Superadmin', tronista: '👑 Lokitronista', jugador: '⚔️ Maestre' };
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
    // Solo el propio Trono Mayor (master) ve el rol master; ante el resto de
    // usuarios el master se muestra con el mismo rango que un superadmin.
    const viewerEsMaster = !!(currentUser && esRolMaster(currentUser.role));
    let usuarios = getUsuariosAutorizadosLocal();

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
            rolBadge = `<span class="pill-user" style="background:rgba(120,53,15,0.9);color:#fde68a;border:1px solid var(--oro-brillante);padding:2px 8px;border-radius:12px;font-size:0.78rem;">🌟 Master</span>`;
        } else if (rolVisible === 'superadmin') {
            rolBadge = `<span class="pill-user" style="background:rgba(22,101,52,0.8);color:#86efac;border:1px solid #4ade80;padding:2px 8px;border-radius:12px;font-size:0.78rem;">🏰 Superadmin</span>`;
        } else if (rolVisible === 'tronista') {
            rolBadge = `<span class="pill-user" style="background:rgba(120,53,15,0.8);color:var(--oro-brillante);border:1px solid var(--oro-real);padding:2px 8px;border-radius:12px;font-size:0.78rem;">👑 Tronista</span>`;
        } else {
            rolBadge = `<span class="pill-user" style="background:rgba(63,63,70,0.8);color:#d4d4d8;border:1px solid #52525b;padding:2px 8px;border-radius:12px;font-size:0.78rem;">⚔️ Jugador</span>`;
        }

        const puedeGestionarFila = esSuperadmin &&
            (!currentUser || puedeGestionarRolDe(currentUser.role, user.role));
        const esMasterActor = !!(currentUser && esRolMaster(currentUser.role));
        const acciones = puedeGestionarFila
            ? `<button class="btn-cuervo" style="padding:3px 8px;font-size:0.78rem;" onclick="editarUsuario('${user.id}')">✏️</button>
               <button class="btn-cuervo" style="padding:3px 8px;font-size:0.78rem;background:#7f1d1d;" onclick="eliminarUsuario('${user.id}')">🗑️</button>`
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
        } else {
            celdaPin = `<span aria-hidden="true">••••••</span>
                <button class="btn-cuervo" style="padding:2px 6px;font-size:0.72rem;margin-left:6px;" title="Regenerar PIN y reenviar por WhatsApp" onclick="regenerarPinYEnviarWhatsApp('${user.id}')">🔑</button>`;
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
        const barrios = getBarriosLocal();
        selectBarrio.innerHTML = barrios
            .map(b => `<option value="${b.nombre}">${b.nombre}</option>`)
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
        alert('Solo un administrador (Superadmin o Master) puede gestionar usuarios.');
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
        alert('No tienes permiso para asignar ese rol. Solo el Master puede crear o editar Superadmins y Masters.');
        return;
    }

    const usuariosExistentes = getUsuariosAutorizadosLocal();
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

// Envía el mensaje de bienvenida por WhatsApp (vía Make) y avisa al administrador.
async function enviarBienvenidaTrasAlta({ phone, name, pin, role }) {
    const resultado = await enviarBienvenidaWhatsApp({ phone, name, pin, role });
    if (resultado.ok) {
        alert(`✅ Usuario añadido. Se ha enviado la bienvenida por WhatsApp con su PIN (${pin}).`);
    } else if (resultado.motivo === 'sin_webhook') {
        alert(`✅ Usuario añadido.\n⚠️ No hay webhook de Make configurado, así que no se pudo enviar la bienvenida automática.\n\nComparte tú el acceso:\n• Web: ${(window.LOKI_LEGAL && window.LOKI_LEGAL.sitio) || window.location.origin}\n• Teléfono: ${phone}\n• PIN: ${pin}`);
    } else {
        alert(`✅ Usuario añadido.\n⚠️ No se pudo enviar la bienvenida por WhatsApp.\n\nComparte tú el acceso:\n• Web: ${(window.LOKI_LEGAL && window.LOKI_LEGAL.sitio) || window.location.origin}\n• Teléfono: ${phone}\n• PIN: ${pin}`);
    }
}

function editarUsuario(userId) {
    const usuarios = getUsuariosAutorizadosLocal();
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
        alert('Solo un administrador (Superadmin o Master) puede eliminar usuarios del Reino.');
        return;
    }
    const objetivo = getUsuariosAutorizadosLocal().find(u => u.id === userId) || null;
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
        alert('Solo Superadmin puede asignar títulos de Tronista.');
        return;
    }

    const userId = document.getElementById('select-usuario-tronista')?.value;
    const barrio = document.getElementById('select-barrio-tronista')?.value;

    if (!userId || !barrio) {
        alert('Selecciona un usuario y un barrio.');
        return;
    }

    const objetivo = getUsuariosAutorizadosLocal().find(u => u.id === userId) || null;
    if (objetivo && !puedeGestionarRolDe(currentUser.role, objetivo.role)) {
        alert('No tienes permiso para nombrar Lokitronista a este usuario.');
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
            alert(`👑 ¡Título de Tronista de ${barrio} asignado!`);
            return;
        } catch (error) {
            console.warn('Asignación de Tronista en Supabase no disponible; se usa el respaldo local:', error?.message || error);
        }
    }

    let usuarios = getUsuariosAutorizadosLocal();
    const idx = usuarios.findIndex(u => u.id === userId);
    if (idx === -1) { alert('Usuario no encontrado.'); return; }

    usuarios[idx].role = 'tronista';
    usuarios[idx].barrio_asignado = barrio;
    usuarios[idx].fecha_designacion = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(usuarios));
    renderTablaUsuarios();
    renderListaTronistas();
    alert(`👑 ¡${usuarios[idx].name} ha sido designado/a Tronista de ${barrio}!`);
}

/* ==========================================
   HALL OF FAME — TRONISTAS
   ========================================== */

function renderListaTronistas() {
    const container = document.getElementById('lista-tronistas');
    if (!container) return;

    const usuarios = getUsuariosAutorizadosLocal();
    const tronistas = usuarios.filter(u => u.role === 'tronista');

    if (!tronistas || tronistas.length === 0) {
        container.innerHTML = `<div style="text-align:center;color:#94a3b8;padding:30px;font-style:italic;">Ningún Maestre ha recibido aún el título de Tronista de Barrio.</div>`;
        return;
    }

    const repositorioVotos = getRepositorioVotos ? getRepositorioVotos() : (JSON.parse(localStorage.getItem(STORAGE_KEYS.repositorioVotos) || '[]'));

    container.innerHTML = tronistas.map(user => {
        const phone = String(user.phone || '');
        const tituloCompleto = getTituloCompleto(user);
        const barrio = user.barrio_representado || user.barrio_asignado || 'Sin barrio';

        // Privacy-masked phone: first 3 + ** + last 2
        let phoneMask = phone;
        if (phone.length >= 5) {
            phoneMask = phone.slice(0, 3) + '**' + phone.slice(-2);
        }

        // Count votes emitted
        const votosEmitidos = repositorioVotos.filter(v => String(v.maestre_id || '') === phone).length;

        const fechaDesig = user.fecha_designacion
            ? `📅 Designado/a: ${new Date(user.fecha_designacion).toLocaleDateString('es-ES')}`
            : '';

        return `<div class="card-item" style="background:rgba(30,24,8,0.95);border:2px solid var(--oro-real);margin-bottom:18px;padding:20px;border-radius:10px;">
            <div style="text-align:center;margin-bottom:10px;">
                <span style="font-size:2.5rem;">👑</span>
            </div>
            <div style="text-align:center;margin-bottom:8px;">
                <strong style="color:var(--oro-brillante);font-family:'Cinzel',serif;font-size:1.1rem;">${tituloCompleto}</strong>
            </div>
            <div style="text-align:center;margin-bottom:8px;">
                <span class="pill-user" style="background:rgba(120,53,15,0.8);color:var(--oro-brillante);border:1px solid var(--oro-real);padding:3px 10px;border-radius:12px;font-size:0.82rem;">🏰 ${barrio}</span>
            </div>
            <div style="text-align:center;font-size:0.82rem;color:#a1a1aa;margin-bottom:6px;">📱 ${phoneMask}</div>
            <div style="text-align:center;margin-bottom:6px;">
                <span class="pill-user" style="background:rgba(120,53,15,0.8);color:var(--oro-brillante);border:1px solid var(--oro-real);padding:2px 8px;border-radius:12px;font-size:0.78rem;">👑 Tronista de Barrio</span>
            </div>
            <div style="text-align:center;font-size:0.82rem;color:#d6d3d1;margin-bottom:6px;">⚔️ Votos emitidos: <strong>${votosEmitidos}</strong></div>
            ${fechaDesig ? `<div style="text-align:center;font-size:0.78rem;color:#a1a1aa;">${fechaDesig}</div>` : ''}
            <hr style="border-color:var(--oro-real);opacity:0.3;margin:12px 0 0 0;">
        </div>`;
    }).join('');
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
                () => programarRefrescoRealtime('eventos', () => cargarEventosDesdeSupabase()))
            .on('postgres_changes', { event: '*', schema: 'public', table: 'votos_evento' },
                () => programarRefrescoRealtime('votos', async () => {
                    await cargarVotosDesdeSupabase();
                    if (typeof renderClasificacionReal === 'function') renderClasificacionReal();
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
    return ['Casco Viejo', 'Indautxu', 'Deusto', 'Santutxu', 'Abando', 'San Mamés - Basurto'];
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
        .select('id,nombre,lema,emblema,color_heraldo,imagen_url,participa,created_at')
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
    const nombres = getBarriosLocal();
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

    if (!casasCache.length) {
        contenedor.innerHTML =
            '<p style="color:#d6d3d1;">No hay barrios cargados desde la tabla <code>casas</code>.</p>';
        return;
    }

    const usuarios = typeof getUsuariosAutorizadosLocal === 'function' ? getUsuariosAutorizadosLocal() : [];
    const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    const esSuperadmin = !!(currentUser && puedeAdministrar(currentUser.role));

    contenedor.innerHTML = casasCache.map(casa => {
        const id = escaparHTML(String(casa.id || ''));
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

    const pinConfirmacion = window.prompt('Introduce tu PIN de superadministrador para confirmar:');
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

    const casa = casasCache.find(item => String(item.id) === String(id));
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

    campoId.value = casa.id;
    campoNombre.value = casa.nombre || '';
    campoLema.value = casa.lema || '';

    // Si un emblema antiguo no aparece en el selector, se añade temporalmente.
    if (![...campoEmblema.options].some(option => option.value === (casa.emblema || '🏰'))) {
        campoEmblema.add(new Option(casa.emblema || '🏰', casa.emblema || '🏰'));
    }
    campoEmblema.value = casa.emblema || '🏰';

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

    const duplicado = casasCache.some(casa =>
        casa.nombre.localeCompare(nombre, 'es', { sensitivity: 'base' }) === 0
        && String(casa.id) !== String(idEdit || '')
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
        `Introduce tu PIN de superadministrador para confirmar ${idEdit ? 'la edición' : 'la creación'} del barrio:`
    );

    if (pinConfirmacion === null) return;
    if (!/^\d{6}$/.test(pinConfirmacion.trim())) {
        alert('El PIN debe contener exactamente seis dígitos.');
        return;
    }

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
                p_participa: casasCache.find(c => String(c.id) === String(idEdit))?.participa ?? true
            }));
        } else {
            ({ data, error } = await client.rpc('crear_casa_superadmin', {
                p_phone: String(usuario.phone || ''),
                p_pin: pinConfirmacion.trim(),
                p_nombre: nombre,
                p_lema: lema,
                p_emblema: emblema
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

    const casa = casasCache.find(item => String(item.id) === String(id));
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
        `Introduce tu PIN de superadministrador para eliminar «${casa.nombre}»:`
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
    if (typeof renderDashboardSimulacionCompleto === 'function') renderDashboardSimulacionCompleto();
    if (typeof iniciarTimerRelojCuentaAtras === 'function') iniciarTimerRelojCuentaAtras();
    iniciarRealtimeLokitrono();
    const currentUser = getCurrentUser();
    if (currentUser) {
        actualizarInterfazSesion(currentUser);
    }
    const fecha = document.getElementById('final-fecha');
    if (fecha && !fecha.value) {
        fecha.value = '2026-10-20T20:30';
    }
}



/* ==========================================
   SIMULACIÓN AVANZADA, ESTADÍSTICAS & GRÁFICOS
   ========================================== */

const POOL_BARRIOS_BILBAO = [
    'Casco Viejo', 'Indautxu', 'Deusto', 'Santutxu', 'Abando', 'San Mamés - Basurto',
    'Otxarkoaga', 'Rekalde', 'Uribarri', 'Zorrotza', 'Begoña', 'Olabeaga'
];

const POOL_BARRIOS_ESPANIA = [
    'Malasaña (Madrid)', 'La Latina (Madrid)', 'Triana (Sevilla)', 'Gràcia (Barcelona)',
    'Ruzafa (Valencia)', 'Albaicín (Granada)', 'Cimadevilla (Gijón)', 'Vegueta (Las Palmas)',
    'El Carmen (Valencia)', 'Santa Cruz (Sevilla)'
];

const NOMBRES_VASCOS_MASCULINOS = [
    'Aitor', 'Gorka', 'Unai', 'Iker', 'Asier', 'Kepa', 'Eneko', 'Julen', 'Ander', 'Mikel',
    'Jon', 'Oier', 'Markel', 'Beñat', 'Iñigo', 'Patxi', 'Carlos', 'Javier', 'David', 'Rubén'
];

const NOMBRES_VASCOS_FEMENINOS = [
    'Ane', 'Maite', 'Itziar', 'Amaia', 'Nerea', 'Miren', 'Nagore', 'Leire', 'Edurne', 'Uxue',
    'Garazi', 'Arantza', 'Izaro', 'Haizea', 'Nahia', 'Lucía', 'Sofía', 'María', 'Carmen', 'Elena'
];

const APELLIDOS_VASCOS = [
    'Etxeberria', 'Aguirre', 'Zabala', 'Bilbao', 'Larrea', 'Goikoetxea', 'Azkarate',
    'Elorriaga', 'Uriarte', 'Arana', 'Mendizabal', 'Ibarra', 'García', 'Rodríguez', 'Fernández', 'López'
];

let simChartInstances = {};

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generarPartidaSimulacionCompleta() {
    const usuario = getCurrentUser();
    if (!usuario || !puedeAdministrar(usuario.role)) {
        alert('Acceso restringido: Solo el Superadministrador puede generar partidas simuladas.');
        return;
    }

    const inputNum = document.getElementById('sim-num-barrios');
    const numBarriosDeseados = parseInt(inputNum?.value || '6', 10);
    const nBarrios = Math.max(3, Math.min(numBarriosDeseados, 22));

    const barriosSelec = [];
    for (let i = 0; i < nBarrios; i++) {
        if (i < POOL_BARRIOS_BILBAO.length) {
            barriosSelec.push(POOL_BARRIOS_BILBAO[i]);
        } else {
            const idxEsp = i - POOL_BARRIOS_BILBAO.length;
            barriosSelec.push(POOL_BARRIOS_ESPANIA[idxEsp % POOL_BARRIOS_ESPANIA.length]);
        }
    }

    const usuariosSim = [];
    const roles = ['tronista', 'jugador', 'jugador', 'jugador'];
    let phoneCounter = 610000000;

    barriosSelec.forEach((barrio, bIdx) => {
        const userCount = 3 + Math.floor(Math.random() * 2);
        for (let u = 0; u < userCount; u++) {
            const esHombre = Math.random() > 0.5;
            const nombre = esHombre ? getRandomElement(NOMBRES_VASCOS_MASCULINOS) : getRandomElement(NOMBRES_VASCOS_FEMENINOS);
            const ap1 = getRandomElement(APELLIDOS_VASCOS);
            const ap2 = getRandomElement(APELLIDOS_VASCOS);
            const nombreCompleto = `${nombre} ${ap1} ${ap2}`;
            const phone = `+34${phoneCounter++}`;
            const email = `${nombre.toLowerCase()}.${ap1.toLowerCase()}@feudo.bilbao`;

            usuariosSim.push({
                id: `sim-usr-${bIdx}-${u}`,
                name: nombreCompleto,
                phone,
                email,
                role: (bIdx === 0 && u === 0) ? 'superadmin' : getRandomElement(roles),
                pin_code: '123456',
                barrio_representado: barrio,
                barrio_asignado: barrio
            });
        }
    });

    const ahora = new Date();
    const hoyStr = ahora.toISOString().split('T')[0];

    const haceCincoMin = new Date(ahora.getTime() - 5 * 60 * 1000);
    const dentroDeCincoMin = new Date(ahora.getTime() + 5 * 60 * 1000);

    const pad = n => String(n).padStart(2, '0');
    const horaInicioStr = `${pad(haceCincoMin.getHours())}:${pad(haceCincoMin.getMinutes())}`;
    const horaFinStr = `${pad(dentroDeCincoMin.getHours())}:${pad(dentroDeCincoMin.getMinutes())}`;

    const barrioActivo = barriosSelec[0];
    const eventoActivo = {
        id: 'sim-evt-1',
        nombre: `Justa & Ruta de Pintxos de ${barrioActivo} (Votación en Curso)`,
        barrio: barrioActivo,
        fecha: hoyStr,
        hora: horaInicioStr,
        hora_inicio_votacion: horaInicioStr,
        hora_fin_votacion: horaFinStr,
        lugar: `Plaza Principal de ${barrioActivo}`,
        estado: 'abierto'
    };

    const eventosSim = [eventoActivo];
    const numEventosCelebrados = Math.max(1, nBarrios - 2);

    for (let idx = 1; idx < nBarrios; idx++) {
        const barrio = barriosSelec[idx];
        const esCelebrado = idx < numEventosCelebrados;
        const offsetDays = esCelebrado ? -(idx) * 3 : (idx - numEventosCelebrados + 1) * 7;
        const evtFecha = new Date(ahora);
        evtFecha.setDate(evtFecha.getDate() + offsetDays);

        eventosSim.push({
            id: `sim-evt-${idx + 1}`,
            nombre: `Justa & Ruta de Pintxos de ${barrio}`,
            barrio: barrio,
            fecha: evtFecha.toISOString().split('T')[0],
            hora: '20:30',
            hora_inicio_votacion: '20:30',
            hora_fin_votacion: '23:30',
            lugar: `Plaza Principal de ${barrio}`,
            estado: esCelebrado ? 'celebrado' : 'pendiente'
        });
    }

    const votosSim = [];
    const superadminPhones = ['605676002', '+34605676002', '123456789', 'admin', '456123456'];

    usuariosSim.forEach(usr => {
        const esUsrSuperadmin = usr.role === 'superadmin' || usr.role === 'master' || superadminPhones.includes(usr.phone);
        if (!esUsrSuperadmin) {
            votosSim.push({
                maestre_id: usr.phone,
                maestre_nombre: usr.name,
                casa_visitada: eventoActivo.barrio,
                barrio: eventoActivo.barrio,
                nota_festin: 7 + Math.floor(Math.random() * 4),
                nota_caminos: 6 + Math.floor(Math.random() * 5),
                nota_espiritu: 7 + Math.floor(Math.random() * 4),
                fecha_juicio: haceCincoMin.toISOString()
            });
        }
    });

    const otrosCelebrados = eventosSim.filter(e => e.id !== 'sim-evt-1' && e.estado === 'celebrado');
    otrosCelebrados.forEach(evt => {
        usuariosSim.forEach(usr => {
            votosSim.push({
                maestre_id: usr.phone,
                maestre_nombre: usr.name,
                casa_visitada: evt.barrio,
                barrio: evt.barrio,
                nota_festin: 6 + Math.floor(Math.random() * 5),
                nota_caminos: 5 + Math.floor(Math.random() * 6),
                nota_espiritu: 6 + Math.floor(Math.random() * 5),
                fecha_juicio: evt.fecha + 'T21:00:00.000Z'
            });
        });
    });

    const simData = {
        barrios: barriosSelec,
        usuarios: usuariosSim,
        eventos: eventosSim,
        votos: votosSim,
        numEventosCelebrados,
        numEventosPendientes: 2
    };

    localStorage.setItem('simulacion_partida_completa', JSON.stringify(simData));
    localStorage.setItem('repositorio_votos_simulacion', JSON.stringify(votosSim));
    localStorage.setItem('modo_sandbox_simulacion', 'true');

    alert(`🎮 Partida simulada creada con éxito:\n- ${nBarrios} Barrios (${numEventosCelebrados} celebrados, 2 votaciones pendientes).\n- ${usuariosSim.length} Usuarios registrados.\n- ${votosSim.length} Votos generados.`);

    renderDashboardSimulacionCompleto();
    if (typeof renderRepositorioVotos === 'function') renderRepositorioVotos();
}

function renderDashboardSimulacionCompleto() {
    const raw = localStorage.getItem('simulacion_partida_completa');
    if (!raw) return;

    let simData = {};
    try {
        simData = JSON.parse(raw);
    } catch (e) {
        return;
    }

    const { barrios = [], usuarios = [], eventos = [], votos = [] } = simData;

    const banner = document.getElementById('sim-resumen-partida-banner');
    if (banner) banner.style.display = 'block';

    const statBarrios = document.getElementById('stat-num-barrios');
    const statUsuarios = document.getElementById('stat-num-usuarios');
    const statCelebrados = document.getElementById('stat-eventos-celebrados');
    const statPendientes = document.getElementById('stat-eventos-pendientes');
    const statTotalVotos = document.getElementById('stat-total-votos-sim');

    if (statBarrios) statBarrios.textContent = barrios.length;
    if (statUsuarios) statUsuarios.textContent = usuarios.length;
    if (statCelebrados) statCelebrados.textContent = eventos.filter(e => e.estado === 'celebrado').length;
    if (statPendientes) statPendientes.textContent = `${eventos.filter(e => e.estado === 'pendiente').length} (Votaciones por hacer)`;
    if (statTotalVotos) statTotalVotos.textContent = votos.length;

    renderGraficosSimulacion(simData);
    poblarFiltroBarriosDirectorioSim(barrios);
    renderDirectorioUsuariosSim();
    poblarSelectEventosSim(eventos);
    renderUsuariosPorEventoSim();
}

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

function renderGraficosSimulacion(simData) {
    const { barrios = [], eventos = [], votos = [] } = simData;

    const statsBarrios = barrios.map(barrio => {
        const votosB = votos.filter(v => (v.barrio || v.casa_visitada) === barrio);
        const total = votosB.length;
        if (total === 0) return { barrio, festin: 0, caminos: 0, espiritu: 0, notaFinal: 0 };
        const sumF = votosB.reduce((a, b) => a + Number(b.nota_festin || 0), 0);
        const sumC = votosB.reduce((a, b) => a + Number(b.nota_caminos || 0), 0);
        const sumE = votosB.reduce((a, b) => a + Number(b.nota_espiritu || 0), 0);

        const festin = (sumF / total);
        const caminos = (sumC / total);
        const espiritu = (sumE / total);
        const notaFinal = calcularNotaLeyII(festin, caminos, espiritu);

        return { barrio, festin: festin.toFixed(1), caminos: caminos.toFixed(1), espiritu: espiritu.toFixed(1), notaFinal: notaFinal.toFixed(2) };
    });

    createOrUpdateChart('chart-ranking-barrios', 'bar', {
        labels: statsBarrios.map(s => s.barrio),
        datasets: [{
            label: 'Puntuación Ley II (pts)',
            data: statsBarrios.map(s => s.notaFinal),
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

    const labelsEventos = eventos.map(e => e.barrio + (e.estado === 'pendiente' ? ' (Pendiente)' : ''));
    const dataVotosEventos = eventos.map(e => votos.filter(v => (v.barrio || v.casa_visitada) === e.barrio).length);

    createOrUpdateChart('chart-participacion-eventos', 'bar', {
        labels: labelsEventos,
        datasets: [{
            label: 'Votos Registrados',
            data: dataVotosEventos,
            backgroundColor: eventos.map(e => e.estado === 'pendiente' ? 'rgba(239, 68, 68, 0.8)' : 'rgba(59, 130, 246, 0.8)'),
            borderColor: eventos.map(e => e.estado === 'pendiente' ? '#dc2626' : '#2563eb'),
            borderWidth: 1.5
        }]
    }, {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
    });

    createOrUpdateChart('chart-criterios-barrios', 'bar', {
        labels: statsBarrios.map(s => s.barrio),
        datasets: [
            { label: 'Ocio Hostelero (50%)', data: statsBarrios.map(s => s.festin), backgroundColor: '#ef4444' },
            { label: 'Accesibilidad (20%)', data: statsBarrios.map(s => s.caminos), backgroundColor: '#3b82f6' },
            { label: 'Ambiente (30%)', data: statsBarrios.map(s => s.espiritu), backgroundColor: '#10b981' }
        ]
    }, {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, max: 10 } }
    });

    const celebradosCount = eventos.filter(e => e.estado === 'celebrado').length;
    const pendientesCount = eventos.filter(e => e.estado === 'pendiente').length;

    createOrUpdateChart('chart-progreso-votaciones', 'doughnut', {
        labels: ['Votaciones Celebradas', 'Votaciones Pendientes (Faltan 2)'],
        datasets: [{
            data: [celebradosCount, pendientesCount],
            backgroundColor: ['#22c55e', '#ef4444'],
            borderColor: '#0f172a',
            borderWidth: 2
        }]
    }, {
        responsive: true,
        maintainAspectRatio: false
    });
}

function poblarFiltroBarriosDirectorioSim(barrios) {
    const select = document.getElementById('select-filtro-barrio-sim');
    if (!select) return;
    select.innerHTML = `<option value="">Todos los Barrios (${barrios.length})</option>` +
        barrios.map(b => `<option value="${b}">${b}</option>`).join('');
}

function renderDirectorioUsuariosSim() {
    const tbody = document.getElementById('tabla-usuarios-simulacion-body');
    if (!tbody) return;

    const raw = localStorage.getItem('simulacion_partida_completa');
    if (!raw) return;

    const { usuarios = [], votos = [] } = JSON.parse(raw);
    const busqueda = (document.getElementById('input-buscar-usuario-sim')?.value || '').toLowerCase();
    const filtroBarrio = document.getElementById('select-filtro-barrio-sim')?.value || '';

    const usuariosFiltrados = usuarios.filter(u => {
        const coincideNombre = !busqueda || u.name.toLowerCase().includes(busqueda) || u.phone.includes(busqueda);
        const coincideBarrio = !filtroBarrio || u.barrio_representado === filtroBarrio || u.barrio_asignado === filtroBarrio;
        return coincideNombre && coincideBarrio;
    });

    if (usuariosFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #94a3b8;">No se encontraron usuarios con ese criterio.</td></tr>';
        return;
    }

    tbody.innerHTML = usuariosFiltrados.map(u => {
        const votosEmitidos = votos.filter(v => v.maestre_id === u.phone).length;
        const badgeRol = u.role === 'master' ? '🌟 Master' : (u.role === 'superadmin' ? '👑 Superadmin' : (u.role === 'tronista' ? '🛡️ Tronista' : '👤 Jugador'));
        return `
            <tr>
                <td><strong>${u.name}</strong></td>
                <td><code>${u.phone}</code></td>
                <td>${u.email || '-'}</td>
                <td><span class="pill-user" style="font-size: 0.75rem;">${badgeRol}</span></td>
                <td>${u.barrio_representado || 'Forastero'}</td>
                <td>${u.barrio_asignado || 'Forastero'}</td>
                <td><strong style="color: #60a5fa;">${votosEmitidos} votos</strong></td>
            </tr>
        `;
    }).join('');
}

function filtrarDirectorioUsuariosSim() {
    renderDirectorioUsuariosSim();
}

function poblarSelectEventosSim(eventos) {
    const select = document.getElementById('select-evento-usuarios-sim');
    if (!select) return;
    select.innerHTML = `<option value="">Selecciona un evento (${eventos.length})...</option>` +
        eventos.map(e => `<option value="${e.id}">${e.nombre} (${e.estado === 'pendiente' ? '⏳ PENDIENTE' : '✅ CELEBRADO'})</option>`).join('');
}

function renderUsuariosPorEventoSim() {
    const container = document.getElementById('detalles-evento-usuarios-content');
    const select = document.getElementById('select-evento-usuarios-sim');
    if (!container || !select) return;

    const evtId = select.value;
    if (!evtId) {
        container.innerHTML = '<div style="padding: 15px; text-align: center; color: #94a3b8;">Selecciona un evento del desplegable.</div>';
        return;
    }

    const raw = localStorage.getItem('simulacion_partida_completa');
    if (!raw) return;
    const { eventos = [], usuarios = [], votos = [] } = JSON.parse(raw);

    const evento = eventos.find(e => e.id === evtId);
    if (!evento) return;

    if (evento.estado === 'pendiente') {
        container.innerHTML = `
            <div style="padding: 20px; text-align: center; background: rgba(127,29,29,0.3); border: 1.5px dashed #f87171; border-radius: 8px;">
                <h4 style="color: #f87171; margin-top: 0;">⌛ Votación Pendiente de Celebración</h4>
                <p style="font-size: 0.9rem; color: #fca5a5; margin: 6px 0 0;">
                    El evento <strong>${evento.nombre}</strong> aún no se ha celebrado (Fecha: ${evento.fecha}).<br>
                    <strong>Faltan 2 votaciones por realizar en esta competición.</strong> Ningún usuario ha emitido voto todavía en esta justa.
                </p>
            </div>
        `;
        return;
    }

    const votosEvento = votos.filter(v => (v.barrio || v.casa_visitada) === evento.barrio);

    container.innerHTML = `
        <table class="leaderboard-table" style="font-size: 0.85rem; width: 100%;">
            <thead>
                <tr>
                    <th>Usuario Participante</th>
                    <th>Teléfono</th>
                    <th>Ocio Hostelero</th>
                    <th>Accesibilidad</th>
                    <th>Ambiente</th>
                    <th>Nota Final</th>
                </tr>
            </thead>
            <tbody>
                ${votosEvento.map(v => {
                    const notaLey2 = calcularNotaLeyII(v.nota_festin, v.nota_caminos, v.nota_espiritu).toFixed(2);
                    return `
                        <tr>
                            <td><strong>${v.maestre_nombre || v.maestre_id}</strong></td>
                            <td><code>${v.maestre_id}</code></td>
                            <td>${v.nota_festin}</td>
                            <td>${v.nota_caminos}</td>
                            <td>${v.nota_espiritu}</td>
                            <td><strong style="color: #facc15;">${notaLey2} pts</strong></td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
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
window.generarEjemploCompeticionSimulada = generarEjemploCompeticionSimulada;
window.restaurarCompeticionCero = restaurarCompeticionCero;
window.crearNuevoJuegoTorneo = crearNuevoJuegoTorneo;
window.eliminarVotoRepositorio = eliminarVotoRepositorio;
window.agregarNuevoCriterioJerarquico = agregarNuevoCriterioJerarquico;
window.eliminarCriterioJerarquico = eliminarCriterioJerarquico;
window.renderCriteriosJerarquicos = renderCriteriosJerarquicos;
window.getRepositorioVotos = getRepositorioVotos;
window.getEstadisticasAdmin = getEstadisticasAdmin;

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

window.generarPartidaSimulacionCompleta = generarPartidaSimulacionCompleta;
window.renderDashboardSimulacionCompleto = renderDashboardSimulacionCompleto;
window.renderDirectorioUsuariosSim = renderDirectorioUsuariosSim;
window.filtrarDirectorioUsuariosSim = filtrarDirectorioUsuariosSim;
window.renderUsuariosPorEventoSim = renderUsuariosPorEventoSim;

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

const ORACULO_MODELO_DEFECTO = 'llama-3.3-70b-versatile';

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

    const barrio = barrioSelect ? barrioSelect.value : 'Casco Viejo';
    const antojo = antojoInput && antojoInput.value.trim() ? antojoInput.value.trim() : 'Pintxos tradicionales y ambiente festivo';

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
    localStorage.setItem('repositorio_votos_simulacion', JSON.stringify([]));
    localStorage.setItem('modo_sandbox_simulacion', 'false');

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
        alert('Solo un superadministrador puede generar el sorteo.');
        return;
    }

    if (!client) {
        if (estado) estado.textContent = 'Error: no se ha podido inicializar Supabase.';
        return;
    }

    const pin = window.prompt('Introduce tu PIN de superadministrador para generar el sorteo:');
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
        alert('Solo un superadministrador puede guardar el orden.');
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

    const pin = window.prompt('Introduce tu PIN de superadministrador para guardar el orden:');
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

    if (!window.confirm('⚠️ Se borrarán votos, eventos, códigos diarios, barrios (excepto Forastero) y todas las cuentas salvo master/superadmin. Esta acción NO se puede deshacer. ¿Continuar?')) {
        return;
    }

    const pin = window.prompt('Introduce tu PIN de superadministrador para restaurar la competición:');
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
    seleccion: new Map()
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
        if (!res.ok) return;
        const json = await res.json();
        geoEstado.catalogo = json.ciudades || [];
    } catch (error) {
        console.warn('No se pudo cargar el catálogo geográfico:', error);
    }
    geoEstado.porIne = new Map(geoEstado.catalogo.map(c => [c.ine, c]));

    // Complementar con el catálogo completo de municipios desde Supabase (si existe).
    const client = (typeof getSupabaseBarriosClient === 'function') ? getSupabaseBarriosClient() : null;
    if (client) {
        try {
            const { data, error } = await client.from('ciudades')
                .select('id, nombre, provincia_id, tiene_distritos, tiene_barrios')
                .order('nombre', { ascending: true })
                .limit(9000);
            if (!error && Array.isArray(data) && data.length) {
                for (const c of data) {
                    if (!geoEstado.porIne.has(c.id)) {
                        geoEstado.porIne.set(c.id, {
                            ine: c.id, nombre: c.nombre, provincia: c.provincia_id,
                            geom: null, distritos: null, barrios: null, entidades: null,
                            centro: [null, null], tiene_distritos: c.tiene_distritos,
                            tiene_barrios: c.tiene_barrios
                        });
                    }
                }
            }
        } catch (error) {
            console.warn('Catálogo Supabase no disponible:', error);
        }
    }
    geoRenderDatalist();
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
}

function geoRenderCiudadesCargadas() {
    const cont = document.getElementById('geo-lista-ciudades-cargadas');
    if (!cont) return;
    cont.innerHTML = [...geoEstado.cargadas.values()].map(reg => {
        const activa = reg.info.ine === geoEstado.activa ? ' (activa)' : '';
        const marcada = geoEstado.seleccion.has(`ciudad:${reg.info.ine}`) ? ' checked' : '';
        return `<li><label><input type="checkbox" data-geo-ciudad="${geoEsc(reg.info.ine)}"${marcada}> ${geoEsc(reg.info.nombre)}${activa}</label></li>`;
    }).join('');
    cont.onclick = (ev) => {
        const input = ev.target.closest('input[data-geo-ciudad]');
        if (!input) return;
        const ine = input.dataset.geoCiudad;
        if (input.checked) {
            geoSeleccionar('ciudad', ine, geoReg(ine) && geoReg(ine).info.nombre, geoReg(ine));
        } else {
            geoQuitarSeleccion(`ciudad:${ine}`);
        }
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
        const on = geoEstado.seleccion.has(`distrito:${id}`) ? ' checked' : '';
        return `<li><label><input type="checkbox" data-geo-dist="${geoEsc(d.codigo)}"${on}>
            <span class="geo-barra-color" style="background:${geoEsc(d._color)}"></span> ${geoEsc(d.nombre)}</label></li>`;
    }).join('');
    cont.onclick = (ev) => {
        const input = ev.target.closest('input[data-geo-dist]');
        if (!input) return;
        const d = r.distritos.find(x => String(x.codigo) === String(input.dataset.geoDist));
        const id = `${r.info.ine}-${d.codigo}`;
        if (input.checked) geoSeleccionar('distrito', id, d.nombre, r, d);
        else geoQuitarSeleccion(`distrito:${id}`);
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
            const on = geoEstado.seleccion.has(`barrio:${id}`) ? ' checked' : '';
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
        if (input.checked) geoSeleccionar('barrio', id, b.nombre, r, b);
        else geoQuitarSeleccion(`barrio:${id}`);
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
        const on = geoEstado.seleccion.has(`cp:${id}`) ? ' checked' : '';
        return `<li><label><input type="checkbox" data-geo-cp="${geoEsc(cp)}"${on}> 📮 ${geoEsc(cp)}</label></li>`;
    }).join('');
    cont.onclick = (ev) => {
        const input = ev.target.closest('input[data-geo-cp]');
        if (!input) return;
        const cp = input.dataset.geoCp;
        const id = `${r.info.ine}-${cp}`;
        if (input.checked) geoSeleccionar('cp', id, cp, r);
        else geoQuitarSeleccion(`cp:${id}`);
    };
}

function geoSeleccionar(tipo, id, nombre, r, entidad) {
    let color = '#d4af37';
    if (tipo === 'distrito' && entidad) color = entidad._color;
    if (tipo === 'barrio' && entidad) color = entidad._color;
    geoEstado.seleccion.set(`${tipo}:${id}`, {
        tipo, id, nombre, color,
        ciudad: r ? r.info.ine : null,
        ciudadNombre: r ? r.info.nombre : null
    });
    geoRenderSeleccion();
}

function geoQuitarSeleccion(key) {
    geoEstado.seleccion.delete(key);
    geoRefrescarCheckboxes();
    geoRenderSeleccion();
}

function geoAlternarDesdeMapa(tipo, codigo, ine) {
    const r = (ine && geoReg(ine)) || (geoEstado.activa ? geoReg(geoEstado.activa) : null);
    if (!r || codigo === '' || codigo == null) return;
    if (tipo === 'barrio') {
        const b = r.barrios.find(x => String(x.codigo) === String(codigo));
        if (!b) return;
        const id = `${r.info.ine}-${b.distrito_codigo}-${b.codigo}`;
        geoAlternar('barrio', id, b.nombre, r, b);
    } else if (tipo === 'distrito') {
        const d = r.distritos.find(x => String(x.codigo) === String(codigo));
        if (!d) return;
        const id = `${r.info.ine}-${d.codigo}`;
        geoAlternar('distrito', id, d.nombre, r, d);
    }
}

function geoAlternar(tipo, id, nombre, r, entidad) {
    const key = `${tipo}:${id}`;
    if (geoEstado.seleccion.has(key)) geoEstado.seleccion.delete(key);
    else geoSeleccionar(tipo, id, nombre, r, entidad);
    geoRefrescarCheckboxes();
    geoRenderSeleccion();
}

function geoRefrescarCheckboxes() {
    geoRenderDistritos();
    geoRenderBarrios();
    geoRenderCps();
}

function geoRenderSeleccion() {
    const cont = document.getElementById('geo-seleccion');
    if (!cont) return;
    if (!geoEstado.seleccion.size) {
        cont.innerHTML = '<span style="color:#a1a1aa;">Sin selección. Marca distritos, barrios o códigos postales.</span>';
        return;
    }
    cont.innerHTML = [...geoEstado.seleccion.values()].map(s => {
        const etiqueta = s.tipo === 'cp' ? `📮 ${geoEsc(s.nombre)}` :
            `${geoEsc(s.nombre)} <em style="opacity:.7;">(${geoEsc(s.ciudadNombre || '')})</em>`;
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
    geoEstado.cargadas.clear();
    if (geoEstado.mapa) geoEstado.mapa.eachLayer(layer => {
        if (layer instanceof L.TileLayer) return;
        geoEstado.mapa.removeLayer(layer);
    });
    geoEstado.activa = null;
    geoRefrescarSegunActiva();
    const estado = document.getElementById('geo-estado');
    if (estado) estado.textContent = 'Selección limpiada.';
}

function geoInicializar() {
    const panel = document.getElementById('panel-geografia');
    if (!panel || panel.dataset.geoInit === '1') return;
    panel.dataset.geoInit = '1';

    const buscador = document.getElementById('geo-buscador-ciudad');
    const btnCargar = document.getElementById('geo-btn-cargar-ciudad');
    const btnLimpiar = document.getElementById('geo-btn-limpiar');

    const cargarDesdeBuscador = () => {
        const val = buscador ? buscador.value : '';
        const c = geoBuscarPorNombre(val);
        if (!c) {
            const estado = document.getElementById('geo-estado');
            if (estado) estado.textContent = 'No se encontró ese municipio. Escribe su nombre o código INE.';
            return;
        }
        if (buscador) buscador.value = c.nombre;
        geoCargarCiudad(c.ine);
    };

    if (btnCargar) btnCargar.addEventListener('click', cargarDesdeBuscador);
    if (buscador) buscador.addEventListener('change', cargarDesdeBuscador);
    if (btnLimpiar) btnLimpiar.addEventListener('click', geoLimpiar);

    geoCargarCatalogo();
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
window.geoEstado = geoEstado;
