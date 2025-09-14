import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable, Column } from '@/components/ui/data-table';
import { adminApi, storeApi } from '@/services/mockApi';
import { User } from '@/types/auth';
import { Store } from '@/types/store';
import { useToast } from '@/hooks/use-toast';
import { Users, Store as StoreIcon, Star, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AddUserForm } from '@/components/admin/AddUserForm';
import { AddStoreForm } from '@/components/admin/AddStoreForm';
import { StarRating } from '@/components/ui/star-rating';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [dashboardStats, usersData, storesData] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getUsers(),
        storeApi.getStores(),
      ]);

      setStats(dashboardStats);
      setUsers(usersData);
      setStores(storesData);
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

  const handleUserAdded = () => {
    setShowAddUser(false);
    loadDashboardData();
    toast({
      title: "Success",
      description: "User added successfully",
    });
  };

  const handleStoreAdded = () => {
    setShowAddStore(false);
    loadDashboardData();
    toast({
      title: "Success",
      description: "Store added successfully",
    });
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'store_owner': return 'Store Owner';
      case 'normal': return 'User';
      default: return role;
    }
  };

  const userColumns: Column<User>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      filterable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      filterable: true,
    },
    {
      key: 'address',
      label: 'Address',
      filterable: true,
      render: (address: string) => (
        <span className="max-w-xs truncate block" title={address}>
          {address}
        </span>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      filterable: true,
      render: (role: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          role === 'admin' ? 'bg-red-100 text-red-800' :
          role === 'store_owner' ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }`}>
          {getRoleDisplay(role)}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined',
      sortable: true,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  const storeColumns: Column<Store>[] = [
    {
      key: 'name',
      label: 'Store Name',
      sortable: true,
      filterable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      filterable: true,
    },
    {
      key: 'address',
      label: 'Address',
      filterable: true,
      render: (address: string) => (
        <span className="max-w-xs truncate block" title={address}>
          {address}
        </span>
      ),
    },
    {
      key: 'averageRating',
      label: 'Rating',
      sortable: true,
      render: (rating: number, store: Store) => (
        <div className="flex items-center gap-2">
          <StarRating rating={rating} readonly size="sm" />
          <span className="text-sm text-muted-foreground">
            ({store.totalRatings})
          </span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, stores, and platform statistics</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered platform users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
              <StoreIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStores}</div>
              <p className="text-xs text-muted-foreground">
                Active stores on platform
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Ratings</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRatings}</div>
              <p className="text-xs text-muted-foreground">
                Customer reviews submitted
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Users Management */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>User Management</CardTitle>
            <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>
                <AddUserForm onSuccess={handleUserAdded} />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <DataTable
              data={users}
              columns={userColumns}
              searchPlaceholder="Search users..."
            />
          </CardContent>
        </Card>

        {/* Stores Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Store Management</CardTitle>
            <Dialog open={showAddStore} onOpenChange={setShowAddStore}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Store
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Store</DialogTitle>
                </DialogHeader>
                <AddStoreForm onSuccess={handleStoreAdded} />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <DataTable
              data={stores}
              columns={storeColumns}
              searchPlaceholder="Search stores..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}