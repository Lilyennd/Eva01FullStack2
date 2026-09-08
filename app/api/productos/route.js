import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.nombre_categoria
       FROM productos p
       JOIN categorias c ON p.id_categoria = c.id_categoria
       WHERE p.activo = TRUE`
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error al listar productos:', error);
    return NextResponse.json(
      { error: 'Error al obtener los productos' },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      codigo_producto, nombre, descripcion, precio, stock, stock_critico,
      id_categoria, origen, kilates, corte, claridad, color, certificado,
      peso_gramos, imagen_principal
    } = body;

    if (!codigo_producto || !nombre || precio === undefined || !id_categoria) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: codigo_producto, nombre, precio, id_categoria' },
        { status: 400 }
      );
    }

    if (precio < 0) {
      return NextResponse.json(
        { error: 'El precio no puede ser negativo' },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      `INSERT INTO productos
       (codigo_producto, nombre, descripcion, precio, stock, stock_critico, id_categoria, origen, kilates, corte, claridad, color, certificado, peso_gramos, imagen_principal)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [codigo_producto, nombre, descripcion, precio, stock || 0, stock_critico || 0,
       id_categoria, origen, kilates, corte, claridad, color, certificado, peso_gramos, imagen_principal]
    );

    return NextResponse.json(
      { message: 'Producto creado correctamente', id_producto: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear producto:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Ya existe un producto con ese código' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Error al crear el producto' },
      { status: 500 }
    );
  }
}