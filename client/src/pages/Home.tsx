import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Building, 
  TrendingUp, 
  AlertTriangle, 
  Brain, 
  Calendar,
  LogOut,
  BarChart3,
  Users,
  DollarSign,
  Activity
} from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isLoading } = useAuth();
  
  const { data: dashboardData } = useQuery({
    queryKey: ["/api/dashboard", user?.id],
    enabled: !!user?.id,
  });

  const { data: bookingUrl } = useQuery({
    queryKey: ["/api/calendly/booking-url"],
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Building className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">OPSIGHT</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.profileImageUrl || ""} alt="Profile" />
              <AvatarFallback>
                {user?.firstName?.[0] || user?.email?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {user?.firstName || user?.email || "User"}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/api/logout'}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.firstName || "User"}!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Your property management intelligence dashboard
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/kpi-command-center">
              <CardHeader className="pb-2">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg">KPI Command Center</CardTitle>
                <CardDescription>Real-time performance monitoring</CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/ai-intelligence">
              <CardHeader className="pb-2">
                <Brain className="h-8 w-8 text-purple-600" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg">AI Intelligence</CardTitle>
                <CardDescription>Predictive insights & analytics</CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/alerts-notifications">
              <CardHeader className="pb-2">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg">Alert Center</CardTitle>
                <CardDescription>Critical notifications & alerts</CardDescription>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <Calendar className="h-8 w-8 text-green-600" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg">Schedule Demo</CardTitle>
              <CardDescription>Book a consultation call</CardDescription>
              <Button 
                size="sm" 
                className="mt-2 w-full"
                onClick={() => window.open(bookingUrl?.bookingUrl || 'https://www.opsight.live/', '_blank')}
              >
                Book Now
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.totalProperties || 0}</div>
              <p className="text-xs text-muted-foreground">Active in portfolio</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.occupancyRate || 0}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2.3%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${dashboardData?.monthlyRevenue?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+5.2%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.activeAlerts || 0}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Latest notifications and red flags</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.recentAlerts?.slice(0, 3).map((alert: any) => (
                  <div key={alert.id} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      alert.priority === 'high' ? 'bg-red-500' : 
                      alert.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.title}</p>
                      <p className="text-xs text-gray-500">{alert.propertyName}</p>
                    </div>
                    <Badge variant={alert.priority === 'high' ? 'destructive' : 'secondary'}>
                      {alert.priority}
                    </Badge>
                  </div>
                )) || (
                  <p className="text-sm text-gray-500">No recent alerts</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>Latest predictive analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.recentInsights?.slice(0, 3).map((insight: any) => (
                  <div key={insight.id} className="flex items-start space-x-3">
                    <Brain className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{insight.title}</p>
                      <p className="text-xs text-gray-500">{insight.description}</p>
                    </div>
                  </div>
                )) || (
                  <p className="text-sm text-gray-500">No recent insights</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}