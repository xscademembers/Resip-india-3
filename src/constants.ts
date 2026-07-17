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
  /** Scented candle fragrance options shown on product detail. */
  fragrances?: string[];
  /** Extra charge (INR per set) for label with image. */
  labelImageSurcharge?: number;
  /** Override shared candle usage tips when a candle needs custom copy. */
  usageTips?: string[];
  /** When true, product is kept in catalog data but hidden from shop and detail pages. */
  hidden?: boolean;
}

/** Usage & safety tips shown on every scented candle product detail page. */
export const CANDLE_USAGE_TIPS = [
  'When using it for the first time, leave your candle burning until the entire surface is liquid.',
  'Afterward, use it for 2 to 3 hours at a time, making sure to trim the wick to 5 mm before each use.',
  'Never leave a burning candle unattended.',
  'Keep out of reach of children and animals.',
  'Do not drink.',
  'In case of skin contact: wash thoroughly with soap and water.',
  'Always leave at least 10 cm between each lit candle.',
  'Ventilate the room after each use.',
  'Avoid lighting your candle in a draft.',
] as const;

export function isCandleProduct(product: Product): boolean {
  return product.category === 'Scented Candles';
}

export function getCandleUsageTips(product: Product): readonly string[] {
  return product.usageTips ?? CANDLE_USAGE_TIPS;
}

export function isProductVisible(product: Product): boolean {
  return !product.hidden;
}

