import { setCart } from './cart.js';

const CART_STORAGE_KEY = 'myCart';

export function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

export function loadCart() {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
        try {
            const cart = JSON.parse(saved);
            setCart(cart); // загружаем сохранённую корзину
        } catch (e) {
            console.error('Ошибка загрузки корзины', e);
        }
    }
}

