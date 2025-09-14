import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star-rating';
import { storeApi, ratingApi } from '@/services/mockApi';
import { StoreWithUserRating } from '@/types/store';
import { useToast } from '@/hooks/use-toast';
import { Search, MapPin, Mail, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function StoreListPage() {
  const { user } = useAuth();
  const [stores, setStores] = useState<StoreWithUserRating[]>([]);
  const [filteredStores, setFilteredStores] = useState<StoreWithUserRating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rating'>('name');
  const { toast } = useToast();

  useEffect(() => {
    loadStores();
  }, [user]);

  useEffect(() => {
    filterAndSortStores();
  }, [stores, searchTerm, sortBy]);

  const loadStores = async () => {
    if (!user) return;
    
    try {
      const data = await storeApi.getStoresWithUserRatings(user.id);
      setStores(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load stores",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortStores = () => {
    let filtered = stores.filter(store => 
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return b.averageRating - a.averageRating;
      }
    });

    setFilteredStores(filtered);
  };

  const handleRatingSubmit = async (storeId: string, rating: number) => {
    if (!user) return;

    try {
      await ratingApi.submitRating(user.id, storeId, rating);
      await loadStores(); // Reload to get updated ratings
      
      toast({
        title: "Rating submitted",
        description: "Thank you for your feedback!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit rating",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading stores...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Discover Stores</h1>
          <p className="text-muted-foreground">Find and rate amazing stores in your area</p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search stores by name or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={(value: 'name' | 'rating') => setSortBy(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Sort by Name</SelectItem>
                    <SelectItem value="rating">Sort by Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Store Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <Card key={store.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span className="text-lg">{store.name}</span>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <StarRating rating={store.averageRating} readonly size="sm" />
                      <span className="text-sm text-muted-foreground ml-1">
                        ({store.totalRatings})
                      </span>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{store.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span>{store.email}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Your Rating:</span>
                    <span className="text-sm text-muted-foreground">
                      {store.userRating ? 'Click to edit' : 'Click to rate'}
                    </span>
                  </div>
                  <StarRating
                    rating={store.userRating?.rating || 0}
                    onRatingChange={(rating) => handleRatingSubmit(store.id, rating)}
                    size="md"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStores.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No stores found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'No stores available at the moment'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}