import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDateTime } from '../../utils/formatters';
import {
  X,
  ShieldAlert,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

export const AnalisarAlertaModal: React.FC = () => {
  const {
    isAnalisarAlertaModalOpen,
    setIsAnalisarAlertaModalOpen,
    selectedAlertaParaAnalise,
    setSelectedAlertaParaAnalise,
    analisarAlerta,
    currentUser,
  } = useApp();

  const [decisao, setDecisao] = useState<'justificado' | 'confirmado_irregularidade'>('justificado');
  const [justificativa, setJustificativa] = useState('');

  if (!isAnalisarAlertaModalOpen || !selectedAlertaParaAnalise) return null;

  const alerta = selectedAlertaParaAnalise;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!justificativa.trim() || justificativa.trim().length < 10) {
      alert('O parecer técnico é obrigatório e deve conter ao menos 10 caracteres fundamentando o julgamento.');
      return;
    }

    analisarAlerta(alerta.id, decisao, justificativa.trim());
    alert('Análise técnica registrada e gravada na trilha de auditoria municipal!');
    setIsAnalisarAlertaModalOpen(false);
    setSelectedAlertaParaAnalise(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-sm max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-6 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={() => {
            setIsAnalisarAlertaModalOpen(false);
            setSelectedAlertaParaAnalise(null);
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-sm cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-slate-200 pb-3 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-sm bg-amber-500 text-white flex items-center justify-center font-bold">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Parecer Técnico de Fiscalização de Anomalia
            </h2>
            <p className="text-xs text-slate-500">
              Julgamento de inconformidade pelo Fiscal Operacional com registro forense
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          {/* Alerta Resumo */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-sm p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900 text-sm">{alerta.titulo}</span>
              <span className="text-[10px] text-amber-700 font-mono">
                {formatDateTime(alerta.dataCriacao)}
              </span>
            </div>
            <p className="text-amber-800 leading-relaxed text-xs">{alerta.descricao}</p>
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-amber-900 font-medium">
              {alerta.veiculoPlaca && <span>Placa: <strong>{alerta.veiculoPlaca}</strong></span>}
              {alerta.postoNome && <span>• Posto: <strong>{alerta.postoNome}</strong></span>}
              {alerta.secretariaNome && <span>• Órgão: <strong>{alerta.secretariaNome}</strong></span>}
            </div>
          </div>

          {/* Decisão */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
              Decisão do Fiscal Técnico:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-start gap-2.5 p-3 rounded-sm border cursor-pointer transition-all ${
                  decisao === 'justificado'
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 ring-1 ring-emerald-400'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="decisao"
                  checked={decisao === 'justificado'}
                  onChange={() => setDecisao('justificado')}
                  className="mt-0.5"
                />
                <div>
                  <div className="font-bold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Justificar Ocorrência
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    A divergência decorre de motivo operacional legítimo e comprovado.
                  </div>
                </div>
              </label>

              <label
                className={`flex items-start gap-2.5 p-3 rounded-sm border cursor-pointer transition-all ${
                  decisao === 'confirmado_irregularidade'
                    ? 'border-rose-500 bg-rose-50/50 text-rose-900 ring-1 ring-rose-400'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="decisao"
                  checked={decisao === 'confirmado_irregularidade'}
                  onChange={() => setDecisao('confirmado_irregularidade')}
                  className="mt-0.5"
                />
                <div>
                  <div className="font-bold text-xs flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    Confirmar Irregularidade
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Indício de fraude ou dolo para encaminhamento à Controladoria.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Justificativa / Parecer */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Parecer Técnico Fundamentado (Obrigatório):
            </label>
            <textarea
              required
              rows={4}
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              placeholder="Descreva detalhadamente a averiguação, contato com o condutor, ordem de serviço ou nota fiscal comprobatória..."
              className="w-full text-xs p-2.5 border border-slate-300 rounded-sm outline-none focus:ring-1 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsAnalisarAlertaModalOpen(false);
                setSelectedAlertaParaAnalise(null);
              }}
              className="px-3.5 py-2 rounded-sm border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-sm bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs cursor-pointer transition-colors"
            >
              Gravar Parecer do Fiscal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
