// Vista Ofertas: muestra solo los productos en oferta
const contenedorOfertas = document.getElementById('listaOfertas');

fetch('/api/productos?oferta=1')
  .then(function (respuesta) {
    return respuesta.json();
  })
  .then(function (productos) {
    if (!Array.isArray(productos) || productos.length === 0) {
      contenedorOfertas.innerHTML = '<p class="text-center text-white">Por ahora no hay productos en oferta.</p>';
      return;
    }
    productos.forEach(function (producto) {
      contenedorOfertas.innerHTML += crearCardProducto(producto);
    });
  })
  .catch(function (error) {
    console.log('Error al traer las ofertas:', error);
    contenedorOfertas.innerHTML = '<p class="text-danger">No se pudieron cargar las ofertas.</p>';
  });
