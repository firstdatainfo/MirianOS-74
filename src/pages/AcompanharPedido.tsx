
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import AcompanhamentoPedido from '@/components/AcompanhamentoPedido';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Package, Clock, CheckCircle, Truck } from 'lucide-react';
import { useOrdenServico, useOrdensServico } from '@/hooks/useOrdenServico';
import { Badge } from '@/components/ui/badge';

const AcompanharPedido = () => {
  const [searchId, setSearchId] = useState('');
  const [searchAttempted, setSearchAttempted] = useState(false);
  
  const { data: selectedOrder, isLoading: isLoadingOrder } = useOrdenServico(searchId);
  const { data: allOrders, isLoading: isLoadingAllOrders } = useOrdensServico();

  const handleSearch = () => {
    setSearchAttempted(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'em-andamento':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'concluido':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'entregue':
        return <Truck className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge className="bg-yellow-500 text-white">Pendente</Badge>;
      case 'em-andamento':
        return <Badge className="bg-blue-500 text-white">Em Andamento</Badge>;
      case 'concluido':
        return <Badge className="bg-green-500 text-white">Concluído</Badge>;
      case 'entregue':
        return <Badge className="bg-purple-500 text-white">Entregue</Badge>;
      case 'cancelado':
        return <Badge className="bg-red-500 text-white">Cancelado</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Desconhecido</Badge>;
    }
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
                    placeholder="Digite o número da OS (ex: OS-2024-001)"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  className="bg-brand-blue hover:bg-blue-600"
                  disabled={isLoadingOrder}
                >
                  <Search className="h-4 w-4 mr-2" />
                  {isLoadingOrder ? 'Buscando...' : 'Buscar'}
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
                      <p className="text-lg font-semibold text-brand-blue">{selectedOrder.numero_os}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Cliente</label>
                      <p className="text-lg">{selectedOrder.clientes?.nome}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Descrição</label>
                      <p className="text-lg">{selectedOrder.descricao || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Valor</label>
                      <p className="text-lg font-semibold">R$ {selectedOrder.valor_total.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedOrder.status)}
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                    {selectedOrder.data_prevista_entrega && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Previsão de Entrega</label>
                        <p className="text-sm">{new Date(selectedOrder.data_prevista_entrega).toLocaleDateString('pt-BR')}</p>
                      </div>
                    )}
                    {selectedOrder.data_entrega && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Data de Entrega</label>
                        <p className="text-sm">{new Date(selectedOrder.data_entrega).toLocaleDateString('pt-BR')}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <AcompanhamentoPedido ordemServico={selectedOrder} />
            </div>
          )}

          {searchAttempted && !selectedOrder && !isLoadingOrder && searchId && (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-500">Nenhuma ordem de serviço encontrada com o número: {searchId}</p>
              </CardContent>
            </Card>
          )}

          {!searchId && (
            <Card>
              <CardHeader>
                <CardTitle>Ordens de Serviço Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingAllOrders ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Carregando ordens de serviço...</p>
                  </div>
                ) : allOrders && allOrders.length > 0 ? (
                  <div className="space-y-3">
                    {allOrders.slice(0, 5).map((order) => (
                      <div 
                        key={order.id} 
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSearchId(order.numero_os)}
                      >
                        <div className="flex items-center gap-4">
                          {getStatusIcon(order.status)}
                          <div>
                            <p className="font-semibold text-brand-blue">{order.numero_os}</p>
                            <p className="text-sm text-gray-600">{order.clientes?.nome}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(order.status)}
                          <p className="font-semibold">R$ {order.valor_total.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhuma ordem de serviço encontrada</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default AcompanharPedido;
