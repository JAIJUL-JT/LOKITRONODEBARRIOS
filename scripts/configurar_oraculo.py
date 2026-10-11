#!/usr/bin/env python3
"""Configura de forma secreta el Oráculo Imperial (proxy de un proveedor de IA).

Por defecto usa Groq (capa gratuita). El proxy es OpenAI-compatible, así que
también sirve para OpenRouter, Google Gemini (endpoint OpenAI) u otros.

Este script:
  1. Lee la clave del proveedor (GROQ_API_KEY por defecto) del entorno o la pide
     por consola (sin mostrarla).
  2. Registra la clave como *secreto* de Supabase para la Edge Function
     `oraculo`, de modo que nunca viaje al navegador.
  3. Despliega la Edge Function `oraculo` (salvo que se indique --no-deploy).

La clave NUNCA se imprime ni se incluye en el repositorio. Solo se guarda, de
forma opcional, en `.env.local` (ignorado por git) para futuras ejecuciones.

Requisitos:
  - Supabase CLI instalada (`supabase --version`).
  - Una Access Token de Supabase (https://supabase.com/dashboard/account/tokens)
    exportada como SUPABASE_ACCESS_TOKEN (o sesión de `supabase login`).

Uso:
  SUPABASE_ACCESS_TOKEN=... GROQ_API_KEY=gsk_xxx python3 scripts/configurar_oraculo.py
  python3 scripts/configurar_oraculo.py --no-deploy

Proveedores alternativos (OpenAI-compatible):
  ORACULO_API_URL=https://openrouter.ai/api/v1/chat/completions \\
  ORACULO_PROVIDER=OpenRouter ORACULO_API_KEY=sk-or-... \\
  python3 scripts/configurar_oraculo.py
"""

from __future__ import annotations

import argparse
import getpass
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
FUNCION = "oraculo"
ENV_LOCAL = RAIZ / ".env.local"
FICHEROS_ENV = (".env.to_push", ".env.local", ".env.jpmw.production")


def log(mensaje: str) -> None:
    print(f"\033[36m[oráculo]\033[0m {mensaje}")


def error(mensaje: str) -> None:
    print(f"\033[31m[error]\033[0m {mensaje}", file=sys.stderr)
    sys.exit(1)


def pedir_secreto(nombre: str, variable: str, ayuda: str) -> str:
    """Obtiene un secreto del entorno o lo pide por consola sin mostrarlo."""
    valor = os.environ.get(variable, "").strip()
    if valor:
        return valor
    print(f"{nombre} ({ayuda})")
    valor = getpass.getpass(f"Introduce {variable}: ").strip()
    if not valor:
        error(f"El valor de {variable} es obligatorio.")
    return valor


def leer_env(ruta: Path) -> dict[str, str]:
    datos: dict[str, str] = {}
    if not ruta.is_file():
        return datos
    for linea in ruta.read_text(encoding="utf-8", errors="ignore").splitlines():
        linea = linea.strip()
        if not linea or linea.startswith("#") or "=" not in linea:
            continue
        clave, _, valor = linea.partition("=")
        datos[clave.strip()] = valor.strip().strip('"').strip("'")
    return datos


def detectar_project_ref() -> str:
    """Deduce el project ref de Supabase desde el entorno o los .env del repo."""
    ref = os.environ.get("SUPABASE_PROJECT_REF", "").strip()
    if ref:
        return ref

    claves_url = (
        "SUPABASE_URL",
        "POSTGRES_URL",
        "POSTGRES_URL_NON_POOLING",
        "VITE_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_URL",
    )
    for fichero in FICHEROS_ENV:
        datos = leer_env(RAIZ / fichero)
        for clave in claves_url:
            valor = datos.get(clave, "")
            coincidencia = re.search(r"https://([a-z0-9]+)\.supabase\.", valor)
            if coincidencia:
                return coincidencia.group(1)
            # Formato postgres://postgres.<ref>:...
            coincidencia = re.search(r"postgres\.([a-z0-9]+):", valor)
            if coincidencia:
                return coincidencia.group(1)

    print("No se pudo deducir el SUPABASE_PROJECT_REF automáticamente.")
    ref = input("Introduce el project ref de Supabase: ").strip()
    if not ref:
        error("El project ref es obligatorio.")
    return ref


