import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  Search, 
  Book, 
  MessageCircle, 
  Video, 
  FileText,
  ArrowRight,
  Star,
  Clock,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const HelpCenter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const helpCategories = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of using OPSIGHT',
      icon: <Book className="h-6 w-6" />,
      articles: 12,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'User Management',
      description: 'Managing team members and permissions',
      icon: <Users className="h-6 w-6" />,
      articles: 8,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Red Flag Alerts',
      description: 'Setting up and managing alerts',
      icon: <HelpCircle className="h-6 w-6" />,
      articles: 15,
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Data & Analytics',
      description: 'Understanding reports and metrics',
      icon: <FileText className="h-6 w-6" />,
      articles: 10,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const popularArticles = [
    {
      title: 'How to Set Up Red Flag Alerts',
      views: 1250,
      rating: 4.8,
      estimatedTime: '5 min read',
      category: 'Red Flag Alerts'
    },
    {
      title: 'Understanding KPI Metrics',
      views: 980,
      rating: 4.6,
      estimatedTime: '8 min read',
      category: 'Data & Analytics'
    },
    {
      title: 'Inviting Team Members',
      views: 750,
      rating: 4.9,
      estimatedTime: '3 min read',
      category: 'User Management'
    }
  ];

  const handleCategoryClick = (category: string) => {
    if (category === 'Getting Started') {
      navigate('/help/getting-started');
    } else if (category === 'User Management') {
      navigate('/help/user-management');
    } else {
      toast({
        title: `${category} Help`,
        description: "Help articles coming soon",
      });
    }
  };

  const handleArticleClick = (article: string) => {
    toast({
      title: "Opening Article",
      description: `Opening "${article}"`,
    });
  };

  const handleContactSupport = () => {
    toast({
      title: "Contact Support",
      description: "Support contact form coming soon",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Blue Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
          <div>
            <h1 className="text-4xl font-bold mb-4">Help Center</h1>
            <p className="text-xl text-blue-100 max-w-3xl">Find answers, tutorials, and support to get the most out of OPSIGHT</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Input type="text" placeholder="Search for help articles..." className="pl-12" />
          <Search className="absolute left-4 top-3 h-6 w-6 text-gray-500" />
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {helpCategories.map((category) => (
            <Card key={category.title} className={`cursor-pointer hover:shadow-lg transition-shadow ${category.color}`} onClick={() => handleCategoryClick(category.title)}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {category.icon}
                  <span>{category.title}</span>
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {category.articles} articles <ArrowRight className="inline-block h-4 w-4 ml-1" />
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Popular Articles */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Popular Articles</h2>
          <div className="space-y-4">
            {popularArticles.map((article) => (
              <Card key={article.title} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleArticleClick(article.title)}>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">{article.title}</CardTitle>
                  <CardDescription className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{article.rating}</span>
                      <Clock className="h-4 w-4 text-gray-500 ml-2" />
                      <span>{article.estimatedTime}</span>
                    </div>
                    <Badge>{article.category}</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {article.views} views
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need More Help?</h2>
          <p className="text-gray-600 mb-6">Contact our support team for personalized assistance</p>
          <Button onClick={handleContactSupport} className="bg-blue-600 hover:bg-blue-700">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
