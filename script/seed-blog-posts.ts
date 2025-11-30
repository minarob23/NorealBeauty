import { db } from "../server/db";
import { blogPosts } from "../shared/schema";
import { randomUUID } from "crypto";

const sampleBlogPosts = [
    {
        id: randomUUID(),
        title: "The Ultimate Guide to Building a Skincare Routine",
        slug: "ultimate-guide-skincare-routine",
        excerpt: "Discover the essential steps to create a personalized skincare routine that works for your unique skin type and concerns.",
        content: `Building an effective skincare routine doesn't have to be complicated. The key is understanding your skin type and choosing products that address your specific concerns.

**Step 1: Cleanse**
Start with a gentle cleanser that removes dirt and makeup without stripping your skin's natural oils. For oily skin, consider a gel-based cleanser. For dry skin, opt for a creamy or milk cleanser.

**Step 2: Tone**
Toners help balance your skin's pH and prepare it for the next steps. Look for alcohol-free formulas with hydrating ingredients like hyaluronic acid or rose water.

**Step 3: Treat**
This is where serums come in. Whether you're targeting fine lines, dark spots, or hydration, there's a serum for every concern. Apply from thinnest to thickest consistency.

**Step 4: Moisturize**
Lock in all that goodness with a moisturizer suited to your skin type. Even oily skin needs hydration!

**Step 5: Protect**
Never skip sunscreen during the day. UV protection is the most effective anti-aging step you can take.`,
        authorId: "system",
        authorName: "Dr. Sarah Chen",
        published: true,
        publishedAt: new Date("2025-01-15"),
        tags: ["featured", "tutorials", "skincare"],
        viewCount: 0,
        createdAt: new Date("2025-01-15"),
        updatedAt: new Date("2025-01-15"),
    },
    {
        id: randomUUID(),
        title: "Understanding Hyaluronic Acid: The Hydration Hero",
        slug: "understanding-hyaluronic-acid",
        excerpt: "Learn why hyaluronic acid is the star ingredient in hydrating skincare and how to incorporate it into your routine.",
        content: `Hyaluronic acid (HA) has become one of the most sought-after ingredients in skincare, and for good reason. This powerful humectant can hold up to 1000 times its weight in water, making it an incredible hydrating agent.

**What is Hyaluronic Acid?**
Despite its name, hyaluronic acid isn't harsh at all. It's a naturally occurring substance in our bodies that helps retain moisture in our skin and joints.

**Benefits for Your Skin**
- Intense hydration without heaviness
- Plumps fine lines and wrinkles
- Suitable for all skin types
- Helps other products absorb better

**How to Use It**
Apply HA serums to damp skin for maximum absorption. Follow with a moisturizer to seal in the hydration.

**Tips for Best Results**
- Look for products with multiple molecular weights
- Apply to slightly damp skin
- Layer under your moisturizer
- Use both morning and night`,
        authorId: "system",
        authorName: "Emma Rodriguez",
        published: true,
        publishedAt: new Date("2025-01-10"),
        tags: ["ingredients", "hydration"],
        viewCount: 0,
        createdAt: new Date("2025-01-10"),
        updatedAt: new Date("2025-01-10"),
    },
    {
        id: randomUUID(),
        title: "Winter Skincare: Protecting Your Skin in Cold Weather",
        slug: "winter-skincare-cold-weather",
        excerpt: "Cold weather can wreak havoc on your skin. Here's how to adjust your routine for the winter months.",
        content: `As temperatures drop, your skin faces new challenges. Cold air outside and heated air inside can leave your skin feeling dry, tight, and uncomfortable.

**Switch to Richer Products**
- Replace gel moisturizers with cream formulas
- Add facial oils for extra nourishment
- Use gentle, hydrating cleansers

**Don't Forget Sunscreen**
UV rays are still present in winter. Snow can even reflect UV rays, increasing exposure.

**Humidify Your Space**
Indoor heating strips moisture from the air. A humidifier can help maintain skin hydration.

**Protect Your Lips and Hands**
These areas are often neglected but need extra care in winter. Use nourishing balms and hand creams regularly.`,
        authorId: "system",
        authorName: "Dr. Sarah Chen",
        published: true,
        publishedAt: new Date("2025-01-05"),
        tags: ["featured", "tips", "seasonal"],
        viewCount: 0,
        createdAt: new Date("2025-01-05"),
        updatedAt: new Date("2025-01-05"),
    },
    {
        id: randomUUID(),
        title: "The Power of Vitamin C in Your Skincare",
        slug: "power-of-vitamin-c",
        excerpt: "Discover why vitamin C is essential for bright, healthy skin and how to choose the right product.",
        content: `Vitamin C is a powerhouse antioxidant that offers multiple benefits for your skin. From brightening to anti-aging, this ingredient deserves a spot in your routine.

**Benefits of Vitamin C**
- Brightens dull skin
- Fades dark spots and hyperpigmentation
- Boosts collagen production
- Protects against environmental damage

**Types of Vitamin C**
- L-Ascorbic Acid: Most potent but least stable
- Ascorbyl Palmitate: Oil-soluble and stable
- Magnesium Ascorbyl Phosphate: Gentle and stable

**How to Use It**
Apply in the morning before sunscreen for antioxidant protection throughout the day.`,
        authorId: "system",
        authorName: "Dr. Michael Park",
        published: true,
        publishedAt: new Date("2024-12-28"),
        tags: ["ingredients", "brightening"],
        viewCount: 0,
        createdAt: new Date("2024-12-28"),
        updatedAt: new Date("2024-12-28"),
    },
    {
        id: randomUUID(),
        title: "Double Cleansing: Is It Right for You?",
        slug: "double-cleansing-guide",
        excerpt: "Everything you need to know about the double cleansing method and whether it's suitable for your skin.",
        content: `Double cleansing has been a cornerstone of Korean skincare for years. But is it right for everyone?

**What is Double Cleansing?**
It involves using two types of cleansers: an oil-based cleanser first to break down makeup and sunscreen, followed by a water-based cleanser to remove remaining impurities.

**Who Should Double Cleanse?**
- Those who wear makeup
- Anyone using sunscreen (which should be everyone!)
- People with oily skin
- Those exposed to pollution

**Who Might Want to Skip It?**
- If you have very dry or sensitive skin
- If you don't wear makeup or sunscreen
- If your skin feels stripped after cleansing`,
        authorId: "system",
        authorName: "Emma Rodriguez",
        published: true,
        publishedAt: new Date("2024-12-20"),
        tags: ["tutorials", "cleansing"],
        viewCount: 0,
        createdAt: new Date("2024-12-20"),
        updatedAt: new Date("2024-12-20"),
    },
    {
        id: randomUUID(),
        title: "Retinol 101: A Beginner's Guide",
        slug: "retinol-beginners-guide",
        excerpt: "New to retinol? Learn how to introduce this powerful anti-aging ingredient into your routine safely.",
        content: `Retinol is one of the most researched and effective anti-aging ingredients available. But with great power comes the need for careful use.

**What is Retinol?**
Retinol is a form of vitamin A that promotes cell turnover and collagen production.

**Benefits**
- Reduces fine lines and wrinkles
- Improves skin texture
- Fades dark spots
- Minimizes pores

**How to Start**
- Begin with a low concentration (0.25-0.5%)
- Use only 2-3 times per week initially
- Always apply at night
- Use sunscreen religiously

**Managing Side Effects**
Some irritation is normal when starting. Keep skin hydrated and reduce frequency if needed.`,
        authorId: "system",
        authorName: "Dr. Sarah Chen",
        published: true,
        publishedAt: new Date("2024-12-15"),
        tags: ["ingredients", "anti-aging"],
        viewCount: 0,
        createdAt: new Date("2024-12-15"),
        updatedAt: new Date("2024-12-15"),
    },
];

async function seedBlogPosts() {
    console.log("Seeding blog posts...");

    try {
        for (const post of sampleBlogPosts) {
            await db.insert(blogPosts).values(post);
            console.log(`✓ Added: ${post.title}`);
        }
        console.log("\n✅ Successfully seeded 6 blog posts!");
    } catch (error) {
        console.error("Error seeding blog posts:", error);
        throw error;
    }
}

seedBlogPosts()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
