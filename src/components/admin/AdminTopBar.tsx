"use client";

import { useEffect, useState } from "react";
import { usePathname, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

function getPageTitle(pathname: string, locale: string): string {
  const prefix = `/${locale}/admin`;
  const rest = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : pathname;
  const segments = rest.split("/").filter(Boolean);

  if (segments.length === 0) return "Dashboard";

  switch (segments[0]) {
    case "films":
      if (segments.length === 1) return "Films";
      if (segments[1] === "new") return "Add Film";
      return "Edit Film";
    case "videos":
      return "Videos";
    case "photos":
      return "Photos";
    case "settings":
      return "Settings";
    default:
      return "Dashboard";
  }
}

export default function AdminTopBar() {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const [email, setEmail] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "");
    });
  }, []);

  return (
    <header className="flex h-14 items-center justify-between border-b border-[#2a2a2a] px-6">
      <p className="font-body text-type-nav text-film-cream/60">{getPageTitle(pathname, locale)}</p>
      <p className="font-body text-type-ui text-film-cream/30">{email}</p>
    </header>
  );
}
