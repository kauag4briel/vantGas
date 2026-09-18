export type ActiveView =
  | 'dashboard'
  | 'abastecimentos'
  | 'postos'
  | 'veiculos'
  | 'secretarias'
  | 'combustiveis'
  | 'precos'
  | 'alertas'
  | 'mapa'
  | 'relatorios'
  | 'usuarios'
  | 'auditoria'
  | 'integracao';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN_VANTGAS'
  | 'GESTOR'
  | 'FISCAL'
  | 'SECRETARIA'
  | 'POSTO'
  | 'AUDITOR';

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  matricula?: string;
  cargo?: string;
  departamento?: string;
  role: UserRole;
  roleDescricao: string;
  orgaoId?: string;
  secretariaId?: string;
  secretariaNome?: string;
  postoId?: string;
  postoNome?: string;
  status: 'ativo' | 'bloqueado';
  ultimoAcesso: string;
}

export type TipoVeiculo =
  | 'carro'
  | 'moto'
  | 'caminhao'
  | 'onibus'
  | 'van'
  | 'caminhonete'
  | 'maquina'
  | 'barco'
  | 'jet_ski'
  | 'especial'
  | 'outros'
  | 'Ambulância'
  | 'Caminhão'
  | 'Leve'
  | 'Motocicleta'
  | 'Máquina Pesada'
  | 'Utilitário'
  | 'Ônibus';

export interface Combustivel {
  id: string;
  codigo: string;
  codigoAnp?: string;
  nome: string;
  unidadeMedida: string;
  densidadeReferencia?: number;
  densidadeMedia?: number;
  cor: string;
  ativo: boolean;
  precoReferenciaMedio: number;
}

export interface FormaPagamento {
  id: string;
  codigo: string;
  nome: string;
  descricao: string;
  ativo: boolean;
}

export interface Orgao {
  id: string;
  codigo: string;
  nome: string;
  sigla: string;
  responsavel: string;
  status: 'ativo' | 'inativo';
}

export interface Secretaria {
  id: string;
  orgaoId: string;
  orgaoNome: string;
  codigo: string;
  nome: string;
  sigla: string;
  responsavel: string;
  responsavelNome?: string;
  email: string;
  telefone: string;
  limiteMensalCombustivel: number;
  orcamentoMensal?: number;
  gastoAtualMes: number;
  litrosAtualMes: number;
  veiculosCount: number;
  status: 'ativo' | 'inativo';
}

export interface CentroCusto {
  id: string;
  secretariaId: string;
  secretariaNome?: string;
  secretariaSigla?: string;
  codigo: string;
  nome?: string;
  descricao: string;
  status: 'ativo' | 'inativo';
}

export interface PostoDocumento {
  id: string;
  tipoDocumento?: 'ALVARA_FUNCIONAMENTO' | 'LICENCA_AMBIENTAL' | 'AVCB_BOMBEIROS' | 'CERTIDAO_REGULARIDADE_FISCAL';
  tipo?: string;
  tipoNome?: string;
  numeroDocumento: string;
  dataEmissao: string;
  dataValidade: string;
  orgaoEmissor: string;
  statusValidade?: 'vigente' | 'vencendo' | 'vencido';
  status?: string;
  arquivoNome?: string;
}

export interface PostoCombustivelItem {
  combustivelId: string;
  combustivelNome: string;
  precoAtual: number;
  dataAtualizacaoPreco: string;
  ativo?: boolean;
  disponivel?: boolean;
}

export interface Posto {
  id: string;
  codigoInterno: string;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  inscricaoEstadual: string;
  bandeira: string;
  status: 'ativo' | 'suspenso' | 'bloqueado' | 'descredenciado';
  dataCredenciamento?: string;
  
  // Endereço
  cep: string;
  uf: string;
  municipio: string;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  latitude: number;
  longitude: number;
  
  // Contato
  telefone: string;
  email: string;
  responsavel?: string;
  responsavelContato?: string;
  
  // Operação
  horarioAbertura?: string;
  horarioFechamento?: string;
  horarioFuncionamento?: string;
  numeroBombas?: number;
  quantidadeBombas?: number;
  numeroTanques?: number;
  quantidadeTanques?: number;
  capacidadeTotalLitros?: number;
  capacidadeArmazenamentoLitros?: number;
  
  // Combustíveis & Documentos
  combustiveis: PostoCombustivelItem[];
  documentos: PostoDocumento[];
  
  // Indicadores
  totalAbastecimentos?: number;
  totalLitros?: number;
  totalValor?: number;
  precoMedio?: number;
  veiculosAtendidosCount?: number;
  secretariasAtendidasCount?: number;
}

export interface Veiculo {
  id: string;
  prefixo?: string;
  placa: string;
  renavam: string;
  chassi: string;
  marca: string;
  modelo: string;
  ano?: number;
  anoFabricacao: number;
  anoModelo: number;
  tipo: TipoVeiculo;
  combustivelPadraoId: string;
  combustivelPadraoNome: string;
  capacidadeTanqueLitros: number;
  
