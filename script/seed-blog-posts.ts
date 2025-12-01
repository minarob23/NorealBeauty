import "dotenv/config";
import { db } from "../server/db";
import { blogPosts, users } from "../shared/schema";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

const sampleBlogPosts = [
    // SKINCARE BASICS Section
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
        tags: ["skincare-basics", "tutorials", "beginner-friendly"],
        viewCount: 0,
        createdAt: new Date("2025-01-15"),
        updatedAt: new Date("2025-01-15"),
        coverImage: "/placeholder.svg?text=Skincare+Routine",
    },
    {
        id: randomUUID(),
        title: "Understanding Your Skin Type: A Complete Guide",
        slug: "understanding-skin-type-guide",
        excerpt: "Learn how to identify your skin type and choose the right products for your unique needs.",
        content: `Knowing your skin type is the foundation of any successful skincare routine. Here's how to identify yours and what it means for your skincare choices.

**The Four Main Skin Types**

1. **Normal Skin**
   - Balanced moisture levels
   - Few blemishes
   - Small pores
   - Radiant complexion

2. **Dry Skin**
   - Feels tight or rough
   - Visible flaking
   - Fine lines more prominent
   - Matte appearance

3. **Oily Skin**
   - Shiny appearance
   - Enlarged pores
   - Prone to blackheads
   - Makeup doesn't last

4. **Combination Skin**
   - Oily T-zone (forehead, nose, chin)
   - Dry or normal cheeks
   - Mix of enlarged and small pores

**How to Test Your Skin Type**
Cleanse your face and wait 30 minutes. Observe how your skin feels and looks without any products.

**Choosing Products for Your Type**
- Normal: Most products will work
- Dry: Rich creams, oils, gentle cleansers
- Oily: Lightweight gels, oil-free formulas
- Combination: Zone-targeted approach`,
        authorId: "system",
        authorName: "Emma Rodriguez",
        published: true,
        publishedAt: new Date("2025-01-12"),
        tags: ["skincare-basics", "skin-types", "beginner-friendly"],
        viewCount: 0,
        createdAt: new Date("2025-01-12"),
        updatedAt: new Date("2025-01-12"),
        coverImage: "/placeholder.svg?text=Skin+Types",
    },
    {
        id: randomUUID(),
        title: "Morning vs. Night Skincare: What's the Difference?",
        slug: "morning-night-skincare-difference",
        excerpt: "Your skin has different needs throughout the day. Learn how to optimize your AM and PM routines.",
        content: `Your skin works differently during the day and night, so your skincare routine should too.

**Morning Routine Focus: Protection**
Your morning routine should prepare and protect your skin for the day ahead.

Essential Steps:
1. Gentle cleanse (or just rinse with water)
2. Vitamin C serum for antioxidant protection
3. Lightweight moisturizer
4. SPF 30+ sunscreen (always!)

**Night Routine Focus: Repair**
At night, your skin goes into repair mode, making it the perfect time for treatment products.

Essential Steps:
1. Double cleanse (oil cleanser + water-based)
2. Treatment serums (retinol, acids)
3. Rich moisturizer or night cream
4. Eye cream
5. Optional: Face oil or sleeping mask

**Key Differences**
- Sunscreen is only for morning
- Retinol and strong actives are for night
- Richer products work better at night
- Morning focuses on protection, night on repair`,
        authorId: "system",
        authorName: "Dr. Sarah Chen",
        published: true,
        publishedAt: new Date("2025-01-08"),
        tags: ["skincare-basics", "tutorials", "routines"],
        viewCount: 0,
        createdAt: new Date("2025-01-08"),
        updatedAt: new Date("2025-01-08"),
        coverImage: "/placeholder.svg?text=AM+PM+Routine",
    },

    // INGREDIENT SPOTLIGHT Section
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
- Use both morning and night

**Common Mistakes to Avoid**
- Using on completely dry skin
- Skipping moisturizer afterwards
- Using in very dry climates without proper occlusion`,
        authorId: "system",
        authorName: "Dr. Michael Park",
        published: true,
        publishedAt: new Date("2025-01-10"),
        tags: ["ingredient-spotlight", "hydration", "serums"],
        viewCount: 0,
        createdAt: new Date("2025-01-10"),
        updatedAt: new Date("2025-01-10"),
        coverImage: "/placeholder.svg?text=Hyaluronic+Acid",
    },
    {
        id: randomUUID(),
        title: "The Power of Vitamin C in Your Skincare",
        slug: "power-of-vitamin-c",
        excerpt: "Discover why vitamin C is essential for bright, healthy skin and how to choose the right product.",
        content: `Vitamin C is a powerhouse antioxidant that offers multiple benefits for your skin. From brightening to anti-aging, this ingredient deserves a spot in your routine.

