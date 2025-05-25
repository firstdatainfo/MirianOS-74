
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Plus, Search, Edit, Eye } from 'lucide-react';

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
  const [ordens, setOrdens] = useState<OrdemServico[]>([
    {
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
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const valor = formData.precoUnitario * formData.quantidade;
    
    if (editingId) {
      setOrdens(prev => prev.map(ordem => 
        ordem.id === editingId 
          ? { ...ordem, ...formData, valor }
          : ordem
      ));
    } else {
      const novaOrdem: OrdemServico = {
        id: `OS-${String(ordens.length + 1).padStart(3, '0')}`,
        ...formData,
        valor,
        status: 'pendente',
        dataCriacao: new Date().toLocaleDateString('pt-BR')
      };
      setOrdens(prev => [...prev, novaOrdem]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      cliente: '',
      entrada: '',
      saida: '',
      observacoes: '',
      pedido: { corte: '', estampa: '', costura: '' },
      tipo: { manga: 'normal', barra: 'silk', gola: 'redondo' },
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
  };

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
                    <div>
                      <Label htmlFor="cliente">Cliente</Label>
                      <Input
                        id="cliente"
                        value={formData.cliente}
                        onChange={(e) => setFormData({...formData, cliente: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="entrada">Data Entrada</Label>
                      <Input
                        id="entrada"
                        type="date"
                        value={formData.entrada}
                        onChange={(e) => setFormData({...formData, entrada: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="saida">Data Saída</Label>
                      <Input
                        id="saida"
                        type="date"
                        value={formData.saida}
                        onChange={(e) => setFormData({...formData, saida: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="qualidade">Qualidade</Label>
                      <select
                        id="qualidade"
                        className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                        value={formData.qualidade}
                        onChange={(e) => setFormData({...formData, qualidade: e.target.value as 'M' | 'G' | 'P'})}
                      >
                        <option value="M">M</option>
                        <option value="G">G</option>
                        <option value="P">P</option>
                      </select>
                    </div>
                  </div>

                  {/* Pedido */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Pedido</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="corte">Corte</Label>
                        <Input
                          id="corte"
                          value={formData.pedido.corte}
                          onChange={(e) => setFormData({
                            ...formData, 
                            pedido: {...formData.pedido, corte: e.target.value}
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="estampa">Estampa Ex: Bordado</Label>
                        <Input
                          id="estampa"
                          value={formData.pedido.estampa}
                          onChange={(e) => setFormData({
                            ...formData, 
                            pedido: {...formData.pedido, estampa: e.target.value}
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="costura">Costura</Label>
                        <Input
                          id="costura"
                          value={formData.pedido.costura}
                          onChange={(e) => setFormData({
                            ...formData, 
                            pedido: {...formData.pedido, costura: e.target.value}
                          })}
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
                          className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                          value={formData.tipo.manga}
                          onChange={(e) => setFormData({
                            ...formData, 
                            tipo: {...formData.tipo, manga: e.target.value as 'OR' | 'normal'}
                          })}
                        >
                          <option value="normal">Normal</option>
                          <option value="OR">OR</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="barra">Tipo de Barra</Label>
                        <select
                          id="barra"
                          className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                          value={formData.tipo.barra}
                          onChange={(e) => setFormData({
                            ...formData, 
                            tipo: {...formData.tipo, barra: e.target.value as 'silk' | 'sub'}
                          })}
                        >
                          <option value="silk">Silk</option>
                          <option value="sub">Sub</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="gola">Tipo de Gola</Label>
                        <select
                          id="gola"
                          className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                          value={formData.tipo.gola}
                          onChange={(e) => setFormData({
                            ...formData, 
                            tipo: {...formData.tipo, gola: e.target.value as 'redondo' | 'polo'}
                          })}
                        >
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
                      <Input
                        id="tipoTecido"
                        value={formData.tipoTecido}
                        onChange={(e) => setFormData({...formData, tipoTecido: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tamanho">Tamanho</Label>
                      <select
                        id="tamanho"
                        className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                        value={formData.tamanho}
                        onChange={(e) => setFormData({...formData, tamanho: e.target.value as 'M' | 'G' | 'P'})}
                      >
                        <option value="P">P</option>
                        <option value="M">M</option>
                        <option value="G">G</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="quantidade">Quantidade</Label>
                      <Input
                        id="quantidade"
                        type="number"
                        min="1"
                        value={formData.quantidade}
                        onChange={(e) => setFormData({...formData, quantidade: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="precoUnitario">Preço Unitário</Label>
                      <Input
                        id="precoUnitario"
                        type="number"
                        step="0.01"
                        value={formData.precoUnitario}
                        onChange={(e) => setFormData({...formData, precoUnitario: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="acabamento">Acabamento</Label>
                      <Input
                        id="acabamento"
                        value={formData.acabamento}
                        onChange={(e) => setFormData({...formData, acabamento: e.target.value})}
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <input
                        type="checkbox"
                        id="apresentar"
                        checked={formData.apresentar}
                        onChange={(e) => setFormData({...formData, apresentar: e.target.checked})}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="apresentar">Apresentar ao Cliente</Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={formData.observacoes}
                      onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                      rows={3}
                    />
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
                  <Input placeholder="Buscar OS..." className="pl-10 w-64" />
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
                    {ordens.map((ordem) => (
                      <tr key={ordem.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-brand-blue">{ordem.id}</td>
                        <td className="py-3 px-4">{ordem.cliente}</td>
                        <td className="py-3 px-4">{ordem.entrada}</td>
                        <td className="py-3 px-4">{ordem.saida}</td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(ordem.status)}>
                            {ordem.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-medium">R$ {ordem.valor.toFixed(2)}</td>
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
        </main>
      </div>
    </div>
  );
};

export default OrdemServico;
