import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { CartDrawer } from "@/components/cart-drawer";
import { CompareBar } from "@/components/compare-bar";
import Home from "@/pages/home";
import Shop from "@/pages/shop";
import ProductDetail from "@/pages/product-detail";
import Wishlist from "@/pages/wishlist";
import Support from "@/pages/support";
import Compare from "@/pages/compare";
import Checkout from "@/pages/checkout";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import Account from "@/pages/account";
import Admin from "@/pages/admin";
import AdminUsers from "@/pages/admin-users";
import AdminAnalytics from "@/pages/admin-analytics";
import AdminProductsAnalytics from "@/pages/admin-products-analytics";
import AdminBlogManagement from "@/pages/admin-blog-management";
import Login from "@/pages/login";
import AdminLogin from "@/pages/admin-login";
import AdminActivityLogs from "@/pages/admin-activity-logs";
import OwnerLogin from "@/pages/owner-login";
import OwnerDashboard from "@/pages/owner-dashboard";
import OwnerAdminManagement from "@/pages/owner-admin-management";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import VerifyEmail from "@/pages/verify-email";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/support" component={Support} />
      <Route path="/compare" component={Compare} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:id" component={BlogPost} />
      <Route path="/account" component={Account} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/analytics" component={AdminAnalytics} />
      <Route path="/admin/products-analytics" component={AdminProductsAnalytics} />
      <Route path="/admin/blogs" component={AdminBlogManagement} />
      <Route path="/admin/activity-logs" component={AdminActivityLogs} />
      <Route path="/owner" component={OwnerLogin} />
      <Route path="/owner/dashboard" component={OwnerDashboard} />
      <Route path="/owner/admins" component={OwnerAdminManagement} />
      <Route path="/login" component={Login} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password/:token" component={ResetPassword} />
      <Route path="/verify-email/:token" component={VerifyEmail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="noreal-ui-theme">
        <TooltipProvider>
          <div className="min-h-screen bg-background pb-20">
            <Header />
            <main>
              <Router />
            </main>
            <CartDrawer />
            <CompareBar />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
