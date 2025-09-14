import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({ 
  data, 
  columns, 
  searchPlaceholder = "Search...",
  className 
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleFilter = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const filteredData = data.filter(item => {
    return Object.entries(filters).every(([key, filterValue]) => {
      if (!filterValue) return true;
      const itemValue = String(getNestedValue(item, key)).toLowerCase();
      return itemValue.includes(filterValue.toLowerCase());
    });
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;
    
    const aValue = getNestedValue(a, sortKey);
    const bValue = getNestedValue(b, sortKey);
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
    }
    
    return 0;
  });

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Filters */}
      <div className="p-4 border-b bg-muted/30">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {columns.filter(col => col.filterable).map(column => (
            <div key={String(column.key)}>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                {column.label}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={`Filter by ${column.label.toLowerCase()}`}
                  value={filters[String(column.key)] || ''}
                  onChange={(e) => handleFilter(String(column.key), e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {columns.map(column => (
                <th 
                  key={String(column.key)}
                  className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
                >
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort(String(column.key))}
                      className="h-auto p-0 hover:bg-transparent"
                    >
                      <span>{column.label}</span>
                      {sortKey === String(column.key) && (
                        sortDirection === 'asc' 
                          ? <ChevronUp className="ml-2 w-4 h-4" />
                          : <ChevronDown className="ml-2 w-4 h-4" />
                      )}
                    </Button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <tr 
                key={index}
                className="border-t hover:bg-muted/30 transition-colors"
              >
                {columns.map(column => (
                  <td 
                    key={String(column.key)}
                    className="px-4 py-3 text-sm"
                  >
                    {column.render 
                      ? column.render(getNestedValue(item, String(column.key)), item)
                      : String(getNestedValue(item, String(column.key)))
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        {sortedData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No data found
          </div>
        )}
      </div>
    </Card>
  );
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}