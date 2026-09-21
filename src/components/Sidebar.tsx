import React from 'react';
import { useApp } from '../context/AppContext';
import { ActiveView } from '../types';
import { VantGasLogo } from './VantGasLogo';
import {
  LayoutDashboard,
  Fuel,
  Droplets,
  Truck,
  ShieldAlert,
  FileText,
  Settings,
  LogOut,
  MapPin,
  TrendingUp,
  ScrollText,
  Users,
  Building2,
  ChevronRight,
} from 'lucide-react';

interface PrimaryNav {
  id: ActiveView;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
  activeMatch: ActiveView[];
  subItems?: { id: ActiveView; label: string; icon: React.ElementType }[];
}

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    alertas,
    abastecimentos,
    postos,
    veiculos,
    currentUser,
    logout,
  } = useApp();

  const alertasPendentes = alertas.filter((a) => a.status === 'pendente').length;

  const mainNavItems: PrimaryNav[] = [
    {
      id: 'dashboard',
      label: 'Visão Geral',
      icon: LayoutDashboard,
      activeMatch: ['dashboard'],
    },
    {
      id: 'abastecimentos',
      label: 'Abastecimentos',
      icon: Droplets,
      badge: abastecimentos.length,
      activeMatch: ['abastecimentos'],
    },
    {
      id: 'veiculos',
      label: 'Veículos & Frota',
      icon: Truck,
      badge: veiculos.length,
      activeMatch: ['veiculos'],
    },
    {
      id: 'postos',
      label: 'Postos & Preços',
      icon: Fuel,
      badge: postos.length,
      activeMatch: ['postos', 'precos', 'combustiveis', 'mapa'],
      subItems: [
        { id: 'postos', label: 'Postos Credenciados', icon: Fuel },
        { id: 'precos', label: 'Tabela de Preços', icon: TrendingUp },
        { id: 'mapa', label: 'Mapa de Postos', icon: MapPin },
      ],
    },
    {
      id: 'alertas',
      label: 'Alertas & Desvios',
      icon: ShieldAlert,
      badge: alertasPendentes > 0 ? alertasPendentes : undefined,
      badgeColor: 'bg-amber-500 text-slate-900',
      activeMatch: ['alertas'],
    },
    {
      id: 'relatorios',
      label: 'Relatórios & Auditoria',
      icon: FileText,
      activeMatch: ['relatorios', 'auditoria'],
      subItems: [
        { id: 'relatorios', label: 'Relatórios & Exportações', icon: FileText },
        { id: 'auditoria', label: 'Logs de Auditoria', icon: ScrollText },
      ],
    },
    {
      id: 'usuarios',
      label: 'Configurações',
      icon: Settings,
      activeMatch: ['usuarios', 'secretarias', 'integracao'],
      subItems: [
        { id: 'usuarios', label: 'Usuários & Permissões', icon: Users },
        { id: 'secretarias', label: 'Setores & Centros de Custo', icon: Building2 },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col h-full border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center gap-3">
        <VantGasLogo size="sm" />
        <div className="min-w-0">
          <div className="text-sm font-black tracking-tight text-white flex items-center gap-1">
            <span>Vant</span>
            <span className="text-emerald-400">Gas</span>
          </div>
          <p className="text-[11px] text-slate-400 truncate">Gestão de Frotas & Abastecimento</p>
        </div>
      </div>

      {/* Main Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Menu Principal
        </div>

        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isItemActive = item.activeMatch.includes(activeView);

          return (
            <div key={item.id} className="space-y-0.5">
              <button
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isItemActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isItemActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1 ${
                      item.badgeColor || (isItemActive ? 'bg-emerald-800 text-white' : 'bg-slate-800 text-slate-300')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>

              {/* Collapsed/Expanded Sub-items if section is active */}
              {isItemActive && item.subItems && (
                <div className="ml-4 pl-3 border-l border-slate-700/60 my-1 space-y-0.5">
                  {item.subItems.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive = activeView === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => setActiveView(sub.id)}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] transition-colors cursor-pointer ${
                          isSubActive
                            ? 'text-emerald-400 font-bold bg-slate-800/80'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <SubIcon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* User profile & Logout footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/90">
        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-800/70 border border-slate-700/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs shrink-0">
              {currentUser.nome.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">{currentUser.nome}</div>
              <div className="text-[10px] text-slate-400 truncate">{currentUser.cargo}</div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Encerrar sessão"
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-md transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

