/**
 * Gen Bold eCommerce - Initial Data & Catalog Schema
 * Includes hierarchical Category Tree, Products with MRP/Selling Price/Discount,
 * Gender, Size, Colour variants, COD rules, and Coupons.
 */

const DEFAULT_CATEGORIES = [
  {
    id: "hobbygrade-toys",
    name: "Hobbygrade Toys",
    slug: "hobbygrade-toys",
    icon: "🎮",
    badge: "Popular",
    description: "High-octane brushless RC cars, 4K camera drones, die-cast supercars, and robotics",
    subcategories: [
      { id: "rc-vehicles", name: "RC High-Speed Vehicles & Crawlers" },
      { id: "drones-quads", name: "4K GPS Drones & Quadcopters" },
      { id: "diecast-models", name: "1:18 Precision Die-cast Models" },
      { id: "stem-robotics", name: "Programmable Robotics & Mecha Kits" },
      { id: "rc-aeromodels", name: "Aerobatic RC Planes & Jets" }
    ]
  },
  {
    id: "sexual-toys",
    name: "Sexual Toys",
    slug: "sexual-toys",
    icon: "✨",
    badge: "Discreet",
    description: "Medical-grade silicone sonic stimulators, automated strokers, wand massagers, and couples tech",
    subcategories: [
      { id: "vibrators", name: "Sonic & Dual-Stimulation Vibrators" },
      { id: "dildos-probes", name: "Ergonomic G-Spot & Dual Probes" },
      { id: "male-strokers", name: "Automated Warming Male Strokers" },
      { id: "couples-toys", name: "App-Controlled Long-Distance Couple Toys" },
      { id: "pelvic-trainers", name: "Smart Kegel & Pelvic Floor Trainers" },
      { id: "bdsm-romance", name: "Silk Bondage & Feather Romance Kits" }
    ]
  },
  {
    id: "sexual-products",
    name: "Sexual Products & Wellness",
    slug: "sexual-products",
    icon: "💧",
    badge: "100% Safe",
    description: "pH balanced lubricants, edible sensual massage oils, vitality enhancers, and intimate care",
    subcategories: [
      { id: "intimate-lubes", name: "Aloe Silk Water & Silicone Lubricants" },
      { id: "massage-oils", name: "Warm Sensual Botanical Massage Oils" },
      { id: "intimate-hygiene", name: "Daily pH-Balanced Intimate Foam Wash" },
      { id: "vitality-boosters", name: "Ayurvedic Stamina & Vitality Capsules" },
      { id: "condoms-protection", name: "Ultra-Thin Feather Sensation Packs" }
    ]
  },
  {
    id: "tech-audio",
    name: "Tech, Audio & Lifestyle",
    slug: "tech-audio",
    icon: "🎧",
    badge: "Trending",
    description: "Active Noise Cancelling headphones, smartwatches, fast Qi docks, and portable audio",
    subcategories: [
      { id: "headphones-audio", name: "ANC Over-Ear Pro Headphones" },
      { id: "tws-earbuds", name: "TWS Studio Earbuds & Bass Pods" },
      { id: "smartwatches", name: "AMOLED Health & Fitness Smartwatches" },
      { id: "wireless-chargers", name: "15W Fast Magnetic Wireless Chargers" },
      { id: "bt-speakers", name: "Waterproof Heavy Bass Bluetooth Speakers" }
    ]
  }
];

