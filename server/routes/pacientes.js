import express from 'express';
import { db } from '../db/index.js';
import { pacientes, pacienteUnidade, vacinas, atendimentos, receitas, exames, unidades, usuarios } from '../db/schema.js';
import { eq, desc, and, sql } from 'drizzle-orm';
import { authMiddleware, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Buscar paciente por CPF
router.get('/buscar-cpf/:cpf', checkRole('admin', 'medico'), async (req, res) => {
  try {
    const { cpf } = req.params;
    
    const paciente = await db.select().from(pacientes).where(eq(pacientes.cpf, cpf));

    if (paciente.length === 0) {
      return res.status(404).json({ encontrado: false });
    }

    res.json({ encontrado: true, paciente: paciente[0] });
  } catch (error) {
    console.error('Erro ao buscar paciente:', error);
    res.status(500).json({ error: 'Erro ao buscar paciente' });
  }
});

// Listar todos os pacientes
router.get('/', checkRole('admin', 'medico'), async (req, res) => {
  try {
    const todosPacientes = await db.select().from(pacientes).where(eq(pacientes.ativo, true));
    res.json(todosPacientes);
  } catch (error) {
    console.error('Erro ao listar pacientes:', error);
    res.status(500).json({ error: 'Erro ao listar pacientes' });
  }
});

// Buscar paciente por ID
router.get('/:id', checkRole('admin', 'medico'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const paciente = await db.select().from(pacientes).where(eq(pacientes.id, parseInt(id)));

    if (paciente.length === 0) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }

    // Buscar vacinas do paciente
    const vacinasPaciente = await db.select().from(vacinas).where(eq(vacinas.pacienteId, parseInt(id)));

    res.json({
      ...paciente[0],
      vacinas: vacinasPaciente
    });
  } catch (error) {
    console.error('Erro ao buscar paciente:', error);
    res.status(500).json({ error: 'Erro ao buscar paciente' });
  }
});

// Criar novo paciente
router.post('/', checkRole('admin', 'medico'), async (req, res) => {
  try {
    const dadosPaciente = req.body;
    
    // Verificar se CPF já existe
    const cpfExistente = await db.select().from(pacientes).where(eq(pacientes.cpf, dadosPaciente.cpf));
    
    if (cpfExistente.length > 0) {
      return res.status(400).json({ error: 'CPF já cadastrado' });
    }

    // Criar paciente
    const novoPaciente = await db.insert(pacientes).values({
      nome: dadosPaciente.nome,
      cpf: dadosPaciente.cpf,
      dataNascimento: dadosPaciente.dataNascimento,
      sexo: dadosPaciente.sexo,
      telefone: dadosPaciente.telefone,
      email: dadosPaciente.email,
      endereco: dadosPaciente.endereco,
      cidade: dadosPaciente.cidade,
      estado: dadosPaciente.estado,
      cep: dadosPaciente.cep,
      tipoSanguineo: dadosPaciente.tipoSanguineo,
      hipertenso: dadosPaciente.hipertenso || false,
      diabetico: dadosPaciente.diabetico || false,
      fumante: dadosPaciente.fumante || false,
      alergias: dadosPaciente.alergias,
      medicamentoContinuo: dadosPaciente.medicamentoContinuo || false,
      medicamentosContinuos: dadosPaciente.medicamentosContinuos,
      doencasCronicas: dadosPaciente.doencasCronicas,
      cirurgiasAnteriores: dadosPaciente.cirurgiasAnteriores,
    }).returning();

    // Adicionar vacinas se fornecidas
    if (dadosPaciente.vacinas && dadosPaciente.vacinas.length > 0) {
      const vacinasData = dadosPaciente.vacinas.map(vacina => ({
        pacienteId: novoPaciente[0].id,
        nome: vacina.nome,
        dataAplicacao: vacina.dataAplicacao,
        dose: vacina.dose,
      }));
      
      await db.insert(vacinas).values(vacinasData);
    }

    res.status(201).json(novoPaciente[0]);
  } catch (error) {
    console.error('Erro ao criar paciente:', error);
    res.status(500).json({ error: 'Erro ao criar paciente' });
  }
});

