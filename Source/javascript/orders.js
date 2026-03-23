import { getOrders } from './orderStorage.js';

document.addEventListener('DOMContentLoaded', () => {
    const ordersContainer = document.getElementById('orders-list');
    const orders = getOrders();

    if (orders.length === 0) {
        ordersContainer.innerHTML = '<p>Buy pizza please :)</p>';
        return;
    }

    // Сортируем по дате (новые сверху)
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));

    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order-card';
        orderDiv.innerHTML = `
            <div class="order-header">
                <span>Order №${order.id}</span>
                <span>${new Date(order.date).toLocaleString()}</span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${escapeHtml(item.name)} x${item.quantity}</span>
                        <span>${item.price * item.quantity} $</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                total: ${order.amount} $
            </div>
        `;
        ordersContainer.appendChild(orderDiv);
    });
});

// Простая защита от XSS (на случай, если название товара содержит HTML)
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}