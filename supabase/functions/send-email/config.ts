export const config = {
  recipientEmail: 'seu-email@exemplo.com', // Substitua pelo e-mail que receberá as notificações
  senderEmail: 'onboarding@resend.dev', // Atualize com seu domínio verificado no Resend
  emailSubject: 'Novo orçamento recebido - OS {numero_os}',
  emailTemplate: `
    <h1>Novo Orçamento Recebido</h1>
    <p><strong>Número OS:</strong> {numero_os}</p>
    <p><strong>Nome:</strong> {nome}</p>
    <p><strong>E-mail:</strong> {email}</p>
    <p><strong>Telefone:</strong> {telefone}</p>
    <p><strong>Valor:</strong> R$ {valor}</p>
    {mensagem ? <p><strong>Mensagem:</strong> {mensagem}</p> : ''}
    {arquivo_url ? <p><a href="{arquivo_url}" target="_blank">Ver anexo</a></p> : ''}
  `
};
