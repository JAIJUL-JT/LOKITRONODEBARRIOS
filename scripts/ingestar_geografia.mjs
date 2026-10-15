#!/usr/bin/env node
// ==============================================================================
// LOKITRONO — INGESTA DE GEOGRAFÍA DE ESPAÑA
// ==============================================================================
// Script reproducible y SIN dependencias externas (Node >= 18, usa fetch global).
//
// Genera:
//   * sql/seeds/geografia/provincias_ciudades.sql   (comunidades, provincias y municipios)
//   * sql/seeds/geografia/codigos_postales.sql       (CP y su relación con municipios)
//   * sql/seeds/geografia/<ine>_distritos_barrios.sql (solo ciudades con open data)
//   * data/ciudades/<ine>.geojson                    (límite municipal, IGN)
//   * data/ciudades/<ine>.distritos.geojson          (open data municipal)
//   * data/ciudades/<ine>.barrios.geojson            (open data municipal)
//   * data/ciudades/<ine>.entidades.json             (distritos/barrios/CP sin geometría)
//   * data/ciudades/index.json                       (manifiesto para la app)
//
// Uso:
//   node scripts/ingestar_geografia.mjs base
//   node scripts/ingestar_geografia.mjs limites 48020 08019
//   node scripts/ingestar_geografia.mjs limites-todas
//   node scripts/ingestar_geografia.mjs opendata 08019 48020
//   node scripts/ingestar_geografia.mjs manifest
//   node scripts/ingestar_geografia.mjs todo          (base + manifest)
//
// FUENTES Y ATRIBUCIÓN (obligatoria):
//   · Comunidades, provincias y municipios: INE — www.ine.es
//     (vía dataset derivado `codeforspain/ds-organizacion-administrativa`)
//   · Códigos postales: INE — www.ine.es
//     (vía dataset derivado `regi-es/ds-codigos-postales-ine-es`, licencia MIT del código)
//   · Límites municipales: IGN/CNIG — api-features.ign.es (CC-BY 4.0)
//   · Barcelona (distritos y barrios): Ajuntament de Barcelona, Open Data BCN (CC-BY 4.0)
//     (vía `martgnz/bcn-geodata`, conversión de los shapefiles oficiales)
//   · Bilbao (barrios y distritos): Ayto. de Bilbao — callejero/Open Data (CC-BY 3.0)
//     https://www.bilbao.eus/callejero/jsp/od_callejero.jsp (tipo=barrios)
// ==============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR_SEEDS = path.join(ROOT, 'sql', 'seeds', 'geografia');
const DIR_CIUDADES = path.join(ROOT, 'data', 'ciudades');

const FUENTES = {
    organizacion: 'https://raw.githubusercontent.com/codeforspain/ds-organizacion-administrativa/master/data',
    ine: 'https://raw.githubusercontent.com/regi-es/ds-codigos-postales-ine-es/master/data',
    ign: 'https://api-features.ign.es/collections/administrativeunit/items',
    bcnDistrictes: 'https://raw.githubusercontent.com/martgnz/bcn-geodata/master/districtes/districtes.geojson',
    bcnBarris: 'https://raw.githubusercontent.com/martgnz/bcn-geodata/master/barris/barris.geojson',
    bilbaoBarriosCsv: 'https://www.bilbao.eus/callejero/jsp/od_callejero.jsp?idioma=c&formato=csv&tipo=barrios',
    donostiaBarrios: 'https://www.donostia.eus/datosabiertos/recursos/mapa_auzoak/auzoak.json'
};

// Nombres oficiales de los 8 distritos de Bilbao (el primer dígito del código de
// barrio indica el distrito: 1xx→1, 2xx→2, …).
const DISTRITOS_BILBAO = {
    1: 'Deusto', 2: 'Uribarri', 3: 'Otxarkoaga-Txurdinaga', 4: 'Begoña',
    5: 'Ibaiondo', 6: 'Abando', 7: 'Errekalde', 8: 'Basurtu-Zorrotza'
};

