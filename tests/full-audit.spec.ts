import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Глобальні змінні для звіту
const AUDIT_RESULTS: {
  page: string;
  path: string;
  status: 'pass' | 'fail' | 'error';
  statusCode?: number;
  loadTime?: number;
  errors: string[];
  warnings: string[];
  consoleErrors: string[];
  networkErrors: string[];
  missingElements: string[];
}[] = [];

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Сторінки для перевірки
const PAGES_TO_AUDIT = [
  // Головна та marketplace
  { path: '/', name: 'Home' },
  { path: '/search', name: 'Search' },
  { path: '/cart', name: 'Cart' },
  { path: '/checkout', name: 'Checkout' },
  { path: '/compare', name: 'Compare' },
  { path: '/favorites', name: 'Favorites' },
  
  // Auth
  { path: '/login', name: 'Login' },
  { path: '/register', name: 'Register' },
  
  // Account
  { path: '/account', name: 'Account' },
  { path: '/account/orders', name: 'Account Orders' },
  { path: '/account/wishlist', name: 'Account Wishlist' },
  
  // Info pages
  { path: '/about', name: 'About' },
  { path: '/contact', name: 'Contact' },
  { path: '/help', name: 'Help' },
  { path: '/pricing', name: 'Pricing' },
  { path: '/delivery', name: 'Delivery' },
  { path: '/returns', name: 'Returns' },
  { path: '/privacy', name: 'Privacy' },
  { path: '/terms', name: 'Terms' },
  { path: '/cookies', name: 'Cookies' },
  { path: '/buyer-protection', name: 'Buyer Protection' },
  
  // Sellers
  { path: '/sellers', name: 'Sellers' },
  
  // Dashboard (перевіряємо redirect)
  { path: '/dashboard', name: 'Dashboard' },
  
  // Admin
  { path: '/admin', name: 'Admin' },
  { path: '/superadmin', name: 'SuperAdmin' },
  
  // API endpoints
  { path: '/api-docs', name: 'API Docs' },
];

