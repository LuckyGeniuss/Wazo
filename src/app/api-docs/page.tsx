import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Docs | Wazo.Market',
  description: 'Документація API для Wazo.Market - Multi-tenant SaaS Marketplace',
};

export default function ApiDocsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">API Docs</h1>
      <p className="text-muted-foreground mb-8">
        Ласкаво просимо до документації API Wazo.Market. Цей розділ знаходиться в розробці.
      </p>

      <div className="grid gap-6">
        <section className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Authentication API</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded">GET</span>
              <code className="bg-muted px-2 py-1 rounded">/api/auth/session</code>
              <span className="text-muted-foreground">— Отримати поточну сесію</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">POST</span>
              <code className="bg-muted px-2 py-1 rounded">/api/auth/login</code>
              <span className="text-muted-foreground">— Увійти</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">POST</span>
              <code className="bg-muted px-2 py-1 rounded">/api/auth/register</code>
              <span className="text-muted-foreground">— Зареєструватися</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded">POST</span>
              <code className="bg-muted px-2 py-1 rounded">/api/auth/logout</code>
              <span className="text-muted-foreground">— Вийти</span>
            </div>
          </div>
        </section>

        <section className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Products API</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded">GET</span>
              <code className="bg-muted px-2 py-1 rounded">/api/products</code>
              <span className="text-muted-foreground">— Отримати список продуктів</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded">GET</span>
              <code className="bg-muted px-2 py-1 rounded">/api/products/:id</code>
              <span className="text-muted-foreground">— Отримати продукт за ID</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">POST</span>
              <code className="bg-muted px-2 py-1 rounded">/api/products</code>
              <span className="text-muted-foreground">— Створити продукт</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">PUT</span>
              <code className="bg-muted px-2 py-1 rounded">/api/products/:id</code>
              <span className="text-muted-foreground">— Оновити продукт</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded">DELETE</span>
              <code className="bg-muted px-2 py-1 rounded">/api/products/:id</code>
              <span className="text-muted-foreground">— Видалити продукт</span>
            </div>
          </div>
        </section>

        <section className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Stores API</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded">GET</span>
              <code className="bg-muted px-2 py-1 rounded">/api/stores</code>
              <span className="text-muted-foreground">— Отримати список магазинів</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded">GET</span>
              <code className="bg-muted px-2 py-1 rounded">/api/stores/:slug</code>
              <span className="text-muted-foreground">— Отримати магазин за slug</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">POST</span>
              <code className="bg-muted px-2 py-1 rounded">/api/stores</code>
              <span className="text-muted-foreground">— Створити магазин</span>
            </div>
          </div>
        </section>

        <section className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Orders API</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded">GET</span>
              <code className="bg-muted px-2 py-1 rounded">/api/orders</code>
              <span className="text-muted-foreground">— Отримати список замовлень</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded">GET</span>
              <code className="bg-muted px-2 py-1 rounded">/api/orders/:id</code>
              <span className="text-muted-foreground">— Отримати замовлення за ID</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">POST</span>
              <code className="bg-muted px-2 py-1 rounded">/api/orders</code>
              <span className="text-muted-foreground">— Створити замовлення</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">PUT</span>
              <code className="bg-muted px-2 py-1 rounded">/api/orders/:id/status</code>
              <span className="text-muted-foreground">— Оновити статус замовлення</span>
            </div>
          </div>
        </section>

        <section className="border rounded-lg p-6 bg-muted/50">
          <h2 className="text-2xl font-semibold mb-4">🚧 В розробці</h2>
          <p className="text-muted-foreground">
            Повна Swagger/OpenAPI документація буде доступна найближчим часом.
            Зараз ви можете переглянути базові endpoints вище.
          </p>
        </section>
      </div>
    </div>
  );
}
