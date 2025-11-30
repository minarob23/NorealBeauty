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
          <div className="flex items-center gap-3 mb-2">
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
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-purple-600" />
              Owner Privileges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-start gap-2">
                <div className="mt-1 h-2 w-2 rounded-full bg-purple-600" />
                <div>
                  <p className="font-medium">Full System Access</p>
                  <p className="text-sm text-muted-foreground">
                    Complete control over all platform features
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-1 h-2 w-2 rounded-full bg-purple-600" />
                <div>
                  <p className="font-medium">Admin Management</p>
                  <p className="text-sm text-muted-foreground">
                    Create, edit, and remove admin accounts
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-1 h-2 w-2 rounded-full bg-purple-600" />
                <div>
                  <p className="font-medium">Activity Monitoring</p>
                  <p className="text-sm text-muted-foreground">
                    Track all admin and owner actions
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-1 h-2 w-2 rounded-full bg-purple-600" />
                <div>
                  <p className="font-medium">System Configuration</p>
                  <p className="text-sm text-muted-foreground">
                    Modify critical system settings
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6 flex gap-4">
          <Button
            variant="outline"
            onClick={() => window.location.href = "/api/logout"}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
