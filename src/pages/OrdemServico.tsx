import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import BuscaCliente from '@/components/BuscaCliente';
import { useConfiguracoes } from '@/hooks/useConfiguracoes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ClipboardList, Plus, Search, Edit, Eye, X, User, Phone, Mail, MapPin, Calendar, FileText, CreditCard, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Cliente {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  tipo?: 'fisica' | 'juridica';
  cpf?: string;
  cnpj?: string;
  rg?: string;
  inscricao_estadual?: string;
  data_nascimento?: string;
  bairro?: string;
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
    manga: string;
    barra: string;
    gola: string;
  };
  manga: string;
  barra: string;
  gola: string;
  qualidade: string;
  precoUnitario: number;
  tipoTecido: string;
  apresentar: boolean;
  tamanho: string;
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
    manga: 'OR',
    barra: 'silk',
    gola: 'polo',
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
  const { configs, loading: loadingConfigs, reload: reloadConfigs } = useConfiguracoes();
  
  // Recarregar configurações quando o componente for montado
  useEffect(() => {
    reloadConfigs();
  }, [reloadConfigs]);
  const initialFormData = {
    cliente: '',
    entrada: new Date().toISOString().split('T')[0],
    saida: '',
    observacoes: '',
    pedido: {
      corte: '',
      estampa: '',
      costura: ''
    },
    tipo: {
      manga: '',
      barra: '',
      gola: ''
    },
    manga: '',
    barra: '',
    gola: '',
    qualidade: '',
    precoUnitario: 0,
    tipoTecido: '',
    apresentar: false,
    tamanho: '',
    quantidade: 1,
    acabamento: '',
    valor: 0
  };

  const [formData, setFormData] = useState<Omit<OrdemServico, 'id' | 'dataCriacao' | 'status'>>(initialFormData);
  const [selectedOrder, setSelectedOrder] = useState<OrdemServico | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

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
      setIsEditDialogOpen(false); // Fechar o diálogo após salvar
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
      ...initialFormData,
      entrada: new Date().toISOString().split('T')[0]
    });
    setShowForm(false);
    setEditingId(null);
    setClienteSelecionado(null);
    setSelectedOrder(null);
  };

  const handleView = async (ordem: OrdemServico) => {
    try {
      // Buscar os dados completos do cliente se não estiverem disponíveis
      if (!clienteSelecionado || clienteSelecionado.nome !== ordem.cliente) {
        const { data: cliente } = await supabase
          .from('clientes')
          .select('*')
          .eq('nome', ordem.cliente)
          .single();
        
        if (cliente) {
          setClienteSelecionado(cliente);
        }
      }
      
      setSelectedOrder(ordem);
      setIsViewDialogOpen(true);
    } catch (error) {
      console.error('Erro ao buscar dados do cliente:', error);
      // Mesmo em caso de erro, ainda mostra o pedido com os dados básicos
      setSelectedOrder(ordem);
      setIsViewDialogOpen(true);
    }
  };

  const handleEdit = (ordem: OrdemServico) => {
    setFormData({
      ...initialFormData,
      cliente: ordem.cliente,
      entrada: ordem.entrada,
      saida: ordem.saida,
      observacoes: ordem.observacoes,
      pedido: {
        corte: ordem.pedido.corte,
        estampa: ordem.pedido.estampa,
        costura: ordem.pedido.costura
      },
      tipo: {
        manga: ordem.tipo.manga,
        barra: ordem.tipo.barra,
        gola: ordem.tipo.gola
      },
      manga: ordem.manga,
      barra: ordem.barra,
      gola: ordem.gola,
      qualidade: ordem.qualidade,
      precoUnitario: ordem.precoUnitario,
      tipoTecido: ordem.tipoTecido,
      apresentar: ordem.apresentar,
      tamanho: ordem.tamanho,
      quantidade: ordem.quantidade,
      acabamento: ordem.acabamento,
      valor: ordem.valor
    });
    setEditingId(ordem.id);
    setIsEditDialogOpen(true);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 overflow-auto">
          {/* Cabeçalho */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-neon-primary/30">
                <ClipboardList className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Ordens de Serviço
                </h1>
                <p className="text-sm text-gray-500">Gerencie as ordens de serviço da sua loja</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowForm(true)} 
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white 
                        shadow-neon-primary/30 hover:shadow-neon-primary/50 transition-all duration-300
                        group flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg
                        fixed bottom-4 right-4 z-50"
            >
              <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Nova OS</span>
            </Button>
          </div>

          {showForm && (
            <Card className="animate-fade-in bg-white/70 backdrop-blur-sm border border-white/30 shadow-lg">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    {editingId ? '✏️ Editar Ordem de Serviço' : '✨ Nova Ordem de Serviço'}
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="text-gray-700 hover:bg-gray-100 rounded-full h-8 w-8 p-0 border border-gray-300 shadow-sm"
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Dados Básicos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="cliente" className="text-sm font-medium text-gray-700">Cliente</Label>
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
                        className="bg-white border-gray-300 text-gray-900"
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
                        className="bg-white border-gray-300 text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Pedido */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Responsavel do Pedido</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="corte">Corte</Label>
                        <Input 
                          id="corte" 
                          value={formData.pedido.corte} 
                          onChange={e => setFormData({
                            ...formData,
                            pedido: {
                              ...formData.pedido,
                              corte: e.target.value
                            }
                          })}
                          className="bg-white border-gray-300 text-gray-900"
                        />
                      </div>
                      <div>
                        <Label htmlFor="estampa">Estampa Ex: Bordado</Label>
                        <Input 
                          id="estampa" 
                          value={formData.pedido.estampa} 
                          onChange={e => setFormData({
                            ...formData,
                            pedido: {
                              ...formData.pedido,
                              estampa: e.target.value
                            }
                          })}
                          className="bg-white border-gray-300 text-gray-900"
                        />
                      </div>
                      <div>
                        <Label htmlFor="costura">Costura</Label>
                        <Input 
                          id="costura" 
                          value={formData.pedido.costura} 
                          onChange={e => setFormData({
                            ...formData,
                            pedido: {
                              ...formData.pedido,
                              costura: e.target.value
                            }
                          })}
                          className="bg-white border-gray-300 text-gray-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tipos */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Tipos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="manga">Tipo de Manga</Label>
                        <select
                          id="manga"
                          value={formData.tipo.manga}
                          onChange={e => setFormData({
                            ...formData,
                            tipo: {
                              ...formData.tipo,
                              manga: e.target.value
                            }
                          })}
                          className="w-full h-10 px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Selecione...</option>
                          {configs.tiposManga?.map((tipo) => (
                            <option key={tipo.id} value={tipo.value}>
                              {tipo.value}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="barra">Tipo de Barra</Label>
                        <select
                          id="barra"
                          value={formData.tipo.barra}
                          onChange={e => setFormData({
                            ...formData,
                            tipo: {
                              ...formData.tipo,
                              barra: e.target.value
                            }
                          })}
                          className="w-full h-10 px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Selecione...</option>
                          {configs.tiposBarra?.map((tipo) => (
                            <option key={tipo.id} value={tipo.value}>
                              {tipo.value}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="gola">Tipo de Gola</Label>
                        <select
                          id="gola"
                          value={formData.tipo.gola}
                          onChange={e => setFormData({
                            ...formData,
                            tipo: {
                              ...formData.tipo,
                              gola: e.target.value
                            }
                          })}
                          className="w-full h-10 px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Selecione...</option>
                          {configs.tiposGola?.map((tipo) => (
                            <option key={tipo.id} value={tipo.value}>
                              {tipo.value}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Detalhes do Produto */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="tipoTecido">Tipo de Tecido</Label>
                      <select
                        id="tipoTecido"
                        value={formData.tipoTecido}
                        onChange={e => setFormData({
                          ...formData,
                          tipoTecido: e.target.value
                        })}
                        className="w-full h-10 px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Selecione...</option>
                        {configs.tiposTecido?.map((tipo) => (
                          <option key={tipo.id} value={tipo.value}>
                            {tipo.value}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="tamanho">Tamanho</Label>
                      <select
                        id="tamanho"
                        value={formData.tamanho}
                        onChange={e => setFormData({
                          ...formData,
                          tamanho: e.target.value
                        })}
                        className="w-full h-10 px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Selecione...</option>
                        {configs.tamanhos?.map((tamanho) => (
                          <option key={tamanho.id} value={tamanho.value}>
                            {tamanho.value}
                          </option>
                        ))}
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
                      <Button 
                        type="submit" 
                        className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all"
                      >
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

          <Card className="bg-white/70 backdrop-blur-sm border border-white/30 shadow-lg overflow-hidden">
            <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-800">Lista de Ordens</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Visualize e gerencie todas as ordens de serviço</p>
                </div>
                <div className="relative w-full sm:w-auto">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Buscar ordens..."
                    className="pl-10 w-full sm:w-72 bg-white border border-gray-300 text-gray-900 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={buscaOrdens}
                    onChange={(e) => setBuscaOrdens(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/50 backdrop-blur-sm">
                    <tr>
                      <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Entrada/Saída
                      </th>
                      <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Valor
                      </th>
                      <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider pr-8">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/30 divide-y divide-gray-100">
                    {ordensFiltradasPorBusca.map((ordem) => (
                      <tr key={ordem.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 font-mono">{ordem.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{ordem.cliente}</div>
                          <div className="text-xs text-gray-500">{ordem.pedido.corte}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{ordem.entrada}</div>
                          <div className="text-xs text-gray-500">até {ordem.saida}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(ordem.valor || 0)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ordem.status)}`}>
                              {getStatusText(ordem.status)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleView(ordem)}
                              className="text-gray-600 hover:text-blue-600 transition-colors p-1.5 rounded-full bg-gray-100 hover:bg-blue-100"
                              title="Visualizar"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(ordem)}
                              className="text-gray-600 hover:text-purple-600 transition-colors p-1.5 rounded-full bg-gray-100 hover:bg-purple-100"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {ordensFiltradasPorBusca.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    {buscaOrdens 
                      ? `Nenhuma ordem encontrada para "${buscaOrdens}"`
                      : 'Nenhuma ordem de serviço cadastrada.'}
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
              <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-3 text-lg">Informações do Cliente</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-blue-500" />
                        <span><strong>Nome:</strong> {selectedOrder.cliente}</span>
                      </p>
                      {clienteSelecionado?.tipo && (
                        <p className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-blue-500" />
                          <span><strong>Tipo:</strong> {clienteSelecionado.tipo === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}</span>
                        </p>
                      )}
                      {/* CPF ou CNPJ */}
                      {clienteSelecionado?.tipo === 'fisica' && clienteSelecionado?.cpf && (
                        <p className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-blue-500" />
                          <span><strong>CPF:</strong> {clienteSelecionado.cpf}</span>
                        </p>
                      )}
                      {clienteSelecionado?.tipo === 'juridica' && clienteSelecionado?.cnpj && (
                        <p className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-blue-500" />
                          <span><strong>CNPJ:</strong> {clienteSelecionado.cnpj}</span>
                        </p>
                      )}
                      {/* RG ou Inscrição Estadual */}
                      {clienteSelecionado?.tipo === 'fisica' && clienteSelecionado?.rg && (
                        <p className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-blue-500" />
                          <span><strong>RG:</strong> {clienteSelecionado.rg}</span>
                        </p>
                      )}
                      {clienteSelecionado?.tipo === 'juridica' && clienteSelecionado?.inscricao_estadual && (
                        <p className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-blue-500" />
                          <span><strong>Inscrição Estadual:</strong> {clienteSelecionado.inscricao_estadual}</span>
                        </p>
                      )}
                      {/* Data de nascimento (pessoa física) */}
                      {clienteSelecionado?.tipo === 'fisica' && clienteSelecionado?.data_nascimento && (
                        <p className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                          <span><strong>Data de Nascimento:</strong> {clienteSelecionado.data_nascimento}</span>
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      {clienteSelecionado?.telefone && (
                        <p className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-blue-500" />
                          <span><strong>Telefone:</strong> {clienteSelecionado.telefone}</span>
                        </p>
                      )}
                      {clienteSelecionado?.email && (
                        <p className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-blue-500" />
                          <span><strong>E-mail:</strong> {clienteSelecionado.email}</span>
                        </p>
                      )}
                      {(clienteSelecionado?.endereco || clienteSelecionado?.cidade || clienteSelecionado?.estado || clienteSelecionado?.cep) && (
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p><strong>Endereço:</strong></p>
                            {clienteSelecionado.endereco && <p>{clienteSelecionado.endereco}</p>}
                            {clienteSelecionado.bairro && <p><strong>Bairro:</strong> {clienteSelecionado.bairro}</p>}
                            <div className="flex flex-wrap gap-2 mt-1">
                              {clienteSelecionado.cidade && <span>{clienteSelecionado.cidade}</span>}
                              {clienteSelecionado.estado && <span>{clienteSelecionado.estado}</span>}
                              {clienteSelecionado.cep && <span>CEP: {clienteSelecionado.cep}</span>}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
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

      {/* Dialog para Editar */}
      <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => {
        if (!isOpen) {
          resetForm();
        }
        setIsEditDialogOpen(isOpen);
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Ordem de Serviço {editingId && `- ${editingId}`}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            handleSubmit(e);
          }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-cliente">Cliente</Label>
                  <Input 
                    id="edit-cliente"
                    value={formData.cliente} 
                    onChange={e => setFormData({ ...formData, cliente: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-entrada">Data Entrada</Label>
                  <Input 
                    id="edit-entrada"
                    type="date" 
                    value={formData.entrada} 
                    onChange={e => setFormData({ ...formData, entrada: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-saida">Data Saída</Label>
                  <Input 
                    id="edit-saida"
                    type="date" 
                    value={formData.saida} 
                    onChange={e => setFormData({ ...formData, saida: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-quantidade">Quantidade</Label>
                  <Input 
                    id="edit-quantidade"
                    type="number" 
                    value={formData.quantidade} 
                    onChange={e => setFormData({ ...formData, quantidade: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-precoUnitario">Preço Unitário</Label>
                  <Input 
                    id="edit-precoUnitario"
                    type="number" 
                    step="0.01"
                    value={formData.precoUnitario} 
                    onChange={e => setFormData({ ...formData, precoUnitario: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-valor">Valor Total</Label>
                  <Input 
                    id="edit-valor"
                    type="number" 
                    step="0.01"
                    value={formData.valor} 
                    onChange={e => setFormData({ ...formData, valor: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-pedido-corte">Corte</Label>
                  <Input 
                    id="edit-pedido-corte"
                    value={formData.pedido.corte} 
                    onChange={e => setFormData({ ...formData, pedido: { ...formData.pedido, corte: e.target.value } })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-pedido-estampa">Estampa</Label>
                  <Input 
                    id="edit-pedido-estampa"
                    value={formData.pedido.estampa} 
                    onChange={e => setFormData({ ...formData, pedido: { ...formData.pedido, estampa: e.target.value } })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-pedido-costura">Costura</Label>
                  <Input 
                    id="edit-pedido-costura"
                    value={formData.pedido.costura} 
                    onChange={e => setFormData({ ...formData, pedido: { ...formData.pedido, costura: e.target.value } })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-tipo-manga">Tipo Manga</Label>
                  <Input 
                    id="edit-tipo-manga"
                    value={formData.tipo.manga} 
                    onChange={e => setFormData({ ...formData, tipo: { ...formData.tipo, manga: e.target.value } })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-tipo-barra">Tipo Barra</Label>
                  <Input 
                    id="edit-tipo-barra"
                    value={formData.tipo.barra} 
                    onChange={e => setFormData({ ...formData, tipo: { ...formData.tipo, barra: e.target.value } })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-tipo-gola">Tipo Gola</Label>
                  <Input 
                    id="edit-tipo-gola"
                    value={formData.tipo.gola} 
                    onChange={e => setFormData({ ...formData, tipo: { ...formData.tipo, gola: e.target.value } })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-manga">Manga</Label>
                  <Input 
                    id="edit-manga"
                    value={formData.manga} 
                    onChange={e => setFormData({ ...formData, manga: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-barra">Barra</Label>
                  <Input 
                    id="edit-barra"
                    value={formData.barra} 
                    onChange={e => setFormData({ ...formData, barra: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-gola">Gola</Label>
                  <Input 
                    id="edit-gola"
                    value={formData.gola} 
                    onChange={e => setFormData({ ...formData, gola: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-tipoTecido">Tipo de Tecido</Label>
                  <Input 
                    id="edit-tipoTecido"
                    value={formData.tipoTecido} 
                    onChange={e => setFormData({ ...formData, tipoTecido: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-qualidade">Qualidade</Label>
                  <Input 
                    id="edit-qualidade"
                    value={formData.qualidade} 
                    onChange={e => setFormData({ ...formData, qualidade: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-tamanho">Tamanho</Label>
                  <Input 
                    id="edit-tamanho"
                    value={formData.tamanho} 
                    onChange={e => setFormData({ ...formData, tamanho: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-acabamento">Acabamento</Label>
                  <Input 
                    id="edit-acabamento"
                    value={formData.acabamento} 
                    onChange={e => setFormData({ ...formData, acabamento: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="edit-apresentar"
                    checked={formData.apresentar}
                    onChange={(e) => setFormData({ ...formData, apresentar: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <Label htmlFor="edit-apresentar">Apresentar ao cliente</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-observacoes">Observações</Label>
                <Textarea 
                  id="edit-observacoes"
                  value={formData.observacoes}
                  onChange={e => setFormData({ ...formData, observacoes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setIsEditDialogOpen(false);
                  }}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 shadow-sm"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-green-500 hover:bg-green-600">
                  Salvar Alterações
                </Button>
              </div>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdemServico;
