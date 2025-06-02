import { useState, useEffect } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

type Tables = Database['public']['Tables'];
type CoreRow = Tables['cores']['Row'];
type ItemCorInsert = Tables['item_cores']['Insert'];
type ItemCorRow = Tables['item_cores']['Row'];

type DbResult<T> = {
  data: T | null;
  error: PostgrestError | null;
};

type Cor = CoreRow;
type ItemCor = ItemCorRow & { cor: Cor };

const supabaseTyped = supabase as unknown as SupabaseClient<Database>;

export function useCores() {
  const [cores, setCores] = useState<Cor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const client = supabase;

  const fetchCores = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseTyped
        .from('cores')
        .select()
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      setCores(data || []);
    } catch (err) {
      console.error('Erro ao buscar cores:', err);
      setError('Erro ao carregar cores');
    } finally {
      setLoading(false);
    }
  };

  const addItemCores = async (items: ItemCorInsert[]) => {
    try {
      const { data, error } = await supabaseTyped
        .from('item_cores')
        .insert(items)
        .select('*, cor:cores(*)');

      if (error) throw error;
      return data as ItemCor[];
    } catch (err) {
      console.error('Erro ao adicionar cores:', err);
      throw err;
    }
  };

  const getItensCores = async (ordemId?: string, orcamentoId?: string) => {
    try {
      const conditions = [];
      if (ordemId) conditions.push(['ordem_id', 'eq', ordemId]);
      if (orcamentoId) conditions.push(['orcamento_id', 'eq', orcamentoId]);
      
      const { data, error } = await supabaseTyped
        .from('item_cores')
        .select('*, cor:cores(*)')
        .match(Object.fromEntries(conditions));
      if (error) throw error;
      return data as ItemCor[];
    } catch (err) {
      console.error('Erro ao buscar cores do item:', err);
      throw err;
    }
  };

  const deleteItemCores = async (ordemId?: string, orcamentoId?: string) => {
    try {
      const conditions = [];
      if (ordemId) conditions.push(['ordem_id', 'eq', ordemId]);
      if (orcamentoId) conditions.push(['orcamento_id', 'eq', orcamentoId]);
      
      const { error } = await supabaseTyped
        .from('item_cores')
        .delete()
        .match(Object.fromEntries(conditions));

      if (error) throw error;
    } catch (err) {
      console.error('Erro ao deletar cores:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchCores();
  }, []);

  return {
    cores,
    loading,
    error,
    addItemCores,
    getItensCores,
    deleteItemCores,
    reloadCores: fetchCores
  };
}
