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
    id: "og-sapphire-charm",
    name: "Sapphire Charm",
    price: 990,
    category: "OG Collections (Glasses)",
    image: "https://images.unsplash.com/photo-1528823872057-9c018a7f07f9?auto=format&fit=crop&q=80&w=800",
    beforeImage: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
    description: "Upcycled tumbler crafted from an authentic Bombay Sapphire gin bottle.",
    story:
      "At ReSip India, we collect Bombay Sapphire bottles from bars, cafés, and restaurants and transform them into reusable drinkware. Sapphire Charm carries the signature blue character of the original bottle—each piece is handcrafted, unique, and consciously made.",
    features: [
      "Upcycled from an original Bombay Sapphire bottle",
      "Iconic sapphire-blue glass character",
      "Holds ~350 ml",
      "Hand-cut, smoothened, and polished",
      "Eco-friendly choice with unique bottle markings"
    ]
  },
  {
    id: "og-old-soul",
    name: "Old Soul",
    price: 1090,
    category: "OG Collections (Glasses)",
    image: "https://images.unsplash.com/photo-1566125882500-87e10f726cdc?auto=format&fit=crop&q=80&w=800",
    beforeImage: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800",
    description: "Bold, nostalgic tumbler upcycled from an authentic Old Monk rum bottle.",
    story:
      "We collect bottles from bars, cafés, and restaurants and transform them into stylish, reusable drinkware. Old Soul preserves the character of a legendary rum bottle—reborn into a functional tumbler that celebrates sustainability and story.",
    features: [
      "Upcycled from an original Old Monk bottle",
      "Iconic dark-glass character",
      "Holds ~600 ml",
      "Handcrafted cut + polished rim",
      "Eco-friendly with unique bottle textures"
    ]
  },
  {
    id: "og-caribbean-echo",
    name: "Caribbean Echo",
    price: 990,
    category: "OG Collections (Glasses)",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
    beforeImage: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&q=80&w=800",
    description: "Crystal-clear tumbler crafted from an authentic Bacardi White Rum bottle.",
    story:
      "Caribbean Echo is made from once-used Bacardi bottles collected from bars, cafés, and restaurants. Each glass is cut, smoothened, and polished by hand—designed to bring iconic character to everyday sipping while reducing waste.",
    features: [
      "Upcycled from an original Bacardi bottle",
      "Crystal-clear look for vibrant drinks",
      "Holds ~350 ml",
      "Handcrafted finish with safe rim",
      "Eco-friendly with authentic bottle markings"
    ]
  },
  {
    id: "og-antique-luxe",
    name: "Antique Luxe",
    price: 1040,
    category: "OG Collections (Glasses)",
    image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&q=80&w=800",
    beforeImage: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800",
    description: "Timeless tumbler upcycled from an authentic Antiquity whisky bottle.",
    story:
      "Antique Luxe begins as an Antiquity whisky bottle collected from bars, cafés, and restaurants—then reborn through careful hand-finishing. The result is a bold, premium tumbler that reflects conscious living and craftsmanship.",
    features: [
      "Upcycled from an original Antiquity bottle",
      "Distinctive tinted-glass character",
      "Holds ~400 ml",
      "Hand-cut, smoothened, and polished",
      "Eco-friendly with one-of-a-kind markings"
    ]
  },
  {
    id: "og-grape-glass",
    name: "Grape Glass",
    price: 890,
    category: "OG Collections (Glasses)",
    image: "https://images.unsplash.com/photo-1527281405159-35d5b5aa7c1d?auto=format&fit=crop&q=80&w=800",
    beforeImage: "https://images.unsplash.com/photo-1538944748257-423e72757591?auto=format&fit=crop&q=80&w=800",
    description: "Minimal green-tint tumbler upcycled from an authentic wine bottle.",
    story:
      "We collect wine bottles from bars, cafés, and restaurants and transform them into beautiful, reusable drinkware. Grape Glass keeps the natural green tint of the original bottle—simple, aesthetic, and made to be used every day.",
    features: [
      "Upcycled from an original wine bottle",
      "Natural green glass tint",
      "Holds ~350 ml",
      "Handcrafted smooth rim",
      "Eco-friendly with unique bottle character"
    ]
  },
  {
    id: "og-the-gentleman",
    name: "The Gentleman",
    price: 990,
    category: "OG Collections (Glasses)",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800",
    beforeImage: "https://images.unsplash.com/photo-1566125882500-87e10f726cdc?auto=format&fit=crop&q=80&w=800",
    description: "Sophisticated tumbler upcycled from a Johnnie Walker Black Label bottle.",
    story:
      "The Gentleman is crafted from Johnnie Walker Black Label bottles collected from bars, cafés, and restaurants. Cut and polished by hand, it brings timeless style to cold brew, mocktails, and everyday refreshers—without the waste.",
    features: [
      "Upcycled from an original Johnnie Walker Black Label bottle",
      "Crystal-clear look for layered drinks",
      "Holds ~350 ml",
      "Handcrafted finish and safe rim",
      "Eco-friendly with authentic bottle textures"
    ]
  },
  {
    id: "og-king-crest",
    name: "King Crest",
    price: 890,
    category: "OG Collections (Glasses)",
    image: "https://images.unsplash.com/photo-1528823872057-9c018a7f07f9?auto=format&fit=crop&q=80&w=800",
    beforeImage: "https://images.unsplash.com/photo-1527281405159-35d5b5aa7c1d?auto=format&fit=crop&q=80&w=800",
    description: "Refreshing tumbler upcycled from an authentic Kingfisher beer bottle.",
    story:
      "King Crest is made from once-used Kingfisher bottles collected from bars, cafés, and restaurants. Each glass is hand-finished to keep the classic bottle character—perfect for chilled beverages with an eco-conscious twist.",
    features: [
      "Upcycled from an original Kingfisher beer bottle",
      "Classic green-glass character",
      "Holds ~350 ml",
      "Handcrafted smooth, safe rim",
      "Eco-friendly with unique bottle markings"
    ]
  },
  {
    id: "og-vino-vibe",
    name: "Vino Vibe",
    price: 790,
    category: "OG Collections (Glasses)",
    image: "https://images.unsplash.com/photo-1527281405159-35d5b5aa7c1d?auto=format&fit=crop&q=80&w=800",
    beforeImage: "https://images.unsplash.com/photo-1538944748257-423e72757591?auto=format&fit=crop&q=80&w=800",
    description: "A light, minimal everyday tumbler upcycled from an authentic wine bottle.",
    story:
      "Vino Vibe turns collected wine bottles into elegant, reusable drinkware. Hand-cut and polished, it keeps the refreshing green tint and brings a mindful, sustainable touch to water, tonic, and sparkling pours.",
    features: [
      "Upcycled from an original wine bottle",
      "Natural green tint",
      "Holds ~250 ml",
      "Handcrafted finish with safe rim",
      "Eco-friendly with one-of-a-kind markings"
    ]
  },
  {
    id: "og-royal-shotlet",
    name: "Royal Shotlet",
    price: 390,
    category: "OG Collections (Glasses)",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800",
    beforeImage: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800",
    description: "Bold shot glass upcycled from an authentic Antiquity whisky bottle.",
    story:
      "Royal Shotlet is crafted from collected Antiquity whisky bottles and finished by hand for a premium rim and feel. A small glass with big character—made for celebrations and conscious choices.",
    features: [
      "Upcycled from an original Antiquity bottle",
      "Distinctive tinted-glass character",
      "Holds ~60 ml",
      "Handcrafted cut + polished finish",
      "Eco-friendly with unique bottle textures"
    ]
  },
  {
    id: "og-dessert-shotlet",
    name: "Dessert Shotlet",
    price: 390,
    category: "OG Collections (Glasses)",
    image: "https://images.unsplash.com/photo-1566125882500-87e10f726cdc?auto=format&fit=crop&q=80&w=800",
    beforeImage: "https://images.unsplash.com/photo-1566125882500-87e10f726cdc?auto=format&fit=crop&q=80&w=800",
    description: "Refined mini glass upcycled from a Royal Ranthambore whisky bottle.",
    story:
      "We collect bottles from bars, cafés, and restaurants and turn them into elegant drinkware. Dessert Shotlet is cut and polished by hand—ideal for dessert shots, tastings, and espresso moments, with a lighter footprint.",
    features: [
      "Upcycled from an original Royal Ranthambore bottle",
      "Crystal-clear look for layered shots",
      "Holds ~60 ml",
      "Handcrafted safe rim",
      "Eco-friendly with subtle authentic markings"
    ]
  },
  {
    id: "og-greater-pour",
    name: "Greater Pour",
    price: 990,
    category: "OG Collections (Glasses)",
    image: "https://images.unsplash.com/photo-1566125882500-87e10f726cdc?auto=format&fit=crop&q=80&w=800",
    beforeImage: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
    description: "Contemporary 350 ml glass upcycled from an authentic Greater Than Gin bottle.",
    story:
      "Greater Pour starts as discarded Greater Than Gin bottles collected from bars, cafés, and restaurants. Hand-finished into an elegant 350 ml glass, it’s designed for daily sipping and special pours—without producing new glass.",
    features: [
      "Upcycled from an original Greater Than Gin bottle",
      "Crystal-clear look",
      "Holds ~350 ml",
      "Handcrafted smooth, comfortable rim",
      "Eco-friendly with one-of-a-kind textures"
    ]
  },
  {
    id: "3",
    name: "Scented Soy Candle",
    price: 1450,
    category: "Flame Collection (Candle Box)",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800",
    beforeImage: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800",
    description: "Hand-poured soy wax in an upcycled glass container.",
    story: "This candle box was once a premium bottle, now housing a blend of essential oils and soy wax for a clean, sustainable burn.",
    features: ["Soy wax", "Essential oils", "Upcycled glass", "40+ hour burn time"]
  },
  {
    id: "4",
    name: "Artisanal Jar",
    price: 800,
    category: "Vault Category (Jars)",
    image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&q=80&w=800",
    beforeImage: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800",
    description: "A beautiful storage jar for your kitchen or vanity.",
    story: "Part of our Vault Category, these jars are repurposed from unique bottle shapes to provide elegant storage solutions.",
    features: ["Airtic seal", "Hand-finished", "Sustainable", "Unique silhouette"]
  }
];

export const CATEGORIES: Category[] = [
  { id: "og", name: "OG Collections (Glasses)", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800" },
  { id: "flame", name: "Flame Collection (Candle Box)", image: "https://images.unsplash.com/photo-1566125882500-87e10f726cdc?auto=format&fit=crop&q=80&w=800" },
  { id: "party", name: "Party Box", image: "https://images.unsplash.com/photo-1528823872057-9c018a7f07f9?auto=format&fit=crop&q=80&w=800" },
  { id: "corporate", name: "Corporate Box", image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&q=80&w=800" },
  { id: "extras", name: "Extras (Matchbox, Coasters, Bowls)", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800" },
  { id: "vault", name: "Vault Category (Jars)", image: "https://images.unsplash.com/photo-1527281405159-35d5b5aa7c1d?auto=format&fit=crop&q=80&w=800" }
];
