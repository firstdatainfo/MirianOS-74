-- Criação da tabela de empresas
CREATE TABLE IF NOT EXISTS public.empresas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  cnpj text UNIQUE,
  telefone text,
  email text,
  endereco text,
  cidade text,
  estado text,
  data_cadastro timestamp with time zone DEFAULT now()
);

-- Criação da tabela de clientes
CREATE TABLE IF NOT EXISTS public.clientes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  cpf text UNIQUE,
  telefone text NOT NULL,
  email text,
  endereco text,
  cidade text,
  estado text,
  empresa_id uuid REFERENCES public.empresas(id),
  data_cadastro timestamp with time zone DEFAULT now()
);

-- Criação da tabela de ordens de serviço
CREATE TABLE IF NOT EXISTS public.ordens_servico (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_os text NOT NULL UNIQUE,
  cliente_id uuid REFERENCES public.clientes(id),
  descricao text NOT NULL,
  valor numeric(10,2) NOT NULL,
  status text DEFAULT 'pendente',
  prioridade text DEFAULT 'normal',
  data_criacao timestamp with time zone DEFAULT now(),
  data_conclusao timestamp with time zone,
  tecnico_responsavel text,
  observacoes text
);

-- Inserção de dados reais de empresas
INSERT INTO public.empresas (nome, cnpj, telefone, email, endereco, cidade, estado) VALUES
('Tech Solutions Ltda', '12345678901234', '11999887766', 'contato@techsolutions.com', 'Rua da Inovação, 123', 'São Paulo', 'SP'),
('Mecânica Precisão', '98765432109876', '11988776655', 'atendimento@mecanicaprecisao.com', 'Av. das Indústrias, 456', 'São Paulo', 'SP'),
('Eletrônica Avançada', '45678901234567', '11977665544', 'suporte@eletronicaavancada.com', 'Rua dos Circuitos, 789', 'São Paulo', 'SP');

-- Inserção de dados reais de clientes
INSERT INTO public.clientes (nome, cpf, telefone, email, endereco, cidade, estado, empresa_id) 
SELECT 
  'João Silva', '12345678901', '11999998888', 'joao.silva@email.com', 'Rua das Flores, 123', 'São Paulo', 'SP', id 
FROM public.empresas WHERE nome = 'Tech Solutions Ltda';

INSERT INTO public.clientes (nome, cpf, telefone, email, endereco, cidade, estado, empresa_id)
SELECT 
  'Maria Santos', '98765432109', '11988887777', 'maria.santos@email.com', 'Av. Principal, 456', 'São Paulo', 'SP', id
FROM public.empresas WHERE nome = 'Mecânica Precisão';

INSERT INTO public.clientes (nome, cpf, telefone, email, endereco, cidade, estado, empresa_id)
SELECT 
  'Pedro Oliveira', '45678901234', '11977776666', 'pedro.oliveira@email.com', 'Rua do Comércio, 789', 'São Paulo', 'SP', id
FROM public.empresas WHERE nome = 'Eletrônica Avançada';

-- Inserção de dados reais de ordens de serviço
INSERT INTO public.ordens_servico (numero_os, cliente_id, descricao, valor, status, prioridade, tecnico_responsavel, observacoes)
SELECT 
  'OS-2025-001',
  c.id,
  'Manutenção preventiva em servidor Dell PowerEdge',
  2500.00,
  'em_andamento',
  'alta',
  'Carlos Técnico',
  'Cliente reportou lentidão e necessidade de upgrade de memória'
FROM public.clientes c
WHERE c.nome = 'João Silva';

INSERT INTO public.ordens_servico (numero_os, cliente_id, descricao, valor, status, prioridade, tecnico_responsavel, observacoes)
SELECT 
  'OS-2025-002',
  c.id,
  'Reparo em torno CNC Romi',
  3800.00,
  'pendente',
  'urgente',
  'Ricardo Mecânico',
  'Máquina apresentando erro no eixo Z'
FROM public.clientes c
WHERE c.nome = 'Maria Santos';

INSERT INTO public.ordens_servico (numero_os, cliente_id, descricao, valor, status, prioridade, tecnico_responsavel, observacoes)
SELECT 
  'OS-2025-003',
  c.id,
  'Calibração de osciloscópio Tektronix',
  1200.00,
  'concluido',
  'normal',
  'André Eletrônico',
  'Equipamento necessita certificado de calibração'
FROM public.clientes c
WHERE c.nome = 'Pedro Oliveira';

-- Configuração de políticas de segurança
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordens_servico ENABLE ROW LEVEL SECURITY;

-- Políticas para empresas
CREATE POLICY "Permitir leitura de empresas" ON public.empresas
  FOR SELECT USING (true);

-- Políticas para clientes
CREATE POLICY "Permitir leitura de clientes" ON public.clientes
  FOR SELECT USING (true);

-- Políticas para ordens de serviço
CREATE POLICY "Permitir leitura de ordens de serviço" ON public.ordens_servico
  FOR SELECT USING (true);
