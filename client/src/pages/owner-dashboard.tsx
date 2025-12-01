import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ChevronRight,
  Crown,
  Users,
  Shield,
  Activity,
  Settings,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function OwnerDashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access the owner dashboard.",
        variant: "destructive",
      });
      // Redirect after a short delay to ensure toast is visible
      setTimeout(() => {
        window.location.href = "/owner";
      }, 1500);
    }
  }, [isAuthenticated, isLoading, toast]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user && !(user as any)?.isOwner) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the owner dashboard.",
        variant: "destructive",
      });
      // Redirect after a short delay to ensure toast is visible
      setTimeout(() => {
        // Logout the non-owner user
        window.location.href = "/api/logout";
      }, 1500);
    }
  }, [user, isLoading, isAuthenticated, toast]);

  if (isLoading || !isAuthenticated || !user || !(user as any)?.isOwner) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
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
            <span className="hover:text-foreground transition-colors">Home</span>
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Owner Dashboard</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-serif text-4xl font-light tracking-wide bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Owner Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Welcome back, {(user as any)?.ownerName || (user as any)?.firstName}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => window.location.href = "/api/logout"}
              className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
            >
              Sign Out
            </Button>
          </div>
        </motion.div>

        {/* Quick Access Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Link href="/admin/users">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage all user accounts
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/owner/admins">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Admin Management
                </CardTitle>
                <CardDescription>
                  Create and manage admin accounts
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/activity-logs">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Activity Logs
                </CardTitle>
                <CardDescription>
                  Monitor all admin activities
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/analytics">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                  Analytics
                </CardTitle>
                <CardDescription>
                  View user statistics and insights
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  Admin Panel
                </CardTitle>
                <CardDescription>
                  Access full admin dashboard
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Owner Privileges Info */}
        <Card className="border-l-4 border-l-amber-500 shadow-xl bg-gradient-to-br from-amber-50/50 via-yellow-50/30 to-orange-50/50 dark:from-amber-950/20 dark:via-yellow-950/10 dark:to-orange-950/20">
          <CardHeader className="border-b border-amber-200/50">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-amber-900 dark:text-amber-100">
                  Owner Privileges & Capabilities
                </CardTitle>
                <CardDescription className="mt-1 text-amber-700 dark:text-amber-300">
                  Your exclusive owner-level permissions and system access rights
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-950/20 border-l-2 border-purple-400">
                <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">Full System Access</span>
              </div>

              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/20 border-l-2 border-blue-400">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">Admin Management</span>
              </div>

              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-green-50 to-transparent dark:from-green-950/20 border-l-2 border-green-400">
                <Activity className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">Activity Monitoring</span>
              </div>

              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-orange-50 to-transparent dark:from-orange-950/20 border-l-2 border-orange-400">
                <Settings className="h-4 w-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">System Configuration</span>
              </div>

              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-pink-50 to-transparent dark:from-pink-950/20 border-l-2 border-pink-400">
                <BarChart3 className="h-4 w-4 text-pink-600 dark:text-pink-400 flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">Advanced Analytics</span>
              </div>

              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-50 to-transparent dark:from-cyan-950/20 border-l-2 border-cyan-400">
                <Crown className="h-4 w-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">Exclusive Owner Tools</span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-3 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 border-l-4 border-amber-500">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber-700 dark:text-amber-300 flex-shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  <strong className="font-semibold">Security Notice:</strong> Owner privileges grant unrestricted access to all system functions. Use responsibly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
