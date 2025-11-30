import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Package, ShoppingCart, DollarSign, TrendingUp, BarChart3, PieChartIcon } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

// Generate sales data from real orders
const generateSalesData = (orders: any[]) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentYear = new Date().getFullYear();
  
  return months.map((month, index) => {
    const monthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getMonth() === index && orderDate.getFullYear() === currentYear;
    });
    
    const revenue = monthOrders.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0);
    const orderCount = monthOrders.length;
    
    return {
      month,
      revenue: Math.round(revenue),
      orders: orderCount,
    };
  });
};

export default function AdminProductsAnalytics() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  const { data: orders = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/orders"],
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  const [salesData, setSalesData] = useState<any[]>([]);

  useEffect(() => {
    if (products && orders) {
      setSalesData(generateSalesData(orders));
      setLoading(false);
    }
  }, [products, orders]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-8">Loading analytics...</div>
      </div>
    );
  }

  // Calculate statistics
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.inStock).length;
  const bestSellerCount = products.filter(p => p.isBestSeller).length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Product category distribution
  const categoryData = products.reduce((acc: any[], product) => {
    const existing = acc.find(item => item.name === product.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ 
        name: product.category.charAt(0).toUpperCase() + product.category.slice(1), 
        value: 1 
      });
    }
    return acc;
  }, []);

  // Product stock status
  const stockData = [
    { name: "In Stock", value: inStockProducts },
    { name: "Out of Stock", value: totalProducts - inStockProducts },
  ];

  // Top products by price
  const topProducts = [...products]
    .sort((a, b) => b.price - a.price)
    .slice(0, 5)
    .map(p => ({
      name: p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
      price: p.price,
    }));

  const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#06b6d4'];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Products & Orders Analytics
        </h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive insights into your product performance and order statistics
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              ${totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From {totalOrders} orders
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {totalOrders}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total transactions
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {totalProducts}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {inStockProducts} in stock
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Order Value
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              ${avgOrderValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per transaction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* Revenue & Orders Trend */}
        <Card className="border-t-4 border-t-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Revenue & Orders Trend
            </CardTitle>
            <CardDescription>
              Monthly revenue and order volume over the year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Revenue ($)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="#ec4899"
                  strokeWidth={2}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Product Category Distribution */}
        <Card className="border-t-4 border-t-pink-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-pink-500" />
              Product Categories
            </CardTitle>
            <CardDescription>
              Distribution of products by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Products by Price */}
        <Card className="border-t-4 border-t-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Top Products by Price
            </CardTitle>
            <CardDescription>
              Highest priced products in your catalog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="price" fill="#3b82f6" name="Price ($)">
                  {topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stock Status */}
        <Card className="border-t-4 border-t-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-green-500" />
              Inventory Status
            </CardTitle>
            <CardDescription>
              Stock availability overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stockData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Products:</span>
                <span className="font-medium">{totalProducts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">In Stock:</span>
                <span className="font-medium text-green-600">{inStockProducts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Out of Stock:</span>
                <span className="font-medium text-red-600">{totalProducts - inStockProducts}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">Best Sellers:</span>
                <span className="font-bold text-orange-500">{bestSellerCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Orders:</span>
                <span className="font-medium">{totalOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Revenue:</span>
                <span className="font-medium text-purple-600">${totalRevenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Order Value:</span>
                <span className="font-medium">${avgOrderValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">Status:</span>
                <span className="font-bold text-blue-500">
                  {totalOrders > 0 ? "Active" : "No Orders"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stock Rate:</span>
                <span className="font-medium text-green-600">
                  {totalProducts > 0 ? ((inStockProducts / totalProducts) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Categories:</span>
                <span className="font-medium">{categoryData.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Product Price:</span>
                <span className="font-medium">
                  ${totalProducts > 0 ? (products.reduce((sum, p) => sum + p.price, 0) / totalProducts).toFixed(2) : '0.00'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">Health Score:</span>
                <span className="font-bold text-green-500">
                  {totalProducts > 0 && totalOrders > 0 ? "Excellent" : "Growing"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
