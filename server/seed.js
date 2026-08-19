/**
 * Database Seeder   migrates existing product data from constants.ts into MongoDB.
 * 
 * Run: node server/seed.js
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local'), override: true });
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Inventory = require('./models/Inventory');
const Settings = require('./models/Settings');
const Banner = require('./models/Banner');

// ─── Seed Data ──────────────────────────────────────

const CATEGORIES_SEED = [
  { legacyId: 'og', name: 'Upcycled Glasses', image: 'https://static.wixstatic.com/media/9356bd_d66b706b85a14615af7895c609e6f96b~mv2.jpeg', sortOrder: 1 },
  { legacyId: 'vault', name: 'Upcycled Jar', image: 'https://static.wixstatic.com/media/9356bd_27cfc95a85fa4d27a6e441f425046885~mv2.png', sortOrder: 2 },
  { legacyId: 'flame', name: 'Scented Candles', image: 'https://static.wixstatic.com/media/9356bd_3853e6320bdc4f99b492c1e7bc429244~mv2.jpg', sortOrder: 3 },
  { legacyId: 'party', name: 'Party Box', image: '/images/category-coming-soon.svg', sortOrder: 4 },
  { legacyId: 'candle-box', name: 'Candle Box', image: '/images/category-coming-soon.svg', sortOrder: 5 },
  { legacyId: 'corporate', name: 'Corporate Box', image: '/images/category-coming-soon.svg', sortOrder: 6 },
];

const PRODUCTS_SEED = [
  {
    legacyId: 'og-sapphire-charm',
    name: 'ReSip Bombay Sapphire Bottle Glass',
    price: 499,
    categoryName: 'Upcycled Glasses',
    glassSetPricing: { format: '24', setOf2: 499, setOf4: 999 },
    beforeImage: 'https://static.wixstatic.com/media/9356bd_d7855bd374c74a3dbb4c3c0e95caf397~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/7dc839_e43ac9fd179346bcae193b087049b0c7~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_9abcf6b7bfc44168b6cb148accf2f940~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_852461fdbcc44f08825cc39a08d6a7e8~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_c7886d407d5a42f49163699b75b95a3b~mv2.jpg',
    ],
    description: 'Hand-cut drinking glass upcycled from Bombay Sapphire bottles premium sapphire-blue glass for everyday pours.',
    story: 'ReSip India rescues Bombay Sapphire bottles from bars, cafés, and restaurants and transforms them into reusable drinkware.\n\nEach ReSip Bombay Sapphire Bottle Glass carries a story of transformation: discarded bottle to bold, food-safe tumbler.',
    features: ['Hand cut', 'Volume: 350ml (12 oz)', 'Polished rim', 'Colour: sapphire blue', 'Eco-friendly', 'Unique design'],
    stock: 100, isFeatured: true, sortOrder: 1,
  },
  {
    legacyId: 'og-old-soul',
    name: 'ReSip Old Monk Bottle Glass',
    price: 599,
    categoryName: 'Upcycled Glasses',
    glassSetPricing: { format: '24', setOf2: 599, setOf4: 1099 },
    beforeImage: 'https://static.wixstatic.com/media/9356bd_5be595388b024a70abc00252b71f24f0~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/7dc839_6607b4de853b42e08cd5add136121056~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_67a505f0d4824468aa6d03691ec5a540~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_ae0adeaa01214f15afcdf574b33471c0~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_4fe20fde41a94c6eb6134c274535a333~mv2.jpg',
    ],
    description: 'Large-format tumbler upcycled from Old Monk bottles generous pour with unmistakable character.',
    story: 'A once-used Old Monk bottle becomes a bold, functional ReSip Old Monk Bottle Glass sustainability with ritual and warmth.',
    features: ['Hand cut', 'Volume: 600ml (~20 oz)', 'Polished rim', 'Colour: crystal clear', 'Eco-friendly', 'Unique design'],
    stock: 100, isFeatured: true, sortOrder: 2,
  },
  {
    legacyId: 'og-carribean-echo',
    name: 'ReSip Bacardi Bottle Glass',
    price: 399,
    categoryName: 'Upcycled Glasses',
    glassSetPricing: { format: '24', setOf2: 399, setOf4: 799 },
    beforeImage: 'https://static.wixstatic.com/media/9356bd_9f9d6945bb6b4af5a4c8218e062c2f31~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/7dc839_b5fbaef749c44f19966ea4832980a0b7~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_0c794f96ccb349fb97749b0eacf754c6~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_67b5a3c809d94ce8a114386791c92374~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_a33620dba44e4417b0f5ede99f9c77b2~mv2.jpg',
    ],
    description: 'Iconic tumbler upcycled from Bacardi bottles clean lines and a familiar silhouette.',
    story: 'Collected Bacardi bottles are cut, smoothed, and finished into the ReSip Bacardi Bottle Glass ready for relaxed pours and conscious living.',
    features: ['Hand cut', 'Volume: 350ml (12 oz)', 'Polished rim', 'Colour: crystal clear', 'Eco-friendly', 'Unique design'],
    stock: 100, isFeatured: true, sortOrder: 3,
  },
  {
    legacyId: 'og-antique-luxe',
    name: 'ReSip Antiquity Bottle Glass',
    price: 499,
    categoryName: 'Upcycled Glasses',
    glassSetPricing: { format: '24', setOf2: 499, setOf4: 999 },
    beforeImage: 'https://static.wixstatic.com/media/9356bd_cdd5721644174158945b2ac7afbc3863~mv2.jpg',
    images: [
      'https://static.wixstatic.com/media/7dc839_90dc0b96ddc945b39cb4326a02506720~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_d316a95561fa4981b963f16d5069d538~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_3d76f5a737a74fcaae6960110ee8900a~mv2.jpg',
      'https://static.wixstatic.com/media/7dc839_90701fdddc5c4813ae0d10821ed0bb4b~mv2.jpg',
    ],
    description: 'Elegant tumbler upcycled from Antiquity whisky bottles deep royal blue tone.',
    story: 'Antiquity whisky bottles are reborn as the ReSip Antiquity Bottle Glass distinct colour and weight for elevated everyday use.',
    features: ['Hand cut', 'Volume: 400ml (~13.5 oz)', 'Polished rim', 'Colour: royal blue', 'Eco-friendly', 'Unique design'],
    stock: 100, isFeatured: true, sortOrder: 4,
  },
  // Additional products with minimal data (using same structure)
  { legacyId: 'og-grape-glass', name: 'ReSip Wine Bottle Glass', price: 449, categoryName: 'Upcycled Glasses', glassSetPricing: { format: '24', setOf2: 449, setOf4: 899 }, images: ['https://static.wixstatic.com/media/9356bd_6f0b2cac63c542d19c77b61cc288ab13~mv2.jpg'], description: 'Tumbler upcycled from wine bottles emerald green glow.', story: 'Wine bottles diverted from waste become the ReSip Wine Bottle Glass.', features: ['Hand cut', 'Volume: ~350ml', 'Polished rim', 'Colour: emerald green', 'Eco-friendly'], stock: 100, sortOrder: 5 },
  { legacyId: 'og-the-gentlemen', name: 'ReSip Black Label Bottle Glass', price: 449, categoryName: 'Upcycled Glasses', glassSetPricing: { format: '24', setOf2: 449, setOf4: 899 }, images: ['https://static.wixstatic.com/media/9356bd_18644e201a394bbd9bfb0b3076c979ea~mv2.jpg'], description: 'Sophisticated tumbler upcycled from Johnnie Walker Black Label bottles.', story: 'The ReSip Black Label Bottle Glass turns a recognised whisky silhouette into refined drinkware.', features: ['Hand cut', 'Volume: 350ml', 'Polished rim', 'Eco-friendly'], stock: 100, sortOrder: 6 },
  { legacyId: 'og-king-mid', name: 'ReSip Kingfisher Bottle Glass', price: 399, categoryName: 'Upcycled Glasses', glassSetPricing: { format: '24', setOf2: 399, setOf4: 799 }, images: ['https://static.wixstatic.com/media/7dc839_ae062dea37e14e528f2db811d8064311~mv2.jpg'], description: 'Beer-bottle tumbler upcycled from Kingfisher glass.', story: 'Kingfisher bottles are transformed into the ReSip Kingfisher Bottle Glass.', features: ['Hand cut', 'Volume: 350ml', 'Polished rim', 'Eco-friendly'], stock: 100, sortOrder: 7 },
  { legacyId: 'og-vino-vibe', name: 'ReSip Mid Wine Bottle Glass', price: 325, categoryName: 'Upcycled Glasses', glassSetPricing: { format: '24', setOf2: 325, setOf4: 650 }, images: ['https://static.wixstatic.com/media/9356bd_d953a4602556435791d51a8160011164~mv2.jpg'], description: 'Compact wine-bottle tumbler olive-green tone.', story: 'The ReSip Mid Wine Bottle Glass gives shorter wine bottle stock a refined second act.', features: ['Hand cut', 'Volume: 250ml', 'Polished rim', 'Eco-friendly'], stock: 100, sortOrder: 8 },
  { legacyId: 'og-royal-shotlet', name: 'ReSip Antiquity Bottle Shots', price: 499, categoryName: 'Upcycled Glasses', glassSetPricing: { format: '612', setOf6: 499, setOf12: 999 }, images: ['https://static.wixstatic.com/media/9356bd_387e6fd431ae4bfd85e5ed5c74314167~mv2.jpg'], description: 'Shot glass upcycled from Antiquity whisky bottles.', story: 'Small but bold: the ReSip Antiquity Bottle Shots line.', features: ['Hand cut', 'Volume: 60ml', 'Polished rim', 'Eco-friendly'], stock: 100, sortOrder: 9 },
  { legacyId: 'og-dessert-shotlet', name: 'ReSip Ranthambore Bottle Shots', price: 499, categoryName: 'Upcycled Glasses', glassSetPricing: { format: '612', setOf6: 499, setOf12: 999 }, images: ['https://static.wixstatic.com/media/7dc839_4e4fd2b3586b4830a0256889716d5b96~mv2.jpg'], description: 'Dessert and spirit shots upcycled from Royal Ranthambore whisky bottles.', story: 'The ReSip Ranthambore Bottle Shots are sized for dessert pours.', features: ['Hand cut', 'Volume: 60ml', 'Polished rim', 'Eco-friendly'], stock: 100, sortOrder: 10 },
  { legacyId: 'og-greater-pour', name: 'ReSip Greater Than Bottle Glass', price: 499, categoryName: 'Upcycled Glasses', glassSetPricing: { format: '24', setOf2: 499, setOf4: 999 }, images: ['https://static.wixstatic.com/media/7dc839_5647ea02097547338357d8570d67ec53~mv2.jpg'], description: 'Gin-forward tumbler upcycled from Greater Than gin bottles.', story: 'The ReSip Greater Than Bottle Glass celebrates a conscious pour.', features: ['Hand cut', 'Volume: 350ml', 'Polished rim', 'Eco-friendly'], stock: 100, sortOrder: 11 },
  { legacyId: 'og-corocut', name: 'ReSip Corona Bottle Glass', price: 325, categoryName: 'Upcycled Glasses', glassSetPricing: { format: '24', setOf2: 325, setOf4: 650 }, images: ['https://static.wixstatic.com/media/9356bd_4e22bcb4ef5e4c1692432f834ff04421~mv2.png'], description: 'Relaxed tumbler upcycled from Corona longneck bottles.', story: 'Corona bottles get a second life as the ReSip Corona Bottle Glass.', features: ['Hand cut', 'Volume: 250ml', 'Polished rim', 'Eco-friendly'], stock: 100, sortOrder: 12 },
  { legacyId: 'og-resip-absolut-500ml-jar', name: 'ReSip Absolut Bottle jar', price: 925, categoryName: 'Upcycled Jar', glassSetPricing: { format: '24', setOf2: 925, setOf4: 1650 }, images: ['https://static.wixstatic.com/media/7dc839_bea9d46a2e644e40a89470800d1b198c~mv2.png'], description: 'Upcycled jar from Absolut Vodka bottles.', story: 'The ReSip Absolut Bottle jar gives premium bottle glass a second life.', features: ['Hand cut', '500ml source bottle', 'Food-safe', 'Eco-friendly'], stock: 100, sortOrder: 13 },
  { legacyId: 'og-resip-absolut-mid-350ml', name: 'ReSip Absolut Vodka Bottle Glass', price: 625, categoryName: 'Upcycled Glasses', glassSetPricing: { format: '24', setOf2: 625, setOf4: 1250 }, images: ['https://static.wixstatic.com/media/7dc839_72f14cad36c345e98c216c7143390909~mv2.jpg'], description: 'Drinking glass upcycled from Absolut Vodka bottles.', story: 'ReSip Absolut Vodka Bottle Glass turns rescued bottles into refined tumblers.', features: ['Hand cut', 'Food-safe finish', 'Eco-friendly'], stock: 100, sortOrder: 14 },
  { legacyId: 'og-resip-absolut-mini-180ml', name: 'ReSip Absolut mini jar', price: 325, categoryName: 'Upcycled Jar', glassSetPricing: { format: '24', setOf2: 325, setOf4: 650 }, images: ['https://static.wixstatic.com/media/7dc839_64eb0cfdb22f4cdeb21261ca67c96076~mv2.jpg'], description: 'Compact glass or mini jar from Absolut small-format bottles.', story: 'The ReSip Absolut mini jar celebrates compact Absolut glass with zero waste.', features: ['Hand cut', 'Mini format', 'Food-safe', 'Eco-friendly'], stock: 100, sortOrder: 15 },
  { legacyId: 'og-resip-budweiser-glass', name: 'ReSip Budweiser Bottle Glass', price: 399, categoryName: 'Upcycled Glasses', glassSetPricing: { format: '24', setOf2: 399, setOf4: 799 }, images: ['https://static.wixstatic.com/media/7dc839_561e9ee958ab4329abe449b0e0e25460~mv2.png'], description: 'Tumbler upcycled from Budweiser bottles.', story: 'ReSip Budweiser Bottle Glass brings diverted lager bottles back to the table.', features: ['Hand cut', 'Food-safe', 'Eco-friendly'], stock: 100, sortOrder: 16 },
  { legacyId: 'og-resip-old-monk-coffee-glass', name: 'ReSip Old Monk Coffee Bottle Glass', price: 449, categoryName: 'Upcycled Glasses', images: ['https://static.wixstatic.com/media/9356bd_2a1e3905802d425a99d10c70ada4dd59~mv2.jpg'], description: 'Drinking glass upcycled from Old Monk coffee liqueur bottles.', story: 'The ReSip Old Monk Coffee Bottle Glass pairs the Old Monk story with coffee culture.', features: ['Hand cut', 'Food-safe', 'Eco-friendly'], stock: 100, hidden: true, sortOrder: 17 },
  { legacyId: 'og-resip-ranthambore-tumbler', name: 'ReSip Ranthambore Bottle Glass', price: 499, categoryName: 'Upcycled Glasses', glassSetPricing: { format: '24', setOf2: 499, setOf4: 999 }, images: ['https://static.wixstatic.com/media/9356bd_e7efab05bfc14a29b5845d95e8369d77~mv2.png'], description: 'Full-size tumbler upcycled from Royal Ranthambore whisky bottles.', story: 'ReSip Ranthambore Bottle Glass complements the shot collection.', features: ['Hand cut', 'Food-safe', 'Eco-friendly'], stock: 100, sortOrder: 18 },
  { legacyId: 'og-resip-old-monk-bowl', name: 'ReSip Old Monk Bowl', price: 425, categoryName: 'Upcycled Glasses', glassSetPricing: { format: '24', setOf2: 425, setOf4: 850 }, images: ['https://static.wixstatic.com/media/7dc839_b13da223244d474c8bea808e2f80ec19~mv2.png'], description: 'Serving bowl from Old Monk bottle glass.', story: 'The ReSip Old Monk Bowl widens the Old Monk story beyond the tumbler.', features: ['Hand finished', 'Food-safe', 'Eco-friendly'], stock: 100, sortOrder: 19 },
  { legacyId: 'og-resip-old-monk-face-glass', name: 'ReSip Old Monk Face Glass', price: 299, categoryName: 'Upcycled Glasses', glassSetPricing: { format: '24', setOf2: 299, setOf4: 599 }, images: ['https://static.wixstatic.com/media/7dc839_b39fe26b48f84764b328cc0703e60986~mv2.png'], description: 'Statement "face" cut glass from Old Monk stock.', story: 'The ReSip Old Monk Face Glass highlights artisan cutting.', features: ['Hand cut', 'Food-safe', 'Eco-friendly'], stock: 100, sortOrder: 20 },
  // Scented Candles
  { legacyId: 'og-resip-scented-candle-1', name: 'ReSip Scented Candle 1', price: 449, categoryName: 'Scented Candles', glassSetPricing: { format: '24', setOf2: 449, setOf4: 849 }, images: ['https://static.wixstatic.com/media/9356bd_3b1d93630b284503b032a2cb5b0505ce~mv2.png', 'https://static.wixstatic.com/media/9356bd_ced3b40f903146d3bdc1e2ebe55acb4e~mv2.jpg'], description: 'Hand-poured scented candle in an upcycled wine bottle.', story: 'ReSip Scented Candles give rescued wine bottles a calm second life.', features: ['Made from upcycled wine bottle', 'Format: 250gm · ~65h burn', 'Natural soy wax', '100% cotton wick', 'Non-toxic & safe', 'Choose your fragrance'], fragrances: ['Lemon', 'Raat Rani', 'Rose', 'Aqua', 'Mogra'], labelImageSurcharge: 25, stock: 100, sortOrder: 21 },
  { legacyId: 'og-resip-scented-candle-2', name: 'ReSip Scented Candle 2', price: 449, categoryName: 'Scented Candles', glassSetPricing: { format: '24', setOf2: 449, setOf4: 849 }, images: ['https://static.wixstatic.com/media/9356bd_79b911e9c6824521a2a06309ab10ac8d~mv2.png'], description: 'Hand-poured scented candle in an upcycled beer bottle.', story: 'ReSip Scented Candle 2 turns rescued beer bottles into ambient light.', features: ['Made from upcycled beer bottle', 'Format: 200gm · ~60h burn', 'Natural soy wax', '100% cotton wick', 'Non-toxic & safe'], fragrances: ['Coco', 'Coffee'], labelImageSurcharge: 25, stock: 100, sortOrder: 22 },
  { legacyId: 'og-resip-scented-candle-3', name: 'ReSip Scented Candle 3', price: 349, categoryName: 'Scented Candles', glassSetPricing: { format: '24', setOf2: 349, setOf4: 649 }, images: ['https://static.wixstatic.com/media/9356bd_cbf80fc4f00c4113ab61aa39b0f7ea7c~mv2.png'], description: 'Hand-poured scented candle with a sculpted face silhouette.', story: 'ReSip Scented Candle 3 pairs artisan glass character with a calm pour.', features: ['Made from upcycled wine bottle', 'Format: 180gm · ~55h burn', 'Natural soy wax', 'Non-toxic & safe'], fragrances: ['Lemon', 'Raat Rani', 'Rose', 'Aqua', 'Mogra'], labelImageSurcharge: 25, stock: 100, sortOrder: 23 },
  { legacyId: 'og-resip-scented-candle-4', name: 'ReSip Scented Candle 4', price: 549, categoryName: 'Scented Candles', glassSetPricing: { format: '24', setOf2: 549, setOf4: 1049 }, images: ['https://static.wixstatic.com/media/9356bd_1cd4a95dd2f0416da98fdaabdefcc507~mv2.png'], description: 'Hand-poured scented candle with floral wax detailing.', story: 'ReSip Scented Candle 4 brings a decorative touch to rescued wine bottles.', features: ['Made from upcycled wine bottle', 'Format: 250gm · ~65h burn', 'Natural soy wax', 'Non-toxic & safe'], fragrances: ['Lemon', 'Raat Rani', 'Rose', 'Aqua', 'Mogra'], labelImageSurcharge: 25, stock: 100, sortOrder: 24 },
  { legacyId: 'og-resip-scented-candle-5', name: 'ReSip Scented Candle 5', price: 449, categoryName: 'Scented Candles', glassSetPricing: { format: '24', setOf2: 449, setOf4: 849 }, images: ['https://static.wixstatic.com/media/9356bd_ba0dbefe4fe744799b24038a4d672c95~mv2.png'], description: 'Hand-poured scented candle in an upcycled wine bottle.', story: 'ReSip Scented Candle 5 gives rescued wine bottles a calm second life.', features: ['Made from upcycled wine bottle', 'Format: 150gm · ~45h burn', 'Natural soy wax', 'Non-toxic & safe'], fragrances: ['Lemon', 'Raat Rani', 'Rose', 'Aqua', 'Mogra'], labelImageSurcharge: 25, stock: 100, sortOrder: 25 },
];

const HERO_BANNERS_SEED = [
  { title: '', image: 'https://static.wixstatic.com/media/9356bd_c8da8f804c0040c6917734181d2df3df~mv2.jpeg', link: '/shop', position: 'hero', sortOrder: 1 },
  { title: '', image: 'https://static.wixstatic.com/media/9356bd_a9b37b9f80984ce6ad7158b2ffc20bca~mv2.jpeg', link: '/shop', position: 'hero', sortOrder: 2 },
  { title: '', image: 'https://static.wixstatic.com/media/9356bd_6d4b2e5ba5d24c67917bd840a5fc3f05~mv2.jpeg', link: '/shop', position: 'hero', sortOrder: 3 },
];

const DEFAULT_SETTINGS = [
  { key: 'site_name', value: 'ReSip India', group: 'general' },
  { key: 'site_tagline', value: 'Upcycling With A Cause', group: 'general' },
  { key: 'contact_email', value: 'hello@resipindia.com', group: 'general' },
  { key: 'contact_phone', value: '+91 9146700770', group: 'general' },
  { key: 'contact_whatsapp', value: 'https://wa.me/919146700770', group: 'social' },
  { key: 'instagram_url', value: 'https://www.instagram.com/resip_india/', group: 'social' },
  { key: 'tax_percent', value: 18, group: 'tax' },
  { key: 'free_shipping_threshold', value: 999, group: 'shipping' },
  { key: 'shipping_charge', value: 50, group: 'shipping' },
  { key: 'cod_enabled', value: true, group: 'payment' },
  { key: 'cod_charge', value: 50, group: 'payment' },
  { key: 'announcement_messages', value: ['Free delivery on orders above ₹999', 'Handcrafted upcycled glassware made in India', 'Eco-friendly packaging on every order', 'Customisation is available for all products'], group: 'header' },
];

// ─── Seed Function ──────────────────────────────────

const seed = async () => {
  try {
    await connectDB();
    console.log('\n🌱 Starting database seed...\n');

    // Clear existing data (comment out in production!)
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Inventory.deleteMany({});
    await Settings.deleteMany({});
    await Banner.deleteMany({});
    console.log('   ✓ Cleared existing data');

    // Seed admin user
    const adminUser = await User.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@resipindia.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'admin',
      isEmailVerified: true,
    });
    console.log(`   ✓ Admin user created: ${adminUser.email}`);

    // Seed categories
    const categoryMap = {};
    for (const cat of CATEGORIES_SEED) {
      const created = await Category.create(cat);
      categoryMap[cat.name] = created._id;
    }
    console.log(`   ✓ ${CATEGORIES_SEED.length} categories created`);

    // Seed products
    for (const prod of PRODUCTS_SEED) {
      const categoryId = categoryMap[prod.categoryName];
      const product = await Product.create({
        ...prod,
        category: categoryId,
      });
      // Create inventory record
      await Inventory.create({
        product: product._id,
        stock: prod.stock || 100,
        lowStockThreshold: 10,
      });
    }
    console.log(`   ✓ ${PRODUCTS_SEED.length} products created with inventory`);

    // Seed hero banners
    for (const banner of HERO_BANNERS_SEED) {
      await Banner.create(banner);
    }
    console.log(`   ✓ ${HERO_BANNERS_SEED.length} hero banners created`);

    // Seed settings
    for (const setting of DEFAULT_SETTINGS) {
      await Settings.setSetting(setting.key, setting.value, setting.group);
    }
    console.log(`   ✓ ${DEFAULT_SETTINGS.length} settings created`);

    console.log('\n✅ Database seeded successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
