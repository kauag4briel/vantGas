import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Webhook,
  Key,
  Terminal,
  CheckCircle2,
  Copy,
  Send,
  Code2,
  ShieldAlert,
  Radio,
} from 'lucide-react';

export const IntegracaoApiView: React.FC = () => {
  const { postos, veiculos, combustiveis, formasPagamento, addAbastecimento } = useApp();

  const [selectedPostoId, setSelectedPostoId] = useState(postos[0]?.id || '');
  const [apiKey] = useState('vantgas_live_pk_9a8f7b6c5d4e3f2a1b0c9d8e7f6a5b4c');
  const [copied, setCopied] = useState(false);

  // Interactive Test Payload
  const [testPayload, setTestPayload] = useState(
    JSON.stringify(
      {
        posto_codigo: postos[0]?.codigoInterno || 'POS-001',
        veiculo_placa: veiculos[0]?.placa || 'ABC-1234',
        combustivel_anp: '320102001',
        quantidade_litros: 42.5,
        preco_unitario: 6.09,
        odometro_km: (veiculos[0]?.odometroAtual || 45000) + 380,
        numero_bomba: 2,
        numero_cupom_fiscal: 'NFCe-998241',
        motorista_nome: 'Carlos Eduardo Oliveira',
        motorista_cpf: '23456789012',
        data_hora_emissao: new Date().toISOString(),
      },
      null,
      2
    )
  );

  const [testResult, setTestResult] = useState<{ status: 'success' | 'error'; message: string; details?: any } | null>(null);

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendTestPayload = () => {
    try {
      const parsed = JSON.parse(testPayload);
      const posto = postos.find((p) => p.codigoInterno === parsed.posto_codigo || p.id === selectedPostoId);
      const veiculo = veiculos.find((v) => v.placa.replace(/\W/g, '') === parsed.veiculo_placa.replace(/\W/g, ''));
      const combustivel = combustiveis[0];
      const formaPag = formasPagamento[0];

      if (!posto || !veiculo) {
        setTestResult({
          status: 'error',
          message: 'Erro HTTP 422: Veículo ou Posto não identificados na base cadastral municipal.',
        });
        return;
      }

      const res = addAbastecimento({
        postoId: posto.id,
        veiculoId: veiculo.id,
        combustivelId: combustivel.id,
        quantidadeLitros: parsed.quantidade_litros,
        precoUnitarioLitro: parsed.preco_unitario,
        formaPagamentoId: formaPag.id,
        odometroRegistrado: parsed.odometro_km,
        motoristaNome: parsed.motorista_nome,
        motoristaCpf: parsed.motorista_cpf,
        numeroBomba: parsed.numero_bomba,
        numeroCupomFiscal: parsed.numero_cupom_fiscal,
        dataHora: parsed.data_hora_emissao,
      });

      if (res.success) {
        setTestResult({
          status: 'success',
          message: 'HTTP 201 Created: Abastecimento autenticado e gravado com sucesso via API da Pista.',
          details: res.abastecimento,
        });
      } else {
        setTestResult({
          status: 'error',
          message: `HTTP 400 Bad Request: ${res.message}`,
        });
      }
    } catch (err: any) {
      setTestResult({
        status: 'error',
        message: `JSON Parse Error: Sintaxe inválida no payload JSON (${err.message}).`,
      });
    }
  };

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <Webhook className="w-5 h-5 text-emerald-600" />
          Integração & API dos Postos
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          APIs REST e webhooks para integração direta com concentradores de bombas e automação de pista
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Credentials and Security Documentation */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-600" />
              Chave de Acesso da Pista Credenciada (API Key)
            </h3>
            <p className="text-xs text-slate-500">
              Cada posto credenciado recebe uma credencial exclusiva com token criptográfico seguro.
            </p>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Selecione o Posto:</label>
              <select
                aria-label="Posto credenciado para integração"
                value={selectedPostoId}
                onChange={(e) => setSelectedPostoId(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
              >
                {postos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.codigoInterno} - {p.nomeFantasia}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Chave de Produção (Bearer Token):</label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  readOnly
                  value={apiKey}
                  className="flex-1 text-xs font-mono p-2.5 bg-slate-100 border border-slate-200 rounded-lg select-all text-slate-600"
                />
                <button
                  onClick={handleCopyApiKey}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Conexão TLS 1.3 ativa com mTLS para redes fechadas de postos.</span>
            </div>
          </div>

          {/* Endpoint Specification */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-600" />
              Especificação do Endpoint REST
            </h3>

            <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs space-y-1 shadow-inner">
              <div className="text-emerald-400 font-bold">POST /api/v1/postos/transacoes</div>
              <div className="text-slate-400 text-[11px]">Host: api.vantgas.com.br</div>
              <div className="text-slate-400 text-[11px]">Authorization: Bearer {'<CHAVE_DO_POSTO>'}</div>
              <div className="text-slate-400 text-[11px]">Content-Type: application/json</div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              O motor de regras valida em tempo real: placa ativa, limite de litros versus capacidade do tanque,
              continuidade crescente do odômetro e horário de credenciamento.
            </p>
          </div>
        </div>

        {/* Live Simulator & Tester */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-600" />
                Simulador de Envio em Tempo Real
              </h3>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Sandbox
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Edite o payload JSON abaixo e clique para simular o concentrador de bomba enviando a
              transação diretamente para o motor de validação.
            </p>

            <textarea
              rows={12}
              value={testPayload}
              onChange={(e) => setTestPayload(e.target.value)}
              className="w-full font-mono text-[11px] p-3.5 bg-slate-950 text-emerald-400 rounded-xl outline-none border border-slate-800 focus:ring-2 focus:ring-emerald-500/30"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 space-y-3">
            <button
              onClick={handleSendTestPayload}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-colors"
            >
              <Send className="w-4 h-4" />
              Testar Validação & Gravação
            </button>

            {testResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-mono ${
                  testResult.status === 'success'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
              >
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  {testResult.status === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  {testResult.message}
                </div>
                {testResult.details && (
                  <div className="text-[10px] text-slate-600 mt-1">
                    Autenticação Gerada: {testResult.details.codigoAutenticacao} • Total: R${' '}
                    {testResult.details.valorTotal}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
