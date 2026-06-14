export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Alejandro Soza",
    jobTitle: "Film Director",
    url: "https://alejandrosoza.ca",
    sameAs: [],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Whitehorse",
      addressRegion: "Yukon",
      addressCountry: "CA",
    },
    knowsAbout: ["Film Direction", "Cinematography", "Screenwriting", "Theatre"],
  };
}

export function filmSchema(film: {
  title_en: string;
  synopsis_en: string;
  year: number;
  youtube_id: string;
  slug: string;
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: film.title_en,
    description: film.synopsis_en,
    dateCreated: String(film.year),
    director: {
      "@type": "Person",
      name: "Alejandro Soza",
      url: "https://alejandrosoza.ca",
    },
    url: `https://alejandrosoza.ca/en/films/${film.slug}`,
    embedUrl: `https://www.youtube.com/embed/${film.youtube_id}`,
    genre: film.category,
  };
}