**Benefits of Vitamin C**
- Brightens dull skin and evens tone
- Fades dark spots and hyperpigmentation
- Boosts collagen production
- Protects against environmental damage
- Enhances sun protection when used with SPF

**Types of Vitamin C**
1. **L-Ascorbic Acid**
   - Most potent form
   - Best for brightening
   - Can be unstable
   - pH dependent

2. **Ascorbyl Palmitate**
   - Oil-soluble and stable
   - Gentler on skin
   - Good for dry skin

3. **Magnesium Ascorbyl Phosphate**
   - Very stable
   - Gentle and hydrating
   - Great for sensitive skin

**How to Use It**
Apply in the morning before sunscreen for antioxidant protection throughout the day. Start with lower concentrations (10-15%) and work up.

**Storage Tips**
Keep vitamin C products in dark, cool places to maintain potency.`,
        authorId: "system",
        authorName: "Emma Rodriguez",
        published: true,
        publishedAt: new Date("2024-12-28"),
        tags: ["ingredient-spotlight", "brightening", "antioxidants"],
        viewCount: 0,
        createdAt: new Date("2024-12-28"),
        updatedAt: new Date("2024-12-28"),
        coverImage: "/placeholder.svg?text=Vitamin+C",
    },
    {
        id: randomUUID(),
        title: "Retinol 101: A Beginner's Guide to Anti-Aging",
        slug: "retinol-beginners-guide",
        excerpt: "New to retinol? Learn how to introduce this powerful anti-aging ingredient into your routine safely.",
        content: `Retinol is one of the most researched and effective anti-aging ingredients available. But with great power comes the need for careful use.

**What is Retinol?**
Retinol is a form of vitamin A that promotes cell turnover and collagen production. It's the gold standard for anti-aging.

**Benefits**
- Reduces fine lines and wrinkles
- Improves skin texture and tone
- Fades dark spots and sun damage
- Minimizes pores
- Treats acne

**How to Start**
1. Begin with a low concentration (0.25-0.5%)
2. Use only 2-3 times per week initially
3. Always apply at night
4. Use sunscreen religiously during the day
5. Wait 20 minutes after cleansing before applying

**The Retinization Period**
Expect some adjustment period (2-4 weeks) with possible:
- Mild redness
- Dryness
- Flaking
- Increased sensitivity

**Managing Side Effects**
- Keep skin well-hydrated
- Reduce frequency if irritation occurs
- Use a pea-sized amount
- Avoid mixing with other strong actives initially
- Be patient - results take 12 weeks

**Who Should Avoid It**
- Pregnant or nursing women
- Those with very sensitive skin (start with alternatives)`,
        authorId: "system",
        authorName: "Dr. Sarah Chen",
        published: true,
        publishedAt: new Date("2024-12-15"),
        tags: ["ingredient-spotlight", "anti-aging", "retinol"],
        viewCount: 0,
        createdAt: new Date("2024-12-15"),
        updatedAt: new Date("2024-12-15"),
        coverImage: "/placeholder.svg?text=Retinol",
    },
    {
        id: randomUUID(),
        title: "Niacinamide: The Multi-Tasking Skincare Superstar",
        slug: "niacinamide-skincare-benefits",
        excerpt: "Discover why niacinamide is one of the most versatile and effective ingredients for all skin types.",
        content: `Niacinamide (Vitamin B3) is a true skincare multitasker that works for virtually every skin concern and type.

**What is Niacinamide?**
A water-soluble vitamin that works with your skin's natural substances to improve multiple skin concerns simultaneously.

**Impressive Benefits**
- Minimizes pore appearance
- Regulates oil production
- Reduces redness and inflammation
- Fades hyperpigmentation
- Strengthens skin barrier
- Reduces fine lines
- Protects against environmental damage

**Perfect for All Skin Types**
Unlike many actives, niacinamide is:
- Gentle enough for sensitive skin
- Effective for oily skin
- Hydrating for dry skin
- Safe to use morning and night
- Can be combined with most ingredients

**Concentration Matters**
Look for products with 2-10% niacinamide. Most studies show benefits at 5%.

**How to Use**
Apply after cleansing and before heavier creams. Can be used both AM and PM.

