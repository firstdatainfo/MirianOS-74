
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertCircle, Truck, Package, Scissors, Shirt, Palette, Wrench } from 'lucide-react';
import { OrdemServico } from '@/hooks/useOrdenServico';
import { useAcompanhamentoOS } from '@/hooks/useEtapasProducao';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AcompanhamentoPedidoProps {
  ordemServico: OrdemServico;
}

const AcompanhamentoPedido: React.FC<AcompanhamentoPedidoProps> = ({ ordemServico }) => {
  const { data: acompanhamento, isLoading, refetch } = useAcompanhamentoOS(ordemServico.id);
  const { toast } = useToast();

  const getEtapaIcon = (nomeEtapa: string) => {
    switch (nomeEtapa.toLowerCase()) {
      case 'recebido':
        return <Package className="h-5 w-5" />;
      case 'corte':
        return <Scissors className="h-5 w-5" />;
      case 'estampa/bordado':
        return <Palette className="h-5 w-5" />;
      case 'costura':
        return <Shirt className="h-5 w-5" />;
      case 'acabamento':
        return <Wrench className="h-5 w-5" />;
      case 'pronto':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluido':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'em-andamento':
        return <Clock className="h-6 w-6 text-blue-500 animate-pulse" />;
      case 'pendente':
        return <AlertCircle className="h-6 w-6 text-gray-300" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-300" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido':
        return 'bg-green-100 border-green-300';
      case 'em-andamento':
        return 'bg-blue-100 border-blue-300 shadow-md';
      case 'pendente':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getBadgeStatus = (status: string) => {
    switch (status) {
      case 'pendente':
        return { text: 'Pendente', className: 'bg-yellow-500 text-white' };
      case 'em-andamento':
        return { text: 'Em Andamento', className: 'bg-blue-500 text-white' };
      case 'concluido':
        return { text: 'Concluído', className: 'bg-green-500 text-white' };
      case 'entregue':
        return { text: 'Entregue', className: 'bg-purple-500 text-white' };
      case 'cancelado':
        return { text: 'Cancelado', className: 'bg-red-500 text-white' };
      default:
        return { text: 'Desconhecido', className: 'bg-gray-500 text-white' };
    }
  };

  const handleStatusChange = async (acompanhamentoId: string, newStatus: string) => {
    try {
      const updateData: any = {
        status: newStatus
      };

      // Se mudou para "em-andamento" e não tem data_inicio, adiciona
      if (newStatus === 'em-andamento') {
        updateData.data_inicio = new Date().toISOString();
      }

      // Se mudou para "concluido", adiciona data_conclusao
      if (newStatus === 'concluido') {
        updateData.data_conclusao = new Date().toISOString();
        // Se não tinha data_inicio, adiciona também
        const currentItem = acompanhamento?.find(item => item.id === acompanhamentoId);
        if (!currentItem?.data_inicio) {
          updateData.data_inicio = new Date().toISOString();
        }
      }

      const { error } = await supabase
        .from('acompanhamento_os')
        .update(updateData)
        .eq('id', acompanhamentoId);

      if (error) {
        console.error('Erro ao atualizar status:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar status da etapa",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Status da etapa atualizado com sucesso",
      });

      // Recarrega os dados
      refetch();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status da etapa",
        variant: "destructive",
      });
    }
  };

  const badgeStatus = getBadgeStatus(ordemServico.status);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">Carregando acompanhamento...</p>
        </CardContent>
      </Card>
    );
  }

  if (!acompanhamento || acompanhamento.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">Nenhum acompanhamento encontrado para esta ordem de serviço.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Acompanhar Pedido {ordemServico.numero_os}
        </CardTitle>
        <div className="flex items-center gap-4">
          <Badge className={badgeStatus.className}>
            {badgeStatus.text}
          </Badge>
          <span className="text-sm text-gray-600">
            Cliente: {ordemServico.clientes?.nome}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {acompanhamento.map((item, index) => (
            <div key={item.id} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-gray-200">
                  {getEtapaIcon(item.etapas_producao.nome)}
                </div>
                {index < acompanhamento.length - 1 && (
                  <div className={`w-0.5 h-12 mt-2 ${
                    item.status === 'concluido' ? 'bg-green-300' : 'bg-gray-200'
                  }`} />
                )}
              </div>
              
              <div className={`flex-1 p-4 rounded-lg border-2 ${getStatusColor(item.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{item.etapas_producao.nome}</h3>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <Select 
                      value={item.status || 'pendente'} 
                      onValueChange={(value) => handleStatusChange(item.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="em-andamento">Em Andamento</SelectItem>
                        <SelectItem value="concluido">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{item.etapas_producao.descricao}</p>
                <div className="mt-2 space-y-1">
                  {item.data_inicio && (
                    <p className="text-xs text-gray-500">
                      Iniciado: {new Date(item.data_inicio).toLocaleDateString('pt-BR')} às {new Date(item.data_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                  {item.data_conclusao && (
                    <p className="text-xs text-gray-500">
                      Concluído: {new Date(item.data_conclusao).toLocaleDateString('pt-BR')} às {new Date(item.data_conclusao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                  {item.observacoes && (
                    <p className="text-xs text-blue-600 italic">Obs: {item.observacoes}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AcompanhamentoPedido;