/** Products shown on shop, home, and product detail pages. */
export function getVisibleProducts(): Product[] {
  return PRODUCTS.filter(isProductVisible);
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

export type UpcycleProductGroup = 'glass' | 'shot' | 'bowl';

/** Upcycle sub-group: glasses, then shots, then bowls. */
export function getUpcycleProductGroup(product: Product): UpcycleProductGroup {
  const label = product.name.toLowerCase();
  if (label.includes('shot')) return 'shot';
  if (label.includes('bowl')) return 'bowl';
  return 'glass';
}

const UPCYCLE_GROUP_ORDER: Record<UpcycleProductGroup, number> = {
  glass: 0,
  shot: 1,
  bowl: 2,
};

const JAR_PRODUCT_ORDER = [
  'og-resip-absolut-500ml-jar',
  'og-resip-absolut-mini-180ml',
] as const;

const CANDLE_PRODUCT_ORDER = [
  'og-resip-scented-candle-1',
  'og-resip-scented-candle-2',
  'og-resip-scented-candle-3',
  'og-resip-scented-candle-4',
  'og-resip-scented-candle-5',
] as const;

/** Upcycle catalog order: glasses → shots → bowls. */
const UPCYCLE_PRODUCT_ORDER = [
  'og-sapphire-charm',
  'og-old-soul',
  'og-carribean-echo',
  'og-antique-luxe',
  'og-grape-glass',
  'og-the-gentlemen',
  'og-king-mid',
  'og-vino-vibe',
  'og-greater-pour',
  'og-corocut',
  'og-resip-absolut-mid-350ml',
  'og-resip-budweiser-glass',
  'og-resip-old-monk-coffee-glass',
  'og-resip-ranthambore-tumbler',
  'og-resip-old-monk-face-glass',
  'og-royal-shotlet',
  'og-dessert-shotlet',
  'og-resip-old-monk-bowl',
] as const;

export interface Category {
  id: string;
  name: string;
  image: string;
}

/** Profile URL for footer and home Instagram section. */
export const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/resip_india/';

/** Site-wide contact phone (display + click-to-call). */
export const CONTACT_PHONE = '+91 9146700770';
export const CONTACT_PHONE_TEL = 'tel:+919146700770';
export const CONTACT_EMAIL = 'hello@resipindia.com';
export const CONTACT_WHATSAPP_URL = 'https://wa.me/919146700770';

/** Return shipping address for customer care pages. */
export const RETURN_ADDRESS =
  'Manegaon Beda, Pohra Road, Tah- Lakhani, Dist- Bhandara, Maharashtra 441804';

/** Rotating promo line above the site header (all pages). */
export const ANNOUNCEMENT_MESSAGES = [
  'Free delivery on orders above ₹999',
  'Handcrafted upcycled glassware — made in India',
  'Eco-friendly packaging on every order',
  'Customisation is available for all products',
] as const;

/** Primary brand logo   header, footer, and favicon. */
export const BRAND_LOGO_SRC =
  'https://static.wixstatic.com/media/9356bd_a4f67380f1ee44fc85bbaddce42a4556~mv2.png';

export const BRAND_LOGO_HEADER_SRC = BRAND_LOGO_SRC;
export const BRAND_LOGO_FOOTER_SRC = BRAND_LOGO_SRC;

/** Footer trust badges   upcycle and Make in India. */
export const FOOTER_UPCYCLE_LOGO_SRC =
  'https://static.wixstatic.com/media/9356bd_5d6a139dc29c4143ad359a8615d47ac1~mv2.png';
export const FOOTER_MAKE_IN_INDIA_LOGO_SRC =
  'https://static.wixstatic.com/media/9356bd_3b1141848e5a4c8ba7a7cd298633fc15~mv2.png';

export interface MediaPartner {
  id: string;
  name: string;
  logo: string;
  image: string;
  url?: string;
}

/** Placeholder for collection cards not yet photographed. */
export const CATEGORY_COMING_SOON_IMAGE = '/images/category-coming-soon.svg';

/** Home page — "Our Media Partners" scrolling showcase. */
export const MEDIA_PARTNERS: MediaPartner[] = [
  {
    id: 'media-partner-1',
    name: 'Media Partner',
    logo: CATEGORY_COMING_SOON_IMAGE,
    image: 'https://static.wixstatic.com/media/9356bd_fbf501021476490d92d2929af633b251~mv2.jpeg',
  },
  {
    id: 'media-partner-2',
    name: 'Media Partner',
    logo: CATEGORY_COMING_SOON_IMAGE,
    image: 'https://static.wixstatic.com/media/9356bd_b3c4e7ce4a1f4278b1129f2f4da8f17c~mv2.jpeg',
  },
  {
    id: 'media-partner-3',
    name: 'Media Partner',
    logo: CATEGORY_COMING_SOON_IMAGE,
    image: 'https://static.wixstatic.com/media/9356bd_b6af70a4aec94b04aaeae5fb08c0166f~mv2.jpeg',
  },
  {
    id: 'media-partner-4',
    name: 'Media Partner',
    logo: CATEGORY_COMING_SOON_IMAGE,
    image: 'https://static.wixstatic.com/media/9356bd_cd7cf9d6aaa94140bf3ea63f02a25361~mv2.jpeg',
  },
];

/** Placeholder imagery until final assets are provided. */
const PLACEHOLDER_GLASS = 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800';

export const PRODUCTS: Product[] = [
  {
    id: 'og-sapphire-charm',
    name: 'ReSip Bombay Sapphire Bottle Glass',
    price: 499,
    glassSetPricing: { format: '24', setOf2: 499, setOf4: 999 },
    category: 'Upcycled Glasses',
    beforeImage:
      'https://static.wixstatic.com/media/9356bd_d7855bd374c74a3dbb4c3c0e95caf397~mv2.jpg',
    image:
      'https://static.wixstatic.com/media/7dc839_e43ac9fd179346bcae193b087049b0c7~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/7dc839_e43ac9fd179346bcae193b087049b0c7~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_9abcf6b7bfc44168b6cb148accf2f940~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_852461fdbcc44f08825cc39a08d6a7e8~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_c7886d407d5a42f49163699b75b95a3b~mv2.jpg',
    ],
    description:
      'Hand-cut drinking glass upcycled from Bombay Sapphire bottles premium sapphire-blue glass for everyday pours.',
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
    category: 'Upcycled Glasses',
    beforeImage:
      'https://static.wixstatic.com/media/9356bd_5be595388b024a70abc00252b71f24f0~mv2.jpg',
    image:
      'https://static.wixstatic.com/media/7dc839_6607b4de853b42e08cd5add136121056~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/7dc839_6607b4de853b42e08cd5add136121056~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_67a505f0d4824468aa6d03691ec5a540~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_ae0adeaa01214f15afcdf574b33471c0~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_4fe20fde41a94c6eb6134c274535a333~mv2.jpg',
    ],
    description:
      'Large-format tumbler upcycled from Old Monk bottles generous pour with unmistakable character.',
    story:
      'A once-used Old Monk bottle becomes a bold, functional ReSip Old Monk Bottle Glass sustainability with ritual and warmth.\n\nStory and full editorial copy can be expanded when your final content is ready.',
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
    category: 'Upcycled Glasses',
    beforeImage:
      'https://static.wixstatic.com/media/9356bd_9f9d6945bb6b4af5a4c8218e062c2f31~mv2.jpg',
    image:
      'https://static.wixstatic.com/media/7dc839_b5fbaef749c44f19966ea4832980a0b7~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/7dc839_b5fbaef749c44f19966ea4832980a0b7~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_0c794f96ccb349fb97749b0eacf754c6~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_67b5a3c809d94ce8a114386791c92374~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_a33620dba44e4417b0f5ede99f9c77b2~mv2.jpg',
    ],
    description:
      'Iconic tumbler upcycled from Bacardi bottles clean lines and a familiar silhouette.',
    story:
      'Collected Bacardi bottles are cut, smoothed, and finished into the ReSip Bacardi Bottle Glass ready for relaxed pours and conscious living.\n\nAdditional brand storytelling to follow.',
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
    category: 'Upcycled Glasses',
    beforeImage:
      'https://static.wixstatic.com/media/9356bd_cdd5721644174158945b2ac7afbc3863~mv2.jpg',
    image:
      'https://static.wixstatic.com/media/7dc839_90dc0b96ddc945b39cb4326a02506720~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/7dc839_90dc0b96ddc945b39cb4326a02506720~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_d316a95561fa4981b963f16d5069d538~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_3d76f5a737a74fcaae6960110ee8900a~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_90701fdddc5c4813ae0d10821ed0bb4b~mv2.jpg',
    ],
    description:
      'Elegant tumbler upcycled from Antiquity whisky bottles deep royal blue tone.',
    story:
      'Antiquity whisky bottles are reborn as the ReSip Antiquity Bottle Glass distinct colour and weight for elevated everyday use.\n\nLong-form story pending your final copy.',
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
    category: 'Upcycled Glasses',
    beforeImage:
      'https://static.wixstatic.com/media/9356bd_363a262f9724416fb27e058bb7e61180~mv2.jpg',
    image:
      'https://static.wixstatic.com/media/9356bd_6f0b2cac63c542d19c77b61cc288ab13~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/9356bd_6f0b2cac63c542d19c77b61cc288ab13~mv2.jpg',
      'https://static.wixstatic.com/media/9356bd_87e8c713c36941628686a3c968c75f05~mv2.jpg',
      'https://static.wixstatic.com/media/9356bd_af8329b247d74a9d8da063c7a610e5a2~mv2.jpg',
      'https://static.wixstatic.com/media/9356bd_c75f654abf4d4691af45cffd0a7be545~mv2.jpg',
    ],
    description:
      'Tumbler upcycled from wine bottles emerald green glow, perfect for cold brew and soft drinks.',
    story:
      'Wine bottles diverted from waste become the ReSip Wine Bottle Glass characterful colour from the source glass.\n\nEditorial expansion to follow.',
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
    category: 'Upcycled Glasses',
    beforeImage:
      'https://static.wixstatic.com/media/9356bd_c460c2389a874c66bd79cb5473838970~mv2.jpg',
    image:
      'https://static.wixstatic.com/media/9356bd_18644e201a394bbd9bfb0b3076c979ea~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/9356bd_18644e201a394bbd9bfb0b3076c979ea~mv2.jpg',
      'https://static.wixstatic.com/media/9356bd_529a9bbd2acb46d7a821918339724ce8~mv2.jpg',
      'https://static.wixstatic.com/media/9356bd_e05ad628c402417eb4acc339bb094931~mv2.jpg',
      'https://static.wixstatic.com/media/9356bd_39641118c53840c1abd8e283d45dc92c~mv2.jpg',
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
    category: 'Upcycled Glasses',
    beforeImage:
      'https://static.wixstatic.com/media/9356bd_6c977076c59b4a46a23c0f50d2328353~mv2.jpg',
    image:
      'https://static.wixstatic.com/media/7dc839_ae062dea37e14e528f2db811d8064311~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/7dc839_ae062dea37e14e528f2db811d8064311~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_1a4216d215fe413892795280f4fa89ec~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_153597c3fdd541788170a5eff2206cac~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_e6038534cc2b4163b1b14a942e973286~mv2.jpg',
    ],
    description:
      'Beer-bottle tumbler upcycled from Kingfisher glass effortless craft-beer moments.',
    story:
      'Kingfisher bottles are transformed into the ReSip Kingfisher Bottle Glass a familiar shape with a sustainable second life.\n\nExtended copy TBC.',
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
    category: 'Upcycled Glasses',
    beforeImage:
      'https://static.wixstatic.com/media/9356bd_363a262f9724416fb27e058bb7e61180~mv2.jpg',
    image:
      'https://static.wixstatic.com/media/9356bd_d953a4602556435791d51a8160011164~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/9356bd_d953a4602556435791d51a8160011164~mv2.jpg',
      'https://static.wixstatic.com/media/9356bd_8f7c52acade44c448e6ea7176633e9df~mv2.jpg',
      'https://static.wixstatic.com/media/9356bd_40302ffc98184ad3b777851b4cf5ff42~mv2.jpg',
      'https://static.wixstatic.com/media/9356bd_b9278efd5a264ef998d0717d58b6b789~mv2.jpg',
    ],
    description:
      'Compact wine-bottle tumbler olive-green tone, ideal for water, tonic, or wine service.',
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
    category: 'Upcycled Glasses',
    image:
      'https://static.wixstatic.com/media/9356bd_387e6fd431ae4bfd85e5ed5c74314167~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/9356bd_387e6fd431ae4bfd85e5ed5c74314167~mv2.jpg',
      'https://static.wixstatic.com/media/9356bd_f91aeb3afb634ce5a5e4cfe2b6aa4292~mv2.jpg',
      'https://static.wixstatic.com/media/9356bd_2c23e5e8a58046b1aff4b461bd98dff9~mv2.jpg',
      'https://static.wixstatic.com/media/9356bd_3ca58910dad34724a18561f18fbedd82~mv2.jpg',
    ],
    description:
      'Shot glass upcycled from Antiquity whisky bottles royal blue punch for tastings and celebrations.',
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
    category: 'Upcycled Glasses',
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
    category: 'Upcycled Glasses',
    beforeImage:
      'https://static.wixstatic.com/media/9356bd_6552424fe99f44768b8e7f4b2860ad6a~mv2.jpg',
    image:
      'https://static.wixstatic.com/media/7dc839_5647ea02097547338357d8570d67ec53~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/7dc839_5647ea02097547338357d8570d67ec53~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_3cb5baf0655f478ab5b1033206dcc6d3~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_6ca81bc94d7948fcbc8c4fd52f206b8b~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_3bdbccbdfe4e4d9ebb63c5713b27f200~mv2.jpg',
    ],
    description:
      'Gin-forward tumbler upcycled from Greater Than gin bottles clean profile for everyday sipping.',
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
    category: 'Upcycled Glasses',
    beforeImage:
      'https://static.wixstatic.com/media/9356bd_090da3102faf47cf8bf107544f9dd049~mv2.jpg',
    image:
      'https://static.wixstatic.com/media/9356bd_4e22bcb4ef5e4c1692432f834ff04421~mv2.png',
    images: [
      'https://static.wixstatic.com/media/9356bd_4e22bcb4ef5e4c1692432f834ff04421~mv2.png',
      'https://static.wixstatic.com/media/9356bd_a7b7688fb2614041802dc6f3e8488a6b~mv2.png',
      'https://static.wixstatic.com/media/9356bd_ab937ecfdd1e4b329475807edf1eeecf~mv2.png',
      'https://static.wixstatic.com/media/9356bd_c2506012f7df4d47b55bb1b3fa0a3ae8~mv2.png',
    ],
    description:
      'Relaxed tumbler upcycled from Corona longneck bottles easy shape for everyday use.',
    whyChooseHeading: 'Why Choose Our ReSip Corona Bottle Glass?',
    story:
      'Corona bottles get a second life as the ReSip Corona Bottle Glass laid-back, durable, and unmistakably ReSip.\n\nExtended marketing copy to follow.',
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
    category: 'Upcycled Jar',
    beforeImage:
      'https://static.wixstatic.com/media/9356bd_7ba73eec14ae4e9c90fdfb6d72bb2185~mv2.jpg',
    image:
      'https://static.wixstatic.com/media/7dc839_bea9d46a2e644e40a89470800d1b198c~mv2.png',
    images: [
      'https://static.wixstatic.com/media/7dc839_bea9d46a2e644e40a89470800d1b198c~mv2.png',
      'https://static.wixstatic.com/media/7dc839_b2caa212cf9d42babcb578aae3d07b21~mv2.png',
      'https://static.wixstatic.com/media/7dc839_fc429b25960349f68998f215d411f506~mv2.png',
      'https://static.wixstatic.com/media/7dc839_70371b206cae4864b3f3e07bb1c41477~mv2.jpg',
    ],
    description:
      'Upcycled jar from Absolut Vodka bottles generous capacity for pantry, bar, or display.',
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
    category: 'Upcycled Glasses',
    image:
      'https://static.wixstatic.com/media/7dc839_72f14cad36c345e98c216c7143390909~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/7dc839_72f14cad36c345e98c216c7143390909~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_9b41b54960c246dc886ba6ffc77b88c8~mv2.png',
      'https://static.wixstatic.com/media/7dc839_09133859421c444295cdd0f820288404~mv2.png',
      'https://static.wixstatic.com/media/7dc839_e2fc63c50fa842d8b42d8940fb535b78~mv2.jpg',
    ],
    description:
      'Drinking glass upcycled from Absolut Vodka bottles balanced pour for everyday use.',
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
    category: 'Upcycled Jar',
    beforeImage:
      'https://static.wixstatic.com/media/9356bd_b53e11c91f274160b4d65120a8f26572~mv2.jpg',
    image:
      'https://static.wixstatic.com/media/7dc839_64eb0cfdb22f4cdeb21261ca67c96076~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/7dc839_64eb0cfdb22f4cdeb21261ca67c96076~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_2ed5c72934e44ca383d16e91a643d2fb~mv2.png',
      'https://static.wixstatic.com/media/7dc839_8b8ba98fae6f4333ae0b91a09086549d~mv2.png',
      'https://static.wixstatic.com/media/7dc839_617f48bd756d453f94d1fb68177152ac~mv2.jpg',
    ],
    description:
      'Compact glass or mini jar from Absolut small-format bottles ideal for tastings and small pours.',
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
    category: 'Upcycled Glasses',
    beforeImage:
      'https://static.wixstatic.com/media/9356bd_1d2ee35ba1ce484491b1bee1a68cfdbd~mv2.jpg',
    image:
      'https://static.wixstatic.com/media/7dc839_561e9ee958ab4329abe449b0e0e25460~mv2.png',
    images: [
      'https://static.wixstatic.com/media/7dc839_561e9ee958ab4329abe449b0e0e25460~mv2.png',
      'https://static.wixstatic.com/media/7dc839_e550a967e2cf4e4b8c9bb857c4b6df96~mv2.png',
      'https://static.wixstatic.com/media/7dc839_119e058d98264ba3bcc07e9dd3e625c6~mv2.png',
      'https://static.wixstatic.com/media/7dc839_b6df9d7564d340c2acc9584cfd3b1d19~mv2.png',
    ],
    description:
      'Tumbler upcycled from Budweiser (Magnum line) bottles bold beer heritage in glass form.',
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
    hidden: true,
    price: 449,
    glassSetPricing: { format: '24', setOf2: 449, setOf4: 899 },
    category: 'Upcycled Glasses',
    beforeImage:
      'https://static.wixstatic.com/media/9356bd_5be595388b024a70abc00252b71f24f0~mv2.jpg',
    image:
      'https://static.wixstatic.com/media/9356bd_2a1e3905802d425a99d10c70ada4dd59~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/9356bd_2a1e3905802d425a99d10c70ada4dd59~mv2.jpg',
      'https://static.wixstatic.com/media/9356bd_7f8ca3a5059141bc8804d96178504f07~mv2.jpg',
      'https://static.wixstatic.com/media/9356bd_72b7de2386ec491a9f3c01d436f6bb71~mv2.jpg',
      'https://static.wixstatic.com/media/9356bd_a5f49a1b9905464bb32d3d202d892678~mv2.jpg',
    ],
    description:
      'Drinking glass upcycled from Old Monk coffee liqueur bottles deep tone and coffee-house charm.',
    story:
      'The ReSip Old Monk Coffee Bottle Glass pairs the Old Monk story with coffee culture rescued bottles transformed into textured tumblers with unmistakable heritage character.',
    features: [
      'Hand cut',
      'Food-safe finish',
      'Eco-friendly',
      'Polished rim',
      'Unique design',
    ],
  },
  {
    id: 'og-resip-ranthambore-tumbler',
    name: 'ReSip Ranthambore Bottle Glass',
    price: 499,
    glassSetPricing: { format: '24', setOf2: 499, setOf4: 999 },
    category: 'Upcycled Glasses',
    beforeImage:
      'https://static.wixstatic.com/media/9356bd_09eeee3e17394a0a8485fcb2f9ca4136~mv2.jpg',
    image:
      'https://static.wixstatic.com/media/9356bd_e7efab05bfc14a29b5845d95e8369d77~mv2.png',
    images: [
      'https://static.wixstatic.com/media/9356bd_e7efab05bfc14a29b5845d95e8369d77~mv2.png',
      'https://static.wixstatic.com/media/9356bd_f8b89d977147414c99c511e97ecdf50a~mv2.png',
      'https://static.wixstatic.com/media/9356bd_6779764a01134884b3bb63e94ee87eee~mv2.jpg',
      'https://static.wixstatic.com/media/9356bd_dbbaf60d8d9e4a04acbbef1e1fe4226e~mv2.png',
    ],
    description:
      'Full-size tumbler upcycled from Royal Ranthambore whisky bottles pair with our Ranthambore shot line.',
    story:
      'ReSip Ranthambore Bottle Glass complements the shot collection for a cohesive serve.\n\nImagery and narrative TBC.',
    features: [
      'Hand cut',
      'Food-safe finish',
      'Eco-friendly',
      'Polished rim',
      'Unique design',
    ],
  },
  {
    id: 'og-resip-old-monk-bowl',
    name: 'ReSip Old Monk Bowl',
    price: 425,
    glassSetPricing: { format: '24', setOf2: 425, setOf4: 850 },
    category: 'Upcycled Glasses',
    beforeImage:
      'https://static.wixstatic.com/media/9356bd_5be595388b024a70abc00252b71f24f0~mv2.jpg',
    image:
      'https://static.wixstatic.com/media/7dc839_b13da223244d474c8bea808e2f80ec19~mv2.png',
    images: [
      'https://static.wixstatic.com/media/7dc839_b13da223244d474c8bea808e2f80ec19~mv2.png',
      'https://static.wixstatic.com/media/7dc839_844b3f7b31b44f49ab91cb54730a1ac3~mv2.png',
      'https://static.wixstatic.com/media/7dc839_cd171363fb4f4ae0a0d1ee07fae21d57~mv2.png',
      'https://static.wixstatic.com/media/7dc839_44ef30afbb954603beb121bb233c196d~mv2.png',
    ],
    description:
      'Serving bowl from Old Monk bottle glass snacks, nuts, or signature plating.',
    story:
      'The ReSip Old Monk Bowl widens the Old Monk story beyond the tumbler perfect for shared bites.',
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
    category: 'Upcycled Glasses',
    beforeImage:
      'https://static.wixstatic.com/media/9356bd_44cb613dd8ee4e958e31c21c19bb1a1a~mv2.jpg',
    image:
      'https://static.wixstatic.com/media/7dc839_b39fe26b48f84764b328cc0703e60986~mv2.png',
    images: [
      'https://static.wixstatic.com/media/7dc839_b39fe26b48f84764b328cc0703e60986~mv2.png',
      'https://static.wixstatic.com/media/7dc839_196cbf58e9e44d0fac7caf92a268d833~mv2.png',
      'https://static.wixstatic.com/media/7dc839_9ae5dbe8c4394ddd8f55a6ebfe104284~mv2.png',
      'https://static.wixstatic.com/media/7dc839_1dad7c2cc41948a6b39718a824cdeb78~mv2.png',
    ],
    description:
      'Statement “face” cut glass from Old Monk stock a signature silhouette for collectors.',
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
    id: 'og-resip-scented-candle-1',
    name: 'ReSip Scented Candle 1',
    price: 449,
    glassSetPricing: { format: '24', setOf2: 449, setOf4: 849 },
    category: 'Scented Candles',
    image:
      'https://static.wixstatic.com/media/9356bd_3b1d93630b284503b032a2cb5b0505ce~mv2.png',
    images: [
      'https://static.wixstatic.com/media/9356bd_3b1d93630b284503b032a2cb5b0505ce~mv2.png',
      'https://static.wixstatic.com/media/9356bd_ced3b40f903146d3bdc1e2ebe55acb4e~mv2.jpg',
    ],
    description:
      'Hand-poured scented candle in an upcycled wine bottle natural soy wax with a clean, long burn.',
    whyChooseHeading: 'Why Choose Our ReSip Scented Candles?',
    story:
      'ReSip Scented Candles give rescued wine bottles a calm second life poured with natural soy wax and a cotton wick for a warm, non-toxic glow at home.\n\nEach set lets you pick your fragrance and label style so every candle feels personal.',
    features: [
      'Made from upcycled wine bottle',
      'Format: 250gm · ~65h burn',
      'Natural soy wax',
      '100% cotton wick',
      'Non-toxic & safe',
      'Choose your fragrance',
    ],
    fragrances: ['Lemon', 'Raat Rani', 'Rose', 'Aqua', 'Mogra'],
    labelImageSurcharge: 25,
  },
  {
    id: 'og-resip-scented-candle-2',
    name: 'ReSip Scented Candle 2',
    price: 449,
    glassSetPricing: { format: '24', setOf2: 449, setOf4: 849 },
    category: 'Scented Candles',
    image:
      'https://static.wixstatic.com/media/9356bd_79b911e9c6824521a2a06309ab10ac8d~mv2.png',
    images: [
      'https://static.wixstatic.com/media/9356bd_79b911e9c6824521a2a06309ab10ac8d~mv2.png',
      'https://static.wixstatic.com/media/9356bd_711c47ea360943e98679f1a4fccd618c~mv2.jpg',
    ],
    description:
      'Hand-poured scented candle in an upcycled beer bottle natural soy wax with a warm, long burn.',
    whyChooseHeading: 'Why Choose Our ReSip Scented Candles?',
    story:
      'ReSip Scented Candle 2 turns rescued beer bottles into ambient light poured with natural soy wax and a cotton wick for a cozy, non-toxic glow.\n\nPick your fragrance and label style to make each set your own.',
    features: [
      'Made from upcycled beer bottle',
      'Format: 200gm · ~60h burn',
      'Natural soy wax',
      '100% cotton wick',
      'Non-toxic & safe',
      'Choose your fragrance',
    ],
    fragrances: ['Coco', 'Coffee'],
    labelImageSurcharge: 25,
  },
  {
    id: 'og-resip-scented-candle-3',
    name: 'ReSip Scented Candle 3',
    price: 349,
    glassSetPricing: { format: '24', setOf2: 349, setOf4: 649 },
    category: 'Scented Candles',
    image:
      'https://static.wixstatic.com/media/9356bd_cbf80fc4f00c4113ab61aa39b0f7ea7c~mv2.png',
    images: [
      'https://static.wixstatic.com/media/9356bd_cbf80fc4f00c4113ab61aa39b0f7ea7c~mv2.png',
      'https://static.wixstatic.com/media/9356bd_0d48bb17ef10431db70f991b47113c2f~mv2.png',
    ],
    description:
      'Hand-poured scented candle in an upcycled wine bottle with a sculpted face silhouette natural soy wax with a warm, long burn.',
    whyChooseHeading: 'Why Choose Our ReSip Scented Candles?',
    story:
      'ReSip Scented Candle 3 pairs artisan glass character with a calm pour rescued wine bottles shaped into a distinctive silhouette, filled with natural soy wax and a cotton wick.\n\nChoose your fragrance and label style to make every set feel personal.',
    features: [
      'Made from upcycled wine bottle',
      'Format: 180gm · ~55h burn',
      'Natural soy wax',
      '100% cotton wick',
      'Non-toxic & safe',
      'Choose your fragrance',
    ],
    fragrances: ['Lemon', 'Raat Rani', 'Rose', 'Aqua', 'Mogra'],
    labelImageSurcharge: 25,
  },
  {
    id: 'og-resip-scented-candle-4',
    name: 'ReSip Scented Candle 4',
    price: 549,
    glassSetPricing: { format: '24', setOf2: 549, setOf4: 1049 },
    category: 'Scented Candles',
    image:
      'https://static.wixstatic.com/media/9356bd_1cd4a95dd2f0416da98fdaabdefcc507~mv2.png',
    images: [
      'https://static.wixstatic.com/media/9356bd_1cd4a95dd2f0416da98fdaabdefcc507~mv2.png',
      'https://static.wixstatic.com/media/9356bd_ccc3a6d2f7af4484a6bb751df2012400~mv2.png',
    ],
    description:
      'Hand-poured scented candle in an upcycled wine bottle with floral wax detailing natural soy wax with a warm, long burn.',
    whyChooseHeading: 'Why Choose Our ReSip Scented Candles?',
    story:
      'ReSip Scented Candle 4 brings a decorative touch to rescued wine bottles poured with natural soy wax, finished with floral wax accents, and lit with a cotton wick for a cozy glow.\n\nChoose your fragrance and label style to make every set feel personal.',
    features: [
      'Made from upcycled wine bottle',
      'Format: 250gm · ~65h burn',
      'Natural soy wax',
      '100% cotton wick',
      'Non-toxic & safe',
      'Choose your fragrance',
    ],
    fragrances: ['Lemon', 'Raat Rani', 'Rose', 'Aqua', 'Mogra'],
    labelImageSurcharge: 25,
  },
  {
    id: 'og-resip-scented-candle-5',
    name: 'ReSip Scented Candle 5',
    price: 449,
    glassSetPricing: { format: '24', setOf2: 449, setOf4: 849 },
    category: 'Scented Candles',
    image:
      'https://static.wixstatic.com/media/9356bd_ba0dbefe4fe744799b24038a4d672c95~mv2.png',
    images: [
      'https://static.wixstatic.com/media/9356bd_ba0dbefe4fe744799b24038a4d672c95~mv2.png',
      'https://static.wixstatic.com/media/9356bd_3ee1c796b852485cb8bae573874c8059~mv2.png',
    ],
    description:
      'Hand-poured scented candle in an upcycled wine bottle natural soy wax with a clean, long burn.',
    whyChooseHeading: 'Why Choose Our ReSip Scented Candles?',
    story:
      'ReSip Scented Candle 5 gives rescued wine bottles a calm second life poured with natural soy wax and a cotton wick for a warm, non-toxic glow at home.\n\nEach set lets you pick your fragrance and label style so every candle feels personal.',
    features: [
      'Made from upcycled wine bottle',
      'Format: 150gm · ~45h burn',
      'Natural soy wax',
      '100% cotton wick',
      'Non-toxic & safe',
      'Choose your fragrance',
    ],
    fragrances: ['Lemon', 'Raat Rani', 'Rose', 'Aqua', 'Mogra'],
    labelImageSurcharge: 25,
  },
];

