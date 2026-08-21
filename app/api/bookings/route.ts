import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const body = await request.json();
  const { car_id, customer_name, customer_phone, start_date, end_date, total_price } = body;

  const { data, error } = await supabase
    .from('bookings')
    .insert([{ car_id, customer_name, customer_phone, start_date, end_date, total_price }])
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}