---
name: cicd
description: Setup CI/CD pipelines with GitHub Actions for the CLB Tri Thức project. Includes automated testing, building, deployment previews, and production deployment workflows.
---

# CI/CD Skill — CLB Tri Thức

## Mục tiêu
Thiết lập GitHub Actions workflows để automate testing, building, và deployment — đảm bảo code quality và deployment reliability.

---

## Quick Start

### Setup cơ bản
```bash
# Tạo thư mục workflows
mkdir -p .github/workflows

# Các workflow files sẽ được tạo ở dưới
```

### Các workflows chính
| Workflow | Trigger | Mục đích |
|----------|---------|----------|
| `ci.yml` | Push/PR to main | Lint, type-check, test, build |
| `e2e.yml` | Push/PR to main | Run Playwright E2E tests |
| `deploy-preview.yml` | Pull Request | Deploy preview to Vercel |
| `deploy-production.yml` | Push to main | Deploy to production |
| `cleanup-preview.yml` | PR closed | Cleanup preview deployments |

---

## PHẦN 1: CI Workflow (Core)

**.github/workflows/ci.yml**:
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    name: ESLint
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

  typecheck:
    name: TypeScript
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Type Check
        run: npm run type-check

  test:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Unit Tests
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: false

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, typecheck, test]
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

---

## PHẦN 2: E2E Tests Workflow

**.github/workflows/e2e.yml**:
```yaml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  e2e:
    name: Playwright E2E
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npm run test:e2e
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: |
            playwright-report/
            test-results/
          retention-days: 7
```

---

## PHẦN 3: Deployment Workflows

### 3.1 Preview Deployment (Vercel)

**.github/workflows/deploy-preview.yml**:
```yaml
name: Deploy Preview

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  deploy-preview:
    name: Deploy Preview
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Vercel CLI
        run: npm install -g vercel@latest

      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to Vercel
        id: deploy
        run: |
          DEPLOY_URL=$(vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }})
          echo "deploy_url=$DEPLOY_URL" >> $GITHUB_OUTPUT

      - name: Comment Preview URL
        uses: actions/github-script@v7
        with:
          script: |
            const deployUrl = '${{ steps.deploy.outputs.deploy_url }}';
            const comment = `**Preview deployed!**\n\n${deployUrl}`;
            
            const { data: comments } = await github.rest.issues.listComments({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
            });
            
            const botComment = comments.find(c => c.body.includes('Preview deployed!'));
            
            if (botComment) {
              await github.rest.issues.updateComment({
                comment_id: botComment.id,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: comment,
              });
            } else {
              await github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: comment,
              });
            }
```

### 3.2 Production Deployment

**.github/workflows/deploy-production.yml**:
```yaml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  deploy-production:
    name: Deploy Production
    runs-on: ubuntu-latest
    needs: [ci, e2e]
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Vercel CLI
        run: npm install -g vercel@latest

      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to Production
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}

  notify:
    name: Notify Deployment
    runs-on: ubuntu-latest
    needs: deploy-production
    if: always()
    steps:
      - name: Notify Success
        if: needs.deploy-production.result == 'success'
        run: |
          echo "Production deployment successful!"
          # Add Slack/Discord webhook notification here

      - name: Notify Failure
        if: needs.deploy-production.result == 'failure'
        run: |
          echo "Production deployment failed!"
          # Add Slack/Discord webhook notification here
```

### 3.3 Cleanup Preview

**.github/workflows/cleanup-preview.yml**:
```yaml
name: Cleanup Preview

on:
  pull_request:
    types: [closed]

jobs:
  cleanup:
    name: Cleanup Preview
    runs-on: ubuntu-latest
    steps:
      - name: Remove Vercel Preview
        run: |
          echo "Preview deployment will be automatically removed by Vercel"
          echo "PR #${{ github.event.pull_request.number }} closed"
```

---

## PHẦN 4: Security & Secrets

### Required Secrets (GitHub Settings → Secrets and variables → Actions)

| Secret | Mô tả | Lấy ở đâu |
|--------|-------|-----------|
| `VERCEL_TOKEN` | Vercel API token | Vercel Dashboard → Settings → Tokens |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role | Supabase Dashboard → Settings → API (keep secret!) |
| `CODECOV_TOKEN` | Codecov upload token | Codecov Dashboard → Settings |

### vercel.json (optional)
```json
{
  "github": {
    "enabled": false
  },
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "regions": ["sin1"]
}
```

---

## PHẦN 5: Advanced Workflows

### 5.1 Dependabot Auto-merge

**.github/workflows/dependabot-auto-merge.yml**:
```yaml
name: Dependabot Auto-merge

on:
  pull_request:
    branches: [main]

jobs:
  auto-merge:
    name: Auto-merge Dependabot PRs
    runs-on: ubuntu-latest
    if: github.actor == 'dependabot[bot]'
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test

      - name: Auto-merge
        if: success()
        run: |
          gh pr merge --auto --squash "$PR_URL"
        env:
          PR_URL: ${{ github.event.pull_request.html_url }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 5.2 Release Workflow

**.github/workflows/release.yml**:
```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    name: Create Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
          prerelease: false
```

### 5.3 Database Migration Check

**.github/workflows/db-migration.yml**:
```yaml
name: Database Migration Check

on:
  pull_request:
    paths:
      - 'supabase/migrations/**'

jobs:
  validate-migration:
    name: Validate Migration
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest

      - name: Check migration syntax
        run: |
          for file in supabase/migrations/*.sql; do
            echo "Checking $file..."
            if ! grep -q "CREATE\|ALTER\|DROP\|INSERT\|UPDATE" "$file"; then
              echo "Warning: $file may not contain valid SQL commands"
            fi
          done
```

---

## PHẦN 6: Best Practices

### Workflow Design
1. **Fail fast** — Lint và type-check chạy trước tests
2. **Parallel jobs** — Các checks độc lập chạy song song
3. **Cancel redundant** — Dùng `concurrency` để cancel run cũ
4. **Cache dependencies** — Luôn dùng `cache: 'npm'`

### Secrets Management
1. **Never log secrets** — GitHub tự động mask secrets
2. **Use environment protection** — Production deployments cần approval
3. **Rotate regularly** — Đổi tokens mỗi 90 ngày
4. **Least privilege** — Tokens chỉ có quyền cần thiết

### Deployment Strategy
1. **Preview first** — Mỗi PR có preview deployment
2. **Require checks** — Không merge khi CI failed
3. **Rollback ready** — Vercel giữ deployment history
4. **Monitor post-deploy** — Check Sentry sau deployment

---

## Quick Reference

| Workflow | File | Trigger |
|----------|------|---------|
| CI | `.github/workflows/ci.yml` | Push/PR |
| E2E | `.github/workflows/e2e.yml` | Push/PR |
| Preview | `.github/workflows/deploy-preview.yml` | PR open/update |
| Production | `.github/workflows/deploy-production.yml` | Push to main |
| Cleanup | `.github/workflows/cleanup-preview.yml` | PR close |
