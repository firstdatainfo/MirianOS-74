
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, Truck, Package, Scissors, Shirt, Palette, Wrench } from 'lucide-react';
import { OrdemServico } from '@/hooks/useOrdenServico';

interface EtapaAcompanhamento {
  id: string;
  titulo: string;
  descricao: string;
  status: 'concluido' | 'atual' | 'pendente';
  timestamp?: string;
  icon: React.ReactNode;
}

interface AcompanhamentoPedidoProps {
  ordemServico: OrdemServico;
}

const AcompanhamentoPedido: React.FC<AcompanhamentoPedidoProps> = ({ ordemServico }) => {
  const getEtapasAcompanhamento = (status: string): EtapaAcompanhamento[] => {
    const dataBase = new Date(ordemServico.data_criacao);
    
    const etapas: EtapaAcompanhamento[] = [
      {
        id: 'recebido',
        titulo: 'Pedido Recebido',
        descricao: 'Seu pedido foi recebido e está na fila de produção',
        status: 'concluido',
        timestamp: dataBase.toLocaleDateString('pt-BR'),
        icon: <Package className="h-5 w-5" />
      },
      {
        id: 'cortando',
        titulo: 'Corte',
        descricao: 'Peça sendo cortada conforme especificações',
        status: status === 'pendente' ? 'pendente' : 'concluido',
        timestamp: status !== 'pendente' ? new Date(dataBase.getTime() + 24*60*60*1000).toLocaleDateString('pt-BR') : undefined,
        icon: <Scissors className="h-5 w-5" />
      },
      {
        id: 'estampando',
        titulo: 'Estampa/Bordado',
        descricao: 'Aplicação de estampas ou bordados personalizados',
        status: status === 'pendente' ? 'pendente' : 
               status === 'em-andamento' ? 'atual' : 'concluido',
        timestamp: status === 'concluido' || status === 'entregue' ? 
          new Date(dataBase.getTime() + 2*24*60*60*1000).toLocaleDateString('pt-BR') : undefined,
        icon: <Palette className="h-5 w-5" />
      },
      {
        id: 'costurando',
        titulo: 'Costura',
        descricao: 'Montagem e costura das peças',
        status: status === 'concluido' || status === 'entregue' ? 'concluido' : 
               status === 'em-andamento' ? 'atual' : 'pendente',
        timestamp: status === 'concluido' || status === 'entregue' ? 
          new Date(dataBase.getTime() + 3*24*60*60*1000).toLocaleDateString('pt-BR') : undefined,
        icon: <Shirt className="h-5 w-5" />
      },
      {
        id: 'acabamento',
        titulo: 'Acabamento',
        descricao: 'Acabamentos finais e controle de qualidade',
        status: status === 'concluido' || status === 'entregue' ? 'concluido' : 'pendente',
        timestamp: status === 'concluido' || status === 'entregue' ? 
          new Date(dataBase.getTime() + 4*24*60*60*1000).toLocaleDateString('pt-BR') : undefined,
        icon: <Wrench className="h-5 w-5" />
      },
      {
        id: 'pronto',
        titulo: 'Pronto para Entrega',
        descricao: 'Pedido finalizado e pronto para retirada',
        status: status === 'entregue' ? 'concluido' : 'pendente',
        timestamp: status === 'entregue' && ordemServico.data_entrega ? 
          new Date(ordemServico.data_entrega).toLocaleDateString('pt-BR') : undefined,
        icon: <CheckCircle className="h-5 w-5" />
      }
    ];

    return etapas;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluido':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'atual':
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
      case 'atual':
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

  const etapas = getEtapasAcompanhamento(ordemServico.status);
  const badgeStatus = getBadgeStatus(ordemServico.status);

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
          {etapas.map((etapa, index) => (
            <div key={etapa.id} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-gray-200">
                  {etapa.icon}
                </div>
                {index < etapas.length - 1 && (
                  <div className={`w-0.5 h-12 mt-2 ${
                    etapa.status === 'concluido' ? 'bg-green-300' : 'bg-gray-200'
                  }`} />
                )}
              </div>
              
              <div className={`flex-1 p-4 rounded-lg border-2 ${getStatusColor(etapa.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{etapa.titulo}</h3>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(etapa.status)}
                    {etapa.status === 'atual' && (
                      <Badge className="bg-blue-500 text-white text-xs">Em Andamento</Badge>
                    )}
                    {etapa.status === 'concluido' && (
                      <Badge className="bg-green-500 text-white text-xs">Concluído</Badge>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{etapa.descricao}</p>
                {etapa.timestamp && (
                  <p className="text-xs text-gray-500 mt-1">{etapa.timestamp}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AcompanhamentoPedido;
