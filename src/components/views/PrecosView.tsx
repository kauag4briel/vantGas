import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatBRL, formatDateOnly } from '../../utils/formatters';
import {
  TrendingUp,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Calendar,
  Filter,
  Fuel,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const PrecosView: React.FC = () => {
  const { postos, combustiveis, precosHistorico } = useApp();
  const [selectedCombustivelId, setSelectedCombustivelId] = useState<string>(combustiveis[0]?.id || '');

  // Preço mínimo, médio e máximo municipal por combustível
  const statsPorCombustivel = useMemo(() => {
    return combustiveis.map((comb) => {
      const precosDoCombustivel: { postoNome: string; preco: number }[] = [];

      postos.forEach((p) => {
        const item = p.combustiveis.find((c) => c.combustivelId === comb.id);
        if (item) {
          precosDoCombustivel.push({ postoNome: p.nomeFantasia, preco: item.precoAtual });
        }
      });

      const valores = precosDoCombustivel.map((p) => p.preco);
      const min = valores.length > 0 ? Math.min(...valores) : 0;
      const max = valores.length > 0 ? Math.max(...valores) : 0;
      const media = valores.length > 0 ? valores.reduce((a, b) => a + b, 0) / valores.length : 0;
      const amplitude = max - min;
      const percentVariacao = min > 0 ? (amplitude / min) * 100 : 0;

      return {
        combustivel: comb,
        min,
        max,
        media,
        amplitude,
        percentVariacao,
        postosCount: precosDoCombustivel.length,
        detalhes: precosDoCombustivel,
      };
    });
  }, [postos, combustiveis]);

  // Histórico ordenado
  const historicoOrdenado = useMemo(() => {
    return [...precosHistorico].sort((a, b) => b.dataRegistro.localeCompare(a.dataRegistro));
  }, [precosHistorico]);

  return (
    <div className="space-y-3.5 pb-8">
      {/* Header */}
      <div className="bg-white p-3 sm:p-3.5 rounded-sm border border-slate-300 shadow-xs">
        <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-[#0b3b60]" />
          Controle Municipal de Preços & Reajustes de Combustível
        </h2>
        <p className="text-[11px] text-slate-500">
          Monitoramento de preços praticados pelos postos credenciados, dispersão de valores e auditoria de variações
        </p>
      </div>

      {/* Cards de Métricas por Combustível */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {statsPorCombustivel.map((stat) => (
          <div key={stat.combustivel.id} className="bg-white rounded-sm border border-slate-300 p-3 sm:p-3.5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900">{stat.combustivel.nome}</span>
              <span className="text-[10px] text-slate-400 font-semibold">{stat.postosCount} postos</span>
            </div>

            <div className="text-xl font-bold text-blue-700 tracking-tight">
              {formatBRL(stat.media)}
              <span className="text-xs font-normal text-slate-400"> /L (médio)</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Menor Preço</span>
                <span className="font-semibold text-emerald-700">{formatBRL(stat.min)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Maior Preço</span>
                <span className="font-semibold text-rose-700">{formatBRL(stat.max)}</span>
              </div>
            </div>

            <div className="mt-2 text-[10px] flex items-center justify-between text-slate-500 bg-slate-50 p-1.5 rounded-sm">
              <span>Dispersão de Preços:</span>
              <span className="font-bold text-slate-800">
                {formatBRL(stat.amplitude)} ({stat.percentVariacao.toFixed(1)}%)
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Matriz Comparativa Posto x Combustível */}
      <div className="bg-white rounded-sm border border-slate-200 p-5 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Fuel className="w-4 h-4 text-blue-600" />
          Matriz Vigente de Preços Praticados nos Postos
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Valores unitários cobrados nas bombas credenciadas para a frota do município
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Posto Credenciado</th>
                <th className="py-2.5 px-2">Bandeira</th>
                {combustiveis.map((c) => (
                  <th key={c.id} className="py-2.5 px-2 text-right">
                    {c.nome}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {postos.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-slate-900">{p.nomeFantasia}</td>
                  <td className="py-2.5 px-2 text-slate-500 text-[11px]">{p.bandeira}</td>
                  {combustiveis.map((c) => {
                    const found = p.combustiveis.find((item) => item.combustivelId === c.id);
                    return (
                      <td key={c.id} className="py-2.5 px-2 text-right font-mono text-xs">
                        {found ? (
                          <span className="font-bold text-slate-800">{formatBRL(found.precoAtual)}</span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Histórico Recente de Alterações de Preços */}
      <div className="bg-white rounded-sm border border-slate-200 p-5 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          Trilha Histórica de Reajustes Homologados
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Registros cronológicos de alterações nos valores unitários de combustíveis
        </p>

        <div className="overflow-x-auto border border-slate-200 rounded-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Data da Vigência</th>
                <th className="py-2.5 px-3">Posto Credenciado</th>
                <th className="py-2.5 px-3">Combustível</th>
                <th className="py-2.5 px-3 text-right">Preço Fixado (R$/L)</th>
                <th className="py-2.5 px-3">Responsável pela Homologação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historicoOrdenado.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono text-slate-600">{formatDateOnly(h.dataRegistro)}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{h.postoNome}</td>
                  <td className="py-2.5 px-3 text-slate-700">{h.combustivelNome}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-blue-700 font-mono">
                    {formatBRL(h.precoLitro)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">{h.registradoPor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
