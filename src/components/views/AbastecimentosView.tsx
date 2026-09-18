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
  Filter,
  FileSpreadsheet,
  Plus,
  Eye,
  XCircle,
  Fuel,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { Abastecimento } from '../../types';

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
    if (!cancelJustificativa.trim() || cancelJustificativa.trim().length < 8) {
      alert('A justificativa de cancelamento é obrigatória e deve ter pelo menos 8 caracteres para auditoria forense.');
      return;
    }

    const res = cancelAbastecimento(cancelingId, cancelJustificativa);
    alert(res.message);
    setCancelingId(null);
    setCancelJustificativa('');
  };

  return (
    <div className="space-y-3.5 pb-8">
      {/* Top summary header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 bg-white p-3 sm:p-3.5 rounded-sm border border-slate-300 shadow-xs">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
            <Fuel className="w-4 h-4 text-[#0b3b60]" />
            Registro Oficial de Abastecimentos Fiscais
          </h2>
          <p className="text-[11px] text-slate-500">
            Transações rastreáveis com autenticação, comprovante digital e integração com secretarias
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => exportarDadosCSV('abastecimentos')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-sm border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            Exportar CSV
          </button>
          {currentUser.role !== 'AUDITOR' && (
            <button
              onClick={() => setIsNovoAbastecimentoModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-sm bg-[#0b3b60] hover:bg-[#082e4c] text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" />
              Novo Abastecimento
            </button>
          )}
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="bg-white border border-slate-300 rounded-sm p-2.5 shadow-xs">
          <div className="text-[10px] font-semibold text-slate-500 uppercase">Transações Listadas</div>
          <div className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">{displayList.length} abastecimentos</div>
        </div>
        <div className="bg-white border border-slate-300 rounded-sm p-2.5 shadow-xs">
          <div className="text-[10px] font-semibold text-slate-500 uppercase">Volume Total Filtrado</div>
          <div className="text-base sm:text-lg font-bold text-emerald-700 mt-0.5">{formatLiters(totalFiltradoLitros)}</div>
        </div>
        <div className="bg-white border border-slate-300 rounded-sm p-2.5 shadow-xs">
          <div className="text-[10px] font-semibold text-slate-500 uppercase">Valor Líquido Válido</div>
          <div className="text-base sm:text-lg font-bold text-[#0b3b60] mt-0.5">{formatBRL(totalFiltradoValor)}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2 bg-white p-2.5 rounded-sm border border-slate-300 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Buscar por placa, motorista, código de autenticação, posto, cupom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-sm outline-none focus:bg-white focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            aria-label="Filtrar por status do abastecimento"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 border border-slate-300 rounded-sm px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="todos">Status: Todos</option>
            <option value="confirmado">Somente Confirmados</option>
            <option value="cancelado">Somente Cancelados</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-sm border border-slate-300 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-3">Autenticação / Data</th>
                <th className="py-3 px-3">Veículo / Frota</th>
                <th className="py-3 px-3">Secretaria</th>
                <th className="py-3 px-3">Posto Credenciado</th>
                <th className="py-3 px-2">Combustível</th>
                <th className="py-3 px-2 text-right">Litros</th>
                <th className="py-3 px-2 text-right">Preço/L</th>
                <th className="py-3 px-3 text-right">Valor Total</th>
                <th className="py-3 px-2 text-center">Consumo (km/L)</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {displayList.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">
                    Nenhum abastecimento localizado para os critérios aplicados.
                  </td>
                </tr>
              ) : (
                displayList.map((abs) => {
                  const isCancelado = abs.status === 'cancelado';
                  return (
                    <tr
                      key={abs.id}
                      className={`hover:bg-slate-50 transition-colors ${isCancelado ? 'bg-rose-50/40 text-slate-400' : ''}`}
                    >
                      <td className="py-3 px-3">
                        <div className="font-mono text-[11px] font-bold text-slate-900">
                          {abs.codigoAutenticacao}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {formatDateTime(abs.dataHora)}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 bg-slate-100 rounded-sm text-[10px] font-mono border border-slate-300">
                            {abs.veiculoPlaca}
                          </span>
                          <span className="truncate">{abs.veiculoModelo}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Odômetro: {formatKm(abs.odometroRegistrado)}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="text-slate-800 font-semibold truncate max-w-[130px]">
                          {abs.secretariaNome}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          Mot: {abs.motoristaNome}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="text-slate-900 font-semibold truncate max-w-[140px]">
                          {abs.postoNome}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Bomba {abs.numeroBomba || 1} • {abs.numeroCupomFiscal || 'Cupom N/D'}
                        </div>
                      </td>

                      <td className="py-3 px-2">
                        <span className="px-2 py-0.5 rounded-sm text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {abs.combustivelNome}
                        </span>
                      </td>

                      <td className="py-3 px-2 text-right font-semibold text-slate-800">
                        {formatLiters(abs.quantidadeLitros)}
                      </td>

                      <td className="py-3 px-2 text-right text-slate-600">
                        {formatBRL(abs.precoUnitarioLitro)}
                      </td>

                      <td className="py-3 px-3 text-right font-bold text-blue-700">
                        {formatBRL(abs.valorTotal)}
                      </td>

                      <td className="py-3 px-2 text-center font-mono text-slate-700">
                        {abs.consumoKmLCalculado ? (
                          <span className="text-emerald-700 font-bold">{formatKmL(abs.consumoKmLCalculado)}</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      <td className="py-3 px-2">
                        {isCancelado ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <XCircle className="w-3 h-3" />
                            Cancelado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Confirmado
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedAbastecimento(abs)}
                            className="p-1 rounded-sm text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
                            title="Ver ficha fiscal detalhada"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {!isCancelado && currentUser.role !== 'AUDITOR' && (
                            <button
                              onClick={() => {
                                setCancelingId(abs.id);
                                setCancelJustificativa('');
                              }}
                              className="p-1 rounded-sm text-rose-500 hover:bg-rose-100 transition-colors cursor-pointer"
                              title="Cancelar este abastecimento (Requer justificativa)"
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

      {/* Cancelation confirmation prompt modal */}
      {cancelingId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm max-w-md w-full p-5 shadow-2xl border border-rose-200">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm mb-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              Auditoria: Cancelamento de Abastecimento
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Por determinação dos Tribunais de Contas e normas de conformidade municipal, o cancelamento de um
              abastecimento confirmado requer <strong>justificativa fundamentada obrigatória</strong>, a qual será
              registrada de forma indelével na trilha de auditoria forense do sistema.
            </p>

            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Justificativa Técnica de Cancelamento (Mínimo 8 caracteres):
            </label>
            <textarea
              rows={3}
              value={cancelJustificativa}
              onChange={(e) => setCancelJustificativa(e.target.value)}
              placeholder="Ex: Erro material no lançamento de litros ou cupom estornado na bomba pelo fiscal..."
              className="w-full text-xs p-2.5 border border-slate-300 rounded-sm outline-none focus:ring-2 focus:ring-rose-500"
            ></textarea>

            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                onClick={() => setCancelingId(null)}
                className="px-3 py-1.5 rounded-sm border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-1.5 rounded-sm bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                Efetivar Cancelamento e Registrar Auditoria
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
