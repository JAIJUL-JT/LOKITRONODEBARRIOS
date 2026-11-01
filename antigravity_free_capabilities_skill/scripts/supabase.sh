#!/usr/bin/env bash
# Simple wrapper for Supabase REST API (free tier)
# Usage: supabase.sh <method> "table=TABLE" "data=JSON"
METHOD=$1
shift
while [[ "$#" -gt 0 ]]; do
  eval "$1"
  shift
done
if [[ -z "$SUPABASE_URL" || -z "$SUPABRA_ANON_KEY" ]]; then
  echo "Error: SUPABASE_URL and SUPABASE_ANON_KEY must be exported." >&2
  exit 1
fi
URL="${SUPABASE_URL}/rest/v1/${table}"
curl -s -X "$METHOD" "$URL" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "$data"
