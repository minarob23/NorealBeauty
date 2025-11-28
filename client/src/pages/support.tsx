import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { ChevronRight, HelpCircle, Truck, RotateCcw } from "lucide-react";
import { Footer } from "@/components/footer";
import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const faqData = {
  en: [
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all unused products in their original packaging. Simply contact our customer service team to initiate a return."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 5-7 business days. Express shipping (2-3 business days) is available at checkout for an additional fee."
    },
    {
      question: "Are your products cruelty-free?",
      answer: "Yes, all NORÉAL products are 100% cruelty-free. We never test on animals and are certified by Leaping Bunny."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to over 50 countries worldwide. International shipping typically takes 10-14 business days."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive an email with a tracking number. You can use this to track your package on our website or the carrier's site."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay."
    }
  ],
  fr: [
    {
      question: "Quelle est votre politique de retour?",
      answer: "Nous offrons une politique de retour de 30 jours pour tous les produits non utilisés dans leur emballage d'origine."
    },
    {
      question: "Combien de temps prend la livraison?",
      answer: "La livraison standard prend 5-7 jours ouvrables. La livraison express (2-3 jours) est disponible moyennant des frais supplémentaires."
    },
    {
      question: "Vos produits sont-ils cruelty-free?",
      answer: "Oui, tous les produits NORÉAL sont 100% cruelty-free. Nous ne testons jamais sur les animaux."
    },
    {
      question: "Livrez-vous à l'international?",
      answer: "Oui, nous livrons dans plus de 50 pays. La livraison internationale prend généralement 10-14 jours ouvrables."
    },
    {
      question: "Comment suivre ma commande?",
      answer: "Une fois votre commande expédiée, vous recevrez un email avec un numéro de suivi."
    },
    {
      question: "Quels moyens de paiement acceptez-vous?",
      answer: "Nous acceptons toutes les principales cartes de crédit, PayPal, Apple Pay et Google Pay."
    }
  ],
  es: [
    {
      question: "¿Cuál es su política de devoluciones?",
      answer: "Ofrecemos una política de devolución de 30 días para todos los productos sin usar en su embalaje original."
    },
    {
      question: "¿Cuánto tarda el envío?",
      answer: "El envío estándar tarda 5-7 días hábiles. El envío express (2-3 días) está disponible por un cargo adicional."
    },
    {
      question: "¿Sus productos son libres de crueldad animal?",
      answer: "Sí, todos los productos NORÉAL son 100% libres de crueldad animal. Nunca probamos en animales."
    },
    {
      question: "¿Realizan envíos internacionales?",
      answer: "Sí, enviamos a más de 50 países. El envío internacional generalmente toma 10-14 días hábiles."
    },
    {
      question: "¿Cómo puedo rastrear mi pedido?",
      answer: "Una vez que se envíe su pedido, recibirá un correo electrónico con un número de seguimiento."
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer: "Aceptamos todas las principales tarjetas de crédito, PayPal, Apple Pay y Google Pay."
    }
  ]
};

const shippingInfo = {
  en: {
    title: "Shipping Information",
    methods: [
      { name: "Standard Shipping", time: "5-7 business days", price: "Free on orders over $50" },
      { name: "Express Shipping", time: "2-3 business days", price: "$9.99" },
      { name: "Next Day Delivery", time: "1 business day", price: "$19.99" }
    ],
    details: [
      "All orders are processed within 1-2 business days",
      "You will receive a shipping confirmation email with tracking information",
      "International shipping is available to over 50 countries",
      "International orders may be subject to customs duties and taxes"
    ]
  },
  fr: {
    title: "Informations de Livraison",
    methods: [
      { name: "Livraison Standard", time: "5-7 jours ouvrables", price: "Gratuit pour les commandes de plus de 50€" },
      { name: "Livraison Express", time: "2-3 jours ouvrables", price: "9,99€" },
      { name: "Livraison le Lendemain", time: "1 jour ouvrable", price: "19,99€" }
    ],
    details: [
      "Toutes les commandes sont traitées dans un délai de 1-2 jours ouvrables",
      "Vous recevrez un email de confirmation avec les informations de suivi",
      "La livraison internationale est disponible dans plus de 50 pays",
      "Les commandes internationales peuvent être soumises à des droits de douane"
    ]
  },
  es: {
    title: "Información de Envío",
    methods: [
      { name: "Envío Estándar", time: "5-7 días hábiles", price: "Gratis en pedidos superiores a 50€" },
      { name: "Envío Express", time: "2-3 días hábiles", price: "9,99€" },
      { name: "Entrega al Día Siguiente", time: "1 día hábil", price: "19,99€" }
    ],
    details: [
      "Todos los pedidos se procesan en 1-2 días hábiles",
      "Recibirás un email de confirmación con la información de seguimiento",
      "El envío internacional está disponible a más de 50 países",
      "Los pedidos internacionales pueden estar sujetos a aranceles e impuestos"
    ]
  }
};

