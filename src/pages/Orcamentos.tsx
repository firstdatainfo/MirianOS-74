import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ColorQuantitySelect } from '@/components/ColorQuantitySelect';
import { Database } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Calculator, Plus, Search, Edit, Eye, CheckCircle, XCircle, ClipboardList, FileEdit, Check, X } from 'lucide-react';

interface Orcamento {
  id: string;
  cliente: string;
  entrada: string;
  saida: string;
  observacoes: string;
  pedido: {
    corte: string;
    estampa: string;
    costura: string;
  };
  tipo: {
    manga: string;
    barra: string;
    gola: string;
  };
  qualidade: string;
  precoUnitario: number;
  tipoTecido: string;
  apresentar: boolean;
  tamanho: string;
  quantidade: number;
  acabamento: string;
  valor: number;
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'expirado';
  validade: string;
  dataCriacao: string;
  dataAprovacao?: string;
}

type Tables = Database['public']['Tables'];
type OrcamentoRow = Tables['orcamentos']['Row'];
type OrcamentoInsert = Tables['orcamentos']['Insert'];

interface ItemCorInsert {
  cor_id: string;
  quantidade: number;
}

interface ItemOrcamentoInsert {
  cor: string;
  quantidade: number;
  orcamento_id: string;
  preco_unitario: number;
  preco_total: number;
}

interface FormData {
  cliente: string;
  servico: string;
  valor: number;
  validade: string;
}

interface OrcamentoDisplay {
  id: string;
  cliente: string;
  servico: string;
  valor: number;
  status: string;
  validade: string;
  created_at: string;
}

const Orcamentos = () => {
  const navigate = useNavigate();
  
  const [orcamentos, setOrcamentos] = useState<OrcamentoDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedColors, setSelectedColors] = useState<ItemCorInsert[]>([]);
  const [formData, setFormData] = useState<FormData>({
    cliente: '',
    servico: '',
    valor: 0,
    validade: ''
  });

  const fetchOrcamentos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orcamentos')
        .select(`
          id,
          cliente:cliente_id,
          servico:descricao,
          valor:valor_total,
          status,
          validade:data_validade,
          created_at:data_orcamento
        `)
        .order('data_orcamento', { ascending: false });

      if (error) throw error;
      setOrcamentos(data || []);
    } catch (error) {
      console.error('Erro ao buscar orçamentos:', error);
      toast.error('Erro ao buscar orçamentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrcamentos();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true);

      const { data: orcamento, error: orcamentoError } = await supabase
        .from('orcamentos')
        .insert({
          cliente_id: formData.cliente,
          descricao: formData.servico,
          valor_total: formData.valor,
          data_validade: formData.validade || new Date().toISOString().split('T')[0],
          status: 'pendente',
          numero_orcamento: `ORC-${Date.now()}`,
          data_orcamento: new Date().toISOString()
        })
        .select()
        .single();

      if (orcamentoError) throw orcamentoError;
      if (!orcamento) throw new Error('Orçamento não foi criado');

      if (selectedColors.length > 0) {
        const itemCores = selectedColors.map(item => ({
          cor: item.cor_id,
          quantidade: item.quantidade,
          orcamento_id: orcamento.id,
          preco_unitario: formData.valor / selectedColors.reduce((acc, cur) => acc + cur.quantidade, 0),
          preco_total: formData.valor
        }));

        const { error: coresError } = await supabase
          .from('itens_orcamento')
          .insert(itemCores);

        if (coresError) throw coresError;
      }

      setFormData({
        cliente: '',
        servico: '',
        valor: 0,
        validade: ''
      });
      setSelectedColors([]);

      toast.success('Orçamento criado com sucesso!');
      setShowDialog(false);
      fetchOrcamentos();
    } catch (error) {
      console.error('Erro ao criar orçamento:', error);
      toast.error('Erro ao criar orçamento');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    // Implementar edição de orçamento
  };

  const handleAprovar = (id: string) => {
    // Implementar aprovação de orçamento
  };

  const handleDelete = (id: string) => {
    // Implementar exclusão de orçamento
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orçamentos</h1>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Orçamento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orcamentos.map((orcamento) => (
          <div key={orcamento.id} className="p-4 border rounded-lg space-y-4">
            <div>
              <h2 className="text-xl font-semibold">{orcamento.cliente}</h2>
              <p className="text-muted-foreground">{orcamento.servico}</p>
            </div>
            <div className="space-y-2">
              <p><strong>Valor:</strong> R$ {orcamento.valor.toFixed(2)}</p>
              <p><strong>Status:</strong> {orcamento.status}</p>
              <p><strong>Validade:</strong> {new Date(orcamento.validade).toLocaleDateString('pt-BR')}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(orcamento.id)}
              >
                <FileEdit className="w-4 h-4 mr-2" />
                Editar
              </Button>
              {orcamento.status === 'pendente' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAprovar(orcamento.id)}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Aprovar
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="text-destructive"
                onClick={() => handleDelete(orcamento.id)}
              >
                <X className="w-4 h-4 mr-2" />
                Excluir
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Orçamento</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Input
                  id="cliente"
                  name="cliente"
                  value={formData.cliente}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="servico">Serviço</Label>
                <Input
                  id="servico"
                  name="servico"
                  value={formData.servico}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valor">Valor</Label>
                <Input
                  id="valor"
                  name="valor"
                  type="number"
                  value={formData.valor}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validade">Validade</Label>
                <Input
                  id="validade"
                  name="validade"
                  type="date"
                  value={formData.validade}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <ColorQuantitySelect
                onColorsChange={setSelectedColors}
                initialColors={selectedColors}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orcamentos;
