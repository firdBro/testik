document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartItemsContainer = document.getElementById("cart-items");
  const totalPriceElem = document.getElementById("total-price");
  const checkoutBtn = document.getElementById("checkout");
  const contactForm = document.getElementById("contact-form");
  const phoneInput = contactForm.querySelector('input[name="phone"]');

  // Создаем и добавляем предупреждение в DOM
  let warningElem = document.createElement("div");
  warningElem.textContent = "Минимум 10 товаров!";
  warningElem.style.cssText = `
    background-color: #ffdddd;
    border: 1px solid #ff0000;
    color: #900;
    padding: 10px;
    margin: 10px 0;
    display: none;
    font-weight: bold;
  `;
  cartItemsContainer.parentNode.insertBefore(warningElem, cartItemsContainer);

  function showWarning() {
    warningElem.style.display = "block";
  }

  function hideWarning() {
    warningElem.style.display = "none";
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function renderCart() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Корзина пуста</p>";
      totalPriceElem.textContent = "0 ₽";
      hideWarning();
      return;
    }

    let total = 0;

    cart.forEach((item, index) => {
      let priceNumber = parseFloat(item.price.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
      const itemTotal = priceNumber * item.quantity;
      total += itemTotal;

      const itemElem = document.createElement("div");
      itemElem.classList.add("cart-item");

      // Новые поля для халатов и комбинезонов
      let optionsHTML = "";

      if (/Халат/i.test(item.title)) {
        optionsHTML = `
          <div class="item-options">
            <label>Размер:
              <select name="size-${index}">
                <option value="50-54">50-54</option>
                <option value="56-60">56-60</option>
              </select>
            </label>
            <label>Застёжка:
              <select name="fastener-${index}">
                <option value="Кнопка">Кнопка</option>
                <option value="Липучка">Липучка</option>
              </select>
            </label>
          </div>
        `;
      } else if (/Комбинезон/i.test(item.title)) {
        optionsHTML = `
          <div class="item-options">
            <label>Размер:
              <select name="size-${index}">
                <option value="L/XL">L/XL</option>
                <option value="2XL/3XL">2XL/3XL</option>
              </select>
            </label>
          </div>
        `;
      }

      itemElem.innerHTML = `
        <a href="tovar.html?title=${encodeURIComponent(item.title)}" class="item-name">${item.title}</a>
        <div class="item-controls">
          <button class="qty-btn decrease" data-index="${index}">−</button>
          <span class="qty-display">${item.quantity}</span>
          <button class="qty-btn increase" data-index="${index}">+</button>
          <span class="item-price">${itemTotal.toFixed(2)} ₽</span>
        </div>
        ${optionsHTML}
      `;

      cartItemsContainer.appendChild(itemElem);
    });

    totalPriceElem.textContent = total.toFixed(2) + " ₽";

    // Если есть в корзине товары с количеством меньше 10, показываем предупреждение
    if (cart.some(item => item.quantity < 10)) {
      showWarning();
    } else {
      hideWarning();
    }
  }

  cartItemsContainer.addEventListener("click", (e) => {
    const index = e.target.dataset.index;
    if (typeof index === "undefined") return;

    if (e.target.classList.contains("increase")) {
      cart[index].quantity++;
      saveCart();
      renderCart();
    } else if (e.target.classList.contains("decrease")) {
      if (cart[index].quantity > 10) {
        cart[index].quantity--;
        saveCart();
        renderCart();
      } else if (cart[index].quantity === 10) {
        cart[index].quantity = 9;
        saveCart();
        renderCart();
        showWarning();
      } else if (cart[index].quantity === 9) {
        cart.splice(index, 1);
        saveCart();
        renderCart();
        hideWarning();
      }
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

  phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/[^0-9+\-\(\)]/g, '');
  });

  // При загрузке корзины ставим минимум 10 штук на каждый товар
  cart = cart.map(item => ({
    ...item,
    quantity: item.quantity < 10 ? 10 : item.quantity
  }));
  saveCart();

  renderCart();
});
