// Funciones compartidas por categorias.js y ofertas.js
// (son las mismas de productos.js: precioFinal y crearCardProducto)

function precioFinal(producto) {
  if (producto.en_oferta && producto.precio_oferta) {
    return Number(producto.precio_oferta);
  }
  return Number(producto.precio);
}

function textoSeguro(texto) {
  return String(texto === null || texto === undefined ? '' : texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function crearCardProducto(producto) {
  var enOferta = precioFinal(producto) < Number(producto.precio);
  var precioHtml = enOferta
    ? '<span class="badge bg-danger me-1">Oferta</span>' +
      '<span class="text-muted text-decoration-line-through me-1">$' + Number(producto.precio).toLocaleString('es-CL') + '</span>' +
      '$' + precioFinal(producto).toLocaleString('es-CL')
    : '$' + Number(producto.precio).toLocaleString('es-CL');

  var imagen = producto.imagen_principal
    ? 'img/productos/' + producto.imagen_principal
    : 'img/fondoaz.jpg';

  var sinStock = Number(producto.stock) <= 0;
  // las comillas rompen el onclick, por eso se reemplazan
  var nombreParaBoton = String(producto.nombre).replace(/['"]/g, '’');

  return `
    <div class="col-12 col-sm-6 col-lg-4">
      <div class="card h-100">
        <img src="${imagen}" class="card-img-top" alt="${textoSeguro(producto.nombre)}" style="height: 220px; object-fit: cover;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${textoSeguro(producto.nombre)}</h5>
          <p class="card-text text-muted">${producto.origen ? textoSeguro(producto.origen) : ''}</p>
          <p class="card-text fw-bold">${precioHtml}</p>

          <div class="mt-auto d-flex gap-2">
            <a href="detalleProducto.html?id=${producto.id_producto}" class="btn btn-outline-dark flex-fill">
              Ver detalle
            </a>
            <button id="btnAgregar${producto.id_producto}" onclick="agregar('${nombreParaBoton}', ${precioFinal(producto)}, ${producto.id_producto}, ${producto.stock})" class="btn btn-success flex-fill" ${sinStock ? 'disabled' : ''}>
              ${sinStock ? 'Sin stock' : 'Agregar'}
            </button>
          </div>

        </div>
      </div>
    </div>
  `;
}
