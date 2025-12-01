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
          <CardContent className="pt-8">
            <div className="space-y-6">
              {/* Privilege Items */}
              <div className="flex items-start gap-4 pb-6 border-b border-dashed border-amber-200">
                <div className="mt-1">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 shadow-sm"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-purple-900 dark:text-purple-100 mb-1">
                    Full System Access
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Complete control over all platform features and settings
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pb-6 border-b border-dashed border-amber-200">
                <div className="mt-1">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100 mb-1">
                    Admin Management
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Create, edit, and remove admin accounts with role assignment
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pb-6 border-b border-dashed border-amber-200">
                <div className="mt-1">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-sm"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-green-900 dark:text-green-100 mb-1">
                    Activity Monitoring
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Track all admin and owner actions in real-time
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pb-6 border-b border-dashed border-amber-200">
                <div className="mt-1">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-sm"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-orange-900 dark:text-orange-100 mb-1">
                    System Configuration
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Modify critical system settings and configurations
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pb-6 border-b border-dashed border-amber-200">
                <div className="mt-1">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 shadow-sm"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-pink-900 dark:text-pink-100 mb-1">
                    Advanced Analytics
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Access comprehensive analytics and business insights
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-sm"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-cyan-900 dark:text-cyan-100 mb-1">
                    Exclusive Owner Tools
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Special tools and features available only to platform owners
                  </p>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-8 p-5 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 border-l-4 border-amber-500 shadow-inner">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-amber-700 dark:text-amber-300 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-amber-900 dark:text-amber-100 mb-1">
                    Security Notice
                  </p>
                  <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                    Owner privileges grant unrestricted access to all system functions. Use responsibly.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
