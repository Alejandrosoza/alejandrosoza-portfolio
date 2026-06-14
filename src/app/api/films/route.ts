import { createAdminSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("films")
      .select("*")
      .order("order_index", { ascending: true });
    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch films" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createAdminSupabaseClient();
    const body = await request.json();
    const { data, error } = await supabase
      .from("films")
      .insert(body)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create film" }, { status: 500 });
  }
}
