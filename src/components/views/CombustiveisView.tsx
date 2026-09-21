import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Coins, Plus, ShieldCheck, X } from 'lucide-react';

export const CombustiveisView: React.FC = () => {
  const { combustiveis, addCombustivel, currentUser } = useApp();
  const [isNovoOpen, setIsNovoOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [codigoAnp, setCodigoAnp] = useState('');
  const [unidade, setUnidade] = useState('L');
  const [cor, setCor] = useState('#059669');
  const [densidade, setDensidade] = useState('0.75');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !codigoAnp.trim()) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    addCombustivel({
      codigo: codigoAnp.trim(),
      codigoAnp: codigoAnp.trim(),
      nome: nome.trim(),
      unidadeMedida: unidade,
      cor,
      densidadeMedia: parseFloat(densidade) || 0.75,
      densidadeReferencia: parseFloat(densidade) || 0.75,
      ativo: true,
      precoReferenciaMedio: 5.5,
    });

    setNome('');
    setCodigoAnp('');
    setIsNovoOpen(false);
  };

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Coins className="w-5 h-5 text-emerald-600" />
            Catálogo de Combustíveis & ANP
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Classificação oficial, códigos regulamentares da ANP e especificações técnicas
          </p>
        </div>

        {currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN_VANTGAS' ? (
          <button
            onClick={() => setIsNovoOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Combustível
          </button>
        ) : null}
      </div>

      {/* Grid of Fuel Types */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {combustiveis.map((comb) => (
          <div key={comb.id} className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: comb.cor }}></span>
                  <h3 className="font-bold text-slate-900 text-sm">{comb.nome}</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Ativo
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 my-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Código ANP:</span>
                  <span className="font-mono font-bold text-slate-800">{comb.codigoAnp || comb.codigo}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Unidade de Medida:</span>
                  <span className="font-bold text-slate-800">{comb.unidadeMedida}</span>
                </div>
                {(comb.densidadeMedia || comb.densidadeReferencia) && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Densidade Estimada:</span>
                    <span className="font-mono text-slate-800">{comb.densidadeMedia || comb.densidadeReferencia} kg/L</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-2 border-t border-slate-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Homologado para compras públicas</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Cadastro */}
      {isNovoOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="bg-white rounded-xl max-w-md w-full p-5 sm:p-6 shadow-xl border border-slate-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Novo Combustível</h3>
                <p className="text-xs text-slate-500">
                  Insira os dados técnicos e o código ANP regulamentar.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNovoOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do Combustível:</label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Biodiesel B100 ou Gás Hidrogênio"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Código ANP:</label>
                <input
                  type="text"
                  required
                  value={codigoAnp}
                  onChange={(e) => setCodigoAnp(e.target.value)}
                  placeholder="Ex: 820101033"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Unidade:</label>
                <select
                  aria-label="Unidade de medida do combustível"
                  value={unidade}
                  onChange={(e) => setUnidade(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="L">Litros (L)</option>
                  <option value="m³">Metros Cúbicos (m³)</option>
                  <option value="kWh">Quilowatt-hora (kWh)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cor de Destaque:</label>
                <input
                  type="color"
                  value={cor}
                  onChange={(e) => setCor(e.target.value)}
                  className="w-full h-10 p-1 border border-slate-200 rounded-lg cursor-pointer bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Densidade Média (kg/L):</label>
                <input
                  type="number"
                  step="0.01"
                  value={densidade}
                  onChange={(e) => setDensidade(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsNovoOpen(false)}
                className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                Salvar Combustível
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
