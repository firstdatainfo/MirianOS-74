
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface OrdemServico {
  id: string;
  numero_os: string;
  cliente_id: string;
  orcamento_id?: string;
  data_criacao: string;
  data_prevista_entrega?: string;
  data_entrega?: string;
  status: 'pendente' | 'em-andamento' | 'concluido' | 'entregue' | 'cancelado';
  valor_total: number;
  descricao?: string;
  observacoes?: string;
  clientes?: {
    nome: string;
    email?: string;
    telefone?: string;
  };
}

export const useOrdenServico = (numeroOs?: string) => {
  return useQuery({
    queryKey: ['ordem-servico', numeroOs],
    queryFn: async () => {
      if (!numeroOs) return null;
      
      const { data, error } = await supabase
        .from('ordens_servico')
        .select(`
          *,
          clientes (
            nome,
            email,
            telefone
          )
        `)
        .eq('numero_os', numeroOs)
        .single();

      if (error) {
        console.error('Erro ao buscar ordem de serviço:', error);
        return null;
      }

      return data as OrdemServico;
    },
    enabled: !!numeroOs,
  });
};

export const useOrdensServico = () => {
  return useQuery({
    queryKey: ['ordens-servico'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ordens_servico')
        .select(`
          *,
          clientes (
            nome,
            email,
            telefone
          )
        `)
        .order('data_criacao', { ascending: false });

      if (error) {
        console.error('Erro ao buscar ordens de serviço:', error);
        throw error;
      }

      return data as OrdemServico[];
    },
  });
};
