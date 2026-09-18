import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  ActiveView,
  Posto,
  Veiculo,
  Abastecimento,
  Secretaria,
  Orgao,
  CentroCusto,
  Combustivel,
  FormaPagamento,
  Alerta,
  UserProfile,
  AuditLog,
  PrecoCombustivelHistorico,
  FiltrosGlobais,
  DashboardKpis,
} from '../types';
import {
  INITIAL_ORGAOS,
  INITIAL_SECRETARIAS,
  INITIAL_CENTROS_CUSTO,
  INITIAL_COMBUSTIVEIS,
  INITIAL_FORMAS_PAGAMENTO,
  INITIAL_POSTOS,
  INITIAL_VEICULOS,
  INITIAL_ABASTECIMENTOS,
  INITIAL_ALERTAS,
  INITIAL_PRECOS_HISTORICO,
  INITIAL_USUARIOS,
  INITIAL_AUDIT_LOGS,
} from '../data/municipalData';

interface AppContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;

  // Authentication & Session
  isAuthenticated: boolean;
  login: (userOrIdentifier: string | UserProfile, senha?: string) => { success: boolean; message: string };
  logout: () => void;

  // RBAC Profile
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  allUsers: UserProfile[];

  // Data Collections
  postos: Posto[];
  veiculos: Veiculo[];
  abastecimentos: Abastecimento[];
  secretarias: Secretaria[];
  orgaos: Orgao[];
  centrosCusto: CentroCusto[];
  combustiveis: Combustivel[];
  formasPagamento: FormaPagamento[];
  alertas: Alerta[];
  precosHistorico: PrecoCombustivelHistorico[];
  auditLogs: AuditLog[];

  // Global Filters
  filtros: FiltrosGlobais;
  setFiltros: React.Dispatch<React.SetStateAction<FiltrosGlobais>>;
  resetFiltros: () => void;

  // Filtered dataset according to filters & RBAC scope
  filteredAbastecimentos: Abastecimento[];
  kpis: DashboardKpis;

  // Selection for drill-down views and modals
  selectedAbastecimento: Abastecimento | null;
  setSelectedAbastecimento: (abs: Abastecimento | null) => void;
  selectedPostoId: string | null;
  setSelectedPostoId: (id: string | null) => void;
  selectedVeiculoId: string | null;
  setSelectedVeiculoId: (id: string | null) => void;
  selectedSecretariaId: string | null;
  setSelectedSecretariaId: (id: string | null) => void;

  // Modals
  isNovoAbastecimentoModalOpen: boolean;
  setIsNovoAbastecimentoModalOpen: (open: boolean) => void;
  isNovoPostoModalOpen: boolean;
  setIsNovoPostoModalOpen: (open: boolean) => void;
  isNovoVeiculoModalOpen: boolean;
  setIsNovoVeiculoModalOpen: (open: boolean) => void;
  isAnalisarAlertaModalOpen: boolean;
  setIsAnalisarAlertaModalOpen: (open: boolean) => void;
  selectedAlertaParaAnalise: Alerta | null;
  setSelectedAlertaParaAnalise: (alerta: Alerta | null) => void;

  // Mutations
  addAbastecimento: (data: {
    postoId: string;
    veiculoId: string;
    combustivelId: string;
    quantidadeLitros: number;
    precoUnitarioLitro: number;
    formaPagamentoId: string;
    odometroRegistrado: number;
    motoristaNome: string;
    motoristaCpf: string;
    frentistaNome?: string;
    numeroBomba?: number;
    numeroCupomFiscal?: string;
    observacoes?: string;
    dataHora?: string;
  }) => { success: boolean; message: string; abastecimento?: Abastecimento };

  cancelAbastecimento: (id: string, motivo: string) => { success: boolean; message: string };

  addPosto: (novoPosto: Omit<Posto, 'id' | 'totalAbastecimentos' | 'totalLitros' | 'totalValor' | 'precoMedio' | 'veiculosAtendidosCount' | 'secretariasAtendidasCount'>) => void;
  updatePosto: (id: string, dados: Partial<Posto>) => void;

  addVeiculo: (novoVeiculo: Omit<Veiculo, 'id' | 'consumoRealKmL' | 'custoPorKm' | 'totalGasto' | 'totalLitros' | 'totalAbastecimentos'>) => void;
  updateVeiculo: (id: string, dados: Partial<Veiculo>) => void;

  addCombustivel: (comb: Omit<Combustivel, 'id'>) => void;
  updatePrecoPosto: (postoId: string, combustivelId: string, novoPreco: number) => void;

  analisarAlerta: (alertaId: string, novoStatus: 'justificado' | 'confirmado_irregularidade', parecer: string) => void;

  exportarDadosCSV: (tipo: 'abastecimentos' | 'postos' | 'veiculos' | 'auditoria') => void;
}

