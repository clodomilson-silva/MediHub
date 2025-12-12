# MediHub - Prontuário Eletrônico Colaborativo

Sistema completo de gestão de saúde com prontuário eletrônico compartilhado entre unidades.

## 🚀 Tecnologias

- **Frontend**: React 19, Vite, React Router
- **Backend**: Node.js, Express
- **Banco de Dados**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Autenticação**: JWT + bcrypt
- **Deploy**: Vercel

## 🔧 Configuração Local

### 1. Instale as dependências
```bash
npm install
```

### 2. Configure o Neon PostgreSQL

1. Acesse https://console.neon.tech
2. Crie um novo projeto
3. Copie a Connection String
4. Crie o arquivo `.env`:

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
JWT_SECRET=sua_chave_secreta_super_segura
PORT=3001
NODE_ENV=development
```

### 3. Criar tabelas e popular banco
```bash
npm run db:push
npm run db:seed
```

### 4. Iniciar aplicação
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend  
npm run dev:server
```

## 👥 Credenciais de Teste

- **Admin**: admin@medihub.com / admin123
- **Médico**: medico@medihub.com / medico123
- **Paciente**: paciente@medihub.com / paciente123

## 🚀 Deploy na Vercel

1. Faça push no GitHub
2. Importe projeto na Vercel
3. Adicione variáveis: `DATABASE_URL`, `JWT_SECRET`
4. Deploy automático!

## 📊 Estrutura do Banco

- **usuarios**: Admin, médicos, pacientes
- **pacientes**: Prontuário completo
- **atendimentos**: Consultas
- **receitas**: Prescrições
- **exames**: Solicitações e resultados
- **vacinas**: Cartão de vacinas

## 🔐 Permissões

- **Admin**: CRUD completo
- **Médico**: Criar/editar (sem deletar)
- **Paciente**: Visualizar próprios dados
