import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  formatBRL,
  formatLiters,
  formatKmL,
  formatKm,
  formatCustoPorKm,
  getTipoVeiculoLabel,
} from '../../utils/formatters';
import {
  Truck,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Fuel,
  Building2,
  Calendar,
  Gauge,
  FileText,
  DollarSign,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { Veiculo } from '../../types';

export const VeiculosView: React.FC = () => {
  const {
    veiculos,
    abastecimentos,
    secretarias,
    setIsNovoVeiculoModalOpen,
    currentUser,
    setSelectedAbastecimento,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [secretariaFilter, setSecretariaFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedVehicleDetails, setSelectedVehicleDetails] = useState<Veiculo | null>(null);

  const filteredVeiculos = veiculos.filter((v) => {
    if (tipoFilter && v.tipo !== tipoFilter) return false;
    if (secretariaFilter && v.secretariaId !== secretariaFilter) return false;
    if (statusFilter && v.status !== statusFilter) return false;

    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      v.placa.toLowerCase().includes(term) ||
      v.modelo.toLowerCase().includes(term) ||
      v.marca.toLowerCase().includes(term) ||
      v.renavam.includes(term) ||
      v.secretariaNome.toLowerCase().includes(term)
    );
  });

  const getStatusBadge = (status: Veiculo['status']) => {
    if (status === 'ativo') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" />
          Operacional
        </span>
      );
    }
    if (status === 'manutencao') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <Wrench className="w-3 h-3" />
          Em Manutenção
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
        Baixado / Reserva
      </span>
    );
  };

  // Get fueling history for the selected vehicle
  const vehicleFuelingHistory = selectedVehicleDetails
    ? abastecimentos.filter((a) => a.veiculoId === selectedVehicleDetails.id)
    : [];

  return (
    <div className="space-y-3.5 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 bg-white p-3 sm:p-3.5 rounded-sm border border-slate-300 shadow-xs">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#0b3b60]" />
            Gestão da Frota Municipal
          </h2>
          <p className="text-[11px] text-slate-500">
            Acompanhamento individual de consumo, odômetro, custo por km rodado e secretarias vinculadas
          </p>
        </div>

        {currentUser.role !== 'AUDITOR' && currentUser.role !== 'POSTO' && (
          <button
            onClick={() => setIsNovoVeiculoModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-sm bg-[#0b3b60] hover:bg-[#082e4c] text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-amber-300" />
            Cadastrar Novo Veículo
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2 bg-white p-2.5 rounded-sm border border-slate-300 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Buscar por placa, modelo, marca, RENAVAM ou secretaria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-sm outline-none focus:bg-white focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Filtrar por tipo de veículo"
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-sm px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="">Tipos: Todos</option>
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

          <select
            aria-label="Filtrar por secretaria vinculada"
            value={secretariaFilter}
            onChange={(e) => setSecretariaFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-sm px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="">Secretarias: Todas</option>
            {secretarias.map((s) => (
              <option key={s.id} value={s.id}>
                {s.sigla}
              </option>
            ))}
          </select>

          <select
            aria-label="Filtrar por situação do veículo"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-sm px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="">Status: Todos</option>
            <option value="ativo">Operacional</option>
            <option value="manutencao">Em Manutenção</option>
            <option value="baixado">Baixado</option>
          </select>
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredVeiculos.map((veiculo) => (
          <div
            key={veiculo.id}
            className="bg-white rounded-sm border border-slate-200 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-sm bg-slate-900 text-white tracking-wider">
                    {veiculo.placa}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-1.5">
                    {veiculo.marca} {veiculo.modelo}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Ano: {veiculo.anoFabricacao}/{veiculo.anoModelo} • {getTipoVeiculoLabel(veiculo.tipo)}
                  </p>
                </div>
                {getStatusBadge(veiculo.status)}
              </div>

              {/* Department & Fuel Badge */}
              <div className="space-y-1.5 my-3 text-xs bg-slate-50 p-2.5 rounded-sm border border-slate-200">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Secretaria:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                    {veiculo.secretariaNome}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Combustível:</span>
                  <span className="font-semibold text-blue-700">{veiculo.combustivelPadraoNome}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Capacidade Tanque:</span>
                  <span className="font-semibold text-slate-800">{veiculo.capacidadeTanqueLitros} L</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Odômetro Atual:</span>
                  <span className="font-bold font-mono text-slate-900">{formatKm(veiculo.odometroAtual)}</span>
                </div>
              </div>

              {/* Efficiency metrics */}
              <div className="grid grid-cols-2 gap-2 text-center py-1">
                <div className="bg-emerald-50/60 rounded-sm p-2 border border-emerald-100">
                  <div className="text-[10px] text-emerald-800 font-semibold">Consumo Real Aferido</div>
                  <div className="text-sm font-bold text-emerald-700 mt-0.5">
                    {formatKmL(veiculo.consumoRealKmL)}
                  </div>
                  <div className="text-[9px] text-slate-400">Meta: {veiculo.consumoMedioEstimadoKmL} km/L</div>
                </div>

                <div className="bg-blue-50/60 rounded-sm p-2 border border-blue-100">
                  <div className="text-[10px] text-blue-800 font-semibold">Custo Médio / km</div>
                  <div className="text-sm font-bold text-blue-700 mt-0.5">
                    {formatCustoPorKm(veiculo.custoPorKm)}
                  </div>
                  <div className="text-[9px] text-slate-400">Gasto total: {formatBRL(veiculo.totalGasto)}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                Últ. abast: {veiculo.ultimoAbastecimentoData || 'N/D'}
              </span>
              <button
                onClick={() => setSelectedVehicleDetails(veiculo)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                Ficha e Histórico
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Vehicle Drilldown Modal */}
      {selectedVehicleDetails && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-sm max-w-3xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <span className="font-mono text-base font-bold px-3 py-1 rounded-sm bg-slate-900 text-white">
                  {selectedVehicleDetails.placa}
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {selectedVehicleDetails.marca} {selectedVehicleDetails.modelo}
                  </h2>
                  <p className="text-xs text-slate-500">
                    RENAVAM: {selectedVehicleDetails.renavam} • Chassi: {selectedVehicleDetails.chassi || 'N/D'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVehicleDetails(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {/* Resumo Operacional */}
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="bg-slate-50 p-2.5 rounded-sm border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Odômetro</span>
                  <span className="text-sm font-bold font-mono text-slate-900">
                    {formatKm(selectedVehicleDetails.odometroAtual)}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-sm border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total em Litros</span>
                  <span className="text-sm font-bold text-slate-900">
                    {formatLiters(selectedVehicleDetails.totalLitros)}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-sm border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Gasto</span>
                  <span className="text-sm font-bold text-blue-700">
                    {formatBRL(selectedVehicleDetails.totalGasto)}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-sm border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Eficiência Real</span>
                  <span className="text-sm font-bold text-emerald-700">
                    {formatKmL(selectedVehicleDetails.consumoRealKmL)}
                  </span>
                </div>
              </div>

              {/* Tabela de Abastecimentos Recentes do Veículo */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-blue-600" />
                  Histórico de Abastecimentos Vinculados
                </h4>
                <div className="overflow-x-auto border border-slate-200 rounded-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Data/Hora</th>
                        <th className="py-2.5 px-3">Posto</th>
                        <th className="py-2.5 px-2">Combustível</th>
                        <th className="py-2.5 px-2 text-right">Litros</th>
                        <th className="py-2.5 px-2 text-right">Total (R$)</th>
                        <th className="py-2.5 px-2 text-right">Odômetro</th>
                        <th className="py-2.5 px-2 text-center">Consumo</th>
                        <th className="py-2.5 px-2 text-center">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {vehicleFuelingHistory.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-6 text-center text-slate-400">
                            Nenhum abastecimento registrado até o momento para este veículo.
                          </td>
                        </tr>
                      ) : (
                        vehicleFuelingHistory.map((abs) => (
                          <tr key={abs.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-mono text-[11px]">{abs.data} {abs.hora}</td>
                            <td className="py-2 px-3 font-semibold text-slate-800">{abs.postoNome}</td>
                            <td className="py-2 px-2 text-slate-600">{abs.combustivelNome}</td>
                            <td className="py-2 px-2 text-right font-semibold">{formatLiters(abs.quantidadeLitros)}</td>
                            <td className="py-2 px-2 text-right font-bold text-blue-700">{formatBRL(abs.valorTotal)}</td>
                            <td className="py-2 px-2 text-right font-mono">{formatKm(abs.odometroRegistrado)}</td>
                            <td className="py-2 px-2 text-center text-emerald-700 font-bold">
                              {abs.consumoKmLCalculado ? formatKmL(abs.consumoKmLCalculado) : '-'}
                            </td>
                            <td className="py-2 px-2 text-center">
                              <button
                                onClick={() => setSelectedAbastecimento(abs)}
                                className="p-1 text-slate-600 hover:text-blue-600"
                                title="Ver comprovante fiscal"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedVehicleDetails(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-sm cursor-pointer"
              >
                Fechar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
