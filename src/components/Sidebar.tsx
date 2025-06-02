import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, ClipboardList, Settings, Package, ChevronLeft, ChevronRight, Shirt, Calculator, UserPlus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
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
      gradient: 'from-blue-500 to-purple-500',
      shadow: 'shadow-neon-primary/30 hover:shadow-neon-primary/50',
      action: () => navigate('/clientes?new=true')
    },
    {
      icon: ClipboardList,
      label: 'Nova OS',
      gradient: 'from-green-500 to-emerald-500',
      shadow: 'shadow-neon-success/30 hover:shadow-neon-success/50',
      action: () => navigate('/ordem-servico')
    },
    {
      icon: Package,
      label: 'Novo Produto',
      gradient: 'from-purple-500 to-pink-500',
      shadow: 'shadow-neon-secondary/30 hover:shadow-neon-secondary/50',
      action: () => navigate('/produtos/novo')
    },
    {
      icon: Plus,
      label: 'Pedido Express',
      gradient: 'from-amber-500 to-yellow-400',
      shadow: 'shadow-neon-warning/30 hover:shadow-neon-warning/50',
      action: () => navigate('/pedido-express')
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`bg-gradient-to-b from-white via-gray-50 to-white border-r border-white/20 shadow-xl backdrop-blur-sm transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} relative flex flex-col h-full`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-gradient-primary text-white rounded-full p-1.5 shadow-neon-primary/30 hover:shadow-neon-primary/50 hover:scale-110 transition-all duration-300 z-10"
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
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-gradient-primary text-white shadow-neon-primary/20'
                    : 'text-gray-600 hover:bg-white/50 hover:shadow-neon-primary/10 hover:scale-105'
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
      <div className="p-4 border-t border-white/20 bg-gradient-to-t from-gray-50 to-transparent">
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
              className={`bg-gradient-to-r ${action.gradient} ${action.shadow} bg-200% bg-fixed
                text-white w-full mb-2 flex items-center justify-center gap-2 p-2 
                rounded-lg transition-all duration-300 hover:scale-105 hover:bg-right
                ${isCollapsed ? 'h-10 w-10 p-0' : 'h-auto p-2'}`}
              title={isCollapsed ? action.label : ''}
            >
              <action.icon className={isCollapsed ? 'h-5 w-5' : 'h-5 w-5'} />
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
