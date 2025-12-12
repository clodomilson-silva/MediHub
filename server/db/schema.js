import { pgTable, serial, varchar, text, boolean, timestamp, integer, date } from 'drizzle-orm/pg-core';

// Tabela de Usuários
export const usuarios = pgTable('usuarios', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  senha: varchar('senha', { length: 255 }).notNull(),
  tipo: varchar('tipo', { length: 20 }).notNull(), // 'admin', 'medico', 'enfermeiro', 'profissional', 'paciente'
  cpf: varchar('cpf', { length: 14 }),
  crm: varchar('crm', { length: 20 }), // Para médicos
  coren: varchar('coren', { length: 20 }), // Para enfermeiros
  matricula: varchar('matricula', { length: 50 }), // Para outros profissionais de saúde
  telefone: varchar('telefone', { length: 20 }),
  ativo: boolean('ativo').default(true),
  criadoEm: timestamp('criado_em').defaultNow(),
  atualizadoEm: timestamp('atualizado_em').defaultNow(),
});

// Tabela de Unidades de Saúde
export const unidades = pgTable('unidades', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 255 }).notNull(),
  endereco: text('endereco'),
  cidade: varchar('cidade', { length: 100 }),
  estado: varchar('estado', { length: 2 }),
  telefone: varchar('telefone', { length: 20 }),
  ativo: boolean('ativo').default(true),
  criadoEm: timestamp('criado_em').defaultNow(),
});

// Tabela de Pacientes
export const pacientes = pgTable('pacientes', {
  id: serial('id').primaryKey(),
  usuarioId: integer('usuario_id').references(() => usuarios.id),
  nome: varchar('nome', { length: 255 }).notNull(),
  cpf: varchar('cpf', { length: 14 }).notNull().unique(),
  dataNascimento: date('data_nascimento').notNull(),
  sexo: varchar('sexo', { length: 1 }).notNull(),
  telefone: varchar('telefone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  endereco: text('endereco'),
  cidade: varchar('cidade', { length: 100 }),
  estado: varchar('estado', { length: 2 }),
  cep: varchar('cep', { length: 10 }),
  
  // Dados de Saúde
  tipoSanguineo: varchar('tipo_sanguineo', { length: 5 }),
  hipertenso: boolean('hipertenso').default(false),
  diabetico: boolean('diabetico').default(false),
  fumante: boolean('fumante').default(false),
  alergias: text('alergias'),
  medicamentoContinuo: boolean('medicamento_continuo').default(false),
  medicamentosContinuos: text('medicamentos_continuos'),
  doencasCronicas: text('doencas_cronicas'),
  cirurgiasAnteriores: text('cirurgias_anteriores'),
  
  ativo: boolean('ativo').default(true),
  criadoEm: timestamp('criado_em').defaultNow(),
  atualizadoEm: timestamp('atualizado_em').defaultNow(),
});

// Tabela de Vínculo Paciente-Unidade
export const pacienteUnidade = pgTable('paciente_unidade', {
  id: serial('id').primaryKey(),
  pacienteId: integer('paciente_id').references(() => pacientes.id).notNull(),
  unidadeId: integer('unidade_id').references(() => unidades.id).notNull(),
  dataCadastro: timestamp('data_cadastro').defaultNow(),
  ativo: boolean('ativo').default(true),
});

// Tabela de Vacinas
export const vacinas = pgTable('vacinas', {
  id: serial('id').primaryKey(),
  pacienteId: integer('paciente_id').references(() => pacientes.id).notNull(),
  nome: varchar('nome', { length: 255 }).notNull(),
  dataAplicacao: date('data_aplicacao'),
  dose: varchar('dose', { length: 50 }),
  lote: varchar('lote', { length: 50 }),
  observacoes: text('observacoes'),
  criadoEm: timestamp('criado_em').defaultNow(),
});

// Tabela de Atendimentos
export const atendimentos = pgTable('atendimentos', {
  id: serial('id').primaryKey(),
  pacienteId: integer('paciente_id').references(() => pacientes.id).notNull(),
  medicoId: integer('medico_id').references(() => usuarios.id).notNull(),
  unidadeId: integer('unidade_id').references(() => unidades.id).notNull(),
  tipo: varchar('tipo', { length: 50 }).notNull(), // 'consulta', 'emergencia', 'retorno'
  dataAtendimento: timestamp('data_atendimento').notNull(),
  queixaPrincipal: text('queixa_principal'),
  historiaDoenca: text('historia_doenca'),
  exameFisico: text('exame_fisico'),
  hipoteseDiagnostica: text('hipotese_diagnostica'),
  conduta: text('conduta'),
  observacoes: text('observacoes'),
  status: varchar('status', { length: 20 }).default('concluido'), // 'agendado', 'em_andamento', 'concluido', 'cancelado'
  criadoEm: timestamp('criado_em').defaultNow(),
  atualizadoEm: timestamp('atualizado_em').defaultNow(),
});

// Tabela de Receitas Médicas
export const receitas = pgTable('receitas', {
  id: serial('id').primaryKey(),
  atendimentoId: integer('atendimento_id').references(() => atendimentos.id).notNull(),
  pacienteId: integer('paciente_id').references(() => pacientes.id).notNull(),
  medicoId: integer('medico_id').references(() => usuarios.id).notNull(),
  medicamentos: text('medicamentos').notNull(), // JSON ou texto estruturado
  observacoes: text('observacoes'),
  dataValidade: date('data_validade'),
  criadoEm: timestamp('criado_em').defaultNow(),
});

// Tabela de Exames
export const exames = pgTable('exames', {
  id: serial('id').primaryKey(),
  atendimentoId: integer('atendimento_id').references(() => atendimentos.id),
  pacienteId: integer('paciente_id').references(() => pacientes.id).notNull(),
  medicoSolicitante: integer('medico_solicitante').references(() => usuarios.id).notNull(),
  tipoExame: varchar('tipo_exame', { length: 255 }).notNull(),
  descricao: text('descricao'),
  dataSolicitacao: timestamp('data_solicitacao').defaultNow(),
  dataRealizacao: timestamp('data_realizacao'),
  resultado: text('resultado'),
  anexo: text('anexo'), // URL do arquivo
  status: varchar('status', { length: 20 }).default('solicitado'), // 'solicitado', 'realizado', 'cancelado'
  criadoEm: timestamp('criado_em').defaultNow(),
  atualizadoEm: timestamp('atualizado_em').defaultNow(),
});

// Tabela de Internações
export const internacoes = pgTable('internacoes', {
  id: serial('id').primaryKey(),
  pacienteId: integer('paciente_id').references(() => pacientes.id).notNull(),
  unidadeId: integer('unidade_id').references(() => unidades.id).notNull(),
  medicoResponsavel: integer('medico_responsavel').references(() => usuarios.id).notNull(),
  dataEntrada: timestamp('data_entrada').notNull(),
  dataSaida: timestamp('data_saida'),
  motivo: text('motivo').notNull(),
  diagnostico: text('diagnostico'),
  procedimentosRealizados: text('procedimentos_realizados'),
  evolucao: text('evolucao'),
  status: varchar('status', { length: 20 }).default('ativo'), // 'ativo', 'alta', 'transferido', 'obito'
  criadoEm: timestamp('criado_em').defaultNow(),
  atualizadoEm: timestamp('atualizado_em').defaultNow(),
});