// Atualizar paciente
router.put('/:id', checkRole('admin', 'medico'), async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizacao = req.body;

    const pacienteAtualizado = await db
      .update(pacientes)
      .set({
        ...dadosAtualizacao,
        atualizadoEm: new Date(),
      })
      .where(eq(pacientes.id, parseInt(id)))
      .returning();

    if (pacienteAtualizado.length === 0) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }

    res.json(pacienteAtualizado[0]);
  } catch (error) {
    console.error('Erro ao atualizar paciente:', error);
    res.status(500).json({ error: 'Erro ao atualizar paciente' });
  }
});

// Deletar paciente (soft delete - apenas admin)
router.delete('/:id', checkRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const pacienteDesativado = await db
      .update(pacientes)
      .set({ ativo: false, atualizadoEm: new Date() })
      .where(eq(pacientes.id, parseInt(id)))
      .returning();

    if (pacienteDesativado.length === 0) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }

    res.json({ message: 'Paciente desativado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar paciente:', error);
    res.status(500).json({ error: 'Erro ao deletar paciente' });
  }
});

// Vincular paciente à unidade
router.post('/:id/vincular-unidade', checkRole('admin', 'medico'), async (req, res) => {
  try {
    const { id } = req.params;
    const { unidadeId } = req.body;

    await db.insert(pacienteUnidade).values({
      pacienteId: parseInt(id),
      unidadeId: parseInt(unidadeId),
    });

    res.json({ message: 'Paciente vinculado à unidade com sucesso' });
  } catch (error) {
    console.error('Erro ao vincular paciente:', error);
    res.status(500).json({ error: 'Erro ao vincular paciente' });
  }
});

// ==================== ROTAS PARA PACIENTES ====================

// Buscar prontuário do paciente logado
router.get('/meu/prontuario', checkRole('paciente'), async (req, res) => {
  try {
    const usuarioId = req.user.id;
    
    // Buscar paciente pelo usuarioId
    const paciente = await db.select().from(pacientes).where(eq(pacientes.usuarioId, usuarioId));
    
    if (paciente.length === 0) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }

    const pacienteId = paciente[0].id;

    // Buscar vacinas
    const vacinasPaciente = await db.select().from(vacinas).where(eq(vacinas.pacienteId, pacienteId));

    // Buscar unidades vinculadas
    const unidadesVinculadas = await db
      .select({
        id: unidades.id,
        nome: unidades.nome,
        endereco: unidades.endereco,
        cidade: unidades.cidade,
        telefone: unidades.telefone,
      })
      .from(pacienteUnidade)
      .innerJoin(unidades, eq(pacienteUnidade.unidadeId, unidades.id))
      .where(and(eq(pacienteUnidade.pacienteId, pacienteId), eq(pacienteUnidade.ativo, true)));

    // Buscar próxima consulta agendada
    const proximaConsulta = await db
      .select({
        id: atendimentos.id,
        dataAtendimento: atendimentos.dataAtendimento,
        tipo: atendimentos.tipo,
        medicoNome: usuarios.nome,
        medicoEspecialidade: usuarios.crm,
        unidadeNome: unidades.nome,
      })
      .from(atendimentos)
      .innerJoin(usuarios, eq(atendimentos.medicoId, usuarios.id))
      .innerJoin(unidades, eq(atendimentos.unidadeId, unidades.id))
      .where(and(
        eq(atendimentos.pacienteId, pacienteId),
        eq(atendimentos.status, 'agendado'),
        sql`${atendimentos.dataAtendimento} > NOW()`
      ))
      .orderBy(atendimentos.dataAtendimento)
      .limit(1);

    // Buscar estatísticas
    const totalConsultas = await db
      .select({ count: sql`COUNT(*)` })
      .from(atendimentos)
      .where(eq(atendimentos.pacienteId, pacienteId));

    const totalExames = await db
      .select({ count: sql`COUNT(*)` })
      .from(exames)
      .where(eq(exames.pacienteId, pacienteId));

    const totalReceitas = await db
      .select({ count: sql`COUNT(*)` })
      .from(receitas)
      .where(eq(receitas.pacienteId, pacienteId));

    res.json({
      ...paciente[0],
      vacinas: vacinasPaciente,
      unidadesVinculadas: unidadesVinculadas,
      proximaConsulta: proximaConsulta.length > 0 ? proximaConsulta[0] : null,
      estatisticas: {
        totalConsultas: parseInt(totalConsultas[0].count),
        totalExames: parseInt(totalExames[0].count),
        totalReceitas: parseInt(totalReceitas[0].count),
      }
    });
  } catch (error) {
    console.error('Erro ao buscar prontuário:', error);
    res.status(500).json({ error: 'Erro ao buscar prontuário' });
  }
});

