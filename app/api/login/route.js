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

export async function POST(request) {
  try {
    const body = await request.json();
    const { correo, password } = body;

    if (!correo || !password) {
      return NextResponse.json(
        { error: 'Correo y contraseña son obligatorios' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (correo.length > 100) {
      return NextResponse.json(
        { error: 'El correo supera los 100 caracteres' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (password.length < 4 || password.length > 10) {
      return NextResponse.json(
        { error: 'La contraseña debe tener entre 4 y 10 caracteres' },
        { status: 400, headers: corsHeaders }
      );
    }

    const [rows] = await pool.query(
      `SELECT u.id_usuario, u.nombre, u.apellidos, u.correo, u.id_rol, r.nombre_rol
       FROM usuarios u
       JOIN roles r ON u.id_rol = r.id_rol
       WHERE u.correo = ? AND u.password = ?`,
      [correo, password]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Correo o contraseña incorrectos' },
        { status: 401, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { message: 'Login exitoso', usuario: rows[0] },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500, headers: corsHeaders }
    );
  }
}