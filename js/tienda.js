(function initTienda() {
    const productosData = [
        { id: "c1", nombre: "Croquetas Adulto 3kg", categoria: "Croquetas", precio: 399, desc: "Alimento balanceado para perro adulto." },
        { id: "c2", nombre: "Croquetas Gato 2kg", categoria: "Croquetas", precio: 329, desc: "Para gato adulto, cuidado digestivo." },
        { id: "m1", nombre: "Antipulgas", categoria: "Medicina", precio: 219, desc: "Protección contra pulgas y garrapatas." },
        { id: "m2", nombre: "Vitaminas Mascota", categoria: "Medicina", precio: 189, desc: "Apoyo general y defensas." },
        { id: "a1", nombre: "Shampoo para perro", categoria: "Accesorios", precio: 149, desc: "Aroma suave, piel sensible." },
        { id: "a2", nombre: "Juguete mordedera", categoria: "Accesorios", precio: 99, desc: "Resistente, ideal para juego." }
    ];

    const productosEl = $("productos");
    const buscadorProductos = $("buscadorProductos");
    const btnAbrirCarrito = $("btnAbrirCarrito");
    const btnCerrarCarrito = $("btnCerrarCarrito");
    const cart = $("cart");
    const cartOverlay = $("cartOverlay");
    const cartItems = $("cartItems");
    const cartTotal = $("cartTotal");
    const btnVaciarCarrito = $("btnVaciarCarrito");
    const btnComprar = $("btnComprar");
    const contadorCarrito = $("contadorCarrito");
    const btnAbrirCarritoNav = $("btnAbrirCarritoNav");
    const badgeCarrito = $("badgeCarrito");

    if (!productosEl || !buscadorProductos || !btnAbrirCarrito || !btnCerrarCarrito || !cart || !cartOverlay || !cartItems || !cartTotal || !btnVaciarCarrito || !btnComprar || !contadorCarrito) {
        console.error("Faltan elementos del carrito/tienda en el HTML (IDs).");
        return;
    }

    function leerCarrito() {
        try { return JSON.parse(localStorage.getItem("carrito_vet") || "{}"); }
        catch { return {}; }
    }

    function guardarCarrito(obj) {
        localStorage.setItem("carrito_vet", JSON.stringify(obj));
    }

    function getProducto(id) {
        return productosData.find(p => p.id === id);
    }

    function totalCarrito(carrito) {
        let total = 0;
        Object.keys(carrito).forEach(id => {
            const p = getProducto(id);
            if (p) total += p.precio * carrito[id];
        });
        return total;
    }

    function cantidadCarrito(carrito) {
        return Object.values(carrito).reduce((a, b) => a + b, 0);
    }

    function abrirCarrito() {
        cart.classList.add("open");
        cartOverlay.classList.add("open");
    }

    function cerrarCarrito() {
        cart.classList.remove("open");
        cartOverlay.classList.remove("open");
    }

    btnAbrirCarrito.addEventListener("click", abrirCarrito);
    btnCerrarCarrito.addEventListener("click", cerrarCarrito);
    cartOverlay.addEventListener("click", cerrarCarrito);

    if (btnAbrirCarritoNav) {
        btnAbrirCarritoNav.addEventListener("click", abrirCarrito);
    }

    function actualizarContadorCarrito() {
        const carrito = leerCarrito();
        const cant = cantidadCarrito(carrito);

        contadorCarrito.textContent = `${cant} en carrito`;

        if (badgeCarrito) {
            badgeCarrito.textContent = cant;
            badgeCarrito.style.display = cant > 0 ? "block" : "none";
        }
    }

    function addToCart(id, delta) {
        const carrito = leerCarrito();
        carrito[id] = (carrito[id] || 0) + delta;
        if (carrito[id] <= 0) delete carrito[id];
        guardarCarrito(carrito);
        renderCarrito();
        syncQtyBadges();
        actualizarContadorCarrito();
    }

    function syncQtyBadges() {
        const carrito = leerCarrito();
        productosData.forEach(p => {
            const el = document.getElementById(`qty-${p.id}`);
            if (el) el.textContent = carrito[p.id] ? carrito[p.id] : 0;
        });
    }

    function wireProductosEvents() {
        document.querySelectorAll("[data-add]").forEach(btn => {
            btn.addEventListener("click", () => {
                addToCart(btn.getAttribute("data-add"), 1);
                toast("Agregado al carrito.");
            });
        });

        document.querySelectorAll("[data-more]").forEach(btn => {
            btn.addEventListener("click", () => addToCart(btn.getAttribute("data-more"), 1));
        });

        document.querySelectorAll("[data-less]").forEach(btn => {
            btn.addEventListener("click", () => addToCart(btn.getAttribute("data-less"), -1));
        });
    }

    function renderProductos() {
        const q = normaliza(buscadorProductos.value);
        const filtrados = productosData.filter(p =>
            normaliza(p.nombre).includes(q) || normaliza(p.categoria).includes(q)
        );

        if (filtrados.length === 0) {
            productosEl.innerHTML = `<p class="muted">No encontré productos.</p>`;
            return;
        }

        productosEl.innerHTML = filtrados.map(p => `
      <div class="producto">
        <div class="p-top">
          <div>
            <p class="p-name">${p.nombre}</p>
            <p class="p-cat">${p.categoria}</p>
          </div>
          <div class="p-price">${money(p.precio)}</div>
        </div>
        <p class="p-desc">${p.desc}</p>
        <div class="p-actions">
          <button class="btn" data-add="${p.id}">Agregar</button>
          <div class="qty">
            <button type="button" data-less="${p.id}">-</button>
            <span id="qty-${p.id}">0</span>
            <button type="button" data-more="${p.id}">+</button>
          </div>
        </div>
      </div>
    `).join("");

        syncQtyBadges();
        wireProductosEvents();
    }

    function renderCarrito() {
        const carrito = leerCarrito();
        const ids = Object.keys(carrito);

        if (ids.length === 0) {
            cartItems.innerHTML = `<p class="muted">Tu carrito está vacío.</p>`;
            cartTotal.textContent = money(0);
            actualizarContadorCarrito();
            return;
        }

        cartItems.innerHTML = ids.map(id => {
            const p = getProducto(id);
            const qty = carrito[id];
            const sub = p.precio * qty;

            return `
        <div class="cart-item">
          <div>
            <p class="ci-name">${p.nombre}</p>
            <p class="ci-meta">${p.categoria} • Cantidad: ${qty}</p>
          </div>
          <div class="ci-right">
            <div class="ci-price">${money(sub)}</div>
            <button class="small-btn" data-remove="${id}">Quitar</button>
          </div>
        </div>
      `;
        }).join("");

        cartTotal.textContent = money(totalCarrito(carrito));

        cartItems.querySelectorAll("[data-remove]").forEach(btn => {
            btn.addEventListener("click", () => {
                addToCart(btn.getAttribute("data-remove"), -9999);
                toast("Producto eliminado.");
            });
        });

        actualizarContadorCarrito();
    }

    btnVaciarCarrito.addEventListener("click", () => {
        localStorage.removeItem("carrito_vet");
        renderCarrito();
        syncQtyBadges();
        toast("Carrito vaciado.");
    });

    btnComprar.addEventListener("click", () => {
        const carrito = leerCarrito();
        if (Object.keys(carrito).length === 0) {
            toast("Tu carrito está vacío.");
            return;
        }

        const total = totalCarrito(carrito);
        localStorage.removeItem("carrito_vet");
        renderCarrito();
        syncQtyBadges();
        cerrarCarrito();

        toast(`Compra simulada: ${money(total)}`);
        const resTienda = $("resultadoTienda");
        if (resTienda) {
            resTienda.textContent = `✅ Compra simulada realizada. Total: ${money(total)}.`;
        }
    });

    buscadorProductos.addEventListener("input", renderProductos);

    renderProductos();
    renderCarrito();
    actualizarContadorCarrito();
})();
