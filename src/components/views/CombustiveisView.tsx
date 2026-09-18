import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Coins, Plus, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

export const CombustiveisView: React.FC = () => {
  const { combustiveis, addCombustivel, currentUser } = useApp();
  const [isNovoOpen, setIsNovoOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [codigoAnp, setCodigoAnp] = useState('');
  const [unidade, setUnidade] = useState('L');
  const [cor, setCor] = useState('#2563eb');
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-sm border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Coins className="w-5 h-5 text-blue-600" />
            Catálogo de Combustíveis & Padrões ANP
          </h2>
          <p className="text-xs text-slate-500">
            Padronização VantGas de códigos da Agência Nacional do Petróleo, unidades de medida e conformidade técnica
          </p>
        </div>

        {currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN_VANTGAS' ? (
          <button
            onClick={() => setIsNovoOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Novo Combustível
          </button>
        ) : null}
      </div>

      {/* Grid of Fuel Types */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {combustiveis.map((comb) => (
          <div key={comb.id} className="bg-white rounded-sm border border-slate-200 p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-sm-full" style={{ backgroundColor: comb.cor }}></span>
                <h3 className="font-bold text-slate-900 text-sm">{comb.nome}</h3>
              </div>
              <span className="px-2 py-0.5 rounded-sm-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Ativo
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 my-3 bg-slate-50 p-2.5 rounded-sm border border-slate-200">
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

            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>Homologado para compras públicas</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Cadastro */}
      {isNovoOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="bg-white rounded-sm max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-3"
          >
            <h3 className="text-sm font-bold text-slate-900 mb-1">Cadastrar Tipo de Combustível</h3>
            <p className="text-xs text-slate-500 mb-3">
              Insira a especificação regulamentada pela ANP para integração contábil.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do Combustível:</label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Biodiesel B100 ou Gás Hidrogênio"
                className="w-full text-xs p-2 border border-slate-300 rounded-sm outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Código ANP:</label>
                <input
                  type="text"
                  required
                  value={codigoAnp}
                  onChange={(e) => setCodigoAnp(e.target.value)}
                  placeholder="Ex: 820101033"
                  className="w-full text-xs p-2 border border-slate-300 rounded-sm outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Unidade:</label>
                <select
                  aria-label="Unidade de medida do combustível"
                  value={unidade}
                  onChange={(e) => setUnidade(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-sm outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="L">Litros (L)</option>
                  <option value="m³">Metros Cúbicos (m³)</option>
                  <option value="kWh">Quilowatt-hora (kWh)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cor do Gráfico:</label>
                <input
                  type="color"
                  value={cor}
                  onChange={(e) => setCor(e.target.value)}
                  className="w-full h-9 p-1 border border-slate-300 rounded-sm cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Densidade Média (kg/L):</label>
                <input
                  type="number"
                  step="0.01"
                  value={densidade}
                  onChange={(e) => setDensidade(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsNovoOpen(false)}
                className="px-3 py-1.5 rounded-sm border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-sm bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
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
