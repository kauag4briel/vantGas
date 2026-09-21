import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatBRL } from '../../utils/formatters';
import {
  MapPin,
  Fuel,
  Clock,
  Phone,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { Posto } from '../../types';

export const MapaView: React.FC = () => {
  const { postos, setSelectedPostoId, setActiveView } = useApp();
  const [selectedPinPosto, setSelectedPinPosto] = useState<Posto | null>(postos[0] || null);

  // Approximate center of Cocalzinho de Goiás - GO
  const minLat = -15.850;
  const maxLat = -15.720;
  const minLng = -48.850;
  const maxLng = -48.650;

  const getPositionPercent = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 80 + 10;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 80 + 10;
    return {
      left: `${Math.max(5, Math.min(95, x))}%`,
      top: `${Math.max(5, Math.min(95, y))}%`,
    };
  };

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600" />
          Mapa da Rede Credenciada
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Distribuição geográfica e localização dos postos credenciados no município
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Interactive Map Canvas */}
        <div className="lg:col-span-2 bg-slate-950 rounded-xl border border-slate-800 p-4 shadow-sm relative min-h-[460px] flex flex-col justify-between overflow-hidden">
          {/* Municipal Grid Overlay */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#10b981 1px, #020617 1px)',
              backgroundSize: '30px 30px',
              backgroundPosition: '0 0, 15px 15px',
            }}
          ></div>

          {/* Road layout outlines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <path
              d="M 50 100 Q 200 250 500 280 T 800 350"
              fill="none"
              stroke="#34d399"
              strokeWidth="4"
              strokeDasharray="6 4"
            />
            <path
              d="M 250 50 Q 300 200 450 400"
              fill="none"
              stroke="#6ee7b7"
              strokeWidth="3"
            />
            <path
              d="M 50 420 Q 350 350 750 450"
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
            />
          </svg>

          {/* Map Top Bar Controls */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-300 bg-slate-900/90 backdrop-blur-xs px-3.5 py-2.5 rounded-lg border border-slate-800">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-white">Rede Credenciada VantGas</span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">• Cobertura Regional</span>
            </div>
            <span className="text-[11px] bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-800 font-medium">
              {postos.length} postos mapeados
            </span>
          </div>

          {/* Station Pins */}
          <div className="relative z-10 w-full h-72 sm:h-80 my-auto">
            {postos.map((posto) => {
              const pos = getPositionPercent(posto.latitude, posto.longitude);
              const isSelected = selectedPinPosto?.id === posto.id;

              return (
                <div
                  key={posto.id}
                  style={{ left: pos.left, top: pos.top }}
                  onClick={() => setSelectedPinPosto(posto)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 group ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-20'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg border-2 ${
                      isSelected
                        ? 'bg-emerald-600 border-white text-white ring-4 ring-emerald-500/40'
                        : 'bg-slate-900 border-emerald-400 text-emerald-300'
                    }`}
                  >
                    <Fuel className="w-4 h-4" />
                  </div>

                  {/* Tooltip on pin */}
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/95 text-white text-[10px] px-2.5 py-1 rounded-md shadow-md border border-slate-700 pointer-events-none opacity-90">
                    <span className="font-bold">{posto.nomeFantasia}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Footer status */}
          <div className="relative z-10 text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
            <span>Datum: SIRGAS 2000 • Georreferenciamento</span>
            <span>Clique no posto para detalhes</span>
          </div>
        </div>

        {/* Lateral Info Panel */}
        <div className="space-y-4">
          {selectedPinPosto ? (
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                    {selectedPinPosto.codigoInterno}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Credenciado
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{selectedPinPosto.nomeFantasia}</h3>
                <p className="text-xs text-slate-500">{selectedPinPosto.razaoSocial}</p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {selectedPinPosto.logradouro}, {selectedPinPosto.numero} - {selectedPinPosto.bairro},{' '}
                    {selectedPinPosto.municipio}/{selectedPinPosto.uf}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Horário: {selectedPinPosto.horarioFuncionamento}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{selectedPinPosto.telefone}</span>
                </div>
              </div>

              {/* Preços Praticados */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Tabela Praticada Neste Posto
                </h4>
                <div className="space-y-1.5">
                  {selectedPinPosto.combustiveis.map((c) => (
                    <div
                      key={c.combustivelId}
                      className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-slate-50 border border-slate-100"
                    >
                      <span className="text-slate-700 font-medium">{c.combustivelNome}</span>
                      <span className="font-bold text-emerald-700">{formatBRL(c.precoAtual)}/L</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedPostoId(selectedPinPosto.id);
                  setActiveView('postos');
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                <span>Acessar Ficha Completa</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200/80 p-8 text-center text-xs text-slate-400">
              Selecione um posto no mapa ao lado para consultar a ficha geográfica.
            </div>
          )}

          {/* Quick List */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Postos no Município
            </h4>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {postos.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPinPosto(p)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    selectedPinPosto?.id === p.id ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/60' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="truncate">{p.nomeFantasia}</span>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-2">{p.bandeira}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
