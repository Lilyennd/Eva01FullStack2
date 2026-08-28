import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [regiones] = await pool.query('SELECT id_region, nombre_region FROM regiones ORDER BY nombre_region ASC');

    return NextResponse.json(regiones, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error al obtener regiones:', error);
    return NextResponse.json({ error: 'Error al consultar regiones' }, { status: 500 });
  }
}