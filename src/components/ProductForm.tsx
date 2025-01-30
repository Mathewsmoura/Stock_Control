import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ProductFormData } from '../types/inventory';
import { calculateStatus } from '../utils/status';

export default function ProductForm() {
  const [formData, setFormData] = useState<ProductFormData>({
    product_code: '',
    product_name: '',
    request_code: '',
    order_number: '',
    department: '',
    delivery_date: '',
    observation: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const status = calculateStatus(formData.delivery_date);
      
      const { error } = await supabase
        .from('products')
        .insert([{ ...formData, status }]);

      if (error) throw error;

      toast.success('Product added successfully!');
      setFormData({
        product_code: '',
        product_name: '',
        request_code: '',
        order_number: '',
        department: '',
        delivery_date: '',
        observation: ''
      });
    } catch (error) {
      toast.error('Error adding product');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código do Produto
          </label>
          <input
            type="text"
            required
            value={formData.product_code}
            onChange={(e) => setFormData(prev => ({ ...prev, product_code: e.target.value }))}
            className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Produto
          </label>
          <input
            type="text"
            required
            value={formData.product_name}
            onChange={(e) => setFormData(prev => ({ ...prev, product_name: e.target.value }))}
            className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código da Requisição
          </label>
          <input
            type="text"
            required
            value={formData.request_code}
            onChange={(e) => setFormData(prev => ({ ...prev, request_code: e.target.value }))}
            className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número do Pedido
          </label>
          <input
            type="text"
            required
            value={formData.order_number}
            onChange={(e) => setFormData(prev => ({ ...prev, order_number: e.target.value }))}
            className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Setor
          </label>
          <input
            type="text"
            required
            value={formData.department}
            onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
            className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de Entrega
          </label>
          <input
            type="date"
            required
            value={formData.delivery_date}
            onChange={(e) => setFormData(prev => ({ ...prev, delivery_date: e.target.value }))}
            className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observação
        </label>
        <textarea
          value={formData.observation}
          onChange={(e) => setFormData(prev => ({ ...prev, observation: e.target.value }))}
          rows={3}
          className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        className="mt-6 w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Save className="w-4 h-4 mr-2" />
        Salvar Produto
      </button>
    </form>
  );
}