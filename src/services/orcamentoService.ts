import { supabase } from '@/lib';

export interface OrcamentoData {
  nome: string;
  email: string;
  telefone: string;
  mensagem?: string;
  valor: number;
  numero_os: string;
  arquivo_url?: string;
  status?: string;
  data_criacao?: string;
}

export const enviarOrcamento = async (data: OrcamentoData, file?: File): Promise<OrcamentoData> => {
  try {
    let fileUrl = '';
    
    // Upload do arquivo se existir
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`;
      const filePath = `orcamentos/${fileName}`;
      
      // Verifica o tamanho do arquivo (máx 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('O arquivo é muito grande. Tamanho máximo permitido: 10MB');
      }
      
      const { error: uploadError } = await supabase.storage
        .from('orcamentos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error('Erro no upload do arquivo:', uploadError);
        throw new Error('Erro ao fazer upload do arquivo. Tente novamente.');
      }
      
      // Obtém a URL pública do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from('orcamentos')
        .getPublicUrl(filePath);
      
      fileUrl = publicUrl;
    }
    
    // Formata os dados para o formato esperado pelo banco
    const orcamentoData = {
      ...data,
      arquivo_url: fileUrl || null,
      status: 'pendente',
      data_criacao: new Date().toISOString(),
      valor: Number(data.valor) // Garante que o valor seja um número
    };
    
    // Salva os dados do orçamento
    const { data: orcamento, error } = await supabase
      .from('orcamentos')
      .insert([orcamentoData])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao salvar orçamento:', error);
      throw new Error('Erro ao salvar os dados do orçamento.');
    }

    // Envia o e-mail de notificação
    try {
      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          ...data,
          arquivo_url: fileUrl || null,
          valor: data.valor.toString()
        }
      });

      if (emailError) {
        console.error('Erro ao enviar e-mail:', emailError);
        // Não interrompe o fluxo, apenas registra o erro
      }
    } catch (emailError) {
      console.error('Erro ao enviar e-mail:', emailError);
      // Não interrompe o fluxo, apenas registra o erro
    }
    
    return orcamento as OrcamentoData;
  } catch (error) {
    console.error('Erro ao enviar orçamento:', error);
    throw error instanceof Error ? error : new Error('Ocorreu um erro inesperado');
  }
};

// Função para buscar o próximo número de OS disponível
export const getProximaOS = async (): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('ordens_servico')
      .select('numero_os')
      .order('numero_os', { ascending: false })
      .limit(1)
      .single();

    // Se não encontrar registros, começa do 1000
    if (error && error.code === 'PGRST116') {
      return 1000;
    }
    
    // Se houver outro erro, lança exceção
    if (error) {
      throw error;
    }

    // Se encontrar registros, retorna o próximo número
    if (data && data.numero_os) {
      const ultimoNumero = typeof data.numero_os === 'string' 
        ? parseInt(data.numero_os, 10) 
        : data.numero_os;
      return isNaN(ultimoNumero) ? 1000 : ultimoNumero + 1;
    }

    return 1000; // Valor padrão
  } catch (error) {
    console.error('Erro ao buscar próxima OS:', error);
    // Em caso de erro, retorna um número aleatório entre 1000 e 9999
    // para não travar o fluxo do usuário
    return Math.floor(1000 + Math.random() * 9000);
  }
};
