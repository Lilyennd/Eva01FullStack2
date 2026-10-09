import { NextResponse } from 'next/server';
import pool from '@/lib/db';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  try {
    const [categorias] = await pool.query(
      'SELECT id_categoria, nombre_categoria FROM categorias ORDER BY nombre_categoria ASC'
    );

    return NextResponse.json(categorias, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('Error al obtener categorias:', error);
    return NextResponse.json(
      { error: 'Error al consultar categorias' },
      { status: 500, headers: corsHeaders }
    );
  }
}


export async function POST(request) {
  try {
    const body = await request.json();
    const nombre = (body.nombre_categoria || '').trim(); 

    if (!nombre) {
      return NextResponse.json(
        { error: 'El nombre de la categoría es obligatorio' },
        { status: 400, headers: corsHeaders }
      );
    }

    const [result] = await pool.query(
      'INSERT INTO categorias (nombre_categoria) VALUES (?)',
      [nombre]
    );

    return NextResponse.json(
      { message: 'Categoría creada correctamente', id_categoria: result.insertId },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error al crear categoría:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Ya existe una categoría con ese nombre' },
        { status: 409, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: 'Error al crear la categoría' },
      { status: 500, headers: corsHeaders }
    );
  }
}