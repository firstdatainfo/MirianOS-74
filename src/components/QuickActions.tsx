import React from 'react';
import { Plus, UserPlus, ClipboardList, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const QuickActions = () => {
  const actions = [{
    icon: UserPlus,
    label: 'Novo Cliente',
    description: 'Cadastrar novo cliente',
    color: 'bg-blue-500 hover:bg-blue-600'
  }, {
    icon: ClipboardList,
    label: 'Nova OS',
    description: 'Criar ordem de serviço',
    color: 'bg-green-500 hover:bg-green-600'
  }, {
    icon: Package,
    label: 'Novo Produto',
    description: 'Cadastrar produto/serviço',
    color: 'bg-purple-500 hover:bg-purple-600'
  }, {
    icon: Plus,
    label: 'Pedido Express',
    description: 'Pedido rápido',
    color: 'bg-orange-500 hover:bg-orange-600'
  }];
  return <Card className="animate-fade-in">
      
      
    </Card>;
};
export default QuickActions;