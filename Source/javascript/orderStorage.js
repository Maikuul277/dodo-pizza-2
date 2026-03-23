const ORDERS_KEY = 'orderHistory';

// Сохранить заказ
export function saveOrder(order) {
    const orders = getOrders();
    orders.push(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

// Получить все заказы
export function getOrders() {
    const stored = localStorage.getItem(ORDERS_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Ошибка чтения заказов', e);
            return [];
        }
    }
    return [];
}

// Генератор ID заказа
export function generateOrderId() {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
}