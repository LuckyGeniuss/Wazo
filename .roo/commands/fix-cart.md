Кошик не працює. Потрібно:
1. Знайти де кнопка "В кошик" на вітрині
2. Зробити ProductCard клієнтським компонентом
3. handleAddToCart писати в localStorage('wazo-cart')
4. dispatchEvent(new Event('cart-updated'))
5. Перевірити через Playwright що товар додається