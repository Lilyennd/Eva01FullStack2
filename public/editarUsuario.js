document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('formEditarUsuario');
    const idInput = document.getElementById('id_usuario');
    const runInput = document.getElementById('run');
    const nombreInput = document.getElementById('nombre');
    const apellidosInput = document.getElementById('apellidos');
    const correoInput = document.getElementById('correo');
    const parametrosURL = new URLSearchParams(window.location.search);
    const idUsuario = parametrosURL.get('id');

    if (!idUsuario) {
        alert("No se especificó un usuario para editar.");
        window.location.href = 'listarUsuarios.html';
        return;
    }

    fetch(`/api/usuarios/${idUsuario}`)
        .then(function (respuesta) {
            if (!respuesta.ok) {
                throw new Error("No se pudo encontrar el usuario.");
            }
            return respuesta.json();
        })
        .then(function (usuario) {

            if (idInput) idInput.value = usuario.id_usuario;
            runInput.value = usuario.run;
            nombreInput.value = usuario.nombre;
            apellidosInput.value = usuario.apellidos;
            correoInput.value = usuario.correo;
        })
        .catch(function (error) {
            console.log('Error al cargar:', error);
            alert("No se pudieron cargar los datos del usuario.");
            window.location.href = 'listarUsuarios.html';
        });


    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const correo = correoInput.value.trim();
        const rol = (correo.endsWith('@profesor.duoc.cl') || correo.endsWith('@duocuc.cl')) ? 1 : 2;

        const datos = {
            run: runInput.value.trim(),
            nombre: nombreInput.value.trim(),
            apellidos: apellidosInput.value.trim(),
            correo: correo,
            id_rol: rol
        };

        fetch(`/api/usuarios/${idUsuario}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        })
        .then(function (respuesta) {
            if (respuesta.ok) {
                alert("¡Usuario actualizado con éxito!");
                window.location.href = 'listarUsuarios.html';
            } else {
                return respuesta.json().then(function (data) {
                    alert(data.error || "No se pudo actualizar el usuario.");
                });
            }
        })
        .catch(function (error) {
            console.log('Error de red:', error);
            alert("Error al conectar con el servidor.");
        });
    });

});