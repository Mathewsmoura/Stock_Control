import React from 'react';
import { Package } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
      <div className="flex items-center justify-center mb-8">
        <Package className="w-16 h-16 text-blue-600 dark:text-blue-400" />
      </div>
      
      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
        Sobre a Plataforma
      </h1>
      
      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <p>
          Esta plataforma foi desenvolvida para facilitar o controle e acompanhamento de pedidos,
          permitindo um gerenciamento eficiente do estoque e prazos de entrega.
        </p>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
          Principais Funcionalidades
        </h2>
        
        <ul className="list-disc pl-6 space-y-2">
          <li>Cadastro e gerenciamento de itens</li>
          <li>Acompanhamento de status de entrega</li>
          <li>Filtros de pesquisa avançados</li>
          <li>Dashboard com métricas e indicadores</li>
          <li>Sistema de notificações de prazos</li>
        </ul>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-600 dark:text-gray-400">
            Desenvolvido por: <span className="font-semibold">Mathews Moura</span>
          </p>
        </div>
      </div>
    </div>
  );
}