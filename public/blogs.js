const contenedorBlogs = document.getElementById('listaBlogs');

fetch('/api/blogs')
  .then(function (respuesta) {
    if (!respuesta.ok) {
      throw new Error('Respuesta de red no ok');
    }
    return respuesta.json();
  })
  .then(function (blogs) {
    contenedorBlogs.innerHTML = '';

    if (blogs.length === 0) {
      contenedorBlogs.innerHTML = '<p class="text-white">Aún no hay blogs publicados.</p>';
      return;
    }

    blogs.forEach(function (blog) {
      contenedorBlogs.innerHTML += crearCardBlog(blog);
    });
  })
  .catch(function (error) {
    console.log('Error al traer los blogs:', error);
    contenedorBlogs.innerHTML = '<p class="text-danger">No se pudieron cargar los blogs.</p>';
  });

function rutaImagenBlog(imagen) {
  if (!imagen) return 'img/fondoaz.jpg';
  if (imagen.startsWith('http') || imagen.startsWith('/') || imagen.startsWith('img/')) return imagen;
  return 'img/' + imagen;
}

function crearCardBlog(blog) {
  return `
    <div class="card mb-3" style="max-width: 640px">
      <div class="row g-0">
        <div class="col-md-4">
          <img src="${rutaImagenBlog(blog.imagen)}" onerror="this.onerror=null;this.src='img/fondoaz.jpg'"
               style="height: 100%; object-fit: cover;" class="img-fluid rounded-start" alt="${blog.titulo}">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${blog.titulo}</h5>
            <p class="card-text">${blog.descripcion_corta ? blog.descripcion_corta : ''}</p>
            <a href="detalleBlog.html?id=${blog.id_blog}" class="btn btn-info" style="background: linear-gradient(rgb(59, 67, 116), rgb(17, 17, 95)); color: white;">
              Detalles
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}