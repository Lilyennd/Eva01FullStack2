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
    const [rows] = await pool.query(
      `SELECT u.id_usuario, u.run, u.nombre, u.apellidos, u.correo, u.telefono,
              u.direccion, u.fecha_registro, r.nombre_rol, reg.nombre_region, c.nombre_comuna
       FROM usuarios u
       JOIN roles r ON u.id_rol = r.id_rol
       LEFT JOIN regiones reg ON u.id_region = reg.id_region
       LEFT JOIN comunas c ON u.id_comuna = c.id_comuna`
    );
    return NextResponse.json(rows, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    return NextResponse.json(
      { error: 'Error al obtener los usuarios' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      run, nombre, apellidos, correo, password, telefono,
      id_rol, id_region, id_comuna, direccion
    } = body;

    if (!run || !nombre || !apellidos || !correo || !password || !direccion) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: run, nombre, apellidos, correo, password, direccion' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (run.length < 7 || run.length > 9) {
      return NextResponse.json(
        { error: 'El RUN debe tener entre 7 y 9 caracteres' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (nombre.length > 50) {
      return NextResponse.json({ error: 'El nombre supera los 50 caracteres' }, { status: 400, headers: corsHeaders });
    }

    if (apellidos.length > 100) {
      return NextResponse.json({ error: 'Los apellidos superan los 100 caracteres' }, { status: 400, headers: corsHeaders });
    }

    if (correo.length > 100) {
      return NextResponse.json({ error: 'El correo supera los 100 caracteres' }, { status: 400, headers: corsHeaders });
    }

    const dominiosValidos = {
      '@profesor.duoc.cl': 1,
      '@duocuc.cl': 2,
      '@gmail.com': 3
    };
    const dominioCorreo = Object.keys(dominiosValidos).find(d => correo.toLowerCase().endsWith(d));
    if (!dominioCorreo) {
      return NextResponse.json(
        { error: 'Correo no permitido. Usa @gmail.com, @duocuc.cl o @profesor.duoc.cl' },
        { status: 400, headers: corsHeaders }
      );
    }
    const rolCorrecto = dominiosValidos[dominioCorreo];

    const [result] = await pool.query(
      `INSERT INTO usuarios (run, nombre, apellidos, correo, password, telefono, id_rol, id_region, id_comuna, direccion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [run, nombre, apellidos, correo, password, telefono || null, rolCorrecto, id_region, id_comuna, direccion]
    );

    return NextResponse.json(
      { message: 'Usuario registrado correctamente', id_usuario: result.insertId },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error al registrar usuario:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Ya existe un usuario con ese RUN o correo' },
        { status: 409, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: 'Error al registrar el usuario' },
      { status: 500, headers: corsHeaders }
    );
  }
}