def guardar_en_env_local(clave: str, variable: str) -> None:
    """Registra el secreto en .env.local (ignorado por git) sin tocar el resto."""
    lineas: list[str] = []
    if ENV_LOCAL.is_file():
        lineas = ENV_LOCAL.read_text(encoding="utf-8", errors="ignore").splitlines()

    salida: list[str] = []
    encontrado = False
    for linea in lineas:
        if linea.strip().startswith(f"{variable}="):
            salida.append(f"{variable}={clave}")
            encontrado = True
        else:
            salida.append(linea)
    if not encontrado:
        if salida and salida[-1].strip():
            salida.append("")
        salida.append(f"# Clave del Oráculo Imperial ({variable}). NO subir al repositorio.")
        salida.append(f"{variable}={clave}")

    ENV_LOCAL.write_text("\n".join(salida) + "\n", encoding="utf-8")
    log(f"{variable} guardado en {ENV_LOCAL.name} (ignorado por git).")


def ejecutar(cmd: list[str], env: dict[str, str]) -> None:
    """Ejecuta un comando mostrando su salida sin exponer secretos del entorno."""
    resultado = subprocess.run(cmd, env=env, cwd=str(RAIZ))
    if resultado.returncode != 0:
        error(f"El comando falló: {' '.join(cmd[:3])} … (código {resultado.returncode})")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--no-deploy",
        action="store_true",
        help="Solo registra el secreto, sin desplegar la función.",
    )
    argumentos = parser.parse_args()

    if shutil.which("supabase") is None:
        error("No se encontró la Supabase CLI en el PATH (instala supabase).")

    variable_clave = (
        "GROQ_API_KEY"
        if not os.environ.get("ORACULO_API_KEY", "").strip()
        else "ORACULO_API_KEY"
    )
    ayuda = (
        "https://console.groq.com/keys"
        if variable_clave == "GROQ_API_KEY"
        else "URL de tu proveedor OpenAI-compatible"
    )
    clave = pedir_secreto("Clave del proveedor de IA", variable_clave, ayuda)

    access_token = os.environ.get("SUPABASE_ACCESS_TOKEN", "").strip()
    if not access_token:
        log(
            "No hay SUPABASE_ACCESS_TOKEN en el entorno; se usará la sesión "
            "guardada de la CLI (ejecuta 'supabase login' si no lo has hecho)."
        )
    project_ref = detectar_project_ref()

    guardar_en_env_local(clave, variable_clave)
    log(f"Proyecto Supabase detectado: {project_ref}")

    entorno = dict(os.environ)
    entorno[variable_clave] = clave
    if access_token:
        entorno["SUPABASE_ACCESS_TOKEN"] = access_token

    secretos = [f"{variable_clave}={clave}"]
    # Permite cambiar de proveedor sin tocar el código de la función.
    if os.environ.get("ORACULO_API_URL", "").strip():
        secretos.append(f"ORACULO_API_URL={os.environ['ORACULO_API_URL'].strip()}")
    if os.environ.get("ORACULO_PROVIDER", "").strip():
        secretos.append(f"ORACULO_PROVIDER={os.environ['ORACULO_PROVIDER'].strip()}")

    log(f"Registrando el secreto {variable_clave} en Supabase…")
    ejecutar(
        ["supabase", "secrets", "set", *secretos, "--project-ref", project_ref],
        entorno,
    )

    if argumentos.no_deploy:
        log("Secreto registrado. Omitiendo despliegue (--no-deploy).")
    else:
        log(f"Desplegando la Edge Function '{FUNCION}'…")
        ejecutar(
            [
                "supabase",
                "functions",
                "deploy",
                FUNCION,
                "--project-ref",
                project_ref,
            ],
            entorno,
        )

    log("Listo. El Oráculo Imperial ya funciona con la clave a salvo en el servidor.")


if __name__ == "__main__":
    main()
