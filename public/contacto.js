const formContact = document.getElementById('formContact');

formContact.addEventListener('submit', function (evento) {

  evento.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const correo = document.getElementById('correo').value;
  const comentario = document.getElementById('comentario').value;

  fetch('/api/contacto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: nombre, correo: correo, comentario: comentario })
  })
    .then(function (respuesta) {
      return respuesta.json();
    })
    .then(function (datos) {
      alert('¡Gracias! Tu mensaje fue enviado.');
      formContact.reset();
    })
    .catch(function (error) {
      console.log('Error al enviar el contacto:', error);
      alert('Hubo un problema al enviar tu mensaje. Intenta de nuevo.');
    });

});