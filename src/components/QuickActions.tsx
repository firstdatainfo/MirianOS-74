import React from 'react';
import { Plus, UserPlus, ClipboardList, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
const QuickActions = () => {
  const navigate = useNavigate();
  
  const handleAction = (label: string) => {
    switch(label) {
      case 'Novo Cliente':
        navigate('/clientes?new=true');
        break;
      case 'Nova OS':
        navigate('/ordem-servico');
        break;
      case 'Novo Produto':
        navigate('/produtos/novo');
        break;
      case 'Pedido Express':
        navigate('/pedido-express');
        break;
      default:
        console.log('Ação não implementada:', label);
    }
  };
  
  const actions = [{
    icon: UserPlus,
    label: 'Novo Cliente',
    description: 'Cadastrar novo cliente',
    gradient: 'from-blue-500 to-purple-500',
    shadow: 'shadow-neon-primary/30 hover:shadow-neon-primary/50'
  }, {
    icon: ClipboardList,
    label: 'Nova OS',
    description: 'Criar ordem de serviço',
    gradient: 'from-green-500 to-emerald-500',
    shadow: 'shadow-neon-success/30 hover:shadow-neon-success/50'
  }, {
    icon: Package,
    label: 'Novo Produto',
    description: 'Cadastrar produto/serviço',
    gradient: 'from-purple-500 to-pink-500',
    shadow: 'shadow-neon-secondary/30 hover:shadow-neon-secondary/50'
  }, {
    icon: Plus,
    label: 'Pedido Express',
    description: 'Pedido rápido',
    gradient: 'from-amber-500 to-yellow-400',
    shadow: 'shadow-neon-warning/30 hover:shadow-neon-warning/50'
  }];
  
  return <Card className="animate-fade-in bg-white/50 backdrop-blur-sm border-white/20 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-medium bg-gradient-primary bg-clip-text text-transparent">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button 
                key={index}
                onClick={() => handleAction(action.label)}
                className={`bg-gradient-to-r ${action.gradient} ${action.shadow} bg-200% bg-fixed
                  h-auto flex flex-col items-center justify-center p-4 gap-2 
                  transition-all duration-300 hover:scale-105 text-white
                  hover:bg-right`}
              >
                <Icon className="h-6 w-6 mb-2" />
                <span className="font-medium">{action.label}</span>
                <span className="text-xs text-white/80">{action.description}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>;
};
export default QuickActions;