**Combination Tips**
- Pairs well with: Hyaluronic acid, peptides, antioxidants
- Can use with retinol (but start slow)
- Works great with vitamin C (despite old myths)`,
        authorId: "system",
        authorName: "Dr. Michael Park",
        published: true,
        publishedAt: new Date("2024-12-22"),
        tags: ["ingredient-spotlight", "niacinamide", "all-skin-types"],
        viewCount: 0,
        createdAt: new Date("2024-12-22"),
        updatedAt: new Date("2024-12-22"),
        coverImage: "/placeholder.svg?text=Niacinamide",
    },

    // SEASONAL SKINCARE Section
    {
        id: randomUUID(),
        title: "Winter Skincare: Protecting Your Skin in Cold Weather",
        slug: "winter-skincare-cold-weather",
        excerpt: "Cold weather can wreak havoc on your skin. Here's how to adjust your routine for the winter months.",
        content: `As temperatures drop, your skin faces new challenges. Cold air outside and heated air inside can leave your skin feeling dry, tight, and uncomfortable.

**Why Winter is Harsh on Skin**
- Low humidity strips moisture
- Indoor heating dries the air
- Hot showers disrupt skin barrier
- Wind causes irritation
- Less water consumption

**Winter Skincare Adjustments**

**1. Switch to Richer Products**
- Replace gel moisturizers with cream formulas
- Add facial oils for extra nourishment
- Use gentle, hydrating cleansers
- Consider a heavier night cream

**2. Layer Your Products**
- Hyaluronic acid on damp skin
- Serum while skin is still moist
- Rich moisturizer to seal it in
- Face oil as final step (optional)

**3. Don't Forget Sunscreen**
UV rays are still present in winter. Snow can even reflect up to 80% of UV rays, increasing exposure.

**4. Humidify Your Space**
Indoor heating strips moisture from the air. A humidifier can help maintain skin hydration levels.

**5. Protect Extremities**
- Use nourishing lip balms frequently
- Apply hand cream after each wash
- Don't neglect your neck and chest

**6. Adjust Water Temperature**
Resist the urge for hot showers. Use lukewarm water to avoid disrupting your skin barrier.

**Emergency Dry Skin Fix**
If skin becomes extremely dry, try a hydrating mask or apply a thick layer of moisturizer as an overnight mask.`,
        authorId: "system",
        authorName: "Dr. Sarah Chen",
        published: true,
        publishedAt: new Date("2025-01-05"),
        tags: ["seasonal-skincare", "winter", "hydration"],
        viewCount: 0,
        createdAt: new Date("2025-01-05"),
        updatedAt: new Date("2025-01-05"),
        coverImage: "/placeholder.svg?text=Winter+Skincare",
    },
    {
        id: randomUUID(),
        title: "Summer Skincare Essentials: Stay Protected and Glowing",
        slug: "summer-skincare-essentials",
        excerpt: "Hot weather brings unique skincare challenges. Learn how to keep your skin healthy and radiant all summer long.",
        content: `Summer means more sun exposure, heat, and humidity - all of which affect your skin differently than other seasons.

**Summer Skin Challenges**
- Increased sun exposure
- More sebum production
- Sweat and clogged pores
- Chlorine and salt water exposure
- Higher humidity levels

**Essential Summer Adjustments**

**1. Upgrade Your Sun Protection**
- Use SPF 50+ for prolonged outdoor activities
- Reapply every 2 hours
- Don't forget ears, neck, hands, feet
- Wear protective clothing and hats

**2. Switch to Lighter Textures**
- Gel-based moisturizers
- Lightweight serums
- Oil-free sunscreens
- Water-based products

**3. Double Up on Antioxidants**
- Vitamin C in the morning
- Green tea or resveratrol
- Helps fight free radical damage from sun

**4. Exfoliate Regularly**
- Remove dead skin cells
- Prevent clogged pores from sweat
- Helps products absorb better
- But don't overdo it!

**5. Hydrate Inside and Out**
- Drink plenty of water
- Use hydrating mists throughout the day
- Lightweight hyaluronic acid serums

**After-Sun Care**
- Aloe vera for soothing
- Hydrating masks
- Extra moisturizer
- Avoid exfoliation if sunburned

