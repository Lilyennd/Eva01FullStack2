// Vista Comprar (checkout): resumen del carrito + datos del cliente + dirección de entrega.
// Flujo: crea la orden (POST /api/ordenes) y simula el pago marcándola como 'Pagada'
// (PUT /api/ordenes/:id, que además descuenta el stock). Si algo falla -> pagoError.html
document.addEventListener('DOMContentLoaded', async () => {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const usuario = JSON.parse(localStorage.getItem('usuarioActual'));

  const contenido = document.getElementById('contenidoCheckout');
  const mensajeVacio = document.getElementById('mensajeVacio');
  const filasResumen = document.getElementById('filasResumen');
  const totalPagar = document.getElementById('totalPagar');
  const form = document.getElementById('formCheckout');
  const selRegion = document.getElementById('region');
  const selComuna = document.getElementById('comuna');
  const btnPagar = document.getElementById('btnPagarAhora');

  const dinero = (n) => '$' + Number(n).toLocaleString('es-CL');

  // ---------- 1. Carrito vacío ----------
  if (carrito.length === 0) {
    contenido.style.display = 'none';
    mensajeVacio.style.display = 'block';
    return;
  }

  // ---------- 2. Agrupar el carrito (cada click en "Agregar" es una unidad) ----------
  const agrupados = {};
  carrito.forEach((p) => {
    if (!agrupados[p.id_producto]) {
      agrupados[p.id_producto] = {
        id_producto: p.id_producto,
        nombre: p.nombre,
        precio: Number(p.precio),
        cantidad: 0,
      };
    }
    agrupados[p.id_producto].cantidad++;
  });
  const items = Object.values(agrupados);
  const total = items.reduce((suma, i) => suma + i.precio * i.cantidad, 0);

  // imágenes de los productos (el carrito solo guarda nombre, precio e id)
  const imagenes = {};
  try {
    const res = await fetch('/api/productos');
    const productos = await res.json();
    productos.forEach((p) => { imagenes[p.id_producto] = p.imagen_principal; });
  } catch (error) {
    console.log('No se pudieron traer las imágenes:', error);
  }

  filasResumen.innerHTML = '';
  items.forEach((i) => {
    const img = imagenes[i.id_producto] ? 'img/productos/' + imagenes[i.id_producto] : 'img/fondoaz.jpg';
    filasResumen.innerHTML += `
      <tr>
        <td><img src="${img}" alt="" width="48" height="48" style="object-fit: cover;" class="rounded"></td>
        <td>${textoCheckout(i.nombre)}</td>
        <td>${dinero(i.precio)}</td>
        <td>${i.cantidad}</td>
        <td>${dinero(i.precio * i.cantidad)}</td>
      </tr>`;
  });
  totalPagar.textContent = dinero(total);
  btnPagar.textContent = 'Pagar ahora ' + dinero(total);

  // ---------- 3. Región y comuna ----------
  async function cargarRegiones() {
    try {
      const res = await fetch('/api/regiones');
      const regiones = await res.json();
      selRegion.innerHTML = '<option value="">Seleccionar región</option>';
      regiones.forEach((r) => {
        selRegion.innerHTML += `<option value="${r.id_region}">${textoCheckout(r.nombre_region)}</option>`;
      });
    } catch (error) {
      console.error('Error cargando regiones:', error);
    }
  }

  async function cargarComunas(idRegion) {
    selComuna.innerHTML = '<option value="">Seleccionar comuna</option>';
    if (!idRegion) {
      selComuna.disabled = true;
      return;
    }
    try {
      const res = await fetch('/api/comunas?regionId=' + idRegion);
      const comunas = await res.json();
      comunas.forEach((c) => {
        selComuna.innerHTML += `<option value="${c.id_comuna}">${textoCheckout(c.nombre_comuna)}</option>`;
      });
      selComuna.disabled = false;
    } catch (error) {
      console.error('Error cargando comunas:', error);
    }
  }

  selRegion.addEventListener('change', () => cargarComunas(selRegion.value));
  await cargarRegiones();

  // ---------- 4. Si inició sesión, se rellena solo ----------
  if (usuario) {
    document.getElementById('nombre').value = usuario.nombre || '';
    document.getElementById('apellidos').value = usuario.apellidos || '';
    document.getElementById('correo').value = usuario.correo || '';

    try {
      const res = await fetch('/api/usuarios/' + usuario.id_usuario);
      if (res.ok) {
        const u = await res.json();
        document.getElementById('calle').value = u.direccion || '';
        if (u.id_region) {
          selRegion.value = u.id_region;
          await cargarComunas(u.id_region);
          if (u.id_comuna) selComuna.value = u.id_comuna;
        }
      }
    } catch (error) {
      console.log('No se pudo traer la dirección del usuario:', error);
    }
  }

  // ---------- 5. Pagar ----------
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const datos = {
      nombre: document.getElementById('nombre').value.trim(),
      apellidos: document.getElementById('apellidos').value.trim(),
      correo: document.getElementById('correo').value.trim(),
      calle: document.getElementById('calle').value.trim(),
      departamento: document.getElementById('departamento').value.trim(),
      id_region: selRegion.value,
      id_comuna: selComuna.value,
      indicaciones: document.getElementById('indicaciones').value.trim(),
      opcion_entrega: document.querySelector('input[name="entrega"]:checked').value,
      id_usuario: usuario ? usuario.id_usuario : null,
      items: items.map((i) => ({ id_producto: i.id_producto, cantidad: i.cantidad })),
    };

    // se guarda por si el pago falla (lo usa pagoError.html)
    const respaldo = {
      mensaje: '',
      total: total,
      items: items,
      datos: Object.assign({}, datos, {
        nombre_region: selRegion.options[selRegion.selectedIndex].text,
        nombre_comuna: selComuna.options[selComuna.selectedIndex].text,
      }),
    };

    btnPagar.disabled = true;
    btnPagar.textContent = 'Procesando pago...';

    try {
      // a) crear la orden (valida stock y precios en el servidor)
      const resOrden = await fetch('/api/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      const orden = await resOrden.json();

      if (!resOrden.ok) {
        respaldo.mensaje = orden.error || 'No se pudo crear la orden.';
        sessionStorage.setItem('checkoutError', JSON.stringify(respaldo));
        window.location.href = 'pagoError.html';
        return;
      }

      // b) pago simulado: la orden pasa a 'Pagada' y se descuenta el stock
      const resPago = await fetch('/api/ordenes/' + orden.id_orden, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'Pagada' }),
      });

      if (!resPago.ok) {
        const errorPago = await resPago.json();
        respaldo.mensaje = errorPago.error || 'El pago fue rechazado.';
        sessionStorage.setItem('checkoutError', JSON.stringify(respaldo));
        await fetch('/api/ordenes/' + orden.id_orden, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: 'Pago fallido' }),
        });
        window.location.href = 'pagoError.html?id=' + orden.id_orden;
        return;
      }

      // c) todo bien: se vacía el carrito y se muestra la boleta
      localStorage.removeItem('carrito');
      sessionStorage.removeItem('checkoutError');
      window.location.href = 'pagoCorrecto.html?id=' + orden.id_orden;
    } catch (error) {
      console.log('Error en el pago:', error);
      respaldo.mensaje = 'No se pudo conectar con el servidor.';
      sessionStorage.setItem('checkoutError', JSON.stringify(respaldo));
      window.location.href = 'pagoError.html';
    }
  });
});

function textoCheckout(texto) {
  return String(texto === null || texto === undefined ? '' : texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
