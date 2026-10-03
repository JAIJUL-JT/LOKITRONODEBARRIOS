import os
import re
import subprocess

FILE_PATH = "js/app.js"

print("=" * 60)
print("🛠️  CONFIGURADOR Y DEPURADOR DE AUTENTICACIÓN SUPABASE")
print("=" * 60)

# 1. Solicitar la URL y Clave Anon reales si no se pasan por variable de entorno
supabase_url = os.environ.get("SUPABASE_URL", "").strip()
supabase_anon_key = os.environ.get("SUPABASE_ANON_KEY", "").strip()

if not supabase_url or "tu_proyecto" in supabase_url:
    supabase_url = input("\n👉 Introduce tu SUPABASE_URL (ej. https://xyz123.supabase.co): ").strip()

if not supabase_anon_key or "tu_clave" in supabase_anon_key:
    supabase_anon_key = input("👉 Introduce tu SUPABASE_ANON_KEY (ej. eyJhbGci...): ").strip()

if not supabase_url.startswith("http") or len(supabase_anon_key) < 20:
    print("\n❌ Error: La URL o la Anon Key introducidas no son válidas. Abortando.")
    exit(1)

# 2. Código refactorizado para js/app.js
NUEVO_CODIGO_APP_JS = f"""// ==========================================
// CONFIGURACIÓN DE SUPABASE
// ==========================================
const SUPABASE_URL = '{supabase_url}'; 
const SUPABASE_ANON_KEY = '{supabase_anon_key}';

// Inicialización segura del cliente
let supabaseClient = null;

if (typeof supabase !== 'undefined' && SUPABASE_URL && !SUPABASE_URL.includes('tu_proyecto')) {{
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("✅ Cliente Supabase inicializado correctamente.");
}} else {{
    console.error("❌ Error de Configuración: SUPABASE_URL o librería Supabase JS no disponibles.");
}}

// ==========================================
// FUNCIÓN DE AUTENTICACIÓN POR WHATSAPP (OTP)
// ==========================================
async function enviarCuervoOTP() {{
    const msg = document.getElementById('auth-message');
    if (msg) msg.innerText = '';

    if (!supabaseClient) {{
        if (msg) msg.innerText = "⚠️ Error de configuración: La cliente de Supabase no está conectada.";
        console.error("supabaseClient no está inicializado correctamente.");
        return;
    }}

    const inputPhone = document.getElementById('input-phone');
    if (!inputPhone) return;

    const rawPhone = inputPhone.value.trim();

    if (!rawPhone) {{
        if (msg) msg.innerText = "Por favor, escribe tu número de teléfono.";
        return;
    }}

    // Extraer solo los dígitos numéricos
    const digitsOnly = rawPhone.replace(/\\D/g, '');

    let telefonoFormateado = '';

    if (digitsOnly.length === 9) {{
        // Caso estándar España: 9 dígitos -> añadir prefijo +34
        telefonoFormateado = '+34' + digitsOnly;
    }} else if (digitsOnly.length === 11 && digitsOnly.startsWith('34')) {{
        // Caso donde introducen 34XXXXXXXXX
        telefonoFormateado = '+' + digitsOnly;
    }} else if (rawPhone.startsWith('+')) {{
        telefonoFormateado = '+' + digitsOnly;
    }} else {{
        if (msg) msg.innerText = "Introduce un número válido de 9 dígitos (ej: 605676002).";
        return;
    }}

    console.log(`🔍 Verificando teléfono en authorized_users: ${{telefonoFormateado}}`);

    try {{
        // 1. Consultar si el número está en la tabla de autorizados
        const {{ data: user, error: checkError }} = await supabaseClient
            .from('authorized_users')
            .select('phone, name, role')
            .eq('phone', telefonoFormateado)
            .maybeSingle();

        if (checkError) {{
            console.error("Error al consultar la tabla authorized_users:", checkError);
            if (msg) msg.innerText = "⚠️ Error al consultar la base de datos: " + checkError.message;
            return;
        }}

        if (!user) {{
            console.warn(`El número ${{telefonoFormateado}} no se encontró en authorized_users.`);
            if (msg) msg.innerText = `⚠️ El número ${{digitsOnly}} no está registrado en la lista de usuarios autorizados.`;
            return;
        }}

        console.log("✅ Usuario verificado:", user.name, `(${{user.role}})`);

        // 2. Solicitar envío de OTP por WhatsApp a Supabase Auth
        const {{ error: otpError }} = await supabaseClient.auth.signInWithOtp({{
            phone: telefonoFormateado,
            options: {{ channel: 'whatsapp' }}
        }});

        if (otpError) {{
            console.error("Error al enviar el OTP por WhatsApp:", otpError);
            if (msg) msg.innerText = "Error enviando WhatsApp: " + otpError.message;
        }} else {{
            console.log("📩 Código OTP enviado con éxito por WhatsApp.");
            const stepPhone = document.getElementById('step-phone');
            const stepOtp = document.getElementById('step-otp');
            const desc = document.getElementById('auth-step-desc');

            if (stepPhone) stepPhone.style.display = 'none';
            if (stepOtp) stepOtp.style.display = 'block';
            if (desc) desc.innerText = `Introduce el código enviado a tu WhatsApp (${{digitsOnly}}):`;
        }}

    }} catch (err) {{
        console.error("Excepción en enviarCuervoOTP:", err);
        if (msg) msg.innerText = "Error inesperado al conectar con el servidor.";
    }}
}}
"""

# 3. Escribir los cambios en js/app.js
try:
    with open(FILE_PATH, "w", encoding="utf-8") as f:
        f.write(NUEVO_CODIGO_APP_JS)
    print(f"\n✅ Archivo {FILE_PATH} actualizado correctamente con las credenciales reales y la nueva lógica.")
except Exception as e:
    print(f"\n❌ Error escribiendo el archivo {FILE_PATH}: {e}")
    exit(1)

# 4. Ofrecer hacer commit y push automáticamente
hacer_push = input("\n🚀 ¿Quieres hacer 'git commit' y 'git push' a GitHub/Vercel ahora mismo? (s/n): ").strip().lower()

if hacer_push == 's':
    try:
        subprocess.run(["git", "add", FILE_PATH, "aplicar_cambios_auth.py"], check=True)
        subprocess.run(["git", "commit", "-m", "fix(auth): actualizar credenciales reales de Supabase y refactorizar auth"], check=True)
        subprocess.run(["git", "push"], check=True)
        print("\n🎉 Cambios subidos a GitHub con éxito. Vercel desplegará la nueva versión automáticamente.")
    except subprocess.CalledProcessError as e:
        print(f"\n⚠️️ Error al ejecutar los comandos de Git: {e}")
else:
    print("\n👍 Recuerda hacer commit y push manualmente cuando estés listo:")
    print(f"   git add {FILE_PATH}")
    print('   git commit -m "fix(auth): actualizar credenciales reales"')
    print("   git push")
