/** Set pricing: tumblers use 2 & 4; shots use 6 & 12. Price is per set. */
export type GlassSetPricing =
  | { format: '24'; setOf2: number; setOf4: number }
  | { format: '612'; setOf6: number; setOf12: number };

export type GlassSetSize = 2 | 4 | 6 | 12;

export interface Product {
  id: string;
  name: string;
  /** For set SKUs: lowest tier (set of 2 or set of 6). Otherwise unit price. */
  price: number;
  category: string;
  image: string;
  /** When set, product detail shows a carousel of these URLs (first is also used as card thumbnail via `image`). */
  images?: string[];
  beforeImage?: string;
  description: string;
  story: string;
  features: string[];
  whyChooseHeading?: string;
  glassSetPricing?: GlassSetPricing;
}

/** Ordered gallery for product detail; falls back to the single `image` URL. */
export function getProductGalleryImages(product: Product): string[] {
  const list = product.images?.filter(Boolean);
  if (list?.length) return list;
  return [product.image];
}

export function sellsGlassSets(product: Product): boolean {
  return product.glassSetPricing != null;
}

export function getGlassSetEntryPrice(pricing: GlassSetPricing): number {
  return pricing.format === '24' ? pricing.setOf2 : pricing.setOf6;
}

export function formatInr(amount: number): string {
  return amount.toLocaleString('en-IN');
}

