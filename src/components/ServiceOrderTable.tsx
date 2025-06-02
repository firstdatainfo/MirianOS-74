import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, Edit, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

interface ServiceOrder {
  id: string;
  cliente: string;
  servico: string;
  status: 'pendente' | 'em-andamento' | 'concluido' | 'entregue';
  valor: string;
  data: string;
  entrada: string;
  saida: string;
  observacoes: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  detalhes: {
    tipoTecido: string;
    tamanho: string;
    quantidade: number;
    acabamento: string;
    corte: string;
    estampa: string;
    costura: string;
  };
}

const ServiceOrderTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const navigate = useNavigate();

  const orders: ServiceOrder[] = [
    {
      id: 'OS-001',
      cliente: 'João Silva',
      servico: 'Camisa Polo',
      status: 'em-andamento',
      valor: 'R$ 35,00',
      data: '01/04/2024',
      entrada: '01/04/2024',
      saida: '08/04/2024',
      observacoes: 'Cliente quer logo na frente',
      telefone: '(11) 99999-9999',
      email: 'joao@email.com',
      endereco: 'Rua A, 123 - Centro',
      detalhes: {
        tipoTecido: 'Algodão',
        tamanho: 'M',
        quantidade: 1,
        acabamento: 'Silk',
        corte: 'Camisa',
        estampa: 'Bordado',
        costura: 'Costura padrão'
      }
    },
    {
      id: 'OS-002',
      cliente: 'Maria Santos',
      servico: 'Vestido Bordado',
      status: 'pendente',
      valor: 'R$ 85,00',
      data: '02/04/2024',
      entrada: '02/04/2024',
      saida: '15/04/2024',
      observacoes: 'Bordado delicado nas mangas',
      telefone: '(11) 88888-8888',
      email: 'maria@email.com',
      endereco: 'Rua B, 456 - Vila Nova',
      detalhes: {
        tipoTecido: 'Seda',
        tamanho: 'G',
        quantidade: 1,
        acabamento: 'Bordado',
        corte: 'Vestido',
        estampa: 'Bordado floral',
        costura: 'Costura especial'
      }
    },
    {
      id: 'OS-003',
      cliente: 'Pedro Costa',
      servico: 'Estampa Personalizada',
      status: 'concluido',
      valor: 'R$ 45,00',
      data: '03/04/2024',
      entrada: '03/04/2024',
      saida: '10/04/2024',
      observacoes: 'Estampa com logo da empresa',
      telefone: '(11) 77777-7777',
      email: 'pedro@email.com',
      endereco: 'Rua C, 789 - Jardins',
      detalhes: {
        tipoTecido: 'Poliéster',
        tamanho: 'P',
        quantidade: 5,
        acabamento: 'Digital',
        corte: 'Camiseta',
        estampa: 'Logo personalizado',
        costura: 'Overlock'
      }
    },
    {
      id: 'OS-004',
      cliente: 'Ana Oliveira',
      servico: 'Uniforme Escolar',
      status: 'entregue',
      valor: 'R$ 120,00',
      data: '04/04/2024',
      entrada: '04/04/2024',
      saida: '12/04/2024',
      observacoes: 'Kit completo com blazer e calça',
      telefone: '(11) 66666-6666',
      email: 'ana@email.com',
      endereco: 'Rua D, 321 - Centro',
      detalhes: {
        tipoTecido: 'Gabardine',
        tamanho: 'M',
        quantidade: 2,
        acabamento: 'Tradicional',
        corte: 'Uniforme',
        estampa: 'Bordado institucional',
        costura: 'Reforçada'
      }
    },
    {
      id: 'OS-005',
      cliente: 'Carlos Mendes',
      servico: 'Jaqueta Personalizada',
      status: 'em-andamento',
      valor: 'R$ 150,00',
      data: '05/04/2024',
      entrada: '05/04/2024',
      saida: '20/04/2024',
      observacoes: 'Jaqueta de couro com patches',
      telefone: '(11) 55555-5555',
      email: 'carlos@email.com',
      endereco: 'Rua E, 654 - Vila Madalena',
      detalhes: {
        tipoTecido: 'Couro sintético',
        tamanho: 'G',
        quantidade: 1,
        acabamento: 'Patches aplicados',
        corte: 'Jaqueta',
        estampa: 'Patches personalizados',
        costura: 'Dupla costura'
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-gradient-warning text-white shadow-neon-yellow/30 animate-pulse-slow';
      case 'em-andamento': return 'bg-gradient-primary text-white shadow-neon-blue/30 animate-pulse-slow';
      case 'concluido': return 'bg-gradient-success text-white shadow-neon-green/30 animate-pulse-slow';
      case 'entregue': return 'bg-gradient-secondary text-white shadow-neon-purple/30';
      default: return 'bg-gradient-glass text-white backdrop-blur-sm';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'em-andamento': return 'Em Andamento';
      case 'concluido': return 'Concluído';
      case 'entregue': return 'Entregue';
      default: return status;
    }
  };

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.servico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (order: ServiceOrder) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (order: ServiceOrder) => {
    setSelectedOrder(order);
    setIsEditDialogOpen(true);
  };

  const handleNewOrderClick = () => {
    navigate('/ordem-servico');
  };

  return (
    <>
      <Card className="animate-fade-in bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-lg font-semibold">Ordens de Serviço Recentes</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar OS, cliente, serviço..."
                  className="pl-10 w-full sm:w-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleNewOrderClick}
                className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-neon-primary/30 hover:shadow-neon-primary/50
                  transition-all duration-300 w-full sm:w-auto animate-glow bg-200% bg-fixed
                  hover:bg-right"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova OS
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium bg-gradient-primary bg-clip-text text-transparent">ID</th>
                  <th className="text-left py-3 px-4 font-medium bg-gradient-primary bg-clip-text text-transparent">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium bg-gradient-primary bg-clip-text text-transparent">Serviço</th>
                  <th className="text-left py-3 px-4 font-medium bg-gradient-primary bg-clip-text text-transparent">Status</th>
                  <th className="text-left py-3 px-4 font-medium bg-gradient-primary bg-clip-text text-transparent">Valor</th>
                  <th className="text-left py-3 px-4 font-medium bg-gradient-primary bg-clip-text text-transparent">Entrega</th>
                  <th className="text-left py-3 px-4 font-medium bg-gradient-primary bg-clip-text text-transparent">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gradient-glass hover:backdrop-blur-sm transition-all duration-300 group">
                    <td className="py-3 px-4 font-medium bg-gradient-primary bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">{order.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{order.cliente}</div>
                        {order.telefone && (
                          <div className="text-sm text-gray-500">{order.telefone}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{order.servico}</div>
                        <div className="text-sm text-gray-500">
                          {order.detalhes.quantidade}x - {order.detalhes.tamanho}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-medium">{order.valor}</td>
                    <td className="py-3 px-4">{order.saida}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleView(order)}
                          className="hover:bg-gradient-primary/10 hover:text-vibrant-primary transition-all duration-300 hover:scale-110"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(order)}
                          className="hover:bg-gradient-success/10 hover:text-vibrant-success transition-all duration-300 hover:scale-110"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredOrders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? `Nenhuma ordem encontrada para "${searchTerm}"` : 'Nenhuma ordem de serviço encontrada'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog para Visualizar */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Ordem de Serviço - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Informações do Cliente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Informações do Cliente</h3>
                  <p><strong>Nome:</strong> {selectedOrder.cliente}</p>
                  {selectedOrder.telefone && <p><strong>Telefone:</strong> {selectedOrder.telefone}</p>}
                  {selectedOrder.email && <p><strong>Email:</strong> {selectedOrder.email}</p>}
                  {selectedOrder.endereco && <p><strong>Endereço:</strong> {selectedOrder.endereco}</p>}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Detalhes da Ordem</h3>
                  <p><strong>Serviço:</strong> {selectedOrder.servico}</p>
                  <p><strong>Data Entrada:</strong> {selectedOrder.entrada}</p>
                  <p><strong>Data Saída:</strong> {selectedOrder.saida}</p>
                  <p><strong>Status:</strong> 
                    <Badge className={`ml-2 ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusText(selectedOrder.status)}
                    </Badge>
                  </p>
                  <p><strong>Valor Total:</strong> {selectedOrder.valor}</p>
                </div>
              </div>

              {/* Especificações do Produto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Especificações do Produto</h3>
                  <p><strong>Tipo de Tecido:</strong> {selectedOrder.detalhes.tipoTecido}</p>
                  <p><strong>Tamanho:</strong> {selectedOrder.detalhes.tamanho}</p>
                  <p><strong>Quantidade:</strong> {selectedOrder.detalhes.quantidade}</p>
                  <p><strong>Acabamento:</strong> {selectedOrder.detalhes.acabamento}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Detalhes de Produção</h3>
                  <p><strong>Corte:</strong> {selectedOrder.detalhes.corte}</p>
                  <p><strong>Estampa:</strong> {selectedOrder.detalhes.estampa}</p>
                  <p><strong>Costura:</strong> {selectedOrder.detalhes.costura}</p>
                </div>
              </div>

              {/* Observações */}
              {selectedOrder.observacoes && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Observações</h3>
                  <p className="text-gray-600">{selectedOrder.observacoes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para Editar */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Ordem de Serviço - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                  <Input defaultValue={selectedOrder.cliente} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
                  <Input defaultValue={selectedOrder.servico} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Entrada</label>
                  <Input type="date" defaultValue={selectedOrder.entrada.split('/').reverse().join('-')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Saída</label>
                  <Input type="date" defaultValue={selectedOrder.saida.split('/').reverse().join('-')} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md" defaultValue={selectedOrder.status}>
                    <option value="pendente">Pendente</option>
                    <option value="em-andamento">Em Andamento</option>
                    <option value="concluido">Concluído</option>
                    <option value="entregue">Entregue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                  <Input defaultValue={selectedOrder.valor.replace('R$ ', '')} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea 
                  className="w-full h-20 px-3 py-2 border border-input bg-background rounded-md resize-none"
                  defaultValue={selectedOrder.observacoes}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-green-500 hover:bg-green-600">
                  Salvar Alterações
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServiceOrderTable;
