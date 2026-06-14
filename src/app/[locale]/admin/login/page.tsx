"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push("/en/admin");
  };

  const inputClass =
    "w-full border-b border-[#2a2a2a] bg-transparent py-3 font-body text-[13px] text-film-cream placeholder:text-film-cream/20 transition-colors duration-300 focus:border-film-gold focus:outline-none";
  const labelClass = "font-body text-[9px] uppercase tracking-[0.3em] text-film-cream/30";

  return (
    <div className="flex min-h-screen items-center justify-center bg-film-black px-4">
      <div className="w-full max-w-[400px]">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-2xl font-light tracking-wide text-film-cream">
            ALEJANDRO SOZA
          </h1>
          <p className="mt-2 font-body text-[9px] uppercase tracking-[0.4em] text-film-gold">
            Admin
          </p>
        </div>

        <div className="border border-[#2a2a2a] bg-film-dark p-8">
          <p className="mb-6 font-body text-sm text-film-cream/60">Sign In</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-film-gold py-3 font-body text-[10px] font-medium uppercase tracking-[0.3em] text-film-black transition-colors duration-300 hover:bg-film-sepia disabled:opacity-50"
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>

            {error && <p className="font-body text-[11px] text-red-400">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
