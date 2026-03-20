export default function SuperAdminSettings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Налаштування платформи</h1>
      <div className="bg-white border rounded-2xl p-6 space-y-4">
        <div>
          <h3 className="font-semibold mb-3">Загальні налаштування</h3>
          <div className="space-y-3 text-sm text-slate-600">
            <p>✅ База даних: підключена (Neon PostgreSQL)</p>
            <p>✅ Email: Resend API</p>
            <p>✅ Медіафайли: Cloudinary</p>
            <p>✅ Платежі: Stripe</p>
          </div>
        </div>
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">ENV Змінні</h3>
          <p className="text-sm text-slate-500">
            Конфігурація через Vercel Dashboard → Settings → Environment Variables
          </p>
        </div>
      </div>
    </div>
  );
}
