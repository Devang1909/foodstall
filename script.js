document.addEventListener("DOMContentLoaded", function () {

    let cart = [];

    // Dynamic products data (all 10 images)
    const productsData = [
        { name: 'Burger', price: 50, image: 'burger.jpeg' },
        { name: 'Samosa', price: 50, image: 'samosa.jpeg' },
        { name: 'Momos', price: 50, image: 'momos.jpeg' },
        { name: 'Vada Pau', price: 50, image: 'vadapau.jpeg' },
        { name: 'Pav Bhaji', price: 50, image: 'paubhaaji.jpeg' },
        { name: 'Tea', price: 50, image: 'tea.jpeg' },
        { name: 'Coffee', price: 50, image: 'coffee.jpeg' },
        { name: 'Cold Drink', price: 50, image: 'colddrink.jpeg' },
        { name: 'Ice Cream', price: 50, image: 'ice cream.jpeg' }
    ];

    const productList = document.getElementById("product-list");
    const cartCount = document.getElementById("cart-count");
    const totalPrice = document.getElementById("total-price");
    const cartItems = document.getElementById("cart-items");

    // Generate dynamic products
    function renderProducts() {
        productList.innerHTML = productsData.map(product => `
            <div class="product-card" data-name="${product.name.toLowerCase()}">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>₹${product.price}</p>
            </div>
        `).join('');
        attachCartListeners();
    }

    // 🛒 ADD TO CART (dynamic)
    function attachCartListeners() {
        const productCards = document.querySelectorAll("#product-list .product-card");
        productCards.forEach(card => {
            card.addEventListener("click", function () {
                const name = this.querySelector("h3").innerText;
                const price = parseInt(this.querySelector("p").innerText.replace("₹", ""));
                const image = this.querySelector("img").src;
                cart.push({ name, price, image });
                updateCart();
            });
        });
    }

    // 🔄 UPDATE CART
    function updateCart() {
        cartCount.innerText = cart.length;
        let total = cart.reduce((sum, item) => sum + item.price, 0);
        totalPrice.innerText = total;
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item" style="display:flex; align-items:center; gap:10px; margin:5px 0;">
                <img src="${item.image}" width="40">
                <span>${item.name} - ₹${item.price}</span>
                <button onclick="removeItem(${index})">❌</button>
            </div>
        `).join("");
    }

    // ❌ REMOVE ITEM
    window.removeItem = function (index) {
        cart.splice(index, 1);
        updateCart();
    }

    // 🏠 HOME BUTTON - Clear cart & search
    document.querySelector(".home-btn").addEventListener("click", function() {
        cart = [];
        updateCart();
        document.getElementById("searchInput").value = '';
        document.querySelectorAll("#product-list .product-card").forEach(card => card.style.display = "block");
        alert("Welcome Home! Cart cleared.");
    });

    // 🔍 SEARCH FUNCTION (optimized for dynamic)
    document.getElementById("searchInput").addEventListener("keyup", function () {
        let value = this.value.toLowerCase();
        document.querySelectorAll("#product-list .product-card").forEach(card => {
            let name = card.dataset.name;
            if (name.includes(value)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });

    // 🛍️ BUY NOW
    document.getElementById("buyNowBtn").addEventListener("click", function () {
        if (cart.length === 0) {
            alert("Cart is empty!");
            return;
        }
        document.getElementById("order-overlay").style.display = "block";
    });

    // ❌ CLOSE ORDER FORM
    window.closeOrderForm = function () {
        document.getElementById("order-overlay").style.display = "none";
    }
    //for whatsapp number
    function sendWhatsApp(msg) {
    window.open(
        "https://wa.me/918980948396?text=" + encodeURIComponent(msg),
        "_blank"
    );
}

    // 📱 WHATSAPP ORDER
   window.submitOrder = function () {

    const name = document.getElementById("cust-name").value;
    const mobile = document.getElementById("cust-mobile").value;
    const address = document.getElementById("cust-address").value;

    const payment = document.querySelector('input[name="payment"]:checked')?.value || 'UPI';

    

    if (!name || !mobile || !address) {
        alert("Please fill all details!");
        return;
    }

    let total = cart.reduce((sum, item) => sum + item.price, 0);

    // ✅ CREATE MESSAGE FIRST (VERY IMPORTANT)
    let message = `🧾 *ORDER DETAILS*

👤 Name: ${name}
📞 Mobile: ${mobile}
📍 Address: ${address}
💳 Payment: ${payment}

🛒 Items:
`;

    cart.forEach((item, i) => {
        message += `${i + 1}. ${item.name} - ₹${item.price}\n`;
    });

    message += `\n💰 Total: ₹${total}`;

    // 🟢 PAYMENT LOGIC
 if (payment === "UPI") {

    let options = {
    key: "rzp_test_SnxQWvxyO3pb97",
    amount: total * 100,
    currency: "INR",
    name: "Food Stall",
    description: "Food Order Payment",

    handler: function (response) {

        alert("Payment Successful ✅");

        fetch("http://127.0.0.1:5000/save-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                mobile: mobile,
                address: address,
                payment: payment,
                items: cart,
                total: total
            })
        })
        .then(response => response.json())
        .then(data => {

    console.log(data);

    // ✅ ADD THIS HERE
    const orderId = data.order_id;
    localStorage.setItem("lastOrderId", orderId);

    sendWhatsApp(message);

    cart = [];
    updateCart();

    document.getElementById("order-overlay").style.display = "none";

            document.getElementById("cust-name").value = "";
            document.getElementById("cust-mobile").value = "";
            document.getElementById("cust-address").value = "";
        })
        .catch(error => {
            console.error(error);
            alert("Database Save Error ❌");
        });
    },

    prefill: {
        name: name,
        contact: mobile
    },

    theme: {
        color: "#3399cc"
    }
};

    let rzp = new Razorpay(options);

    rzp.open();

    return;
}
 else if (payment === "COD") {

        // ✅ NOW message exists → works
        sendWhatsApp(message);
    }

    // 🧹 CLEAR AFTER ORDER
    document.getElementById("order-overlay").style.display = "none";
    document.getElementById("cust-name").value = '';
    document.getElementById("cust-mobile").value = '';
    document.getElementById("cust-address").value = '';

    cart = [];
    updateCart();
}
    // ❌ CANCEL ORDER (clear entire cart)
    window.cancelOrder = function () {

    const orderId = localStorage.getItem("lastOrderId");

    if (!orderId) {
        alert("No order found!");
        return;
    }

    fetch(`http://127.0.0.1:5000/cancel-order/${orderId}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {

        alert(data.message);

        localStorage.removeItem("lastOrderId");

        cart = [];
        updateCart();
    })
    .catch(err => {
        console.error(err);
    });
}

    // Initial render
    renderProducts();


});

