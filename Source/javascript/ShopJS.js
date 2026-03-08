let cart = []

document.addEventListener("DOMContentLoaded", () => {

    updateCartCount()

})

const savedCart = localStorage.getItem("cart")

if (savedCart) {
    cart = JSON.parse(savedCart)
}

const buttons = document.querySelectorAll(".add-to-cart")


    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const product = button.closest(".product")

            const name = product.dataset.name
            const price = Number(product.dataset.price)

            addToCart(name, price)

        })

    })


    saveCart()
    updateCartCount()



function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    )

}

function updateCartCount() {

    const cartCount = document.querySelector(".cart-count")

    if (!cartCount) return

    cartCount.textContent = cart.reduce(
        (total, item) => total + item.quantity,
        0
    )
}

updateCartCount()

// POPup корзина
// открытие

const cartIcon = document.querySelector(".cart")
const cartPopup = document.getElementById("cartPopup")

cartIcon.addEventListener("click", () => {

    cartPopup.style.display = "flex"

    renderCart()

})

//закрытие корзины

const closeCart = document.getElementById("closeCart")

closeCart.addEventListener("click", () => {

    cartPopup.style.display = "none"

})

//рендер

function renderCart() {

    const cartItems = document.getElementById("cartItems")

    cartItems.innerHTML = ""

    cart.forEach((item, index) => {

        const div = document.createElement("div")

        div.className = "cart-item"

        div.innerHTML = `

<span>${item.name}</span>

<div class="cart-quantity">

<button onclick="decrease(${index})">-</button>

<span>${item.quantity}</span>

<button onclick="increase(${index})">+</button>

<button onclick="removeItem(${index})">❌</button>

</div>

`

        cartItems.appendChild(div)

    })

    updateTotal()

}

// увеличение кол-ва

function increase(index) {

    cart[index].quantity++

    saveCart()

    renderCart()

    updateCartCount()

}

//уменьшение кол-ва

function decrease(index) {

    cart[index].quantity--

    if (cart[index].quantity <= 0) {

        cart.splice(index, 1)

    }

    saveCart()

    renderCart()

    updateCartCount()

}

// удаление товара

function removeItem(index) {

    cart.splice(index, 1)

    saveCart()

    renderCart()

    updateCartCount()

}

// общая сумма

function updateTotal() {

    const total = cart.reduce((sum, item) => {

        return sum + item.price * item.quantity

    }, 0)

    document.getElementById("cartTotal").textContent = total.toFixed(2)

}

//рендеркрафт при добавлении товара

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

    saveCart()

    updateCartCount()

    renderCart()

}
