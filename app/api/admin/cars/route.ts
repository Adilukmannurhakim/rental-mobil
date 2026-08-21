import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Get All Cars
export async function GET() {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .order('name', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// Update Car Status
export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, status } = body;

  const { data, error } = await supabase
    .from('cars')
    .update({ status })
    .eq('id', id)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}