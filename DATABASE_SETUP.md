# Instruções para configurar o Neon PostgreSQL

## 1. Criar conta no Neon
- Acesse: https://console.neon.tech
- Crie uma conta gratuita

## 2. Criar novo projeto
- Clique em "Create Project"
- Escolha um nome para o projeto (ex: medihub)
- Selecione a região mais próxima

## 3. Obter a Connection String
- Na dashboard do projeto, copie a "Connection String"
- Formato: `postgresql://user:password@host/database?sslmode=require`

## 4. Configurar localmente
```bash
# Copie o arquivo .env.example para .env
cp .env.example .env

# Edite o .env e cole sua DATABASE_URL
# DATABASE_URL=postgresql://seu_usuario:sua_senha@seu_host/seu_database?sslmode=require
```

## 5. Criar as tabelas
```bash
# Execute as migrations
npm run db:push
```

## 6. (Opcional) Popular dados iniciais
```bash
npm run db:seed
```

## 7. Iniciar o servidor
```bash
npm run dev
```

## Deploy na Vercel

1. Adicione a variável de ambiente `DATABASE_URL` no painel da Vercel
2. Adicione `JWT_SECRET` também
3. Deploy automático ao fazer push no GitHub
