import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Get All Bookings with Car Details
export async function GET() {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      cars (
        name,
        type,
        price_per_day
      )
    `)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// Update Booking Status
export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, status } = body;

  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}