const DEFAULT_FILTROS: FiltrosGlobais = {
  periodo: 'todos',
  postoId: '',
  secretariaId: '',
  orgaoId: '',
  veiculoId: '',
  tipoVeiculo: '',
  combustivelId: '',
  formaPagamentoId: '',
  status: '',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  // Restore authenticated user from sessionStorage if valid
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = sessionStorage.getItem('vantgas_auth_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        const match = INITIAL_USUARIOS.find((u) => u.id === parsed.id);
        if (match) return { ...match, ...parsed };
      }
    } catch {}
    return INITIAL_USUARIOS[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return Boolean(sessionStorage.getItem('vantgas_auth_session'));
    } catch {
      return false;
    }
  });

  const [allUsers] = useState<UserProfile[]>(INITIAL_USUARIOS);

  const [postos, setPostos] = useState<Posto[]>(INITIAL_POSTOS);
  const [veiculos, setVeiculos] = useState<Veiculo[]>(INITIAL_VEICULOS);
  const [abastecimentos, setAbastecimentos] = useState<Abastecimento[]>(INITIAL_ABASTECIMENTOS);
  const [secretarias, setSecretarias] = useState<Secretaria[]>(INITIAL_SECRETARIAS);
  const [orgaos] = useState<Orgao[]>(INITIAL_ORGAOS);
  const [centrosCusto] = useState<CentroCusto[]>(INITIAL_CENTROS_CUSTO);
  const [combustiveis, setCombustiveis] = useState<Combustivel[]>(INITIAL_COMBUSTIVEIS);
  const [formasPagamento] = useState<FormaPagamento[]>(INITIAL_FORMAS_PAGAMENTO);
  const [alertas, setAlertas] = useState<Alerta[]>(INITIAL_ALERTAS);
  const [precosHistorico, setPrecosHistorico] = useState<PrecoCombustivelHistorico[]>(INITIAL_PRECOS_HISTORICO);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  const [filtros, setFiltros] = useState<FiltrosGlobais>(DEFAULT_FILTROS);

  const [selectedAbastecimento, setSelectedAbastecimento] = useState<Abastecimento | null>(null);
  const [selectedPostoId, setSelectedPostoId] = useState<string | null>(null);
  const [selectedVeiculoId, setSelectedVeiculoId] = useState<string | null>(null);
  const [selectedSecretariaId, setSelectedSecretariaId] = useState<string | null>(null);

  const [isNovoAbastecimentoModalOpen, setIsNovoAbastecimentoModalOpen] = useState(false);
  const [isNovoPostoModalOpen, setIsNovoPostoModalOpen] = useState(false);
  const [isNovoVeiculoModalOpen, setIsNovoVeiculoModalOpen] = useState(false);
  const [isAnalisarAlertaModalOpen, setIsAnalisarAlertaModalOpen] = useState(false);
  const [selectedAlertaParaAnalise, setSelectedAlertaParaAnalise] = useState<Alerta | null>(null);

  const login = (userOrIdentifier: string | UserProfile, _senha?: string) => {
    let userToLogin: UserProfile | undefined;
    if (typeof userOrIdentifier === 'object' && userOrIdentifier !== null) {
      userToLogin = userOrIdentifier;
    } else {
      const clean = userOrIdentifier.trim().toLowerCase();
      userToLogin = allUsers.find(
        (u) =>
          u.id.toLowerCase() === clean ||
          u.email.toLowerCase() === clean ||
          u.cpf.replace(/\D/g, '') === clean.replace(/\D/g, '') ||
          (u.matricula && u.matricula.toLowerCase() === clean)
      );
    }

    if (!userToLogin) {
      return {
        success: false,
        message: 'Usuário ou credencial não cadastrada na plataforma VantGas.',
      };
    }

    if (userToLogin.status === 'bloqueado') {
      return {
        success: false,
        message: 'Acesso do usuário suspenso pelo Administrador / TI.',
      };
    }

    const nowIso = new Date().toISOString();
    const updatedUser: UserProfile = {
      ...userToLogin,
      ultimoAcesso: nowIso,
    };

    setCurrentUser(updatedUser);
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem('vantgas_auth_session', JSON.stringify(updatedUser));
    } catch {}

    // Trilha de auditoria
    const loginLog: AuditLog = {
      id: `aud-${Date.now()}`,
      userId: updatedUser.id,
      usuarioNome: updatedUser.nome,
      usuarioEmail: updatedUser.email,
      usuarioRole: updatedUser.role,
      acao: 'LOGIN',
      recurso: 'SESSAO_AUTENTICADA',
      recursoId: updatedUser.id,
      ip: '177.136.210.45',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Navegador Web',
      valoresNovos: {
        servidor: updatedUser.nome,
        matricula: updatedUser.matricula || 'N/A',
        cargo: updatedUser.cargo || updatedUser.roleDescricao,
        departamento: updatedUser.departamento || 'Gestão Geral',
        origemAcesso: 'Portal VantGas',
        autenticacao: 'Em Conformidade',
      },
      dataHora: nowIso,
    };

    setAuditLogs((prev) => [loginLog, ...prev]);

    return {
      success: true,
      message: `Bem-vindo(a), ${updatedUser.nome}! Acesso autenticado ao VantGas.`,
    };
  };

  const logout = () => {
    if (currentUser) {
      const logoutLog: AuditLog = {
        id: `aud-${Date.now()}`,
        userId: currentUser.id,
        usuarioNome: currentUser.nome,
        usuarioEmail: currentUser.email,
        usuarioRole: currentUser.role,
        acao: 'LOGOUT',
        recurso: 'SESSAO_AUTENTICADA',
        recursoId: currentUser.id,
        ip: '177.136.210.45',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Navegador Web',
        valoresNovos: {
          motivo: 'Encerramento voluntário de sessão pelo usuário',
        },
        dataHora: new Date().toISOString(),
      };
      setAuditLogs((prev) => [logoutLog, ...prev]);
    }

    try {
      sessionStorage.removeItem('vantgas_auth_session');
    } catch {}
    setIsAuthenticated(false);
  };

  const resetFiltros = () => {
    setFiltros(DEFAULT_FILTROS);
  };

  // RBAC scope enforcement + Global Filters
  const filteredAbastecimentos = useMemo(() => {
    return abastecimentos.filter((abs) => {
      // Role scope restriction
      if (currentUser.role === 'SECRETARIA' && currentUser.secretariaId) {
        if (abs.secretariaId !== currentUser.secretariaId) return false;
      }
      if (currentUser.role === 'POSTO' && currentUser.postoId) {
        if (abs.postoId !== currentUser.postoId) return false;
      }

      // Explicit filters
      if (filtros.postoId && abs.postoId !== filtros.postoId) return false;
      if (filtros.secretariaId && abs.secretariaId !== filtros.secretariaId) return false;
      if (filtros.orgaoId && abs.orgaoId !== filtros.orgaoId) return false;
      if (filtros.veiculoId && abs.veiculoId !== filtros.veiculoId) return false;
      if (filtros.tipoVeiculo && abs.veiculoTipo !== filtros.tipoVeiculo) return false;
      if (filtros.combustivelId && abs.combustivelId !== filtros.combustivelId) return false;
      if (filtros.formaPagamentoId && abs.formaPagamentoId !== filtros.formaPagamentoId) return false;
      if (filtros.status && abs.status !== filtros.status) return false;

      // Period filter
      if (filtros.periodo !== 'todos') {
        const absDate = new Date(abs.dataHora).getTime();
        const now = new Date('2026-09-18T12:00:00').getTime();
        const diffDays = (now - absDate) / (1000 * 60 * 60 * 24);

        if (filtros.periodo === '7d' && diffDays > 7) return false;
        if (filtros.periodo === '30d' && diffDays > 30) return false;
        if (filtros.periodo === 'mes_atual') {
          const m1 = new Date(abs.dataHora).getMonth();
          const y1 = new Date(abs.dataHora).getFullYear();
          if (m1 !== 8 || y1 !== 2026) return false; // Sep 2026
        }
      }

      return true;
    });
  }, [abastecimentos, filtros, currentUser]);

  // Dynamic KPIs derived accurately
  const kpis: DashboardKpis = useMemo(() => {
    const validAbs = filteredAbastecimentos.filter((a) => a.status === 'confirmado');
    const valorTotalGasto = validAbs.reduce((acc, a) => acc + a.valorTotal, 0);
    const totalLitros = validAbs.reduce((acc, a) => acc + a.quantidadeLitros, 0);
    const totalAbastecimentos = validAbs.length;

    // Distinct vehicles
    const distinctVehicles = new Set(validAbs.map((a) => a.veiculoId)).size;
    const totalVeiculos = distinctVehicles || veiculos.length;

    const precoMedioLitro = totalLitros > 0 ? valorTotalGasto / totalLitros : 0;
    const ticketMedio = totalAbastecimentos > 0 ? valorTotalGasto / totalAbastecimentos : 0;
    const custoMedioPorVeiculo = totalVeiculos > 0 ? valorTotalGasto / totalVeiculos : 0;

    // Aggregate distance and total cost for vehicles with recorded distance
    let kmTotal = 0;
    let valorParaKm = 0;
    validAbs.forEach((a) => {
      if (a.kmPercorridos && a.kmPercorridos > 0) {
        kmTotal += a.kmPercorridos;
        valorParaKm += a.valorTotal;
      }
    });

    const custoMedioPorKm = kmTotal > 0 ? valorParaKm / kmTotal : 0.88;

    return {
      valorTotalGasto,
      totalAbastecimentos,
      totalLitros,
      totalVeiculos,
      precoMedioLitro,
      ticketMedio,
      custoMedioPorVeiculo,
      custoMedioPorKm,
    };
  }, [filteredAbastecimentos, veiculos]);

  // Log an append-only audit entry
  const recordAudit = (
    acao: AuditLog['acao'],
    recurso: string,
    recursoId: string,
    valoresNovos?: Record<string, any>,
    valoresAnteriores?: Record<string, any>,
    justificativa?: string
  ) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: currentUser.id,
      usuarioNome: currentUser.nome,
      usuarioEmail: currentUser.email,
      usuarioRole: currentUser.role,
      acao,
      recurso,
      recursoId,
      ip: '177.136.210.45',
      userAgent: navigator.userAgent || 'Municipal Client v2.4',
      valoresAnteriores,
      valoresNovos,
      justificativa,
      dataHora: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Add a new fueling transaction with transactional checks and anomaly triggers
  const addAbastecimento = (data: {
    postoId: string;
    veiculoId: string;
    combustivelId: string;
    quantidadeLitros: number;
    precoUnitarioLitro: number;
    formaPagamentoId: string;
    odometroRegistrado: number;
    motoristaNome: string;
    motoristaCpf: string;
    frentistaNome?: string;
    numeroBomba?: number;
    numeroCupomFiscal?: string;
    observacoes?: string;
    dataHora?: string;
  }) => {
    const posto = postos.find((p) => p.id === data.postoId);
    const veiculo = veiculos.find((v) => v.id === data.veiculoId);
    const combustivel = combustiveis.find((c) => c.id === data.combustivelId);
    const formaPagamento = formasPagamento.find((f) => f.id === data.formaPagamentoId);

    if (!posto || !veiculo || !combustivel || !formaPagamento) {
      return { success: false, message: 'Dados estruturais inválidos para o abastecimento.' };
    }

    // Odômetro validation
    if (data.odometroRegistrado <= veiculo.odometroAtual) {
      // Trigger anomaly alert
      const alertId = `alt-${Date.now()}`;
      const newAlerta: Alerta = {
        id: alertId,
        tipo: 'odometro_inconsistente',
        gravidade: 'critica',
        titulo: 'Odômetro registrado igual ou inferior ao último odômetro válido',
        descricao: `O veículo ${veiculo.modelo} (${veiculo.placa}) registrou odômetro ${data.odometroRegistrado} km, sendo que seu odômetro anterior registrado era de ${veiculo.odometroAtual} km.`,
        veiculoId: veiculo.id,
        veiculoPlaca: veiculo.placa,
        postoId: posto.id,
        postoNome: posto.nomeFantasia,
        secretariaId: veiculo.secretariaId,
        secretariaNome: veiculo.secretariaNome,
        dataCriacao: new Date().toISOString(),
        status: 'pendente',
      };
      setAlertas((prev) => [newAlerta, ...prev]);
      return {
        success: false,
        message: `Inconsistência de Odômetro: O valor informado (${data.odometroRegistrado} km) não pode ser menor ou igual ao odômetro atual cadastrado (${veiculo.odometroAtual} km). Alerta de anomalia gerado para a Controladoria.`,
      };
    }

    const valorTotal = Number((data.quantidadeLitros * data.precoUnitarioLitro).toFixed(2));
    const odometroAnterior = veiculo.odometroAtual;
    const kmPercorridos = data.odometroRegistrado - odometroAnterior;
    const consumoKmLCalculado = kmPercorridos > 0 && data.quantidadeLitros > 0 ? Number((kmPercorridos / data.quantidadeLitros).toFixed(2)) : undefined;
    const custoPorKmCalculado = kmPercorridos > 0 && valorTotal > 0 ? Number((valorTotal / kmPercorridos).toFixed(3)) : undefined;

    const dataHoraIso = data.dataHora || new Date().toISOString();
    const [dataPart, horaPart] = dataHoraIso.split('T');
    const horaFormatada = horaPart ? horaPart.substring(0, 5) : '09:00';

    const absId = `abs-${Date.now().toString().slice(-6)}`;
    const codigoAutenticacao = `PMNE-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10000 + Math.random() * 90000)}-${veiculo.placa.slice(-2).toUpperCase()}`;

    const novoAbastecimento: Abastecimento = {
      id: absId,
      codigoAutenticacao,
      dataHora: dataHoraIso,
      data: dataPart,
      hora: horaFormatada,
      postoId: posto.id,
      postoNome: posto.nomeFantasia,
      postoCnpj: posto.cnpj,
      postoEndereco: `${posto.logradouro}, ${posto.numero} - ${posto.bairro}`,
      veiculoId: veiculo.id,
      veiculoPlaca: veiculo.placa,
      veiculoModelo: veiculo.modelo,
      veiculoMarca: veiculo.marca,
      veiculoAno: veiculo.anoFabricacao,
      veiculoTipo: veiculo.tipo,
      orgaoId: veiculo.orgaoId,
      orgaoNome: veiculo.orgaoNome,
      secretariaId: veiculo.secretariaId,
      secretariaNome: veiculo.secretariaNome,
      centroCustoId: veiculo.centroCustoId,
      combustivelId: combustivel.id,
      combustivelNome: combustivel.nome,
      quantidadeLitros: data.quantidadeLitros,
      precoUnitarioLitro: data.precoUnitarioLitro,
      valorTotal,
      formaPagamentoId: formaPagamento.id,
      formaPagamentoNome: formaPagamento.nome,
      odometroRegistrado: data.odometroRegistrado,
      odometroAnterior,
      kmPercorridos,
      consumoKmLCalculado,
      custoPorKmCalculado,
      motoristaNome: data.motoristaNome,
      motoristaCpf: data.motoristaCpf,
      frentistaNome: data.frentistaNome || 'Frentista Padrão',
      numeroBomba: data.numeroBomba || 1,
      numeroCupomFiscal: data.numeroCupomFiscal || `NFCe-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'confirmado',
      origemRegistro: 'sistema_web',
      criadoPor: currentUser.nome,
      criadoEm: new Date().toISOString(),
      observacoes: data.observacoes,
    };

    // Anomaly checks
    // 1. Tank capacity exceeded
    if (data.quantidadeLitros > veiculo.capacidadeTanqueLitros * 1.05) {
      const alertaCap: Alerta = {
        id: `alt-${Date.now()}-cap`,
        tipo: 'capacidade_excedida',
        gravidade: 'critica',
        titulo: 'Volume abastecido superior à capacidade nominal do tanque',
        descricao: `Abastecidos ${data.quantidadeLitros} L em veículo com capacidade declarada de ${veiculo.capacidadeTanqueLitros} L (+5% de tolerância excedida).`,
        abastecimentoId: absId,
        veiculoId: veiculo.id,
        veiculoPlaca: veiculo.placa,
        postoId: posto.id,
        postoNome: posto.nomeFantasia,
        secretariaId: veiculo.secretariaId,
        secretariaNome: veiculo.secretariaNome,
        dataCriacao: new Date().toISOString(),
        status: 'pendente',
      };
      setAlertas((prev) => [alertaCap, ...prev]);
    }

    // 2. Out of hours
    const hourNum = parseInt(horaFormatada.split(':')[0], 10);
    if (hourNum < 6 || hourNum >= 22) {
      const alertaHora: Alerta = {
        id: `alt-${Date.now()}-hr`,
        tipo: 'fora_horario',
        gravidade: 'media',
        titulo: 'Abastecimento realizado em horário noturno excepcional',
        descricao: `Registro efetuado às ${horaFormatada} para o veículo ${veiculo.placa} fora do expediente administrativo comum.`,
        abastecimentoId: absId,
        veiculoId: veiculo.id,
        veiculoPlaca: veiculo.placa,
        postoId: posto.id,
        postoNome: posto.nomeFantasia,
        secretariaId: veiculo.secretariaId,
        secretariaNome: veiculo.secretariaNome,
        dataCriacao: new Date().toISOString(),
        status: 'pendente',
      };
      setAlertas((prev) => [alertaHora, ...prev]);
    }

    // 3. Consumo anormal vs histórico
    if (consumoKmLCalculado && veiculo.consumoMedioEstimadoKmL > 0) {
      const desvio = Math.abs(consumoKmLCalculado - veiculo.consumoMedioEstimadoKmL) / veiculo.consumoMedioEstimadoKmL;
      if (desvio > 0.35) {
        const alertaConsumo: Alerta = {
          id: `alt-${Date.now()}-cons`,
          tipo: 'consumo_anormal',
          gravidade: 'alta',
          titulo: 'Desvio de consumo de combustível superior a 35%',
          descricao: `Consumo aferido de ${consumoKmLCalculado} km/L difere em ${(desvio * 100).toFixed(0)}% da média homologada do veículo (${veiculo.consumoMedioEstimadoKmL} km/L).`,
          abastecimentoId: absId,
          veiculoId: veiculo.id,
          veiculoPlaca: veiculo.placa,
          postoId: posto.id,
          postoNome: posto.nomeFantasia,
          secretariaId: veiculo.secretariaId,
          secretariaNome: veiculo.secretariaNome,
          dataCriacao: new Date().toISOString(),
          status: 'pendente',
        };
        setAlertas((prev) => [alertaConsumo, ...prev]);
      }
    }

    // Update state
    setAbastecimentos((prev) => [novoAbastecimento, ...prev]);

    // Update vehicle metrics
    setVeiculos((prev) =>
      prev.map((v) => {
        if (v.id === veiculo.id) {
          const newTotalGasto = v.totalGasto + valorTotal;
          const newTotalLitros = v.totalLitros + data.quantidadeLitros;
          const newTotalAbs = v.totalAbastecimentos + 1;
          const newConsumo = consumoKmLCalculado ? Number(((v.consumoRealKmL + consumoKmLCalculado) / 2).toFixed(2)) : v.consumoRealKmL;
          return {
            ...v,
            odometroAtual: data.odometroRegistrado,
            totalGasto: newTotalGasto,
            totalLitros: newTotalLitros,
            totalAbastecimentos: newTotalAbs,
            consumoRealKmL: newConsumo,
            ultimoAbastecimentoData: dataPart,
          };
        }
        return v;
      })
    );

    // Update station metrics
    setPostos((prev) =>
      prev.map((p) => {
        if (p.id === posto.id) {
          const totalLitros = (p.totalLitros || 0) + data.quantidadeLitros;
          const totalValor = (p.totalValor || 0) + valorTotal;
          const totalAbastecimentos = (p.totalAbastecimentos || 0) + 1;
          const precoMedio = totalLitros > 0 ? Number((totalValor / totalLitros).toFixed(2)) : (p.precoMedio || 0);
          return {
            ...p,
            totalLitros,
            totalValor,
            totalAbastecimentos,
            precoMedio,
          };
        }
        return p;
      })
    );

    // Update secretaria budget consumption
    setSecretarias((prev) =>
      prev.map((s) => {
        if (s.id === veiculo.secretariaId) {
          return {
            ...s,
            gastoAtualMes: Number((s.gastoAtualMes + valorTotal).toFixed(2)),
            litrosAtualMes: Number((s.litrosAtualMes + data.quantidadeLitros).toFixed(1)),
          };
        }
        return s;
      })
    );

    // Forense Audit Log
    recordAudit(
      'INSERT',
      'ABASTECIMENTO',
      absId,
      {
        codigoAutenticacao,
        placa: veiculo.placa,
        litros: data.quantidadeLitros,
        valorTotal,
        posto: posto.nomeFantasia,
        odometro: data.odometroRegistrado,
        motorista: data.motoristaNome,
      },
      undefined,
      'Registro oficial de abastecimento municipal com assinatura digital.'
    );

    return { success: true, message: 'Abastecimento auditado e registrado com sucesso no SIGA.', abastecimento: novoAbastecimento };
  };

  const cancelAbastecimento = (id: string, motivo: string) => {
    const target = abastecimentos.find((a) => a.id === id);
    if (!target) return { success: false, message: 'Abastecimento não localizado.' };
    if (target.status === 'cancelado') return { success: false, message: 'Este abastecimento já se encontra cancelado.' };

    setAbastecimentos((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            status: 'cancelado',
            motivoCancelamento: motivo,
            alteradoPor: currentUser.nome,
            alteradoEm: new Date().toISOString(),
            historicoAlteracoes: [
              ...(a.historicoAlteracoes || []),
              {
                dataHora: new Date().toISOString(),
                usuarioNome: currentUser.nome,
                usuarioRole: currentUser.role,
                descricao: 'Cancelamento formal de abastecimento',
                justificativa: motivo,
              },
            ],
          };
        }
        return a;
      })
    );

    recordAudit(
      'CANCEL',
      'ABASTECIMENTO',
      id,
      { status: 'cancelado', motivoCancelamento: motivo },
      { status: target.status },
      motivo
    );

    return { success: true, message: 'Abastecimento cancelado com sucesso e log forense registrado.' };
  };

  const addPosto = (novoPostoData: Omit<Posto, 'id' | 'totalAbastecimentos' | 'totalLitros' | 'totalValor' | 'precoMedio' | 'veiculosAtendidosCount' | 'secretariasAtendidasCount'>) => {
    const id = `pos-custom-${Date.now().toString().slice(-4)}`;
    const novoPosto: Posto = {
      ...novoPostoData,
      id,
      totalAbastecimentos: 0,
      totalLitros: 0,
      totalValor: 0,
      precoMedio: 0,
      veiculosAtendidosCount: 0,
      secretariasAtendidasCount: 0,
    };

    setPostos((prev) => [novoPosto, ...prev]);

    recordAudit(
      'INSERT',
      'POSTO',
      id,
      { nomeFantasia: novoPosto.nomeFantasia, cnpj: novoPosto.cnpj, bandeira: novoPosto.bandeira },
      undefined,
      'Credenciamento de novo posto de combustível na rede municipal.'
    );
  };

  const updatePosto = (id: string, dados: Partial<Posto>) => {
    const old = postos.find((p) => p.id === id);
    setPostos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...dados } : p))
    );
    recordAudit('UPDATE', 'POSTO', id, dados, old);
  };

  const addVeiculo = (novoVeiculoData: Omit<Veiculo, 'id' | 'consumoRealKmL' | 'custoPorKm' | 'totalGasto' | 'totalLitros' | 'totalAbastecimentos'>) => {
    const id = `vei-${Date.now().toString().slice(-4)}`;
    const novoVeiculo: Veiculo = {
      ...novoVeiculoData,
      id,
      consumoRealKmL: novoVeiculoData.consumoMedioEstimadoKmL,
      custoPorKm: 0.6,
      totalGasto: 0,
      totalLitros: 0,
      totalAbastecimentos: 0,
    };

    setVeiculos((prev) => [novoVeiculo, ...prev]);

    // Update secretaria vehicles count
    setSecretarias((prev) =>
      prev.map((s) => (s.id === novoVeiculo.secretariaId ? { ...s, veiculosCount: s.veiculosCount + 1 } : s))
    );

    recordAudit('INSERT', 'VEICULO', id, { placa: novoVeiculo.placa, modelo: novoVeiculo.modelo, secretaria: novoVeiculo.secretariaNome });
  };

  const updateVeiculo = (id: string, dados: Partial<Veiculo>) => {
    const old = veiculos.find((v) => v.id === id);
    setVeiculos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...dados } : v))
    );
    recordAudit('UPDATE', 'VEICULO', id, dados, old);
  };

  const addCombustivel = (combData: Omit<Combustivel, 'id'>) => {
    const id = `comb-${Date.now().toString().slice(-4)}`;
    const novo: Combustivel = { ...combData, id };
    setCombustiveis((prev) => [...prev, novo]);
    recordAudit('INSERT', 'COMBUSTIVEL', id, novo);
  };

  const updatePrecoPosto = (postoId: string, combustivelId: string, novoPreco: number) => {
    const posto = postos.find((p) => p.id === postoId);
    const comb = combustiveis.find((c) => c.id === combustivelId);
    if (!posto || !comb) return;

    setPostos((prev) =>
      prev.map((p) => {
        if (p.id === postoId) {
          const updatedCombs = p.combustiveis.map((c) => {
            if (c.combustivelId === combustivelId) {
              return { ...c, precoAtual: novoPreco, dataAtualizacaoPreco: new Date().toISOString().slice(0, 10) };
            }
            return c;
          });
          return { ...p, combustiveis: updatedCombs };
        }
        return p;
      })
    );

    const novoHistorico: PrecoCombustivelHistorico = {
      id: `pr-${Date.now()}`,
      postoId,
      postoNome: posto.nomeFantasia,
      combustivelId,
      combustivelNome: comb.nome,
      precoLitro: novoPreco,
      dataRegistro: new Date().toISOString().slice(0, 10),
      registradoPor: currentUser.nome,
    };
    setPrecosHistorico((prev) => [novoHistorico, ...prev]);

    recordAudit('UPDATE', 'PRECO_COMBUSTIVEL', `${postoId}-${combustivelId}`, { precoLitro: novoPreco, posto: posto.nomeFantasia, combustivel: comb.nome });
  };

  const analisarAlerta = (alertaId: string, novoStatus: 'justificado' | 'confirmado_irregularidade', parecer: string) => {
    setAlertas((prev) =>
      prev.map((alt) => {
        if (alt.id === alertaId) {
          return {
            ...alt,
            status: novoStatus,
            justificativa: parecer,
            analisadoPor: currentUser.nome,
            dataAnalise: new Date().toISOString(),
          };
        }
        return alt;
      })
    );

    recordAudit('UPDATE', 'ALERTA', alertaId, { status: novoStatus, justificativa: parecer }, undefined, 'Parecer técnico de fiscalização registrado.');
  };

  const exportarDadosCSV = (tipo: 'abastecimentos' | 'postos' | 'veiculos' | 'auditoria') => {
    let csvContent = '';
    let filename = `SIGA_${tipo}_${new Date().toISOString().slice(0, 10)}.csv`;

    if (tipo === 'abastecimentos') {
      const headers = ['ID', 'Autenticacao', 'Data', 'Hora', 'Posto', 'Placa', 'Modelo', 'Secretaria', 'Combustivel', 'Litros', 'PrecoLitro', 'TotalR$', 'Odometro', 'KmPercorridos', 'KmL', 'Motorista', 'Status'];
      const rows = filteredAbastecimentos.map((a) => [
        a.id,
        a.codigoAutenticacao,
        a.data,
        a.hora,
        `"${a.postoNome}"`,
        a.veiculoPlaca,
        `"${a.veiculoModelo}"`,
        `"${a.secretariaNome}"`,
        `"${a.combustivelNome}"`,
        a.quantidadeLitros,
        a.precoUnitarioLitro,
        a.valorTotal,
        a.odometroRegistrado,
        a.kmPercorridos || '',
        a.consumoKmLCalculado || '',
        `"${a.motoristaNome}"`,
        a.status,
      ]);
      csvContent = [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    } else if (tipo === 'postos') {
      const headers = ['ID', 'Codigo', 'NomeFantasia', 'RazaoSocial', 'CNPJ', 'Bandeira', 'Status', 'Municipio', 'Telefone', 'TotalAbastecimentos', 'TotalLitros', 'TotalR$'];
      const rows = postos.map((p) => [
        p.id,
        p.codigoInterno,
        `"${p.nomeFantasia}"`,
        `"${p.razaoSocial}"`,
        p.cnpj,
        p.bandeira,
        p.status,
        p.municipio,
        p.telefone,
        p.totalAbastecimentos,
        p.totalLitros,
        p.totalValor,
      ]);
      csvContent = [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    } else if (tipo === 'veiculos') {
      const headers = ['Placa', 'Renavam', 'Marca', 'Modelo', 'Ano', 'Tipo', 'Combustivel', 'Secretaria', 'OdometroAtual', 'MediaKmL', 'Status'];
      const rows = veiculos.map((v) => [
        v.placa,
        v.renavam,
        v.marca,
        `"${v.modelo}"`,
        v.anoFabricacao,
        v.tipo,
        v.combustivelPadraoNome,
        `"${v.secretariaNome}"`,
        v.odometroAtual,
        v.consumoRealKmL,
        v.status,
      ]);
      csvContent = [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    } else if (tipo === 'auditoria') {
      const headers = ['ID', 'DataHora', 'Usuario', 'Perfil', 'Acao', 'Recurso', 'RecursoId', 'IP', 'Justificativa'];
      const rows = auditLogs.map((log) => [
        log.id,
        log.dataHora,
        `"${log.usuarioNome}"`,
        log.usuarioRole,
        log.acao,
        log.recurso,
        log.recursoId,
        log.ip,
        `"${log.justificativa || ''}"`,
      ]);
      csvContent = [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    }

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    recordAudit('EXPORT', 'RELATORIO_CSV', tipo, { filename }, undefined, `Exportação de base de dados municipal em formato CSV.`);
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        isAuthenticated,
        login,
        logout,
        currentUser,
        setCurrentUser,
        allUsers,
        postos,
        veiculos,
        abastecimentos,
        secretarias,
        orgaos,
        centrosCusto,
        combustiveis,
        formasPagamento,
        alertas,
        precosHistorico,
        auditLogs,
        filtros,
        setFiltros,
        resetFiltros,
        filteredAbastecimentos,
        kpis,
        selectedAbastecimento,
        setSelectedAbastecimento,
        selectedPostoId,
        setSelectedPostoId,
        selectedVeiculoId,
        setSelectedVeiculoId,
        selectedSecretariaId,
        setSelectedSecretariaId,
        isNovoAbastecimentoModalOpen,
        setIsNovoAbastecimentoModalOpen,
        isNovoPostoModalOpen,
        setIsNovoPostoModalOpen,
        isNovoVeiculoModalOpen,
        setIsNovoVeiculoModalOpen,
        isAnalisarAlertaModalOpen,
        setIsAnalisarAlertaModalOpen,
        selectedAlertaParaAnalise,
        setSelectedAlertaParaAnalise,
        addAbastecimento,
        cancelAbastecimento,
        addPosto,
        updatePosto,
        addVeiculo,
        updateVeiculo,
        addCombustivel,
        updatePrecoPosto,
        analisarAlerta,
        exportarDadosCSV,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
