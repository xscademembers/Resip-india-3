export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  beforeImage?: string;
  description: string;
  story: string;
  features: string[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "The Royal Highball",
    price: 1250,
    category: "OG Collections (Glasses)",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
    beforeImage: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800",
    description: "A classic highball glass with a weighted base, perfect for long drinks.",
    story: "This glass was once a premium Scotch bottle, rescued from a local lounge and transformed through 12 hours of meticulous hand-polishing.",
    features: ["Hand-cut", "Fire-polished rim", "Sustainable luxury", "Dishwasher safe"]
  },
  {
    id: "2",
    name: "Amber Sunset Tumbler",
    price: 950,
    category: "OG Collections (Glasses)",
    image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&q=80&w=800",
    beforeImage: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800",
    description: "Short, wide tumbler designed for neat pours or spirits on the rocks.",
    story: "Crafted from an iconic amber bourbon bottle, this tumbler retains the original character of the glass while offering a modern silhouette.",
    features: ["Unique amber tint", "Smooth finish", "Eco-friendly", "Gift-ready packaging"]
  },
  {
    id: "3",
    name: "Scented Soy Candle",
    price: 1450,
    category: "Flame Collection (Candle Box)",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800",
    beforeImage: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=800",
    description: "Hand-poured soy wax in an upcycled glass container.",
    story: "This candle box was once a premium bottle, now housing a blend of essential oils and soy wax for a clean, sustainable burn.",
    features: ["Soy wax", "Essential oils", "Upcycled glass", "40+ hour burn time"]
  },
  {
    id: "4",
    name: "Artisanal Jar",
    price: 800,
    category: "Vault Category (Jars)",
    image: "https://images.unsplash.com/photo-1595977437232-9a0426ebfe4c?auto=format&fit=crop&q=80&w=800",
    beforeImage: "https://images.unsplash.com/photo-1527281405159-35d5b5aa7c1d?auto=format&fit=crop&q=80&w=800",
    description: "A beautiful storage jar for your kitchen or vanity.",
    story: "Part of our Vault Category, these jars are repurposed from unique bottle shapes to provide elegant storage solutions.",
    features: ["Airtic seal", "Hand-finished", "Sustainable", "Unique silhouette"]
  }
];

export const CATEGORIES: Category[] = [
  { id: "og", name: "OG Collections (Glasses)", image: "https://images.unsplash.com/photo-1527281405159-35d5b5aa7c1d?auto=format&fit=crop&q=80&w=800" },
  { id: "flame", name: "Flame Collection (Candle Box)", image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800" },
  { id: "party", name: "Party Box", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800" },
  { id: "corporate", name: "Corporate Box", image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&q=80&w=800" },
  { id: "extras", name: "Extras (Matchbox, Coasters, Bowls)", image: "https://images.unsplash.com/photo-1538944748257-423e72757591?auto=format&fit=crop&q=80&w=800" },
  { id: "vault", name: "Vault Category (Jars)", image: "https://images.unsplash.com/photo-1595977437232-9a0426ebfe4c?auto=format&fit=crop&q=80&w=800" }
];
