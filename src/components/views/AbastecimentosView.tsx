import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  formatBRL,
  formatLiters,
  formatDateTime,
  formatKmL,
  formatKm,
} from '../../utils/formatters';
import {
  Search,
  FileSpreadsheet,
  Plus,
  Eye,
  XCircle,
  Fuel,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const AbastecimentosView: React.FC = () => {
  const {
    filteredAbastecimentos,
    setSelectedAbastecimento,
    setIsNovoAbastecimentoModalOpen,
    exportarDadosCSV,
    cancelAbastecimento,
    currentUser,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [cancelJustificativa, setCancelJustificativa] = useState('');

  const displayList = useMemo(() => {
    return filteredAbastecimentos.filter((a) => {
      if (selectedStatus !== 'todos' && a.status !== selectedStatus) return false;

      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        a.codigoAutenticacao.toLowerCase().includes(term) ||
        a.veiculoPlaca.toLowerCase().includes(term) ||
        a.veiculoModelo.toLowerCase().includes(term) ||
        a.postoNome.toLowerCase().includes(term) ||
        a.secretariaNome.toLowerCase().includes(term) ||
        a.motoristaNome.toLowerCase().includes(term) ||
        (a.numeroCupomFiscal && a.numeroCupomFiscal.toLowerCase().includes(term))
      );
    });
  }, [filteredAbastecimentos, searchTerm, selectedStatus]);

  const totalFiltradoValor = displayList.reduce((acc, a) => acc + (a.status === 'confirmado' ? a.valorTotal : 0), 0);
  const totalFiltradoLitros = displayList.reduce((acc, a) => acc + (a.status === 'confirmado' ? a.quantidadeLitros : 0), 0);

  const handleConfirmCancel = () => {
    if (!cancelingId) return;
    if (!cancelJustificativa.trim() || cancelJustificativa.trim().length < 5) {
      alert('Por favor, informe uma justificativa válida com pelo menos 5 caracteres.');
      return;
    }

    const res = cancelAbastecimento(cancelingId, cancelJustificativa);
    alert(res.message);
    setCancelingId(null);
    setCancelJustificativa('');
  };

  return (
    <div className="space-y-4 pb-10">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Fuel className="w-5 h-5 text-emerald-600" />
            Histórico de Abastecimentos
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualize, filtre e gerencie todas as transações de combustível da frota
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => exportarDadosCSV('abastecimentos')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>Exportar CSV</span>
          </button>
          {currentUser.role !== 'AUDITOR' && (
            <button
              onClick={() => setIsNovoAbastecimentoModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Registro</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total de Registros</div>
          <div className="text-xl font-black text-slate-900 mt-1">{displayList.length} abastecimentos</div>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Volume Total</div>
          <div className="text-xl font-black text-blue-600 mt-1">{formatLiters(totalFiltradoLitros)}</div>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Valor Líquido</div>
          <div className="text-xl font-black text-emerald-600 mt-1">{formatBRL(totalFiltradoValor)}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por placa, modelo, motorista, código ou posto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            aria-label="Filtrar por status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
          >
            <option value="todos">Todos os Status</option>
            <option value="confirmado">Confirmados</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Data / Código</th>
                <th className="py-3 px-3">Veículo</th>
                <th className="py-3 px-3">Posto</th>
                <th className="py-3 px-3">Combustível</th>
                <th className="py-3 px-3 text-right">Litros</th>
                <th className="py-3 px-3 text-right">Valor Total</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {displayList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Nenhum abastecimento encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                displayList.map((abs) => {
                  const isCancelado = abs.status === 'cancelado';
                  return (
                    <tr
                      key={abs.id}
                      className={`hover:bg-slate-50/80 transition-colors ${isCancelado ? 'bg-rose-50/30 text-slate-400' : ''}`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{formatDateTime(abs.dataHora)}</div>
                        <div className="font-mono text-[10px] text-slate-400">{abs.codigoAutenticacao}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-mono border border-slate-200">
                            {abs.veiculoPlaca}
                          </span>
                          <span className="truncate">{abs.veiculoModelo}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {abs.motoristaNome ? `Mot: ${abs.motoristaNome}` : `KM: ${formatKm(abs.odometroRegistrado)}`}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="text-slate-800 font-semibold truncate max-w-[140px]">{abs.postoNome}</div>
                        <div className="text-[10px] text-slate-400">{abs.secretariaNome}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {abs.combustivelNome}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5">{formatBRL(abs.precoUnitarioLitro)}/L</div>
                      </td>

                      <td className="py-3 px-3 text-right font-semibold text-slate-800">
                        {formatLiters(abs.quantidadeLitros)}
                      </td>

                      <td className="py-3 px-3 text-right font-bold text-emerald-700">
                        {formatBRL(abs.valorTotal)}
                      </td>

                      <td className="py-3 px-3 text-center">
                        {isCancelado ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3" />
                            Cancelado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Confirmado
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedAbastecimento(abs)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                            title="Ver detalhes do abastecimento"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {!isCancelado && currentUser.role !== 'AUDITOR' && (
                            <button
                              onClick={() => {
                                setCancelingId(abs.id);
                                setCancelJustificativa('');
                              }}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Cancelar abastecimento"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancelation confirmation modal */}
      {cancelingId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm mb-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              Cancelar Abastecimento
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Informe o motivo do cancelamento deste registro. A operação ficará registrada no histórico.
            </p>

            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Motivo do Cancelamento:
            </label>
            <textarea
              rows={3}
              value={cancelJustificativa}
              onChange={(e) => setCancelJustificativa(e.target.value)}
              placeholder="Ex: Erro no lançamento de litros ou cupom estornado..."
              className="w-full text-xs p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
            ></textarea>

            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                onClick={() => setCancelingId(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
