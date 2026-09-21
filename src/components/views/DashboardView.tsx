import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  formatBRL,
  formatLiters,
  formatKmL,
  formatDateTime,
} from '../../utils/formatters';
import {
  DollarSign,
  Fuel,
  Truck,
  ShieldAlert,
  Calendar,
  Filter,
  RefreshCw,
  Plus,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Building2,
  ChevronRight,
  Eye,
  CheckCircle2,
  AlertTriangle,
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
    filtros,
    setFiltros,
    resetFiltros,
    alertas,
    setActiveView,
    setIsNovoAbastecimentoModalOpen,
    setSelectedAbastecimento,
  } = useApp();

  const [timeGranularity, setTimeGranularity] = useState<'dia' | 'semana' | 'mes'>('dia');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Time evolution chart data
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

    const list = Array.from(map.values());
    return list.slice(-14);
  }, [filteredAbastecimentos, timeGranularity]);

  // Fuel distribution chart data
  const fuelDistributionData = useMemo(() => {
    const valid = filteredAbastecimentos.filter((a) => a.status === 'confirmado');
    const map = new Map<string, { name: string; valor: number; litros: number }>();

    valid.forEach((a) => {
      const name = a.combustivelNome;
      if (!map.has(name)) {
        map.set(name, { name, valor: 0, litros: 0 });
      }
      const item = map.get(name)!;
      item.valor += a.valorTotal;
      item.litros += a.quantidadeLitros;
    });

    return Array.from(map.values()).sort((a, b) => b.valor - a.valor);
  }, [filteredAbastecimentos]);

  // Top Stations ranking
  const topStations = useMemo(() => {
    const valid = filteredAbastecimentos.filter((a) => a.status === 'confirmado');
    const map = new Map<
      string,
      { postoId: string; nome: string; bandeira: string; abastecimentos: number; valorTotal: number; litros: number }
    >();

    valid.forEach((a) => {
      if (!map.has(a.postoId)) {
        map.set(a.postoId, {
          postoId: a.postoId,
          nome: a.postoNome,
          bandeira: postos.find((p) => p.id === a.postoId)?.bandeira || 'Convencional',
          abastecimentos: 0,
          valorTotal: 0,
          litros: 0,
        });
      }
      const item = map.get(a.postoId)!;
      item.abastecimentos += 1;
      item.valorTotal += a.valorTotal;
      item.litros += a.quantidadeLitros;
    });

    return Array.from(map.values())
      .sort((a, b) => b.valorTotal - a.valorTotal)
      .slice(0, 5);
  }, [filteredAbastecimentos, postos]);

  // Recent 6 transactions
  const recentAbastecimentos = useMemo(() => {
    return [...filteredAbastecimentos]
      .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime())
      .slice(0, 6);
  }, [filteredAbastecimentos]);

  const alertasPendentes = alertas.filter((a) => a.status === 'pendente').length;
  const PIE_COLORS = ['#059669', '#0284c7', '#d97706', '#7c3aed', '#e11d48'];

  const periodOptions: { label: string; value: typeof filtros.periodo }[] = [
    { label: 'Todo o Período', value: 'todos' },
    { label: 'Últimos 7 dias', value: '7d' },
    { label: 'Últimos 30 dias', value: '30d' },
    { label: 'Mês Atual', value: 'mes_atual' },
  ];

  return (
    <div className="space-y-5 pb-10">
      {/* 1. Quick Filters Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Quick period buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Período:
            </span>
            {periodOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFiltros((prev) => ({ ...prev, periodo: opt.value }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filtros.periodo === opt.value
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Action buttons (Toggle advanced filters & Reset) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                showAdvancedFilters || filtros.postoId || filtros.veiculoId || filtros.secretariaId || filtros.combustivelId
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filtros Específicos</span>
              {(filtros.postoId || filtros.veiculoId || filtros.secretariaId || filtros.combustivelId) && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>

            <button
              onClick={resetFiltros}
              title="Restaurar filtros"
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Filters Tray */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3.5 mt-3.5 border-t border-slate-100 animate-in fade-in duration-150">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Secretaria / Setor</label>
              <select
                value={filtros.secretariaId || ''}
                onChange={(e) => setFiltros((prev) => ({ ...prev, secretariaId: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
              >
                <option value="">Todas as Secretarias</option>
                {secretarias.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.sigla} - {s.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Posto Credenciado</label>
              <select
                value={filtros.postoId || ''}
                onChange={(e) => setFiltros((prev) => ({ ...prev, postoId: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
              >
                <option value="">Todos os Postos</option>
                {postos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nomeFantasia} ({p.bandeira})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Veículo</label>
              <select
                value={filtros.veiculoId || ''}
                onChange={(e) => setFiltros((prev) => ({ ...prev, veiculoId: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
              >
                <option value="">Todos os Veículos</option>
                {veiculos.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.placa} - {v.modelo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Combustível</label>
              <select
                value={filtros.combustivelId || ''}
                onChange={(e) => setFiltros((prev) => ({ ...prev, combustivelId: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
              >
                <option value="">Todos os Combustíveis</option>
                {combustiveis.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 2. Top 4 High-Impact KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Gasto Total */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Gasto</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {formatBRL(kpis.valorTotalGasto)}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span>Ticket Médio:</span>
              <strong className="text-slate-700">{formatBRL(kpis.ticketMedio)}</strong>
            </div>
          </div>
        </div>

        {/* Card 2: Litros Consumidos */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Combustível Total</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Fuel className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {formatLiters(kpis.totalLitros)}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span>Preço Médio:</span>
              <strong className="text-slate-700">{formatBRL(kpis.precoMedioLitro)} / L</strong>
            </div>
          </div>
        </div>

        {/* Card 3: Frota e Abastecimentos */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Atividade da Frota</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {kpis.totalAbastecimentos} <span className="text-sm font-normal text-slate-500">abastecimentos</span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <strong className="text-slate-700">{kpis.totalVeiculos}</strong>
              <span>veículos em operação</span>
            </div>
          </div>
        </div>

        {/* Card 4: Alertas e Inconsistências */}
        <div
          onClick={() => setActiveView('alertas')}
          className={`rounded-xl border p-4 shadow-xs flex flex-col justify-between cursor-pointer transition-all hover:shadow-sm ${
            alertasPendentes > 0
              ? 'bg-amber-50/50 border-amber-200 text-amber-900 hover:bg-amber-50'
              : 'bg-white border-slate-200/80 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Alertas & Auditoria</span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                alertasPendentes > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight">
              {alertasPendentes}{' '}
              <span className="text-sm font-normal text-slate-500">
                {alertasPendentes === 1 ? 'pendência' : 'pendências'}
              </span>
            </div>
            <div className="text-xs text-amber-700 font-medium mt-1 flex items-center gap-1">
              <span>{alertasPendentes > 0 ? 'Clique para revisar desvios' : 'Nenhuma inconformidade grave'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Quick Action Bar */}
      <div className="flex flex-wrap items-center gap-2.5 bg-slate-900 text-white p-3 sm:p-4 rounded-xl shadow-xs">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 hidden sm:inline">
          Ações Rápidas:
        </span>
        <button
          onClick={() => setIsNovoAbastecimentoModalOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold text-xs shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Abastecimento</span>
        </button>

        <button
          onClick={() => setActiveView('veiculos')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors cursor-pointer"
        >
          <Truck className="w-3.5 h-3.5 text-slate-400" />
          <span>Consultar Frotas</span>
        </button>

        <button
          onClick={() => setActiveView('postos')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors cursor-pointer"
        >
          <Fuel className="w-3.5 h-3.5 text-slate-400" />
          <span>Postos Credenciados</span>
        </button>

        <button
          onClick={() => setActiveView('relatorios')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors cursor-pointer"
        >
          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
          <span>Emitir Relatórios</span>
        </button>
      </div>

      {/* 4. Two Clear, High-Craft Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Evolution Chart (2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Evolução de Gastos & Abastecimentos</h2>
              <p className="text-xs text-slate-500">Acompanhamento contínuo dos gastos ao longo do tempo</p>
            </div>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
              <button
                onClick={() => setTimeGranularity('dia')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  timeGranularity === 'dia' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-500'
                }`}
              >
                Dia
              </button>
              <button
                onClick={() => setTimeGranularity('semana')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  timeGranularity === 'semana' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-500'
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setTimeGranularity('mes')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  timeGranularity === 'mes' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-500'
                }`}
              >
                Mês
              </button>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeEvolutionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpend" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `R$ ${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: any) => [formatBRL(Number(value) || 0), 'Valor Total']}
                  labelFormatter={(lbl) => `Período: ${lbl}`}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="valor"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorSpend)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fuel Distribution Pie (1/3 width) */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Distribuição por Combustível</h2>
            <p className="text-xs text-slate-500 mb-3">Participação de cada combustível no gasto</p>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fuelDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="valor"
                  >
                    {fuelDistributionData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatBRL(Number(value) || 0)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-slate-100">
            {fuelDistributionData.slice(0, 4).map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                  />
                  <span className="text-slate-700 font-medium truncate max-w-[120px]">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900">{formatBRL(item.valor)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Recent Fueling Transactions & Top Stations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Fueling Transactions (2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Últimos Abastecimentos</h2>
              <p className="text-xs text-slate-500">Transações mais recentes registradas no sistema</p>
            </div>
            <button
              onClick={() => setActiveView('abastecimentos')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todos</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="pb-2">Veículo</th>
                  <th className="pb-2">Posto</th>
                  <th className="pb-2">Combustível</th>
                  <th className="pb-2 text-right">Litros</th>
                  <th className="pb-2 text-right">Valor Total</th>
                  <th className="pb-2 text-center">Status</th>
                  <th className="pb-2 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentAbastecimentos.map((abs) => (
                  <tr key={abs.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 font-medium text-slate-800">
                      <div className="font-bold">{abs.veiculoPlaca}</div>
                      <div className="text-[10px] text-slate-400">{abs.veiculoModelo}</div>
                    </td>
                    <td className="py-2.5 text-slate-600 truncate max-w-[140px]">{abs.postoNome}</td>
                    <td className="py-2.5 text-slate-600">{abs.combustivelNome}</td>
                    <td className="py-2.5 text-right font-medium text-slate-800">
                      {formatLiters(abs.quantidadeLitros)}
                    </td>
                    <td className="py-2.5 text-right font-bold text-slate-900">{formatBRL(abs.valorTotal)}</td>
                    <td className="py-2.5 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          abs.status === 'confirmado'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {abs.status === 'confirmado' ? 'Confirmado' : 'Cancelado'}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => setSelectedAbastecimento(abs)}
                        className="p-1 text-slate-400 hover:text-slate-800 rounded-md hover:bg-slate-100 cursor-pointer"
                        title="Ver detalhes do abastecimento"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Stations Ranking (1/3 width) */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Postos Mais Utilizados</h2>
              <p className="text-xs text-slate-500">Ranking por volume financeiro</p>
            </div>
            <button
              onClick={() => setActiveView('postos')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Gerenciar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topStations.map((posto, idx) => (
              <div
                key={posto.postoId}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50/80 border border-slate-100"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">{posto.nome}</div>
                    <div className="text-[10px] text-slate-500">
                      {posto.abastecimentos} abastecimentos • {formatLiters(posto.litros)}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-slate-900">{formatBRL(posto.valorTotal)}</div>
                  <div className="text-[10px] text-slate-400">{posto.bandeira}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