// Buscar consultas do paciente logado
router.get('/meu/consultas', checkRole('paciente'), async (req, res) => {
  try {
    const usuarioId = req.user.id;
    
    // Buscar paciente pelo usuarioId
    const paciente = await db.select().from(pacientes).where(eq(pacientes.usuarioId, usuarioId));
    
    if (paciente.length === 0) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }

    const pacienteId = paciente[0].id;

    // Buscar todas as consultas
    const consultas = await db
      .select({
        id: atendimentos.id,
        dataAtendimento: atendimentos.dataAtendimento,
        tipo: atendimentos.tipo,
        status: atendimentos.status,
        queixaPrincipal: atendimentos.queixaPrincipal,
        hipoteseDiagnostica: atendimentos.hipoteseDiagnostica,
        conduta: atendimentos.conduta,
        observacoes: atendimentos.observacoes,
        medicoNome: usuarios.nome,
        medicoEspecialidade: usuarios.crm,
        unidadeNome: unidades.nome,
      })
      .from(atendimentos)
      .innerJoin(usuarios, eq(atendimentos.medicoId, usuarios.id))
      .innerJoin(unidades, eq(atendimentos.unidadeId, unidades.id))
      .where(eq(atendimentos.pacienteId, pacienteId))
      .orderBy(desc(atendimentos.dataAtendimento));

    res.json(consultas);
  } catch (error) {
    console.error('Erro ao buscar consultas:', error);
    res.status(500).json({ error: 'Erro ao buscar consultas' });
  }
});

// Buscar receitas do paciente logado
router.get('/meu/receitas', checkRole('paciente'), async (req, res) => {
  try {
    const usuarioId = req.user.id;
    
    // Buscar paciente pelo usuarioId
    const paciente = await db.select().from(pacientes).where(eq(pacientes.usuarioId, usuarioId));
    
    if (paciente.length === 0) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }

    const pacienteId = paciente[0].id;

    // Buscar todas as receitas
    const todasReceitas = await db
      .select({
        id: receitas.id,
        medicamentos: receitas.medicamentos,
        observacoes: receitas.observacoes,
        dataValidade: receitas.dataValidade,
        criadoEm: receitas.criadoEm,
        medicoNome: usuarios.nome,
        medicoCrm: usuarios.crm,
        atendimentoId: atendimentos.id,
        queixaPrincipal: atendimentos.queixaPrincipal,
        hipoteseDiagnostica: atendimentos.hipoteseDiagnostica,
        unidadeNome: unidades.nome,
      })
      .from(receitas)
      .innerJoin(usuarios, eq(receitas.medicoId, usuarios.id))
      .innerJoin(atendimentos, eq(receitas.atendimentoId, atendimentos.id))
      .innerJoin(unidades, eq(atendimentos.unidadeId, unidades.id))
      .where(eq(receitas.pacienteId, pacienteId))
      .orderBy(desc(receitas.criadoEm));

    res.json(todasReceitas);
  } catch (error) {
    console.error('Erro ao buscar receitas:', error);
    res.status(500).json({ error: 'Erro ao buscar receitas' });
  }
});