// Функія для збереження звіту
function saveReport() {
  const reportDir = path.join(process.cwd(), 'docs', 'reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const reportPath = path.join(reportDir, 'PLAYWRIGHT_AUDIT_REPORT.md');
  const date = new Date().toISOString();
  
  const totalTests = AUDIT_RESULTS.length;
  const passedTests = AUDIT_RESULTS.filter(r => r.status === 'pass').length;
  const failedTests = AUDIT_RESULTS.filter(r => r.status === 'fail' || r.status === 'error').length;
  const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : '0.0';
  
  let report = `# 📊 Playwright Audit Report
**Дата:** ${date}
**Base URL:** ${BASE_URL}

---

## 📈 Підсумки

| Показник | Значення |
|----------|----------|
| Всього сторінок | ${totalTests} |
| Пройдено | ✅ ${passedTests} |
| Провалено | ❌ ${failedTests} |
| Відсоток успішності | ${passRate}% |

---

## 📋 Детальні результати

`;

  // Сортуємо: спочатку ті, що не пройшли
  const sortedResults = [...AUDIT_RESULTS].sort((a, b) => {
    if (a.status === 'pass' && b.status !== 'pass') return 1;
    if (a.status !== 'pass' && b.status === 'pass') return -1;
    return 0;
  });

  for (const result of sortedResults) {
    const statusIcon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️';
    const fullUrl = result.path.startsWith('/') ? `${BASE_URL}${result.path}` : result.path;
    report += `### ${statusIcon} ${result.page}

**URL:** \`${fullUrl}\`
**Status Code:** ${result.statusCode || 'N/A'}
**Load Time:** ${result.loadTime ? result.loadTime + 'ms' : 'N/A'}

`;

    if (result.errors.length > 0) {
      report += `**Помилки:**
${result.errors.map(e => `- ${e}`).join('\n')}

`;
    }

    if (result.warnings.length > 0) {
      report += `**Попередження:**
${result.warnings.map(w => `- ${w}`).join('\n')}

`;
    }

    if (result.consoleErrors.length > 0) {
      report += `**Console Errors:**
\`\`\`
${result.consoleErrors.join('\n')}
\`\`\`

`;
    }

    if (result.networkErrors.length > 0) {
      report += `**Network Errors:**
${result.networkErrors.map(e => `- ${e}`).join('\n')}

`;
    }

    if (result.missingElements.length > 0) {
      report += `**Відсутні елементи:**
${result.missingElements.map(e => `- ${e}`).join('\n')}

`;
    }

    report += `---

`;
  }

  // Додаємо розділ з рекомендаціями
  report += `
## 🔧 Рекомендації

`;

  const pagesWithErrors = AUDIT_RESULTS.filter(r => r.status !== 'pass');
  if (pagesWithErrors.length > 0) {
    report += `### Сторінки, що потребують уваги:

`;
    for (const result of pagesWithErrors) {
      report += `- [ ] **${result.page}**: ${result.errors.join('; ') || 'Помилка заванантаження'}\n`;
    }
  } else {
    report += `✅ Всі сторінки працюють коректно!\n`;
  }

  fs.writeFileSync(reportPath, report, 'utf-8');
  console.log(`📄 Звіт збережено: ${reportPath}`);
}

// Описуємо тести
test.describe('🔍 Повний аудит сторінок Wazo.Market', () => {
  // Перевірка кожної сторінки
  for (const { path: pagePath, name } of PAGES_TO_AUDIT) {
    test(`Перевірка: ${name}`, async ({ page }) => {
      const startTime = Date.now();
      const errors: string[] = [];
      const warnings: string[] = [];
      const consoleErrors: string[] = [];
      const networkErrors: string[] = [];
      const missingElements: string[] = [];
      
      // Налаштовуємо слухачі
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(`[${msg.type()}] ${msg.text()}`);
        }
      });
      
      page.on('pageerror', error => {
        errors.push(`Page Error: ${error.message}`);
      });

      page.on('requestfailed', request => {
        networkErrors.push(`Failed: ${request.url()}`);
      });

      try {
        // Завантажуємо сторінку
        const response = await page.goto(pagePath, { waitUntil: 'domcontentloaded', timeout: 30000 });
        const loadTime = Date.now() - startTime;

        // Перевіряємо статус
        const statusCode = response?.status();
        if (statusCode && statusCode >= 400) {
          errors.push(`HTTP Status: ${statusCode}`);
        }

        // Перевіряємо на наявність basic елементів
        const html = await page.locator('html');
        if (!(await html.count())) {
          errors.push('Відсутній HTML елемент');
        }

        // Перевіряємо title
        const title = await page.title();
        if (!title || title.trim() === '') {
          warnings.push('Відсутній або порожній title');
        }

        // Перевіряємо meta description (без очікування)
        try {
          const description = await page.locator('meta[name="description"]').first().getAttribute('content', { timeout: 1000 });
          if (!description || description.trim() === '') {
            warnings.push('Відсутній або порожній meta description');
          }
        } catch {
          warnings.push('meta description не знайдено');
        }

        // Перевіряємо на 404
        const notFound404 = await page.locator('text="404"').count();
        const notFoundText = await page.locator('text="Not Found"').count();
        if (notFound404 > 0 || notFoundText > 0) {
          warnings.push('Сторінка може бути 404');
        }

        // Записуємо результат
        const status: 'pass' | 'fail' | 'error' = errors.length > 0 ? 'fail' : 'pass';
        
        AUDIT_RESULTS.push({
          page: name,
          path: pagePath,
          status,
          statusCode,
          loadTime,
          errors,
          warnings,
          consoleErrors,
          networkErrors,
          missingElements,
        });

        // Асерти для тесту
        expect(errors.length).toBe(0);
        
      } catch (error: any) {
        // Помилка заванантаження
        AUDIT_RESULTS.push({
          page: name,
          path: pagePath,
          status: 'error',
          errors: [error.message || 'Unknown error'],
          warnings,
          consoleErrors,
          networkErrors,
          missingElements,
        });
        
        throw error;
      }
    });
    }
  
    // Додаткові перевірки після всіх тестів - зберігаємо звіт ТІЛЬКИ один раз
    test.afterAll(async () => {
      // Невелика затримка щоб переконатись що всі результати зібрались
      await new Promise(resolve => setTimeout(resolve, 1000));
      saveReport();
    });
  });
