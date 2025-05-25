
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  ClipboardList, 
  Settings, 
  Package,
  ChevronLeft,
  ChevronRight,
  Shirt,
  Calculator
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Clientes', path: '/clientes' },
    { icon: Calculator, label: 'Orçamentos', path: '/orcamentos' },
    { icon: ClipboardList, label: 'Ordem de Serviço', path: '/ordem-servico' },
    { icon: Package, label: 'Acompanhar Pedido', path: '/acompanhar-pedido' },
    { icon: Settings, label: 'Configurações', path: '/configuracoes' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} relative`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-brand-blue text-white rounded-full p-1.5 shadow-lg hover:bg-blue-600 transition-colors z-10"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <div className="p-6">
        <div className="flex items-center space-x-3">
          <Shirt className="h-8 w-8 text-brand-blue" />
          {!isCollapsed && <h2 className="text-xl font-bold text-gray-800">ConfecApp</h2>}
        </div>
      </div>

      <nav className="mt-8">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => (
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
    </div>
  );
};

export default Sidebar;
