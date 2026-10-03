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
            <button class="btn-cuervo" onclick="abrirModalAuth()">📜 Identificarse por WhatsApp</button>
        </div>
    </header>

    <main class="container">
        <!-- Clasificación de Reinos -->
        <section class="leaderboard-container">
            <div class="leaderboard-header">
                <h2>🏆 TABLA DEL REY — LOKIBARRIO TXAPELDUN 🏆</h2>
                <p>Estatus ponderado de las Tierras y Reinos disputados</p>
            </div>
            
            <!-- Contenedor adaptativo para móviles -->
            <div class="table-responsive">
                <table class="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Estatus</th>
                            <th>Reino / Feudo</th>
                            <th>Festines (50%)</th>
                            <th>Rutas (20%)</th>
                            <th>Jolgorio (30%)</th>
                            <th>Nota Final</th>
                            <th>Votos</th>
                        </tr>
                    </thead>
                    <tbody id="clasificacion-body">
                        <!-- Carga dinámica -->
                    </tbody>
                </table>
            </div>
        </section>
    </main>

    <!-- Modal de Autenticación por WhatsApp -->
    <div id="modal-auth" class="modal-overlay" style="display: none;">
        <div class="modal-content">
            <span class="close-btn" onclick="cerrarModalAuth()">&times;</span>
            <h3 style="color: var(--oro-brillante); font-family: 'Cinzel', serif;">📜 Identificación en la Corte</h3>
            <p id="auth-step-desc" style="font-size: 0.95rem; color: #d6d3d1;">Introduce tu número de teléfono de WhatsApp (ej. 605676002):</p>
            
            <div id="step-phone">
                <input type="tel" id="input-phone" placeholder="605676002" class="input-medieval" value="605676002">
                <button class="btn-cuervo" style="width: 100%; margin-top: 15px;" onclick="enviarCuervoOTP()">✉️ Solicitar Código de Cuervo</button>
            </div>

            <div id="step-otp" style="display: none; margin-top: 15px;">
                <input type="text" id="input-otp" placeholder="Código de 6 dígitos" class="input-medieval" maxlength="6">
                <button class="btn-cuervo" style="width: 100%; margin-top: 15px;" onclick="validarCodigoOTP()">👑 Acceder al Reino</button>
            </div>
            
            <p id="auth-message" style="margin-top: 15px; font-size: 0.9rem; color: #f87171;"></p>
        </div>
    </div>

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
    padding: 30px 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.9);
}

.hero h1 {
    font-family: 'Cinzel', serif;
    font-size: 1.8rem;
    letter-spacing: 1px;
    text-shadow: 0 0 12px rgba(217, 119, 6, 0.7);
    margin: 0 0 10px 0;
}

.hero p {
    font-style: italic;
    color: #e7e5e4;
    font-size: 1rem;
}

.container {
    max-width: 1050px;
    margin: 20px auto;
    padding: 0 10px;
}

.leaderboard-container {
    background: var(--pergamino-fondo);
    border: var(--borde-oro);
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 0 35px rgba(0, 0, 0, 0.8);
}

.leaderboard-header h2 {
    font-family: 'Cinzel', serif;
    color: var(--oro-brillante);
    text-align: center;
    text-transform: uppercase;
    font-size: 1.3rem;
    margin-top: 0;
}

/* Scroll Adaptativo para Móviles */
.table-responsive {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin-top: 15px;
}

.leaderboard-table {
    width: 100%;
    min-width: 600px; /* Evita compresión en pantallas pequeñas */
    border-collapse: collapse;
}

.leaderboard-table th {
    font-family: 'Cinzel', serif;
    background-color: #292524;
    color: var(--oro-brillante);
    border-bottom: 2px solid var(--oro-real);
    padding: 10px 8px;
    font-size: 0.8rem;
    text-align: left;
}

.leaderboard-table td {
    padding: 12px 8px;
    border-bottom: 1px solid #44403c;
    color: #f5f5f4;
    font-size: 0.9rem;
}

.btn-cuervo {
    font-family: 'Cinzel', serif;
    background: linear-gradient(135deg, #78350f, #92400e);
    color: #fef08a;
    border: 1px solid var(--oro-brillante);
    padding: 10px 18px;
    font-weight: bold;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.3s ease;
}

.score-badge {
    font-family: 'Cinzel', serif;
    font-weight: bold;
    color: var(--oro-brillante);
    background: #292524;
    border: 1px solid var(--oro-real);
    padding: 4px 8px;
    border-radius: 4px;
}

/* Modal Estilo Medieval */
.modal-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.85);
    display: flex; justify-content: center; align-items: center;
    z-index: 1000;
    padding: 15px;
}

