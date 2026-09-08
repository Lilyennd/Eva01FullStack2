import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const cantidad = body.cantidad;

    if (!cantidad || cantidad <= 0) {
      return NextResponse.json(
        { error: 'La cantidad debe ser mayor a 0' },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      `UPDATE productos SET stock = stock - ? WHERE id_producto = ? AND stock >= ?`,
      [cantidad, id, cantidad]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Stock insuficiente o producto no encontrado' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Stock descontado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al descontar stock:', error);
    return NextResponse.json(
      { error: 'Error al descontar stock' },
      { status: 500 }
    );
  }
}