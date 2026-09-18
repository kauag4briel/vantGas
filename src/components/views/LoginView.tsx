import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VantGasLogo } from '../VantGasLogo';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useApp();

  const [identificador, setIdentificador] = useState('adm.girassol@gmail.com');
  const [senha, setSenha] = useState('••••••••••••');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrarAcesso, setLembrarAcesso] = useState(true);
  const [erroMsg, setErroMsg] = useState<string | null>(null);
  const [sucessoMsg, setSucessoMsg] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  // Quick profile presets for convenience
  const perfisPredefinidos = [
    { label: 'Administrador Geral', email: 'adm.girassol@gmail.com', cargo: 'Administração Geral' },
    { label: 'Fiscal de Frotas', email: 'fiscal.transportes@vantgas.com.br', cargo: 'Fiscalização de Transportes' },
    { label: 'Auditor do Sistema', email: 'auditoria@vantgas.com.br', cargo: 'Auditoria e Compliance' },
    { label: 'Posto Conveniado', email: 'atendimento@postopirineus.com.br', cargo: 'Posto Pirineus' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErroMsg(null);
    setSucessoMsg(null);

    if (!identificador.trim()) {
      setErroMsg('Informe seu CPF, Matrícula ou E-mail Institucional.');
      return;
    }

    setCarregando(true);
    setTimeout(() => {
      const res = login(identificador, senha);
      setCarregando(false);
      if (res.success) {
        setSucessoMsg(res.message);
      } else {
        setErroMsg(res.message || 'Credencial não localizada ou inválida.');
      }
    }, 250);
  };

  const selecionarPerfil = (email: string) => {
    setIdentificador(email);
    setSenha('••••••••••••');
    setErroMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans text-slate-800">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <VantGasLogo size="lg" />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Vant<span className="text-emerald-600">Gas</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestão Integrada de Frotas e Abastecimentos
          </p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-sm border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Acesso ao Sistema</h2>
              <p className="text-[11px] text-slate-500">Identifique-se com sua conta institucional</p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
              <ShieldCheck className="w-3 h-3" />
              <span>Ambiente Seguro</span>
            </div>
          </div>

          {/* Feedback Messages */}
          {erroMsg && (
            <div className="mb-4 p-2.5 rounded-sm bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{erroMsg}</span>
            </div>
          )}

          {sucessoMsg && (
            <div className="mb-4 p-2.5 rounded-sm bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{sucessoMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                E-mail Institucional ou CPF
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identificador}
                  onChange={(e) => setIdentificador(e.target.value)}
                  placeholder="usuario@vantgas.com.br"
                  className="w-full pl-8 pr-3 py-2 rounded-sm border border-slate-300 text-slate-900 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#0b3b60] focus:border-[#0b3b60] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => alert('Para redefinição de senha institucional, solicite ao Administrador do Sistema VantGas.')}
                  className="text-[11px] text-[#0b3b60] hover:underline"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full pl-8 pr-8 py-2 rounded-sm border border-slate-300 text-slate-900 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#0b3b60] focus:border-[#0b3b60] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Exibir senha'}
                >
                  {mostrarSenha ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center pt-0.5">
              <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={lembrarAcesso}
                  onChange={(e) => setLembrarAcesso(e.target.checked)}
                  className="w-3.5 h-3.5 rounded-sm text-[#0b3b60] focus:ring-0 border-slate-300"
                />
                <span>Lembrar credencial neste navegador</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full mt-1 py-2 px-4 rounded-sm bg-[#0b3b60] hover:bg-[#082e4c] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-xs"
            >
              {carregando ? (
                <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Entrar no VantGas</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Perfis Rápidos de Demonstração */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-500 mb-2">
              Acesso rápido por perfil:
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {perfisPredefinidos.map((p) => {
                const isSelected = identificador === p.email;
                return (
                  <button
                    key={p.email}
                    type="button"
                    onClick={() => selecionarPerfil(p.email)}
                    className={`text-left p-1.5 rounded-sm border text-[11px] transition-colors cursor-pointer truncate ${
                      isSelected
                        ? 'border-[#0b3b60] bg-blue-50/50 text-[#0b3b60] font-semibold'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-medium truncate">{p.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Minimal */}
        <p className="text-center text-[11px] text-slate-400 mt-4">
          VantGas • Plataforma de Gestão de Frotas & Abastecimentos
        </p>
      </div>
    </div>
  );
};
