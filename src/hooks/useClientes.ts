import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Cliente {
  id: string;
  tipo: 'fisica' | 'juridica';
  nome: string;
  // Campos comuns
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  bairro: string | null;
  cep: string | null;
  cidade: string | null;
  estado: string | null;
  ativo: boolean | null;
  data_cadastro: string | null;
  
  // Campos específicos para pessoa jurídica
  razao_social?: string;
  nome_fantasia?: string;
  cnpj?: string;
  inscricao_estadual?: string;
  
  // Campos específicos para pessoa física
  cpf?: string;
  rg?: string;
  data_nascimento?: string;
}

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função auxiliar para garantir que um cliente tenha todos os campos necessários
  const parseCliente = (cliente: any): Cliente => {
    return {
      id: cliente.id,
      tipo: cliente.tipo || 'fisica',
      nome: cliente.nome || '',
      telefone: cliente.telefone || null,
      email: cliente.email || null,
      endereco: cliente.endereco || null,
      bairro: cliente.bairro || null,
      cep: cliente.cep || null,
      cidade: cliente.cidade || null,
      estado: cliente.estado || null,
      ativo: cliente.ativo ?? true,
      data_cadastro: cliente.data_cadastro || null,
      // Campos específicos para pessoa jurídica
      razao_social: cliente.razao_social,
      nome_fantasia: cliente.nome_fantasia,
      cnpj: cliente.cnpj,
      inscricao_estadual: cliente.inscricao_estadual,
      // Campos específicos para pessoa física
      cpf: cliente.cpf,
      rg: cliente.rg,
      data_nascimento: cliente.data_nascimento
    };
  };

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      
      // Garante que cada cliente tenha todos os campos necessários
      const clientesFormatados = (data || []).map(parseCliente);
      setClientes(clientesFormatados);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
      setError('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const addCliente = async (cliente: Omit<Cliente, 'id' | 'data_cadastro'>) => {
    try {
      const clienteData = {
        ...cliente,
        ativo: true,
        data_cadastro: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('clientes')
        .insert([clienteData])
        .select();

      if (error) throw error;
      
      if (data?.[0]) {
        const novoCliente = parseCliente(data[0]);
        setClientes(prev => [...prev, novoCliente]);
        return novoCliente;
      }
      return null;
    } catch (err) {
      console.error('Erro ao adicionar cliente:', err);
      throw err;
    }
  };

  const updateCliente = async (id: string, updates: Partial<Omit<Cliente, 'id' | 'data_cadastro'>>) => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      
      if (data?.[0]) {
        const clienteAtualizado = parseCliente(data[0]);
        setClientes(prev => 
          prev.map(cliente => 
            cliente.id === id ? clienteAtualizado : cliente
          )
        );
        return clienteAtualizado;
      }
      return null;
    } catch (err) {
      console.error('Erro ao atualizar cliente:', err);
      throw err;
    }
  };

  const deleteCliente = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setClientes(prev => 
        prev.filter(cliente => cliente.id !== id)
      );
    } catch (err) {
      console.error('Erro ao excluir cliente:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return {
    clientes,
    loading,
    error,
    addCliente,
    updateCliente,
    deleteCliente,
    refetch: fetchClientes
  };
}
