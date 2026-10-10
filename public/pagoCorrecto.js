// Vista Pago correcto: muestra la boleta de la orden (GET /api/ordenes/:id)
document.addEventListener('DOMContentLoaded', async () => {
  const id = new URLSearchParams(window.location.search).get('id');
  const contenido = document.getElementById('contenidoBoleta');
  const mensaje = document.getElementById('mensajeBoleta');

  const dinero = (n) => '$' + Number(n).toLocaleString('es-CL');
  const poner = (idCampo, valor) => { document.getElementById(idCampo).value = valor || ''; };

  function mostrarMensaje(texto) {
    contenido.style.display = 'none';
    mensaje.style.display = 'block';
    mensaje.querySelector('p').textContent = texto;
  }

  if (!id) {
    mostrarMensaje('No se indicó el número de la orden.');
    return;
  }

  try {
    const res = await fetch('/api/ordenes/' + id);
    if (!res.ok) {
      mostrarMensaje('No encontramos la orden solicitada.');
      return;
    }
    const orden = await res.json();

    // si no está pagada, no corresponde mostrar la boleta
    if (orden.estado !== 'Pagada') {
      window.location.href = 'pagoError.html?id=' + id;
      return;
    }

    document.getElementById('numeroOrden').textContent = '#' + orden.numero_orden;
    document.getElementById('codigoOrden').textContent = 'Código orden: ORDER' + orden.id_orden;

    poner('nombre', orden.nombre_cliente);
    poner('apellidos', orden.apellidos_cliente);
    poner('correo', orden.correo_cliente);
    poner('calle', orden.calle);
    poner('departamento', orden.departamento);
    poner('region', orden.nombre_region);
    poner('comuna', orden.nombre_comuna);
    poner('indicaciones', orden.indicaciones);
    poner('entrega', orden.opcion_entrega);

    const filas = document.getElementById('filasBoleta');
    filas.innerHTML = '';
    orden.detalle.forEach((d) => {
      const img = d.imagen_producto ? 'img/productos/' + d.imagen_producto : 'img/fondoaz.jpg';
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td><img src="${img}" alt="" width="48" height="48" style="object-fit: cover;" class="rounded"></td>
        <td></td>
        <td>${dinero(d.precio_unitario)}</td>
        <td>${d.cantidad}</td>
        <td>${dinero(d.subtotal)}</td>`;
      fila.children[1].textContent = d.nombre_producto; // textContent evita inyectar HTML
      filas.appendChild(fila);
    });

    document.getElementById('totalPagado').textContent = 'Total pagado: ' + dinero(orden.total);

    // Imprimir / guardar como PDF desde el navegador
    document.getElementById('btnImprimir').addEventListener('click', () => window.print());

    // Enviar por correo: abre el programa de correo con el resumen
    document.getElementById('btnEmail').addEventListener('click', () => {
      let cuerpo = 'Gracias por tu compra en Splendor.\n\nOrden #' + orden.numero_orden + '\n\n';
      orden.detalle.forEach((d) => {
        cuerpo += d.nombre_producto + ' x' + d.cantidad + ' - ' + dinero(d.subtotal) + '\n';
      });
      cuerpo += '\nTotal pagado: ' + dinero(orden.total);
      window.location.href = 'mailto:' + encodeURIComponent(orden.correo_cliente) +
        '?subject=' + encodeURIComponent('Boleta compra #' + orden.numero_orden) +
        '&body=' + encodeURIComponent(cuerpo);
    });
  } catch (error) {
    console.log('Error al traer la orden:', error);
    mostrarMensaje('No se pudo cargar la boleta.');
  }
});
