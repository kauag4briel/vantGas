import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  formatBRL,
  formatLiters,
  formatDateTime,
  formatKmL,
  formatKm,
  formatCNPJ,
  formatCPF,
  formatCustoPorKm,
} from '../../utils/formatters';
import {
  Printer,
  X,
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  QrCode,
  Fuel,
  Truck,
  DollarSign,
  ScrollText,
} from 'lucide-react';

export const DetalhamentoAbastecimentoModal: React.FC = () => {
  const { selectedAbastecimento, setSelectedAbastecimento, cancelAbastecimento, currentUser } = useApp();
  const [canceling, setCanceling] = useState(false);
  const [motivo, setMotivo] = useState('');

  if (!selectedAbastecimento) return null;

  const a = selectedAbastecimento;
  const isCancelado = a.status === 'cancelado';

  const handlePrint = () => {
    window.print();
  };

  const handleExecuteCancel = () => {
    if (!motivo.trim() || motivo.trim().length < 8) {
      alert('A justificativa de cancelamento é obrigatória e deve conter pelo menos 8 caracteres.');
      return;
    }
    const res = cancelAbastecimento(a.id, motivo.trim());
    alert(res.message);
    setCanceling(false);
    setSelectedAbastecimento(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-sm max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-6 relative animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={() => setSelectedAbastecimento(null)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-sm cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Official Header */}
        <div className="border-b border-slate-200 pb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-blue-700 text-white flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">
              VantGas • Gestão Integrada de Frotas e Abastecimentos
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Comprovante & Registro Oficial de Abastecimento
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4 max-h-[72vh] overflow-y-auto pr-1 text-xs">
          {/* Status & Authentication Barcode Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-sm p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Código de Autenticação VantGas:</div>
              <div className="font-mono text-sm font-bold text-slate-900">{a.codigoAutenticacao}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Emitido em: {formatDateTime(a.dataHora)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isCancelado ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-sm-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                  <XCircle className="w-4 h-4" />
                  CANCELADO / ESTORNADO
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-sm-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  REGISTRO HOMOLOGADO
                </span>
              )}
            </div>
          </div>

          {/* Dados do Posto e do Veículo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Posto */}
            <div className="border border-slate-200 rounded-sm p-3 bg-white space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5 text-blue-600" />
                Posto Credenciado
              </div>
              <div className="font-bold text-slate-900 text-sm">{a.postoNome}</div>
              <div className="text-slate-500 text-[11px]">CNPJ: {formatCNPJ(a.postoCnpj)}</div>
              <div className="text-slate-500 text-[11px] truncate">{a.postoEndereco}</div>
              <div className="text-slate-600 text-[11px] pt-1">
                Bomba: <span className="font-bold">{a.numeroBomba || 1}</span> • Cupom:{' '}
                <span className="font-bold">{a.numeroCupomFiscal || 'N/D'}</span>
              </div>
            </div>

            {/* Veículo */}
            <div className="border border-slate-200 rounded-sm p-3 bg-white space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                Veículo Municipal
              </div>
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-sm bg-slate-900 text-white font-mono text-xs">
                  {a.veiculoPlaca}
                </span>
                <span>{a.veiculoModelo}</span>
              </div>
              <div className="text-slate-500 text-[11px]">
                {a.veiculoMarca} • {a.veiculoAno} • Tipo: {a.veiculoTipo}
              </div>
              <div className="text-blue-700 font-semibold text-[11px] truncate">
                {a.secretariaNome}
              </div>
              <div className="text-slate-600 text-[11px] pt-1">
                Motorista: <span className="font-bold">{a.motoristaNome}</span> ({formatCPF(a.motoristaCpf)})
              </div>
            </div>
          </div>

          {/* Dados Financeiros e Litragem */}
          <div className="bg-slate-50 border border-slate-200 rounded-sm p-4">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">
              Demonstrativo Financeiro & Medições
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-white p-2 rounded-sm border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Combustível</span>
                <span className="font-bold text-slate-800 text-xs">{a.combustivelNome}</span>
              </div>
              <div className="bg-white p-2 rounded-sm border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Litros Medidos</span>
                <span className="font-bold text-slate-800 text-xs">{formatLiters(a.quantidadeLitros)}</span>
              </div>
              <div className="bg-white p-2 rounded-sm border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Preço Unitário</span>
                <span className="font-bold text-slate-800 text-xs">{formatBRL(a.precoUnitarioLitro)}</span>
              </div>
              <div className="bg-blue-50 p-2 rounded-sm border border-blue-200">
                <span className="text-[10px] text-blue-700 block font-semibold">Valor Total</span>
                <span className="font-bold text-blue-700 text-sm">{formatBRL(a.valorTotal)}</span>
              </div>
            </div>

            {/* Eficiência e Odômetro */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mt-2.5">
              <div className="bg-white p-2 rounded-sm border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Odômetro Atual</span>
                <span className="font-mono font-bold text-slate-800 text-xs">{formatKm(a.odometroRegistrado)}</span>
              </div>
              <div className="bg-white p-2 rounded-sm border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Km Rodados no Ciclo</span>
                <span className="font-mono font-bold text-slate-800 text-xs">
                  {a.kmPercorridos ? `${a.kmPercorridos} km` : '-'}
                </span>
              </div>
              <div className="bg-white p-2 rounded-sm border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Consumo Aferido</span>
                <span className="font-bold text-emerald-700 text-xs">
                  {a.consumoKmLCalculado ? formatKmL(a.consumoKmLCalculado) : '-'}
                </span>
              </div>
              <div className="bg-white p-2 rounded-sm border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Custo por Km</span>
                <span className="font-bold text-blue-700 text-xs">
                  {a.custoPorKmCalculado ? formatCustoPorKm(a.custoPorKmCalculado) : '-'}
                </span>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-600 px-1">
              <span>Forma de Pagamento: <strong>{a.formaPagamentoNome}</strong></span>
              <span>Frentista Responsável: <strong>{a.frentistaNome || 'N/D'}</strong></span>
            </div>
          </div>

          {/* Cancelamento / Justificativa se houver */}
          {isCancelado && (
            <div className="bg-rose-50 border border-rose-200 rounded-sm p-3 text-rose-900">
              <span className="font-bold block text-xs">Motivo Formal de Cancelamento:</span>
              <p className="text-xs mt-0.5">{a.motivoCancelamento}</p>
              <div className="text-[10px] text-rose-700 mt-1">
                Cancelado por: {a.alteradoPor} em {formatDateTime(a.alteradoEm || '')}
              </div>
            </div>
          )}

          {/* Trilha de Auditoria Forense do Registro */}
          <div className="bg-slate-50 border border-slate-200 rounded-sm p-3 text-slate-600 text-[11px]">
            <div className="font-bold text-slate-800 uppercase text-[10px] mb-1 flex items-center gap-1">
              <ScrollText className="w-3.5 h-3.5 text-blue-600" />
              Metadados de Rastreabilidade & Auditoria
            </div>
            <div>Criado no sistema por: <strong>{a.criadoPor}</strong></div>
            <div>Carimbo temporal do servidor: <strong>{formatDateTime(a.criadoEm)}</strong></div>
            <div>Origem do lançamento: <strong>{a.origemRegistro.toUpperCase()}</strong></div>
          </div>
        </div>

        {/* Cancel form inline if initiated */}
        {canceling && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-sm my-3 space-y-2">
            <div className="text-xs font-bold text-rose-800">
              Informe a Justificativa Obrigatória para Cancelamento:
            </div>
            <textarea
              rows={2}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ex: Erro no volume digitado pelo operador de bomba..."
              className="w-full text-xs p-2 bg-white border border-rose-300 rounded-sm outline-none focus:ring-1 focus:ring-rose-500"
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCanceling(false)}
                className="px-3 py-1 bg-white border border-slate-300 text-xs font-semibold rounded-sm cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={handleExecuteCancel}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-sm cursor-pointer"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
          <div>
            {!isCancelado && !canceling && currentUser.role !== 'AUDITOR' && (
              <button
                onClick={() => setCanceling(true)}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
              >
                Cancelar este Registro...
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-sm text-xs font-bold cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              Imprimir Comprovante
            </button>
            <button
              onClick={() => setSelectedAbastecimento(null)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-sm text-xs font-bold cursor-pointer transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
