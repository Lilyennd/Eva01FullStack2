document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formProducto');
  const mensajeProducto = document.getElementById('mensajeProducto');

  const codigoInput = document.getElementById('codigo_producto');
  const nombreInput = document.getElementById('nombre');
  const descripcionInput = document.getElementById('descripcion');
  const contadorDescripcion = document.getElementById('contadorDescripcion');
  const precioInput = document.getElementById('precio');
  const stockInput = document.getElementById('stock');
  const stockCriticoInput = document.getElementById('stock_critico');
  const categoriaSelect = document.getElementById('id_categoria');
  const imagenSelect = document.getElementById('imagen_principal');

  cargarCategorias();
  cargarImagenes();

  descripcionInput.addEventListener('input', () => {
    contadorDescripcion.textContent = descripcionInput.value.length;
  });


  function validarCodigo() {
    const valor = codigoInput.value.trim();
    if (!valor) {
      marcarError(codigoInput, 'error-codigo_producto', 'El código del producto es obligatorio.');
      return false;
    }
    if (valor.length < 3) {
      marcarError(codigoInput, 'error-codigo_producto', 'El código debe tener al menos 3 caracteres.');
      return false;
    }
    marcarValido(codigoInput, 'error-codigo_producto');
    return true;
  }

  function validarNombre() {
    const valor = nombreInput.value.trim();
    if (!valor) {
      marcarError(nombreInput, 'error-nombre', 'El nombre es obligatorio.');
      return false;
    }
    if (valor.length > 100) {
      marcarError(nombreInput, 'error-nombre', 'El nombre no puede superar los 100 caracteres.');
      return false;
    }
    marcarValido(nombreInput, 'error-nombre');
    return true;
  }

  function validarDescripcion() {
    if (descripcionInput.value.length > 500) {
      marcarError(descripcionInput, 'error-descripcion', 'La descripción no puede superar los 500 caracteres.');
      return false;
    }
    marcarValido(descripcionInput, 'error-descripcion');
    return true;
  }

  function validarPrecio() {
    const valor = precioInput.value;
    const errorSpan = document.getElementById('error-precio');
    if (valor === '' || valor === null) {
      errorSpan.textContent = 'El precio es obligatorio.';
      errorSpan.classList.add('text-danger');
      return false;
    }
    if (Number(valor) < 0) {
      errorSpan.textContent = 'El precio no puede ser negativo (mínimo 0 para productos gratuitos).';
      errorSpan.classList.add('text-danger');
      return false;
    }
    errorSpan.textContent = '';
    errorSpan.classList.remove('text-danger');
    return true;
  }

  function validarStock() {
    const valor = stockInput.value;
    const errorSpan = document.getElementById('error-stock');
    if (valor === '' || valor === null) {
      errorSpan.textContent = 'El stock es obligatorio.';
      errorSpan.classList.add('text-danger');
      return false;
    }
    if (!Number.isInteger(Number(valor)) || Number(valor) < 0) {
      errorSpan.textContent = 'El stock debe ser un número entero mayor o igual a 0.';
      errorSpan.classList.add('text-danger');
      return false;
    }
    errorSpan.textContent = '';
    errorSpan.classList.remove('text-danger');
    return true;
  }

  function validarStockCritico() {
    const valor = stockCriticoInput.value;
    const errorSpan = document.getElementById('error-stock_critico');
    if (valor === '') {
      errorSpan.textContent = '';
      errorSpan.classList.remove('text-danger');
      return true;
    }
    if (!Number.isInteger(Number(valor)) || Number(valor) < 0) {
      errorSpan.textContent = 'El stock crítico debe ser un número entero mayor o igual a 0.';
      errorSpan.classList.add('text-danger');
      return false;
    }
    errorSpan.textContent = '';
    errorSpan.classList.remove('text-danger');
    return true;
  }

  function validarCategoria() {
    if (!categoriaSelect.value) {
      marcarError(categoriaSelect, 'error-id_categoria', 'Selecciona una categoría.');
      return false;
    }
    marcarValido(categoriaSelect, 'error-id_categoria');
    return true;
  }

  function marcarError(input, idError, texto) {
    input.classList.add('is-invalid');
    document.getElementById(idError).textContent = texto;
  }

  function marcarValido(input, idError) {
    input.classList.remove('is-invalid');
    document.getElementById(idError).textContent = '';
  }

  codigoInput.addEventListener('blur', validarCodigo);
  nombreInput.addEventListener('blur', validarNombre);
  descripcionInput.addEventListener('blur', validarDescripcion);
  precioInput.addEventListener('input', validarPrecio);
  stockInput.addEventListener('input', validarStock);
  stockCriticoInput.addEventListener('input', validarStockCritico);
  categoriaSelect.addEventListener('change', validarCategoria);

  async function cargarCategorias() {
    try {
      const res = await fetch('/api/categorias');
      const categorias = await res.json();

      categorias.forEach((categoria) => {
        const option = document.createElement('option');
        option.value = categoria.id_categoria;
        option.textContent = categoria.nombre_categoria;
        categoriaSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error cargando categorías:', error);
      mostrarMensaje('No se pudieron cargar las categorías.', 'danger');
    }
  }

  async function cargarImagenes() {
    try {
      const res = await fetch('/api/imagenes-productos');
      const imagenes = await res.json();

      imagenes.forEach((nombreArchivo) => {
        const option = document.createElement('option');
        option.value = nombreArchivo;
        option.textContent = nombreArchivo;
        imagenSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error cargando imágenes:', error);
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const esValido = [
      validarCodigo(),
      validarNombre(),
      validarDescripcion(),
      validarPrecio(),
      validarStock(),
      validarStockCritico(),
      validarCategoria()
    ].every(Boolean);

    if (!esValido) {
      mostrarMensaje('Revisa los campos marcados en rojo.', 'danger');
      return;
    }

    const producto = {
      codigo_producto: codigoInput.value.trim(),
      nombre: nombreInput.value.trim(),
      descripcion: descripcionInput.value.trim() || null,
      precio: Number(precioInput.value),
      stock: Number(stockInput.value),
      stock_critico: stockCriticoInput.value !== '' ? Number(stockCriticoInput.value) : null,
      id_categoria: Number(categoriaSelect.value),
      origen: document.getElementById('origen').value.trim() || null,
      kilates: document.getElementById('kilates').value.trim() || null,
      corte: document.getElementById('corte').value.trim() || null,
      claridad: document.getElementById('claridad').value.trim() || null,
      color: document.getElementById('color').value.trim() || null,
      certificado: document.getElementById('certificado').value.trim() || null,
      peso_gramos: document.getElementById('peso_gramos').value !== '' ? Number(document.getElementById('peso_gramos').value) : null,
      imagen_principal: document.getElementById('imagen_principal').value || null
    };

    try {
      const respuesta = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        mostrarMensaje(data.error || 'No se pudo crear el producto.', 'danger');
        return;
      }

      mostrarMensaje('¡Producto creado con éxito! Redirigiendo al inventario...', 'success');
      setTimeout(() => {
        window.location.href = 'inventario.html';
      }, 1200);

    } catch (error) {
      console.error('Error de red:', error);
      mostrarMensaje('No se pudo conectar con el servidor.', 'danger');
    }
  });

  function mostrarMensaje(texto, tipo) {
    mensajeProducto.innerHTML = `<div class="alert alert-${tipo}">${texto}</div>`;
  }
});