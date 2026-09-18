import React from 'react';
import { useApp } from '../context/AppContext';
import { ActiveView } from '../types';
import {
  LayoutDashboard,
  Fuel,
  Droplets,
  Truck,
  Building2,
  Coins,
  TrendingUp,
  FileText,
  ShieldAlert,
  MapPin,
  Users,
  ScrollText,
  Webhook,
  CheckCircle2,
} from 'lucide-react';

interface NavItem {
  id: ActiveView;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
  category: 'GERAL' | 'OPERAÇÃO' | 'GESTÃO' | 'AUDITORIA';
}

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, alertas, abastecimentos, postos, veiculos } = useApp();

  const alertasPendentes = alertas.filter((a) => a.status === 'pendente').length;

  const navItems: NavItem[] = [
    // GERAL
    { id: 'dashboard', label: 'Painel Geral de Frotas', icon: LayoutDashboard, category: 'GERAL' },

    // OPERAÇÃO
    { id: 'abastecimentos', label: 'Abastecimentos', icon: Droplets, badge: abastecimentos.length, category: 'OPERAÇÃO' },
    { id: 'postos', label: 'Postos Credenciados', icon: Fuel, badge: postos.length, category: 'OPERAÇÃO' },
    { id: 'veiculos', label: 'Veículos & Frotas', icon: Truck, badge: veiculos.length, category: 'OPERAÇÃO' },
    { id: 'mapa', label: 'Mapa Georreferenciado', icon: MapPin, category: 'OPERAÇÃO' },

    // GESTÃO
    { id: 'secretarias', label: 'Órgãos & Secretarias', icon: Building2, category: 'GESTÃO' },
    { id: 'precos', label: 'Controle de Preços', icon: TrendingUp, category: 'GESTÃO' },
    { id: 'combustiveis', label: 'Tabela ANP / Combustíveis', icon: Coins, category: 'GESTÃO' },

    // AUDITORIA & CONTROLE
    {
      id: 'alertas',
      label: 'Alertas & Inconsistências',
      icon: ShieldAlert,
      badge: alertasPendentes > 0 ? alertasPendentes : undefined,
      badgeColor: 'bg-amber-500 text-white',
      category: 'AUDITORIA',
    },
    { id: 'relatorios', label: 'Relatórios & Exportações', icon: FileText, category: 'AUDITORIA' },
    { id: 'auditoria', label: 'Trilha de Auditoria & Logs', icon: ScrollText, category: 'AUDITORIA' },
    { id: 'usuarios', label: 'Usuários & Permissões', icon: Users, category: 'AUDITORIA' },
    { id: 'integracao', label: 'Integração Bombas (API)', icon: Webhook, category: 'AUDITORIA' },
  ];

  const categories = [
    { key: 'GERAL', label: 'Visão Geral' },
    { key: 'OPERAÇÃO', label: 'Operação de Frotas' },
    { key: 'GESTÃO', label: 'Gestão Estratégica' },
    { key: 'AUDITORIA', label: 'Controle & Governança' },
  ];

  return (
    <aside className="w-64 bg-[#08263e] text-slate-200 flex flex-col h-full border-r border-[#0d3b61] select-none">
      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {categories.map((cat) => {
          const items = navItems.filter((item) => item.category === cat.key);
          if (items.length === 0) return null;

          return (
            <div key={cat.key} className="space-y-1">
              <h3 className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                {cat.label}
              </h3>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-sm text-xs font-semibold transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#0f4b7a] text-white font-bold border-l-2 border-amber-400'
                          : 'text-slate-300 hover:bg-[#0c3556] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-sm-full font-bold ml-1 ${
                            item.badgeColor || (isActive ? 'bg-amber-400 text-slate-900' : 'bg-[#051c2f] text-slate-400')
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
