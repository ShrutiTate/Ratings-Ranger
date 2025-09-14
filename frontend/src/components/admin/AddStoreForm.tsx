import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { storeApi } from '@/services/mockApi';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface AddStoreFormProps {
  onSuccess: () => void;
}

export function AddStoreForm({ onSuccess }: AddStoreFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = 'Store name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.address) {
      newErrors.address = 'Address is required';
    }

    if (!formData.ownerId) {
      newErrors.ownerId = 'Owner ID is required';
    } else if (isNaN(Number(formData.ownerId))) {
      newErrors.ownerId = 'Owner ID must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Normalize to backend format
      await storeApi.addStore({
        name: formData.name,
        email: formData.email,
        address: formData.address,
        ownerId: Number(formData.ownerId),
      });
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add store',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Store Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter store name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Store Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter store email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <Label htmlFor="address">Store Address</Label>
        <Textarea
          id="address"
          placeholder="Enter store address"
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          className="min-h-[80px]"
        />
        {errors.address && (
          <p className="text-sm text-destructive mt-1">{errors.address}</p>
        )}
      </div>

      <div>
        <Label htmlFor="ownerId">Owner ID</Label>
        <Input
          id="ownerId"
          type="text"
          placeholder="Enter owner user ID"
          value={formData.ownerId}
          onChange={(e) => setFormData(prev => ({ ...prev, ownerId: e.target.value }))}
        />
        {errors.ownerId && (
          <p className="text-sm text-destructive mt-1">{errors.ownerId}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Enter the user ID of the store owner
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding Store...
          </>
        ) : (
          'Add Store'
        )}
      </Button>
    </form>
  );
}
