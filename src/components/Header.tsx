import React from 'react';
import { useApp } from '../context/AppContext';
import { VantGasLogo } from './VantGasLogo';
import {
  ShieldAlert,
  Plus,
  Menu,
  FileSpreadsheet,
  LogOut,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const {
    currentUser,
    alertas,
    setActiveView,
    setIsNovoAbastecimentoModalOpen,
    exportarDadosCSV,
    logout,
  } = useApp();

  const alertasPendentesCount = alertas.filter((a) => a.status === 'pendente').length;

  return (
    <header className="bg-white border-b border-slate-300 px-3 sm:px-5 py-2 shadow-xs shrink-0 select-none">
      <div className="flex items-center justify-between gap-2">
        {/* Left: Official Branding */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              aria-label="Abrir menu de navegação"
              className="lg:hidden p-1.5 rounded-sm border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="shrink-0">
            <VantGasLogo size="sm" />
          </div>

          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-black tracking-tight text-[#0b3b60] truncate">
              Vant<span className="text-emerald-600">Gas</span>
            </h1>
            <p className="hidden sm:block text-[10px] text-slate-500 font-medium truncate">
              Gestão Integrada de Combustíveis e Frotas
            </p>
          </div>
        </div>

        {/* Right: Alerts, Actions & Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Pending Alerts Indicator */}
          <button
            onClick={() => setActiveView('alertas')}
            className="relative flex items-center gap-1 px-2 py-1.5 rounded-sm border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-colors cursor-pointer"
            title={`${alertasPendentesCount} inconsistências pendentes de análise`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span className="hidden md:inline text-[11px]">Alertas</span>
            {alertasPendentesCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-600 text-white rounded-sm text-[10px] font-bold">
                {alertasPendentesCount}
              </span>
            )}
          </button>

          {/* Export Button */}
          <button
            onClick={() => exportarDadosCSV('abastecimentos')}
            className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-sm border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            title="Exportar dados filtrados em CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[11px]">Exportar</span>
          </button>

          {/* New Fueling Transaction Button */}
          {currentUser.role !== 'AUDITOR' && (
            <button
              onClick={() => setIsNovoAbastecimentoModalOpen(true)}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-sm bg-[#0b3b60] hover:bg-[#082e4c] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Novo Abastecimento</span>
              <span className="sm:hidden">Abastecer</span>
            </button>
          )}

          {/* Official Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-1 px-2 py-1.5 rounded-sm border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold transition-colors cursor-pointer"
            title="Encerrar sessão e sair do sistema"
          >
            <LogOut className="w-3.5 h-3.5 text-red-600" />
            <span className="hidden sm:inline text-[11px]">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
};

