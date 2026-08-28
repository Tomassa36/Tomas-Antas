const SUPABASE_URL = "https://eeuastzgghokytinkzsi.supabase.co";

const SUPABASE_KEY = "sb_publishable_CVBgPjDMlE8BsYP0vAlmtg_MsFmqoCg";

const supabaseClient = supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);

let cart = [];

// ESCOLHER TAMANHO

function addToCart(productName, price) {


const sizeBox = document.createElement("div");

sizeBox.className = "size-selection";

sizeBox.innerHTML = `
    <div class="size-selection-content">

        <h3>Escolhe o tamanho</h3>

        <div class="size-options">

            <button onclick="selectSize('${productName}', ${price}, 'XS')">XS</button>

            <button onclick="selectSize('${productName}', ${price}, 'S')">S</button>

            <button onclick="selectSize('${productName}', ${price}, 'M')">M</button>

            <button onclick="selectSize('${productName}', ${price}, 'L')">L</button>

            <button onclick="selectSize('${productName}', ${price}, 'XL')">XL</button>

        </div>

        <button class="close-size" onclick="closeSizeSelection()">
            CANCELAR
        </button>

    </div>
`;

document.body.appendChild(sizeBox);


}

// SELECIONAR TAMANHO

function selectSize(productName, price, size) {


cart.push({
    name: productName,
    price: price,
    size: size
});

updateCart();

closeSizeSelection();

document.getElementById("cart").classList.add("active");


}

// FECHAR ESCOLHA DE TAMANHO

function closeSizeSelection() {


const sizeBox = document.querySelector(".size-selection");

if (sizeBox) {
    sizeBox.remove();
}


}

// ATUALIZAR CARRINHO

function updateCart() {


const cartItems = document.getElementById("cart-items");

const cartCount = document.getElementById("cart-count");

const cartTotal = document.getElementById("cart-total");

cartItems.innerHTML = "";


if (cart.length === 0) {

    cartItems.innerHTML = `
        <p class="empty-cart">
            O teu carrinho está vazio.
        </p>
    `;

} else {

    cart.forEach(function(item, index) {

        cartItems.innerHTML += `
            <div class="cart-item">

                <div>

                    <h4>${item.name}</h4>

                    <p>Tamanho: ${item.size}</p>

                    <p>€${item.price.toFixed(2)}</p>

                </div>

                <button onclick="removeFromCart(${index})">
                    Remover
                </button>

            </div>
        `;

    });

}


cartCount.textContent = cart.length;


const total = cart.reduce(function(sum, item) {

    return sum + item.price;

}, 0);


cartTotal.textContent = "€" + total.toFixed(2);


}

// REMOVER DO CARRINHO

function removeFromCart(index) {


cart.splice(index, 1);

updateCart();


}

// ABRIR / FECHAR CARRINHO

function toggleCart() {


document
    .getElementById("cart")
    .classList
    .toggle("active");


}

// CHECKOUT

function checkout() {


if (cart.length === 0) {

    alert("O teu carrinho está vazio!");

    return;
}


alert(
    "Compra realizada com sucesso! 💗\nObrigado por comprares na TOMAS ANTAS."
);


cart = [];

updateCart();

toggleCart();


}

// IR PARA CHECKOUT

function goToCheckout() {


if (cart.length === 0) {

    alert("O teu carrinho está vazio!");

    return;
}


document
    .getElementById("cart")
    .classList
    .remove("active");


document
    .getElementById("checkout-page")
    .classList
    .add("active");


updateCheckout();


}

// FECHAR CHECKOUT

function closeCheckout() {


document
    .getElementById("checkout-page")
    .classList
    .remove("active");

}

// ATUALIZAR CHECKOUT

function updateCheckout() {


const checkoutItems =
    document.getElementById("checkout-items");


const checkoutSubtotal =
    document.getElementById("checkout-subtotal");


const checkoutTotal =
    document.getElementById("checkout-total");


checkoutItems.innerHTML = "";


cart.forEach(function(item) {

    checkoutItems.innerHTML += `
        <div class="checkout-item">

            <div>

                <span>${item.name}</span>

                <small>
                    Tamanho: ${item.size}
                </small>

            </div>

            <strong>
                €${item.price.toFixed(2)}
            </strong>

        </div>
    `;

});


const total = cart.reduce(function(sum, item) {

    return sum + item.price;

}, 0);


checkoutSubtotal.textContent =
    "€" + total.toFixed(2);


checkoutTotal.textContent =
    "€" + total.toFixed(2);


}

// FINALIZAR ENCOMENDA

async function finishOrder() {


const customerName =
    document.getElementById("customer-name").value.trim();

const email =
    document.getElementById("customer-email").value.trim();

const phone =
    document.getElementById("customer-phone").value.trim();

const address =
    document.getElementById("customer-address").value.trim();

const city =
    document.getElementById("customer-city").value.trim();

const postalCode =
    document.getElementById("customer-postal-code").value.trim();

const country =
    document.getElementById("customer-country").value;

const paymentMethod =
    document.querySelector('input[name="payment"]:checked').value;


if (
    !customerName ||
    !email ||
    !address ||
    !city ||
    !postalCode
) {

    alert("Preenche todos os campos obrigatórios.");

    return;
}


const total = cart.reduce(function(sum, item) {

    return sum + item.price;

}, 0);


try {

    const response = await fetch(
        "https://eeuastzgghokytinkzsi.supabase.co/functions/v1/create-checkout",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`
            },

            body: JSON.stringify({

                cart: cart,

                customerName: customerName,

                email: email,

                phone: phone,

                address: address,

                city: city,

                postalCode: postalCode,

                country: country,

                paymentMethod: paymentMethod,

                total: total

            })
        }
    );


    const result = await response.json();


    if (!response.ok) {

        throw new Error(
            result.error || "Erro ao criar pagamento."
        );

    }


    window.location.href = result.url;


} catch (error) {

    console.error(error);

    alert(
        "Erro ao abrir o pagamento: " + error.message
    );

}


}
