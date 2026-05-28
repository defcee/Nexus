#!/usr/bin/env bash
set -euo pipefail

# Simple setup script to run the migrations.sql against your MySQL database
# Requires mysql client to be installed and reachable from the environment where you run this script.

MYSQL_HOST=${MYSQL_HOST:-}
MYSQL_PORT=${MYSQL_PORT:-3306}
MYSQL_USER=${MYSQL_USER:-}
MYSQL_PASSWORD=${MYSQL_PASSWORD:-}
MYSQL_DATABASE=${MYSQL_DATABASE:-}

if [ -z "$MYSQL_HOST" ] || [ -z "$MYSQL_USER" ] || [ -z "$MYSQL_PASSWORD" ] || [ -z "$MYSQL_DATABASE" ]; then
  echo "Please set MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, and MYSQL_DATABASE environment variables before running this script."
  exit 1
fi

if ! command -v mysql >/dev/null 2>&1; then
  echo "mysql client not found. Install the MySQL client to run migrations, or run the SQL file manually via your DB provider."
  exit 1
fi

echo "Running migrations against $MYSQL_HOST:$MYSQL_PORT, database $MYSQL_DATABASE"
mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" < database/migrations.sql

echo "Migrations applied successfully."