  orgaoId: string;
  orgaoNome: string;
  secretariaId: string;
  secretariaNome: string;
  centroCustoId?: string;
  
  odometroAtual: number;
  odometroUltimoAbastecimento?: number;
  consumoMedioEstimadoKmL: number; // Média de referência técnica
  consumoReferenciaKmL?: number;
  consumoRealKmL: number;          // Calculado com base em abastecimentos
  custoPorKm: number;              // R$/km
  
  motoristaResponsavel?: string;
  totalGasto: number;
  totalLitros: number;
  totalAbastecimentos: number;
  totalGastoHistorico?: number;
  totalLitrosHistorico?: number;
  status: 'ativo' | 'inativo' | 'manutencao' | 'baixado' | 'vendido';
  ultimoAbastecimentoData?: string;
}

export interface HistoricoAlteracao {
  dataHora: string;
  usuarioNome: string;
  usuarioRole: string;
  descricao: string;
  justificativa?: string;
}

export interface Abastecimento {
  id: string;
  codigoAutenticacao: string;
  hashTransacaoPosto?: string;
  dataHora: string;
  data: string; // YYYY-MM-DD
  hora: string; // HH:mm
  
  postoId: string;
  postoNome: string;
  postoCnpj: string;
  postoEndereco: string;
  
  veiculoId: string;
  veiculoPlaca: string;
  veiculoModelo: string;
  veiculoMarca: string;
  veiculoAno: number;
  veiculoTipo: TipoVeiculo;
  
  orgaoId: string;
  orgaoNome: string;
  secretariaId: string;
  secretariaNome: string;
  centroCustoId?: string;
  
  combustivelId: string;
  combustivelNome: string;
  quantidadeLitros: number;
  precoUnitarioLitro: number;
  valorTotal: number;
  
  formaPagamentoId: string;
  formaPagamentoNome: string;
  
  odometroRegistrado: number;
  odometroAnterior?: number;
  kmPercorridos?: number;
  consumoKmLCalculado?: number;
  custoPorKmCalculado?: number;
  
  motoristaNome: string;
  motoristaCpf: string;
  frentistaNome?: string;
  numeroBomba?: number;
  numeroCupomFiscal?: string;
  
  status: 'confirmado' | 'pendente_validacao' | 'cancelado' | 'retificado';
  motivoCancelamento?: string;
  observacoes?: string;
  origemRegistro: 'sistema_web' | 'api_posto' | 'app_motorista' | 'importacao';
  
  criadoPor: string;
  criadoEm: string;
  alteradoPor?: string;
  alteradoEm?: string;
  historicoAlteracoes?: HistoricoAlteracao[];
}

export type TipoAlerta =
  | 'consumo_anormal'
  | 'frequencia_elevada'
  | 'fora_horario'
  | 'valor_elevado'
  | 'possivel_duplicidade'
  | 'variacao_preco'
  | 'capacidade_excedida'
  | 'odometro_inconsistente';

export interface Alerta {
  id: string;
  tipo: TipoAlerta;
  gravidade: 'baixa' | 'media' | 'alta' | 'critica';
  titulo: string;
  descricao: string;
  abastecimentoId?: string;
  veiculoId?: string;
  veiculoPlaca?: string;
  postoId?: string;
  postoNome?: string;
  secretariaId?: string;
  secretariaNome?: string;
  dataCriacao: string;
  status: 'pendente' | 'em_analise' | 'justificado' | 'confirmado_irregularidade';
  justificativa?: string;
  analisadoPor?: string;
  dataAnalise?: string;
}

export interface PrecoCombustivelHistorico {
  id: string;
  postoId: string;
  postoNome: string;
  combustivelId: string;
  combustivelNome: string;
  precoLitro: number;
  dataRegistro: string;
  registradoPor: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  usuarioNome: string;
  usuarioEmail: string;
  usuarioRole: UserRole;
  acao: 'LOGIN' | 'LOGOUT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'CANCEL' | 'EXPORT' | 'SECURITY_CHECK' | 'API_SYNC';
  recurso: string;
  recursoId: string;
  ip: string;
  userAgent: string;
  valoresAnteriores?: Record<string, any>;
  valoresNovos?: Record<string, any>;
  justificativa?: string;
  dataHora: string;
}

export interface FiltrosGlobais {
  periodo: '7d' | '30d' | 'mes_atual' | 'ano_atual' | 'todos' | 'personalizado';
  dataInicio?: string;
  dataFim?: string;
  postoId?: string;
  secretariaId?: string;
  orgaoId?: string;
  veiculoId?: string;
  tipoVeiculo?: string;
  combustivelId?: string;
  formaPagamentoId?: string;
  status?: string;
}

export interface DashboardKpis {
  valorTotalGasto: number;
  totalAbastecimentos: number;
  totalLitros: number;
  totalVeiculos: number;
  precoMedioLitro: number;
  ticketMedio: number;
  custoMedioPorVeiculo: number;
  custoMedioPorKm: number;
}