// Autonomía (código INE 01–19) a la que pertenece cada provincia. El dataset de
// codeforspain no publica esta relación, así que se fija aquí según el INE.
const PROVINCIA_AUTONOMIA = {
    '04': '01', '11': '01', '14': '01', '18': '01', '21': '01', '23': '01', '29': '01', '41': '01',
    '22': '02', '44': '02', '50': '02',
    '33': '03',
    '07': '04',
    '35': '05', '38': '05',
    '39': '06',
    '05': '07', '09': '07', '24': '07', '34': '07', '37': '07', '40': '07', '42': '07', '47': '07', '49': '07',
    '02': '08', '13': '08', '16': '08', '19': '08', '45': '08',
    '08': '09', '17': '09', '25': '09', '43': '09',
    '03': '10', '12': '10', '46': '10',
    '06': '11', '10': '11',
    '15': '12', '27': '12', '32': '12', '36': '12',
    '28': '13',
    '30': '14',
    '31': '15',
    '01': '16', '20': '16', '48': '16',
    '26': '17',
    '51': '18', '52': '19'
};

// Nombres "naturales" de las comunidades para la interfaz (los del dataset de
// codeforspain son los oficiales del INE, p. ej. "Asturias, Principado de"; aquí
// se conservan los habituales y se usan solo los códigos del dataset).
const NOMBRES_COMUNIDAD = {
    '01': 'Andalucía', '02': 'Aragón', '03': 'Principado de Asturias',
    '04': 'Illes Balears', '05': 'Canarias', '06': 'Cantabria',
    '07': 'Castilla y León', '08': 'Castilla-La Mancha', '09': 'Cataluña',
    '10': 'Comunitat Valenciana', '11': 'Extremadura', '12': 'Galicia',
    '13': 'Comunidad de Madrid', '14': 'Región de Murcia',
    '15': 'Comunidad Foral de Navarra', '16': 'País Vasco', '17': 'La Rioja',
    '18': 'Ceuta', '19': 'Melilla'
};

// El dataset publica algunos nombres con doble codificación (mojibake); se
// reinterpreta latin-1 → utf-8 para recuperar los acentos originales.
const arreglarMojibake = s => Buffer.from(String(s == null ? '' : s), 'latin1').toString('utf8');


// Ciudades con open data municipal de distritos/barrios (adaptador por código INE).
const OPEN_DATA = {
    '08019': { nombre: 'Barcelona', adaptador: 'barcelona' },
    '48020': { nombre: 'Bilbao', adaptador: 'bilbao' }
};

