import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Package } from 'lucide-react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import ThemeToggle from './components/ThemeToggle';
import Navigation from './components/Navigation';
import AboutPage from './components/AboutPage';
import SearchFilters from './components/SearchFilters';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'dashboard' | 'about'>('home');
  const [filters, setFilters] = useState({
    search: '',
    field: 'product_name' as const
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <Toaster position="top-right" />
      
      <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Controle de Pedidos</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {currentPage === 'home' && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg transition-colors">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Adicionar Novo Item</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Preencha os dados do item para adicionar ao sistema.</p>
                  <ProductForm />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg transition-colors">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Lista de Itens</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Visualize e gerencie todos os itens cadastrados.</p>
                  <SearchFilters filters={filters} onFilterChange={setFilters} />
                  <ProductList searchFilters={filters} />
                </div>
              </div>
            </div>
          )}

          {currentPage === 'about' && <AboutPage />}

          {currentPage === 'dashboard' && (
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg transition-colors p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Dashboard em desenvolvimento</h2>
              <p className="text-gray-500 dark:text-gray-400">
                O painel de Business Intelligence está sendo implementado e estará disponível em breve.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;