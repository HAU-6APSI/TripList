// Quick-add destination suggestions shown on the Trip Page.
export const PLACES = [
  { name: "Clark Museum" },
  { name: "Nayong Pilipino sa Angeles" },
  { name: "Marquee Mall" },
  { name: "SM City Clark" },
  { name: "Holy Rosary Parish (Pisamban Maragul)" },
  { name: "Balibago food & nightlife strip" },
  { name: "Clark Freeport parks" },
  { name: "Robinsons Place Angeles" },
];

export const ACTIVITY_RECOMMENDATIONS = [
  {
    keywords: ["sisig", "pork", "kapampangan", "local food"],
    label: "Sisig and Kapampangan food",
    places: ["Aling Lucing's Sisig", "Mila's Tokwa't Baboy", "Café Fleur"],
  },
  {
    keywords: ["coffee", "cafe", "café", "study", "work"],
    label: "Coffee spots",
    places: ["Coffee Academy", "Starbucks Clark", "The Coffee Bean & Tea Leaf - Marquee Mall"],
  },
  {
    keywords: ["restaurant", "resto", "dinner", "lunch", "eat", "food"],
    label: "Restaurants to try",
    places: ["25 Seeds", "Binulo Restaurant", "Historic Camalig Restaurant"],
  },
  {
    keywords: ["breakfast", "brunch", "morning"],
    label: "Breakfast and brunch",
    places: ["Cafe Fleur", "Mila's Tokwa't Baboy", "Nono's"],
  },
  {
    keywords: ["dessert", "sweet", "cake", "pastry", "snack"],
    label: "Sweet stops",
    places: ["Susie's Cuisine", "Café Fleur", "Razon's of Guagua - Clark"],
  },
  {
    keywords: ["nightlife", "bar", "drinks", "music", "party"],
    label: "Nightlife ideas",
    places: ["Fields Avenue", "Balibago food & nightlife strip", "Clark nightlife district"],
  },
];

export function getActivityRecommendations(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  return ACTIVITY_RECOMMENDATIONS.filter((recommendation) =>
    recommendation.keywords.some((keyword) => normalized.includes(keyword)),
  );
}

export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatShortDate(iso) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
