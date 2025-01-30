import React from 'react';
import { Search } from 'lucide-react';

interface SearchFiltersProps {
  filters: {
    search: string;
    field: 'product_name' | 'order_number' | 'request_code' | 'delivery_date';
  };
  onFilterChange: (filters: {
    search: string;
    field: 'product_name' | 'order_number' | 'request_code' | 'delivery_date';
  }) => void;
}

export default function SearchFilters({ filters, onFilterChange }: SearchFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            placeholder="Pesquisar..."
            className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      <select
        value={filters.field}
        onChange={(e) => onFilterChange({
          ...filters,
          field: e.target.value as 'product_name' | 'order_number' | 'request_code' | 'delivery_date'
        })}
        className="px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        <option value="product_name">Nome do Item</option>
        <option value="order_number">Código do Pedido</option>
        <option value="request_code">Código da Requisição</option>
        <option value="delivery_date">Data de Entrega</option>
      </select>
    </div>
  );
}