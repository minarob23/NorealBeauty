import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  ChevronRight,
  User,
  MapPin,
  Package,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/useAuth";
import { useAppStore } from "@/lib/store";
import { getTranslations } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import type { Address, Order, OrderItem } from "@shared/schema";

export default function Account() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { language } = useAppStore();
  const t = getTranslations(language);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadingImage, setUploadingImage] = useState(false);

  const { data: addresses = [], isLoading: addressesLoading } = useQuery<Address[]>({
    queryKey: ["/api/addresses"],
    enabled: isAuthenticated,
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated,
  });

  // Image upload mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload-profile-image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Success",
        description: "Profile image updated successfully",
      });
      setUploadingImage(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      setUploadingImage(false);
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setUploadingImage(true);
      uploadImageMutation.mutate(file);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to view your account.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  const labels = {
    en: {
      title: "My Account",
      profile: "Profile",
      addresses: "Addresses",
      orders: "Order History",
      logout: "Log Out",
      noAddresses: "No saved addresses",
      addAddress: "Add Address",
      noOrders: "No orders yet",
      shopNow: "Start Shopping",
      orderDate: "Order Date",
      orderStatus: "Status",
      orderTotal: "Total",
      viewDetails: "View Details",
      email: "Email",
      member: "Member since",
    },
    fr: {
      title: "Mon Compte",
      profile: "Profil",
      addresses: "Adresses",
      orders: "Historique des Commandes",
      logout: "Déconnexion",
      noAddresses: "Aucune adresse enregistrée",
      addAddress: "Ajouter une Adresse",
      noOrders: "Pas encore de commandes",
      shopNow: "Commencer vos Achats",
      orderDate: "Date de Commande",
      orderStatus: "Statut",
      orderTotal: "Total",
      viewDetails: "Voir les Détails",
      email: "Email",
      member: "Membre depuis",
    },
    es: {
      title: "Mi Cuenta",
      profile: "Perfil",
      addresses: "Direcciones",
      orders: "Historial de Pedidos",
      logout: "Cerrar Sesión",
      noAddresses: "No hay direcciones guardadas",
      addAddress: "Añadir Dirección",
      noOrders: "No hay pedidos todavía",
      shopNow: "Empezar a Comprar",
      orderDate: "Fecha del Pedido",
      orderStatus: "Estado",
      orderTotal: "Total",
      viewDetails: "Ver Detalles",
      email: "Email",
      member: "Miembro desde",
    },
  };

  const label = labels[language];

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/">
            <span className="hover:text-foreground transition-colors">{t.nav.home}</span>
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{label.title}</span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 font-serif text-4xl font-light tracking-wide"
        >
          {label.title}
        </motion.h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative group">
                    <input
                      type="file"
                      id="profile-image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="profile-image-upload"
                      className="cursor-pointer relative block"
                    >
                      {user.profileImageUrl ? (
                        <img
                          src={user.profileImageUrl}
                          alt="Profile"
                          className="h-24 w-24 rounded-full object-cover ring-2 ring-offset-2 ring-purple-500/20 group-hover:ring-purple-500/50 transition-all"
                        />
                      ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted ring-2 ring-offset-2 ring-purple-500/20 group-hover:ring-purple-500/50 transition-all">
                          <User className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      {/* Camera overlay */}
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        {uploadingImage ? (
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <Camera className="h-6 w-6 text-white" />
                        )}
                      </div>
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Click to {user.profileImageUrl ? 'change' : 'upload'} photo
                  </p>
                  <h2 className="mt-4 font-serif text-xl font-medium">
                    {user.firstName} {user.lastName}
                  </h2>
                  {user.email && (
                    <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
                  )}
                  {user.createdAt && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {label.member} {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  )}
                  <a href="/api/logout" className="mt-6 w-full">
                    <Button variant="outline" className="w-full">
                      <LogOut className="mr-2 h-4 w-4" />
                      {label.logout}
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="orders">
              <TabsList className="mb-6 grid w-full grid-cols-2">
                <TabsTrigger value="orders" className="gap-2">
                  <Package className="h-4 w-4" />
                  {label.orders}
                </TabsTrigger>
                <TabsTrigger value="addresses" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  {label.addresses}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="orders">
                {ordersLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-24 w-full rounded-lg" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Package className="mb-4 h-12 w-12 text-muted-foreground" />
                      <p className="mb-4 text-muted-foreground">{label.noOrders}</p>
                      <Link href="/shop">
                        <Button>{label.shopNow}</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                Order #{order.id.slice(0, 8)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {order.createdAt && new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge className={statusColors[order.status] || "bg-gray-100"}>
                                {order.status}
                              </Badge>
                              <span className="font-medium">${order.total}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="addresses">
                {addressesLoading ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-40 w-full rounded-lg" />
                    ))}
                  </div>
                ) : addresses.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <MapPin className="mb-4 h-12 w-12 text-muted-foreground" />
                      <p className="mb-4 text-muted-foreground">{label.noAddresses}</p>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {label.addAddress}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {addresses.map((address) => (
                      <Card key={address.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">
                                {address.firstName} {address.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground">{address.street}</p>
                              <p className="text-sm text-muted-foreground">
                                {address.city}, {address.state} {address.postalCode}
                              </p>
                              <p className="text-sm text-muted-foreground">{address.country}</p>
                              {address.phone && (
                                <p className="mt-2 text-sm text-muted-foreground">{address.phone}</p>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {address.isDefault && (
                            <Badge variant="secondary" className="mt-2">Default</Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                    <Card className="flex items-center justify-center border-dashed">
                      <CardContent className="py-12">
                        <Button variant="ghost">
                          <Plus className="mr-2 h-4 w-4" />
                          {label.addAddress}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
}
