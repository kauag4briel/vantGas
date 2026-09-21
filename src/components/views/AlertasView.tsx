import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDateTime, getAlertaBadge } from '../../utils/formatters';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Eye,
  FileCheck,
  Search,
} from 'lucide-react';
import { Alerta } from '../../types';

export const AlertasView: React.FC = () => {
  const {
    alertas,
    analisarAlerta,
    currentUser,
    setSelectedAlertaParaAnalise,
    setIsAnalisarAlertaModalOpen,
  } = useApp();

  const [gravidadeFilter, setGravidadeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlertas = alertas.filter((a) => {
    if (gravidadeFilter && a.gravidade !== gravidadeFilter) return false;
    if (statusFilter !== 'todos' && a.status !== statusFilter) return false;

    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      a.titulo.toLowerCase().includes(term) ||
      a.descricao.toLowerCase().includes(term) ||
      (a.veiculoPlaca && a.veiculoPlaca.toLowerCase().includes(term)) ||
      (a.postoNome && a.postoNome.toLowerCase().includes(term)) ||
      (a.secretariaNome && a.secretariaNome.toLowerCase().includes(term))
    );
  });

  const getGravidadeBadge = (gravidade: Alerta['gravidade']) => {
    const map = {
      baixa: { label: 'Gravidade Baixa', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
      media: { label: 'Gravidade Média', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
      alta: { label: 'Gravidade Alta', bg: 'bg-orange-50 text-orange-700 border-orange-200' },
      critica: { label: 'Gravidade Crítica', bg: 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' },
    };
    const item = map[gravidade] || map.media;
    return (
      <span className={`px-2 py-0.5 rounded-sm-full text-[10px] font-bold border ${item.bg}`}>
        {item.label}
      </span>
    );
  };

  const getStatusBadge = (status: Alerta['status']) => {
    if (status === 'pendente') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <Clock className="w-3 h-3 text-amber-600" />
          Pendente
        </span>
      );
    }
    if (status === 'justificado') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Justificado
        </span>
      );
    }
    if (status === 'confirmado_irregularidade') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm-full text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
          <XCircle className="w-3 h-3 text-rose-700" />
          Irregularidade Confirmada
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-sm-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
        Em Análise
      </span>
    );
  };

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          Central de Alertas & Auditoria
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Identificação automática de inconsistências, desvios de consumo e inconformidades de abastecimento
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-2.5 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar alerta por placa, título, posto ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Filtrar alertas por gravidade"
            value={gravidadeFilter}
            onChange={(e) => setGravidadeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">Todas as Gravidades</option>
            <option value="critica">Crítica</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>

          <select
            aria-label="Filtrar alertas por status de fiscalização"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
          >
            <option value="todos">Todos os Status</option>
            <option value="pendente">Pendentes</option>
            <option value="justificado">Justificados</option>
            <option value="confirmado_irregularidade">Irregularidades</option>
          </select>
        </div>
      </div>

      {/* Alertas Cards List */}
      <div className="space-y-3">
        {filteredAlertas.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
            Nenhum alerta localizado para os filtros selecionados.
          </div>
        ) : (
          filteredAlertas.map((alerta) => {
            const isPendente = alerta.status === 'pendente';

            return (
              <div
                key={alerta.id}
                className={`bg-white rounded-xl border p-4 sm:p-5 shadow-xs transition-all ${
                  isPendente ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-200/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getGravidadeBadge(alerta.gravidade)}
                      {getStatusBadge(alerta.status)}
                      <span className="text-[11px] text-slate-400 font-mono">
                        {formatDateTime(alerta.dataCriacao)}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      {alerta.titulo}
                    </h3>

                    <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                      {alerta.descricao}
                    </p>

                    {/* Metadata chips */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      {alerta.veiculoPlaca && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-bold border border-slate-200">
                          Placa: {alerta.veiculoPlaca}
                        </span>
                      )}
                      {alerta.postoNome && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] border border-slate-200">
                          Posto: {alerta.postoNome}
                        </span>
                      )}
                      {alerta.secretariaNome && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] border border-slate-200">
                          Setor: {alerta.secretariaNome}
                        </span>
                      )}
                      {alerta.analisadoPor && (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] border border-emerald-200">
                          Fiscal: {alerta.analisadoPor}
                        </span>
                      )}
                    </div>

                    {/* Justificativa ou parecer se já analisado */}
                    {alerta.justificativa && (
                      <div className="mt-2 text-xs bg-slate-50 border-l-2 border-emerald-500 p-2.5 rounded-r-lg text-slate-700">
                        <span className="font-semibold text-slate-900 block text-[11px]">Parecer Registrado:</span>
                        {alerta.justificativa}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex items-center gap-2 pt-2 sm:pt-0">
                    <button
                      onClick={() => {
                        setSelectedAlertaParaAnalise(alerta);
                        setIsAnalisarAlertaModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>{isPendente ? 'Analisar' : 'Ver Parecer'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
