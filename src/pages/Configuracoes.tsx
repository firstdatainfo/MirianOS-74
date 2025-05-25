
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Plus, Trash2 } from 'lucide-react';

interface ConfigItem {
  id: string;
  value: string;
}

interface Configs {
  qualidades: ConfigItem[];
  tiposManga: ConfigItem[];
  tiposBarra: ConfigItem[];
  tiposGola: ConfigItem[];
  tiposTecido: ConfigItem[];
  tamanhos: ConfigItem[];
}

const Configuracoes = () => {
  const [configs, setConfigs] = useState<Configs>({
    qualidades: [
      { id: '1', value: 'M' },
      { id: '2', value: 'G' },
      { id: '3', value: 'P' }
    ],
    tiposManga: [
      { id: '1', value: 'Normal' },
      { id: '2', value: 'OR' }
    ],
    tiposBarra: [
      { id: '1', value: 'Silk' },
      { id: '2', value: 'Sub' }
    ],
    tiposGola: [
      { id: '1', value: 'Redondo' },
      { id: '2', value: 'Polo' }
    ],
    tiposTecido: [
      { id: '1', value: 'Algodão' },
      { id: '2', value: 'Poliéster' },
      { id: '3', value: 'Viscose' }
    ],
    tamanhos: [
      { id: '1', value: 'P' },
      { id: '2', value: 'M' },
      { id: '3', value: 'G' },
      { id: '4', value: 'GG' }
    ]
  });

  const [newValues, setNewValues] = useState({
    qualidades: '',
    tiposManga: '',
    tiposBarra: '',
    tiposGola: '',
    tiposTecido: '',
    tamanhos: ''
  });

  const addItem = (category: keyof Configs) => {
    const value = newValues[category].trim();
    if (value) {
      const newItem: ConfigItem = {
        id: Date.now().toString(),
        value
      };
      setConfigs(prev => ({
        ...prev,
        [category]: [...prev[category], newItem]
      }));
      setNewValues(prev => ({ ...prev, [category]: '' }));
    }
  };

  const removeItem = (category: keyof Configs, id: string) => {
    setConfigs(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== id)
    }));
  };

  const ConfigSection = ({ 
    title, 
    category, 
    items 
  }: { 
    title: string; 
    category: keyof Configs; 
    items: ConfigItem[] 
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder={`Novo ${title.toLowerCase()}`}
            value={newValues[category]}
            onChange={(e) => setNewValues(prev => ({ ...prev, [category]: e.target.value }))}
            onKeyPress={(e) => e.key === 'Enter' && addItem(category)}
          />
          <Button onClick={() => addItem(category)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span>{item.value}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(category, item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

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
