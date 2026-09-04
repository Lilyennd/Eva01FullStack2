const usuario = JSON.parse(localStorage.getItem('usuarioActual'));

if (usuario && (usuario.id_rol === 1 || usuario.id_rol === 2)) {
  document.getElementById('menuAdmin').style.display = 'flex';
} else {

  document.getElementById('menuComprador').style.display = 'flex';
}


if (usuario) {
  document.getElementById('btnCerrarSesion').style.display = 'inline-block';
}

document.getElementById('btnCerrarSesion').addEventListener('click', () => {
  localStorage.removeItem('usuarioActual'); 
  window.location.href = 'login.html';      
});