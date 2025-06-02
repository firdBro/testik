document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartItemsContainer = document.getElementById("cart-items");
  const totalPriceElem = document.getElementById("total-price");
  const checkoutBtn = document.getElementById("checkout");
  const contactForm = document.getElementById("contact-form");
  const phoneInput = contactForm.querySelector('input[name="phone"]');

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function renderCart() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Корзина пуста</p>";
      totalPriceElem.textContent = "0 ₽";
      return;
    }

    let total = 0;

    cart.forEach((item, index) => {
      let priceNumber = parseFloat(item.price.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
      const itemTotal = priceNumber * item.quantity;
      total += itemTotal;

      const itemElem = document.createElement("div");
      itemElem.classList.add("cart-item");

      itemElem.innerHTML = `
        <span class="item-name">${item.title}</span>
        <div class="item-controls">
          <button class="qty-btn decrease" data-index="${index}">−</button>
          <span class="qty-display">${item.quantity}</span>
          <button class="qty-btn increase" data-index="${index}">+</button>
          <span class="item-price">${itemTotal.toFixed(2)} ₽</span>
        </div>
      `;

      cartItemsContainer.appendChild(itemElem);
    });

    totalPriceElem.textContent = total.toFixed(2) + " ₽";
  }

  cartItemsContainer.addEventListener("click", (e) => {
    const index = e.target.dataset.index;
    if (typeof index === "undefined") return;

    if (e.target.classList.contains("increase")) {
      cart[index].quantity++;
      saveCart();
      renderCart();
    } else if (e.target.classList.contains("decrease")) {
      if (cart[index].quantity === 50) {
        // Если 50 — удаляем товар
        cart.splice(index, 1);
      } else {
        cart[index].quantity--;
      }
      saveCart();
      renderCart();
    }
  });

  checkoutBtn.addEventListener("click", () => {
    if (!cart.length) {
      alert("Ваша корзина пуста.");
      return;
    }
    contactForm.style.display = "block";
    checkoutBtn.disabled = true;
    contactForm.scrollIntoView({ behavior: "smooth" });
  });

  contactForm.addEventListener("submit", e => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const firstName = formData.get("firstName").trim();
    const lastName = formData.get("lastName").trim();
    const phone = formData.get("phone").trim();
    const email = formData.get("email").trim();

    if (!firstName || !lastName || !phone) {
      alert("Заполните обязательные поля: Имя, Фамилия, Телефон.");
      return;
    }

    alert(`Спасибо за заказ, ${firstName}! Мы свяжемся по телефону: ${phone}`);

    cart = [];
    saveCart();
    renderCart();

    contactForm.reset();
    contactForm.style.display = "none";
    checkoutBtn.disabled = false;
  });

  // Запрет букв в поле телефона
  phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/[^0-9+\-\(\)]/g, '');
  });

  // Автопоправка на минимум 50 штук
  cart = cart.map(item => ({
    ...item,
    quantity: item.quantity < 50 ? 50 : item.quantity
  }));
  saveCart();

  renderCart();
});
