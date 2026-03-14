// Приватное состояние корзины
let cart = [];

// Функции для работы с корзиной
export function addToCart(name, price) {
    console.log('addToCart получил:', name, price);
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        // Убедись, что price — число, а не строка
        const numericPrice = Number(price); // или parseFloat(price)
        cart.push({ name, price: numericPrice, quantity: 1 });
    }
}

export function increase(index) {
    cart[index].quantity++;
}

export function decrease(index) {
    cart[index].quantity--;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
}

export function removeItem(index) {
    cart.splice(index, 1);
}

// Функция для получения копии корзины (чтобы внешний код не мог изменить её напрямую)
export function getCart() {
    return cart.map(item => ({ ...item })); // возвращаем копию
}

// Функция для полной замены корзины (например, при загрузке из localStorage)
export function setCart(newCart) {
    cart = [...newCart];
}

// Дополнительно: общая сумма и количество товаров
export function getTotal() {
        return cart.reduce((sum, item) => {
            const price = Number(item.price) || 0; // если не число, то 0
            return sum + price * item.quantity;
        }, 0);
}

export function getItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}