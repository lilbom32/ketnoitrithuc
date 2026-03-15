#!/bin/bash

# Usage: ./backup-database.sh [environment]

set -e

ENV=${1:-production}
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/$ENV"

echo "Starting database backup..."

mkdir -p "$BACKUP_DIR"

if [ -z "$SUPABASE_DB_URL" ]; then
    echo "Error: SUPABASE_DB_URL not set"
    exit 1
fi

# Dump schema only
echo "Backing up schema..."
pg_dump \
    --dbname="$SUPABASE_DB_URL" \
    --schema-only \
    --file="$BACKUP_DIR/schema_$DATE.sql"

# Dump data only
echo "Backing up data..."
pg_dump \
    --dbname="$SUPABASE_DB_URL" \
    --data-only \
    --file="$BACKUP_DIR/data_$DATE.sql"

# Full dump
echo "Creating full backup..."
pg_dump \
    --dbname="$SUPABASE_DB_URL" \
    --format=custom \
    --file="$BACKUP_DIR/full_$DATE.dump"

# Compress
gzip "$BACKUP_DIR/full_$DATE.dump"

echo "Backup completed: $BACKUP_DIR/full_$DATE.dump.gz"
echo "Size: $(du -h "$BACKUP_DIR/full_$DATE.dump.gz" | cut -f1)"
