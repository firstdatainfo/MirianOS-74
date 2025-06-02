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
        .select('*');

      if (error) throw error;

      // Transforma os dados do banco no formato esperado pelo estado
      const formattedData = data.reduce((acc: ConfigState, item) => {
        const categoria = item.categoria as ConfigCategory;
        if (!acc[categoria]) {
          acc[categoria] = [];
        }
        acc[categoria].push({
          id: item.id,
          value: item.valor
        });
        return acc;
      }, {} as ConfigState);

      setConfigs(formattedData);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar configurações:', err);
      setError('Erro ao carregar configurações');
      window.alert('Erro ao carregar configurações. Por favor, tente novamente.');
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
        setConfigs(prev => ({
          ...prev,
          [category]: [
            ...(prev[category] || []),
            { id: newItem.id, value: newItem.valor }
          ]
        }));
        window.alert('Item adicionado com sucesso!');
        return true;
      }
    } catch (err) {
      console.error('Erro ao adicionar item:', err);
      window.alert('Erro ao adicionar item. Por favor, tente novamente.');
      return false;
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
