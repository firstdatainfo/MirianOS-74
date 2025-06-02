import React, { useState, useEffect } from 'react';
import { Plus, Minus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { useCores } from '@/hooks/useCores';
import { Database } from '@/types/supabase';

type Tables = Database['public']['Tables'];
type ItemCorInsert = Tables['item_cores']['Insert'];

interface ColorQuantitySelectProps {
  onColorsChange: (colors: ItemCorInsert[]) => void;
  initialColors?: ItemCorInsert[];
}

export function ColorQuantitySelect({ onColorsChange, initialColors = [] }: ColorQuantitySelectProps) {
  const { cores, loading } = useCores();
  const [selectedColors, setSelectedColors] = useState<ItemCorInsert[]>(initialColors);
  const [selectedColorId, setSelectedColorId] = useState<string>('');

  useEffect(() => {
    onColorsChange(selectedColors);
  }, [selectedColors, onColorsChange]);

  const handleAddColor = () => {
    if (cores.length > 0) {
      const availableColor = cores.find(
        (cor) => !selectedColors.some((selected) => selected.cor_id === cor.id)
      );
      
      if (availableColor) {
        setSelectedColors([...selectedColors, { cor_id: availableColor.id, quantidade: 1 }]);
      }
    }
  };

  const handleColorSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const corId = event.target.value;
    if (!corId) return;
    
    setSelectedColors([...selectedColors, { cor_id: corId, quantidade: 1 }]);
    setSelectedColorId('');
  };

  const handleRemoveColor = (colorId: string) => {
    setSelectedColors(selectedColors.filter((item) => item.cor_id !== colorId));
  };

  const handleQuantityChange = (colorId: string, delta: number) => {
    setSelectedColors(
      selectedColors.map((item) => {
        if (item.cor_id === colorId) {
          return {
            ...item,
            quantidade: Math.max(1, item.quantidade + delta)
          };
        }
        return item;
      })
    );
  };

  const handleColorChange = (index: number, corId: string) => {
    const cor = cores.find(c => c.id === corId);
    if (cor) {
      const newColors = [...selectedColors];
      newColors[index] = { ...newColors[index], cor_id: corId };
      setSelectedColors(newColors);
    }
  };

  if (loading) {
    return <div>Carregando cores...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Label>Cores disponíveis</Label>
        <select
          value={selectedColorId}
          onChange={handleColorSelect}
          className="flex-1 h-9 px-3 py-1 rounded-md border border-input bg-background text-sm"
        >
          <option value="">Selecione uma cor</option>
          {cores.map((cor) => (
            <option
              key={cor.id}
              value={cor.id}
              disabled={selectedColors.some((selected) => selected.cor_id === cor.id)}
            >
              {cor.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-4">
        {selectedColors.map((item) => {
          const cor = cores.find(c => c.id === item.cor_id);
          if (!cor) return null;
          
          return (
            <div
              key={item.cor_id}
              className="flex items-center gap-4 p-4 border rounded-lg"
            >
              <div
                className="w-8 h-8 rounded-full border"
                style={{ backgroundColor: cor.codigo_hex }}
              />
              <span className="flex-1">{cor.nome}</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(item.cor_id, -1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{item.quantidade}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(item.cor_id, 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveColor(item.cor_id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
