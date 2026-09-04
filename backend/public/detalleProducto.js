
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
  document.getElementById('detPrecio').textContent = '$' + Number(producto.precio).toLocaleString('es-CL');
  document.getElementById('detDescripcion').textContent = producto.descripcion || '';

  document.getElementById('detKilates').textContent = producto.kilates || '-';
  document.getElementById('detCorte').textContent = producto.corte || '-';
  document.getElementById('detClaridad').textContent = producto.claridad || '-';
  document.getElementById('detColor').textContent = producto.color || '-';
  document.getElementById('detCertificado').textContent = producto.certificado || '-';
  document.getElementById('detStock').textContent = producto.stock;
}