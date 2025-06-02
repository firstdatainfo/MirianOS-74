
import React, { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Plus, Trash2, Check, X, Loader2 } from 'lucide-react';
// Removida importação do toast, usando alertas do sistema
import { useConfiguracoes } from '@/hooks/useConfiguracoes';

type ConfigCategory = 'qualidades' | 'tiposManga' | 'tiposBarra' | 'tiposGola' | 'tiposTecido' | 'tamanhos';

interface ConfigItem {
  id: string;
  value: string;
  categoria?: string;
  chave?: string;
  descricao?: string | null;
}

const Configuracoes = () => {
  const {
    configs,
    loading,
    error,
    addItem,
    removeItem,
    reload
  } = useConfiguracoes();

  const [localValues, setLocalValues] = useState<Record<ConfigCategory, string>>({
    qualidades: '',
    tiposManga: '',
    tiposBarra: '',
    tiposGola: '',
    tiposTecido: '',
    tamanhos: ''
  });

  const [isAdding, setIsAdding] = useState<Record<ConfigCategory, boolean>>({
    qualidades: false,
    tiposManga: false,
    tiposBarra: false,
    tiposGola: false,
    tiposTecido: false,
    tamanhos: false
  });

  const handleAddItem = async (category: ConfigCategory) => {
    const value = localValues[category].trim();
    if (!value) {
      window.alert('Por favor, digite um valor');
      return;
    }

    try {
      setIsAdding(prev => ({ ...prev, [category]: true }));
      const success = await addItem(category, value);
      if (success) {
        window.alert('Item adicionado com sucesso!');
        setLocalValues(prev => ({ ...prev, [category]: '' }));
      }
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      window.alert('Erro ao adicionar item. Por favor, tente novamente.');
    } finally {
      setIsAdding(prev => ({ ...prev, [category]: false }));
    }
  };

  const handleRemoveItem = async (category: ConfigCategory, id: string, value: string) => {
    if (!window.confirm(`Tem certeza que deseja remover "${value}"?\n\nEsta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await removeItem(category, id);
    } catch (error) {
      console.error('Erro ao remover item:', error);
      window.alert('Erro ao remover item. Por favor, tente novamente.');
    }
  };

  const ConfigSection = ({
    title,
    category,
    items = []
  }: {
    title: string;
    category: ConfigCategory;
    items: ConfigItem[];
  }) => {
    const [localValue, setLocalValue] = useState('');

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && localValue.trim()) {
        handleAddItem(category);
      }
    };

    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Input
                placeholder={`Adicionar ${title.toLowerCase()}`}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10"
                disabled={isAdding[category]}
              />
              {localValue && (
                <button
                  onClick={() => setLocalValue('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isAdding[category]}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button 
              onClick={() => {
                setLocalValue('');
                handleAddItem(category);
              }}
              disabled={!localValue.trim() || isAdding[category]}
              className="shrink-0 h-auto py-1.5 px-3 flex flex-col items-center"
              size="sm"
            >
              {isAdding[category] ? (
                <Loader2 className="h-4 w-4 mb-0.5 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mb-0.5" />
                  <span className="text-xs leading-none">Adicionar</span>
                </>
              )}
            </Button>
          </div>
          
          <div className="border rounded-lg overflow-hidden flex-1">
            {loading ? (
              <div className="h-full flex items-center justify-center p-6">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : error ? (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <p className="text-red-500 text-sm mb-2">Erro ao carregar itens</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={reload}
                  className="text-xs"
                >
                  Tentar novamente
                </Button>
              </div>
            ) : items.length > 0 ? (
              <div className="divide-y">
                {items.map(item => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="font-medium">{item.value}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(category, item.id, item.value)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      title="Remover item"
                      disabled={isAdding[category]}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-6 text-center">
                <p className="text-gray-500 text-sm">
                  Nenhum item cadastrado. Adicione um novo item acima.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center space-x-3">
            <Settings className="h-8 w-8 text-brand-blue" />
            <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ConfigSection
              title="Qualidades"
              category="qualidades"
              items={configs.qualidades}
            />
            <ConfigSection
              title="Tipos de Manga"
              category="tiposManga"
              items={configs.tiposManga}
            />
            <ConfigSection
              title="Tipos de Barra"
              category="tiposBarra"
              items={configs.tiposBarra}
            />
            <ConfigSection
              title="Tipos de Gola"
              category="tiposGola"
              items={configs.tiposGola}
            />
            <ConfigSection
              title="Tipos de Tecido"
              category="tiposTecido"
              items={configs.tiposTecido}
            />
            <ConfigSection
              title="Tamanhos"
              category="tamanhos"
              items={configs.tamanhos}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Configuracoes;
