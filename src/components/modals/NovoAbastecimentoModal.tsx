import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatBRL, formatLiters, formatKm, formatKmL } from '../../utils/formatters';
import {
  X,
  Fuel,
  Truck,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Gauge,
  CreditCard,
  Building2,
} from 'lucide-react';

export const NovoAbastecimentoModal: React.FC = () => {
  const {
    isNovoAbastecimentoModalOpen,
    setIsNovoAbastecimentoModalOpen,
    postos,
    veiculos,
    combustiveis,
    formasPagamento,
    addAbastecimento,
    currentUser,
  } = useApp();

  const [postoId, setPostoId] = useState(postos[0]?.id || '');
  const [veiculoId, setVeiculoId] = useState(veiculos[0]?.id || '');
  const [combustivelId, setCombustivelId] = useState('');
  const [litros, setLitros] = useState('');
  const [precoUnitario, setPrecoUnitario] = useState('');
  const [odometro, setOdometro] = useState('');
  const [motoristaNome, setMotoristaNome] = useState('João Pedro Ferreira');
  const [motoristaCpf, setMotoristaCpf] = useState('12345678901');
  const [frentistaNome, setFrentistaNome] = useState('Rogério Silva');
  const [numeroBomba, setNumeroBomba] = useState('2');
  const [numeroCupomFiscal, setNumeroCupomFiscal] = useState('');
  const [formaPagamentoId, setFormaPagamentoId] = useState(formasPagamento[0]?.id || '');
  const [observacoes, setObservacoes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Selected entities
  const selectedPosto = useMemo(() => postos.find((p) => p.id === postoId), [postos, postoId]);
  const selectedVeiculo = useMemo(() => veiculos.find((v) => v.id === veiculoId), [veiculos, veiculoId]);

  // Set default fuel and price when vehicle or station changes
  useEffect(() => {
    if (selectedVeiculo && selectedPosto) {
      const defaultFuel = selectedVeiculo.combustivelPadraoId || selectedPosto.combustiveis[0]?.combustivelId;
      setCombustivelId(defaultFuel);

      const itemPreco = selectedPosto.combustiveis.find((c) => c.combustivelId === defaultFuel);
      if (itemPreco) {
        setPrecoUnitario(itemPreco.precoAtual.toFixed(2));
      } else {
        setPrecoUnitario('6.19');
      }

      // Propose realistic next odometer
      if (!odometro || parseInt(odometro, 10) <= selectedVeiculo.odometroAtual) {
        setOdometro((selectedVeiculo.odometroAtual + 320).toString());
      }
    }
  }, [selectedVeiculo, selectedPosto]);

  // When fuel changes, update unit price from station
  const handleFuelChange = (newCombId: string) => {
    setCombustivelId(newCombId);
    if (selectedPosto) {
      const itemPreco = selectedPosto.combustiveis.find((c) => c.combustivelId === newCombId);
      if (itemPreco) {
        setPrecoUnitario(itemPreco.precoAtual.toFixed(2));
      }
    }
  };

  if (!isNovoAbastecimentoModalOpen) return null;

  // Real-time calculations
  const numLitros = parseFloat(litros.replace(',', '.')) || 0;
  const numPreco = parseFloat(precoUnitario.replace(',', '.')) || 0;
  const totalCalculado = Number((numLitros * numPreco).toFixed(2));

  const numOdometro = parseInt(odometro, 10) || 0;
  const odometroAnterior = selectedVeiculo?.odometroAtual || 0;
  const kmPercorridos = numOdometro > odometroAnterior ? numOdometro - odometroAnterior : 0;
  const kmLCalculado = kmPercorridos > 0 && numLitros > 0 ? kmPercorridos / numLitros : 0;

  // Real-time warnings
  const isCapacidadeExcedida = selectedVeiculo && numLitros > selectedVeiculo.capacidadeTanqueLitros * 1.05;
  const isOdometroInvalido = numOdometro > 0 && numOdometro <= odometroAnterior;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!numLitros || numLitros <= 0) {
      alert('Informe a quantidade de litros abastecida.');
      return;
    }
    if (!numPreco || numPreco <= 0) {
      alert('Informe o preço unitário do combustível.');
      return;
    }
    if (isOdometroInvalido) {
      alert(`Odômetro inválido: O novo odômetro (${numOdometro} km) não pode ser menor ou igual ao atual (${odometroAnterior} km).`);
      return;
    }
    if (!motoristaNome.trim() || !motoristaCpf.trim()) {
      alert('Informe os dados completos do condutor municipal.');
      return;
    }

    setSubmitting(true);
    const result = addAbastecimento({
      postoId,
      veiculoId,
      combustivelId,
      quantidadeLitros: numLitros,
      precoUnitarioLitro: numPreco,
      formaPagamentoId,
      odometroRegistrado: numOdometro,
      motoristaNome: motoristaNome.trim(),
      motoristaCpf: motoristaCpf.trim(),
      frentistaNome: frentistaNome.trim(),
      numeroBomba: parseInt(numeroBomba, 10) || 1,
      numeroCupomFiscal: numeroCupomFiscal.trim() || undefined,
      observacoes: observacoes.trim() || undefined,
    });

    setSubmitting(false);

    if (result.success) {
      alert(result.message);
      setIsNovoAbastecimentoModalOpen(false);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-sm max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-6 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={() => setIsNovoAbastecimentoModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-sm cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-slate-200 pb-3 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-sm bg-blue-600 text-white flex items-center justify-center font-bold">
            <Fuel className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Registrar Abastecimento de Frota Municipal
            </h2>
            <p className="text-xs text-slate-500">
              Lançamento auditado com cálculo de consumo e validação preventiva de odômetro
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4 max-h-[72vh] overflow-y-auto pr-1 text-xs">
          {/* Posto e Veículo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Posto Credenciado:
              </label>
              <select
                aria-label="Selecionar posto credenciado"
                required
                value={postoId}
                onChange={(e) => setPostoId(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-1 focus:ring-blue-500"
              >
                {postos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nomeFantasia} ({p.bandeira})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Veículo Municipal:
              </label>
              <select
                aria-label="Selecionar veículo municipal"
                required
                value={veiculoId}
                onChange={(e) => setVeiculoId(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              >
                {veiculos.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.placa} - {v.modelo} ({v.secretariaNome})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cartão de Contexto do Veículo */}
          {selectedVeiculo && (
            <div className="bg-blue-50/70 border border-blue-200 rounded-sm p-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-blue-900">
              <div>
                Secretaria: <strong>{selectedVeiculo.secretariaNome}</strong>
              </div>
              <div>
                Tanque Nominal: <strong>{selectedVeiculo.capacidadeTanqueLitros} L</strong>
              </div>
              <div>
                Último Odômetro: <strong>{formatKm(selectedVeiculo.odometroAtual)}</strong>
              </div>
              <div>
                Média Histórica: <strong>{formatKmL(selectedVeiculo.consumoRealKmL)}</strong>
              </div>
            </div>
          )}

          {/* Combustível, Litros e Preço */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Tipo de Combustível:
              </label>
              <select
                aria-label="Selecionar tipo de combustível"
                required
                value={combustivelId}
                onChange={(e) => handleFuelChange(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-1 focus:ring-blue-500"
              >
                {combustiveis.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Quantidade de Litros:
              </label>
              <input
                type="text"
                required
                value={litros}
                onChange={(e) => setLitros(e.target.value)}
                placeholder="Ex: 45.0"
                className={`w-full text-xs p-2 border rounded-sm outline-none focus:ring-1 ${
                  isCapacidadeExcedida ? 'border-rose-400 bg-rose-50 text-rose-800' : 'border-slate-200 bg-slate-50'
                }`}
              />
              {isCapacidadeExcedida && (
                <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">
                  Atenção: Volume maior que o tanque nominal ({selectedVeiculo?.capacidadeTanqueLitros}L)
                </span>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Preço Unitário (R$/L):
              </label>
              <input
                type="text"
                required
                value={precoUnitario}
                onChange={(e) => setPrecoUnitario(e.target.value)}
                placeholder="Ex: 6.09"
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Odômetro e Simulação de Eficiência */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Odômetro Marcado no Painel (km):
              </label>
              <input
                type="number"
                required
                value={odometro}
                onChange={(e) => setOdometro(e.target.value)}
                placeholder="Ex: 45380"
                className={`w-full text-xs p-2 border font-mono rounded-sm outline-none focus:ring-1 ${
                  isOdometroInvalido ? 'border-rose-400 bg-rose-50 text-rose-800' : 'border-slate-200 bg-slate-50'
                }`}
              />
              {isOdometroInvalido && (
                <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">
                  Odômetro deve ser estritamente superior a {odometroAnterior} km
                </span>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Forma de Pagamento:
              </label>
              <select
                aria-label="Selecionar forma de pagamento"
                required
                value={formaPagamentoId}
                onChange={(e) => setFormaPagamentoId(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-sm outline-none focus:ring-1 focus:ring-blue-500"
              >
                {formasPagamento.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Box de Totais Calculados em Tempo Real */}
          <div className="bg-slate-900 text-white rounded-sm p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Valor Total Calculado:</span>
              <span className="text-base font-bold text-emerald-400">{formatBRL(totalCalculado)}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Distância Percorrida:</span>
              <span className="text-xs font-mono font-semibold">{kmPercorridos} km</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Eficiência Estimada:</span>
              <span className="text-xs font-mono font-bold text-blue-300">{formatKmL(kmLCalculado)}</span>
            </div>
          </div>

          {/* Condutor, Frentista e Cupom */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Nome do Motorista:
              </label>
              <input
                type="text"
                required
                value={motoristaNome}
                onChange={(e) => setMotoristaNome(e.target.value)}
                placeholder="Ex: Carlos Oliveira"
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                CPF do Motorista:
              </label>
              <input
                type="text"
                required
                value={motoristaCpf}
                onChange={(e) => setMotoristaCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Nº Cupom Fiscal / NFC-e:
              </label>
              <input
                type="text"
                value={numeroCupomFiscal}
                onChange={(e) => setNumeroCupomFiscal(e.target.value)}
                placeholder="Ex: NFCe-881920"
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none font-mono"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Observações Administrativas (Opcional):
            </label>
            <input
              type="text"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Abastecimento de rotina para ronda ostensiva..."
              className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none"
            />
          </div>

          {/* Bottom actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNovoAbastecimentoModalOpen(false)}
              className="px-3.5 py-2 rounded-sm border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || isOdometroInvalido}
              className="px-5 py-2 rounded-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-2xs cursor-pointer transition-colors"
            >
              {submitting ? 'Gravando e Auditando...' : 'Homologar Abastecimento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
