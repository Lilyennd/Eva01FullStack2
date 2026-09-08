document.addEventListener('DOMContentLoaded', async () => {


    let listaProductos = []
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

    try {
        const respuesta = await fetch('/api/productos');
        listaProductos = await respuesta.json();

        const selectProducto = document.getElementById('select_producto');
        
        listaProductos.forEach(producto => {
            const opcion = document.createElement('option');
            opcion.value = producto.id_producto;
            opcion.textContent = producto.codigo_producto + " - " + producto.nombre;
            selectProducto.appendChild(opcion);
        });

    } catch (error) {
        alert("Error al cargar los productos desde la base de datos.");
    }

    document.getElementById('select_producto').addEventListener('change', function() {
        const idSeleccionada = this.value;
        
        const productoElegido = listaProductos.find(p => p.id_producto == idSeleccionada);
        
        if (productoElegido) {
  
            document.getElementById('codigo_producto').value = productoElegido.codigo_producto; 
            document.getElementById('nombre').value = productoElegido.nombre;
            document.getElementById('descripcion').value = productoElegido.descripcion || '';
            document.getElementById('precio').value = productoElegido.precio;
            document.getElementById('stock').value = productoElegido.stock;
            document.getElementById('stock_critico').value = productoElegido.stock_critico || 0;
            document.getElementById('id_categoria').value = productoElegido.id_categoria;
            document.getElementById('imagen_principal').value = productoElegido.imagen_principal || '';
            document.getElementById('origen').value = productoElegido.origen || '';
            document.getElementById('kilates').value = productoElegido.kilates || '';
            document.getElementById('corte').value = productoElegido.corte || '';
            document.getElementById('claridad').value = productoElegido.claridad || '';
            document.getElementById('color').value = productoElegido.color || '';
            document.getElementById('certificado').value = productoElegido.certificado || '';
            document.getElementById('peso_gramos').value = productoElegido.peso_gramos || '';
        }
    });
    document.getElementById('formProducto').addEventListener('submit', async function(evento) {
        evento.preventDefault(); 

        const id = document.getElementById('select_producto').value;
        
        if (id === "") {
            alert("Por favor, selecciona un producto primero.");
            return; 
        }
        const paqueteDatos = {
            nombre: document.getElementById('nombre').value,
            descripcion: document.getElementById('descripcion').value || null,
            precio: Number(document.getElementById('precio').value),
            stock: Number(document.getElementById('stock').value),
            stock_critico: Number(document.getElementById('stock_critico').value),
            id_categoria: Number(document.getElementById('id_categoria').value),
            origen: document.getElementById('origen').value || null,
            kilates: document.getElementById('kilates').value || null,
            corte: document.getElementById('corte').value || null,
            claridad: document.getElementById('claridad').value || null,
            color: document.getElementById('color').value || null,
            certificado: document.getElementById('certificado').value || null,
            peso_gramos: Number(document.getElementById('peso_gramos').value) || null,
            imagen_principal: document.getElementById('imagen_principal').value || null
        };
        try {
            const respuesta = await fetch('/api/productos/' + id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paqueteDatos) 
            });

            if (respuesta.ok) {
                alert("El producto se actualizó correctamente");
                window.location.href = 'inventario.html'; 
            } else {
                alert("Hubo un problema al guardar en la base de datos.");
            }
        } catch (error) {
            alert("Error de conexión con el servidor.");
        }
    });

    document.getElementById('descripcion').addEventListener('input', function() {
        document.getElementById('contadorDescripcion').textContent = this.value.length;
    });

});