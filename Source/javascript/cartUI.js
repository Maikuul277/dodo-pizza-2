import { getCart, getTotal, getItemCount, increase, decrease, removeItem } from './cart.js';

// Функция для обновления счётчика на иконке корзины
export function updateCartCount(cartCountElement) {
    if (!cartCountElement) return;
    cartCountElement.textContent = getItemCount();
}

// Функция для рендера корзины внутри попапа
export function renderCart(cartItemsContainer, cartTotalElement) {
    const cart = getCart();
    cartItemsContainer.innerHTML = '';

    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'cart-items';
        div.innerHTML = `
            <span>${item.name}</span>
            <div class="cart-quantity">
                <button class="decrease" data-index="${index}">-</button>
                <span>${item.quantity}</span>
                <button class="increase" data-index="${index}">+</button>
                <button class="remove" data-index="${index}">❌</button>
            </div>
        `;

        // Вешаем обработчики на кнопки (можно через data-атрибуты)
        div.querySelector('.increase').addEventListener('click', () => {
            increase(index);
            // После изменения данных обновляем UI
            renderCart(cartItemsContainer, cartTotalElement);

        });

        div.querySelector('.decrease').addEventListener('click', () => {
            decrease(index);
            renderCart(cartItemsContainer, cartTotalElement);

        });

        div.querySelector('.remove').addEventListener('click', () => {
            removeItem(index);
            renderCart(cartItemsContainer, cartTotalElement);

        });

        cartItemsContainer.appendChild(div);
    });

    // Обновляем общую сумму
    cartTotalElement.textContent = getTotal().toFixed(2);
}

// Функция для открытия попапа
export function openCartPopup(cartPopupElement, cartItemsContainer, cartTotalElement) {
    cartPopupElement.style.display = 'flex';
    renderCart(cartItemsContainer, cartTotalElement);
}

// Функция для закрытия попапа
export function closeCartPopup(cartPopupElement) {
    cartPopupElement.style.display = 'none';
}

// Функция для инициализации обработчиков событий на главной странице
export function initUI(cartIcon, cartPopup, closeCartBtn, cartItemsContainer, cartTotalElement, cartCountElement) {
    // Открытие корзины по клику на иконку
    cartIcon.addEventListener('click', () => {
        openCartPopup(cartPopup, cartItemsContainer, cartTotalElement);
    });

    // Закрытие корзины по клику на крестик
    closeCartBtn.addEventListener('click', () => {
        closeCartPopup(cartPopup);
    });

    // Закрытие по клику вне попапа (если нужно) — можно добавить позже

    // Первоначальное обновление счётчика
    updateCartCount(cartCountElement);
}