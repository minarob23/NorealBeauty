import { motion } from "framer-motion";
import { Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

interface CompareButtonProps {
  productId: string;
  productName: string;
  variant?: "icon" | "default";
  className?: string;
}

export function CompareButton({
  productId,
  productName,
  variant = "icon",
  className,
}: CompareButtonProps) {
  const { addToCompare, removeFromCompare, isInCompare, compareItems, language } =
    useAppStore();
  const { toast } = useToast();
  const inCompare = isInCompare(productId);

  const labels = {
    en: {
      add: "Add to Compare",
      remove: "Remove from Compare",
      added: "Added to compare",
      removed: "Removed from compare",
      maxReached: "You can compare up to 4 products",
    },
    fr: {
      add: "Ajouter à la comparaison",
      remove: "Retirer de la comparaison",
      added: "Ajouté à la comparaison",
      removed: "Retiré de la comparaison",
      maxReached: "Vous pouvez comparer jusqu'à 4 produits",
    },
    es: {
      add: "Añadir a comparar",
      remove: "Quitar de comparar",
      added: "Añadido a comparar",
      removed: "Quitado de comparar",
      maxReached: "Puedes comparar hasta 4 productos",
    },
  };

  const label = labels[language];

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inCompare) {
      removeFromCompare(productId);
      toast({ description: label.removed });
    } else {
      if (compareItems.length >= 4) {
        toast({
          description: label.maxReached,
          variant: "destructive",
        });
        return;
      }
      addToCompare(productId);
      toast({ description: label.added });
    }
  };

  if (variant === "icon") {
    return (
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="outline"
          size="icon"
          onClick={handleClick}
          className={`${inCompare ? "bg-primary text-primary-foreground" : ""} ${className || ""}`}
          title={inCompare ? label.remove : label.add}
        >
          <Scale className="h-4 w-4" />
        </Button>
      </motion.div>
    );
  }

  return (
    <Button
      variant={inCompare ? "default" : "outline"}
      onClick={handleClick}
      className={className}
    >
      <Scale className="mr-2 h-4 w-4" />
      {inCompare ? label.remove : label.add}
    </Button>
  );
}