const log = (...a) => console.log('·', ...a);
const esc = v => "'" + String(v == null ? '' : v).replace(/'/g, "''") + "'";
const pad = (n, len = 2) => String(n).padStart(len, '0');

function ensureDir(dir) {
    fs.mkdirSync(dir, { recursive: true });
}

async function fetchJson(url, { retries = 3 } = {}) {
    for (let intento = 1; intento <= retries; intento++) {
        try {
            const res = await fetch(url, { headers: { 'User-Agent': 'lokitrono-geografia/1.0' } });
            if (!res.ok) throw new Error(`HTTP ${res.status} en ${url}`);
            return await res.json();
        } catch (error) {
            if (intento === retries) throw error;
            await new Promise(r => setTimeout(r, 800 * intento));
        }
    }
}

function escribirArchivo(ruta, contenido) {
    ensureDir(path.dirname(ruta));
    fs.writeFileSync(ruta, contenido, 'utf8');
    log('escrito', path.relative(ROOT, ruta), `(${(contenido.length / 1024).toFixed(1)} KB)`);
}

// Centroide aproximado a partir de la caja envolvente de una geometría GeoJSON.
function centroide(geometry) {
    const puntos = [];
    const recorrer = coords => {
        if (typeof coords[0] === 'number') { puntos.push(coords); return; }
        coords.forEach(recorrer);
    };
    if (geometry) recorrer(geometry.coordinates);
    if (!puntos.length) return { lat: null, lon: null };
    let minLon = Infinity, minLat = Infinity, maxLon = -Infinity, maxLat = -Infinity;
    for (const [lon, lat] of puntos) {
        if (lon < minLon) minLon = lon;
        if (lon > maxLon) maxLon = lon;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
    }
    return { lat: (minLat + maxLat) / 2, lon: (minLon + maxLon) / 2 };
}

// ------------------------------------------------------------------------------
// BASE: comunidades, provincias, ciudades (codeforspain/INE) y códigos postales
// ------------------------------------------------------------------------------
async function cargarBaseGeo() {
    log('descargando comunidades, provincias y municipios (codeforspain/INE)…');
    const [autonomias, provinciasArr, municipiosArr, cpInverso] = await Promise.all([
        fetchJson(`${FUENTES.organizacion}/autonomias.json`),
        fetchJson(`${FUENTES.organizacion}/provincias.json`),
        fetchJson(`${FUENTES.organizacion}/municipios.json`),
        fetchJson(`${FUENTES.ine}/codigos_postales.json`)
    ]);

    const comunidades = new Map();
    for (const a of autonomias) {
        comunidades.set(a.autonomia_id, NOMBRES_COMUNIDAD[a.autonomia_id] || arreglarMojibake(a.nombre));
    }

    const provincias = new Map();
    for (const p of provinciasArr) {
        provincias.set(p.provincia_id, {
            nombre: p.nombre,
            comunidad_id: PROVINCIA_AUTONOMIA[p.provincia_id] || null
        });
    }

    const municipios = {};
    for (const m of municipiosArr) {
        municipios[m.municipio_id] = { nombre: m.nombre, provincia_id: m.provincia_id };
    }

    log(`base: ${comunidades.size} comunidades, ${provincias.size} provincias, ` +
        `${Object.keys(municipios).length} municipios, ${Object.keys(cpInverso).length} códigos postales.`);
    return { comunidades, provincias, municipios, cpInverso };
}

function generarSqlBase({ comunidades, provincias, municipios, cpInverso }) {
    ensureDir(DIR_SEEDS);

    // 1) Comunidades autónomas y provincias (con su comunidad)
    const filasCom = [...comunidades.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([id, nombre]) => `(${esc(id)}, ${esc(nombre)})`)
        .join(',\n  ');
    const filasProv = [...provincias.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([id, p]) => `(${esc(id)}, ${esc(p.nombre)}, ${esc(p.comunidad_id ? comunidades.get(p.comunidad_id) : null)}, ${esc(p.comunidad_id)})`)
        .join(',\n  ');
    escribirArchivo(path.join(DIR_SEEDS, 'provincias_ciudades.sql'),
        `-- Generado por scripts/ingestar_geografia.mjs — NO editar a mano.\n` +
        `-- Fuente: INE (www.ine.es) vía codeforspain/ds-organizacion-administrativa. Atribución obligatoria.\n\n` +
        `INSERT INTO public.comunidades (id, nombre) VALUES\n  ${filasCom}\n` +
        `ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre;\n\n` +
        `INSERT INTO public.provincias (id, nombre, ccaa, comunidad_id) VALUES\n  ${filasProv}\n` +
        `ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre, ccaa = EXCLUDED.ccaa, comunidad_id = EXCLUDED.comunidad_id;\n\n` +
        `INSERT INTO public.ciudades (id, nombre, provincia_id) VALUES\n  ` +
        Object.entries(municipios)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([id, m]) => `(${esc(id)}, ${esc(m.nombre)}, ${esc(m.provincia_id)})`)
            .join(',\n  ') +
        `\nON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre, provincia_id = EXCLUDED.provincia_id;\n`
    );

    // 2) Códigos postales + relación N:M
    const filasCp = Object.keys(cpInverso).sort()
        .map(cp => `(${esc(cp)}, ${esc(cp.slice(0, 2))})`).join(',\n  ');
    const filasMapa = [];
    for (const [cp, ids] of Object.entries(cpInverso)) {
        for (const ciudadId of ids) filasMapa.push(`(${esc(cp)}, ${esc(ciudadId)})`);
    }
    escribirArchivo(path.join(DIR_SEEDS, 'codigos_postales.sql'),
        `-- Generado por scripts/ingestar_geografia.mjs — NO editar a mano.\n` +
        `-- Fuente: INE (www.ine.es). Atribución obligatoria.\n\n` +
        `INSERT INTO public.codigos_postales (codigo, provincia_id) VALUES\n  ${filasCp}\n` +
        `ON CONFLICT (codigo) DO UPDATE SET provincia_id = EXCLUDED.provincia_id;\n\n` +
        `INSERT INTO public.codigo_postal_ciudad (codigo_postal, ciudad_id) VALUES\n  ${filasMapa.join(',\n  ')}\n` +
        `ON CONFLICT (codigo_postal, ciudad_id) DO NOTHING;\n`
    );

    log(`base INE: ${Object.keys(municipios).length} municipios, ${Object.keys(cpInverso).length} códigos postales.`);
    return { municipios };
}

