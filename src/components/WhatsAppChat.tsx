import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, X, User, Phone, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface WhatsAppChatProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const WhatsAppChat: React.FC<WhatsAppChatProps> = ({ isExpanded, onToggle }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'client'; time: string }[]>([]);
  const [input, setInput] = useState('');
  const [currentContact, setCurrentContact] = useState<string | null>(null);
  
  // Mock contacts data - in real app, these would come from WhatsApp API
  const contacts = [
    { name: 'João Silva', phone: '+55 11 9999-8888', unread: 3 },
    { name: 'Maria Oliveira', phone: '+55 11 8888-7777', unread: 0 },
    { name: 'Carlos Santos', phone: '+55 11 7777-6666', unread: 1 },
  ];

  // Mock connect to WhatsApp Web
  const connectWhatsApp = () => {
    setIsConnected(false);
    // Simulating connection process
    setTimeout(() => {
      setIsConnected(true);
      // Mock initial messages
      if (currentContact) {
        setMessages([
          { 
            text: 'Olá, gostaria de saber sobre meu pedido', 
            sender: 'client',
            time: '09:45' 
          },
          { 
            text: 'Claro! Qual o número do seu pedido?', 
            sender: 'user', 
            time: '09:47'
          },
        ]);
      }
    }, 2000);
  };

  // Handle message send
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const newMessage = {
      text: input,
      sender: 'user' as const,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setInput('');
    
    // Simulate reply after 1-3 seconds
    if (currentContact) {
      setTimeout(() => {
        const replies = [
          'Obrigado pela informação!',
          'Entendi, vou verificar.',
          'OK, aguardo retorno.',
          'Perfeito, muito obrigado!'
        ];
        
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        
        setMessages(prev => [...prev, {
          text: randomReply,
          sender: 'client',
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1000 + Math.random() * 2000);
    }
  };

  // Select a contact to chat with
  const selectContact = (name: string) => {
    setCurrentContact(name);
    connectWhatsApp();
  };

  return (
    <div className={`bg-white border-l border-gray-200 flex flex-col transition-all duration-300 h-full shadow-lg ${isExpanded ? 'w-full md:w-96' : 'w-0'}`}>
      {isExpanded && (
        <>
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <h3 className="font-medium">WhatsApp Web</h3>
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-green-700" onClick={onToggle}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {!isConnected ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="bg-green-500/10 rounded-full p-4 mb-4">
                <MessageSquare className="h-10 w-10 text-green-500" />
              </div>
              <h3 className="text-lg font-medium mb-3">Conecte-se ao WhatsApp</h3>
              <p className="text-gray-500 text-center mb-6">
                Integre o sistema com o WhatsApp Web para atender seus clientes diretamente pelo sistema.
              </p>
              <Button 
                onClick={connectWhatsApp}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Conectar WhatsApp
              </Button>
            </div>
          ) : (
            <>
              {!currentContact ? (
                <div className="flex-1 flex flex-col">
                  <div className="p-3 border-b border-gray-200">
                    <Input 
                      placeholder="Buscar contato..." 
                      className="h-9"
                    />
                  </div>
                  <div className="overflow-y-auto flex-1">
                    {contacts.map((contact, idx) => (
                      <button
                        key={idx}
                        onClick={() => selectContact(contact.name)}
                        className="flex items-center gap-3 p-3 w-full hover:bg-gray-50 border-b border-gray-100"
                      >
                        <div className="bg-gray-200 rounded-full p-2">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex justify-between">
                            <span className="font-medium">{contact.name}</span>
                            <span className="text-xs text-gray-400">10:30</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500">{contact.phone}</span>
                            {contact.unread > 0 && (
                              <span className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {contact.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-gray-100 p-3 flex items-center gap-3 border-b border-gray-200">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="p-0" 
                      onClick={() => setCurrentContact(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="bg-gray-200 rounded-full p-2">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{currentContact}</p>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-xs text-gray-500">Online</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-gray-500">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex-1 bg-gray-50 p-3 overflow-y-auto flex flex-col gap-3">
                    {messages.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.sender === 'user' 
                            ? 'bg-green-100 self-end' 
                            : 'bg-white self-start border border-gray-200'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <span className="text-xs text-gray-500 block text-right">{msg.time}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-200 p-3 flex gap-2">
                    <Input 
                      placeholder="Digite uma mensagem..." 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!input.trim()} 
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default WhatsAppChat;
