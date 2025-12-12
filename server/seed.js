import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { db } from './db/index.js';
import { usuarios, unidades, pacientes, pacienteUnidade, vacinas, atendimentos, receitas, exames } from './db/schema.js';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Populando banco de dados...');

  try {
    // Limpar dados existentes (em ordem devido às foreign keys)
    console.log('🧹 Limpando dados existentes...');
    await db.delete(exames);
    await db.delete(receitas);
    await db.delete(atendimentos);
    await db.delete(vacinas);
    await db.delete(pacienteUnidade);
    await db.delete(pacientes);
    await db.delete(unidades);
    await db.delete(usuarios);
    console.log('✅ Dados limpos');

    // Criar usuários padrão
    const senhaHash = await bcrypt.hash('admin123', 10);
    
    const usuariosCriados = await db.insert(usuarios).values([
      {
        nome: 'Administrador do Sistema',
        email: 'admin@medihub.com',
        senha: senhaHash,
        tipo: 'admin',
        cpf: '000.000.000-00',
      },
      {
        nome: 'Dr. João Silva',
        email: 'medico@medihub.com',
        senha: await bcrypt.hash('medico123', 10),
        tipo: 'medico',
        crm: '12345-SP',
        telefone: '(11) 98765-4321',
      },
      {
        nome: 'Maria Santos',
        email: 'paciente@medihub.com',
        senha: await bcrypt.hash('paciente123', 10),
        tipo: 'paciente',
        cpf: '123.456.789-00',
        telefone: '(11) 91234-5678',
      },
    ]).returning();

    console.log('✅ Usuários criados:', usuariosCriados.length);

    // Criar unidades
    const unidadesCriadas = await db.insert(unidades).values([
      {
        nome: 'Unidade Central',
        endereco: 'Rua Principal, 100',
        cidade: 'São Paulo',
        estado: 'SP',
        telefone: '(11) 3000-0000',
      },
      {
        nome: 'Unidade Norte',
        endereco: 'Av. Norte, 500',
        cidade: 'São Paulo',
        estado: 'SP',
        telefone: '(11) 3000-1111',
      },
    ]).returning();

    console.log('✅ Unidades criadas:', unidadesCriadas.length);

    // Criar pacientes de exemplo
    const pacientesCriados = await db.insert(pacientes).values([
      {
        nome: 'Maria Silva',
        cpf: '123.456.789-00',
        dataNascimento: '1990-05-15',
        sexo: 'F',
        telefone: '(11) 91234-5678',
        email: 'paciente@medihub.com',
        tipoSanguineo: 'A+',
        hipertenso: true,
        diabetico: false,
      },
      {
        nome: 'João Santos',
        cpf: '987.654.321-00',
        dataNascimento: '1972-08-20',
        sexo: 'M',
        telefone: '(11) 91234-5678',
        email: 'joao.santos@email.com',
        tipoSanguineo: 'O-',
        hipertenso: false,
        diabetico: true,
        medicamentoContinuo: true,
        medicamentosContinuos: 'Metformina 850mg - 2x ao dia',
      },
    ]).returning();

    console.log('✅ Pacientes criados:', pacientesCriados.length);

    // Vincular paciente ao usuário paciente e à unidade
    const pacienteId = pacientesCriados[0].id;
    const usuarioPacienteId = usuariosCriados.find(u => u.tipo === 'paciente').id;
    const medicoId = usuariosCriados.find(u => u.tipo === 'medico').id;
    const unidadeId = unidadesCriadas[0].id;

    // Atualizar paciente com usuarioId
    await db.update(pacientes)
      .set({ usuarioId: usuarioPacienteId })
      .where(eq(pacientes.id, pacienteId));

    // Vincular paciente às unidades
    await db.insert(pacienteUnidade).values([
      {
        pacienteId: pacienteId,
        unidadeId: unidadesCriadas[0].id,
      },
      {
        pacienteId: pacienteId,
        unidadeId: unidadesCriadas[1].id,
      },
    ]);

    console.log('✅ Paciente vinculado ao usuário e unidades');

    // Criar vacinas
    await db.insert(vacinas).values([
      {
        pacienteId: pacienteId,
        nome: 'COVID-19',
        dataAplicacao: '2024-03-15',
        dose: '3ª dose',
        lote: 'COV123456',
      },
      {
        pacienteId: pacienteId,
        nome: 'Influenza (Gripe)',
        dataAplicacao: '2025-04-10',
        dose: 'Anual',
        lote: 'FLU789012',
      },
      {
        pacienteId: pacienteId,
        nome: 'Hepatite B',
        dataAplicacao: '2020-01-20',
        dose: '3ª dose',
        lote: 'HEP345678',
      },
    ]);

    console.log('✅ Vacinas registradas');

    // Criar atendimentos/consultas
    const atendimentosCriados = await db.insert(atendimentos).values([
      {
        pacienteId: pacienteId,
        medicoId: medicoId,
        unidadeId: unidadeId,
        tipo: 'consulta',
        dataAtendimento: new Date('2025-06-22T09:00:00'),
        queixaPrincipal: 'Primeira consulta - Pressão alta',
        historiaDoenca: 'Paciente relata pressão arterial elevada há 2 meses',
        exameFisico: 'PA: 145/95 mmHg, FC: 78 bpm',
        hipoteseDiagnostica: 'Hipertensão Arterial Sistêmica - Estágio 1',
        conduta: 'Iniciado Losartana 50mg 1x ao dia. Orientações sobre dieta e exercícios. Retorno em 30 dias.',
        observacoes: 'Solicitados exames laboratoriais: hemograma, glicemia, colesterol.',
        status: 'concluido',
      },
      {
        pacienteId: pacienteId,
        medicoId: medicoId,
        unidadeId: unidadeId,
        tipo: 'retorno',
        dataAtendimento: new Date('2025-09-10T15:00:00'),
        queixaPrincipal: 'Retorno - Avaliação de medicação',
        historiaDoenca: 'Paciente em uso de Losartana há 2 meses',
        exameFisico: 'PA: 130/85 mmHg, FC: 72 bpm',
        hipoteseDiagnostica: 'Hipertensão controlada com medicação',
        conduta: 'Manter medicação atual. Retorno em 3 meses.',
        observacoes: 'Pressão arterial dentro da meta. Exames laboratoriais normais.',
        status: 'concluido',
      },
      {
        pacienteId: pacienteId,
        medicoId: medicoId,
        unidadeId: unidadeId,
        tipo: 'retorno',
        dataAtendimento: new Date('2025-11-15T10:30:00'),
        queixaPrincipal: 'Retorno - Avaliação de exames',
        historiaDoenca: 'Paciente assintomático, hipertensão controlada',
        exameFisico: 'PA: 125/80 mmHg, FC: 70 bpm',
        hipoteseDiagnostica: 'Hipertensão controlada',
        conduta: 'Manter medicação atual (Losartana 50mg). Retorno em 3 meses.',
        observacoes: 'Exames de colesterol mostram leve elevação. Orientações dietéticas reforçadas.',
        status: 'concluido',
      },
      {
        pacienteId: pacienteId,
        medicoId: medicoId,
        unidadeId: unidadeId,
        tipo: 'consulta',
        dataAtendimento: new Date('2025-12-20T14:00:00'),
        queixaPrincipal: 'Consulta de rotina - Controle de pressão arterial',
        observacoes: 'Trazer exames de sangue recentes',
        status: 'agendado',
      },
    ]).returning();

    console.log('✅ Atendimentos criados:', atendimentosCriados.length);

    // Criar receitas
    await db.insert(receitas).values([
      {
        atendimentoId: atendimentosCriados[0].id,
        pacienteId: pacienteId,
        medicoId: medicoId,
        medicamentos: JSON.stringify([
          {
            nome: 'Losartana Potássica',
            dosagem: '50mg',
            posologia: '1 comprimido ao dia',
            quantidade: '30 comprimidos',
            duracao: '30 dias',
            observacoes: 'Tomar pela manhã em jejum'
          }
        ]),
        observacoes: 'Controle regular da pressão arterial. Retorno em 30 dias.',
        dataValidade: '2026-06-22',
      },
      {
        atendimentoId: atendimentosCriados[1].id,
        pacienteId: pacienteId,
        medicoId: medicoId,
        medicamentos: JSON.stringify([
          {
            nome: 'Losartana Potássica',
            dosagem: '50mg',
            posologia: '1 comprimido ao dia',
            quantidade: '90 comprimidos',
            duracao: '90 dias',
            observacoes: 'Tomar pela manhã'
          },
          {
            nome: 'Hidroclorotiazida',
            dosagem: '25mg',
            posologia: '1 comprimido ao dia',
            quantidade: '90 comprimidos',
            duracao: '90 dias',
            observacoes: 'Tomar junto com Losartana'
          }
        ]),
        observacoes: 'Medicação de uso contínuo. Renovar em 3 meses.',
        dataValidade: '2026-09-10',
      },
      {
        atendimentoId: atendimentosCriados[2].id,
        pacienteId: pacienteId,
        medicoId: medicoId,
        medicamentos: JSON.stringify([
          {
            nome: 'Sinvastatina',
            dosagem: '20mg',
            posologia: '1 comprimido à noite',
            quantidade: '30 comprimidos',
            duracao: '30 dias',
            observacoes: 'Tomar após o jantar'
          }
        ]),
        observacoes: 'Dieta pobre em gorduras saturadas. Exercícios regulares. Repetir colesterol em 30 dias.',
        dataValidade: '2026-11-15',
      },
    ]);

    console.log('✅ Receitas criadas');

    // Criar exames
    await db.insert(exames).values([
      {
        atendimentoId: atendimentosCriados[0].id,
        pacienteId: pacienteId,
        medicoSolicitante: medicoId,
        tipoExame: 'Hemograma Completo',
        descricao: 'Hemograma completo com contagem de plaquetas',
        dataSolicitacao: new Date('2025-06-22'),
        dataRealizacao: new Date('2025-06-25'),
        resultado: JSON.stringify({
          resumo: 'Normal',
          parametros: [
            { nome: 'Hemácias', valor: '4.8', unidade: 'milhões/mm³', referencia: '4.5 - 5.9' },
            { nome: 'Hemoglobina', valor: '14.2', unidade: 'g/dL', referencia: '13.5 - 17.5' },
            { nome: 'Hematócrito', valor: '42', unidade: '%', referencia: '40 - 54' },
            { nome: 'Leucócitos', valor: '7500', unidade: '/mm³', referencia: '4000 - 11000' },
            { nome: 'Plaquetas', valor: '250000', unidade: '/mm³', referencia: '150000 - 400000' }
          ]
        }),
        status: 'realizado',
      },
      {
        atendimentoId: atendimentosCriados[0].id,
        pacienteId: pacienteId,
        medicoSolicitante: medicoId,
        tipoExame: 'Glicemia de Jejum',
        descricao: 'Dosagem de glicose em jejum',
        dataSolicitacao: new Date('2025-06-22'),
        dataRealizacao: new Date('2025-06-25'),
        resultado: JSON.stringify({
          resumo: '95 mg/dL - Normal',
          parametros: [
            { nome: 'Glicose', valor: '95', unidade: 'mg/dL', referencia: '70 - 100' }
          ]
        }),
        status: 'realizado',
      },
      {
        atendimentoId: atendimentosCriados[2].id,
        pacienteId: pacienteId,
        medicoSolicitante: medicoId,
        tipoExame: 'Colesterol Total e Frações',
        descricao: 'Perfil lipídico completo',
        dataSolicitacao: new Date('2025-10-20'),
        dataRealizacao: new Date('2025-10-23'),
        resultado: JSON.stringify({
          resumo: 'Colesterol total levemente elevado',
          parametros: [
            { nome: 'Colesterol Total', valor: '210', unidade: 'mg/dL', referencia: '< 200' },
            { nome: 'HDL (Bom)', valor: '55', unidade: 'mg/dL', referencia: '> 40' },
            { nome: 'LDL (Ruim)', valor: '130', unidade: 'mg/dL', referencia: '< 130' },
            { nome: 'Triglicerídeos', valor: '125', unidade: 'mg/dL', referencia: '< 150' }
          ]
        }),
        status: 'realizado',
      },
      {
        atendimentoId: atendimentosCriados[1].id,
        pacienteId: pacienteId,
        medicoSolicitante: medicoId,
        tipoExame: 'Ureia e Creatinina',
        descricao: 'Função renal',
        dataSolicitacao: new Date('2025-09-10'),
        dataRealizacao: new Date('2025-09-12'),
        resultado: JSON.stringify({
          resumo: 'Função renal normal',
          parametros: [
            { nome: 'Ureia', valor: '32', unidade: 'mg/dL', referencia: '15 - 45' },
            { nome: 'Creatinina', valor: '0.9', unidade: 'mg/dL', referencia: '0.7 - 1.3' }
          ]
        }),
        status: 'realizado',
      },
      {
        pacienteId: pacienteId,
        medicoSolicitante: medicoId,
        tipoExame: 'Eletrocardiograma (ECG)',
        descricao: 'ECG de repouso',
        dataSolicitacao: new Date('2025-12-15'),
        observacoes: 'Exame agendado para 18/12/2025',
        status: 'solicitado',
      },
    ]);

    console.log('✅ Exames criados');

    // Atualizar dados completos do paciente
    await db.update(pacientes)
      .set({
        endereco: 'Rua das Flores, 123',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
        alergias: 'Dipirona, Penicilina',
        doencasCronicas: 'Hipertensão Arterial Sistêmica',
        medicamentosContinuos: 'Losartana 50mg - 1x ao dia\nHidroclorotiazida 25mg - 1x ao dia',
        cirurgiasAnteriores: 'Apendicectomia (2015)',
      })
      .where(eq(pacientes.id, pacienteId));

    console.log('✅ Dados do paciente atualizados');

    console.log('\n🎉 Banco de dados populado com sucesso!\n');
    console.log('📧 Credenciais de acesso:');
    console.log('   Admin:    admin@medihub.com / admin123');
    console.log('   Médico:   medico@medihub.com / medico123');
    console.log('   Paciente: paciente@medihub.com / paciente123\n');
    console.log('📊 Dados criados para o paciente de teste:');
    console.log('   - 3 Vacinas registradas');
    console.log('   - 4 Consultas (3 realizadas, 1 agendada)');
    console.log('   - 3 Receitas médicas');
    console.log('   - 5 Exames (4 realizados, 1 solicitado)\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao popular banco:', error);
    process.exit(1);
  }
}

seed();