// ------------------------------------------------------------------------------
// LÍMITES MUNICIPALES (IGN API-Features)
// ------------------------------------------------------------------------------
async function descargarLimite(ine) {
    const { municipios, provincias } = await cargarBaseGeo();
    const ciudad = municipios[ine];
    if (!ciudad) throw new Error(`Municipio ${ine} no encontrado en el INE`);

    log(`límite municipal de ${ciudad.nombre} (${ine}) vía IGN…`);
    const url = `${FUENTES.ign}?nameunit=${encodeURIComponent(ciudad.nombre)}&limit=50&f=json`;
    const coleccion = await fetchJson(url);
    const feature = (coleccion.features || []).find(f =>
        String(f.properties?.nationalcode || '').endsWith(ine)
    );
    if (!feature) throw new Error(`El IGN no devolvió geometría para ${ciudad.nombre} (${ine})`);

    const geojson = {
        type: 'FeatureCollection',
        fuente: 'IGN/CNIG — api-features.ign.es (CC-BY 4.0)',
        properties: { ine, nombre: ciudad.nombre, provincia: provincias.get(ine.slice(0, 2))?.nombre || null },
        features: [feature]
    };
    const rutaRel = `data/ciudades/${ine}.geojson`;
    escribirArchivo(path.join(ROOT, rutaRel), JSON.stringify(geojson));

    const { lat, lon } = centroide(feature.geometry);
    return { ine, nombre: ciudad.nombre, lat, lon, geomPath: rutaRel };
}

// ------------------------------------------------------------------------------
// OPEN DATA MUNICIPAL: distritos y barrios
// ------------------------------------------------------------------------------
async function descargarOpenData(ine, base) {
    const cfg = OPEN_DATA[ine];
    if (!cfg) throw new Error(`Sin adaptador de open data para ${ine}`);

    const resultado = await descargarOpenDataAdaptador(ine, cfg);
    resultado.cps = base
        ? Object.keys(base.cpInverso).filter(cp => base.cpInverso[cp].includes(ine)).sort()
        : [];
    return resultado;
}

async function descargarOpenDataAdaptador(ine, cfg) {
    if (cfg.adaptador === 'barcelona') {
        const [dist, barr] = await Promise.all([
            fetchJson(FUENTES.bcnDistrictes), fetchJson(FUENTES.bcnBarris)
        ]);
        const distritos = dist.features.map(f => ({
            codigo: pad(f.properties.DISTRICTE),
            nombre: f.properties.NOM,
            color: f.properties.FHEX_COLOR || null
        })).sort((a, b) => a.codigo.localeCompare(b.codigo));
        const barrios = barr.features.map(f => ({
            distrito_codigo: pad(f.properties.DISTRICTE),
            codigo: pad(f.properties.BARRI),
            nombre: f.properties.NOM,
            color: f.properties.FHEX_COLOR || null
        })).sort((a, b) => (a.distrito_codigo + a.codigo).localeCompare(b.distrito_codigo + b.codigo));

        escribirArchivo(path.join(ROOT, `data/ciudades/${ine}.distritos.geojson`),
            JSON.stringify({ ...dist, fuente: 'Ajuntament de Barcelona, Open Data BCN (CC-BY 4.0)' }));
        escribirArchivo(path.join(ROOT, `data/ciudades/${ine}.barrios.geojson`),
            JSON.stringify({ ...barr, fuente: 'Ajuntament de Barcelona, Open Data BCN (CC-BY 4.0)' }));
        return { distritos, barrios };
    }

    if (cfg.adaptador === 'bilbao') {
        // Lista oficial de barrios del callejero del Ayto. de Bilbao (CSV).
        // TBAR_COD_BARRIO;TBAR_DES_BARRIO;  (el 1.er dígito del código = distrito)
        const res = await fetch(FUENTES.bilbaoBarriosCsv, { headers: { 'User-Agent': 'lokitrono-geografia/1.0' } });
        if (!res.ok) throw new Error(`HTTP ${res.status} al descargar barrios de Bilbao`);
        const csv = await res.text();
        const barriosPorDistrito = new Map();
        for (const linea of csv.split(/\r?\n/).slice(1)) {
            const [codRaw, nombreRaw] = linea.split(';');
            const codigo = (codRaw || '').trim();
            const nombre = (nombreRaw || '').trim();
            if (!/^\d{3}$/.test(codigo) || !nombre) continue;
            const distritoCodigo = codigo[0];
            if (!barriosPorDistrito.has(distritoCodigo)) barriosPorDistrito.set(distritoCodigo, []);
            barriosPorDistrito.get(distritoCodigo).push({ codigo, nombre });
        }
        const distritos = Object.keys(DISTRITOS_BILBAO).sort()
            .map(n => ({ codigo: pad(n), nombre: DISTRITOS_BILBAO[n], color: null }));
        const barrios = [];
        for (const [distritoCodigo, lista] of barriosPorDistrito) {
            for (const b of lista) {
                barrios.push({
                    distrito_codigo: pad(distritoCodigo),
                    codigo: b.codigo,
                    nombre: b.nombre,
                    color: null
                });
            }
        }
        // Sin geometría de barrios; el mapa usa el límite municipal del IGN.
        return { distritos, barrios };
    }

    throw new Error(`Adaptador desconocido: ${cfg.adaptador}`);
}

