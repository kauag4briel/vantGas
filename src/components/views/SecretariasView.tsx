import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatBRL, formatLiters } from '../../utils/formatters';
import {
  Building2,
  PieChart,
  Truck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  User,
  Phone,
  Mail,
  FolderTree,
} from 'lucide-react';

export const SecretariasView: React.FC = () => {
  const { secretarias, orgaos, centrosCusto, veiculos, abastecimentos } = useApp();
  const [selectedSecretariaId, setSelectedSecretariaId] = useState<string | null>(null);

  const selectedSecretaria = secretarias.find((s) => s.id === selectedSecretariaId);

  return (
    <div className="space-y-3.5 pb-8">
      {/* Header */}
      <div className="bg-white p-3 sm:p-3.5 rounded-sm border border-slate-300 shadow-xs">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
          <Building2 className="w-4 h-4 text-[#0b3b60]" />
          Órgãos, Secretarias e Dotações Orçamentárias
        </h2>
        <p className="text-[11px] text-slate-500">
          Controle descentralizado de centros de custo, veículos alocados e cumprimento de tetos orçamentários
        </p>
      </div>

      {/* Secretarias Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
              className="bg-white rounded-sm border border-slate-300 p-3.5 shadow-xs hover:border-slate-400 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-blue-50 text-blue-700 border border-blue-200">
                      {sec.sigla}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{sec.nome}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    <span>{veiculosDaSecretaria.length} veíc.</span>
                  </div>
                </div>

                {/* Gestor e Contato */}
                <div className="text-[11px] text-slate-500 space-y-0.5 my-2">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    <span className="truncate">Secretário: {sec.responsavelNome || sec.responsavel}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{sec.email}</span>
                  </div>
                </div>

                {/* Barra de Execução Orçamentária */}
                <div className="my-3 bg-slate-50 p-2.5 rounded-sm border border-slate-200">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500 font-medium">Execução Orçamentária Mês:</span>
                    <span
                      className={`font-bold ${
                        isCritico ? 'text-rose-600' : isAtencao ? 'text-amber-600' : 'text-emerald-700'
                      }`}
                    >
                      {percentExecucao.toFixed(1)}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 rounded-sm-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-sm-full ${
                        isCritico ? 'bg-rose-500' : isAtencao ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(percentExecucao, 100)}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 font-mono">
                    <span>Gasto: {formatBRL(sec.gastoAtualMes)}</span>
                    <span>Teto: {formatBRL(orcamento)}</span>
                  </div>
                </div>

                {/* Métricas de consumo */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs py-1">
                  <div className="bg-slate-50 rounded-sm p-1.5 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Saldo Restante</span>
                    <span className={`font-bold ${saldo < 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {formatBRL(saldo)}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-sm p-1.5 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Volume Mês</span>
                    <span className="font-bold text-slate-800">{formatLiters(sec.litrosAtualMes)}</span>
                  </div>
                </div>
              </div>

              {/* Botão de detalhamento */}
              <div className="pt-3 border-t border-slate-100 mt-3 flex justify-end">
                <button
                  onClick={() => setSelectedSecretariaId(sec.id)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  Ver Centros de Custo & Veículos
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Centros de Custo e Estrutura Hierárquica */}
      <div className="bg-white rounded-sm border border-slate-200 p-5 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-blue-600" />
          Centros de Custo Vinculados às Secretarias
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Estrutura contábil para apropriação dos lançamentos fiscais de abastecimento
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {centrosCusto.map((cc) => {
            const sec = secretarias.find((s) => s.id === cc.secretariaId);
            return (
              <div key={cc.id} className="p-3 bg-slate-50 border border-slate-200 rounded-sm text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] font-bold text-slate-500">{cc.codigo}</span>
                  <span className="px-1.5 py-0.5 rounded-sm text-[10px] font-semibold bg-blue-100 text-blue-800">
                    {cc.secretariaSigla || sec?.sigla || ''}
                  </span>
                </div>
                <div className="font-bold text-slate-900 text-xs">{cc.nome || cc.descricao}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{cc.secretariaNome || sec?.nome || ''}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
