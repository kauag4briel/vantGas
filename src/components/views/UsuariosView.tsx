import React from 'react';
import { useApp } from '../../context/AppContext';
import { getRoleBadge, formatDateOnly } from '../../utils/formatters';
import {
  Users,
  ShieldCheck,
  Lock,
  CheckCircle2,
  XCircle,
  Key,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import { UserRole } from '../../types';

export const UsuariosView: React.FC = () => {
  const { allUsers, currentUser, setCurrentUser } = useApp();

  const matrixPermissoes: {
    role: UserRole;
    nome: string;
    descricao: string;
    permissoes: {
      cadastrarAbastecimento: boolean;
      cancelarAbastecimento: boolean;
      gerenciarPostos: boolean;
      gerenciarVeiculos: boolean;
      alterarPrecos: boolean;
      analisarAlertas: boolean;
      exportarRelatorios: boolean;
      visualizarAuditoria: boolean;
      escopo: string;
    };
  }[] = [
    {
      role: 'SUPER_ADMIN',
      nome: 'Super Administrador',
      descricao: 'Acesso irrestrito a todas as configurações de sistema e parametrizações globais.',
      permissoes: {
        cadastrarAbastecimento: true,
        cancelarAbastecimento: true,
        gerenciarPostos: true,
        gerenciarVeiculos: true,
        alterarPrecos: true,
        analisarAlertas: true,
        exportarRelatorios: true,
        visualizarAuditoria: true,
        escopo: 'Global / Irrestrito',
      },
    },
    {
      role: 'ADMIN_VANTGAS',
      nome: 'Administrador VantGas',
      descricao: 'Gestão executiva, cadastro de unidades, veículos, postos credenciados e frotas.',
      permissoes: {
        cadastrarAbastecimento: true,
        cancelarAbastecimento: true,
        gerenciarPostos: true,
        gerenciarVeiculos: true,
        alterarPrecos: true,
        analisarAlertas: true,
        exportarRelatorios: true,
        visualizarAuditoria: true,
        escopo: 'Toda a Operação',
      },
    },
    {
      role: 'GESTOR',
      nome: 'Gestor de Frotas',
      descricao: 'Controle de movimentação de veículos, frotas, motoristas e aprovação de quotas.',
      permissoes: {
        cadastrarAbastecimento: true,
        cancelarAbastecimento: false,
        gerenciarPostos: false,
        gerenciarVeiculos: true,
        alterarPrecos: false,
        analisarAlertas: true,
        exportarRelatorios: true,
        visualizarAuditoria: false,
        escopo: 'Frota Municipal',
      },
    },
    {
      role: 'FISCAL',
      nome: 'Fiscal Operacional',
      descricao: 'Fiscalização em campo, auditoria de bombas, análise técnica de inconsistências.',
      permissoes: {
        cadastrarAbastecimento: true,
        cancelarAbastecimento: true,
        gerenciarPostos: false,
        gerenciarVeiculos: false,
        alterarPrecos: false,
        analisarAlertas: true,
        exportarRelatorios: true,
        visualizarAuditoria: true,
        escopo: 'Fiscalização Operacional',
      },
    },
    {
      role: 'SECRETARIA',
      nome: 'Gestão Setorial / Secretaria',
      descricao: 'Acesso restrito exclusivamente aos veículos, motoristas e orçamentos do seu órgão.',
      permissoes: {
        cadastrarAbastecimento: true,
        cancelarAbastecimento: false,
        gerenciarPostos: false,
        gerenciarVeiculos: false,
        alterarPrecos: false,
        analisarAlertas: false,
        exportarRelatorios: true,
        visualizarAuditoria: false,
        escopo: 'Apenas sua Secretaria',
      },
    },
    {
      role: 'POSTO',
      nome: 'Posto Credenciado',
      descricao: 'Lançamento de cupons, abastecimentos e visualização exclusiva das suas transações.',
      permissoes: {
        cadastrarAbastecimento: true,
        cancelarAbastecimento: false,
        gerenciarPostos: false,
        gerenciarVeiculos: false,
        alterarPrecos: false,
        analisarAlertas: false,
        exportarRelatorios: false,
        visualizarAuditoria: false,
        escopo: 'Apenas o seu Posto',
      },
    },
    {
      role: 'AUDITOR',
      nome: 'Auditoria & Controle Interno',
      descricao: 'Acesso estritamente somente-leitura e trilha forense para TCE e Controladoria.',
      permissoes: {
        cadastrarAbastecimento: false,
        cancelarAbastecimento: false,
        gerenciarPostos: false,
        gerenciarVeiculos: false,
        alterarPrecos: false,
        analisarAlertas: false,
        exportarRelatorios: true,
        visualizarAuditoria: true,
        escopo: 'Somente Leitura e Forense',
      },
    },
  ];

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600" />
          Usuários & Controle de Acesso (RBAC)
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Governança institucional, segregação de funções e perfis de segurança aplicados
        </p>
      </div>

      {/* Lista de Usuários Cadastrados */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-emerald-600" />
          Contas de Usuários Ativos no Sistema
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Você pode alternar o operador ativo para testar a aplicação dos níveis de permissão
        </p>

        <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Servidor / E-mail</th>
                <th className="py-2.5 px-3">Matrícula</th>
                <th className="py-2.5 px-3">Cargo / Função</th>
                <th className="py-2.5 px-3">Perfil RBAC</th>
                <th className="py-2.5 px-3">Lotação / Secretaria</th>
                <th className="py-2.5 px-2">Situação</th>
                <th className="py-2.5 px-3">Último Acesso</th>
                <th className="py-2.5 px-4 text-right">Alternar Sessão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {allUsers.map((user) => {
                const badge = getRoleBadge(user.role);
                const isSelected = currentUser.id === user.id;

                return (
                  <tr key={user.id} className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-emerald-50/40' : ''}`}>
                    <td className="py-2.5 px-4">
                      <div className="font-bold text-slate-900">{user.nome}</div>
                      <div className="text-[11px] text-slate-400">{user.email}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700 text-xs">
                      {user.matricula || 'PMCG'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 text-xs">
                      {user.cargo || user.roleDescricao}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 text-xs">
                      {user.departamento || user.secretariaNome || (user.postoId ? 'Posto Credenciado' : 'Gabinete Municipal')}
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Ativo
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                      {user.ultimoAcesso ? formatDateOnly(user.ultimoAcesso) : '-'}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      {isSelected ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                          Ativo Agora
                        </span>
                      ) : (
                        <button
                          onClick={() => setCurrentUser(user)}
                          className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 border border-emerald-200 hover:bg-emerald-50 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                        >
                          Simular
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Matriz RBAC Formal */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-600" />
          Matriz de Permissões Institucionais (RBAC)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Diretrizes aplicadas em nível de backend para validação das requisições e isolamento de escopo
        </p>

        <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Papel / Perfil</th>
                <th className="py-2.5 px-2 text-center">Registrar Abast.</th>
                <th className="py-2.5 px-2 text-center">Cancelar Abast.</th>
                <th className="py-2.5 px-2 text-center">Postos</th>
                <th className="py-2.5 px-2 text-center">Veículos</th>
                <th className="py-2.5 px-2 text-center">Preços</th>
                <th className="py-2.5 px-2 text-center">Alertas</th>
                <th className="py-2.5 px-2 text-center">Relatórios</th>
                <th className="py-2.5 px-4">Escopo de Visibilidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matrixPermissoes.map((p) => (
                <tr key={p.role} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900">{p.nome}</div>
                    <div className="text-[10px] text-slate-400">{p.descricao}</div>
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {p.permissoes.cadastrarAbastecimento ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {p.permissoes.cancelarAbastecimento ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {p.permissoes.gerenciarPostos ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {p.permissoes.gerenciarVeiculos ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {p.permissoes.alterarPrecos ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {p.permissoes.analisarAlertas ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {p.permissoes.exportarRelatorios ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800 text-[11px]">
                    {p.permissoes.escopo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
