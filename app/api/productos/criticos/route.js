import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM v_productos_criticos');
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error al listar productos críticos:', error);
    return NextResponse.json({ error: 'Error al obtener los productos críticos' }, { status: 500 });
  }
}