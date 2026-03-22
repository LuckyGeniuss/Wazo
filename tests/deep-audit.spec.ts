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
  authRequired?: boolean;
}[] = [];

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const IS_PRODUCTION = BASE_URL.includes('vercel.app');

// Облікові дані для тестування
const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || 'sergey.varava@gmail.com',
  password: process.env.TEST_USER_PASSWORD || 'Test123!',
};

// Сторінки для перевірки
const PAGES_TO_AUDIT = [
  // Головна та marketplace
  { path: '/', name: 'Home', auth: false },
  { path: '/search', name: 'Search', auth: false },
  { path: '/cart', name: 'Cart', auth: false },
  { path: '/checkout', name: 'Checkout', auth: false },
  { path: '/compare', name: 'Compare', auth: false },
  { path: '/favorites', name: 'Favorites', auth: false },

  // Auth
  { path: '/login', name: 'Login', auth: false },
  { path: '/register', name: 'Register', auth: false },

  // Account (потрібна авторизація)
  { path: '/account', name: 'Account', auth: true },
  { path: '/account/orders', name: 'Account Orders', auth: true },
  { path: '/account/wishlist', name: 'Account Wishlist', auth: true },

  // Info pages
  { path: '/about', name: 'About', auth: false },
  { path: '/contact', name: 'Contact', auth: false },
  { path: '/help', name: 'Help', auth: false },
  { path: '/pricing', name: 'Pricing', auth: false },
  { path: '/delivery', name: 'Delivery', auth: false },
  { path: '/returns', name: 'Returns', auth: false },
  { path: '/privacy', name: 'Privacy', auth: false },
  { path: '/terms', name: 'Terms', auth: false },
  { path: '/cookies', name: 'Cookies', auth: false },
  { path: '/buyer-protection', name: 'Buyer Protection', auth: false },

  // Sellers
  { path: '/sellers', name: 'Sellers', auth: false },

  // Dashboard (перевіряємо redirect)
  { path: '/dashboard', name: 'Dashboard', auth: false },

  // Admin
  { path: '/admin', name: 'Admin', auth: false },
  { path: '/superadmin', name: 'SuperAdmin', auth: false },
];

// Функія для збереження звіту
function saveReport() {
  const reportDir = path.join(process.cwd(), 'docs', 'reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const reportPath = path.join(reportDir, 'DEEP_AUDIT_REPORT.md');
  const date = new Date().toISOString();

  const totalTests = AUDIT_RESULTS.length;
  const passedTests = AUDIT_RESULTS.filter(r => r.status === 'pass').length;
  const failedTests = AUDIT_RESULTS.filter(r => r.status === 'fail' || r.status === 'error').length;
  const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : '0.0';

  let report = `# 📊 Глибокий аудит Wazo.Market
**Дата:** ${date}
**Base URL:** ${BASE_URL}
**Виробниче середовище:** ${IS_PRODUCTION ? 'Так' : 'Ні'}

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
    const authInfo = result.authRequired ? ' (🔒 Потрібна авторизація)' : '';
    
    report += `### ${statusIcon} ${result.page}${authInfo}

**URL:** \`${fullUrl}\`
**Status Code:** ${result.statusCode || 'N/A'}
**Load Time:** ${result.loadTime ? result.loadTime + 'ms' : 'N/A'}

`;

    if (result.errors.length > 0) {
      report += `**❌ ПОМИЛКИ:**
${result.errors.map(e => `- ${e}`).join('\n')}

`;
    }

    if (result.warnings.length > 0) {
      report += `**⚠️ Попередження:**
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
  report += `## 🔧 Рекомендації

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

// Функція для спроби авторизації
async function tryLogin(page: Page): Promise<boolean> {
  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });
    
    // Перевіряємо, чи вже авторизовані
    const accountLink = page.locator('a[href="/account"], a:has-text("Account"), a:has-text("Мій акаунт"), a:has-text("Профіль")').first();
    if (await accountLink.count()) {
      return true;
    }

    // Спроба знайти форму логіну
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    if (await emailInput.count()) {
      await emailInput.fill(TEST_USER.email);
      
      const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
      if (await passwordInput.count()) {
        await passwordInput.fill(TEST_USER.password);
        
        const submitButton = page.locator('button[type="submit"], button:has-text("Увійти"), button:has-text("Login"), input[type="submit"]').first();
        if (await submitButton.count()) {
          await submitButton.click();
          await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => {});
          return true;
        }
      }
    }
    
    return false;
  } catch {
    return false;
  }
}

// Описуємо тести
test.describe('🔍 Глибокий аудит Wazo.Market з авторизацією', () => {
  console.log(`🚀 Початок глибокого аудиту. Base URL: ${BASE_URL}`);
  console.log(`🌐 Production: ${IS_PRODUCTION ? 'Так' : 'Ні'}`);

  // Перевірка кожної сторінки
  for (const { path: pagePath, name, auth } of PAGES_TO_AUDIT) {
    test(`Перевірка: ${name}${auth ? ' (auth)' : ''}`, async ({ page }) => {
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
        // Ігноруємо помилки favicon та analytics
        if (!request.url().includes('favicon') && !request.url().includes('analytics')) {
          networkErrors.push(`Failed: ${request.url()}`);
        }
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

        // Перевіряємо meta description
        try {
          const description = await page.locator('meta[name="description"]').first().getAttribute('content', { timeout: 1000 });
          if (!description || description.trim() === '') {
            warnings.push('Відсутній або порожній meta description');
          }
        } catch {
          warnings.push('meta description не знайдено');
        }

        // Перевірка для сторінок з авторизацією
        if (auth && !IS_PRODUCTION) {
          const currentUrl = page.url();
          if (currentUrl.includes('/login') || currentUrl.includes('/auth')) {
            warnings.push('Сторінка потребує авторизації - перенаправлено на login');
          }
        }

        // Перевірка на 404
        const notFound404 = await page.locator('text="404"').count();
        const notFoundText = await page.locator('text="Not Found"').count();
        if (notFound404 > 0 || notFoundText > 0) {
          warnings.push('Сторінка може бути 404');
        }

        // Перевірка на 500 помилку
        const error500 = await page.locator('text="500"').count();
        const errorText = await page.locator('text="Internal Server Error"').count();
        if (error500 > 0 || errorText > 0) {
          errors.push('Internal Server Error (500)');
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
          authRequired: auth,
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
          authRequired: auth,
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