function generarSqlDistritosBarrios(ine, { distritos, barrios }) {
    const nombreCiudad = OPEN_DATA[ine].nombre;
    const geomDistritos = fs.existsSync(path.join(ROOT, `data/ciudades/${ine}.distritos.geojson`))
        ? `data/ciudades/${ine}.distritos.geojson` : null;
    const geomBarrios = fs.existsSync(path.join(ROOT, `data/ciudades/${ine}.barrios.geojson`))
        ? `data/ciudades/${ine}.barrios.geojson` : null;
    const lineas = [
        `-- Generado por scripts/ingestar_geografia.mjs — NO editar a mano.`,
        `-- ${nombreCiudad} (${ine}). Fuente: open data municipal (ver script).\n`,
        `INSERT INTO public.distritos (id, ciudad_id, nombre, tipo, codigo, color, geom_path, orden) VALUES`
    ];
    lineas.push('  ' + distritos.map((d, i) =>
        `(${esc(`${ine}-${d.codigo}`)}, ${esc(ine)}, ${esc(d.nombre)}, 'municipal', ${esc(d.codigo)}, ${esc(d.color || '')}, ${esc(geomDistritos || '')}, ${i + 1})`
    ).join(',\n  ') +
        `\nON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre, color = EXCLUDED.color, orden = EXCLUDED.orden;\n`);

    if (barrios.length) {
        lineas.push(`\nINSERT INTO public.barrios (id, distrito_id, ciudad_id, nombre, codigo, color, geom_path, orden) VALUES`);
        lineas.push('  ' + barrios.map((b, i) =>
            `(${esc(`${ine}-${b.distrito_codigo}-${b.codigo}`)}, ${esc(`${ine}-${b.distrito_codigo}`)}, ${esc(ine)}, ${esc(b.nombre)}, ${esc(b.codigo)}, ${esc(b.color || '')}, ${esc(geomBarrios || '')}, ${i + 1})`
        ).join(',\n  ') +
            `\nON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre, color = EXCLUDED.color, orden = EXCLUDED.orden;\n`);
    }

    lineas.push(`\nUPDATE public.ciudades SET tiene_distritos = TRUE, tiene_barrios = ${barrios.length ? 'TRUE' : 'FALSE'} WHERE id = ${esc(ine)};\n`);
    escribirArchivo(path.join(DIR_SEEDS, `${ine}_distritos_barrios.sql`), lineas.join('\n'));
}

// Emite <ine>.entidades.json: distritos, barrios y CP sin geometría, para que la
// app pueda construir la cascada y la selección aunque el SQL aún no se aplique.
function escribirEntidades(ine, { distritos, barrios, cps }, base) {
    const nombre = base?.municipios?.[ine]?.nombre || OPEN_DATA[ine]?.nombre || ine;
    const provincia = base?.provincias?.get(ine.slice(0, 2))?.nombre || null;
    escribirArchivo(path.join(DIR_CIUDADES, `${ine}.entidades.json`),
        JSON.stringify({
            ine,
            nombre,
            provincia,
            fuente: 'Open data municipal + INE (www.ine.es)',
            distritos: distritos.map((d, i) => ({
                codigo: d.codigo, nombre: d.nombre, color: d.color || null, orden: i + 1
            })),
            barrios: barrios.map((b, i) => ({
                distrito_codigo: b.distrito_codigo, codigo: b.codigo, nombre: b.nombre,
                color: b.color || null, orden: i + 1
            })),
            codigos_postales: cps || []
        }, null, 2));
}