function compareUpcycleProducts(a: Product, b: Product): number {
  const order = new Map<string, number>(UPCYCLE_PRODUCT_ORDER.map((id, i) => [id, i]));
  const groupDiff =
    UPCYCLE_GROUP_ORDER[getUpcycleProductGroup(a)] -
    UPCYCLE_GROUP_ORDER[getUpcycleProductGroup(b)];
  if (groupDiff !== 0) return groupDiff;
  return (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999);
}

/** Sort products for shop grids (Upcycle: glass → shot → bowl; Jar: catalog order). */
export function sortProductsForShop(products: Product[], category: string): Product[] {
  const catalogIndex = new Map(PRODUCTS.map((p, i) => [p.id, i]));

  if (category === 'Upcycled Glasses') {
    return [...products].sort(compareUpcycleProducts);
  }

  if (category === 'All') {
    return [...products].sort((a, b) => {
      if (a.category === 'Upcycled Glasses' && b.category === 'Upcycled Glasses') {
        return compareUpcycleProducts(a, b);
      }
      return (catalogIndex.get(a.id) ?? 0) - (catalogIndex.get(b.id) ?? 0);
    });
  }

  if (category === 'Upcycled Jar') {
    const jarOrder = new Map<string, number>(JAR_PRODUCT_ORDER.map((id, i) => [id, i]));
    return [...products].sort(
      (a, b) => (jarOrder.get(a.id) ?? 99) - (jarOrder.get(b.id) ?? 99)
    );
  }

  if (category === 'Scented Candles') {
    const candleOrder = new Map<string, number>(CANDLE_PRODUCT_ORDER.map((id, i) => [id, i]));
    return [...products].sort(
      (a, b) => (candleOrder.get(a.id) ?? 99) - (candleOrder.get(b.id) ?? 99)
    );
  }

  return products;
}

