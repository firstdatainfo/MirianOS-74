
import React from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import DashboardCard from '@/components/DashboardCard';
import ServiceOrderTable from '@/components/ServiceOrderTable';
import QuickActions from '@/components/QuickActions';
import { Users, ClipboardList, DollarSign, TrendingUp } from 'lucide-react';

const Index = () => {
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
            <DashboardCard title="Total de Clientes" value="156" change="+12.5%" icon={Users} trend="up" />
            <DashboardCard title="Pedidos Ativos" value="23" change="+8.2%" icon={ClipboardList} trend="up" />
            <DashboardCard title="Receita Mensal" value="R$ 15.420" change="+15.3%" icon={DollarSign} trend="up" />
            <DashboardCard title="Taxa de Qualidade" value="98.5%" change="+2.1%" icon={TrendingUp} trend="up" />
          </div>

          {/* Service Order Table - Full Width */}
          <ServiceOrderTable />

          {/* Welcome Section */}
          <div className="bg-gradient-primary rounded-xl p-8 text-white shadow-neon-primary/20 backdrop-blur-sm border border-white/20 animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">
              Bem-vindo ao ServicePro! 🎉
            </h2>
            <p className="text-blue-100 mb-4">
              Sistema completo de gestão de serviços. Gerencie clientes, pedidos, 
              ordens de serviço e muito mais em uma plataforma moderna e intuitiva.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 hover:bg-white/20 rounded-lg p-4 flex-1 min-w-48 transition-all duration-300 hover:scale-105 hover:shadow-neon-primary/10 backdrop-blur-sm border border-white/10">
                <h3 className="font-semibold mb-1">📱 Mobile Ready</h3>
                <p className="text-sm text-blue-100">Interface responsiva para todos os dispositivos</p>
              </div>
              <div className="bg-white/10 hover:bg-white/20 rounded-lg p-4 flex-1 min-w-48 transition-all duration-300 hover:scale-105 hover:shadow-neon-primary/10 backdrop-blur-sm border border-white/10">
                <h3 className="font-semibold mb-1">⚡ Performance</h3>
                <p className="text-sm text-blue-100">Carregamento rápido e otimizado</p>
              </div>
              <div className="bg-white/10 hover:bg-white/20 rounded-lg p-4 flex-1 min-w-48 transition-all duration-300 hover:scale-105 hover:shadow-neon-primary/10 backdrop-blur-sm border border-white/10">
                <h3 className="font-semibold mb-1">🔒 Seguro</h3>
                <p className="text-sm text-blue-100">Dados protegidos e criptografados</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
