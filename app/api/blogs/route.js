import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(
      `SELECT id_blog, titulo, descripcion_corta, imagen, fecha_publicacion
       FROM blogs
       WHERE activo = 1
       ORDER BY fecha_publicacion DESC`
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error al listar blogs:', error);
    return NextResponse.json({ error: 'Error al obtener los blogs' }, { status: 500 });
  }
}