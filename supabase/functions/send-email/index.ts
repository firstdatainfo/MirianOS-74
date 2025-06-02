import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { nome, email, telefone, mensagem, valor, numero_os, arquivo_url } = await req.json()

    // Validação dos campos obrigatórios
    if (!nome || !email || !telefone || !valor || !numero_os) {
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios faltando' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Cria o cliente Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Envia o e-mail usando o Resend
    const { data: emailData, error: emailError } = await supabaseClient
      .functions
      .invoke('send-email-resend', {
        body: {
          to: 'seu-email@exemplo.com', // Substitua pelo e-mail do destinatário
          subject: `Novo orçamento recebido - OS ${numero_os}`,
          html: `
            <h1>Novo Orçamento Recebido</h1>
            <p><strong>Número OS:</strong> ${numero_os}</p>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>E-mail:</strong> ${email}</p>
            <p><strong>Telefone:</strong> ${telefone}</p>
            <p><strong>Valor:</strong> R$ ${parseFloat(valor).toFixed(2)}</p>
            ${mensagem ? `<p><strong>Mensagem:</strong> ${mensagem}</p>` : ''}
            ${arquivo_url ? `<p><a href="${arquivo_url}" target="_blank">Ver anexo</a></p>` : ''}
          `
        }
      })

    if (emailError) {
      throw emailError
    }

    return new Response(
      JSON.stringify({ message: 'E-mail enviado com sucesso', data: emailData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
