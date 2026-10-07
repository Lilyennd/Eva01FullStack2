
const parametros = new URLSearchParams(window.location.search);
const idBlog = parametros.get('id');

if (!idBlog) {
  document.getElementById('Titulo').textContent = 'Blog no encontrado';
  document.getElementById('Contenido').innerHTML = '<p class="text-danger">No se proporcionó un ID de artículo válido.</p>';
} else {
  fetch('/api/blogs/' + idBlog)
    .then(function (respuesta) {
      if (!respuesta.ok) {
        throw new Error('Respuesta de red no ok');
      }
      return respuesta.json();
    })
    .then(function (blog) {
      rellenarPagina(blog);
    })
    .catch(function (error) {
      console.log('Error al traer el blog:', error);
      document.getElementById('Titulo').textContent = 'Error al cargar el blog';
      document.getElementById('Contenido').innerHTML = '<p class="text-danger">El artículo solicitado no existe o no se pudo cargar.</p>';
    });
}

function rellenarPagina(blog) {
  var elTitulo = document.getElementById('Titulo');
  var elImagen = document.getElementById('Imagen');
  var elContenido = document.getElementById('Contenido');
  var elFecha = document.getElementById('Fecha');


  if (elTitulo) {
    elTitulo.textContent = blog.titulo || 'Sin título';
  }


  if (elImagen) {
    var rutaImagen = blog.imagen;
    if (!rutaImagen) {
      rutaImagen = 'img/fondoaz.jpg';
    } else if (!rutaImagen.startsWith('http') && !rutaImagen.startsWith('img/') && !rutaImagen.startsWith('/')) {
      rutaImagen = 'img/' + rutaImagen;
    }
    elImagen.src = rutaImagen;
    elImagen.alt = blog.titulo || 'Imagen del blog';
  }

  if (elContenido) {
    elContenido.innerHTML = blog.contenido_html || blog.contenidoHtml || blog.resumen || '';
  }


  if (elFecha && blog.fecha_publicacion) {
    var fechaObj = new Date(blog.fecha_publicacion);
    if (!isNaN(fechaObj)) {
      elFecha.textContent = 'Publicado el ' + fechaObj.toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
}