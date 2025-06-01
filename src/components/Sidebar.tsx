
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, ClipboardList, Settings, Package, ChevronLeft, ChevronRight, Shirt, Calculator, UserPlus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  
  const menuItems = [{
    icon: Home,
    label: 'Dashboard',
    path: '/'
  }, {
    icon: Users,
    label: 'Clientes',
    path: '/clientes'
  }, {
    icon: Calculator,
    label: 'Orçamentos',
    path: '/orcamentos'
  }, {
    icon: ClipboardList,
    label: 'Ordem de Serviço',
    path: '/ordem-servico'
  }, {
    icon: Package,
    label: 'Acompanhar Pedido',
    path: '/acompanhar-pedido'
  }, {
    icon: Settings,
    label: 'Configurações',
    path: '/configuracoes'
  }];

  const quickActions = [
    {
      icon: UserPlus,
      label: 'Novo Cliente',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => window.location.href = '/clientes'
    },
    {
      icon: ClipboardList,
      label: 'Nova OS',
      color: 'bg-green-500 hover:bg-green-600',
      action: () => window.location.href = '/ordem-servico'
    },
    {
      icon: Package,
      label: 'Novo Produto',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => console.log('Novo produto')
    },
    {
      icon: Plus,
      label: 'Pedido Express',
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => console.log('Pedido express')
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} relative flex flex-col h-full`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-brand-blue text-white rounded-full p-1.5 shadow-lg hover:bg-blue-600 transition-colors z-10"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <div className="p-6">
        <div className="flex items-center space-x-3">
          <Shirt className="h-8 w-8 text-brand-blue" />
          {!isCollapsed && <h2 className="text-xl font-bold text-indigo-950">MirianOS</h2>}
        </div>
      </div>

      <nav className="mt-8 flex-1">
        <ul className="space-y-2 px-[8px]">
          {menuItems.map(item => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-brand-blue text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <item.icon className="h-5 w-5" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Ações Rápidas */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Ações Rápidas
          </h3>
        )}
        <div className={`grid gap-2 ${isCollapsed ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {quickActions.map((action, index) => (
            <Button
              key={index}
              onClick={action.action}
              className={`${action.color} text-white transition-all duration-200 hover:scale-105 ${
                isCollapsed ? 'p-2 w-10 h-10' : 'h-12 flex flex-col items-center justify-center space-y-1'
              }`}
              title={isCollapsed ? action.label : ''}
            >
              <action.icon className={isCollapsed ? 'h-4 w-4' : 'h-5 w-5'} />
              {!isCollapsed && (
                <span className="text-xs font-medium">{action.label}</span>
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
