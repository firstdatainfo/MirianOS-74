
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Notificacao {
  id: string;
  tipo: 'ordem_atrasada' | 'etapa_concluida' | 'nova_ordem';
  titulo: string;
  mensagem: string;
  lida: boolean;
  data_criacao: string;
  ordem_servico_id?: string;
}

export const useNotificacoes = () => {
  return useQuery({
    queryKey: ['notificacoes'],
    queryFn: async () => {
      // Simular notificações baseadas em ordens atrasadas
      const { data: ordensAtrasadas, error } = await supabase
        .from('ordens_servico')
        .select('*')
        .lt('data_prevista_entrega', new Date().toISOString())
        .eq('status', 'em-andamento');

      if (error) {
        console.error('Erro ao buscar ordens atrasadas:', error);
        return [];
      }

      const notificacoes: Notificacao[] = ordensAtrasadas?.map(ordem => ({
        id: `atraso-${ordem.id}`,
        tipo: 'ordem_atrasada' as const,
        titulo: 'Ordem Atrasada',
        mensagem: `Ordem ${ordem.numero_os} está atrasada`,
        lida: false,
        data_criacao: new Date().toISOString(),
        ordem_servico_id: ordem.id
      })) || [];

      return notificacoes;
    },
    refetchInterval: 30000, // Atualiza a cada 30 segundos
  });
};