**Beach/Pool Skincare**
- Apply waterproof sunscreen 30 min before
- Rinse chlorine/salt water immediately
- Use a gentle cleanser
- Deep condition with a mask`,
        authorId: "system",
        authorName: "Emma Rodriguez",
        published: true,
        publishedAt: new Date("2024-06-15"),
        tags: ["seasonal-skincare", "summer", "sun-protection"],
        viewCount: 0,
        createdAt: new Date("2024-06-15"),
        updatedAt: new Date("2024-06-15"),
        coverImage: "/placeholder.svg?text=Summer+Skincare",
    },
    {
        id: randomUUID(),
        title: "Fall Skincare Transition: Preparing for Cooler Weather",
        slug: "fall-skincare-transition-guide",
        excerpt: "As temperatures drop, learn how to transition your skincare routine from summer to fall seamlessly.",
        content: `Fall is the perfect time to repair summer damage and prepare your skin for winter's harsh conditions.

**Why Fall Skincare Matters**
- Repair UV damage from summer
- Prepare for drier winter air
- Take advantage of cooler weather for treatments
- Address summer breakouts

**Transition Steps**

**1. Assess Summer Damage**
- Check for new dark spots
- Notice any texture changes
- Evaluate hydration levels
- Look for signs of photo-aging

**2. Increase Exfoliation**
Fall is ideal for stronger exfoliants:
- Chemical peels (AHA/BHA)
- Retinol treatments
- Enzyme masks
- Gentle physical exfoliation

**3. Boost Hydration Gradually**
- Start adding richer moisturizers at night
- Incorporate hydrating serums
- Add face oils to your routine
- Consider hyaluronic acid boosters

**4. Focus on Repair**
- Vitamin C for brightening
- Niacinamide for barrier repair
- Peptides for anti-aging
- Antioxidants for protection

**5. Don't Skip SPF**
UV rays don't take fall off! Continue daily sun protection.

**Perfect Fall Treatments**
- Chemical peels
- Laser treatments
- Retinol programs
- Intensive masks

**Building Your Fall Routine**
Morning: Gentle cleanse, vitamin C, moisturizer, SPF
Night: Double cleanse, treatment serum, rich moisturizer, oil`,
        authorId: "system",
        authorName: "Dr. Michael Park",
        published: true,
        publishedAt: new Date("2024-09-20"),
        tags: ["seasonal-skincare", "fall", "transition"],
        viewCount: 0,
        createdAt: new Date("2024-09-20"),
        updatedAt: new Date("2024-09-20"),
        coverImage: "/placeholder.svg?text=Fall+Skincare",
    },

    // SKIN CONCERNS Section
    {
        id: randomUUID(),
        title: "How to Fade Hyperpigmentation and Dark Spots",
        slug: "fade-hyperpigmentation-dark-spots",
        excerpt: "Struggling with dark spots? Learn the most effective ingredients and techniques to achieve even-toned skin.",
        content: `Hyperpigmentation is one of the most common skin concerns, but with the right approach, it can be significantly improved.

**Understanding Hyperpigmentation**
Dark spots occur when melanin production goes into overdrive, usually triggered by:
- Sun exposure (most common)
- Acne scarring
- Hormonal changes
- Inflammation or injury

**Most Effective Ingredients**

**1. Vitamin C (15-20%)**
- Brightens and evens tone
- Prevents new spots
- Boosts collagen

**2. Niacinamide (5-10%)**
- Inhibits melanin transfer
- Reduces inflammation
- Strengthens barrier

**3. Alpha Arbutin (2%)**
- Gentle brightener
- Targets specific spots
- Safe for all skin tones

**4. Kojic Acid**
- Powerful lightener
- Can be irritating
- Use with caution

**5. Retinoids**
- Increases cell turnover
- Fades spots over time
- Prevents new formation

**Treatment Protocol**
1. Consistent sunscreen use (SPF 50+)
2. Vitamin C in the morning
3. Niacinamide day and night
4. Retinol at night (start slow)
5. Alpha arbutin for targeted treatment

**Timeline Expectations**
- 4-6 weeks: Slight improvement
- 8-12 weeks: Noticeable fading
- 6+ months: Significant results

**Professional Options**
- Chemical peels
- Laser therapy
- Microneedling
- Prescription retinoids

**Prevention is Key**
- Daily SPF (most important!)
- Treat acne quickly
- Avoid picking at skin
- Wear protective clothing`,
        authorId: "system",
        authorName: "Dr. Sarah Chen",
        published: true,
        publishedAt: new Date("2024-12-10"),
        tags: ["skin-concerns", "hyperpigmentation", "brightening"],
        viewCount: 0,
        createdAt: new Date("2024-12-10"),
        updatedAt: new Date("2024-12-10"),
        coverImage: "/placeholder.svg?text=Hyperpigmentation",
    },
    {
        id: randomUUID(),
        title: "Managing Acne-Prone Skin: A Complete Guide",
        slug: "managing-acne-prone-skin-guide",
        excerpt: "From prevention to treatment, learn how to effectively manage acne and prevent future breakouts.",
        content: `Acne affects millions of people worldwide. Understanding the causes and proper treatment can help you achieve clearer skin.

