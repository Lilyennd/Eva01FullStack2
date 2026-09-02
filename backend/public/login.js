
console.log("¡El archivo JS está conectado!");
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formLogin');
  const correoInput = document.getElementById('correo');
  const passwordInput = document.getElementById('password');
  const errorCorreo = document.getElementById('error-correo');
  const errorPassword = document.getElementById('error-password');

  // dominios permitidos en el sistema
  function correoValido(correo) {
    correo = correo.trim().toLowerCase();
    return correo.endsWith('@profesor.duoc.cl') ||
           correo.endsWith('@duocuc.cl') ||
           correo.endsWith('@gmail.com');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("1. El botón fue presionado y preventDefault se ejecutó");
    errorCorreo.textContent = '';
    errorPassword.textContent = '';

    const correo = correoInput.value.trim();
    const password = passwordInput.value;

    if (!correoValido(correo)) {
      errorCorreo.textContent = 'Correo no permitido. Usa @gmail.com, @duocuc.cl o @profesor.duoc.cl.';
      return;
    }

    if (password.length < 4 || password.length > 10) {
      errorPassword.textContent = 'La contraseña debe tener entre 4 y 10 caracteres.';
      return;
    }

    try {
        console.log("2. Enviando datos a la API...");
      const respuesta = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password })
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        console.log("3. El backend respondió con error:", data.error);
        errorPassword.textContent = data.error || 'No se pudo iniciar sesión';
        return;
      }
      console.log("4. ¡Login exitoso!", data.usuario);
      localStorage.setItem('usuarioActual', JSON.stringify(data.usuario));

     
      if (data.usuario.id_rol === 1 || data.usuario.id_rol === 2) {
        window.location.href = 'homeAdministrador.html'; 
      } else {
        window.location.href = 'home.html'; 
      }

    } catch (error) {
      console.error('Error de red:', error);
      errorPassword.textContent = 'No se pudo conectar con el servidor.';
    }
  });
});