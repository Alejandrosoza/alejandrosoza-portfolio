import { createAdminSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createAdminSupabaseClient();
    const { data, error } = await supabase.from("site_config").select("*").single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch site config" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createAdminSupabaseClient();
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing site config id" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("site_config")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to update site config" }, { status: 500 });
  }
}
