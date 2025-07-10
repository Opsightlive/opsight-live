
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Image as ImageIcon, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SidebarImage {
  id: string;
  label: string;
  imageUrl: string;
  path: string;
}

const SidebarImageManager = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<SidebarImage[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('');

  const sidebarTabs = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { id: 'portfolio', label: 'Portfolio Overview', path: '/portfolio' },
    { id: 'red-flags', label: 'Red Flag Alerts', path: '/red-flag-alerts' },
    { id: 'kpi', label: 'KPI Command Center', path: '/kpi-center' },
    { id: 'timeline', label: 'Red Flag Timeline', path: '/timeline' },
    { id: 'predictive', label: 'Predictive Signals', path: '/predictive' },
    { id: 'ai-reader', label: 'AI Reader', path: '/ai-reader' },
    { id: 'settings', label: 'Settings', path: '/settings' },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedTab) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      const selectedTabData = sidebarTabs.find(tab => tab.id === selectedTab);
      
      if (selectedTabData) {
        const newImage: SidebarImage = {
          id: selectedTab,
          label: selectedTabData.label,
          imageUrl,
          path: selectedTabData.path
        };

        setImages(prev => {
          const filtered = prev.filter(img => img.id !== selectedTab);
          return [...filtered, newImage];
        });

        toast({
          title: "Image uploaded",
          description: `Image for ${selectedTabData.label} has been uploaded.`,
        });

        setSelectedTab('');
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    toast({
      title: "Image removed",
      description: "Sidebar tab image has been removed.",
    });
  };

  const saveConfiguration = () => {
    // This would typically save to a backend or local storage
    localStorage.setItem('sidebar-images', JSON.stringify(images));
    toast({
      title: "Configuration saved",
      description: `${images.length} sidebar images have been saved.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Sidebar Tab Image Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Sidebar Tab
            </label>
            <select
              value={selectedTab}
              onChange={(e) => setSelectedTab(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a sidebar tab...</option>
              {sidebarTabs.map(tab => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={!selectedTab}
              variant="outline"
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Image for {selectedTab ? sidebarTabs.find(t => t.id === selectedTab)?.label : 'Selected Tab'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {images.length > 0 && (
            <Button onClick={saveConfiguration} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Configuration ({images.length} images)
            </Button>
          )}
        </CardContent>
      </Card>

      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Images ({images.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image.imageUrl}
                      alt={image.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{image.label}</p>
                      <Badge variant="secondary" className="text-xs">
                        {image.path}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => removeImage(image.id)}
                      variant="destructive"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {images.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No sidebar images uploaded yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Select a sidebar tab and upload an image to get started
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SidebarImageManager;
