import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { usuarios } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = express.Router();

// Registrar novo usuário
router.post('/registro', async (req, res) => {
  try {
    const { nome, email, senha, cpf, telefone, tipo = 'paciente', crm, coren, matricula } = req.body;

    // Validações de campos obrigatórios para profissionais
    if (tipo === 'medico' && !crm) {
      return res.status(400).json({ error: 'CRM é obrigatório para médicos' });
    }
    if (tipo === 'enfermeiro' && !coren) {
      return res.status(400).json({ error: 'COREN é obrigatório para enfermeiros' });
    }
    if (tipo === 'profissional' && !matricula) {
      return res.status(400).json({ error: 'Matrícula é obrigatória para profissionais de saúde' });
    }

    // Verificar se email já existe
    const usuarioExistente = await db.select().from(usuarios).where(eq(usuarios.email, email));
    
    if (usuarioExistente.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar usuário
    const novoUsuario = await db.insert(usuarios).values({
      nome,
      email,
      senha: senhaHash,
      cpf,
      telefone,
      tipo,
      crm: tipo === 'medico' ? crm : null,
      coren: tipo === 'enfermeiro' ? coren : null,
      matricula: tipo === 'profissional' ? matricula : null,
    }).returning();

    // Gerar token
    const token = jwt.sign(
      { 
        id: novoUsuario[0].id, 
        email: novoUsuario[0].email,
        tipo: novoUsuario[0].tipo 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remover senha da resposta
    const { senha: _, ...usuarioSemSenha } = novoUsuario[0];

    res.status(201).json({
      usuario: usuarioSemSenha,
      token,
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Buscar usuário
    const usuario = await db.select().from(usuarios).where(eq(usuarios.email, email));

    if (usuario.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario[0].senha);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar token
    const token = jwt.sign(
      { 
        id: usuario[0].id, 
        email: usuario[0].email,
        tipo: usuario[0].tipo 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remover senha da resposta
    const { senha: _, ...usuarioSemSenha } = usuario[0];

    res.json({
      usuario: usuarioSemSenha,
      token,
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Verificar token
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const usuario = await db.select().from(usuarios).where(eq(usuarios.id, decoded.id));

    if (usuario.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const { senha: _, ...usuarioSemSenha } = usuario[0];

    res.json(usuarioSemSenha);
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
});

export default router;
