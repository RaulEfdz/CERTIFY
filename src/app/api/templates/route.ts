// import { auth } from '@/app/api/auth/[...nextauth]/route'; // Corregido: 'auth' no exportado. Implementar lógica de autenticación aquí si es necesario."
import { NextResponse } from "next/server"
import { supabase } from '@/lib/supabase/client'

export async function GET() {
  // TODO: Implementar autenticación si es necesario

  // Si necesitas filtrar por usuario, agrega la lógica aquí
  const { data, error } = await supabase
    .from('templates')
    .select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  // TODO: Implementar autenticación si es necesario

  const { name, content } = await req.json();

  const { data, error } = await supabase
    .from('templates')
    .insert([{ name, content }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
