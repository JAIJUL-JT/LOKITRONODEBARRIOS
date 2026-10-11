// js/supabase.js
// La clave de superadministrador se configura en runtime (window.__APP_CONFIG__.SUPERADMIN_KEY).
// No se incrusta ningún secreto en el código fuente.
const SUPER_ADMIN_KEY = (typeof window !== 'undefined' && window.__APP_CONFIG__ && window.__APP_CONFIG__.SUPERADMIN_KEY) || "";

/**
 * Emite un juicio de valor sobre una casa culinaria.
 * Mantiene la restricción estricta de Voto Único Compuesto.
 */
async function emitirJuicio(maestreId, casaId, barrio, notas) {
    // Validación de Voto Único
    const yaVotado = verificarVotoExistente(maestreId, casaId);
    if (yaVotado) {
        alert("🛡️ ¡Alto! Un Maestre no puede juzgar la misma casa más de una vez.");
        return null;
    }

    // TRABA ELIMINADA: Ahora se permite una puntuación máxima de 10 puntos del Reino
    if (notas.festin > 10 || notas.caminos > 10 || notas.espiritu > 10) {
        alert("El límite máximo del Reino es de 10 puntos.");
        return null;
    }

    const payload = {
        maestre_id: maestreId,
        casa_visitada: casaId,
        barrio: barrio,
        nota_festin: notas.festin,
        nota_caminos: notas.caminos,
        nota_espiritu: notas.espiritu,
        fecha_juicio: new Date().toISOString()
    };

    console.log("Guardando juicio en el Repositorio Central...", payload);
    guardarEnRespaldo(payload);
    return { success: true, data: payload };
}

function calcularMediaPonderada(festin, caminos, espiritu) {
    // Códice de la Villa: Ocio Hostelero 50%, Accesibilidad 20%, Ambiente de Barrio 30%
    return (festin * 0.50) + (caminos * 0.20) + (espiritu * 0.30);
}

function verificarVotoExistente(maestreId, casaId) {
    const historico = JSON.parse(localStorage.getItem('repositorio_votos') || '[]');
    return historico.some(v => v.maestre_id === maestreId && v.casa_visitada === casaId);
}

function guardarEnRespaldo(voto) {
    const historico = JSON.parse(localStorage.getItem('repositorio_votos') || '[]');
    historico.push(voto);
    localStorage.setItem('repositorio_votos', JSON.stringify(historico));
}

function verificarClaveSuperAdmin(clave) {
    return typeof clave === 'string' && clave.trim() === SUPER_ADMIN_KEY;
}

function getRepositorioVotos() {
    try {
        const votos = JSON.parse(localStorage.getItem('repositorio_votos') || '[]');
        return Array.isArray(votos) ? votos : [];
    } catch (e) {
        return [];
    }
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
        votos:
            votos.map(voto => ({
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
