import os

files = {
    "index.html": """<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Juego del Lokitrono de Barrios de Bilbao</title>
    <link rel="stylesheet" href="css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
    <header class="hero">
        <h1>⚔️ JUEGO DEL LOKITRONO DE BILBAO ⚔️</h1>
        <p>«En la justa por el Honor, o se conquista el Reino... o se vuelve con la garganta seca»</p>
        <div id="auth-status" style="margin-top: 20px;">
            <button class="btn-cuervo" onclick="mostrarModalLogin()">📜 Identificarse por Cuervo (WhatsApp)</button>
        </div>
    </header>

    <main class="container">
        <section class="leaderboard-container">
            <div class="leaderboard-header">
                <h2>🏆 TABLA DEL REY — LOKIBARRIO TXAPELDUN 🏆</h2>
                <p>Estatus ponderado de las Tierras y Reinos disputados</p>
            </div>
            <div class="table-responsive">
                <table class="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Estatus</th>
                            <th>Reino / Feudo</th>
                            <th>Festines & Pócimas (50%)</th>
                            <th>Rutas & Dragones (20%)</th>
                            <th>Jolgorio del Pueblo (30%)</th>
                            <th>Proclamación</th>
                            <th>Votos Regios</th>
                        </tr>
                    </thead>
                    <tbody id="clasificacion-body">
                    </tbody>
                </table>
            </div>
        </section>
    </main>

    <script src="js/app.js"></script>
</body>
</html>""",

    "css/style.css": """@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=MedievalSharp&display=swap');

:root {
    --oro-real: #d97706;
    --oro-brillante: #fbbf24;
    --hierro-oscuro: #1c1917;
    --pergamino-fondo: rgba(28, 25, 23, 0.92);
    --borde-oro: 2px solid #b45309;
}

body {
    font-family: 'MedievalSharp', cursive, Georgia, serif;
    background-color: #0c0a09;
    background-image: linear-gradient(rgba(0, 0, 0, 0.78), rgba(0, 0, 0, 0.88)), 
                      url('https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1920&q=80');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    color: #f5f5f4;
    margin: 0;
    padding: 0;
}

.hero {
    background: rgba(69, 10, 10, 0.88);
    border-bottom: 4px solid var(--oro-real);
    color: #fef08a;
    text-align: center;
    padding: 40px 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(4px);
}

.hero h1 {
    font-family: 'Cinzel', serif;
    font-size: 2.5rem;
    letter-spacing: 2px;
    text-shadow: 0 0 12px rgba(217, 119, 6, 0.7);
    margin: 0 0 10px 0;
}

.hero p {
    font-style: italic;
    color: #e7e5e4;
    font-size: 1.15rem;
}

.container {
    max-width: 1050px;
    margin: 30px auto;
    padding: 0 20px;
}

.leaderboard-container {
    background: var(--pergamino-fondo);
    border: var(--borde-oro);
    border-radius: 12px;
    padding: 28px;
    box-shadow: 0 0 35px rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(6px);
}

.leaderboard-header h2 {
    font-family: 'Cinzel', serif;
    color: var(--oro-brillante);
    text-align: center;
    text-transform: uppercase;
    font-size: 1.8rem;
    margin-top: 0;
}

.leaderboard-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.leaderboard-table th {
    font-family: 'Cinzel', serif;
    background-color: #292524;
    color: var(--oro-brillante);
    border-bottom: 2px solid var(--oro-real);
    padding: 14px;
    text-transform: uppercase;
    font-size: 0.85rem;
}

.leaderboard-table td {
    padding: 16px;
    border-bottom: 1px solid #44403c;
    color: #f5f5f4;
}

.leaderboard-table tbody tr:hover {
    background-color: rgba(68, 64, 60, 0.4);
}

.btn-cuervo {
    font-family: 'Cinzel', serif;
    background: linear-gradient(135deg, #78350f, #92400e);
    color: #fef08a;
    border: 1px solid var(--oro-brillante);
    padding: 12px 24px;
    font-weight: bold;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.3s ease;
}

.btn-cuervo:hover {
    background: var(--oro-real);
    color: #1c1917;
    box-shadow: 0 0 15px rgba(251, 191, 36, 0.6);
}

.score-badge {
    font-family: 'Cinzel', serif;
    font-weight: bold;
    color: var(--oro-brillante);
    background: #292524;
    border: 1px solid var(--oro-real);
    padding: 6px 12px;
    border-radius: 4px;
}""",

    "js/app.js": """const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function cargarClasificacion() {
    const tbody = document.getElementById('clasificacion-body');
    const { data, error } = await supabase.from('clasificacion_barrios').select('*');

    if (error) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#f87171;">⚠️️ Los cuervos no pudieron traer el pergamino de puntuaciones.</td></tr>`;
        return;
    }

    tbody.innerHTML = '';
    data.forEach((row) => {
        let insignia = `🏰 Rang ${row.posicion}`;
        if (row.posicion === 1) insignia = '👑 Txapeldun';
        else if (row.posicion === 2) insignia = '⚔️ Subcampeón';
        else if (row.posicion === 3) insignia = '🛡️ Tercer Reino';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${insignia}</strong></td>
            <td style="font-size:1.1rem; color:#fef08a;"><strong>${row.barrio}</strong></td>
            <td>${row.nota_ocio ? row.nota_ocio.toFixed(2) : '0.00'} pts</td>
            <td>${row.nota_accesibilidad ? row.nota_accesibilidad.toFixed(2) : '0.00'} pts</td>
            <td>${row.nota_ambiente ? row.nota_ambiente.toFixed(2) : '0.00'} pts</td>
            <td><span class="score-badge">${row.nota_global ? row.nota_global.toFixed(2) : '0.00'}</span></td>
            <td>${row.total_votos} nobles</td>
        `;
        tbody.appendChild(tr);
    });
}

function mostrarModalLogin() {
    alert("✉️ Envoyé por la red de Cuervos: Introduce tu teléfono autorizado en el Grimorio de Lord Julio & Lady Ainhoa.");
}

document.addEventListener('DOMContentLoaded', cargarClasificacion);"""
}

def aplicar_estetica_taberna():
    for file_path, content in files.items():
        if "/" in file_path:
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"🏰 Artefacto medieval forjado: {file_path}")

if __name__ == "__main__":
    aplicar_estetica_taberna()
