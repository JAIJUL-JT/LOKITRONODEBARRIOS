import re

file_path = "js/app.js"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Reemplazo de la lógica de formateo del teléfono
old_logic = "telefonoFormateado = rawPhone.startsWith('+') ? rawPhone : '+34' + rawPhone.replace(/\\\\D/g, '');"
new_logic = """const soloNumeros = rawPhone.replace(/\\D/g, '');
    if (soloNumeros.length === 9) {
        telefonoFormateado = '+34' + soloNumeros;
    } else if (rawPhone.startsWith('+')) {
        telefonoFormateado = rawPhone;
    } else {
        msg.innerText = "Escribe un número válido de 9 dígitos.";
        return;
    }"""

if old_logic in content:
    content = content.replace(old_logic, new_logic)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("✅ Actualizado js/app.js para aceptar números de 9 dígitos sin prefijo.")
else:
    print("⚠️ Revisa manualmente js/app.js para aplicar el cambio.")
