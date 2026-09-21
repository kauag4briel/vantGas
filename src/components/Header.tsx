import React from 'react';
import { useApp } from '../context/AppContext';
import { VantGasLogo } from './VantGasLogo';
import {
  Bell,
  Plus,
  Menu,
  FileSpreadsheet,
  LogOut,
  ChevronRight,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

const VIEW_TITLES: Record<string, string> = {
  dashboard: 'Visão Geral & Indicadores',
  abastecimentos: 'Gestão de Abastecimentos',
  postos: 'Postos Credenciados',
  veiculos: 'Veículos & Frota',
  mapa: 'Mapa Georreferenciado',
  secretarias: 'Setores & Centros de Custo',
  precos: 'Tabela de Preços de Combustíveis',
  combustiveis: 'Tabela ANP & Combustíveis',
  alertas: 'Central de Alertas & Inconsistências',
  relatorios: 'Relatórios Gerenciais',
  auditoria: 'Trilha de Auditoria & Segurança',
  usuarios: 'Usuários & Permissões',
  integracao: 'Integrações de Bombas & API',
};

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const {
    activeView,
    currentUser,
    alertas,
    setActiveView,
    setIsNovoAbastecimentoModalOpen,
    exportarDadosCSV,
    logout,
  } = useApp();

  const alertasPendentesCount = alertas.filter((a) => a.status === 'pendente').length;
  const currentTitle = VIEW_TITLES[activeView] || 'Painel de Controle';

  return (
    <header className="bg-white border-b border-slate-200/90 px-4 sm:px-6 py-2.5 shrink-0 select-none">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile Menu & Current View Title */}
        <div className="flex items-center gap-3 min-w-0">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              aria-label="Abrir menu de navegação"
              className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span className="text-slate-400">VantGas</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-semibold text-slate-800">{currentTitle}</span>
          </div>

          <div className="sm:hidden font-bold text-sm text-slate-800 truncate">
            {currentTitle}
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Alertas Notification Button */}
          <button
            onClick={() => setActiveView('alertas')}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              alertasPendentesCount > 0
                ? 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title={`${alertasPendentesCount} alertas pendentes`}
          >
            <Bell className={`w-3.5 h-3.5 ${alertasPendentesCount > 0 ? 'text-amber-600' : 'text-slate-400'}`} />
            <span className="hidden md:inline">Alertas</span>
            {alertasPendentesCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-slate-900 rounded-full text-[10px] font-bold">
                {alertasPendentesCount}
              </span>
            )}
          </button>

          {/* Export Button */}
          <button
            onClick={() => exportarDadosCSV('abastecimentos')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
            title="Exportar dados em planilha CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>Exportar</span>
          </button>

          {/* "+ Novo Abastecimento" Main Action */}
          {currentUser.role !== 'AUDITOR' && (
            <button
              onClick={() => setIsNovoAbastecimentoModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Abastecimento</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};


