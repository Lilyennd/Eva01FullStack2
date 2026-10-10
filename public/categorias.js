// Vista Categorías
//  categorias.html          -> todas las categorías, cada una con sus productos
//  categorias.html?id=2     -> solo la categoría 2 
const parametros = new URLSearchParams(window.location.search);
const idSeleccionada = parametros.get('id');

const contenedorCategorias = document.getElementById('listaCategorias');
const contenedorProductos = document.getElementById('productosCategorias');

Promise.all([
  fetch('/api/categorias').then(function (r) { return r.json(); }),
  fetch('/api/productos').then(function (r) { return r.json(); })
])
  .then(function (resultado) {
    const categorias = resultado[0];
    const productos = resultado[1];

    mostrarTarjetasCategorias(categorias, productos);
    mostrarProductosPorCategoria(categorias, productos);
  })
  .catch(function (error) {
    console.log('Error al traer categorías:', error);
    contenedorProductos.innerHTML = '<p class="text-danger">No se pudieron cargar las categorías.</p>';
  });

function mostrarTarjetasCategorias(categorias, productos) {
  contenedorCategorias.innerHTML = '';

  categorias.forEach(function (categoria) {
    // como la tabla categorias no tiene imagen, se usa la foto del primer producto de esa categoría
    const primero = productos.find(function (p) {
      return p.id_categoria === categoria.id_categoria && p.imagen_principal;
    });
    const imagen = primero ? 'img/productos/' + primero.imagen_principal : 'img/fondoaz.jpg';
    const activa = String(categoria.id_categoria) === String(idSeleccionada);

    contenedorCategorias.innerHTML += `
      <div class="col-6 col-md-4 col-lg-3">
        <a href="categorias.html?id=${categoria.id_categoria}" class="text-decoration-none">
          <div class="card h-100 text-center shadow-sm ${activa ? 'border-primary border-3' : ''}">
            <img src="${imagen}" class="card-img-top" alt="${textoSeguro(categoria.nombre_categoria)}" style="height: 120px; object-fit: cover;">
            <div class="card-body p-2">
              <h6 class="card-title mb-0 text-dark">${textoSeguro(categoria.nombre_categoria)}</h6>
            </div>
          </div>
        </a>
      </div>`;
  });
}

function mostrarProductosPorCategoria(categorias, productos) {
  contenedorProductos.innerHTML = '';

  let lista = categorias;
  if (idSeleccionada) {
    lista = categorias.filter(function (c) {
      return String(c.id_categoria) === String(idSeleccionada);
    });
    if (lista.length === 0) {
      contenedorProductos.innerHTML = '<p class="text-center text-white">La categoría no existe.</p>';
      return;
    }
  }

  lista.forEach(function (categoria) {
    const deEstaCategoria = productos.filter(function (p) {
      return p.id_categoria === categoria.id_categoria;
    });

    let html = '<h2 class="text-white mt-5 mb-3">' + textoSeguro(categoria.nombre_categoria) + '</h2>';
    html += '<div class="row g-4">';

    if (deEstaCategoria.length === 0) {
      html += '<p class="text-white">No hay productos en esta categoría.</p>';
    } else {
      deEstaCategoria.forEach(function (producto) {
        html += crearCardProducto(producto);
      });
    }

    html += '</div>';
    contenedorProductos.innerHTML += html;
  });
}
