import { motion } from "framer-motion";
import { Leaf, Shield, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Leaf,
    title: "Clean Formulas",
    description:
      "We use only the highest quality ingredients, free from harmful chemicals and toxins. Every product is thoughtfully crafted for your skin's health.",
  },
  {
    icon: Shield,
    title: "Dermatologist Tested",
    description:
      "All our products undergo rigorous testing by dermatologists to ensure safety and efficacy for all skin types, including sensitive skin.",
  },
  {
    icon: Heart,
    title: "Sustainable Beauty",
    description:
      "From recyclable packaging to ethically sourced ingredients, we're committed to beauty that's kind to both you and the planet.",
  },
];

export function WhyNoreal() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-serif text-3xl font-light md:text-4xl">
            Why NORÉAL?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            We believe in skincare that works, crafted with integrity and backed by science.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-0 bg-background shadow-sm">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
                  >
                    <feature.icon className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h3 className="mb-3 text-lg font-medium">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
