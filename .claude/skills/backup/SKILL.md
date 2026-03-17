---
name: backup
description: Setup automated backups for Supabase database and storage. Includes scheduled backups, disaster recovery procedures, and data retention policies for the CLB Tri Thức project.
---

# Backup Skill — CLB Tri Thức

## Mục tiêu
Thiết lập hệ thống backup tự động cho Supabase database và storage — đảm bảo data an toàn và có thể restore nhanh chóng khi cần.

---

## Quick Start

### Backup Strategy Overview
```
Daily Backups (7 days) → Weekly Archive (4 weeks) → Monthly Cold (12 months)
```

### Setup Options
| Method | Pros | Cons | Use Case |
|--------|------|------|----------|
| **Supabase CLI** | Native, easy | Manual | Ad-hoc backups |
| **GitHub Actions** | Automated, free | Limited storage | Daily backups |
| **pg_dump cron** | Full control | Needs server | Self-hosted |
| **Third-party** | Managed, reliable | Paid | Enterprise |

---

## PHẦN 1: GitHub Actions Automated Backups (Recommended)

### 1.1 Daily Database Backup

**.github/workflows/backup-daily.yml**:
```yaml
name: Daily Database Backup

on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily (9 AM VN)
  workflow_dispatch:

concurrency:
  group: backup
  cancel-in-progress: false

jobs:
  backup:
    name: Database Backup
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest

      - name: Create Backup Directory
        run: mkdir -p backups/$(date +%Y/%m)

      - name: Dump Database Schema
        run: |
          supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
          supabase db dump --db-url ${{ secrets.SUPABASE_DB_URL }} > backups/$(date +%Y/%m)/schema_$(date +%Y%m%d).sql
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}

      - name: Upload to GitHub Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: database-backup-${{ github.run_id }}
          path: backups/
          retention-days: 7

      - name: Upload to External Storage
        run: |
          aws s3 sync backups/ s3://${{ secrets.BACKUP_BUCKET }}/database/ --delete
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_DEFAULT_REGION: ap-southeast-1
```

### 1.2 Weekly Full Backup

**.github/workflows/backup-weekly.yml**:
```yaml
name: Weekly Full Backup

on:
  schedule:
    - cron: '0 3 * * 0'  # 3 AM UTC every Sunday
  workflow_dispatch:

jobs:
  full-backup:
    name: Full Database Backup
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install PostgreSQL Client
        run: |
          sudo apt-get update
          sudo apt-get install -y postgresql-client

      - name: Create Backup
        run: |
          mkdir -p backups/full
          pg_dump \
            --dbname=${{ secrets.SUPABASE_DB_URL }} \
            --format=custom \
            --verbose \
            --file=backups/full/backup_$(date +%Y%m%d_%H%M%S).dump

      - name: Compress Backup
        run: |
          cd backups/full
          gzip *.dump

      - name: Upload to S3
        run: |
          aws s3 cp backups/full/ s3://${{ secrets.BACKUP_BUCKET }}/full/ \
            --recursive \
            --storage-class STANDARD_IA
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Cleanup Old Backups
        run: |
          aws s3 ls s3://${{ secrets.BACKUP_BUCKET }}/full/ | \
            sort -r | \
            tail -n +5 | \
            awk '{print $4}' | \
            xargs -I {} aws s3 rm s3://${{ secrets.BACKUP_BUCKET }}/full/{}
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

### 1.3 Storage Bucket Backup

**.github/workflows/backup-storage.yml**:
```yaml
name: Storage Backup

on:
  schedule:
    - cron: '0 4 * * *'  # 4 AM UTC daily
  workflow_dispatch:

jobs:
  backup-storage:
    name: Storage Backup
    runs-on: ubuntu-latest
    
    steps:
      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest

      - name: Sync Storage to Local
        run: |
          mkdir -p backups/storage/documents
          supabase storage download documents backups/storage/documents/ --recursive
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_PROJECT_REF: ${{ secrets.SUPABASE_PROJECT_REF }}

      - name: Compress Storage
        run: |
          cd backups/storage
          tar -czf ../storage_$(date +%Y%m%d).tar.gz .

      - name: Upload to S3
        run: |
          aws s3 cp backups/storage_$(date +%Y%m%d).tar.gz \
            s3://${{ secrets.BACKUP_BUCKET }}/storage/
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

---

## PHẦN 2: Manual Backup Scripts

### 2.1 Database Dump Script

