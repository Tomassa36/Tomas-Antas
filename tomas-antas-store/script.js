const SUPABASE_URL = "https://eeuastzgghokytinkzsi.supabase.co";

const SUPABASE_KEY = "sb_publishable_CVBgPjDMlE8BsYP0vAlmtg_MsFmqoCg";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
let cart = [];

function addToCart(productName, price) {

    const selectedSize = prompt(
        "Escolhe o tamanho (XS, S, M, L ou XL):"
    );

    if (!selectedSize) {
        return;
    }

    const size = selectedSize.trim().toUpperCase();

    const validSizes = ["XS", "S", "M", "L", "XL"];

    if (!validSizes.includes(size)) {
        alert("Tamanho inválido. Escolhe: XS, S, M, L ou XL.");
        return;
    }

    cart.push({
        name: productName,
        price: price,
        size: size
    });

    updateCart();

    document.getElementById("cart").classList.add("active");
}

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

        cart.forEach((item, index) => {

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


function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();

}


function toggleCart() {

    document
        .getElementById("cart")
        .classList
        .toggle("active");

}function checkout() {

    if (cart.length === 0) {
        alert("O teu carrinho está vazio!");
        return;
    }

    alert("Compra realizada com sucesso! 💗\nObrigado por comprares na TOMAS ANTAS.");

    cart = [];

    updateCart();

    toggleCart();
}function goToCheckout() {

    if (cart.length === 0) {
        alert("O teu carrinho está vazio!");
        return;
    }

    document.getElementById("cart").classList.remove("active");

    document.getElementById("checkout-page").classList.add("active");

    updateCheckout();

}


function closeCheckout() {

    document.getElementById("checkout-page").classList.remove("active");

}


function updateCheckout() {

    const checkoutItems = document.getElementById("checkout-items");

    const checkoutSubtotal = document.getElementById("checkout-subtotal");

    const checkoutTotal = document.getElementById("checkout-total");


    checkoutItems.innerHTML = "";


    cart.forEach(function(item) {

        checkoutItems.innerHTML += `

            <div class="checkout-item">

                <span>${item.name}</span>

                <strong>€${item.price.toFixed(2)}</strong>

            </div>

        `;

    });


    const total = cart.reduce(function(sum, item) {

        return sum + item.price;

    }, 0);


    checkoutSubtotal.textContent = "€" + total.toFixed(2);

    checkoutTotal.textContent = "€" + total.toFixed(2);

}


   
async function finishOrder() {

    const customerName = document.getElementById("customer-name").value;
    const customerEmail = document.getElementById("customer-email").value;
    const customerPhone = document.getElementById("customer-phone").value;
    const customerAddress = document.getElementById("customer-address").value;
    const customerCity = document.getElementById("customer-city").value;
    const customerPostalCode = document.getElementById("customer-postal-code").value;
    const customerCountry = document.getElementById("customer-country").value;

    const selectedPayment = document.querySelector(
        'input[name="payment"]:checked'
    );

    // Verificar campos obrigatórios

    if (
        !customerName ||
        !customerEmail ||
        !customerAddress ||
        !customerCity ||
        !customerPostalCode
    ) {

        alert("Por favor, preenche todos os campos obrigatórios.");

        return;
    }

    // Verificar carrinho

    if (cart.length === 0) {

        alert("O teu carrinho está vazio.");

        return;
    }

    // Calcular total

    const total = cart.reduce(function(sum, item) {

        return sum + item.price;

    }, 0);

    // Guardar encomenda no Supabase

    const { data, error } = await supabaseClient
        .from("pedidos")
        .insert([
            {
                customer_name: customerName,
                email: customerEmail,
                phone: customerPhone,
                address: customerAddress,
                city: customerCity,
                postal_code: customerPostalCode,
                country: customerCountry,
                payment_method: selectedPayment
                    ? selectedPayment.value
                    : "unknown",
                total: total,
                status: "pending"
            }
        ])

    // Verificar erro

    if (error) {

        console.error("ERRO SUPABASE:", error);

        alert(
            "Não foi possível guardar a encomenda.\n\n" +
            "Erro: " + error.message
        );

        return;
    }

    // Sucesso

    console.log("ENCOMENDA CRIADA:", data);

    alert(
        "Encomenda recebida! 💗\n\n" +
        "A tua encomenda foi registada com sucesso."
    );

    // Limpar carrinho

    cart = [];

    updateCart();

    // Fechar checkout

    document
        .getElementById("checkout-page")
        .classList
        .remove("active");
}
