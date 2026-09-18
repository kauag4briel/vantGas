import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  formatBRL,
  formatLiters,
  formatCNPJ,
  formatDateOnly,
} from '../../utils/formatters';
import {
  Fuel,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  Coins,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Posto } from '../../types';

export const PostosView: React.FC = () => {
  const {
    postos,
    setIsNovoPostoModalOpen,
    selectedPostoId,
    setSelectedPostoId,
    updatePrecoPosto,
    currentUser,
    combustiveis,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [bandeiraFilter, setBandeiraFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Editing price modal state
  const [editingPricePosto, setEditingPricePosto] = useState<{
    posto: Posto;
    combustivelId: string;
    combustivelNome: string;
    precoAtual: number;
  } | null>(null);
  const [novoPrecoInput, setNovoPrecoInput] = useState('');

  const filteredPostos = postos.filter((p) => {
    if (bandeiraFilter && p.bandeira !== bandeiraFilter) return false;
    if (statusFilter && p.status !== statusFilter) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.nomeFantasia.toLowerCase().includes(term) ||
      p.razaoSocial.toLowerCase().includes(term) ||
      p.cnpj.includes(term) ||
      p.codigoInterno.toLowerCase().includes(term) ||
      p.bairro.toLowerCase().includes(term)
    );
  });

  const selectedPosto = postos.find((p) => p.id === selectedPostoId);

  const bandeirasUnicas = Array.from(new Set(postos.map((p) => p.bandeira)));

  const handleSavePrice = () => {
    if (!editingPricePosto) return;
    const val = parseFloat(novoPrecoInput.replace(',', '.'));
    if (isNaN(val) || val <= 0) {
      alert('Informe um preço válido.');
      return;
    }
    updatePrecoPosto(editingPricePosto.posto.id, editingPricePosto.combustivelId, val);
    setEditingPricePosto(null);
  };

  return (
    <div className="space-y-3.5 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 bg-white p-3 sm:p-3.5 rounded-sm border border-slate-300 shadow-xs">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
            <Fuel className="w-4 h-4 text-[#0b3b60]" />
            Rede de Postos de Combustíveis Credenciados
          </h2>
          <p className="text-[11px] text-slate-500">
            Acompanhamento de preços, contratos, conformidade fiscal e volume liquidado por estabelecimento
          </p>
        </div>

        {currentUser.role !== 'AUDITOR' && currentUser.role !== 'POSTO' && (
          <button
            onClick={() => setIsNovoPostoModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-sm bg-[#0b3b60] hover:bg-[#082e4c] text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-amber-300" />
            Credenciar Novo Posto
          </button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-2 bg-white p-2.5 rounded-sm border border-slate-300 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Buscar por nome fantasia, razão social, CNPJ ou código do posto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-sm outline-none focus:bg-white focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Filtrar por bandeira do posto"
            value={bandeiraFilter}
            onChange={(e) => setBandeiraFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-sm px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="">Bandeiras: Todas</option>
            {bandeirasUnicas.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <select
            aria-label="Filtrar por situação cadastral do posto"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-sm px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="">Situação: Todas</option>
            <option value="ativo">Ativo / Regular</option>
            <option value="inativo">Inativo / Suspenso</option>
          </select>
        </div>
      </div>

      {/* Grid of Stations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredPostos.map((posto) => {
          const isAtivo = posto.status === 'ativo';

          return (
            <div
              key={posto.id}
              className={`bg-white rounded-sm border p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between ${
                selectedPostoId === posto.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Header card */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                      {posto.codigoInterno}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{posto.nomeFantasia}</h3>
                    <p className="text-[11px] text-slate-500 truncate max-w-[220px]">{posto.razaoSocial}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-sm-full text-[10px] font-bold border ${
                      isAtivo
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {isAtivo ? 'Credenciado' : 'Suspenso'}
                  </span>
                </div>

                {/* Info tags */}
                <div className="space-y-1 text-xs text-slate-600 my-3">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>CNPJ: {formatCNPJ(posto.cnpj)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {posto.logradouro}, {posto.numero} - {posto.bairro}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{posto.horarioFuncionamento || `${posto.horarioAbertura || '06:00'} às ${posto.horarioFechamento || '22:00'}`}</span>
                  </div>
                </div>

                {/* Combustíveis no posto */}
                <div className="bg-slate-50 rounded-sm p-2.5 border border-slate-200 mb-3">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Combustíveis & Preços Vigentes</span>
                    <Coins className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="space-y-1">
                    {posto.combustiveis.map((c) => (
                      <div key={c.combustivelId} className="flex items-center justify-between text-xs">
                        <span className="text-slate-700 truncate">{c.combustivelNome}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-blue-700">{formatBRL(c.precoAtual)}/L</span>
                          {currentUser.role !== 'AUDITOR' && (
                            <button
                              onClick={() => {
                                setEditingPricePosto({
                                  posto,
                                  combustivelId: c.combustivelId,
                                  combustivelNome: c.combustivelNome,
                                  precoAtual: c.precoAtual,
                                });
                                setNovoPrecoInput(c.precoAtual.toFixed(2));
                              }}
                              className="text-[10px] text-slate-500 hover:text-blue-600 underline cursor-pointer"
                            >
                              Editar
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals summary */}
                <div className="grid grid-cols-2 gap-2 text-center py-2 border-t border-slate-100">
                  <div className="bg-blue-50/50 rounded-sm p-1.5">
                    <div className="text-[10px] text-slate-500">Volume Total</div>
                    <div className="text-xs font-bold text-blue-800">{formatLiters(posto.totalLitros || 0)}</div>
                  </div>
                  <div className="bg-emerald-50/50 rounded-sm p-1.5">
                    <div className="text-[10px] text-slate-500">Total Faturado</div>
                    <div className="text-xs font-bold text-emerald-800">{formatBRL(posto.totalValor || 0)}</div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-100 mt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  {posto.documentos?.length || 0} docs homologados
                </span>
                <button
                  onClick={() => setSelectedPostoId(posto.id)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  Ficha Cadastral
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Modal / View of Selected Posto */}
      {selectedPosto && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-sm max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-sm border border-blue-200">
                  {selectedPosto.codigoInterno} • {selectedPosto.bandeira}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedPosto.nomeFantasia}</h2>
                <p className="text-xs text-slate-500">{selectedPosto.razaoSocial}</p>
              </div>
              <button
                onClick={() => setSelectedPostoId(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {/* Documentos Regulatórios e Validades */}
              <div className="bg-slate-50 rounded-sm p-3 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  Conformidade & Documentação Regulatória
                </h4>
                <div className="space-y-2">
                  {selectedPosto.documentos?.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between text-xs bg-white p-2.5 rounded-sm border border-slate-200"
                    >
                      <div>
                        <div className="font-semibold text-slate-800">{doc.tipo || doc.tipoNome}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Nº {doc.numeroDocumento} • Emissor: {doc.orgaoEmissor}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded-sm-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Válido até {formatDateOnly(doc.dataValidade)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Endereço e Contato */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 rounded-sm p-3 border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Endereço Completo:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedPosto.logradouro}, {selectedPosto.numero} - {selectedPosto.bairro}
                  </span>
                  <span className="block text-slate-500">{selectedPosto.municipio} - {selectedPosto.uf}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Contato e Gestão:</span>
                  <span className="font-semibold text-slate-800 block">Resp: {selectedPosto.responsavelContato || selectedPosto.responsavel}</span>
                  <span className="text-slate-600 block">Tel: {selectedPosto.telefone}</span>
                  <span className="text-slate-600 block">E-mail: {selectedPosto.email}</span>
                </div>
              </div>

              {/* Tanques e Bombas */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-50 p-2.5 rounded-sm border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Bombas Ativas</span>
                  <span className="text-base font-bold text-slate-800">{selectedPosto.quantidadeBombas || selectedPosto.numeroBombas || 4} unidades</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-sm border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Tanques</span>
                  <span className="text-base font-bold text-slate-800">{selectedPosto.quantidadeTanques || selectedPosto.numeroTanques || 3} tanques</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-sm border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Capacidade Total</span>
                  <span className="text-base font-bold text-slate-800">{formatLiters(selectedPosto.capacidadeArmazenamentoLitros || selectedPosto.capacidadeTotalLitros || 60000)}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedPostoId(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-sm cursor-pointer"
              >
                Fechar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Price Modal */}
      {editingPricePosto && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Atualizar Preço Praticado
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              {editingPricePosto.posto.nomeFantasia} • {editingPricePosto.combustivelNome}
            </p>

            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Novo Preço por Litro (R$):
            </label>
            <input
              type="text"
              value={novoPrecoInput}
              onChange={(e) => setNovoPrecoInput(e.target.value)}
              placeholder="Ex: 6.19"
              className="w-full text-sm font-bold p-2 border border-slate-300 rounded-sm outline-none focus:ring-2 focus:ring-blue-500 text-blue-700 mb-4"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingPricePosto(null)}
                className="px-3 py-1.5 rounded-sm border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePrice}
                className="px-4 py-1.5 rounded-sm bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
              >
                Salvar e Registrar Histórico
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
