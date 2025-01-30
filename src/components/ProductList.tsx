import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle, Clock, Save, X, Trash2, Check, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { Product } from '../types/inventory';
import { calculateStatus } from '../utils/status';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface ProductListProps {
  searchFilters: {
    search: string;
    field: 'product_name' | 'order_number' | 'request_code' | 'delivery_date';
  };
}

export default function ProductList({ searchFilters }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<'all' | 'on_time' | 'upcoming' | 'delayed' | 'delivered' | 'deleted'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingObservation, setEditingObservation] = useState('');
  const [editingDeliveryDate, setEditingDeliveryDate] = useState('');
  const [editingField, setEditingField] = useState<'observation' | 'delivery_date' | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    
    // Set up real-time subscription for products table
    const subscription = supabase
      .channel('products_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [searchFilters]);

  const fetchProducts = async () => {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchFilters.search) {
        if (searchFilters.field === 'delivery_date') {
          query = query.ilike(searchFilters.field, `%${searchFilters.search}%`);
        } else {
          query = query.ilike(searchFilters.field, `%${searchFilters.search}%`);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Erro ao carregar produtos');
    }
  };

  const handleEdit = (product: Product, field: 'observation' | 'delivery_date') => {
    setEditingId(product.id);
    setEditingField(field);
    if (field === 'observation') {
      setEditingObservation(product.observation || '');
    } else {
      setEditingDeliveryDate(product.delivery_date);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingField(null);
    setEditingObservation('');
    setEditingDeliveryDate('');
  };

  const handleSave = async (productId: string) => {
    try {
      let updateData = {};
      if (editingField === 'observation') {
        updateData = { observation: editingObservation };
      } else if (editingField === 'delivery_date') {
        const newStatus = calculateStatus(editingDeliveryDate);
        updateData = { 
          delivery_date: editingDeliveryDate,
          status: newStatus
        };
      }

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId);

      if (error) throw error;

      toast.success(editingField === 'observation' 
        ? 'Observação atualizada com sucesso!'
        : 'Data de entrega atualizada com sucesso!');
      setEditingId(null);
      setEditingField(null);
    } catch (error) {
      toast.error('Erro ao atualizar produto');
      console.error(error);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          status: 'deleted',
          deleted_at: new Date().toISOString()
        })
        .eq('id', productId);

      if (error) throw error;

      toast.success('Produto movido para excluídos');
    } catch (error) {
      toast.error('Erro ao excluir produto');
      console.error(error);
    }
  };

  const handleRestore = async (productId: string) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const newStatus = calculateStatus(product.delivery_date);
      
      const { error } = await supabase
        .from('products')
        .update({
          status: newStatus,
          deleted_at: null
        })
        .eq('id', productId);

      if (error) throw error;

      toast.success('Produto restaurado com sucesso!');
    } catch (error) {
      toast.error('Erro ao restaurar produto');
      console.error(error);
    }
  };

  const handleDeliveryToggle = async (product: Product) => {
    try {
      const newIsDelivered = !product.is_delivered;
      const newStatus = newIsDelivered ? 'delivered' : calculateStatus(product.delivery_date);

      const { error } = await supabase
        .from('products')
        .update({
          is_delivered: newIsDelivered,
          status: newStatus
        })
        .eq('id', product.id);

      if (error) throw error;

      toast.success(newIsDelivered ? 'Produto marcado como entregue!' : 'Produto marcado como não entregue!');
    } catch (error) {
      toast.error('Erro ao atualizar status de entrega');
      console.error(error);
    }
  };

  const filteredProducts = products.filter(product => {
    if (filter === 'deleted') return product.status === 'deleted';
    if (filter === 'all') return product.status !== 'deleted';
    return product.status === filter;
  });

  const getStatusIcon = (status: Product['status']) => {
    switch (status) {
      case 'on_time':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'upcoming':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'delayed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'delivered':
        return <Check className="w-5 h-5 text-blue-500" />;
      case 'deleted':
        return <Trash2 className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: Product['status']) => {
    switch (status) {
      case 'on_time':
        return 'No Prazo';
      case 'upcoming':
        return 'Próximo';
      case 'delayed':
        return 'Atrasado';
      case 'delivered':
        return 'Entregue';
      case 'deleted':
        return 'Excluído';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md transition-colors ${
            filter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter('on_time')}
          className={`px-4 py-2 rounded-md transition-colors ${
            filter === 'on_time' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          No Prazo
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-md transition-colors ${
            filter === 'upcoming' 
              ? 'bg-yellow-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Próximos
        </button>
        <button
          onClick={() => setFilter('delayed')}
          className={`px-4 py-2 rounded-md transition-colors ${
            filter === 'delayed' 
              ? 'bg-red-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Atrasados
        </button>
        <button
          onClick={() => setFilter('delivered')}
          className={`px-4 py-2 rounded-md transition-colors ${
            filter === 'delivered' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Entregues
        </button>
        <button
          onClick={() => setFilter('deleted')}
          className={`px-4 py-2 rounded-md transition-colors ${
            filter === 'deleted' 
              ? 'bg-gray-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Excluídos
        </button>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Código</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Requisição</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pedido</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Setor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Entrega</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Observação</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(product.status)}
                    <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">{getStatusText(product.status)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{product.product_code}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{product.product_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{product.request_code}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{product.order_number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{product.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {editingId === product.id && editingField === 'delivery_date' ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="date"
                        value={editingDeliveryDate}
                        onChange={(e) => setEditingDeliveryDate(e.target.value)}
                        className="w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      <button
                        onClick={() => handleSave(product.id)}
                        className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                        title="Salvar"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="Cancelar"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => handleEdit(product, 'delivery_date')}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors"
                      title="Clique para editar"
                    >
                      {format(new Date(product.delivery_date), 'dd/MM/yyyy')}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                  {editingId === product.id && editingField === 'observation' ? (
                    <div className="flex items-center space-x-2">
                      <textarea
                        value={editingObservation}
                        onChange={(e) => setEditingObservation(e.target.value)}
                        className="w-full min-w-[200px] text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        rows={2}
                      />
                      <button
                        onClick={() => handleSave(product.id)}
                        className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                        title="Salvar"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="Cancelar"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => handleEdit(product, 'observation')}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors"
                      title="Clique para editar"
                    >
                      {product.observation || 'Clique para adicionar observação'}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  <div className="flex items-center space-x-2">
                    {product.status === 'deleted' ? (
                      <button
                        onClick={() => handleRestore(product.id)}
                        className="p-1.5 rounded bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:text-green-300"
                        title="Restaurar produto"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleDeliveryToggle(product)}
                          className={`p-1.5 rounded ${
                            product.is_delivered
                              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                          }`}
                          title={product.is_delivered ? 'Marcar como não entregue' : 'Marcar como entregue'}
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setProductToDelete(product.id);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300"
                          title="Excluir produto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={() => {
          if (productToDelete) {
            handleDelete(productToDelete);
          }
        }}
      />
    </div>
  );
}