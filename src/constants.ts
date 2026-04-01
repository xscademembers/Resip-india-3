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
      "Every year, millions of glass bottles end up in landfills despite being highly recyclable. At ReSip India, we collect Bombay Sapphire bottles from bars, cafes, and restaurants and transform them into beautiful, reusable drinkware.\n\nBy choosing Sapphire Charm, you’re not just buying a glass you’re choosing sustainability. Each piece carries a story of transformation, turning a discarded bottle into a stylish, functional tumbler that adds character to your everyday drinking experience.",
    features: [
      "Upcycled from an Original Bottle – Crafted from an authentic Bombay Sapphire gin bottle.",
      "Sapphire blue Glass – Retains the elegant green tint of the original wine bottle, giving it a minimal and aesthetic look.",
      "Iconic Sapphire Blue Design – Retains the signature deep blue glass that makes the bottle instantly recognizable.",
      "Capacity – Holds approximately 350 ml, perfect for cocktails, mocktails, juices, or everyday beverages.",
      "Handcrafted Finish – Carefully cut, smoothened, and polished by hand for a premium and safe drinking experience.",
      "Eco-Friendly Choice – Helps reduce waste, carbon emissions, and water consumption compared to producing new glass.",
      "Authentic Bottle Character – Original bottle textures or markings may remain, making every glass unique."
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
      "Every year, millions of glass bottles end up in landfills despite being recyclable. At ReSip India, we collect bottles from bars, cafes, and restaurants and transform them into stylish, reusable drinkware.\n\nBy choosing Old Soul, you’re not just buying a glass—you’re preserving a story. A once-used Old Monk bottle is reborn into a bold, functional tumbler that celebrates sustainability while adding character to your everyday drinking moments.",
    features: [
      "Upcycled from an Original Bottle – Crafted from an authentic Old Monk rum bottle, giving the glass a bold and nostalgic character.",
      "Iconic Old Monk Design – Retains the classic dark glass look inspired by the legendary rum bottle loved for generations.",
      "Capacity – Holds approximately 600 ml, making it perfect for cocktails, beer, cold coffee, mocktails, or sharing drinks.",
      "Handcrafted Finish – Each glass is carefully cut, smoothened, and polished by hand for a premium and safe drinking experience.",
      "Eco-Friendly Choice – Upcycling reduces landfill waste while lowering carbon emissions and water consumption compared to producing new glass.",
      "Authentic Bottle Character – Original bottle textures or markings may remain, making every piece unique and full of personality."
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
      "Every year, millions of glass bottles end up in landfills despite being recyclable. At ReSip India, we collect Bacardi bottles from bars, cafes, and restaurants and transform them into stylish, reusable drinkware.\n\nBy choosing Caribbean Echo, you’re not just buying a glass—you’re choosing sustainability. Each piece carries a story of transformation, turning a once-used bottle into a functional and iconic tumbler that brings character to your everyday drinking experience.",
    features: [
      "Upcycled from an Original Bottle – Crafted from an authentic Bacardi White Rum bottle, giving the glass a distinctive and stylish look.",
      "Crystal Clear Glass – Features a clean, crystal-clear finish, perfect for showcasing layered dessert shots or vibrant beverages.",
      "Iconic Bacardi Design – Retains the recognisable bottle character inspired by the classic white rum bottle.",
      "Capacity – Holds approximately 350 ml, perfect for cocktails, mocktails, juices, or everyday beverages.",
      "Handcrafted Finish – Each glass is carefully cut, smoothened, and polished by hand for a premium and safe drinking experience.",
      "Eco-Friendly Choice – Upcycling helps reduce landfill waste while lowering carbon emissions and water consumption compared to producing new glass.",
      "Authentic Bottle Character – Original bottle textures or markings may remain, making every glass unique."
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
      "Every year, millions of glass bottles end up in landfills despite being recyclable. At ReSip India, we collect Antiquity whisky bottles from bars, cafes, and restaurants and transform them into elegant, reusable drinkware.\n\nBy choosing Antique Luxe, you’re not just buying a glassyou’re choosing sustainability. Each piece carries a story of transformation, turning a once-used bottle into a stylish, functional tumbler that brings character and conscious living into your everyday moments.",
    features: [
      "Upcycled from an Original Bottle – Crafted from an authentic Antiquity whisky bottle, giving the glass a rich and timeless character.",
      "Emerald Blue Glass – Features a striking emerald blue tint, making it stand out in any bar setup or party setting.",
      "Classic Whisky Bottle Design – Retains the bold and premium look inspired by the original whisky bottle.",
      "Capacity – Holds approximately 400 ml, perfect for cocktails, mocktails, juices, or everyday beverages.",
      "Handcrafted Finish – Carefully cut, smoothened, and polished by hand to ensure a premium feel and safe drinking rim.",
      "Eco-Friendly Choice – Upcycling helps reduce landfill waste while lowering carbon emissions and water consumption compared to producing new glass.",
      "Authentic Bottle Character – Original bottle textures or markings may remain, adding uniqueness to every glass."
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
      "Every year, millions of glass bottles end up in landfills despite being recyclable. At ReSip India, we collect wine bottles from bars, cafes, and restaurants and transform them into beautiful, reusable drinkware.\n\nBy choosing Grape Glass, you’re not just buying a glass—you’re supporting a sustainable lifestyle. Each piece carries a story of transformation, turning a once-used bottle into a unique everyday tumbler that adds character to your cold brew moments and conscious living.",
    features: [
      "Upcycled from an Original Bottle – Crafted from an authentic wine bottle, thoughtfully transformed into a stylish reusable glass.",
      "Natural Green Glass – Retains the elegant green tint of the original wine bottle, giving it a minimal and aesthetic look.",
      "Capacity – Holds approximately 350 ml, ideal for cold brew, iced coffee, juices, mocktails, or refreshing beverages.",
      "Handcrafted Finish – Carefully cut, smoothened, and polished by hand to ensure a premium feel and safe drinking rim.",
      "Eco-Friendly Choice – Upcycling reduces landfill waste while saving energy, water, and carbon emissions compared to producing new glass.",
      "Authentic Bottle Character – Original bottle textures or markings may remain, making every glass unique."
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
      "Every year, millions of glass bottles end up in landfills despite being recyclable. At ReSip India, we collect bottles from bars, cafes, and restaurants and transform them into stylish, reusable drinkware.\n\nBy choosing The Gentleman, you’re not just buying a glass you’re choosing sustainability and character. A once-used Johnnie Walker Black Label bottle is reborn into a sophisticated tumbler, perfect for enjoying your cold brew moments with a touch of timeless style.",
    features: [
      "Upcycled from an Original Bottle – Crafted from an authentic Johnnie Walker Black Label whisky bottle, giving the glass a refined and classic character.",
      "Crystal Clear Glass – Features a clean, crystal-clear finish, perfect for showcasing layered dessert shots or vibrant beverages.",
      "Iconic Whisky Bottle Design – Retains the sleek and recognisable style inspired by the original Black Label bottle.",
      "Capacity – Holds approximately 350 ml, making it ideal for cold brew coffee, iced coffee, mocktails, juices, or refreshing beverages.",
      "Handcrafted Finish – Carefully cut, smoothened, and polished by hand to ensure a premium feel and a safe drinking rim.",
      "Eco-Friendly Choice – Upcycling helps reduce landfill waste while lowering carbon emissions and water consumption compared to producing new glass.",
      "Authentic Bottle Character – Original bottle textures or markings may remain, making each glass unique."
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
      "Every year, millions of glass bottles end up in landfills despite being recyclable. At ReSip India, we collect Kingfisher beer bottles from bars, cafes, and restaurants and transform them into stylish, reusable drinkware.\n\nBy choosing King Crest, you’re not just buying a glass you’re choosing sustainability. Each piece carries a story of transformation, turning a once-used beer bottle into a unique tumbler perfect for enjoying craft beer moments with an eco-conscious twist.",
    features: [
      "Upcycled from an Original Bottle – Crafted from an authentic Kingfisher beer bottle, giving it a bold and refreshing character.",
      "Crystal Clear Glass – Features a clean, crystal-clear finish, perfect for showcasing layered dessert shots or vibrant beverages.",
      "Iconic Beer Bottle Design – Retains the classic green glass style inspired by the original Kingfisher beer bottle.",
      "Capacity – Holds approximately 350 ml, making it perfect for beer, craft beer, chilled beverages, or mocktails.",
      "Handcrafted Finish – Carefully cut, smoothened, and polished by hand to ensure a premium look and a safe drinking rim.",
      "Eco-Friendly Choice – Upcycling helps reduce landfill waste while lowering carbon emissions and water consumption compared to producing new glass.",
      "Authentic Bottle Character – Original bottle textures or markings may remain, giving each glass a unique identity."
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
      "Every year, millions of glass bottles end up in landfills despite being recyclable. At ReSip India, we collect wine bottles from bars, cafes, and restaurants and transform them into elegant, reusable drinkware.\n\nBy choosing Vino Vibe, you’re not just buying a glass—you’re choosing sustainability. Each piece carries a story of transformation, turning a once-used wine bottle into a refreshing everyday tumbler perfect for water, tonic, and mindful living.",
    features: [
      "Upcycled from an Original Bottle – Crafted from an authentic wine bottle, thoughtfully transformed into a stylish reusable glass.",
      "Natural Green Glass – Retains the elegant green tint of the original wine bottle, giving it a minimal and refreshing aesthetic.",
      "Capacity – Holds approximately 250 ml, perfect for water, tonic water, sparkling beverages, or light refreshments.",
      "Handcrafted Finish – Carefully cut, smoothened, and polished by hand to ensure a premium feel and a safe drinking rim.",
      "Eco-Friendly Choice – Upcycling helps reduce landfill waste while saving energy, water, and carbon emissions compared to producing new glass.",
      "Authentic Bottle Character – Original bottle textures or markings may remain, making every glass unique."
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
      "Every year, millions of glass bottles end up in landfills despite being recyclable. At ReSip India, we collect Antiquity whisky bottles from bars, cafes, and restaurants and transform them into stylish, reusable drinkware.\n\nBy choosing Royal Shotlet, you’re not just buying a shot glass—you’re choosing sustainability with style. Each piece carries a story of transformation, turning a once-used bottle into a bold little glass perfect for celebrations, tequila shots, and memorable gatherings.",
    features: [
      "Upcycled from an Original Bottle – Crafted from an authentic Antiquity whisky bottle, giving the shot glass a bold and premium character.",
      "Emerald Blue Glass – Features a striking emerald blue tint, making it stand out in any bar setup or party setting.",
      "Capacity – Holds approximately 60 ml, ideal for shots, tequila shots, or party servings.",
      "Handcrafted Finish – Carefully cut, smoothened, and polished by hand to ensure a premium finish and a safe drinking rim.",
      "Eco-Friendly Choice – Upcycling helps reduce landfill waste while lowering carbon emissions and water consumption compared to producing new glass.",
      "Authentic Bottle Character – Original bottle textures or markings may remain, making each shot glass unique."
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
      "Every year, millions of glass bottles end up in landfills despite being recyclable. At ReSip India, we collect bottles from bars, cafes, and restaurants and transform them into elegant, reusable drinkware.\n\nBy choosing Dessert Shotlet, you’re not just buying a shot glass you’re supporting sustainability. Each piece carries a story of transformation, turning a once-used Royal Ranthambore whisky bottle into a stylish mini glass perfect for dessert shots, tastings, and special moments.",
    features: [
      "Upcycled from an Original Bottle – Crafted from an authentic Royal Ranthambore whisky bottle, giving the shot glass a refined and distinctive character.",
      "Crystal Clear Glass – Features a clean, crystal-clear finish, perfect for showcasing layered dessert shots or vibrant beverages.",
      "Capacity – Holds approximately 60 ml, ideal for dessert shots, tasting shots, espresso shots, or party servings.",
      "Handcrafted Finish – Carefully cut, smoothened, and polished by hand to ensure a premium finish and a safe drinking rim.",
      "Eco-Friendly Choice – Upcycling helps reduce landfill waste while lowering carbon emissions and water consumption compared to producing new glass.",
      "Authentic Bottle Character – Original bottle textures or subtle markings may remain, making each shot glass unique."
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
      "Every year, millions of glass bottles end up in landfills despite being fully recyclable. At ReSip India, we collect discarded bottles from bars, cafés, and restaurants and transform them into elegant, reusable drinkware.\n\nBy choosing Greater Pour, you’re not just buying a glass—you’re making a conscious lifestyle choice. Each piece carries a story of transformation, turning a once-used Greater Than Gin bottle into a stylish, functional glass perfect for everyday sipping and special moments alike.",
    features: [
      "Upcycled from an Original Bottle – Crafted from an authentic Greater Than Gin bottle, giving the glass a bold, contemporary, and premium character.",
      "Crystal Clear Glass – Features a clean, crystal-clear finish, perfect for showcasing cocktails, mocktails, infused drinks, or even water with style.",
      "Capacity – Holds approximately 350 ml, making it ideal for long drinks, cocktails, iced beverages, or everyday use.",
      "Handcrafted Finish – Carefully cut, smoothened, and polished by hand to ensure a premium feel and a safe, comfortable drinking rim.",
      "Eco-Friendly Choice – Upcycling reduces landfill waste while saving energy, water, and resources compared to manufacturing new glass.",
      "Authentic Bottle Character – Retains subtle textures or markings from the original bottle, making each glass uniquely one-of-a-kind."
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
