
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, Truck } from 'lucide-react';

interface TrackingStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  timestamp?: string;
}

interface OrderTrackingProps {
  orderId: string;
  currentStatus: 'pendente' | 'em-andamento' | 'concluido' | 'entregue';
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ orderId, currentStatus }) => {
  const getTrackingSteps = (status: string): TrackingStep[] => {
    const steps: TrackingStep[] = [
      {
        id: 'pendente',
        title: 'Pedido Recebido',
        description: 'Seu pedido foi recebido e está aguardando processamento',
        status: 'completed',
        timestamp: '01/04/2024 09:00'
      },
      {
        id: 'corte',
        title: 'Corte',
        description: 'Peça sendo cortada conforme especificações',
        status: status === 'pendente' ? 'pending' : 'completed',
        timestamp: status !== 'pendente' ? '01/04/2024 10:30' : undefined
      },
      {
        id: 'estampa',
        title: 'Estampa/Bordado',
        description: 'Aplicação de estampas ou bordados',
        status: status === 'pendente' || status === 'em-andamento' ? 
          (status === 'em-andamento' ? 'current' : 'pending') : 'completed',
        timestamp: status === 'concluido' || status === 'entregue' ? '02/04/2024 14:20' : undefined
      },
      {
        id: 'costura',
        title: 'Costura',
        description: 'Montagem e costura da peça',
        status: status === 'concluido' || status === 'entregue' ? 'completed' : 
          (status === 'em-andamento' ? 'current' : 'pending'),
        timestamp: status === 'concluido' || status === 'entregue' ? '03/04/2024 16:45' : undefined
      },
      {
        id: 'acabamento',
        title: 'Acabamento',
        description: 'Acabamentos finais e controle de qualidade',
        status: status === 'concluido' || status === 'entregue' ? 'completed' : 'pending',
        timestamp: status === 'concluido' || status === 'entregue' ? '04/04/2024 11:15' : undefined
      },
      {
        id: 'entregue',
        title: 'Pronto para Entrega',
        description: 'Pedido finalizado e pronto para retirada',
        status: status === 'entregue' ? 'completed' : 'pending',
        timestamp: status === 'entregue' ? '05/04/2024 09:00' : undefined
      }
    ];

    return steps;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'current':
        return <Clock className="h-6 w-6 text-blue-500 animate-pulse" />;
      case 'pending':
        return <AlertCircle className="h-6 w-6 text-gray-300" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-300" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 border-green-300';
      case 'current':
        return 'bg-blue-100 border-blue-300 shadow-md';
      case 'pending':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const steps = getTrackingSteps(currentStatus);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Acompanhar Pedido {orderId}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                {getStatusIcon(step.status)}
                {index < steps.length - 1 && (
                  <div className={`w-0.5 h-12 mt-2 ${
                    step.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                  }`} />
                )}
              </div>
              
              <div className={`flex-1 p-4 rounded-lg border-2 ${getStatusColor(step.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  {step.status === 'current' && (
                    <Badge className="bg-blue-500 text-white">Em Andamento</Badge>
                  )}
                  {step.status === 'completed' && (
                    <Badge className="bg-green-500 text-white">Concluído</Badge>
                  )}
                </div>
                <p className="text-gray-600 text-sm">{step.description}</p>
                {step.timestamp && (
                  <p className="text-xs text-gray-500 mt-1">{step.timestamp}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTracking;
