document.addEventListener('DOMContentLoaded', () => {


    const cuerpoTabla = document.getElementById('cuerpoTablaUsuarios');
    fetch('/api/usuarios')
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (usuarios) {
            cuerpoTabla.innerHTML = ''; 

            if (usuarios.length === 0) {
                cuerpoTabla.innerHTML = '<tr><td colspan="5" class="text-center">No hay usuarios registrados.</td></tr>';
                return;
            }
            usuarios.forEach(function (user) {

                let textoRol = "Comprador";
                let claseBadge = "bg-secondary";

                const correo = user.correo ? user.correo.toLowerCase() : "";

                if (correo.endsWith('@profesor.duoc.cl') || correo.endsWith('@duocuc.cl') || user.id_rol === 1) {
                    textoRol = "Administrador / Vendedor";
                    claseBadge = "bg-dark";
                }

                cuerpoTabla.innerHTML += `
                    <tr>
                        <td>${user.run}</td>
                        <td>${user.nombre}</td>
                        <td>${user.apellidos}</td>
                        <td>${user.correo}</td>
                        <td><span class="badge ${claseBadge}">${textoRol}</span></td>
                        <td>
                            <!-- Botón Editar que lleva el ID del usuario en la URL -->
                            <a href="editarUsuario.html?id=${user.id_usuario}" class="btn btn-warning btn-sm fw-bold">
                                Editar
                            </a>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(function (error) {
            console.log('Error al traer los usuarios:', error);
            cuerpoTabla.innerHTML = '<tr><td colspan="6" class="text-center text-danger">No se pudieron cargar los usuarios.</td></tr>';
        });

});