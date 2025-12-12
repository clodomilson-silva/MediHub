import express from 'express';
import { db } from '../db/index.js';
import { pacientes, pacienteUnidade, vacinas } from '../db/schema.js';
import { eq } from 'drizzle-orm';
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

export default router;
