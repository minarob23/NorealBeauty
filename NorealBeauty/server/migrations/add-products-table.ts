import "dotenv/config";
import { db } from "../db";
import { products } from "@shared/schema";

const sampleProducts = [
  {
    name: "Hydra-Glow Serum",
    description: "Our bestselling hydrating serum combines hyaluronic acid with vitamin C to deliver intense moisture and a radiant glow. This lightweight formula absorbs quickly, leaving skin plump and luminous. Perfect for all skin types, it works to reduce fine lines while protecting against environmental stressors.",
    shortDescription: "Intense hydration meets radiant glow with hyaluronic acid and vitamin C.",
    price: "68.00",
    category: "serums",
    skinType: "all",
    ingredients: ["Hyaluronic Acid", "Vitamin C", "Niacinamide", "Aloe Vera", "Green Tea Extract"],
    images: [],
    rating: "4.8",
    reviewCount: 127,
    inStock: true,
    isBestSeller: true,
    isNew: false,
  },
  {
    name: "Velvet Night Cream",
    description: "Luxurious overnight treatment that works while you sleep to repair and rejuvenate. Enriched with retinol and peptides, this rich cream helps reduce the appearance of wrinkles and improves skin elasticity. Wake up to smoother, more youthful-looking skin.",
    shortDescription: "Overnight repair with retinol and peptides for youthful radiance.",
    price: "85.00",
    category: "moisturizers",
    skinType: "dry",
    ingredients: ["Retinol", "Peptides", "Shea Butter", "Jojoba Oil", "Vitamin E"],
    images: [],
    rating: "4.6",
    reviewCount: 89,
    inStock: true,
    isBestSeller: true,
    isNew: false,
  },
  {
    name: "Pure Clarity Cleanser",
    description: "A gentle yet effective gel cleanser that removes impurities without stripping the skin's natural moisture. Infused with tea tree and salicylic acid, it helps prevent breakouts while maintaining a balanced complexion. Suitable for daily use.",
    shortDescription: "Gentle gel cleanser with tea tree for clear, balanced skin.",
    price: "42.00",
    category: "cleansers",
    skinType: "oily",
    ingredients: ["Salicylic Acid", "Tea Tree Oil", "Glycerin", "Chamomile", "Witch Hazel"],
    images: [],
    rating: "4.5",
    reviewCount: 156,
    inStock: true,
    isBestSeller: false,
    isNew: false,
  },
  {
    name: "Rose Petal Toner",
    description: "Alcohol-free toner infused with rose water and rose hip extract. Gently balances pH levels while providing antioxidant protection. Leaves skin feeling refreshed, soft, and prepped for the rest of your skincare routine.",
    shortDescription: "Rose-infused toner for balanced, refreshed skin.",
    price: "38.00",
    category: "toners",
    skinType: "all",
    ingredients: ["Rose Water", "Rose Hip Extract", "Witch Hazel", "Aloe Vera", "Glycerin"],
    images: [],
    rating: "4.7",
    reviewCount: 203,
    inStock: true,
    isBestSeller: true,
    isNew: false,
  },
  {
    name: "Luminous Eye Elixir",
    description: "Targeted treatment for the delicate eye area. This lightweight serum helps reduce dark circles, puffiness, and fine lines with caffeine and peptide technology. The cooling applicator enhances product absorption and provides instant de-puffing.",
    shortDescription: "De-puff and brighten with caffeine and peptides.",
    price: "55.00",
    category: "eye-care",
    skinType: "all",
    ingredients: ["Caffeine", "Peptides", "Vitamin K", "Cucumber Extract", "Hyaluronic Acid"],
    images: [],
    rating: "4.4",
    reviewCount: 78,
    inStock: true,
    isBestSeller: false,
    isNew: true,
  },
  {
    name: "Detox Clay Mask",
    description: "Deep-cleansing mask that draws out impurities and excess oil. Formulated with kaolin clay and activated charcoal, it purifies pores while green tea provides antioxidant benefits. Use weekly for a clearer, more refined complexion.",
    shortDescription: "Purifying clay mask with charcoal for deep cleansing.",
    price: "48.00",
    category: "masks",
    skinType: "oily",
    ingredients: ["Kaolin Clay", "Activated Charcoal", "Green Tea", "Bentonite", "Eucalyptus"],
    images: [],
    rating: "4.5",
    reviewCount: 92,
    inStock: true,
    isBestSeller: false,
    isNew: false,
  },
  {
    name: "Sunshield SPF 50",
    description: "Lightweight, non-greasy sunscreen that provides broad-spectrum protection. This invisible formula blends seamlessly and works well under makeup. Enriched with antioxidants to protect against environmental damage and premature aging.",
    shortDescription: "Invisible broad-spectrum protection for daily wear.",
    price: "45.00",
    category: "suncare",
    skinType: "all",
    ingredients: ["Zinc Oxide", "Titanium Dioxide", "Vitamin E", "Green Tea", "Niacinamide"],
    images: [],
    rating: "4.8",
    reviewCount: 234,
    inStock: true,
    isBestSeller: true,
    isNew: false,
  },
  {
    name: "Radiance Vitamin Boost",
    description: "Concentrated treatment serum packed with vitamins A, C, and E. This powerful antioxidant blend helps brighten dull skin, even out skin tone, and protect against free radical damage. Perfect for achieving that healthy, lit-from-within glow.",
    shortDescription: "Triple vitamin complex for radiant, even-toned skin.",
    price: "72.00",
    category: "serums",
    skinType: "combination",
    ingredients: ["Vitamin A", "Vitamin C", "Vitamin E", "Ferulic Acid", "Squalane"],
    images: [],
    rating: "4.6",
    reviewCount: 145,
    inStock: true,
    isBestSeller: false,
    isNew: true,
  },
  {
    name: "Gentle Milk Cleanser",
    description: "Ultra-gentle milk cleanser ideal for sensitive and dry skin types. This creamy formula dissolves makeup and impurities without causing irritation. Infused with oat extract and ceramides to maintain the skin's protective barrier.",
    shortDescription: "Creamy cleanser with oat for sensitive skin comfort.",
    price: "36.00",
    category: "cleansers",
    skinType: "sensitive",
    ingredients: ["Oat Extract", "Ceramides", "Milk Proteins", "Chamomile", "Allantoin"],
    images: [],
    rating: "4.7",
    reviewCount: 167,
    inStock: true,
    isBestSeller: false,
    isNew: false,
  },
  {
    name: "Hydrating Sheet Mask",
    description: "Bio-cellulose sheet mask drenched in hydrating essence. This 15-minute treatment delivers an instant moisture boost, leaving skin plump, dewy, and refreshed. Perfect for travel or a quick skin pick-me-up before special occasions.",
    shortDescription: "Instant hydration boost in 15 minutes.",
    price: "12.00",
    category: "masks",
    skinType: "dry",
    ingredients: ["Hyaluronic Acid", "Aloe Vera", "Centella Asiatica", "Panthenol", "Glycerin"],
    images: [],
    rating: "4.3",
    reviewCount: 312,
    inStock: true,
    isBestSeller: false,
    isNew: false,
  },
  {
    name: "Acne Control Treatment",
    description: "Targeted spot treatment that clears blemishes fast. This potent formula combines benzoyl peroxide with soothing tea tree oil to fight acne-causing bacteria while reducing redness. Dries clear so it can be worn day or night.",
    shortDescription: "Fast-acting spot treatment for clear skin.",
    price: "28.00",
    category: "treatments",
    skinType: "oily",
    ingredients: ["Benzoyl Peroxide", "Tea Tree Oil", "Niacinamide", "Zinc", "Salicylic Acid"],
    images: [],
    rating: "4.4",
    reviewCount: 189,
    inStock: true,
    isBestSeller: false,
    isNew: false,
  },
  {
    name: "Barrier Repair Moisturizer",
    description: "Intensive moisturizer designed to restore compromised skin barriers. Rich in ceramides and fatty acids, this nourishing cream rebuilds skin's natural defenses while providing lasting comfort. Ideal for those experiencing dryness, irritation, or sensitivity.",
    shortDescription: "Ceramide-rich cream to restore and protect.",
    price: "58.00",
    category: "moisturizers",
    skinType: "sensitive",
    ingredients: ["Ceramides", "Fatty Acids", "Cholesterol", "Shea Butter", "Squalane"],
    images: [],
    rating: "4.9",
    reviewCount: 98,
    inStock: true,
    isBestSeller: false,
    isNew: true,
  },
];

export async function migrateProducts() {
  console.log("Creating products table and seeding data...");
  
  try {
    // Check if products already exist
    const existingProducts = await db.select().from(products);
    
    if (existingProducts.length === 0) {
      // Insert sample products
      await db.insert(products).values(sampleProducts);
      console.log(`✅ Successfully seeded ${sampleProducts.length} products`);
    } else {
      console.log(`ℹ️ Products table already has ${existingProducts.length} products`);
    }
  } catch (error) {
    console.error("Error migrating products:", error);
    throw error;
  }
}

// Run migration if called directly
migrateProducts()
  .then(() => {
    console.log("Migration completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
