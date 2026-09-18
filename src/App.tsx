import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginView } from './components/views/LoginView';
import { DashboardView } from './components/views/DashboardView';
import { AbastecimentosView } from './components/views/AbastecimentosView';
import { PostosView } from './components/views/PostosView';
import { VeiculosView } from './components/views/VeiculosView';
import { SecretariasView } from './components/views/SecretariasView';
import { PrecosView } from './components/views/PrecosView';
import { AlertasView } from './components/views/AlertasView';
import { RelatoriosView } from './components/views/RelatoriosView';
import { AuditoriaView } from './components/views/AuditoriaView';
import { UsuariosView } from './components/views/UsuariosView';
import { CombustiveisView } from './components/views/CombustiveisView';
import { MapaView } from './components/views/MapaView';
import { IntegracaoApiView } from './components/views/IntegracaoApiView';

import { DetalhamentoAbastecimentoModal } from './components/modals/DetalhamentoAbastecimentoModal';
import { NovoAbastecimentoModal } from './components/modals/NovoAbastecimentoModal';
import { NovoPostoModal } from './components/modals/NovoPostoModal';
import { NovoVeiculoModal } from './components/modals/NovoVeiculoModal';
import { AnalisarAlertaModal } from './components/modals/AnalisarAlertaModal';

import { X } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeView, setActiveView, isAuthenticated } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Require authentication before accessing the municipal portal
  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <div
      id="app-root-wrapper"
      className="min-h-screen bg-slate-100 flex flex-col font-sans"
    >
      {/* Main App Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-slate-900/70 flex animate-in fade-in duration-150"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="w-72 h-full bg-[#08263e] shadow-2xl relative animate-in slide-in-from-left duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Fechar menu"
                  className="p-1.5 rounded-sm text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-100 overflow-hidden">
          <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

          <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-5 pb-24 lg:pb-6">
            <div className="max-w-7xl mx-auto w-full">
              {activeView === 'dashboard' && <DashboardView />}
              {activeView === 'abastecimentos' && <AbastecimentosView />}
              {activeView === 'postos' && <PostosView />}
              {activeView === 'veiculos' && <VeiculosView />}
              {activeView === 'secretarias' && <SecretariasView />}
              {activeView === 'precos' && <PrecosView />}
              {activeView === 'alertas' && <AlertasView />}
              {activeView === 'relatorios' && <RelatoriosView />}
              {activeView === 'auditoria' && <AuditoriaView />}
              {activeView === 'usuarios' && <UsuariosView />}
              {activeView === 'combustiveis' && <CombustiveisView />}
              {activeView === 'mapa' && <MapaView />}
              {activeView === 'integracao' && <IntegracaoApiView />}
            </div>
          </main>
        </div>
      </div>

      {/* Modals & Dialogs */}
      <DetalhamentoAbastecimentoModal />
      <NovoAbastecimentoModal />
      <NovoPostoModal />
      <NovoVeiculoModal />
      <AnalisarAlertaModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
