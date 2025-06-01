import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import BuscaCliente from '@/components/BuscaCliente';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ClipboardList, Plus, Search, Edit, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Cliente {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

interface OrdemServico {
  id: string;
  cliente: string;
  entrada: string;
  saida: string;
  observacoes: string;
  pedido: {
    corte: string;
    estampa: string;
    costura: string;
  };
  tipo: {
    manga: 'OR' | 'normal';
    barra: 'silk' | 'sub';
    gola: 'redondo' | 'polo';
  };
  qualidade: 'M' | 'G' | 'P';
  precoUnitario: number;
  tipoTecido: string;
  apresentar: boolean;
  tamanho: 'M' | 'G' | 'P';
  quantidade: number;
  acabamento: string;
  valor: number;
  status: 'pendente' | 'em-andamento' | 'concluido' | 'entregue';
  dataCriacao: string;
}

const OrdemServico = () => {
  const [ordens, setOrdens] = useState<OrdemServico[]>([{
    id: 'OS-001',
    cliente: 'João Silva',
    entrada: '01/04/2024',
    saida: '08/04/2024',
    observacoes: 'Cliente quer logo na frente',
    pedido: {
      corte: 'Camisa',
      estampa: 'Ex: Bordado',
      costura: 'Costura padrão'
    },
    tipo: {
      manga: 'OR',
      barra: 'silk',
      gola: 'polo'
    },
    qualidade: 'M',
    precoUnitario: 35.00,
    tipoTecido: 'Algodão',
    apresentar: true,
    tamanho: 'M',
    quantidade: 10,
    acabamento: 'Silk',
    valor: 350.00,
    status: 'em-andamento',
    dataCriacao: '01/04/2024'
  }]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [buscaOrdens, setBuscaOrdens] = useState('');
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrdemServico | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    cliente: '',
    entrada: '',
    saida: '',
    observacoes: '',
    pedido: {
      corte: '',
      estampa: '',
      costura: ''
    },
    tipo: {
      manga: 'normal' as 'OR' | 'normal',
      barra: 'silk' as 'silk' | 'sub',
      gola: 'redondo' as 'redondo' | 'polo'
    },
    qualidade: 'M' as 'M' | 'G' | 'P',
    precoUnitario: 0,
    tipoTecido: '',
    apresentar: false,
    tamanho: 'M' as 'M' | 'G' | 'P',
    quantidade: 1,
    acabamento: ''
  });

  const handleClienteSelecionado = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setFormData(prev => ({
      ...prev,
      cliente: cliente.nome
    }));
    toast({
      title: "Cliente selecionado",
      description: `${cliente.nome} foi adicionado à ordem de serviço.`,
    });
  };

  const handleNovoCliente = () => {
    toast({
      title: "Função em desenvolvimento",
      description: "Redirecionamento para cadastro de cliente será implementado.",
    });
  };

  const ordensFiltradasPorBusca = ordens.filter(ordem => 
    ordem.id.toLowerCase().includes(buscaOrdens.toLowerCase()) ||
    ordem.cliente.toLowerCase().includes(buscaOrdens.toLowerCase()) ||
    ordem.status.toLowerCase().includes(buscaOrdens.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valor = formData.precoUnitario * formData.quantidade;
    if (editingId) {
      setOrdens(prev => prev.map(ordem => ordem.id === editingId ? {
        ...ordem,
        ...formData,
        valor
      } : ordem));
      toast({
        title: "Ordem atualizada",
        description: `Ordem ${editingId} foi atualizada com sucesso.`,
      });
    } else {
      const novaOrdem: OrdemServico = {
        id: `OS-${String(ordens.length + 1).padStart(3, '0')}`,
        ...formData,
        valor,
        status: 'pendente',
        dataCriacao: new Date().toLocaleDateString('pt-BR')
      };
      setOrdens(prev => [...prev, novaOrdem]);
      toast({
        title: "Nova ordem criada",
        description: `Ordem ${novaOrdem.id} foi criada com sucesso.`,
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      cliente: '',
      entrada: '',
      saida: '',
      observacoes: '',
      pedido: {
        corte: '',
        estampa: '',
        costura: ''
      },
      tipo: {
        manga: 'normal',
        barra: 'silk',
        gola: 'redondo'
      },
      qualidade: 'M',
      precoUnitario: 0,
      tipoTecido: '',
      apresentar: false,
      tamanho: 'M',
      quantidade: 1,
      acabamento: ''
    });
    setShowForm(false);
    setEditingId(null);
    setClienteSelecionado(null);
  };

  const handleView = (ordem: OrdemServico) => {
    setSelectedOrder(ordem);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (ordem: OrdemServico) => {
    setSelectedOrder(ordem);
    setFormData({
      cliente: ordem.cliente,
      entrada: ordem.entrada,
      saida: ordem.saida,
      observacoes: ordem.observacoes,
      pedido: ordem.pedido,
      tipo: ordem.tipo,
      qualidade: ordem.qualidade,
      precoUnitario: ordem.precoUnitario,
      tipoTecido: ordem.tipoTecido,
      apresentar: ordem.apresentar,
      tamanho: ordem.tamanho,
      quantidade: ordem.quantidade,
      acabamento: ordem.acabamento
    });
    setEditingId(ordem.id);
    setShowForm(true);
  };

  const handleStatusChange = (ordemId: string, newStatus: OrdemServico['status']) => {
    setOrdens(prev => prev.map(ordem => 
      ordem.id === ordemId ? { ...ordem, status: newStatus } : ordem
    ));
    toast({
      title: "Status atualizado",
      description: `Status da ordem ${ordemId} foi alterado para ${newStatus}.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'em-andamento':
        return 'bg-blue-100 text-blue-800';
      case 'concluido':
        return 'bg-green-100 text-green-800';
      case 'entregue':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <ClipboardList className="h-8 w-8 text-brand-blue" />
              <h1 className="text-3xl font-bold text-gray-900">Ordens de Serviço</h1>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-brand-blue hover:bg-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Nova OS
            </Button>
          </div>

          {showForm && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>
                  {editingId ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Dados Básicos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="cliente">Cliente</Label>
                      <BuscaCliente
                        onClienteSelecionado={handleClienteSelecionado}
                        onNovoCliente={handleNovoCliente}
                      />
                      {clienteSelecionado && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                          <strong>Cliente selecionado:</strong> {clienteSelecionado.nome}
                          {clienteSelecionado.telefone && (
                            <span className="ml-2">• {clienteSelecionado.telefone}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="entrada">Data Entrada</Label>
                      <Input
                        id="entrada"
                        type="date"
                        value={formData.entrada}
                        onChange={e => setFormData({ ...formData, entrada: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="saida">Data Saída</Label>
                      <Input
                        id="saida"
                        type="date"
                        value={formData.saida}
                        onChange={e => setFormData({ ...formData, saida: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Pedido */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Responsavel do Pedido</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="corte">Corte</Label>
                        <Input id="corte" value={formData.pedido.corte} onChange={e => setFormData({
                      ...formData,
                      pedido: {
                        ...formData.pedido,
                        corte: e.target.value
                      }
                    })} />
                      </div>
                      <div>
                        <Label htmlFor="estampa">Estampa Ex: Bordado</Label>
                        <Input id="estampa" value={formData.pedido.estampa} onChange={e => setFormData({
                      ...formData,
                      pedido: {
                        ...formData.pedido,
                        estampa: e.target.value
                      }
                    })} />
                      </div>
                      <div>
                        <Label htmlFor="costura">Costura</Label>
                        <Input id="costura" value={formData.pedido.costura} onChange={e => setFormData({
                      ...formData,
                      pedido: {
                        ...formData.pedido,
                        costura: e.target.value
                      }
                    })} />
                      </div>
                    </div>
                  </div>

                  {/* Tipos */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Tipos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="manga">Tipo de Manga</Label>
                        <select id="manga" className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md" value={formData.tipo.manga} onChange={e => setFormData({
                      ...formData,
                      tipo: {
                        ...formData.tipo,
                        manga: e.target.value as 'OR' | 'normal'
                      }
                    })}>
                          <option value="normal">Normal</option>
                          <option value="OR">OR</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="barra">Tipo de Barra</Label>
                        <select id="barra" className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md" value={formData.tipo.barra} onChange={e => setFormData({
                      ...formData,
                      tipo: {
                        ...formData.tipo,
                        barra: e.target.value as 'silk' | 'sub'
                      }
                    })}>
                          <option value="silk">Silk</option>
                          <option value="sub">Sub</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="gola">Tipo de Gola</Label>
                        <select id="gola" className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md" value={formData.tipo.gola} onChange={e => setFormData({
                      ...formData,
                      tipo: {
                        ...formData.tipo,
                        gola: e.target.value as 'redondo' | 'polo'
                      }
                    })}>
                          <option value="redondo">Redondo</option>
                          <option value="polo">Polo</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Detalhes do Produto */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="tipoTecido">Tipo de Tecido</Label>
                      <Input id="tipoTecido" value={formData.tipoTecido} onChange={e => setFormData({
                    ...formData,
                    tipoTecido: e.target.value
                  })} />
                    </div>
                    <div>
                      <Label htmlFor="tamanho">Tamanho</Label>
                      <select id="tamanho" className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md" value={formData.tamanho} onChange={e => setFormData({
                    ...formData,
                    tamanho: e.target.value as 'M' | 'G' | 'P'
                  })}>
                        <option value="P">P</option>
                        <option value="M">M</option>
                        <option value="G">G</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="quantidade">Quantidade</Label>
                      <Input id="quantidade" type="number" min="1" value={formData.quantidade} onChange={e => setFormData({
                    ...formData,
                    quantidade: parseInt(e.target.value)
                  })} />
                    </div>
                    <div>
                      <Label htmlFor="precoUnitario">Preço Unitário</Label>
                      <Input id="precoUnitario" type="number" step="0.01" value={formData.precoUnitario} onChange={e => setFormData({
                    ...formData,
                    precoUnitario: parseFloat(e.target.value)
                  })} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="acabamento">Acabamento</Label>
                      <Input id="acabamento" value={formData.acabamento} onChange={e => setFormData({
                    ...formData,
                    acabamento: e.target.value
                  })} />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <input type="checkbox" id="apresentar" checked={formData.apresentar} onChange={e => setFormData({
                    ...formData,
                    apresentar: e.target.checked
                  })} className="h-4 w-4" />
                      <Label htmlFor="apresentar">Apresentar ao Cliente</Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea id="observacoes" value={formData.observacoes} onChange={e => setFormData({
                  ...formData,
                  observacoes: e.target.value
                })} rows={3} />
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-lg font-semibold">
                      Valor Total: R$ {(formData.precoUnitario * formData.quantidade).toFixed(2)}
                    </span>
                    <div className="flex space-x-2">
                      <Button type="submit" className="bg-green-500 hover:bg-green-600">
                        {editingId ? 'Atualizar' : 'Criar OS'}
                      </Button>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Lista de Ordens de Serviço</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por OS, cliente ou status..."
                    className="pl-10 w-80"
                    value={buscaOrdens}
                    onChange={(e) => setBuscaOrdens(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">OS</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Cliente</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Entrada</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Saída</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Valor</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordensFiltradasPorBusca.map(ordem => (
                      <tr key={ordem.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-brand-blue">{ordem.id}</td>
                        <td className="py-3 px-4">{ordem.cliente}</td>
                        <td className="py-3 px-4">{ordem.entrada}</td>
                        <td className="py-3 px-4">{ordem.saida}</td>
                        <td className="py-3 px-4">
                          <select 
                            value={ordem.status} 
                            onChange={(e) => handleStatusChange(ordem.id, e.target.value as OrdemServico['status'])}
                            className={`px-2 py-1 rounded text-xs font-medium border-0 ${getStatusColor(ordem.status)}`}
                          >
                            <option value="pendente">Pendente</option>
                            <option value="em-andamento">Em Andamento</option>
                            <option value="concluido">Concluído</option>
                            <option value="entregue">Entregue</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 font-medium">R$ {ordem.valor.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleView(ordem)}
                              className="hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEdit(ordem)}
                              className="hover:bg-green-50 hover:text-green-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {ordensFiltradasPorBusca.length === 0 && buscaOrdens && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma ordem encontrada para "{buscaOrdens}"
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Dialog para Visualizar */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Ordem de Serviço - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Informações do Cliente</h3>
                  <p><strong>Nome:</strong> {selectedOrder.cliente}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Detalhes da Ordem</h3>
                  <p><strong>Data Entrada:</strong> {selectedOrder.entrada}</p>
                  <p><strong>Data Saída:</strong> {selectedOrder.saida}</p>
                  <p><strong>Status:</strong> 
                    <Badge className={`ml-2 ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusText(selectedOrder.status)}
                    </Badge>
                  </p>
                  <p><strong>Valor Total:</strong> R$ {selectedOrder.valor.toFixed(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Especificações do Produto</h3>
                  <p><strong>Tipo de Tecido:</strong> {selectedOrder.tipoTecido}</p>
                  <p><strong>Tamanho:</strong> {selectedOrder.tamanho}</p>
                  <p><strong>Quantidade:</strong> {selectedOrder.quantidade}</p>
                  <p><strong>Acabamento:</strong> {selectedOrder.acabamento}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Detalhes de Produção</h3>
                  <p><strong>Corte:</strong> {selectedOrder.pedido.corte}</p>
                  <p><strong>Estampa:</strong> {selectedOrder.pedido.estampa}</p>
                  <p><strong>Costura:</strong> {selectedOrder.pedido.costura}</p>
                </div>
              </div>

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
    </div>
  );
};

export default OrdemServico;
