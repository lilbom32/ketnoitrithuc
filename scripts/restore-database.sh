#!/bin/bash

# Usage: ./restore-database.sh <backup_file>

set -e

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: ./restore-database.sh <backup_file>"
    exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "WARNING: This will restore database from backup!"
echo "Backup file: $BACKUP_FILE"
read -p "Are you sure? (type 'yes' to continue): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

# Decompress if needed
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo "Decompressing..."
    gunzip -c "$BACKUP_FILE" > "${BACKUP_FILE%.gz}"
    BACKUP_FILE="${BACKUP_FILE%.gz}"
fi

# Restore
if [[ "$BACKUP_FILE" == *.dump ]]; then
    echo "Restoring from custom format..."
    pg_restore \
        --dbname="$SUPABASE_DB_URL" \
        --clean \
        --if-exists \
        --verbose \
        "$BACKUP_FILE"
elif [[ "$BACKUP_FILE" == *.sql ]]; then
    echo "Restoring from SQL..."
    psql \
        --dbname="$SUPABASE_DB_URL" \
        --file="$BACKUP_FILE"
else
    echo "Error: Unknown backup format"
    exit 1
fi

echo "Restore completed!"
