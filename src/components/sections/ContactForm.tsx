"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useTranslations } from "next-intl";

type Status = "idle" | "sending" | "success" | "error";

const initialForm = { name: "", email: "", subject: "", message: "" };

export default function ContactForm() {
  const t = useTranslations("contact");
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<Status>("idle");

  const handleChange =
    (field: keyof typeof initialForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Request failed");

      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
    }
  };

  const inputClass = "film-input py-3";
  const labelClass = "film-label";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className={labelClass}>
          {t("name")}
        </label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange("name")}
          required
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className={labelClass}>
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange("email")}
          required
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="subject" className={labelClass}>
          {t("subject")}
        </label>
        <input
          id="subject"
          name="subject"
          value={form.subject}
          onChange={handleChange("subject")}
          required
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={labelClass}>
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={form.message}
          onChange={handleChange("message")}
          required
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className={`mt-4 w-full border py-4 font-body text-type-ui uppercase tracking-[0.3em] transition-colors duration-300 ${
          status === "success"
            ? "border-film-gold text-film-gold"
            : status === "error"
              ? "border-red-400 text-red-400"
              : "border-film-cream/30 text-film-cream hover:border-film-gold hover:text-film-gold"
        }`}
      >
        {status === "sending" && t("sending")}
        {status === "success" && `${t("sent")} ✓`}
        {status === "error" && t("error")}
        {status === "idle" && `${t("send")} →`}
      </button>
    </form>
  );
}