// ------------------------------------------------------------------------------
// MANIFIESTO para la app (data/ciudades/index.json)
// ------------------------------------------------------------------------------
function generarManifiesto() {
    const ciudades = [];
    if (fs.existsSync(DIR_CIUDADES)) {
        for (const archivo of fs.readdirSync(DIR_CIUDADES)) {
            const m = archivo.match(/^(\d{5})\.geojson$/);
            if (!m) continue;
            const ine = m[1];
            const geojson = JSON.parse(fs.readFileSync(path.join(DIR_CIUDADES, archivo), 'utf8'));
            const props = geojson.properties || {};
            const { lat, lon } = centroide(geojson.features?.[0]?.geometry);
            ciudades.push({
                ine,
                nombre: props.nombre || (OPEN_DATA[ine]?.nombre) || ine,
                provincia: props.provincia || null,
                geom: `data/ciudades/${ine}.geojson`,
                distritos: fs.existsSync(path.join(DIR_CIUDADES, `${ine}.distritos.geojson`))
                    ? `data/ciudades/${ine}.distritos.geojson` : null,
                barrios: fs.existsSync(path.join(DIR_CIUDADES, `${ine}.barrios.geojson`))
                    ? `data/ciudades/${ine}.barrios.geojson` : null,
                entidades: fs.existsSync(path.join(DIR_CIUDADES, `${ine}.entidades.json`))
                    ? `data/ciudades/${ine}.entidades.json` : null,
                centro: [lat, lon]
            });
        }
    }
    ciudades.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    escribirArchivo(path.join(DIR_CIUDADES, 'index.json'),
        JSON.stringify({
            generado_por: 'scripts/ingestar_geografia.mjs',
            fuentes: {
                municipios_cp: 'INE (www.ine.es)',
                limites: 'IGN/CNIG — api-features.ign.es (CC-BY 4.0)',
                distritos_barrios: 'Open data municipal (Barcelona CC-BY 4.0; Bilbao, Ayto. de Bilbao CC-BY 3.0)'
            },
            total: ciudades.length,
            ciudades
        }, null, 2));
    return ciudades;
}

// ------------------------------------------------------------------------------
// CLI
// ------------------------------------------------------------------------------
async function main() {
    const [comando, ...args] = process.argv.slice(2);

    if (!comando || comando === 'todo') {
        generarSqlBase(await cargarBaseGeo());
        generarManifiesto();
        return;
    }

    if (comando === 'base') {
        generarSqlBase(await cargarBaseGeo());
        return;
    }

    if (comando === 'limites') {
        if (!args.length) throw new Error('Indica al menos un código INE, p. ej.: limites 48020 08019');
        for (const ine of args) await descargarLimite(ine);
        generarManifiesto();
        return;
    }

    if (comando === 'limites-todas') {
        const { municipios } = await cargarBaseGeo();
        const ids = Object.keys(municipios).sort();
        log(`Descargando ${ids.length} límites municipales del IGN (puede tardar bastante)…`);
        for (const ine of ids) {
            try { await descargarLimite(ine); }
            catch (error) { console.warn('  ⚠', ine, error.message); }
        }
        generarManifiesto();
        return;
    }

    if (comando === 'opendata') {
        if (!args.length) throw new Error('Indica al menos un código INE con adaptador, p. ej.: opendata 08019 48020');
        const base = await cargarBaseGeo();
        for (const ine of args) {
            const datos = await descargarOpenData(ine, base);
            generarSqlDistritosBarrios(ine, datos);
            escribirEntidades(ine, datos, base);
        }
        generarManifiesto();
        return;
    }

    if (comando === 'manifest') {
        generarManifiesto();
        return;
    }

    throw new Error(`Comando desconocido: ${comando}`);
}

main().catch(error => {
    console.error('✖ Error:', error.message);
    process.exit(1);
});
