import React, { useState, FormEvent, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, ClipboardList, Settings, Package, ChevronLeft, ChevronRight, Shirt, X, Loader2, DollarSign, FileDigit, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { enviarOrcamento, getProximaOS } from '@/services/orcamentoService';
import { supabase } from '@/lib';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [valor, setValor] = useState('');
  const [numeroOS, setNumeroOS] = useState<number>(1000);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'document' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Buscar o próximo número de OS disponível
  useEffect(() => {
    const fetchProximaOS = async () => {
      try {
        const proximaOS = await getProximaOS();
        setNumeroOS(proximaOS);
      } catch (error) {
        console.error('Erro ao buscar próxima OS:', error);
        setNumeroOS(1000); // Valor padrão em caso de erro
      }
    };

    fetchProximaOS();
  }, []);

  // Formatar valor monetário
  const formatarValor = (valor: string) => {
    // Remove tudo que não for número
    const apenasNumeros = valor.replace(/\D/g, '');
    
    // Converte para número e formata como moeda
    const numero = parseFloat(apenasNumeros) / 100;
    if (isNaN(numero)) return '';
    
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    });
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarValor(e.target.value);
    setValor(valorFormatado);
  };

  // Obter valor numérico do campo de valor formatado
  const getValorNumerico = (valor: string): number => {
    return parseFloat(
      valor
        .replace(/[^\d,-]/g, '')
        .replace('.', '')
        .replace(',', '.')
    ) || 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        // Verifica o tamanho do arquivo (máx 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (selectedFile.size > maxSize) {
          toast({
            title: "Arquivo muito grande",
            description: "O tamanho máximo permitido é 10MB.",
            variant: "destructive"
          });
          e.target.value = ''; // Limpa o input
          return;
        }

        setFile(selectedFile);
        
        // Verifica se é uma imagem para exibir preview
        if (selectedFile.type.startsWith('image/')) {
          setFileType('image');
          const reader = new FileReader();
          reader.onload = (e) => {
            setFilePreview(e.target?.result as string);
          };
          reader.readAsDataURL(selectedFile);
        } else {
          setFileType('document');
          setFilePreview(null);
        }
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    setFileType(null);
    // Limpa o input file
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, insira o nome do cliente',
        variant: 'destructive',
      });
      return;
    }

    if (!email) {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, insira um e-mail válido',
        variant: 'destructive',
      });
      return;
    }

    if (!phone) {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, insira um telefone para contato',
        variant: 'destructive',
      });
      return;
    }

    if (!valor) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe o valor do orçamento.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Formata o valor para número
      const valorNumerico = parseFloat(
        valor.replace(/[^0-9,]/g, '').replace(',', '.')
      );

      if (isNaN(valorNumerico) || valorNumerico <= 0) {
        throw new Error('Valor do orçamento inválido');
      }

      // Envia o orçamento
      await enviarOrcamento({
        nome: name.trim(),
        email: email.trim(),
        telefone: phone.trim(),
        mensagem: message?.trim(),
        valor: valorNumerico,
        numero_os: numeroOS.toString()
      }, file);
      
      // Limpa o formulário
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setValor('');
      setFile(null);
      setFilePreview(null);
      setFileType(null);
      
      // Busca o próximo número de OS disponível
      try {
        const proximaOS = await getProximaOS();
        setNumeroOS(proximaOS);
      } catch (osError) {
        console.error('Erro ao buscar próxima OS:', osError);
        // Continua mesmo com erro, pois já temos um número válido
      }
      
      // Feedback de sucesso
      setIsSent(true);
      toast({
        title: "Orçamento enviado!",
        description: "O orçamento foi enviado com sucesso.",
        variant: "default"
      });
      
      // Reseta o estado de envio após 3 segundos
      setTimeout(() => {
        setIsSent(false);
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao enviar orçamento:', error);
      
      let errorMessage = 'Ocorreu um erro ao enviar o orçamento. Tente novamente.';
      
      if (error instanceof Error) {
        if (error.message.includes('arquivo é muito grande')) {
          errorMessage = error.message;
        } else if (error.message.includes('upload do arquivo')) {
          errorMessage = 'Não foi possível enviar o anexo. Tente novamente ou envie sem o arquivo.';
        }
      }
      
      toast({
        title: "Erro ao enviar",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const menuItems = [{
    icon: Home,
    label: 'Dashboard',
    path: '/'
  }, {
    icon: Users,
    label: 'Clientes',
    path: '/clientes'
  }, {
    icon: ClipboardList,
    label: 'Ordem de Serviço',
    path: '/ordem-servico'
  }, {
    icon: Package,
    label: 'Acompanhar Pedido',
    path: '/acompanhar-pedido'
  }, {
    icon: Settings,
    label: 'Configurações',
    path: '/configuracoes'
  }];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`bg-gradient-to-b from-white via-gray-50 to-white border-r border-white/20 shadow-xl backdrop-blur-sm transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72 md:w-80'} relative flex flex-col h-full overflow-y-auto`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-gradient-primary text-white rounded-full p-1.5 shadow-neon-primary/30 hover:shadow-neon-primary/50 hover:scale-110 transition-all duration-300 z-10"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <div className="p-4">
        <div className="flex items-center space-x-3">
          <Shirt className="h-8 w-8 text-brand-blue" />
          {!isCollapsed && <h2 className="text-2xl font-bold text-indigo-950">MirianOS</h2>}
        </div>
      </div>

      <nav className="mt-4 flex-1">
        <ul className="space-y-1 px-2">
          {menuItems.map(item => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 p-4 rounded-lg transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-gradient-primary text-white shadow-neon-primary/20 py-2'
                    : 'text-gray-600 hover:bg-white/50 hover:shadow-neon-primary/10 py-2'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <item.icon className={`${isCollapsed ? 'h-5 w-5' : 'h-4 w-4'}`} />
                {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Formulário de Envio de Orçamento */}
      {!isCollapsed && (
        <div className="p-3 border-t border-white/20 bg-gradient-to-t from-gray-50 to-transparent mt-auto">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Enviar Orçamento
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                Nome do Cliente *
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                disabled={isLoading || isSent}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                E-mail *
              </label>
              <Input
                id="email"
                type="email"
                placeholder="cliente@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                disabled={isLoading || isSent}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-1">
                Telefone *
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full"
                disabled={isLoading || isSent}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="valor" className="block text-xs font-medium text-gray-700 mb-1">
                  Valor *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <DollarSign size={16} />
                  </span>
                  <Input
                    id="valor"
                    type="text"
                    placeholder="0,00"
                    value={valor}
                    onChange={handleValorChange}
                    className="w-full pl-8"
                    disabled={isLoading || isSent}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="numero_os" className="block text-xs font-medium text-gray-700 mb-1">
                  Nº OS *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FileDigit size={16} />
                  </span>
                  <Input
                    id="numero_os"
                    type="text"
                    value={numeroOS}
                    disabled={true}
                    className="w-full pl-8 bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-medium text-gray-700 mb-1">
                Mensagem Personalizada (opcional)
              </label>
              <textarea
                id="message"
                rows={3}
                placeholder="Digite uma mensagem personalizada para o cliente..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                disabled={isLoading || isSent}
              />
            </div>
            
            {/* Campo de Anexo */}
            <div>
              <label htmlFor="file" className="block text-xs font-medium text-gray-700 mb-1">
                Anexar Orçamento
              </label>
              <div className="mt-1">
                {/* Preview de imagem ou ícone do documento */}
                {filePreview && fileType === 'image' && (
                  <div className="mb-3 relative group">
                    <img 
                      src={filePreview} 
                      alt="Preview" 
                      className="h-32 w-full object-cover rounded-md border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      title="Remover imagem"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {fileType === 'document' && (
                  <div className="mb-3 p-3 border border-gray-200 rounded-md flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-md mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">{file?.name || 'Documento'}</p>
                        <p className="text-xs text-gray-500">
                          {file?.name.split('.').pop()?.toUpperCase()} • {
                            file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : '0 MB'
                          }
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-gray-400 hover:text-red-500 p-1"
                      title="Remover documento"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Botão de upload */}
                {!file && (
                  <div className="mt-1 flex items-center">
                    <label 
                      htmlFor="file"
                      className={`cursor-pointer flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${isLoading || isSent ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Selecionar Arquivo
                      <input
                        id="file"
                        name="file"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        disabled={isLoading || isSent}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Formatos suportados: PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG (máx. 5MB)
              </p>
            </div>
            
            <Button 
              type="submit" 
              className={`w-full ${
                isSent 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
              } text-white`}
              disabled={isLoading || isSent}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : isSent ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Enviado!
                </>
              ) : (
                'Enviar Orçamento'
              )}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
