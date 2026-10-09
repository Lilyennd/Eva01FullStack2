import { NextResponse } from 'next/server';
import pool from '@/lib/db';


export async function GET(request) {
  try {
    const url = new URL(request.url);
    const idUsuario = url.searchParams.get('id_usuario');

    let sql = 'SELECT * FROM v_ordenes_resumen';
    let valores = [];
    if (idUsuario) {
      sql = 'SELECT * FROM v_ordenes_resumen WHERE id_usuario = ?';
      valores = [idUsuario];
    }

    const [ordenes] = await pool.query(sql + ' ORDER BY id_orden DESC', valores);
    return NextResponse.json(ordenes, { status: 200 });
  } catch (error) {
    console.error('Error al listar órdenes:', error);
    return NextResponse.json({ error: 'Error al obtener las órdenes' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const items = body.items;

    // 1. Revisar que lleguen los datos obligatorios
    if (!body.nombre || !body.apellidos || !body.correo || !body.calle || !body.id_region || !body.id_comuna) {
      return NextResponse.json({ error: 'Faltan datos del cliente o de la dirección' }, { status: 400 });
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    let total = 0;
    const productos = [];

    for (let i = 0; i < items.length; i++) {
      const cantidad = Number(items[i].cantidad);

      if (!cantidad || cantidad <= 0) {
        return NextResponse.json({ error: 'Cantidad inválida' }, { status: 400 });
      }

      const [filas] = await pool.query(
        'SELECT * FROM productos WHERE id_producto = ? AND activo = TRUE',
        [items[i].id_producto]
      );

      if (filas.length === 0) {
        return NextResponse.json({ error: 'Un producto del carrito ya no existe' }, { status: 404 });
      }

      const producto = filas[0];

      if (producto.stock < cantidad) {
        return NextResponse.json({ error: 'Stock insuficiente para ' + producto.nombre }, { status: 409 });
      }

      let precio = Number(producto.precio);
      if (producto.en_oferta && producto.precio_oferta) {
        precio = Number(producto.precio_oferta);
      }

      total = total + precio * cantidad;

      productos.push({
        id_producto: producto.id_producto,
        nombre: producto.nombre,
        imagen: producto.imagen_principal,
        precio: precio,
        cantidad: cantidad,
      });
    }

    const numeroOrden = String(Date.now());

    let departamento = body.departamento;
    if (!departamento) departamento = null;

    let indicaciones = body.indicaciones;
    if (!indicaciones) indicaciones = null;

    let idUsuario = body.id_usuario;
    if (!idUsuario) idUsuario = null;

    let opcionEntrega = body.opcion_entrega;
    if (opcionEntrega !== 'Retiro en tienda') opcionEntrega = 'Despacho';

    const [resultado] = await pool.query(
      `INSERT INTO ordenes
       (numero_orden, id_usuario, nombre_cliente, apellidos_cliente, correo_cliente, calle, departamento,
        id_region, id_comuna, indicaciones, opcion_entrega, subtotal, total, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pendiente')`,
      [numeroOrden, idUsuario, body.nombre, body.apellidos, body.correo, body.calle,
       departamento, body.id_region, body.id_comuna, indicaciones, opcionEntrega, total, total]
    );

    const idOrden = resultado.insertId;

    for (let i = 0; i < productos.length; i++) {
      await pool.query(
        `INSERT INTO orden_detalle
         (id_orden, id_producto, nombre_producto, imagen_producto, cantidad, precio_unitario, subtotal)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [idOrden, productos[i].id_producto, productos[i].nombre, productos[i].imagen,
         productos[i].cantidad, productos[i].precio, productos[i].precio * productos[i].cantidad]
      );
    }

    return NextResponse.json(
      { message: 'Orden creada', id_orden: idOrden, numero_orden: numeroOrden, total: total },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear orden:', error);

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return NextResponse.json({ error: 'Región, comuna o usuario inválido' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Error al crear la orden' }, { status: 500 });
  }
}