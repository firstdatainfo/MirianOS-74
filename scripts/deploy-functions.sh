#!/bin/bash

# Verifica se o Supabase CLI está instalado
if ! command -v supabase &> /dev/null
then
    echo "Supabase CLI não encontrado. Instalando..."
    npm install -g supabase
fi

# Carrega as variáveis de ambiente
source .env

# Faz login no Supabase (se necessário)
supabase login

# Deploy das funções Edge
echo "Fazendo deploy da função send-email..."
supabase functions deploy send-email --project-ref $SUPABASE_PROJECT_ID

echo "Fazendo deploy da função send-email-resend..."
supabase functions deploy send-email-resend --project-ref $SUPABASE_PROJECT_ID

# Configura as variáveis de ambiente das funções
echo "Configurando variáveis de ambiente..."
supabase secrets set --project-ref $SUPABASE_PROJECT_ID \
  RESEND_API_KEY=$RESEND_API_KEY \
  SUPABASE_URL=$VITE_SUPABASE_URL \
  SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY

echo "Deploy concluído!"
