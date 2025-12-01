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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<{ id: string; email: string } | null>(null);
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

  const openDeleteDialog = (adminId: string, adminEmail: string) => {
    setAdminToDelete({ id: adminId, email: adminEmail });
    setDeleteDialogOpen(true);
  };

  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return;

    try {
      const { id: adminId, email: adminEmail } = adminToDelete;
      const response = await fetch(`/api/owner/admins/${adminId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Administrator account has been deleted",
        });
        setDeleteDialogOpen(false);
        setAdminToDelete(null);
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
    } finally {
      setDeleteDialogOpen(false);
      setAdminToDelete(null);
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
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {admins.length === 0 ? (
            <div className="col-span-full">
              <Card className="border-2 border-dashed border-purple-200 dark:border-purple-800">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="h-20 w-20 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                    <Shield className="h-10 w-10 text-purple-400" />
                  </div>
                  <p className="text-lg font-semibold text-foreground mb-2">No administrators yet</p>
                  <p className="text-sm text-muted-foreground">Create your first admin using the button above</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            admins.map((admin) => (
              <Card key={admin.id} className="group relative overflow-hidden border-2 border-gray-100 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-2xl transition-all duration-300">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-pink-50/50 dark:from-purple-950/20 dark:via-transparent dark:to-pink-950/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <CardHeader className="relative pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        {admin.firstName?.charAt(0)}{admin.lastName?.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-lg mb-1">
                          {admin.firstName} {admin.lastName}
                        </CardTitle>
                        {getRoleBadge(admin.adminRole)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(admin.id, admin.email)}
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="relative space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-l-4 border-blue-500 shadow-sm">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-lg">✉️</span>
                    </div>
                    <span className="font-semibold text-foreground truncate">{admin.email}</span>
                  </div>

                  {admin.adminName && (
                    <div className="flex items-center gap-3 text-sm p-3 rounded-lg bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30">
                      <div className="h-9 w-9 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">📋</span>
                      </div>
                      <span className="font-medium text-foreground truncate">{admin.adminName}</span>
                    </div>
                  )}

                  <div className="pt-2 grid grid-cols-2 gap-3">
                    <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30">
                      <p className="text-xs text-green-700 dark:text-green-400 font-semibold mb-1.5">Last Login</p>
                      <p className="text-sm font-bold text-green-600 dark:text-green-300">
                        {admin.lastLoginAt
                          ? new Date(admin.lastLoginAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric'
                            })
                          : "Never"}
                      </p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30">
                      <p className="text-xs text-orange-700 dark:text-orange-400 font-semibold mb-1.5">Created</p>
                      <p className="text-sm font-bold text-orange-600 dark:text-orange-300">
                        {new Date(admin.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="border-2 border-red-200 dark:border-red-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-xl">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                  <X className="h-5 w-5 text-white" />
                </div>
                Delete Administrator
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base pt-2">
                Are you sure you want to delete administrator{" "}
                <span className="font-bold text-red-600 dark:text-red-400">{adminToDelete?.email}</span>?
                <br />
                <span className="text-muted-foreground">
                  This action cannot be undone and will permanently remove this account.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel className="border-2">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAdmin}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg"
              >
                Delete Admin
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  );
}
