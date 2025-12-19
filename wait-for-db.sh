#!/bin/sh
# ============================================
# Wait for Database Script
# ============================================
# This script waits for PostgreSQL to be ready before starting the application.
# It's useful because:
# 1. Docker's depends_on only waits for container to START, not be READY
# 2. PostgreSQL takes a few seconds to initialize and accept connections
# 3. The backend app will crash if it tries to connect before DB is ready
#
# Usage in docker-compose.yml:
#   command: ["sh", "./wait-for-db.sh", "npm", "run", "dev"]
#
# The script expects these environment variables:
#   - DB_HOST: PostgreSQL host (e.g., postgres or 172.17.0.1)
#   - DB_PORT: PostgreSQL port (e.g., 5432)
#   - DB_USER: PostgreSQL user (e.g., postgres)

echo "============================================"
echo "Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."
echo "============================================"

# Loop until pg_isready returns success (exit code 0)
# pg_isready is a PostgreSQL utility that checks if the server accepts connections
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do
  echo "PostgreSQL is not ready yet. Retrying in 2 seconds..."
  sleep 2
done

echo "============================================"
echo "PostgreSQL is ready! Starting application..."
echo "============================================"

# exec replaces this shell process with the given command
# This ensures signals (like SIGTERM) are passed to the app properly
# "$@" expands to all arguments passed to this script
exec "$@"