// Buscar exames do paciente logado
router.get('/meu/exames', checkRole('paciente'), async (req, res) => {
  try {
    const usuarioId = req.user.id;
    
    // Buscar paciente pelo usuarioId
    const paciente = await db.select().from(pacientes).where(eq(pacientes.usuarioId, usuarioId));
    
    if (paciente.length === 0) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }

    const pacienteId = paciente[0].id;

    // Buscar todos os exames
    const todosExames = await db
      .select({
        id: exames.id,
        tipoExame: exames.tipoExame,
        descricao: exames.descricao,
        dataSolicitacao: exames.dataSolicitacao,
        dataRealizacao: exames.dataRealizacao,
        resultado: exames.resultado,
        anexo: exames.anexo,
        status: exames.status,
        medicoNome: usuarios.nome,
        medicoCrm: usuarios.crm,
        unidadeNome: unidades.nome,
      })
      .from(exames)
      .innerJoin(usuarios, eq(exames.medicoSolicitante, usuarios.id))
      .leftJoin(atendimentos, eq(exames.atendimentoId, atendimentos.id))
      .leftJoin(unidades, eq(atendimentos.unidadeId, unidades.id))
      .where(eq(exames.pacienteId, pacienteId))
      .orderBy(desc(exames.dataSolicitacao));

    res.json(todosExames);
  } catch (error) {
    console.error('Erro ao buscar exames:', error);
    res.status(500).json({ error: 'Erro ao buscar exames' });
  }
});

// Estatísticas gerais do dashboard (admin/médico)
router.get('/dashboard/estatisticas', checkRole('admin', 'medico'), async (req, res) => {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    // Total de pacientes ativos
    const totalPacientesResult = await db
      .select({ count: sql`count(*)` })
      .from(pacientes)
      .where(eq(pacientes.ativo, true));
    
    const totalPacientes = Number(totalPacientesResult[0].count);

    // Consultas hoje
    const consultasHojeResult = await db
      .select({ count: sql`count(*)` })
      .from(atendimentos)
      .where(
        and(
          sql`${atendimentos.dataAtendimento} >= ${hoje.toISOString()}`,
          sql`${atendimentos.dataAtendimento} < ${amanha.toISOString()}`
        )
      );
    
    const consultasHoje = Number(consultasHojeResult[0].count);

    // Exames pendentes (solicitado)
    const examesPendentesResult = await db
      .select({ count: sql`count(*)` })
      .from(exames)
      .where(eq(exames.status, 'solicitado'));
    
    const examesPendentes = Number(examesPendentesResult[0].count);

    // Total de atendimentos realizados
    const procedimentosResult = await db
      .select({ count: sql`count(*)` })
      .from(atendimentos)
      .where(eq(atendimentos.status, 'concluido'));
    
    const procedimentos = Number(procedimentosResult[0].count);

    res.json({
      totalPacientes,
      consultasHoje,
      examesPendentes,
      procedimentos
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// Atendimentos recentes (admin/médico)
router.get('/dashboard/atendimentos-recentes', checkRole('admin', 'medico'), async (req, res) => {
  try {
    const limite = parseInt(req.query.limite) || 5;

    const atendimentosRecentes = await db
      .select({
        id: atendimentos.id,
        dataAtendimento: atendimentos.dataAtendimento,
        tipo: atendimentos.tipo,
        status: atendimentos.status,
        pacienteNome: pacientes.nome,
        medicoNome: usuarios.nome,
        unidadeNome: unidades.nome
      })
      .from(atendimentos)
      .innerJoin(pacientes, eq(atendimentos.pacienteId, pacientes.id))
      .innerJoin(usuarios, eq(atendimentos.medicoId, usuarios.id))
      .innerJoin(unidades, eq(atendimentos.unidadeId, unidades.id))
      .orderBy(desc(atendimentos.dataAtendimento))
      .limit(limite);

    res.json(atendimentosRecentes);
  } catch (error) {
    console.error('Erro ao buscar atendimentos recentes:', error);
    res.status(500).json({ error: 'Erro ao buscar atendimentos recentes' });
  }
});

export default router;
