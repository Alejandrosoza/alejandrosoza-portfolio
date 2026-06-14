import type { Locale } from "./types";

/**
 * Returns a localized field value (e.g. `title_en`/`title_es`/`title_fr`)
 * from a record, falling back to English if the requested locale is missing.
 */
export function localized<T extends Record<string, unknown>>(
  obj: T,
  field: string,
  locale: Locale
): string {
  return (
    (obj[`${field}_${locale}`] as string | undefined) ||
    (obj[`${field}_en`] as string | undefined) ||
    ""
  );
}
