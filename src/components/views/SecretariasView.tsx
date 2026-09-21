import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatBRL, formatLiters } from '../../utils/formatters';
import {
  Building2,
  Truck,
  User,
  Mail,
  FolderTree,
  ChevronRight,
  X,
} from 'lucide-react';

export const SecretariasView: React.FC = () => {
  const { secretarias, centrosCusto, veiculos } = useApp();
  const [selectedSecretariaId, setSelectedSecretariaId] = useState<string | null>(null);

  const selectedSecretaria = secretarias.find((s) => s.id === selectedSecretariaId);
  const selectedVeiculos = selectedSecretaria ? veiculos.filter((v) => v.secretariaId === selectedSecretaria.id) : [];
  const selectedCentrosCusto = selectedSecretaria ? centrosCusto.filter((c) => c.secretariaId === selectedSecretaria.id) : [];

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-600" />
          Secretarias & Dotações Orçamentárias
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Controle de limites mensais de combustível, veículos alocados e execução orçamentária
        </p>
      </div>

      {/* Secretarias Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {secretarias.map((sec) => {
          const orcamento = sec.orcamentoMensal ?? sec.limiteMensalCombustivel ?? 0;
          const percentExecucao = orcamento > 0 ? (sec.gastoAtualMes / orcamento) * 100 : 0;
          const isCritico = percentExecucao >= 90;
          const isAtencao = percentExecucao >= 75 && percentExecucao < 90;
          const saldo = orcamento - sec.gastoAtualMes;

          const veiculosDaSecretaria = veiculos.filter((v) => v.secretariaId === sec.id);

          return (
            <div
              key={sec.id}
              className={`bg-white rounded-xl border p-4 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between ${
                selectedSecretariaId === sec.id ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200/80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {sec.sigla}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1.5">{sec.nome}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-600 font-semibold bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    <span>{veiculosDaSecretaria.length} veíc.</span>
                  </div>
                </div>

                {/* Gestor e Contato */}
                <div className="text-[11px] text-slate-500 space-y-1 my-3">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">Responsável: {sec.responsavelNome || sec.responsavel}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{sec.email}</span>
                  </div>
                </div>

                {/* Barra de Execução Orçamentária */}
                <div className="my-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-600 font-medium">Execução do Mês:</span>
                    <span
                      className={`font-bold ${
                        isCritico ? 'text-rose-600' : isAtencao ? 'text-amber-600' : 'text-emerald-700'
                      }`}
                    >
                      {percentExecucao.toFixed(1)}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCritico ? 'bg-rose-500' : isAtencao ? 'bg-amber-500' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${Math.min(percentExecucao, 100)}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-mono">
                    <span>Gasto: {formatBRL(sec.gastoAtualMes)}</span>
                    <span>Teto: {formatBRL(orcamento)}</span>
                  </div>
                </div>

                {/* Métricas de consumo */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs py-1">
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-medium">Saldo Restante</span>
                    <span className={`font-bold ${saldo < 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {formatBRL(saldo)}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-medium">Volume no Mês</span>
                    <span className="font-bold text-slate-800">{formatLiters(sec.litrosAtualMes)}</span>
                  </div>
                </div>
              </div>

              {/* Botão de detalhamento */}
              <div className="pt-3 border-t border-slate-100 mt-3 flex justify-end">
                <button
                  onClick={() => setSelectedSecretariaId(selectedSecretariaId === sec.id ? null : sec.id)}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>{selectedSecretariaId === sec.id ? 'Fechar Detalhes' : 'Ver Veículos & Detalhes'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal/Gaveta de Detalhamento da Secretaria Selecionada */}
      {selectedSecretaria && (
        <div className="bg-white rounded-xl border border-emerald-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {selectedSecretaria.sigla}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">{selectedSecretaria.nome}</h3>
            </div>
            <button
              onClick={() => setSelectedSecretariaId(null)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Veículos vinculados */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                Veículos Alocados ({selectedVeiculos.length})
              </h4>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {selectedVeiculos.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Nenhum veículo alocado para este setor.</p>
                ) : (
                  selectedVeiculos.map((v) => (
                    <div key={v.id} className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-slate-900">{v.placa}</span>
                        <span className="text-slate-500 ml-2">{v.modelo}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                        {v.combustivelPadraoNome}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Centros de custo vinculados */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FolderTree className="w-4 h-4 text-emerald-600" />
                Centros de Custo ({selectedCentrosCusto.length})
              </h4>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {selectedCentrosCusto.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Nenhum centro de custo específico cadastrado.</p>
                ) : (
                  selectedCentrosCusto.map((cc) => (
                    <div key={cc.id} className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800">{cc.nome || cc.descricao}</span>
                      <span className="font-mono text-[10px] text-slate-500 font-bold">{cc.codigo}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Centros de Custo e Estrutura Geral */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-emerald-600" />
          Centros de Custo Cadastrados
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Estrutura contábil para apropriação dos lançamentos fiscais de abastecimento
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {centrosCusto.map((cc) => {
            const sec = secretarias.find((s) => s.id === cc.secretariaId);
            return (
              <div key={cc.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] font-bold text-slate-500">{cc.codigo}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {cc.secretariaSigla || sec?.sigla || ''}
                  </span>
                </div>
                <div className="font-bold text-slate-900 text-xs">{cc.nome || cc.descricao}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 truncate">{cc.secretariaNome || sec?.nome || ''}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
