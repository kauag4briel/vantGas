import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  formatBRL,
  formatLiters,
  formatKmL,
  formatCustoPorKm,
} from '../../utils/formatters';
import {
  TrendingUp,
  Fuel,
  Truck,
  DollarSign,
  Calendar,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart as PieIcon,
  ArrowUpDown,
  Building2,
  CheckCircle2,
  Gauge,
  CreditCard,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const DashboardView: React.FC = () => {
  const {
    kpis,
    filteredAbastecimentos,
    postos,
    secretarias,
    veiculos,
    combustiveis,
    formasPagamento,
    filtros,
    setFiltros,
    resetFiltros,
    setSelectedPostoId,
    setActiveView,
  } = useApp();

  const [timeGranularity, setTimeGranularity] = useState<'dia' | 'semana' | 'mes'>('dia');
  const [rankingOrderBy, setRankingOrderBy] = useState<'valor' | 'litros' | 'abastecimentos' | 'precoMedio' | 'veiculos'>('valor');
  const [rankingOrderDir, setRankingOrderDir] = useState<'desc' | 'asc'>('desc');
  const [vehicleMetricDimension, setVehicleMetricDimension] = useState<'valor' | 'litros' | 'abastecimentos' | 'veiculos'>('valor');

  // Chart 1: Time evolution (gastos and litros) based on granularity
  const timeEvolutionData = useMemo(() => {
    const valid = filteredAbastecimentos.filter((a) => a.status === 'confirmado');
    const map = new Map<string, { label: string; valor: number; litros: number }>();

    valid.forEach((a) => {
      let key = a.data;
      let label = a.data.split('-').slice(1).join('/');

      if (timeGranularity === 'mes') {
        const parts = a.data.split('-');
        key = `${parts[0]}-${parts[1]}`;
        label = `${parts[1]}/${parts[0].slice(2)}`;
      } else if (timeGranularity === 'semana') {
        const d = new Date(a.dataHora);
        const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
        const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
        const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        key = `${d.getFullYear()}-W${weekNum}`;
        label = `Sem ${weekNum}`;
      }

      if (!map.has(key)) {
        map.set(key, { label, valor: 0, litros: 0 });
      }
      const item = map.get(key)!;
      item.valor += a.valorTotal;
      item.litros += a.quantidadeLitros;
    });

    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([, val]) => val);
  }, [filteredAbastecimentos, timeGranularity]);

  // Chart 2: Distribution by fuel type
  const fuelDistributionData = useMemo(() => {
    const valid = filteredAbastecimentos.filter((a) => a.status === 'confirmado');
    const totalVolume = valid.reduce((acc, a) => acc + a.quantidadeLitros, 0);
    const totalSpent = valid.reduce((acc, a) => acc + a.valorTotal, 0);

    const map = new Map<string, { name: string; litros: number; valor: number; color: string }>();

    valid.forEach((a) => {
      const comb = combustiveis.find((c) => c.id === a.combustivelId);
      const name = a.combustivelNome;
      const color = comb?.cor || '#64748b';

      if (!map.has(name)) {
        map.set(name, { name, litros: 0, valor: 0, color });
      }
      const item = map.get(name)!;
      item.litros += a.quantidadeLitros;
      item.valor += a.valorTotal;
    });

    return Array.from(map.values()).map((item) => ({
      ...item,
      percentLitros: totalVolume > 0 ? ((item.litros / totalVolume) * 100).toFixed(1) : '0',
      percentValor: totalSpent > 0 ? ((item.valor / totalSpent) * 100).toFixed(1) : '0',
    }));
  }, [filteredAbastecimentos, combustiveis]);

  // Chart 3: Distribution by vehicle type across 4 dimensions
  const vehicleTypeMetrics = useMemo(() => {
    const valid = filteredAbastecimentos.filter((a) => a.status === 'confirmado');
    const totalSpent = valid.reduce((acc, a) => acc + a.valorTotal, 0);
    const totalLitros = valid.reduce((acc, a) => acc + a.quantidadeLitros, 0);
    const totalAbast = valid.length;
    const totalVehiclesCount = veiculos.length;

    // Count vehicles per type
    const vehicleCounts = new Map<string, number>();
    veiculos.forEach((v) => {
      vehicleCounts.set(v.tipo, (vehicleCounts.get(v.tipo) || 0) + 1);
    });

    const map = new Map<
      string,
      {
        tipo: string;
        label: string;
        valor: number;
        litros: number;
        abastecimentos: number;
        veiculosCount: number;
      }
    >();

    valid.forEach((a) => {
      const tipo = a.veiculoTipo || 'outros';
      if (!map.has(tipo)) {
        map.set(tipo, {
          tipo,
          label: tipo.toUpperCase(),
          valor: 0,
          litros: 0,
          abastecimentos: 0,
          veiculosCount: vehicleCounts.get(tipo) || 0,
        });
      }
      const item = map.get(tipo)!;
      item.valor += a.valorTotal;
      item.litros += a.quantidadeLitros;
      item.abastecimentos += 1;
    });

    return Array.from(map.values()).map((item) => ({
      ...item,
      percentValor: totalSpent > 0 ? Number(((item.valor / totalSpent) * 100).toFixed(1)) : 0,
      percentLitros: totalLitros > 0 ? Number(((item.litros / totalLitros) * 100).toFixed(1)) : 0,
      percentAbastecimentos: totalAbast > 0 ? Number(((item.abastecimentos / totalAbast) * 100).toFixed(1)) : 0,
      percentVeiculos: totalVehiclesCount > 0 ? Number(((item.veiculosCount / totalVehiclesCount) * 100).toFixed(1)) : 0,
    }));
  }, [filteredAbastecimentos, veiculos]);

  // Chart 4: Payment Methods
  const paymentMethodsData = useMemo(() => {
    const valid = filteredAbastecimentos.filter((a) => a.status === 'confirmado');
    const map = new Map<string, { name: string; valor: number; count: number }>();

    valid.forEach((a) => {
      const name = a.formaPagamentoNome;
      if (!map.has(name)) {
        map.set(name, { name, valor: 0, count: 0 });
      }
      const item = map.get(name)!;
      item.valor += a.valorTotal;
      item.count += 1;
    });

    return Array.from(map.values());
  }, [filteredAbastecimentos]);

  // Metric & Descriptive Station Ranking Table
  const stationRanking = useMemo(() => {
    const valid = filteredAbastecimentos.filter((a) => a.status === 'confirmado');
    const map = new Map<
      string,
      {
        postoId: string;
        nome: string;
        bandeira: string;
        cnpj: string;
        abastecimentos: number;
        litros: number;
        valorTotal: number;
        veiculosAtendidos: Set<string>;
      }
    >();

    valid.forEach((a) => {
      if (!map.has(a.postoId)) {
        map.set(a.postoId, {
          postoId: a.postoId,
          nome: a.postoNome,
          bandeira: postos.find((p) => p.id === a.postoId)?.bandeira || 'Bandeira Branca',
          cnpj: a.postoCnpj,
          abastecimentos: 0,
          litros: 0,
          valorTotal: 0,
          veiculosAtendidos: new Set<string>(),
        });
      }
      const item = map.get(a.postoId)!;
      item.abastecimentos += 1;
      item.litros += a.quantidadeLitros;
      item.valorTotal += a.valorTotal;
      item.veiculosAtendidos.add(a.veiculoId);
    });

    const list = Array.from(map.values()).map((p) => ({
      ...p,
      veiculosCount: p.veiculosAtendidos.size,
      precoMedioLitro: p.litros > 0 ? p.valorTotal / p.litros : 0,
    }));

    list.sort((a, b) => {
      let diff = 0;
      if (rankingOrderBy === 'valor') diff = b.valorTotal - a.valorTotal;
      else if (rankingOrderBy === 'litros') diff = b.litros - a.litros;
      else if (rankingOrderBy === 'abastecimentos') diff = b.abastecimentos - a.abastecimentos;
      else if (rankingOrderBy === 'precoMedio') diff = b.precoMedioLitro - a.precoMedioLitro;
      else if (rankingOrderBy === 'veiculos') diff = b.veiculosCount - a.veiculosCount;

      return rankingOrderDir === 'desc' ? diff : -diff;
    });

    return list;
  }, [filteredAbastecimentos, postos, rankingOrderBy, rankingOrderDir]);

  const toggleSort = (column: typeof rankingOrderBy) => {
    if (rankingOrderBy === column) {
      setRankingOrderDir(rankingOrderDir === 'desc' ? 'asc' : 'desc');
    } else {
      setRankingOrderBy(column);
      setRankingOrderDir('desc');
    }
  };

  const COLORS = ['#2563eb', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#64748b'];

  return (
    <div className="space-y-3.5 pb-8">
      {/* Top Section: Global Filters Panel */}
      <div className="bg-white rounded-sm border border-slate-300 p-3 sm:p-3.5 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-[#0b3b60]" />
            Filtros Globais de Análise
          </div>
          <button
            onClick={resetFiltros}
            className="text-xs font-semibold text-[#0b3b60] hover:text-blue-900 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Limpar Filtros
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2">
          {/* Período */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Período</label>
            <select
              aria-label="Filtro de período"
              value={filtros.periodo}
              onChange={(e) => setFiltros((prev) => ({ ...prev, periodo: e.target.value as any }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-sm px-2 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none"
            >
              <option value="todos">Todo o Histórico</option>
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="mes_atual">Mês Vigente (Set/2026)</option>
            </select>
          </div>

          {/* Secretaria */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Secretaria</label>
            <select
              aria-label="Filtro de secretaria"
              value={filtros.secretariaId || ''}
              onChange={(e) => setFiltros((prev) => ({ ...prev, secretariaId: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-sm px-2 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none truncate"
            >
              <option value="">Todas as Secretarias</option>
              {secretarias.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.sigla} - {s.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Posto */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Posto Credenciado</label>
            <select
              aria-label="Filtro de posto credenciado"
              value={filtros.postoId || ''}
              onChange={(e) => setFiltros((prev) => ({ ...prev, postoId: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-sm px-2 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none truncate"
            >
              <option value="">Todos os Postos</option>
              {postos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nomeFantasia} ({p.bandeira})
                </option>
              ))}
            </select>
          </div>

          {/* Veículo */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Veículo Específico</label>
            <select
              aria-label="Filtro de veículo específico"
              value={filtros.veiculoId || ''}
              onChange={(e) => setFiltros((prev) => ({ ...prev, veiculoId: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-sm px-2 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none truncate"
            >
              <option value="">Todos os Veículos</option>
              {veiculos.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.placa} - {v.modelo}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Veículo */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Tipo de Veículo</label>
            <select
              aria-label="Filtro de tipo de veículo"
              value={filtros.tipoVeiculo || ''}
              onChange={(e) => setFiltros((prev) => ({ ...prev, tipoVeiculo: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-sm px-2 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none"
            >
              <option value="">Todos os Tipos</option>
              <option value="carro">Carro</option>
              <option value="moto">Moto</option>
              <option value="caminhao">Caminhão</option>
              <option value="onibus">Ônibus</option>
              <option value="van">Van / Ambulância</option>
              <option value="caminhonete">Caminhonete</option>
              <option value="maquina">Máquina Pesada</option>
              <option value="barco">Barco</option>
              <option value="jet_ski">Jet Ski</option>
            </select>
          </div>

          {/* Combustível */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Combustível</label>
            <select
              aria-label="Filtro de combustível"
              value={filtros.combustivelId || ''}
              onChange={(e) => setFiltros((prev) => ({ ...prev, combustivelId: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-sm px-2 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none"
            >
              <option value="">Todos os Tipos</option>
              {combustiveis.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Forma de Pagamento */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Forma de Pagamento</label>
            <select
              aria-label="Filtro de forma de pagamento"
              value={filtros.formaPagamentoId || ''}
              onChange={(e) => setFiltros((prev) => ({ ...prev, formaPagamentoId: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-sm px-2 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none truncate"
            >
              <option value="">Todas as Formas</option>
              {formasPagamento.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 8 Main KPI Cards */}
      {/* Executive KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
        {/* 1. Valor Total Gasto */}
        <div className="bg-white rounded-sm border border-slate-300 p-3 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold mb-1">
            <span>Valor Total Gasto</span>
            <div className="w-6 h-6 rounded-sm bg-blue-50 text-[#0b3b60] flex items-center justify-center">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">
            {formatBRL(kpis.valorTotalGasto)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
            <span>Base de empenho liquidado</span>
          </div>
        </div>

        {/* 2. Quantidade de Abastecimentos */}
        <div className="bg-white rounded-sm border border-slate-300 p-3 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold mb-1">
            <span>Abastecimentos</span>
            <div className="w-6 h-6 rounded-sm bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Fuel className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">
            {kpis.totalAbastecimentos}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Transações fiscais confirmadas</div>
        </div>

        {/* 3. Litros Abastecidos */}
        <div className="bg-white rounded-sm border border-slate-300 p-3 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold mb-1">
            <span>Litros Consumidos</span>
            <div className="w-6 h-6 rounded-sm bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">
            {formatLiters(kpis.totalLitros)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Volume medido em bomba</div>
        </div>

        {/* 4. Quantidade de Veículos */}
        <div className="bg-white rounded-sm border border-slate-300 p-3 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold mb-1">
            <span>Veículos Atendidos</span>
            <div className="w-6 h-6 rounded-sm bg-amber-50 text-amber-700 flex items-center justify-center">
              <Truck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">
            {kpis.totalVeiculos}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Frotas operacionais ativas</div>
        </div>

        {/* 5. Preço Médio por Litro */}
        <div className="bg-white rounded-sm border border-slate-300 p-3 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold mb-1">
            <span>Preço Médio / Litro</span>
            <div className="w-6 h-6 rounded-sm bg-teal-50 text-teal-700 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">
            {formatBRL(kpis.precoMedioLitro)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Ponderado por litragem</div>
        </div>

        {/* 6. Ticket Médio por Abastecimento */}
        <div className="bg-white rounded-sm border border-slate-300 p-3 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold mb-1">
            <span>Ticket Médio</span>
            <div className="w-6 h-6 rounded-sm bg-purple-50 text-purple-700 flex items-center justify-center">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">
            {formatBRL(kpis.ticketMedio)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Gasto médio por transação</div>
        </div>

        {/* 7. Custo Médio por Veículo */}
        <div className="bg-white rounded-sm border border-slate-300 p-3 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold mb-1">
            <span>Custo Médio / Veículo</span>
            <div className="w-6 h-6 rounded-sm bg-rose-50 text-rose-700 flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">
            {formatBRL(kpis.custoMedioPorVeiculo)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Rateio médio por unidade</div>
        </div>

        {/* 8. Custo por Quilômetro */}
        <div className="bg-white rounded-sm border border-slate-300 p-3 shadow-xs">
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold mb-1">
            <span>Custo por Quilômetro</span>
            <div className="w-6 h-6 rounded-sm bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <Gauge className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">
            {formatCustoPorKm(kpis.custoMedioPorKm)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Cálculo via odômetro auditado</div>
        </div>
      </div>

      {/* Row 1 Charts: Evolução dos Gastos & Volume de Combustível */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-3.5">
        {/* Evolução dos Gastos (com alternador Dia / Semana / Mês) */}
        <div className="bg-white rounded-sm border border-slate-300 p-3.5 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Evolução Financeira dos Gastos</h2>
              <p className="text-xs text-slate-500">Valores faturados em combustível ao longo do tempo</p>
            </div>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-sm text-xs font-semibold">
              <button
                onClick={() => setTimeGranularity('dia')}
                className={`px-2.5 py-1 rounded-sm transition-all cursor-pointer ${
                  timeGranularity === 'dia' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                }`}
              >
                Dia
              </button>
              <button
                onClick={() => setTimeGranularity('semana')}
                className={`px-2.5 py-1 rounded-sm transition-all cursor-pointer ${
                  timeGranularity === 'semana' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setTimeGranularity('mes')}
                className={`px-2.5 py-1 rounded-sm transition-all cursor-pointer ${
                  timeGranularity === 'mes' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                }`}
              >
                Mês
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            {timeEvolutionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeEvolutionData}>
                  <defs>
                    <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `R$ ${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
                  />
                  <Tooltip
                    formatter={(val: any) => [formatBRL(Number(val)), 'Total Gasto']}
                    labelFormatter={(label) => `Período: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="valor"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSpent)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Sem registros para o filtro selecionado.
              </div>
            )}
          </div>
        </div>

        {/* Volume de Combustível ao longo do tempo */}
        <div className="bg-white rounded-sm border border-slate-300 p-3.5 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Volume Físico Consumido (Litros)</h2>
              <p className="text-xs text-slate-500">Demanda em litros por período selecionado</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200">
              Litragem Total: {formatLiters(kpis.totalLitros)}
            </span>
          </div>

          <div className="h-64 w-full">
            {timeEvolutionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeEvolutionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v} L`}
                  />
                  <Tooltip
                    formatter={(val: any) => [formatLiters(Number(val)), 'Volume']}
                    labelFormatter={(label) => `Período: ${label}`}
                  />
                  <Bar dataKey="litros" fill="#10b981" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Sem registros para o filtro selecionado.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2 Charts: Distribuição por Combustível & Distribuição por Tipo de Veículo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-3.5">
        {/* Distribuição por Combustível (Dinamico do Banco) */}
        <div className="bg-white rounded-sm border border-slate-300 p-3.5 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Distribuição por Combustível</h2>
              <p className="text-[11px] text-slate-500">Participação de cada combustível comercializado</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fuelDistributionData}
                    dataKey="litros"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={40}
                    paddingAngle={2}
                  >
                    {fuelDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any, item: any) => [
                      `${formatLiters(Number(value))} (${item.payload.percentLitros}%) - ${formatBRL(item.payload.valor)}`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {fuelDistributionData.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between text-xs border-b border-slate-100 pb-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-sm-full shrink-0"
                      style={{ backgroundColor: item.color || COLORS[idx % COLORS.length] }}
                    ></span>
                    <span className="font-medium text-slate-800 truncate">{item.name}</span>
                  </div>
                  <div className="text-right shrink-0 text-xs">
                    <span className="font-bold text-slate-900">{item.percentLitros}%</span>
                    <span className="text-slate-400 ml-1 text-[10px]">({formatLiters(item.litros)})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Distribuição por Tipo de Veículo com 4 dimensões */}
        <div className="bg-white rounded-sm border border-slate-300 p-3.5 sm:p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Consumo por Tipo de Veículo</h2>
              <p className="text-[11px] text-slate-500">Comparação multidimensional da frota</p>
            </div>

            {/* Alternador de dimensão métrica */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-sm text-xs font-medium">
              <button
                onClick={() => setVehicleMetricDimension('valor')}
                className={`px-2 py-0.5 rounded-sm transition-all cursor-pointer ${
                  vehicleMetricDimension === 'valor' ? 'bg-white text-[#0b3b60] shadow-xs font-semibold' : 'text-slate-500'
                }`}
              >
                % Valor
              </button>
              <button
                onClick={() => setVehicleMetricDimension('litros')}
                className={`px-2 py-0.5 rounded-sm transition-all cursor-pointer ${
                  vehicleMetricDimension === 'litros' ? 'bg-white text-[#0b3b60] shadow-xs font-semibold' : 'text-slate-500'
                }`}
              >
                % Litros
              </button>
              <button
                onClick={() => setVehicleMetricDimension('abastecimentos')}
                className={`px-2 py-0.5 rounded-sm transition-all cursor-pointer ${
                  vehicleMetricDimension === 'abastecimentos' ? 'bg-white text-[#0b3b60] shadow-xs font-semibold' : 'text-slate-500'
                }`}
              >
                % Abast.
              </button>
              <button
                onClick={() => setVehicleMetricDimension('veiculos')}
                className={`px-2 py-0.5 rounded-sm transition-all cursor-pointer ${
                  vehicleMetricDimension === 'veiculos' ? 'bg-white text-[#0b3b60] shadow-xs font-semibold' : 'text-slate-500'
                }`}
              >
                % Frota
              </button>
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={vehicleTypeMetrics}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} unit="%" fontSize={10} stroke="#64748b" />
                <YAxis dataKey="label" type="category" fontSize={10} stroke="#64748b" tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, `Percentual (${vehicleMetricDimension.toUpperCase()})`]}
                />
                <Bar
                  dataKey={
                    vehicleMetricDimension === 'valor'
                      ? 'percentValor'
                      : vehicleMetricDimension === 'litros'
                      ? 'percentLitros'
                      : vehicleMetricDimension === 'abastecimentos'
                      ? 'percentAbastecimentos'
                      : 'percentVeiculos'
                  }
                  fill="#3b82f6"
                  radius={[0, 2, 2, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Formas de Pagamento & Ranking Métrico de Postos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-3.5">
        {/* Formas de Pagamento */}
        <div className="bg-white rounded-sm border border-slate-300 p-3.5 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Formas de Pagamento</h2>
              <p className="text-[11px] text-slate-500">Liquidado pelo Tesouro e Convênios</p>
            </div>
          </div>

          <div className="space-y-2">
            {paymentMethodsData.map((item) => (
              <div key={item.name} className="bg-slate-50 border border-slate-200 rounded-sm p-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-0.5">
                  <span>{item.name}</span>
                  <span className="text-[#0b3b60] font-bold">{formatBRL(item.valor)}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Transações registradas:</span>
                  <span className="font-semibold text-slate-700">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ranking Métrico de Postos (Item 5) */}
        <div className="lg:col-span-2 bg-white rounded-sm border border-slate-300 p-3.5 sm:p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Ranking & Comparativo de Postos</h2>
              <p className="text-[11px] text-slate-500">
                Indicadores operacionais (Clique nos cabeçalhos para ordenar)
              </p>
            </div>
            <button
              onClick={() => setActiveView('postos')}
              className="text-xs font-semibold text-[#0b3b60] hover:text-blue-900 flex items-center gap-1 cursor-pointer"
            >
              Ver todos os postos
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-2 px-2.5">Posto Credenciado</th>
                  <th
                    onClick={() => toggleSort('abastecimentos')}
                    className="py-2 px-2 cursor-pointer hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-1">
                      Abast.
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort('litros')}
                    className="py-2 px-2 cursor-pointer hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-1">
                      Litros
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort('valor')}
                    className="py-2 px-2 cursor-pointer hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-1">
                      Valor Total
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort('precoMedio')}
                    className="py-2 px-2 cursor-pointer hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-1">
                      Preço Médio
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort('veiculos')}
                    className="py-2 px-2 cursor-pointer hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-1">
                      Veículos
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-2 px-2 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {stationRanking.map((p) => (
                  <tr key={p.postoId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-2.5">
                      <div className="font-bold text-slate-900">{p.nome}</div>
                      <div className="text-[10px] text-slate-400">
                        {p.bandeira} • {p.cnpj}
                      </div>
                    </td>
                    <td className="py-2 px-2 text-slate-700 font-semibold">{p.abastecimentos}</td>
                    <td className="py-2 px-2 text-slate-700">{formatLiters(p.litros)}</td>
                    <td className="py-2 px-2 text-[#0b3b60] font-bold">{formatBRL(p.valorTotal)}</td>
                    <td className="py-2 px-2 text-slate-700">{formatBRL(p.precoMedioLitro)}</td>
                    <td className="py-2 px-2 text-slate-700">{p.veiculosCount} un.</td>
                    <td className="py-2 px-2 text-right">
                      <button
                        onClick={() => {
                          setSelectedPostoId(p.postoId);
                          setActiveView('postos');
                        }}
                        className="text-xs text-[#0b3b60] hover:text-blue-900 font-semibold cursor-pointer"
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
