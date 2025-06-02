import { supabase } from '@/lib';

export interface DashboardData {
  totalClientes: number;
  crescimentoClientes: number;
  pedidosAtivos: number;
  crescimentoPedidos: number;
  receitaMensal: number;
  crescimentoReceita: number;
  taxaQualidade: number;
  crescimentoQualidade: number;
}

export const getDashboardData = async (): Promise<DashboardData> => {
  const dataAtual = new Date();
  const mesAtual = dataAtual.getMonth();
  const mesAnterior = mesAtual - 1;
  
  // Total de Clientes
  const { count: totalClientesAtual } = await supabase
    .from('clientes')
    .select('*', { count: 'exact' });

  const { count: totalClientesAnterior } = await supabase
    .from('clientes')
    .select('*', { count: 'exact' })
    .lt('data_cadastro', new Date(dataAtual.getFullYear(), mesAtual, 1).toISOString());

  // Pedidos Ativos
  const { count: pedidosAtivosAtual } = await supabase
    .from('ordens_servico')
    .select('*', { count: 'exact' })
    .in('status', ['pendente', 'em_andamento']);

  const { count: pedidosAtivosAnterior } = await supabase
    .from('ordens_servico')
    .select('*', { count: 'exact' })
    .in('status', ['pendente', 'em_andamento'])
    .lt('data_criacao', new Date(dataAtual.getFullYear(), mesAtual, 1).toISOString());

  // Receita Mensal
  const { data: osConcluidasMesAtual } = await supabase
    .from('ordens_servico')
    .select('valor')
    .eq('status', 'concluido')
    .gte('data_conclusao', new Date(dataAtual.getFullYear(), mesAtual, 1).toISOString())
    .lte('data_conclusao', new Date(dataAtual.getFullYear(), mesAtual + 1, 0).toISOString());

  const { data: osConcluidasMesAnterior } = await supabase
    .from('ordens_servico')
    .select('valor')
    .eq('status', 'concluido')
    .gte('data_conclusao', new Date(dataAtual.getFullYear(), mesAnterior, 1).toISOString())
    .lte('data_conclusao', new Date(dataAtual.getFullYear(), mesAtual, 0).toISOString());

  const receitaMesAtual = osConcluidasMesAtual?.reduce((acc, os) => acc + Number(os.valor), 0) || 0;
  const receitaMesAnterior = osConcluidasMesAnterior?.reduce((acc, os) => acc + Number(os.valor), 0) || 0;

  // Taxa de Qualidade (baseada em OS concluídas sem reclamações)
  const { count: totalOSConcluidasMesAtual } = await supabase
    .from('ordens_servico')
    .select('*', { count: 'exact' })
    .eq('status', 'concluido')
    .gte('data_conclusao', new Date(dataAtual.getFullYear(), mesAtual, 1).toISOString());

  const { count: totalOSConcluidasMesAnterior } = await supabase
    .from('ordens_servico')
    .select('*', { count: 'exact' })
    .eq('status', 'concluido')
    .gte('data_conclusao', new Date(dataAtual.getFullYear(), mesAnterior, 1).toISOString())
    .lte('data_conclusao', new Date(dataAtual.getFullYear(), mesAtual, 0).toISOString());

  // Cálculo das taxas de crescimento
  const crescimentoClientes = calcularCrescimento(totalClientesAnterior || 0, totalClientesAtual || 0);
  const crescimentoPedidos = calcularCrescimento(pedidosAtivosAnterior || 0, pedidosAtivosAtual || 0);
  const crescimentoReceita = calcularCrescimento(receitaMesAnterior, receitaMesAtual);
  
  // Taxa de qualidade (exemplo: 98.5% para mês atual e 96.4% para mês anterior)
  const taxaQualidadeAtual = 98.5;
  const taxaQualidadeAnterior = 96.4;
  const crescimentoQualidade = calcularCrescimento(taxaQualidadeAnterior, taxaQualidadeAtual);

  return {
    totalClientes: totalClientesAtual || 0,
    crescimentoClientes,
    pedidosAtivos: pedidosAtivosAtual || 0,
    crescimentoPedidos,
    receitaMensal: receitaMesAtual,
    crescimentoReceita,
    taxaQualidade: taxaQualidadeAtual,
    crescimentoQualidade
  };
};

const calcularCrescimento = (valorAnterior: number, valorAtual: number): number => {
  if (valorAnterior === 0) return 100;
  return Number((((valorAtual - valorAnterior) / valorAnterior) * 100).toFixed(1));
};
