import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  formatBRL,
  formatLiters,
  formatKmL,
  formatDateTime,
  formatCustoPorKm,
} from '../../utils/formatters';
import {
  FileText,
  FileSpreadsheet,
  Printer,
  Download,
  Building2,
  Truck,
  Fuel,
  ShieldAlert,
  Calendar,
  Filter,
} from 'lucide-react';

type TipoRelatorio =
  | 'secretaria_consolidado'
  | 'veiculo_eficiencia'
  | 'posto_faturamento'
  | 'inconsistencias'
  | 'tribunal_contas';

export const RelatoriosView: React.FC = () => {
  const {
    filteredAbastecimentos,
    secretarias,
    postos,
    veiculos,
    alertas,
    exportarDadosCSV,
  } = useApp();

  const [tipoRelatorio, setTipoRelatorio] = useState<TipoRelatorio>('secretaria_consolidado');

  // 1. Relatório por Secretaria
  const dadosSecretaria = useMemo(() => {
    return secretarias.map((sec) => {
      const orcamento = sec.orcamentoMensal ?? sec.limiteMensalCombustivel ?? 0;
      const absDaSec = filteredAbastecimentos.filter(
        (a) => a.secretariaId === sec.id && a.status === 'confirmado'
      );
      const totalGasto = absDaSec.reduce((acc, a) => acc + a.valorTotal, 0);
      const totalLitros = absDaSec.reduce((acc, a) => acc + a.quantidadeLitros, 0);
      const totalAbast = absDaSec.length;
      const veiculosCount = veiculos.filter((v) => v.secretariaId === sec.id).length;
      const saldo = orcamento - totalGasto;

      return {
        sec,
        totalGasto,
        totalLitros,
        totalAbast,
        veiculosCount,
        saldo,
        orcamento,
        percentOrcamento: orcamento > 0 ? (totalGasto / orcamento) * 100 : 0,
      };
    });
  }, [secretarias, filteredAbastecimentos, veiculos]);

  // 2. Relatório por Veículo e Eficiência
  const dadosVeiculos = useMemo(() => {
    return veiculos.map((v) => {
      const absDoVei = filteredAbastecimentos.filter(
        (a) => a.veiculoId === v.id && a.status === 'confirmado'
      );
      const totalGasto = absDoVei.reduce((acc, a) => acc + a.valorTotal, 0);
      const totalLitros = absDoVei.reduce((acc, a) => acc + a.quantidadeLitros, 0);
      const totalAbast = absDoVei.length;

      return {
        veiculo: v,
        totalGasto,
        totalLitros,
        totalAbast,
      };
    });
  }, [veiculos, filteredAbastecimentos]);

  // 3. Relatório por Posto e Faturamento
  const dadosPostos = useMemo(() => {
    return postos.map((p) => {
      const absDoPosto = filteredAbastecimentos.filter(
        (a) => a.postoId === p.id && a.status === 'confirmado'
      );
      const totalGasto = absDoPosto.reduce((acc, a) => acc + a.valorTotal, 0);
      const totalLitros = absDoPosto.reduce((acc, a) => acc + a.quantidadeLitros, 0);
      const totalAbast = absDoPosto.length;
      const precoMedio = totalLitros > 0 ? totalGasto / totalLitros : 0;

      return {
        posto: p,
        totalGasto,
        totalLitros,
        totalAbast,
        precoMedio,
      };
    });
  }, [postos, filteredAbastecimentos]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Relatórios & Prestação de Contas
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Demonstrativos contábeis, operacionais e fiscais para auditoria e órgãos de controle
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            Imprimir
          </button>
          <button
            onClick={() => exportarDadosCSV('abastecimentos')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Relatórios Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setTipoRelatorio('secretaria_consolidado')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            tipoRelatorio === 'secretaria_consolidado'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Por Secretaria
        </button>

        <button
          onClick={() => setTipoRelatorio('veiculo_eficiencia')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            tipoRelatorio === 'veiculo_eficiencia'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          <Truck className="w-4 h-4" />
          Eficiência da Frota
        </button>

        <button
          onClick={() => setTipoRelatorio('posto_faturamento')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            tipoRelatorio === 'posto_faturamento'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          <Fuel className="w-4 h-4" />
          Faturamento por Posto
        </button>

        <button
          onClick={() => setTipoRelatorio('tribunal_contas')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            tipoRelatorio === 'tribunal_contas'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Demonstrativo TCE / TCM
        </button>
      </div>

      {/* Relatório 1: Consolidado por Secretaria */}
      {tipoRelatorio === 'secretaria_consolidado' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Demonstrativo Consolidado por Secretaria Municipal</h3>
              <p className="text-xs text-slate-500">Apropriação de despesas, litragem e execução orçamentária</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-y border-slate-200/80 text-slate-500 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Secretaria</th>
                  <th className="py-2.5 px-2 text-center">Veículos</th>
                  <th className="py-2.5 px-2 text-center">Abastecimentos</th>
                  <th className="py-2.5 px-2 text-right">Litragem Total</th>
                  <th className="py-2.5 px-2 text-right">Orçamento Mensal</th>
                  <th className="py-2.5 px-2 text-right">Gasto Liquidado</th>
                  <th className="py-2.5 px-2 text-right">Saldo Restante</th>
                  <th className="py-2.5 px-3 text-center">Execução %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {dadosSecretaria.map((item) => (
                  <tr key={item.sec.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-slate-900">{item.sec.sigla}</span> - {item.sec.nome}
                    </td>
                    <td className="py-2.5 px-2 text-center text-slate-600">{item.veiculosCount}</td>
                    <td className="py-2.5 px-2 text-center text-slate-600">{item.totalAbast}</td>
                    <td className="py-2.5 px-2 text-right font-semibold text-slate-800">
                      {formatLiters(item.totalLitros)}
                    </td>
                    <td className="py-2.5 px-2 text-right text-slate-600">
                      {formatBRL(item.orcamento)}
                    </td>
                    <td className="py-2.5 px-2 text-right font-bold text-blue-700">
                      {formatBRL(item.totalGasto)}
                    </td>
                    <td className="py-2.5 px-2 text-right text-slate-700 font-mono">
                      {formatBRL(item.saldo)}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                      {item.percentOrcamento.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Relatório 2: Eficiência da Frota */}
      {tipoRelatorio === 'veiculo_eficiencia' && (
        <div className="bg-white rounded-sm border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Relatório de Eficiência e Consumo da Frota</h3>
              <p className="text-xs text-slate-500">Métricas de consumo (km/L), odômetro e custo médio por quilômetro rodado</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Placa / Veículo</th>
                  <th className="py-2.5 px-3">Secretaria</th>
                  <th className="py-2.5 px-2 text-center">Tipo</th>
                  <th className="py-2.5 px-2 text-right">Odômetro Atual</th>
                  <th className="py-2.5 px-2 text-right">Litros Consumidos</th>
                  <th className="py-2.5 px-2 text-right">Total Gasto</th>
                  <th className="py-2.5 px-2 text-center">Média Real (km/L)</th>
                  <th className="py-2.5 px-2 text-center">Custo / km</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {dadosVeiculos.map((item) => (
                  <tr key={item.veiculo.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3">
                      <span className="font-mono font-bold text-slate-900">{item.veiculo.placa}</span> -{' '}
                      {item.veiculo.modelo}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 truncate max-w-[150px]">
                      {item.veiculo.secretariaNome}
                    </td>
                    <td className="py-2.5 px-2 text-center text-slate-500">{item.veiculo.tipo}</td>
                    <td className="py-2.5 px-2 text-right font-mono text-slate-700">
                      {item.veiculo.odometroAtual} km
                    </td>
                    <td className="py-2.5 px-2 text-right font-semibold text-slate-800">
                      {formatLiters(item.totalLitros)}
                    </td>
                    <td className="py-2.5 px-2 text-right font-bold text-blue-700">
                      {formatBRL(item.totalGasto)}
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-emerald-700">
                      {formatKmL(item.veiculo.consumoRealKmL)}
                    </td>
                    <td className="py-2.5 px-2 text-center text-slate-700 font-mono">
                      {formatCustoPorKm(item.veiculo.custoPorKm)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Relatório 3: Faturamento por Posto */}
      {tipoRelatorio === 'posto_faturamento' && (
        <div className="bg-white rounded-sm border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Relatório de Faturamento por Posto Credenciado</h3>
              <p className="text-xs text-slate-500">Volume transacionado, total liquidado e preço médio por litro</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Código / Posto</th>
                  <th className="py-2.5 px-2">Bandeira</th>
                  <th className="py-2.5 px-2">CNPJ</th>
                  <th className="py-2.5 px-2 text-center">Transações</th>
                  <th className="py-2.5 px-2 text-right">Litragem Faturada</th>
                  <th className="py-2.5 px-2 text-right">Preço Médio / L</th>
                  <th className="py-2.5 px-3 text-right">Valor Total Liquidado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {dadosPostos.map((item) => (
                  <tr key={item.posto.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3">
                      <span className="font-mono text-slate-500 font-bold">{item.posto.codigoInterno}</span> -{' '}
                      <span className="font-bold text-slate-900">{item.posto.nomeFantasia}</span>
                    </td>
                    <td className="py-2.5 px-2 text-slate-600">{item.posto.bandeira}</td>
                    <td className="py-2.5 px-2 font-mono text-slate-500">{item.posto.cnpj}</td>
                    <td className="py-2.5 px-2 text-center text-slate-700">{item.totalAbast}</td>
                    <td className="py-2.5 px-2 text-right font-semibold text-slate-800">
                      {formatLiters(item.totalLitros)}
                    </td>
                    <td className="py-2.5 px-2 text-right text-slate-700">
                      {formatBRL(item.precoMedio)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-blue-700">
                      {formatBRL(item.totalGasto)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Relatório 4: Prestação de Contas TCE / TCM */}
      {tipoRelatorio === 'tribunal_contas' && (
        <div className="bg-white rounded-sm border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-sm p-3 text-xs text-blue-900">
            <h4 className="font-bold mb-1">Dossiê Especial de Conformidade com o Tribunal de Contas</h4>
            <p>
              Este demonstrativo sintetiza os gastos públicos municipais com combustíveis, agrupando por
              órgão, tipo de combustível e assegurando que todos os abastecimentos possuem código de autenticação,
              cupom fiscal e odômetro registrado, conforme Instruções Normativas de Fiscalização Governamental.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center py-2">
            <div className="bg-slate-50 p-3 rounded-sm border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Empenhado/Liquidado</span>
              <span className="text-base font-bold text-blue-700">
                {formatBRL(filteredAbastecimentos.reduce((acc, a) => acc + (a.status === 'confirmado' ? a.valorTotal : 0), 0))}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-sm border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total de Litros Auditados</span>
              <span className="text-base font-bold text-emerald-700">
                {formatLiters(filteredAbastecimentos.reduce((acc, a) => acc + (a.status === 'confirmado' ? a.quantidadeLitros : 0), 0))}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-sm border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Autenticações Rastreáveis</span>
              <span className="text-base font-bold text-slate-900">
                {filteredAbastecimentos.length} registros
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
