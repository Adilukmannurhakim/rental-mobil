import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, type, price_per_day, capacity, image_url, status } = body;

    // Validasi input sederhana
    if (!name || !price_per_day || !image_url) {
      return NextResponse.json(
        { error: 'Nama, harga, dan URL gambar wajib diisi' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('cars')
      .insert([
        {
          name,
          type,
          price_per_day: Number(price_per_day),
          capacity: Number(capacity),
          image_url,
          status: status || 'available',
        },
      ])
      .select();

    if (error) {
      console.error('Supabase Error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    console.error('Server Error:', err.message);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}