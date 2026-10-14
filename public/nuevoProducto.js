document.addEventListener('DOMContentLoaded', async () => {


    async function cargarCategorias() {
        try {
            const res = await fetch('/api/categorias');
            const categorias = await res.json();
            const selectCategoria = document.getElementById('id_categoria');
            
            categorias.forEach(categoria => {
                const opcion = document.createElement('option');
                opcion.value = categoria.id_categoria;
                opcion.textContent = categoria.nombre_categoria;
                selectCategoria.appendChild(opcion);
            });
        } catch (error) {
            console.log("Error al cargar categorías");
        }
    }

    async function cargarImagenes() {
        try {
            const res = await fetch('/api/imagenes-productos');
            const imagenes = await res.json();
            const selectImagen = document.getElementById('imagen_principal');
            
            imagenes.forEach(img => {
                const opcion = document.createElement('option');
                opcion.value = img;
                opcion.textContent = img;
                selectImagen.appendChild(opcion);
            });
        } catch (error) {
            console.log("Error al cargar imágenes");
        }
    }

    cargarCategorias();
    cargarImagenes();

    document.getElementById('descripcion').addEventListener('input', function() {
        document.getElementById('contadorDescripcion').textContent = this.value.length;
    });


    document.getElementById('formProducto').addEventListener('submit', async function(evento) {
        evento.preventDefault(); 


        const codigo = document.getElementById('codigo_producto').value.trim();
        const nombre = document.getElementById('nombre').value.trim();
        const precio = document.getElementById('precio').value;
        const stock = document.getElementById('stock').value;
        const categoria = document.getElementById('id_categoria').value;

    
        if (codigo === "" || codigo.length < 3) {
            alert("El código del producto es obligatorio y debe tener al menos 3 letras/números.");
            return; 
        }

        if (nombre === "") {
            alert("El nombre del producto es obligatorio.");
            return;
        }

        if (precio === "" || Number(precio) < 0) {
            alert("El precio debe ser un número igual o mayor a cero.");
            return;
        }

        if (categoria === "") {
            alert("Debes seleccionar una categoría para el producto.");
            return;
        }

        if (stock === "" || Number(stock) < 0 || !Number.isInteger(Number(stock))) {
            alert("El stock debe ser un número entero (0, 1, 2...). No puede ser negativo.");
            return;
        }

        const nuevoProducto = {
            codigo_producto: codigo,
            nombre: nombre,
            descripcion: document.getElementById('descripcion').value.trim() || null,
            precio: Number(precio),
            stock: Number(stock),
            stock_critico: Number(document.getElementById('stock_critico').value) || 0,
            id_categoria: Number(categoria),
            origen: document.getElementById('origen').value.trim() || null,
            kilates: document.getElementById('kilates').value.trim() || null,
            corte: document.getElementById('corte').value.trim() || null,
            claridad: document.getElementById('claridad').value.trim() || null,
            color: document.getElementById('color').value.trim() || null,
            certificado: document.getElementById('certificado').value.trim() || null,
            peso_gramos: Number(document.getElementById('peso_gramos').value) || null,
            imagen_principal: document.getElementById('imagen_principal').value || null
        };

        try {

            const respuesta = await fetch('/api/productos', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoProducto) 
            });

            if (respuesta.ok) {
                alert("¡Producto creado con éxito!");
                window.location.href = 'inventario.html'; 
            } else {

                const datosError = await respuesta.json();
                alert("Error al crear: " + (datosError.error || "Problema en el servidor"));
            }

        } catch (error) {
            alert("Error de red: No se pudo conectar con el servidor.");
        }
    });

});