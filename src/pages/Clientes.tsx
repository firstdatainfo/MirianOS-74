
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, Search, Edit, Trash2, Building2, User } from 'lucide-react';

interface Cliente {
  id: string;
  tipo: 'pessoa_fisica' | 'pessoa_juridica';
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
  cep: string;
  cidade: string;
  estado: string;
  cpf?: string;
  rg?: string;
  dataNascimento?: string;
  cnpj?: string;
  inscricaoEstadual?: string;
  nomeFantasia?: string;
  razaoSocial?: string;
  contato?: string;
  chavePix?: string;
  tipoPix?: 'cpf' | 'cnpj' | 'email' | 'telefone' | 'aleatoria';
  observacoes: string;
  status: 'ativo' | 'inativo';
  dataCadastro: string;
}

const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: '1',
      tipo: 'pessoa_fisica',
      nome: 'João Silva',
      telefone: '(11) 99999-9999',
      email: 'joao@email.com',
      endereco: 'Rua das Flores, 123',
      cep: '01234-567',
      cidade: 'São Paulo',
      estado: 'SP',
      cpf: '123.456.789-00',
      rg: '12.345.678-9',
      dataNascimento: '1985-05-15',
      chavePix: 'joao@email.com',
      tipoPix: 'email',
      observacoes: 'Cliente preferencial',
      status: 'ativo',
      dataCadastro: '01/04/2024'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tipoCliente, setTipoCliente] = useState<'pessoa_fisica' | 'pessoa_juridica'>('pessoa_fisica');
  
  const [formData, setFormData] = useState({
    tipo: 'pessoa_fisica' as 'pessoa_fisica' | 'pessoa_juridica',
    nome: '',
    telefone: '',
    email: '',
    endereco: '',
    cep: '',
    cidade: '',
    estado: '',
    cpf: '',
    rg: '',
    dataNascimento: '',
    cnpj: '',
    inscricaoEstadual: '',
    nomeFantasia: '',
    razaoSocial: '',
    contato: '',
    chavePix: '',
    tipoPix: 'cpf' as 'cpf' | 'cnpj' | 'email' | 'telefone' | 'aleatoria',
    observacoes: ''
  });

  const resetForm = () => {
    setFormData({
      tipo: 'pessoa_fisica',
      nome: '',
      telefone: '',
      email: '',
      endereco: '',
      cep: '',
      cidade: '',
      estado: '',
      cpf: '',
      rg: '',
      dataNascimento: '',
      cnpj: '',
      inscricaoEstadual: '',
      nomeFantasia: '',
      razaoSocial: '',
      contato: '',
      chavePix: '',
      tipoPix: 'cpf',
      observacoes: ''
    });
    setShowForm(false);
    setEditingId(null);
    setTipoCliente('pessoa_fisica');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setClientes(prev => prev.map(cliente => 
        cliente.id === editingId 
          ? { ...cliente, ...formData }
          : cliente
      ));
    } else {
      const novoCliente: Cliente = {
        id: Date.now().toString(),
        ...formData,
        status: 'ativo',
        dataCadastro: new Date().toLocaleDateString('pt-BR')
      };
      setClientes(prev => [...prev, novoCliente]);
    }
    
    resetForm();
  };

  const handleEdit = (cliente: Cliente) => {
    setFormData({
      tipo: cliente.tipo,
      nome: cliente.nome,
      telefone: cliente.telefone,
      email: cliente.email,
      endereco: cliente.endereco,
      cep: cliente.cep || '',
      cidade: cliente.cidade || '',
      estado: cliente.estado || '',
      cpf: cliente.cpf || '',
      rg: cliente.rg || '',
      dataNascimento: cliente.dataNascimento || '',
      cnpj: cliente.cnpj || '',
      inscricaoEstadual: cliente.inscricaoEstadual || '',
      nomeFantasia: cliente.nomeFantasia || '',
      razaoSocial: cliente.razaoSocial || '',
      contato: cliente.contato || '',
      chavePix: cliente.chavePix || '',
      tipoPix: cliente.tipoPix || 'cpf',
      observacoes: cliente.observacoes
    });
    setTipoCliente(cliente.tipo);
    setEditingId(cliente.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setClientes(prev => prev.filter(cliente => cliente.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-brand-blue" />
              <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-brand-blue hover:bg-blue-600">
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </div>

          {showForm && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>
                  {editingId ? 'Editar Cliente' : 'Novo Cliente'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Tipo de Cliente */}
                  <div className="space-y-4">
                    <Label>Tipo de Cliente</Label>
                    <Tabs value={tipoCliente} onValueChange={(value) => {
                      setTipoCliente(value as 'pessoa_fisica' | 'pessoa_juridica');
                      setFormData({...formData, tipo: value as 'pessoa_fisica' | 'pessoa_juridica'});
                    }}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="pessoa_fisica" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Pessoa Física
                        </TabsTrigger>
                        <TabsTrigger value="pessoa_juridica" className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Pessoa Jurídica
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="pessoa_fisica" className="space-y-4">
                        {/* Dados Pessoais */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="nome">Nome Completo *</Label>
                            <Input
                              id="nome"
                              value={formData.nome}
                              onChange={(e) => setFormData({...formData, nome: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="cpf">CPF *</Label>
                            <Input
                              id="cpf"
                              value={formData.cpf}
                              onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                              placeholder="000.000.000-00"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="rg">RG</Label>
                            <Input
                              id="rg"
                              value={formData.rg}
                              onChange={(e) => setFormData({...formData, rg: e.target.value})}
                              placeholder="00.000.000-0"
                            />
                          </div>
                          <div>
                            <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                            <Input
                              id="dataNascimento"
                              type="date"
                              value={formData.dataNascimento}
                              onChange={(e) => setFormData({...formData, dataNascimento: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="telefone">Telefone *</Label>
                            <Input
                              id="telefone"
                              value={formData.telefone}
                              onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                              placeholder="(11) 99999-9999"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="pessoa_juridica" className="space-y-4">
                        {/* Dados da Empresa */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="razaoSocial">Razão Social *</Label>
                            <Input
                              id="razaoSocial"
                              value={formData.razaoSocial}
                              onChange={(e) => setFormData({...formData, razaoSocial: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                            <Input
                              id="nomeFantasia"
                              value={formData.nomeFantasia}
                              onChange={(e) => setFormData({...formData, nomeFantasia: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cnpj">CNPJ *</Label>
                            <Input
                              id="cnpj"
                              value={formData.cnpj}
                              onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                              placeholder="00.000.000/0000-00"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                            <Input
                              id="inscricaoEstadual"
                              value={formData.inscricaoEstadual}
                              onChange={(e) => setFormData({...formData, inscricaoEstadual: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="contato">Pessoa de Contato</Label>
                            <Input
                              id="contato"
                              value={formData.contato}
                              onChange={(e) => setFormData({...formData, contato: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="telefone">Telefone *</Label>
                            <Input
                              id="telefone"
                              value={formData.telefone}
                              onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                              placeholder="(11) 99999-9999"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Endereço */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Endereço</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="cep">CEP</Label>
                        <Input
                          id="cep"
                          value={formData.cep}
                          onChange={(e) => setFormData({...formData, cep: e.target.value})}
                          placeholder="00000-000"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="endereco">Endereço Completo</Label>
                        <Input
                          id="endereco"
                          value={formData.endereco}
                          onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                          placeholder="Rua, número, bairro"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input
                          id="cidade"
                          value={formData.cidade}
                          onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="estado">Estado</Label>
                        <Input
                          id="estado"
                          value={formData.estado}
                          onChange={(e) => setFormData({...formData, estado: e.target.value})}
                          placeholder="SP"
                          maxLength={2}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dados PIX */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Dados PIX</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tipoPix">Tipo de Chave PIX</Label>
                        <select
                          id="tipoPix"
                          className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                          value={formData.tipoPix}
                          onChange={(e) => setFormData({...formData, tipoPix: e.target.value as any})}
                        >
                          <option value="cpf">CPF</option>
                          <option value="cnpj">CNPJ</option>
                          <option value="email">Email</option>
                          <option value="telefone">Telefone</option>
                          <option value="aleatoria">Chave Aleatória</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="chavePix">Chave PIX</Label>
                        <Input
                          id="chavePix"
                          value={formData.chavePix}
                          onChange={(e) => setFormData({...formData, chavePix: e.target.value})}
                          placeholder="Digite a chave PIX"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Observações */}
                  <div>
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={formData.observacoes}
                      onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                      rows={3}
                      placeholder="Informações adicionais sobre o cliente"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit" className="bg-green-500 hover:bg-green-600">
                      {editingId ? 'Atualizar' : 'Cadastrar'}
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
                <CardTitle>Lista de Clientes</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Buscar clientes..." className="pl-10 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Tipo</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Nome</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">CPF/CNPJ</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Telefone</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map((cliente) => (
                      <tr key={cliente.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <Badge variant={cliente.tipo === 'pessoa_fisica' ? 'default' : 'secondary'}>
                            {cliente.tipo === 'pessoa_fisica' ? 'PF' : 'PJ'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {cliente.tipo === 'pessoa_juridica' ? cliente.razaoSocial || cliente.nome : cliente.nome}
                        </td>
                        <td className="py-3 px-4">{cliente.cpf || cliente.cnpj}</td>
                        <td className="py-3 px-4">{cliente.telefone}</td>
                        <td className="py-3 px-4">{cliente.email}</td>
                        <td className="py-3 px-4">
                          <Badge className={cliente.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {cliente.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(cliente)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(cliente.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
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

export default Clientes;
