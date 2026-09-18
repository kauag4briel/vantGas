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
    <div className="space-y-3.5 pb-8">
      {/* Header */}
      <div className="bg-white p-3 sm:p-3.5 rounded-sm border border-slate-300 shadow-xs">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          Central de Alertas & Detecção de Inconsistências
        </h2>
        <p className="text-[11px] text-slate-500">
          Fiscalização eletrônica contínua e regras automáticas de cruzamento para prevenção de inconformidades e desvios
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-2 bg-white p-2.5 rounded-sm border border-slate-300 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Buscar alerta por título, placa, descrição, posto ou secretaria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-sm outline-none focus:bg-white focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Filtrar alertas por gravidade"
            value={gravidadeFilter}
            onChange={(e) => setGravidadeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-sm px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="">Gravidades: Todas</option>
            <option value="critica">Crítica</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>

          <select
            aria-label="Filtrar alertas por status de fiscalização"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-sm px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="todos">Status: Todos</option>
            <option value="pendente">Somente Pendentes</option>
            <option value="justificado">Justificados / Homologados</option>
            <option value="confirmado_irregularidade">Irregularidades Confirmadas</option>
          </select>
        </div>
      </div>

      {/* Alertas Cards List */}
      <div className="space-y-2.5">
        {filteredAlertas.length === 0 ? (
          <div className="bg-white p-8 rounded-sm border border-slate-200 text-center text-slate-400 text-xs">
            Nenhum alerta ou anomalia localizada para os filtros especificados.
          </div>
        ) : (
          filteredAlertas.map((alerta) => {
            const isPendente = alerta.status === 'pendente';

            return (
              <div
                key={alerta.id}
                className={`bg-white rounded-sm border p-4 shadow-2xs transition-all ${
                  isPendente ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="space-y-1.5">
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
                    <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-500">
                      {alerta.veiculoPlaca && (
                        <span className="px-2 py-0.5 rounded-sm bg-slate-100 font-mono font-bold text-slate-700 border border-slate-200">
                          Placa: {alerta.veiculoPlaca}
                        </span>
                      )}
                      {alerta.postoNome && (
                        <span className="px-2 py-0.5 rounded-sm bg-slate-100 font-medium text-slate-700 border border-slate-200">
                          Posto: {alerta.postoNome}
                        </span>
                      )}
                      {alerta.secretariaNome && (
                        <span className="px-2 py-0.5 rounded-sm bg-slate-100 font-medium text-slate-700 border border-slate-200">
                          Secretaria: {alerta.secretariaNome}
                        </span>
                      )}
                      {alerta.analisadoPor && (
                        <span className="px-2 py-0.5 rounded-sm bg-blue-50 font-medium text-blue-700 border border-blue-200">
                          Fiscal: {alerta.analisadoPor}
                        </span>
                      )}
                    </div>

                    {/* Justificativa ou parecer se já analisado */}
                    {alerta.justificativa && (
                      <div className="mt-2 text-xs bg-slate-50 border-l-2 border-blue-600 p-2 text-slate-700">
                        <span className="font-semibold text-slate-900 block text-[11px]">Parecer Técnico:</span>
                        {alerta.justificativa}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex items-center gap-2">
                    {isPendente && currentUser.role !== 'AUDITOR' && (
                      <button
                        onClick={() => {
                          setSelectedAlertaParaAnalise(alerta);
                          setIsAnalisarAlertaModalOpen(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs cursor-pointer transition-colors"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        Analisar & Julgar
                      </button>
                    )}
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