**scripts/backup-database.sh**:
```bash
#!/bin/bash

# Usage: ./backup-database.sh [environment]

set -e

ENV=${1:-production}
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/$ENV"

echo "Starting database backup..."

mkdir -p "$BACKUP_DIR"

if [ -z "$SUPABASE_DB_URL" ]; then
    echo "SUPABASE_DB_URL not set"
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
```

### 2.2 Restore Script

**scripts/restore-database.sh**:
```bash
#!/bin/bash

# Usage: ./restore-database.sh <backup_file>

set -e

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: ./restore-database.sh <backup_file>"
    exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "WARNING: This will restore database from backup!"
read -p "Are you sure? (type 'yes' to continue): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

# Decompress if needed
if [[ "$BACKUP_FILE" == *.gz ]]; then
    gunzip -c "$BACKUP_FILE" > "${BACKUP_FILE%.gz}"
    BACKUP_FILE="${BACKUP_FILE%.gz}"
fi

# Restore
if [[ "$BACKUP_FILE" == *.dump ]]; then
    pg_restore \
        --dbname="$SUPABASE_DB_URL" \
        --clean \
        --if-exists \
        --verbose \
        "$BACKUP_FILE"
elif [[ "$BACKUP_FILE" == *.sql ]]; then
    psql \
        --dbname="$SUPABASE_DB_URL" \
        --file="$BACKUP_FILE"
fi

echo "Restore completed!"
```

---

## PHẦN 3: Disaster Recovery Plan

### 3.1 RTO & RPO

| Component | RTO | RPO |
|-----------|-----|-----|
| Database | 1 hour | 24 hours |
| Storage | 2 hours | 24 hours |
| Full Site | 4 hours | 24 hours |

### 3.2 Recovery Procedures

**Scenario 1: Accidental Data Deletion**
```bash
# 1. Identify last good backup
ls -la backups/full/ | tail -10

# 2. Restore to staging first
./scripts/restore-database.sh backups/full/backup_20240315_020000.dump.gz

# 3. Verify data integrity
# 4. Restore to production
```

**Scenario 2: Complete Database Loss**
```bash
# 1. Create new Supabase project
# 2. Update connection strings
# 3. Restore from latest backup
./scripts/restore-database.sh backups/full/latest.dump.gz

# 4. Restore storage
# 5. Verify and update DNS
```

### 3.3 Recovery Checklist

- [ ] Xác định scope của incident
- [ ] Thông báo team
- [ ] Activate backup environment
- [ ] Restore database từ backup sạch
- [ ] Restore storage files
- [ ] Verify data integrity
- [ ] Run smoke tests
- [ ] Post-incident report

---

## PHẦN 4: Data Retention Policy

### 4.1 Retention Schedule

| Backup Type | Frequency | Retention | Storage |
|-------------|-----------|-----------|---------|
| Daily | Daily | 7 days | S3 Standard |
| Weekly | Weekly | 4 weeks | S3 Standard-IA |
| Monthly | Monthly | 12 months | S3 Glacier |

### 4.2 Cleanup Workflow

**.github/workflows/backup-cleanup.yml**:
```yaml
name: Backup Cleanup

on:
  schedule:
    - cron: '0 6 * * *'

jobs:
  cleanup:
    name: Cleanup Old Backups
    runs-on: ubuntu-latest
    
    steps:
      - name: Cleanup Daily (keep 7 days)
        run: |
          aws s3 ls s3://${{ secrets.BACKUP_BUCKET }}/daily/ | \
            while read -r line; do
              file_date=$(echo "$line" | awk '{print $1}')
              file_name=$(echo "$line" | awk '{print $4}')
              if [ $(($(date +%s) - $(date -d "$file_date" +%s))) -gt 604800 ]; then
                aws s3 rm "s3://${{ secrets.BACKUP_BUCKET }}/daily/$file_name"
              fi
            done
```

---

## PHẦN 5: Security

### 5.1 Backup Encryption
```bash
# Encrypt before upload
gpg --symmetric --cipher-algo AES256 backup.dump

# Decrypt when restoring
gpg --decrypt backup.dump.gpg > backup.dump
```

### 5.2 Access Control
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::clb-backups",
        "arn:aws:s3:::clb-backups/*"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    }
  ]
}
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Manual backup | `./scripts/backup-database.sh` |
| Restore database | `./scripts/restore-database.sh <file>` |
| List backups | `aws s3 ls s3://bucket/full/` |
| Download backup | `aws s3 cp s3://bucket/full/backup.dump .` |

---

## Integration

- **CI/CD**: Add backup verification vào deployment workflow
- **Monitoring**: Gửi backup status đến Sentry/Slack
- **Calendar**: Schedule quarterly disaster recovery drills
