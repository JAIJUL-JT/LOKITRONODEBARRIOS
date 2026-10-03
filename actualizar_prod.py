import re

file_path = "js/app.js"

# ⚠️ SUSTITUYE ESTOS DOS VALORES CON LOS DE TU PANEL DE SUPABASE CLOUD (Project Settings -> API)
REAL_SUPABASE_URL = "https://TU_PROYECTO_REAL.supabase.co"
REAL_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.TU_KEY_REAL..."

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Reemplazar URLs/Keys de plantilla por las reales
content = re.sub(r"const SUPABASE_URL = ['\"].*?['\"]", f"const SUPABASE_URL = '{REAL_SUPABASE_URL}'", content)
content = re.sub(r"const SUPABASE_ANON_KEY = ['\"].*?['\"]", f"const SUPABASE_ANON_KEY = '{REAL_ANON_KEY}'", content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("✅ js/app.js actualizado con éxito con la URL y Clave reales de Supabase Cloud.")
