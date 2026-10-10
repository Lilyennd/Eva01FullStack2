const usuario = JSON.parse(localStorage.getItem('usuarioActual'));

const menuAdmin = document.getElementById('menuAdmin');
const menuComprador = document.getElementById('menuComprador');
const btnIniciarSesion = document.getElementById('btnIniciarSesion');
const btnCerrarSesion = document.getElementById('btnCerrarSesion');
const btnCarrito = document.getElementById('btnCarrito'); 

if (usuario) {
  if (btnIniciarSesion) btnIniciarSesion.style.display = 'none';
  if (btnCerrarSesion) btnCerrarSesion.style.display = 'inline-block';

  if (usuario.id_rol === 1 || usuario.id_rol === 2) {
    if (menuComprador) menuComprador.style.display = 'none';
    if (menuAdmin) menuAdmin.style.display = 'flex';
    if (btnCarrito) btnCarrito.style.display = 'none'; 
  } else {
    if (menuComprador) menuComprador.style.display = 'flex';
  }
} 

if (btnCerrarSesion) {
  btnCerrarSesion.addEventListener('click', () => {
    localStorage.removeItem('usuarioActual'); 
    window.location.href = 'home.html'; 
  });
}

// Enlaces nuevos de la tienda: Categorías y Ofertas (se agregan solos en todas las páginas)
if (menuComprador && !menuComprador.querySelector('a[href="categorias.html"]')) {
  const enlaces = [
    { href: 'categorias.html', texto: 'Categorías' },
    { href: 'ofertas.html', texto: 'Ofertas' }
  ];
  const linkProductos = menuComprador.querySelector('a[href="productos.html"]');
  let anterior = linkProductos ? linkProductos.parentElement : null;

  enlaces.forEach(function (enlace) {
    const li = document.createElement('li');
    li.className = 'nav-item';
    li.innerHTML = '<a class="nav-link" href="' + enlace.href + '">' + enlace.texto + '</a>';
    if (anterior) {
      anterior.after(li);
    } else {
      menuComprador.appendChild(li);
    }
    anterior = li;
  });
}
