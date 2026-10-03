// js/supabase.js
const SUPER_ADMIN_KEY = "BILBAO_REY_2026";

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
    // Ley II (Bilbao): Festín 50%, Caminos 25%, Espíritu 25%
    return (festin * 0.50) + (caminos * 0.25) + (espiritu * 0.25);
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
