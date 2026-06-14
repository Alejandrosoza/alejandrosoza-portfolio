"use client";

import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import { LayoutDashboard, Film, Video, Image as ImageIcon, Settings, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/films", label: "Films", icon: Film },
  { href: "/admin/videos", label: "Videos", icon: Video },
  { href: "/admin/photos", label: "Photos", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/en");
  };

  const isActive = (href: string) => {
    const target = `/${locale}${href}`;
    if (href === "/admin") return pathname === target;
    return pathname.startsWith(target);
  };

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-[220px] flex-col border-r border-[#2a2a2a] bg-film-black">
      <div className="px-6 py-6">
        <p className="font-heading text-2xl font-light text-film-gold">AS</p>
        <p className="mt-1 font-body text-type-label uppercase tracking-[0.4em] text-film-cream/30">
          Admin
        </p>
      </div>

      <nav className="flex flex-1 flex-col px-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className={`flex items-center gap-3 border-l-2 px-4 py-3 font-body text-type-nav tracking-wider transition-colors duration-300 ${
                active
                  ? "border-film-gold bg-white/5 text-film-cream"
                  : "border-transparent text-film-cream/50 hover:text-film-cream"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-6">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-4 py-3 font-body text-type-ui uppercase tracking-[0.3em] text-film-cream/30 transition-colors duration-300 hover:text-film-cream"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
