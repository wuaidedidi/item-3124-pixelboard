#!/usr/bin/env bash
set -euo pipefail

export PYTHONPATH=/app/backend
export DATABASE_URL="${DATABASE_URL:-sqlite:////app/data/pixelboard.db}"
export UPLOAD_DIR="${UPLOAD_DIR:-/app/backend/uploads}"

mkdir -p /app/data "$UPLOAD_DIR"

echo "PixelBoard container starting"
echo "Frontend: http://localhost:3000"
echo "Backend API docs: http://localhost:8000/docs"
echo "Health check: http://localhost:8000/api/health"
echo "Database: $DATABASE_URL"

uvicorn app.main:app --host 0.0.0.0 --port 8000 &
API_PID=$!

nginx -g "daemon off;" &
NGINX_PID=$!

term_handler() {
    kill "$API_PID" "$NGINX_PID" 2>/dev/null || true
}

trap term_handler TERM INT
wait -n "$API_PID" "$NGINX_PID"
term_handler