const DEFAULT_PRODUCTS = [
  // --- TECH & HERO SECTION (matches the uploaded theme image hero) ---
  {
    id: "gb-hero-headphone-01",
    name: "GenBold SoundMax ANC Pro Wireless Over-Ear Headphones",
    categoryId: "tech-audio",
    subcategoryId: "headphones-audio",
    mrp: 6999,
    price: 4899,
    gender: "Unisex",
    sizes: ["Standard Fit", "Over-Ear Cushioned"],
    colors: [
      { name: "Bold Orange & Matte Black", hex: "#ff5722" },
      { name: "Midnight Stealth Black", hex: "#111827" },
      { name: "Glacier Silver", hex: "#94a3b8" }
    ],
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.9,
    reviewsCount: 342,
    inStock: true,
    stockCount: 45,
    badge: "Hero Deal -30%",
    featured: true,
    flashSale: true,
    description: "Experience truly immersive acoustic sound with 40mm titanium drivers, active noise cancellation (-38dB), 40-hour ultra-endurance battery, and Bluetooth 5.3 low-latency audio. Designed for bold, high-fidelity lifestyles.",
    specs: {
      "Noise Cancellation": "Hybrid Active ANC (-38dB)",
      "Battery Life": "40 Hours Playback with Fast Charging",
      "Connectivity": "Bluetooth 5.3 + 3.5mm Aux",
      "Microphone": "Quad-Mic ENC with Clear Call AI"
    }
  },
  {
    id: "gb-watch-x1",
    name: "GenBold Pro Watch X1 Smart Health & AMOLED Tracker",
    categoryId: "tech-audio",
    subcategoryId: "smartwatches",
    mrp: 4999,
    price: 2999,
    gender: "Unisex",
    sizes: ["42mm Dial", "46mm Dial"],
    colors: [
      { name: "Space Black", hex: "#1f2937" },
      { name: "Electric Orange", hex: "#f97316" },
      { name: "Metallic Titanium", hex: "#64748b" }
    ],
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.8,
    reviewsCount: 128,
    inStock: true,
    stockCount: 30,
    badge: "-40% OFF",
    featured: true,
    flashSale: true,
    description: "1.96-inch Always-on AMOLED display with continuous heart-rate monitoring, SpO2 sensor, sleep tracker, 120+ sport modes, and 10-day battery life in a rugged aluminum chassis.",
    specs: {
      "Display": "1.96'' HD AMOLED 60Hz",
      "Sensors": "Optical Heart Rate, SpO2, Accelerometer",
      "Water Resistance": "IP68 Swim-Proof",
      "Battery": "Up to 10 Days Normal Use"
    }
  },
  {
    id: "gb-soundcore-earbuds",
    name: "SoundCore Elite TWS Earbuds with Spatial Bass",
    categoryId: "tech-audio",
    subcategoryId: "tws-earbuds",
    mrp: 3499,
    price: 1999,
    gender: "Unisex",
    sizes: ["Standard (3 Ear Tips S/M/L)"],
    colors: [
      { name: "Onyx Black", hex: "#0f172a" },
      { name: "Pearl White", hex: "#f8fafc" },
      { name: "Neon Orange", hex: "#ea580c" }
    ],
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.7,
    reviewsCount: 96,
    inStock: true,
    stockCount: 55,
    badge: "-43% OFF",
    featured: true,
    flashSale: false,
    description: "Ultra-compact crystal clear sound buds with punchy dynamic bass, 32-hour playback case, dual microphone beamforming, and IPX5 sweat resistance for running and workouts.",
    specs: {
      "Driver": "10mm Graphene Dynamic Drivers",
      "Playtime": "8h buds + 24h case",
      "Charging": "Type-C Fast Charge (10m = 2h)",
      "Latency": "45ms Low Latency Game Mode"
    }
  },
  {
    id: "gb-pulse-speaker",
    name: "Pulse X Waterproof Rugged Bluetooth Speaker",
    categoryId: "tech-audio",
    subcategoryId: "bt-speakers",
    mrp: 2999,
    price: 1499,
    gender: "Unisex",
    sizes: ["Standard Compact"],
    colors: [
      { name: "Ocean Deep Blue", hex: "#1e3a8a" },
      { name: "Tactical Black", hex: "#18181b" },
      { name: "Sunset Orange", hex: "#c2410c" }
    ],
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.8,
    reviewsCount: 64,
    inStock: true,
    stockCount: 22,
    badge: "-50% OFF",
    featured: false,
    flashSale: true,
    description: "20W deep bass dual passive radiator speaker. IPX7 waterproof submersible body, 360-degree surround sound, and integrated powerbank capability with 16h playtime.",
    specs: {
      "Output": "20W RMS Dual Radiator",
      "Protection": "IPX7 Waterproof",
      "Battery": "4000mAh (16 Hours)"
    }
  },
  {
    id: "gb-fast-charger",
    name: "Fast 15W Qi Magnetic Aluminum Wireless Charging Dock",
    categoryId: "tech-audio",
    subcategoryId: "wireless-chargers",
    mrp: 1999,
    price: 899,
    gender: "Unisex",
    sizes: ["Slim Profile (6mm)"],
    colors: [
      { name: "Matte Black", hex: "#111827" },
      { name: "Brushed Silver", hex: "#cbd5e1" }
    ],
    image: "https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.6,
    reviewsCount: 40,
    inStock: true,
    stockCount: 80,
    badge: "Hot Deal",
    featured: false,
    flashSale: true,
    description: "CNC milled aerospace-grade aluminum wireless charger pad. Safe temperature control chip, FOD detection, compatible with all Qi-enabled phones and earbuds.",
    specs: {
      "Input": "USB-C 9V/2A",
      "Output": "15W / 10W / 7.5W / 5W",
      "Thickness": "6.2mm Ultra Thin"
    }
  },

  // --- HOBBYGRADE TOYS (Requested explicit category) ---
  {
    id: "gb-rc-truck-pro",
    name: "Apex 1/14 High-Speed 4WD Brushless RC Monster Truck (60 km/h)",
    categoryId: "hobbygrade-toys",
    subcategoryId: "rc-vehicles",
    mrp: 8999,
    price: 5999,
    gender: "Unisex",
    sizes: ["1:14 Scale Large", "1:18 Scale Compact"],
    colors: [
      { name: "Flame Orange & Carbon", hex: "#f97316" },
      { name: "Toxic Green & Black", hex: "#16a34a" },
      { name: "Cyber Blue", hex: "#0284c7" }
    ],
    image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.9,
    reviewsCount: 185,
    inStock: true,
    stockCount: 18,
    badge: "Top Hobby Pick",
    featured: true,
    flashSale: true,
    description: "Heavy-duty full metal differential gears, independent oil-filled aluminum shock absorbers, and a high-torque 2840 brushless motor. Clocks over 60 km/h with 2.4GHz proportional pistol grip controller.",
    specs: {
      "Speed": "Up to 60 km/h (Brushless)",
      "Drive System": "Full-Time 4WD Shaft Driven",
      "Battery": "7.4V 1500mAh 2S Li-Po included",
      "Range": "120+ Meters 2.4GHz"
    }
  },
  {
    id: "gb-drone-4k-gps",
    name: "AeroFalcon 4K Dual-Camera Folding GPS Hobby Drone",
    categoryId: "hobbygrade-toys",
    subcategoryId: "drones-quads",
    mrp: 14999,
    price: 9499,
    gender: "Unisex",
    sizes: ["Standard Foldable Kit", "Fly-More Combo (+2 Batteries)"],
    colors: [
      { name: "Slate Grey", hex: "#475569" },
      { name: "Vibrant Orange", hex: "#ea580c" }
    ],
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.8,
    reviewsCount: 112,
    inStock: true,
    stockCount: 14,
    badge: "-37% OFF",
    featured: true,
    flashSale: false,
    description: "Optical flow positioning + dual satellite GPS auto-return home. Motorized 90-degree 4K EIS stabilized camera, brushless silent wind-resistant motors, and 28 minutes flight time per battery.",
    specs: {
      "Camera": "4K UHD with EIS Anti-Shake",
      "Flight Time": "28 Mins per Battery",
      "Transmission": "5GHz Wi-Fi FPV up to 1000m",
      "GPS Features": "Auto Return, Follow Me, Waypoints"
    }
  },
  {
    id: "gb-diecast-supercar",
    name: "Precision 1:18 Die-cast Supercar Collectible Model (Die-Cast Alloy)",
    categoryId: "hobbygrade-toys",
    subcategoryId: "diecast-models",
    mrp: 4499,
    price: 3199,
    gender: "Unisex",
    sizes: ["1:18 Scale (28cm)"],
    colors: [
      { name: "Rosso Corsa Red", hex: "#dc2626" },
      { name: "Verde Mantis Green", hex: "#84cc16" },
      { name: "Stealth Satin Black", hex: "#09090b" }
    ],
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 78,
    inStock: true,
    stockCount: 25,
    badge: "Collector Edition",
    featured: false,
    flashSale: false,
    description: "Exquisite high-precision heavy die-cast metal body with opening butterfly doors, steerable rubber wheels, authentic interior carbon-fiber pattern detailing, and display acrylic stand.",
    specs: {
      "Material": "Heavy Die-Cast Zinc Alloy + ABS",
      "Scale": "1:18 Official Licensed Detailing",
      "Features": "4-Door Opening, Working Steering, Springs"
    }
  },
  {
    id: "gb-robotics-mecha",
    name: "MechaStrike Programmable AI Combat Robotic Kit (Arduino / App)",
    categoryId: "hobbygrade-toys",
    subcategoryId: "stem-robotics",
    mrp: 6999,
    price: 4899,
    gender: "Unisex",
    sizes: ["Master Kit (280+ Pieces)"],
    colors: [
      { name: "Cyber Armor Blue", hex: "#2563eb" },
      { name: "Mecha Orange & Grey", hex: "#ea580c" }
    ],
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviewsCount: 52,
    inStock: true,
    stockCount: 16,
    badge: "STEM Favorite",
    featured: false,
    flashSale: false,
    description: "Construct and code your own high-mobility omnidirectional combat robot! Features infrared battle sensor, ultrasonic obstacle avoidance, LED laser eyes, and graphical Scratch / C++ programming.",
    specs: {
      "Drive": "4x Mecanum 360-degree Omni Wheels",
      "Controller": "Bluetooth 5.0 Mobile App / Gamepad",
      "Power": "18650 High-Drain Rechargeable Cells"
    }
  },

  // --- SEXUAL TOYS (Requested explicit category) ---
  {
    id: "gb-sonic-vibrator",
    name: "Luxe Pulse Dual-Stimulation Sonic Clitoral & G-Spot Vibrator",
    categoryId: "sexual-toys",
    subcategoryId: "vibrators",
    mrp: 3999,
    price: 2499,
    gender: "Women",
    sizes: ["Ergonomic Medium", "Compact Travel"],
    colors: [
      { name: "Velvet Rose Pink", hex: "#f43f5e" },
      { name: "Midnight Plum", hex: "#701a75" },
      { name: "Teal Green", hex: "#0f766e" }
    ],
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512290900672-1f81d1e4695e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.9,
    reviewsCount: 219,
    inStock: true,
    stockCount: 35,
    badge: "100% Discreet COD",
    featured: true,
    flashSale: true,
    description: "Ultra-soft premium body-safe silky silicone. Features contactless air-pulse sonic wave technology paired with rhythmic internal vibration. Whisper-quiet (<40dB), magnetic USB waterproof IPX7.",
    specs: {
      "Material": "Silky Medical-Grade Silicone, Body-Safe",
      "Vibration Modes": "10 Frequency & Intensity Levels",
      "Waterproofing": "100% IPX7 Submersible",
      "Sound Level": "Whisper Silent <40dB"
    }
  },
  {
    id: "gb-smart-stroker",
    name: "ThermoPulse Automated Warming Men's Textured Stroker",
    categoryId: "sexual-toys",
    subcategoryId: "male-strokers",
    mrp: 5499,
    price: 3699,
    gender: "Men",
    sizes: ["Standard Universal Sleeve", "XL High Stretch"],
    colors: [
      { name: "Stealth Gunmetal Grey", hex: "#334155" },
      { name: "Carbon Black", hex: "#0f172a" }
    ],
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.8,
    reviewsCount: 164,
    inStock: true,
    stockCount: 20,
    badge: "Top Rated Men",
    featured: true,
    flashSale: false,
    description: "Next-gen male pleasure device featuring intelligent 38°C thermal body-temperature warming, multi-speed reciprocating suction, ribbed textured inner chamber, and headphone privacy mode.",
    specs: {
      "Warming": "Constant 38°C Real-Feel Heat",
      "Functions": "7 Linear Thrust & Spiral Patterns",
      "Cleaning": "Detachable Washable Inner Sleeve",
      "Battery": "High-Capacity Li-Ion (90 min session)"
    }
  },
  {
    id: "gb-couple-wand",
    name: "SyncroWave App-Controlled Long Distance Couple Wand",
    categoryId: "sexual-toys",
    subcategoryId: "couples-toys",
    mrp: 4999,
    price: 3299,
    gender: "Couples",
    sizes: ["Ergonomic Couple Fit"],
    colors: [
      { name: "Royal Purple", hex: "#6b21a8" },
      { name: "Blush Coral", hex: "#fb7185" }
    ],
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 140,
    inStock: true,
    stockCount: 28,
    badge: "-34% OFF",
    featured: false,
    flashSale: true,
    description: "Engineered to be worn during intimacy. Dual motor stimulates both partners simultaneously. Syncs with free smartphone app for long-distance remote control anywhere in the world.",
    specs: {
      "App Control": "iOS & Android (Any Distance via Cloud)",
      "Motors": "Dual Tungsten Vibration Engines",
      "Body Fit": "Bendable Flexible Shape Memory",
      "Packaging": "Neutral Unbranded Cardboard"
    }
  },
  {
    id: "gb-kegel-trainer",
    name: "BioFit Smart Bluetooth Kegel Pelvic Floor Trainer",
    categoryId: "sexual-toys",
    subcategoryId: "pelvic-trainers",
    mrp: 2999,
    price: 1899,
    gender: "Women",
    sizes: ["Standard Ergonomic (34mm)"],
    colors: [
      { name: "Petal Pink", hex: "#ec4899" },
      { name: "Lilac Violet", hex: "#a855f7" }
    ],
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviewsCount: 88,
    inStock: true,
    stockCount: 40,
    badge: "Wellness Choice",
    featured: false,
    flashSale: false,
    description: "Doctor recommended pelvic floor biofeedback trainer. Uses real-time pressure sensors linked with fun phone gamification apps to strengthen muscles in just 5 minutes a day.",
    specs: {
      "Sensors": "Micro Biofeedback Force Gauge",
      "Material": "Hypoallergenic Medical Silicone",
      "Guidance": "App-guided Exercises & Progress Tracking"
    }
  },
  {
    id: "gb-romance-kit",
    name: "Midnight Silk Restraints & Velvet Romance Bondage Kit",
    categoryId: "sexual-toys",
    subcategoryId: "bdsm-romance",
    mrp: 2499,
    price: 1399,
    gender: "Couples",
    sizes: ["Universal Adjustable"],
    colors: [
      { name: "Crimson Velvet & Black", hex: "#991b1b" },
      { name: "Midnight Jet Black", hex: "#18181b" }
    ],
    image: "https://images.unsplash.com/photo-1516542076529-1ea3854896f2?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewsCount: 95,
    inStock: true,
    stockCount: 30,
    badge: "-44% OFF",
    featured: false,
    flashSale: false,
    description: "Explore intimate romance with luxury padded satin wrist and ankle cuffs, blindfold eye mask, tickler feather wand, and collar with leash. Completely gentle on skin with quick-release clips.",
    specs: {
      "Set Contents": "7-Piece Padded Luxury Set",
      "Linings": "Plush Memory Foam with Soft Faux Leather",
      "Clips": "Gold-Tone Heavy-Duty Quick Snaps"
    }
  },

  // --- SEXUAL PRODUCTS & WELLNESS (Requested explicit category) ---
  {
    id: "gb-lube-aloe",
    name: "PureGlide Organic Aloe Silk Water-Based Intimate Lubricant (150ml)",
    categoryId: "sexual-products",
    subcategoryId: "intimate-lubes",
    mrp: 699,
    price: 399,
    gender: "Unisex",
    sizes: ["100 ml Pump", "150 ml Travel", "250 ml Economy"],
    colors: [
      { name: "Clear Natural", hex: "#e2e8f0" }
    ],
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228722-d0b71216d634?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.9,
    reviewsCount: 310,
    inStock: true,
    stockCount: 120,
    badge: "Best Seller",
    featured: true,
    flashSale: false,
    description: "100% natural, pH-balanced (3.8-4.2) aloe vera enriched organic formula. Non-sticky, stain-free, toy-friendly, and condom safe. Never contains parabens, glycerin, or synthetic fragrances.",
    specs: {
      "Base": "Purified Water & Organic Aloe Vera",
      "Volume": "150 ml Discreet Pump Dispenser",
      "Safety": "Toy Safe, Latex Safe, Gynecologist Tested"
    }
  },
  {
    id: "gb-massage-oil",
    name: "Vanilla Orchid Warming Sensual Body & Massage Oil (120ml)",
    categoryId: "sexual-products",
    subcategoryId: "massage-oils",
    mrp: 899,
    price: 499,
    gender: "Couples",
    sizes: ["120 ml Glass Dropper", "200 ml Bottle"],
    colors: [
      { name: "Golden Amber", hex: "#d97706" }
    ],
    image: "https://images.unsplash.com/photo-1608248597359-598375815a51?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1608248597359-598375815a51?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    rating: 4.8,
    reviewsCount: 145,
    inStock: true,
    stockCount: 75,
    badge: "-44% OFF",
    featured: false,
    flashSale: true,
    description: "Infused with therapeutic essential oils: Sweet Almond, Jojoba, and exotic Madagascar Vanilla. Delicately heats upon touch for relaxing erotic couple massage with non-greasy absorption.",
    specs: {
      "Ingredients": "Cold-Pressed Jojoba, Almond & Vanilla Extract",
      "Scent": "Sensual Madagascar Warm Vanilla",
      "Packaging": "Amber UV Shield Glass Bottle"
    }
  },
  {
    id: "gb-vitality-capsules",
    name: "VigorBold 100% Ayurvedic Stamina & Vitality Booster (60 Veg Capsules)",
    categoryId: "sexual-products",
    subcategoryId: "vitality-boosters",
    mrp: 1299,
    price: 799,
    gender: "Men",
    sizes: ["30 Capsules Pack", "60 Capsules Bottle", "Double Value Pack (120)"],
    colors: [
      { name: "Gold Standard", hex: "#eab308" }
    ],
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviewsCount: 180,
    inStock: true,
    stockCount: 90,
    badge: "Ayush Certified",
    featured: true,
    flashSale: false,
    description: "Formulated with pure Himalayan Shuddh Shilajit, Ashwagandha KSM-66, Safed Musli, and Gokshura. Enhances stamina, vigor, endurance, and everyday vitality naturally with zero steroids.",
    specs: {
      "Dosage": "1-2 Capsules Daily with Warm Milk/Water",
      "Certification": "Ministry of AYUSH & GMP Certified",
      "Count": "60 100% Vegetarian Capsules"
    }
  },
  {
    id: "gb-hygiene-wash",
    name: "CleanZen Gentle pH 3.5 Daily Intimate Foam Wash (150ml)",
    categoryId: "sexual-products",
    subcategoryId: "intimate-hygiene",
    mrp: 499,
    price: 299,
    gender: "Unisex",
    sizes: ["150 ml Instant Foam"],
    colors: [
      { name: "Pure White & Mint", hex: "#10b981" }
    ],
    image: "https://images.unsplash.com/photo-1556228722-d0b71216d634?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewsCount: 110,
    inStock: true,
    stockCount: 115,
    badge: "Free COD Qualifying",
    featured: false,
    flashSale: false,
    description: "Ultra-soothing natural tea tree and chamomile infused foaming wash. Prevents odor, itching, irritation, and maintains natural protective acid mantle for day-long freshness.",
    specs: {
      "Key Actives": "Tea Tree Oil, Chamomile, Lactic Acid pH 3.5",
      "Type": "Direct Foaming Pump Dispenser",
      "Formula": "Sulfate-Free & Paraben-Free"
    }
  },
  {
    id: "gb-sensation-condoms",
    name: "FeatherLite Ultra-Thin Zero-Feel Sensation Pack (30 Pcs)",
    categoryId: "sexual-products",
    subcategoryId: "condoms-protection",
    mrp: 599,
    price: 349,
    gender: "Unisex",
    sizes: ["10 Pcs Pocket Pack", "30 Pcs Value Box"],
    colors: [
      { name: "Natural Latex Sheer", hex: "#f1f5f9" }
    ],
    image: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 260,
    inStock: true,
    stockCount: 150,
    badge: "-42% OFF",
    featured: false,
    flashSale: true,
    description: "Engineered under 0.04mm thickness for ultimate skin-on-skin sensation. 100% electronically tested for safety, extra lubricated, neutral scent, packaged in discreet blackout box.",
    specs: {
      "Thickness": "Under 0.04mm Super-Thin",
      "Testing": "Triple Electronic Safety Standard ISO 4074",
      "Quantity": "30 Lubricated Natural Latex Shields"
    }
  }
];

