import { createAdminSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .order("order_index", { ascending: true });
    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createAdminSupabaseClient();
    const body = await request.json();
    const { data, error } = await supabase
      .from("photos")
      .insert(body)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create photo" }, { status: 500 });
  }
}
