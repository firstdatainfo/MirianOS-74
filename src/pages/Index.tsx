import React from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import DashboardCard from '@/components/DashboardCard';
import ServiceOrderTable from '@/components/ServiceOrderTable';
import { Users, ClipboardList, DollarSign, TrendingUp } from 'lucide-react';
import { getDashboardData } from '@/services/dashboardService';
import { useQuery } from '@tanstack/react-query';

const Index = () => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
    refetchInterval: 30000 // Atualiza a cada 30 segundos
  });

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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard 
              title="Total de Clientes" 
              value={isLoading ? '...' : dashboardData?.totalClientes.toString() || '0'} 
              change={isLoading ? '...' : `${dashboardData?.crescimentoClientes > 0 ? '+' : ''}${dashboardData?.crescimentoClientes}%` || '0%'} 
              icon={Users} 
              trend={dashboardData?.crescimentoClientes >= 0 ? 'up' : 'down'} 
            />
            <DashboardCard 
              title="Pedidos Ativos" 
              value={isLoading ? '...' : dashboardData?.pedidosAtivos.toString() || '0'} 
              change={isLoading ? '...' : `${dashboardData?.crescimentoPedidos > 0 ? '+' : ''}${dashboardData?.crescimentoPedidos}%` || '0%'} 
              icon={ClipboardList} 
              trend={dashboardData?.crescimentoPedidos >= 0 ? 'up' : 'down'} 
            />
            <DashboardCard 
              title="Receita Mensal" 
              value={isLoading ? '...' : `R$ ${dashboardData?.receitaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` || 'R$ 0,00'} 
              change={isLoading ? '...' : `${dashboardData?.crescimentoReceita > 0 ? '+' : ''}${dashboardData?.crescimentoReceita}%` || '0%'} 
              icon={DollarSign} 
              trend={dashboardData?.crescimentoReceita >= 0 ? 'up' : 'down'} 
            />
            <DashboardCard 
              title="Taxa de Qualidade" 
              value={isLoading ? '...' : `${dashboardData?.taxaQualidade}%` || '0%'} 
              change={isLoading ? '...' : `${dashboardData?.crescimentoQualidade > 0 ? '+' : ''}${dashboardData?.crescimentoQualidade}%` || '0%'} 
              icon={TrendingUp} 
              trend={dashboardData?.crescimentoQualidade >= 0 ? 'up' : 'down'} 
            />
          </div>

          {/* Service Order Table - Full Width */}
          <ServiceOrderTable />
        </main>
      </div>
    </div>
  );
};

export default Index;
