import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET /api/ordenes/12 -> la orden con sus productos (la boleta)
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const [ordenes] = await pool.query(
      `SELECT o.*, r.nombre_region, c.nombre_comuna
       FROM ordenes o
       LEFT JOIN regiones r ON o.id_region = r.id_region
       LEFT JOIN comunas c ON o.id_comuna = c.id_comuna
       WHERE o.id_orden = ?`,
      [id]
    );

    if (ordenes.length === 0) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
    }

    const [detalle] = await pool.query(
      `SELECT id_producto, nombre_producto, imagen_producto, precio_unitario, cantidad, subtotal
       FROM orden_detalle
       WHERE id_orden = ?`,
      [id]
    );

    const orden = ordenes[0];
    orden.detalle = detalle;

    return NextResponse.json(orden, { status: 200 });
  } catch (error) {
    console.error('Error al obtener orden:', error);
    return NextResponse.json({ error: 'Error al obtener la orden' }, { status: 500 });
  }
}

// PUT /api/ordenes/12 con { "estado": "Pagada" } o { "estado": "Pago fallido" }
// Si queda Pagada, se descuenta el stock
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const estado = body.estado;

    const [ordenes] = await pool.query('SELECT * FROM ordenes WHERE id_orden = ?', [id]);

    if (ordenes.length === 0) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
    }

    if (ordenes[0].estado === 'Pagada' && estado === 'Pagada') {
      return NextResponse.json({ error: 'La orden ya está pagada' }, { status: 409 });
    }

    // Si el pago fue correcto, descontamos el stock
    if (estado === 'Pagada') {
      const [detalle] = await pool.query('SELECT * FROM orden_detalle WHERE id_orden = ?', [id]);

      for (let i = 0; i < detalle.length; i++) {
        const [filas] = await pool.query(
          'SELECT stock FROM productos WHERE id_producto = ?',
          [detalle[i].id_producto]
        );

        if (filas[0].stock < detalle[i].cantidad) {
          return NextResponse.json(
            { error: 'Stock insuficiente para ' + detalle[i].nombre_producto },
            { status: 409 }
          );
        }
      }

      for (let i = 0; i < detalle.length; i++) {
        await pool.query(
          'UPDATE productos SET stock = stock - ? WHERE id_producto = ?',
          [detalle[i].cantidad, detalle[i].id_producto]
        );
      }
    }

    await pool.query('UPDATE ordenes SET estado = ? WHERE id_orden = ?', [estado, id]);

    return NextResponse.json({ message: 'Orden actualizada', estado: estado }, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar orden:', error);
    return NextResponse.json({ error: 'Error al actualizar la orden' }, { status: 500 });
  }
}