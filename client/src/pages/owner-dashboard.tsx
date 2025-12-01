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
      setTimeout(() => {
        window.location.href = "/owner";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && !(user as any)?.isOwner) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the owner dashboard.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
  }, [user, isLoading, isAuthenticated, toast]);

  if (isLoading || !isAuthenticated || !(user as any)?.isOwner) {
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
        <Card className="border-t-4 border-t-purple-500 shadow-xl bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-purple-950/30">
          <CardHeader className="border-b bg-gradient-to-r from-purple-100/50 to-pink-100/50 dark:from-purple-950/50 dark:to-pink-950/50">
            <CardTitle className="text-2xl flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Crown className="h-5 w-5 text-white" />
              </div>
              Owner Privileges & Capabilities
            </CardTitle>
            <CardDescription className="mt-2">
              Your exclusive owner-level permissions and system access rights
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-purple-100/50 to-white dark:from-purple-950/20 dark:to-background border border-purple-200">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-purple-900 dark:text-purple-100">Full System Access</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Complete control over all platform features and settings
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-blue-100/50 to-white dark:from-blue-950/20 dark:to-background border border-blue-200">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900 dark:text-blue-100">Admin Management</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create, edit, and remove admin accounts with role assignment
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-green-100/50 to-white dark:from-green-950/20 dark:to-background border border-green-200">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-green-900 dark:text-green-100">Activity Monitoring</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Track all admin and owner actions in real-time
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-orange-100/50 to-white dark:from-orange-950/20 dark:to-background border border-orange-200">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-orange-900 dark:text-orange-100">System Configuration</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Modify critical system settings and configurations
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-pink-100/50 to-white dark:from-pink-950/20 dark:to-background border border-pink-200">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-pink-900 dark:text-pink-100">Advanced Analytics</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Access comprehensive analytics and business insights
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-br from-cyan-100/50 to-white dark:from-cyan-950/20 dark:to-background border border-cyan-200">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-cyan-900 dark:text-cyan-100">Exclusive Owner Tools</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Special tools and features available only to platform owners
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950/40 dark:to-pink-950/40 border-2 border-purple-300">
              <p className="text-sm font-medium text-purple-900 dark:text-purple-100 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <strong>Security Notice:</strong> Owner privileges grant unrestricted access to all system functions. Use responsibly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
