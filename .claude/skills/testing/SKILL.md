---
name: testing
description: Setup and write tests for the CLB Tri Thức project — unit tests with Vitest + React Testing Library, and E2E tests with Playwright. Use when asked to create tests, fix test failures, or set up testing infrastructure.
---

# Testing Skill — CLB Tri Thức

## Mục tiêu
Thiết lập và duy trì test suite chất lượng cao cho Next.js project — bao gồm unit tests cho components/hooks/utils và E2E tests cho critical user flows.

---

## Quick Start

### Setup lần đầu
```bash
# Install testing dependencies
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
npm install -D @playwright/test

# Create config files (see templates below)
```

### Run tests
```bash
# Unit tests
npm run test           # Run once
npm run test:watch     # Watch mode
npm run test:coverage  # With coverage report

# E2E tests
npm run test:e2e       # Run all E2E tests
npm run test:e2e:ui    # Open Playwright UI mode
npm run test:e2e:debug # Debug mode
```

---

## PHẦN 1: Unit Tests (Vitest + React Testing Library)

### 1.1 Vitest Config

**vitest.config.ts** (tạo ở root):
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 1.2 Test Setup File

**src/test/setup.ts**:
```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup sau mỗi test
afterEach(() => {
  cleanup();
});

// Mock next/router
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));
```

### 1.3 Component Test Pattern

**src/components/ui/button.test.tsx**:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-600');
  });

  it('is disabled when loading', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### 1.4 Hook Test Pattern

**src/hooks/use-mobile.test.ts**:
```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from './use-mobile';

describe('useIsMobile', () => {
  beforeEach(() => {
    // Reset window size
    window.innerWidth = 1024;
  });

  it('returns false on desktop', () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('returns true on mobile', () => {
    act(() => {
      window.innerWidth = 375;
      window.dispatchEvent(new Event('resize'));
    });
    
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });
});
```

### 1.5 Utility Function Tests

**src/lib/utils.test.ts**:
```typescript
import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn (className merge)', () => {
  it('merges classes correctly', () => {
    expect(cn('btn', 'btn-primary')).toBe('btn btn-primary');
  });

  it('handles conditional classes', () => {
    const isActive = true;
    expect(cn('btn', isActive && 'active')).toBe('btn active');
  });

  it('resolves tailwind conflicts', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});
```

---

## PHẦN 2: E2E Tests (Playwright)

### 2.1 Playwright Config

**playwright.config.ts** (root):
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 2.2 E2E Test Patterns

**e2e/homepage.spec.ts**:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /clb tri thức/i })).toBeVisible();
  });

  test('should navigate to knowledge hub', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /kiến thức/i }).click();
    await expect(page).toHaveURL(/.*kien-thuc/);
  });

  test('should switch language', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /language/i }).click();
    await page.getByText('English').click();
    await expect(page).toHaveURL(/\/en/);
  });
});
```

**e2e/knowledge-hub.spec.ts**:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Knowledge Hub', () => {
  test('should display article list', async ({ page }) => {
    await page.goto('/kien-thuc');
    await expect(page.getByTestId('article-grid')).toBeVisible();
  });

  test('should filter by category', async ({ page }) => {
    await page.goto('/kien-thuc');
    await page.getByRole('tab', { name: /thực chiến/i }).click();
    await expect(page.getByTestId('article-card').first()).toBeVisible();
  });

  test('should open article detail', async ({ page }) => {
    await page.goto('/kien-thuc');
    const firstArticle = page.getByTestId('article-card').first();
    await firstArticle.click();
    await expect(page.getByRole('article')).toBeVisible();
  });
});
```

**e2e/auth.spec.ts**:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/dang-nhap');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /đăng nhập/i }).click();
    await expect(page.getByText(/đăng nhập thành công/i)).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/dang-nhap');
    await page.getByLabel(/email/i).fill('invalid@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /đăng nhập/i }).click();
    await expect(page.getByText(/sai thông tin/i)).toBeVisible();
  });
});
```

### 2.3 Page Object Model (Recommended)

**e2e/pages/HomePage.ts**:
```typescript
import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly heroHeading: Locator;
  readonly navKnowledge: Locator;
  readonly languageSwitcher: Locator;

  constructor(readonly page: Page) {
    this.heroHeading = page.getByRole('heading', { name: /clb tri thức/i });
    this.navKnowledge = page.getByRole('link', { name: /kiến thức/i });
    this.languageSwitcher = page.getByRole('button', { name: /language/i });
  }

  async goto() {
    await this.page.goto('/');
  }

  async navigateToKnowledgeHub() {
    await this.navKnowledge.click();
  }
}
```

---

## PHẦN 3: Update package.json Scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:codegen": "playwright codegen"
  }
}
```

---

## PHẦN 4: Best Practices

### Unit Tests
1. **Test behavior, not implementation** — kiểm tra output, không phải internal state
2. **Một test, một assertion concept** — không test quá nhiều thứ trong một `it()`
3. **Use testid sparingly** — ưu tiên role/label/text trước data-testid
4. **Mock external dependencies** — API calls, router, v.v.

### E2E Tests
1. **Test critical paths only** — đăng nhập, thanh toán, đọc bài viết
2. **Avoid testing third-party** — không test Supabase, Stripe trực tiếp
3. **Use stable selectors** — ưu tiên role/label, tránh class CSS
4. **Isolate tests** — mỗi test tự setup/cleanup data riêng

### Test Data
```typescript
// fixtures/test-data.ts
export const mockArticles = [
  {
    id: 1,
    title: 'Test Article',
    slug: 'test-article',
    excerpt: 'Test excerpt',
    category: 'thuc-chien',
    reading_time: 5,
  },
];

export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  membership_tier: 'premium',
};
```

---

## PHẦN 5: CI Integration

Xem skill `cicd` để tích hợp tests vào GitHub Actions workflow.

---

## Quick Reference

| Task | Command |
|------|---------|
| Run unit tests | `npm run test` |
| Watch mode | `npm run test:watch` |
| Coverage | `npm run test:coverage` |
| E2E tests | `npm run test:e2e` |
| E2E UI mode | `npm run test:e2e:ui` |
| Generate test | `npm run test:e2e:codegen http://localhost:3000` |
