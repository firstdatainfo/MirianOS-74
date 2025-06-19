import React, { useState } from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNotificacoes } from '@/hooks/useNotificacoes';

const Header = () => {
  const [mostrarNotificacoes, setMostrarNotificacoes] = useState(false);
  const { data: notificacoes = [] } = useNotificacoes();
  
  const notificacaoNaoLidas = notificacoes.filter(n => !n.lida).length;

  return (
    <header className="bg-gradient-to-b from-white to-gray-50 border-b border-white/20 backdrop-blur-sm px-6 py-4 flex items-center justify-between shadow-sm relative z-50">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-glow">
          ServicePro
        </h1>
      </div>
      
      <div className="flex items-center space-x-4 flex-1 max-w-xl mx-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Buscar clientes, pedidos..." 
            className="pl-10 bg-white/50 border border-white/20 focus:bg-white focus:border-primary/20 focus:shadow-neon-primary/20 transition-all duration-300 backdrop-blur-sm"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105"
            onClick={() => setMostrarNotificacoes(!mostrarNotificacoes)}
          >
            <Bell className="h-5 w-5" />
            {notificacaoNaoLidas > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-gradient-danger text-white text-xs rounded-full h-5 w-5 flex items-center justify-center p-0 min-w-[20px] shadow-neon-danger/30 animate-pulse-slow">
                {notificacaoNaoLidas > 9 ? '9+' : notificacaoNaoLidas}
              </Badge>
            )}
          </Button>
          
          {mostrarNotificacoes && (
            <div className="absolute right-0 mt-2 w-80 bg-gradient-to-b from-white to-gray-50 border border-white/20 rounded-lg shadow-neon-primary/10 backdrop-blur-sm z-50 max-h-96 overflow-y-auto animate-fade-up">
              <div className="p-4 border-b border-white/20 bg-gradient-to-r from-primary/5 to-transparent">
                <h3 className="font-semibold text-gray-900">Notificações</h3>
              </div>
              
              {notificacoes.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Nenhuma notificação
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {notificacoes.map((notificacao) => (
                    <div 
                      key={notificacao.id} 
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                        !notificacao.lida ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notificacao.tipo === 'ordem_atrasada' ? 'bg-red-500' :
                          notificacao.tipo === 'etapa_concluida' ? 'bg-green-500' :
                          'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">
                            {notificacao.titulo}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notificacao.mensagem}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notificacao.data_criacao).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <Button variant="ghost" size="sm">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
