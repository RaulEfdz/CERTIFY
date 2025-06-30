// src/app/api/templates/[id]/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from '@/lib/supabase/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('id', id)
    .eq('userId', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // Not found
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}


export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { name, content } = await req.json();

  const { data, error } = await supabase
    .from('templates')
    .update({ name, content })
    .eq('id', id)
    .eq('userId', user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { error } = await supabase
    .from('templates')
    .delete()
    .eq('id', id)
    .eq('userId', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return new Response(null, { status: 204 });
}
