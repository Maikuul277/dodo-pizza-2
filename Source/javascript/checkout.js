// checkout.js – модуль для страницы оплаты
import { getCart, getTotal, setCart } from './cart.js';
import { saveCart,loadCart } from './storage.js';

//Загружаем корзину из localstorage
loadCart()

document.addEventListener('DOMContentLoaded', () => {
    // --- Получаем элементы DOM ---
    const cartItemsContainer = document.getElementById('cart-items');
    const totalSpan = document.getElementById('total-amount');
    const form = document.getElementById('payment-form');
    const payButton = document.getElementById('pay-button');
    const paymentStatus = document.getElementById('payment-status');

    const cardNumberInput = document.getElementById('card-number');
    const expiryInput = document.getElementById('expiry');
    const cvvInput = document.getElementById('cvv');

    const cardNumberError = document.getElementById('card-number-error');
    const expiryError = document.getElementById('expiry-error');
    const cvvError = document.getElementById('cvv-error');

    // --- Получаем данные корзины через функцию getCart() ---
    let cart = getCart(); // получаем копию массива товаров

    // Если корзина пуста, показываем сообщение и блокируем кнопку
    if (!cart || cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Корзина пуста. Вернитесь в каталог.</p>';
        payButton.disabled = true;
        totalSpan.textContent = '0';
        return;
    }

    // --- Отображаем товары и общую сумму ---
    renderCartItems(cart);
    totalSpan.textContent = getTotal(); // используем готовую функцию подсчёта

    function renderCartItems(cart) {
        let html = '';
        cart.forEach(item => {
            const name = item.name || 'Товар без названия';
            const price = item.price || 0;
            const quantity = item.quantity || 1;
            const itemTotal = price * quantity;
            html += `
                <div class="cart-item">
                    <span>${escapeHtml(name)} x${quantity}</span>
                    <span>${itemTotal} $</span>
                </div>
            `;
        });
        cartItemsContainer.innerHTML = html;
    }

    // Защита от XSS (оставляем как есть)
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // --- Валидация полей (без изменений) ---
    cardNumberInput.addEventListener('input', validateCardNumber);
    expiryInput.addEventListener('input', validateExpiry);
    cvvInput.addEventListener('input', validateCVV);

    function validateCardNumber() {
        let value = cardNumberInput.value.replace(/\s/g, '');
        if (!/^\d*$/.test(value)) {
            cardNumberError.textContent = 'Только цифры';
            return false;
        }
        if (value.length < 16) {
            cardNumberError.textContent = 'Должно быть 16 цифр';
            return false;
        }
        if (value.length > 16) {
            cardNumberInput.value = value.slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
        } else {
            cardNumberInput.value = value.replace(/(.{4})/g, '$1 ').trim();
        }
        cardNumberError.textContent = '';
        return true;
    }

    function validateExpiry() {
        let value = expiryInput.value.replace(/\D/g, '');
        if (value.length < 4) {
            expiryError.textContent = 'Введите MM/YY';
            return false;
        }
        if (value.length > 4) {
            value = value.slice(0, 4);
        }
        let month = value.slice(0, 2);
        let year = value.slice(2);
        if (parseInt(month) > 12) month = '12';
        if (parseInt(month) < 1) month = '01';
        expiryInput.value = month + '/' + year;

        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;
        const expMonth = parseInt(month, 10);
        const expYear = parseInt(year, 10);
        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
            expiryError.textContent = 'Срок карты истёк';
            return false;
        }
        expiryError.textContent = '';
        return true;
    }

    function validateCVV() {
        let value = cvvInput.value.replace(/\D/g, '');
        if (value.length < 3) {
            cvvError.textContent = 'Введите 3 цифры';
            return false;
        }
        if (value.length > 3) {
            value = value.slice(0, 3);
        }
        cvvInput.value = value;
        cvvError.textContent = '';
        return true;
    }

    // --- Обработка отправки формы ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        paymentStatus.textContent = '';
        paymentStatus.className = '';

        const isCardValid = validateCardNumber();
        const isExpiryValid = validateExpiry();
        const isCvvValid = validateCVV();

        if (!isCardValid || !isExpiryValid || !isCvvValid) {
            paymentStatus.textContent = 'Исправьте ошибки в форме';
            paymentStatus.className = 'error-message';
            return;
        }

        payButton.disabled = true;
        payButton.textContent = 'Обработка...';

        const paymentData = {
            cardNumber: cardNumberInput.value.replace(/\s/g, ''),
            expiry: expiryInput.value,
            cvv: cvvInput.value,
            amount: totalSpan.textContent,
            items: cart  // отправляем текущий состав корзины (копию)
        };

        try {
            const response = await fakePaymentRequest(paymentData);

            if (!response.success) {
                // throw new Error(response.error || 'Ошибка оплаты');
            } else {
                paymentStatus.textContent = 'Оплата прошла успешно! Спасибо за покупку.';
                paymentStatus.className = 'success';

                // Очищаем корзину в состоянии и в localStorage
                setCart([]);          // очищаем внутренний массив cart.js
                saveCart([]);          // сохраняем пустой массив в localStorage

                // Можно перенаправить на страницу благодарности
                setTimeout(() => {
                    window.location.href = '/success.html?amount=' + encodeURIComponent(totalSpan.textContent); // замени на свой URL
                }, 3000);
            }
        } catch (error) {
            paymentStatus.textContent = 'Ошибка: ' + error.message;
            paymentStatus.className = 'error-message';
            payButton.disabled = false;
            payButton.textContent = 'Оплатить';
        }
    });

    // Имитация запроса к платёжному шлюзу (без изменений)
    function fakePaymentRequest(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (data.cardNumber === '1111111111111111') {
                    resolve({ success: false, error: 'Карта отклонена' });
                } else {
                    resolve({ success: true });
                }
            }, 1500);
        });
    }
});