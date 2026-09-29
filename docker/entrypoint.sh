#!/usr/bin/env bash
set -euo pipefail
cd /app/frontend

# vite.config.ts only tries to read certs/{cert,key}.pem when
# VITE_ENVIROMENT=development (note: "ENVIROMENT" is the actual, intentional
# spelling used throughout this codebase's env vars). In any other mode it
# skips TLS entirely and never touches these files, so nothing to do then.
if [[ "${VITE_ENVIROMENT:-}" == "development" ]]; then
  if [[ ! -f certs/cert.pem || ! -f certs/key.pem ]]; then
    mkdir -p certs
    openssl req -x509 -newkey rsa:4096 -keyout certs/key.pem -out certs/cert.pem \
      -days 365 -nodes -subj "/CN=localhost"
  fi
fi

exec "$@"
