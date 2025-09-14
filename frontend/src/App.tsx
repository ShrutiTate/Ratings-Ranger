import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import AuthPage from "./pages/auth/AuthPage";
import StoreListPage from "./pages/user/StoreListPage";
import ProfilePage from "./pages/user/ProfilePage";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  // Redirect authenticated users from auth page
  if (isAuthenticated && user) {
    const defaultRoute = user.role === 'admin' ? '/admin' 
                        : user.role === 'store_owner' ? '/owner' 
                        : '/stores';
    
    return (
      <Routes>
        <Route path="/auth" element={<Navigate to={defaultRoute} replace />} />
        
        {/* Normal User Routes */}
        <Route 
          path="/stores" 
          element={
            <ProtectedRoute allowedRoles={['normal']}>
              <StoreListPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute allowedRoles={['normal', 'store_owner', 'admin']}>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        
        {/* Store Owner Routes */}
        <Route 
          path="/owner" 
          element={
            <ProtectedRoute allowedRoles={['store_owner']}>
              <OwnerDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Root redirect */}
        <Route path="/" element={<Navigate to={defaultRoute} replace />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  // Routes for non-authenticated users
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
