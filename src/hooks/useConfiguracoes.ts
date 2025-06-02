import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
// Importações removidas para usar alertas do sistema

export interface ConfigItem {
  id: string;
  categoria: string;
  chave: string;
  valor: string;
  descricao: string | null;
}

export type ConfigCategory = 'qualidades' | 'tiposManga' | 'tiposBarra' | 'tiposGola' | 'tiposTecido' | 'tamanhos';

interface ConfigState {
  qualidades: Array<{ id: string; value: string }>;
  tiposManga: Array<{ id: string; value: string }>;
  tiposBarra: Array<{ id: string; value: string }>;
  tiposGola: Array<{ id: string; value: string }>;
  tiposTecido: Array<{ id: string; value: string }>;
  tamanhos: Array<{ id: string; value: string }>;
  [key: string]: Array<{ id: string; value: string }>; // Para acesso dinâmico
}

export function useConfiguracoes() {
  const [configs, setConfigs] = useState<ConfigState>({
    qualidades: [],
    tiposManga: [],
    tiposBarra: [],
    tiposGola: [],
    tiposTecido: [],
    tamanhos: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carrega todas as configurações do banco de dados
  const loadConfigs = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .order('valor', { ascending: true }); // Ordena os itens

      if (error) throw error;

      // Inicializa o estado com arrays vazios para todas as categorias
      const initialState: ConfigState = {
        qualidades: [],
        tiposManga: [],
        tiposBarra: [],
        tiposGola: [],
        tiposTecido: [],
        tamanhos: []
      };

      // Preenche os arrays com os dados do banco
      const normalizarCategoria = (categoria: string): string => {
        // Remove underscores e converte para lowercase
        const normalizada = categoria.toLowerCase().replace(/_/g, '');
        
        // Mapeamento de categorias
        const mapeamento: { [key: string]: string } = {
          'tiposmanga': 'tiposManga',
          'tiposbarra': 'tiposBarra',
          'tiposgola': 'tiposGola',
          'tipostecido': 'tiposTecido',
          'qualidades': 'qualidades',
          'tamanhos': 'tamanhos'
        };
        
        return mapeamento[normalizada] || normalizada;
      };

      const formattedData = data.reduce((acc, item) => {
        const categoria = normalizarCategoria(item.categoria) as ConfigCategory;
        if (acc[categoria]) {
          acc[categoria].push({
            id: item.id,
            value: item.valor
          });
        }
        return acc;
      }, { ...initialState });

      console.log('Dados formatados:', formattedData);
      setConfigs(formattedData);
      setError(null);
      return formattedData; // Retorna os dados para uso imediato se necessário
    } catch (err) {
      console.error('Erro ao carregar configurações:', err);
      setError('Erro ao carregar configurações');
      throw err; // Propaga o erro para quem chamou
    } finally {
      setLoading(false);
    }
  }, []);

  // Adiciona um novo item de configuração
  const addItem = async (category: ConfigCategory, value: string) => {
    try {
      const { data, error } = await supabase
        .from('configuracoes')
        .insert([
          { 
            categoria: category,
            chave: `${category}_${Date.now()}`,
            valor: value,
            descricao: null
          }
        ])
        .select();

      if (error) throw error;
      
      if (data && data[0]) {
        const newItem = data[0];
        // Não atualizamos o estado local aqui, vamos confiar no reload
        return true;
      }
      return false;
    } catch (err) {
      console.error('Erro ao adicionar item:', err);
      throw err; // Propagar o erro para ser tratado no componente
    }
  };

  // Remove um item de configuração
  const removeItem = async (category: ConfigCategory, id: string) => {
    try {
      const { error } = await supabase
        .from('configuracoes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setConfigs(prev => ({
        ...prev,
        [category]: prev[category].filter(item => item.id !== id)
      }));
      
      window.alert('Item removido com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao remover item:', err);
      window.alert('Erro ao remover item. Por favor, tente novamente.');
      return false;
    }
  };

  // Carrega as configurações quando o hook é montado
  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  return {
    configs,
    loading,
    error,
    addItem,
    removeItem,
    reload: loadConfigs
  };
}
