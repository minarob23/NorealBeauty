
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  ChevronRight,
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  Edit,
  Trash2,
  Plus,
  FileText,
  BarChart3,
  Star,
  X,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Product, Order, Category, SkinType } from "@shared/schema";
import AdminUsers from "./admin-users";

const categories: Category[] = [
  "moisturizers",
  "serums",
  "cleansers",
  "masks",
  "toners",
  "suncare",
  "eye-care",
  "treatments"
];

const skinTypes: SkinType[] = ["all", "dry", "oily", "combination", "sensitive"];

export default function Admin() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [ingredientInput, setIngredientInput] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderStatusDialogOpen, setOrderStatusDialogOpen] = useState(false);
  const [orderUpdateData, setOrderUpdateData] = useState({
    status: "pending",
    trackingNumber: "",
    shippedAt: "",
    deliveredAt: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    price: "",
    category: "serums" as Category,
    skinType: "all" as SkinType,
    ingredients: [] as string[],
    images: [] as string[],
    inStock: true,
    isBestSeller: false,
    isNew: false,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: isAuthenticated,
    refetchInterval: 5000, // Refetch every 5 seconds to show new products
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/orders"],
    enabled: isAuthenticated && (user?.isAdmin || (user as any)?.isOwner),
    refetchInterval: 5000, // Refetch every 5 seconds to show new orders
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error("Failed to create product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Success", description: "Product created successfully" });
      resetForm();
      setIsAddDialogOpen(false);
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to create product" });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Success", description: "Product updated successfully" });
      resetForm();
      setEditProduct(null);
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to update product" });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete product");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Success", description: "Product deleted successfully" });
      setDeleteProductId(null);
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete product" });
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update order");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({ title: "Success", description: "Order updated successfully" });
      setOrderStatusDialogOpen(false);
      setSelectedOrder(null);
      setOrderUpdateData({ status: "pending", trackingNumber: "", shippedAt: "", deliveredAt: "" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Failed to update order" });
    },
  });

  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name,
        description: editProduct.description,
        shortDescription: editProduct.shortDescription,
        price: editProduct.price.toString(),
        category: editProduct.category,
        skinType: editProduct.skinType,
        ingredients: editProduct.ingredients,
        images: editProduct.images,
        inStock: editProduct.inStock,
        isBestSeller: editProduct.isBestSeller || false,
        isNew: editProduct.isNew || false,
      });
    }
  }, [editProduct]);

  useEffect(() => {
    if (selectedOrder) {
      setOrderUpdateData({
        status: selectedOrder.status || "pending",
        trackingNumber: selectedOrder.trackingNumber || "",
        shippedAt: selectedOrder.shippedAt ? new Date(selectedOrder.shippedAt).toISOString().slice(0, 16) : "",
        deliveredAt: selectedOrder.deliveredAt ? new Date(selectedOrder.deliveredAt).toISOString().slice(0, 16) : "",
      });
    }
  }, [selectedOrder]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      shortDescription: "",
      price: "",
      category: "serums",
      skinType: "all",
      ingredients: [],
      images: [],
      inStock: true,
      isBestSeller: false,
      isNew: false,
    });
    setIngredientInput("");
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }));
      setImageInput("");
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setUploadingImage(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result as string]
        }));
        setUploadingImage(false);
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      };
      reader.onerror = () => {
        setUploadingImage(false);
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredientInput.trim()]
      }));
      setIngredientInput("");
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
    };

    if (editProduct) {
      updateProductMutation.mutate({ id: editProduct.id, data: productData });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  const handleDelete = () => {
    if (deleteProductId) {
      deleteProductMutation.mutate(deleteProductId);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access the admin dashboard.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/admin-login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && !user?.isAdmin && !(user as any)?.isOwner) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
  }, [user, isLoading, isAuthenticated, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  // Allow both admins and owners
  if (!isAuthenticated || (!user?.isAdmin && !(user as any)?.isOwner)) {
    return null;
  }

  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.inStock).length;
  const bestSellerCount = products.filter(p => p.isBestSeller).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/">
            <span className="hover:text-foreground transition-colors cursor-pointer">Home</span>
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Admin Dashboard</span>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-5xl font-light tracking-wide mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            Admin Dashboard
          </motion.h1>
          <p className="text-muted-foreground text-lg">
            Manage your products, orders, and users efficiently
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex flex-wrap gap-3">
          <Link href="/admin/users">
            <Button variant="outline" className="flex items-center gap-2 hover:border-purple-500 hover:text-purple-600 transition-colors">
              <Users className="h-4 w-4" />
              User Management
            </Button>
          </Link>
          <Link href="/admin/products-analytics">
            <Button variant="outline" className="flex items-center gap-2 hover:border-blue-500 hover:text-blue-600 transition-colors">
              <BarChart3 className="h-4 w-4" />
              Products & Orders Analytics
            </Button>
          </Link>
          <Link href="/admin/blogs">
            <Button variant="outline" className="flex items-center gap-2 hover:border-pink-500 hover:text-pink-600 transition-colors">
              <FileText className="h-4 w-4" />
              Manage Blogs
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-background dark:from-purple-950/20 dark:to-background">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  ${totalRevenue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  From {totalOrders} orders
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-background dark:from-blue-950/20 dark:to-background">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Orders
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {totalOrders}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total transactions
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-background dark:from-green-950/20 dark:to-background">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Products
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {totalProducts}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {inStockProducts} in stock
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-50 to-background dark:from-orange-950/20 dark:to-background">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Best Sellers
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Star className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {bestSellerCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Popular products
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3 h-12 bg-muted/50">
            <TabsTrigger value="products" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-t-4 border-t-purple-500 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Package className="h-6 w-6 text-purple-600" />
                        Product Management
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Manage your product catalog and inventory
                      </CardDescription>
                    </div>
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={() => setIsAddDialogOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {productsLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-16">
                      <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-xl font-medium text-muted-foreground mb-2">No products yet</p>
                      <p className="text-sm text-muted-foreground mb-6">Start by adding your first product</p>
                      <Button 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        onClick={() => setIsAddDialogOpen(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Product
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded-lg border overflow-hidden">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead className="font-semibold">Name</TableHead>
                            <TableHead className="font-semibold">Category</TableHead>
                            <TableHead className="font-semibold">Price</TableHead>
                            <TableHead className="font-semibold">Rating</TableHead>
                            <TableHead className="font-semibold">Stock</TableHead>
                            <TableHead className="font-semibold text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products.map((product) => (
                            <TableRow key={product.id} className="hover:bg-muted/50 transition-colors">
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  {product.isBestSeller && (
                                    <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                                  )}
                                  {product.name}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {product.category}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-semibold">${product.price.toFixed(2)}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                  <span className="font-medium">{product.rating}</span>
                                  <span className="text-muted-foreground text-sm">({product.reviewCount})</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={product.inStock ? "default" : "destructive"} className={product.inStock ? "bg-green-500 hover:bg-green-600" : ""}>
                                  {product.inStock ? "In Stock" : "Out of Stock"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2 justify-end">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30"
                                    onClick={() => setEditProduct(product)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                                    onClick={() => setDeleteProductId(product.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-t-4 border-t-blue-500 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <ShoppingCart className="h-6 w-6 text-blue-600" />
                      Order Management
                    </CardTitle>
                    <CardDescription className="mt-2">
                      View and manage customer orders
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {ordersLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-16">
                      <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-xl font-medium text-muted-foreground mb-2">No orders yet</p>
                      <p className="text-sm text-muted-foreground">Orders will appear here when customers make purchases</p>
                    </div>
                  ) : (
                    <div className="rounded-lg border overflow-hidden">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead className="font-semibold">Order ID</TableHead>
                            <TableHead className="font-semibold">Customer</TableHead>
                            <TableHead className="font-semibold">Date</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold">Total</TableHead>
                            <TableHead className="font-semibold text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                              <TableCell className="font-mono font-medium">
                                #{order.id.slice(0, 8).toUpperCase()}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">
                                    {order.userFirstName || ''} {order.userLastName || ''}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {order.userEmail}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {order.createdAt && new Date(order.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={order.status === 'completed' ? 'default' : 'secondary'}
                                  className={
                                    order.status === 'completed' 
                                      ? 'bg-green-500 hover:bg-green-600' 
                                      : order.status === 'pending'
                                      ? 'bg-yellow-500 hover:bg-yellow-600'
                                      : 'bg-blue-500 hover:bg-blue-600'
                                  }
                                >
                                  {order.status.toUpperCase()}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-semibold text-lg">
                                ${parseFloat(order.total.toString()).toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-end">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30"
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      setOrderStatusDialogOpen(true);
                                    }}
                                  >
                                    View Details
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AdminUsers />
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Add/Edit Product Dialog */}
        <Dialog open={isAddDialogOpen || !!editProduct} onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setEditProduct(null);
            resetForm();
          }
        }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                {editProduct ? "Update product details" : "Fill in the details to create a new product"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Product Images</Label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    {uploadingImage ? (
                      <>
                        <p className="text-sm font-medium text-purple-600">Uploading image...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-gray-400" />
                        <p className="text-sm font-medium text-foreground">Click to upload images</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      </>
                    )}
                  </Label>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={typeof img === 'string' && img.startsWith('data:') ? img : img}
                        alt={`Product ${index + 1}`}
                        className="h-20 w-20 object-cover rounded border border-gray-200 dark:border-gray-700"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Hydra-Glow Serum"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="shortDescription">Short Description *</Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  placeholder="Brief description for product cards"
                  rows={2}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Full Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed product description"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="68.00"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as Category }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat} className="capitalize">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="skinType">Skin Type *</Label>
                <Select value={formData.skinType} onValueChange={(value) => setFormData(prev => ({ ...prev, skinType: value as SkinType }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {skinTypes.map(type => (
                      <SelectItem key={type} value={type} className="capitalize">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Ingredients</Label>
                <div className="flex gap-2">
                  <Input
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    placeholder="Enter ingredient name"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddIngredient()}
                  />
                  <Button type="button" onClick={handleAddIngredient} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.ingredients.map((ingredient, index) => (
                    <Badge key={index} variant="secondary" className="pr-1">
                      {ingredient}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1"
                        onClick={() => handleRemoveIngredient(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="inStock"
                    checked={formData.inStock}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, inStock: checked }))}
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="isBestSeller"
                    checked={formData.isBestSeller}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isBestSeller: checked }))}
                  />
                  <Label htmlFor="isBestSeller">Best Seller</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="isNew"
                    checked={formData.isNew}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isNew: checked }))}
                  />
                  <Label htmlFor="isNew">New Product</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsAddDialogOpen(false);
                setEditProduct(null);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!formData.name || !formData.price || createProductMutation.isPending || updateProductMutation.isPending}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {editProduct ? "Update Product" : "Create Product"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the product
                from your catalog.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Order Details Dialog */}
        <Dialog open={orderStatusDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setOrderStatusDialogOpen(false);
            setSelectedOrder(null);
          }
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details & Status</DialogTitle>
              <DialogDescription>
                View and update order information
              </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6 py-4">
                {/* Order Header */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-mono font-semibold">{selectedOrder.id.slice(0, 12)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-semibold">
                      {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="border-t pt-4">
                  <p className="font-semibold mb-2">Customer Information</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p>{selectedOrder.userFirstName} {selectedOrder.userLastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="break-all">{selectedOrder.userEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t pt-4">
                  <p className="font-semibold mb-3">Order Items</p>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm p-2 bg-muted rounded">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">${parseFloat(item.price).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${parseFloat(selectedOrder.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${parseFloat(selectedOrder.shipping).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${parseFloat(selectedOrder.tax).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total</span>
                    <span>${parseFloat(selectedOrder.total).toFixed(2)}</span>
                  </div>
                </div>

                {/* Status Update Section */}
                <div className="border-t pt-4 space-y-4">
                  <p className="font-semibold">Update Order Status</p>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="order-status">Status</Label>
                    <Select 
                      value={orderUpdateData.status} 
                      onValueChange={(value) => setOrderUpdateData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="tracking-number">Tracking Number</Label>
                    <Input
                      id="tracking-number"
                      value={orderUpdateData.trackingNumber}
                      onChange={(e) => setOrderUpdateData(prev => ({ ...prev, trackingNumber: e.target.value }))}
                      placeholder="e.g., 1Z999AA10123456784"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="shipped-at">Shipped Date</Label>
                      <Input
                        id="shipped-at"
                        type="datetime-local"
                        value={orderUpdateData.shippedAt}
                        onChange={(e) => setOrderUpdateData(prev => ({ ...prev, shippedAt: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="delivered-at">Delivered Date</Label>
                      <Input
                        id="delivered-at"
                        type="datetime-local"
                        value={orderUpdateData.deliveredAt}
                        onChange={(e) => setOrderUpdateData(prev => ({ ...prev, deliveredAt: e.target.value }))}
                      />
                    </div>
                  </div>

                  {selectedOrder.trackingNumber && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded text-sm">
                      <p className="font-semibold">Current Tracking Number:</p>
                      <p className="font-mono">{selectedOrder.trackingNumber}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setOrderStatusDialogOpen(false);
                  setSelectedOrder(null);
                }}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  if (selectedOrder) {
                    updateOrderMutation.mutate({
                      id: selectedOrder.id,
                      data: orderUpdateData
                    });
                  }
                }}
                disabled={updateOrderMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {updateOrderMutation.isPending ? "Updating..." : "Update Order"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
}
