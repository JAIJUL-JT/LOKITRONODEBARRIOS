const STORAGE_KEYS = {
    usuarioActual: 'usuario_actual',
    repositorioVotos: 'repositorio_votos',
    usuarios: 'usuarios_autorizados',
    barrios: 'barrios_reino'
};

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

function cambiarPestana(valor) {
    const sections = document.querySelectorAll('.tab-content');
    sections.forEach(section => {
        const shouldShow = section.id === valor || section.dataset.tab === valor;
        section.style.display = shouldShow ? 'block' : 'none';
        section.classList.toggle('active', shouldShow);
    });
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
                    <span><strong>Maestre en la corte:</strong> ${usuario.name} (${usuario.role})</span>
                    <button onclick="cerrarSesionDirecta()" class="btn-cuervo" style="padding: 4px 10px; font-size: 0.8rem; background: #7f1d1d;">🚪 Cerrar Sesión</button>
                </div>
            `;
        }
        if (nav) nav.style.display = 'block';
        if (contenido) contenido.style.display = 'block';
        if (optgroupAdmin) optgroupAdmin.style.display = usuario.role === 'superadmin' ? '' : 'none';
    } else {
        if (loginBox) loginBox.style.display = 'block';
        if (authStatus) {
            authStatus.style.display = 'none';
            authStatus.innerHTML = '';
        }
        if (nav) nav.style.display = 'none';
        if (contenido) contenido.style.display = 'none';
    }
}

function cerrarSesionDirecta() {
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
                { id: 'user-julio-01', phone: '605676002', name: 'Maestre Julio', role: 'superadmin', pin_code: '1234', barrio_representado: 'Indautxu', barrio_asignado: 'Indautxu' },
                { id: 'user-julio-02', phone: '+34605676002', name: 'Maestre Julio', role: 'superadmin', pin_code: '1234', barrio_representado: 'Indautxu', barrio_asignado: 'Indautxu' },
                { id: 'user-superadmin-01', phone: '123456789', name: 'Superadmin Bilbao', role: 'superadmin', pin_code: '1234', barrio_representado: 'Abando', barrio_asignado: 'Abando' },
                { id: 'user-superadmin-02', phone: 'admin', name: 'Superadmin Sistema', role: 'superadmin', pin_code: '1234', barrio_representado: 'Abando', barrio_asignado: 'Abando' },
                { id: 'user-soraya', phone: '456123456', name: 'SORAYA', role: 'superadmin', pin_code: '1234', barrio_representado: 'Deusto', barrio_asignado: 'Deusto' }
            ];
            localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(usuarios));
        } else {
            // Asegurar que las cuentas con teléfonos superadmin tengan el rol superadmin actualizado
            let actualizado = false;
            usuarios.forEach(u => {
                if (superadminPhones.includes(u.phone) && u.role !== 'superadmin') {
                    u.role = 'superadmin';
                    actualizado = true;
                }
            });
            if (actualizado) {
                localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(usuarios));
            }
        }
        return usuarios;
    } catch (e) {
        return [];
    }
}

function iniciarSesionDirecta() {
    const phoneInput = document.getElementById('input-phone-inicio');
    const pinInput = document.getElementById('input-pin-inicio');
    const message = document.getElementById('login-inicio-message');

    const phone = (phoneInput?.value || '').trim();
    const pin = (pinInput?.value || '').trim();

    if (!phone || !pin) {
        if (message) message.textContent = 'Completa teléfono y PIN para entrar.';
        return;
    }

    const usuarios = getUsuariosAutorizadosLocal();
    let usuarioExistente = usuarios.find(u => u.phone === phone);

    const superadminPhones = ['605676002', '+34605676002', '123456789', 'admin', '456123456'];
    const esSuperadmin = superadminPhones.includes(phone);

    if (!usuarioExistente) {
        usuarioExistente = {
            id: `user-${phone}`,
            phone,
            name: esSuperadmin ? 'Maestre Julio (Superadmin)' : phone,
            role: esSuperadmin ? 'superadmin' : 'jugador',
            barrio_representado: 'Indautxu',
            barrio_asignado: 'Indautxu',
            pin_code: pin
        };
        usuarios.push(usuarioExistente);
        localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(usuarios));
    } else if (esSuperadmin && usuarioExistente.role !== 'superadmin') {
        usuarioExistente.role = 'superadmin';
        localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(usuarios));
    }

    setCurrentUser(usuarioExistente);
    if (message) message.textContent = '';
    actualizarInterfazSesion(usuarioExistente);
}

function toggleFormularioEmitirVoto() {
    const panel = document.getElementById('formulario-emitir-voto-div');
    if (!panel) return;
    const isVisible = panel.style.display !== 'none';
    panel.style.display = isVisible ? 'none' : 'block';
}

function renderOpcionesVoto() {
    const select = document.getElementById('voto-select-barrio');
    if (select) {
        const barrios = ['Casco Viejo', 'Indautxu', 'Deusto', 'Santutxu', 'Abando', 'San Mamés - Basurto'];
        select.innerHTML = barrios.map(barrio => `<option value="${barrio}">${barrio}</option>`).join('');
    }

    const container = document.getElementById('contenedor-inputs-criterios-voto');
    if (container) container.innerHTML = buildCriteriosVotoMarkup();
}

function validarNotas(notas) {
    for (const key in notas) {
        if (notas[key] > 10 || notas[key] < 0) return false;
    }
    return true;
}

function guardarVotoBarrioUsuario(event) {
    if (event) event.preventDefault();

    const user = getCurrentUser();
    if (!user) {
        alert('Debe iniciar sesión antes de emitir un voto.');
        return;
    }

    const select = document.getElementById('voto-select-barrio');
    const barrio = select ? select.value : 'Forastero';
    const values = document.querySelectorAll('[data-criterio]');
    const notas = {};
    values.forEach(input => {
        notas[input.dataset.criterio] = Number(input.value || 0);
    });

    if (!validarNotas(notas)) {
        alert('El límite máximo del Reino es de 10 puntos por criterio.');
        return;
    }

    const voto = {
        maestre_id: user.phone || user.id,
        casa_visitada: barrio,
        barrio,
        nota_festin: Number(notas['crit-festin-sabor'] || notas['crit-festin'] || 8),
        nota_caminos: Number(notas['crit-caminos'] || 8),
        nota_espiritu: Number(notas['crit-espiritu'] || 8),
        detalles_notas: notas,
        fecha_juicio: new Date().toISOString()
    };

const CRITERIOS_JERARQUICOS_DEFAULT = [
    { id: 'crit-festin', nombre: 'Festín / Pintxos', parentId: null, peso: 50, nivel: 1 },
    { id: 'crit-festin-sabor', nombre: 'Sabor & Calidad', parentId: 'crit-festin', peso: 60, nivel: 2 },
    { id: 'crit-festin-presentacion', nombre: 'Presentación', parentId: 'crit-festin', peso: 40, nivel: 2 },
    { id: 'crit-caminos', nombre: 'Caminos / Rutas', parentId: null, peso: 20, nivel: 1 },
    { id: 'crit-espiritu', nombre: 'Espíritu / Ambiente', parentId: null, peso: 30, nivel: 1 }
];

function getCriteriosJerarquicos() {
    try {
        const raw = localStorage.getItem('criterios_valoracion_jerarquicos');
        return raw ? JSON.parse(raw) : CRITERIOS_JERARQUICOS_DEFAULT;
    } catch (e) {
        return CRITERIOS_JERARQUICOS_DEFAULT;
    }
}

function guardarCriteriosJerarquicos(criterios) {
    localStorage.setItem('criterios_valoracion_jerarquicos', JSON.stringify(criterios));
}

function calcularNivelElemento(parentId, criterios) {
    if (!parentId) return 1;
    const padre = criterios.find(c => c.id === parentId);
    if (!padre) return 1;
    return (padre.nivel || 1) + 1;
}

function agregarNuevoCriterioJerarquico() {
    const usuario = getCurrentUser();
    if (!usuario || usuario.role !== 'superadmin') {
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
    if (!usuario || usuario.role !== 'superadmin') {
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
            <input id="voto-${criterio.id}" data-criterio="${criterio.id}" type="number" min="0" max="10" value="8" required>
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
    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `SUMMARY:${safeName}`,
        `DTSTART:${start}`,
        `DTEND:${start}`,
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
    return false;
}

function renderRepositorioVotos() {
    const cuerpo = document.getElementById('repositorio-votos-body');
    if (!cuerpo) return;
    const key = getStorageKeyVotos ? getStorageKeyVotos() : STORAGE_KEYS.repositorioVotos;
    const votos = JSON.parse(localStorage.getItem(key) || '[]');
    const user = getCurrentUser ? getCurrentUser() : null;
    const esAdmin = user && user.role === 'superadmin';

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
    if (!user || user.role !== 'superadmin') {
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

function renderClasificacionReal() {
    const cuerpo = document.getElementById('clasificacion-body');
    if (!cuerpo) return;

    const votos = getRepositorioVotos();
    const barrios = ['Casco Viejo', 'Indautxu', 'Deusto', 'Santutxu', 'Abando', 'San Mamés - Basurto'];

    const estadisticas = barrios.map(barrio => {
        const votosBarrio = votos.filter(v => (v.barrio || v.casa_visitada) === barrio);
        const totalVotos = votosBarrio.length;
        if (totalVotos === 0) {
            return { barrio, festin: 0, caminos: 0, espiritu: 0, notaFinal: 0, totalVotos: 0 };
        }
        const sumFestin = votosBarrio.reduce((acc, v) => acc + Number(v.nota_festin || 0), 0);
        const sumCaminos = votosBarrio.reduce((acc, v) => acc + Number(v.nota_caminos || 0), 0);
        const sumEspiritu = votosBarrio.reduce((acc, v) => acc + Number(v.nota_espiritu || 0), 0);

        const festin = (sumFestin / totalVotos).toFixed(1);
        const caminos = (sumCaminos / totalVotos).toFixed(1);
        const espiritu = (sumEspiritu / totalVotos).toFixed(1);
        const notaFinal = (festin * 0.5 + caminos * 0.2 + espiritu * 0.3).toFixed(2);

        return { barrio, festin, caminos, espiritu, notaFinal, totalVotos };
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
    if (!usuario || usuario.role !== 'superadmin') {
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
    if (!usuario || usuario.role !== 'superadmin') {
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
    if (!usuario || usuario.role !== 'superadmin') {
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
    try {
        const raw = localStorage.getItem('eventos_feudales_custom');
        const customEvents = raw ? JSON.parse(raw) : [];
        return [...EVENTOS_FEUDALES, ...customEvents];
    } catch (e) {
        return EVENTOS_FEUDALES;
    }
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

    if (evento.cerrado_manualmente) {
        return {
            estado: 'FINALIZADA',
            texto: `🔒 Votación Finalizada (Resultados Actualizados)`,
            clase: 'badge-cerrado',
            horaInicio,
            horaFin
        };
    }

    const ahora = new Date();
    const hoyStr = ahora.toISOString().split('T')[0];

    if (evento.fecha < hoyStr) {
        return {
            estado: 'FINALIZADA',
            texto: `🔒 Votación Finalizada (Resultados Publicados)`,
            clase: 'badge-cerrado',
            horaInicio,
            horaFin
        };
    }

    if (evento.fecha === hoyStr) {
        const ahoraHHMM = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
        if (ahoraHHMM > horaFin) {
            return {
                estado: 'FINALIZADA',
                texto: `🔒 Votación Finalizada (Cerró a las ${horaFin})`,
                clase: 'badge-cerrado',
                horaInicio,
                horaFin
            };
        } else if (ahoraHHMM >= horaInicio && ahoraHHMM <= horaFin) {
            return {
                estado: 'ABIERTA',
                texto: `🟢 Votación Abierta (${horaInicio} - ${horaFin})`,
                clase: 'badge-abierto',
                horaInicio,
                horaFin
            };
        } else {
            return {
                estado: 'NO_INICIADA',
                texto: `⏳ Votación No Iniciada (Empieza a las ${horaInicio})`,
                clase: 'badge-pendiente',
                horaInicio,
                horaFin
            };
        }
    }

    return {
        estado: 'NO_INICIADA',
        texto: `⏳ Votación Programada (Votación: ${horaInicio} a ${horaFin})`,
        clase: 'badge-pendiente',
        horaInicio,
        horaFin
    };
}

function renderEventos() {
    const lista = document.getElementById('lista-eventos');
    const tituloCronica = document.getElementById('titulo-cronica-eventos');
    const btnResetFiltro = document.getElementById('btn-reset-filtro-fecha');
    const panelAdmin = document.getElementById('contenedor-gestion-eventos-admin');

    const currentUser = getCurrentUser();
    const esAdmin = currentUser && currentUser.role === 'superadmin';

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
        const votosEvt = repositorioVotos.filter(v => (v.barrio || v.casa_visitada) === evt.barrio);
        const numVotos = votosEvt.length;

        let resumenResultadosHTML = '';
        if (numVotos > 0) {
            const sumF = votosEvt.reduce((a, b) => a + Number(b.nota_festin || 0), 0);
            const sumC = votosEvt.reduce((a, b) => a + Number(b.nota_caminos || 0), 0);
            const sumE = votosEvt.reduce((a, b) => a + Number(b.nota_espiritu || 0), 0);

            const mediaF = (sumF / numVotos).toFixed(1);
            const mediaC = (sumC / numVotos).toFixed(1);
            const mediaE = (sumE / numVotos).toFixed(1);
            const notaLey2 = (mediaF * 0.5 + mediaC * 0.2 + mediaE * 0.3).toFixed(2);

            resumenResultadosHTML = `
                <div style="margin: 12px 0; background: rgba(20, 30, 20, 0.8); border: 1px solid #22c55e; padding: 10px; border-radius: 6px;">
                    <div style="font-size: 0.8rem; color: #4ade80; font-weight: bold; margin-bottom: 4px;">
                        📊 RESULTADOS OFICIALES ACTUALIZADOS (${numVotos} VOTOS)
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.82rem; color: #d6d3d1;">
                        <span>Festín: <strong>${mediaF}</strong></span>
                        <span>Caminos: <strong>${mediaC}</strong></span>
                        <span>Espíritu: <strong>${mediaE}</strong></span>
                    </div>
                    <div style="margin-top: 4px; font-size: 0.95rem; color: var(--oro-brillante); font-weight: bold; text-align: center;">
                        🏆 Media Ley II: ${notaLey2} pts
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
                    <span style="font-size: 0.82rem; color: var(--oro-brillante); font-weight: bold;">📅 ${evt.fecha} (${evt.hora || '20:00'})</span>
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
    const targetInicio = new Date(`${fechaEvtStr}T${horaInicio}:00`);
    const targetFin = new Date(`${fechaEvtStr}T${horaFin}:00`);
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

function editarEventoBarrio(eventoId) {
    const user = getCurrentUser();
    if (!user || user.role !== 'superadmin') {
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
    document.getElementById('evento-lugar').value = evt.lugar || '';
    document.getElementById('evento-hora').value = evt.hora || '20:00';
    document.getElementById('evento-votacion-inicio').value = evt.hora_inicio_votacion || '20:30';
    document.getElementById('evento-votacion-fin').value = evt.hora_fin_votacion || '23:30';
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
}

function resetFormEvento() {
    const form = document.getElementById('form-evento');
    if (form) form.reset();
    const editId = document.getElementById('evento-id-edit');
    if (editId) editId.value = '';
    const btnGuardar = document.getElementById('btn-guardar-evento');
    const btnCancelar = document.getElementById('btn-cancelar-evento');
    if (btnGuardar) btnGuardar.textContent = '📅 Programar / Editar Evento';
    if (btnCancelar) btnCancelar.style.display = 'none';
}

function eliminarEventoBarrio(eventoId) {
    const user = getCurrentUser();
    if (!user || user.role !== 'superadmin') {
        alert('Solo el Superadministrador puede borrar eventos.');
        return;
    }

    if (confirm('🗑️ ¿Seguro que deseas eliminar este evento del calendario oficial?')) {
        const raw = localStorage.getItem('eventos_feudales_custom');
        let customEvents = raw ? JSON.parse(raw) : [];
        customEvents = customEvents.filter(e => e.id !== eventoId);
        localStorage.setItem('eventos_feudales_custom', JSON.stringify(customEvents));

        alert('✅ Evento eliminado correctamente.');
        actualizarCalendarioMedieval();
    }
}

function toggleCerrarVotacionEvento(eventoId) {
    const user = getCurrentUser();
    if (!user || user.role !== 'superadmin') {
        alert('Solo el Superadministrador puede cerrar o abrir votaciones.');
        return;
    }

    const raw = localStorage.getItem('eventos_feudales_custom');
    let customEvents = raw ? JSON.parse(raw) : [];
    let evt = customEvents.find(e => e.id === eventoId);

    if (!evt) {
        const defEvt = EVENTOS_FEUDALES.find(e => e.id === eventoId);
        if (defEvt) {
            evt = { ...defEvt };
            customEvents.push(evt);
        }
    }

    if (evt) {
        evt.cerrado_manualmente = !evt.cerrado_manualmente;
        localStorage.setItem('eventos_feudales_custom', JSON.stringify(customEvents));
        alert(`✅ Votación del evento "${evt.nombre}" ${evt.cerrado_manualmente ? 'CERRADA y finalizada' : 'REABIERTAS'}.`);
        actualizarCalendarioMedieval();
    }
}

function guardarEventoBarrio(event) {
    if (event) event.preventDefault();

    const user = getCurrentUser();
    if (!user || user.role !== 'superadmin') {
        alert('Solo el Superadministrador puede programar o editar eventos.');
        return;
    }

    const editId = document.getElementById('evento-id-edit')?.value;
    const barrio = document.getElementById('evento-barrio')?.value;
    const nombre = document.getElementById('evento-nombre')?.value;
    const fecha = document.getElementById('evento-fecha')?.value;
    const lugar = document.getElementById('evento-lugar')?.value;
    const hora = document.getElementById('evento-hora')?.value || '20:00';
    const horaInicioVotacion = document.getElementById('evento-votacion-inicio')?.value || '20:30';
    const horaFinVotacion = document.getElementById('evento-votacion-fin')?.value || '23:30';
    const desc = document.getElementById('evento-desc')?.value;

    if (!nombre || !fecha || !lugar) {
        alert('Por favor completa los campos obligatorios del evento.');
        return;
    }

    const raw = localStorage.getItem('eventos_feudales_custom');
    let customEvents = raw ? JSON.parse(raw) : [];

    if (editId) {
        const idx = customEvents.findIndex(e => e.id === editId);
        if (idx !== -1) {
            customEvents[idx] = {
                ...customEvents[idx],
                nombre,
                barrio,
                fecha,
                lugar,
                hora,
                hora_inicio_votacion: horaInicioVotacion,
                hora_fin_votacion: horaFinVotacion,
                desc
            };
        } else {
            customEvents.push({
                id: editId,
                nombre,
                barrio,
                fecha,
                lugar,
                hora,
                hora_inicio_votacion: horaInicioVotacion,
                hora_fin_votacion: horaFinVotacion,
                desc
            });
        }
        alert(`✅ Evento "${nombre}" actualizado correctamente.`);
    } else {
        const nuevoEvento = {
            id: `evt-custom-${Date.now()}`,
            nombre,
            barrio,
            fecha,
            lugar,
            hora,
            hora_inicio_votacion: horaInicioVotacion,
            hora_fin_votacion: horaFinVotacion,
            desc
        };
        customEvents.push(nuevoEvento);
        alert(`✅ Evento "${nombre}" guardado y publicado en el calendario feudal.`);
    }

    localStorage.setItem('eventos_feudales_custom', JSON.stringify(customEvents));
    resetFormEvento();
    actualizarCalendarioMedieval();
}


function poblarSelectBarriosEvento() {
    const select = document.getElementById('evento-barrio');
    if (select) {
        const barrios = ['Casco Viejo', 'Indautxu', 'Deusto', 'Santutxu', 'Abando', 'San Mamés - Basurto'];
        select.innerHTML = barrios.map(b => `<option value="${b}">${b}</option>`).join('');
    }
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
    const esAdmin = currentUser && currentUser.role === 'superadmin';

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
    if (!user || user.role !== 'superadmin') {
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
    if (!user || user.role !== 'superadmin') {
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

function initApp() {
    poblarSelectBarriosEvento();
    initCalendarioMedieval();
    renderGalaFinal();
    renderRepositorioVotos();
    renderOpcionesVoto();
    if (typeof renderCriteriosJerarquicos === 'function') renderCriteriosJerarquicos();
    if (typeof renderClasificacionReal === 'function') renderClasificacionReal();
    if (typeof renderDashboardSimulacionCompleto === 'function') renderDashboardSimulacionCompleto();
    if (typeof iniciarTimerRelojCuentaAtras === 'function') iniciarTimerRelojCuentaAtras();
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
    if (!usuario || usuario.role !== 'superadmin') {
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
                pin_code: '1234',
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
        const esUsrSuperadmin = usr.role === 'superadmin' || superadminPhones.includes(usr.phone);
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
        const notaFinal = (festin * 0.5 + caminos * 0.2 + espiritu * 0.3);

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
            { label: 'Festín (50%)', data: statsBarrios.map(s => s.festin), backgroundColor: '#ef4444' },
            { label: 'Caminos (20%)', data: statsBarrios.map(s => s.caminos), backgroundColor: '#3b82f6' },
            { label: 'Espíritu (30%)', data: statsBarrios.map(s => s.espiritu), backgroundColor: '#10b981' }
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
        const badgeRol = u.role === 'superadmin' ? '👑 Superadmin' : (u.role === 'tronista' ? '🛡️ Tronista' : '👤 Jugador');
        return `
            <tr>
                <td><strong>${u.name}</strong></td>
                <td><code>${u.phone}</code></td>
                <td>${u.email || '-'}</td>
                <td><span class="pill-user" style="font-size: 0.75rem;">${badgeRol}</span></td>
                <td>${u.barrio_representado || 'Forastero'}</td>
                <td>${u.barrio_asignado || '-'}</td>
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
                    <th>Festín</th>
                    <th>Caminos</th>
                    <th>Espíritu</th>
                    <th>Nota Ley II</th>
                </tr>
            </thead>
            <tbody>
                ${votosEvento.map(v => {
                    const notaLey2 = ((v.nota_festin * 0.5) + (v.nota_caminos * 0.2) + (v.nota_espiritu * 0.3)).toFixed(2);
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
window.descargarICSEvento = descargarICSEvento;
window.cambiarPestana = cambiarPestana;
window.iniciarSesionDirecta = iniciarSesionDirecta;
window.cerrarSesionDirecta = cerrarSesionDirecta;
window.toggleFormularioEmitirVoto = toggleFormularioEmitirVoto;
window.guardarVotoBarrioUsuario = guardarVotoBarrioUsuario;
window.exportarRepositorioCSV = exportarRepositorioCSV;
window.puedeGestionarUsuarios = puedeGestionarUsuarios;
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



