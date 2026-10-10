document.addEventListener('DOMContentLoaded', () => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    function mostrarCarrito() {
        const lista = document.getElementById('listaCarrito');
        const totalTexto = document.getElementById('totalCarrito');
        const contador = document.getElementById('contadorCarrito');

        if (!lista) return;

        lista.innerHTML = '';
        let total = 0;
        carrito.forEach(function(producto, index) {
            total = total + producto.precio;

            lista.innerHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    ${producto.nombre}
                    <span>
                        $${producto.precio}
                        <button class="btn btn-sm btn-danger ms-2" onclick="quitar(${index})">X</button>
                    </span>
                </li>`;
        });
        if (totalTexto) totalTexto.textContent = total;
        if (contador) contador.textContent = carrito.length;
    }

    function contarEnCarrito(id_producto) {
        let cantidad = 0;
        carrito.forEach(function (producto) {
            if (producto.id_producto === id_producto) {
                cantidad = cantidad + 1;
            }
        });
        return cantidad;
    }

    window.agregar = function(nombre, precio, id_producto, stock) {

        const cantidadActual = contarEnCarrito(id_producto);

        if (cantidadActual >= stock) {
            alert('No queda más stock de ' + nombre);
            const boton = document.getElementById('btnAgregar' + id_producto);
            if (boton) boton.disabled = true;
            return;
        }

        carrito.push({ nombre: nombre, precio: precio, id_producto: id_producto });
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();

        if (cantidadActual + 1 >= stock) {
            const boton = document.getElementById('btnAgregar' + id_producto);
            if (boton) boton.disabled = true;
        }
    };

    window.quitar = function(index) {
        carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
    };

    const btnVaciar = document.getElementById('btnVaciar');
    if (btnVaciar) {
        btnVaciar.addEventListener('click', () => {
            carrito = [];
            localStorage.setItem('carrito', JSON.stringify(carrito));
            mostrarCarrito();
        });
    }

    // Botón "Ir a pagar": lleva al checkout (checkout.html), donde se crea la orden
    const btnPagar = document.getElementById('btnPagar');
    if (btnPagar) {
        btnPagar.addEventListener('click', () => {
            if (carrito.length === 0) {
                alert('Tu carrito está vacío.');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }

    mostrarCarrito();
});