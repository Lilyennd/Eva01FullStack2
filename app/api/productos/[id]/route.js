import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const [rows] = await pool.query(
      `SELECT p.*, c.nombre_categoria
       FROM productos p
       JOIN categorias c ON c.id_categoria = p.id_categoria
       WHERE p.id_producto = ? AND p.activo = TRUE`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return NextResponse.json(
      { error: 'Error al obtener el producto' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      nombre, descripcion, precio, stock, stock_critico,
      id_categoria, origen, kilates, corte, claridad, color, certificado,
      peso_gramos, imagen_principal,
      en_oferta, precio_oferta // NUEVOS
    } = body;

    if (precio !== undefined && precio < 0) {
      return NextResponse.json(
        { error: 'El precio no puede ser negativo' },
        { status: 400 }
      );
    }


    if (en_oferta && (!precio_oferta || (precio !== undefined && Number(precio_oferta) >= Number(precio)))) {
      return NextResponse.json(
        { error: 'El precio de oferta debe existir y ser menor al precio normal' },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      `UPDATE productos SET
        nombre = ?, descripcion = ?, precio = ?, stock = ?, stock_critico = ?,
        id_categoria = ?, origen = ?, kilates = ?, corte = ?, claridad = ?,
        color = ?, certificado = ?, peso_gramos = ?, imagen_principal = ?
       WHERE id_producto = ?`,
      [nombre, descripcion, precio, stock, stock_critico, id_categoria,
       origen, kilates, corte, claridad, color, certificado, peso_gramos, imagen_principal, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    if (en_oferta !== undefined) {
      await pool.query(
        'UPDATE productos SET en_oferta = ?, precio_oferta = ? WHERE id_producto = ?',
        [en_oferta ? 1 : 0, en_oferta ? precio_oferta : null, id]
      );
    }

    return NextResponse.json(
      { message: 'Producto actualizado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el producto' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const [result] = await pool.query(
      'UPDATE productos SET activo = FALSE WHERE id_producto = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Producto eliminado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el producto' },
      { status: 500 }
    );
  }
}