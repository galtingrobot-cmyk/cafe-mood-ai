export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "kopi" | "non-kopi";
  image?: string;
}

export const categories = [
  { key: "all", label: "Semua" },
  { key: "kopi", label: "☕ Kopi" },
  { key: "non-kopi", label: "🍵 Non-Kopi" },
];
