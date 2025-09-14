import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, Column } from '@/components/ui/data-table';
import { StarRating } from '@/components/ui/star-rating';
import { ratingApi, storeApi } from '@/services/mockApi';
import { UserRating, Store } from '@/types/store';
import { useToast } from '@/hooks/use-toast';
import { Star, Users, TrendingUp } from 'lucide-react';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user || !user.storeId) {
      toast({
        title: "Error",
        description: "Store information not found",
        variant: "destructive",
      });
      return;
    }

    try {
      const [storesData, ratingsData] = await Promise.all([
        storeApi.getStores(),
        ratingApi.getStoreRatings(user.storeId),
      ]);

      const userStore = storesData.find(s => s.id === user.storeId);
      setStore(userStore || null);
      setRatings(ratingsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ratingColumns: Column<UserRating>[] = [
    {
      key: 'userName',
      label: 'Customer Name',
      sortable: true,
      filterable: true,
    },
    {
      key: 'userEmail',
      label: 'Email',
      sortable: true,
      filterable: true,
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (rating: number) => (
        <StarRating rating={rating} readonly size="sm" />
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">Store Not Found</h3>
              <p className="text-muted-foreground">
                Your store information could not be loaded. Please contact support.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Store Dashboard</h1>
          <p className="text-muted-foreground">Monitor your store's performance and customer feedback</p>
        </div>

        {/* Store Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Store Name</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{store.name}</div>
              <p className="text-xs text-muted-foreground mt-1">{store.address}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{store.averageRating.toFixed(1)}</span>
                <StarRating rating={store.averageRating} readonly size="sm" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Out of 5 stars
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{store.totalRatings}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Customer reviews
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Customer Ratings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {ratings.length > 0 ? (
              <DataTable
                data={ratings}
                columns={ratingColumns}
                searchPlaceholder="Search customers..."
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                <p>Your store hasn't received any customer reviews yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}