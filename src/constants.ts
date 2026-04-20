/** Glasses are sold only in fixed packs (4 or 6). */
export interface GlassPackPricing {
  packOf4: number;
  packOf6: number;
}

export type GlassPackSize = 4 | 6;

export interface Product {
  id: string;
  name: string;
  /** Lowest purchasable total (for glasses: 4-pack price). Single-SKU items use this as the unit price. */
  price: number;
  category: string;
  image: string;
  beforeImage?: string;
  description: string;
  story: string;
  features: string[];
  /** When set, replaces the default “Why Choose Our Upcycled Glasses?” heading on the product page */
  whyChooseHeading?: string;
  /** OG glasses: sold only in packs of 4 or 6; `price` should match `packOf4`. */
  glassPackPricing?: GlassPackPricing;
}

export function sellsGlassPacks(product: Product): boolean {
  return product.glassPackPricing != null;
}

export function formatInr(amount: number): string {
  return amount.toLocaleString('en-IN');
}

/** One-line price for cards and related products (glasses: entry price only). */
export function getProductPriceCaption(product: Product): string {
  if (product.glassPackPricing) {
    return `Starting from ₹${formatInr(product.price)}`;
  }
  return `₹${formatInr(product.price)}`;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "og-sapphire-charm",
    name: "Sapphire Charm",
    price: 3960,
    glassPackPricing: { packOf4: 3960, packOf6: 5940 },
    category: "OG Collections (Glasses)",
    image: "https://static.wixstatic.com/media/7dc839_c398c890cb1545cabc699166de03d4c4~mv2.png",
    description: "",
    story:
      "Every year, millions of glass bottles end up in landfills despite being highly recyclable. At ReSip India, we collect Bombay Sapphire bottles from bars, cafes, and restaurants and transform them into beautiful, reusable drinkware.\n\nBy choosing Sapphire Charm, you're not just buying a glass you're choosing sustainability. Each piece carries a story of transformation, turning a discarded bottle into a stylish, functional tumbler that adds character to your everyday drinking experience.",
    features: [
      "Hand Cut",
      "Volume- 350ml, 12oz",
      "Polised Rim",
      "Colour- Sapphire Blue",
      "Eco-friendly",
      "Unique Design"
    ]
  },
  {
    id: "og-old-soul",
    name: "Old Soul",
    price: 4360,
    glassPackPricing: { packOf4: 4360, packOf6: 6540 },
    category: "OG Collections (Glasses)",
    image: "https://static.wixstatic.com/media/7dc839_b9b800074661487491d9bf58cca9331f~mv2.png",
    description: "",
    story:
      "Every year, millions of glass bottles end up in landfills despite being recyclable. At ReSip India, we collect bottles from bars, cafes, and restaurants and transform them into stylish, reusable drinkware.\n\nBy choosing Old Soul, you're not just buying a glass—you're preserving a story. A once-used Old Monk bottle is reborn into a bold, functional tumbler that celebrates sustainability while adding character to your everyday drinking moments.",
    features: [
      "Hand Cut",
      "Volume- 600ml, 20 0z",
      "Polised Rim",
      "Colour- Crystal Clear",
      "Eco-friendly",
      "Unique Design"
    ]
  },
  {
    id: "og-carribean-echo",
    name: "Carribean Echo",
    price: 3960,
    glassPackPricing: { packOf4: 3960, packOf6: 5940 },
    category: "OG Collections (Glasses)",
    image: "https://static.wixstatic.com/media/7dc839_69716d5a49334f1eb8888f05d398dd6c~mv2.png",
    description: "",
    story:
      "Every year, millions of glass bottles end up in landfills despite being recyclable. At ReSip India, we collect Bacardi bottles from bars, cafes, and restaurants and transform them into stylish, reusable drinkware.\n\nBy choosing Caribbean Echo, you're not just buying a glass—you're choosing sustainability. Each piece carries a story of transformation, turning a once-used bottle into a functional and iconic tumbler that brings character to your everyday drinking experience.",
    features: [
      "Hand Cut",
      "Volume- 350ml, 12 oz",
      "Polised Rim",
      "Colour- Crystal Clear",
      "Eco-friendly",
      "Unique Design"
    ]
  },
  {
    id: "og-antique-luxe",
    name: "Antique Luxe",
    price: 4160,
    glassPackPricing: { packOf4: 4160, packOf6: 6240 },
    category: "OG Collections (Glasses)",
    image: "https://static.wixstatic.com/media/7dc839_9709a90aaa144bbe9e969b795213586d~mv2.png",
    description: "",
    story:
      "Every year, millions of glass bottles end up in landfills despite being recyclable. At ReSip India, we collect Antiquity whisky bottles from bars, cafes, and restaurants and transform them into elegant, reusable drinkware.\n\nBy choosing Antique Luxe, you're not just buying a glassyou're choosing sustainability. Each piece carries a story of transformation, turning a once-used bottle into a stylish, functional tumbler that brings character and conscious living into your everyday moments.",
    features: [
      "Hand Cut",
      "Volume- 400ml, 13.5 oz",
      "Polised Rim",
      "Colour- Royal blue",
      "Eco-friendly",
      "Unique Design"
    ]
  },
  {
    id: "og-grape-glass",
    name: "Grape Glass",
    price: 3560,
    glassPackPricing: { packOf4: 3560, packOf6: 5340 },
    category: "OG Collections (Glasses)",
    image: "https://static.wixstatic.com/media/7dc839_c50d951e9b9042d191b6d330f220c749~mv2.png",
    description: "",
    story:
      "Every year, millions of glass bottles end up in landfills despite being recyclable. At ReSip India, we collect wine bottles from bars, cafes, and restaurants and transform them into beautiful, reusable drinkware.\n\nBy choosing Grape Glass, you're not just buying a glass—you're supporting a sustainable lifestyle. Each piece carries a story of transformation, turning a once-used bottle into a unique everyday tumbler that adds character to your cold brew moments and conscious living.",
    features: [
      "Hand Cut",
      "Volume- 35ml, 12 oz",
      "Polised Rim",
      "Colour- Emerald Green",
      "Eco-friendly",
      "Unique Design"
    ]
  },
  {
    id: "og-the-gentlemen",
    name: "The Gentlemen",
    price: 3960,
    glassPackPricing: { packOf4: 3960, packOf6: 5940 },
    category: "OG Collections (Glasses)",
    image: "https://static.wixstatic.com/media/7dc839_efbcd122607e4820953bc97bc234bf0f~mv2.png",
    description: "",
    story:
      "Every year, millions of glass bottles end up in landfills despite being recyclable. At ReSip India, we collect bottles from bars, cafes, and restaurants and transform them into stylish, reusable drinkware.\n\nBy choosing The Gentleman, you're not just buying a glass you're choosing sustainability and character. A once-used **Johnnie Walker Black Label bottle is reborn into a sophisticated tumbler, perfect for enjoying your cold brew moments with a touch of timeless style.",
    features: [
      "Hand Cut",
      "Volume- 350ml, 12 oz",
      "Polised Rim",
      "Colour- Crystal Clear",
      "Eco-friendly",
      "Unique Design"
    ]
  },
  {
    id: "og-king-mid",
    name: "King Mid",
    price: 3560,
    glassPackPricing: { packOf4: 3560, packOf6: 5340 },
    category: "OG Collections (Glasses)",
    image: "https://static.wixstatic.com/media/7dc839_787d4596d7494da1aa389b6d35f76443~mv2.png",
    description: "",
    story:
      "Every year, millions of glass bottles end up in landfills despite being recyclable. At ReSip India, we collect Kingfisher beer bottles from bars, cafes, and restaurants and transform them into stylish, reusable drinkware.\n\nBy choosing King Crest, you're not just buying a glass you're choosing sustainability. Each piece carries a story of transformation, turning a once-used beer bottle into a unique tumbler perfect for enjoying craft beer moments with an eco-conscious twist.",
    features: [
      "Hand Cut",
      "Volume- 350ml, 12 Oz",
      "Polised Rim",
      "Colour- Crystal Clear",
      "Eco-friendly",
      "Unique Design"
    ]
  },
  {
    id: "og-vino-vibe",
    name: "Vino Vibe",
    price: 3160,
    glassPackPricing: { packOf4: 3160, packOf6: 4740 },
    category: "OG Collections (Glasses)",
    image: "https://static.wixstatic.com/media/7dc839_585a68965247433990972e7e7b07f574~mv2.png",
    description: "",
    story:
      "Every year, millions of glass bottles end up in landfills despite being recyclable. At ReSip India, we collect wine bottles from bars, cafes, and restaurants and transform them into elegant, reusable drinkware.\n\nBy choosing Vino Vibe, you're not just buying a glass—you're choosing sustainability. Each piece carries a story of transformation, turning a once-used wine bottle into a refreshing everyday tumbler perfect for water, tonic, and mindful living.",
    features: [
      "Hand Cut",
      "Volume- 250ml, 8.45Oz",
      "Polised Rim",
      "Colour- Olive Green",
      "Eco-friendly",
      "Unique Design"
    ]
  },
  {
    id: "og-royal-shotlet",
    name: "Royal Shotlet",
    price: 1560,
    glassPackPricing: { packOf4: 1560, packOf6: 2340 },
    category: "OG Collections (Glasses)",
    image: "https://static.wixstatic.com/media/7dc839_ace1f7f522e144c8acecc08e23a5c10b~mv2.png",
    description: "",
    story:
      "Every year, millions of glass bottles end up in landfills despite being recyclable. At ReSip India, we collect Antiquity whisky bottles from bars, cafes, and restaurants and transform them into stylish, reusable drinkware.\n\nBy choosing Royal Shotlet, you're not just buying a shot glass you're choosing sustainability with style. Each piece carries a story of transformation, turning a once-used bottle into a bold little glass perfect for celebrations, tequila shots, and memorable gatherings",
    features: [
      "Hand Cut",
      "Volume- 60ml, 02 Oz",
      "Polised Rim",
      "Colour- Royal Blue",
      "Eco-friendly",
      "Unique Design"
    ]
  },
  {
    id: "og-dessert-shotlet",
    name: "Dessert Shotlet",
    price: 1560,
    glassPackPricing: { packOf4: 1560, packOf6: 2340 },
    category: "OG Collections (Glasses)",
    image: "https://static.wixstatic.com/media/7dc839_a31fcceb34a042fcaba75efd51d84c49~mv2.png",
    description: "",
    story:
      "Every year, millions of glass bottles end up in landfills despite being recyclable. At ReSip India, we collect bottles from bars, cafes, and restaurants and transform them into elegant, reusable drinkware.\n\nBy choosing Dessert Shotlet, you're not just buying a shot glass you're supporting sustainability. Each piece carries a story of transformation, turning a once-used Royal Ranthambore whisky bottle into a stylish mini glass perfect for dessert shots, tastings, and special moments.",
    features: [
      "Hand Cut",
      "Volume- 60ml, 02 oz",
      "Polised Rim",
      "Colour- Crystal Clear",
      "Eco-friendly",
      "Unique Design"
    ]
  },
  {
    id: "og-greater-pour",
    name: "Greater Pour",
    price: 3960,
    glassPackPricing: { packOf4: 3960, packOf6: 5940 },
    category: "OG Collections (Glasses)",
    image: "https://static.wixstatic.com/media/7dc839_a4d99249b8e0444689b28e359c0e60f4~mv2.png",
    description: "",
    story:
      "Every year, millions of glass bottles end up in landfills despite being fully recyclable. At ReSip India, we collect discarded bottles from bars, cafés, and restaurants and transform them into elegant, reusable drinkware.\n\nBy choosing Greater Pour, you're not just buying a glass—you're making a conscious lifestyle choice. Each piece carries a story of transformation, turning a once-used Greater Than Gin bottle into a stylish, functional glass perfect for everyday sipping and special moments alike.",
    features: [
      "Hand Cut",
      "Volume- 350ml, 12 oz",
      "Polised Rim",
      "Colour- Crystal Clear",
      "Eco-friendly",
      "Unique Design"
    ]
  },
  {
    id: "og-corocut",
    name: "CoroCut",
    price: 3560,
    glassPackPricing: { packOf4: 3560, packOf6: 5340 },
    category: "OG Collections (Glasses)",
    image: "https://static.wixstatic.com/media/7dc839_37314c31f305478a885bc328ec45cf32~mv2.png",
    description: "",
    whyChooseHeading: "Why Choose Our CoroCut Upcycled Glasses?",
    story:
      "Every year, millions of glass bottles end up in landfills despite being fully recyclable. At ReSip India, we collect discarded bottles from bars, cafés, and restaurants and transform them into sleek, reusable drinkware.\n\nBy choosing CoroCut, you're not just buying a glass you're making a conscious lifestyle choice. Each piece tells a story of transformation, turning a once-used Corona bottle into a clean, stylish glass perfect for everyday use and laid-back moments.",
    features: [
      "Hand Cut",
      "Volume- 250ml, 8.45 oz",
      "Polised Rim",
      "Colour- Crystal Clear",
      "Eco-friendly",
      "Unique Design"
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
