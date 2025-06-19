import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import AcompanhamentoPedido from '@/components/AcompanhamentoPedido';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Package, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';
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
      case 'concluido':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'em-andamento':
        return <Clock className="h-4 w-4 text-yellow-500 animate-pulse" />;
      case 'pendente':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-300" />;
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
          <div className="flex items-center space-x-2 mb-2">
            <Package className="h-5 w-5 text-brand-blue" />
            <h1 className="text-lg font-bold text-gray-900">Acompanhar Pedido</h1>
          </div>

          <Card className="border border-gray-300 shadow-sm">
            <CardHeader className="pb-0 pt-2 px-3">
              <CardTitle className="text-sm font-medium">Buscar Ordem de Serviço</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 pb-2 px-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Digite o número da OS (ex: OS-2024-001)"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="text-xs border border-gray-300 h-7 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 h-7"
                  disabled={isLoadingOrder}
                >
                  <Search className="h-3 w-3 mr-1" />
                  {isLoadingOrder ? 'Buscando...' : 'Buscar'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {selectedOrder && (
            <div className="space-y-4">
              <Card className="shadow-sm">
                <CardHeader className="pb-1 pt-2 px-3">
                  <CardTitle className="text-sm font-medium">Detalhes do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600">OS</label>
                      <p className="text-sm font-semibold text-brand-blue">{selectedOrder.numero_os}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Cliente</label>
                      <p className="text-sm">{selectedOrder.clientes?.nome}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Descrição</label>
                      <p className="text-sm">{selectedOrder.descricao || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Valor</label>
                      <p className="text-sm font-semibold">R$ {selectedOrder.valor_total.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(selectedOrder.status)}
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                    {selectedOrder.data_prevista_entrega && (
                      <div>
                        <label className="text-xs font-medium text-gray-600">Previsão de Entrega</label>
                        <p className="text-xs">{new Date(selectedOrder.data_prevista_entrega).toLocaleDateString('pt-BR')}</p>
                      </div>
                    )}
                    {selectedOrder.data_entrega && (
                      <div>
                        <label className="text-xs font-medium text-gray-600">Data de Entrega</label>
                        <p className="text-xs">{new Date(selectedOrder.data_entrega).toLocaleDateString('pt-BR')}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <AcompanhamentoPedido ordemServico={selectedOrder} />
            </div>
          )}

          {searchAttempted && !selectedOrder && !isLoadingOrder && searchId && (
            <p className="text-red-500 mt-2 mb-6 font-medium">Nenhuma ordem de serviço encontrada com o número: {searchId}</p>
          )}

          {!searchId && (
            <Card className="shadow-sm">
              <CardHeader className="pb-1 pt-2 px-3">
                <CardTitle className="text-sm font-medium">Ordens de Serviço Recentes</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-3">
                {isLoadingAllOrders ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : allOrders && allOrders.length > 0 ? (
                  <div className="space-y-3">
                    {allOrders.slice(0, 5).map((order) => (
                      <div 
                        key={order.id} 
                        className="flex items-center justify-between py-2 px-2 border rounded-lg hover:bg-gray-50 cursor-pointer mb-1"
                        onClick={() => setSearchId(order.numero_os)}
                      >
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <div>
                            <p className="text-xs font-semibold text-brand-blue">{order.numero_os}</p>
                            <p className="text-xs text-gray-600">{order.clientes?.nome}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(order.status)}
                          <p className="text-xs font-semibold">R$ {order.valor_total.toFixed(2)}</p>
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
