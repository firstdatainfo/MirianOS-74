
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import OrderTracking from '@/components/OrderTracking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Package } from 'lucide-react';

const AcompanharPedido = () => {
  const [searchId, setSearchId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Dados de exemplo - em produção viriam do backend
  const orders = [
    {
      id: 'OS-001',
      cliente: 'João Silva',
      status: 'em-andamento',
      servico: 'Camisa Polo',
      valor: 350.00
    },
    {
      id: 'OS-002',
      cliente: 'Maria Santos',
      status: 'concluido',
      servico: 'Vestido Bordado',
      valor: 150.00
    },
    {
      id: 'OS-003',
      cliente: 'Pedro Costa',
      status: 'entregue',
      servico: 'Estampa Personalizada',
      valor: 80.00
    }
  ];

  const handleSearch = () => {
    const order = orders.find(o => o.id === searchId);
    setSelectedOrder(order);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 text-brand-blue" />
            <h1 className="text-3xl font-bold text-gray-900">Acompanhar Pedido</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Buscar Ordem de Serviço</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Digite o número da OS (ex: OS-001)"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch} className="bg-brand-blue hover:bg-blue-600">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>
            </CardContent>
          </Card>

          {selectedOrder && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">OS</label>
                      <p className="text-lg font-semibold text-brand-blue">{selectedOrder.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Cliente</label>
                      <p className="text-lg">{selectedOrder.cliente}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Serviço</label>
                      <p className="text-lg">{selectedOrder.servico}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Valor</label>
                      <p className="text-lg font-semibold">R$ {selectedOrder.valor.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <OrderTracking 
                orderId={selectedOrder.id} 
                currentStatus={selectedOrder.status}
              />
            </div>
          )}

          {searchId && !selectedOrder && (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-500">Nenhuma ordem de serviço encontrada com o ID: {searchId}</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default AcompanharPedido;
