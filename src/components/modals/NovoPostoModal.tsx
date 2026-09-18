import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Fuel, Building, MapPin, Phone, ShieldCheck } from 'lucide-react';

export const NovoPostoModal: React.FC = () => {
  const { isNovoPostoModalOpen, setIsNovoPostoModalOpen, addPosto, combustiveis } = useApp();

  const [nomeFantasia, setNomeFantasia] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [inscricaoEstadual, setInscricaoEstadual] = useState('');
  const [codigoInterno, setCodigoInterno] = useState(`POS-00${Math.floor(10 + Math.random() * 90)}`);
  const [bandeira, setBandeira] = useState('Petrobras / Vibra');
  const [logradouro, setLogradouro] = useState('Av. 03 de Julho');
  const [numero, setNumero] = useState('100');
  const [bairro, setBairro] = useState('Centro');
  const [municipio, setMunicipio] = useState('Cocalzinho de Goiás');
  const [uf, setUf] = useState('GO');
  const [cep, setCep] = useState('72975-000');
  const [latitude, setLatitude] = useState('-15.7938');
  const [longitude, setLongitude] = useState('-48.7770');
  const [telefone, setTelefone] = useState('(62) 3339-1200');
  const [email, setEmail] = useState('contato@posto.vantgas.com.br');
  const [responsavelContato, setResponsavelContato] = useState('Gerente Operacional');
  const [horarioFuncionamento, setHorarioFuncionamento] = useState('06:00 às 22:00');
  const [quantidadeBombas, setQuantidadeBombas] = useState('4');
  const [quantidadeTanques, setQuantidadeTanques] = useState('3');
  const [capacidadeLitros, setCapacidadeLitros] = useState('60000');

  if (!isNovoPostoModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeFantasia.trim() || !razaoSocial.trim() || !cnpj.trim()) {
      alert('Preencha os campos obrigatórios do posto.');
      return;
    }

    addPosto({
      codigoInterno,
      nomeFantasia: nomeFantasia.trim(),
      razaoSocial: razaoSocial.trim(),
      cnpj: cnpj.replace(/\D/g, ''),
      inscricaoEstadual: inscricaoEstadual.trim(),
      bandeira,
      status: 'ativo',
      cep,
      uf,
      municipio,
      bairro,
      logradouro,
      numero,
      latitude: parseFloat(latitude) || -23.184,
      longitude: parseFloat(longitude) || -52.2045,
      telefone,
      email,
      responsavelContato,
      horarioFuncionamento,
      quantidadeBombas: parseInt(quantidadeBombas, 10) || 4,
      quantidadeTanques: parseInt(quantidadeTanques, 10) || 3,
      capacidadeArmazenamentoLitros: parseInt(capacidadeLitros, 10) || 60000,
      dataCredenciamento: new Date().toISOString().slice(0, 10),
      combustiveis: combustiveis.map((c) => ({
        combustivelId: c.id,
        combustivelNome: c.nome,
        precoAtual: 6.19,
        dataAtualizacaoPreco: new Date().toISOString().slice(0, 10),
        disponivel: true,
      })),
      documentos: [
        {
          id: `doc-${Date.now()}-1`,
          tipo: 'Alvará de Localização e Funcionamento',
          numeroDocumento: `ALV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          dataEmissao: '2026-01-10',
          dataValidade: '2026-12-31',
          orgaoEmissor: 'Órgão de Fiscalização / VantGas Credenciamento',
          status: 'valido',
        },
        {
          id: `doc-${Date.now()}-2`,
          tipo: 'Licença de Operação Ambiental (LO)',
          numeroDocumento: `LO-IBAMA-${Math.floor(10000 + Math.random() * 90000)}`,
          dataEmissao: '2025-06-15',
          dataValidade: '2027-06-15',
          orgaoEmissor: 'Órgão Ambiental',
          status: 'valido',
        },
      ],
    });

    alert('Posto credenciado com sucesso no SIGA-Combustível!');
    setIsNovoPostoModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-sm max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-6 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={() => setIsNovoPostoModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-sm cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-slate-200 pb-3 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-sm bg-blue-600 text-white flex items-center justify-center font-bold">
            <Fuel className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Credenciar Posto de Combustíveis
            </h2>
            <p className="text-xs text-slate-500">
              Cadastro regulatório institucional conforme normas da ANP e Lei de Licitações
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4 max-h-[72vh] overflow-y-auto pr-1 text-xs">
          {/* Razão Social e Nome Fantasia */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Nome Fantasia do Estabelecimento:
              </label>
              <input
                type="text"
                required
                value={nomeFantasia}
                onChange={(e) => setNomeFantasia(e.target.value)}
                placeholder="Ex: Auto Posto Estrela Ltda"
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Razão Social (Empresarial):
              </label>
              <input
                type="text"
                required
                value={razaoSocial}
                onChange={(e) => setRazaoSocial(e.target.value)}
                placeholder="Ex: Estrela Combustíveis e Serviços S/A"
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* CNPJ, Inscrição e Bandeira */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                CNPJ:
              </label>
              <input
                type="text"
                required
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="00.000.000/0001-00"
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Inscrição Estadual:
              </label>
              <input
                type="text"
                value={inscricaoEstadual}
                onChange={(e) => setInscricaoEstadual(e.target.value)}
                placeholder="Ex: 90123456-78"
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Bandeira:
              </label>
              <select
                aria-label="Selecionar bandeira do posto"
                value={bandeira}
                onChange={(e) => setBandeira(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Petrobras / Vibra">Petrobras / Vibra</option>
                <option value="Ipiranga">Ipiranga</option>
                <option value="Shell / Raízen">Shell / Raízen</option>
                <option value="Ale Combustíveis">Ale Combustíveis</option>
                <option value="Bandeira Branca">Bandeira Branca (Independente)</option>
              </select>
            </div>
          </div>

          {/* Endereço */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Logradouro / Rua:
              </label>
              <input
                type="text"
                required
                value={logradouro}
                onChange={(e) => setLogradouro(e.target.value)}
                placeholder="Ex: Av. Brasil"
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Número:
              </label>
              <input
                type="text"
                required
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Ex: 1000"
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Bairro:
              </label>
              <input
                type="text"
                required
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Ex: Centro"
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none"
              />
            </div>
          </div>

          {/* Estrutura Operacional */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Quantidade de Bombas:
              </label>
              <input
                type="number"
                value={quantidadeBombas}
                onChange={(e) => setQuantidadeBombas(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Quantidade de Tanques:
              </label>
              <input
                type="number"
                value={quantidadeTanques}
                onChange={(e) => setQuantidadeTanques(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Capacidade Total (Litros):
              </label>
              <input
                type="number"
                value={capacidadeLitros}
                onChange={(e) => setCapacidadeLitros(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none"
              />
            </div>
          </div>

          {/* Contato */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Telefone de Contato:
              </label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                E-mail Institucional:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Horário de Atendimento:
              </label>
              <input
                type="text"
                value={horarioFuncionamento}
                onChange={(e) => setHorarioFuncionamento(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 bg-slate-50 rounded-sm outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNovoPostoModalOpen(false)}
              className="px-3.5 py-2 rounded-sm border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-sm bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs cursor-pointer transition-colors"
            >
              Credenciar Posto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