/** One-line price for cards (sets: entry = set of 2 or set of 6). */
export function getProductPriceCaption(product: Product): string {
  if (product.glassSetPricing) {
    return `Starting from ₹${formatInr(getGlassSetEntryPrice(product.glassSetPricing))}`;
  }
  return `₹${formatInr(product.price)}`;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

/** Profile URL for footer and home Instagram section. */
export const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/resip_india/';

/** Header lockup — full-colour logo for nav (light backgrounds / hero overlay). */
export const BRAND_LOGO_HEADER_SRC =
  'https://static.wixstatic.com/media/7dc839_2e48de9b008d43d58067c17afc5dc6fb~mv2.jpg';

/** Footer lockup — artwork tuned for the blue footer band. */
export const BRAND_LOGO_FOOTER_SRC =
  'https://static.wixstatic.com/media/7dc839_223e2ac28f09419db687b68a9f604b90~mv2.jpg';

/** Placeholder imagery until final assets are provided. */
const PLACEHOLDER_GLASS = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800';

export const PRODUCTS: Product[] = [
  {
    id: 'og-sapphire-charm',
    name: 'ReSip Bombay Sapphire Bottle Glass',
    price: 499,
    glassSetPricing: { format: '24', setOf2: 499, setOf4: 999 },
    category: 'Upcycled Glass',
    image:
      'https://static.wixstatic.com/media/7dc839_e43ac9fd179346bcae193b087049b0c7~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/7dc839_e43ac9fd179346bcae193b087049b0c7~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_9abcf6b7bfc44168b6cb148accf2f940~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_852461fdbcc44f08825cc39a08d6a7e8~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_c7886d407d5a42f49163699b75b95a3b~mv2.jpg',
    ],
    description:
      'Hand-cut drinking glass upcycled from Bombay Sapphire bottles—premium sapphire-blue glass for everyday pours.',
    story:
      'ReSip India rescues Bombay Sapphire bottles from bars, cafés, and restaurants and transforms them into reusable drinkware.\n\nEach ReSip Bombay Sapphire Bottle Glass carries a story of transformation: discarded bottle to bold, food-safe tumbler.',
    features: [
      'Hand cut',
      'Volume: 350ml (12 oz)',
      'Polished rim',
      'Colour: sapphire blue',
      'Eco-friendly',
      'Unique design',
    ],
  },
  {
    id: 'og-old-soul',
    name: 'ReSip Old Monk Bottle Glass',
    price: 599,
    glassSetPricing: { format: '24', setOf2: 599, setOf4: 1099 },
    category: 'Upcycled Glass',
    image:
      'https://static.wixstatic.com/media/7dc839_6607b4de853b42e08cd5add136121056~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/7dc839_6607b4de853b42e08cd5add136121056~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_67a505f0d4824468aa6d03691ec5a540~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_ae0adeaa01214f15afcdf574b33471c0~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_4fe20fde41a94c6eb6134c274535a333~mv2.jpg',
    ],
    description:
      'Large-format tumbler upcycled from Old Monk bottles—generous pour with unmistakable character.',
    story:
      'A once-used Old Monk bottle becomes a bold, functional ReSip Old Monk Bottle Glass—sustainability with ritual and warmth.\n\nStory and full editorial copy can be expanded when your final content is ready.',
    features: [
      'Hand cut',
      'Volume: 600ml (~20 oz)',
      'Polished rim',
      'Colour: crystal clear',
      'Eco-friendly',
      'Unique design',
    ],
  },
  {
    id: 'og-carribean-echo',
    name: 'ReSip Bacardi Bottle Glass',
    price: 399,
    glassSetPricing: { format: '24', setOf2: 399, setOf4: 799 },
    category: 'Upcycled Glass',
    image:
      'https://static.wixstatic.com/media/7dc839_b5fbaef749c44f19966ea4832980a0b7~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/7dc839_b5fbaef749c44f19966ea4832980a0b7~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_0c794f96ccb349fb97749b0eacf754c6~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_67b5a3c809d94ce8a114386791c92374~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_a33620dba44e4417b0f5ede99f9c77b2~mv2.jpg',
    ],
    description:
      'Iconic tumbler upcycled from Bacardi bottles—clean lines and a familiar silhouette.',
    story:
      'Collected Bacardi bottles are cut, smoothed, and finished into the ReSip Bacardi Bottle Glass—ready for relaxed pours and conscious living.\n\nAdditional brand storytelling to follow.',
    features: [
      'Hand cut',
      'Volume: 350ml (12 oz)',
      'Polished rim',
      'Colour: crystal clear',
      'Eco-friendly',
      'Unique design',
    ],
  },
  {
    id: 'og-antique-luxe',
    name: 'ReSip Antiquity Bottle Glass',
    price: 499,
    glassSetPricing: { format: '24', setOf2: 499, setOf4: 999 },
    category: 'Upcycled Glass',
    image:
      'https://static.wixstatic.com/media/7dc839_90dc0b96ddc945b39cb4326a02506720~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/7dc839_90dc0b96ddc945b39cb4326a02506720~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_d316a95561fa4981b963f16d5069d538~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_3d76f5a737a74fcaae6960110ee8900a~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_90701fdddc5c4813ae0d10821ed0bb4b~mv2.jpg',
    ],
    description:
      'Elegant tumbler upcycled from Antiquity whisky bottles—deep royal blue tone.',
    story:
      'Antiquity whisky bottles are reborn as the ReSip Antiquity Bottle Glass—distinct colour and weight for elevated everyday use.\n\nLong-form story pending your final copy.',
    features: [
      'Hand cut',
      'Volume: 400ml (~13.5 oz)',
      'Polished rim',
      'Colour: royal blue',
      'Eco-friendly',
      'Unique design',
    ],
  },
  {
    id: 'og-grape-glass',
    name: 'ReSip Wine Bottle Glass',
    price: 449,
    glassSetPricing: { format: '24', setOf2: 449, setOf4: 899 },
    category: 'Upcycled Glass',
    image:
      'https://static.wixstatic.com/media/7dc839_54601abef09b48dd91069221fca6ad11~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/7dc839_54601abef09b48dd91069221fca6ad11~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_1bc0b5d860af4dd4a8b88e3108cd715a~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_5b8f2465a8d340e58fe06ae910b74db0~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_8228982495a24e86b47facabcb7c97ab~mv2.jpg',
    ],
    description:
      'Tumbler upcycled from wine bottles—emerald green glow, perfect for cold brew and soft drinks.',
    story:
      'Wine bottles diverted from waste become the ReSip Wine Bottle Glass—characterful colour from the source glass.\n\nEditorial expansion to follow.',
    features: [
      'Hand cut',
      'Volume: ~350ml (12 oz)',
      'Polished rim',
      'Colour: emerald green',
      'Eco-friendly',
      'Unique design',
    ],
  },
  {
    id: 'og-the-gentlemen',
    name: 'ReSip Black Label Bottle Glass',
    price: 449,
    glassSetPricing: { format: '24', setOf2: 449, setOf4: 899 },
    category: 'Upcycled Glass',
    image:
      'https://static.wixstatic.com/media/7dc839_ef3f533e1adc4e7e8f8245cf407a91b9~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/7dc839_ef3f533e1adc4e7e8f8245cf407a91b9~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_fa29895e880d4246bf441492e00715b4~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_61932ee52904485e8cd272b96d3768bb~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_d3497b3302a942dd8754028e303604cf~mv2.jpg',
    ],
    description:
      'Sophisticated tumbler upcycled from Johnnie Walker Black Label bottles.',
    story:
      'The ReSip Black Label Bottle Glass turns a recognised whisky silhouette into refined, reusable drinkware.\n\nMore narrative content to come.',
    features: [
      'Hand cut',
      'Volume: 350ml (12 oz)',
      'Polished rim',
      'Colour: crystal clear',
      'Eco-friendly',
      'Unique design',
    ],
  },
  {
    id: 'og-king-mid',
    name: 'ReSip Kingfisher Bottle Glass',
    price: 399,
    glassSetPricing: { format: '24', setOf2: 399, setOf4: 799 },
    category: 'Upcycled Glass',
    image:
      'https://static.wixstatic.com/media/7dc839_ae062dea37e14e528f2db811d8064311~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/7dc839_ae062dea37e14e528f2db811d8064311~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_1a4216d215fe413892795280f4fa89ec~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_153597c3fdd541788170a5eff2206cac~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_e6038534cc2b4163b1b14a942e973286~mv2.jpg',
    ],
    description:
      'Beer-bottle tumbler upcycled from Kingfisher glass—effortless craft-beer moments.',
    story:
      'Kingfisher bottles are transformed into the ReSip Kingfisher Bottle Glass—a familiar shape with a sustainable second life.\n\nExtended copy TBC.',
    features: [
      'Hand cut',
      'Volume: 350ml (12 oz)',
      'Polished rim',
      'Colour: crystal clear',
      'Eco-friendly',
      'Unique design',
    ],
  },
  {
    id: 'og-vino-vibe',
    name: 'ReSip Mid Wine Bottle Glass',
    price: 325,
    glassSetPricing: { format: '24', setOf2: 325, setOf4: 650 },
    category: 'Upcycled Glass',
    image:
      'https://static.wixstatic.com/media/7dc839_585a68965247433990972e7e7b07f574~mv2.png',
    description:
      'Compact wine-bottle tumbler—olive-green tone, ideal for water, tonic, or wine service.',
    story:
      'The ReSip Mid Wine Bottle Glass gives shorter wine bottle stock a refined second act.\n\nRicher storytelling to follow with your images.',
    features: [
      'Hand cut',
      'Volume: 250ml (~8.45 oz)',
      'Polished rim',
      'Colour: olive green',
      'Eco-friendly',
      'Unique design',
    ],
  },
  {
    id: 'og-royal-shotlet',
    name: 'ReSip Antiquity Bottle Shots',
    price: 499,
    glassSetPricing: { format: '612', setOf6: 499, setOf12: 999 },
    category: 'Shots',
    image:
      'https://static.wixstatic.com/media/7dc839_32461ad137634e9d88d9e2d2e5b7ef20~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/7dc839_32461ad137634e9d88d9e2d2e5b7ef20~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_d98ce8ba225441ea9810c5c0b1fb0be7~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_131459b03e91406bb50425694f66c20a~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_9b8ea71fd2714d9ebdc9a3147dcd1953~mv2.jpg',
    ],
    description:
      'Shot glass upcycled from Antiquity whisky bottles—royal blue punch for tastings and celebrations.',
    story:
      'Small but bold: the ReSip Antiquity Bottle Shots line is cut from Antiquity whisky glass for memorable toasts.\n\nFurther copy and photography pending.',
    features: [
      'Hand cut',
      'Volume: 60ml (~2 oz)',
      'Polished rim',
      'Colour: royal blue',
      'Eco-friendly',
      'Unique design',
    ],
  },
  {
    id: 'og-dessert-shotlet',
    name: 'ReSip Ranthambore Bottle Shots',
    price: 499,
    glassSetPricing: { format: '612', setOf6: 499, setOf12: 999 },
    category: 'Shots',
    image:
      'https://static.wixstatic.com/media/7dc839_4e4fd2b3586b4830a0256889716d5b96~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/7dc839_4e4fd2b3586b4830a0256889716d5b96~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_0b3807773ab849728cf467bbb4655456~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_f5b3812e21624d69be2c411cd5b1e5b7~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_1a59f4c4aaba483f8cdb17453a72e0d8~mv2.jpg',
    ],
    description:
      'Dessert and spirit shots upcycled from Royal Ranthambore whisky bottles.',
    story:
      'The ReSip Ranthambore Bottle Shots are sized for dessert pours, tastings, and gatherings.\n\nContent refresh planned alongside your assets.',
    features: [
      'Hand cut',
      'Volume: 60ml (~2 oz)',
      'Polished rim',
      'Colour: crystal clear',
      'Eco-friendly',
      'Unique design',
    ],
  },
  {
    id: 'og-greater-pour',
    name: 'ReSip Greater Than Bottle Glass',
    price: 499,
    glassSetPricing: { format: '24', setOf2: 499, setOf4: 999 },
    category: 'Upcycled Glass',
    image:
      'https://static.wixstatic.com/media/7dc839_5647ea02097547338357d8570d67ec53~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/7dc839_5647ea02097547338357d8570d67ec53~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_3cb5baf0655f478ab5b1033206dcc6d3~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_6ca81bc94d7948fcbc8c4fd52f206b8b~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_3bdbccbdfe4e4d9ebb63c5713b27f200~mv2.jpg',
    ],
    description:
      'Gin-forward tumbler upcycled from Greater Than gin bottles—clean profile for everyday sipping.',
    story:
      'The ReSip Greater Than Bottle Glass celebrates a conscious pour from rescued Greater Than bottles.\n\nFull brand story TBC.',
    features: [
      'Hand cut',
      'Volume: 350ml (12 oz)',
      'Polished rim',
      'Colour: crystal clear',
      'Eco-friendly',
      'Unique design',
    ],
  },
  {
    id: 'og-corocut',
    name: 'ReSip Corona Bottle Glass',
    price: 325,
    glassSetPricing: { format: '24', setOf2: 325, setOf4: 650 },
    category: 'Upcycled Glass',
    image:
      'https://static.wixstatic.com/media/7dc839_37314c31f305478a885bc328ec45cf32~mv2.png',
    description:
      'Relaxed tumbler upcycled from Corona longneck bottles—easy shape for everyday use.',
    whyChooseHeading: 'Why Choose Our ReSip Corona Bottle Glass?',
    story:
      'Corona bottles get a second life as the ReSip Corona Bottle Glass—laid-back, durable, and unmistakably ReSip.\n\nExtended marketing copy to follow.',
    features: [
      'Hand cut',
      'Volume: 250ml (~8.45 oz)',
      'Polished rim',
      'Colour: crystal clear',
      'Eco-friendly',
      'Unique design',
    ],
  },
  {
    id: 'og-resip-absolut-500ml-jar',
    name: 'ReSip Absolut Bottle jar',
    price: 925,
    glassSetPricing: { format: '24', setOf2: 925, setOf4: 1650 },
    category: 'Jars',
    image:
      'https://static.wixstatic.com/media/7dc839_bea9d46a2e644e40a89470800d1b198c~mv2.png',
    images: [
      'https://static.wixstatic.com/media/7dc839_bea9d46a2e644e40a89470800d1b198c~mv2.png',
      'https://static.wixstatic.com/media/7dc839_b2caa212cf9d42babcb578aae3d07b21~mv2.png',
      'https://static.wixstatic.com/media/7dc839_fc429b25960349f68998f215d411f506~mv2.png',
      'https://static.wixstatic.com/media/7dc839_70371b206cae4864b3f3e07bb1c41477~mv2.jpg',
    ],
    description:
      'Upcycled jar from Absolut Vodka bottles—generous capacity for pantry, bar, or display.',
    story:
      'The ReSip Absolut Bottle jar gives premium bottle glass a second life as storage you will actually use.\n\nFull story can grow with seasonal campaigns.',
    features: [
      'Hand cut & finished',
      '500ml source bottle',
      'Food-safe where applicable',
      'Eco-friendly',
      'Distinctive silhouette',
    ],
  },
  {
    id: 'og-resip-absolut-mid-350ml',
    name: 'ReSip Absolut Vodka Bottle Glass',
    price: 625,
    glassSetPricing: { format: '24', setOf2: 625, setOf4: 1250 },
    category: 'Upcycled Glass',
    image:
      'https://static.wixstatic.com/media/7dc839_72f14cad36c345e98c216c7143390909~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/7dc839_72f14cad36c345e98c216c7143390909~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_9b41b54960c246dc886ba6ffc77b88c8~mv2.png',
      'https://static.wixstatic.com/media/7dc839_09133859421c444295cdd0f820288404~mv2.png',
      'https://static.wixstatic.com/media/7dc839_e2fc63c50fa842d8b42d8940fb535b78~mv2.jpg',
    ],
    description:
      'Drinking glass upcycled from Absolut Vodka bottles—balanced pour for everyday use.',
    story:
      'ReSip Absolut Vodka Bottle Glass turns rescued bottles into refined tumblers.\n\nExpand copy with your launch campaigns.',
    features: [
      'Hand cut',
      'Food-safe finish',
      'Eco-friendly',
      'Crystal-clear Absolut glass',
      'Iconic bottle cues',
    ],
  },
  {
    id: 'og-resip-absolut-mini-180ml',
    name: 'ReSip Absolut mini jar',
    price: 325,
    glassSetPricing: { format: '24', setOf2: 325, setOf4: 650 },
    category: 'Upcycled Glass',
    image:
      'https://static.wixstatic.com/media/7dc839_64eb0cfdb22f4cdeb21261ca67c96076~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/7dc839_64eb0cfdb22f4cdeb21261ca67c96076~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_2ed5c72934e44ca383d16e91a643d2fb~mv2.png',
      'https://static.wixstatic.com/media/7dc839_8b8ba98fae6f4333ae0b91a09086549d~mv2.png',
      'https://static.wixstatic.com/media/7dc839_617f48bd756d453f94d1fb68177152ac~mv2.jpg',
    ],
    description:
      'Compact glass or mini jar from Absolut small-format bottles—ideal for tastings and small pours.',
    story:
      'The ReSip Absolut mini jar celebrates compact Absolut glass with zero waste left behind.',
    features: [
      'Hand cut',
      'Mini format',
      'Food-safe finish',
      'Eco-friendly',
      'Collectible scale',
    ],
  },
  {
    id: 'og-resip-budweiser-glass',
    name: 'ReSip Budweiser Bottle Glass',
    price: 399,
    glassSetPricing: { format: '24', setOf2: 399, setOf4: 799 },
    category: 'Upcycled Glass',
    image:
      'https://static.wixstatic.com/media/7dc839_561e9ee958ab4329abe449b0e0e25460~mv2.png',
    images: [
      'https://static.wixstatic.com/media/7dc839_561e9ee958ab4329abe449b0e0e25460~mv2.png',
      'https://static.wixstatic.com/media/7dc839_e550a967e2cf4e4b8c9bb857c4b6df96~mv2.png',
      'https://static.wixstatic.com/media/7dc839_119e058d98264ba3bcc07e9dd3e625c6~mv2.png',
      'https://static.wixstatic.com/media/7dc839_b6df9d7564d340c2acc9584cfd3b1d19~mv2.png',
    ],
    description:
      'Tumbler upcycled from Budweiser (Magnum line) bottles—bold beer heritage in glass form.',
    story:
      'ReSip Budweiser Bottle Glass brings diverted lager bottles back to the table with clarity and weight.',
    features: [
      'Hand cut',
      'Food-safe finish',
      'Eco-friendly',
      'Magnum bottle lineage',
      'Bar-ready silhouette',
    ],
  },
  {
    id: 'og-resip-old-monk-coffee-glass',
    name: 'ReSip Old Monk Coffee Bottle Glass',
    price: 449,
    glassSetPricing: { format: '24', setOf2: 449, setOf4: 899 },
    category: 'Upcycled Glass',
    image: PLACEHOLDER_GLASS,
    description:
      'Drinking glass upcycled from Old Monk coffee liqueur bottles—deep tone and coffee-house charm.',
    story:
      'The ReSip Old Monk Coffee Bottle Glass pairs the Old Monk story with coffee culture.\n\nReplace placeholder when final assets arrive.',
    features: [
      'Hand cut',
      'Food-safe finish',
      'Eco-friendly',
      'Placeholder imagery',
      'Story TBC',
    ],
  },
  {
    id: 'og-resip-ranthambore-tumbler',
    name: 'ReSip Ranthambore Bottle Glass',
    price: 499,
    glassSetPricing: { format: '24', setOf2: 499, setOf4: 999 },
    category: 'Upcycled Glass',
    image: PLACEHOLDER_GLASS,
    description:
      'Full-size tumbler upcycled from Royal Ranthambore whisky bottles—pair with our Ranthambore shot line.',
    story:
      'ReSip Ranthambore Bottle Glass complements the shot collection for a cohesive serve.\n\nImagery and narrative TBC.',
    features: [
      'Hand cut',
      'Food-safe finish',
      'Eco-friendly',
      'Placeholder imagery',
      'Story TBC',
    ],
  },
  {
    id: 'og-resip-old-monk-bowl',
    name: 'ReSip Old Monk Bowl',
    price: 425,
    glassSetPricing: { format: '24', setOf2: 425, setOf4: 850 },
    category: 'Gift Box (Matchbox, Coasters, Bowls)',
    image:
      'https://static.wixstatic.com/media/7dc839_b13da223244d474c8bea808e2f80ec19~mv2.png',
    images: [
      'https://static.wixstatic.com/media/7dc839_b13da223244d474c8bea808e2f80ec19~mv2.png',
      'https://static.wixstatic.com/media/7dc839_844b3f7b31b44f49ab91cb54730a1ac3~mv2.png',
      'https://static.wixstatic.com/media/7dc839_cd171363fb4f4ae0a0d1ee07fae21d57~mv2.png',
      'https://static.wixstatic.com/media/7dc839_44ef30afbb954603beb121bb233c196d~mv2.png',
    ],
    description:
      'Serving bowl from Old Monk bottle glass—snacks, nuts, or signature plating.',
    story:
      'The ReSip Old Monk Bowl widens the Old Monk story beyond the tumbler—perfect for shared bites.',
    features: [
      'Hand finished',
      'Food-safe where applicable',
      'Eco-friendly',
      'Statement serveware',
      'Heritage glass tone',
    ],
  },
  {
    id: 'og-resip-old-monk-face-glass',
    name: 'ReSip Old Monk Face Glass',
    price: 299,
    glassSetPricing: { format: '24', setOf2: 299, setOf4: 599 },
    category: 'Upcycled Glass',
    image:
      'https://static.wixstatic.com/media/7dc839_b39fe26b48f84764b328cc0703e60986~mv2.png',
    images: [
      'https://static.wixstatic.com/media/7dc839_b39fe26b48f84764b328cc0703e60986~mv2.png',
      'https://static.wixstatic.com/media/7dc839_196cbf58e9e44d0fac7caf92a268d833~mv2.png',
      'https://static.wixstatic.com/media/7dc839_9ae5dbe8c4394ddd8f55a6ebfe104284~mv2.png',
      'https://static.wixstatic.com/media/7dc839_1dad7c2cc41948a6b39718a824cdeb78~mv2.png',
    ],
    description:
      'Statement “face” cut glass from Old Monk stock—a signature silhouette for collectors.',
    story:
      'The ReSip Old Monk Face Glass highlights artisan cutting from familiar bottle cues.',
    features: [
      'Hand cut',
      'Food-safe finish',
      'Eco-friendly',
      'Collector silhouette',
      'Monk heritage detailing',
    ],
  },
  {
    id: '3',
    name: 'Scented Soy Candle',
    price: 1450,
    category: 'Scented Candles',
    image:
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
    beforeImage:
      'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800',
    description: 'Hand-poured soy wax in an upcycled glass container.',
    story:
      'This candle box was once a premium bottle, now housing a blend of essential oils and soy wax for a clean, sustainable burn.',
    features: ['Soy wax', 'Essential oils', 'Upcycled glass', '40+ hour burn time'],
  },
  {
    id: '4',
    name: 'Artisanal Jar',
    price: 800,
    category: 'Jars',
    image:
      'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&q=80&w=800',
    beforeImage:
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800',
    description: 'A beautiful storage jar for your kitchen or vanity.',
    story:
      'Part of our Jars line, these pieces are repurposed from unique bottle shapes to provide elegant storage solutions.',
    features: ['Airtic seal', 'Hand-finished', 'Sustainable', 'Unique silhouette'],
  },
];

export const CATEGORIES: Category[] = [
  { id: 'og', name: 'Upcycled Glass', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800' },
  { id: 'shots', name: 'Shots', image: 'https://images.unsplash.com/photo-1528823872057-9c018a7f07f9?auto=format&fit=crop&q=80&w=800' },
  { id: 'flame', name: 'Scented Candles', image: 'https://images.unsplash.com/photo-1566125882500-87e10f726cdc?auto=format&fit=crop&q=80&w=800' },
  { id: 'party', name: 'Party Gift Box', image: 'https://images.unsplash.com/photo-1528823872057-9c018a7f07f9?auto=format&fit=crop&q=80&w=800' },
  { id: 'corporate', name: 'Corporate Gift Box', image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&q=80&w=800' },
  { id: 'extras', name: 'Gift Box (Matchbox, Coasters, Bowls)', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800' },
  { id: 'vault', name: 'Jars', image: 'https://images.unsplash.com/photo-1527281405159-35d5b5aa7c1d?auto=format&fit=crop&q=80&w=800' },
];
