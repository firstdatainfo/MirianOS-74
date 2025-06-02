import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, UserPlus, Search, Edit, Trash2, X, Save } from 'lucide-react';
import { useInputMask } from '@/hooks/useInputMask';
import { useClientes, type Cliente } from '@/hooks/useClientes';
import { toast } from 'sonner';

const Clientes = () => {
  // Hooks e estados
  const { maskCEP, maskTelefone } = useInputMask();
  const { 
    clientes, 
    loading, 
    error,
    addCliente, 
    updateCliente, 
    deleteCliente 
  } = useClientes();
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  
  const [formData, setFormData] = useState<Omit<Cliente, 'id' | 'data_cadastro' | 'ativo'>>({
    nome: '',
    telefone: '',
    email: '',
    endereco: '',
    cep: '',
    cidade: '',
    estado: ''
  });

  // Funções auxiliares
  const resetForm = () => {
    setFormData({
      nome: '',
      telefone: '',
      email: '',
      endereco: '',
      cep: '',
      cidade: '',
      estado: ''
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await updateCliente(editingId, formData);
        toast.success('Cliente atualizado com sucesso!');
      } else {
        await addCliente(formData);
        toast.success('Cliente cadastrado com sucesso!');
      }
      
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      toast.error('Erro ao salvar cliente. Tente novamente.');
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setFormData({
      nome: cliente.nome,
      telefone: cliente.telefone || '',
      email: cliente.email || '',
      endereco: cliente.endereco || '',
      cep: cliente.cep || '',
      cidade: cliente.cidade || '',
      estado: cliente.estado || ''
    });
    setEditingId(cliente.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await deleteCliente(id);
        toast.success('Cliente excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        toast.error('Erro ao excluir cliente. Tente novamente.');
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    let maskedValue = value;
    
    switch (field) {
      case 'cep':
        maskedValue = maskCEP(value);
        break;
      case 'telefone':
        maskedValue = maskTelefone(value);
        break;
    }
    
    setFormData({...formData, [field]: maskedValue});
  };

  // Filtra os clientes com base na busca
  const filteredClientes = clientes.filter(cliente => 
    cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (cliente.email && cliente.email.toLowerCase().includes(busca.toLowerCase())) ||
    (cliente.telefone && cliente.telefone.includes(busca))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex overflow-hidden relative">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 bg-grid-primary/10 mask-gradient-to-b pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-primary/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-secondary/20 rounded-full blur-3xl animate-pulse-slow" />
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 space-y-6 relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 bg-gradient-primary text-white p-1.5 rounded-lg shadow-neon-primary/30 animate-pulse-slow" />
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-glow">Clientes</h1>
            </div>
            <Button 
              onClick={() => {
                resetForm();
                setShowForm(true);
              }} 
              className="bg-gradient-primary hover:shadow-neon-primary/50 transition-all duration-300 hover:scale-105"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </div>

          {/* Formulário de cadastro/edição */}
          {showForm && (
            <Card className="animate-fade-in bg-white/80 backdrop-blur-sm border border-white/20 shadow-neon-primary/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {editingId ? 'Editar Cliente' : 'Novo Cliente'}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Campo Nome */}
                    <div>
                      <Label htmlFor="nome">Nome Completo *</Label>
                      <Input
                        id="nome"
                        className="bg-white/50 border border-white/20 focus:border-primary/20 focus:shadow-neon-primary/20 transition-all duration-300 backdrop-blur-sm"
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        required
                      />
                    </div>
                    
                    {/* Campo E-mail */}
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        className="bg-white/50 border border-white/20 focus:border-primary/20 focus:shadow-neon-primary/20 transition-all duration-300 backdrop-blur-sm"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    
                    {/* Campo Telefone */}
                    <div>
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        className="bg-white/50 border border-white/20 focus:border-primary/20 focus:shadow-neon-primary/20 transition-all duration-300 backdrop-blur-sm"
                        value={formData.telefone || ''}
                        onChange={(e) => handleInputChange('telefone', e.target.value)}
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                    
                    {/* Campo CEP */}
                    <div>
                      <Label htmlFor="cep">CEP</Label>
                      <Input
                        id="cep"
                        className="bg-white/50 border border-white/20 focus:border-primary/20 focus:shadow-neon-primary/20 transition-all duration-300 backdrop-blur-sm"
                        value={formData.cep || ''}
                        onChange={(e) => handleInputChange('cep', e.target.value)}
                        placeholder="00000-000"
                      />
                    </div>
                    
                    {/* Campo Endereço */}
                    <div>
                      <Label htmlFor="endereco">Endereço</Label>
                      <Input
                        id="endereco"
                        className="bg-white/50 border border-white/20 focus:border-primary/20 focus:shadow-neon-primary/20 transition-all duration-300 backdrop-blur-sm"
                        value={formData.endereco || ''}
                        onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                      />
                    </div>
                    
                    {/* Campo Cidade */}
                    <div>
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input
                        id="cidade"
                        className="bg-white/50 border border-white/20 focus:border-primary/20 focus:shadow-neon-primary/20 transition-all duration-300 backdrop-blur-sm"
                        value={formData.cidade || ''}
                        onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                      />
                    </div>
                    
                    {/* Campo Estado */}
                    <div>
                      <Label htmlFor="estado">Estado</Label>
                      <Input
                        id="estado"
                        className="bg-white/50 border border-white/20 focus:border-primary/20 focus:shadow-neon-primary/20 transition-all duration-300 backdrop-blur-sm"
                        value={formData.estado || ''}
                        onChange={(e) => setFormData({...formData, estado: e.target.value})}
                        maxLength={2}
                        placeholder="UF"
                      />
                    </div>
                  </div>
                  
                  {/* Botões do formulário */}
                  <div className="flex justify-end space-x-3 pt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowForm(false);
                        resetForm();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-gradient-primary hover:shadow-neon-primary/50">
                      <Save className="h-4 w-4 mr-2" />
                      {editingId ? 'Atualizar' : 'Salvar'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Lista de clientes */}
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-neon-primary/10">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Buscar clientes..."
                    className="pl-10 bg-white/50 border-white/20 focus:border-primary/20 focus:shadow-neon-primary/20 transition-all duration-300 backdrop-blur-sm"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  {error}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>E-mail</TableHead>
                        <TableHead>Cidade/UF</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClientes.length > 0 ? (
                        filteredClientes.map((cliente) => (
                          <TableRow key={cliente.id}>
                            <TableCell className="font-medium">{cliente.nome}</TableCell>
                            <TableCell>{cliente.telefone || '-'}</TableCell>
                            <TableCell>{cliente.email || '-'}</TableCell>
                            <TableCell>
                              {[cliente.cidade, cliente.estado].filter(Boolean).join('/') || '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-blue-500 hover:bg-blue-50"
                                onClick={() => handleEdit(cliente)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-red-500 hover:bg-red-50"
                                onClick={() => handleDelete(cliente.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                            Nenhum cliente encontrado
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Clientes;
                    </div>
                    <div>
                      <Label htmlFor="estado">Estado</Label>
                      <Input
                        id="estado"
                        className="bg-white/50 border border-white/20 focus:border-primary/20 focus:shadow-neon-primary/20 transition-all duration-300 backdrop-blur-sm"
                        value={formData.estado || ''}
                        onChange={(e) => setFormData({...formData, estado: e.target.value})}
                        maxLength={2}
                        placeholder="SP"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        resetForm();
                        setShowForm(false);
                      }}
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-gradient-primary hover:shadow-neon-primary/50">
                      {editingId ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Lista de Clientes */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar cliente..."
                  className="pl-10 w-full sm:w-80 bg-white/50 border-white/20 focus:border-primary/20 focus:shadow-neon-primary/20 transition-all duration-300"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Erro! </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contato
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cidade/UF
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Ações</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clientes
                      .filter(cliente => 
                        cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
                        (cliente.email && cliente.email.toLowerCase().includes(busca.toLowerCase())) ||
                        (cliente.telefone && cliente.telefone.includes(busca))
                      )
                      .map((cliente) => (
                        <tr key={cliente.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{cliente.nome}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{cliente.telefone}</div>
                            <div className="text-sm text-gray-500">{cliente.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {cliente.cidade} {cliente.estado && `- ${cliente.estado}`}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEdit(cliente)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(cliente.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>

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
                    <Button type="submit" className="bg-gradient-primary hover:shadow-neon-primary/50 transition-all duration-300 hover:scale-105">
                      {editingId ? 'Atualizar' : 'Cadastrar'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm} className="border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105">
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
                <CardTitle className="bg-gradient-primary bg-clip-text text-transparent">Lista de Clientes</CardTitle>
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/60 h-4 w-4" />
                  <Input 
                    placeholder="Buscar clientes..." 
                    className="pl-10 bg-white/50 border border-white/20 focus:border-primary/20 focus:shadow-neon-primary/20 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20 bg-gradient-to-r from-primary/5 to-transparent">
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
                      <tr key={cliente.id} className="border-b border-white/10 hover:bg-white/50 backdrop-blur-sm transition-all duration-300">
                        <td className="py-3 px-4">
                          <Badge className={`${cliente.tipo === 'pessoa_fisica' ? 'bg-gradient-primary' : 'bg-gradient-secondary'} text-white shadow-neon-primary/20`}>
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
                          <Badge className={`${cliente.status === 'ativo' ? 'bg-gradient-success shadow-neon-success/30' : 'bg-gradient-secondary shadow-neon-secondary/30'} text-white animate-pulse-slow`}>
                            {cliente.status === 'ativo' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(cliente)} className="hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105">
                              <Edit className="h-4 w-4 transition-transform group-hover:scale-110 duration-300" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(cliente.id)} className="text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-all duration-300 hover:scale-105">
                              <Trash2 className="h-4 w-4 transition-transform group-hover:scale-110 duration-300" />
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
