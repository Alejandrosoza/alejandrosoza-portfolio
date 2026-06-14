import {
  createPublicSupabaseClient,
  requireAuthenticatedSupabaseClient,
} from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createPublicSupabaseClient();
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
    const { supabase, user } = await requireAuthenticatedSupabaseClient();
    if (!supabase || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { data, error } = await supabase.from("films").insert(body).select().single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create film" }, { status: 500 });
  }
}
