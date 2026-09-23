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
