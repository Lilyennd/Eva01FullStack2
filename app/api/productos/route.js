import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET ahora acepta filtros: /api/productos?categoria=2  y  /api/productos?oferta=1
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria'); // lee ?categoria=
    const oferta = searchParams.get('oferta');       // lee ?oferta=

    // Consulta base (la misma que tenías)
    let query = `SELECT p.*, c.nombre_categoria
                 FROM productos p
                 JOIN categorias c ON p.id_categoria = c.id_categoria
                 WHERE p.activo = TRUE`;
    const valores = []; // aquí se guardan los valores de los ?

    // Si viene ?categoria=2, agregamos ese filtro a la consulta
    if (categoria) {
      query += ' AND p.id_categoria = ?';
      valores.push(categoria);
    }

    // Si viene ?oferta=1, mostramos solo productos en oferta
    if (oferta === '1') {
      query += ' AND p.en_oferta = TRUE';
    }

    const [rows] = await pool.query(query, valores);
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
      peso_gramos, imagen_principal,
      en_oferta, precio_oferta // ← NUEVOS
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

    // NUEVO: si el producto está en oferta, el precio de oferta es obligatorio y menor al precio normal
    if (en_oferta && (!precio_oferta || Number(precio_oferta) >= Number(precio))) {
      return NextResponse.json(
        { error: 'El precio de oferta debe existir y ser menor al precio normal' },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      `INSERT INTO productos
       (codigo_producto, nombre, descripcion, precio, stock, stock_critico, id_categoria, origen, kilates, corte, claridad, color, certificado, peso_gramos, imagen_principal, en_oferta, precio_oferta)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [codigo_producto, nombre, descripcion, precio, stock || 0, stock_critico || 0,
       id_categoria, origen, kilates, corte, claridad, color, certificado, peso_gramos, imagen_principal,
       en_oferta ? 1 : 0,                  // true/false se guarda como 1/0
       en_oferta ? precio_oferta : null]   // si no está en oferta, no guarda precio de oferta
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