**Understanding Acne**
Acne forms when pores become clogged with oil, dead skin cells, and bacteria. Contributing factors:
- Excess sebum production
- Hormonal fluctuations
- Bacteria (C. acnes)
- Inflammation
- Genetics

**Building an Acne-Fighting Routine**

**Morning:**
1. Gentle, non-stripping cleanser
2. Salicylic acid toner (2%)
3. Niacinamide serum
4. Lightweight, oil-free moisturizer
5. SPF 30+ (oil-free)

**Evening:**
1. Double cleanse if wearing makeup
2. Benzoyl peroxide (2.5-5%) or retinoid
3. Spot treatment on active breakouts
4. Lightweight moisturizer

**Key Ingredients for Acne**

**Salicylic Acid (BHA)**
- Penetrates pores
- Dissolves oil and debris
- Anti-inflammatory

**Benzoyl Peroxide**
- Kills acne bacteria
- Reduces inflammation
- Can be drying

**Niacinamide**
- Regulates oil
- Reduces inflammation
- Fades post-acne marks

**Retinoids**
- Prevents clogged pores
- Reduces inflammation
- Improves texture

**Common Mistakes to Avoid**
- Over-cleansing or harsh scrubbing
- Skipping moisturizer
- Using too many actives at once
- Picking or popping
- Forgetting sunscreen

**When to See a Dermatologist**
- Painful cystic acne
- Scarring
- Over-the-counter products not working
- Acne affecting self-esteem

**Lifestyle Factors**
- Clean pillowcases weekly
- Avoid touching your face
- Manage stress
- Eat a balanced diet
- Stay hydrated`,
        authorId: "system",
        authorName: "Emma Rodriguez",
        published: true,
        publishedAt: new Date("2024-11-28"),
        tags: ["skin-concerns", "acne", "treatment"],
        viewCount: 0,
        createdAt: new Date("2024-11-28"),
        updatedAt: new Date("2024-11-28"),
        coverImage: "/placeholder.svg?text=Acne+Treatment",
    },
    {
        id: randomUUID(),
        title: "Anti-Aging Skincare: Start Early, Stay Consistent",
        slug: "anti-aging-skincare-guide",
        excerpt: "It's never too early or too late to start an anti-aging skincare routine. Learn the best practices for youthful skin.",
        content: `Aging is natural, but premature aging can be prevented with the right skincare approach.

**Signs of Aging Skin**
- Fine lines and wrinkles
- Loss of firmness and elasticity
- Uneven tone and texture
- Enlarged pores
- Dullness
- Dark spots

**The Best Anti-Aging Ingredients**

**1. Sunscreen (Most Important!)**
80% of facial aging comes from sun damage. Daily SPF 30+ is non-negotiable.

**2. Retinoids**
The gold standard for anti-aging:
- Boosts collagen production
- Improves cell turnover
- Reduces fine lines
- Evens skin tone

**3. Vitamin C**
Antioxidant powerhouse:
- Protects against free radicals
- Brightens skin
- Supports collagen

**4. Peptides**
Building blocks for collagen and elastin:
- Improves firmness
- Reduces wrinkle depth
- Supports skin structure

**5. Hyaluronic Acid**
Hydration hero:
- Plumps fine lines
- Improves skin texture
- Boosts moisture

**Age-Appropriate Routines**

**20s: Prevention**
- Daily SPF
- Antioxidants (Vitamin C)
- Light moisturizer
- Gentle exfoliation

**30s: Early Intervention**
- Everything from 20s, plus:
- Retinol (low strength)
- Eye cream
- Richer moisturizer

**40s+: Active Treatment**
- Higher strength retinoids
- Peptides and growth factors
- Multiple antioxidants
- Rich night creams
- Consider professional treatments

**Lifestyle Factors**
- Don't smoke
- Limit alcohol
- Get enough sleep
- Manage stress
- Eat antioxidant-rich foods
- Stay hydrated
- Exercise regularly

