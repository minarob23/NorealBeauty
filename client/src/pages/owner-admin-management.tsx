import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight, Shield, Plus, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  adminRole: string;
  adminName: string;
  createdAt: string;
  lastLoginAt: string | null;
}

export default function OwnerAdminManagement() {
  const { toast } = useToast();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    adminRole: "admin",
    adminName: "",
  });

  const fetchAdmins = async () => {
    try {
      const response = await fetch("/api/owner/admins", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setAdmins(data);
      }
    } catch (error) {
      console.error("Failed to fetch admins:", error);
    }
  };

  // Fetch admins on component mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/owner/create-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Error",
          description: data.message || "Failed to create admin",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Admin Created!",
        description: `Successfully created ${formData.adminRole} account for ${formData.email}`,
      });

      // Reset form
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        adminRole: "admin",
        adminName: "",
      });

      setIsCreateDialogOpen(false);
      fetchAdmins(); // Refresh list
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating admin",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId: string, adminEmail: string) => {
    if (!confirm(`Are you sure you want to delete admin: ${adminEmail}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/owner/admins/${adminId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Admin Deleted",
          description: `Successfully deleted ${adminEmail}`,
        });
        fetchAdmins();
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.message || "Failed to delete admin",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: "destructive",
      });
    }
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      "super-admin": "default",
      "admin": "secondary",
      "moderator": "outline",
    };

    return (
      <Badge variant={variants[role] || "outline"}>
        {role?.toUpperCase() || "UNKNOWN"}
      </Badge>
    );
  };

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
          <Link href="/owner/dashboard">
            <span className="hover:text-foreground transition-colors">Owner Dashboard</span>
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Admin Management</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Admin Management
            </h1>
            <p className="text-muted-foreground">
              Create and manage administrator accounts
            </p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <UserPlus className="mr-2 h-4 w-4" />
                Create Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  Create New Admin Account
                </DialogTitle>
                <DialogDescription>
                  Add a new administrator to manage the platform
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreateAdmin} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-muted-foreground">
                    At least 8 characters required
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminRole">Admin Role *</Label>
                  <Select
                    value={formData.adminRole}
                    onValueChange={(value) =>
                      setFormData({ ...formData, adminRole: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super-admin">
                        Super Admin - Full access + manage admins
                      </SelectItem>
                      <SelectItem value="admin">
                        Admin - Manage users and content
                      </SelectItem>
                      <SelectItem value="moderator">
                        Moderator - View-only access
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminName">Display Name (Optional)</Label>
                  <Input
                    id="adminName"
                    placeholder="e.g., John Doe - Marketing Manager"
                    value={formData.adminName}
                    onChange={(e) =>
                      setFormData({ ...formData, adminName: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    This name will appear in activity logs
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                  >
                    {isLoading ? "Creating..." : "Create Admin"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Admins List */}
        <Card className="border-t-4 border-t-purple-500 shadow-xl bg-gradient-to-br from-purple-50/30 to-background dark:from-purple-950/10 dark:to-background">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-b">
            <CardTitle className="text-2xl flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              Current Administrators
            </CardTitle>
            <CardDescription className="mt-2">
              All admin accounts with their roles and status • {admins.length} active admins
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {admins.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-purple-200 rounded-lg">
                <Shield className="h-12 w-12 mx-auto mb-4 text-purple-300" />
                <p className="text-muted-foreground font-medium">No admin accounts yet</p>
                <p className="text-sm text-muted-foreground mt-1">Create your first admin using the button above</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {admins.map((admin, index) => (
                  <div
                    key={admin.id}
                    className="relative group flex items-start gap-4 p-5 border-2 border-purple-100 rounded-xl hover:border-purple-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-purple-50/20 dark:from-background dark:to-purple-950/10"
                  >
                    <div className="flex-shrink-0">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold shadow-md">
                        {admin.firstName?.charAt(0)}{admin.lastName?.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-lg">
                            {admin.firstName} {admin.lastName}
                          </h3>
                          {getRoleBadge(admin.adminRole)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                        <span className="font-medium">✉</span> {admin.email}
                      </p>
                      {admin.adminName && (
                        <p className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-md inline-block mb-1">
                          📋 {admin.adminName}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <span className="font-medium">🕒</span>
                        Last login:{" "}
                        {admin.lastLoginAt
                          ? new Date(admin.lastLoginAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : "Never logged in"}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="font-medium">📅</span>
                        Created: {new Date(admin.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
