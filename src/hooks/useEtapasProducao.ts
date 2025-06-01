
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface EtapaProducao {
  id: string;
  nome: string;
  descricao?: string;
  ordem: number;
  ativo: boolean;
  data_criacao: string;
}

export interface AcompanhamentoOS {
  id: string;
  ordem_servico_id: string;
  etapa_id: string;
  status: 'pendente' | 'em-andamento' | 'concluido';
  data_inicio?: string;
  data_conclusao?: string;
  observacoes?: string;
  data_criacao: string;
  etapas_producao: EtapaProducao;
}

export const useEtapasProducao = () => {
  return useQuery({
    queryKey: ['etapas-producao'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('etapas_producao')
        .select('*')
        .eq('ativo', true)
        .order('ordem');

      if (error) {
        console.error('Erro ao buscar etapas de produção:', error);
        throw error;
      }

      return data as EtapaProducao[];
    },
  });
};

export const useAcompanhamentoOS = (ordemServicoId?: string) => {
  return useQuery({
    queryKey: ['acompanhamento-os', ordemServicoId],
    queryFn: async () => {
      if (!ordemServicoId) return null;
      
      const { data, error } = await supabase
        .from('acompanhamento_os')
        .select(`
          *,
          etapas_producao (
            id,
            nome,
            descricao,
            ordem,
            ativo,
            data_criacao
          )
        `)
        .eq('ordem_servico_id', ordemServicoId)
        .order('etapas_producao(ordem)');

      if (error) {
        console.error('Erro ao buscar acompanhamento da OS:', error);
        return null;
      }

      return data as AcompanhamentoOS[];
    },
    enabled: !!ordemServicoId,
  });
};
