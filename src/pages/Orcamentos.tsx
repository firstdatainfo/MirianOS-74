
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calculator, Plus, Search, Edit, Eye, CheckCircle, XCircle } from 'lucide-react';

interface Orcamento {
  id: string;
  cliente: string;
  descricao: string;
  valor: number;
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'expirado';
  validade: string;
  observacoes: string;
  dataCriacao: string;
  dataAprovacao?: string;
}

const Orcamentos = () => {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([
    {
      id: 'ORC-001',
      cliente: 'João Silva',
      descricao: 'Confecção de 10 camisas polo com bordado',
      valor: 350.00,
      status: 'pendente',
      validade: '15/05/2024',
      observacoes: 'Cliente quer logo na frente',
      dataCriacao: '01/05/2024'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cliente: '',
    descricao: '',
    valor: 0,
    validade: '',
    observacoes: ''
  });

  const resetForm = () => {
    setFormData({
      cliente: '',
      descricao: '',
      valor: 0,
      validade: '',
      observacoes: ''
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setOrcamentos(prev => prev.map(orcamento => 
        orcamento.id === editingId 
          ? { ...orcamento, ...formData }
          : orcamento
      ));
    } else {
      const novoOrcamento: Orcamento = {
        id: `ORC-${String(orcamentos.length + 1).padStart(3, '0')}`,
        ...formData,
        status: 'pendente',
        dataCriacao: new Date().toLocaleDateString('pt-BR')
      };
      setOrcamentos(prev => [...prev, novoOrcamento]);
    }
    
    resetForm();
  };

  const aprovarOrcamento = (id: string) => {
    setOrcamentos(prev => prev.map(orcamento => 
      orcamento.id === id 
        ? { 
            ...orcamento, 
            status: 'aprovado', 
            dataAprovacao: new Date().toLocaleDateString('pt-BR')
          }
        : orcamento
    ));
  };

  const rejeitarOrcamento = (id: string) => {
    setOrcamentos(prev => prev.map(orcamento => 
      orcamento.id === id 
        ? { ...orcamento, status: 'rejeitado' }
        : orcamento
    ));
  };

  const criarOrdemServico = (orcamento: Orcamento) => {
    // Aqui você redirecionaria para a página de ordem de serviço com os dados do orçamento
    console.log('Criando ordem de serviço para:', orcamento);
    // Implementar navegação para /ordem-servico com dados do orçamento
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'aprovado':
        return 'bg-green-100 text-green-800';
      case 'rejeitado':
        return 'bg-red-100 text-red-800';
      case 'expirado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
              <Calculator className="h-8 w-8 text-brand-blue" />
              <h1 className="text-3xl font-bold text-gray-900">Orçamentos</h1>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-brand-blue hover:bg-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Novo Orçamento
            </Button>
          </div>

          {showForm && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>
                  {editingId ? 'Editar Orçamento' : 'Novo Orçamento'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Label htmlFor="valor">Valor (R$)</Label>
                      <Input
                        id="valor"
                        type="number"
                        step="0.01"
                        value={formData.valor}
                        onChange={(e) => setFormData({...formData, valor: parseFloat(e.target.value)})}
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="descricao">Descrição do Serviço</Label>
                      <Textarea
                        id="descricao"
                        value={formData.descricao}
                        onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="validade">Validade do Orçamento</Label>
                      <Input
                        id="validade"
                        type="date"
                        value={formData.validade}
                        onChange={(e) => setFormData({...formData, validade: e.target.value})}
                        required
                      />
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
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit" className="bg-green-500 hover:bg-green-600">
                      {editingId ? 'Atualizar' : 'Criar Orçamento'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Lista de Orçamentos</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Buscar orçamentos..." className="pl-10 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Cliente</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Descrição</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Valor</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Validade</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orcamentos.map((orcamento) => (
                      <tr key={orcamento.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-brand-blue">{orcamento.id}</td>
                        <td className="py-3 px-4">{orcamento.cliente}</td>
                        <td className="py-3 px-4 max-w-xs truncate">{orcamento.descricao}</td>
                        <td className="py-3 px-4 font-medium">R$ {orcamento.valor.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(orcamento.status)}>
                            {orcamento.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{orcamento.validade}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {orcamento.status === 'pendente' && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => aprovarOrcamento(orcamento.id)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => rejeitarOrcamento(orcamento.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {orcamento.status === 'aprovado' && (
                              <Button 
                                size="sm"
                                onClick={() => criarOrdemServico(orcamento)}
                                className="bg-brand-blue hover:bg-blue-600"
                              >
                                Criar OS
                              </Button>
                            )}
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

export default Orcamentos;
