import { loadCart } from './storage.js';
import { initUI } from './cartUI.js';
import { addToCart } from './cart.js';
import { renderCart, updateCartCount } from './cartUI.js';

// Дожидаемся загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    // Получаем все нужные элементы
    const cartIcon = document.querySelector(".cart")
    const cartPopup = document.querySelector(".cart-popup");
    const closeCartBtn = document.querySelector(".cart-close")
    const cartItemsContainer = document.querySelector(".cart-items")
    const cartTotalElement = document.querySelector(".cart-total");
    const cartCountElement = document.querySelector(".cart-count")

    // Проверяем, что все элементы найдены (чтобы не было ошибок)
    if (!cartIcon || !cartPopup || !closeCartBtn || !cartItemsContainer || !cartTotalElement || !cartCountElement) {
        console.error('Не найдены необходимые элементы на странице');
        return;
    }

    // Загружаем сохранённую корзину (если есть модуль storage)
    if (typeof loadCart === 'function') {
        loadCart();
    }

    // Инициализируем интерфейс
    initUI(cartIcon, cartPopup, closeCartBtn, cartItemsContainer, cartTotalElement, cartCountElement);

    // обработчик для кнопок "Добавить в корзину" на товарах
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            // Находим ближайший родительский элемент с классом 'product'
            const product = button.closest('.product');
            if (!product) {
                console.error('Не найден родитель .product');
                return;
            }

            // Читаем data-атрибуты с этого элемента
            const name = product.dataset.name;        // строка
            const price = parseFloat(product.dataset.price); // число

            console.log('Добавляем:', name, price);

            // Проверка на всякий случай
            if (!name || isNaN(price)) {
                console.error('Некорректные данные товара', name, price);
                return;
            }

            // Добавляем в корзину (функция из cart.js)
            addToCart(name, price);

            // Обновляем отображение корзины (функции из ui.js)
            renderCart(cartItemsContainer, cartTotalElement);
            updateCartCount(cartCountElement);
        });
    });
});

