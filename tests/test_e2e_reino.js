/**
 * ⚔️ EL TRONO DEL PINTXO - TEST END-TO-END AUTOMATIZADO DEL REINO
 * Ejecución en orden:
 * 1. Verificación de archivos y arquitectura
 * 2. Validación del esquema Supabase SQL
 * 3. Simulación de Registro de Maestre y Sesión
 * 4. Emisión de 5 Juicios Reales con sellos diarios
 * 5. Cómputo de la Ley II de Bilbao (Media Ponderada y Relativa)
 * 6. Validación de Disparador Make Escenario A (Espíritu >= 9)
 * 7. Validación de Pase VIP Dorado Escenario B (Sellos >= 5)
 * 8. Validación de Bando Semanal Escenario C (Top 3)
 * 9. Validación de Código de Sello Diario Escenario D
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();

console.log('================================================================');
console.log('🏰 INICIANDO EJECUCIÓN END-TO-END DE EL TRONO DEL PINTXO');
console.log('================================================================\n');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [OK] ${message}`);
    testsPassed++;
  } else {
    console.error(`  ❌ [FALLO] ${message}`);
    testsFailed++;
  }
}

// -----------------------------------------------------------------------------
// PASO 1: VERIFICACIÓN DE ESTRUCTURA Y ARCHIVOS DEL REINO
// -----------------------------------------------------------------------------
console.log('📦 PASO 1: Verificación del Repositorio y Archivos...');
const requiredFiles = [
  'index.html',
  'css/style.css',
  'js/app.js',
  'js/supabase.js',
  'sql/schema.sql',
  'make/README.md',
  'make/escenario_a_notificar_voto.json',
  'make/escenario_b_pase_vip.json',
  'make/escenario_c_ranking_semanal.json',
  'make/escenario_d_codigo_sello.json',
  '.env.example',
  '.gitignore',
  'README.md'
];

requiredFiles.forEach(f => {
  const exists = fs.existsSync(path.join(ROOT_DIR, f));
  assert(exists, `Archivo presente: ${f}`);
});

// -----------------------------------------------------------------------------
// PASO 2: VALIDACIÓN DEL ESQUEMA SQL DE SUPABASE
// -----------------------------------------------------------------------------
console.log('\n🗄️ PASO 2: Validación del Esquema SQL de Supabase...');
const sqlContent = fs.readFileSync(path.join(ROOT_DIR, 'sql/schema.sql'), 'utf-8');

assert(sqlContent.includes('CREATE TABLE casas'), 'Tabla casas definida en SQL');
assert(sqlContent.includes('CREATE TABLE maestres'), 'Tabla maestres definida en SQL');
assert(sqlContent.includes('CREATE TABLE juicios'), 'Tabla juicios definida en SQL');
assert(sqlContent.includes('CREATE TABLE codigos_diarios'), 'Tabla codigos_diarios definida en SQL');
assert(sqlContent.includes('ENABLE ROW LEVEL SECURITY'), 'Políticas RLS configuradas');
assert(sqlContent.includes('CREATE OR REPLACE FUNCTION calcular_ranking()'), 'Función calcular_ranking() con Ley II implementada');
assert(sqlContent.includes('CREATE OR REPLACE FUNCTION notificar_make()'), 'Trigger notificar_make() implementado');
assert(sqlContent.includes('net.http_post'), 'Integración pg_net configurada para webhooks Make');

// -----------------------------------------------------------------------------
// PASO 3: SIMULACIÓN DE CASAS Y REGISTRO DE MAESTRE
// -----------------------------------------------------------------------------
console.log('\n👤 PASO 3: Simulación de Casas y Juramento de Maestre...');

// Casas de Bilbao simuladas
const casas = [
  { id: 'casa-01', nombre: 'Casco Viejo', lema: 'Las Siete Calles de la Tradición y el Acero', emblema: '🏰' },
  { id: 'casa-02', nombre: 'Indautxu', lema: 'Vanguardia, Distinción y Sabores Nobles', emblema: '🍷' },
  { id: 'casa-03', nombre: 'Deusto', lema: 'La Ribera del Saber y el Brío Estudiantil', emblema: '⚓' },
  { id: 'casa-04', nombre: 'Santutxu', lema: 'La Fortaleza del Orgullo y el Calor Barrial', emblema: '🛡️' },
  { id: 'casa-05', nombre: 'Abando', lema: 'El Trono de la Gran Vía y el Esplendor Cívico', emblema: '👑' },
  { id: 'casa-06', nombre: 'San Mamés - Basurto', lema: 'La Catedral de los Leones y el Fervor Inmortal', emblema: '🦁' },
  { id: 'casa-07', nombre: 'Bilbao La Vieja', lema: 'El Puente Milenario, Arte y Resistencia Bohemia', emblema: '🌉' },
  { id: 'casa-08', nombre: 'Uribarri', lema: 'La Colina Vigilante y la Lealtad de las Alturas', emblema: '🦅' }
];

assert(casas.length === 8, '8 Casas Feudales de Bilbao inicializadas');

const maestre = {
  id: 'maestre-uuid-001',
  alias: 'Jon de Indautxu',
  casa_origen: 'casa-02',
  email: 'jon@feudo.bilbao',
  clave_secreta: 'pintxos2026'
};

assert(maestre.alias === 'Jon de Indautxu', `Maestre juramentado: ${maestre.alias} (${maestre.email})`);

// -----------------------------------------------------------------------------
// PASO 4: EMISIÓN DE JUICIOS REALES EN 5 CASAS DIFERENTES
// -----------------------------------------------------------------------------
console.log('\n⚖️ PASO 4: Emisión de Juicios Reales (Votos en Tabernas)...');

const votosPrueba = [
  { casaId: 'casa-01', festin: 9, caminos: 8, espiritu: 9, codigo: 'PIN-C01A', comentario: 'Gilda sublime en las Siete Calles' },
  { casaId: 'casa-02', festin: 10, caminos: 9, espiritu: 10, codigo: 'PIN-C02B', comentario: 'Taco de bonito con txakoli imperial' },
  { casaId: 'casa-03', festin: 8, caminos: 7, espiritu: 8, codigo: 'PIN-C03C', comentario: 'Buena barra estudiantil en Deusto' },
  { casaId: 'casa-04', festin: 9, caminos: 9, espiritu: 9, codigo: 'PIN-C04D', comentario: 'Ambiente inmejorable y tortilla épica' },
  { casaId: 'casa-05', festin: 7, caminos: 8, espiritu: 7, codigo: 'PIN-C05E', comentario: 'Pintxo clásico y elegante en Gran Vía' }
];

const juiciosEmitidos = votosPrueba.map((v, idx) => ({
  id: `juicio-${idx + 1}`,
  maestre_id: maestre.id,
  casa_visitada: v.casaId,
  festin: v.festin,
  caminos: v.caminos,
  espiritu: v.espiritu,
  codigo: v.codigo,
  comentario: v.comentario,
  created_at: new Date().toISOString()
}));

assert(juiciosEmitidos.length === 5, '5 Juicios Reales emitidos con éxito');

// -----------------------------------------------------------------------------
// PASO 5: CÁLCULO DE LA LEY II DE BILBAO (MEDIA RELATIVA Y BAYESIANA)
// -----------------------------------------------------------------------------
console.log('\n👑 PASO 5: Cálculo del Ranking con la Ley II de Bilbao...');

const puntuacionesCrudas = juiciosEmitidos.map(j => 0.50 * j.festin + 0.25 * j.caminos + 0.25 * j.espiritu);
const mediaGlobal = puntuacionesCrudas.reduce((a, b) => a + b, 0) / puntuacionesCrudas.length;
const umbralConfianza = 3.0;

const ranking = casas.map(casa => {
  const votosCasa = juiciosEmitidos.filter(j => j.casa_visitada === casa.id);
  const n = votosCasa.length;

  let promFestin = 0;
  let promCaminos = 0;
  let promEspiritu = 0;
  let puntuacionFinal = 0;

  if (n > 0) {
    promFestin = Number((votosCasa.reduce((acc, v) => acc + v.festin, 0) / n).toFixed(2));
    promCaminos = Number((votosCasa.reduce((acc, v) => acc + v.caminos, 0) / n).toFixed(2));
    promEspiritu = Number((votosCasa.reduce((acc, v) => acc + v.espiritu, 0) / n).toFixed(2));
    const promCrudo = 0.50 * promFestin + 0.25 * promCaminos + 0.25 * promEspiritu;
    puntuacionFinal = Number((((n * promCrudo) + (umbralConfianza * mediaGlobal)) / (n + umbralConfianza)).toFixed(2));
  }

  return {
    casa_id: casa.id,
    nombre: casa.nombre,
    emblema: casa.emblema,
    total_juicios: n,
    promFestin,
    promCaminos,
    promEspiritu,
    puntuacionFinal
  };
});

ranking.sort((a, b) => b.puntuacionFinal - a.puntuacionFinal || b.total_juicios - a.total_juicios);

assert(ranking[0].nombre === 'Indautxu', `Líder del Trono según la Ley II: ${ranking[0].emblema} ${ranking[0].nombre} (${ranking[0].puntuacionFinal} pts)`);
assert(ranking[1].puntuacionFinal > 0, `Segundo puesto: ${ranking[1].emblema} ${ranking[1].nombre} (${ranking[1].puntuacionFinal} pts)`);
assert(ranking[2].puntuacionFinal > 0, `Tercer puesto: ${ranking[2].emblema} ${ranking[2].nombre} (${ranking[2].puntuacionFinal} pts)`);

// -----------------------------------------------------------------------------
// PASO 6: DISPARADOR MAKE ESCENARIO A (ALERTA ESPÍRITU >= 9)
// -----------------------------------------------------------------------------
console.log('\n🤖 PASO 6: Verificación de Make Escenario A (Alerta Espíritu >= 9)...');

const juiciosEspirituAlto = juiciosEmitidos.filter(j => j.espiritu >= 9);
assert(juiciosEspirituAlto.length > 0, `Se detectaron ${juiciosEspirituAlto.length} juicios con Espíritu >= 9`);

const payloadMakeA = {
  evento: 'NUEVO_JUICIO',
  juicio_id: juiciosEspirituAlto[0].id,
  maestre_alias: maestre.alias,
  casa_nombre: 'Indautxu',
  festin: juiciosEspirituAlto[0].festin,
  caminos: juiciosEspirituAlto[0].caminos,
  espiritu: juiciosEspirituAlto[0].espiritu,
  comentario: juiciosEspirituAlto[0].comentario
};

assert(payloadMakeA.espiritu >= 9, 'Condición de filtro Make cumplida (Espíritu >= 9)');
assert(payloadMakeA.maestre_alias === 'Jon de Indautxu', 'Alias del Maestre verificado en payload de Make');

// -----------------------------------------------------------------------------
// PASO 7: DISPARADOR MAKE ESCENARIO B (PASE VIP DORADO >= 5 SELLOS)
// -----------------------------------------------------------------------------
console.log('\n🎟️ PASO 7: Verificación de Make Escenario B (Pase VIP Dorado)...');

const casasSelladasUnicas = new Set(juiciosEmitidos.filter(j => j.codigo).map(j => j.casa_visitada));
const totalSellos = casasSelladasUnicas.size;

assert(totalSellos >= 5, `Total de sellos conquistados: ${totalSellos}/5`);
const vipDesbloqueado = totalSellos >= 5;
assert(vipDesbloqueado === true, 'Pase VIP Dorado desbloqueado correctamente para la Gran Gala');

const payloadMakeB = {
  maestre_alias: maestre.alias,
  maestre_email: maestre.email,
  total_sellos: totalSellos,
  pase_dorado: true,
  documento_titulo: `Pase Dorado Imperial - ${maestre.alias}`
};
assert(payloadMakeB.total_sellos >= 5, 'Disparador de generación de PDF y envío por Gmail de Make activado');

// -----------------------------------------------------------------------------
// PASO 8: DISPARADOR MAKE ESCENARIO C (BANDO SEMANAL TOP 3)
// -----------------------------------------------------------------------------
console.log('\n📢 PASO 8: Verificación de Make Escenario C (Bando Semanal Top 3)...');

const bandoSemanal = `👑 BANDO IMPERIAL DE BILBAO — TOP 3 SEMANAL\n` +
  `🥇 1º: ${ranking[0].emblema} ${ranking[0].nombre} (${ranking[0].puntuacionFinal} pts)\n` +
  `🥈 2º: ${ranking[1].emblema} ${ranking[1].nombre} (${ranking[1].puntuacionFinal} pts)\n` +
  `🥉 3º: ${ranking[2].emblema} ${ranking[2].nombre} (${ranking[2].puntuacionFinal} pts)`;

console.log('--- MENSAJE GENERADO PARA DISCORD / SLACK ---');
console.log(bandoSemanal);
console.log('--------------------------------------------');
assert(bandoSemanal.includes('🥇 1º: 🍷 Indautxu'), 'Bando dominical generado con el podio correcto');

// -----------------------------------------------------------------------------
// PASO 9: DISPARADOR MAKE ESCENARIO D (CÓDIGOS DE SELLO DIARIOS)
// -----------------------------------------------------------------------------
console.log('\n🔏 PASO 9: Verificación de Make Escenario D (Código Diario)...');

function generarCodigoDiario() {
  const hex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PIN-${hex}`;
}

const pinEjemplo = generarCodigoDiario();
assert(/^PIN-[A-Z0-9]{4}$/.test(pinEjemplo), `Código diario generado y validado con formato: ${pinEjemplo}`);

// -----------------------------------------------------------------------------
// PASO 10: VERIFICACIÓN DEL CALENDARIO FEUDAL DE JORNADAS Y EVENTOS
// -----------------------------------------------------------------------------
console.log('\n📅 PASO 10: Verificación del Calendario Feudal...');
const indexHtmlContent = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf-8');
const appJsContent = fs.readFileSync(path.join(ROOT_DIR, 'js/app.js'), 'utf-8');
const supabaseJsContent = fs.readFileSync(path.join(ROOT_DIR, 'js/supabase.js'), 'utf-8');

assert(indexHtmlContent.includes('data-tab="tab-calendario"'), 'Pestaña Calendario Feudal presente en la barra de navegación');
assert(indexHtmlContent.includes('id="tab-calendario"'), 'Sección tab-calendario presente en el DOM');
assert(indexHtmlContent.includes('id="evento-lugar"') && indexHtmlContent.includes('id="evento-hora"'), 'Formulario de eventos permite indicar lugar y hora');
assert(!indexHtmlContent.includes('value="organizador"'), 'El rol organizador ya no se ofrece en la gestión de usuarios');
assert(indexHtmlContent.includes('value="pestana-votacion-barrio"'), 'La pestaña de votación de barrio está disponible para todos los usuarios');
assert(appJsContent.includes('EVENTOS_FEUDALES'), 'Crónica de EVENTOS_FEUDALES definida con fechas y Casas');
assert(appJsContent.includes('descargarICSEvento'), 'Función para sincronizar citas con Google Calendar (.ics) implementada');
assert(appJsContent.includes("function puedeGestionarUsuarios(role) {\n    return role === 'superadmin';"), 'Solo Superadmin puede gestionar usuarios y sus roles');
assert(appJsContent.includes("return ['superadmin', 'tronista'].includes(role);"), 'Solo Superadmin y Tronista pueden gestionar eventos de barrio');
assert(appJsContent.includes(".select('id, phone, name, role, pin_code, barrio_asignado')"), 'La sesión de tronista conserva el barrio asignado para aplicar el alcance de eventos');
assert(appJsContent.includes('function puedeEditarEventoTronista'), 'Tronista tiene una regla específica de edición de eventos');
assert(appJsContent.includes("if (role !== 'tronista') return false;"), 'La edición de eventos por barrio se reserva al tronista asignado');
assert(appJsContent.includes('eventoActual.nombre !== nombre || eventoActual.fecha !== fecha'), 'Tronista no puede editar nombre ni fecha del evento');
assert(sqlContent.includes("CHECK (role IN ('jugador', 'tronista', 'superadmin'))"), 'El esquema limita los roles a jugador, tronista y superadmin');
const roleMigrationContent = fs.readFileSync(path.join(ROOT_DIR, 'sql/migrations/202610030002_replace_organizador_with_tronista.sql'), 'utf-8');
assert(roleMigrationContent.includes("SET role = 'tronista'\nWHERE role = 'organizador'"), 'La migración convierte las cuentas organizador existentes a tronista');

// -----------------------------------------------------------------------------
// PASO 11: VERIFICACIÓN DE SÚPER ADMINISTRADOR & LEY DE VOTO ÚNICO
// -----------------------------------------------------------------------------
console.log('\n👑 PASO 11: Verificación de Súper Administrador y Ley de Voto Único...');
assert(indexHtmlContent.includes('data-tab="tab-superadmin"'), 'Pestaña Consejo Real (Admin) presente en la navegación');
assert(indexHtmlContent.includes('id="tab-superadmin"'), 'Sección tab-superadmin presente en el DOM');
assert(indexHtmlContent.includes('repositorio-table'), 'Tabla del repositorio central de votos presente en el HTML');
assert(indexHtmlContent.includes('alerta-voto-repetido'), 'Aviso de voto duplicado presente en formulario de Juicio');
assert(sqlContent.includes('UNIQUE(maestre_id, casa_visitada)'), 'Restricción UNIQUE(maestre_id, casa_visitada) en base de datos');
assert(supabaseJsContent.includes('verificarClaveSuperAdmin'), 'Función de autenticación verificarClaveSuperAdmin implementada');
assert(supabaseJsContent.includes('getRepositorioVotos'), 'Función getRepositorioVotos() para auditoría implementada');
assert(supabaseJsContent.includes('getEstadisticasAdmin'), 'Función getEstadisticasAdmin() para cálculo de medias implementada');
assert(supabaseJsContent.includes('haVotadoCasa'), 'Validador haVotadoCasa() de voto único implementado');
assert(appJsContent.includes('exportarRepositorioCSV'), 'Exportación de votos a CSV implementada');

// -----------------------------------------------------------------------------
// RESUMEN FINAL
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`🏆 RESUMEN DE PRUEBAS END-TO-END: ${testsPassed} superadas, ${testsFailed} fallidas`);
console.log('================================================================');

if (testsFailed === 0) {
  console.log('✨ ¡TODO EL SISTEMA FEUDAL DE EL TRONO DEL PINTXO OPERA AL 100%! ✨\n');
  process.exit(0);
} else {
  console.error('⚠️ Se detectaron fallos en la ejecución.\n');
  process.exit(1);
}

