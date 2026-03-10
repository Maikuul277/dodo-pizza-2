// DOM element
const cartCount = document.querySelector(".cart-count")
const buttons = document.querySelectorAll(".add-to-cart")
const cartIcon = document.querySelector(".cart")
const cartPopup = document.getElementById("cartPopup")
const closeCart = document.getElementById("closeCart")
const cartItems = document.getElementById("cartItems")


// Массив карточек корзины
let cart = []


// Проверка DOM с начала загружаеться HTML а потом JS
document.addEventListener("DOMContentLoaded", initCart)
function initCart(){
    loadCart()
    updateCartCount()
}


// Универсальная функция обновления
function updateCart() {
    saveCart()
    renderCart()
    updateCartCount()
}


// Сохранение карточки товара в localStorage
const savedCart = localStorage.getItem("cart")

    try {
        cart = savedCart ? JSON.parse(savedCart) : []
    } catch {
        cart = []
    }


// Получение информации о карте товара и добавляем в переменную
buttons.forEach(button => {

    button.addEventListener("click", () => {

            const product = button.closest(".product")

            const name = product.dataset.name
            const price = Number(product.dataset.price)
            if (isNaN(price) || price < 0) return;

            addToCart(name, price)

    })

})

    saveCart()
    updateCartCount()


// защита от спама клика
buttons.forEach(button => {
    button.disabled = true

    setTimeout(() => {
        button.disabled = false
    },300)

})


// Сохранение корзины
function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    )

}


// Счетчик товаров в корзине
function updateCartCount() {

    if (!cartCount) return;

    cartCount.textContent = cart.reduce(
        (total, item) => total + item.quantity,
        0
    )
}

updateCartCount()


// POPup корзина и ее открытие
cartIcon.addEventListener("click", () => {

    if(cartIcon){
        cartIcon.addEventListener("click", () => {
            cartPopup.style.display = "flex"
            renderCart()
        })
    }

})


//закрытие корзины
closeCart.addEventListener("click", () => {

    cartPopup.style.display = "none"

})


//Отображение коорзины
function renderCart() {

    cartItems.innerHTML = ""

    cart.forEach((item, index) => {

        const div = document.createElement("div")
        div.className = "cart-item"

        div.innerHTML = `
        <span>${item.name}</span>

        <div class="cart-quantity">
        <button class="decrease">-</button>
        <span>${item.quantity}</span>
        <button class="increase">+</button>
        <button class="remove">❌</button>
        </div>
        `

        div.querySelector(".increase").addEventListener("click", () => increase(index))
        div.querySelector(".decrease").addEventListener("click", () => decrease(index))
        div.querySelector(".remove").addEventListener("click", () => removeItem(index))

        cartItems.appendChild(div)

    })

    updateTotal()

}


// увеличение кол-ва
function increase(index) {

    cart[index].quantity++

    updateCart()

}


//уменьшение кол-ва
function decrease(index) {

    cart[index].quantity--

    if (cart[index].quantity <= 0) {

        cart.splice(index, 1)

    }

    updateCart()

}


// удаление товара
function removeItem(index) {

    cart.splice(index, 1)

    updateCart()

}


// Подсчет общей суммы в корзине
function updateTotal() {

    const total = cart.reduce((sum, item) => {

        return sum + item.price * item.quantity

    }, 0)

    document.getElementById("cartTotal").textContent = total.toFixed(2)

}


//Добавление товара в корзину
function addToCart(name,price){

    const item = cart.find(p=>p.name === name)

    if(item){

        item.quantity++

    }else{

        cart.push({

            name,
            price,
            quantity:1

        })

    }

    updateCart()

}