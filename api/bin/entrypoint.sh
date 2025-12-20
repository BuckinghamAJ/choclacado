#!/bin/sh
set -e

migrate -path=/app/migrations -database="$CHOCLACADO_DATABASE_URL" up

exec "$@"
