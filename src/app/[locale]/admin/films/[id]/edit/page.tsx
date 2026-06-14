import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import FilmForm from "@/components/admin/FilmForm";
import type { Film } from "@/lib/types";

export default async function AdminEditFilmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: film } = await supabase.from("films").select("*").eq("id", id).single();

  if (!film) notFound();

  return <FilmForm initialData={film as Film} filmId={id} />;
}
