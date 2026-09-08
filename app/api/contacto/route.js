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
    const { nombre, correo, comentario } = body;

    if (!nombre || !comentario) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: nombre y comentario' },
        { status: 400, headers: corsHeaders }
      );
    }

    const [result] = await pool.query(
      `INSERT INTO contactos (nombre, correo, comentario) VALUES (?, ?, ?)`,
      [nombre, correo || null, comentario]
    );

    return NextResponse.json(
      { message: 'Mensaje enviado correctamente', id_contacto: result.insertId },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error al guardar contacto:', error);
    return NextResponse.json(
      { error: 'Error al enviar el mensaje' },
      { status: 500, headers: corsHeaders }
    );
  }
}