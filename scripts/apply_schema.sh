#!/usr/bin/env bash
set -euo pipefail

# Script para aplicar sql/schema.sql contra un Postgres (DATABASE_URL)
if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: exporta DATABASE_URL (postgres://user:pass@host:port/db)"
  exit 2
fi

echo "Aplicando sql/schema.sql a ${DATABASE_URL} ..."
psql "$DATABASE_URL" -f sql/schema.sql
echo "Hecho."
