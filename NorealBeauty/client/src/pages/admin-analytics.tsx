import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Users, UserCheck, Shield, Calendar, TrendingUp, Activity } from "lucide-react";
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

interface UserStats {
  total: number;
  verified: number;
  admins: number;
  byProvider: Record<string, number>;
  recentSignups: number;
}

// Mock data for user growth (can be replaced with real API data)
const generateGrowthData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((month, index) => ({
    month,
    users: Math.floor(Math.random() * 10) + index * 2,
  }));
};

export default function AdminAnalytics() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [growthData] = useState(generateGrowthData());

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/analytics", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch analytics");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load analytics",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-8">Loading analytics...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-8">No data available</div>
      </div>
    );
  }

  // Prepare data for charts
  const providerData = Object.entries(stats.byProvider).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  const userStatusData = [
    { name: "Verified", value: stats.verified },
    { name: "Unverified", value: stats.total - stats.verified },
    { name: "Admins", value: stats.admins },
  ];

  const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of user statistics and engagement with visual insights
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:border-purple-500 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Registered accounts
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-green-500 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.verified}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0
                ? `${Math.round((stats.verified / stats.total) * 100)}% of total`
                : "0% of total"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-blue-500 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
            <p className="text-xs text-muted-foreground">
              Admin accounts
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-orange-500 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Signups</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentSignups}</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              User Growth Trend
            </CardTitle>
            <CardDescription>
              Monthly user registration over the past year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="New Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Authentication Provider Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-pink-500" />
              Authentication Methods
            </CardTitle>
            <CardDescription>
              Distribution by provider type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={providerData}
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
                  {providerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* User Status Bar Chart */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>User Status Breakdown</CardTitle>
          <CardDescription>
            Distribution of verified, unverified, and admin users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8b5cf6" name="Users">
                {userStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Verified Emails:</span>
                <span className="font-medium">{stats.verified}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unverified:</span>
                <span className="font-medium">{stats.total - stats.verified}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">Verification Rate:</span>
                <span className="font-bold text-green-500">
                  {stats.total > 0
                    ? `${Math.round((stats.verified / stats.total) * 100)}%`
                    : "0%"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Regular Users:</span>
                <span className="font-medium">{stats.total - stats.admins}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Administrators:</span>
                <span className="font-medium">{stats.admins}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">Admin Ratio:</span>
                <span className="font-bold text-blue-500">
                  {stats.total > 0
                    ? `${Math.round((stats.admins / stats.total) * 100)}%`
                    : "0%"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Users:</span>
                <span className="font-medium">{stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recent Signups:</span>
                <span className="font-medium">{stats.recentSignups}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">Daily Avg (7d):</span>
                <span className="font-bold text-orange-500">
                  {Math.round((stats.recentSignups / 7) * 10) / 10}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
