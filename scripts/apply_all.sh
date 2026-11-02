#!/usr/bin/env bash
set -euo pipefail

# Ensure DATABASE_URL is set
if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: Export DATABASE_URL (postgres://user:pass@host:port/db)"
  exit 2
fi

# Apply base schema
echo "Applying sql/schema.sql to ${DATABASE_URL} ..."
psql "$DATABASE_URL" -f sql/schema.sql

# Apply all migrations in order
echo "Applying migrations..."
for file in sql/migrations/*.sql; do
  echo "Applying $file ..."
  psql "$DATABASE_URL" -f "$file"
done

echo "All changes applied successfully."
