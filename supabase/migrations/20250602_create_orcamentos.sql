-- Cria a tabela de orçamentos se não existir
CREATE TABLE IF NOT EXISTS public.orcamentos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text NOT NULL,
  telefone text NOT NULL,
  mensagem text,
  valor numeric(10,2) NOT NULL,
  numero_os text NOT NULL,
  arquivo_url text,
  status text DEFAULT 'pendente'::text,
  data_criacao timestamp with time zone DEFAULT now(),
  CONSTRAINT orcamentos_pkey PRIMARY KEY (id)
);

-- Cria políticas de segurança para a tabela de orçamentos
ALTER TABLE public.orcamentos ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de orçamentos
CREATE POLICY "Permitir inserção de orçamentos" ON public.orcamentos
  FOR INSERT WITH CHECK (true);

-- Política para permitir leitura de orçamentos
CREATE POLICY "Permitir leitura de orçamentos" ON public.orcamentos
  FOR SELECT USING (true);

-- Cria bucket para armazenamento de arquivos se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('orcamentos', 'orcamentos', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir upload de arquivos no bucket orcamentos
CREATE POLICY "Permitir upload de arquivos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'orcamentos'
    AND (CASE WHEN RIGHT(name, 4) IN ('.jpg', '.png', 'jpeg')
      THEN octet_length(file) <= 10 * 1024 * 1024
      ELSE octet_length(file) <= 5 * 1024 * 1024
    END)
  );

-- Política para permitir leitura de arquivos do bucket orcamentos
CREATE POLICY "Permitir leitura de arquivos" ON storage.objects
  FOR SELECT USING (bucket_id = 'orcamentos');
