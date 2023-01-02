export const statusCheck = ({value}) => {
  switch (value) {
    case 'dadosEntregue':
      return 'Dados Entregues';
    case 'protocolado':
      return 'Projeto Protocolado';
    case 'aprovado':
      return 'Projeto Aprovado';
    case 'equipamentoEntregue':
      return 'Equipamentos foram entregues';
    case 'concluido':
      return 'Instalação concluída';
    case 'vistoriaSolicitada':
      return 'Vistoria Solicitada';
    case 'vistoriaAprovada':
      return 'Vistoria Aprovada';
    case 'finalizado':
      return 'Projeto Finalizado';
  }
};
