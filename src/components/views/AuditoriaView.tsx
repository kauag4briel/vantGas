import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDateTime, getRoleBadge } from '../../utils/formatters';
import {
  ScrollText,
  Search,
  ShieldCheck,
  FileSpreadsheet,
  Lock,
  User,
  Clock,
  Terminal,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AuditLog } from '../../types';

export const AuditoriaView: React.FC = () => {
  const { auditLogs, exportarDadosCSV } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [acaoFilter, setAcaoFilter] = useState('');
  const [recursoFilter, setRecursoFilter] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (acaoFilter && log.acao !== acaoFilter) return false;
      if (recursoFilter && log.recurso !== recursoFilter) return false;

      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        log.usuarioNome.toLowerCase().includes(term) ||
        log.usuarioEmail.toLowerCase().includes(term) ||
        log.recurso.toLowerCase().includes(term) ||
        log.recursoId.toLowerCase().includes(term) ||
        (log.justificativa && log.justificativa.toLowerCase().includes(term))
      );
    });
  }, [auditLogs, searchTerm, acaoFilter, recursoFilter]);

  const getAcaoBadge = (acao: AuditLog['acao']) => {
    const map: Record<string, string> = {
      INSERT: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      UPDATE: 'bg-blue-100 text-blue-800 border-blue-200',
      DELETE: 'bg-rose-100 text-rose-800 border-rose-200',
      CANCEL: 'bg-amber-100 text-amber-800 border-amber-200',
      EXPORT: 'bg-purple-100 text-purple-800 border-purple-200',
      LOGIN: 'bg-slate-100 text-slate-800 border-slate-200',
      LOGOUT: 'bg-slate-100 text-slate-700 border-slate-200',
      API_SYNC: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      SECURITY_CHECK: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };
    return (
      <span className={`px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold border ${map[acao] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
        {acao}
      </span>
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-emerald-600" />
            Trilha de Auditoria & Segurança
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro cronológico indelével de todas as ações sensíveis, alterações e exportações
          </p>
        </div>

        <button
          onClick={() => exportarDadosCSV('auditoria')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer shadow-xs transition-colors shrink-0"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
          Exportar Logs (CSV)
        </button>
      </div>

      {/* Security Statement Banner */}
      <div className="bg-slate-900 text-slate-200 p-4 rounded-xl border border-slate-800 flex items-start gap-3 text-xs shadow-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-white flex items-center gap-2 text-xs">
            Garantia de Não-Repúdio e Rastreabilidade Integral
            <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full text-[9px] font-bold border border-emerald-800">
              Imutável
            </span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Nenhum registro de auditoria pode ser excluído ou editado por qualquer usuário do sistema. Todas as
            operações capturam o carimbo de tempo do servidor, perfil RBAC, endereço IP e dados anteriores e novos.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por usuário, recurso, justificativa ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Filtrar por ação de auditoria"
            value={acaoFilter}
            onChange={(e) => setAcaoFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">Todas as Ações</option>
            <option value="INSERT">INSERT</option>
            <option value="UPDATE">UPDATE</option>
            <option value="CANCEL">CANCEL</option>
            <option value="EXPORT">EXPORT</option>
          </select>

          <select
            aria-label="Filtrar por recurso auditado"
            value={recursoFilter}
            onChange={(e) => setRecursoFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">Todos os Recursos</option>
            <option value="ABASTECIMENTO">ABASTECIMENTO</option>
            <option value="POSTO">POSTO</option>
            <option value="VEICULO">VEICULO</option>
            <option value="PRECO_COMBUSTIVEL">PRECO_COMBUSTIVEL</option>
            <option value="ALERTA">ALERTA</option>
            <option value="RELATORIO_CSV">RELATORIO_CSV</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-3">Data e Hora</th>
                <th className="py-3 px-3">Usuário / Perfil</th>
                <th className="py-3 px-2">Ação</th>
                <th className="py-3 px-2">Recurso</th>
                <th className="py-3 px-3">ID do Recurso</th>
                <th className="py-3 px-3">Endereço IP</th>
                <th className="py-3 px-3">Justificativa / Motivo</th>
                <th className="py-3 px-2 text-center">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.map((log) => {
                const isExpanded = expandedLogId === log.id;
                const roleBadge = getRoleBadge(log.usuarioRole);

                return (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                        {formatDateTime(log.dataHora)}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{log.usuarioNome}</div>
                        <div className="text-[10px] text-slate-400">{log.usuarioEmail}</div>
                      </td>
                      <td className="py-2.5 px-2">{getAcaoBadge(log.acao)}</td>
                      <td className="py-2.5 px-2 font-mono text-[11px] text-slate-700">{log.recurso}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-blue-700">{log.recursoId}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{log.ip}</td>
                      <td className="py-2.5 px-3 text-slate-700 max-w-xs truncate">
                        {log.justificativa || '-'}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <button
                          onClick={() => toggleExpand(log.id)}
                          className="p-1 rounded-sm text-slate-500 hover:bg-slate-200 cursor-pointer"
                          title="Ver detalhes de diff / carga de dados"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Diff / Payload Details */}
                    {isExpanded && (
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <td colSpan={8} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                            {log.valoresAnteriores && (
                              <div className="bg-white p-3 rounded-sm border border-slate-200">
                                <span className="text-[10px] text-rose-600 font-bold uppercase block mb-1">
                                  Valores Anteriores (Estado Prévio):
                                </span>
                                <pre className="text-[11px] text-slate-700 overflow-x-auto whitespace-pre-wrap">
                                  {JSON.stringify(log.valoresAnteriores, null, 2)}
                                </pre>
                              </div>
                            )}
                            {log.valoresNovos && (
                              <div className="bg-white p-3 rounded-sm border border-slate-200">
                                <span className="text-[10px] text-emerald-600 font-bold uppercase block mb-1">
                                  Valores Registrados (Novo Estado):
                                </span>
                                <pre className="text-[11px] text-slate-700 overflow-x-auto whitespace-pre-wrap">
                                  {JSON.stringify(log.valoresNovos, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
