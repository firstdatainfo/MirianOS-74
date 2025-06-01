
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, User, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

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

interface BuscaClienteProps {
  onClienteSelecionado: (cliente: Cliente) => void;
  onNovoCliente: () => void;
}

const BuscaCliente: React.FC<BuscaClienteProps> = ({ onClienteSelecionado, onNovoCliente }) => {
  const [busca, setBusca] = useState('');
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const { data: clientes, isLoading } = useQuery({
    queryKey: ['clientes-busca', busca],
    queryFn: async () => {
      if (!busca || busca.length < 2) return [];
      
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .or(`nome.ilike.%${busca}%,email.ilike.%${busca}%,telefone.ilike.%${busca}%`)
        .eq('ativo', true)
        .limit(5);

      if (error) {
        console.error('Erro ao buscar clientes:', error);
        return [];
      }

      return data as Cliente[];
    },
    enabled: busca.length >= 2,
  });

  useEffect(() => {
    setMostrarResultados(busca.length >= 2);
  }, [busca]);

  const handleClienteClick = (cliente: Cliente) => {
    onClienteSelecionado(cliente);
    setBusca(cliente.nome);
    setMostrarResultados(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar cliente por nome, email ou telefone..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-10"
          onFocus={() => busca.length >= 2 && setMostrarResultados(true)}
        />
      </div>

      {mostrarResultados && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-3 text-center text-gray-500">Buscando...</div>
          ) : clientes && clientes.length > 0 ? (
            <>
              {clientes.map((cliente) => (
                <div
                  key={cliente.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                  onClick={() => handleClienteClick(cliente)}
                >
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{cliente.nome}</p>
                      <div className="text-sm text-gray-500">
                        {cliente.email && <span>{cliente.email}</span>}
                        {cliente.telefone && <span className="ml-2">{cliente.telefone}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div
                className="p-3 hover:bg-blue-50 cursor-pointer border-t border-gray-100 text-blue-600 flex items-center space-x-2"
                onClick={onNovoCliente}
              >
                <Plus className="h-4 w-4" />
                <span>Cadastrar novo cliente</span>
              </div>
            </>
          ) : (
            <div className="p-3">
              <p className="text-gray-500 text-center">Nenhum cliente encontrado</p>
              <div
                className="mt-2 p-2 hover:bg-blue-50 cursor-pointer text-blue-600 flex items-center justify-center space-x-2 rounded"
                onClick={onNovoCliente}
              >
                <Plus className="h-4 w-4" />
                <span>Cadastrar novo cliente</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BuscaCliente;
