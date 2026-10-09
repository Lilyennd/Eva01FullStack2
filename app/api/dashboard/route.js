import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM v_dashboard');
    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('Error en dashboard:', error);
    return NextResponse.json({ error: 'Error al obtener el dashboard' }, { status: 500 });
  }
}