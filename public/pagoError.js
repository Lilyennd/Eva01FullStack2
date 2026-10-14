// Vista Pago con error.
// Si la orden llegó a crearse (?id=...) se lee del servidor; si no, se usan los datos
// que checkout.js dejó guardados en sessionStorage.
document.addEventListener('DOMContentLoaded', async () => {
  const id = new URLSearchParams(window.location.search).get('id');
  const guardado = JSON.parse(sessionStorage.getItem('checkoutError')) || null;

  const contenido = document.getElementById('contenidoError');
  const mensaje = document.getElementById('mensajeSinDatos');

  const dinero = (n) => '$' + Number(n).toLocaleString('es-CL');
  const poner = (idCampo, valor) => { document.getElementById(idCampo).value = valor || ''; };

  let numero = '';
  let filas = [];
  let total = 0;
  let cliente = null;

  if (id) {
    try {
      const res = await fetch('/api/ordenes/' + id);
      if (res.ok) {
        const orden = await res.json();
        numero = orden.numero_orden;
        total = orden.total;
        cliente = {
          nombre: orden.nombre_cliente, apellidos: orden.apellidos_cliente, correo: orden.correo_cliente,
          calle: orden.calle, departamento: orden.departamento, region: orden.nombre_region,
          comuna: orden.nombre_comuna, indicaciones: orden.indicaciones,
        };
        filas = orden.detalle.map((d) => ({
          nombre: d.nombre_producto, precio: d.precio_unitario, cantidad: d.cantidad, subtotal: d.subtotal,
        }));
      }
    } catch (error) {
      console.log('Error al traer la orden:', error);
    }
  }

  // si no hubo orden en el servidor, usamos lo que se guardó en el checkout
  if (!cliente && guardado) {
    const d = guardado.datos;
    total = guardado.total;
    cliente = {
      nombre: d.nombre, apellidos: d.apellidos, correo: d.correo, calle: d.calle,
      departamento: d.departamento, region: d.nombre_region, comuna: d.nombre_comuna,
      indicaciones: d.indicaciones,
    };
    filas = guardado.items.map((i) => ({
      nombre: i.nombre, precio: i.precio, cantidad: i.cantidad, subtotal: i.precio * i.cantidad,
    }));
  }

  if (!cliente) {
    contenido.style.display = 'none';
    mensaje.style.display = 'block';
    return;
  }

  document.getElementById('numeroOrden').textContent = numero ? '. nro #' + numero : '';
  document.getElementById('motivoError').textContent =
    (guardado && guardado.mensaje) ? guardado.mensaje : 'El pago no pudo ser procesado.';

  poner('nombre', cliente.nombre);
  poner('apellidos', cliente.apellidos);
  poner('correo', cliente.correo);
  poner('calle', cliente.calle);
  poner('departamento', cliente.departamento);
  poner('region', cliente.region);
  poner('comuna', cliente.comuna);
  poner('indicaciones', cliente.indicaciones);

  const tbody = document.getElementById('filasError');
  tbody.innerHTML = '';
  filas.forEach((f) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `<td></td><td>${dinero(f.precio)}</td><td>${f.cantidad}</td><td>${dinero(f.subtotal)}</td>`;
    fila.children[0].textContent = f.nombre;
    tbody.appendChild(fila);
  });
  document.getElementById('totalError').textContent = 'Total a pagar: ' + dinero(total);

  // el carrito sigue guardado, así que basta con volver al checkout
  document.getElementById('btnReintentar').addEventListener('click', () => {
    window.location.href = 'checkout.html';
  });
});
