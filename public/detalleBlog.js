
const parametros = new URLSearchParams(window.location.search);
const idBlog = parametros.get('id');

if (!idBlog) {
  document.getElementById('detTitulo').textContent = 'Blog no encontrado';
} else {

  fetch('/api/blogs/' + idBlog)
    .then(function (respuesta) {
      if (!respuesta.ok) {
        throw new Error('Blog no encontrado (' + respuesta.status + ')');
      }
      return respuesta.json();
    })
    .then(function (blog) {
      rellenarPagina(blog);
    })
    .catch(function (error) {
      console.log('Error al traer el blog:', error);
      document.getElementById('detTitulo').textContent = 'Error al cargar el blog';
      document.getElementById('detContenido').innerHTML =
        '<p class="text-danger">El artículo solicitado no existe o no se pudo cargar.</p>';
    });
}

function rutaImagenBlog(imagen) {
  if (!imagen) return 'img/fondoaz.jpg';
  if (imagen.startsWith('http') || imagen.startsWith('/') || imagen.startsWith('img/')) return imagen;
  return 'img/' + imagen;
}

function rellenarPagina(blog) {

  document.title = (blog.titulo || 'Blog') + ' | Splendor';

  var imagen = document.getElementById('detImagen');
  imagen.src = rutaImagenBlog(blog.imagen);
  imagen.alt = blog.titulo || 'Imagen del blog';
  
  imagen.onerror = function () {
    imagen.onerror = null;
    imagen.src = 'img/fondoaz.jpg';
  };

  document.getElementById('detTitulo').textContent = blog.titulo || 'Sin título';
  document.getElementById('detResumen').textContent = blog.descripcion_corta || '';


  document.getElementById('detContenido').innerHTML =
    blog.descripcion_larga || '<p class="text-muted">Este artículo aún no tiene contenido.</p>';

  if (blog.fecha_publicacion) {
    var fecha = new Date(blog.fecha_publicacion);
    if (!isNaN(fecha)) {
      document.getElementById('detFecha').textContent =
        'Publicado el ' + fecha.toLocaleDateString('es-CL', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
    }
  }
}