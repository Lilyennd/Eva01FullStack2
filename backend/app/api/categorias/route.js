import { NextResponse } from 'next/server';
import pool from '@/lib/db';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
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