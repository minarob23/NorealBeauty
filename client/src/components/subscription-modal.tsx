import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Check, Repeat, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";
import { subscriptionFrequencies } from "@shared/schema";
import { getProductImage } from "@/components/product-card";

interface SubscriptionModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageIndex?: number;
}

const frequencyOptions = [
  { value: "weekly", days: 7 },
  { value: "bi-weekly", days: 14 },
  { value: "monthly", days: 30 },
  { value: "bi-monthly", days: 60 },
] as const;

export function SubscriptionModal({
  product,
  open,
  onOpenChange,
  imageIndex = 0,
}: SubscriptionModalProps) {
  const { language, addToCart } = useAppStore();
  const t = getTranslations(language);
  const { toast } = useToast();

  const [frequency, setFrequency] = useState<typeof subscriptionFrequencies[number]>("monthly");

  const discountedPrice = product.price * 0.85;
  const savings = product.price - discountedPrice;

  const selectedOption = frequencyOptions.find((o) => o.value === frequency);
  const nextDeliveryDate = new Date();
  nextDeliveryDate.setDate(
    nextDeliveryDate.getDate() + (selectedOption?.days || 30)
  );

  const handleSubscribe = () => {
    addToCart({
      productId: product.id,
      quantity: 1,
      isSubscription: true,
      subscriptionFrequency: frequency,
    });
    toast({
      title: "Subscription added!",
      description: `${product.name} will be delivered ${frequency}.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-xl">
            <Repeat className="h-5 w-5 text-primary" />
            {t.subscription.title}
          </DialogTitle>
          <DialogDescription>
            {t.product.subscribeDiscount}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex gap-4">
          <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
            <img
              src={product.images[0] || getProductImage(imageIndex)}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            <Badge className="absolute -right-2 -top-2 bg-primary">
              <Sparkles className="mr-1 h-3 w-3" />
              15% OFF
            </Badge>
          </div>

          <div className="flex-1">
            <h3 className="font-medium">{product.name}</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-medium text-primary">
                ${discountedPrice.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                ${product.price.toFixed(2)}
              </span>
            </div>
            <p className="mt-1 text-sm text-green-600 dark:text-green-400">
              Save ${savings.toFixed(2)} per delivery
            </p>
          </div>
        </div>

        <div className="mt-6">
          <Label className="text-sm font-medium">{t.subscription.frequency}</Label>
          <RadioGroup
            value={frequency}
            onValueChange={(v) => setFrequency(v as typeof frequency)}
            className="mt-3 grid grid-cols-2 gap-3"
          >
            {frequencyOptions.map((option) => (
              <Label
                key={option.value}
                className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors ${
                  frequency === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  data-testid={`radio-frequency-${option.value}`}
                />
                <span className="text-sm">
                  {t.subscription[option.value as keyof typeof t.subscription]}
                </span>
              </Label>
            ))}
          </RadioGroup>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-md bg-muted/50 p-4"
        >
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{t.subscription.nextDelivery}:</span>
            <span className="font-medium">
              {nextDeliveryDate.toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </motion.div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 text-green-500" />
            Free shipping on all subscriptions
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 text-green-500" />
            Cancel or modify anytime
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 text-green-500" />
            Exclusive subscriber discounts
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            {t.common.cancel}
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubscribe}
            data-testid="button-subscribe-confirm"
          >
            <Repeat className="mr-2 h-4 w-4" />
            {t.product.subscribe}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
