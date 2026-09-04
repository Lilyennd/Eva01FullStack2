document.addEventListener('DOMContentLoaded', () => {


    const contenedor = document.getElementById('listaProductos');

    fetch('/api/productos')
      .then(function (respuesta) {
        return respuesta.json();
      })
      .then(function (productos) {
        contenedor.innerHTML = ''; 
        productos.forEach(function (producto) {
          contenedor.innerHTML += crearCardInventario(producto);
        });
      })
      .catch(function (error) {
        console.log('Error al traer los productos:', error);
        contenedor.innerHTML = '<p class="text-danger">No se pudieron cargar los productos.</p>';
      });

    function crearCardInventario(producto) {

      var imagen = producto.imagen_principal
        ? 'img/productos/' + producto.imagen_principal
        : 'img/fondoaz.jpg';

      return `
        <div class="col-12 col-sm-6 col-lg-4">
          <div class="card h-100">
            <img src="${imagen}" class="card-img-top" alt="${producto.nombre}" style="height: 220px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${producto.nombre}</h5>
              <p class="card-text text-muted mb-1">Stock: ${producto.stock}</p>
              <p class="card-text text-muted">${producto.origen ? producto.origen : ''}</p>
              <p class="card-text fw-bold">$${Number(producto.precio).toLocaleString('es-CL')}</p>
              <a href="modificarProducto.html?id=${producto.id_producto}" class="btn btn-outline-dark mt-auto ; textbasico" style="background-color: #263869; border-color: #3f4d7a;  ">Modificar
</a>

            </div>
          </div>
        </div>
      `;
    }

});