.modal-content {
    background: #1c1917;
    border: var(--borde-oro);
    border-radius: 12px;
    padding: 25px;
    max-width: 400px;
    width: 100%;
    box-sizing: border-box;
    position: relative;
}

.close-btn {
    position: absolute;
    top: 10px; right: 15px;
    color: var(--oro-brillante);
    font-size: 1.5rem;
    cursor: pointer;
}

.input-medieval {
    width: 100%;
    padding: 12px;
    background: #292524;
    border: 1px solid var(--oro-real);
    color: #fef08a;
    border-radius: 6px;
    font-size: 1.1rem;
    box-sizing: border-box;
    text-align: center;
}""",

    "js/app.js": """const SUPABASE_URL = 'https://TU_PROYECTO.supabase.co'; // Sustituir por URL Supabase Cloud
const SUPABASE_ANON_KEY = 'TU_KEY_ANON'; // Sustituir por Key Supabase Cloud
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let telefonoFormateado = '';

async function cargarClasificacion() {
    const tbody = document.getElementById('clasificacion-body');
    const { data, error } = await supabase.from('clasificacion_barrios').select('*');

    if (error) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#f87171;">⚠️ Los cuervos no pudieron traer las puntuaciones.</td></tr>`;
        return;
    }

    tbody.innerHTML = '';
    data.forEach((row) => {
        let insignia = `🏰 #${row.posicion}`;
        if (row.posicion === 1) insignia = '👑 Txapeldun';
        else if (row.posicion === 2) insignia = '⚔️ 2º';
        else if (row.posicion === 3) insignia = '🛡️ 3º';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${insignia}</strong></td>
            <td style="color:#fef08a;"><strong>${row.barrio}</strong></td>
            <td>${row.nota_ocio ? row.nota_ocio.toFixed(1) : '0.0'}</td>
            <td>${row.nota_accesibilidad ? row.nota_accesibilidad.toFixed(1) : '0.0'}</td>
            <td>${row.nota_ambiente ? row.nota_ambiente.toFixed(1) : '0.0'}</td>
            <td><span class="score-badge">${row.nota_global ? row.nota_global.toFixed(2) : '0.00'}</span></td>
            <td>${row.total_votos}</td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirModalAuth() {
    document.getElementById('modal-auth').style.display = 'flex';
}

function cerrarModalAuth() {
    document.getElementById('modal-auth').style.display = 'none';
}

async function enviarCuervoOTP() {
    const rawPhone = document.getElementById('input-phone').value.trim();
    const msg = document.getElementById('auth-message');
    msg.innerText = '';

    if (!rawPhone) {
        msg.innerText = "Escribe tu número de teléfono.";
        return;
    }

    // Normalizar a formato internacional (+34...)
    telefonoFormateado = rawPhone.startsWith('+') ? rawPhone : '+34' + rawPhone.replace(/\\D/g, '');

    // Comprobar si está en la tabla authorized_users
    const { data: user, error: checkError } = await supabase
        .from('authorized_users')
        .select('*')
        .eq('phone', telefonoFormateado)
        .single();

    if (checkError || !user) {
        msg.innerText = `⚠️ El número ${telefonoFormateado} no se halla inscrito en la Tabla de Nobles. Contacta con el Gran Consejo.`;
        return;
    }

    // Solicitar OTP por WhatsApp
    const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: telefonoFormateado,
        options: { channel: 'whatsapp' }
    });

    if (otpError) {
        msg.innerText = "Error al enviar WhatsApp: " + otpError.message;
    } else {
        document.getElementById('step-phone').style.display = 'none';
        document.getElementById('step-otp').style.display = 'block';
        document.getElementById('auth-step-desc').innerText = `Introduce el código enviado a tu WhatsApp (${telefonoFormateado}):`;
    }
}

async function validarCodigoOTP() {
    const otpCode = document.getElementById('input-otp').value.trim();
    const msg = document.getElementById('auth-message');

    const { data, error } = await supabase.auth.verifyOtp({
        phone: telefonoFormateado,
        token: otpCode,
        type: 'sms'
    });

    if (error) {
        msg.innerText = "⚠️ Código incorrecto o expirado.";
    } else {
        alert("👑 Saludos Noble Caminante. Identificación completada.");
        cerrarModalAuth();
        location.reload();
    }
}

document.addEventListener('DOMContentLoaded', cargarClasificacion);"""
}

def aplicar_cambios():
    for file_path, content in files.items():
        if "/" in file_path:
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"✅ Archivo actualizado para móvil: {file_path}")

if __name__ == "__main__":
    aplicar_cambios()
