
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Edit } from 'lucide-react';

interface ServiceOrder {
  id: string;
  cliente: string;
  servico: string;
  status: 'pendente' | 'em-andamento' | 'concluido' | 'entregue';
  valor: string;
  data: string;
}

const ServiceOrderTable = () => {
  const orders: ServiceOrder[] = [
    {
      id: 'OS-001',
      cliente: 'João Silva',
      servico: 'Camisa Polo',
      status: 'em-andamento',
      valor: 'R$ 35,00',
      data: '01/04/2024'
    },
    {
      id: 'OS-002',
      cliente: 'Maria Santos',
      servico: 'Vestido Bordado',
      status: 'pendente',
      valor: 'R$ 85,00',
      data: '02/04/2024'
    },
    {
      id: 'OS-003',
      cliente: 'Pedro Costa',
      servico: 'Estampa Personalizada',
      status: 'concluido',
      valor: 'R$ 45,00',
      data: '03/04/2024'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'em-andamento': return 'bg-blue-100 text-blue-800';
      case 'concluido': return 'bg-green-100 text-green-800';
      case 'entregue': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Ordens de Serviço Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Cliente</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Serviço</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Valor</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Data</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-brand-blue">{order.id}</td>
                  <td className="py-3 px-4">{order.cliente}</td>
                  <td className="py-3 px-4">{order.servico}</td>
                  <td className="py-3 px-4">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-medium">{order.valor}</td>
                  <td className="py-3 px-4">{order.data}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceOrderTable;
