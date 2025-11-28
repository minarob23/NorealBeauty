import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ChevronRight, ShoppingBag, User, Phone, MapPin, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import { getProductImage } from "@/components/product-card";

export default function Checkout() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const { cartItems, clearCart } = useAppStore();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to proceed with checkout.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate, toast]);

  // Redirect to shop if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !isLoading) {
      toast({
        title: "Cart is Empty",
        description: "Please add items to your cart before checking out.",
      });
      navigate("/shop");
    }
  }, [cartItems, isLoading, navigate, toast]);

  // Prefill user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || prev.fullName,
      }));
    }
  }, [user]);

  const cartProducts = cartItems.map((item, idx) => {
    const product = products.find((p) => p.id === item.productId);
    return { ...item, product, imageIndex: idx };
  });

  const subtotal = cartProducts.reduce((sum, item) => {
    if (!item.product) return sum;
    const price = item.isSubscription
      ? item.product.price * 0.85
      : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const shipping = 5.00;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      // Prepare order data for database
      const orderItems = cartProducts.map(item => ({
        productId: item.productId,
        productName: item.product?.name || '',
        quantity: item.quantity,
        price: item.isSubscription 
          ? (item.product?.price || 0) * 0.85
          : (item.product?.price || 0),
        isSubscription: item.isSubscription,
        subscriptionFrequency: item.subscriptionFrequency,
      }));

      const customerInfo = {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        email: user?.email,
        notes: formData.notes,
      };

      // Save order to database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          items: orderItems,
          customerInfo,
          subtotal,
          shipping,
          total,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const savedOrder = await response.json();

      // Prepare order message for WhatsApp
      let message = `✨ *NEW ORDER FROM NORÉAL BEAUTY* ✨\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      message += `📋 *ORDER ID:* #${savedOrder.id.slice(0, 8).toUpperCase()}\n\n`;
      
      message += `👤 *CUSTOMER INFORMATION*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `👋 Name: ${formData.fullName}\n`;
      message += `📞 Phone: ${formData.phone}\n`;
      message += `📍 Address: ${formData.address}\n`;
      message += `🏙️ City: ${formData.city}\n`;
      if (user?.email) {
        message += `📧 Email: ${user.email}\n`;
      }
      if (formData.notes) {
        message += `💬 Notes: ${formData.notes}\n`;
      }
      
      message += `\n🛍️ *ORDER DETAILS*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

      cartProducts.forEach((item, index) => {
        if (item.product) {
          const price = item.isSubscription
            ? item.product.price * 0.85
            : item.product.price;
          message += `\n✨ *${index + 1}. ${item.product.name}*\n`;
          message += `   📦 Quantity: ${item.quantity}\n`;
          message += `   💵 Unit Price: $${price.toFixed(2)}`;
          if (item.isSubscription) {
            message += ` (15% OFF 🎉)`;
          }
          message += `\n`;
          message += `   💰 Subtotal: $${(price * item.quantity).toFixed(2)}\n`;
          if (item.isSubscription) {
            message += `   🔄 Subscription: ${item.subscriptionFrequency || 'Monthly'}\n`;
          }
        }
      });

      message += `\n━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `💳 *PAYMENT SUMMARY*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `🛒 Subtotal: $${subtotal.toFixed(2)}\n`;
      message += `🚚 Shipping: $${shipping.toFixed(2)}\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `💎 *TOTAL AMOUNT: $${total.toFixed(2)}*\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      message += `✅ Thank you for shopping with Noréal Beauty! 💖`;

      // Encode message for WhatsApp URL
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/+201278835919?text=${encodedMessage}`;

      // Clear cart and redirect to WhatsApp
      clearCart();
      toast({
        title: "Order Created!",
        description: "Order saved successfully. Redirecting to WhatsApp for confirmation...",
      });

      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');

      // Redirect to home after a short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error('Order creation failed:', error);
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: "Failed to create order. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || cartItems.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/">
            <span className="hover:text-foreground transition-colors cursor-pointer">Home</span>
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/shop">
            <span className="hover:text-foreground transition-colors cursor-pointer">Shop</span>
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Checkout</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-light tracking-wide mb-2">Checkout</h1>
          <p className="text-muted-foreground">Complete your order details</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Customer Details Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
                <CardDescription>
                  Please provide your details for delivery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <div className="flex gap-2">
                        <Phone className="h-4 w-4 mt-3 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+20 123 456 7890"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="address">Delivery Address *</Label>
                      <div className="flex gap-2">
                        <MapPin className="h-4 w-4 mt-3 text-muted-foreground" />
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="Street address, building, apartment"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="Cairo"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="notes">Order Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Any special instructions or preferences..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Submit Order via WhatsApp
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/shop")}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartProducts.map((item) => (
                    item.product && (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                          <img
                            src={item.product.images[0] || getProductImage(item.imageIndex)}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.product.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          {item.isSubscription && (
                            <p className="text-xs text-purple-600">
                              Subscription (15% off)
                            </p>
                          )}
                        </div>
                        <div className="text-sm font-medium">
                          ${((item.isSubscription ? item.product.price * 0.85 : item.product.price) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    )
                  ))}
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span className="text-purple-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-3 mt-4">
                  <p className="text-xs text-muted-foreground flex items-start gap-2">
                    <MessageCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-green-600" />
                    Your order will be sent via WhatsApp for confirmation. Our team will contact you shortly.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