export const CATEGORIES: Category[] = [
  { id: 'og', name: 'Upcycled Glasses', image: 'https://static.wixstatic.com/media/9356bd_d66b706b85a14615af7895c609e6f96b~mv2.jpeg' },
  { id: 'vault', name: 'Upcycled Jar', image: 'https://static.wixstatic.com/media/9356bd_27cfc95a85fa4d27a6e441f425046885~mv2.png' },
  { id: 'flame', name: 'Scented Candles', image: 'https://static.wixstatic.com/media/9356bd_3853e6320bdc4f99b492c1e7bc429244~mv2.jpg' },
  { id: 'party', name: 'Party Box', image: CATEGORY_COMING_SOON_IMAGE },
  { id: 'candle-box', name: 'Candle Box', image: CATEGORY_COMING_SOON_IMAGE },
  { id: 'corporate', name: 'Corporate Box', image: CATEGORY_COMING_SOON_IMAGE },
];

/** Shop filter pills   always matches {@link CATEGORIES} order. */
export const SHOP_CATEGORY_FILTERS = ['All', ...CATEGORIES.map((c) => c.name)] as const;

/** Resolve `?category=` query value to a valid shop filter label. */
export function resolveShopCategory(param: string | null): string {
  if (!param) return 'All';
  if ((SHOP_CATEGORY_FILTERS as readonly string[]).includes(param)) return param;
  return 'All';
}