const DEFAULT_COUPONS = [
  {
    code: "GENBOLD10",
    discountType: "percent",
    discountValue: 10,
    minOrder: 0,
    description: "10% OFF on all orders site-wide",
    active: true
  },
  {
    code: "BOLD50",
    discountType: "fixed",
    discountValue: 50,
    minOrder: 499,
    description: "Flat ₹50 OFF on orders above ₹499",
    active: true
  },
  {
    code: "WELCOME20",
    discountType: "percent",
    discountValue: 20,
    minOrder: 699,
    description: "20% OFF for new shoppers on orders above ₹699",
    active: true
  },
  {
    code: "FREESHIP",
    discountType: "fixed",
    discountValue: 49,
    minOrder: 150,
    description: "Flat ₹49 OFF (Offsets small order delivery fee)",
    active: true
  }
];

const DEFAULT_SETTINGS = {
  siteName: "Gen Bold",
  tagline: "Bold Lifestyle, Hobby Toys & Intimate Wellness",
  adminPassword: "1082",
  minOrderFreeCod: 299, // Free COD above ₹299
  codFee: 49,          // Otherwise charge ₹49
  currencySymbol: "₹",
  supportEmail: "support@genbold.in",
  supportPhone: "+91 (800) 123-4567",
  discreetPackagingGuaranteed: true,
  announcement: "⚡ FLASH SALE LIVE: Up to 50% OFF + 100% Discreet Cash On Delivery (COD) Across India!"
};

// Export to window
window.GENBOLD_DEFAULT_CATEGORIES = DEFAULT_CATEGORIES;
window.GENBOLD_DEFAULT_PRODUCTS = DEFAULT_PRODUCTS;
window.GENBOLD_DEFAULT_COUPONS = DEFAULT_COUPONS;
window.GENBOLD_DEFAULT_SETTINGS = DEFAULT_SETTINGS;
