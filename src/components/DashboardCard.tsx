
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: 'up' | 'down';
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend 
}) => {
  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 hover:shadow-xl hover:shadow-neon-primary/20 transition-all duration-300 animate-fade-in backdrop-blur-sm border border-white/20 hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium bg-gradient-primary bg-clip-text text-transparent">
          {title}
        </CardTitle>
        <div className="p-2 rounded-full bg-gradient-primary/10 backdrop-blur-sm animate-pulse-slow">
          <Icon className="h-5 w-5 text-vibrant-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold bg-gradient-secondary bg-clip-text text-transparent animate-float">
          {value}
        </div>
        <p className={`text-xs font-medium ${trend === 'up' ? 'text-vibrant-success' : 'text-vibrant-danger'} flex items-center gap-1 animate-bounce-soft`}>
          {change} em relação ao mês anterior
        </p>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
