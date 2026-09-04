import { NextResponse } from 'next/server';
import pool from '@/lib/db';


export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { run, nombre, apellidos, correo, id_rol } = body;

    const [result] = await pool.query(
      `UPDATE usuarios SET run = ?, nombre = ?, apellidos = ?, correo = ?, id_rol = ? WHERE id_usuario = ?`,
      [run, nombre, apellidos, correo, id_rol, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Usuario actualizado correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return NextResponse.json({ error: 'Error al actualizar el usuario' }, { status: 500 });
  }
}