document.addEventListener('DOMContentLoaded', () => {
  const listaRegion = document.getElementById('listaRegion');
  const btnRegion = document.getElementById('btnRegion');
  const inputRegion = document.getElementById('regionSeleccionada');

  const listaComuna = document.getElementById('listaComuna');
  const btnComuna = document.getElementById('btnComuna');
  const inputComuna = document.getElementById('comunaSeleccionada');

  const form = document.getElementById('formRegistroUsuario');
  const correoInput = document.getElementById('correo');
  const errorCorreo = document.getElementById('error-correo');
  const runInput = document.getElementById('run');
  const errorRun = document.getElementById('error-run');


  function determinarRol(correo) {
    correo = correo.trim().toLowerCase();
    if (correo.endsWith('@profesor.duoc.cl')) return 1; 
    if (correo.endsWith('@duocuc.cl')) return 1;         
    if (correo.endsWith('@gmail.com')) return 3;        
    return null;
  }

  function validarRun(run) {
    const patron = /^[0-9]{6,8}[0-9kK]$/;
    return patron.test(run.trim());
  }

  async function cargarRegiones() {
    try {
      const res = await fetch('http://localhost:3000/api/regiones');
      const regiones = await res.json();

      listaRegion.innerHTML = '';
      regiones.forEach(region => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.className = 'dropdown-item';
        a.href = 'javascript:void(0);';
        a.textContent = region.nombre_region;

        a.addEventListener('click', (e) => {
          e.preventDefault();
          btnRegion.textContent = region.nombre_region;
          inputRegion.value = region.id_region; 

          btnComuna.disabled = false;
          btnComuna.textContent = 'Seleccionar Comuna';
          inputComuna.value = '';
          cargarComunas(region.id_region);
        });

        li.appendChild(a);
        listaRegion.appendChild(li);
      });
    } catch (error) {
      console.error('Error cargando regiones:', error);
    }
  }

  async function cargarComunas(regionId) {
    try {
      const res = await fetch(`http://localhost:3000/api/comunas?regionId=${regionId}`);
      const comunas = await res.json();

      listaComuna.innerHTML = '';
      comunas.forEach(comuna => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.className = 'dropdown-item';
        a.href = 'javascript:void(0);';
        a.textContent = comuna.nombre_comuna;

        a.addEventListener('click', (e) => {
          e.preventDefault();
          btnComuna.textContent = comuna.nombre_comuna;
          inputComuna.value = comuna.id_comuna; 
        });

        li.appendChild(a);
        listaComuna.appendChild(li);
      });
    } catch (error) {
      console.error('Error cargando comunas:', error);
    }
  }

  cargarRegiones();

  correoInput.addEventListener('blur', () => {
    const rol = determinarRol(correoInput.value);
    if (rol === null) {
      errorCorreo.textContent = 'Solo se permiten correos @gmail.com , @duocuc.cl  o @profesor.duoc.cl .';
      errorCorreo.classList.add('text-danger');
    } else {
      errorCorreo.textContent = '';
      errorCorreo.classList.remove('text-danger');
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const run = runInput.value.trim();
    const correo = correoInput.value.trim();

    if (!validarRun(run)) {
      errorRun.textContent = 'RUN inválido. Debe tener entre 7 y 9 caracteres, sin puntos ni guion.';
      runInput.classList.add('is-invalid');
      return;
    }
    runInput.classList.remove('is-invalid');

    const rol = determinarRol(correo);
    if (rol === null) {
      errorCorreo.textContent = 'Correo no permitido. Usa @gmail.com, @duocuc.cl o @profesor.duoc.cl.';
      errorCorreo.classList.add('text-danger');
      return;
    }

    if (!inputRegion.value || !inputComuna.value) {
      alert('Selecciona región y comuna.');
      return;
    }

    const usuario = {
      run: run,
      nombre: document.getElementById('nombre').value.trim(),
      apellidos: document.getElementById('apellidos').value.trim(),
      correo: correo,
      password: document.getElementById('password').value,
      telefono: document.getElementById('telefono').value.trim() || null,
      id_rol: rol,
      id_region: Number(inputRegion.value),
      id_comuna: Number(inputComuna.value),
      direccion: document.getElementById('direccion').value.trim()
    };

    try {
      const respuesta = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
      });

      const data = await respuesta.json();

      if (respuesta.ok) {
        alert('¡Usuario registrado con éxito!');
        form.reset();
        btnRegion.textContent = 'Seleccionar Región';
        btnComuna.textContent = 'Selecciona una región primero';
        btnComuna.disabled = true;
      } else {
        alert(data.error || 'Error al registrar');
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('No se pudo conectar con el servidor.');
    }
  });
});