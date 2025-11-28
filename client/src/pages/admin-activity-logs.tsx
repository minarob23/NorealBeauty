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
        <h1 className="text-3xl font-bold mb-2">Admin Activity Logs</h1>
        <p className="text-muted-foreground">
          Track all admin actions and monitor who's managing the platform
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activities
          </CardTitle>
          <CardDescription>
            Showing the last 100 admin actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading activity logs...</div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No activities yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((activity) => {
                    const details = parseDetails(activity.details);
                    return (
                      <TableRow key={activity.id}>
                        <TableCell className="whitespace-nowrap">
                          <div className="text-sm">
                            {formatDate(activity.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {activity.adminName || "Unknown Admin"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {activity.adminEmail}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getActionBadge(activity.action)}
                        </TableCell>
                        <TableCell>
                          {activity.targetType ? (
                            <div className="flex flex-col">
                              <span className="text-sm capitalize">
                                {activity.targetType}
                              </span>
                              <span className="text-xs text-muted-foreground font-mono">
                                {activity.targetId?.substring(0, 8)}...
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {details ? (
                            <div className="text-xs">
                              {details.role && (
                                <Badge variant="outline" className="mr-1">
                                  {details.role}
                                </Badge>
                              )}
                              {details.targetEmail && (
                                <span className="text-muted-foreground">
                                  {details.targetEmail}
                                </span>
                              )}
                              {details.deletedEmail && (
                                <span className="text-destructive">
                                  Deleted: {details.deletedEmail}
                                </span>
                              )}
                              {details.updates && (
                                <span className="text-muted-foreground">
                                  Updated: {Object.keys(details.updates).join(", ")}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-mono text-muted-foreground">
                            {activity.ipAddress || "—"}
                          </span>
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
