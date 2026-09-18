import { UserRole, TipoVeiculo } from '../types';

export const formatBRL = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
};

export const formatLiters = (liters: number): string => {
  return (
    new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(liters || 0) + ' L'
  );
};

export const formatKm = (km: number): string => {
  return new Intl.NumberFormat('pt-BR').format(km || 0) + ' km';
};

export const formatKmL = (kmL: number): string => {
  if (!kmL || isNaN(kmL) || !isFinite(kmL)) return '-';
  return (
    new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(kmL) + ' km/L'
  );
};

export const formatLitersPer100Km = (kmL: number): string => {
  if (!kmL || kmL <= 0 || isNaN(kmL) || !isFinite(kmL)) return '-';
  const val = 100 / kmL;
  return (
    new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(val) + ' L/100km'
  );
};

export const formatCustoPorKm = (custo: number): string => {
  if (!custo || isNaN(custo) || !isFinite(custo)) return '-';
  return (
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    }).format(custo) + '/km'
  );
};

export const formatDateTime = (isoString: string): string => {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return isoString;
  }
};

export const formatDateOnly = (dateString: string): string => {
  if (!dateString) return '-';
  try {
    const parts = dateString.split('T')[0].split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  } catch {
    return dateString;
  }
};

export const formatCNPJ = (cnpj: string): string => {
  if (!cnpj) return '';
  const digits = cnpj.replace(/\D/g, '');
  if (digits.length !== 14) return cnpj;
  return digits.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    '$1.$2.$3/$4-$5'
  );
};

export const formatCPF = (cpf: string): string => {
  if (!cpf) return '';
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return cpf;
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const getTipoVeiculoLabel = (tipo: TipoVeiculo): string => {
  const map: Record<TipoVeiculo, string> = {
    carro: 'Carro de Passeio / Ronda',
    moto: 'Motocicleta Operacional',
    caminhao: 'Caminhão Pesado',
    onibus: 'Ônibus Escolar / Coletivo',
    van: 'Van / Ambulância',
    caminhonete: 'Caminhonete 4x4',
    maquina: 'Máquina / Retroescavadeira',
    barco: 'Embarcação Fluvial',
    jet_ski: 'Jet Ski de Resgate',
    especial: 'Veículo Especializado',
    outros: 'Outros Veículos',
    Ambulância: 'Ambulância de Emergência',
    Caminhão: 'Caminhão / Coleta / Basculante',
    Leve: 'Veículo Leve / Passeio',
    Motocicleta: 'Motocicleta / Fiscalização',
    'Máquina Pesada': 'Máquina Pesada / Retroescavadeira',
    Utilitário: 'Utilitário / Caminhonete',
    Ônibus: 'Ônibus / Transporte Escolar',
  };
  return map[tipo] || tipo;
};

export const getRoleBadge = (role: UserRole): { label: string; className: string } => {
  const map: Record<UserRole, { label: string; className: string }> = {
    SUPER_ADMIN: { label: 'Super Administrador', className: 'bg-purple-100 text-purple-800 border-purple-200' },
    ADMIN_VANTGAS: { label: 'Admin VantGas', className: 'bg-blue-100 text-blue-800 border-blue-200' },
    GESTOR: { label: 'Gestor de Frotas', className: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
    FISCAL: { label: 'Fiscal Operacional', className: 'bg-amber-100 text-amber-800 border-amber-200' },
    SECRETARIA: { label: 'Gestão Setorial', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    POSTO: { label: 'Posto Credenciado', className: 'bg-orange-100 text-orange-800 border-orange-200' },
    AUDITOR: { label: 'Auditoria & Controle', className: 'bg-rose-100 text-rose-800 border-rose-200' },
  };
  return map[role] || { label: role, className: 'bg-slate-100 text-slate-800 border-slate-200' };
};

export const getAlertaBadge = (tipo: string): { label: string; gravidade: string } => {
  const map: Record<string, { label: string; gravidade: string }> = {
    consumo_anormal: { label: 'Consumo Fora do Padrão', gravidade: 'alta' },
    frequencia_elevada: { label: 'Frequência Incomum', gravidade: 'media' },
    fora_horario: { label: 'Horário Não Comercial', gravidade: 'media' },
    valor_elevado: { label: 'Valor Excedente ao Teto', gravidade: 'alta' },
    possivel_duplicidade: { label: 'Possível Duplicidade', gravidade: 'critica' },
    variacao_preco: { label: 'Preço Destoante', gravidade: 'media' },
    capacidade_excedida: { label: 'Litros Acima do Tanque', gravidade: 'critica' },
    odometro_inconsistente: { label: 'Odômetro Regressivo', gravidade: 'critica' },
  };
  return map[tipo] || { label: tipo, gravidade: 'baixa' };
};
