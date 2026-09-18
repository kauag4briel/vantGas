import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Truck, Building2, Fuel, Gauge, ShieldCheck } from 'lucide-react';

export const NovoVeiculoModal: React.FC = () => {
  const { isNovoVeiculoModalOpen, setIsNovoVeiculoModalOpen, addVeiculo, secretarias, combustiveis } = useApp();

  const [placa, setPlaca] = useState('');
  const [prefixo, setPrefixo] = useState('');
  const [marca, setMarca] = useState('Chevrolet');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState(new Date().getFullYear());
  const [tipo, setTipo] = useState<'Leve' | 'Utilitário' | 'Caminhão' | 'Ambulância' | 'Máquina Pesada' | 'Ônibus' | 'Motocicleta'>('Leve');
  const [secretariaId, setSecretariaId] = useState(secretarias[0]?.id || '');
  const [combustivelPadraoId, setCombustivelPadraoId] = useState(combustiveis[0]?.id || '');
  const [capacidadeTanque, setCapacidadeTanque] = useState('54');
  const [consumoReferencia, setConsumoReferencia] = useState('11.5');
  const [odometroInicial, setOdometroInicial] = useState('15000');
  const [motoristaResponsavel, setMotoristaResponsavel] = useState('Condutor Designado');
  const [chassi, setChassi] = useState('');
  const [renavam, setRenavam] = useState('');

  if (!isNovoVeiculoModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!placa.trim() || !modelo.trim()) {
      alert('Placa e Modelo são obrigatórios.');
      return;
    }

    const sec = secretarias.find((s) => s.id === secretariaId);
    const comb = combustiveis.find((c) => c.id === combustivelPadraoId);

    addVeiculo({
      placa: placa.trim().toUpperCase(),
      prefixo: prefixo.trim() || `V-${Math.floor(100 + Math.random() * 900)}`,
      marca,
      modelo: modelo.trim(),
      ano,
      anoFabricacao: ano,
      anoModelo: ano,
      tipo,
      orgaoId: sec?.orgaoId || 'org-01',
      orgaoNome: sec?.orgaoNome || 'VantGas Gestão de Frotas',
      secretariaId,
      secretariaNome: sec?.nome || 'Unidade Operacional',
      capacidadeTanqueLitros: parseFloat(capacidadeTanque) || 50,
      combustivelPadraoId,
      combustivelPadraoNome: comb?.nome || 'Gasolina Comum',
      consumoMedioEstimadoKmL: parseFloat(consumoReferencia) || 10.0,
      consumoReferenciaKmL: parseFloat(consumoReferencia) || 10.0,
      odometroAtual: parseInt(odometroInicial, 10) || 0,
      odometroUltimoAbastecimento: parseInt(odometroInicial, 10) || 0,
      motoristaResponsavel,
      chassi: chassi.trim() || '9BWZZZ377VT000000',
      renavam: renavam.trim() || '00123456789',
      status: 'ativo',
      totalGastoHistorico: 0,
      totalLitrosHistorico: 0,
    });

    alert('Veículo cadastrado na frota com sucesso!');
    setIsNovoVeiculoModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-sm max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-6 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={() => setIsNovoVeiculoModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-sm cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-slate-200 pb-3 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-sm bg-blue-600 text-white flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Cadastrar Veículo na Frota Municipal
            </h2>
            <p className="text-xs text-slate-500">
              Inclusão de patrimônio rodoviário com controle de consumo e limites de tanque
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4 max-h-[72vh] overflow-y-auto pr-1 text-xs">
          {/* Placa, Prefixo, Modelo e Marca */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Placa (Mercosul/Antiga):
              </label>
              <input
                type="text"
                required
                value={placa}
                onChange={(e) => setPlaca(e.target.value)}
                placeholder="Ex: ABC4E20"
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold uppercase"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Prefixo Operacional:
              </label>
              <input
                type="text"
                value={prefixo}
                onChange={(e) => setPrefixo(e.target.value)}
                placeholder="Ex: AMB-04"
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Marca / Fabricante:
              </label>
              <input
                type="text"
                required
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                placeholder="Ex: Chevrolet"
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Modelo do Veículo:
              </label>
              <input
                type="text"
                required
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                placeholder="Ex: Spin 1.8 LTZ"
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none font-medium"
              />
            </div>
          </div>

          {/* Tipo, Secretaria e Ano */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Categoria / Tipo:
              </label>
              <select
                aria-label="Selecionar categoria ou tipo do veículo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as any)}
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Leve">Passeio / Leve</option>
                <option value="Utilitário">Utilitário / Pick-up</option>
                <option value="Ambulância">Ambulância / Resgate</option>
                <option value="Caminhão">Caminhão / Basculante</option>
                <option value="Ônibus">Ônibus / Micro-ônibus Escolar</option>
                <option value="Máquina Pesada">Máquina Pesada / Trator</option>
                <option value="Motocicleta">Motocicleta</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Secretaria Vinculada:
              </label>
              <select
                aria-label="Selecionar secretaria vinculada"
                value={secretariaId}
                onChange={(e) => setSecretariaId(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none focus:ring-1 focus:ring-blue-500"
              >
                {secretarias.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.sigla} - {s.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Ano de Fabricação:
              </label>
              <input
                type="number"
                value={ano}
                onChange={(e) => setAno(parseInt(e.target.value, 10))}
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none"
              />
            </div>
          </div>

          {/* Capacidade do Tanque, Combustível e Odômetro */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Capacidade Tanque (L):
              </label>
              <input
                type="number"
                required
                value={capacidadeTanque}
                onChange={(e) => setCapacidadeTanque(e.target.value)}
                placeholder="54"
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Combustível Homologado:
              </label>
              <select
                aria-label="Selecionar combustível homologado para o veículo"
                value={combustivelPadraoId}
                onChange={(e) => setCombustivelPadraoId(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none focus:ring-1 focus:ring-blue-500"
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
                Consumo Padrão (km/L):
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={consumoReferencia}
                onChange={(e) => setConsumoReferencia(e.target.value)}
                placeholder="11.5"
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Odômetro Atual (km):
              </label>
              <input
                type="number"
                required
                value={odometroInicial}
                onChange={(e) => setOdometroInicial(e.target.value)}
                placeholder="15000"
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none font-mono"
              />
            </div>
          </div>

          {/* Motorista, Chassi e Renavam */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Condutor Responsável:
              </label>
              <input
                type="text"
                value={motoristaResponsavel}
                onChange={(e) => setMotoristaResponsavel(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Número do Chassi / VIN:
              </label>
              <input
                type="text"
                value={chassi}
                onChange={(e) => setChassi(e.target.value)}
                placeholder="9BW..."
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Código Renavam:
              </label>
              <input
                type="text"
                value={renavam}
                onChange={(e) => setRenavam(e.target.value)}
                placeholder="00123456789"
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none font-mono"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNovoVeiculoModalOpen(false)}
              className="px-3.5 py-2 rounded-sm border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-sm bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs cursor-pointer transition-colors"
            >
              Cadastrar Veículo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
