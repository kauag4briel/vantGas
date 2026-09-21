# Sistema de Gestão de Frotas e Abastecimento Municipal (VantGas)

Sistema para controle de abastecimento, frotas públicas, rede de postos credenciados, contratos orçamentários, auditoria e conformidade fiscal (TCE/TCM).

---

## 🚀 Tecnologias

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Recharts
- **Backend / Servidor**: Express + Vite Middleware (para desenvolvimento e execução integrada)
- **Deploy**: Otimizado para **Vercel** (SPA Vite) e **Google Cloud Run**

---

## 📦 Como Rodar Localmente

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Iniciar em modo de desenvolvimento**:
   ```bash
   npm run dev
   ```
   Acesse no navegador: `http://localhost:3000`

3. **Verificar tipos e erros de TypeScript**:
   ```bash
   npm run lint
   ```

4. **Gerar build de produção**:
   - Para build completo (frontend + backend Express):
     ```bash
     npm run build
     ```
   - Para build estático do frontend (Vite SPA):
     ```bash
     npm run build:client
     ```

---

## 🌐 Como Fazer Deploy na Vercel

O projeto já contém o arquivo `vercel.json` configurado na raiz com as reescritas de URL para Single Page Application (SPA), evitando erros 404 ao atualizar páginas ou rotas diretas.

### Opção 1: Pelo Painel Web da Vercel (Recomendado)

1. Faça o commit e envie seu projeto para um repositório no **GitHub**, **GitLab** ou **Bitbucket**.
2. Acesse [vercel.com](https://vercel.com) e faça login.
3. Clique em **"Add New..."** > **"Project"**.
4. Selecione o repositório do projeto e clique em **"Import"**.
5. Na tela de configuração do projeto:
   - **Framework Preset**: `Vite` (a Vercel reconhece automaticamente através do `vercel.json`).
   - **Root Directory**: `./` (raiz do repositório onde estão `package.json` e `vercel.json`).
   - **Build Command**: `npm run build:client` (definido no `vercel.json`).
   - **Output Directory**: `dist` (definido no `vercel.json`).
6. Clique em **"Deploy"**.

### Opção 2: Pela Linha de Comando (Vercel CLI)

1. Instale ou execute a CLI da Vercel:
   ```bash
   npx vercel
   ```
2. Siga as instruções no terminal para associar sua conta.
3. Para publicar diretamente em produção:
   ```bash
   npx vercel --prod
   ```

---

## ⚙️ Configuração do `vercel.json`

O arquivo `vercel.json` na raiz contém a seguinte estrutura:

```json
{
  "framework": "vite",
  "buildCommand": "npm run build:client",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

- **`buildCommand`**: Executa `vite build` para compilar os assets estáticos de forma ágil e otimizada.
- **`outputDirectory`**: Aponta para a pasta `dist`, onde o Vite gera o bundle final.
- **`rewrites`**: Redireciona todas as requisições para `/index.html`, garantindo que o roteamento de tela do SPA funcione sem falhas.

---

## 📂 Estrutura de Pastas

```text
├── src/
│   ├── components/        # Componentes visuais e views do sistema
│   │   ├── views/         # Dashboard, Abastecimentos, Frotas, Postos, etc.
│   │   ├── Navigation.tsx # Barra de navegação e menu superior
│   │   └── TopHeader.tsx  # Header com perfil do operador e atalhos
│   ├── context/           # AppContext com gerenciamento de estado e regras
│   ├── data/              # Dados iniciais e parâmetros municipais
│   ├── types.ts           # Definições de tipos TypeScript
│   ├── utils/             # Formatadores (BRL, datas, odômetros)
│   ├── main.tsx           # Ponto de entrada do React
│   └── index.css          # Estilização global com Tailwind CSS
├── public/                # Assets públicos e ícones
├── index.html             # Ponto de entrada HTML
├── package.json           # Dependências e scripts do projeto
├── package-lock.json      # Versões exatas das dependências do npm
├── vite.config.ts         # Configuração do Vite com plugins React e Tailwind
├── vercel.json            # Configuração de deploy e reescritas de URL na Vercel
└── server.ts              # Servidor Express integrado
```
