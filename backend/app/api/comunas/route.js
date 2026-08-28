import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const regionId = searchParams.get('regionId');

    let query = 'SELECT id_comuna, nombre_comuna, id_region FROM comunas';
    let params = [];

    if (regionId) {
      query += ' WHERE id_region = ?';
      params.push(regionId);
    }

    query += ' ORDER BY nombre_comuna ASC';

    const [comunas] = await pool.query(query, params);

    return NextResponse.json(comunas, { 
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error al obtener comunas:', error);
    return NextResponse.json({ error: 'Error al consultar comunas' }, { status: 500 });
  }
}