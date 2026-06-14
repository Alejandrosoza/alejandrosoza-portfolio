import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env.local");
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  }
}

function dedupeStringArray(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  const result = [];
  for (const item of value) {
    const trimmed = String(item).trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    result.push(trimmed);
  }
  return result;
}

async function isUrlReachable(url) {
  try {
    const response = await fetch(url, { method: "GET", signal: AbortSignal.timeout(8000) });
    return response.ok;
  } catch {
    return false;
  }
}

async function filterReachableUrls(urls) {
  const checks = await Promise.all(
    urls.map(async (url) => ((await isUrlReachable(url)) ? url : null))
  );
  return checks.filter((url) => url !== null);
}

async function main() {
  loadEnv();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase.from("site_config").select("*").single();
  if (error || !data) {
    console.error("Failed to read site_config:", error?.message ?? "not found");
    process.exit(1);
  }

  const theatreBefore = dedupeStringArray(data.theatre_photos);
  const sportsBefore = dedupeStringArray(data.sports_photos);
  const theatreAfter = await filterReachableUrls(theatreBefore);
  const sportsAfter = await filterReachableUrls(sportsBefore);

  console.log("Before:", { theatre: theatreBefore, sports: sportsBefore });
  console.log("After:", { theatre: theatreAfter, sports: sportsAfter });

  const { error: updateError } = await supabase
    .from("site_config")
    .update({
      theatre_photos: theatreAfter,
      sports_photos: sportsAfter,
      theatre_youtube_ids: dedupeStringArray(data.theatre_youtube_ids),
      sports_youtube_ids: dedupeStringArray(data.sports_youtube_ids),
    })
    .eq("id", data.id);

  if (updateError) {
    console.error("Failed to update site_config:", updateError.message);
    process.exit(1);
  }

  console.log("Gallery cleanup saved successfully.");
}

main();