/** Shop URL for a collection filter (`All` → `/shop`). */
export function getShopCategoryPath(category: string): string {
  if (category === 'All') return '/shop';
  return `/shop?category=${encodeURIComponent(category)}`;
}

/** Gallery page   still photos from the ReSip workshop and events. */
export const GALLERY_IMAGES: string[] = [
  'https://static.wixstatic.com/media/9356bd_e30f9bad456049d28277b5806c843429~mv2.jpg',
  'https://static.wixstatic.com/media/9356bd_347b8ffa322e47a5b143ec09f73af2f5~mv2.jpg',
  'https://static.wixstatic.com/media/9356bd_ae5987478bbe48dda292be427f2ed48f~mv2.jpg',
  'https://static.wixstatic.com/media/9356bd_a73e2f2f7c3b4e70b03863d5b41ba505~mv2.jpg',
  'https://static.wixstatic.com/media/9356bd_3cdbc17a22364abaa98c6d7a8e51e962~mv2.jpg',
  'https://static.wixstatic.com/media/9356bd_18fa4125d2ec4f42b332cd14962bb04e~mv2.jpg',
  'https://static.wixstatic.com/media/9356bd_405d1034fac6429e9cb8f461ab100a55~mv2.png',
  'https://static.wixstatic.com/media/9356bd_bc1de3abc0314692bf309f82673c46ba~mv2.png',
  'https://static.wixstatic.com/media/9356bd_913a42218ea44d25bdc5684ccdfa0fe0~mv2.png',
  'https://static.wixstatic.com/media/9356bd_8c3379d63d834beb8f1389530a1547b7~mv2.png',
  'https://static.wixstatic.com/media/9356bd_6d3d11e11d2d4b989e9907e67c3bc24b~mv2.png',
  'https://static.wixstatic.com/media/9356bd_4618cd9e756943ddb9aa2c2dbf968041~mv2.png',
  'https://static.wixstatic.com/media/9356bd_f322c680da9a489cbe48cc07afeaea9a~mv2.jpg',
  'https://static.wixstatic.com/media/9356bd_f761273dadd7444da8afd8f910d71096~mv2.png',
  'https://static.wixstatic.com/media/9356bd_b64db589f83941e2b140637c2b7ab28f~mv2.png',
];

/** Gallery page   workshop and event videos. */
export const GALLERY_VIDEOS: string[] = [];
