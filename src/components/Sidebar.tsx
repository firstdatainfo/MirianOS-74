
import React from 'react';
import { 
  Home, 
  Users, 
  ClipboardList, 
  Package, 
  BarChart3, 
  Settings,
  FileText,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: Users, label: 'Clientes', count: 156 },
    { icon: ClipboardList, label: 'Pedidos', count: 23 },
    { icon: Package, label: 'Serviços', count: 8 },
    { icon: CheckCircle, label: 'Qualidade' },
    { icon: FileText, label: 'Relatórios' },
    { icon: BarChart3, label: 'Análises' },
    { icon: Settings, label: 'Configurações' },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-brand rounded-lg flex items-center justify-center">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">ServicePro</h2>
            <p className="text-slate-400 text-sm">Sistema de Gestão</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant={item.active ? "secondary" : "ghost"}
              className={`w-full justify-start text-left ${
                item.active 
                  ? 'bg-gradient-brand text-white hover:bg-gradient-brand/90' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span className="flex-1">{item.label}</span>
              {item.count && (
                <span className="bg-slate-600 text-xs px-2 py-1 rounded-full">
                  {item.count}
                </span>
              )}
            </Button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
