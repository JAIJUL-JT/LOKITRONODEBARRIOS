#!/usr/bin/env python3
"""Configura de forma secreta el Oráculo Imperial (proxy Hugging Face).

Este script:
  1. Lee el token de Hugging Face (HF_TOKEN) del entorno o lo pide por consola
     (sin mostrarlo).
  2. Registra HF_TOKEN como *secreto* de Supabase para la Edge Function
     `oraculo-hf`, de modo que nunca viaje al navegador.
  3. Despliega la Edge Function `oraculo-hf` (salvo que se indique --no-deploy).

El token NUNCA se imprime ni se incluye en el repositorio. Solo se guarda, de
forma opcional, en `.env.local` (ignorado por git) para futuras ejecuciones.

Requisitos:
  - Supabase CLI instalada (`supabase --version`).
  - Una Access Token de Supabase (https://supabase.com/dashboard/account/tokens)
    exportada como SUPABASE_ACCESS_TOKEN.

Uso:
  SUPABASE_ACCESS_TOKEN=... HF_TOKEN=hf_xxx python3 scripts/configurar_oraculo_hf.py
  python3 scripts/configurar_oraculo_hf.py --no-deploy
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
FUNCION = "oraculo-hf"
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


def guardar_en_env_local(token: str) -> None:
    """Registra HF_TOKEN en .env.local (ignorado por git) sin tocar otros valores."""
    lineas: list[str] = []
    if ENV_LOCAL.is_file():
        lineas = ENV_LOCAL.read_text(encoding="utf-8", errors="ignore").splitlines()

    salida: list[str] = []
    encontrado = False
    for linea in lineas:
        if linea.strip().startswith("HF_TOKEN="):
            salida.append(f"HF_TOKEN={token}")
            encontrado = True
        else:
            salida.append(linea)
    if not encontrado:
        if salida and salida[-1].strip():
            salida.append("")
        salida.append("# Token del Oráculo Imperial (Hugging Face). NO subir al repositorio.")
        salida.append(f"HF_TOKEN={token}")

    ENV_LOCAL.write_text("\n".join(salida) + "\n", encoding="utf-8")
    log(f"HF_TOKEN guardado en {ENV_LOCAL.name} (ignorado por git).")


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
        help="Solo registra el secreto HF_TOKEN, sin desplegar la función.",
    )
    argumentos = parser.parse_args()

    if shutil.which("supabase") is None:
        error("No se encontró la Supabase CLI en el PATH (instala supabase).")

    hf_token = pedir_secreto(
        "Token de Hugging Face",
        "HF_TOKEN",
        "https://huggingface.co/settings/tokens",
    )
    access_token = os.environ.get("SUPABASE_ACCESS_TOKEN", "").strip()
    if not access_token:
        log(
            "No hay SUPABASE_ACCESS_TOKEN en el entorno; se usará la sesión "
            "guardada de la CLI (ejecuta 'supabase login' si no lo has hecho)."
        )
    project_ref = detectar_project_ref()

    guardar_en_env_local(hf_token)
    log(f"Proyecto Supabase detectado: {project_ref}")

    entorno = dict(os.environ)
    entorno["HF_TOKEN"] = hf_token
    if access_token:
        entorno["SUPABASE_ACCESS_TOKEN"] = access_token

    log("Registrando el secreto HF_TOKEN en Supabase…")
    ejecutar(
        ["supabase", "secrets", "set", f"HF_TOKEN={hf_token}", "--project-ref", project_ref],
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

    log("Listo. El Oráculo Imperial ya usa Hugging Face con el token a salvo.")


if __name__ == "__main__":
    main()
