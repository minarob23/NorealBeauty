import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Activity, User, UserCog, Trash2, LogIn, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ActivityLog {
  id: string;
  adminId: string;
  adminEmail: string;
  adminName: string | null;
  action: string;
  targetType: string | null;
  targetId: string | null;
  details: string | null;
  ipAddress: string | null;
  createdAt: string;
}

export default function AdminActivityLogs() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch("/api/admin/activity-logs?limit=100", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch activity logs");
      }

      const data = await response.json();
      setActivities(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load activity logs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "admin_login":
        return <LogIn className="h-4 w-4" />;
      case "user_update":
        return <UserCog className="h-4 w-4" />;
      case "user_delete":
        return <Trash2 className="h-4 w-4" />;
      case "admin_create":
        return <Shield className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActionBadge = (action: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      admin_login: "default",
      user_update: "secondary",
      user_delete: "destructive",
      admin_create: "default",
    };

    return (
      <Badge variant={variants[action] || "outline"} className="flex items-center gap-1">
        {getActionIcon(action)}
        {action.replace(/_/g, " ").toUpperCase()}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const parseDetails = (detailsJson: string | null) => {
    if (!detailsJson) return null;
    try {
      return JSON.parse(detailsJson);
    } catch {
      return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Admin Activity Logs
        </h1>
        <p className="text-muted-foreground">
          Track all admin actions and monitor who's managing the platform
        </p>
      </div>

      <Card className="border-t-4 border-t-purple-500 shadow-xl bg-gradient-to-br from-purple-50/30 to-background dark:from-purple-950/10 dark:to-background">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                Recent Activities
              </CardTitle>
              <CardDescription className="mt-2">
                Showing the last 100 admin actions • {activities.length} total activities
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading activity logs...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-purple-200 rounded-lg">
              <Activity className="h-12 w-12 mx-auto mb-4 text-purple-300" />
              <p className="text-muted-foreground font-medium">No activities yet</p>
              <p className="text-sm text-muted-foreground mt-1">Admin actions will appear here</p>
            </div>
          ) : (
            <div className="rounded-lg border border-purple-100 overflow-hidden shadow-md">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 hover:from-purple-50 hover:to-pink-50">
                    <TableHead className="font-semibold text-foreground">Time</TableHead>
                    <TableHead className="font-semibold text-foreground">Admin</TableHead>
                    <TableHead className="font-semibold text-foreground">Action</TableHead>
                    <TableHead className="font-semibold text-foreground">Target</TableHead>
                    <TableHead className="font-semibold text-foreground">Details</TableHead>
                    <TableHead className="font-semibold text-foreground">IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((activity, index) => {
                    const details = parseDetails(activity.details);
                    return (
                      <TableRow 
                        key={activity.id}
                        className="hover:bg-purple-50/50 dark:hover:bg-purple-950/10 transition-colors border-b border-purple-50"
                      >
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
                            <div className="text-sm font-medium">
                              {formatDate(activity.createdAt)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-semibold">
                              {activity.adminName?.charAt(0).toUpperCase() || activity.adminEmail?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold">
                                {activity.adminName || "Unknown Admin"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {activity.adminEmail}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getActionBadge(activity.action)}
                        </TableCell>
                        <TableCell>
                          {activity.targetType ? (
                            <div className="flex flex-col">
                              <Badge variant="outline" className="w-fit capitalize border-purple-200">
                                {activity.targetType}
                              </Badge>
                              <span className="text-xs text-muted-foreground font-mono mt-1">
                                {activity.targetId?.substring(0, 8)}...
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {details ? (
                            <div className="text-xs space-y-1">
                              {details.role && (
                                <Badge variant="outline" className="mr-1 border-purple-200">
                                  {details.role}
                                </Badge>
                              )}
                              {details.targetEmail && (
                                <div className="text-muted-foreground">
                                  📧 {details.targetEmail}
                                </div>
                              )}
                              {details.deletedEmail && (
                                <div className="text-destructive font-medium">
                                  🗑️ Deleted: {details.deletedEmail}
                                </div>
                              )}
                              {details.updates && (
                                <div className="text-muted-foreground">
                                  ✏️ Updated: {Object.keys(details.updates).join(", ")}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="text-xs">🌐</span>
                            <span className="text-xs font-mono text-muted-foreground">
                              {activity.ipAddress || "—"}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