**Professional Treatments**
- Botox and fillers
- Laser resurfacing
- Microneedling
- Chemical peels
- Radiofrequency`,
        authorId: "system",
        authorName: "Dr. Michael Park",
        published: true,
        publishedAt: new Date("2024-11-15"),
        tags: ["skin-concerns", "anti-aging", "prevention"],
        viewCount: 0,
        createdAt: new Date("2024-11-15"),
        updatedAt: new Date("2024-11-15"),
        coverImage: "/placeholder.svg?text=Anti-Aging",
    },
    {
        id: randomUUID(),
        title: "Sensitive Skin Solutions: Gentle Yet Effective Skincare",
        slug: "sensitive-skin-solutions",
        excerpt: "Having sensitive skin doesn't mean you can't have an effective routine. Learn how to care for reactive skin.",
        content: `Sensitive skin requires extra care and attention. The right approach can help you achieve healthy skin without irritation.

**Signs of Sensitive Skin**
- Frequent redness
- Burning or stinging
- Itching or tightness
- Reactions to products
- Visible blood vessels
- Flaking or rough patches

**Common Triggers**
- Fragrances
- Essential oils
- Alcohol
- Harsh sulfates
- Mechanical exfoliation
- Extreme temperatures
- Stress

**Building a Gentle Routine**

**Cleanse**
- Cream or milk cleansers
- Fragrance-free formulas
- Lukewarm water only
- Pat dry gently

**Treat**
Safe actives for sensitive skin:
- Niacinamide (gentle, soothing)
- Azelaic acid (anti-inflammatory)
- Low-strength retinol (start very slow)
- Centella asiatica (calming)

**Moisturize**
- Rich, barrier-repairing formulas
- Ceramides
- Colloidal oatmeal
- Avoid essential oils

**Protect**
- Mineral sunscreens (gentler)
- Zinc oxide or titanium dioxide
- Fragrance-free

**Soothing Ingredients**
- Centella asiatica (Cica)
- Allantoin
- Panthenol (Vitamin B5)
- Colloidal oatmeal
- Chamomile
- Green tea
- Aloe vera

**What to Avoid**
- Fragrances and essential oils
- Alcohol (SD alcohol, denatured)
- Harsh scrubs
- Strong acids in high percentages
- Multiple new products at once

**Patch Testing**
Always test new products:
1. Apply to inner forearm
2. Wait 24-48 hours
3. Check for reaction
4. If clear, test on small face area

**When to See a Doctor**
- Persistent redness (could be rosacea)
- Severe reactions
- Symptoms worsen
- Unsure about diagnosis`,
        authorId: "system",
        authorName: "Dr. Sarah Chen",
        published: true,
        publishedAt: new Date("2024-10-25"),
        tags: ["skin-concerns", "sensitive-skin", "gentle-skincare"],
        viewCount: 0,
        createdAt: new Date("2024-10-25"),
        updatedAt: new Date("2024-10-25"),
        coverImage: "/placeholder.svg?text=Sensitive+Skin",
    },
];

async function seedBlogPosts() {
    console.log("🌱 Seeding blog posts in 4 sections...\n");

    try {
        // First, get the owner user ID to use as author
        const owner = await db.query.users.findFirst({
            where: eq(users.isOwner, true),
        });

        if (!owner) {
            console.error("❌ No owner user found. Please create an owner first.");
            process.exit(1);
        }

        console.log(`✓ Found owner: ${owner.email}\n`);

        let count = 0;
        const sections = {
            "Skincare Basics": 0,
            "Ingredient Spotlight": 0,
            "Seasonal Skincare": 0,
            "Skin Concerns": 0,
        };

        for (const post of sampleBlogPosts) {
            // Use owner's ID instead of "system"
            const postWithAuthor = {
                ...post,
                authorId: owner.id,
            };
            
            await db.insert(blogPosts).values(postWithAuthor);
            count++;
            
            // Track by section
            if (post.tags?.includes("skincare-basics")) sections["Skincare Basics"]++;
            if (post.tags?.includes("ingredient-spotlight")) sections["Ingredient Spotlight"]++;
            if (post.tags?.includes("seasonal-skincare")) sections["Seasonal Skincare"]++;
            if (post.tags?.includes("skin-concerns")) sections["Skin Concerns"]++;
            
            console.log(`✓ Added: ${post.title}`);
        }
        
        console.log("\n📊 Blog Posts Summary:");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        Object.entries(sections).forEach(([section, num]) => {
            console.log(`  ${section}: ${num} posts`);
        });
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log(`\n✅ Successfully seeded ${count} blog posts across 4 sections!`);
    } catch (error) {
        console.error("❌ Error seeding blog posts:", error);
        throw error;
    }
}

seedBlogPosts()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
