import { NextResponse } from 'next/server';
import pool from '@/lib/db';


export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const [rows] = await pool.query(
      `SELECT b.id_blog, b.titulo, b.descripcion_corta, b.imagen, b.fecha_publicacion,
              d.descripcion_larga
       FROM blogs b
       LEFT JOIN blog_detalle d ON d.id_blog = b.id_blog
       WHERE b.id_blog = ? AND b.activo = 1`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Blog no encontrado' }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('Error al obtener blog:', error);
    return NextResponse.json({ error: 'Error al obtener el blog' }, { status: 500 });
  }
}