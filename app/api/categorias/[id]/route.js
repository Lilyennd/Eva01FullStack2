import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET /api/categorias/3 -> devuelve una categoría
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const [categorias] = await pool.query(
      'SELECT id_categoria, nombre_categoria FROM categorias WHERE id_categoria = ?',
      [id]
    );

    if (categorias.length === 0) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    return NextResponse.json(categorias[0], { status: 200 });
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    return NextResponse.json({ error: 'Error al obtener la categoría' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const nombre = (body.nombre_categoria || '').trim();

    if (!nombre) {
      return NextResponse.json(
        { error: 'El nombre de la categoría es obligatorio' },
        { status: 400 }
      );
    }

    const [resultado] = await pool.query(
      'UPDATE categorias SET nombre_categoria = ? WHERE id_categoria = ?',
      [nombre, id]
    );

    if (resultado.affectedRows === 0) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Categoría actualizada correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Ya existe una categoría con ese nombre' },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: 'Error al actualizar la categoría' }, { status: 500 });
  }
}