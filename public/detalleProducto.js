
const parametros = new URLSearchParams(window.location.search);
const idProducto = parametros.get('id');

if (!idProducto) {
  document.getElementById('detNombre').textContent = 'Producto no encontrado';
} else {

  fetch('/api/productos/' + idProducto)
    .then(function (respuesta) {
      return respuesta.json();
    })
    .then(function (producto) {
      rellenarPagina(producto);
    })
    .catch(function (error) {
      console.log('Error al traer el producto:', error);
      document.getElementById('detNombre').textContent = 'Error al cargar el producto';
    });
}

function rellenarPagina(producto) {

  var imagen = producto.imagen_principal
    ? 'img/productos/' + producto.imagen_principal
    : 'img/fondoaz.jpg';

  document.getElementById('detImagen').src = imagen;
  document.getElementById('detImagen').alt = producto.nombre;

  document.getElementById('detNombre').textContent = producto.nombre;
  document.getElementById('detOrigen').textContent = producto.origen || '';

  var precioFinal = Number(producto.precio);
  var enOferta = producto.en_oferta && producto.precio_oferta;
  if (enOferta) {
    precioFinal = Number(producto.precio_oferta);
    document.getElementById('detPrecio').innerHTML =
      '<span class="badge bg-danger fs-6 me-2">Oferta</span>' +
      '<span class="text-muted fs-5 text-decoration-line-through me-2">$' + Number(producto.precio).toLocaleString('es-CL') + '</span>' +
      '$' + precioFinal.toLocaleString('es-CL');
  } else {
    document.getElementById('detPrecio').textContent = '$' + precioFinal.toLocaleString('es-CL');
  }
  document.getElementById('detDescripcion').textContent = producto.descripcion || '';

  document.getElementById('detKilates').textContent = producto.kilates || '-';
  document.getElementById('detCorte').textContent = producto.corte || '-';
  document.getElementById('detClaridad').textContent = producto.claridad || '-';
  document.getElementById('detColor').textContent = producto.color || '-';
  document.getElementById('detCertificado').textContent = producto.certificado || '-';
  document.getElementById('detStock').textContent = producto.stock;

  const btnAgregar = document.getElementById('btnAgregarDetalle');
  if (btnAgregar) {
    if (producto.stock > 0) {
      btnAgregar.onclick = function () {
        agregar(producto.nombre, precioFinal, producto.id_producto, producto.stock);
      };
    } else {
      btnAgregar.disabled = true;
      btnAgregar.textContent = 'Sin stock';
    }
  }
}