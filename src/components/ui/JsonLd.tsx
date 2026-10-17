interface JsonLdProps {
  id?: string;
  data: Record<string, unknown>;
}

/** Server-safe JSON-LD (no next/script client runtime). */
export default function JsonLd({ id = "json-ld", data }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
