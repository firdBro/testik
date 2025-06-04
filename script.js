document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navUl = document.querySelector("nav ul");

  if (menuToggle && navUl) {
    menuToggle.addEventListener("click", () => {
      const isShown = navUl.classList.toggle("show");
      menuToggle.classList.toggle("active", isShown);
      updateMenuIcon(isShown);
    });

    // Закрыть меню при клике вне nav ul и кнопки
    document.addEventListener("click", (event) => {
      if (
        navUl.classList.contains("show") &&
        !navUl.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        navUl.classList.remove("show");
        menuToggle.classList.remove("active");
        updateMenuIcon(false);
      }
    });

    function updateMenuIcon(isOpen) {
      if (isOpen) {
        menuToggle.innerHTML = "&times;"; // ×
      } else {
        menuToggle.innerHTML = "&#9776;"; // ☰
      }
    }

    updateMenuIcon(false);
  }


  const cartIcon = document.getElementById("cart-icon");
  const cartCount = document.getElementById("cart-count");
  const buttons = document.querySelectorAll(".products button");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCartCount() {
    const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartCount.textContent = totalQuantity;
    cartCount.style.display = totalQuantity > 0 ? "flex" : "none";
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = btn.closest(".product");
      const title = product.querySelector("h4").innerText.trim();
      const priceText = product.querySelector("p").innerText.trim();
      const price = priceText.match(/[\d.,]+/)[0].replace(",", ".");

      const existingItem = cart.find(item => item.title === title);
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        cart.push({ title, price: price + " ₽", quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
    });
  });

  updateCartCount();

  cartIcon.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Корзина пуста!");
      return;
    }
    window.location.href = "korzina.html";
  });

  cartIcon.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      cartIcon.click();
    }
  });
});
