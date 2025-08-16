# Food Station - Autos360

Sistema de gerenciamento de status de alimentação para a empresa Autos360.

## 🚀 Tecnologias Utilizadas

- **Frontend**: React, JavaScript, PrimeReact
- **Backend**: Node.js, Express
- **Banco de Dados**: MongoDB
- **Estilização**: Sass (SCSS) + PrimeReact Components

## 📁 Estrutura do Projeto

```
food-status-autos360/
├── frontend/          # Aplicação React
├── backend/           # API Node.js
├── docs/             # Documentação
└── README.md
```

## 🛠️ Instalação e Execução

### 1. Configuração do Ambiente

#### Clonar e configurar variáveis de ambiente:
```bash
# Copiar arquivos de exemplo
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

#### Configurar o banco de dados RDS AWS:
- Consulte o arquivo `docs/rds-setup.md` para instruções detalhadas
- Atualize as variáveis no arquivo `backend/.env`:
  - `DB_HOST`: Endpoint do RDS
  - `DB_USERNAME`: Usuário do banco
  - `DB_PASSWORD`: Senha do banco
  - `DB_NAME`: Nome do banco de dados

### 2. Instalação das Dependências

#### Instalar todas as dependências:
```bash
npm run install:all
```

#### Ou instalar separadamente:
```bash
# Backend
cd backend && npm install

# Frontend  
cd frontend && npm install
```

### 3. Execução

#### Executar em modo desenvolvimento (frontend + backend):
```bash
npm run dev
```

#### Executar apenas o frontend:
```bash
npm run dev:frontend
```

#### Executar apenas o backend:
```bash
npm run dev:backend
```

#### Testar conexão com o banco:
```bash
cd backend && npm run test:db
```

## 📋 Funcionalidades

- [ ] Cadastro de funcionários
- [ ] Controle de refeições
- [ ] Dashboard de estatísticas
- [ ] Relatórios de consumo
- [ ] Gestão de cardápio

## 👥 Equipe Autos360

Desenvolvido pela equipe de TI da Autos360.