const returnsInfo = {
  en: {
    title: "Returns & Exchanges",
    policy: "We want you to love your NORÉAL products. If you're not completely satisfied, we offer hassle-free returns within 30 days of purchase.",
    steps: [
      { step: 1, title: "Initiate Return", description: "Contact our customer service team or log into your account to start a return" },
      { step: 2, title: "Pack Your Items", description: "Place items in original packaging with all tags attached" },
      { step: 3, title: "Ship It Back", description: "Use the prepaid shipping label we provide" },
      { step: 4, title: "Get Refunded", description: "Refund processed within 5-7 business days of receiving your return" }
    ],
    conditions: [
      "Products must be unused and in original packaging",
      "Returns must be initiated within 30 days of delivery",
      "Sale items are final sale and cannot be returned",
      "Gift cards are non-refundable"
    ]
  },
  fr: {
    title: "Retours et Échanges",
    policy: "Nous voulons que vous aimiez vos produits NORÉAL. Si vous n'êtes pas entièrement satisfait, nous offrons des retours sans tracas dans les 30 jours suivant l'achat.",
    steps: [
      { step: 1, title: "Initier le Retour", description: "Contactez notre service client ou connectez-vous à votre compte" },
      { step: 2, title: "Emballer les Articles", description: "Placez les articles dans leur emballage d'origine avec toutes les étiquettes" },
      { step: 3, title: "Renvoyer", description: "Utilisez l'étiquette d'expédition prépayée que nous fournissons" },
      { step: 4, title: "Remboursement", description: "Remboursement traité dans les 5-7 jours ouvrables après réception" }
    ],
    conditions: [
      "Les produits doivent être inutilisés et dans leur emballage d'origine",
      "Les retours doivent être initiés dans les 30 jours suivant la livraison",
      "Les articles en solde sont en vente finale et ne peuvent être retournés",
      "Les cartes cadeaux ne sont pas remboursables"
    ]
  },
  es: {
    title: "Devoluciones y Cambios",
    policy: "Queremos que ames tus productos NORÉAL. Si no estás completamente satisfecho, ofrecemos devoluciones sin complicaciones dentro de los 30 días posteriores a la compra.",
    steps: [
      { step: 1, title: "Iniciar Devolución", description: "Contacta a nuestro equipo de servicio al cliente o inicia sesión en tu cuenta" },
      { step: 2, title: "Empacar los Artículos", description: "Coloca los artículos en su embalaje original con todas las etiquetas" },
      { step: 3, title: "Enviar de Vuelta", description: "Usa la etiqueta de envío prepagada que proporcionamos" },
      { step: 4, title: "Obtener Reembolso", description: "Reembolso procesado dentro de 5-7 días hábiles después de recibir tu devolución" }
    ],
    conditions: [
      "Los productos deben estar sin usar y en su embalaje original",
      "Las devoluciones deben iniciarse dentro de los 30 días posteriores a la entrega",
      "Los artículos en oferta son venta final y no pueden ser devueltos",
      "Las tarjetas de regalo no son reembolsables"
    ]
  }
};

export default function Support() {
  const [location] = useLocation();
  const { language } = useAppStore();
  const t = getTranslations(language);
  
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const defaultTab = searchParams.get("tab") || "faq";
  
  const faqs = faqData[language];
  const shipping = shippingInfo[language];
  const returns = returnsInfo[language];

  const tabLabels = {
    en: { faq: "FAQ", shipping: "Shipping", returns: "Returns" },
    fr: { faq: "FAQ", shipping: "Livraison", returns: "Retours" },
    es: { faq: "FAQ", shipping: "Envío", returns: "Devoluciones" }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/">
            <span className="hover:text-foreground transition-colors">{t.nav.home}</span>
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{t.footer.support}</span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 font-serif text-4xl font-light tracking-wide"
        >
          {t.footer.support}
        </motion.h1>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="faq" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              {tabLabels[language].faq}
            </TabsTrigger>
            <TabsTrigger value="shipping" className="gap-2">
              <Truck className="h-4 w-4" />
              {tabLabels[language].shipping}
            </TabsTrigger>
            <TabsTrigger value="returns" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              {tabLabels[language].returns}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Accordion type="single" collapsible className="w-full max-w-3xl">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </TabsContent>

          <TabsContent value="shipping" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-3xl space-y-8"
            >
              <h2 className="font-serif text-2xl font-light">{shipping.title}</h2>
              
              <div className="grid gap-4 md:grid-cols-3">
                {shipping.methods.map((method, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <h3 className="font-medium">{method.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{method.time}</p>
                    <p className="mt-2 font-medium text-primary">{method.price}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="mb-4 font-medium">
                  {language === "en" ? "Important Information" : language === "fr" ? "Informations Importantes" : "Información Importante"}
                </h3>
                <ul className="space-y-2">
                  {shipping.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="returns" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-3xl space-y-8"
            >
              <h2 className="font-serif text-2xl font-light">{returns.title}</h2>
              
              <p className="text-muted-foreground">{returns.policy}</p>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {returns.steps.map((step) => (
                  <div key={step.step} className="text-center">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {step.step}
                    </div>
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="mb-4 font-medium">
                  {language === "en" ? "Return Conditions" : language === "fr" ? "Conditions de Retour" : "Condiciones de Devolución"}
                </h3>
                <ul className="space-y-2">
                  {returns.conditions.map((condition, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      {condition}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </motion.div>
  );
}
